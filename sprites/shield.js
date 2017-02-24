(function() {
	const WIDTH = 12,
		HEIGHT = 12;

	Shield.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Shield.prototype.constructor = Shield;

	function Shield(config) {
		let that = this;

		config.width = WIDTH;
		config.height = HEIGHT;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.__type = "Shield";
	}

	Shield.prototype.render = function() {
		let that = this,
			ctx = that.context;

		ctx.strokeStyle = "gray";
		ctx.fillStyle = "red";

		ctx.strokeRect(that.x, that.y, WIDTH, HEIGHT);
		ctx.fillRect(that.x, that.y, WIDTH, HEIGHT);
	}

	Shield.prototype.onCollidedWith = function(sprite) {
		let that = this,
			type = sprite.__type;

		if (type === "Missile" || type === "Invader") {
			that.game.removeChild(that);
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Shield = Shield;
})();