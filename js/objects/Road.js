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
	var fn = function(world, levelSeed) {
		
		var rand = new random();

		// GOOD level coeficients examples
		levelSeed = 0; // base constructor
		
		rand.seed(levelSeed);
		noise.seed(levelSeed);

		var length = 1;

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

		// draw road
		this.cr = new CurveRoadSection(world);
		var end = {};

		this.backLimit = 10;
		this.frontLimit = 3;
		this.trackIndex = 0;

		this.firstNode = null; // start of linked list  [first -> next -> next -> last]
		this.lastNode = null; // end of linked list

		for (var i = 0; i <= length; i++) {

			// shift to next position
			end = this.buildFrom(x, y);

			if (this.firstNode === null) {
				this.firstNode = end.startNode;
				this.lastNode = end.lastNode;
			} else {
				this.lastNode.next = end.startNode
				this.lastNode = end.lastNode;
			}

			x = this.lastNode.x;
			y = this.lastNode.y;
		}
	}

	fn.prototype.buildFrom = function(prevx, prevy) {
		// initialize next value from noise generation
		this.trackIndex++;
		ydelta = noise.simplex2(this.trackIndex, 0); // 1D noise

		y = 17 + ydelta * 10;
		x = prevx + 20; //Math.abs(ydelta * 10);

		dx = x - prevx;
		dy = y - prevy;

		return this.cr.buildCurve(prevx, prevy, dx, dy);
	}

	fn.prototype.update = function(offsetX) {
		// remove extra nodes from the end
		var backCut = offsetX - this.backLimit;
		var nextNode = null;
		while (this.firstNode.x < backCut) {
			nextNode = this.firstNode.next;
			this.firstNode.remove();
			this.firstNode = nextNode;
		}

		// add extra nodes to the front
		var frontCut = offsetX + this.frontLimit;
		var curve = null;
		while (this.lastNode.x < frontCut) {
			curve = this.buildFrom(this.lastNode.x, this.lastNode.y);
			this.lastNode.next = curve.startNode;
			this.lastNode = curve.lastNode;
		}
	}

	function avg(a, b) {
		return (a + b) / 2;
	}

	return fn;

});