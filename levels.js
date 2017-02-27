(function() {
	const MAX_LEVEL = 4;

	let utils = SpaceInvadersNamespace.Utils;

	function BaseLevel(config) {
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

	BaseLevel.prototype = {
		load: function() {
			let that = this;

			that.createInvadersFormation();
			that.createShieldFormations();
			that.createSpacecraft();
		},

		createSpacecraft: function() {
			let that = this,
				spacecraft = new SpaceInvadersNamespace.Spacecraft({ x: that.initialSpacecraftX, y: that.initialSpacecraftY });

			that.game.addChild(spacecraft);
			that.game.spacecraft = spacecraft;
		},

		createShieldFormations: function() {
			let that = this;

			for (let x = that.firstShieldFormationOffsetX; x <= that.lastShieldFormationOffsetX; x += that.shieldFormationsPadding) {
				that.createShieldFormation(x, that.shieldFormationsOffsetY);
			}
		},

		createShieldFormation: function(formationX, formationY) {
			let that = this;

			for (let i = 0; i < that.shieldRows; i++) {
				for (let j = 0; j < that.shiedlCols; j++) {
					let x = formationX + j * that.shieldBlockLength,
						y = formationY + i * that.shieldBlockLength;

					that.game.addChild( new SpaceInvadersNamespace.Shield({ x, y }) );
				}
			}
		},

		createInvadersFormation: function() {
			let that = this,
				fireInterval = that.invaderFireInterval;

			for (let i = 0; i < that.invadersRows; i++) {
				for (let j = 0; j < that.invadersCols; j++) {
					let x = that.invaderFormationOffsetX + j * that.invaderWidth + that.invaderHorizontalSpacing * j,
						y = that.invaderFormationOffsetY + i * that.invaderHeight + that.invaderVerticalSpacing * i;

					that.game.addChild( new SpaceInvadersNamespace.Invader({ x, y, fireInterval, lives: that.invaderLives }) );
				}
			}
		}
	}

	Level1.prototype = Object.create(BaseLevel.prototype);
	Level1.prototype.constructor = Level1;

	function Level1 (config) {
		let that = this;

		BaseLevel.call(that, config);
	}

	Level2.prototype = Object.create(BaseLevel.prototype);
	Level2.prototype.constructor = Level2;

	function Level2 (config) {
		let that = this;

		BaseLevel.call(that, config);

		that.initialSpacecraftX = 185;
		that.initialSpacecraftY = 540;
		that.shieldRows = 2;
		that.shiedlCols = 9;

		that.invadersRows = 4;
		that.invaderFireInterval = 750;
		that.invaderLives = 2;
	}

	Level3.prototype = Object.create(BaseLevel.prototype);
	Level3.prototype.constructor = Level3;

	function Level3 (config) {
		let that = this;

		BaseLevel.call(that, config);

		that.initialSpacecraftX = 185;
		that.initialSpacecraftY = 540;
		that.shieldRows = 1;
		that.shiedlCols = 8;

		that.invadersRows = 5;
		that.invaderFireInterval = 500;
		that.invaderLives = 3;
	}

	Level3.prototype.createInvadersFormation = function() {
		let that = this,
			fireInterval = that.invaderFireInterval;

		for (let i = 0; i < that.invadersRows; i++) {
			for (let j = 0; j < that.invadersCols; j++) {
				let x = that.invaderFormationOffsetX + j * that.invaderWidth + that.invaderHorizontalSpacing * j,
					y = that.invaderFormationOffsetY + i * that.invaderHeight + that.invaderVerticalSpacing * i;

				let invaderType = Math.round(utils.randomRange(0, 1)),
					invaderClass = invaderType ? "Invader2" : "Invader";

				that.game.addChild( new SpaceInvadersNamespace[invaderClass]({ x, y, fireInterval, lives: that.invaderLives }) );
			}
		}
	}

	Level4.prototype = Object.create(BaseLevel.prototype);
	Level4.prototype.constructor = Level3;

	function Level4 (config) {
		let that = this;

		BaseLevel.call(that, config);

		that.initialSpacecraftX = 185;
		that.initialSpacecraftY = 540;
		that.shieldRows = 0;

		that.invadersRows = 3;
		that.invaderFireInterval = 500;
		that.invaderLives = 4;
	}

	Level4.prototype.createInvadersFormation = function() {
		let that = this,
			fireInterval = that.invaderFireInterval;

		for (let i = 0; i < that.invadersRows; i++) {
			for (let j = 0; j < that.invadersCols; j++) {
				let x = that.invaderFormationOffsetX + j * that.invaderWidth + that.invaderHorizontalSpacing * j,
					y = that.invaderFormationOffsetY + i * that.invaderHeight + that.invaderVerticalSpacing * i;

				that.game.addChild( new SpaceInvadersNamespace.Invader2({ x, y, fireInterval, lives: that.invaderLives }) );
			}
		}
	}

	function LevelFactory() {}

	LevelFactory.create = function(level, config) {
		if (level < 1 || level > MAX_LEVEL) {
			throw new Error("Invalid level!");
		}

		return new SpaceInvadersNamespace[`Level${level}`](config);
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.BaseLevel = BaseLevel;
	SpaceInvadersNamespace.Level1 = Level1;
	SpaceInvadersNamespace.Level2 = Level2;
	SpaceInvadersNamespace.Level3 = Level3;
	SpaceInvadersNamespace.Level4 = Level4;
	SpaceInvadersNamespace.LevelFactory = LevelFactory;
})();