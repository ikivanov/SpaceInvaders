(function() {
	const VELOCITY_Y = 600,
		WIDTH = 4,
		HEIGHT = 10;

	let utils = SpaceInvadersNamespace.Utils;

	class Missile extends SpaceInvadersNamespace.Sprite {
		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			let that = this;

			that.type = config.type;
			that.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;

			if (that.type === "allied") {
				that.velocityY *= -1;
			}

			that.__type = SpaceInvadersNamespace.consts.SpriteType.Missile;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			super.update(lastFrameEllapsedTime, keyboard);

			if (that.x <= 0 || that.x + that.width >= that.game.width ||
				that.y <= 0 || that.y + that.height > that.game.height) {
				that.game.onMissileOutOfScreen(that);
			}
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.fillStyle = "yellow";
			ctx.fillRect(that.x, that.y, that.width, that.height);
		}

		onCollidedWith(sprite) {
			let that = this;

			that.game.removeChild(that);
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Missile = Missile;
})();