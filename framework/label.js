(function() {
	Label.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Label.prototype.constructor = Label;

	function Label(config) {
		let that = this;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.isNonPlayable = true;
		that.text = config.text || "";
		that.color = config.color;
		that.size = config.size;
		that.fontFamily = config.fontFamily || "Arial";
		that.__type = "Label";
	}

	Label.prototype.render = function() {
		let that = this,
			ctx = that.context;

		ctx.font = `${that.size}px ${that.fontFamily}`;
		ctx.fillStyle = that.color;
		ctx.fillText(that.text, that.x, that.y);
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Label = Label;
})();