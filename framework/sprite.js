(function() {
	let imageManager = SpaceInvadersNamespace.ImageManager;

	function Sprite(config) {
		let that = this;

		that.context = config.context || null;
		that.game = null;
		that.x = config.x;
		that.y = config.y;
		that.width = config.width;
		that.height = config.height;
		that.zIndex = config.zIndex !== undefined ? config.zIndex : 0;

		that.image = null;
		if (config.imageFilename) {
			that.image = imageManager.getImage(config.imageFilename);
		}

		that.parent = null;
		that.velocityX = 0;
		that.velocityY = 0;
		that.isVisible = config.isVisible !== undefined ? config.isVisible : true;
		that.isDestoyed = false;
		that.isNonPlayable = config.isNonPlayable !== undefined ? config.isNonPlayable : false;
	}

	Sprite.prototype = {
		//override for custom updating
		update: function(lastFrameEllapsedTime, keyboard) {
			let that = this,
				distanceX = that.velocityX * lastFrameEllapsedTime,
				distanceY = that.velocityY * lastFrameEllapsedTime;

			that.x += distanceX;
			that.y += distanceY;
		},

		//override for custom rendering
		render: function() {
			let that = this,
				ctx = that.context;

			if (that.image) {
				ctx.drawImage(that.image, that.x, that.y);
				return;
			}
		},

		onCollidedWith: function(sprite) {
			//add effect or some custom action
		},

		getRect: function() {
			let that = this;

			return { x: that.x, y: that.y, width: that.width, height: that.height };
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Sprite = Sprite;
})();