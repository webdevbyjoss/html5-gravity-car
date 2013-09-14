define([
	'app/objects/Platform',
	'app/objects/CurveRoadSection',
	'noisejs/perlin'
], function(
	Platform,
	CurveRoadSection
){
	var fn = function(world) {
		
		var levelSeed = 3;
		noise.seed(levelSeed);

		var x = 1;
		var y = 18;

		this.backLimit = 60;
		this.frontLimit = 40;
		this.trackIndex = 0;

		// draw road helper that builds curves from blocks
		this.cr = new CurveRoadSection(world);

		this.firstNode = null; // start of linked list  [first -> next -> next -> last]
		this.lastNode = null; // end of linked list

		// generate intial chain
		var initiCurve = this.buildFrom(x, y);
		this.firstNode = initiCurve.startNode;
		this.lastNode = initiCurve.lastNode;

		this.update(this.lastNode.x);
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
	
	return fn;

});