class Weapon {
	constructor(fireDelay, bulletSpeed, accuracy, scene) {
		this.fireDelay = fireDelay;
		this.bulletSpeed = bulletSpeed;
		this.accuracy = accuracy;
		this.lastFired = 0;
		this.scene = scene;
	}

	shootBullet(player) {
		if (this.scene.timeNow - this.lastFired > this.fireDelay) {
			let bulletDifference = Phaser.Math.Between(-this.accuracy, this.accuracy);
			let anglePlayerPointer = Phaser.Math.Angle.Between(player.x, player.y, this.scene.pointer.x, this.scene.pointer.y);

			let velocityX;
			let velocityY;

			if (player.shootDirection == "upleft") {
				velocityX = -this.bulletSpeed;
				velocityY = -this.bulletSpeed;
			} else if (player.shootDirection == "upright") {
				velocityX = this.bulletSpeed;
				velocityY = -this.bulletSpeed;
			} else if (player.shootDirection == "downleft") {
				velocityX = -this.bulletSpeed;
				velocityY = this.bulletSpeed;
			} else if (player.shootDirection == "downright") {
				velocityX = this.bulletSpeed;
				velocityY = this.bulletSpeed;
			} else if (player.shootDirection == "up") {
				velocityY = -this.bulletSpeed;
				velocityX = 0;
			} else if (player.shootDirection == "down") {
				velocityY = this.bulletSpeed;
				velocityX = 0;
			} else if (player.shootDirection == "left") {
				velocityX = -this.bulletSpeed;
				velocityY = 0;
			} else if (player.shootDirection == "right") {
				velocityX = this.bulletSpeed;
				velocityY = 0;
			}

			// this.scene.sound.play("shoot");
			this.scene.bullet
				.setVisible(true)
				.setImmovable(true)
				// set rotation to bullet based on angle from player
				.setRotation(anglePlayerPointer)
				.setPosition(player.x, player.y)
				// in the desired direction
				.setVelocity(velocityX - bulletDifference, velocityY - bulletDifference);

			this.scene.bullet.body.velocity.normalize().scale(this.bulletSpeed);
			this.lastFired = this.scene.timeNow;
		}
	}
}
