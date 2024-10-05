export class Scene {
	processingActors = [];
	drawableActors = [];
	mouseDownActors = [];

	addActor(actor) {
		if ("draw" in actor)
			this.drawableActors.push(actor);

		if ("process" in actor)
			this.processingActors.push(actor);

		if ("mouseDownHandler" in actor)
			this.mouseDownActors.push(actor);
	}

	removeActor(actor) {
		removeValueFromArrays(actor,
			this.drawableActors,
			this.processingActors,
			this.mouseDownActors);
	}


	process(deltaTime) {
		this.processingActors.forEach((actor) => {
			actor.process(deltaTime)
		});
	}

	draw(ctx) {
		this.drawableActors.forEach((actor) => {
			actor.draw(ctx);
		})
	}

	mouseDownHandler(event) {

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