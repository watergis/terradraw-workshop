# CesiumJS

[CesiumJS](https://cesium.com/platform/cesiumjs/) は 3D 地球儀です。このセクションで唯一の平面ではない地図ですが、Terra Draw のコードはこれまでとまったく同じです。平面の代わりに地球儀の上に描くだけで、変わるのはアダプターだけです。アダプターは [`@watergis/terra-draw-cesium-adapter`](https://github.com/watergis/terra-draw-cesium-adapter) で、Terra Draw 本体のリポジトリの外にある出来立ての新しいパッケージです。

ローカルで使う場合は次のようにインストールします。

```bash
pnpm install -D cesium @watergis/terra-draw-cesium-adapter
```

!!! warning "Cesiumアダプターはベータ版です"
	Cesiumアダプターは、FOSS4G 2026に先立ち、つい数日前にリリースされたばかりの新しいパッケージであり、APIが変更される可能性があります。問題を見つけた場合は、[Issueを登録](https://github.com/watergis/terra-draw-cesium-adapter/issues)してください。

	また、このアダプターへの貢献（機能追加やバグ修正のためのプルリクエストなど）も歓迎します。本アダプターはオープンソースであり、MITライセンスの下で公開されています。


## MapLibre との違い

### 1. import 文

アダプターが Cesium を `lib` として受け取るため、名前空間ごと import します。

```ts
import * as Cesium from 'cesium';
import { TerraDrawCesiumAdapter } from '@watergis/terra-draw-cesium-adapter';
```

### 2. 地図の作成

Cesium では地図を `Viewer` と呼びます。画像と地形は [Cesium ion](https://ion.cesium.com/) から配信されるため、アクセストークンが必要です。ビューアーにはホームボタン・シーンモード切替 (3D / 2D / コロンバスビュー)・ベースマップ選択・操作ヘルプ・タイムラインといったコントローラーが標準で付属しており、既定ですべて表示されます。

```ts
Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_ACCESS_TOKEN';

const viewer = new Cesium.Viewer('map', {
	terrain: Cesium.Terrain.fromWorldTerrain(),
	infoBox: false,
	selectionIndicator: false,
	geocoder: false
});

viewer.camera.setView({
	destination: Cesium.Cartesian3.fromDegrees(132.4553, 34.28, 25000),
	orientation: {
		heading: 0,
		pitch: Cesium.Math.toRadians(-50),
		roll: 0
	}
});
```

!!! info "このライブエディタでのトークンについて"
    以下のサンプルは、このサイトのビルド時にトークンが埋め込まれることを前提としています (ローカルでは `.env` に `CESIUM_ION_ACCESS_TOKEN` を設定して `uv run python scripts/generate_keys.py` を実行します。Cloudflare Pages ではビルド用の環境変数から取得します)。トークンが指定されていない場合は、地球儀の代わりに通知が表示されます。ion の無料アカウントを作れば既定のトークンが発行されます ([こちらから作成](https://ion.cesium.com/tokens))。

!!! warning "ズームレベルではなくカメラの高さ"
    Cesium に `zoom` レベルはありません。カメラは 3D 空間に配置するため、`Cartesian3.fromDegrees(lng, lat, height)` の高さは**メートル単位**です (ここでは市街地の南側、上空 25 km)。`orientation.pitch` で 50 度見下ろすように傾け、地形が見えるようにしています。座標の順序は `[lng, lat]` で、Leaflet とは違い MapLibre と同じです。

!!! note "オフにしているウィジェット"
    オフにしているのは 3 つだけで、それぞれ理由があります。`infoBox` と `selectionIndicator` は地物のクリックに反応するため描画操作と衝突し、`geocoder` (検索) はトークンに `geocode` スコープが必要です。それ以外は Cesium の既定のままです。シーンモード切替を使うと、同じコードのまま 2D と 3D の両方で描けることが確かめられます。

### 3. アダプター — と描画開始のタイミング

アダプター自身は Cesium を import しません。名前空間を `lib` で注入し、`map` には**ビューアー**を渡します。

```ts
adapter: new TerraDrawCesiumAdapter({
	map: viewer,
	lib: Cesium
})
```

Cesium の `Viewer` は生成した時点ですぐ使えるため、MapLibre と違って読み込み完了イベントを待つ必要はありません。

```ts
draw.start();
```

!!! note "3D ならではの挙動"
    - すべての地物は Cesium のエンティティとして**地表にクランプ**して描画されるため、画像に沿って貼り付き、地形の起伏にも追従します。視点を傾けると、ポリゴンが斜面に沿って曲がる様子が分かります。Terra Draw の `zIndex` スタイルが効くのもこのためです。Cesium はクランプされたジオメトリでのみ `zIndex` を考慮します。
    - キーボード操作 (`Escape` で描画のキャンセル、`Delete` で選択地物の削除) は Cesium のキャンバスにフォーカスがある場合のみ効くため、まず地球儀を一度クリックしてください。
    - `setDoubleClickToZoom` は何もしません。Cesium にはダブルクリックでズームする機能がなく、代わりにダブルクリックで地物を追尾する既定の動作がダブルクリックでの描画終了と衝突するため、アダプターがそれを解除しています。
    - ローカルのプロジェクトでは、Cesium の静的アセット (`Workers/`、`Assets/`、`Widgets/`) をバンドルと一緒に配信する必要があります。`vite-plugin-cesium` を使うか、自分でコピーして `window.CESIUM_BASE_URL` を設定してください。

## 動くサンプル

<terra-draw-editor start="../../code/other-libraries/cesium/start.ts" lib="cesium" boilerplate="none" height="480"></terra-draw-editor>

## 次のステップ

ハンズオンの内容はこれで終わりです。7 つの地図ライブラリを、2D も 3D も 1 つの Terra Draw API で扱ってきました。Terra Draw コミュニティとのつながり方については、[質疑応答のページ](../support.md) をご覧ください。
