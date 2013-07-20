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

		// GOOD level coeficients examples
		levelSeed = 0; // base constructor
		levelSeed = 0.5;
		levelSeed = 1;
		
		/*
		levelSeed = 1.6;
		levelSeed = 2;
		levelSeed = 5;
		*/


		rand.seed(levelSeed);

		var length = 500; // rand.nextInt(1, 1000);

		var x = 0;
		var y = 18;
		var yradians = 0;
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
			/*
			var w = 3 + (rand.next() - 0.5) * levelSeed;
			var l = 5 + (rand.next() - 0.5) * levelSeed;

			// create horisontal platform
			new Platform(world, {
				'pos': {'x': x + (w * 0.5) , 'y': y},
				'box': {'w': w, 'h': 0.5}
			});
			*/

			// shift to next position
			prevx = x;
			prevy = y;

			// lets descide where we should move
			yradians += Math.PI * 0.2;

			y = 17 + Math.sin(levelSeed * yradians)
				+ 2 * Math.sin(0.5 * levelSeed * yradians)
				+ 3 * Math.sin(0.3 * levelSeed *  yradians)
				+ 10 * Math.sin(0.05 * levelSeed * yradians);
			/*
			y = 17 
				+ 5 * Math.sin(2 * yradians)
				+ 2 * Math.sin(0.5 * yradians)
				+ 3 * Math.sin(0.3 * yradians)
				+ 10 * (Math.sin(0.05 * yradians));
			*/

			x += 3; // rand.next() * ;

			// create oriented platform
			mx = avg(prevx, x);
			my = avg(prevy, y);
			dx = x - prevx;
			dy = y - prevy;
			mw = Math.sqrt(dx*dx + dy*dy);

			angle = Math.atan2(dy, dx);

			new Platform(world, {
				'pos': {'x': mx, 'y': my},
				'box': {'w': mw, 'h': 0.5},
				'angle': angle
			});

			/*
			if (Math.random() < 0.5) {
				dropGarbage(x, y - 10);
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