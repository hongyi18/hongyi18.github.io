# Keep revision history as the single source for SEO and sitemap update dates.
require 'date'

Jekyll::Hooks.register :site, :post_read do |site|
  documents = site.pages + site.collections.values.flat_map(&:docs)
  documents.each do |document|
    history = Array(document.data['modified_dates'])
    next if history.empty?

    document.data['last_modified_at'] = history.map { |date| Date.iso8601(date.to_s) }.max.iso8601
  end
end
