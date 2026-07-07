# Chrome Web Store Listing Copy

## Name

Del or Keep

## Short Description

Review one old bookmark every time you open a new tab.

## Category

Productivity

## Single Purpose

Del or Keep turns the Chrome new tab page into a focused old-bookmark review workspace.

## Detailed Description

Del or Keep turns each new tab into a small bookmark cleanup decision, set against a daily Bing homepage image background.

The extension picks one bookmark saved at least 30 days ago and shows its title, URL, age, seen count, and queue status. From there you can:

- Open the bookmark in a new tab before deciding.
- Keep it and remove it from the review queue.
- Delete it after confirmation.
- Undo a recent delete while you keep reviewing.

The review queue is intentionally local and low pressure. Ignored items rotate through the queue, and items you keep or delete are marked as reviewed in local Chrome storage.

Privacy posture:

- No account.
- No ads.
- No analytics.
- No remote code.
- Bookmark review state stays in `chrome.storage.local`.
- The only external request is to Bing for the daily new tab background image. Bookmark data is not sent with that request.

## Permission Justifications

`bookmarks`: Required to read the user's Chrome bookmarks, show old bookmarks in the review queue, delete a bookmark only after confirmation, and restore a recently deleted bookmark when undo is used.

`storage`: Required to store local review state, including which bookmark IDs have been shown, kept, deleted, restored, or expired from the queue.

`https://www.bing.com/*`: Required to request Bing homepage image metadata and image assets for the new tab background. This request is only for the visual background. Bookmark titles, URLs, folder placement, and review state are not sent to Bing, and the bookmark review queue still works if the image request fails.

## Privacy Questionnaire Notes

Do not claim the extension has no user data just because bookmark data stays local. The extension processes bookmark titles, URLs, folder placement, and bookmark timestamps on the user's device. The correct disclosure should make clear that this bookmark data is not sold, transferred, used for ads, used for creditworthiness, or sent to the developer or third-party servers.

Also disclose the Bing background request separately: the extension requests Bing homepage image metadata and image assets to render the new tab background. No bookmark data or review metadata is included in that request.

## Suggested Support URL

Choose a public support URL before submission. Because the repository is private, do not use a private GitHub URL in the store listing.
