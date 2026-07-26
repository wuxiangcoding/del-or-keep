# Del or Keep Privacy Policy

Effective date: 2026-07-07

Del or Keep is a Chrome extension that helps users review and clean up old bookmarks from the Chrome new tab page.

## Data Processed

Del or Keep uses the Chrome Bookmarks API to process:

- Bookmark titles.
- Bookmark URLs.
- Bookmark folder IDs and positions.
- Bookmark creation timestamps.

Del or Keep also stores local review metadata, including whether a bookmark has been shown, kept, deleted, or restored.

## How Data Is Used

This data is used only to:

- Select bookmarks saved at least 30 days ago.
- Show one bookmark in the new tab review queue.
- Track which bookmarks have already been reviewed.
- Delete a bookmark when the user confirms deletion.
- Restore a recently deleted bookmark when the user chooses undo.

Del or Keep also requests Bing homepage image metadata and image assets to show a daily background on the new tab page.

## Storage and Transfer

Del or Keep stores review metadata in `chrome.storage.local` on the user's device.

Del or Keep does not send bookmark data, review metadata, or any other user data to the developer or to third-party servers.

The extension requests Bing homepage image metadata and image assets from `https://www.bing.com/*` for the new tab background. Bookmark titles, bookmark URLs, bookmark folder information, and review metadata are not included in that request. Microsoft/Bing may receive ordinary web request metadata such as IP address, user agent, and request time.

Del or Keep does not use analytics, advertising SDKs, accounts, or remote code.

## Data Sharing

Del or Keep does not sell, rent, share, or transfer bookmark data or review metadata.

Information received from Chrome APIs is used only for the extension's single purpose and in accordance with the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Retention and Deletion

Review metadata remains in Chrome local extension storage until the user removes the extension or clears the extension's local data.

Bookmark deletion is controlled by the user. Del or Keep asks for confirmation before deleting a bookmark and offers undo for a recent delete while the user continues reviewing.

## Contact

For privacy questions, contact the publisher through the Chrome Web Store support channel or the public support URL listed on the Chrome Web Store item.

For security issues, do not post exploit details publicly. Follow the reporting guidance in the project's `SECURITY.md`.
