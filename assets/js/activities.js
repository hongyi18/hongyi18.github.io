/* Shared progressive enhancement for the English and Chinese activities pages. */
(function () {
  function initActivities(root) {
    if (root.hasAttribute('data-enhanced')) return;

    var entries = Array.from(root.querySelectorAll('.activity-entry'));
    var buttons = Array.from(root.querySelectorAll('[data-activity-filter]'));
    var years = Array.from(root.querySelectorAll('[data-year-section]'));
    var yearLinks = Array.from(root.querySelectorAll('[data-year-link]'));
    var status = root.querySelector('.activity-filter-status');
    var currentYear = String(new Date().getFullYear());

    function entryMatches(entry, filter) {
      if (filter === 'all') return true;
      if (filter === 'slides') return entry.dataset.hasSlides === 'true';
      return entry.dataset.type === filter;
    }

    function applyFilter(filter) {
      var visibleTotal = 0;
      entries.forEach(function (entry) {
        entry.hidden = !entryMatches(entry, filter);
        if (!entry.hidden) visibleTotal += 1;
      });

      years.forEach(function (year) {
        var visibleCount = year.querySelectorAll('.activity-entry:not([hidden])').length;
        year.hidden = visibleCount === 0;
        year.querySelector('[data-visible-year-count]').textContent = visibleCount;
        year.open = !year.hidden && (filter !== 'all' || year.dataset.yearSection === currentYear);
      });
      yearLinks.forEach(function (link) {
        var year = years.find(function (section) { return section.dataset.yearSection === link.dataset.yearLink; });
        link.hidden = !year || year.hidden;
      });
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.activityFilter === filter));
      });
      status.textContent = root.dataset.statusTemplate
        .replace('{visible}', visibleTotal).replace('{total}', entries.length);
    }

    function findTarget(hash) {
      if (!hash || hash === '#') return null;
      var id;
      try { id = decodeURIComponent(hash.slice(1)); }
      catch (_) { return null; }
      var target = document.getElementById(id);
      return target && root.contains(target) ? target : null;
    }

    function revealHashTarget() {
      var target = findTarget(window.location.hash);
      if (!target) return;
      var year = target.closest('.activity-year');
      if (!year) return;
      var entry = target.closest('.activity-entry');
      // History navigation must reveal targets hidden by an active filter.
      if (year.hidden || (entry && entry.hidden)) applyFilter('all');
      year.open = true;
      target.scrollIntoView();
    }

    buttons.forEach(function (button) {
      var count = entries.filter(function (entry) { return entryMatches(entry, button.dataset.activityFilter); }).length;
      button.querySelector('[data-filter-count]').textContent = '(' + count + ')';
      button.addEventListener('click', function () { applyFilter(button.dataset.activityFilter); });
    });

    root.querySelectorAll('[data-year-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        years.forEach(function (year) {
          if (!year.hidden) year.open = button.dataset.yearAction === 'expand';
        });
      });
    });

    root.querySelectorAll('.activity-highlight-card, .activity-entry-links a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        var target = findTarget(link.getAttribute('href'));
        if (!target) return;
        applyFilter('all');
        var year = target.closest('.activity-year');
        if (year) year.open = true;
      });
    });

    // Also reopen a collapsed year when its already-current fragment is clicked.
    yearLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var target = findTarget(link.getAttribute('href'));
        if (target && !target.hidden) target.open = true;
      });
    });

    window.addEventListener('hashchange', revealHashTarget);
    applyFilter('all');
    root.setAttribute('data-enhanced', '');
    revealHashTarget();
  }

  document.querySelectorAll('.activities-page').forEach(initActivities);
}());
