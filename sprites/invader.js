(function() {
	const IMAGE_FILENAME = "images/invader.png",
		WIDTH = 50,
		HEIGHT = 55,
		FIRE_INTERVAL = 250,
		OFFSET_X = 50,
		SPEED_X = 60, //pixels per second
		SPEED_Y = 150;

	Invader.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Invader.prototype.constructor = Invader;

	function Invader(config) {
		let that = this;

		if (!config.imageFilename) {
			config.imageFilename = IMAGE_FILENAME;
		}
		config.width = WIDTH;
		config.height = HEIGHT;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.initialX = that.x;
		that.velocityX = -SPEED_X;
		that.velocityY = 0;
		that.fireInterval = config.fireInterval !== undefined ? config.fireInterval : FIRE_INTERVAL;
		that.lastFireTime = new Date();
		that.scoreBonus = 10;
		that.lives = config.lives !== undefined ? config.lives : 1;

		that.__type = SpaceInvadersNamespace.consts.SpriteType.Invader;
	}

	Invader.prototype.update = function(lastFrameEllapsedTime, keyboard) {
		let that = this,
			leftBorder = that.initialX - OFFSET_X,
			rightBorder = that.initialX + OFFSET_X,
			isBorderReached = false;

		if (that.x < leftBorder) {
			that.x = leftBorder;
			isBorderReached = true;
		}

		if (that.x > rightBorder) {
			that.x = rightBorder;
			isBorderReached = true;
		}

		if (isBorderReached) {
			that.velocityX *= -1;
			that.velocityY = SPEED_Y;
		}

		if (that.y + that.height > that.game.height) {
			that.game.onInvaderOutOfScreen(that);
		}

		SpaceInvadersNamespace.Sprite.prototype.update.call(that, lastFrameEllapsedTime, keyboard);

		that.velocityY = 0;
	}

	Invader.prototype.onCollidedWith = function(sprite) {
		let that = this,
			type = sprite.__type;

		if (type === SpaceInvadersNamespace.consts.SpriteType.Missile) {
			that.lives--;

			if (that.lives === 0) {
				that.game.updateScores(that);
				that.game.removeChild(that);

				that.game.addChild(new SpaceInvadersNamespace.Explosion({ x: that.x, y: that.y }));
			}
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Invader = Invader;
})();