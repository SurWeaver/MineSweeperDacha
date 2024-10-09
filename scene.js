export class Scene {
	allActors = [];
	processingActors = [];
	drawableActors = [];

	addActor(actor) {
		this.allActors.push(actor);

		if ("process" in actor)
			this.processingActors.push(actor);

		if ("draw" in actor)
			this.drawableActors.push(actor);
	}

	removeActor(actor) {
		removeValueFromArrays(actor,
			this.allActors,
			this.processingActors,
			this.drawableActors);
	}


	process(deltaTime) {
		for (let i = 0; i < this.processingActors.length; i++)
			this.processingActors[i].process(deltaTime);
	}

	draw(ctx) {
		for (let i = 0; i < this.drawableActors.length; i++)
			this.drawableActors[i].draw(ctx);
	}

	mouseDownHandler(event) {
		let actor;
		for (let i = 0; i < this.allActors.length; i++) {
			actor = this.allActors[i];
			if ("mouseDown" in actor && typeof actor.mouseDown === "function")
				actor.mouseDown(event);
		}
	}
}


function removeValueFromArrays(value, ...arrays) {
	for (let i = 0; i < arrays.length; i++)
		removeValueFromArray(value, arrays[i]);
}

function removeValueFromArray(value, array) {
	let valueIndex = array.indexOf(value);
	if (valueIndex != -1)
		array.splice(valueIndex, 1);
}