# Run: ruby tests/blog_render_test.rb
require 'minitest/autorun'
require 'jekyll'
require 'time'
require 'cgi'

class BlogRenderTest < Minitest::Test
  def test_chinese_blog_reuses_posts_with_localized_navigation_and_dates
    root = File.expand_path('..', __dir__)
    config = Jekyll.configuration('source' => root, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    site = Jekyll::Site.new(config)
    site.reset
    site.read
    chinese = site.pages.find { |page| page.relative_path == 'zh/blog.md' }
    refute_nil chinese, 'Chinese blog page is missing'
    english = site.pages.find { |page| page.relative_path == 'blog.md' }
    # Render the actual blog layout and header without optional SEO plugins.
    site.layouts.fetch('default').content = '{{ content }}{% include header.html %}'
    site.pages.select! { |page| [english, chinese].include?(page) }
    site.render

    assert_equal '/zh/blog/', chinese.url
    assert_equal 'zh-Hans', chinese.data.fetch('lang')
    assert_includes chinese.output, ">#{CGI.escapeHTML(chinese.data.fetch('title'))}</h1>"
    assert_match(/\d{4}年\d{1,2}月\d{1,2}日/, chinese.output)
    assert_includes chinese.output, '<a href="/blog/">English</a> | 中文'
    assert_includes english.output, 'English | <a href="/zh/blog/">中文</a>'
    nav_title = chinese.data['nav_title'] || chinese.data.fetch('title')
    assert_includes chinese.output, "class=\"page-link\" href=\"#{chinese.url}\">#{CGI.escapeHTML(nav_title)}</a>"

    post_links = ->(page) { page.output.scan(/class="post-link" href="([^"]+)"/) }
    refute_empty post_links.call(chinese)
    assert_equal site.posts.docs.length, post_links.call(chinese).length
    assert_equal post_links.call(english), post_links.call(chinese)
    site.posts.docs.each do |post|
      date = post.data.fetch('published_date')
      english_date = Time.parse(date.to_s).strftime(site.config.fetch('minima').fetch('date_format'))
      chinese_date = Time.parse(date.to_s).strftime('%Y年%-m月%-d日')
      assert_includes english.output, english_date
      assert_includes chinese.output, chinese_date
      assert_includes post.output, english_date
      Array(post.data['modified_dates']).each do |modified|
        assert_includes post.output, Time.parse(modified.to_s).strftime(site.config.fetch('minima').fetch('date_format'))
      end
    end
  end
end
