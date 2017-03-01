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
						image.onerror = function(err) {
							reject({ reason: `${url} does not exist` });
						}
						image.src = url;
					}
				});

			return promise;
		},

		loadImages: function(imagesToLoad) {
			let that = this,
				promises = [];

			if (!imagesToLoad || imagesToLoad.length === 0) {
				return Promise.reject({ reason: "Provide an image list to load before calling ImageManager.loadImages!" });
			}

			for (let i = 0; i < imagesToLoad.length; i++) {
				promises.push(that.loadImage(imagesToLoad[i]));
			}

			return Promise.all(promises);
		},

		getImage: function(url) {
			let that = this;

			return that.cachedImages[url];
		}
	};

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.ImageManager = new ImageManager();
})();