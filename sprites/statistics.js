(function() {
	const
		LEVEL_OFFSET = 75,
		SCORES_OFFSET = 150;

	Statistics.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Statistics.prototype.constructor = Statistics;

	function Statistics(config) {
		let that = this;

		config.isNonPlayable = true;
		SpaceInvadersNamespace.Sprite.call(that, config);

		that.lives = 0;
		that.level = 0;
		that.scores = 0;

		that.__type = "Statistics";
	}

	Statistics.prototype.update = function(lastFrameEllapsedTime, keyboard) {
		let that = this;

		that.lives = that.game.spacecraft ? that.game.spacecraft.lives : 0;
		that.level = that.game.level;
		that.scores = that.game.scores;
	}

	Statistics.prototype.render = function() {
		let that = this,
			ctx = that.context;

		ctx.font = "14px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "left";

		ctx.fillText(`Lives: ${that.lives}`, that.x, that.y);
		ctx.fillText(`Level: ${that.level}`, that.x + LEVEL_OFFSET, that.y);
		ctx.fillText(`Scores: ${that.scores}`, that.x + SCORES_OFFSET, that.y);
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Statistics = Statistics;
})();