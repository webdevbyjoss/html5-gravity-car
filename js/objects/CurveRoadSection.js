define([
	'app/objects/Platform'
], function(
	Platform
){
	var fn = function(world) {
		this.world = world;
	};

	/**
	 * Builds curve road section
	 */
	fn.prototype.buildCurve = function(sx, sy, w, h) {

		// validate parameters
		if (!sx || !sy) {
			throw "start {x, y} coordinates should be provided";
		}
		if (w < 0) {
			throw "width should be positive number, moving backward is not supported";
		}

		// QUICKFIX: avoid infinity and division by zero
		if (h == 0) {
			h = 0.1;
		}

		// we allow negative height, because that will allow us going up and down
		var absh = Math.abs(h);

		// detect the resolution of curve (number of segments we need to draw)
		// just take the avg number from w and h and calculate the scale value for each coordinate axis
		var rs = avg(w, absh);
		var dx = w / rs;
		var dy = h / rs;

		// detect the angle delta assuming that we need to go from 0 to Pi
		// in radians with appropriate resolution
		var da = Math.PI / rs;

		// based on direction we should set appropriate start and end positions
		var a1 = null;
		var a2 = null;
		// we will be moving
		/*if (h < 0) {*/
			// from 0 to Pi when building segment from up to down
		a1 = 0;
		a2 = Math.PI;
		/*}/* else {
			// from Pi to 2*Pi when building segment from down to up
			a1 = Math.PI
			a2 = 2*Math.PI;
		}*/

		// run through coordinates and draw curve
		var prevx, prevy;
		var x = sx;
		var y = sy;
		var dw = 0,
			dh = 0;

		// as platforms are build into linked list we will save start node here
		// and return to external world
		var startNode = null;
		// current and previous node from linked list
		var currentNode = null;
		var prevNode = null;
		for (var a = a1; a < a2; a += da) {
			prevx = x;
			prevy = y;

			dw = dx;
			dh = Math.sin(a) * dy * 1.6; //  * dy;

			x += dw;
			y += dh; // y axis has direction to the bottom

			// lets save previous node and generate new one
			prevNode = currentNode;
			currentNode = new Platform(this.world, prevx, prevy, x, y);
			if (startNode === null) {
				startNode = currentNode;
			} else {
				prevNode.next = currentNode;
			}
		}

		return {
			'lastNode': currentNode,
			'startNode': startNode
		};
	};

	return fn;

});