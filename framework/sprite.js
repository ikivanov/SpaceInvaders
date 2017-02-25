(function() {
	let utils = SpaceInvadersNamespace.Utils;

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
			that.image = utils.getImage(config.imageFilename);
		}

		that.parent = null;
		that.children = [];
		that.velocityX = 0;
		that.velocityY = 0;
		that.isVisible = config.isVisible !== undefined ? config.isVisible : true;
		that.isDestoyed = false;
		that.isNonPlayable = config.isNonPlayable !== undefined ? config.isNonPlayable : false;
	}

	Sprite.prototype = {
		//override for custom updating
		update: function() {
			let that = this;

			that.x += that.velocityX;
			that.y += that.velocityY;

			for (let i = 0; i < that.children.length; i++) {
				that.children[i].update();
			}
		},

		//override for custom rendering
		render: function() {
			let that = this,
				ctx = that.context;

			if (that.image) {
				ctx.drawImage(that.image, that.x, that.y);
				return;
			}

			if (that.children.length) {
				for (let i = 0; i < that.children.length; i++) {
					that.children[i].render();
				}
			}
		},

		addChild: function(sprite) {
			if (!sprite) {
				return;
			}

			let that = this;

			that.children.push(sprite);
			sprite.parent = that;
			sprite.context = that.context;
			sprite.game = that.game;
		},

		removeChild: function(sprite) {
			if (!sprite) {
				return;
			}

			let that = this,
				index = that.children.indexOf(sprite);

			if (index !== -1) {
				that.children.splice(index, 1);
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