export class GameDifficulty {
	constructor(width, height, bombCount) {
		this.width = width;
		this.height = height;
		this.bombCount = bombCount;

		if (getBombPercent() >= 1)
			throw Error("Wrong bomb count!");
	}

	getBombPercent() {
		return bombCount / width * height;
	}
}