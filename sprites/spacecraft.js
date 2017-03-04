(function() {
	const SPEED_X = 300,
		MIN_X = 5,
		MAX_X = 545,
		WIDTH = 50,
		HEIGHT = 46,
		FIRE_INTERVAL = 250,
		IMAGE_FILENAME = "images/spacecraft.png",
		LIVES = 3;

	class Spacecraft extends SpaceInvadersNamespace.Sprite{
		constructor(config) {
			super({
				x: config.x,
				y: config.y,
				width: WIDTH,
				height: HEIGHT,
				imageFilename: IMAGE_FILENAME
			});

			let that = this;

			that.lastFireTime = new Date();
			that.lives = LIVES;

			that.zIndex = 20;
			that.__type = SpaceInvadersNamespace.consts.SpriteType.Spacecraft;
		}

		update(lastFrameEllapsedTime, keyboard) {
			if (!keyboard) {
				return;
			}

			let that = this,
				distance = SPEED_X * lastFrameEllapsedTime;

			if (keyboard.keys.ArrowLeft || keyboard.keys.KeyA) {
				if (that.x - distance < MIN_X) {
					that.x = MIN_X;
				} else {
					that.x -= distance;
				}
			}

			if (keyboard.keys.ArrowRight || keyboard.keys.KeyD) {
				if (that.x + distance > MAX_X) {
					that.x = MAX_X;
				} else {
					that.x += distance;
				}
			}

			if (keyboard.keys.Space === true && that._canFire()) {
				let centerX = Math.floor(that.x + WIDTH / 2);
				that.game.onMissileLaunched(centerX, that.y);
			}
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === SpaceInvadersNamespace.consts.SpriteType.Missile ||
				type === SpaceInvadersNamespace.consts.SpriteType.Invader ||
				type === SpaceInvadersNamespace.consts.SpriteType.DoubleWeaponInvader) {
				that.lives--;

				if (that.lives === 0) {
					that.game.removeSpacecraft(that);

					that.game.addChild(new SpaceInvadersNamespace.Explosion({ x: that.x, y: that.y }));
				}
			}
		}

		_canFire() {
			let that = this,
				now = new Date();

			if (now.getTime() - that.lastFireTime.getTime() > FIRE_INTERVAL) {
				that.lastFireTime = now;
				return true;
			}

			return false;
		}
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Spacecraft = Spacecraft;
})();