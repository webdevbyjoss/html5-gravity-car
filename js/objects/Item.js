define(function(){
	return function(world) {
		this.world = world;

	    var fixDef = Object.create(this.world.fixDef);
	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_dynamicBody;

	    // spawn either poly or circle
        if(Math.random() > 0.5) {
           fixDef.shape = new b2PolygonShape;
           fixDef.shape.SetAsBox(
                 Math.random() + 0.1 //half width
              ,  Math.random() + 0.1 //half height
           );
        } else {
           fixDef.shape = new b2CircleShape(
              Math.random() + 0.1 //radius
           );
        }

        bodyDef.position.x = Math.random() * 10 + 10;
        bodyDef.position.y = Math.random() * 10;
        this.world.b2world.CreateBody(bodyDef).CreateFixture(fixDef);
	}
})