(function() {
	const IMAGE_FILENAME = "images/invader1.png",
		WIDTH = 50,
		HEIGHT = 55,
		FIRE_INTERVAL = 250,
		OFFSET_X = 50;

	Invader.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Invader.prototype.constructor = Invader;

	function Invader(config) {
		let that = this;

		config.imageFilename = IMAGE_FILENAME;
		config.width = WIDTH;
		config.height = HEIGHT;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.initialX = that.x;

		that.velocityX = -1;
		that.velocityY = 0;

		that.lastFireTime = new Date();

		that.__type = "Invader";
	}

	Invader.prototype.update = function() {
		let that = this;

		if (that.x < that.initialX - OFFSET_X || that.x > that.initialX + OFFSET_X) {
			that.velocityX *= -1;
			that.velocityY = 2.5;
		}

		if (that.y + that.height > that.game.height) {
			that.game.onInvaderOutOfScreen(that);
		}

		SpaceInvadersNamespace.Sprite.prototype.update.call(that);

		that.velocityY = 0;
	}

	Invader.prototype.onCollidedWith = function(sprite) {
		let that = this,
			type = sprite.__type;

		if (type === "Missile") {
			that.game.removeChild(that);

			//TODO: rework
			let invader = that.game.sprites.find(s => s.__type === "Invader");
			if (!invader) {
				that.game.gameOver();
			}
		}
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