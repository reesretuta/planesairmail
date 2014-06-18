





(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');

    // ============================================================ //
    /* ******************** Helper Functions ********************** */
    // ============================================================ //
    function getDustyIdleTextures() {
        return PIXI.getTextures('dusty_idle_', 1, 11);
    }

    function getDustyBlinkTextures() {
        return PIXI.getTextures('dusty_blink_', 1, 17);
    }



    // ============================================================ //
    /* ******************** Enter Name Scene ********************** */
    // ============================================================ //

    var EnterNameScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        this.clips = {};

        this.initializeMovieClips();

        this.initializeAnimationTimeline();
    };

    // ============================================================ //
    /* ********************* Initialization *********************** */
    // ============================================================ //

    EnterNameScene.prototype.initializeMovieClips = function() {
        this.initClipDustyNoBlink();
    };

    EnterNameScene.prototype.initClipDustyNoBlink = function() {
        var textures = getDustyIdleTextures();

        var dustyNoBlink = new PIXI.MovieClip(textures);

        dustyNoBlink.windowX = 0.75;
        dustyNoBlink.windowY = -1;

        dustyNoBlink.anchor.x = 0.5;
        dustyNoBlink.anchor.y = 0.5;

        dustyNoBlink.gotoAndStop(0);

        this.clips.dustyNoBlink = dustyNoBlink;

        // add to stage
        this.addChild(dustyNoBlink);
    };


    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //
    EnterNameScene.prototype.initializeAnimationTimeline = function() {
        var timeline = new TimelineMax({
            paused: true
        });

        timeline.append(this.getAnimationDustyIn().play());
        timeline.append(this.getAnimationDustyHover().play());

        this.timeline = timeline;
    };

    EnterNameScene.prototype.startAnimation = function() {
        this.timeline.play();
    };

    // ============================================================ //
    /* ****************** Individual Animations ******************* */
    // ============================================================ //
    EnterNameScene.prototype.getAnimationDustyIn = function() {
        var animationTime = 1.8;

        var timeline = new TimelineMax({
            paused: true
        });

        timeline.add(TweenLite.fromTo(this.clips.dustyNoBlink, animationTime, {
            windowY: -0.2
        }, {
            windowY: 0.5,
            ease: 'Cubic.easeInOut'
        }), 0);

        return timeline;
    };

    EnterNameScene.prototype.getAnimationDustyHover = function() {
        var animationTime = 1;

        var timeline = new TimelineMax({
            paused: true,
            repeat: -1
        });

        timeline.append(TweenLite.to(this.clips.dustyNoBlink, animationTime, {
            windowY: 0.48,
            ease: 'Sine.easeInOut'
        }));
        timeline.append(TweenLite.to(this.clips.dustyNoBlink, animationTime, {
            windowY: 0.5,
            ease: 'Sine.easeInOut'
        }));

        return timeline;
    };






    // called on each animation frame
    EnterNameScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);

        //if clip isn't playing, start it
        if(!this.clips.dustyNoBlink.playing) {
            this.clips.dustyNoBlink.gotoAndPlay(0);
        }
    };












    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, EnterNameScene);


    module.exports = EnterNameScene;
})();