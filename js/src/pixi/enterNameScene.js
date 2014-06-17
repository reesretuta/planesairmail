





(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');



    function getFileNames(fileStart, numDigits, ext) {
        return _.map(_.range(15), function(num) {
//            var numZeros = numDigits - num.toString().length;
//            var zeros = new Array(numZeros + 1).join('0');
//
//            return fileStart + zeros + num + '.' + ext;
            return num;
        });
    }

    function getDustyNoBlinkTextures() {
        return _.map(getFileNames('Comp 2_', 5, 'png'), function(fileName) {
            return PIXI.Texture.fromFrame(fileName);
        });

    }





    var EnterNameScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        this.clips = {};

        this.initializeMovieClips();
    };

    // ============================================================ //
    /* ********************* Initialization *********************** */
    // ============================================================ //

    EnterNameScene.prototype.initializeMovieClips = function() {
        this.initClipDustyNoBlink();
    };

    EnterNameScene.prototype.initClipDustyNoBlink = function() {
        var textures = getDustyNoBlinkTextures();

        var dustyNoBlink = new PIXI.MovieClip(textures);

        dustyNoBlink.position.x = 800;
        dustyNoBlink.position.y = 0;

        dustyNoBlink.anchor.x = 0.5;
        dustyNoBlink.anchor.y = 1;

        dustyNoBlink.gotoAndStop(0);

        this.clips.dustyNoBlink = dustyNoBlink;

        // add to stage
        this.addChild(dustyNoBlink);
    };


    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //


    EnterNameScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);

        //if clip isn't playing, start it
        if(!this.clips.dustyNoBlink.playing) {
            this.clips.dustyNoBlink.gotoAndPlay(0);
        }
    };












    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene
    extend(Scene, EnterNameScene);


    module.exports = EnterNameScene;
})();