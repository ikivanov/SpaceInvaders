(function() {
	Label.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Label.prototype.constructor = Label;

	function Label(config) {
		let that = this;

		config.isNonPlayable = true;
		SpaceInvadersNamespace.Sprite.call(that, config);

		that.__type = "Label";
		that.text = config.text;
	}

	Label.prototype.render = function() {
		var that = this,
			ctx = that.context;

		ctx.font = "14px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "left";
		ctx.fillText(that.text, that.x, that.y);
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Label = Label;
})();