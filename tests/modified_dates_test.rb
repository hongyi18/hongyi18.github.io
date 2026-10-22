# Run: ruby tests/modified_dates_test.rb
require 'minitest/autorun'
require 'jekyll'
require 'date'

class ModifiedDatesTest < Minitest::Test
  def setup
    root = File.expand_path('..', __dir__)
    config = Jekyll.configuration('source' => root, 'quiet' => true, 'disable_disk_cache' => true)
    config['theme'] = nil
    config['plugins'] = []
    @site = Jekyll::Site.new(config)
    @site.reset
    @site.read
    @post = @site.posts.docs.first
  end

  def test_latest_revision_is_derived_without_changing_history_or_publication
    history = ['2028-05-04', Date.new(2027, 12, 1), '2028-01-02']
    published = @post.data.fetch('published_date')
    @post.data['modified_dates'] = history.dup
    @post.data['last_modified_at'] = '2020-01-01'
    Jekyll::Hooks.trigger :site, :post_read, @site

    assert_equal '2028-05-04', @post.data['last_modified_at']
    assert_equal history, @post.data['modified_dates']
    assert_equal published, @post.data['published_date']
  end

  def test_no_revision_history_leaves_the_normal_date_fallback
    [nil, []].each do |history|
      @post.data['modified_dates'] = history
      @post.data.delete('last_modified_at')
      Jekyll::Hooks.trigger :site, :post_read, @site
      refute @post.data.key?('last_modified_at')
    end
  end
end
