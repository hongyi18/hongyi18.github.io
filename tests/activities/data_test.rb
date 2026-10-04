# Run: ruby tests/activities/data_test.rb
require 'minitest/autorun'
require 'yaml'
require 'date'
require 'json'

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
      assert_includes %w[paper tool talk media outreach recognition], item.fetch('type')
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
          assert File.file?(File.join(ROOT, url.delete_prefix('/'))), "Missing local file: #{url}"
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

  def test_ties_have_unambiguous_order
    @items.group_by { |item| item.fetch('date') }.each_value do |items|
      next if items.length == 1
      orders = items.map { |item| item.fetch('tie_order') }
      assert_equal orders.uniq, orders
      orders.each { |order| assert_kind_of Integer, order }
    end
  end

  def test_migration_preserves_every_field
    path = ENV['ACTIVITIES_BASELINE']
    skip 'Migration-only snapshot not supplied' unless path
    baseline = JSON.parse(File.read(path))
    %w[en zh].each do |lang|
      actual = @items.sort_by { |item| item.fetch('date') }.reverse
        .group_by { |item| item.fetch('date') }.values.flat_map { |items| items.sort_by { |item| item.fetch('tie_order', 0) } }
        .map do |item|
          record = item.slice('id', 'date', 'type', 'has_slides', 'remote', 'highlight')
          record.merge!(item.fetch(lang))
          record['subtype'] = @ui.fetch(lang).fetch('subtypes').fetch(item.fetch('subtype'))
          record['highlight_title'] ||= record['title'] if item['highlight']
          if item['links']
            record['links'] = item['links'].map do |link|
              { 'url' => link['url'], 'label' => link[lang] || @ui.fetch(lang).fetch('link_labels').fetch(link.fetch('label')) }
            end
          end
          record
        end
      assert_equal baseline.fetch(lang), actual, "Content changed in #{lang}"
    end
  end
end
