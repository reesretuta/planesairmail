
(function() {
    "use strict";

    var extend = require('./extend');


    // displayObject should be an instance of PIXI.Sprite or PIXI.MovieClip
    var Character = function(name, movieClip) {
        PIXI.DisplayObjectContainer.call(this); // Parent constructor

        this.name = name;
        this.idle = null;
        this.states = {};
        this.onUpdateCallback = function() {};

        if(!_.isUndefined(movieClip)) {
            this.setIdleState(movieClip);
        }
    };


    Character.prototype.setIdleState = function(pixiSprite) {
        this.idle = pixiSprite;

        if(pixiSprite instanceof PIXI.MovieClip) {
            pixiSprite.visible = true;
            pixiSprite.loop = true;
            pixiSprite.gotoAndPlay(0);  //start clip
        }

        this.addChild(pixiSprite);   //add to display object container
    };

    //add movie clip to play when character changes to state
    Character.prototype.addState = function(state, movieClip) {
        movieClip.visible = false;
        this.states[state] = movieClip;
        this.addChild(movieClip);
    };

    // public API function. Waits until current state is finished before switching to next state.
    Character.prototype.goToState = function(state) {

        if(_.isUndefined(this.states[state])) {
            throw 'Error: Character ' + this.name + ' does not contain state: ' + state;
        }

        if(this.idle instanceof PIXI.MovieClip) {
            this.idle.onComplete = _.bind(this.swapState, this, state);

            // after current animation finishes go to this state next
            this.idle.loop = false;
        } else {
            this.swapState(state);
            //switch immediately if character idle state is a single sprite
        }
    };

    // changes state immediately
    // NOTE: Function should only be used internally by character.goToState()
    Character.prototype.swapState = function(state) {

        var idleState = this.idle;
        var newState = this.states[state];

        newState.onComplete = function() {  //switch back to idle after run
            if(idleState instanceof PIXI.MovieClip) {
                idleState.loop = true;
                idleState.gotoAndPlay(0);
            }

            newState.visible = false;
            idleState.visible = true;
        };

        idleState.visible = false;

        newState.loop = false;
        newState.visible = true;
        newState.gotoAndPlay(0);
    };

    //add callback to run on character update
    Character.prototype.onUpdate = function(callback) {
        this.onUpdateCallback = callback;
    };

    // called on each animation frame by whatever Pixi scene contains this character
    Character.prototype.update = function() {
        this.onUpdateCallback();
    };















    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //

    // extends Display Object Container
    extend(PIXI.DisplayObjectContainer, Character);

    module.exports = Character;
})();