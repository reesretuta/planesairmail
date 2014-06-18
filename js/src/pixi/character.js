
(function() {
    "use strict";

    var extend = require('./extend');


    var Character = function() {
        this.idle = null;

        // Parent constructor
        PIXI.DisplayObjectContainer.call(this);
    };


    Character.prototype.setIdleAnimation = function(movieClip) {
        this.idle = movieClip;
    };




    // called on each animation frame by whatever Pixi scene contains this character
    Character.prototype.update = function() {

    };















    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //

    // extends Display Object Container
    extend(PIXI.DisplayObjectContainer, Character);

    module.exports = Character;
})();