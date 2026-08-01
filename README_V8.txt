SHILIEN 官方網站 V8 修正版

本次重點：
1. 修正預約表單按鈕無反應：補上確認視窗與成功視窗。
2. 預約送出前完整顯示資料，確認後才送至 Google Apps Script。
3. 加入 Email、服務項目、車型、日期限制與欄位檢查。
4. 防止同一頁面重複送出同一筆預約。
5. 線上預約與合作洽詢改成兩個獨立按鈕。
6. 修正公司名稱為「仕聯管理顧問股份有限公司」。
7. 加入手機版確認視窗與清楚的成功／錯誤提示。

上傳方式：
將本資料夾內下列檔案上傳到 GitHub Repository 根目錄並覆蓋同名檔案：
- index.html
- app.js
- booking.html
- partner.html
- style-v8.css（新檔案）

重要：
- 不要刪除原本的 style.css。
- 不要修改 CNAME。
- 不要按 Squarespace 的 Update DNS Records。
- Commit 建議名稱：SHILIEN V8 booking fix and separated CTAs

測試：
1. 等 GitHub Actions 綠色完成。
2. 開啟 https://shilien.com/booking.html?v=8
3. 填寫測試資料並勾選同意。
4. 按「確認預約資料」→ 應跳出確認視窗。
5. 按「確認送出」→ 檢查 admin@shilien.com 與 Google 試算表。
