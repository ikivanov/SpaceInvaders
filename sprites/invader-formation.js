(function() {
	const INVADER_WIDTH = 50,
		INVADER_HEIGHT = 55,
		INVADERS_ROWS = 3,
		INVADERS_COLS = 8,
		FORMATION_WIDTH = ((INVADER_WIDTH  + 15 ) * INVADERS_COLS) - 15;


	InvaderFormation.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	InvaderFormation.prototype.constructor = InvaderFormation;

	function InvaderFormation(config) {
		let that = this;

		config.isNonPlayable = true;
		SpaceInvadersNamespace.Sprite.call(that, config);

		that.velocityX = -1;
		that.velocityY = 0;

		for (let i = 0; i < INVADERS_ROWS; i++) {
			for (let j = 0; j < INVADERS_COLS; j++) {
				let x = that.x + j * INVADER_WIDTH + 15 * j,
					y = that.y + i * INVADER_HEIGHT + 10 * i;

				that.addChild( new SpaceInvadersNamespace.Invader({ x, y }) );
			}
		}

		that.__type = "InvaderFormation";
	}

	InvaderFormation.prototype.update = function() {
		let that = this;

		if (that.x < 0 || that.x + FORMATION_WIDTH > that.game.width) {
			that.velocityX *= -1;
			that.velocityY = 2.5;
		}

		SpaceInvadersNamespace.Sprite.prototype.update.call(that);

		that.velocityY = 0;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.InvaderFormation = InvaderFormation;
})();