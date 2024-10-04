class bigOne extends baseScene {
	constructor() {
		super("bigOne");
	}

	mapJsonPath = "assets/json/bigOne.json";
	playerStartingX = 12;
	playerStartingY = 8;

	// should the floor be rendered?
	renderFloor = true;

	// enemy spawn table
	spawnTable = [
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
		{ x: 5, y: 0 },
		{ x: 6, y: 0 },
		{ x: 9, y: 0 },
		{ x: 10, y: 0 },
		{ x: 13, y: 0 },
		{ x: 14, y: 0 },
		{ x: 17, y: 0 },
		{ x: 18, y: 0 },
		{ x: 21, y: 0 },
		{ x: 22, y: 0 },
		{ x: 1, y: 15 },
		{ x: 2, y: 15 },
		{ x: 5, y: 15 },
		{ x: 6, y: 15 },
		{ x: 9, y: 15 },
		{ x: 10, y: 15 },
		{ x: 13, y: 15 },
		{ x: 14, y: 15 },
		{ x: 17, y: 15 },
		{ x: 18, y: 15 },
		{ x: 21, y: 15 },
		{ x: 22, y: 15 },
		{ x: 0, y: 1 },
		{ x: 0, y: 2 },
		{ x: 0, y: 5 },
		{ x: 0, y: 6 },
		{ x: 0, y: 9 },
		{ x: 0, y: 10 },
		{ x: 0, y: 13 },
		{ x: 0, y: 14 },
		{ x: 23, y: 1 },
		{ x: 23, y: 2 },
		{ x: 23, y: 5 },
		{ x: 23, y: 6 },
		{ x: 23, y: 9 },
		{ x: 23, y: 10 },
		{ x: 23, y: 13 },
		{ x: 23, y: 14 },
	];
	// debug graphics
	drawDebug = false;
}
