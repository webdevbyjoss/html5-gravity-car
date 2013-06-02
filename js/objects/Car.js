define(function(){
    return function(world, data) {
        
        this.world = world;
        this.car = null;
        this.wheel1 = null;
        this.wheel2 = null;
        this.motor1 = null;
        this.motor2 = null;
        this.axle1 = null;
        this.axle2 = null;
        this.spring1 = null;
        this.spring2 = null;

  	    var fixDef = Object.create(this.world.fixDef);
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(
          2, //half width
          1  //half height
        );

        // define car body
  	    var bodyDef = new b2BodyDef;

        //create car body
        fixDef.density = 5.0;
        fixDef.friction = 1;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(data.size.width * 0.5 / box2dConfig.PixelToMeter, data.size.height * 0.5 / box2dConfig.PixelToMeter);

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(data.position.x / box2dConfig.PixelToMeter, data.position.y / box2dConfig.PixelToMeter);
        this.car = this.world.b2world.CreateBody(bodyDef);
        this.car.CreateFixture(fixDef);

        fixDef.shape.SetAsOrientedBox(
            data.size.width * 0.25 / box2dConfig.PixelToMeter,
            data.size.height * 0.35 / box2dConfig.PixelToMeter,
            new b2Vec2(-0.25, -1), 0
        );
        this.car.CreateFixture(fixDef);


        var anchor, localX, localY, revoluteJ;
        //create wheel1
        localX = (data.wheelRadius * 1.5 - data.size.width * 0.5) / box2dConfig.PixelToMeter;
        localY = data.size.height * 0.4 / box2dConfig.PixelToMeter;
        anchor = this.car.GetWorldPoint(new b2Vec2(localX, localY));
        fixDef.density = 3.0;
        fixDef.friction = 10;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2CircleShape(data.wheelRadius / box2dConfig.PixelToMeter);
        bodyDef.position.Set(anchor.x, anchor.y);
        this.wheel1 = this.world.b2world.CreateBody(bodyDef);
        this.wheel1.CreateFixture(fixDef);

        //create wheel1 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.car, this.wheel1, anchor);
        this.motor1 = this.world.b2world.CreateJoint(revoluteJ);

        //create wheel 2
        localX = (data.size.width * 0.5 - data.wheelRadius * 2) / box2dConfig.PixelToMeter;
        anchor = this.car.GetWorldPoint(new b2Vec2(localX, localY));
        bodyDef.position.Set(anchor.x, anchor.y);
        this.wheel2 = this.world.b2world.CreateBody(bodyDef);
        this.wheel2.CreateFixture(fixDef);

        //create wheel2 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.car, this.wheel2, anchor);
        this.motor2 = this.world.b2world.CreateJoint(revoluteJ);

        this.update = function(input) {
            var force = 150;

            // this.motor1.SetMotorSpeed(15*Math.PI * (input.isPressed(40) ? 1 : input.isPressed(38) ? -1 : 0));
            // this.motor1.SetMaxMotorTorque(input.isPressed(40) || input.isPressed(38) ? 17 : 0.5);

            if (input.getKey(input.keyCode.A)) {
                this.wheel1.ApplyTorque(-1 * force);
                this.wheel2.ApplyTorque(-1 * force);
            }
            if (input.getKey(input.keyCode.D)) {
                this.wheel1.ApplyTorque(force);
                this.wheel2.ApplyTorque(force);
            }
        }
    }
})