const CELL_IMG = new Image();
CELL_IMG.src = "images/cell_types.png";
export const ITEM_IMG = new Image();
ITEM_IMG.src = "images/cell_items.png";


export const CELL_SIZE = 24;

const NUMBER_OFFSET_X = 5;
const NUMBER_OFFSET_Y = 3;

const IMG_CELL_CLOSED = 0;
const IMG_CELL_OPENED = 1;
const IMG_CELL_ACTIVATED = 2;

const IMG_ITEM_FLAG = 0;
const IMG_ITEM_BOMB = 1;
const IMG_ITEM_CROSS = 2;
const IMG_ITEM_ACTIVATED_BOMB = 3;

export const STATE_CLOSED = 0;
export const STATE_FLAGGED = 1;
export const STATE_OPENED = 2;

const NUMBER_COLOR = {
	1: "#00F",
	2: "#008000",
	3: "#F00",
	4: "#000080",
	5: "#800000",
	6: "#008080",
	7: "#000",
	8: "#808080",
}


export default class Cell {
	state = STATE_CLOSED;
	x = 0;
	y = 0;
	bombed = false;
	bombCount = 0;
	highlight = false;

	constructor(x, y, bombed) {
		this.x = x;
		this.y = y;
		this.bombed = bombed;
	}

	incrementBomb() {
		this.bombCount++;
	}

	draw(ctx) {
		switch (this.state) {
		case STATE_CLOSED:
			this.drawCellImage(IMG_CELL_CLOSED, ctx);
			break;

		case STATE_FLAGGED:
			this.drawCellImage(IMG_CELL_CLOSED, ctx);
			this.drawItemImage(IMG_ITEM_FLAG, ctx);
			break;

		case STATE_OPENED:
			this.drawCellImage(IMG_CELL_OPENED, ctx);

			if (this.bombed) {
				this.drawItemImage(IMG_ITEM_BOMB, ctx);
			} else if (this.bombCount) {
				ctx.fillStyle = NUMBER_COLOR[this.bombCount];
				ctx.fillText(this.bombCount,
					this.x * CELL_SIZE + NUMBER_OFFSET_X,
					this.y * CELL_SIZE + NUMBER_OFFSET_Y);
			}
		}
	}

	drawWhenGameOver(ctx) {
		switch (this.state) {
		case STATE_CLOSED:
			if (this.bombed) {
				this.drawCellImage(IMG_CELL_OPENED, ctx);
				this.drawItemImage(IMG_ITEM_BOMB, ctx);
			} else {
				this.drawCellImage(IMG_CELL_CLOSED, ctx);
			}
			break;

		case STATE_FLAGGED:
			if (this.bombed) {
				this.drawCellImage(IMG_CELL_CLOSED, ctx);
				this.drawItemImage(IMG_ITEM_FLAG, ctx);
			} else {
				this.drawCellImage(IMG_CELL_OPENED, ctx);
				this.drawItemImage(IMG_ITEM_BOMB, ctx);
				this.drawItemImage(IMG_ITEM_CROSS, ctx);
			}
			break;

		case STATE_OPENED:
			if (this.bombed) {
				this.drawCellImage(IMG_CELL_ACTIVATED, ctx);
				this.drawItemImage(IMG_ITEM_ACTIVATED_BOMB, ctx);
			} else {
				this.drawCellImage(IMG_CELL_OPENED, ctx);
				if (this.bombCount) {
					ctx.fillStyle = NUMBER_COLOR[this.bombCount];
					ctx.fillText(this.bombCount,
						this.x * CELL_SIZE + NUMBER_OFFSET_X,
						this.y * CELL_SIZE + NUMBER_OFFSET_Y);

				}
			}
			break;
		}
	}

	drawCellImage(frame, ctx) {
		this.drawImage(CELL_IMG, frame, ctx);
	}

	drawItemImage(frame, ctx) {
		this.drawImage(ITEM_IMG, frame, ctx);
	}

	drawImage(image, frame, ctx) {
		ctx.drawImage(image, CELL_SIZE * frame, 0,
		CELL_SIZE, CELL_SIZE,
		this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	}


	toggleFlag() {
		if (this.state == STATE_CLOSED)
			this.state = STATE_FLAGGED;
		else if (this.state == STATE_FLAGGED)
			this.state = STATE_CLOSED;
	}
}
