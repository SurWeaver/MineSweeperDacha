export default class ShortMouseEvent {
	constructor(x, y, buttons) {
		this.x = x;
		this.y = y;
		this.buttons = buttons;
	}

	isLeft() {
		return ~~(this.buttons & 1);
	}

	isRight() {
		return ~~(this.buttons & 2);
	}

	inRect(x, y, width, height) {
		return this.x >= x && this.x <= x + width &&
			this.y >= y && this.y <= y + height;
	}
}