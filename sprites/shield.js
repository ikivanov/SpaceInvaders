(function() {
	const WIDTH = 12,
		HEIGHT = 12;

	class Shield extends SpaceInvadersNamespace.Sprite{
		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			let that = this;

			that.zIndex = 20;
			that.__type = SpaceInvadersNamespace.consts.SpriteType.Shield;
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.strokeStyle = "gray";
			ctx.fillStyle = "red";

			ctx.strokeRect(that.x, that.y, WIDTH, HEIGHT);
			ctx.fillRect(that.x, that.y, WIDTH, HEIGHT);
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === SpaceInvadersNamespace.consts.SpriteType.Missile ||
				type === SpaceInvadersNamespace.consts.SpriteType.Invader) {
				that.game.removeChild(that);
			}
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Shield = Shield;
})();