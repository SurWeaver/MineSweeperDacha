export default class InGameMenu {
	constructor(x, y, menuAction, restartAction) {
		this.x = x;
		this.y = y;
		this.menuAction = menuAction;
		this.restartAction = restartAction;
	}

	draw(ctx) {
		let initialAlign = ctx.textAlign;
		let initialBaseline = ctx.textBaseline;

		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		ctx.fillText("🔙🔄", this.x, this.y);

		ctx.textAlign = initialAlign;
		ctx.textBaseline = initialBaseline;
	}

	mouseDown(event) {
		if (!event.inRect(this.x - 32, this.y, 60, 20))
			return;

		let x = event.x - this.x;

		if (x > 0)
			this.restartAction();
		else if (x < 0)
			this.menuAction();
	}
}
