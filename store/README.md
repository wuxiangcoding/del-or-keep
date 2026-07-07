# Chrome Web Store Release Checklist

This folder contains the material needed before the final Chrome Web Store dashboard submission. The final submit action is still manual and intentionally not automated.

## Generated Assets

Run:

```sh
pnpm release:prepare
```

Generated image assets:

- `store/assets/screenshots/review-queue.png` - 1280x800 screenshot.
- `store/assets/screenshots/delete-confirmation.png` - 1280x800 screenshot.
- `store/assets/promotional/small-promo.png` - 440x280 small promotional tile.
- `store/assets/promotional/marquee-promo.png` - 1400x560 marquee promotional tile.

Generated upload artifact:

- `releases/del-or-keep-0.1.0.zip`

## Dashboard Fields

Use `store/listing.md` for:

- Single purpose.
- Short description.
- Detailed description.
- Category.
- Permission justifications.
- Reviewer notes.

Use `store/privacy-policy.md` for the public privacy policy page content.

Use `store/reviewer-notes.md` for the Dashboard reviewer notes field.

Use `store/demo-video-script.md` if you decide to add the optional YouTube demo video later.

## Manual Owner Actions

- Register or use an existing Chrome Web Store developer account.
- Pay the one-time registration fee if the account has not published before.
- Publish `store/privacy-policy.md` at a public URL. This repository is private, so a private GitHub URL will not work for users or reviewers.
- Choose the final support URL and publisher contact email.
- Upload `releases/del-or-keep-0.1.0.zip`.
- Upload the screenshots and promotional tiles.
- Complete the privacy questionnaire consistently with the local bookmark handling and Bing background request described in `store/privacy-policy.md`.
- Submit for review.

Official references:

- [Chrome Web Store publish guide](https://developer.chrome.com/docs/webstore/publish)
- [Chrome Web Store listing fields](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Chrome Web Store image requirements](https://developer.chrome.com/docs/webstore/images)
- [Chrome Web Store privacy practices](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
