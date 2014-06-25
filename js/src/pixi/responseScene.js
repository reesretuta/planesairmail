



"use strict";



var extend = require('./extend');
var Scene = require('./scene');


function initializeBackground(scene) {
    var bg = PIXI.Sprite.fromImage("assets/img/response_bg_dusty.jpg");

    bg.anchor = new PIXI.Point(.5, .5);
    bg.windowScale = 1;
    bg.scaleType = 'cover';

    bg.windowX = 0.5;
    bg.windowY = 0.5;

    scene.addChild(bg);
}


var ResponseScene = function() {
    //parent constructor
    Scene.apply(this, arguments);

    initializeBackground(this);
};








// ============================================================ //
/* ******************* Extend and Export ********************** */
// ============================================================ //



// Extends Scene Class
extend(Scene, ResponseScene);


module.exports = ResponseScene;