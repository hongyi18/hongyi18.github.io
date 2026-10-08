# Run: ruby tests/footer_test.rb
require 'minitest/autorun'
require 'jekyll'

class FooterTest < Minitest::Test
  ROOT = File.expand_path('..', __dir__)

  def test_shared_head_has_no_favicon_links_in_both_languages
    config = Jekyll.configuration('source' => ROOT, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    config['baseurl'] = '/example'
    site = Jekyll::Site.new(config)
    site.reset
    site.read
    # Exercise the shared head extension without requiring optional SEO plugins.
    site.layouts.fetch('default').content = '<head>{% include custom-head.html %}</head>{{ content }}'
    site.pages.select! { |page| ['index.md', 'zh/index.md'].include?(page.relative_path) }
    site.posts.docs.clear
    site.render
    assert_equal 2, site.pages.length
    site.pages.each do |page|
      refute_match(/<link[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"/, page.output)
      assert_includes page.output, 'window.MathJax'
    end
  end

  def test_auto_discovered_favicon_files_are_removed
    refute File.exist?(File.join(ROOT, 'favicon.ico'))
    refute File.exist?(File.join(ROOT, 'apple-touch-icon.png'))
  end

  def test_footer_has_no_image_and_retains_localized_text
    config = Jekyll.configuration('source' => ROOT, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    config['baseurl'] = '/example'
    config['time'] = Time.utc(2026, 10, 8)
    site = Jekyll::Site.new(config)
    site.reset
    site.read
    site.layouts.fetch('default').content = '{% include footer.html %}'
    site.pages.select! { |page| ['index.md', 'zh/index.md'].include?(page.relative_path) }
    site.posts.docs.clear
    site.render
    assert_equal 2, site.pages.length
    site.pages.each do |page|
      refute_match(/<img\b/, page.output)
      if page.data['lang'] == 'zh-Hans'
        assert_includes page.output, '&copy; 2026 张闳一'
        assert_includes page.output, '李政道研究所 理论宇宙学和天体粒子物理'
      else
        assert_includes page.output, '&copy; 2026 Hong-Yi Zhang'
        assert_includes page.output, 'Theoretical Cosmology and Astroparticle Physics at Tsung-Dao Lee Institute'
      end
    end
  end
end
