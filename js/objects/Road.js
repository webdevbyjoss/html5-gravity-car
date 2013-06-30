define([
	'random',
	'app/objects/Platform',
], function(
	random,
	Platform
){
	return function(world, levelSeed) {
		
		var rand = new random();

		levelSeed = 2;
		rand.seed(levelSeed);

		var length = rand.nextInt(1, 300);

		var x = 0;
		var y = 18;
		var w = 0;
		var l = 0;
		var prevx = 0;
		var prevy = 0;
		var mx = 0;
		var my = 0;
		var mw = 0;
		var dx = 0;
		var dy = 0;
		var angle = 0;

		// draw road
		for (var i = 0; i <= length; i++) {

			var w = 10 + (rand.next() - 0.5) * 10 * levelSeed;
			var l = 20 + (rand.next() - 0.5) * 10 * levelSeed;

			// create horisontal platform
			new Platform(world, {
				'pos': {'x': x + (w * 0.5) , 'y': y},
				'box': {'w': w, 'h': 0.5}
			});

			// shift to next position
			prevx = x;
			prevy = y;
			y = y + (rand.next() - 0.5) * 10 * (levelSeed / 2);

			x += w + l;

			// create oriented platform
			mx = avg(prevx + w, x);
			my = avg(prevy, y);
			dx = x - (prevx + w);
			dy = y - prevy;
			mw = Math.sqrt(dx*dx + dy*dy);

			angle = Math.atan2(dy, dx);

			new Platform(world, {
				'pos': {'x': mx, 'y': my},
				'box': {'w': mw, 'h': 0.5},
				'angle': angle
			});
		}
	}

	function avg(a, b) {
		return (a + b) / 2;
	}

});