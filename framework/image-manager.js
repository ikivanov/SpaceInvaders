(function() {
	function ImageManager() {
		let that = this;

		that.cachedImages = {};
	}

	ImageManager.prototype = {
		loadImage: function(url) {
			let that = this,
				promise = new Promise(function(resolve, reject) {
					let image = that.cachedImages[url];

					if (image) {
						resolve(image);
					} else {
						image = new Image();
						image.onload = function() {
							that.cachedImages[url] = image;
							resolve(image);
						}
						image.src = url;
					}
				});

			return promise;
		},

		loadImages: function() {
			let that = this,
				promise = Promise.all([
					that.loadImage("images/background.png"),
					that.loadImage("images/explosion.png"),
					that.loadImage("images/invader1.png"),
					that.loadImage("images/invader2.png"),
					that.loadImage("images/spacecraft.png")
				]);

			return promise;
		},

		getImage: function(url) {
			let that = this;

			return that.cachedImages[url];
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.ImageManager = new ImageManager();
})();