define(function(){
	return function(world) {
		this.world = world;

	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_staticBody;
	    bodyDef.position.x = 8;
	    bodyDef.position.y = 19;

	    var fixDef = Object.create(this.world.fixDef);
	    fixDef.shape = new b2PolygonShape;
	    fixDef.shape.SetAsBox(7, 0.5);
	    
	    var platform1 = this.world.b2world.CreateBody(bodyDef)
	    platform1.CreateFixture(fixDef);

	    bodyDef.position.x = 15;
	    fixDef.shape.SetAsOrientedBox(5, 0.5, new b2Vec2(5, -1), -Math.PI/16);
	    var platform2 = this.world.b2world.CreateBody(bodyDef);
	    platform2.CreateFixture(fixDef);
	}
})