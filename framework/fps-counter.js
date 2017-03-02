(function() {
	const FPS_CALCULATION_TIME_INTERVAL = 1000;

	FPSCounter.prototype = Object.create(SpaceInvadersNamespace.Label.prototype);
	FPSCounter.prototype.constructor = FPSCounter;

	function FPSCounter(config) {
		let that = this;

		SpaceInvadersNamespace.Label.call(that, config);

		that.fps = 0;
		that.oldTime = new Date();
		that.framesCounter = 0;
		that.isNonPlayable = true;

		that.__type = "fpscounter";
	}

	FPSCounter.prototype.update = function(lastFrameEllapsedTime, keyboard) {
		let that = this,
			now = new Date(),
			diff = now.getTime() - that.oldTime.getTime();

		if (diff < FPS_CALCULATION_TIME_INTERVAL) {
			that.framesCounter++;
		} else {
			that.fps = that.framesCounter;
			that.framesCounter = 0;
			that.oldTime = new Date();
		}

		that.text = `fps: ${that.fps}`;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.FPSCounter = FPSCounter;
})();