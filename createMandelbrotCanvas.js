
//色付け方法
import ColorMap from "./ColorMap.js";
const cmap = new ColorMap(0, 32, [0x000000, 0xffffff, 0x000000]);


//各ピクセルの収束判定
const mandelbrot = function (x, y) {
	let xn = 0;
	let yn = 0;

	for (let i = 0; i < 256; i++) {
		const xn1 = xn * xn - yn * yn + x;
		const yn1 = 2 * xn * yn + y;
		xn = xn1;
		yn = yn1;

		if (xn * xn + yn * yn > 4) return 255 - i;
	}

	return 0;
};

export default function (width, height, bbox) {

	//座標変換
	const kx = (bbox[2] - bbox[0]) / width;
	const ky = (bbox[3] - bbox[1]) / height;
	const getX = i => bbox[0] + i * kx;
	const getY = j => bbox[3] - j * ky;

	//描画用canvas
	const cv = document.createElement("canvas");
	cv.width = width;
	cv.height = height;
	const ctx = cv.getContext("2d");

	//各ピクセルの処理
	const data = ctx.getImageData(0, 0, width, height);

	for (let j = 0; j < height; j++) {
		for (let i = 0; i < width; i++) {
			const index = (i + j * width) * 4;

			const x = getX(i);
			const y = getY(j);

			const z = mandelbrot(x, y);
			const c = cmap.get(z % 32);

			data.data.set([c.r, c.g, c.b, 255], index);
		}
	}

	ctx.putImageData(data, 0, 0);
	return cv;
}