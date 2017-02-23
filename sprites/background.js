(function() {
	const IMAGE_FILENAME = "images/background.png";

	Background.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Background.prototype.constructor = Background;

	function Background() {
		let that = this;

		SpaceInvadersNamespace.Sprite.call(that, {
			x: 0,
			y: 0,
			imageFilename: IMAGE_FILENAME,
			isNonPlayable: true
		});
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Background = Background;
})();