define(function(){
	return function(world, data) {
		
		this.world = world;

		// build fixture
	    var fixDef = Object.create(this.world.fixDef);
	    fixDef.shape = new b2PolygonShape;
	    fixDef.shape.SetAsBox(data.box.w * 0.5, data.box.h * 0.5);
	   
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

	    // build visual representation
	   	var geometry = new THREE.CubeGeometry(data.box.w, data.box.h, 3);
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
	}
})