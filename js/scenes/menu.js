class menu extends Phaser.Scene {
	constructor() {
		super("menu");
	}

	preload() {
		this.load.image("keys1", "assets/textures/keys1.png");
		this.load.image("keys2", "assets/textures/keys2.png");
		this.load.image("logo", "assets/textures/logo.png");
		this.load.image("player", "assets/textures/player.png");
		this.load.audio("click", "assets/sounds/click.wav");
	}

	create() {
		this.add.image(config.width / 2, 100, "logo").setScale(2);

		this.add.image(350, 275, "keys1");
		this.add.image(350, 215, "keys2");

		this.castleLvl = this.add.text(50, 200, "Castle").setInteractive();
		this.tight2Level = this.add.text(50, 250, "Tight 2").setInteractive();
		this.bigOneLevel = this.add.text(50, 300, "Big One").setInteractive();

		this.add.image(275, 215, "player").setTint(0xffcc00);
		this.add.image(275, 275, "player").setTint(0x00c9ff);

		let buttonTable = [];
		buttonTable.push(this.castleLvl);
		buttonTable.push(this.tight2Level);
		buttonTable.push(this.bigOneLevel);

		buttonTable.forEach((e) => {
			e.on("pointerover", () => {
				e.setTint(0xff0000);
			});
			e.on("pointerout", () => {
				e.clearTint();
			});
		});

		this.castleLvl.on("pointerdown", () => {
			this.scene.start("castle");
			// this.sound.play("click");
		});

		this.tight2Level.on("pointerdown", () => {
			this.scene.start("tight2");
			// this.sound.play("click");
		});

		this.bigOneLevel.on("pointerdown", () => {
			this.scene.start("bigOne");
			// this.sound.play("click");
		});
	}
}
