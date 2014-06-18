
(function() {
    "use strict";

    var extend = require('./extend');


    // displayObject should be an instance of PIXI.Sprite or PIXI.MovieClip
    var Character = function(movieClip) {
        PIXI.DisplayObjectContainer.call(this); // Parent constructor

        this.idle = null;
        this.states = {};
        this.onUpdateCallback = function() {};

        if(!_.isUndefined(movieClip)) {
            this.setIdleState(movieClip);
        }

        this.nextStates = [];
    };


    Character.prototype.setIdleState = function(movieClip) {
        this.idle = movieClip;

        this.addChild(movieClip);   //add to display object container

        movieClip.visible = true;
        movieClip.loop = true;
        movieClip.gotoAndPlay(0);   //start clip
    };

    //add movie clip to play when character changes to state
    Character.prototype.addState = function(state, movieClip) {
        movieClip.visible = false;
        this.states[state] = movieClip;
        this.addChild(movieClip);
    };

    // public API function. Waits until current state is finished before switching to next state.
    Character.prototype.goToState = function(state) {

        this.nextStates.push(state);

        this.idle.onComplete = _.bind(this.swapState, this, state);

        // after current animation finishes go to this state next
        this.idle.loop = false;
    };

    // changes state immediately
    // NOTE: Function should only be used internally by character.goToState()
    Character.prototype.swapState = function(state) {

        var idleState = this.idle;
        var newState = this.states[state];

        newState.onComplete = function() {  //switch back to idle after run
            idleState.gotoAndPlay(0);

            newState.visible = false;
            idleState.visible = true;
        };

        idleState.visible = false;
        idleState.loop = true;

        newState.loop = false;
        newState.visible = true;
        newState.gotoAndPlay(0);
    };

    //add callback to run on character update
    Character.onUpdate = function(callback) {
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