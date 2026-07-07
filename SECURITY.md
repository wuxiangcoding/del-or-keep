# Security Policy

## Supported Versions

Security updates are provided for the latest version published from the `main` branch.

## Reporting a Vulnerability

Please do not disclose security issues in public issues, pull requests, or discussions before a fix is available.

Use GitHub's confidential vulnerability reporting for this repository when available. If confidential reporting is not available, open a minimal public issue asking for a security contact without including exploit details, personal bookmark data, or proof-of-concept code.

Useful reports include:

- Affected version or commit.
- Browser and operating system version.
- Steps to reproduce.
- Expected and actual behavior.
- Impact and any known workaround.

## Extension Security Model

Del or Keep is a Manifest V3 Chrome extension. It requests:

- `bookmarks` to read, review, delete, and restore bookmarks after user action.
- `storage` to keep local review state.
- `https://www.bing.com/*` to request Bing homepage image metadata and assets for the new tab background.

Bookmark titles, URLs, folder placement, and review state stay on the user's device. The project does not include analytics, ads, accounts, or remote code.

## Maintainer Checklist

Before publishing a release:

- Run `pnpm verify`.
- Review permission changes in `extension/src/manifest.json`.
- Confirm `PRIVACY.md` still matches the code.
- Confirm generated release archives are not committed.
