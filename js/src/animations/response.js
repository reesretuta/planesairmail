



"use strict";

var Character = require('../pixi/character');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var background, responseContainer;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    background = initializeBackground();

    responseContainer = new PIXI.DisplayObjectContainer();
    responseContainer.visible = false;

    responseContainer.addChild(background);
}

function initializeBackground() {
    var bg = PIXI.Sprite.fromImage("assets/img/response_bg_dusty.jpg");

    bg.anchor = new PIXI.Point(.5, .5);
    bg.windowScale = 1;
    bg.scaleType = 'cover';

    bg.windowX = 0.5;
    bg.windowY = 0.5;

    return bg;
}







var animationModule = {
    initialize: _.once(function(scene) {
        initialize();

        scene.addChild(responseContainer);
    }),
    show: function() {
        responseContainer.visible = true;
    }
};



module.exports = animationModule;