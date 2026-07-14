# Feed Load More and Project Documentation Design

## Scope

This change adds incremental display behavior to the existing REST API feed and creates a plain-language README for the Click Fit project.

## Feed behavior

The application will continue fetching the complete array from `https://api.restful-api.dev/objects`. It will initially render eight items and place a Load more button below the feed. Each click will reveal up to eight additional items. The button will be hidden when all fetched items are visible.

Refreshing the feed will fetch current data again and reset the visible count to eight. The status text will state how many objects were received and how many are currently displayed. A failed request will clear the cards and hide the Load more button.

The implementation will keep the fetched items and visible count inside `feeds.js`. Rendering will derive the visible cards from that state. The button will be added to the feed section in `index.htm` and use existing button styles where practical.

## Documentation

A new root-level `README.md` will explain the project in natural, direct language. It will include the live site link, features, technologies, local setup, database import, required environment variables, API endpoints, uploads, project structure, and basic VPS update steps.

The README will not use emojis, badges, decorative divider lines, or exposed credentials. The public site link will be `http://206.189.179.61`.

## Verification

Tests will confirm that the feed initially shows eight items, reveals the remaining items after Load more, resets after refresh, and hides the control after completion or failure. The public VPS URL will be checked separately before it is documented as available.
