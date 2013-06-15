requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '..',
    }
});


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */callback, /* DOMElement Element */element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();
window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                    window.msCancelRequestAnimationFrame ||
                        clearTimeout;
})();

// Input component
(function () {

    input = {};

    input.keyCode = {
        // direction keys
        A: 65,
        D: 68,
        W: 87,
        S: 83,
        ARROW_RIGHT: 39,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_DOWN: 40,
        // action keys
        SPASE: 32,
        ENTER: 13,
        BACKSPACE: 8,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        J: 74,
        K: 75,
        L: 76,
    };

    // Keys Configuration
    input.keys = new Array(255);

    input.clearKeys = function () {
        for (var i = 0; i < this.keys.length; i++) {
            this.keys[i] = false;
        }
    };

    input.keyCount = new Array(255);
    input.clearKeyCount = function () {
        for (var i = 0; i < this.keyCount.length; i++) {
            this.keyCount[i] = 0;
        }
    };

    window.addEventListener("keydown", function (evt) {
        input.keys[evt.keyCode] = true;
        input.keyCount[evt.keyCode]++;
    }, true);
    window.addEventListener("keyup", function (evt) {
        input.keys[evt.keyCode] = false;
        input.keyCount[evt.keyCode] = 0;
    }, true);

    /**
     * Returns whether provided key is pressed
     * @param  {Number} keyCode 
     * @return {Boolean} true if key is pressed
     */
    input.getKey = function (keyCode) {
        return this.keys[keyCode];
    };

    /**
     * Check if key is pressed for the first time
     * @param  {Number} keyCode
     * @return {Boolean} true if key was just pressed
     */
    input.getKeyDown = function (keyCode) {
        if (this.keys[keyCode] && this.keyCount[keyCode] == 1) {
            this.keyCount[keyCode]++;
            return true;
        }
        return false;
    };

    input.clearKeys();
    input.clearKeyCount();

    // export into external scope
    window["input"] = input;

})();

/*
    // Export shortcuts of box2d into global space
    window.b2Vec2 = Box2D.Common.Math.b2Vec2;
    window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
    window.b2Body = Box2D.Dynamics.b2Body;
    window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    window.b2Fixture = Box2D.Dynamics.b2Fixture;
    window.b2World = Box2D.Dynamics.b2World;
    window.b2MassData = Box2D.Collision.Shapes.b2MassData;
    window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
*/

var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2AABB = Box2D.Collision.b2AABB,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
    b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
    b2RevoluteJointDef=Box2D.Dynamics.Joints.b2RevoluteJointDef;

(function() {
    //#region box2d,game,other配置
    var config = {
        //米到像素的缩放大小
        PixelToMeter: 30.0,
        //重力
        gravity: new b2Vec2(0, 10),
        //帧率
        fps: 1 / 60,
        //速度迭代次数
        vIterations: 10,
        //位置迭代次数
        pIterations: 10
        //是否监听键盘事件
        //keyboardListenerEnabled: true,
        //是否监听鼠标事件
        //mouseListenerEnabled: false
        //是否是鼠标关节可用
        //mouseJointEnabled:true
    };
    window["box2dConfig"] = config;
    //#endregion
})();


// Start the main app logic.
requirejs(['app/World'], function(World) {

    var world = new World();
    
    (function update() {
        // update the world first
        world.update(input);
        // then render the data
        world.render();
        // loop
        requestAnimationFrame(update);
    })();

});