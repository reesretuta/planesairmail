
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
        this.initDusty();
        this.initDipper();
    };

    EnterNameScene.prototype.initDusty = function() {

        var dusty = new Character('Dusty');

        var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
        var dustyBlinkAnimation = new PIXI.MovieClip(getDustyBlinkTextures());

        dustyIdleAnimation.anchor = {x: 0.5, y: 0.5};
        dustyBlinkAnimation.anchor = {x: 0.5, y: 0.5};

        dusty.setIdleState(dustyIdleAnimation);
        dusty.addState('blink', dustyBlinkAnimation);

        dusty.windowX = 0.15;
        dusty.windowY = -1;

        // add to stage
        this.addChild(dusty);
        this.characters.dusty = dusty;
    };

    EnterNameScene.prototype.initDipper = function() {
        var dipper = new Character('Dipper');

        var dipperIdleState = PIXI.Sprite.fromImage("./assets/img/dipper.png");

        dipperIdleState.anchor = {
            x: 440/865,
            y: 310/433
        };

        dipper.setIdleState(dipperIdleState);

        dipper.windowX = 0.75;
        dipper.windowY = -1;
        dipper.rotation = -0.40;

        dipper.scale.x = 0.7;
        dipper.scale.y = 0.7;

        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blur = 10;

        console.log(blurFilter);

        dipper.filters = [blurFilter];

        this.addChild(dipper);
        this.characters.dipper = dipper;
    };


    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //
    EnterNameScene.prototype.initializeAnimationTimeline = function() {
        var timeline = new TimelineMax({
            paused: true
        });


        var timelineDustyIn = this.getAnimationDustyIn();

        timeline.add(timelineDustyIn.play(), 0);
        timeline.add(this.getAnimationDustyHover().play(), 0);

        timeline.add(this.getAnimationDipperIn().play(), 0.4);

        this.timeline = timeline;
    };

    EnterNameScene.prototype.startAnimation = function() {
        this.timeline.play();

        var dusty = this.characters.dusty;

        setTimeout(function() {
            dusty.goToState('blink');
        }, 5000);
    };


    // called on each animation frame
    EnterNameScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);

        // update each character
        _.each(this.characters, function(character) {
            character.update();
        });
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
            windowY: 0.25,
            ease: 'Back.easeOut'
        }), 0);

        //sweep right
        timeline.add(TweenLite.to(dipper, animationTime, {
            windowX: 0.90,
            rotation: 0,
            ease: easing
        }), sweepStartTime);

        // scale up
        timeline.add(TweenLite.to(dipper.scale, animationTime + sweepStartTime, {
            x: 1,
            y: 1,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(blurFilter, animationTime + sweepStartTime, {
            blur: 0,
            ease: easing
        }), 0);


        return timeline;
    };




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