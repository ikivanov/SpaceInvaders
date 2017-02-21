(function() {
	const SPACECRAFT_IMAGE = "images/spacecraft.png",
		SPEED_X = 5,
		MIN_X = 5,
		MAX_X = 545,
		SPACECRAFT_WIDTH = 50,
		FIRE_INTERVAL = 250;

	let utils = SpaceInvadersNamespace.Utils;

	function Spacecraft(config) {
		let that = this;

		that.context = config.context;
		that.position = config.position;
		that.image = utils.getImage(SPACECRAFT_IMAGE);

		that.lastFireTime = new Date();
	}

	Spacecraft.prototype = {
		update: function(keyboard) {
			let that = this;

			if (!keyboard) {
				return;
			}

			if (keyboard.keys.ArrowLeft === true) {
				if (that.position.x - SPEED_X < MIN_X) {
					that.position.x = MIN_X;
				} else {
					that.position.x -= SPEED_X;
				}
			}

			if (keyboard.keys.ArrowRight === true) {
				if (that.position.x + SPEED_X > MAX_X) {
					that.position.x = MAX_X;
				} else {
					that.position.x += SPEED_X;
				}
			}

			if (keyboard.keys.Space === true && that._canFire()) {
				let centerX = Math.floor(that.position.x + SPACECRAFT_WIDTH / 2);
				SpaceInvadersNamespace.GameObject.onMissileLaunched("allied", centerX, that.position.y);
			}
		},

		_canFire: function() {
			let that = this,
				now = new Date();

			if (now.getTime() - that.lastFireTime.getTime() > FIRE_INTERVAL) {
				that.lastFireTime = now;
				return true;
			}

			return false;
		},

		render: function() {
			let that = this,
				ctx = that.context;

			ctx.drawImage(that.image, that.position.x, that.position.y);
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Spacecraft = Spacecraft;
})();