import { Scene } from "./scene";

export const SCENE_MENU = 0;
export const SCENE_GAME = 1;


export const game = {
	ctx: null,
	cvs: null,
	currentScene: null,


	initialize: function(canvas, context) {
		this.cvs = canvas;
		this.ctx = context;

		this.bindInput();

		this.changeScene(SCENE_MENU);
	},

	bindInput: function() {
		this.cvs.addEventListener("mousedown", this.mouseDownHandler);
	},

	changeScene: function(scene) {
		switch (scene) {
		case SCENE_MENU:
			this.currentScene = new Scene();
			break;
		case SCENE_GAME:
			break;
		}
	},

	mouseDownHandler: function(event) {

	},

	afterFrameClear: function() {
		
	}
};