
(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');

    var bladewipeModule = require('../animations/bladewipe');
    var dustyDipperModule = require('../animations/dustyDipper');
    var parachutersModule = require('../animations/parachuters');
    var responseModule = require('../animations/response');


    // ============================================================ //
    /* *************** Primary Pixi Animation Class *************** */
    // ============================================================ //

    var MainScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        responseModule.initialize(this);
        parachutersModule.initialize(this);
        bladewipeModule.initialize(this);
        dustyDipperModule.initialize(this);
    };

    // ============================================================ //
    /* ****************** Public API Functions ******************** */
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

    MainScene.prototype.startEnterNameAnimation = function() {
        dustyDipperModule.animateIn();

        var startTime = 2000;
        setTimeout(parachutersModule.animateNext, startTime);
        setTimeout(parachutersModule.animateNext, startTime + 6000);
        setTimeout(parachutersModule.animateNext, startTime + 15000);
    };

    MainScene.prototype.showResponse = function() {
        parachutersModule.hide();
        responseModule.show();
    };









    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, MainScene);


    module.exports = MainScene;
})();