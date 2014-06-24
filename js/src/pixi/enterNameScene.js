
(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');
    var Character = require('./character');

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
    /* ************* Enter Name Pixi Animation Class ************** */
    // ============================================================ //

    var EnterNameScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        this.characters = {};

        this.initializeCharacters();
        this.initializeAnimationTimeline();
    };

    // ============================================================ //
    /* ********************* Initialization *********************** */
    // ============================================================ //

    EnterNameScene.prototype.initializeCharacters = function() {
        initParachuters(this);
        initDusty(this);
        initDipper(this);
    };

    function initDusty(scene) {

        var dusty = new Character('Dusty');

        var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
        var dustyBlinkAnimation = new PIXI.MovieClip(getDustyBlinkTextures());

        dustyIdleAnimation.anchor = {x: 0.5, y: 0.5};
        dustyBlinkAnimation.anchor = {x: 0.5, y: 0.5};

        dusty.setIdleState(dustyIdleAnimation);
        dusty.addState('blink', dustyBlinkAnimation);

        dusty.windowScale = 600/1366;
        dusty.windowX = 0.15;
        dusty.windowY = -1;

        // add to stage
        scene.addChild(dusty);
        scene.characters.dusty = dusty;
    }

    function initDipper(scene) {
        var dipper = new Character('Dipper');

        var dipperIdleState = PIXI.Sprite.fromImage("assets/img/dipper.png");

        dipperIdleState.anchor = {
            x: 440/865,
            y: 310/433
        };

        dipper.setIdleState(dipperIdleState);

        dipper.windowX = 0.75;
        dipper.windowY = -1;
        dipper.rotation = -0.40;

        dipper.windowScale = 865/1366;
        dipper.animationScaleX = 0.7;
        dipper.animationScaleY = 0.7;

        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blur = 10;

        dipper.filters = [blurFilter];

        scene.addChild(dipper);
        scene.characters.dipper = dipper;
    }

    function initParachuters(scene) {
        var parachuters = [getBlackout(), getDrip(), getDynamite()];

        _.each(parachuters, function(parachuter) {
            var blurFilter = new PIXI.BlurFilter();
            blurFilter.blur = 0;

            parachuter.filters = [blurFilter];
            parachuter.windowX = 0.5;
            parachuter.windowY = -1;

            scene.addChild(parachuter);
        });
        scene.characters.parachuters = parachuters;
    }
    function getBlackout() {
        var blackoutIdleState = PIXI.Sprite.fromImage("assets/img/blackout.png");
        blackoutIdleState.anchor = {
            x: 26/61,
            y: 33/94
        };

        var blackout = new Character('Blackout', blackoutIdleState);

        return blackout;
    }
    function getDrip() {
        var dripIdleState = PIXI.Sprite.fromImage("assets/img/drip.png");
        dripIdleState.anchor = {
            x: 36/61,
            y: 26/94
        };

        var drip = new Character('Drip', dripIdleState);

        return drip;
    }
    function getDynamite() {
        var dynamiteIdleState = PIXI.Sprite.fromImage("assets/img/dynamite.png");
        dynamiteIdleState.anchor = {
            x: 27/61,
            y: 30/94
        };

        var dynamite = new Character('Dynamite', dynamiteIdleState);
        return dynamite;
    }

    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //
    EnterNameScene.prototype.initializeAnimationTimeline = function() {
        var timeline = new TimelineMax({
            paused: true
        });


        timeline.add(this.getAnimationDustyIn().play(), 0);
        timeline.add(this.getAnimationDustyHover().play(), 0);

        timeline.add(this.getAnimationDipperIn().play(), 0.4);

        this.timelineIn = timeline;

        var timelineOut = new TimelineMax({
            paused: true
        });

        timelineOut.add(generateAnimationDipperOut(this.characters.dipper).play(), 0);
        timelineOut.add(generateAnimationDustyOut(this.characters.dusty).play(), 0);

        this.timelineOut = timelineOut;
    };

    EnterNameScene.prototype.startAnimation = function() {
        this.timelineIn.play();

//        var dusty = this.characters.dusty;
//        setTimeout(function() {
//            dusty.goToState('blink');
//        }, 5000);


        var parachuters = _.shuffle(this.characters.parachuters);

        console.log(parachuters);

        var startTime = 2000;
        setTimeout(_.bind(this.animateParachuter, this, parachuters[0]), startTime);
        setTimeout(_.bind(this.animateParachuter, this, parachuters[1]), startTime + 6000);
        setTimeout(_.bind(this.animateParachuter, this, parachuters[2]), startTime + 15000);
    };


    EnterNameScene.prototype.animateParachuter = function(parachuter) {
        var animationTime = 35;

        var depth = Math.random() * 5;
        var x = 0.1 + (Math.random() * 0.8);
        var scale = 1 - depth * 0.2/5;

        placeJustOffscreen(parachuter);
        parachuter.windowX = x;

        var rotation = 0.3;


        TweenLite.to(parachuter, animationTime, {
            windowY: 1,
            ease: 'Sine.easeOut'
        });

        parachuter.scale = {x: scale, y: scale};
        parachuter.filters[0].blur = depth;
        parachuter.rotation = rotation;
        swayParachuter(parachuter, rotation);
    };

    function swayParachuter(parachuter, rotation) {
        var swayTime = 1.2;
        var dec = 0.03;

        TweenLite.to(parachuter, swayTime, {
            rotation: -rotation,
            ease: 'Cubic.easeInOut'
        });
        TweenLite.to(parachuter, swayTime, {
            rotation: rotation,
            ease: 'Cubic.easeInOut',
            delay: swayTime,
            onComplete: function() {
                if(rotation > 0) {
                    swayParachuter(parachuter, rotation - dec);
                }
            }
        });
    }



    EnterNameScene.prototype.hide = function() {
        this.timelineOut.play();
    };

    EnterNameScene.prototype.onHideComplete = function(callback) {
        this.timelineOut.vars.onComplete = callback;
    };


    // called on each animation frame
    EnterNameScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);
    };


    // ============================================================ //
    /* ****************** Individual Animations ******************* */
    // ============================================================ //
    EnterNameScene.prototype.getAnimationDustyIn = function() {
        var animationTime = 1.8;
        var easing = 'Cubic.easeInOut';
        var dusty = this.characters.dusty;

        var timeline = new TimelineMax({
            paused: true,
            onStart: _.bind(placeJustOffscreen, null, dusty)
        });

        timeline.add(TweenLite.to(dusty, animationTime, {
            windowY: 0.5,
            ease: easing
        }), 0);

        return timeline;
    };

    EnterNameScene.prototype.getAnimationDustyHover = function() {
        var animationTime = 1;
        var easing = 'Quad.easeInOut';

        var timeline = new TimelineMax({
            paused: true,
            repeat: -1
        });

        timeline.append(TweenLite.to(this.characters.dusty, animationTime, {
            bumpY: -15,
            ease: easing
        }));
        timeline.append(TweenLite.to(this.characters.dusty, animationTime, {
            bumpY: 0,
            ease: easing
        }));

        return timeline;
    };

    EnterNameScene.prototype.getAnimationDipperIn = function() {
        var animationTime = 2.0;
        var sweepStartTime = animationTime * 0.11;
        var easing = 'Cubic.easeInOut';

        var dipper = this.characters.dipper;
        var blurFilter = dipper.filters[0];

        var timeline = new TimelineMax({
            paused: true,
            onStart: _.bind(placeJustOffscreen, null, dipper)
        });

        timeline.add(TweenLite.to(dipper, animationTime, {
            windowY: 0.32,
            ease: 'Back.easeOut'
        }), 0);

        //sweep right
        timeline.add(TweenLite.to(dipper, animationTime, {
            windowX: 0.86,
            rotation: 0,
            ease: easing
        }), sweepStartTime);

        // scale up
        timeline.add(TweenLite.to(dipper, animationTime + sweepStartTime, {
            animationScaleX: 1,
            animationScaleY: 1,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(blurFilter, animationTime + sweepStartTime, {
            blur: 0,
            ease: easing
        }), 0);

        return timeline;
    };

    function generateAnimationDipperOut(dipper) {
        var animationTime = 1.6;
        var easing = 'Cubic.easeInOut';

        var blurFilter = dipper.filters[0];

        var timeline = new TimelineMax({
            paused: true
        });

        timeline.add(TweenLite.to(dipper, animationTime, {
            animationScaleX: 1.4,
            animationScaleY: 1.4,
            windowY: -0.3,
            windowX: 1.1,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(blurFilter, animationTime/2, {
            blur: 10,
            ease: easing
        }), 0);

        return timeline;
    }
    function generateAnimationDustyOut(dusty) {
        var animationTime = 1.6;
        var easing = 'Cubic.easeInOut';

        var timeline = new TimelineMax({
            paused: true
        });

        timeline.add(TweenLite.to(dusty, animationTime, {
            animationScaleX: 1.2,
            animationScaleY: 1.2,
            windowY: 0.24,
            windowX: -0.3,
            ease: easing
        }));

        return timeline;
    }






    function placeJustOffscreen(character) {
        var height = character.scale.y * character.getLocalBounds().height;

        character.windowY = -(height/2)/character._$window.height();
    }







    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, EnterNameScene);


    module.exports = EnterNameScene;
})();