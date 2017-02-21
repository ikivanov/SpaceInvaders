(function() {
	function Utils() {
	}

	Utils.getImage = function(filename) {
		var image = new Image();
		image.src = filename;
		return image;
	}

	window.SpaceInvadersNamespace = window.SpaceInvadersNamespace || {};
	SpaceInvadersNamespace.Utils = Utils;
})();