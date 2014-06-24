

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
        Scene.apply(this, arguments); //parent constructor

        initializeVideo(this);
        initializeMask(this);
        initializeVideoTimeline(this);
    };

    // ============================================================ //
    /* ****************** Public API Functions ******************** */
    // ============================================================ //

    IntroScene.prototype.startAnimation = function() {
        this.introVideo.visible = true;

        this.timelineVideo.play();
    };

    IntroScene.prototype.open = function() {
        //this.timelineOpen.play();
    };


    // called on each animation frame
    IntroScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);
    };

    //set on complete function for animation timeline
    IntroScene.prototype.onComplete = function(callback) {
        this.timelineVideo.vars.onComplete = callback;
    };


    IntroScene.prototype.setView = function(view) {
        this.view = view;
    };
    IntroScene.prototype._onWindowResize = function(width, height) {
        Scene.prototype._onWindowResize.call(this, width, height);

        if(!_.isUndefined(this.view)) {
            var scale = this.introVideo.scale;
            var bounds = this.introVideo.getLocalBounds();

            this.view.onWindowResize(width, height, (bounds.width * scale.x), (bounds.height * scale.y));
        }
    };


    // ============================================================ //
    /* ********************** Initialization ********************** */
    // ============================================================ //

    function initializeVideo(scene) {
        var introVideo = new PIXI.MovieClip(getIntroTextures());

        introVideo.windowX = 0.5;
        introVideo.windowY = 0.5;
        introVideo.anchor = new PIXI.Point(0.5, 0.5);

        introVideo.visible = false;
        introVideo.loop = false;

        introVideo.scaleMin = 1;
        introVideo.scaleMax = 2;
        introVideo.windowScale = 0.6;

        scene.addChild(introVideo);
        scene.introVideo = introVideo;
    }

    function initializeMask(scene) {

    }

    function initializeBackgroundColor(scene) {

    }

    function initializeVideoTimeline(scene) {

        scene.introVideo._tweenFrame = 0;

        Object.defineProperty(scene.introVideo, 'tweenFrame', {
            get: function() {
                return this._tweenFrame;
            },
            set: function(value) {
                this._tweenFrame = value;
                this.currentFrame = value;
                this.setTexture(this.textures[value | 0]);
            }
        });

        scene.timelineVideo = getVideoAnimationTimeline(scene);
    }

    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //

    function getVideoAnimationTimeline(scene) {
        var fps = 24;
        var numFrames = scene.introVideo.textures.length;

        var animationTime = numFrames/fps;
        var easing = new SteppedEase(numFrames);

        var timeline = new TimelineLite({
            paused: true
        });

        timeline.append(TweenLite.to(scene.introVideo, animationTime, {
            tweenFrame: numFrames-1,
            ease: easing
        }));


        return timeline;
    }



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //


    // Extends Scene Class
    extend(Scene, IntroScene);

    module.exports = IntroScene;


})();



