(function() {
	const IMAGE_FILENAME = "images/explosion.png",
		WIDTH = 39,
		HEIGHT = 39;

	Explosion.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Explosion.prototype.constructor = Explosion;

	function Explosion(config) {
		let that = this;

		config.imageFilename = IMAGE_FILENAME;
		SpaceInvadersNamespace.Sprite.call(that, config);

		that.__type = "Explosion";

		that.animationFrameSpeed = 32;
		that.frameIndex = 0;
		that.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		that.repeatAnimation = false;
		that.isCompleted = false;
	}

	Explosion.prototype.update = function(lastFrameEllapsedTime, keyboard) {
		let that = this;

		that.frameIndex += that.animationFrameSpeed * lastFrameEllapsedTime;
	}

	Explosion.prototype.render = function() {
		let that = this,
			ctx = that.context,
			max = that.frames.length,
			idx = Math.floor(that.frameIndex),
			frame = that.frames[idx % max],
			imageOffsetX = frame * WIDTH;
			imageOffsetY = 0;

		if(!that.repeatAnimation && idx >= max) {
			that.isCompleted = true;
			return;
		}

		if (that.image) {
			ctx.drawImage(that.image, imageOffsetX, imageOffsetY, WIDTH, HEIGHT, that.x, that.y, WIDTH, HEIGHT);
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Explosion = Explosion;
})();