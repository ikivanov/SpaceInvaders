(function() {
	const
		SPACECRAFT_POSITION = { x: 275, y: 540 },
		HEIGHT = 600,
		LIVES = 3,
		INVADER_FORMATION_TOP_OFFSET = 50,
		INVADER_FORMATION_LEFT_OFFSET = 50,
		SHIELD_ROWS = 3,
		SHIELD_COLS = 10,
		INVADERS_ROWS = 3,
		INVADERS_COLS = 8,
		SHIELD_BLOCK_LENGTH = 12,
		INVADER_WIDTH = 50,
		INVADER_HEIGHT = 55;


	let utils = SpaceInvadersNamespace.Utils;

	SpaceInvaders.prototype = Object.create(SpaceInvadersNamespace.Game.prototype);
	SpaceInvaders.prototype.constructor = SpaceInvaders;

	function SpaceInvaders(config) {
		let that = this;

		SpaceInvadersNamespace.Game.call(that, config);

		that.lives = LIVES;

		that.addChild(new SpaceInvadersNamespace.Background());
		that.addChild(new SpaceInvadersNamespace.Statistics({ x: 25, y: 25 }));
		that.addChild(new SpaceInvadersNamespace.FPSCounter({ x: 545, y: 25 }));

		that.addChild(new SpaceInvadersNamespace.Spacecraft({ x: 275, y: 540 }));

		for (let x = 60; x <= 420; x += 180) {
			that._createShieldFormation(x, 475);
		}

		that._createInvaderFormation(50, 50);
	}

	SpaceInvaders.prototype._createShieldFormation = function(formationX, formationY) {
		let that = this;

		for (let i = 0; i < SHIELD_ROWS; i++) {
			for (let j = 0; j < SHIELD_COLS; j++) {
				let x = formationX + j * SHIELD_BLOCK_LENGTH,
					y = formationY + i * SHIELD_BLOCK_LENGTH;

				that.addChild( new SpaceInvadersNamespace.ShieldBlock({ x, y }) );
			}
		}
	}

	SpaceInvaders.prototype._createInvaderFormation = function(formationX, formationY) {
		let that = this;

		for (let i = 0; i < INVADERS_ROWS; i++) {
			for (let j = 0; j < INVADERS_COLS; j++) {
				let x = formationX + j * INVADER_WIDTH + 15 * j,
					y = formationY + i * INVADER_HEIGHT + 10 * i;

				that.addChild( new SpaceInvadersNamespace.Invader({ x, y }) );
			}
		}
	}

	SpaceInvaders.prototype.onMissileLaunched = function(type, x, y) {
		let that = this;

		that.addChild(new SpaceInvadersNamespace.Missile({ type, x, y: y - 10 }));
	}

	SpaceInvaders.prototype.onMissileOutOfScreen = function(missile) {
		let that = this;

		that.removeChild(missile);

		//TODO: create explosion effect
	}

	SpaceInvaders.prototype.onDestroyMissile = function(missile) {
		let that = this;

		that.removeChild(missile);

		//TODO: create explosion effect
	}

	SpaceInvaders.prototype.processMissileCollisionsIfNeeded = function(missile) {
		return;
		let that = this,
			missileOutOfScreen = false;

		if (missile.speed < 0) {
			if (missile.y + missile.height < 0) {
				missileOutOfScreen = true;
			}
		} else {
			if (that.y > HEIGHT) {
				missileOutOfScreen = true;
			}
		}

		if (missileOutOfScreen) {
			that.onMissileOutOfScreen(missile);
			return;
		}

		let targetedShield = null;
		for (let i = 0; i < that.shields.length; i++) {
			let shield = that.shields[i];

			if (missile.x >= shield.position.x &&
				missile.x <= shield.position.x + shield.width &&
				missile.y >= shield.position.y &&
				missile.y <= shield.position.y + shield.height) {
				targetedShield = shield;
			}
		}

		if (!targetedShield) {
			return;
		}

		let shieldBlockAboutDestructionFound = false;
		for (let j = 0; j < targetedShield.shieldBlocks.length; j++) {
			let row = targetedShield.shieldBlocks[j];

			for (let k = 0; k < row.length; k++) {
				let shieldBlock = row[k];

				if (!shieldBlock.isDestroyed &&
						missile.position.x >= shieldBlock.x &&
						missile.position.x <= shieldBlock.x + shieldBlock.width &&
						missile.position.y >= shieldBlock.y &&
						missile.position.y <= shieldBlock.y + shieldBlock.width) {
					shieldBlock.isDestroyed = true;
					shieldBlockAboutDestructionFound = true;
					that.onMissileOutOfScreen(missile);
					break;
				}
			}

			if (shieldBlockAboutDestructionFound) {
				break;
			}
		}
	}

	SpaceInvaders.prototype.onCollisionDetected = function(sprite1, sprite2) {
		//override in descendent

		//1. invader && spacecraft -> invader.destroy(); spacecraft.destroy() -> gameover
		//2. missile and invader -> invader.destroy(); missile.destroy()
		//3. missile and spacecraft -> missile.destroy(); spacecraft.destroy() -> gameover
		//4. missile and shieldBlock -> missile.destroy(); shieldBlock.destroy()
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.SpaceInvaders = SpaceInvaders;
})();