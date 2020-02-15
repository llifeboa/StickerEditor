const canvas = document.querySelector('canvas');
canvas.height = 1000;
canvas.width = 1000;

const backImage = document.querySelector('#background');
const stickerImage = document.querySelector('#sticker');

const stickerEditor = StickerEditor()({
	canv: canvas,
	boundingColor: 'rgba(255, 255, 0, 1)',
	boundingWidth: 2,
	rotateSpeed: 0.1,
	scaleSpeed: 2,
});

const sticks = [
	{
		img: stickerImage,
		position: {
			x: 100,
			y: 100,
		},
		size: {
			width: 100,
			height: 100,
		},
		selected: false,
		angle: 0,
		zIndex: 0,
	},
	{
		img: stickerImage,
		position: {
			x: 130,
			y: 100,
		},
		size: {
			width: 100,
			height: 100,
		},
		selected: false,
		angle: 0,
		zIndex: 2,
	},
];

for (sticker of sticks) stickerEditor.addStiker(sticker);

function render() {
	stickerEditor.drawBackground(backImage);
	stickerEditor.drawStickers();
	requestAnimationFrame(render, canvas);
}

render();
