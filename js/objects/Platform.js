define(function(){
	return function(world, data) {
		
		this.world = world;

		// build fixture
	    var fixDef = Object.create(this.world.fixDef);
	    fixDef.shape = new b2PolygonShape;
	    fixDef.shape.SetAsBox(data.box.w * 0.5, data.box.h * 0.5);
	   	fixDef.density = 1;
	    fixDef.friction = 1;
	    fixDef.restitution = 0;


		// build physical body according to data
	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_staticBody;
	    bodyDef.position.x = data.pos.x;
	    bodyDef.position.y = data.pos.y;
	    if (data.angle) {
	    	bodyDef.angle = data.angle;
	    }

	    this.obj = this.world.b2world.CreateBody(bodyDef);
	    this.fixture = this.obj.CreateFixture(fixDef);

	    // Calculate varying road width using sine wave (1-5 meters)
	    // Use x position to create a gradual change along the road
	    var roadWidth = calculateVaryingWidth(data.pos.x);
	    
	    // build visual representation with varying width
	   	var geometry = new THREE.CubeGeometry(data.box.w, data.box.h, roadWidth);
		var material = new THREE.MeshLambertMaterial( { color: 0x75A3FF } );
		var cube = new THREE.Mesh( geometry, material );
		world.scene.add( cube );

		// as platforms are never moved for now 
		// we can set the positions only once
		this.bodyDef2 = this.fixture.GetBody().GetDefinition();
		cube.position.x = this.bodyDef2.position.x;
		cube.position.y = this.bodyDef2.position.y;
		cube.rotation.z = this.bodyDef2.angle;

		// console.log(this.bodyDef2);
		this.update = function() {
			// do nothing for now as platforms are completely unmovable
		}
		
		// Function to calculate the varying width using a sine wave
		function calculateVaryingWidth(xPosition) {
			// Using sine function to oscillate between minimum and maximum values
			// Period control - adjust the 0.05 value to change how quickly the width varies
			var sinValue = Math.sin(0.05 * xPosition);
			
			// Scale and shift the sine wave to get values between 3 and 10
			// sin returns values between -1 and 1, so we scale by 3.5 and shift by 6.5 to get 3-10 range
			return 6.5 + 3.5 * sinValue;
		}
	}
})