import { DEFAULT_DIFFICULTIES, DIF_BEGINNER, DIF_NAME, GameDifficulty } from "./difficulty.js";
import DifficultyChanger from "./gameObjects/difficulty_changer.js";
import Field from "./gameObjects/field.js";
import StartGameButton from "./gameObjects/start_game_button.js";
import { Scene } from "./scene.js";

export const SCENE_MENU = 0;
export const SCENE_GAME = 1;


export const game = {
	ctx: null,
	cvs: null,
	currentScene: null,

	customDifficulty: new GameDifficulty(9, 9, 10),
	selectedDifficulty: DEFAULT_DIFFICULTIES[DIF_BEGINNER],


	initialize: function(canvas, context) {
		this.cvs = canvas;
		this.ctx = context;

		this.bindInput();

		this.changeScene(SCENE_MENU);
	},

	bindInput: function() {
		this.cvs.addEventListener("mousedown", (event) => this.mouseDownHandler(event));
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
			
			break;

		case SCENE_GAME:
			break;
		}
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

	return {
		x: Math.floor(mouseEvent.clientX - rect.left),
		y: Math.floor(mouseEvent.clientY - rect.top),
		buttons: mouseEvent.buttons
	};
}
