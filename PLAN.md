# 古くなった部分の刷新プラン

## 目的

`naked-project-front` を**小さい・独立した・CI を緑のまま保てる**変更の積み重ねで刷新する。
「芋づる式に膨らむ」を避けるため、各ラウンドは別ファイル集合で完結させ、依存関係を一方向に固定する。

## 設計原則

- 1 ラウンド = 1 PR（または 1 commit）。各ラウンド終了時に `yarn lint && yarn typecheck && yarn build` が通る。
- 触るファイル集合が確定している変更を**先に**、不確実な変更を**後に**。
- 不確実な層（型厳格化など）で爆発したら中断して、その層のみを細粒度に分割する。

## 依存関係マップ

```
[ Round 1: 副作用ゼロの整理 ]
   └─ 他の何にも依存しない
   ├─→ [ Round 2: 単一ファイルのバグ修正 ]
   │    ├─ PR-A: GraphList.tsx (setInterval cleanup)
   │    └─ PR-B: fetchData.ts   (Date ミューテーション)
   ├─→ [ Round 3: React 表記の現代化 ] (Round 5 より前が望ましい)
   │    └─ React.FC / FunctionComponent 撤去
   ├─→ [ Round 4: ts-loader 更新 ]
   │    └─ ^6.2 → ^9.6
   ├─→ [ Round 5: tsconfig strict 化 ]
   │    └─ strict: true + 出てきたエラーを最小修正
   ├─→ [ Round 6: CI 強化 ]
   │    └─ CI に yarn build / Node 24 / Reusable workflow タグ固定
   └─→ [ Round 7: 依存自動更新 ]
        └─ Dependabot or Renovate
```

Round 5 を後ろに置く理由: それまでの修正で「触るファイル / シンボル」が確定するため、
strict 化したときの影響範囲が見積もりやすくなる。

---

## Round 1 — 副作用ゼロの整理

**粒度**: 1 PR にまとめて OK。全部「1 行削除 / 文言修正 / 設定書き換え」。
**検証**: `yarn lint && yarn typecheck && yarn build`。

| ファイル | 変更内容 |
|---|---|
| `README.md:1,3` | バッジ URL と説明文を `naked-project-front` 用に修正 |
| `src/ui/index.html:6` | IE 向け `<meta http-equiv="X-UA-Compatible" content="ie=edge" />` を削除 |
| `biome.json:1` | `$schema` を最新版に更新 |
| `biome.json:5-7` | `organizeImports.enabled` を `assist.actions.source.organizeImports` にマイグレ |
| `Dockerfile:1` | `as` を `AS` に |
| `docker-compose.yml:1` | `version: "3"` を削除（Compose v2 では不要） |
| `package.json` | `"main": "index.js"` を削除（実体なし） |
| `.gitignore` | `.serena/` を追加 |
| ローカル | 古い `build/`（`server.js` 等）を削除 |

## Round 2 — 単一ファイルのバグ修正（**PR 2 本に分割**）

レビュー・revert を独立させるため、ファイル単位で PR を分ける。

### PR-A: `setInterval` のクリーンアップ漏れ

- 対象: `src/ui/organisms/house-temperature/GraphList.tsx`
- 修正: `useEffect` 内で `setInterval` の戻り値を保持し、return で `clearInterval` する
- 影響: 動作は実質変化なし（クリーンアップが正しくなる）

### PR-B: `Date` のミューテーション

- 対象: `src/infra/fetchData.ts:6-9`
- 修正: `date.setHours(...)` をやめ、`new Date(year, month, day, ...)` で純粋に新しい `Date` を構築
- 影響: 引数 `Date` を破壊しなくなる（呼び出し側の意図が守られる）

## Round 3 — React 表記の現代化（1 PR）

4 ファイルだけ。すべて型注釈 / import 整理。**Round 5 の前にやる**ことで、
strict 有効化時に `React.X` の残骸を一掃してから型検査に入れる。

| ファイル | 変更 |
|---|---|
| `src/ui/templates/body.tsx` | `React.FunctionComponent` 撤去、`import type React` 削除 |
| `src/ui/organisms/Header.tsx` | `React.FunctionComponent` 撤去、`import type React` 削除 |
| `src/ui/organisms/house-temperature/GraphList.tsx` | `React.FC` 撤去、`import type React` 削除 |
| `src/ui/organisms/house-temperature/GraphContainer.tsx` | `React.FunctionComponent` 撤去、`React.useCallback` → `useCallback`（named import）、`import React from "react"` を `import { useCallback } from "react"` に |

## Round 4 — `ts-loader` 更新（1 PR）

- `package.json`: `"ts-loader": "^9.6.0"`
- `yarn install` で lockfile 更新
- `webpack.config.js:18-26` の `use` オプションが新形式で要求される場合のみ最小修正
- 検証: `yarn build`（CI でもこの時点で build が走ることを後段で確認する）

リスク: ローダのメジャーバンプ。コケても `webpack.config.js` 1 ファイルで対処可能な想定。

## Round 5 — `tsconfig` の `strict: true` 化

唯一の不確実ポイント。先に他のラウンドを通して触るファイル集合を確定させてから臨む。

### 進め方

`tsconfig.json` に `"strict": true` を追加し、露出した型エラーを**オーバーライド無し**で
最小修正する 1 PR として扱う。

### 爆発時のフォールバック

修正量が想定（5〜15 ファイル行）を超えたら、

1. その時点で commit を中断
2. strict フラグを個別に on/off する方式（`strictNullChecks` 以外を 1 フラグずつ有効化）に切り替える
3. ラウンドを `Round 5-A`（strictFunctionTypes）、`Round 5-B`（noImplicitThis）等に分割

### 事前見積り根拠

- `any` の使用は現状 0 件（`grep` で確認済み）
- `strictNullChecks` は既に有効
- 次に出やすいのは `strictFunctionTypes` と `noImplicitThis`

## Round 6 — CI 強化（1 PR）

| ファイル | 変更 |
|---|---|
| `.github/workflows/ci-cd.yml` の `test` ジョブ | `yarn build` ステップを追加（現状 CI はビルドを検証していない） |
| 同上 | Node バージョンを `24` に（Dockerfile と揃える） |
| 同上 | `chao7150/actions/.github/workflows/ecr-push.yml@main` をタグ `@v1` 等で固定 |
| 必要なら | ジョブ再編（`lint-and-build` 等） |

依存: Round 5 まで終わってから。CI が落ちたときの原因切り分けノイズを減らすため。

## Round 7 — 依存自動更新（1 PR）

- `.github/dependabot.yml` か `renovate.json` を追加
- `group: minor-and-patch` で波風を立てずに運用開始
- Round 4 で残した `webpack-dev-server` 6.x / `recharts` 3.x などは自動更新の結果として別 PR で扱う

---

## 進捗トラッキング

各ラウンドが完了したらここに記録する。

- [x] Round 1: 副作用ゼロの整理
- [ ] Round 2: 単一ファイルのバグ修正（PR-A, PR-B）
- [ ] Round 3: React 表記の現代化
- [ ] Round 4: ts-loader 更新
- [ ] Round 5: strict: true 化
- [ ] Round 6: CI 強化
- [ ] Round 7: 依存自動更新

## 各ラウンド共通の検証手順

```bash
yarn install
yarn lint
yarn typecheck
yarn build
```

PR マージ前に必ず 4 ステップすべて green を確認する。

## スコープ外（やらないこと）

以下は本プランでは扱わない。必要になったら別途プランを切る。

- React 19 / `recharts` 3.x / `webpack-dev-server` 6.x へのメジャー更新
- バンドルサイズ最適化（現状 576 KiB、削減は別案件）
- テストフレームワーク導入（現状テストなし、CI に build を入れるのが先決）
- コンポーネント分割の細粒度化（organisms/templates の構造改革）
