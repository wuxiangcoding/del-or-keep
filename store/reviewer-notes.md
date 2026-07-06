# Reviewer Notes

Del or Keep is a Manifest V3 extension with one purpose: help users review old Chrome bookmarks from the new tab page.

Testing steps:

1. Load the unpacked extension from `extension/dist`.
2. Make sure the Chrome profile has at least one bookmark older than 30 days.
3. Open a new tab.
4. The extension shows one old bookmark with Open, Keep, and Delete actions.
5. Open launches the bookmark in a new tab.
6. Keep marks the bookmark as reviewed in local extension storage.
7. Delete first shows a confirmation state, then removes the bookmark only after confirmation.
8. Undo restores the recently deleted bookmark while the user continues reviewing.

Permission explanations:

- `bookmarks` is required to read bookmarks, delete only user-confirmed bookmarks, and restore a recently deleted bookmark when undo is used.
- `storage` is required to keep local review queue state.

The extension does not request host permissions. It has no analytics, ads, accounts, remote code, or external network calls.
