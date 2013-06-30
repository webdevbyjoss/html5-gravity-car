define([
	'random',
	'app/objects/Platform',
	'app/objects/Garbage'
], function(
	random,
	Platform,
	Garbage
){
	return function(world, levelSeed) {
		
		var rand = new random();

		levelSeed = 1;
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
		var ydir = 0;

		// draw road
		for (var i = 0; i <= length; i++) {

			var w = 5 + (rand.next() - 0.5) * levelSeed;
			var l = 3 + (rand.next() - 0.5) * levelSeed;

			// create horisontal platform
			new Platform(world, {
				'pos': {'x': x + (w * 0.5) , 'y': y},
				'box': {'w': w, 'h': 0.5}
			});

			// shift to next position
			prevx = x;
			prevy = y;

			// lets descide where we should move
			ydir = (rand.next() - 0.5);
			y = y + (rand.next() - 0.5) * ((w + l) / 2);

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

			/*
			if (Math.random() < 0.3) {
				dropGarbage(x, y);
			}
			*/

		}

		function dropGarbage(x, y) {
			// fill it with garbage
		    var garbage = [];
		    for(var i = 0; i < 2; ++i) {
		    	garbage[i] = new Garbage(world, {
		    		'x': x,
		    		'y': y
		    	});
		    }
		}

	}



	function avg(a, b) {
		return (a + b) / 2;
	}

});