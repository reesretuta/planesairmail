
(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');

    var bladewipeModule = require('../animations/bladewipe');
    var dustyDipperModule = require('../animations/dustyDipper');
    var parachutersModule = require('../animations/parachuters');


    // ============================================================ //
    /* *************** Primary Pixi Animation Class *************** */
    // ============================================================ //

    var MainScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        parachutersModule.initialize(this);
        bladewipeModule.initialize(this);
        dustyDipperModule.initialize(this);
    };

    // ============================================================ //
    /* ********************* Initialization *********************** */
    // ============================================================ //




    MainScene.prototype.playWipescreen = function() {
        bladewipeModule.playVideo();
    };
    MainScene.prototype.onWipescreenComplete = function(callback) {
        bladewipeModule.onVideoComplete(callback);
    };
    MainScene.prototype.hideVideo = function() {
        bladewipeModule.hideVideo();
    };
    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //

    MainScene.prototype.startEnterNameAnimation = function() {
        console.log('yes');

        dustyDipperModule.animateIn();

        var startTime = 2000;
        setTimeout(parachutersModule.animateNext, startTime);
        setTimeout(parachutersModule.animateNext, startTime + 6000);
        setTimeout(parachutersModule.animateNext, startTime + 15000);
    };



    // called on each animation frame
    MainScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);
    };
















    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, MainScene);


    module.exports = MainScene;
})();