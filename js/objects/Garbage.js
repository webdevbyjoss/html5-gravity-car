define(function(){
	return function(world, params) {
		this.world = world;

	    var fixDef = Object.create(this.world.fixDef);
	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_dynamicBody;
	    fixDef.density = 0.01;
	    fixDef.friction = 0.2;
	    fixDef.restitution = 0.5;

		var isCircle = Math.random() > 0.3;
		var sizeX, sizeY, radius;
		
	    // spawn either poly or circle
        if(!isCircle) {
           fixDef.shape = new b2PolygonShape;
		   sizeX = Math.random() + 0.5; // half width
		   sizeY = Math.random() + 0.5; // half height
           fixDef.shape.SetAsBox(sizeX, sizeY);
        } else {
		   radius = Math.random() + 1; // radius
           fixDef.shape = new b2CircleShape(radius);
        }

        bodyDef.position.x = Math.random() * 10 + params.x;
        bodyDef.position.y = params.y + (Math.random() - 0.5) * 5;
        this.body = this.world.b2world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);

        // create visual representation
        if(!isCircle) {
			// Create a box for rectangular garbage
		   	var geometry = new THREE.CubeGeometry(sizeX * 2, sizeY * 2, 1);
			var material = new THREE.MeshLambertMaterial({ 
				color: Math.random() > 0.5 ? 0xCC4444 : 0x8B4513 
			});
			this.mesh = new THREE.Mesh(geometry, material);
		} else {
			// Create a cylinder for circular garbage
			var geometry = new THREE.CylinderGeometry(radius, radius, 1, 8);
			var material = new THREE.MeshLambertMaterial({ 
				color: Math.random() > 0.5 ? 0x996633 : 0x884422
			});
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.rotation.x = Math.PI / 2; // Rotate cylinder to face up
		}
		
		// Add the mesh to the scene
		world.scene.add(this.mesh);
		
		// Set initial position
		this.mesh.position.x = bodyDef.position.x;
		this.mesh.position.y = bodyDef.position.y;

        this.update = function() {
        	// Update visual position to match physics
			var pos = this.body.GetPosition();
			var angle = this.body.GetAngle();
			
			this.mesh.position.x = pos.x;
			this.mesh.position.y = pos.y;
			this.mesh.rotation.z = angle;
        }
		
		// Add this garbage object to the world's update list
		if (!world.garbageObjects) {
			world.garbageObjects = [];
		}
		world.garbageObjects.push(this);
	}
});