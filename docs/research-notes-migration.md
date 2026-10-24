# Research notes migration — 24 October 2026

The three reference posts became ordinary research pages. Their Markdown bodies,
attachments, publication dates, and recorded revision histories are preserved.
The tools note's pre-existing uncommitted edits are included, not discarded.
Existing attachments keep their original URLs under `blog/`.

| Former URL | Current URL |
| --- | --- |
| `/2025/04/27/list-of-useful-research-tools.html` | `/research/resources/` |
| `/2025/05/30/reference-for-numerical-techniques.html` | `/research/computing/` |
| `/2025/07/13/reference-for-python-programming.html` | `/research/python/` |

The old URLs remain as HTML redirects, with canonical URLs and visible fallback
links. JavaScript preserves fragment identifiers. Redirects are excluded from the
sitemap; the new pages replace the posts in it. The notes no longer appear in
either blog listing or the Atom feed. English and Chinese research links and blog
descriptions are updated; the notes themselves remain English-only.

`research_note.html` reuses the existing page layout and adds a return link.
Post-style publication and revision dates are not shown with the notes. The
shared site footer remains unchanged. Existing date metadata remains available
for maintenance and sitemap generation; this move does not invent revision dates.

## Verification

- `ruby tests/research_notes_test.rb` checks new pages, hidden dates, both research entry
  points, exclusion from blog listings, and old-URL compatibility.
- A production build additionally checks the sitemap, Atom feed, attachments,
  preserved note bodies, and browser navigation through old URLs.
- The local rollback bundle records verification results and before/after hashes.

## Exact rollback

Starting Git commit: `982f3905f38bc791cd66d7c9f45d5034e7045dbb`.
Before this task, only `_posts/2025-04-27-list-of-useful-research-tools.md` had
uncommitted edits. Git's index, commits, and branch are not changed by this task.

Local rollback bundle (outside the website):
`C:/Users/hongyi18/Documents/Codex/2026-10-01/w/work/research-notes-migration-20261024/`.
It contains exact `before/` and `after/` file snapshots, `manifest.json` with SHA-256
hashes and the complete changed-file list, and `migration.patch` containing only
this task's changes relative to the initial working tree, including its unsaved
tools-note edits. This is safer than restoring files from the starting commit.

From the repository directory, first check whether the reverse patch still
applies, then apply it only if rollback is requested:

```powershell
git -c core.autocrlf=false apply --reverse --check -p2 C:/Users/hongyi18/Documents/Codex/2026-10-01/w/work/research-notes-migration-20261024/migration.patch
git -c core.autocrlf=false apply --reverse -p2 C:/Users/hongyi18/Documents/Codex/2026-10-01/w/work/research-notes-migration-20261024/migration.patch
```

The reverse patch restores all eight original files and removes only the ten
files created by this migration. If later edits prevent the check from passing,
merge against the snapshots instead of forcing a rollback. Do not use a hard
reset: that would risk the user's pre-existing or subsequent changes.
