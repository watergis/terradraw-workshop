# FOSS4G 広島 2026 - Terra Draw ワークショップ

FOSS4G 広島 2026 の Terra Draw ワークショップへようこそ! この 3 時間のハンズオンでは、Terra Draw の統一 API を使って、ウェブ地図アプリケーションに高度な描画機能を組み込む方法を学びます。

## ワークショップの概要

[Terra Draw](https://github.com/JamesLMilner/terra-draw) は、MapLibre、Leaflet、OpenLayers、Mapbox、Google Maps、ArcGIS といった主要なウェブ地図ライブラリすべてで動作する、強力なクロスプラットフォーム描画ライブラリです。このワークショップでは、基本的な考え方から応用的な実装までを扱います。

2025 年版とは違い、必要なものはすべて**この 1 つのウェブサイト**に揃っています。各演習ページにはライブエディタが組み込まれており、左側で TypeScript を書くと右側に結果が表示されます。リポジトリを行き来する必要はありません。ローカル環境で作業したい方のために、SvelteKit のテンプレートも同じリポジトリに用意しています。

### 学べること

- Terra Draw のアーキテクチャと統一 API の理解
- MapLibre GL JS での Terra Draw のセットアップ
- 最新の描画モードを使った基本的な描画機能の実装
- スタイルのカスタマイズ、イベント処理、データ管理
- 新機能である**元に戻す / やり直す**(undo / redo) 履歴機能の利用
- maplibre-gl-terradraw プラグインによるスムーズな組み込み

### 事前準備

このワークショップに参加するにあたり、以下をご用意ください。

- モダンなブラウザ (Chrome、Firefox、Safari) — 埋め込みのライブエディタを使うだけならこれで十分です
- ローカル開発も試したい場合は **Node.js v24 LTS** または **Node.js v22** ([ダウンロード](https://nodejs.org/)、または [nvm](https://github.com/nvm-sh/nvm) でのインストール)
- **VS Code** またはお好みのコードエディタ ([ダウンロード](https://code.visualstudio.com/))
- JavaScript とウェブ開発の基礎知識
- ウェブ地図の基本的な知識 (あると望ましいですが必須ではありません)

### タイムテーブル

ワークショップは 3 時間で、最初の 1 時間の後に 15 分の休憩があります。

| 時間 | 所要時間 | セクション |
|----------|----------|---------|
|14:00-14:15| 15 分 | [Terra Draw とは](./introduction.md) |
|14:15-14:30| 15 分 | [環境構築](./getting-started.md) |
|14:30-15:00| 30 分 | [Terra Draw の基本 - 演習 1 と 2](./basics/index.md) |
|15:00-15:15| 15 分 | 休憩 |
|15:15-15:35| 20 分 | [Terra Draw の基本 - 演習 3](./basics/exercise-3.md) |
|15:35-16:30| 55 分 | [応用機能 - 演習 4 から 7](./advanced/index.md) |
|16:30-16:45| 15 分 | [maplibre-gl-terradraw の紹介](./maplibre-gl-terradraw.md) |
|16:45-17:00| 15 分 | [他の地図ライブラリ](./other-libraries/index.md) と質疑応答 |

### ワークショップの教材

すべて 1 つのリポジトリにまとまっています: [watergis/terradraw-workshop](https://github.com/watergis/terradraw-workshop)

- **ドキュメントとライブエディタ** — 今ご覧になっているページです
- **ローカル用テンプレート** — 同じリポジトリの `template/` 以下にある SvelteKit のスターター

## はじめに

まずは Terra Draw がどういうものか、そして 2026 年の新機能を見ていきましょう。

[Terra Draw とは、から始める](./introduction.md)
