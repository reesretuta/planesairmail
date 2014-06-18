
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

        this.characters.dusty = dusty;

        // add to stage
        this.addChild(dusty);
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

        var dusty = this.characters.dusty;
        setTimeout(function() {
            dusty.goToState('blink');
        }, 3000);
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
            onStart: function() {
                var height = dusty.scale.y * dusty.getLocalBounds().height;

                //set y so that dusty is just offscreen
                dusty.windowY = -(height/2)/$(window).height();
            }
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












    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, EnterNameScene);


    module.exports = EnterNameScene;
})();