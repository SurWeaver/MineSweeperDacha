export class GameDifficulty {
	constructor(width, height, bombCount) {
		this.width = width;
		this.height = height;
		this.bombCount = bombCount;

		if (this.getBombPercent() >= 1)
			throw Error("Wrong bomb count!");
	}

	getBombPercent() {
		return this.bombCount / (this.width * this.height);
	}

	isValid() {
		let percent = this.getBombPercent();
		return this.width >= 1 && this.height >= 1 &&
			percent > 0 && percent < 1.0;
	}
}


export const DEFAULT_DIFFICULTIES = [
	new GameDifficulty(9, 9, 10),
	new GameDifficulty(16, 16, 40),
	new GameDifficulty(30, 16, 99)
];

export const DIF_BEGINNER = 0;
export const DIF_INTERMEDIATE = 1;
export const DIF_EXPERT = 2;
export const DIF_CUSTOM = 3;

export const DIF_NAME = [
	"Новичок",
	"Любитель",
	"Профессионал",
	"Своя"
];
