import { GAME_FINISHED, GAME_INITIALIZED, GAME_STARTED } from "./field.js";

export default class GameStateString {
	constructor(field, timer, x, y) {
		this.field = field;
		this.timer = timer;
		this.x = x;
		this.y = y;
	}

	draw(ctx) {
		switch (this.field.gameState) {
		case GAME_INITIALIZED:
		case GAME_STARTED:
			return;
		}

		let initialAlign = ctx.textAlign;
		let initialBaseline = ctx.textBaseline;
		let initialStyle = ctx.fillStyle;

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		if (this.field.gameState == GAME_FINISHED)
			ctx.fillStyle = "green";
		else
			ctx.fillStyle = "red";

		ctx.fillText(`Время: ${this.timer.getTime()} c.`, this.x, this.y);

		ctx.textAlign = initialAlign;
		ctx.textBaseline = initialBaseline;
		ctx.fillStyle = initialStyle;
	}
}
