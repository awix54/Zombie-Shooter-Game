const config = {
	type: Phaser.AUTO,
	height: 500,
	width: 500,
	backgroundColor: "black",
	scale: {
		mode: Phaser.Scale.FIT,
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [menu, temple, castle, tight2, bigOne],
	plugins: {
		scene: [
			{
				key: "NavMeshPlugin",
				plugin: PhaserNavMeshPlugin,
				mapping: "navMeshPlugin",
				start: true,
			},
		],
	},
	audio: {
		disableWebAudio: true,
	},
};

const game = new Phaser.Game(config);
