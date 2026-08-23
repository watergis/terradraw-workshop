# 1 つの API で、たくさんの地図ライブラリへ

このワークショップで学んだ内容は、すべて MapLibre GL JS を対象に書かれていました。しかし Terra Draw の最大の強みは、まったく同じコードが主要なウェブ地図ライブラリすべてで動くことです。変わるのは**アダプター**だけです。

| ライブラリ | アダプターのパッケージ | アダプターのクラス |
| --- | --- | --- |
| MapLibre GL JS | `terra-draw-maplibre-gl-adapter` | `TerraDrawMapLibreGLAdapter` |
| Leaflet | `terra-draw-leaflet-adapter` | `TerraDrawLeafletAdapter` |
| OpenLayers | `terra-draw-openlayers-adapter` | `TerraDrawOpenLayersAdapter` |
| Mapbox GL JS | `terra-draw-mapbox-gl-adapter` | `TerraDrawMapboxGLAdapter` |
| Google Maps JS API | `terra-draw-google-maps-adapter` | `TerraDrawGoogleMapsAdapter` |
| ArcGIS JS SDK | `terra-draw-arcgis-adapter` | `TerraDrawArcGISMapsSDKAdapter` |
| CesiumJS | `@watergis/terra-draw-cesium-adapter` | `TerraDrawCesiumAdapter` |

---

以下の各ページでは、演習で作ったものと同じ小さな描画アプリを、それぞれ別の地図ライブラリで、ブラウザ上で実際に動かしながら紹介します。

- **[Leaflet](./leaflet.md)** — ワークショップで一緒に取り組む、移行のハンズオン演習です。
- **[OpenLayers](./openlayers.md)**、**[Mapbox GL JS](./mapbox.md)**、**[Google Maps](./google-maps.md)**、**[ArcGIS Maps SDK](./arcgis.md)**、**[CesiumJS](./cesium.md)** — 完成済みのサンプルです。ワークショップの後、ご自身のペースで試してみてください。最後の 1 つは 3D 地球儀です。まったく同じ描画コードが、球体の上で動きます。

どの例でも、モード・スタイル・イベント・データ管理のコードは**まったく同一**です。変わるのは次の 3 か所だけです。

1. import 文
2. 地図の作り方
3. `new TerraDraw({ ... })` に渡すアダプター

## 次のステップ

まずは移行の演習から始めましょう: [Leaflet に切り替える](./leaflet.md)。
