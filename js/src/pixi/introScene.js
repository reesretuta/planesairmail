

(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');


    function getIntroTextures() {
        return PIXI.getTextures('assets/introVideo/PLANES2_760x428_00', 0, 122);
    }

    // ============================================================ //
    /* **************** Intro Pixi Animation Class **************** */
    // ============================================================ //

    var IntroScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        this.initializeVideo();
    };

    IntroScene.prototype.initializeVideo = function() {
        var introVideo = new PIXI.MovieClip(getIntroTextures());

        introVideo.windowX = 0.5;
        introVideo.windowY = 0.5;

        introVideo.anchor = {x: 0.5, y: 0.5};

        introVideo.visible = false;
        introVideo.loop = false;

        introVideo.animationSpeed = 0.55;

        this.addChild(introVideo);

        this.introVideo = introVideo;
    };


    IntroScene.prototype.onComplete = function(callback) {
        this.introVideo.onComplete = callback;
    };


    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //

    IntroScene.prototype.startAnimation = function() {
        this.introVideo.visible = true;
        this.introVideo.gotoAndPlay(0);
    };



    // called on each animation frame
    IntroScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);
    };






    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //


    // Extends Scene Class
    extend(Scene, IntroScene);

    module.exports = IntroScene;


})();



