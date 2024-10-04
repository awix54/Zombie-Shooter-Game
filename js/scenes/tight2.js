class tight2 extends baseScene {
	constructor() {
		super("tight2");
	}

	mapJsonPath = "assets/json/tight2.json";
	playerStartingX = 8;
	playerStartingY = 11;

	renderFloor = true;

	scoreX = 170;
	scoreY = 8;

	// enemy spawn table
	spawnTable = [
		{ x: 3, y: 0 },
		{ x: 13, y: 0 },
		{ x: 0, y: 21 },
		{ x: 7, y: 22 },
	];
	// debug graphics
	drawDebug = false;
}
