(function() {
	FPSCounter.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	FPSCounter.prototype.constructor = FPSCounter;

	function FPSCounter(config) {
		let that = this;

		that.__type = "fpscounter";
		config.isNonPlayable = true;
		SpaceInvadersNamespace.Sprite.call(that, config);

		that.oldTime = new Date();
		that.framesCounter = 0;
		that.fps = 0;
	}

	FPSCounter.prototype = {
		update: function() {
			let that = this,
				now = new Date(),
				diff = now.getTime() - that.oldTime.getTime();

			if (diff < 1000) {
				that.framesCounter++;
			} else {
				that.fps = that.framesCounter;
				that.framesCounter = 0;
				that.oldTime = new Date();
			}
		},

		render: function() {
			let that = this,
				ctx = that.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText(`fps: ${that.fps}`, that.x, that.y);
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.FPSCounter = FPSCounter;
})();