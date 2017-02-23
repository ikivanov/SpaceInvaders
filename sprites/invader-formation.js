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

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.velocityX = -1;
		//that.velocityY = 2.5;
		that.velocityY = 0;

		for (let i = 0; i < INVADERS_ROWS; i++) {
			for (let j = 0; j < INVADERS_COLS; j++) {
				let x = that.x + j * INVADER_WIDTH + 15 * j,
					y = that.y + i * INVADER_HEIGHT + 10 * i;

				that.addChild( new SpaceInvadersNamespace.Invader({ x, y }) );
			}
		}
	}

	InvaderFormation.prototype.update = function() {
		let that = this;

		if (that.x < 0 || that.x + FORMATION_WIDTH > that.game.width) {
			that.velocityX *= -1;
			that.velocityY = 2.5;
		}

		SpaceInvadersNamespace.Sprite.prototype.update.call(that);

		that.velocityY = 0;


		// //Do I need this?
		// that.x += that.velocityX;

		// for (let i = 0; i < INVADERS_ROWS; i++) {
		// 	for (let j = 0; j < INVADERS_COLS; j++) {
		// 		let invader = that.invaders[i][j];

		// 		invader.position.x += that.speedX;

		// 		if (shouldMoveDown) {
		// 			invader.position.y += that.speedY;
		// 		}
		// 	}
		// }
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.InvaderFormation = InvaderFormation;
})();