# Run: ruby tests/activities/data_test.rb
require 'minitest/autorun'
require 'yaml'
require 'date'
require 'jekyll'

class ActivitiesDataTest < Minitest::Test
  ROOT = File.expand_path('../..', __dir__)

  def setup
    assert File.file?(File.join(ROOT, '_data/activities.yml')), 'Shared activities dataset is missing'
    assert File.file?(File.join(ROOT, '_data/activities_ui.yml')), 'Shared UI translations are missing'
    @items = YAML.safe_load_file(File.join(ROOT, '_data/activities.yml'))
    @ui = YAML.safe_load_file(File.join(ROOT, '_data/activities_ui.yml'))
  end

  def test_valid_records_and_translations
    assert_kind_of Array, @items
    refute_empty @items
    ids = @items.map { |item| item.fetch('id') }
    assert_equal ids.uniq, ids, 'Duplicate activity anchors'
    @items.each do |item|
      date = item.fetch('date')
      assert_kind_of String, date
      assert_match(/\A\d{4}(?:-\d{2}(?:-\d{2})?)?\z/, date)
      Date.iso8601(date.length == 4 ? "#{date}-01-01" : date.length == 7 ? "#{date}-01" : date)
      assert_includes %w[paper tool talk media outreach recognition music], item.fetch('type')
      %w[en zh].each do |lang|
        text = item.fetch(lang)
        %w[title organization display_date].each { |key| refute_empty text.fetch(key) }
        assert @ui.fetch(lang).fetch('subtypes').key?(item.fetch('subtype'))
        if item['highlight']
          refute_empty text.fetch('highlight_text')
        end
      end
      %w[highlight has_slides remote].each do |flag|
        assert_includes [true, false], item[flag] if item.key?(flag)
      end
      Array(item['links']).each do |link|
        url = link.fetch('url')
        if url.start_with?('#')
          assert_includes ids, url.delete_prefix('#'), 'Broken related-entry anchor'
        elsif url.start_with?('/')
          assert File.file?(File.join(ROOT, url.delete_prefix('/'))) || post_urls.include?(url), "Missing local file or post: #{url}"
        else
          assert_match(/\Ahttps?:\/\//, url)
        end
        %w[en zh].each do |lang|
          assert(link[lang] || @ui.fetch(lang).fetch('link_labels').key?(link.fetch('label')))
        end
      end
      if item['has_slides']
        assert Array(item['links']).any? { |link| link['url'].match?(/\.pdf(?:\?|$)/i) }, 'Slides flag without a PDF'
      end
    end
  end

  def post_urls
    @post_urls ||= begin
      config = Jekyll.configuration('source' => ROOT, 'quiet' => true, 'disable_disk_cache' => true)
      config['theme'] = nil
      config['plugins'] = []
      site = Jekyll::Site.new(config)
      site.reset
      site.read
      site.posts.docs.map(&:url)
    end
  end

  def test_ties_have_unambiguous_order
    @items.group_by { |item| item.fetch('date') }.each_value do |items|
      next if items.length == 1
      orders = items.map { |item| item.fetch('tie_order') }
      assert_equal orders.uniq, orders
      orders.each { |order| assert_kind_of Integer, order }
    end
  end

end
