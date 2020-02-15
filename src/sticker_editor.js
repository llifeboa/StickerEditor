function StickerEditor() {
	let canvas;
	let canvasRect;
	let ctx;
	let stickers = [];
	let selectedSticker = null;
	let rightMousePress = false;

	return function({
		canv,
		boundingColor,
		boundingWidth,
		rotateSpeed,
		scaleSpeed,
	}) {
		canvas = canv;
		ctx = canvas.getContext('2d');
		canvasRect = canvas.getBoundingClientRect();

		function drawSticker({ img, position, selected, size, angle }) {
			ctx.save();
			ctx.translate(position.x, position.y);
			ctx.rotate(angle);
			if (selected) {
				ctx.strokeStyle = boundingColor;
				ctx.lineWidth = boundingWidth;
				ctx.strokeRect(
					-(size.width / 2) - boundingWidth,
					-(size.height / 2) - boundingWidth,
					size.width + boundingWidth,
					size.height + boundingWidth
				);
			}
			ctx.drawImage(
				img,
				-(size.width / 2),
				-(size.height / 2),
				size.width,
				size.height
			);
			ctx.restore();
		}

		function stickersSort() {
			stickers = stickers.sort((a, b) => {
				return b.zIndex - a.zIndex;
			});
		}

		function dot(vec1, vec2) {
			return vec1[0] * vec2[0] + vec1[1] * vec2[1];
		}
		function checkPoint(x, y, x0, y0, x1, y1, x2, y2) {
			const vecMain = [x - x0, y - y0];
			const vec1 = [x1 - x0, y1 - y0];
			const vec2 = [x2 - x0, y2 - y0];
			const vec1Length = Math.sqrt(dot(vec1, vec1));
			const vec2Length = Math.sqrt(dot(vec2, vec2));
			const projection1 = dot(vec1, vecMain) / vec1Length;
			const projection2 = dot(vec2, vecMain) / vec2Length;
			if (
				projection1 >= 0 &&
				projection1 <= vec1Length &&
				projection2 >= 0 &&
				projection2 <= vec2Length
			) {
				return true;
			} else {
				return false;
			}
		}

		function rotatePoint(x, y, angle, posX, posY) {
			const sin = Math.sin(angle);
			const cos = Math.cos(angle);
			return [cos * x - sin * y + posX, sin * x + cos * y + posY];
		}

		function selectStiker(x, y) {
			for (sticker of stickers) {
				let v0 = [-sticker.size.width / 2, -sticker.size.height / 2];
				let v1 = [sticker.size.width / 2, -sticker.size.height / 2];
				let v2 = [-sticker.size.width / 2, sticker.size.height / 2];
				v0 = rotatePoint(
					...v0,
					sticker.angle,
					sticker.position.x,
					sticker.position.y
				);
				v1 = rotatePoint(
					...v1,
					sticker.angle,
					sticker.position.x,
					sticker.position.y
				);
				v2 = rotatePoint(
					...v2,
					sticker.angle,
					sticker.position.x,
					sticker.position.y
				);
				if (checkPoint(x, y, ...v0, ...v1, ...v2)) {
					if (selectedSticker) selectedSticker.selected = false;
					selectedSticker = sticker;
					selectedSticker.selected = true;
					break;
				}
			}
		}

		canvas.addEventListener('click', e => {
			const x = e.clientX - canvasRect.left;
			const y = e.clientY - canvasRect.top;
			if (selectedSticker != null) {
				selectedSticker.selected = false;
				selectedSticker = null;
			} else selectStiker(x, y);
		});

		canvas.addEventListener('mousemove', e => {
			if (selectedSticker != null) {
				const x = e.clientX - canvasRect.left;
				const y = e.clientY - canvasRect.top;
				selectedSticker.position.x = x;
				selectedSticker.position.y = y;
			}
		});

		canvas.addEventListener('mousedown', e => {
			if (e.which === 3) rightMousePress = true;
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		});

		canvas.addEventListener('mouseup', e => {
			if (e.which === 3) rightMousePress = false;
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		});
		window.oncontextmenu = e => {
			return e.preventDefault
				? e.preventDefault()
				: (e.returnValue = false);
		};
		function onWheel(e) {
			dir = e.deltaY > 0 ? 1 : -1;
			if (selectedSticker !== null)
				if (!rightMousePress)
					selectedSticker.angle += rotateSpeed * -dir;
				else {
					selectedSticker.size.width +=
						(selectedSticker.size.width /
							selectedSticker.size.height) *
						dir *
						scaleSpeed;
					selectedSticker.size.height += dir * scaleSpeed;
					if (selectedSticker.size.width < 0)
						selectedSticker.size.width = 0;
					if (selectedSticker.size.height < 0)
						selectedSticker.size.height = 0;
				}
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		}

		if (canvas.addEventListener) {
			if ('onwheel' in document) {
				canvas.addEventListener('wheel', onWheel);
			} else if ('onmousewheel' in document) {
				canvas.addEventListener('mousewheel', onWheel);
			} else {
				canvas.addEventListener('MozMousePixelScroll', onWheel);
			}
		} else {
			canvas.attachEvent('onmousewheel', onWheel);
		}

		window.addEventListener('keydown', e => {
			if (e.keyCode == 27) {
				selectedSticker.selected = false;
				selectedSticker = null;
			}
		});

		return {
			drawBackground(img) {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			},

			addStiker(sticker) {
				stickers.push(sticker);
				stickersSort();
			},

			drawStickers() {
				for (let i = stickers.length - 1; i >= 0; i--)
					if (stickers[i]) drawSticker(stickers[i]);
			},
		};
	};
}
