define([
	'app/objects/Platform',
	'app/objects/CurveRoadSection',
	'random',
	'noisejs/perlin'
], function(
	Platform,
	CurveRoadSection,
	random
){
	var fn = function(world, levelSeed) {

		noise.seed(levelSeed);
		// this.rand = new random(levelSeed);

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
		var initCurve = this.buildFrom(x, y);
		this.firstNode = initCurve.startNode;
		this.lastNode = initCurve.lastNode;

		this.update(this.lastNode.x);
	}

	// TODO: move road generation logic into separate entiry
	// 		 and leave only track rotation logic here
	//		 so that we may be able to introduce multiple road generation algorythms
	fn.prototype.buildFrom = function(prevx, prevy) {
		// initialize next value from noise generation
		this.trackIndex++;

		var ydelta = noise.simplex2(this.trackIndex, 0); // 1D noise
		var heighCoeficient = 0.05 * (this.trackIndex < 50 ? 50 : this.trackIndex);
		heighCoeficient = 1.6; //1.5;

		y = 17 + ydelta * heighCoeficient ;
		var xdelta = heighCoeficient * 5; // 3.5; 
		x = prevx + xdelta;

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

	fn.prototype.remove = function() {
		// cleanup the road nodes
		var currNode = this.firstNode;
		var nextNode = null;

		while (currNode.next) {
			nextNode = currNode;
			currNode.remove();
			currNode = nextNode;
		}

		currNode = null;
		nextNode = null;
		this.firstNode = null;
		this.lastNode = null;

		// cleanup allocated objects
		this.cr = null;
		this.trackIndex = null;
		// this.rand = null;
	}
	
	return fn;

});