(function() {
	const INVADER_WIDTH = 50,
		INVADER_HEIGHT = 55,
		INVADERS_ROWS = 3,
		INVADERS_COLS = 8,
		FORMATION_WIDTH = ((INVADER_WIDTH  + 15 ) * INVADERS_COLS) - 15;


	let utils = SpaceInvadersNamespace.Utils;

	function InvaderFormation(config) {
		let that = this;

		that.context = config.context;
		that.position = config.position;

		that.invaders = [];

		for (let i = 0; i < INVADERS_ROWS; i++) {
			that.invaders[i] = [];

			for (let j = 0; j < INVADERS_COLS; j++) {
				let x = that.position.x + j * INVADER_WIDTH + 15 * j,
					y = that.position.y + i * INVADER_HEIGHT + 10 * i;

				that.invaders[i].push(
					new SpaceInvadersNamespace.Invader({ context: that.context, formation: that, position: { x, y } })
				);
			}
		}

		that.speedX = -1;
		that.speedY = 2.5;
	}

	InvaderFormation.prototype = {
		update: function() {
			let that = this,
				shouldMoveDown = false;

			if (that.position.x < 0 || that.position.x + FORMATION_WIDTH > 600) {
				that.speedX *= -1;
				that.position.y += that.speedY;
				shouldMoveDown = true;
			}

			//Do I need this?
			that.position.x += that.speedX;

			for (let i = 0; i < INVADERS_ROWS; i++) {
				for (let j = 0; j < INVADERS_COLS; j++) {
					let invader = that.invaders[i][j];

					invader.position.x += that.speedX;

					if (shouldMoveDown) {
						invader.position.y += that.speedY;
					}
				}
			}
		},

		render: function() {
			let that = this,
				ctx = that.context;

			for (let i = 0; i < INVADERS_ROWS; i++) {
				for (let j = 0; j < INVADERS_COLS; j++) {
					that.invaders[i][j].render();
				}
			}
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.InvaderFormation = InvaderFormation;
})();