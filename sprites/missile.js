(function() {
	const IMAGE_FILENAME = "images/Missile-50x46.png",
		VELOCITY_Y = 600, //pixels per second
		WIDTH = 4,
		HEIGHT = 10;

	let utils = SpaceInvadersNamespace.Utils;

	Missile.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Missile.prototype.constructor = Missile;

	function Missile(config) {
		let that = this;

		config.imageFilename = IMAGE_FILENAME;
		config.width = WIDTH;
		config.height = HEIGHT;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.type = config.type;
		that.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;

		if (that.type === "allied") {
			that.velocityY *= -1;
		}

		that.__type = "Missile";
	}

	Missile.prototype.update = function(lastFrameEllapsedTime, keyboard) {
		let that = this;

		SpaceInvadersNamespace.Sprite.prototype.update.call(that, lastFrameEllapsedTime, keyboard);

		if (that.x <= 0 || that.x + that.width >= that.game.width ||
			that.y <= 0 || that.y + that.height > that.game.height) {
			that.game.onMissileOutOfScreen(that);
		}
	}

	Missile.prototype.render = function() {
		let that = this,
			ctx = that.context;

		ctx.fillStyle = "yellow";
		ctx.fillRect(that.x, that.y, that.width, that.height);
	}

	Missile.prototype.onCollidedWith = function(sprite) {
		let that = this;

		that.game.removeChild(that);
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Missile = Missile;
})();