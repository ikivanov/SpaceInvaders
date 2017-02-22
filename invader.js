(function() {
	const INVADER_IMAGE = "images/invader1.png",
		SPEED_X = 5,
		MIN_X = 5,
		MAX_X = 545,
		INVADER_WIDTH = 50,
		FIRE_INTERVAL = 250;

	let utils = SpaceInvadersNamespace.Utils;

	function Invader(config) {
		let that = this;

		that.context = config.context;
		that.formation = config.formation;
		that.position = config.position;
		that.image = utils.getImage(INVADER_IMAGE);

		that.lastFireTime = new Date();
	}

	Invader.prototype = {
		update: function() {
			let that = this;
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
	SpaceInvadersNamespace.Invader = Invader;
})();