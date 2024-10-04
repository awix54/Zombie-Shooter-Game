class baseScene extends Phaser.Scene {
	preload() {
		this.load.image("player", "assets/textures/player.png");
		this.load.image("zombie", "assets/textures/zombie.png");
		this.load.image("devil", "assets/textures/devil.png");
		this.load.image("bullet", "assets/textures/bullet.png");
		this.load.image("box", "assets/textures/box.png");

		// sound loader
		this.load.audio("shoot", "assets/sounds/shoot.wav");
		this.load.audio("health", "assets/sounds/health.wav");
		this.load.audio("hit", "assets/sounds/hit.wav");
		this.load.audio("lose", "assets/sounds/lose.wav");

		// loader for the tilemap from json and a tileset
		this.load.tilemapTiledJSON("map", this.mapJsonPath);
		this.load.image("tiles", "assets/tilesets/customTileset.png");

		// -- animation spritesheet --
		this.load.spritesheet(
			"player-walk",
			"assets/textures/spritesheets/anim-walk.png",
			{
				frameWidth: 16,
				frameHeight: 16,
			}
		);
		this.load.spritesheet(
			"zombie-walk",
			"assets/textures/spritesheets/zombie-walk.png",
			{
				frameWidth: 16,
				frameHeight: 16,
			}
		);
	}

	enemies = [];
	healthBoxes = [];
	players = [];
	playerSpeed = 50;
	playerScore = 0;

	create() {
		// map creation
		this.map = this.make.tilemap({
			key: "map",
			tileWidth: 32,
			tileHeight: 32,
		});
		this.tileSet = this.map.addTilesetImage("tileset", "tiles");
		// -- check if the floor is needed and render it --
		if (this.renderFloor == true) {
			this.floorLayer = this.map.createLayer("floor", this.tileSet, 0, 0);
		}

		// -- layer system --
		this.bloodLayer = this.add.layer();
		this.wallLayer = this.map.createLayer("walls", this.tileSet, 0, 0);
		// collider between the player and the basic tileset layer with some tile ID
		this.wallLayer.setCollisionBetween(2, 14);

		this.boxLayer = this.add.layer();
		this.playerLayer = this.add.layer();
		this.floorLayer = this.add.layer();
		// this.pathLayer = this.map.createLayer("pathlayer", this.tileSet, 0, 0);

		this.scale.setGameSize(
			this.map.layers[0].widthInPixels,
			this.map.layers[0].heightInPixels
		);

		// pathfinding navmesh
		this.objectLayer = this.map.getObjectLayer("navmesh");

		this.navMesh = this.navMeshPlugin.buildMeshFromTiled(
			"mesh",
			this.objectLayer,
			8
		);

		// -- debug graphics for paths --
		if (this.drawDebug == true) {
			let debugGraphics = this.add.graphics(0, 0).setAlpha(0.5);
			this.navMesh.enableDebug(debugGraphics);

			this.navMesh.debugDrawClear();
			this.navMesh.debugDrawMesh({
				drawCentroid: true,
				drawBounds: false,
				drawNeighbors: false,
				drawPortals: true,
			});
		}

		// -- player creator --
		// declare the keys to move the player
		this.leftKey = this.input.keyboard.addKey("A");
		this.rightKey = this.input.keyboard.addKey("D");
		this.upKey = this.input.keyboard.addKey("W");
		this.downKey = this.input.keyboard.addKey("S");

		this.leftKey2 = this.input.keyboard.addKey("LEFT");
		this.rightKey2 = this.input.keyboard.addKey("RIGHT");
		this.upKey2 = this.input.keyboard.addKey("UP");
		this.downKey2 = this.input.keyboard.addKey("DOWN");

		// shooting keys
		let shootKey = this.input.keyboard.addKey("H");
		let shootKey2 = this.input.keyboard.addKey("FORWARD_SLASH");

		// create the player
		this.player1 = new player(
			this,
			this.playerStartingX,
			this.playerStartingY,
			"player",
			0xffcc00
		);
		this.player2 = new player(
			this,
			this.playerStartingX,
			this.playerStartingY,
			"player",
			0x00c9ff
		);

		this.players.push(this.player1);
		this.players.push(this.player2);

		shootKey.on("down", () => {
			this.bullet = this.physics.add
				.image(-10, -10, "bullet")
				.setVisible(false);
			this.physics.add.collider(
				this.bullet,
				this.enemies,
				this.bulletHitEnemy
			);
			this.physics.add.collider(
				this.bullet,
				this.wallLayer,
				this.bulletHitEnemy
			);
			this.gun.shootBullet(this.player1);
		});
		shootKey2.on("down", () => {
			this.bullet = this.physics.add
				.image(-10, -10, "bullet")
				.setVisible(false);
			this.physics.add.collider(
				this.bullet,
				this.enemies,
				this.bulletHitEnemy
			);
			this.physics.add.collider(
				this.bullet,
				this.wallLayer,
				this.bulletHitEnemy
			);
			this.gun.shootBullet(this.player2);
		});

		// base bullet image -required to work
		this.bullet = this.physics.add
			.image(-20, -20, "bullet")
			.setVisible(false);

		this.cameras.main.setBounds(
			0,
			0,
			this.map.layers[0].widthInPixels,
			this.map.layers[0].heightInPixels
		);
		// this.cameras.main.startFollow(this.player, true);
		// this.cameras.main.setZoom(2.5);

		// -- text display --
		this.scoreText = this.add.text(
			this.scoreX,
			this.scoreY,
			`Score: ${this.playerScore}`
		);
		this.scoreText.setStyle({
			backgroundColor: "black",
			color: "white",
		});

		this.waveText = this.add.text(350, 8, `Score: ${this.waveNumber}`);
		this.waveText.setStyle({
			backgroundColor: "black",
			color: "white",
		});

		// key input
		this.cursorKey = this.input.keyboard.createCursorKeys();
		this.pointer = this.input.activePointer;

		// this.follower = new FollowerSprite(this, 1, 1, this.navMesh, "zombie");
		// this.enemies.push(this.follower);

		this.enemiesGroup = this.physics.add.group();

		this.anims.create({
			key: "zombie-walk",
			frames: this.anims.generateFrameNumbers("zombie-walk"),
			frameRate: 4,
			repeat: -1,
		});

		// let devil0 = new FollowerSprite(this, 2, 8, this.navMesh, "devil");
		// this.enemies.push(devil0);

		this.physics.add.collider(this.enemiesGroup);

		// -- weapon class creator --
		this.gun = new Weapon(0, 300, 5, this);
	}

	lastEnemySpawn = 0;
	lastBoxSpawn = 0;
	lastFired = 0;
	lastWave = 0;

	waveNumber = 0;
	numberOfEnemies = 5;

	lastKill = 0;
	killStreak = 0;
	tempKillCount = this.killStreak;

	update() {
		this.timeNow = this.time.now;

		this.player1.move(
			this.leftKey,
			this.rightKey,
			this.upKey,
			this.downKey,
			50
		);
		this.player1.updatePlayer();

		this.player2.move(
			this.leftKey2,
			this.rightKey2,
			this.upKey2,
			this.downKey2,
			50
		);
		this.player2.updatePlayer();

		this.players.forEach((e) => {
			if (e.health < 0) {
				// this.sound.play("lose");
				e.health = 100;
				this.waveNumber = 0;
				this.numberOfEnemies = 5;
				this.playerScore = 0;
				this.anims.remove("player-walk");
				this.anims.remove("zombie-walk");
				this.scene.restart();
			}
		});

		// -- wave system --
		if (this.enemies.length == 0) {
			let enemyWave = new wave(this, this.waveNumber);
			enemyWave.spawnEnemies(this.numberOfEnemies);
			this.waveNumber++;
			this.numberOfEnemies *= 1.2;
			Math.round(this.numberOfEnemies);
		}

		// -- health box spawn logic --
		if (this.timeNow - this.lastBoxSpawn > 60000) {
			let position = this.getRandomFreeTile();

			let box = this.physics.add.sprite(position.x, position.y, "box");
			this.boxLayer.add(box);
			box.setScale(0.8);
			box.setImmovable();

			this.healthBoxes.push(box);

			let boxPlayerCollider = this.physics.add.collider(
				this.healthBoxes,
				this.players,
				this.boxPickUp
			);
			boxPlayerCollider.overlapOnly = true;

			this.lastBoxSpawn = this.timeNow;
		}

		// -- kill streak mechanic --
		// this.killStreak
		if (this.timeNow - this.lastKill > 3000) {
			if (this.killStreak > 0) {
				this.killStreak -= 1;
			}
			this.lastKill = this.timeNow;
		}
		// check if the killStreak got updated
		if (this.tempKillCount !== this.killStreak) {
			this.tempKillCount = this.killStreak;
			this.lastKill = this.timeNow;
		}

		this.enemies.forEach((e) => {
			let start = new Phaser.Math.Vector2(e.x, e.y);

			let end1 = new Phaser.Math.Vector2(this.player1.x, this.player1.y);
			let path1 = this.navMesh.findPath(start, end1);

			let end2 = new Phaser.Math.Vector2(this.player2.x, this.player2.y);
			let path2 = this.navMesh.findPath(start, end2);

			// update the enemy shadows position
			e.shadow.x = e.x;
			e.shadow.y = e.y + 7;

			// this.navMesh.debugDrawClear();
			// this.navMesh.debugDrawPath(path, 0x00d9ff);

			if (path1.length > 0) {
				// Tell the follower sprite to find its path to the target
				if (path1 > path2) {
					e.goTo(end2);
				} else {
					e.goTo(end1);
				}
			}
		});

		// -- update the player score in real time --
		this.scoreText.setText(`Score: ${this.playerScore}`);
		this.waveText.setText(`Wave: ${this.waveNumber}`);

		// remove the enemy/healthbox from array when its destroyed
		this.enemies.forEach((e) => {
			if (e.active == false) {
				let index = this.enemies.indexOf(e);
				this.enemies.splice(index, 1);
			}
		});
		this.healthBoxes.forEach((e) => {
			if (e.active == false) {
				let index = this.healthBoxes.indexOf(e);
				this.healthBoxes.splice(index, 1);
			}
		});
	}

	getRandomSpawn(spawnPositionTable) {
		let randomSpawnNumber = Phaser.Math.Between(
			0,
			spawnPositionTable.length - 1
		);
		return spawnPositionTable[randomSpawnNumber];
	}

	bulletHitEnemy(bullet, target) {
		// destroy the bullet and the enemy that is hit
		bullet.destroy();
		target.health -= 1;

		// create blood effect
		if (target.active == true) {
			let bloodSize = Phaser.Math.Between(1, 2);
			let bloodXY = Phaser.Math.Between(-5, 5);
			for (let i = 0; i < 5; i++) {
				let blood = target.scene.add
					.graphics()
					.fillStyle(0xff0000)
					.fillCircle(
						target.x + bloodXY,
						target.y + bloodXY,
						bloodSize
					);
				target.scene.bloodLayer.add(blood);
			}

			// target.scene.sound.play("hit");
		}

		if (target.health == 0) {
			target.scene.playerScore += 123;
			target.scene.killStreak += 1;
			target.shadow.destroy();
			target.destroy();
		}
	}

	enemyTouchPlayer(player, enemy) {
		player.health -= 1;
	}

	boxPickUp(box, player) {
		// checks if the player health is above 80
		// and adds health only to max
		let maxHealth = 50;

		if (player.health < maxHealth) {
			let healthToAdd = Math.min(maxHealth - player.health, 20);
			player.health += healthToAdd;
			// player.scene.sound.play("health");
			box.destroy();
		}
	}

	getRandomFreeTile() {
		let randomX = Phaser.Math.Between(0, this.map.layers[0].widthInPixels);
		let randomY = Phaser.Math.Between(0, this.map.layers[0].heightInPixels);

		for (let i = 0; i < 10; i++) {
			// checks if a there is a tile on the x and y position in the wallLayer
			let isOccupied = this.wallLayer.hasTileAtWorldXY(randomX, randomY);

			if (isOccupied == true) {
				randomX = Phaser.Math.Between(
					0,
					this.map.layers[0].widthInPixels
				);
				randomY = Phaser.Math.Between(
					0,
					this.map.layers[0].heightInPixels
				);
			} else {
				return { x: randomX, y: randomY };
			}
		}
	}
}
