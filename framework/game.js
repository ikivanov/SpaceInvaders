(function() {
	function Game(config) {
		let that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.width = that.canvas.width;
		that.height = that.canvas.height;

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

		document.addEventListener("keydown", that._onKeyDown.bind(that));
		document.addEventListener("keyup", that._onKeyUp.bind(that));
	}

	Game.prototype = {
		run: function() {
			let that = this;

			requestAnimationFrame(that.run.bind(that));

			that.update();
			that.detectCollisions();
			that.render();
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

		detectCollisions: function() {
			let that = this;

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];

				if (sprite.isNonPlayable) {
					continue;
				}

				for (let j = 0; j < that.sprites.length; j++) {
					let sprite2 = that.sprites[j];

					if (sprite2 == sprite) {
						continue;
					}

					//TODO: collision detection check goes here!

					let hasCollision = false;
					if (hasCollision) {
						that.sprite.onCollidedWith(sprite2);
						that.sprite2.onCollidedWith(sprite);
						that.onCollisionDetected(sprite, sprite2);
					}
				}
			}
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
		},

		render: function() {
			let that = this,
				ctx = that.context;

			ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);

			for (let i = 0; i < that.sprites.length; i++) {
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

			for (let i = 0; i < sprite.children.length; i++) {
				sprite.children[i].game = that;
				sprite.children[i].context = sprite.context;
			}
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