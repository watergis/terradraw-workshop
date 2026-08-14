# Terra Draw チュートリアル

![](./assets/images/logo.png)

このチュートリアルでは、あらゆる地図アプリケーションで使えるクロスプラットフォームの描画ライブラリ [Terra Draw](https://github.com/JamesLMilner/terra-draw) の使い方を紹介します。

## 概要

Terra Draw は、統一された API を通じて、独自のモードによる描画機能をあらゆる地図ライブラリに追加できます。

### 対応ライブラリ

Terra Draw は「アダプター」という仕組みによって、さまざまな地図ライブラリで動作します。現在対応しているライブラリは次のとおりです。

|  ライブラリ                                                                                    | 対応バージョン |           npm パッケージ            |
|---------------------------------------------------------------------------------------------|-------------------|----------------------------------|
|  [Leaflet](https://leafletjs.com/)                                                          |        v1         | terra-draw-leaflet-adapter       |
|  [OpenLayers](https://openlayers.org/)                                                      |        v10        | terra-draw-openlayers-adapter    |
|  [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)                                |    v4, v5, v6     | terra-draw-maplibre-gl-adapter   |
|  [Google Maps JS API](https://developers.google.com/maps/documentation/javascript/overview) |        v3         | terra-draw-google-maps-adapter   |
|  [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs)                                         |        v3         | terra-draw-mapbox-gl-adapter     |
|  [ArcGIS JavaScript SDK](https://developers.arcgis.com/javascript/latest/)                  |        v4         | terra-draw-arcgis-adapter        |

### プロジェクトのウェブサイト

Terra Draw の公式ウェブサイトは [terradraw.io](https://www.terradraw.io/) です。ウェブサイトへの貢献に興味がある方は [GitHub リポジトリ](https://www.github.com/JamesLMilner/terra-draw-website) をご覧ください。

## コンテンツ

- [ワークショップ](./workshops/index.md) - FOSS4G カンファレンスで実施したハンズオン教材
- [発表資料](./presentations/index.md) - カンファレンスでの講演とスライド
