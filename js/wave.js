class wave {
	constructor(scene, waveNumber) {
		this.waveNumber = waveNumber;
		this.scene = scene;
	}

	spawnEnemies(numberOfEnemies) {
		// creates a single enemy before the main loop
		// must be here because the waves system is not working without it
		// because of the setTimeout function for one second there isnt a single enemy and there two waves spawned at once

		let point = this.scene.getRandomSpawn(this.scene.spawnTable);
		let follower = new FollowerSprite(this.scene, point.x, point.y, this.scene.navMesh, "zombie", 3);
		this.scene.enemies.push(follower);
		this.scene.floorLayer.add(follower);
		follower.play("zombie-walk");
		this.scene.enemies.forEach((e) => {
			this.scene.enemiesGroup.add(e);
		});

		for (let i = 0; i < numberOfEnemies; i++) {
			setTimeout(() => {
				let point = this.scene.getRandomSpawn(this.scene.spawnTable);

				// creates a new follower
				let follower = new FollowerSprite(this.scene, point.x, point.y, this.scene.navMesh, "zombie", 3);
				// add him to the enemies table and to the floor layer
				this.scene.enemies.push(follower);
				this.scene.floorLayer.add(follower);
				follower.play("zombie-walk");

				this.scene.enemies.forEach((e) => {
					this.scene.enemiesGroup.add(e);
				});

				// set the value below to adjust the speed of the enemies appearing
			}, i * 1000);
		}
	}
}
