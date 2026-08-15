# 依存パッケージのアップグレードロードマップ

## 目的

`naked-project-front` の `package.json` に並ぶ依存パッケージを、**1 PR = 1 粒度の変更**
に分解して最新化する。`PLAN.md` の Round 1〜5（コードの近代化）が一段落したので、
次は **バージョン番号の追従** にフォーカスを移す。

`PLAN.md` の Round 6（CI 強化）と Round 7（依存自動更新）も併せて扱う。

## 設計原則

- 1 PR ごとに `yarn lint && yarn typecheck && yarn build` が green であること。
- **破壊的変更は単独 PR**。混ぜない。混ぜると切り戻し幅が膨らむ。
- **「影響範囲が狭い順」に進める**。1 ファイルしか触らない upgrade を先に、
  アプリ全体挙動に絡む upgrade（React / recharts）は後段へ。
- 各ラウンドの **想定触るファイル** を先に書き出してから着手する。
- Renovate の導入（Round 12）は **手動ラウンドがひととおり終わった後**。
  CI が壊れたときに Dependabot 由来なのか自分由来なのかを切り分けたいから。

## 現行バージョンと上がり先（2026-08-15 時点）

| 区分 | パッケージ | 現行 (lockfile) | 最新 | ジャンプ幅 |
|---|---|---|---|---|
| runtime | `react` | 18.3.1 | 19.2.8 | major |
| runtime | `react-dom` | 18.3.1 | 19.2.8 | major |
| runtime | `recharts` | 2.15.4 | 3.10.1 | major |
| runtime | `temporal-polyfill` | 0.3.2 | 1.0.4 | major |
| types | `@types/react` | 18.3.28 | 19.2.18 | major |
| types | `@types/react-dom` | 18.3.7 | 19.2.4 | major |
| lint | `@biomejs/biome` | 1.9.4 | 2.5.8 | major |
| build | `typescript` | 5.9.3 | 7.0.2 | 2 majors |
| build | `@typescript/native-preview` | dev.20260504.1 | dev.20260707.2 | dev tag 更新 |
| build | `webpack` | 5.106.2 | 5.109.2 | minor |
| build | `webpack-cli` | 5.1.4 | 7.2.2 | 2 majors |
| dev | `webpack-dev-server` | 5.2.3 | 6.0.0 | major |
| build | `css-loader` / `style-loader` / `ts-loader` | latest | latest | 差なし |

`css-loader` / `style-loader` / `ts-loader` は既に最新近辺のため本ロードマップでは扱わない。

## 依存関係マップ（ラウンド間の順序）

```
[ Round 1:  全パッケージの patch/minor 棚卸し ]
   ├─→ [ Round 2:  biome 1 → 2 ]          ← biome.json 1 ファイル
   │      └─→ [ Round 12: Renovate 導入 ]  ← biome ルール安定後に
   ├─→ [ Round 3:  temporal-polyfill 0 → 1 ]   ← GraphList.tsx 1 ファイル
   ├─→ [ Round 4:  webpack-dev-server 5 → 6 ]  ← webpack.config.js 1 ファイル
   │      └─→ [ Round 5:  webpack-cli 5 → 6 → 7 ]  ← package.json + npm scripts
   ├─→ [ Round 6:  TypeScript 5 → 6 ]     ← ビルドのみ
   │      └─→ [ Round 7:  TypeScript 6 → 7 + @typescript/native-preview 更新 ]
   └─→ [ Round 8:  React 18 → 19 ]
          ├─→ [ Round 9:  recharts 2 → 3 ]  ← React 19 に乗せる前提
          └─→ [ Round 10: CI 強化 (PLAN.md Round 6) ]
                └─→ [ Round 11: CI の Node 24 化 ]
                     └─→ [ Round 12: Renovate 導入 (PLAN.md Round 7) ]
```

**順序の根拠**:

- Round 1 で patch 群を**先に**流してロックファイルを落ち着かせる。後のメジャーで
  lockfile diff が膨らまないように。
- Round 2（biome）は**他とは独立**で 1 ファイル変更なのでいつでも動かせる。
  ただし Round 12（Renovate）の前に置く（biome のルール変更が Renovate PR に紛れるのを避ける）。
- Round 3（temporal-polyfill）は GraphList.tsx 1 ファイルしか触らない。先に流して
  Round 8（React 19）と Round 9（recharts 3）のアプリ側改修で触るファイル集合と分離する。
- Round 4/5（webpack-dev-server / webpack-cli）は **dev 環境のみ**。本番ビルド
  （`yarn build`）には影響しない。CI に `yarn build` を入れる（Round 10）前に終わらせたい。
- Round 6/7（TypeScript）は **ビルドパイプラインのみ**。アプリ挙動には触らない。
  アプリ側の型エラーが増えるので、Round 8（React）の**前**に終わらせる。
- Round 8（React 19）はアプリ全体挙動に最も影響が大きいので**最後**。
- Round 9（recharts 3）は React 19 対応版が出てからにしたいので Round 8 の後。
- Round 10/11（CI 強化 / Node 24）は依存本体ではなく CI 側の話。Round 8 の前に
  入れても OK だが、ここでは Round 8 のあと、Renovate の前という流れで配置。

---

## Round 1 — 全パッケージの patch/minor 棚卸し（1 PR）

**目的**: 以降のラウンドで lockfile が膨らまないよう、現時点で上げられる
patch / minor を**先に**一掃する。

**触るファイル**: `package.json` の `^x.y.z` を広めに上げる + `yarn.lock`

```diff
- "react": "^18.3.1",       →  "^18.3.1"        (上限解放して再 install)
- "react-dom": "^18.3.1",   →  "^18.3.1"
- "typescript": "^5.7.2",   →  "^5.9.3"
- "webpack": "^5.96.1",     →  "^5.109.2"
- "@types/react": "^18.3.3", →  "^18.3.28"
- "@types/react-dom": "^18.3.0", →  "^18.3.7"
```

**検証**: `yarn install` → `yarn lint && yarn typecheck && yarn build`

**リスク**: ゼロ想定。SemVer 上の patch / minor のみ。

---

## Round 2 — `@biomejs/biome` 1.x → 2.x（1 PR）

**目的**: biome 2 系へ上げる。破壊的変更は **設定スキーマ** と **`organizeImports`
の廃止** が中心（実は `PLAN.md` Round 1 で既に 1.x→1.9 のマイグレーションを
やっている。その延長線上の作業）。

**触るファイル**: `biome.json`, `package.json`, `yarn.lock`

| 変更 | 詳細 |
|---|---|
| `package.json` | `"@biomejs/biome": "^2.5.8"` |
| `biome.json` の `$schema` | `https://biomejs.dev/schemas/2.5.8/schema.json` |
| `biome.json` の `organizeImports` 撤去 | 1.x で deprecated、2.x で削除。`assist.actions.source.organizeImports: true` に置換 |
| `package.json` scripts | `biome check .` / `biome format . --write` が 2.x で動作するか確認 |

**検証**: `yarn lint` / `yarn lint:fix` / `yarn format` が壊れていないこと。

**リスク**: 低。`biome.json` 1 ファイルで完結。CI 落ちたら 1 PR revert。

---

## Round 3 — `temporal-polyfill` 0.3 → 1.0（1 PR）

**目的**: 1.0 安定版へ上げる。

**触るファイル**:
- `package.json`（`"temporal-polyfill": "^1.0.4"`）
- `src/ui/organisms/house-temperature/GraphList.tsx`（必要なら API 修正）

**確認ポイント**: 1.0 で破壊的変更がいくつかあるが、本プロジェクトの使用箇所は
`Temporal.Instant.from(...).toZonedDateTimeISO(...).toLocaleString(...)` のみ。
1.0 でも互換で通る想定だが、`yarn build` で巻き戻しが起きないか確認する。

**検証**: `yarn build` → 実際に dev server を立ち上げ、グラフが描画されること。
（手動確認が必要。`package.json` の `start:client` で確認）

**リスク**: 低。1 ファイルしか触らない。壊れたら 1 PR revert。

---

## Round 4 — `webpack-dev-server` 5 → 6（1 PR）

**目的**: webpack-dev-server 6 系へ。**dev 環境のみ**。`yarn build` には影響しない。

**触るファイル**:
- `package.json`（`"webpack-dev-server": "^6.0.0"`）
- `webpack.config.js`（`devServer` 設定が必要な場合のみ）

**確認ポイント**: 6.0.0 は 2026 年に出ており、メジャー破壊あり。
`static` オプション・`historyApiFallback` 等が変更されている可能性があるので
公式マイグレーションガイドを参照。最低限 `yarn start:client` が起動すること、
HMR が動くことを確認。

**リスク**: 低〜中。**dev 環境のみ**なので本番 CI には影響しない。

---

## Round 5 — `webpack-cli` 5 → 6 → 7（**2 PR に分割**）

メジャー 2 つ分を一気に上げると切り戻し幅がデカいので、**6 と 7 を別 PR にする**。

### Round 5a: `webpack-cli` 5 → 6（1 PR）

- `package.json`: `"webpack-cli": "^6.0.1"`
- 公式マイグレーションに従い CLI フラグや config 形式を調整
- 検証: `yarn build:client` / `yarn start:client`

### Round 5b: `webpack-cli` 6 → 7（1 PR）

- `package.json`: `"webpack-cli": "^7.2.2"`
- 6 → 7 の破壊変更に追随
- 検証: 同上

**リスク**: 中。webpack-cli 6/7 は設定読み込みの挙動が大きく変わることがある。
`webpack.config.js` の最小修正で済む想定だが、CI に `yarn build` を入れるのは
Round 10 なので、CI フィードバックは PR レビュー時のローカル実行頼り。

---

## Round 6 — `typescript` 5.9 → 6（1 PR）

**目的**: TypeScript 6 系へ。ビルドパイプラインのみに影響。

**触るファイル**:
- `package.json`（`"typescript": "^6.0.3"`）
- `tsconfig.json`（必要なら target/lib の調整）
- アプリコード（型エラーが出たら最小修正）

**確認ポイント**: TS 6 で `strict` まわりの挙動が一部変わっている。
`tsconfig.json` の `target: "ES2022"` / `lib: ["ES2024", "DOM"]` は据え置き想定。
`ts-loader` 9.6 系は TS 6 を公式サポートしているはずだが、公式リリースノートの
確認が必要。

**検証**: `yarn typecheck && yarn build`

**リスク**: 中。型エラーは出る可能性が高いが、`PLAN.md` Round 5 で `strict: true`
済みなので局所修正で済む想定。修正量が膨らんだら `Round 6-A`/`6-B` に分割。

---

## Round 7 — `typescript` 6 → 7 + `@typescript/native-preview` 更新（1 PR）

**目的**: TypeScript 7 系へ。本プロジェクトは既に `@typescript/native-preview` を
`tsgo` として使っているので、native preview の dev tag 更新も同時に行う。

**触るファイル**:
- `package.json`（`"typescript": "^7.0.2"`、`"@typescript/native-preview": "7.0.0-dev.20260707.2"` 等の dev タグ固定）
- `tsconfig.json`（target/lib）
- アプリコード（型エラー）

**確認ポイント**: TS 7 で `ts-loader` 9.6 系が追従できているか確認。
追従できていない場合は、`ts-loader` の更新を間に挟むか、`tsgo` を typecheck
専用に格上げする選択肢を検討（`package.json` の `"typecheck": "tsgo --noEmit"`
は既にそうなっている）。

**リスク**: 中〜高。TS 7 は出たばかりで破壊的変更が多い。
**爆発時のフォールバック**: 修正が 10 ファイルを超えるなら、6 → 7 を保留して
`@typescript/native-preview` の dev tag 更新だけ別 PR に切り出す。

---

## Round 8 — `react` / `react-dom` 18 → 19（1 PR）

**目的**: React 19 安定版へ。

**触るファイル**:
- `package.json`（`"react": "^19.2.8"`、`"react-dom": "^19.2.8"`、`"@types/react": "^19.2.18"`、`"@types/react-dom": "^19.2.4"`）
- `src/**/*.{ts,tsx}`（型エラーが出たら最小修正）

**確認ポイント**（React 19 の代表的破壊）:

- ❌ `defaultProps` on function components → **未使用**（確認済み）
- ❌ `string refs` → **未使用**
- ❌ legacy context → **未使用**
- ⚠️ ref forwarding の変更 → `forwardRef` を使っている箇所なし、影響なし想定
- ⚠️ 新しい型（`useFormStatus` など）→ 未使用
- ⚠️ `React.FC` の暗黙の children 型変更 → `PLAN.md` Round 3 で既に撤去済み ✓

**検証**: `yarn typecheck && yarn build` の他、**dev server で実際に描画確認**
（useEffect / setInterval の挙動が変わっていないか目視）。

**リスク**: 中。本プロジェクトは小さいので影響は限定的だが、React 19 の
autobatching / concurrent rendering まわりで挙動が変わる可能性はある。

---

## Round 9 — `recharts` 2.15 → 3.10（**2 PR に分割**）

メジャーアップで ResponsiveContainer / LineChart 等の API が変わっている。
**触るコンポーネントが `GraphContainer.tsx` 1 ファイル**だが、変更点が多い
場合は **2 PR** に分ける。

### Round 9a: `recharts` 2.15 → 3.0（または最新 3.x に直接ジャンプ）

- `package.json`: `"recharts": "^3.10.1"`
- `src/ui/organisms/house-temperature/GraphContainer.tsx` の import 修正・型修正

### Round 9b: 描画確認 + 微修正（必要なら）

- dev server で実際にグラフが描画されるか確認
- 必要なら `width` / `height` の調整や `ResponsiveContainer` の props 修正

**リスク**: 中。recharts 3 系は内部実装が書き換わっており、見た目は同じでも
挙動が変わるケースがある。

---

## Round 10 — CI 強化: `yarn build` を CI に追加（`PLAN.md` Round 6 と同内容・1 PR）

**目的**: 現状 CI は `yarn lint && yarn typecheck` までしか走らせていない。
ビルドの正しさは `yarn build` まで回して初めて保証されるので、CI に追加する。

**触るファイル**: `.github/workflows/ci-cd.yml`

```diff
       - name: Type check
         run: corepack yarn typecheck
+
+      - name: Build
+        run: corepack yarn build
```

**リスク**: 低。CI の落ち方が変わるだけ。

---

## Round 11 — CI の Node 24 化（1 PR）

**目的**: `Dockerfile`（`node:24-alpine`）と CI の Node バージョンを揃える。

**触るファイル**: `.github/workflows/ci-cd.yml`

```diff
         uses: actions/setup-node@v4
         with:
-          node-version: 22
+          node-version: 24
```

**リスク**: 低。actions/setup-node は 24 系を公式サポートしている。

---

## Round 12 — Renovate 導入（`PLAN.md` Round 7 と同内容・1 PR）

**目的**: 以降の追従作業を自動化する。**手動ラウンド 1〜11 が完了してから**導入する。

**触るファイル**: `.github/renovate.json`（`dependabot.yml` ではなく Renovate 推奨）

最小構成:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "minor-and-patch",
      "automerge": true
    }
  ]
}
```

**リスク**: 低。Renovate を入れるだけではコードは変わらない。**初回 PR の山**は覚悟。

---

## 進捗トラッキング

- [x] Round 1:  patch/minor 棚卸し
- [x] Round 2:  biome 1 → 2
- [x] Round 3:  temporal-polyfill 0 → 1
- [x] Round 4:  webpack-dev-server 5 → 6
- [x] Round 5a: webpack-cli 5 → 6
- [x] Round 5b: webpack-cli 6 → 7
- [ ] Round 6:  TypeScript 5 → 6
- [ ] Round 7:  TypeScript 6 → 7 + @typescript/native-preview 更新
- [ ] Round 8:  React 18 → 19
- [ ] Round 9a: recharts 2 → 3
- [ ] Round 9b: recharts 描画確認・微修正
- [ ] Round 10: CI に `yarn build` 追加
- [ ] Round 11: CI の Node 24 化
- [ ] Round 12: Renovate 導入

## 各ラウンド共通の検証手順

```bash
yarn install
yarn lint
yarn typecheck
yarn build
```

PR マージ前に必ず 4 ステップすべて green を確認する。
dev server が必要なラウンド（3, 4, 5, 9）は `yarn start:client` で目視確認も追加。

## スコープ外（やらないこと）

- recharts から他グラフライブラリ（visx、echarts 等）への乗り換え
- webpack から vite への置き換え
- Biome から ESLint + Prettier への回帰
- 新しい依存の追加（状態管理ライブラリ、テストフレームワーク等）

これらは別プランを切る。
