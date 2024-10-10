export default class Timer {
	playing = false;
	time = 0;
	timeString = "0";

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	start() {
		this.playing = true;
	}

	stop() {
		this.playing = false;
	}

	process(deltaTime) {
		if (this.playing) {
			this.time += deltaTime;
			this.timeString = Math.floor(this.time / 1000);
		}
	}

	draw(ctx) {
		let initialAlign = ctx.textAlign;

		ctx.textAlign = "right"
		ctx.fillText(this.timeString, this.x, this.y);


		ctx.textAlign = initialAlign;
	}
}
