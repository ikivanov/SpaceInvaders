(function() {
	const IMAGE_FILENAME = "images/double-weapon-invader.png";

	DoubleWeaponInvader.prototype = Object.create(SpaceInvadersNamespace.Invader.prototype);
	DoubleWeaponInvader.prototype.constructor = DoubleWeaponInvader;

	function DoubleWeaponInvader(config) {
		let that = this;

		config.imageFilename = IMAGE_FILENAME;
		SpaceInvadersNamespace.Invader.call(that, config);

		that.scoreBonus = 20;
		that.__type = SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.DoubleWeaponInvader = DoubleWeaponInvader;
})();