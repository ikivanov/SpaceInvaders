(function() {
	function Utils() {
	}

	Utils.getImage = function(filename) {
		var image = new Image();
		image.src = filename;
		return image;
	}

	Utils.hasRectangularCollision = function(rect1, rect2) {
		if (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.height + rect1.y > rect2.y) {
			return true;
		}

		return false;
	}

	Utils.randomRange = function(min, max)
	{
		return ((Math.random()*(max - min)) + min);
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Utils = Utils;
})();