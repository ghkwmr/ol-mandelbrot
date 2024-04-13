
import createMandelbrotCanvas from "./createMandelbrotCanvas.js";

//EPSG:3857の座標系でマンデルブロ集合を描くための拡大率と移動量
const scale = 1 / 20000000;
const shiftX = 0.08;

const canvasFunction = function (extent, resolution, pixelRatio, size, projection) {

	//表示条件
	const [width, height] = size.map(e => Math.floor(e));
	const bbox = extent.map(e => e * scale);
	bbox[0] += shiftX;
	bbox[2] += shiftX;
	
	//マンデルブロ集合を描いたcanvasを返す
	return createMandelbrotCanvas(width, height, bbox);
};


const layer = new ol.layer.Image({
	source: new ol.source.ImageCanvas({
		canvasFunction,
		ratio: 1,
		interpolate: false,
	}),
	opacity: 0.5,
});

const projection = "EPSG:3857";

const map = new ol.Map({
	target: "map",
	pixelRatio: 1,

	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM(),
			className: "basemap",
		}),
		layer,
	],

	view: new ol.View({
		center: ol.proj.fromLonLat([-180, 0], projection),
		zoom: 0,
		projection,
	}),
});