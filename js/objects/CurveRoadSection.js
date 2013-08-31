define([
	'app/objects/Platform'
], function(
	Platform
){
	var fn = function(world) {
		this.world = world;

	}

	/**
	 * Start
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
		if (h < 0) {
			// from 0 to Pi when building segment from up to down
			a1 = 0
			a2 = Math.PI;
		}/* else {
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
		for (var a = a1; a < a2; a += da) {
			prevx = x;
			prevy = y;

			dw = dw + 1 / dx;
			dh = dh + Math.sin(a) * dy;

			x += dw;
			y -= dh; // y axis has direction to the bottom

			this.buildChain(prevx, prevy, x, y);
		};

		return {'x':x , 'y': y};
	};

	// create oriented platform
	fn.prototype.buildChain = function(x1, y1, x2, y2) {

		mx = avg(x1, x2);
		my = avg(y1, y2);

		dx = x2 - x1;
		dy = y2 - y1;

		mw = Math.sqrt(dx*dx + dy*dy);
		angle = Math.atan2(dy, dx);

		new Platform(this.world, {
			'pos': {'x': mx, 'y': my},
			'box': {'w': mw, 'h': 0.2},
			'angle': angle
		});
	}
	
	function avg(a, b) {
		return (a + b) / 2;
	}

	return fn;

});