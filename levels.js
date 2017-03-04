(function() {
	const MAX_LEVEL = 4;

	let utils = SpaceInvadersNamespace.Utils;

	class BaseLevel {
		constructor(config) {
			let that = this;

			that.game = config.game;

			that.initialSpacecraftX = 275;
			that.initialSpacecraftY = 540;

			that.firstShieldFormationOffsetX = 60;
			that.lastShieldFormationOffsetX = 420;
			that.shieldFormationsPadding = 180;
			that.shieldFormationsOffsetY = 475;
			that.shieldRows = 3;
			that.shiedlCols = 10;
			that.shieldBlockLength = 12;

			that.invadersRows = 3;
			that.invadersCols = 8;
			that.invaderWidth = 50;
			that.invaderHeight = 55;
			that.invaderFormationOffsetX = 50;
			that.invaderFormationOffsetY = 50;
			that.invaderHorizontalSpacing = 15;
			that.invaderVerticalSpacing = 12;
			that.invaderFireInterval = 1000;
			that.invaderLives = 1;
		}

		load() {
			let that = this;

			that.createInvadersFormation();
			that.createShieldFormations();
			that.createSpacecraft();
		}

		createSpacecraft() {
			let that = this,
				spacecraft = new SpaceInvadersNamespace.Spacecraft({ x: that.initialSpacecraftX, y: that.initialSpacecraftY });

			that.game.addChild(spacecraft);
			that.game.spacecraft = spacecraft;
		}

		createShieldFormations() {
			let that = this;

			for (let x = that.firstShieldFormationOffsetX; x <= that.lastShieldFormationOffsetX; x += that.shieldFormationsPadding) {
				that.createShieldFormation(x, that.shieldFormationsOffsetY);
			}
		}

		createShieldFormation(formationX, formationY) {
			let that = this;

			for (let i = 0; i < that.shieldRows; i++) {
				for (let j = 0; j < that.shiedlCols; j++) {
					let x = formationX + j * that.shieldBlockLength,
						y = formationY + i * that.shieldBlockLength;

					that.game.addChild( new SpaceInvadersNamespace.Shield({ x, y }) );
				}
			}
		}

		createInvadersFormation() {
			let that = this,
				fireInterval = that.invaderFireInterval;

			for (let i = 0; i < that.invadersRows; i++) {
				for (let j = 0; j < that.invadersCols; j++) {
					let x = that.invaderFormationOffsetX + j * that.invaderWidth + that.invaderHorizontalSpacing * j,
						y = that.invaderFormationOffsetY + i * that.invaderHeight + that.invaderVerticalSpacing * i,
						invader = that.createInvader(x, y);

					that.game.addChild(invader);
				}
			}
		}

		createInvader(x, y) {
			let that = this;

			return new SpaceInvadersNamespace.Invader({ x, y, fireInterval: that.fireInterval, lives: that.invaderLives })
		}
	}

	class Level1 extends BaseLevel {
	}

	class Level2 extends BaseLevel {
		constructor(config) {
			super(config);

			let that = this;

			that.initialSpacecraftX = 185;
			that.initialSpacecraftY = 540;
			that.shieldRows = 2;
			that.shiedlCols = 9;

			that.invadersRows = 4;
			that.invaderFireInterval = 750;
			that.invaderLives = 2;
		}
	}

	class Level3 extends BaseLevel {
		constructor(config) {
			super(config);

			let that = this;

			that.initialSpacecraftX = 185;
			that.initialSpacecraftY = 540;
			that.shieldRows = 1;
			that.shiedlCols = 8;

			that.invadersRows = 5;
			that.invaderFireInterval = 500;
			that.invaderLives = 3;
		}

		createInvader(x, y) {
			let that = this;

			let invaderType = Math.round(utils.randomRange(0, 1)),
				invaderClass = invaderType ? SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader : SpaceInvadersNamespace.consts.SpriteType.Invader;

			return new SpaceInvadersNamespace[invaderClass]({ x, y, fireInterval: that.fireInterval, lives: that.invaderLives });
		}
	}

	class Level4 extends BaseLevel {
		constructor(config) {
			super(config);

			let that = this;

			that.initialSpacecraftX = 185;
			that.initialSpacecraftY = 540;
			that.shieldRows = 0;

			that.invadersRows = 5;
			that.invaderFireInterval = 500;
			that.invaderLives = 4;
		}

		createInvader(x, y) {
			let that = this;

			return new SpaceInvadersNamespace.DoubleWeaponInvader({ x, y, fireInterval: that.fireInterval, lives: that.invaderLives })
		}
	}

	class LevelFactory {
		static create(level, config) {
			if (level < 1 || level > MAX_LEVEL) {
				throw new Error("Invalid level!");
			}

			return new SpaceInvadersNamespace[`Level${level}`](config);
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};

	SpaceInvadersNamespace.BaseLevel = BaseLevel;

	SpaceInvadersNamespace.Level1 = Level1;
	SpaceInvadersNamespace.Level2 = Level2;
	SpaceInvadersNamespace.Level3 = Level3;
	SpaceInvadersNamespace.Level4 = Level4;

	SpaceInvadersNamespace.LevelFactory = LevelFactory;
})();