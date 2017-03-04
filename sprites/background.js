(function() {
	const IMAGE_FILENAME = "images/background.png";

	class Background extends SpaceInvadersNamespace.Sprite {
		constructor() {
			super({
				x: 0,
				y: 0,
				imageFilename: IMAGE_FILENAME,
				isNonPlayable: true
			});

			let that = this;
			that.__type = SpaceInvadersNamespace.consts.SpriteType.Background;
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Background = Background;
})();