(function() {
	const MISSILE_IMAGE = "images/Missile-50x46.png",
		SPEED_Y = 10,
		MISSILE_WIDTH = 4,
		MISSILE_HEIGHT = 10;

	let utils = SpaceInvadersNamespace.Utils;

	function Missile(config) {
		let that = this;

		that.context = config.context;
		that.type = config.type;
		that.position = config.position;
		that.height = MISSILE_HEIGHT;
		that.image = utils.getImage(MISSILE_IMAGE);
		that.speed = SPEED_Y;

		if (that.type === "allied") {
			that.speed *= -1;
		}
	}

	Missile.prototype = {
		update: function() {
			let that = this;

			that.position.y += that.speed;

			SpaceInvadersNamespace.GameObject.processMissileCollisionsIfNeeded(that);
		},

		render: function() {
			let that = this,
				ctx = that.context;

			ctx.fillStyle = "yellow";

			ctx.fillRect(that.position.x, that.position.y, MISSILE_WIDTH, MISSILE_HEIGHT);
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Missile = Missile;
})();