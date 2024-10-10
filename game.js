import { DEFAULT_DIFFICULTIES, DIF_BEGINNER, DIF_NAME, GameDifficulty } from "./difficulty.js";
import DifficultyChanger from "./gameObjects/difficulty_changer.js";
import Field from "./gameObjects/field.js";
import FlagCounter from "./gameObjects/flag_counter.js";
import GameStateString from "./gameObjects/game_state_string.js";
import StartGameButton from "./gameObjects/start_game_button.js";
import Timer from "./gameObjects/timer.js";
import { Scene } from "./scene.js";
import ShortMouseEvent from "./short_mouse_event.js";

export const SCENE_MENU = 0;
export const SCENE_GAME = 1;

const FIELD_H_OFFSET = 12;
const FIELD_V_OFFSET = 30;


export const game = {
	ctx: null,
	cvs: null,
	currentScene: null,

	customDifficulty: null,
	selectedDifficulty: DEFAULT_DIFFICULTIES[DIF_BEGINNER],

	initialCanvasSize: null,


	initialize: function(canvas, context) {
		this.cvs = canvas;
		this.ctx = context;

		this.bindInput();
		this.resetContext();

		this.loadCustomDifficulty();

		this.initialCanvasSize = {
			x: canvas.width,
			y: canvas.height
		};

		this.changeScene(SCENE_MENU);
	},

	bindInput: function() {
		this.cvs.addEventListener("mousedown", (event) => this.mouseDownHandler(event));
	},

	resetContext: function() {
		this.ctx.font = "bold 24px Comic Sans MS";
		this.ctx.textBaseline = "top";
		this.ctx.fillStyle = "white";
	},

	loadCustomDifficulty: function() {
		let width = Number(localStorage.getItem("customWidth"));
		let height = Number(localStorage.getItem("customHeight"));
		let bomb = Number(localStorage.getItem("customBomb"));

		if (width != 0 && height != 0 && bomb != 0)
			this.customDifficulty = new GameDifficulty(width, height, bomb);
		else
			this.customDifficulty = new GameDifficulty(9, 9, 10);
	},

	changeScene: function(scene) {
		if (this.currentScene)
			delete this.currentScene;

		switch (scene) {
		case SCENE_MENU:
			this.currentScene = new Scene();

			for (let i = 0; i < DEFAULT_DIFFICULTIES.length; i++)
				this.currentScene.addActor(
					new StartGameButton(DIF_NAME[i], DEFAULT_DIFFICULTIES[i], 20, 20 + i * 60,
						() => {
							this.selectedDifficulty = DEFAULT_DIFFICULTIES[i];
							this.changeScene(SCENE_GAME);
						})
					);

			this.currentScene.addActor(
				new StartGameButton("Своя", this.customDifficulty, 20, 200,
					() => {
						if (!this.customDifficulty.isValid())
							return;

						this.selectedDifficulty = this.customDifficulty;
						this.changeScene(SCENE_GAME);
					}
				)
			);

			this.currentScene.addActor(new DifficultyChanger(20, 300, this.customDifficulty));
			
			this.cvs.width = this.initialCanvasSize.x;
			this.cvs.height = this.initialCanvasSize.y;
			break;

		case SCENE_GAME:
			this.currentScene = new Scene();

			let field = new Field(this.selectedDifficulty, [FIELD_H_OFFSET, FIELD_V_OFFSET]);
			field.createNewField();
			this.currentScene.addActor(field);

			let timer = new Timer(field.fieldPixelSize.x + FIELD_H_OFFSET, 6);
			field.setTimer(timer);
			this.currentScene.addActor(timer);

			let flagCounter = new FlagCounter(FIELD_H_OFFSET, 6, this.selectedDifficulty.bombCount, field);
			this.currentScene.addActor(flagCounter);

			let gameStateString = new GameStateString(field, timer,
				FIELD_H_OFFSET + field.fieldPixelSize.x / 2,
				FIELD_V_OFFSET * 1.5 + field.fieldPixelSize.y);
			this.currentScene.addActor(gameStateString);

			this.cvs.width = field.fieldPixelSize.x + FIELD_H_OFFSET * 2;
			this.cvs.height = field.fieldPixelSize.y + FIELD_V_OFFSET * 2;
			break;
		}

		this.resetContext();
	},

	mouseDownHandler: function(event) {
		let newEvent = getShortMouseEvent(this.cvs, event);
		this.currentScene.mouseDownHandler(newEvent);
	},

	process: function(deltaTime) {
		this.currentScene.process(deltaTime);
	},

	draw: function() {
		this.currentScene.draw(this.ctx);
	}
};


function getShortMouseEvent(canvas, mouseEvent) {
	let rect = canvas.getBoundingClientRect();

	return new ShortMouseEvent(
		Math.floor(mouseEvent.clientX - rect.left),
		Math.floor(mouseEvent.clientY - rect.top),
		mouseEvent.buttons);
}
