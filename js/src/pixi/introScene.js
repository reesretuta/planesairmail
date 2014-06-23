

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
        this.timelineOpen.play();
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
        var introMask = new PIXI.DisplayObjectContainer();

        var introMaskTop = PIXI.Sprite.fromImage('assets/img/intro-top.png');
        var introMaskBtm = PIXI.Sprite.fromImage('assets/img/intro-btm.png');

        introMaskTop.anchor = new PIXI.Point(.5, 1);
        introMaskBtm.anchor = new PIXI.Point(.5, 0);

        introMaskTop.windowY = 0;
        introMaskBtm.windowY = 0;

        introMask.windowX = 0.5;
        introMask.windowY = 0.5;
        introMask.anchor = new PIXI.Point(.5, .5);

        introMask.scaleMin = 0.98;
        introMask.scaleMax = 2;
        introMask.windowScale = 0.76;

        introMask.addChild(introMaskTop);
        introMask.addChild(introMaskBtm);
        scene.addChild(introMask);

        scene.introMask = introMask;
        scene.introMaskTop = introMaskTop;
        scene.introMaskBtm = introMaskBtm;
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
        scene.timelineOpen = getIntroOpenTimeline(scene);
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

    function getIntroOpenTimeline(scene) {
        var animationTime = 1.6;
        var easing = 'Cubic.easeInOut';

        var timeline = new TimelineLite({
            paused: true
        });

        timeline.add(TweenLite.to(scene.introMaskTop, animationTime, {
            windowY: -0.5,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(scene.introMaskBtm, animationTime, {
            windowY: 0.5,
            ease: easing
        }), 0);

        return timeline;

    }



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //


    // Extends Scene Class
    extend(Scene, IntroScene);

    module.exports = IntroScene;


})();



