# Maintaining the activities pages

Edit activity content in `_data/activities.yml`. Shared facts and links appear once; English and Chinese text appear next to each other. The two page files contain only page metadata and the shared include call.

## Adding or editing an entry

Use the same field order as neighboring entries and keep a blank line between records. Place entries under their year comment in descending date order. A typical record is:

```yaml
- id: "talk-2027-03-example"
  date: "2027-03"
  type: "talk"
  subtype: "seminar"
  en:
    display_date: "Mar 2027"
    title: "Example seminar title"
    organization: "Seminar"
    host: "Example University"
    location: "City, Country"
  zh:
    display_date: "2027年3月"
    title: "示例报告标题"
    organization: "研讨会"
    host: "示例大学"
    location: "国家，城市"
  links:
    - label: "event"
      url: "https://example.org/seminar"
```

- Keep `id` unique and stable. Existing links use it as an anchor; do not rename old IDs when changing titles or classifications.
- Quote dates: `"2027"`, `"2027-03"`, or `"2027-03-12"`. Never invent a month or day. The archive year comes from the date; there is no separate `year` field.
- `display_date` preserves the displayed wording and any ranges. English uses day–month–year for known full dates. A displayed grant period can differ from its archive date; preserve that distinction.
- Entries sort by descending date. If several have exactly the same date, give them distinct integer `tie_order` values (1, 2, 3), in their intended displayed order. A year/month-only date naturally follows full dates within that month.
- `organization` is the primary description segment, not necessarily an institution: it can describe an event, journal, package, or activity. Optional segments follow in this order: `host`, `location`, shared `remote` label, `note`, `distinction`. Separators are supplied by the template; do not add bullets to the fields.
- Keep plain text in display fields; the renderer escapes HTML characters. Put URLs in `links`, not descriptions.

## Types, subtypes, and labels

Shared canonical keys are independent of the displayed translations:

| Type | Current subtypes |
| --- | --- |
| `paper` | `paper`, `thesis` |
| `tool` | `software` |
| `talk` | `seminar`, `colloquium`, `conference_talk`, `poster` |
| `media` | `media_coverage` |
| `outreach` | `video`, `public_talk` |
| `recognition` | `honor`, `grant`, `fellowship`, `award`, `scholarship` |
| `music` | `concert`, `music_salon` |

Subtype names, common link labels, filter names/order, section titles, status messages, and the shared Remote label are translated in `_data/activities_ui.yml`. Invited status and awards attached to other activities remain localized `distinction` text rather than new subtypes.

Common links use a `label` key from `link_labels`. For an unusual label, use explicit `en` and `zh` fields on the link instead of `label`. Keep a shared `url` in either case. Local files and blog posts use root-relative paths; related entries use `#existing-entry-id`. External links retain their full URLs.

## Highlights and optional flags

Set shared `highlight: true` to feature an existing entry. Supply `highlight_text` in both language blocks; optionally supply `highlight_title`. Without a title override, the ordinary title is used. Highlights use the same dates and ordering as the archive.

Set `has_slides: true` for entries with a slides/poster PDF and `remote: true` for online presentations. Omitted flags default to false. Changing a filter label does not change an entry's type.

## Behavior

Only the current calendar year's archive opens initially; if it is absent, none opens. Non-All filters expand all matching years; All restores the initial rule. Expand/collapse affects visible years. Highlight and related links reset the filter and reveal the target. History navigation clears a filter only when necessary to reveal the target. Without JavaScript, native disclosures and links work, while JavaScript-only controls are hidden.

Links such as `/activities/#filter-music` (or `/zh/activities/#filter-music`) open the archive with that filter selected. Use these to link from the personal pages to the complete music history.

## Checks

The tests check current data and behavior, not snapshots of old content. With the site's Ruby/Jekyll environment available, run all fast Ruby checks from the repository root:

```sh
ruby -e 'Dir.glob("tests/**/*_test.rb").sort.each { |file| require_relative file }'
bundle exec jekyll build
```

These validate activity records, translations, local links, date ordering, HTML escaping, URL prefixes, blog dates, and shared footer assets. You can also run an individual `*_test.rb` file when working on one area.

The Node browser checks require Playwright and an installed browser:

```sh
ACTIVITIES_BUILD=_site node --test tests/activities/browser.test.cjs
```

If Playwright is installed outside the project, set `PLAYWRIGHT_MODULE` to its module path. If needed, set `CHROME_PATH` to Chrome's executable. The browser checks cover filtering, current-year expansion, deep links, browser history, the no-JavaScript fallback, and desktop/mobile overflow in both languages. Set `ACTIVITIES_SCREENSHOTS` to a directory to also save captures; layout checks run even without captures. No Node dependencies are required by the website itself.

When optional full-site gems are unavailable, `ruby tests/activities/build_component.rb /absolute/path/to/output` renders both activity components with real Jekyll, without the site layouts or optional plugins. Point the browser checks at that output. This is component validation, not a replacement for a full-site build.

Normal content updates should not require editing tests: browser expectations use the current entries and archive years, and blog/footer checks use the current dates and configuration. Update tests when the intended behavior changes. Tests are run manually; the deployment workflow does not currently run them.
