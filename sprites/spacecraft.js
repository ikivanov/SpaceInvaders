(function() {
	const SPEED_X = 5,
		MIN_X = 5,
		MAX_X = 545,
		WIDTH = 50,
		HEIGHT = 46,
		FIRE_INTERVAL = 250,
		IMAGE_FILENAME = "images/spacecraft.png";

	Spacecraft.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Spacecraft.prototype.constructor = Spacecraft;

	function Spacecraft(config) {
		let that = this;

		SpaceInvadersNamespace.Sprite.call(that, {
			x: config.x,
			y: config.y,
			width: WIDTH,
			height: HEIGHT,
			imageFilename: IMAGE_FILENAME
		});

		that.lastFireTime = new Date();

		that.__type = "Spacecraft";
	}

	Spacecraft.prototype.update = function(keyboard) {
		let that = this;

		if (!keyboard) {
			return;
		}

		if (keyboard.keys.ArrowLeft === true) {
			if (that.x - SPEED_X < MIN_X) {
				that.x = MIN_X;
			} else {
				that.x -= SPEED_X;
			}
		}

		if (keyboard.keys.ArrowRight === true) {
			if (that.x + SPEED_X > MAX_X) {
				that.x = MAX_X;
			} else {
				that.x += SPEED_X;
			}
		}

		if (keyboard.keys.Space === true && that._canFire()) {
			let centerX = Math.floor(that.x + WIDTH / 2);
			that.game.onMissileLaunched("allied", centerX, that.y);
		}
	}

	Spacecraft.prototype.onCollidedWith = function(sprite) {
		let that = this,
			type = sprite.__type;

		if (type === "Missile" || type === "Invader") {
			that.game.removeChild(that);
		}
	}

	Spacecraft.prototype._canFire = function() {
		let that = this,
			now = new Date();

		if (now.getTime() - that.lastFireTime.getTime() > FIRE_INTERVAL) {
			that.lastFireTime = now;
			return true;
		}

		return false;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Spacecraft = Spacecraft;
})();