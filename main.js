import { game } from "./game.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let previousTime = 0, deltaTime = 0;


ctx.font = "bold 24px Comic Sans MS";
ctx.textBaseline = "top";

ctx.fillStyle = "white";


game.initialize(canvas, ctx);


function mainLoop(passedTime) {
	deltaTime = passedTime - previousTime;
	previousTime = passedTime;

	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	game.process(deltaTime);
	game.draw();

	requestAnimationFrame(mainLoop);
}


mainLoop(0);
