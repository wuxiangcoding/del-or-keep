# Del or Keep

Del or Keep is a Manifest V3 Chrome extension that turns the new tab page into a lightweight bookmark review queue. It shows one bookmark saved at least 30 days ago and lets the user open, keep, or delete it with confirmation and undo.

## Development

```sh
pnpm install
pnpm verify
```

Build the unpacked extension:

```sh
pnpm build
```

Then load `extension/dist` from `chrome://extensions` with Developer mode enabled.

## Store Release Prep

Generate all local release artifacts:

```sh
pnpm release:prepare
```

This runs tests, builds the extension, regenerates Chrome Web Store image assets, validates asset dimensions, and creates:

- `extension/dist` for local unpacked testing.
- `store/assets/screenshots/*.png` for listing screenshots.
- `store/assets/promotional/*.png` for promotional tiles.
- `releases/del-or-keep-<version>.zip` for Chrome Web Store upload.
- `releases/del-or-keep-<version>.zip.sha256` for local integrity checks.

The release zip is intentionally ignored by git because it is a generated upload artifact.

## Privacy Posture

Bookmark titles, URLs, folder placement, and review state stay in Chrome APIs and `chrome.storage.local` on the user's device. The extension has no analytics, ads, accounts, remote code, or external network host permissions.

Before final submission, publish `store/privacy-policy.md` at a public URL and paste that URL into the Chrome Web Store privacy form.
