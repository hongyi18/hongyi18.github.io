# A real Jekyll render of the activities component without optional site plugins.
# This complements, but does not replace, a full `bundle exec jekyll build`.
require 'jekyll'

root = File.expand_path('../..', __dir__)
destination = File.expand_path(ARGV.fetch(0))
config = Jekyll.configuration(
  'source' => root, 'destination' => destination,
  'theme' => nil, 'plugins' => [], 'disable_disk_cache' => true,
  'quiet' => true, 'exclude' => ['tests', 'docs', 'Gemfile', 'Gemfile.lock', 'minima.gemspec']
)
# Jekyll's deep merge retains file values when an override is nil.
config['theme'] = nil
config['plugins'] = []
site = Jekyll::Site.new(config)
site.reset
site.read
site.pages.select! { |page| ['activities.md', 'zh/activities.md'].include?(page.relative_path) }
abort 'Expected two activities pages' unless site.pages.length == 2
site.pages.each { |page| page.data['layout'] = nil }
site.posts.docs.clear
site.generate
site.render
site.write
puts "Rendered both activity components with Jekyll #{Jekyll::VERSION}: #{destination}"
