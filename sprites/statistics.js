(function() {
	const
		LEVEL_OFFSET = 75,
		SCORES_OFFSET = 150;

	class Statistics extends SpaceInvadersNamespace.Sprite {
		constructor(config) {
			config.isNonPlayable = true;
			super(config);

			let that = this;

			that.lives = 0;
			that.level = 0;
			that.scores = 0;

			that.__type = SpaceInvadersNamespace.consts.SpriteType.Statistics;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			that.lives = that.game.spacecraft ? that.game.spacecraft.lives : 0;
			that.level = that.game.level;
			that.scores = that.game.scores;
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText(`Lives: ${that.lives}`, that.x, that.y);
			ctx.fillText(`Level: ${that.level}`, that.x + LEVEL_OFFSET, that.y);
			ctx.fillText(`Scores: ${that.scores}`, that.x + SCORES_OFFSET, that.y);
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Statistics = Statistics;
})();