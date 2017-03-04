define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const IMAGE_FILENAME = "images/background.png";
	class Background extends Sprite {
		constructor() {
			super({
				x: 0,
				y: 0,
				imageFilename: IMAGE_FILENAME,
				isNonPlayable: true
			});

			let that = this;
			that.__type = consts.SpriteType.Background;
		}
	}

	return Background;
});