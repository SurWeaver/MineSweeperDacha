import { GameDifficulty } from "../difficulty.js";

const CHANGER_TEXT = "Изменение своей сложности:";

const WIDTH = 360;
const HEIGHT = 80;

const BTN_DECR_WID = 0;
const BTN_INCR_WID = 1;
const BTN_DECR_HEI = 2;
const BTN_INCR_HEI = 3;
const BTN_DECR_BOM = 4;
const BTN_INCR_BOM = 5;

export default class DifficultyChanger {
	constructor(x, y, difficulty) {
		this.x = x;
		this.y = y;
		this.difficulty = difficulty;
	}

	draw(ctx) {
		let initialTransform = ctx.getTransform();
		ctx.translate(this.x, this.y);

		let initialAlign = ctx.textAlign;

		ctx.textAlign = "start";
		ctx.fillText(CHANGER_TEXT, 0, 0);

		ctx.textAlign = "center";

		ctx.fillText("ширина", 60, 30);
		ctx.fillText(`< ${this.difficulty.width} >`, 60, 60);

		ctx.fillText("высота", 180, 30);
		ctx.fillText(`< ${this.difficulty.height} >`, 180, 60);

		ctx.fillText("бомб", 300, 30);
		ctx.fillText(`< ${this.difficulty.bombCount} >`, 300, 60);

		ctx.textAlign = "start";
		ctx.fillText(`Заполненность поля: ${(this.difficulty.getBombPercent()*100).toFixed(2)}%`,
			0, HEIGHT + 20);

		let difficultyIsValid = this.difficulty.isValid();

		let initialStyle = ctx.fillStyle;

		ctx.fillStyle = difficultyIsValid ? "white" : "red";

		ctx.fillText(this.difficulty.isValid()
			? "Сложность валидна"
			: "Сложность инвалидна",
			0, HEIGHT + 50);

		ctx.setTransform(initialTransform);
		ctx.textAlign = initialAlign;
		ctx.fillStyle = initialStyle;
	}

	mouseDown(event) {
		if (event.x < this.x || event.x > this.x + WIDTH)
			return;
		if (event.y < this.y || event.y > this.y + HEIGHT)
			return;

		let normalizedX = event.x - this.x;

		let changePower = 0;
		// ЛКМ изменяет значение на 1
		if (event.buttons & 1)
			changePower += 1;
		// ПКМ изменяет значение на 10
		if (event.buttons & 2)
			changePower += 10;

		let buttonXSegment = Math.floor(normalizedX / 60);
		switch (buttonXSegment) {
		case BTN_DECR_WID:
			this.difficulty.width -= changePower;
			break;

		case BTN_INCR_WID:
			this.difficulty.width += changePower;
			break;

		case BTN_DECR_HEI:
			this.difficulty.height -= changePower;
			break;

		case BTN_INCR_HEI:
			this.difficulty.height += changePower;
			break;

		case BTN_DECR_BOM:
			this.difficulty.bombCount -= changePower;
			break;

		case BTN_INCR_BOM:
			this.difficulty.bombCount += changePower;
			break;
		}
	}

	getDifficulty() {
		if (this.difficulty.isValid())
			return this.difficulty;

		return null;
	}
}