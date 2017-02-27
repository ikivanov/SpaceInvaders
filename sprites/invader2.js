(function() {
	const IMAGE_FILENAME = "images/invader2.png";

	Invader2.prototype = Object.create(SpaceInvadersNamespace.Invader.prototype);
	Invader2.prototype.constructor = Invader2;

	function Invader2(config) {
		let that = this;

		config.imageFilename = IMAGE_FILENAME;
		SpaceInvadersNamespace.Invader.call(that, config);

		that.__type = "Invader2";
		that.scoreBonus = 20;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Invader2 = Invader2;
})();