import { CELL_SIZE, ITEM_IMG } from "./cell.js";

export default class FlagCounter {
	constructor(x, y, bombCount, field) {
		this.x = x;
		this.y = y;
		this.bombCount = bombCount;
		this.field = field;
	}

	draw(ctx) {
		ctx.drawImage(ITEM_IMG, 0, 0, CELL_SIZE, CELL_SIZE,
			this.x, this.y - 3, CELL_SIZE, CELL_SIZE);

		ctx.fillText(this.bombCount - this.field.flagCount, this.x + CELL_SIZE, this.y);
	}
}
