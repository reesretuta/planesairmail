

"use strict";

var allCharacters = require('../pixi/allCharacters');
var placeJustOffscreen = require('./placeJustOffscreen');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var characterName;


// =================================================================== //
/* *********************** Animation Functions *********************** */
// =================================================================== //
var animateIn, animateOut;

var animationsIn = (function() {
    var animationTime = 2.3;
    var easing = 'Cubic.easeInOut';

    return {
        dusty: function() {
            var dusty = allCharacters.dusty;

            placeJustOffscreen(dusty);
            dusty.windowX = 0.6;
            dusty.windowScale = 0.42;

            TweenLite.to(dusty, animationTime, {
                windowY: 0.3,
                windowX: 0.22,
                ease: easing
            });
        },
        bladeranger: function() {
            var blade = allCharacters.blade;

            blade.windowScale = 0.6;
            blade.windowX = -.4;
            blade.windowY = 0.75;

            TweenLite.to(blade, animationTime, {
                windowY: 0.34,
                windowX: 0.16,
                ease: easing
            });
        },
        cabbie: function() {
            var cabbie = allCharacters.cabbie;

            placeJustOffscreen(cabbie);
            cabbie.idle.windowScale = 0.6;
            cabbie.rotation = 0.55;
            cabbie.windowX = 0.46;

            cabbie.scale.x = 0.8;
            cabbie.scale.y = 0.8;

            cabbie.filters[0].blur = 7;

            TweenLite.to(cabbie, animationTime, {
                windowY: 0.34,
                ease: 'Back.easeOut'
            });

            var sweepTime = animationTime * 7/8;
            TweenLite.to(cabbie, sweepTime, {
                windowX: 0.15,
                rotation: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });

            TweenLite.to(cabbie.scale, sweepTime, {
                x: 1,
                y: 1,
                delay: animationTime - sweepTime,
                ease: easing
            });
            TweenLite.to(cabbie.filters[0], sweepTime, {
                blur: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });
        },
        dipper: function() {
            var dipper = allCharacters.dipper;

            dipper.idle.windowScale = 0.5;

            placeJustOffscreen(dipper);
            dipper.rotation = 0.55;
            dipper.windowX = 0.46;

            dipper.scale.x = 0.8;
            dipper.scale.y = 0.8;

            var blurFilter = dipper.filters[0];
            blurFilter.blur = 7;

            TweenLite.to(dipper, animationTime, {
                windowY: 0.34,
                ease: 'Back.easeOut'
            });

            var sweepTime = animationTime * 7/8;
            TweenLite.to(dipper, sweepTime, {
                windowX: 0.18,
                rotation: 0,
                delay: animationTime - sweepTime,
                ease: easing
            });

            TweenLite.to(dipper.scale, sweepTime, {
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
            var windlifter = allCharacters.windlifter;

            windlifter.idle.windowScale = 0.56;

            placeJustOffscreen(windlifter);
            windlifter.windowX = 0.6;

            TweenLite.to(windlifter, animationTime, {
                windowY: 0.3,
                windowX: 0.22,
                ease: easing
            });
        }
    };
})();

var onAnimationOutCallback = function(){};

function onAnimationOutComplete() {
    onAnimationOutCallback();
}

var animationsOut = (function() {
    var animationTime = 2.3;
    var easing = 'Circ.easeInOut';

    return {
        dusty: function() {
            var dusty = allCharacters.dusty;

            TweenLite.to(dusty, animationTime, {
                windowY: 0.25,
                windowX: -0.4,
                ease: easing,
                onComplete: onAnimationOutComplete
            });
        },
        bladeranger: function() {
            var blade = allCharacters.blade;

            TweenLite.to(blade, animationTime, {
                windowY: -0.5,
                windowX: 0.24,
                ease: 'Cubic.easeInOut',
                onComplete: onAnimationOutComplete
            });
        },
        cabbie: function() {
            var cabbie = allCharacters.cabbie;

            TweenLite.to(cabbie, animationTime, {
                windowY: 0.1,
                windowX: -0.4,
                ease: easing,
                onComplete: onAnimationOutComplete
            });

            var blurFilter = cabbie.filters[0];
            TweenLite.to(blurFilter, animationTime, {blur: 4});
        },
        dipper: function() {
            var dipper = allCharacters.dipper;

            TweenLite.to(dipper, animationTime, {
                windowY: 0.1,
                windowX: -0.4,
                ease: easing,
                onComplete: onAnimationOutComplete
            });

            var blurFilter = dipper.filters[0];
            TweenLite.to(blurFilter, animationTime, {blur: 4});
        },
        windlifter: function() {
            var windlifter = allCharacters.windlifter;

            TweenLite.to(windlifter, animationTime, {
                windowX: -0.3,
                ease: 'Cubic.easeIn',
                onComplete: onAnimationOutComplete
            });

            TweenLite.to(windlifter, animationTime * 7/8, {
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
    placeJustOffscreen(dusty);
    dusty.windowX = -0.2;
    dusty.idle.windowScale = 0.35;
    dusty.rotation = 0.6;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Blade ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    placeJustOffscreen(blade);
    blade.windowX = 0.55;
    blade.idle.windowScale = 0.3;
    blade.setStatic();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Cabbie ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cabbie.windowX = 0.5;
    cabbie.windowY = -0.3;
    cabbie.idle.windowScale = 0.2;
    cabbie.filters[0].blur = 4;
    cabbie.setStatic();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dipper ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    dipper.rotation = 0.55;

    dipper.windowX = -0.3;
    dipper.windowY = 0.6;

    dipper.filters[0].blur = 3;
    dipper.idle.windowScale = 0.2;
    dipper.setStatic();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~ Windlifter ~~~~~~~~~~~~~~~~~~~~~~~~~
    windlifter.windowX = -0.3;
    windlifter.windowY = 0.5;
    windlifter.idle.windowScale = 0.08;
    windlifter.rotation = 0.4;
    windlifter.filters[0].blur = 1;
    windlifter.flip();
    windlifter.setStatic();


    dusty.pushToTop();
}

function animateInTeam() {
    var animationTime = 2.3;
    var easing = 'Cubic.easeInOut';

    var dusty = allCharacters.dustyFour;
    var blade = allCharacters.blade;
    var cabbie = allCharacters.cabbie;
    var dipper = allCharacters.dipper;
    var windlifter = allCharacters.windlifter;

    teamAnimationSetup(dusty, blade, cabbie, dipper, windlifter);

    new TimelineMax({
        stagger: 0.27,
        align: 'start',
        tweens: [
            TweenLite.to(dusty, animationTime, {
                windowY: 0.24,
                windowX: 0.2,
                ease: easing
            }),
            TweenLite.to(blade, animationTime, {
                windowY: 0.59,
                windowX: 0.83,
                ease: easing
            }),
            TweenLite.to(dipper, animationTime, {
                windowY: 0.52,
                windowX: 0.05,
                rotation: 0,
                ease: easing
            }),
            TweenLite.to(cabbie, animationTime, {
                windowY: 0.2,
                windowX: 0.78,
                ease: easing
            }),
            TweenLite.to(windlifter, animationTime, {
                windowY: 0.7,
                windowX: 0.16,
                ease: easing
            })
        ]
    });
}

function animateOutTeam() {
    var animationTime = 1.8;
    var easing = 'Circ.easeIn';

    var dusty = allCharacters.dustyFour;
    var blade = allCharacters.blade;
    var cabbie = allCharacters.cabbie;
    var dipper = allCharacters.dipper;
    var windlifter = allCharacters.windlifter;

    new TimelineMax({
        stagger: 0.29,
        align: 'start',
        tweens: [
            new TimelineMax({
                tweens: [
                    TweenLite.to(cabbie, animationTime, {
                        windowY: 0.1,
                        ease: 'Back.easeIn'
                    }),
                    TweenLite.to(cabbie, animationTime, {
                        windowX: 1.6,
                        ease: easing
                    })
                ]
            }),
            TweenLite.to(windlifter, animationTime, {
                windowY: 0.8,
                windowX: 1.2,
                ease: easing
            }),
            TweenLite.to(dusty, animationTime, {
                windowY: 0.2,
                windowX: 1.4,
                ease: easing
            }),
            TweenLite.to(blade, animationTime, {
                windowY: 0.6,
                windowX: 1.6,
                ease: easing
            }),
            new TimelineMax({
                tweens: [
                    TweenLite.to(dipper, animationTime, {
                        windowY: 0.5,
                        ease: 'Back.easeIn'
                    }),
                    TweenLite.to(dipper, animationTime, {
                        windowX: 1.3,
                        ease: easing
                    })
                ]
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

    }),
    animateIn: function() {
        if(characterName === 'team') {
            animateInTeam();
            return;
        }

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