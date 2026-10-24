# Run: ruby tests/research_notes_test.rb
require 'minitest/autorun'
require 'jekyll'

class ResearchNotesTest < Minitest::Test
  NOTES = {
    '/research/resources/' => '/2025/04/27/list-of-useful-research-tools.html',
    '/research/computing/' => '/2025/05/30/reference-for-numerical-techniques.html',
    '/research/python/' => '/2025/07/13/reference-for-python-programming.html'
  }.freeze

  def setup
    root = File.expand_path('..', __dir__)
    config = Jekyll.configuration('source' => root, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    @site = Jekyll::Site.new(config)
    @site.reset
    @site.read
    @site.layouts.fetch('default').content = '{{ content }}'
    urls = NOTES.keys + NOTES.values + %w[/research/ /zh/research/ /blog/ /zh/blog/]
    @site.pages.select! { |page| urls.include?(page.url) }
    @site.render
  end

  def test_notes_are_pages_without_visible_dates_and_with_a_return_link
    NOTES.each_key do |url|
      note = @site.pages.find { |page| page.url == url }
      refute_nil note, "Missing research note: #{url}"
      assert_equal 'research_note', note.data.fetch('layout')
      assert_equal 'en', note.data.fetch('lang')
      assert_includes note.output, 'href="/research/">'
      assert_includes note.output, 'Back to Research'
      refute_includes note.output, 'class="post-meta"'
      refute_includes note.output, 'Last updated:'
      refute_includes note.output, 'First published:'
    end
  end

  def test_old_urls_redirect_without_entering_the_sitemap_or_blog
    NOTES.each do |url, old_url|
      redirect = @site.pages.find { |page| page.url == old_url }
      refute_nil redirect, "Missing compatibility redirect: #{old_url}"
      assert_equal false, redirect.data.fetch('sitemap')
      assert_includes redirect.output, 'http-equiv="refresh"'
      assert_includes redirect.output, "href=\"#{@site.config.fetch('url')}#{url}\""
      assert_includes redirect.output, 'window.location.hash'
      assert_includes redirect.output, "href=\"#{url}\""
      refute @site.posts.docs.any? { |post| post.url == old_url }
      @site.pages.select { |page| %w[/blog/ /zh/blog/].include?(page.url) }.each do |blog|
        refute_includes blog.output, "href=\"#{old_url}\""
        refute_includes blog.output, "href=\"#{url}\""
      end
    end
  end

  def test_both_research_pages_link_to_each_note
    %w[/research/ /zh/research/].each do |url|
      research = @site.pages.find { |page| page.url == url }
      NOTES.each_key { |note_url| assert_includes research.output, "href=\"#{note_url}\"" }
    end
  end
end
