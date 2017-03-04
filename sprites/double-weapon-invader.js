(function() {
	const IMAGE_FILENAME = "images/double-weapon-invader.png";

	class DoubleWeaponInvader extends SpaceInvadersNamespace.Invader {
		constructor(config) {
			config.imageFilename = IMAGE_FILENAME;
			super(config);

			let that = this;
			that.scoreBonus = 20;
			that.__type = SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader;
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.DoubleWeaponInvader = DoubleWeaponInvader;
})();