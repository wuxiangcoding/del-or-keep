# Del or Keep

語言：[English](README.md) | 繁體中文

Del or Keep 是一個 Manifest V3 Chrome 擴充功能，會把新分頁變成輕量的書籤整理佇列。它每次顯示一個至少 30 天前儲存的書籤，讓使用者可以開啟、保留，或在確認後刪除，並支援復原最近一次刪除。

## 功能

- 每次在 Chrome 新分頁中檢視一個舊書籤。
- 先開啟書籤，再決定是否保留。
- 支援保留、確認後刪除，以及復原最近一次刪除。
- 書籤檢視狀態只保存在本機 Chrome 擴充功能儲存空間。
- 只為了新分頁背景使用 Bing 每日圖片端點。

## 從 GitHub Releases 安裝

Del or Keep 目前尚未上架 Chrome Web Store。在商店頁面可用之前，可以先透過 GitHub Release 以未封裝擴充功能方式安裝：

1. 從最新的 GitHub Release 下載 `del-or-keep-<version>.zip`。
2. 解壓縮檔案，並把解壓後的資料夾放在固定位置。
3. 開啟 `chrome://extensions`。
4. 啟用開發人員模式。
5. 點選載入未封裝項目，並選擇解壓後的資料夾。

Chrome 會從選取的資料夾載入未封裝擴充功能，因此使用期間不要刪除該資料夾。

## 開發

```sh
pnpm install
pnpm verify
```

建置未封裝擴充功能：

```sh
pnpm build
```

接著在啟用開發人員模式的 `chrome://extensions` 中載入 `extension/dist`。

## 發行建置

產生本機發行檔案：

```sh
pnpm release:prepare
```

這會執行測試、建置擴充功能、重新產生 Chrome Web Store 圖片素材、驗證素材尺寸，並建立：

- `extension/dist`，用於本機未封裝測試。
- `store/assets/screenshots/*.png`，用於本機商店截圖。
- `store/assets/promotional/*.png`，用於本機宣傳圖片。
- `releases/del-or-keep-<version>.zip`，用於 Chrome Web Store 上傳。
- `releases/del-or-keep-<version>.zip.sha256`，用於本機完整性檢查。

建置輸出、商店素材和發行封存檔都是產生物，會刻意被 git 忽略。

## 隱私與權限

書籤標題、URL、資料夾位置和檢視狀態都會留在使用者裝置上的 Chrome API 與 `chrome.storage.local` 中。這個擴充功能沒有分析、廣告、帳號或遠端程式碼。

唯一的外部主機權限是 `https://www.bing.com/*`，用來取得 Bing 首頁圖片中繼資料和圖片素材，作為新分頁背景。書籤標題、URL、資料夾位置和檢視狀態不會傳送到 Bing。

公開隱私權政策在 `PRIVACY.md`。

## 安全

請私下回報安全漏洞。支援版本、回報方式和發行安全檢查清單請見 `SECURITY.md`。

## 授權

本專案採用 Apache License, Version 2.0 授權。請見 `LICENSE` 和 `NOTICE`。
