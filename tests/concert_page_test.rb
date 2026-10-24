# Run: ruby tests/concert_page_test.rb
require 'minitest/autorun'
require 'jekyll'

class ConcertPageTest < Minitest::Test
  URL = '/personal/the-plum-blossom-on-snow/'
  OLD_URL = '/2023/01/08/the-plum-blossom-on-snow.html'

  def setup
    root = File.expand_path('..', __dir__)
    config = Jekyll.configuration('source' => root, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    @site = Jekyll::Site.new(config)
    @site.reset
    @site.read
    @site.layouts.fetch('default').content = '{{ content }}'
    urls = [URL, OLD_URL] + %w[/personal/ /zh/personal/ /activities/ /zh/activities/ /blog/ /zh/blog/]
    @site.pages.select! { |page| urls.include?(page.url) }
    @site.render
  end

  def test_concert_is_a_page_with_the_event_date_and_preserved_materials
    page = @site.pages.find { |entry| entry.url == URL }
    refute_nil page, 'Missing concert subpage'
    assert_equal 'page', page.data.fetch('layout')
    assert_equal 'en', page.data.fetch('lang')
    assert_includes page.output, 'The Plum Blossom on Snow'
    assert_includes page.output, '5 pm, 8 Jan 2023'
    assert_includes page.output, '/blog/2023-01-08/post.png'
    assert_includes page.output, 'Translated/adapted by Xia Liu.'
    assert_includes page.output, 'Back to Personal'
    assert_includes page.output, 'href="/personal/"'
    refute_includes page.output, 'class="post-meta"'
  end

  def test_existing_url_redirects_and_concert_is_no_longer_a_post
    redirect = @site.pages.find { |page| page.url == OLD_URL }
    refute_nil redirect, 'Missing compatibility redirect'
    assert_equal false, redirect.data.fetch('sitemap')
    assert_includes redirect.output, "href=\"#{@site.config.fetch('url')}#{URL}\""
    assert_includes redirect.output, "content=\"0; url=#{URL}\""
    assert_includes redirect.output, 'window.location.hash'
    assert_includes redirect.output, "href=\"#{URL}\""
    refute @site.posts.docs.any? { |post| post.url == OLD_URL }
    @site.pages.select { |page| %w[/blog/ /zh/blog/].include?(page.url) }.each do |blog|
      refute_includes blog.output, "href=\"#{OLD_URL}\""
      refute_includes blog.output, "href=\"#{URL}\""
    end
  end

  def test_personal_and_activity_pages_link_directly_to_the_program
    %w[/personal/ /zh/personal/ /activities/ /zh/activities/].each do |url|
      page = @site.pages.find { |entry| entry.url == url }
      assert_includes page.output, "href=\"#{URL}\""
      refute_includes page.output, "href=\"#{OLD_URL}\""
    end
  end
end
