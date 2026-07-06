# Chrome Web Store Listing Copy

## Name

Del or Keep

## Short Description

Review one old bookmark every time you open a new tab.

## Category

Productivity

## Single Purpose

Del or Keep helps users review and clean up old Chrome bookmarks from the new tab page.

## Detailed Description

Del or Keep turns each new tab into a small bookmark cleanup decision.

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
- No external network host permissions.
- Bookmark review state stays in `chrome.storage.local`.

## Permission Justifications

`bookmarks`: Required to read the user's Chrome bookmarks, show old bookmarks in the review queue, delete a bookmark only after confirmation, and restore a recently deleted bookmark when undo is used.

`storage`: Required to store local review state, including which bookmark IDs have been shown, kept, deleted, restored, or expired from the queue.

## Privacy Questionnaire Notes

Do not claim the extension has no user data just because the data stays local. The extension processes bookmark titles, URLs, folder placement, and bookmark timestamps on the user's device. The correct disclosure should make clear that this data is not sold, transferred, used for ads, used for creditworthiness, or sent to the developer or third-party servers.

## Suggested Support URL

Choose a public support URL before submission. Because the repository is private, do not use a private GitHub URL in the store listing.
