(function() {
    "use strict";

    /*
     * Custom Edits for the PIXI Library
     * Created by: Alec McCormick
     */




    PIXI.DisplayObject.prototype._$window = $(window);
    PIXI.DisplayObject.prototype._windowX = 0;
    PIXI.DisplayObject.prototype._windowY = 0;


    // windowX and windowY are properties added to all Pixi display objects that
    // should be used instead of position.x and position.y
    // these properties will be a value between 0 & 1 and position the display
    // object as a percentage of the window width & height instead of a flat pixel value
    Object.defineProperty(PIXI.DisplayObject.prototype, 'windowX', {
        get: function() {
            return this._windowX;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._windowX = value;

            this.position.x = this._$window.width() * value;
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'windowY', {
        get: function() {
            return this._windowY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._windowY = value;

            this.position.y = this._$window.height() * value;
        }
    });

    // This function should be called for each display object on window resize,
    // adjusting the pixel position to mirror the relative positions windowX and windowY
    PIXI.DisplayObject.prototype.reposition = function() {
        this.position.y = this._$window.height() * this._windowY;
        this.position.x = this._$window.width() * this._windowX;
    };












})();