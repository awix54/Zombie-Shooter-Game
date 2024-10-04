class FollowerSprite extends Phaser.GameObjects.Sprite {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {*} x
	 * @param {*} y
	 * @param {*} navMesh
	 * @param {*} wallLayer
	 * @memberof FollowerSprite
	 */
	constructor(scene, x, y, navMesh, texture, health) {
		let followerX = scene.map.tileToWorldX(x) + scene.map.tileWidth / 2;
		let followerY = scene.map.tileToWorldY(y) + scene.map.tileWidth / 2;
		super(scene, followerX, followerY, texture);

		this.navMesh = navMesh;
		this.path = null;
		this.currentTarget = null;

		// shadow below the enemy
		this.shadow = scene.add.graphics().fillStyle(0xffffff).fillEllipse(0, 0, 11, 8).setAlpha(0.2);
		scene.boxLayer.add(this.shadow);

		this.scene = scene;
		this.type = texture;
		this.health = health;

		// Enable arcade physics for moving with velocity
		scene.physics.world.enable(this);

		scene.add.existing(this);
		scene.events.on("update", this.update, this);
		scene.events.once("shutdown", this.destroy, this);
	}

	goTo(targetPoint) {
		// Find a path to the target
		this.path = this.navMesh.findPath(new Phaser.Math.Vector2(this.x, this.y), targetPoint);

		// checks if the eneny type is the devil and set a custom path condition to stop on the last path for example
		if (this.type == "devil") {
			if (this.path && this.path.length > 2) this.currentTarget = this.path.shift();
			else this.currentTarget = null;
		} else {
			// If there is a valid path, grab the first point from the path and set it as the target
			if (this.path && this.path.length > 0) this.currentTarget = this.path.shift();
			else this.currentTarget = null;
		}
	}

	update(time, deltaTime) {
		// Bugfix: Phaser's event emitter caches listeners, so it's possible to get updated once after
		// being destroyed
		if (!this.body) return;

		// Stop any previous movement
		this.body.velocity.set(0);

		if (this.currentTarget) {
			// Check if we have reached the current target (within a fudge factor)
			const { x, y } = this.currentTarget;
			const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);

			if (distance < 5) {
				// If there is path left, grab the next point. Otherwise, null the target.
				if (this.path.length > 0) this.currentTarget = this.path.shift();
				else this.currentTarget = null;
			}

			// Still got a valid target?
			if (this.currentTarget) this.moveTowards(this.currentTarget, 15, deltaTime / 1000);

			// -- follower rotation based on path --
			if (this.currentTarget.x < this.x) {
				this.flipX = true;
			} else {
				this.flipX = false;
			}
		}
	}

	moveTowards(targetPosition, maxSpeed = 200, elapsedSeconds) {
		const { x, y } = targetPosition;
		const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
		const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
		const targetSpeed = distance / elapsedSeconds;
		const magnitude = Math.min(maxSpeed, targetSpeed);

		this.scene.physics.velocityFromRotation(angle, magnitude, this.body.velocity);
		// this.rotation = angle;
	}

	destroy() {
		if (this.scene) this.scene.events.off("update", this.update, this);
		super.destroy();
	}
}
