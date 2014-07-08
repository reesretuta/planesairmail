
(function() {
    "use strict";

    var extend = require('./extend');


    // displayObject should be an instance of PIXI.Sprite or PIXI.MovieClip
    var Character = function(name, movieClip) {
        PIXI.DisplayObjectContainer.call(this); // Parent constructor

        this.name = name;
        this.idle = null;
        this.animating = false;
        this.states = {};
        this.onUpdateCallback = function() {};

        if(!_.isUndefined(movieClip)) {
            this.setIdleState(movieClip);
        }
    };

    Character.prototype = {
        setIdleState: function(pixiSprite) {
            this.idle = pixiSprite;

            if(pixiSprite instanceof PIXI.MovieClip) {
                pixiSprite.visible = true;
                pixiSprite.loop = true;
                pixiSprite.gotoAndPlay(0);  //start clip
            }

            this.addChild(pixiSprite);   //add to display object container
        },

        //add movie clip to play when character changes to state
        addState: function(state, movieClip) {
            movieClip.visible = false;
            this.states[state] = movieClip;
            this.addChild(movieClip);
        },

        // public API function. Waits until current state is finished before switching to next state.
        goToState: function(state) {
            if(_.isUndefined(this.states[state])) {
                throw 'Error: Character ' + this.name + ' does not contain state: ' + state;
            }

            if(this.idle instanceof PIXI.MovieClip) {
                this.idle.onComplete = _.bind(this.swapState, this, state);

                // after current animation finishes go to this state next
                this.idle.loop = false;
            } else {
                swapState(this, state);
                //switch immediately if character idle state is a single sprite
            }
        },

        //add callback to run on character update
        onUpdate: function(callback) {
            this.onUpdateCallback = callback;
        },

        // called on each animation frame by whatever Pixi scene contains this character
        update: function() {
            this.onUpdateCallback();
        },

        destroy: function() {
            if(!_.isUndefined(this.parent)) this.parent.removeChild(this);

            _.each(this.children, function(child) {
                child.destroy();
            });
        },

        setStatic: function() {
            this.idle.gotoAndStop(0);
        },
        setDynamic: function() {
            this.idle.gotoAndPlay(0);
        },
        flip: function() {
            this.scale.x = -(this.scale.x);
        },
        pushToTop: function() {
            if(_.isUndefined(this.parent)) {
                console.log('Error! No parent defined for character:',this.name + '.','It is likely pustToTop() was called after character was added but before PIXI scene was updated.');
                return;
            }

            var length = this.parent.children.length;

            this.parent.addChildAt(this, length-1);
        }

    };


    // changes state immediately
    // NOTE: Function should only be used internally by character.goToState()
    function swapState(char, state) {
        var idleState = char.idle;
        var newState = char.states[state];

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
    }



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //

    // extends Display Object Container
    extend(PIXI.DisplayObjectContainer, Character);

    module.exports = Character;
})();