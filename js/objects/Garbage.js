define(function(){
	return function(world, params) {
		this.world = world;

	    var fixDef = Object.create(this.world.fixDef);
	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_dynamicBody;
	    fixDef.density = 0.01;
	    fixDef.friction = 0.2;
	    fixDef.restitution = 0.5;

	    // spawn either poly or circle
        if(Math.random() > 0.3) {
           fixDef.shape = new b2PolygonShape;
           fixDef.shape.SetAsBox(
                 Math.random() + 0.5 //half width
              ,  Math.random() + 0.5 //half height
           );
        } else {
           fixDef.shape = new b2CircleShape(
              Math.random() + 1 //radius
           );
        }

        bodyDef.position.x = Math.random() * 10 + params.x;
        bodyDef.position.y = params.y + (Math.random() - 0.5) * 5;
        this.world.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

        // create visual representation
        


        this.update = function() {
        	// update position
        	
        }


	}
});