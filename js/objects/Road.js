define([
	'random',
	'app/objects/Platform',
	'app/objects/Garbage',
	'app/objects/CurveRoadSection',
	'noisejs/perlin'
], function(
	random,
	Platform,
	Garbage,
	CurveRoadSection
){
	return function(world, levelSeed) {
		
		var rand = new random();

		// GOOD level coeficients examples
		levelSeed = 5; // base constructor
		
		rand.seed(levelSeed);
		noise.seed(levelSeed);

		var length = 500;

		var x = 1;
		var y = 18;
		var ydelta = 0;
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

		var p1 = 2; // rand.nextInt(1, 4);// 2;
		var p2 = 3; // p1; rand.nextInt(1, 6); // 3
		var p3 = 10; // p1; rand.nextInt(1, 20);// 10;
		var r1 = 0.5; //rand.next() / 2; // 0.5
		var r2 = 0.3; // rand.next() / 6; // 0.3
		var r3 = 0.05; // rand.next() / 20// 0.05;

		// draw road
		var cr = new CurveRoadSection(world);
		var end = {};

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

			ydelta = noise.simplex2(i, 0); // 1D noise
			y = 17 + ydelta * 3;
			x = x + 10; //Math.abs(ydelta * 10);

			dx = x - prevx;
			dy = y - prevy;


			cr.buildChain(prevx, prevy, x, y);

			/*
			end = cr.buildCurve(prevx, prevy, dx, dy);
			x = end.x;
			y = end.y;
			*/

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

		this.update = function() {

		}

	}

	function avg(a, b) {
		return (a + b) / 2;
	}


});