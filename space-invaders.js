(function() {
	const
		SPACECRAFT_POSITION = { x: 275, y: 540 },
		SPACECRAFT_MISSILE_VELOCITY = -600,
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

	SpaceInvaders.prototype.getGameOverLabel = function() {
		return new SpaceInvadersNamespace.Label({ x: 260, y: 280,
													text: "Game Over!",
													isVisible: false,
													zIndex: 10000 });
	}

	SpaceInvaders.prototype.getPauseLabel = function() {
		return new SpaceInvadersNamespace.Label({ x: 260, y: 280,
													text: "Paused",
													isVisible: false,
													zIndex: 10000 });
	}

	SpaceInvaders.prototype.cleanUpLevel = function() {
		let that = this;

		that.sprites = that.sprites.filter(sprite => sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Background ||
										sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Statistics ||
										sprite.__type === "fpscounter");
	}

	SpaceInvaders.prototype.loadLevel = function(level) {
		let that = this;

		that.currentLevel = SpaceInvadersNamespace.LevelFactory.create(level, { game: that });
		that.currentLevel.load();
	}

	SpaceInvaders.prototype._removeCompletedExplosions = function() {
		let that = this,
			explosionsCompleted = that.sprites.filter(sprite => sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Explosion && sprite.isCompleted);

		if (explosionsCompleted && explosionsCompleted.length > 0) {
			for (let i = 0; i < explosionsCompleted.length; i++) {
				that.removeChild(explosionsCompleted[i]);
			}
		}
	}

	SpaceInvaders.prototype.onAfterUpdate = function() {
		let that = this,
			now = new Date();

		that._removeCompletedExplosions();

		if (that.levelDescriptor && now.getTime() - that.levelDescriptorCreated.getTime() > 1000) {
			that.removeChild(that.levelDescriptor);
			that.levelDescriptor = null;

			that.loadLevel(that.level);
		}

		if (!that.currentLevel || !that.spacecraft) {
			return;
		}

		if (now.getTime() - that.lastEnemyMissileLaunchTime.getTime() > that.currentLevel.invaderFireInterval) {
			let x = that.spacecraft.x,
				invadersInSpacecraftRange = that.sprites.filter(sprite =>
																		(sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Invader ||
																		sprite.__type === SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader) &&
																		sprite.x >= x - sprite.width &&
																		sprite.x <= x + sprite.width);

			if (!invadersInSpacecraftRange || invadersInSpacecraftRange.length === 0) {
				return;
			}

			let attackingInvader = invadersInSpacecraftRange.reduce((a, b) => a.y < b.y ? b : a);
			if (attackingInvader) {
				if (attackingInvader.__type === SpaceInvadersNamespace.consts.SpriteType.Invader) {
					that.addChild(new SpaceInvadersNamespace.Missile({ velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH / 2, y: attackingInvader.y + INVADER_HEIGHT }));
				} else if (attackingInvader.__type === SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader) {
					that.addChild(new SpaceInvadersNamespace.Missile({ velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + 3, y: attackingInvader.y + INVADER_HEIGHT}));
					that.addChild(new SpaceInvadersNamespace.Missile({ velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH - 3, y: attackingInvader.y + INVADER_HEIGHT }));
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

		that.currentLevel = null;
		that.cleanUpLevel();
		that.level++;

		that.levelDescriptorCreated = new Date();
		that.levelDescriptor = new SpaceInvadersNamespace.Label({ text: `Level ${that.level} is loading... Get ready!`, x: 175, y: 300, color: "red", size: 22 });
		that.addChild(that.levelDescriptor);
	},

	SpaceInvaders.prototype.onMissileLaunched = function(x, y) {
		let that = this;

		that.addChild(new SpaceInvadersNamespace.Missile({ x, y: y - 10, velocityY: SPACECRAFT_MISSILE_VELOCITY }));
	}

	SpaceInvaders.prototype.onMissileOutOfScreen = function(missile) {
		let that = this;

		that.removeChild(missile);
	}

	SpaceInvaders.prototype.onInvaderOutOfScreen = function(invader) {
		let that = this;

		that.gameOver();
	}

	SpaceInvaders.prototype.isLevelCompleted = function() {
		let that = this,
			sprites = that.sprites.find((sprite) => sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Invader ||
														sprite.__type === SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader ||
														sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Missile ||
														sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Explosion);

		if (!sprites) {
			return true;
		}

		return false;
	}

	SpaceInvaders.prototype.checkGameOver = function() {
		let that = this;

		sprites = that.sprites.find(sprite => sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Explosion ||
												sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Spacecraft ||
												sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Missile);

		if (!sprites) {
			return true;
		}

		sprites = that.sprites.find((sprite) => sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Invader ||
													sprite.__type === SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader ||
													sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Missile ||
													sprite.__type === SpaceInvadersNamespace.consts.SpriteType.Explosion);

		if (!sprites && that.level === MAX_LEVEL) {
			return true;
		}

		return false;
	}

	SpaceInvaders.prototype.updateScores = function(invader) {
		let that = this;

		that.scores += that.level * invader.scoreBonus;
	}

	SpaceInvaders.prototype.removeSpacecraft = function(sprite) {
		let that = this;

		that.removeChild(sprite);
		that.spacecraft = null;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.SpaceInvaders = SpaceInvaders;
})();