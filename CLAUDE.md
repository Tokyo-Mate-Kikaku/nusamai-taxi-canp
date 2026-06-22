# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for 福祉タクシーぬさまい (Welfare Taxi Nusamai), a private ambulance and welfare taxi service in Mashiko Town, Tochigi Prefecture. No build tool, no framework, no package manager — open HTML files directly in a browser.

## File Structure

```
index.html          ← トップ
guide.html          ← ご利用案内
price.html          ← 料金
about.html          ← 運営者紹介
faq.html            ← よくあるご質問
css/style.css       ← 単一スタイルシート
js/main.js          ← 単一スクリプト
img/logo.jpg            ← ロゴ (42×42px)。赤を解析し --brand の起点に
img/fv_pc_dummy.webp    ← トップ FV（PC・横長／仮）
img/fv_sp_dummy.webp    ← トップ FV（SP・縦長／仮）
img/fv02.webp           ← guide/price/faq の page-hero 背景 ＋ 全ページ footer-cta カード背景（いずれも呉須フィルター下／仮）
img/profile_dummy.webp  ← 代表写真（about カバー・プロフィール欄／仮・生成AI）
img/strecher.webp · wheelchair.webp · oxygen_tank.jpg · vacume.jpg · vehicle.jpg ← guide 機材カード背景（仮・「仮挿入」キャプション付き）
img/LINE_Brand_icon.png ← ヘッダー LINE CTA（`.header-line`・アイコンのみ 42px 正方形）に使用
img/line_icon.png       ← 未使用素材
```

配置済み画像（いずれも仮）：トップ FV(`fv_*_dummy`)・about(`profile_dummy`)・page-hero 背景(`fv02`)・guide 機材カード(`strecher` / `wheelchair` / `oxygen_tank` / `vacume` / `vehicle`)。これら以外（hero の `.img-ph` 等）は CSS の斜線プレースホルダーのまま。**大判写真は WebP（品質82。機材カードは長辺1000pxへリサイズ）で軽量化済み**（PNG 原本は削除）。新規写真も同方針で WebP 化推奨。

## Previewing & verifying changes

ビルド/テスト/lint なし。ブラウザで HTML を直接開く。視覚確認は Chrome ヘッドレスでスクショ：

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=390,720 --screenshot=/tmp/out.png "file://$(pwd)/index.html"
sips -c <高さ> <幅> --cropOffset <y> <x> /tmp/out.png --out /tmp/crop.png   # 部分切り出し
```

- `sips --cropOffset 0 0` は**中央クロップ**扱いになる。上端を取るなら `--cropOffset 2 0` 等の微小オフセットを使う
- **モバイル幅のスクショは旧 `--headless` だと無効**。旧モードは `--window-size` の幅を**スクショ範囲にしか使わず**、レイアウト viewport は既定（約800px=PC判定）のまま → メディアクエリが効かずハンバーガー等が出ない。モバイル確認は **`--headless=new`** を使う
- **`--window-size` の幅は約 500px が下限**（それ未満を指定しても viewport は 500px に丸められる）。右端の要素（ハンバーガー等）まで写すには **幅を 500 以上**にする（390 等だと右端が画面外に切れる）。ヘッダーのスマホ切替（≤900px）やハンバーガー確認には `--window-size=500,<高さ>` 等が安全
- **モバイルメニュー展開状態**は JS 依存で素のスクショに出ない。一時プレビューを作って撮る（×印は `menu-toggle` の `aria-expanded="true"` で駆動するので、それも併せて書き換える）：
  `sed -e 's/class="header-nav"/class="header-nav open"/' -e 's/class="header-cta"/class="header-cta open"/' -e 's/aria-expanded="false"/aria-expanded="true"/' index.html > _menu_preview.html`（撮影後に削除）

## Deployment (client preview)

クライアント確認用に **GitHub Pages** へ公開。

- リモート `canp` = `Tokyo-Mate-Kikaku/nusamai-taxi-canp`（**Public**）の `main` が Pages ソース。公開 URL: `https://tokyo-mate-kikaku.github.io/nusamai-taxi-canp/`
- **CLAUDE.md は公開リポジトリに含めない**。`canp/main` は orphan スナップショット由来で、ローカル `main`（リモート `origin` = `nusamai-taxi`）とは**別履歴**
- 反映手順：①ローカル `main` に通常コミット → ②`canp/main` の上に「CLAUDE.md を除いた現状ツリー」を増分コミットして push（force-push 不要）。`git checkout main -- .` は**追加/更新のみで削除を反映しない**ので、ファイル削除があった回は対象を明示 `git rm --cached` してから commit すること（`git diff --stat main _canp_push` が CLAUDE.md のみになるか検証）
- push 後 Pages が自動再ビルド（1–2分）。**`pages/builds/latest` API はコミット反映が遅延・不正確なことがある**ため、反映確認は公開 URL の**実コンテンツを `curl` で検証**する（変更した文言・CSS を grep）
- 全ページに `noindex` 付与済み（検索除外・URL 直アクセスは可）

## FAQ 確認用 PDF（クライアント校正物）

faq の Q&A を **A4・1ページ**の PDF にまとめてクライアント確認用に出力する運用がある。サイト本体とは別の印刷用 HTML を作り、Chrome の `--print-to-pdf` でデスクトップに出力：

- 印刷用 HTML（`/tmp/faq_print.html` 等）に `@page { size: A4; margin }`、2段組（`column-count: 2` ＋ `.qa { break-inside: avoid }`）。サイト配色を踏襲（呉須藍の帯見出し／Q.＝藍・A.＝赤）
- `"$CHROME" --headless=new --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf=<出力> file://<印刷HTML>`（webフォント読込のため virtual-time を確保）
- 出力先はデスクトップ（`~/Desktop/福祉タクシーぬさまい_FAQ確認用.pdf`）。PDF は**リポジトリ管理外**（コミット/デプロイ不要）
- 検証：`mdls -name kMDItemNumberOfPages`（1ページ確認）＋ `sips -s format png` でラスタライズ目視。**faq.html を更新したら PDF も再出力**して内容を一致させる

## CSS Architecture

CSS Custom Properties as the sole design token system (`css/style.css`):

益子焼（Mashiko-yaki）の釉薬に接地したパレット。柿釉=brand赤、呉須=accent藍、黒釉=ink墨、糠白=bg-soft。

```css
--serif:      'Shippori Mincho', serif         /* 見出し：旧字系明朝 */
--sans:       'Zen Kaku Gothic New', sans-serif /* 本文：ヒューマニスト */
--mono:       'Lato', sans-serif                /* ラベル・数字・バッジ */

--text:       #2b2724  /* 本文色（暖色寄り墨） */
--ink:        #2e2a27  /* 構造色＝黒釉。フッター背景・ボタン土台 */
--bg:         #ffffff
--bg-soft:    #f4f0e8  /* 糠白釉（nuka）寄りの温白 */
--bg-alt:     #e9e3d8
--border:     #d6d1cb

--brand:      #b53d3f  /* 柿釉（ロゴの赤）＝電話CTA専用アクセント */
--brand-dark: #9a3135  /* 赤ボタン hover */
--accent:      #41497d /* 呉須（赤のトライアド藍）＝見出し署名・ラベル・リンク */
--accent-dark: #353c66
--line:        #06c755 /* LINE 公式グリーン */
--line-dark:   #05a647
```

配色の役割分担: **柿赤＝行動（電話CTA・見出し署名）／呉須藍＝情報（ラベル・リンク・タイムライン）／LINE緑＝LINE導線／墨＝構造**。

フォントサイズ: **本文 16px ベースライン（Google モバイル推奨）**。本文・カード本文・操作系(`.btn`)・テーブルは 16px。**料金表(`.price-table`)のみ 15px**（要望で一段小さく）。見出しジャンプ率は 16(本文)→18–19(カード見出し `.reason-card`/`.service-card`/`.qa-question h3` 等)→20(`.faq-section-title`)→22(`.profile-name`)→clamp 22–28(`.section-title`)→clamp 22–34(`.hero-catch`)。**16px 未満を意図的に残す**のは mono のマイクロラベル/バッジ、キャプション、フッター細字、PCナビ(13px・横一列維持)のみ。

CDN 依存（各ページ `<head>` に記載）:
- Google Fonts: `Shippori+Mincho`, `Zen+Kaku+Gothic+New`, `Lato`
- Google Material Icons: `https://fonts.googleapis.com/icon?family=Material+Icons`

## JavaScript Patterns (`js/main.js`)

1. **Accordion** — `aria-expanded` toggle; 同グループの他アイテムを閉じる; ページロード時に最初のアイテムを開く
2. **Mobile menu** — `.menu-toggle` が `.header-nav` と `.header-cta` に `.open` を付与; nav リンククリックで閉じる。**見た目（overlay 化・縦積み）は CSS の `:has(.open)` が担う**（下記 Key Design Decisions 参照）
3. **Copyright year** — `document.getElementById('copyright-year')` に `new Date().getFullYear()` を代入

## Key Design Decisions

- **Logo**: `img/logo.jpg` — `.logo-mark` 内で `42×42px / object-fit: contain` 表示。ロゴの赤を解析し `--brand #b53d3f`（柿釉）として全配色の起点に
- **見出しの署名**: `.section-title::after` に柿釉ブラシのインライン SVG（data URI）を敷く。益子焼の釉がけを想起させる唯一の装飾署名。色は `--brand`
- **LINE icon**: ヘッダー `.header-line` は `img/LINE_Brand_icon.png`（公式・緑角丸）の**アイコンのみ・42px 正方形**（電話CTA `.header-phone` の実高さ 42px に合わせた固定サイズ。モバイル展開時は中央配置）。**hero / footer-cta の LINE ボタン（`.btn-line`）は Material Icons の `chat_bubble` ＋テキスト**。floating CTA は電話のみ（LINE 削除済み）
- **Phone icon**: Material Icons の `call` を `<span class="material-icons">call</span>` で使用
- **Button system**: `.btn-dark`＝柿赤の主CTA（電話）/ `.btn-line`＝LINE緑 / `.btn-accent`＝呉須藍のゴースト（ナビ「→」リンク）。LINE と「→」リンクは色で峻別
- **Timeline**: 本当に順序のある経歴（about.html）のみ `<ol class="timeline">` で呉須ノード付きの年表に。並列の「3つの理由」は番号を廃し provenance ラベル（消防本部認定 / 建設現場仕込み / 重機操作仕込み）に
- **Mobile menu = overlay（レイアウトシフトなし）**: 展開時 `.header-inner:has(.open)` を `position: absolute` overlay にし、`.site-header { min-height: 68px }` でバー高を確保 → 下のコンテンツを押し下げない。`flex-wrap` + `order` で **CTA→ナビ**の順に縦積み。`.header-logo { min-height: 68px }` でロゴの縦シフトを防止。ナビ文字は PC 13px（横並び維持のため `white-space: nowrap`）／モバイル展開時のみ 16px
- **柔らかい曲線の区切り** (`.wave-down`): CSS mask の SVG 波で、soft↔白セクション境界に「ところどころ」適用。色は上セクションの地色（`--wave-color` で上書き可。faq は白→soft なので `var(--bg)`）。柿釉ブラシと同じ手仕事の揺らぎを非対称パスで
- **FV写真＋呉須フィルターの多層背景**（共通手法）: 1要素の `background-image` を多層化し、**最背面に FV 写真(`fv02.webp` cover)**、その上に呉須カラーフィルター（`color-mix(in srgb, <accent系> N%, transparent)`）を重ねて地色から際立たせる。使用箇所：
  - **page-hero 呉須版** (`.page-hero-accent`、guide/price/faq)：フィルタ `--accent-dark` 80% ＋斜めハッチ＋右上 radial 光沢、白文字。続くセクションと色差
  - **footer-cta**（下記）：フィルタ `--accent` 82%
  - 濃度は写真を見せたいなら下げ、文字くっきりなら上げる。トップ FV(`.hero`) は別実装で `<picture>` 出し分け
- **Hero FV / 写真**: トップ FV は `<picture>` で PC(`fv_pc_dummy`)/SP(`fv_sp_dummy`) を出し分け。about カバー・プロフィール欄は `profile_dummy` を `background-image: cover` で表示。service-icon は土色(`--bg-alt`)丸＋呉須グリフ
- **LINE link**: 全 LINE 導線（ヘッダー/ヒーロー/フッターCTA・全11箇所）は `https://lin.ee/9xXF9nc`（`target="_blank" rel="noopener noreferrer"`）。電話は `tel:08047694071`
- **`--mono` は Lato**: 等幅ではなくラベル・バッジ・数字に使うアクセントフォントとして運用
- **Floating CTA は電話のみ** (`.floating-cta` > `.floating-phone`): LINE ボタンは削除済み（`.floating-line` の CSS は dead として残存）。重なり対策で `.site-footer { padding: 40px 0 100px }`（CTA 56px + bottom 24px + `env(safe-area-inset-bottom)`）
- **Footer CTA** (`.footer-cta`、全5ページ共通): 結びの CTA カード。背景は **FV写真(`fv02.webp` cover) ＋ 呉須藍フィルター `color-mix(--accent 82%, transparent)` の多層 background-image**（上記の共通手法）で糠白/白の地色から際立たせる。白文字＋白の電話番号、行動色の赤は内側の `.btn-dark`（電話する）が担う。多層 `box-shadow`（墨の接地＋藍の近接/中距離＋上端 inset 白ハイライト）で控えめなリフト、角丸 `--radius-l`。背景は border-radius に内接クリップ
- **資格バッジ/ラベル色**: about・index の保有資格 `.badge` は**呉須藍地＋白文字の塗りバッジ**、guide チェックリストの `.check-mark` も呉須藍。FAQ 回答 `.accordion-panel` は質問と同じ `--text` 濃度（薄い `--text-2` にしない）
- **「仮挿入」プレースホルダー**: 仮の実画像には「仮挿入」キャプションを重ねる。機材カードは `.equip-img` 内の `<span>`、トップの FV・代表写真は `.ph-tag`（親を `position:relative` にして絶対中央配置の白ピル・`pointer-events:none`）。正式画像差し替え時はキャプションを外す
- **Hamburger → ×印**: `.menu-toggle[aria-expanded="true"]` で3本の `span` を `transform`（中央2本を寄せて回転）＋中央 `opacity:0` の×印に。アニメは `transform`/`opacity` のみ・200ms・`ease-out`、`prefers-reduced-motion` で無効化。JS は `aria-expanded` と `aria-label`（開く⇄閉じる）をトグル
- **Accordion expanded border**: `box-shadow: inset 3px 0 0` を使用（`border-left` はレイアウトシフトを起こすため）
- **Copyright fallback**: `<span id="copyright-year">2026</span>` — JS 非対応環境のフォールバック
- **noindex**: 全ページに `<meta name="robots" content="noindex">` — クライアント確認用サイト

## Responsive Breakpoints

- `≤900px`: **ヘッダーがスマホレイアウトに切替**（ナビ・CTA は素では非表示、ハンバーガー展開で overlay `:has(.open)` 表示。900–681px で CTA が収まらない崩れの対策で 680→900 に引き上げ済み）。`grid-3` → 2カラム、`profile-grid` / `estimate-grid` / `footer-inner` → 1カラム
- `≤680px`: `grid-3` → 1カラム、`grid-4` → 2カラム、hero/footer-cta 等を縦積み。常時表示の連絡先は `.floating-cta` が担う

## Page Template Pattern

全5ページは同一の header / footer / floating-cta を共有。ページ固有のナビリンクに `class="current"` を付ける。フッター `footer-address` は全ページ 郵便番号＋TEL のみ（E-mail は削除済み）。

- **FAQ ラベルの使い分け**: ヘッダー/フッターのナビリンクは「**よくある質問**」、faq ページ自身の `<title>`/`<h1>`/meta description は「**よくあるご質問**」（ナビは簡潔に、文書見出しは正式表記）
- **page-hero**: 中ページの見出し帯は `.page-hero`。guide / price / faq は `.page-hero-accent` を併記して FV写真＋呉須フィルター化、about のみ `.about-cover`（大判写真）
- **about ページ構成**: about-cover → はじめに → インタビュー(Q&A) → 益子町への想い → プロフィール（写真＋`.timeline`＋資格 `.badge`）→ **事業所概要**（`.area-detail`/`.area-row` の `<dl>`：屋号/代表者/住所/電話番号/許認可/開業年月日。guide 営業エリアと同コンポーネント）→ footer-cta
