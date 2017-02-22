(function() {
	const
		LIVES_LABEL_POSITION = { x: 25, y: 25 },
		LEVEL_LABEL_POSITION = { x: 100, y: 25 },
		SCORES_LABEL_POSITION = { x: 175, y: 25 },
		FPS_LABEL_POSITION = { x: 545, y: 25 },
		SPACECRAFT_POSITION = { x: 275, y: 540 },
		BACKGROUND_IMAGE = "images/space.png",
		HEIGHT = 600,
		LIVES = 3,
		INVADER_FORMATION_TOP_OFFSET = 50,
		INVADER_FORMATION_LEFT_OFFSET = 50;


	let utils = SpaceInvadersNamespace.Utils;

	function SpaceInvaders(config) {
		let that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.background = utils.getImage(BACKGROUND_IMAGE);
		that.fpsLabel = new SpaceInvadersNamespace.FPSLabel({
			context: that.context,
			position: FPS_LABEL_POSITION
		});

		that.spacecraft = new SpaceInvadersNamespace.Spacecraft({
			context: that.context,
			position: SPACECRAFT_POSITION
		});

		that.isPaused = false;
		that.isGameOver = false;

		that.lives = LIVES;
		that.level = 1;
		that.scores = 0;

		that.shields = [
			new SpaceInvadersNamespace.Shield({ context: that.context, position: { x: 60, y: 475 } }),
			new SpaceInvadersNamespace.Shield({ context: that.context, position: { x: 240, y: 475 } }),
			new SpaceInvadersNamespace.Shield({ context: that.context, position: { x: 420, y: 475 } })
		];

		that.missiles = [];
		that.invaderFormation = new SpaceInvadersNamespace.InvaderFormation({ context: that.context, position: { x: INVADER_FORMATION_LEFT_OFFSET, y: INVADER_FORMATION_TOP_OFFSET } });

		that.keyboard = {
			keys : {
				"ArrowLeft": false,
				"ArrowRight": false,
				"Space": false
			}
		};

		document.addEventListener("keydown", that._onKeyDown.bind(that));
		document.addEventListener("keyup", that._onKeyUp.bind(that));
	}

    SpaceInvaders.prototype = {
		run: function() {
			let that = this;

			requestAnimationFrame(that.run.bind(that));

			that._update();
			that._render();
		},

		start: function() {
			var that = this;

			if (that.isGameOver) {
				that._init();
			}

			that.isGameOver = that.isPaused = false;

			that.run();
		},

		pause: function() {
			this.isPaused = true;
		},

		onMissileLaunched: function(type, x, y) {
			let that = this,
				ctx = that.context,
				missile = new SpaceInvadersNamespace.Missile({ context : ctx, type: type, position: { x: x, y: y } });

			that.missiles.push(missile);
		},

		onMissileOutOfScreen: function(missile) {
			let that = this,
				index = that.missiles.indexOf(missile);

			if (index !== -1) {
				that.missiles.splice(index, 1);
			}
		},

		processMissileCollisionsIfNeeded: function(missile) {
			let that = this,
				missileOutOfScreen = false;

			if (missile.speed < 0) {
				if (missile.position.y + missile.height < 0) {
					missileOutOfScreen = true;
				}
			} else {
				if (that.position.y > HEIGHT) {
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

				if (missile.position.x >= shield.position.x &&
					missile.position.x <= shield.position.x + shield.width &&
					missile.position.y >= shield.position.y &&
					missile.position.y <= shield.position.y + shield.height) {
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
		},

		_update: function() {
			let that = this;

			that.fpsLabel.update();

			that.spacecraft.update(that.keyboard);
			that.invaderFormation.update();

			for (let i = 0; i < that.missiles.length; i++) {
				that.missiles[i].update();
			}
		},

		_render: function() {
			let that = this,
				ctx = that.context;

			ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);

			that._renderBackground();
			that._renderStatistics();
			that.fpsLabel.render();

			that.invaderFormation.render();

			for (let i = 0; i < that.shields.length; i++) {
				that.shields[i].render();
			}

			that.spacecraft.render();

			for (let i = 0; i < that.missiles.length; i++) {
				that.missiles[i].render();
			}
		},

		_renderBackground: function() {
			let that = this,
				ctx = that.context;

			ctx.drawImage(that.background, 0, 0);
		},

		_renderStatistics: function() {
			let that = this,
				ctx = that.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("Lives: " + that.lives, LIVES_LABEL_POSITION.x, LIVES_LABEL_POSITION.y);
			ctx.fillText("Level: " + that.level, LEVEL_LABEL_POSITION.x, LEVEL_LABEL_POSITION.y);
			ctx.fillText("Scores: " + that.scores, SCORES_LABEL_POSITION.x, SCORES_LABEL_POSITION.y);
		},

		_onKeyDown: function(e) {
			var that = this,
				code = e.code;

			if (code === "KeyS") {
				that.start();
			}

			if (code === "KeyP") {
				that.pause();
			}

			if (that.isGameOver || that.isPaused) {
				return;
			}

			if (code !== "ArrowLeft" && code !== "ArrowRight" && code != "Space") {
				return;
			}

			that.keyboard.keys[code] = true;
		},

		_onKeyUp: function(e) {
			var that = this,
				code = e.code;

			if (code !== "ArrowLeft" && code !== "ArrowRight" && code != "Space") {
				return;
			}

			that.keyboard.keys[code] = false;
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.SpaceInvaders = SpaceInvaders;
})();