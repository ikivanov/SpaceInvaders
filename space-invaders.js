define(["framework/game", "sprites/splash-screen", "framework/label", "sprites/background", "sprites/statistics", "framework/fps-counter", "levels", "sprites/missile", "consts"],
	function(Game, SplashScreen, Label, Background, Statistics, FPSCounter, LevelFactory, Missile, consts) {
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

	class SpaceInvaders extends Game {
		constructor(config) {
			super(config);

			let that = this;

			that.init();
		}

		getSplashScreen() {
			return new SplashScreen();
		}

		loadSprites() {
			let that = this;

			that.lastEnemyMissileLaunchTime = Date.now();

			that.addChild(new Background());
			that.addChild(new Statistics({ x: 25, y: 25 }));
			that.addChild(new FPSCounter({ x: 545, y: 25 }));

			that.level = 1;
			that.levelDescriptorCreated = Date.now();
			that.levelDescriptor = new Label({ text: `Level ${that.level} is loading... Get ready!`, x: 175, y: 300, color: "red", size: 22 });
			that.addChild(that.levelDescriptor);
		}

		getGameOverLabel() {
			return new Label({ x: 200, y: 280,
														text: "Game Over! (Press S to try again)",
														isVisible: false,
														zIndex: 10000 });
		}

		getPauseLabel() {
			return new Label({ x: 220, y: 280,
														text: "Paused (Press S to resume)",
														isVisible: false,
														zIndex: 10000 });
		}

		cleanUpLevel() {
			let that = this;

			that.sprites = that.sprites.filter(sprite => sprite.isNonPlayable === true);
		}

		loadLevel(level) {
			let that = this;

			that.currentLevel = LevelFactory.create(level, { game: that });
			that.currentLevel.load();
		}

		_removeCompletedExplosions() {
			let that = this,
				explosionsCompleted = that.sprites.filter(sprite => sprite.__type === consts.SpriteType.Explosion && sprite.isCompleted);

			if (explosionsCompleted && explosionsCompleted.length > 0) {
				for (let i = 0; i < explosionsCompleted.length; i++) {
					that.removeChild(explosionsCompleted[i]);
				}
			}
		}

		onAfterUpdate() {
			let that = this,
				now = Date.now();

			that._removeCompletedExplosions();

			if (that.levelDescriptor && now - that.levelDescriptorCreated > 1000) {
				that.removeChild(that.levelDescriptor);
				that.levelDescriptor = null;

				that.loadLevel(that.level);
			}

			if (!that.currentLevel || !that.spacecraft) {
				return;
			}

			that.attackSpacecraft();
		}

		attackSpacecraft() {
			let that = this,
				now = Date.now();

			if (now - that.lastEnemyMissileLaunchTime > that.currentLevel.invaderFireInterval) {
				let x = that.spacecraft.x,
					invadersInSpacecraftRange = that.sprites.filter(sprite =>
																			(sprite.__type === consts.SpriteType.Invader ||
																			sprite.__type === consts.SpriteType.DoubleWeaponInvader) &&
																			sprite.x >= x - sprite.width &&
																			sprite.x <= x + sprite.width);

				if (!invadersInSpacecraftRange || invadersInSpacecraftRange.length === 0) {
					return;
				}

				let attackingInvader = invadersInSpacecraftRange.reduce((a, b) => a.y < b.y ? b : a);
				if (attackingInvader) {
					if (attackingInvader.__type === consts.SpriteType.Invader) {
						that.addChild(new Missile({ velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH / 2, y: attackingInvader.y + INVADER_HEIGHT }));
					} else if (attackingInvader.__type === consts.SpriteType.DoubleWeaponInvader) {
						that.addChild(new Missile({ velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + 3, y: attackingInvader.y + INVADER_HEIGHT}));
						that.addChild(new Missile({ velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH - 3, y: attackingInvader.y + INVADER_HEIGHT }));
					}

					that.lastEnemyMissileLaunchTime = Date.now();
				}
			}
		}

		onLevelCompleted() {
			let that = this;

			if (that.level === MAX_LEVEL) {
				that.gameOver();
				return;
			}

			that.currentLevel = null;
			that.cleanUpLevel();
			that.level++;

			that.levelDescriptorCreated = Date.now();
			that.levelDescriptor = new Label({ text: `Level ${that.level} is loading... Get ready!`, x: 175, y: 300, color: "red", size: 22 });
			that.addChild(that.levelDescriptor);
		}

		onMissileLaunched(x, y) {
			let that = this;

			that.addChild(new Missile({ x, y: y - 10, velocityY: SPACECRAFT_MISSILE_VELOCITY }));
		}

		onMissileOutOfScreen(missile) {
			let that = this;

			that.removeChild(missile);
		}

		onInvaderOutOfScreen(invader) {
			let that = this;

			that.gameOver();
		}

		isLevelCompleted() {
			let that = this,
				sprites = that.sprites.find((sprite) => sprite.__type === consts.SpriteType.Invader ||
															sprite.__type === consts.SpriteType.DoubleWeaponInvader ||
															sprite.__type === consts.SpriteType.Missile ||
															sprite.__type === consts.SpriteType.Explosion);

			if (!sprites) {
				return true;
			}

			return false;
		}

		checkGameOver() {
			let that = this,
				sprites = that.sprites.find(sprite => sprite.__type === consts.SpriteType.Explosion ||
													sprite.__type === consts.SpriteType.Spacecraft ||
													sprite.__type === consts.SpriteType.Missile);

			if (!sprites) {
				return true;
			}

			sprites = that.sprites.find((sprite) => sprite.__type === consts.SpriteType.Invader ||
														sprite.__type === consts.SpriteType.DoubleWeaponInvader ||
														sprite.__type === consts.SpriteType.Missile ||
														sprite.__type === consts.SpriteType.Explosion);

			if (!sprites && that.level === MAX_LEVEL) {
				return true;
			}

			return false;
		}

		updateScores(invader) {
			let that = this;

			that.scores += that.level * invader.scoreBonus;
		}

		removeSpacecraft(sprite) {
			let that = this;

			that.removeChild(sprite);
			that.spacecraft = null;
		}
	}

	return SpaceInvaders;
});