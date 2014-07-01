

"use strict";

var Character = require('../pixi/character');
var placeJustOffscreen = require('./placeJustOffscreen');

// =================================================================== //
/* ************************ Helper Functions ************************* */
// =================================================================== //
function getDustyIdleTextures() {
    return PIXI.getTextures('assets/spritesheets/dusty/one/Dusty_plane_000', 0, 12);
}
function getDipperIdleTextures() {
    return PIXI.getTextures('assets/spritesheets/dipper/Dipper_000', 0, 12);
}
function getBladeTextures() {
    return PIXI.getTextures('assets/spritesheets/blade/Guide_BladeRanger_body_970x600_000', 0, 12);
}
function getCabbieTextures() {
    return PIXI.getTextures('assets/spritesheets/cabbie/Cabbie_000', 0, 12);
}
function getWindlifterTextures() {
    return PIXI.getTextures('assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_000', 0, 12);
}

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var char, allCharacters, displayObjectContainer;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    allCharacters = {
        dusty: initDusty(),
        bladeranger: initBlade(),
        cabbie: initCabbie(),
        dipper: initDipper(),
        windlifter: initWindlifter()
    };

    char = allCharacters.dusty;

    displayObjectContainer = new PIXI.DisplayObjectContainer();
}

function initDusty() {
    var dusty = new Character('Dusty');

    var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
    dustyIdleAnimation.anchor = {x: 0.5, y: 405/983};
    dusty.setIdleState(dustyIdleAnimation);

    dusty.windowScale = 850/1366;
    dusty.windowY = -1;

    return dusty;
}
function initBlade() {
    var bladeIdleAnimation = new PIXI.MovieClip(getBladeTextures());
    bladeIdleAnimation.anchor = {x: 457/970, y: 346/600};

    var blade = new Character('Blade', bladeIdleAnimation);

    blade.windowScale = 0.6;
    blade.windowY = -1;

    return blade;
}
function initCabbie() {
    var cabbieIdleAnimation = new PIXI.MovieClip(getCabbieTextures());
    cabbieIdleAnimation.anchor = {x: 545/1200, y: 351/622};

    var cabbie = new Character('Cabbie', cabbieIdleAnimation);

    cabbie.windowScale = 0.6;
    cabbie.windowY = -1;

    return cabbie;
}
function initDipper() {
    var dipperIdleState = new PIXI.MovieClip(getDipperIdleTextures());
    dipperIdleState.anchor = {x: 571/1200, y: 410/638};

    var dipper = new Character('Dipper', dipperIdleState);

    dipper.windowY = -1;
    dipper.windowScale = 865/1366;

    return dipper;
}
function initWindlifter() {
    var windliferIdleState = new PIXI.MovieClip(getWindlifterTextures());
    windliferIdleState.anchor = {x: 0.5, y: 0.5};

    var windlifter = new Character('Windlifter', windliferIdleState);
    windlifter.windowY = -1;
    windlifter.windowScale = 970/1366;

    return windlifter;
}

// =================================================================== //
/* *********************** Animation Functions *********************** */
// =================================================================== //

function animateIn() {
    var animationTime = 1.8;
    var easing = 'Cubic.easeInOut';

    //add character in
    displayObjectContainer.addChild(char);

    placeJustOffscreen(char);
    char.windowX = 0.6;

    return TweenLite.to(char, animationTime, {
        windowY: 0.3,
        windowX: 0.25,
        ease: easing
    });
}

var onAnimationOutCallback = function(){};

function animateOut() {
    var animationTime = 1.8;
    var easing = 'Cubic.easeInOut';

    return TweenLite.to(char, animationTime, {
        windowY: 0.25,
        windowX: -0.4,
        ease: easing,
        onComplete: onAnimationOutCallback
    });
}






var animationModule = {
    initialize: _.once(function(scene) {
        initialize();

        scene.addChild(displayObjectContainer);
    }),
    animateIn: animateIn,
    animateOut: animateOut,
    onAnimationOutComplete: function(callback) {
        onAnimationOutCallback = callback;
    },
    setCharacter: function(character) {
        char = allCharacters[character];
    }
};



module.exports = animationModule;