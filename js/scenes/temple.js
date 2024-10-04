class temple extends baseScene {
	constructor() {
		super("temple");
	}

	mapJsonPath = "assets/json/temple.json";
	playerStartingX = 7;
	playerStartingY = 7;

	// should the floor be rendered?
	renderFloor = true;

	scoreX = 8;
	scoreY = 8;

	// enemy spawn table
	spawnTable = [
		{ x: 5, y: 0 },
		{ x: 9, y: 0 },
		{ x: 5, y: 14 },
		{ x: 9, y: 14 },
		{ x: 0, y: 7 },
		{ x: 14, y: 7 },
	];
	// debug graphics
	drawDebug = false;
}
