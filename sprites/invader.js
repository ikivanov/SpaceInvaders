(function() {
	const IMAGE_FILENAME = "images/invader1.png",
		WIDTH = 50,
		HEIGHT = 55,
		FIRE_INTERVAL = 250;

	Invader.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Invader.prototype.constructor = Invader;

	function Invader(config) {
		let that = this;

		config.imageFilename = IMAGE_FILENAME;
		config.width = WIDTH;
		config.height = HEIGHT;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.lastFireTime = new Date();
	}

	Invader.prototype.update = function() {
		let that = this;

		that.velocityX = that.parent.velocityX;
		that.velocityY = that.parent.velocityY;

		SpaceInvadersNamespace.Sprite.prototype.update.call(that);
	}

	Invader.prototype._canFire = function() {
		let that = this,
			now = new Date();

		if (now.getTime() - that.lastFireTime.getTime() > FIRE_INTERVAL) {
			that.lastFireTime = now;
			return true;
		}

		return false;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Invader = Invader;
})();