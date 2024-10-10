const OFFSET = 12;

const BUTTON_HEIGHT = 20 + 2 * OFFSET;

export default class StartGameButton {
	buttonWidth = OFFSET * 2;


	constructor(name, difficulty, x, y, action) {
		this.name = name;
		this.difficulty = difficulty;
		this.x = x;
		this.y = y;

		this.action = action;
	}

	draw(ctx) {
		let initialTransform = ctx.getTransform();

		ctx.translate(this.x, this.y);

		ctx.textBaseline = "top";
		ctx.textAlign = "start";

		let info = this.name;
		info += ` ${this.difficulty.width}×${this.difficulty.height}`;
		info += ` 💣: ${this.difficulty.bombCount}`;
		info += ` Плотность: ${Math.floor(this.difficulty.getBombPercent()*100)}%`;

		let infoMeasure = ctx.measureText(info);

		this.buttonWidth = infoMeasure.width + 2 * OFFSET;

		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, this.buttonWidth, BUTTON_HEIGHT);

		ctx.fillText(info, OFFSET, OFFSET);

		ctx.setTransform(initialTransform);
	}

	mouseDown(event) {
		if (!event.inRect(this.x, this.y, this.buttonWidth, BUTTON_HEIGHT))
			return;

		if (!event.isLeft())
			return;

		if (this.action && typeof this.action == "function")
			this.action();
	}
}