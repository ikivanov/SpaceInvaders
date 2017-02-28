(function() {
	const
		SPACECRAFT_POSITION = { x: 275, y: 540 },
		HEIGHT = 600,
		INVADER_FORMATION_TOP_OFFSET = 50,
		INVADER_FORMATION_LEFT_OFFSET = 50,
		SHIELD_ROWS = 3,
		SHIELD_COLS = 10,
		INVADERS_ROWS = 3,
		INVADERS_COLS = 8,
		SHIELD_BLOCK_LENGTH = 12,
		INVADER_WIDTH = 50,
		INVADER_HEIGHT = 55,
		INVADER_FIRE_INTERVAL = 1000,
		INVADER_MISSILE_VELOCITY = 300,
		MAX_LEVEL = 4;

	let utils = SpaceInvadersNamespace.Utils;

	SpaceInvaders.prototype = Object.create(SpaceInvadersNamespace.Game.prototype);
	SpaceInvaders.prototype.constructor = SpaceInvaders;

	function SpaceInvaders(config) {
		let that = this;

		SpaceInvadersNamespace.Game.call(that, config);

		that.init();
	}

	SpaceInvaders.prototype.init = function() {
		let that = this;

		SpaceInvadersNamespace.Game.prototype.init.call(that);

		that.lastEnemyMissileLaunchTime = new Date();

		that.addChild(new SpaceInvadersNamespace.Background());
		that.addChild(new SpaceInvadersNamespace.Statistics({ x: 25, y: 25 }));
		that.addChild(new SpaceInvadersNamespace.FPSCounter({ x: 545, y: 25 }));

		that.level = 1;
		that.levelDescriptorCreated = new Date();
		that.levelDescriptor = new SpaceInvadersNamespace.Label({ text: `Level ${that.level} is loading... Get ready!`, x: 175, y: 300, color: "red", size: 22 });
		that.addChild(that.levelDescriptor);
	}

	SpaceInvaders.prototype.cleanUpLevel = function() {
		let that = this;

		that.sprites = that.sprites.filter(sprite => sprite.__type === "Background" || sprite.__type === "Statistics" || sprite.__type === "fpscounter");
	}

	SpaceInvaders.prototype.loadLevel = function(level) {
		let that = this;

		that.currentLevel = SpaceInvadersNamespace.LevelFactory.create(level, { game: that });
		that.currentLevel.load();
	}

	SpaceInvaders.prototype.onAfterUpdate = function() {
		let that = this,
			now = new Date();

		if (that.levelDescriptor && now.getTime() - that.levelDescriptorCreated.getTime() > 2000) {
			that.removeChild(that.levelDescriptor);
			that.levelDescriptor = null;

			that.loadLevel(that.level);
		}

		if (!that.currentLevel) {
			return;
		}

		if (now.getTime() - that.lastEnemyMissileLaunchTime.getTime() > that.currentLevel.invaderFireInterval) {
			let x = that.spacecraft.x,
				invadersInSpacecraftRange = that.sprites.filter(sprite =>
																		(sprite.__type === "Invader" ||
																		sprite.__type === "Invader2") &&
																		sprite.x >= x - sprite.width &&
																		sprite.x <= x + sprite.width);

			if (!invadersInSpacecraftRange || invadersInSpacecraftRange.length === 0) {
				return;
			}

			let attackingInvader = invadersInSpacecraftRange.reduce((a, b) => a.y < b.y ? b : a);
			if (attackingInvader) {
				if (attackingInvader.__type === "Invader") {
					that.addChild(new SpaceInvadersNamespace.Missile({ type: "enemy", velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH / 2, y: attackingInvader.y + INVADER_HEIGHT }));
				} else if (attackingInvader.__type === "Invader2") {
					that.addChild(new SpaceInvadersNamespace.Missile({ type: "enemy", velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + 3, y: attackingInvader.y + INVADER_HEIGHT}));
					that.addChild(new SpaceInvadersNamespace.Missile({ type: "enemy", velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH - 3, y: attackingInvader.y + INVADER_HEIGHT }));
				}

				that.lastEnemyMissileLaunchTime = new Date();
			}
		}
	},

	SpaceInvaders.prototype.onLevelCompleted = function() {
		let that = this;

		if (that.level === MAX_LEVEL) {
			that.gameOver();
			return;
		}

		that.cleanUpLevel();
		that.level++;

		that.levelDescriptorCreated = new Date();
		that.levelDescriptor = new SpaceInvadersNamespace.Label({ text: `Level ${that.level} is loading... Get ready!`, x: 175, y: 300, color: "red", size: 22 });
		that.addChild(that.levelDescriptor);
	},

	SpaceInvaders.prototype.onMissileLaunched = function(type, x, y) {
		let that = this;

		that.addChild(new SpaceInvadersNamespace.Missile({ type, x, y: y - 10 }));
	}

	SpaceInvaders.prototype.onMissileOutOfScreen = function(missile) {
		let that = this;

		that.removeChild(missile);

		//TODO: create explosion effect
	}

	SpaceInvaders.prototype.onInvaderOutOfScreen = function(invader) {
		let that = this;

		that.gameOver();
	}

	SpaceInvaders.prototype.onCollisionDetected = function(sprite1, sprite2) {
		//override in descendent

		//1. invader && spacecraft -> invader.destroy(); spacecraft.destroy() -> gameover
		//2. missile and invader -> invader.destroy(); missile.destroy()
		//3. missile and spacecraft -> missile.destroy(); spacecraft.destroy() -> gameover
		//4. missile and shieldBlock -> missile.destroy(); shieldBlock.destroy()
	}

	SpaceInvaders.prototype.isLevelCompleted = function() {
		let that = this,
			invaders = that.sprites.find((sprite) => sprite.__type === "Invader" || sprite.__type === "Invader2");

		if (!invaders) {
			return true;
		}

		return false;
	}

	SpaceInvaders.prototype.checkGameOver = function() {
		let that = this,
			spacecraft = that.sprites.find(sprite => sprite.__type === "Spacecraft");

		if (!spacecraft) {
			return true;
		}

		let invaders = that.sprites.find((sprite) => sprite.__type === "Invader" || sprite.__type === "Invader2");
		if (!invaders && that.level === MAX_LEVEL) {
			return true;
		}

		return false;
	}

	SpaceInvaders.prototype.updateScores = function(invader) {
		let that = this;

		that.scores += that.level * invader.scoreBonus;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.SpaceInvaders = SpaceInvaders;
})();