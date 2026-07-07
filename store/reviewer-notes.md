# Reviewer Notes

Del or Keep is a Manifest V3 extension with one purpose: turn the new tab page into a focused old-bookmark review workspace.

Testing steps:

1. Load the unpacked extension from `extension/dist`.
2. Make sure the Chrome profile has at least one bookmark older than 30 days.
3. Open a new tab.
4. The extension shows one old bookmark with Open, Keep, and Delete actions, with a Bing daily image as the page background when the image request succeeds.
5. Open launches the bookmark in a new tab.
6. Keep marks the bookmark as reviewed in local extension storage.
7. Delete first shows a confirmation state, then removes the bookmark only after confirmation.
8. Undo restores the recently deleted bookmark while the user continues reviewing.

Permission explanations:

- `bookmarks` is required to read bookmarks, delete only user-confirmed bookmarks, and restore a recently deleted bookmark when undo is used.
- `storage` is required to keep local review queue state.
- `https://www.bing.com/*` is required to fetch Bing homepage image metadata and image assets for the new tab background.

The Bing request is only for the visual new tab background. Bookmark titles, URLs, folder placement, and review state are not sent to Bing. The review queue still works if the image request fails. The extension has no analytics, ads, accounts, or remote code.
