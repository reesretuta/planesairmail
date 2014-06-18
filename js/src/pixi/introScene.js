

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

        this.initializeVideoTimeline();

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

    IntroScene.prototype.initializeVideoTimeline = function() {

        this.introVideo._tweenFrame = 0;

        Object.defineProperty(this.introVideo, 'tweenFrame', {
            get: function() {
                return this._tweenFrame;
            },
            set: function(value) {
                this._tweenFrame = value;
                this.currentFrame = value;
                this.setTexture(this.textures[value | 0]);
            }
        });


        this.timeline = this.getVideoAnimationTimeline();
    };


    IntroScene.prototype.getVideoAnimationTimeline = function() {
        var fps = 24;
        var numFrames = this.introVideo.textures.length;

        var animationTime = numFrames/fps;
        var easing = new SteppedEase(numFrames);

        var timeline = new TimelineLite({
            paused: true
        });

        timeline.append(TweenLite.to(this.introVideo, animationTime, {
            tweenFrame: numFrames-1,
            ease: easing
        }));


        return timeline;
    };

    IntroScene.prototype.onComplete = function(callback) {
        this.timeline.vars.onComplete = callback;
    };

    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //

    IntroScene.prototype.startAnimation = function() {
        this.introVideo.visible = true;
        //this.introVideo.gotoAndPlay(0);

        this.timeline.play();
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



