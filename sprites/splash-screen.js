(function() {
	const IMAGE_FILENAME = "images/background.png",
		LOGO_FILENAME = "images/logo.png";

	let imageManager = SpaceInvadersNamespace.ImageManager;

	class SplashScreen extends SpaceInvadersNamespace.Sprite {
		constructor(config) {
			super({
				x: 0,
				y: 0,
				imageFilename: IMAGE_FILENAME,
				isNonPlayable: true
			});

			let that = this;

			this.logo = imageManager.getImage(LOGO_FILENAME);

			this.continueTextVisible = true;
			this.lastTime = Date.now();

			this.__type = "SplashScreen";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this,
				now = Date.now(),
				interval = that.continueTextVisible ? 900 : 750;

			if (now - that.lastTime > interval) {
				that.continueTextVisible = !that.continueTextVisible;
				that.lastTime = Date.now();
			}

			if (keyboard.keys.Space) {
				that.game.removeChild(that);
				that.game.loadSprites();
				that.game.start();
			}
		}

		render() {
			let that = this,
				ctx = that.context;

			SpaceInvadersNamespace.Sprite.prototype.render.call(that);

			ctx.font = "48px Arial";
			ctx.fillStyle = "red";
			ctx.save();
			ctx.translate(150, 150);
			ctx.rotate(350 * Math.PI / 180);
			ctx.fillText("Space Invaders", 0, 0);
			ctx.font = "16px Arial";
			ctx.fillText("by Ivan Ivanov", 230, 20);
			ctx.restore();
			ctx.fillStyle = "red";

			ctx.drawImage(that.logo, 200, 200);

			if (that.continueTextVisible) {
				ctx.fillStyle = "yellow";
				ctx.font = "16px Arial";
				ctx.fillText("Press Space to continue...", 225, 575);
			}

			ctx.font = "16px Arial";
			ctx.fillStyle = "yellow";
			ctx.fillText("Move left: A or " + String.fromCharCode(parseInt(2190, 16)), 25, 475);
			ctx.fillText("Move right: D or " + String.fromCharCode(parseInt(2192, 16)), 25, 500);
			ctx.fillText("Fire: Space", 25, 525);
			ctx.fillText("Pause Game: P", 25, 550);
			ctx.fillText("Resume Game: S", 25, 575);
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.SplashScreen = SplashScreen;
})();