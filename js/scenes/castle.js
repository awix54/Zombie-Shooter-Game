class castle extends baseScene {
	constructor() {
		super("castle");
	}

	mapJsonPath = "assets/json/castle.json";
	playerStartingX = 6;
	playerStartingY = 8;

	// should the floor be rendered?
	renderFloor = true;

	scoreX = 8;
	scoreY = 8;

	// enemy spawn table
	spawnTable = [
		{ x: 5, y: 0 },
		{ x: 7, y: 0 },
		{ x: 9, y: 0 },
		{ x: 5, y: 14 },
		{ x: 7, y: 14 },
		{ x: 9, y: 14 },
		{ x: 0, y: 5 },
		{ x: 0, y: 7 },
		{ x: 0, y: 9 },
		{ x: 14, y: 5 },
		{ x: 14, y: 7 },
		{ x: 14, y: 9 },
	];
	// debug graphics
	drawDebug = false;
}
