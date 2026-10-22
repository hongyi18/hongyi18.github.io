# Tests the actual shared Liquid template with controlled content and base URL.
require 'minitest/autorun'
require 'jekyll'

class ActivitiesRenderTest < Minitest::Test
  def test_text_is_escaped_and_assets_respect_baseurl
    root = File.expand_path('../..', __dir__)
    config = Jekyll.configuration('source' => root, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    config['baseurl'] = '/example'
    site = Jekyll::Site.new(config)
    site.reset
    site.read
    site.posts.docs.clear
    site.pages.select! { |page| ['activities.md', 'zh/activities.md'].include?(page.relative_path) }
    %w[en zh].each do |lang|
      site.data['activities'].first[lang]['title'] = 'A & B <test> "quoted"'
      site.data['activities'].first[lang]['organization'] = '<img src=x onerror=alert(1)>'
    end
    # Controlled links test URL handling without depending on a particular event.
    site.data['activities'].first['links'] = [
      { 'label' => 'slides', 'url' => '/activities/example.pdf' },
      { 'label' => 'event', 'url' => '/example-post/' }
    ]
    site.pages.each { |page| page.data['layout'] = nil }
    site.render
    assert_equal 2, site.pages.length
    expected_ids = site.data['activities']
      .sort_by { |item| item.fetch('date') }.reverse
      .group_by { |item| item.fetch('date') }.values
      .flat_map { |items| items.sort_by { |item| item.fetch('tie_order', 0) } }
      .map { |item| item.fetch('id') }
    site.pages.each do |page|
      html = page.output
      assert_equal expected_ids, html.scan(/<article id="([^"]+)" class="activity-entry"/).flatten,
        'Each activity must render once, in date/tie order'
      assert_includes html, 'A &amp; B &lt;test&gt; &quot;quoted&quot;'
      assert_includes html, '&lt;img src=x onerror=alert(1)&gt;'
      refute_includes html, '<img src=x onerror=alert(1)>'
      assert_includes html, 'href="/example/assets/css/activities.css"'
      assert_includes html, 'src="/example/assets/js/activities.js"'
      assert_includes html, 'href="/example/activities/example.pdf"'
      assert_includes html, 'href="/example/example-post/"'
    end
  end
end
