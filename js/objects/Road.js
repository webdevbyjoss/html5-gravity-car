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

		// Use a random seed instead of a fixed value
		if (window.location.search.indexOf('seed=') !== -1) {
			// If there's a seed parameter in the URL, use that seed
			var urlParams = new URLSearchParams(window.location.search);
			levelSeed = parseInt(urlParams.get('seed'), 10) || Math.floor(Math.random() * 10000);
		} else {
			// Generate a new random seed on each restart
			levelSeed = Math.floor(Math.random() * 10000);
		}
		
		// Log the seed for sharing interesting tracks
		console.log("Track seed: " + levelSeed);
		
		rand.seed(levelSeed);

		// Generate a 10 kilometer road at once
		generateLongRoad(10000); // 10000 meters = 10 kilometers

		function generateLongRoad(roadLength) {
			// Each segment is approximately 3 units long
			// So we need roadLength/3 segments to create a road of the desired length
			var numSegments = Math.ceil(roadLength / 3);
			
			console.log("Generating road with " + numSegments + " segments");
			
			var x = 0;
			var y = 18;
			var yradians = 0;
			var w = 0;
			var l = 0;
			var prevx = 0;
			var prevy = 18;
			var mx = 0;
			var my = 0;
			var mw = 0;
			var dx = 0;
			var dy = 0;
			var angle = 0;

			// Generate all road segments at once
			for (var i = 0; i < numSegments; i++) {
				// Shift to next position
				prevx = x;
				prevy = y;

				// Calculate the next y position based on various sine waves
				// This creates a natural-looking hilly terrain
				yradians += Math.PI * 0.2;

				y = 17 + Math.sin(1.5 * yradians)
					+ 2 * Math.sin(0.5 * yradians)
					+ 3 * Math.sin(0.3 * yradians)
					+ 10 * Math.sin(0.05 * yradians);

				x += 3;

				// Create oriented platform
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

				// Occasionally add obstacles based on the random seed
				if (rand.next() < 0.03 && i > 100) { // Avoid obstacles in the starting area
					dropGarbage(x, y - 2);
				}
			}
			
			console.log("Road generation complete. Total length: " + x + " units");
		}

		function dropGarbage(x, y) {
			// Add some obstacles/garbage to make the track more interesting
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