class player extends Phaser.GameObjects.Sprite {
	constructor(scene, playerX, playerY, texture, color) {
		let x = scene.map.tileToWorldX(playerX) + scene.map.tileWidth / 2;
		let y = scene.map.tileToWorldY(playerY) + scene.map.tileWidth / 2;
		super(scene, x, y, texture);

		this.shootDirection = "right";

		this.health = 50;
		this.healthBar = [];
		this.healthText = scene.add.text(-20, -20, this.health);
		this.healthText.setStyle({
			color: "green",
			align: "center",
		});

		this.directionX = 0;
		this.directionY = 0;

		// enables the arcade physics
		scene.physics.world.enable(this);
		// add collision to player and walls
		scene.physics.add.collider(this, scene.wallLayer);
		// add to layers
		scene.playerLayer.add(this);
		scene.floorLayer.add(this);
		// create the player animation and play it
		scene.anims.create({
			key: "player-walk",
			frames: scene.anims.generateFrameNumbers("player-walk"),
			frameRate: 5,
			repeat: -1,
		});
		this.play("player-walk");
		// set the player color
		this.setTint(color);

		// set the player shadow (visual)
		this.shadow = scene.add.graphics().fillStyle(0xffffff).fillEllipse(0, 0, 11, 8).setAlpha(0.2);
		scene.boxLayer.add(this.shadow);

		// add a collider to the enemies and the player
		scene.physics.add.collider(this, scene.enemies, scene.enemyTouchPlayer);

		// add a dot to symbolise the direction in which the player is looking
		this.directionDot = scene.add.graphics().fillStyle(0xffffff).fillCircle(0, 0, 1.5);

		// if (this.health % 10 == 0) {
		// 	let hearts = this.health / 10;
		// 	for (let i = 0; i < hearts; i++) {
		// 		let heart = scene.add
		// 			.graphics()
		// 			.fillStyle(0x99ff00)
		// 			.fillCircle(1 * i * 4, 0, 2);
		// 		this.healthBar.push(heart);
		// 	}
		// }
	}

	move(leftKey, rightKey, upKey, downKey, speed) {
		let velocityX;
		let velocityY;

		if (leftKey.isDown) {
			velocityX = -speed;
			this.flipX = true;
			this.shootDirection = "left";

			this.directionX = -12;
			this.directionY = 0;
		} else if (rightKey.isDown) {
			velocityX = speed;
			this.flipX = false;
			this.shootDirection = "right";

			this.directionX = 12;
			this.directionY = 0;
		} else {
			velocityX = 0;
		}

		if (upKey.isDown) {
			velocityY = -speed;
			this.shootDirection = "up";

			this.directionX = 0;
			this.directionY = -12;
		} else if (downKey.isDown) {
			this.shootDirection = "down";
			velocityY = speed;

			this.directionX = 0;
			this.directionY = 12;
		} else {
			velocityY = 0;
		}

		if (leftKey.isDown && upKey.isDown) {
			this.shootDirection = "upleft";
			this.directionX = -10;
			this.directionY = -10;
		} else if (rightKey.isDown && upKey.isDown) {
			this.shootDirection = "upright";
			this.directionX = 10;
			this.directionY = -10;
		} else if (leftKey.isDown && downKey.isDown) {
			this.shootDirection = "downleft";
			this.directionX = -10;
			this.directionY = 10;
		} else if (rightKey.isDown && downKey.isDown) {
			this.shootDirection = "downright";
			this.directionX = 10;
			this.directionY = 10;
		}

		this.body.velocity.set(velocityX, velocityY);
	}

	updatePlayer() {
		this.healthText.setPosition(this.x, this.y - 30);
		this.healthText.setText(this.health);

		this.directionDot.x = this.x + this.directionX;
		this.directionDot.y = this.y + this.directionY;

		this.shadow.x = this.x;
		this.shadow.y = this.y + 7;

		// this.healthBar.forEach((e) => {
		// 	e.x = this.x - 8;
		// 	e.y = this.y - 15;
		// });
	}
}
