(function() {
	const SHIELD_BLOCK_IMAGE = "",
		SHIELD_BLOCK_LENGTH = 12;

	Shield.prototype = Object.create(SpaceInvadersNamespace.Sprite.prototype);
	Shield.prototype.constructor = Shield;

	function Shield(config) {
		let that = this;

		SpaceInvadersNamespace.Sprite.call(that, config);

		that.shieldBlockRowsCount = config.shieldBlockRowsCount || 3;
		that.shieldBlockColsCount = config.shieldBlockColsCount || 10;
		//that.image = utils.getImage(SHIELD_BLOCK_IMAGE);

		that.width = that.shieldBlockColsCount * SHIELD_BLOCK_LENGTH;
		that.height = that.shieldBlockRowsCount * SHIELD_BLOCK_LENGTH;

		that.shieldBlocks = [];

		for (let i = 0; i < that.shieldBlockRowsCount; i++) {
			let row = [];

			for (let j = 0; j < that.shieldBlockColsCount; j++) {
				row.push({
					x: that.x + j * SHIELD_BLOCK_LENGTH,
					y: that.y + i * SHIELD_BLOCK_LENGTH,
					width: SHIELD_BLOCK_LENGTH,
					isDestroyed: false
				});
			}

			that.shieldBlocks.push(row);
		}
	}

	Shield.prototype.update = function() {
		//if collision with missile -> shieldBlock.isDestroyed = true
	}

	Shield.prototype.render = function() {
		let that = this,
			ctx = that.context;

		for (let i = 0; i < that.shieldBlocks.length; i++) {
			let shieldBlocksRow = that.shieldBlocks[i];

			for (let j = 0; j < shieldBlocksRow.length; j++) {
				if (shieldBlocksRow[j].isDestroyed) {
					continue;
				}

				ctx.strokeStyle = "gray";
				ctx.fillStyle = "red";

				var x = that.x + j * SHIELD_BLOCK_LENGTH,
					y = that.y + i * SHIELD_BLOCK_LENGTH;

				ctx.strokeRect(x, y, SHIELD_BLOCK_LENGTH, SHIELD_BLOCK_LENGTH);
				ctx.fillRect(x, y, SHIELD_BLOCK_LENGTH, SHIELD_BLOCK_LENGTH);
			}
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Shield = Shield;
})();