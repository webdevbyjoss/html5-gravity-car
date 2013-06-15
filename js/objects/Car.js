define(function(){
    return function(world, data) {
        
        this.world = world;
        this.carBody = null;
        this.wheel1 = null;
        this.wheel2 = null;
        this.motor1 = null;
        this.motor2 = null;
        this.axle1 = null;
        this.axle2 = null;
        this.spring1 = null;
        this.spring2 = null;

        var force = 2700;


  	    var fixDef = Object.create(this.world.fixDef);
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(
          2, //half width
          1  //half height
        );

        // define car body
  	    var bodyDef = new b2BodyDef;

        //create car body
        fixDef.density = 50;
        fixDef.friction = 10;
        fixDef.restitution = 0;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(data.w * 0.5, data.h * 0.5);

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(data.posx, data.posy);
        this.carBody = this.world.b2world.CreateBody(bodyDef);
        this.carBody.CreateFixture(fixDef);

        fixDef.shape.SetAsOrientedBox(
            data.w * 0.25,
            data.h * 0.35,
            new b2Vec2(-0.25, -1), 0
        );
        this.carBody.CreateFixture(fixDef);


        var anchor, localX, localY, revoluteJ;
        //create wheel1
        localX = (data.wheelRadius * 1.5 - data.w * 0.5);
        localY = data.h * 0.4;
        anchor = this.carBody.GetWorldPoint(new b2Vec2(localX, localY));
        fixDef.density = 100;
        fixDef.friction = 100;
        fixDef.restitution = 0.3;
        fixDef.shape = new b2CircleShape(data.wheelRadius);
        bodyDef.position.Set(anchor.x, anchor.y);
        this.wheel1 = this.world.b2world.CreateBody(bodyDef);
        this.wheel1.CreateFixture(fixDef);

        //create wheel1 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.carBody, this.wheel1, anchor);
        this.motor1 = this.world.b2world.CreateJoint(revoluteJ);

        //create wheel 2
        localX = (data.w * 0.5 - data.wheelRadius * 2);
        anchor = this.carBody.GetWorldPoint(new b2Vec2(localX, localY));
        bodyDef.position.Set(anchor.x, anchor.y);
        this.wheel2 = this.world.b2world.CreateBody(bodyDef);
        this.wheel2.CreateFixture(fixDef);

        //create wheel2 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.carBody, this.wheel2, anchor);
        this.motor2 = this.world.b2world.CreateJoint(revoluteJ);



        // create visual opengl representation of the car
        // build visual representation of car body
        var geometryBody = new THREE.CubeGeometry(data.w, data.h, 1);
        var geometryTop = new THREE.CubeGeometry(data.w, data.h, 1);

        var material = new THREE.MeshLambertMaterial( { color: 0x248F24 } );

        var glcarBody = new THREE.Mesh( geometryBody, material );
        glcarBody.add(geometryTop);

        // create wheels
        var wheelgeometry = new THREE.CylinderGeometry(
            data.wheelRadius,
            data.wheelRadius,
            0.25,
            8,
            1,
            false
        );
        var wheelMaterial = new THREE.MeshLambertMaterial( { color: 0x62625E } );

        var glWheel1left = new THREE.Mesh( wheelgeometry, wheelMaterial );
        var glWheel2left = new THREE.Mesh( wheelgeometry, wheelMaterial );

        var glWheel1right = new THREE.Mesh( wheelgeometry, wheelMaterial );
        var glWheel2right = new THREE.Mesh( wheelgeometry, wheelMaterial );

        glWheel1left.rotation.x = Math.PI/2;
        glWheel2left.rotation.x = Math.PI/2;
        glWheel1right.rotation.x = Math.PI/2;
        glWheel2right.rotation.x = Math.PI/2;

        glWheel1left.position.x = -1.5;
        glWheel2left.position.x = 1.3;
        glWheel1right.position.x = -1.5;
        glWheel2right.position.x = 1.3;


        glWheel1left.position.z = -1;
        glWheel2left.position.z = -1;
        glWheel1right.position.z = 1;
        glWheel2right.position.z = 1;


        glWheel1left.position.y = 0.42;
        glWheel2left.position.y = 0.42;
        glWheel1right.position.y = 0.42;
        glWheel2right.position.y = 0.42;


        // attach wheels to the car        
        glcarBody.add(glWheel1left);
        glcarBody.add(glWheel2left);
        glcarBody.add(glWheel1right);
        glcarBody.add(glWheel2right);


        world.scene.add( glcarBody );

        this.update = function(input) {
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

            // update opengl position
            var bodyDef2 = this.carBody.GetDefinition();
            glcarBody.position.x = bodyDef2.position.x;
            glcarBody.position.y = bodyDef2.position.y;
            glcarBody.rotation.z = bodyDef2.angle;

            var wheel1Def = this.wheel1.GetDefinition();
            var wheel2Def = this.wheel2.GetDefinition();
            glWheel1left.rotation.y = wheel1Def.angle;
            glWheel2left.rotation.y = wheel2Def.angle;
            glWheel1right.rotation.y = wheel1Def.angle;
            glWheel2right.rotation.y = wheel2Def.angle;
        }
    }
})