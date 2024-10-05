import { game } from "./game";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let previousTime = 0, deltaTime = 0;

ctx.fillStyle = "black";


game.initialize(canvas, ctx);


function mainLoop(passedTime) {
	deltaTime = passedTime - previousTime;
	previousTime = passedTime;

	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	game.process(deltaTime);
	game.draw(ctx);

	requestAnimationFrame(mainLoop);
}


mainLoop(0);
