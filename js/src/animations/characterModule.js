

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
var char, characterName, allCharacters, displayObjectContainer;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    allCharacters = {
        dusty: _.once(initDusty),
        bladeranger: _.once(initBlade),
        cabbie: _.once(initCabbie),
        dipper: _.once(initDipper),
        windlifter: _.once(initWindlifter)
    };

    displayObjectContainer = new PIXI.DisplayObjectContainer();
}

function initDusty() {
    var dusty = new Character('Dusty');

    var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
    dustyIdleAnimation.anchor = {x: 480/1200, y: 405/983};
    dustyIdleAnimation.windowScale = 0.42;

    dusty.setIdleState(dustyIdleAnimation);

    dusty.windowY = -1;

    return dusty;
}
function initBlade() {
    var bladeIdleAnimation = new PIXI.MovieClip(getBladeTextures());
    bladeIdleAnimation.anchor = {x: 457/970, y: 346/600};
    bladeIdleAnimation.windowScale = 0.6;

    var blade = new Character('Blade', bladeIdleAnimation);

    blade.windowY = -1;

    return blade;
}
function initCabbie() {
    var cabbieIdleAnimation = new PIXI.MovieClip(getCabbieTextures());
    cabbieIdleAnimation.anchor = {x: 545/1200, y: 351/622};
    cabbieIdleAnimation.windowScale = 0.6;

    var cabbie = new Character('Cabbie', cabbieIdleAnimation);

    cabbie.windowY = -1;

    var blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 9;

    cabbie.filters = [blurFilter];

    return cabbie;
}
function initDipper() {
    var dipperIdleState = new PIXI.MovieClip(getDipperIdleTextures());
    dipperIdleState.anchor = {x: 539/1200, y: 435/638};
    dipperIdleState.windowScale = 0.6;

    var dipper = new Character('Dipper', dipperIdleState);

    dipper.windowY = -1;

    var blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 9;

    dipper.filters = [blurFilter];

    return dipper;
}
function initWindlifter() {
    var windliferIdleState = new PIXI.MovieClip(getWindlifterTextures());
    windliferIdleState.anchor = {x: 0.5, y: 0.5};
    windliferIdleState.windowScale = 0.56;

    var windlifter = new Character('Windlifter', windliferIdleState);
    windlifter.windowY = -1;

    var blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 0;

    windlifter.filters = [blurFilter];

    return windlifter;
}

// =================================================================== //
/* *********************** Animation Functions *********************** */
// =================================================================== //
var animateIn, animateOut;

var animationsIn = (function() {
    var animationTime = 2.3;
    var easing = 'Cubic.easeInOut';

    return {
        dusty: function() {
            placeJustOffscreen(char);
            char.windowX = 0.6;

            displayObjectContainer.addChild(char);

            TweenLite.to(char, animationTime, {
                windowY: 0.3,
                windowX: 0.22,
                ease: easing
            });
        },
        bladeranger: function() {
            char.windowX = -.4;
            char.windowY = 0.75;

            displayObjectContainer.addChild(char);

            TweenLite.to(char, animationTime, {
                windowY: 0.34,
                windowX: 0.16,
                ease: easing
            });
        },
        cabbie: function() {
            placeJustOffscreen(char);
            char.rotation = 0.55;
            char.windowX = 0.46;

            char.scale.x = 0.8;
            char.scale.y = 0.8;

            var blurFilter = char.filters[0];
            blurFilter.blur = 7;

            displayObjectContainer.addChild(char);

            TweenLite.to(char, animationTime, {
                windowY: 0.34,
                ease: 'Back.easeOut'
            });

            var sweepTime = animationTime * 7/8;
            TweenLite.to(char, sweepTime, {
                windowX: 0.15,
                rotation: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });

            TweenLite.to(char.scale, sweepTime, {
                x: 1,
                y: 1,
                delay: animationTime - sweepTime,
                ease: easing
            });
            TweenLite.to(blurFilter, sweepTime, {
                blur: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });
        },
        dipper: function() {
            placeJustOffscreen(char);
            char.rotation = 0.55;
            char.windowX = 0.46;

            char.scale.x = 0.8;
            char.scale.y = 0.8;

            var blurFilter = char.filters[0];
            blurFilter.blur = 7;

            displayObjectContainer.addChild(char);

            TweenLite.to(char, animationTime, {
                windowY: 0.34,
                ease: 'Back.easeOut'
            });

            var sweepTime = animationTime * 7/8;
            TweenLite.to(char, sweepTime, {
                windowX: 0.18,
                rotation: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });

            TweenLite.to(char.scale, sweepTime, {
                x: 1,
                y: 1,
                delay: animationTime - sweepTime,
                ease: easing
            });
            TweenLite.to(blurFilter, sweepTime, {
                blur: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });
        },
        windlifter: function() {
            placeJustOffscreen(char);
            char.windowX = 0.6;

            displayObjectContainer.addChild(char);

            TweenLite.to(char, animationTime, {
                windowY: 0.3,
                windowX: 0.22,
                ease: easing
            });
        }
    };
})();

var onAnimationOutCallback = function(){};

function onAnimationOutComplete() {

//    char.destroy();
    onAnimationOutCallback();
}

var animationsOut = (function() {
    var animationTime = 2.3;
    var easing = 'Circ.easeInOut';

    return {
        dusty: function() {
            return TweenLite.to(char, animationTime, {
                windowY: 0.25,
                windowX: -0.4,
                ease: easing,
                onComplete: onAnimationOutComplete
            });
        },
        bladeranger: function() {
            TweenLite.to(char, animationTime, {
                windowY: -0.5,
                windowX: 0.24,
                ease: 'Cubic.easeInOut',
                onComplete: onAnimationOutComplete
            });
        },
        cabbie: function() {
            TweenLite.to(char, animationTime, {
                windowY: 0.1,
                windowX: -0.4,
                ease: easing,
                onComplete: onAnimationOutComplete
            });
            var blurFilter = char.filters[0];
            TweenLite.to(blurFilter, animationTime, {blur: 4});
        },
        dipper: function() {
            TweenLite.to(char, animationTime, {
                windowY: 0.1,
                windowX: -0.4,
                ease: easing,
                onComplete: onAnimationOutComplete
            });
            var blurFilter = char.filters[0];
            TweenLite.to(blurFilter, animationTime, {blur: 4});
        },
        windlifter: function() {
            TweenLite.to(char, animationTime, {
                windowX: -0.3,
                ease: 'Cubic.easeIn',
                onComplete: onAnimationOutComplete
            });

            TweenLite.to(char, animationTime * 7/8, {
                windowY: -0.1,
                ease: 'Back.easeIn'
            });
        }
    };
})();


// =================================================================== //
/* ************************** Team Animations ************************ */
// =================================================================== //

function teamAnimationSetup(dusty, blade, cabbie, dipper, windlifter) {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dusty ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    dusty.windowY = 0.3;
    dusty.windowX = 1.3;
    dusty.idle.windowScale = 0.3;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Blade ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    blade.windowX = -.4;
    blade.windowY = 0.75;
    blade.idle.windowScale = 0.4;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Cabbie ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    placeJustOffscreen(cabbie);
    cabbie.rotation = 0.55;
    cabbie.windowX = 0.46;
    cabbie.idle.windowScale = 0.3;
    cabbie.filters[0].blur = 4;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dipper ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    placeJustOffscreen(dipper);
    dipper.rotation = 0.55;
    dipper.windowX = 0.46;
    dipper.filters[0].blur = 1;
    dipper.idle.windowScale = 0.5;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~ Windlifter ~~~~~~~~~~~~~~~~~~~~~~~~~
    windlifter.windowX = 1.4;
    windlifter.windowY = 0.8;
    windlifter.idle.windowScale = 0.3;
    windlifter.filters[0].blur = 4;


    displayObjectContainer.addChild(blade);
    displayObjectContainer.addChild(dusty);
    displayObjectContainer.addChild(cabbie);
    displayObjectContainer.addChild(dipper);
    displayObjectContainer.addChild(windlifter);
}

function animateInTeam() {
    var animationTime = 2.3;
    var easing = 'Cubic.easeInOut';

    var dusty = char[0];
    var blade = char[1];
    var cabbie = char[2];
    var dipper = char[3];
    var windlifter = char[4];

    teamAnimationSetup(dusty, blade, cabbie, dipper, windlifter);

    var timeline = new TimelineMax({
        stagger: 0.27,
        align: 'start',
        tweens: [
            TweenLite.to(cabbie, animationTime, {
                windowY: 0.34,
                windowX: 0.21,
                rotation: 0,
                ease: easing
            }),
            TweenLite.to(dusty, animationTime, {
                windowY: 0.68,
                windowX: 0.8,
                ease: easing
            }),
            TweenLite.to(blade, animationTime, {
                windowY: 0.64,
                windowX: 0.16,
                ease: easing
            }),
            TweenLite.to(dipper, animationTime, {
                windowY: 0.2,
                windowX: 0.68,
                rotation: 0,
                ease: easing
            }),
            TweenLite.to(windlifter, animationTime, {
                windowY: 0.4,
                windowX: 0.82,
                ease: easing
            })
        ]
    });
}

function animateOutTeam() {
    var animationTime = 1.8;
    var easing = 'Circ.easeIn';

    var dusty = char[0];
    var blade = char[1];
    var cabbie = char[2];
    var dipper = char[3];
    var windlifter = char[4];

    var timeline = new TimelineMax({
        stagger: 0.29,
        align: 'start',
        tweens: [
            new TimelineMax({
                tweens: [
                    TweenLite.to(dipper, animationTime, {
                        windowY: -0.3,
                        ease: 'Back.easeIn'
                    }),
                    TweenLite.to(dipper, animationTime, {
                        windowX: 0.2,
                        ease: easing
                    })
                ]
            }),
            TweenLite.to(blade, animationTime, {
                windowY: -0.3,
                windowX: 0.5,
                ease: easing
            }),
            TweenLite.to(cabbie, animationTime, {
                windowY: 0.1,
                windowX: -0.3,
                ease: easing
            }),
            TweenLite.to(dusty, animationTime, {
                windowY: -0.2,
                windowX: 0.2,
                ease: easing
            }),
            TweenLite.to(windlifter, animationTime, {
                windowY: -0.2,
                windowX: 0.6,
                ease: easing
            })
        ],
        onComplete: function() {
            dusty.destroy();

            onAnimationOutCallback();
        }
    });
}

// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //


var animationModule = {
    initialize: _.once(function(scene) {
        initialize();

        scene.addChild(displayObjectContainer);
    }),
    animateIn: function() {
        if(characterName === 'team') {
            char = [initDusty(), initBlade(), initCabbie(), initDipper(), initWindlifter()];

            animateInTeam();
            return;
        }

        char = allCharacters[characterName]();

        animateIn = animationsIn[characterName];
        animateOut = animationsOut[characterName];

        animateIn();
    },
    animateOut: function() {
        if(characterName === 'team') {
            animateOutTeam();
            return;
        }
        animateOut();
    },
    onAnimationOutComplete: function(callback) {
        onAnimationOutCallback = callback;
    },
    setCharacter: function(character) {
        characterName = character;
    },
    allCharacters: allCharacters
};



module.exports = animationModule;