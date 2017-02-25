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
		INVADER_HEIGHT = 55,
		INVADER_FIRE_INTERVAL = 1000,
		INVADER_MISSILE_VELOCITY = 5;

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

		that.lives = LIVES;

		that.lastEnemyMissileLaunchTime = new Date();

		that.addChild(new SpaceInvadersNamespace.Background());
		that.addChild(new SpaceInvadersNamespace.Statistics({ x: 25, y: 25 }));
		that.addChild(new SpaceInvadersNamespace.FPSCounter({ x: 545, y: 25 }));

		that.spacecraft = new SpaceInvadersNamespace.Spacecraft({ x: 275, y: 540 });
		that.addChild(that.spacecraft);

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

				that.addChild( new SpaceInvadersNamespace.Shield({ x, y }) );
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

	SpaceInvaders.prototype.onAfterUpdate = function() {
		let that = this,
			now = new Date();

		if (now.getTime() - that.lastEnemyMissileLaunchTime.getTime() > INVADER_FIRE_INTERVAL) {
			let x = that.spacecraft.x,
				invadersInSpacecraftRange = that.sprites.filter(sprite => sprite.__type === "Invader" &&
																		sprite.x >= x - sprite.width &&
																		sprite.x <= x + sprite.width);

			if (!invadersInSpacecraftRange || invadersInSpacecraftRange.length === 0) {
				return;
			}

			let attackingInvader = invadersInSpacecraftRange.reduce((a, b) => a.y < b.y ? b : a);
			if (attackingInvader) {
				that.addChild(new SpaceInvadersNamespace.Missile({ type: "enemy", velocityY: INVADER_MISSILE_VELOCITY, x : attackingInvader.x + INVADER_WIDTH / 2, y: attackingInvader.y + INVADER_HEIGHT }));
				that.lastEnemyMissileLaunchTime = new Date();
			}
		}
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

	SpaceInvaders.prototype.checkGameOver = function() {
		let that = this,
			spacecraft = that.sprites.find(sprite => sprite.__type === "Spacecraft");

		if (!spacecraft) {
			return true;
		}

		let invaders = that.sprites.find((sprite) => sprite.__type === "Invader");
		if (!invaders) {
			return true;
		}

		return false;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.SpaceInvaders = SpaceInvaders;
})();