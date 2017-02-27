(function() {
	const MAX_LEVEL = 4;

	let utils = SpaceInvadersNamespace.Utils;

	function Game(config) {
		let that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.width = that.canvas.width;
		that.height = that.canvas.height;

		document.addEventListener("keydown", that._onKeyDown.bind(that));
		document.addEventListener("keyup", that._onKeyUp.bind(that));
	}

	Game.prototype = {
		init: function() {
			let that = this;

			that.sprites = [];

			that.isPaused = false;
			that.isGameOver = false;

			that.level = 1;
			that.scores = 0;

			that.keyboard = {
				keys : {
					"ArrowLeft": false,
					"ArrowRight": false,
					"Space": false
				}
			};

			that.gameOverLabel = new SpaceInvadersNamespace.Label({ x: 260, y: 280, text: "Game Over!", isVisible: false, zIndex: 10000 });
			that.addChild(that.gameOverLabel);

			that.pauseLabel = new SpaceInvadersNamespace.Label({ x: 260, y: 280, text: "Paused", isVisible: false, zIndex: 10000 });
			that.addChild(that.pauseLabel);
		},

		run: function() {
			let that = this;

			if (that.isGameOver) {
				that.gameOverLabel.render();
				return;
			}

			if (that.isPaused) {
				that.pauseLabel.render();
				return;
			}

			requestAnimationFrame(that.run.bind(that));

			that.update();
			that.render();
			that.detectCollisions();
		},

		start: function() {
			var that = this;

			if (that.isGameOver) {
				that.init();
			}

			that.isGameOver = that.isPaused = false;

			that.pauseLabel.gameOverLabel = false;
			that.pauseLabel.isVisible = false;

			that.run();
		},

		pause: function() {
			let that = this;

			that.pauseLabel.isVisible = true;
			that.isPaused = true;
		},

		gameOver: function() {
			let that = this;

			that.gameOverLabel.isVisible = true;
			that.isGameOver = true;
		},

		detectCollisions: function() {
			let that = this;

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];

				if (sprite.isNonPlayable) {
					continue;
				}

				for (let j = 0; j < that.sprites.length; j++) {
					let sprite2 = that.sprites[j];

					if (sprite2.isNonPlayable || sprite2 === sprite) {
						continue;
					}

					let hasCollision = utils.hasRectangularCollision(sprite.getRect(), sprite2.getRect());
					if (hasCollision) {
						sprite.onCollidedWith(sprite2);
						sprite2.onCollidedWith(sprite);
						that.onCollisionDetected(sprite, sprite2);

						if (that.checkGameOver()) {
							that.gameOver();
							return;
						}

						if (that.isLevelCompleted()) {
							that.onLevelCompleted();
						}
					}
				}
			}
		},

		isLevelCompleted: function() {
			return false;
		},

		cleanUpLevel: function() {

		},

		loadLevel: function() {

		},

		onLevelCompleted: function() {
			let that = this;

			if (that.level === MAX_LEVEL) {
				that.gameOver();
				return;
			}

			that.level++;
			that.cleanUpLevel();
			that.loadLevel(that.level);
		},

		checkLevelCompleted: function() {
			return false;
		},

		checkGameOver: function() {
			return false;
		},

		onCollisionDetected: function(sprite1, sprite2) {
			throw new Error("You need to override onCollisionDetected!");
		},

		update: function() {
			let that = this;

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];
				sprite.update(that.keyboard);
			}

			that.onAfterUpdate();
		},

		onAfterUpdate: function() {

		},

		render: function() {
			let that = this,
				ctx = that.context;

			ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];

				if (!sprite.isVisible) {
					continue;
				}

				that.sprites[i].render();
			}
		},

		addChild: function(sprite) {
			if (!sprite) {
				return;
			}

			let that = this;

			that.sprites.push(sprite);
			sprite.context = that.context;
			sprite.game = that;

			that.sprites.sort((a, b) => a.zIndex - b.zIndex);
		},

		addChildren: function(sprites) {
			if (!sprites || !sprites.length) {
				return;
			}

			let that = this;

			for (let i = 0; i < sprites.length; i++) {
				that.addChild(sprites[i]);
			}
		},

		removeChild: function(sprite) {
			if (!sprite) {
				return;
			}

			let that = this,
				index = that.sprites.indexOf(sprite);

			if (index !== -1) {
				that.sprites.splice(index, 1);
			}
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

	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Game = Game;
})();