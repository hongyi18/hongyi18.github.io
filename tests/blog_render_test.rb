# Run: ruby tests/blog_render_test.rb
require 'minitest/autorun'
require 'jekyll'

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
    assert_includes chinese.output, '>博客</h1>'
    assert_match(/\d{4}年\d{1,2}月\d{1,2}日/, chinese.output)
    assert_includes chinese.output, '<a href="/blog/">English</a> | 中文'
    assert_includes english.output, 'English | <a href="/zh/blog/">中文</a>'
    assert_includes chinese.output, 'class="page-link" href="/zh/blog/">博客</a>'

    post_links = ->(page) { page.output.scan(/class="post-link" href="([^"]+)"/) }
    refute_empty post_links.call(chinese)
    assert_equal site.posts.docs.length, post_links.call(chinese).length
    assert_equal post_links.call(english), post_links.call(chinese)
    assert_match(/13 Jul 2025/, english.output)
    python_post = site.posts.docs.find { |post| post.data['title'] == 'Reference for Python programming' }
    assert_match(/13 Jul 2025/, python_post.output)
    assert_match(/14 May 2026/, python_post.output)
  end
end
