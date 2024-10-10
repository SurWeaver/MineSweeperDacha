import Cell, { CELL_SIZE, STATE_CLOSED, STATE_FLAGGED, STATE_OPENED } from "./cell.js";
import { random } from "./random.js";


const GAME_INITIALIZED = 0;
const GAME_STARTED = 1;
const GAME_FINISHED = 2;
const GAME_OVER = 3;

export default class Field {
	cells = [];
	difficulty = null;
	offset = [0, 0];
	fieldPixelSize = { x: 0, y: 0 };
	timer = null;
	flagCount = 0;
	openedCount = 0;
	disabled = false;

	drawCellFunction = null;

	gameState = GAME_INITIALIZED;

	constructor(difficulty, offset) {
		this.drawCellFunction = this.drawUsualCells;
		if (!difficulty.isValid())
			throw Error("Invalid difficulty!");

		this.difficulty = difficulty;
		this.offset = offset;

		this.fieldPixelSize = {
			x: this.difficulty.width * CELL_SIZE,
			y: this.difficulty.height * CELL_SIZE
		};

		this.emptyCellCount = difficulty.width * difficulty.height - difficulty.bombCount;
	}

	setTimer(timer) {
		this.timer  = timer;
	}

	createNewField() {
		let bombIndices = this.getBombIndices(this.difficulty);
		this.setCellsAndBombs(bombIndices);
		this.countBombs(bombIndices);
	}

	getBombIndices(difficulty) {
		let indices = Array(difficulty.width * difficulty.height);
		for (let i = 0; i < indices.length; i++)
			indices[i] = i;

		let bombIndices = [];

		let bombLeft = difficulty.bombCount;

		while (bombLeft > 0) {
			let randomIndex = random(0, indices.length - 1);
			bombIndices.push(indices[randomIndex]);

			indices.splice(randomIndex, 1);

			bombLeft--;
		}

		return bombIndices;
	}


	setCellsAndBombs(bombIndices) {
		let i = 0;

		this.cells = Array(this.difficulty.height);
		for (let y = 0; y < this.difficulty.height; y++) {
			this.cells[y] = Array(this.difficulty.width);

			for (let x = 0; x < this.difficulty.width; x++) {
				let hasBomb = bombIndices.indexOf(i) != -1;
				this.cells[y][x] = new Cell(x, y, hasBomb);
				
				i++;
			}
		}
	}

	countBombs(bombIndices) {
		for (let i = 0; i < bombIndices.length; i++) {
			let bombCoordinate = this.getPointByIndex(bombIndices[i]);
			let neighborPoints = this.getNeighborPoints(bombCoordinate);

			let cell;
			for (let j = 0; j < neighborPoints.length; j++) {
				cell = this.getCell(neighborPoints[j]);
				cell.incrementBomb();
			}
		}
	}

	getCell(point) {
		return this.cells[point.y][point.x];
	}

	getPointByIndex(index) {
		return {
			x: index % this.difficulty.width,
			y: Math.floor(index / this.difficulty.width)
		};
	}

	getNeighborPoints(point) {
		let minX = Math.max(0, point.x - 1);
		let maxX = Math.min(this.difficulty.width - 1, point.x + 1);

		let minY = Math.max(0, point.y - 1);
		let maxY = Math.min(this.difficulty.height - 1, point.y + 1);

		let neighborPoints = [];

		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {
				if (x == point.x && y == point.y)
					continue;

				neighborPoints.push({ x: x, y: y });
			}
		}

		return neighborPoints;
	}

	getNeighborsByFilter(point, filter) {
		let points = this.getNeighborPoints(point);

		let filteredCells = [];
		let cell;

		for (let i = 0; i < points.length; i++) {
			cell = this.getCell(points[i]);
			if (!filter || filter(cell))
				filteredCells.push(cell);
		}

		return filteredCells;
	}


	draw(ctx) {
		let initialTransform = ctx.getTransform();
		let initialStyle = ctx.fillStyle;

		ctx.translate(...this.offset);

		this.drawCellFunction(ctx);

		ctx.setTransform(initialTransform);
		ctx.fillStyle = initialStyle;
	}

	drawUsualCells(ctx) {
		for (let y = 0; y < this.difficulty.height; y++)
			for (let x = 0; x < this.difficulty.width; x++)
				this.cells[y][x].draw(ctx);
	}

	drawGameOverCells(ctx) {
		for (let y = 0; y < this.difficulty.height; y++)
			for (let x = 0; x < this.difficulty.width; x++)
				this.cells[y][x].drawWhenGameOver(ctx);
	}


	mouseDown(event) {
		if (this.disabled)
			return;

		if (!event.inRect(this.offset[0], this.offset[1],
			this.fieldPixelSize.x, this.fieldPixelSize.y))
			return;

		if (!event.isLeft() && !event.isRight())
			return;

		let cellPoint = this.getMouseCellCoordinate(event);
		
		this.processClick(cellPoint, event);
	}

	getMouseCellCoordinate(event) {
		let normalCoordinate = {
			x: event.x - this.offset[0],
			y: event.y - this.offset[1]
		};

		return {
			x: Math.floor(normalCoordinate.x / CELL_SIZE),
			y: Math.floor(normalCoordinate.y / CELL_SIZE)
		};
	}

	processClick(cellPoint, event) {
		let cell = this.getCell(cellPoint);

		// Можно попасть на краешек последней клетки и округлить в несуществующую координату.
		if (!cell)
			return;

		switch (cell.state) {
		case STATE_CLOSED:
			if (event.isOnlyLeft()) {
				this.openCell(cell);
			}

			if (event.isOnlyRight()) {
				cell.toggleFlag();
				this.flagCount++;
			}
			break;
		case STATE_FLAGGED:
			if (event.isOnlyRight()) {
				cell.toggleFlag();
				this.flagCount--;
			}
			break;
		case STATE_OPENED:
			if (event.isLeftAndRight() && cell.bombCount) {
				let flaggedCells = this.getNeighborsByFilter(cell, flaggedFilter);

				if (cell.bombCount == flaggedCells.length) {
					let nonFlaggedCells = this.getNeighborsByFilter(cellPoint, nonFlaggedFilter);
					for (let i = 0; i < nonFlaggedCells.length; i++) {
						this.openCell(nonFlaggedCells[i]);
					}
				} else {
					let nonOpenedCells = this.getNeighborsByFilter(cell, nonOpenedFilter);
					if (cell.bombCount == nonOpenedCells.length) {
						for (let i = 0; i < nonOpenedCells.length; i++) {
							if (nonOpenedCells[i].state == STATE_FLAGGED)
								continue;

							nonOpenedCells[i].state = STATE_FLAGGED;
							this.flagCount++;
						}
					}
				}
				return;
			}
			break;
		}
	}

	openCell(cell) {
		if (cell.state == STATE_OPENED)
			return;

		if (this.gameState == GAME_INITIALIZED) {
			this.switchState(GAME_STARTED);
		}

		cell.state = STATE_OPENED;
		
		if (cell.bombed) {
			this.switchState(GAME_OVER);
			return;
		}

		this.openedCount++;

		if (this.openedCount == this.emptyCellCount) {
			this.switchState(GAME_FINISHED);
		}

		if (cell.bombCount == 0 && !cell.bombed) {
			let allNeighbors = this.getNeighborsByFilter(cell);
			for (let i = 0; i < allNeighbors.length; i++)
				this.openCell(allNeighbors[i]);
		}
	}

	switchState(state) {
		switch(state) {
		case GAME_STARTED:
			this.timer.start();
			break;
		case GAME_OVER:
			this.timer.stop();
			this.drawCellFunction = this.drawGameOverCells;
			this.disabled = true;
			break;
		case GAME_FINISHED:
			this.timer.stop();
			this.disabled = true;
		}

		this.gameState = state;
	}
}


function flaggedFilter(cell) {
	return cell.state == STATE_FLAGGED;
}

function nonFlaggedFilter(cell) {
	return cell.state != STATE_FLAGGED;
}

function nonOpenedFilter(cell) {
	return cell.state != STATE_OPENED;
}
