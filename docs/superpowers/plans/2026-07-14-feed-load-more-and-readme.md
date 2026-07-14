# Feed Load More and README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an eight-item Load more flow to the REST feed and document the project and live VPS site in a natural README.

**Architecture:** Keep the API request in `feeds.js`, store the fetched items and visible count in module state, and derive each render from that state. Add a single feed control to `index.htm`; test the pagination calculations with Node's built-in test runner. Document the existing application without adding deployment behavior.

**Tech Stack:** JavaScript ES modules, jQuery, Node.js built-in test runner, Markdown

---

### Task 1: Feed pagination behavior

**Files:**
- Modify: `package.json`
- Modify: `index.htm`
- Modify: `js/feeds.js`
- Create: `test/feeds.test.js`

- [ ] **Step 1: Write failing pagination tests**

Create `test/feeds.test.js` using `node:test` and `node:assert/strict`. Test that `getVisibleFeedItems(items, 8)` returns the first eight of thirteen items, and that `getNextVisibleCount(8, 13)` returns 13 while `getNextVisibleCount(13, 13)` remains 13.

- [ ] **Step 2: Run the tests and verify RED**

Run `node --test test/feeds.test.js`. Expected: failure because the pagination exports do not exist.

- [ ] **Step 3: Implement pagination state and rendering**

In `js/feeds.js`, export `FEED_PAGE_SIZE`, `getVisibleFeedItems`, and `getNextVisibleCount`. Store `feedItems` and `visibleCount`; render only the visible slice, update the received/displayed status, and toggle `#loadMoreFeed`. Reset state on every successful refresh, advance it on Load more, and hide the control during loading or failure.

- [ ] **Step 4: Add the feed control**

Add `<button id="loadMoreFeed" type="button" class="btn btn-ink mt-4" hidden>Load more</button>` immediately after `#apiContent` in `index.htm`.

- [ ] **Step 5: Enable and run the test suite**

Change the package test script to `node --test`, run `npm test`, and expect all pagination tests to pass.

### Task 2: Project README and live-link verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Verify the public deployment**

Run a bounded HTTP request against `http://206.189.179.61/api/health`. Expected: HTTP 200 with the Click Fit health JSON.

- [ ] **Step 2: Write the README**

Create a direct, plain-language README containing: project overview, live link, features, technologies, local installation, `.env` variable names, `database.sql` import, run commands, API routes, upload rules, project structure, and VPS update commands. Do not include secrets, emojis, badges, or decorative separator lines.

- [ ] **Step 3: Verify documentation and project checks**

Run `npm test`, `node --check server.js`, and scan `README.md` for the public IP and accidental credential values. Expected: tests and syntax pass; the README contains the live URL and only environment variable names/placeholders.

### Task 3: Final review

**Files:**
- Review: `README.md`
- Review: `index.htm`
- Review: `js/feeds.js`
- Review: `test/feeds.test.js`

- [ ] **Step 1: Review the diff against the approved design**

Confirm the initial count is eight, Load more reveals up to eight, refresh resets, completion and failure hide the button, status reports received/displayed counts, and README tone matches the request.

- [ ] **Step 2: Run final verification**

Run `npm test` and `node --check server.js`. Expected: zero failures and exit code 0.
