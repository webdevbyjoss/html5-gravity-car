define(function(){
    "use strict";

    var fn = function(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.textTemplate = "{X}m (best: {Y}m)"
        this.distanceLabel = null;

        var dis = 0;
        var maxDis = 0;

        this.setDistance(dis, maxDis);

        /* lets just leave these strings for fun, as a monument for TextGeometry */
        var textObj = this.createGLText('Hello world');
        textObj.rotation.z = Math.PI;
        textObj.rotation.y = Math.PI;
        textObj.position.set(35, 15, 20);
        this.scene.add(textObj);

        // this.camera.add(this.cube);
        // this.scene.add(this.cube);
    };

    fn.prototype.setDistance = function(dis, maxDis) {
        // remove old text
        if (this.distanceLabel) {
            this.camera.remove(this.distanceLabel);
        }

        var finalText = this.textTemplate.replace('{X}', dis).replace('{Y}', maxDis);
        this.distanceLabel = this.createGLText(finalText, {
            size: 0.15,
            color: 0x000000
        });
        this.distanceLabel.position.set(-2.6, 1.3, -3);

        this.camera.add(this.distanceLabel);
    };

    fn.prototype.createGLText = function(text, options) {

        // override default options
        options = _.extend({
            font: 'helvetiker',
            size: 4,
            height: 0.01,
            color: 0xaaaaaa
        }, options);

        var textGeometry = new THREE.TextGeometry(text, options);
        var textMaterial = new THREE.MeshBasicMaterial({
            color: options.color
        });
        var textObj = new THREE.Mesh(textGeometry, textMaterial);
        return textObj;
    };

    fn.prototype.update = function(dis, maxDis) {
        this.setDistance(dis, maxDis);
    };

    fn.prototype.remove = function() {

    };

    return fn;
});