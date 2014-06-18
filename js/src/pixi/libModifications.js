(function() {
    "use strict";

    /*
     * Custom Edits for the PIXI Library
     */



    PIXI.DisplayObject.prototype._$window = $(window);
    PIXI.DisplayObject.prototype._windowX = 0;
    PIXI.DisplayObject.prototype._windowY = 0;
    PIXI.DisplayObject.prototype._bumpX = 0;
    PIXI.DisplayObject.prototype._bumpY = 0;


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

            this.position.x = (this._$window.width() * value) + this._bumpX;
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'windowY', {
        get: function() {
            return this._windowY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._windowY = value;

            this.position.y = (this._$window.height() * value) + this._bumpY;
        }
    });


    // bumpX and bumpY are properties on all display objects used for shifting the positioning by flat pixel values
    // useful for stuff like hover animations while still moving around a character.
    Object.defineProperty(PIXI.DisplayObject.prototype, 'bumpX', {
        get: function() {
            return this._bumpX;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._bumpX = value;

            this.position.x = (this._$window.width() * this._windowX) + value;
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'bumpY', {
        get: function() {
            return this._bumpY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._bumpY = value;

            this.position.y = (this._$window.height() * this._windowY) + value;
        }
    });


    // This function should be called for each display object on window resize,
    // adjusting the pixel position to mirror the relative positions windowX and windowY
    PIXI.DisplayObject.prototype.reposition = function(width, height) {

        this.position.x = (width * this._windowX) + this._bumpX;
        this.position.y = (height * this._windowY) + this._bumpY;

        _.each(this.children, function(displayObject) {
            displayObject.reposition(width, height);
        });
    };










    // used to get individual textures of spritesheet json files
    //
    // Example call: getFileNames('animation_idle_', 1, 105);
    // Returns: ['animation_idle_001.png', 'animation_idle_002.png', ... , 'animation_idle_104.png']
    //
    function getFileNames(filePrefix, rangeStart, rangeEnd) {
        var numDigits = (rangeEnd-1).toString().length;

        return _.map(_.range(rangeStart, rangeEnd), function(num) {

            var numZeros = numDigits - num.toString().length;   //extra characters
            var zeros = new Array(numZeros + 1).join('0');

            return filePrefix + zeros + num + '.png';
        });
    }

    PIXI.getTextures = function(filePrefix, rangeStart, rangeEnd) {
        return _.map(getFileNames(filePrefix, rangeStart, rangeEnd), PIXI.Texture.fromFrame);
    }








})();