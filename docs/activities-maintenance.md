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

Subtype names, common link labels, filter names/order, section titles, status messages, and the shared Remote label are translated in `_data/activities_ui.yml`. Invited status and awards attached to other activities remain localized `distinction` text rather than new subtypes.

Common links use a `label` key from `link_labels`. For an unusual label, use explicit `en` and `zh` fields on the link instead of `label`. Keep a shared `url` in either case. Local PDFs use root-relative paths; related entries use `#existing-entry-id`. External links retain their full URLs.

## Highlights and optional flags

Set shared `highlight: true` to feature an existing entry. Supply `highlight_text` in both language blocks; optionally supply `highlight_title`. Without a title override, the ordinary title is used. Highlights use the same dates and ordering as the archive.

Set `has_slides: true` for entries with a slides/poster PDF and `remote: true` for online presentations. Omitted flags default to false. Changing a filter label does not change an entry's type.

## Behavior

Only the current calendar year's archive opens initially; if it is absent, none opens. Non-All filters expand all matching years; All restores the initial rule. Expand/collapse affects visible years. Highlight and related links reset the filter and reveal the target. History navigation clears a filter only when necessary to reveal the target. Without JavaScript, native disclosures and links work, while JavaScript-only controls are hidden.

## Checks

With the site's Ruby/Jekyll environment available:

```sh
ruby tests/activities/data_test.rb
ruby tests/activities/render_test.rb
bundle exec jekyll build
```

The Node browser checks require Playwright and an installed browser:

```sh
ACTIVITIES_BUILD=_site node --test tests/activities/browser.test.cjs
```

If Playwright is installed outside the project, set `PLAYWRIGHT_MODULE` to its module path. If needed, set `CHROME_PATH` to Chrome's executable. `ACTIVITIES_SCREENSHOTS` optionally enables desktop/mobile captures. No Node dependencies are required by the website itself.

When optional full-site gems are unavailable, `ruby tests/activities/build_component.rb /absolute/path/to/output` renders both activity components with real Jekyll, without the site layouts or optional plugins. Point the browser checks at that output. This is component validation, not a replacement for a full-site build.

Migration-only comparisons accept `ACTIVITIES_BASELINE` (a JSON content snapshot) for the data test and `ACTIVITIES_BASELINE_BUILD` (pre-migration rendered output) for the browser tests. These snapshots live outside the repository so routine updates do not require maintaining a second copy of all activity content.
