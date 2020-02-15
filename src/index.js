const canvas = document.querySelector('canvas');
canvas.height = 1000;
canvas.width = 1000;

const backImage = document.querySelector('#background');
const stickerImage = document.querySelector('#sticker');


const video = document.querySelector('video');

navigator.getUserMedia(
	{video: true},
	(stream) => {
		video.srcObject = stream;
		video.play();
	},
	(err) => {
		console.log(err);
	}
);

const stickerEditor = StickerEditor()({
	canv: canvas,
	boundingColor: 'rgba(255, 255, 0, 1)',
	boundingWidth: 2,
	rotateSpeed: 0.2,
	scaleSpeed: 3,
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
	stickerEditor.drawBackground(video);
	stickerEditor.drawStickers();
	requestAnimationFrame(render, canvas);
}

render();
