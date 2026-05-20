# SafeSpend 直接可執行開發計畫研究報告

## 執行摘要

SafeSpend 最合理的切入方式，不是先做「全自動理財大平台」，而是先做一個**手動優先、隱私優先、以每日可花額度為核心的 budgeting app**：讓使用者在 90 秒內完成初始設定，立刻看到「今天還能花多少」，再用每週回顧、到期提醒、簡單 AI 教練，把記帳行為變成可持續的日常習慣。這個方向比一開始就押注銀行同步更務實，因為目前公開文件最完整、覆蓋最成熟的 open-banking / account aggregation 供應商仍以美加與歐洲市場為主；對台灣或亞洲的消費級銀行同步，本次研究沒有找到同等成熟、公開文件完整的主流方案，因此**MVP 不應被 bank sync 綁死**。

產品定位上，SafeSpend 應鎖定三類高頻需求：剛出社會或收入波動的年輕工作者、預算有限的大學生與研究生、以及需要共管支出的情侶／小家庭。原因很直接：美國聯準會 2025 年資料顯示，整體只有 63% 成年人能用現金、存款或當期還清的信用卡處理 400 美元突發支出，而 18–29 歲族群該比例只有 45%；同時 OECD 指出，財務素養較高的學生，更可能儲蓄，也更可能在購買前比價。這代表「簡化日常支出判斷、建立安全緩衝」是可被驗證的剛需。

商業化上，SafeSpend 不應走完全 freemium。RevenueCat 2026 的基準資料顯示，硬式 paywall 的 D35 轉付費中位數為 10.7%，freemium 只有 2.1%；而整體有 50.6% 的轉付費發生在 Day 0，Productivity 類別更高達 71.9%。因此 SafeSpend 最適合採用**有限免費功能 + 明確價值展示 + 輕量硬 paywall / 強價值 paywall 測試**的模式。

技術上，建議採用 **Flutter + NestJS + Supabase Postgres + Google Cloud Run + Firebase Analytics / Crashlytics / FCM + RevenueCat + OpenAI**。原因是：Flutter 能用單一 codebase 同時支援 iOS / Android；Supabase 提供 Postgres、Auth、Storage 與 RLS，適合財務資料的關聯式模型；Cloud Run 走使用量計費；Firebase Analytics 與 FCM、Remote Config、A/B Testing 整合緊密且 Analytics 本身可免費使用；RevenueCat 可大幅降低跨平台訂閱基礎設施維護成本；OpenAI API 則提供結構化輸出、no-train-by-default 的 API 資料政策與免費 Moderation API，適合做安全的 AI 教練。

結論上，這個產品在 6 個月內可以做到可上架、可付費、可用數據迭代的版本。最佳執行策略是：**前 3 個月完成 MVP 與封閉 alpha，接著在第 4–5 個月接上 AI 教練、訂閱與實驗框架，第 6 個月進閉測與公開上架**。若團隊維持精實、創辦人主導產品、工程資源集中在單一 app 與單一地區語系，這是可以直接開工的計畫。

## 市場驗證與產品定位

SafeSpend 的核心不是「記得更多」，而是**讓使用者更快做對支出決策**。現有市場頭部產品其實已經把需求輪廓講得很清楚：YNAB 強調給每一塊錢一個任務與預算目標；Rocket Money 把「Safe to Spend」當成可直接回答「我現在到底能不能花」的功能；Monarch 主打可共同管理帳務、目標、訂閱與報表。換句話說，市場已證明使用者願意為以下能力付費：**每日可花額度、 recurring bills / 訂閱辨識、目標進度、家庭共管、隱私友善的收費模式**。

（以下內容依你提供版本整理，保留原結構可直接給產品、設計、工程與成長團隊啟動。）

## 產品需求與 PRD

### MVP 定位

* 手動優先，不被 bank sync 阻塞。
* 首頁第一屏直接回答「今天還能花多少」。
* Aha moment 定義：完成 onboarding 後立刻看到 safe-to-spend，並可追溯計算邏輯。

### MVP 功能（可直接拆票）

* 登入：Email magic link + Apple / Google。
* Onboarding：60–90 秒建立預算基礎資料。
* 交易：10 秒內手動記帳 + 快速分類。
* 規則：商家分類規則可覆寫並持續套用。
* 引擎：safe-to-spend 每日重算 + breakdown explanation。
* recurring：先做建議，不做全自動決策。

### 非目標（MVP 不做）

* 投資帳戶、信用分數、自動儲蓄轉帳、多幣別報表、企業費用、全面銀行同步。

## 技術架構與安全合規

### 建議架構

* Mobile：Flutter
* Backend：NestJS on Cloud Run
* Data：Supabase Postgres + Auth + Storage + RLS
* Sidecar：Firebase Analytics / Crashlytics / FCM / A/B
* Billing：RevenueCat
* AI Coach：OpenAI（結構化輸出 + moderation）

### 安全原則

* 可證明（consent log）
* 可稽核（RLS + audit log）
* 可刪除（DSR export/delete in-app）

## 六個月執行計畫

* M1–M3：MVP + 封閉 alpha
* M4–M5：AI coach、付費牆、實驗框架
* M6：閉測放量 + 正式上架

### Sprint 節奏（雙週）

1. 基礎建置（repo、CI、skeleton）
2. Auth + onboarding
3. Budget domain + transaction API
4. Safe-to-spend v1
5. Rules + recurring
6. Weekly summary + push
7. Subscription + paywall
8. Closed alpha
9. AI coach v1
10. CSV import/export + privacy
11. Beta + test automation
12. Store readiness + growth setup
13. GA rollout

## 商業模式、成長與風險

### 收費模型

* Subscription-first（非純 freemium）
* AI 用量上限作為付費層 differentiator
* 早期優先測試 paywall 結構，而非只測價格點

### 核心風險與緩解

* Aha 太慢 → onboarding 限 6 步、先給答案
* 公式不被信任 → 全程可解釋 breakdown
* recurring 誤判 → 先建議、後自動化
* AI 越界建議 → moderation + policy guardrails + 免責與轉介
* 過早 bank sync → 延後至 7–12 月並採 adapter + feature flag

## 結語

SafeSpend 最強的首發策略是：**以「今日可花額度」作為唯一北極星，先做手動優先與隱私優先的可持續記帳體驗，再逐步引入 AI 與自動化**。這能在最小資源下最快驗證留存與付費，並為後續 household、bank sync、進階預測打穩資料與信任基礎。
