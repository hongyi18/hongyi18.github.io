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
    site.pages.each { |page| page.data['layout'] = nil }
    site.render
    assert_equal 2, site.pages.length
    site.pages.each do |page|
      html = page.output
      assert_includes html, 'A &amp; B &lt;test&gt; &quot;quoted&quot;'
      assert_includes html, '&lt;img src=x onerror=alert(1)&gt;'
      refute_includes html, '<img src=x onerror=alert(1)>'
      assert_includes html, 'href="/example/assets/css/activities.css"'
      assert_includes html, 'src="/example/assets/js/activities.js"'
      assert_includes html, 'href="/example/activities/'
    end
  end
end
