(function() {
	const
		SPACECRAFT_POSITION = { x: 275, y: 540 },
		HEIGHT = 600,
		LIVES = 3,
		INVADER_FORMATION_TOP_OFFSET = 50,
		INVADER_FORMATION_LEFT_OFFSET = 50;


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

		that.addChildren([
			new SpaceInvadersNamespace.Shield({ x: 60, y: 475 }),
			new SpaceInvadersNamespace.Shield({ x: 240, y: 475 }),
			new SpaceInvadersNamespace.Shield({ x: 420, y: 475 })
		]);

		that.addChild(new SpaceInvadersNamespace.InvaderFormation({ x: 50, y: 50 }));
	}

	SpaceInvaders.prototype.onMissileLaunched = function(type, x, y) {
		let that = this;

		that.addChild(new SpaceInvadersNamespace.Missile({ type, x, y }));
	}

	SpaceInvaders.prototype.onMissileOutOfScreen = function(missile) {
		let that = this,
			index = that.sprites.indexOf(missile);

		if (index !== -1) {
			that.sprites.splice(index, 1);
		}

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