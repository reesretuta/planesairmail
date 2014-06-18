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
    PIXI.DisplayObject.prototype.reposition = function(width, height) {

        this.position.x = width * this._windowX;
        this.position.y = height * this._windowY;

        _.each(this.children, function(displayObject) {
            displayObject.reposition(width, height);
        });
    };










    function getFileNames(filePrefix, rangeStart, rangeEnd) {
        var trueEnd = rangeEnd-1;

        return _.map(_.range(rangeStart, rangeEnd), function(num) {

            var numZeros = trueEnd.toString().length - num.toString().length;
            var zeros = new Array(numZeros + 1).join('0');

            return filePrefix + zeros + num + '.png';
        });
    }

    PIXI.getTextures = function(filePrefix, rangeStart, rangeEnd) {
        return _.map(getFileNames(filePrefix, rangeStart, rangeEnd), function(fileName) {
            return PIXI.Texture.fromFrame(fileName);
        });
    }








})();