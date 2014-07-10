(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){



"use strict";




// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var background, middleground, foreground;


// =================================================================== //
/* ************************** Initialization ************************* */
// =================================================================== //
function initialize() {
    background = initBackground();
    middleground = initMiddleground();
    foreground = initForeground();
}
function setAttrs(sprite) {
    sprite.anchor = new PIXI.Point(.5, 1);
    sprite.windowX = 0.5;
    sprite.windowY = 1;

    sprite.scaleType = 'cover';
    sprite.windowScale = 1.06;
}
function initBackground() {
    var background = PIXI.Sprite.fromImage('assets/img/site_bg.jpg');

    setAttrs(background);

    return background;
}
function initMiddleground() {
    var middleground = PIXI.Sprite.fromImage('assets/img/midground.png');
    setAttrs(middleground);
    return middleground;
}
function initForeground() {
    var foreground = PIXI.Sprite.fromImage('assets/img/foreground_trees.png');
    setAttrs(foreground);
    return foreground;
}








var animationModule = {
    initialize: _.once(function() {
        initialize();
    }),
    addBackgroundToScene: function(scene) {
        scene.addChild(background);
    },
    addRestToScene: function(scene) {
        scene.addChild(middleground);
        scene.addChild(foreground);
    },
    shiftBackgroundLayers: function(x) {
        if(_.isUndefined(background)) return;

        var backgroundRatio = 0.75;
        var middlegroundRatio = 1.5;
        var foregroundRatio = 3;

        var backgroundX = 0.5 - (x - 0.5) * backgroundRatio/50;
        var middlegroundX = 0.5 - (x -.5) * middlegroundRatio/50;
        var foregroundX = 0.5 - (x -.5) * foregroundRatio/50;

        background.windowX = backgroundX;
        middleground.windowX = middlegroundX;
        foreground.windowX = foregroundX;
    },
    hide: function() {
        background.visible = false;
        middleground.visible = false;
        foreground.visible = false;

        background.destroy();
        middleground.destroy();
        foreground.destroy();
    }
};


module.exports = animationModule;
},{}],2:[function(require,module,exports){




"use strict";


// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var wipescreenVideo, videoTimeline;


// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    wipescreenVideo = generateBladeWipeAnimation();
    videoTimeline = initializeVideoTimeline(wipescreenVideo);
}

function generateBladeWipeAnimation() {
    var textures = PIXI.getTextures('assets/wipescreen/Blade_wpscrn_86', 400, 556);

    var wipescreenVideo = new PIXI.MovieClip(textures);
    wipescreenVideo.windowX = 0.5;
    wipescreenVideo.windowY = 0.5;
    wipescreenVideo.windowScale = 1;
    wipescreenVideo.scaleType = 'cover';

    wipescreenVideo.anchor = new PIXI.Point(0.5, 0.5);
    wipescreenVideo.visible = false;
    wipescreenVideo.loop = false;

    return wipescreenVideo;
}

function initializeVideoTimeline(video) {
    video._tweenFrame = 0;

    Object.defineProperty(video, 'tweenFrame', {
        get: function() {
            return this._tweenFrame;
        },
        set: function(value) {
            this._tweenFrame = value;

            this.gotoAndStop(value);

//            this.currentFrame = value;
//            this.setTexture(this.textures[value | 0]);
        }
    });

    return getVideoAnimationTimeline(video);
}

function getVideoAnimationTimeline(video) {
    var fps = 24;
    var numFrames = video.textures.length;

    var animationTime = numFrames/fps;
    var easing = new SteppedEase(numFrames);

    var timeline = new TimelineLite({
        paused: true,
        onStart: function() {
            video.visible = true;
            video.tweenFrame = 0;

            createjs.Sound.play('Wipescreen');
        },
        onComplete: function() {
            video.destroy();
        }
    });

    timeline.append(TweenLite.to(video, animationTime, {
        tweenFrame: numFrames-1,
        ease: easing
    }));


    var fadeOutTime = 0.2;
    var fadeOutStart = timeline.duration() - 0.1;

    timeline.addLabel('callback', timeline.duration() - 0.1);

    timeline.add(TweenLite.to(video, fadeOutTime, {
        alpha: 0,
        ease: 'Cubic.easeInOut'
    }), fadeOutStart);

    return timeline;
}




// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //


var animationModule = {
    initialize: function(scene) {
        initialize();

        scene.addChild(wipescreenVideo);
    },
    playVideo: function() {
        videoTimeline.play(0);
    },
    hideVideo: function() {
        wipescreenVideo.visible = false;
    },
    onVideoComplete: function(callback) {
        videoTimeline.add(callback, 'callback');
    }
};





_.bindAll.apply(_, [animationModule].concat(Object.keys(animationModule)));





module.exports = animationModule;













},{}],3:[function(require,module,exports){


"use strict";

var allCharacters = require('../pixi/allCharacters');
var placeJustOffscreen = require('./placeJustOffscreen');


// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var characterName;
var $window = $(window);




function getOffscreenX(character) {
    var width = character.getBounds().width;
    var anchorX = character.idle.anchor.x;
    var windowWidth = $window.width();

    return (windowWidth + anchorX*width)/windowWidth;
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
    dusty.windowX = 1 - getOffscreenX(dusty);
    dusty.idle.windowScale = 0.27;
    dusty.rotation = 0.6;
    dusty.filters[0].blur = 0;
    TweenLite.killTweensOf(dusty);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Blade ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    placeJustOffscreen(blade);
    blade.windowX = 0.45;
    blade.idle.windowScale = 0.33;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Cabbie ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    placeJustOffscreen(cabbie);
    cabbie.windowX = 0.14;
    cabbie.idle.windowScale = 0.25;
    cabbie.filters[0].blur = 0;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dipper ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    dipper.rotation = -0.3;
    dipper.windowX = -0.2;
    dipper.windowY = 0.25;
    dipper.filters[0].blur = 0;
    dipper.idle.windowScale = 0.22;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~ Windlifter ~~~~~~~~~~~~~~~~~~~~~~~~~
    windlifter.windowX = -0.1;
    windlifter.windowY = 0.7;
//    windlifter.idle.windowScale = 0.08;
    windlifter.idle.windowScale = 0.12;
    windlifter.rotation = -0.3;
    windlifter.filters[0].blur = 0;
    windlifter.flip();


    requestAnimFrame(function() {
        dusty.pushToTop();
    });
}

function animateInTeam() {
    var animationTime = 3.8;
    var easing = 'Cubic.easeInOut';

//    animationTime = 10;

    var dusty = allCharacters.dustyFour;
    var blade = allCharacters.blade;
    var cabbie = allCharacters.cabbieTwo;
    var dipper = allCharacters.dipper;
    var windlifter = allCharacters.windlifter;

    teamAnimationSetup(dusty, blade, cabbie, dipper, windlifter);

    var timeline = new TimelineMax({
        paused: true
    });
    // ~~~~~~~~~~~~~~~~~~ Animation Start Labels ~~~~~~~~~~~~~~~~~~~
    timeline.addLabel('Blade', 0);
    timeline.addLabel('Cabbie', animationTime * 0.13);
    timeline.addLabel('Windlifter', animationTime * 0.15);
    timeline.addLabel('Dipper', animationTime * 0.46);
    timeline.addLabel('Dusty', animationTime * 0.85);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Cabbie ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var cabbieAnimationTime = animationTime * 1.3;
    timeline.add(TweenLite.to(cabbie, cabbieAnimationTime, {
        windowX: getOffscreenX(cabbie),
        ease: easing
    }), 'Cabbie');

    timeline.add(TweenLite.to(cabbie, cabbieAnimationTime, {
        windowY: 0.3,
        ease: 'Expo.easeOut'
    }), 'Cabbie');


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Blade ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var bladeAnimationTime = animationTime;

    timeline.add(TweenLite.to(blade, bladeAnimationTime, {
        windowX: getOffscreenX(blade),
        ease: easing
    }), 'Blade');

    timeline.add(TweenLite.to(blade, bladeAnimationTime, {
        windowY: 0.5,
        ease: 'Back.easeOut'
    }), 'Blade');


    // ~~~~~~~~~~~~~~~~~~~~~~~~~ Windlifter ~~~~~~~~~~~~~~~~~~~~~~~~~
    var windlifterAnimTime = animationTime * 1.6;

    timeline.add(TweenLite.to(windlifter, windlifterAnimTime, {
        windowX: getOffscreenX(windlifter),
        rotation: 0.4,
        ease: easing
    }), 'Windlifter');

    timeline.add(TweenLite.to(windlifter, windlifterAnimTime * 0.7, {
        windowY: 0.35,
        ease: 'Quad.easeIn'
    }), 'Windlifter');


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dipper ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var dipperAnimTime = animationTime * 1.5;

    timeline.add(TweenLite.to(dipper, dipperAnimTime, {
        windowX: getOffscreenX(dipper),
        rotation: 0,
        ease: easing
    }), 'Dipper');

    timeline.add(TweenLite.to(dipper, dipperAnimTime, {
        windowY: 0.6,
        ease: 'Back.easeOut'
    }), 'Dipper');


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dusty ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var dustyAnimTime = animationTime * 0.7;

    timeline.add(TweenLite.to(dusty, dustyAnimTime, {
        windowX: 0.2,
        ease: 'Quad.easeInOut'
    }), 'Dusty');

    timeline.add(TweenLite.to(dusty, dustyAnimTime, {
        windowY: 0.24,
        ease: 'Sine.easeOut'
    }), 'Dusty');





    timeline.play();

//    new TimelineMax({
//        stagger: 0.27,
//        align: 'start',
//        tweens: [
//            TweenLite.to(dusty, animationTime, {
//                windowY: 0.24,
//                windowX: 0.2,
//                ease: easing
//            }),
//            TweenLite.to(blade, animationTime, {
//                windowY: 0.59,
//                windowX: 0.83,
//                ease: easing
//            }),
//            TweenLite.to(dipper, animationTime, {
//                windowY: 0.52,
//                windowX: 0.05,
//                rotation: 0,
//                ease: easing
//            }),
//            TweenLite.to(cabbie, animationTime, {
//                windowY: 0.2,
//                windowX: 0.78,
//                ease: easing
//            }),
//            TweenLite.to(windlifter, animationTime, {
//                windowY: 0.7,
//                windowX: 0.16,
//                ease: easing
//            })
//        ]
//    });
}

function animateOutTeam() {
    var animationTime = 1.8;
    var easing = 'Circ.easeIn';

    var dusty = allCharacters.dustyFour;
    var blade = allCharacters.blade;
    var cabbie = allCharacters.cabbie;
    var dipper = allCharacters.dipper;
    var windlifter = allCharacters.windlifter;

    var timeline = new TimelineMax({
        paused: true,
        onComplete: function() {
            onAnimationOutCallback();
        }
    });

    timeline.add(TweenLite.to(dusty, animationTime, {
        windowY: 0.1,
        ease: 'Back.easeIn'
    }), 0);
    timeline.add(TweenLite.to(dusty, animationTime, {
        windowX: getOffscreenX(dusty),
        ease: easing
    }), 0);


    timeline.play();
//    new TimelineMax({
//        stagger: 0.29,
//        align: 'start',
//        tweens: [
//            new TimelineMax({
//                tweens: [
//                    TweenLite.to(cabbie, animationTime, {
//                        windowY: 0.1,
//                        ease: 'Back.easeIn'
//                    }),
//                    TweenLite.to(cabbie, animationTime, {
//                        windowX: 1.6,
//                        ease: easing
//                    })
//                ]
//            }),
//            TweenLite.to(windlifter, animationTime, {
//                windowY: 0.8,
//                windowX: 1.2,
//                ease: easing
//            }),
//            TweenLite.to(dusty, animationTime, {
//                windowY: 0.2,
//                windowX: 1.4,
//                ease: easing
//            }),
//            TweenLite.to(blade, animationTime, {
//                windowY: 0.6,
//                windowX: 1.6,
//                ease: easing
//            }),
//            new TimelineMax({
//                tweens: [
//                    TweenLite.to(dipper, animationTime, {
//                        windowY: 0.5,
//                        ease: 'Back.easeIn'
//                    }),
//                    TweenLite.to(dipper, animationTime, {
//                        windowX: 1.3,
//                        ease: easing
//                    })
//                ]
//            })
//        ],
//        onComplete: function() {
//            dusty.destroy();
//
//            onAnimationOutCallback();
//        }
//    });
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

        setTimeout(animateIn, 700);
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
},{"../pixi/allCharacters":22,"./placeJustOffscreen":8}],4:[function(require,module,exports){


"use strict";


var placeJustOffscreen = require('./placeJustOffscreen');

var allCharacters = require('../pixi/allCharacters');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var dusty, dipper, timelineIn, timelineOut, timelineDustyHover;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    dusty = initializeDusty();
    dipper = initializeDipper();

    timelineIn = generateAnimationInTimeline();
    timelineOut = generateAnimationOutTimeline();
}

function initializeDusty() {
    var dusty = allCharacters.dustyFour;

    dusty.idle.windowScale = 0.32;
    dusty.windowX = 0.18;
    dusty.windowY = -1;

    return dusty;
}

function initializeDipper() {
    var dipper = allCharacters.dipper;

    dipper.flip();

    dipper.windowX = 0.75;
    dipper.windowY = -1;
    dipper.rotation = -0.40;

    dipper.idle.windowScale = 865/1366;
    dipper.idle.animationScaleX = 0.7;
    dipper.idle.animationScaleY = 0.7;

    dipper.filters[0].blur = 10;

    return dipper;
}


// =================================================================== //
/* **************************** Animate In *************************** */
// =================================================================== //
function generateAnimationInTimeline() {
    var timeline = new TimelineMax({
        paused: true
    });

    var timelineDustyIn = generateTimelineDustyIn(dusty);

    timeline.add(timelineDustyIn.play(), 0);
    timeline.add(generateTimelineDustyHover(dusty).play(), timelineDustyIn.duration());

    timeline.add(generateTimelineDipperIn(dipper).play(), 0.4);

    return timeline;
}

function generateTimelineDustyIn(dusty) {
    var animationTime = 1.6;
    var easing = 'Cubic.easeInOut';


    var timeline = new TimelineMax({
        paused: true,
        onStart: function() {
            placeJustOffscreen(dusty);
        }
    });

    timeline.add(TweenLite.to(dusty, animationTime, {
        windowY: 0.52,
        ease: easing
    }), 0);

    return timeline;
}
function generateTimelineDustyHover(dusty) {
    var animationTime = 1;
    var easing = 'Quad.easeInOut';

    var timeline = new TimelineMax({
        paused: true,
        repeat: -1
    });

    timeline.append(TweenLite.to(dusty, animationTime, {
        bumpY: -15,
        ease: easing
    }));
    timeline.append(TweenLite.to(dusty, animationTime, {
        bumpY: 0,
        ease: easing
    }));

    return timeline;
}
function generateTimelineDipperIn(dipper) {
    var animationTime = 2.0;
    var sweepStartTime = animationTime * 0.11;
    var easing = 'Cubic.easeInOut';


    var blurFilter = dipper.filters[0];

    var timeline = new TimelineMax({
        paused: true,
        onStart: function() {
            placeJustOffscreen(dipper);
        }
    });

    timeline.add(TweenLite.to(dipper, animationTime, {
        windowY: 0.30,
        ease: 'Back.easeOut'
    }), 0);

    //sweep right
    timeline.add(TweenLite.to(dipper, animationTime, {
        windowX: 0.86,
        rotation: 0,
        ease: easing
    }), sweepStartTime);

    // scale up
    timeline.add(TweenLite.to(dipper.idle, animationTime + sweepStartTime, {
        animationScaleX: 1,
        animationScaleY: 1,
        ease: easing
    }), 0);
    timeline.add(TweenLite.to(blurFilter, animationTime + sweepStartTime, {
        blur: 0,
        ease: easing
    }), 0);

    return timeline;
}
// =================================================================== //
/* *************************** Animate Out *************************** */
// =================================================================== //

var onAnimationOutComplete = function(){};

function generateAnimationOutTimeline() {
    var timelineOut = new TimelineMax({
        paused: true,
        onComplete: function() {
            onAnimationOutComplete();
        }
    });

    timelineOut.add(generateAnimationDipperOut(dipper).play(), 0);
    timelineOut.add(generateAnimationDustyOut(dusty).play(), 0);

   return timelineOut;
}

function generateAnimationDipperOut(dipper) {
    var animationTime = 1.6;
    var easing = 'Cubic.easeInOut';

    var blurFilter = dipper.filters[0];

    var timeline = new TimelineMax({
        paused: true
    });

    timeline.add(TweenLite.to(dipper.idle, animationTime, {
        animationScaleX: 1.4,
        animationScaleY: 1.4,
        ease: easing
    }), 0);
    timeline.add(TweenLite.to(dipper, animationTime, {
        windowY: -0.3,
        windowX: 1.1,
        ease: easing
    }), 0);

    timeline.add(TweenLite.to(blurFilter, animationTime/2, {
        blur: 10,
        ease: easing
    }), 0);

    return timeline;
}
function generateAnimationDustyOut(dusty) {
    var animationTime = 2.4;
    var easing = 'Expo.easeInOut';

    var blurFilter = dusty.filters[0];

    var timeline = new TimelineMax({
        paused: true
    });

    timeline.add(TweenLite.to(dusty.idle, animationTime, {
        animationScaleX: 1.3,
        animationScaleY: 1.3,
        ease: easing
    }), 0);

    timeline.add(TweenLite.to(dusty, animationTime, {
        windowY: -0.2,
        windowX: 0.7,
        ease: easing
    }), 0);


    timeline.add(TweenLite.to(blurFilter, animationTime, {
        blur: 10,
        ease: easing
    }), 0);

    return timeline;
}




// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //

var animationModule = {
    initialize: _.once(function(scene) {
        initialize();
    }),
    animateIn: function() {
        timelineIn.play(0);
    },
    animateOut: function() {
        timelineOut.play(0);
    },
    onAnimationInComplete: function(callback) {
        timelineIn.vars.onComplete = callback;
    },
    onAnimationOutComplete: function(callback) {
        onAnimationOutComplete = callback;
    }

};


_.bindAll.apply(_, [].concat(animationModule, Object.keys(animationModule)));




module.exports = animationModule;
},{"../pixi/allCharacters":22,"./placeJustOffscreen":8}],5:[function(require,module,exports){

"use strict";

function getIntroTextures() {
    return PIXI.getTextures('assets/introVideo/PLANES2_760x428_2_00', 0, 122);
}
function getLogoTextures() {
    return PIXI.getTextures('assets/spritesheets/logo/PLANE_logo_tall_480x260_0000', 0, 72);
}

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var running = true;
var $window = $(window);

var stage = new PIXI.Stage(0x66FF99);
var renderer = PIXI.autoDetectRenderer($window.width(), $window.height(), null, true, true);

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //

function initialize() {
    // add the renderer view element to the DOM
    renderer.view.setAttribute('id', 'pixi-intro');
    $('#content').append(renderer.view);

    requestAnimFrame(animate);

    $window.on('resize', onWindowResize);
}

function animate() {
    if(!running) return;

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}

// =================================================================== //
/* *************************** Intro Video *************************** */
// =================================================================== //
var videoTimeline, video;

var videoCompleteCallback = function(){};

var bgColors = {
    topLeft: new PIXI.Graphics(),
    top: new PIXI.Graphics(),
    topRight: new PIXI.Graphics(),
    btmLeft: new PIXI.Graphics(),
    btm: new PIXI.Graphics(),
    btmRight: new PIXI.Graphics()
};
var introVideoContainer = new PIXI.DisplayObjectContainer();
var introFrameTop = new PIXI.DisplayObjectContainer();
var introFrameBtm = new PIXI.DisplayObjectContainer();
var introFrameTopBg;
var introFrameBtmBg;

function initializeBackgroundColors() {

    _.each(bgColors, function(graphic) {
        graphic.beginFill(0x07080B);
        graphic.lineStyle(0);

        graphic.drawRect(0, 0, 1, 1);
    });
}

function initializeIntroFrameTop() {
    introFrameTopBg = PIXI.Sprite.fromImage('assets/img/intro-top.png');
    introFrameTopBg.anchor = new PIXI.Point(.5, 1);

    introFrameTop.windowX = .5;
    introFrameTop.windowY = .5;

    bgColors.topLeft.windowX = -.5;
    bgColors.topLeft.windowY = -.5;
    bgColors.top.windowX = -.5;
    bgColors.top.windowY = -.5;

    bgColors.topRight.windowY = -.5;

    introFrameTop.addChild(bgColors.topLeft);
    introFrameTop.addChild(bgColors.top);
    introFrameTop.addChild(bgColors.topRight);
    introFrameTop.addChild(introFrameTopBg);

    introFrameTopBg.scaleMin = 0.8;

    introVideoContainer.addChild(introFrameTop);
}

function initializeIntroFrameBtm() {
    introFrameBtmBg = PIXI.Sprite.fromImage('assets/img/intro-btm.png');
    introFrameBtmBg.anchor = new PIXI.Point(.5, 0);

    introFrameBtm.windowX = .5;
    introFrameBtm.windowY = .5;

    bgColors.btmLeft.windowX = -.5;
    bgColors.btm.windowX = -.5;

    introFrameBtm.addChild(bgColors.btmLeft);
    introFrameBtm.addChild(bgColors.btm);
    introFrameBtm.addChild(bgColors.btmRight);
    introFrameBtm.addChild(introFrameBtmBg);

    introFrameBtmBg.scaleMin = 0.8;

    introVideoContainer.addChild(introFrameBtm);
}

function initializeVideo() {
    var introVideo = new PIXI.MovieClip(getIntroTextures());

    introVideo.windowX = 0.5;
    introVideo.windowY = 0.5;
    introVideo.anchor = new PIXI.Point(0.5, 0.5);

    introVideo.visible = false;
    introVideo.loop = false;

    return introVideo;
}

function initializeVideoTimeline(video) {
    video._tweenFrame = 0;

    Object.defineProperty(video, 'tweenFrame', {
        get: function() {
            return this._tweenFrame;
        },
        set: function(value) {
            this._tweenFrame = value;
            this.currentFrame = value;
            this.setTexture(this.textures[value | 0]);
        }
    });

    return getVideoAnimationTimeline(video);
}

(function() {
    initializeBackgroundColors();

    stage.addChild(introVideoContainer);
})();

// =================================================================== //
/* ******************************* Logo ****************************** */
// =================================================================== //
var logo, logoTimeline;

function initializeLogo() {
    var logo = new PIXI.MovieClip(getLogoTextures());

    logo.windowY = 0;
    logo.anchor = new PIXI.Point(.5, 1);

    logo.visible = false;
    logo.loop = false;

    logo._tweenFrame = 0;
    Object.defineProperty(logo, 'tweenFrame', {
        get: function() {
            return this._tweenFrame;
        },
        set: function(value) {
            this._tweenFrame = value;
            this.currentFrame = value;
            this.setTexture(this.textures[value | 0]);
        }
    });

    return logo;
}

function getLogoAnimationTimeline(logo) {
    var fps = 32;
    var numFrames = logo.textures.length;

    var animationTime = numFrames/fps;
    var easing = new SteppedEase(numFrames);

    var timeline = new TimelineLite({
        paused: true,
        onStart: function() {
            logo.visible = true;
            logo.tweenFrame = 0;
        },
        onComplete: function() {

        }
    });

    timeline.append(TweenLite.to(logo, animationTime, {
        tweenFrame: numFrames-1,
        ease: easing
    }));

    return timeline;
}

// =================================================================== //
/* *********************** Animation Functions *********************** */
// =================================================================== //

function getVideoAnimationTimeline(video) {
    var fps = 24;
    var numFrames = video.textures.length;

    var animationTime = numFrames/fps;
    var easing = new SteppedEase(numFrames);

    var timeline = new TimelineLite({
        paused: true,
        onStart: function() {
            video.visible = true;
            video.tweenFrame = 0;
            createjs.Sound.play('IntroVideo', {delay: 50});
        },
        onComplete: function() {
            video.destroy();

            videoCompleteCallback();
        }
    });

    var delay = 0;
    timeline.add(TweenLite.to(video, animationTime, {
        tweenFrame: numFrames-1,
        ease: easing
    }), delay);

    return timeline;
}


// =================================================================== //
/* ****************************** Loader ***************************** */
// =================================================================== //
var loadingScreen = new PIXI.DisplayObjectContainer();
var loadingBar = new PIXI.Graphics();
var loadingBackground = new PIXI.Graphics();
var loaderLogo = PIXI.Sprite.fromImage('assets/img/preloader_logo.png');

function setGraphicScale(obj, width, height) {
    obj.scale.x = obj._graphicScale * width;

    if(!_.isUndefined(height)) {
        obj.scale.y = obj._graphicScale * height;
    }
}
function initLoadingBar() {
    loadingBar.beginFill(0xC2001B);
    loadingBar.lineStyle(0);

    loadingBar.drawRect(0, 0, 1, 15);

    loadingBar._graphicScale = 0;
    Object.defineProperty(loadingBar, 'graphicScale', {
        get: function() {
            return this._graphicScale;
        },
        set: function(val) {
            this._graphicScale = val;

            setGraphicScale(this, $window.width());
        }
    });

    loadingScreen.addChild(loadingBar);
}
function initLoadingBackground() {
    loadingBackground.beginFill(0x08090B);
    loadingBackground.lineStyle(0);
    loadingBackground.drawRect(0, 0, 1, 1);

    loadingBackground._graphicScale = 0;
    Object.defineProperty(loadingBackground, 'graphicScale', {
        get: function() {
            return this._graphicScale;
        },
        set: function(val) {
            this._graphicScale = val;

            setGraphicScale(this, $window.width(), $window.height());
        }
    });

    loadingBackground.graphicScale = 1;

    loadingScreen.addChild(loadingBackground);
}

function initLogo() {
    loaderLogo.windowX = 0.5;
    loaderLogo.windowY = 0.5;

    loaderLogo.anchor = new PIXI.Point(.5,.5);

    loadingScreen.addChild(loaderLogo);
}

(function() {
    initLoadingBackground();
    initLoadingBar();
    initLogo();

    stage.addChild(loadingScreen);
})();

// =================================================================== //
/* ************************ On Window Resize ************************* */
// =================================================================== //
function onWindowResize() {
    var width = $window.width();
    var height = $window.height();

    updateLoadingSize(width, height);
    updateVideoAndFrame(width, height);

    stage._onWindowResize(width, height);
    renderer.resize(width, height);
}
function updateLogo(width, height, videoHeight) {
    if(_.isUndefined(logo)) return;

    var bounds = logo.getLocalBounds();

    var newLogoHeight = (height - videoHeight)/2;
    var scale = Math.min(newLogoHeight/(bounds.height - 55), 1);

    logo.scale.x = scale;
    logo.scale.y = scale;

    //calc position
    logo.windowY = newLogoHeight/height - 0.5;
}

function updateLoadingSize(width, height) {
    setGraphicScale(loadingBar, width);
    setGraphicScale(loadingBackground, width, height);
}

function updateVideoAndFrame(width, height) {
    if(_.isUndefined(introFrameTopBg)) return;

    var maxHeight = 0.87;
    var maxWidth = 0.95;

    var localBounds = introFrameTopBg.getLocalBounds();
    var btmBounds = introFrameBtmBg.getLocalBounds();

    var scale = Math.min(maxHeight * 0.5 * height/localBounds.height, maxWidth * width/localBounds.width);

    //keep scale within our defined bounds
    scale = Math.max(introFrameTopBg.scaleMin, Math.min(scale, introFrameTopBg.scaleMax));

    var btmScale = scale * localBounds.width/btmBounds.width;
    var videoScale = scale * 1.024;

    introFrameTopBg.scale.x = scale;
    introFrameTopBg.scale.y = scale;

    introFrameBtmBg.scale.x = btmScale;
    introFrameBtmBg.scale.y = btmScale;

    video.scale.x = videoScale;
    video.scale.y = videoScale;

    updateTopFrameBackground(width, height, localBounds.width * scale, localBounds.height * scale);
    updateBtmFrameBackground(width, height, btmBounds.width * scale, btmBounds.height * scale);
    updateLogo(width, height, videoScale * video.getLocalBounds().height);
}
function updateTopFrameBackground(width, height, frameWidth, frameHeight) {
    var sideWidth = (width-frameWidth)/2 + frameWidth * 100/975;
    var topHeight = (height/2-frameHeight) + frameHeight * 100/326;

    bgColors.topLeft.scale.x = sideWidth;
    bgColors.topLeft.scale.y = height/2;

    bgColors.top.scale.x = width;
    bgColors.top.scale.y = topHeight;

    bgColors.topRight.scale.x = sideWidth;
    bgColors.topRight.scale.y = height/2;
    bgColors.topRight.windowX = (width-sideWidth)/width - 0.5;
}
function updateBtmFrameBackground(width, height, frameWidth, frameHeight) {
    var sideWidth = (width-frameWidth)/2 + frameWidth * 100/975;
    var btmHeight = (height/2-frameHeight) + frameHeight * 100/326;

    bgColors.btmLeft.scale.x = sideWidth;
    bgColors.btmLeft.scale.y = height/2;

    bgColors.btm.scale.x = width;
    bgColors.btm.scale.y = btmHeight;
    bgColors.btm.windowY = (height-btmHeight)/height - 0.5;

    bgColors.btmRight.scale.x = sideWidth;
    bgColors.btmRight.scale.y = height/2;
    bgColors.btmRight.windowX = (width-sideWidth)/width - 0.5;
}



// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //

var animationModule = {
    initialize: function() {
        initialize();
    },
    getIntroFrames: function() {
        return {
            top: introFrameTop,
            btm: introFrameBtm
        };
    },
    playVideo: function() {
        videoTimeline.play(0);
    },
    onComplete: function(callback) {
        videoCompleteCallback = callback;
    },
    updateLoader: function(percent, timeElapsed) {
        var oldX = loadingBar.graphicScale;
        var newX = percent;

        var animationTime = timeElapsed/1000 * (newX - oldX)/newX;

        TweenLite.to(loadingBar, animationTime, {
            graphicScale: newX
        });
    },
    assetsLoaded: _.once(function() {
        video = initializeVideo();
        videoTimeline = initializeVideoTimeline(video);
        logo = initializeLogo();
        logoTimeline = getLogoAnimationTimeline(logo);

        introVideoContainer.addChild(video);

        initializeIntroFrameTop();
        initializeIntroFrameBtm();

        introFrameTop.addChild(logo);

        onWindowResize();

        var self = this;
        setTimeout(function() {
            TweenLite.to(loadingScreen, 0.4, {
                alpha: 0,
                onComplete: function() {
                    setTimeout(self.playVideo.bind(self), 600);
                }
            });
        }, 600);
    }),
    showLogo: function() {
        logoTimeline.play();
    },
    destroy: function() {
        video.destroy();
        logo.destroy();

        introVideoContainer = null;
        introFrameTop = null;
        introFrameBtm = null;
        introFrameTopBg = null;
        introFrameBtmBg = null;

        stage = null;
        renderer = null;
        video = null;
        logo = null;

        running = false;

        $('#pixi-intro').remove();

        $window.off('resize', onWindowResize);
    }
};


_.bindAll.apply(_, [animationModule].concat(Object.keys(animationModule)));



module.exports = animationModule;











},{}],6:[function(require,module,exports){




"use strict";


var easing = 'Cubic.easeInOut';
var animationTime = 0.4;



var personalityAnimationPairs = [
    [_.bind(staggerItems, fadeInFromRight), _.bind(staggerItems, snapOutRotate)],
    [_.bind(staggerItems, fadeInFromRight), _.bind(staggerItems, snapOut)],
    [_.bind(staggerItems, bounceFadeInFromTop), _.bind(staggerItems, snapOutRotate)],
    [_.bind(staggerItems, bounceFadeInFromTop), _.bind(staggerItems, snapOut)]
];

var cannedAnimationPairs = [
    [_.bind(staggerItems, bounceFadeInFromRight), _.bind(staggerItems, snapOut)]
];



function staggerItems($items) {
    var timeline = new TimelineMax({
        paused: true,
        tweens: _.map($items, this),
        stagger: 0.07
    });

    return timeline;
}


// =================================================================== //
/* ********************* Individual Animations *********************** */
// =================================================================== //
function fadeIn($item, prop, distance, easing) {
    var from = {opacity: 0};
    from[prop] = distance;

    var to = {opacity: 1, ease: easing};
    to[prop] = 0;

    return TweenLite.fromTo($item, animationTime, from, to);
}
function fadeInNoMovement($item) {
    return fadeIn($item, 'x', 0, easing);
}
function fadeInFromRight($item) {
    return fadeIn($item, 'x', 75, easing);
}
function fadeInFromTop($item) {
    return fadeIn($item, 'y', -75, easing);
}
function bounceFadeInFromRight($item) {
    return fadeIn($item, 'x', 75, 'Back.easeOut');
}
function bounceFadeInFromTop($item) {
    return fadeIn($item, 'y', -75, 'Back.easeOut');
}
function rotateInLeft($item) {
    return TweenLite.fromTo($item, animationTime, {rotationY: -90, transformOrigin:"left 50% -100"}, {rotationY: 0});
}

function snapOut($item) {
    return TweenLite.to($item, animationTime, {opacity: 0, scale: 0.4, transformOrigin:"50% 50% 0", ease: 'Back.easeIn'});
}
function snapOutRotate($item) {
    return TweenLite.to($item, animationTime, {opacity: 0, scale: 0.4, transformOrigin:"50% 50% 0", rotation: -45, ease: 'Back.easeIn'});
}








var animationModule = {
    getRandomPersonalityAnimations: function($items) {
        var i = _.random(personalityAnimationPairs.length - 1);

        return _.map(personalityAnimationPairs[i], function(fnc) {
            return fnc($items);
        });
    },
    getRandomCannedAnimations: function($items) {
        var i = _.random(cannedAnimationPairs.length - 1);

        return _.map(cannedAnimationPairs[i], function(fnc) {
            return fnc($items);
        });
    }
};



module.exports = animationModule;
},{}],7:[function(require,module,exports){



"use strict";

var Character = require('../pixi/character');
var placeJustOffscreen = require('./placeJustOffscreen');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var parachuters, parachutersContainer;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    parachuters = _.shuffle([getBlackout(), getDrip(), getDynamite()]);

    _.each(parachuters, function(parachuter) {
        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blur = 0;

        parachuter.filters = [blurFilter];
        parachuter.windowX = 0.5;
        parachuter.windowY = -1;
    });
}
function getBlackout() {
    var blackoutIdleState = PIXI.Sprite.fromImage("assets/img/blackout.png");
    blackoutIdleState.anchor = {
        x: 26/61,
        y: 33/94
    };

    return new Character('Blackout', blackoutIdleState);
}
function getDrip() {
    var dripIdleState = PIXI.Sprite.fromImage("assets/img/drip.png");
    dripIdleState.anchor = {
        x: 36/61,
        y: 26/94
    };

    return new Character('Drip', dripIdleState);
}
function getDynamite() {
    var dynamiteIdleState = PIXI.Sprite.fromImage("assets/img/dynamite.png");
    dynamiteIdleState.anchor = {
        x: 27/61,
        y: 30/94
    };

    return new Character('Dynamite', dynamiteIdleState);
}


// =================================================================== //
/* ********************** Animation Functions ************************ */
// =================================================================== //
function animateParachuter(parachuter) {
    var animationTime = 35;

    var depth = Math.random() * 5;
    var x = 0.1 + (Math.random() * 0.8);
    var scale = 1 - depth * 0.2/5;

    placeJustOffscreen(parachuter);
    parachuter.windowX = x;

    var rotation = 0.3;

    TweenLite.to(parachuter, animationTime, {
        windowY: 1,
        ease: 'Sine.easeOut',
        onComplete: function() {
            parachuter.visibile = false;
        }
    });

    parachuter.scale = {x: scale, y: scale};
    parachuter.filters[0].blur = depth * 3/5;
    parachuter.rotation = rotation;

    swayParachuter(parachuter, rotation);
}
function swayParachuter(parachuter, rotation) {
    var swayTime = 1.2;
    var dec = 0.03;

    TweenLite.to(parachuter, swayTime, {
        rotation: -rotation,
        ease: 'Cubic.easeInOut'
    });
    TweenLite.to(parachuter, swayTime, {
        rotation: rotation,
        ease: 'Cubic.easeInOut',
        delay: swayTime,
        onComplete: function() {
            if(rotation > 0) {
                swayParachuter(parachuter, rotation - dec);
            }
        }
    });
}



// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //


var animationModule = {
    initialize: _.once(function(scene) {
        initialize();

        parachutersContainer = new PIXI.DisplayObjectContainer();

        _.each(parachuters, _.bind(parachutersContainer.addChild, parachutersContainer));

        scene.addChild(parachutersContainer);
    }),
    animateNext: function() {
        if(parachuters.length > 0)
            animateParachuter(parachuters.shift());
    },
    hide: function() {
        parachutersContainer.visible = false;

        _.each(parachuters, function(parachuter) {
            parachuter.destroy();
        });
    }
};


_.bindAll.apply(_, [animationModule].concat(Object.keys(animationModule)));



module.exports = animationModule;
},{"../pixi/character":23,"./placeJustOffscreen":8}],8:[function(require,module,exports){

module.exports = function(character) {
    var height = character.scale.y * character.getLocalBounds().height;

    character.windowY = -(height/2)/$(window).height();
};
},{}],9:[function(require,module,exports){

"use strict";

var allCharacters = require('../pixi/allCharacters');
var placeJustOffscreen = require('../animations/placeJustOffscreen');

var scenesManager = require('../pixi/scenesManager');

var $window = $(window);
var letterBg;

function getOffscreenX(character) {
    var width = character.getBounds().width;
    var anchorX = character.idle.anchor.x;
    var windowWidth = $window.width();

    return (windowWidth + anchorX*width)/windowWidth;
}


var animateIn = (function() {
    var animationTime = 1.2;
    var easing = 'Cubic.easeInOut';

    return {
        dusty: function() {
            var dusty = allCharacters.dustyDark;

            dusty.pushToTop();
            dusty.idle.windowScale = 0.37;
            dusty.windowX = 0.2;
            placeJustOffscreen(dusty);

            TweenLite.to(dusty, animationTime, {
                windowX: 0.71,
                windowY: 0.23,
                ease: easing
            });
        },
        bladeranger: function() {
            var blade = allCharacters.blade;

            blade.pushToTop();
            blade.idle.windowScale = 0.5;
            blade.windowX = 0.3;
            placeJustOffscreen(blade);

            TweenLite.to(blade, animationTime, {
                windowX: 0.74,
                windowY: 0.24,
                ease: easing
            });
        },
        cabbie: function() {
            var cabbie = allCharacters.cabbie;

            cabbie.pushToTop();
            cabbie.idle.windowScale = 0.6;
            placeJustOffscreen(cabbie);
            cabbie.windowX = 0.35;
            cabbie.rotation = 0;
            cabbie.filters[0].blur = 0;

            TweenLite.to(cabbie, animationTime, {
                windowX: 0.18,
                windowY: 0.25,
                ease: easing
            });
        },
        dipper: function() {
            var dipper = allCharacters.dipper;

            dipper.pushToTop();
            dipper.idle.windowScale = 0.4;
            placeJustOffscreen(dipper);
            dipper.windowX = 0.4;
            dipper.scale.x = -1;
            dipper.rotation = 0;
            dipper.filters[0].blur = 0;

           TweenLite.to(dipper, animationTime, {
               windowX: 0.65,
               windowY: 0.29,
               ease: easing
           });
        },
        windlifter: function() {
            var windlifter = allCharacters.windlifter;

            windlifter.pushToTop();
            windlifter.idle.windowScale = 0.45;
            placeJustOffscreen(windlifter);
            windlifter.windowX = 0.5;

            TweenLite.to(windlifter, animationTime, {
                windowX: 0.17,
                windowY: 0.27,
                ease: easing
            });
        },
        team: function() {
            "use strict";

            var dusty = allCharacters.dustyFour;
            var blade = allCharacters.blade;
            var cabbie = allCharacters.cabbieTwo;
            var dipper = allCharacters.dipper;
            var windlifter = allCharacters.windlifter;

            preTeamAnimationSetup(dusty, blade, cabbie, dipper, windlifter);


            var timeline = new TimelineMax({
                paused: true
            });

            // ~~~~~~~~~~~~~~~~~~ Animation Start Labels ~~~~~~~~~~~~~~~~~~~
            timeline.addLabel('Dusty', 0);
            timeline.addLabel('Blade', animationTime * 0.15);
            timeline.addLabel('Dipper', animationTime * 0.3);
            timeline.addLabel('Cabbie', animationTime * 0.45);
            timeline.addLabel('Windlifter', animationTime * 0.6);


            timeline.add(TweenLite.to(dusty, animationTime, {
                windowX: 0.52,
                windowY: 0.22,
                ease: easing
            }), 'Dusty');

            timeline.add(TweenLite.to(blade, animationTime, {
                windowX: 0.87,
                windowY: 0.46,
                ease: easing
            }), 'Blade');

            timeline.add(TweenLite.to(dipper, animationTime, {
                windowX: 0.16,
                windowY: 0.22,
                ease: easing
            }), 'Dipper');

            timeline.add(TweenLite.to(cabbie, animationTime, {
                windowX: 0.85,
                windowY: 0.2,
                ease: easing
            }), 'Cabbie');


            timeline.add(TweenLite.to(windlifter, animationTime, {
                windowX: 0.08,
                windowY: 0.4,
                ease: easing
            }), 'Windlifter');



            timeline.play();
        }
    };
})();

function preTeamAnimationSetup(dusty, blade, cabbie, dipper, windlifter) {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dusty ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    placeJustOffscreen(dusty);
    dusty.windowX = 0.3;
    dusty.idle.windowScale = 0.32;
    dusty.rotation = 0.48;
    dusty.setStatic();
    dusty.pushToTop();


    placeJustOffscreen(blade);
    blade.windowX = 0.6;
    blade.idle.windowScale = 0.34;
    blade.setStatic();


    placeJustOffscreen(dipper);
    dipper.windowX = 0;
    dipper.rotation = 0.08;
    dipper.setStatic();


    windlifter.windowX = 1 - getOffscreenX(windlifter);
    windlifter.windowY = 0.1;
    windlifter.idle.windowScale = 0.14;
    windlifter.setStatic();


    placeJustOffscreen(cabbie);
    cabbie.windowX = 0.6;
    cabbie.idle.windowScale = 0.22;
    cabbie.setStatic();
}

function addLetterBg(scene) {
    letterBg = PIXI.Sprite.fromImage('assets/img/response_letter_bg.jpg');

    letterBg.anchor = new PIXI.Point(.5, .5);
    letterBg.windowX = 0.5;
    letterBg.windowY = 0.5;

    letterBg.visible = false;



    scene.addChild(letterBg);
}

function pushToTop(sprite) {
    var length = sprite.parent.children.length;
    sprite.parent.addChildAt(sprite, length-1);
}


module.exports = {
    animateIn: function(character) {
        pushToTop(letterBg);
        letterBg.visible = true;

        animateIn[character]();
    },
    initialize: function(scene) {
        addLetterBg(scene);
    }
};
},{"../animations/placeJustOffscreen":8,"../pixi/allCharacters":22,"../pixi/scenesManager":28}],10:[function(require,module,exports){



var Question = require('../models/question');


var QuestionCollection = Backbone.Collection.extend({
    model: Question
});




module.exports = QuestionCollection;
},{"../models/question":21}],11:[function(require,module,exports){




(function() {
    "use strict";

    var QuestionCollection = require('./QuestionCollection');

    var characterSelect = require('../data/characterSelect.json');
    var cannedQuestionData = require('../data/cannedQuestions.json');
    var personalityQuestionData = require('../data/personalityQuestions.json');

    function getRandomPersonalityQuestions(num) {
        return _.first(_.shuffle(personalityQuestionData.questions), num);
    }


    function getEmptyCannedQuestions(num) {
        return _.map(_.range(num), function(i) {
            return {
                class: cannedQuestionData.class,
                copy: cannedQuestionData.copy,
                name: 'canned-question' + i,
                options: []
            }
        });
    }





    var allQuestions = new QuestionCollection();


    //shuffle questions and pick 3
    var personalityQuestions = getRandomPersonalityQuestions(3);
    var cannedQuestions = getEmptyCannedQuestions(3);


    allQuestions.add(characterSelect);
    allQuestions.add(personalityQuestions);
    allQuestions.add(cannedQuestions);



    function filterUnused(options, used) {
        return _.filter(options, function(option) {
            return used.indexOf(option.value) === -1;
        });
    }

    allQuestions.getUnusedCannedOptions = function(num, used) {
        var possibleOptions = _.shuffle(filterUnused(cannedQuestionData.options, used));

        return _.first(possibleOptions, num);
    };


    module.exports = allQuestions;
})();

},{"../data/cannedQuestions.json":14,"../data/characterSelect.json":15,"../data/personalityQuestions.json":16,"./QuestionCollection":10}],12:[function(require,module,exports){
module.exports={
	"totalSize": 26715679,
	"assets": {
		"assets/img/blackout.png": 2506,
		"assets/img/button.png": 7544,
		"assets/img/drip.png": 3288,
		"assets/img/dynamite.png": 2420,
		"assets/img/footer.png": 43398,
		"assets/img/foreground_trees.png": 115714,
		"assets/img/header.png": 91138,
		"assets/img/icons/baseball.png": 14297,
		"assets/img/icons/blade_ranger.png": 15308,
		"assets/img/icons/blue.png": 10749,
		"assets/img/icons/broccoli.png": 14045,
		"assets/img/icons/cabbie.png": 18981,
		"assets/img/icons/canned-btn.png": 12476,
		"assets/img/icons/dipper.png": 18923,
		"assets/img/icons/dusty.png": 20328,
		"assets/img/icons/football.png": 13629,
		"assets/img/icons/fries.png": 11928,
		"assets/img/icons/green.png": 10747,
		"assets/img/icons/hockey.png": 13052,
		"assets/img/icons/icecream.png": 12442,
		"assets/img/icons/nuggets.png": 13347,
		"assets/img/icons/orange.png": 10724,
		"assets/img/icons/pbj.png": 12384,
		"assets/img/icons/pizza.png": 13765,
		"assets/img/icons/printer.png": 413,
		"assets/img/icons/purple.png": 10784,
		"assets/img/icons/racing.png": 11491,
		"assets/img/icons/red.png": 10653,
		"assets/img/icons/send-btn.png": 9921,
		"assets/img/icons/soccer.png": 15189,
		"assets/img/icons/swim_dive.png": 11428,
		"assets/img/icons/the_team.png": 17096,
		"assets/img/icons/volume.png": 163,
		"assets/img/icons/windlifter.png": 16822,
		"assets/img/icons/yellow.png": 10672,
		"assets/img/in-theaters.png": 2967,
		"assets/img/in-theatres3d.png": 5190,
		"assets/img/intro-btm.png": 190813,
		"assets/img/intro-top.png": 189216,
		"assets/img/logo.png": 129128,
		"assets/img/midground.png": 64689,
		"assets/img/pg.png": 1552,
		"assets/img/preloader_logo.png": 130389,
		"assets/img/print.png": 2751,
		"assets/img/response_bg_blade.jpg": 190285,
		"assets/img/response_bg_cabbie.jpg": 270838,
		"assets/img/response_bg_dipper.jpg": 443919,
		"assets/img/response_bg_dusty.jpg": 197642,
		"assets/img/response_bg_team.jpg": 426999,
		"assets/img/response_bg_windlifter.jpg": 221949,
		"assets/img/response_letter_bg.jpg": 75713,
		"assets/img/sendMore.png": 12331,
		"assets/img/site_bg.jpg": 184052,
		"assets/introVideo/PLANES2_760x428_2_00000.png": 147,
		"assets/introVideo/PLANES2_760x428_2_00001.png": 147,
		"assets/introVideo/PLANES2_760x428_2_00002.png": 147,
		"assets/introVideo/PLANES2_760x428_2_00003.png": 544,
		"assets/introVideo/PLANES2_760x428_2_00004.png": 998,
		"assets/introVideo/PLANES2_760x428_2_00005.png": 1390,
		"assets/introVideo/PLANES2_760x428_2_00006.png": 903,
		"assets/introVideo/PLANES2_760x428_2_00007.png": 1153,
		"assets/introVideo/PLANES2_760x428_2_00008.png": 1413,
		"assets/introVideo/PLANES2_760x428_2_00009.png": 1561,
		"assets/introVideo/PLANES2_760x428_2_00010.png": 1639,
		"assets/introVideo/PLANES2_760x428_2_00011.png": 1877,
		"assets/introVideo/PLANES2_760x428_2_00012.png": 1951,
		"assets/introVideo/PLANES2_760x428_2_00013.png": 2046,
		"assets/introVideo/PLANES2_760x428_2_00014.png": 2073,
		"assets/introVideo/PLANES2_760x428_2_00015.png": 2088,
		"assets/introVideo/PLANES2_760x428_2_00016.png": 2258,
		"assets/introVideo/PLANES2_760x428_2_00017.png": 2446,
		"assets/introVideo/PLANES2_760x428_2_00018.png": 2534,
		"assets/introVideo/PLANES2_760x428_2_00019.png": 2746,
		"assets/introVideo/PLANES2_760x428_2_00020.png": 2894,
		"assets/introVideo/PLANES2_760x428_2_00021.png": 3047,
		"assets/introVideo/PLANES2_760x428_2_00022.png": 3160,
		"assets/introVideo/PLANES2_760x428_2_00023.png": 3325,
		"assets/introVideo/PLANES2_760x428_2_00024.png": 3488,
		"assets/introVideo/PLANES2_760x428_2_00025.png": 3629,
		"assets/introVideo/PLANES2_760x428_2_00026.png": 3763,
		"assets/introVideo/PLANES2_760x428_2_00027.png": 3840,
		"assets/introVideo/PLANES2_760x428_2_00028.png": 3940,
		"assets/introVideo/PLANES2_760x428_2_00029.png": 4028,
		"assets/introVideo/PLANES2_760x428_2_00030.png": 4079,
		"assets/introVideo/PLANES2_760x428_2_00031.png": 4084,
		"assets/introVideo/PLANES2_760x428_2_00032.png": 4114,
		"assets/introVideo/PLANES2_760x428_2_00033.png": 4176,
		"assets/introVideo/PLANES2_760x428_2_00034.png": 4209,
		"assets/introVideo/PLANES2_760x428_2_00035.png": 4107,
		"assets/introVideo/PLANES2_760x428_2_00036.png": 4159,
		"assets/introVideo/PLANES2_760x428_2_00037.png": 4230,
		"assets/introVideo/PLANES2_760x428_2_00038.png": 4294,
		"assets/introVideo/PLANES2_760x428_2_00039.png": 4367,
		"assets/introVideo/PLANES2_760x428_2_00040.png": 4443,
		"assets/introVideo/PLANES2_760x428_2_00041.png": 4523,
		"assets/introVideo/PLANES2_760x428_2_00042.png": 4543,
		"assets/introVideo/PLANES2_760x428_2_00043.png": 4594,
		"assets/introVideo/PLANES2_760x428_2_00044.png": 4667,
		"assets/introVideo/PLANES2_760x428_2_00045.png": 4717,
		"assets/introVideo/PLANES2_760x428_2_00046.png": 4776,
		"assets/introVideo/PLANES2_760x428_2_00047.png": 4870,
		"assets/introVideo/PLANES2_760x428_2_00048.png": 4943,
		"assets/introVideo/PLANES2_760x428_2_00049.png": 4971,
		"assets/introVideo/PLANES2_760x428_2_00050.png": 5097,
		"assets/introVideo/PLANES2_760x428_2_00051.png": 5125,
		"assets/introVideo/PLANES2_760x428_2_00052.png": 5211,
		"assets/introVideo/PLANES2_760x428_2_00053.png": 5300,
		"assets/introVideo/PLANES2_760x428_2_00054.png": 8143,
		"assets/introVideo/PLANES2_760x428_2_00055.png": 14543,
		"assets/introVideo/PLANES2_760x428_2_00056.png": 21306,
		"assets/introVideo/PLANES2_760x428_2_00057.png": 31053,
		"assets/introVideo/PLANES2_760x428_2_00058.png": 36720,
		"assets/introVideo/PLANES2_760x428_2_00059.png": 41749,
		"assets/introVideo/PLANES2_760x428_2_00060.png": 43078,
		"assets/introVideo/PLANES2_760x428_2_00061.png": 38118,
		"assets/introVideo/PLANES2_760x428_2_00062.png": 31257,
		"assets/introVideo/PLANES2_760x428_2_00063.png": 33863,
		"assets/introVideo/PLANES2_760x428_2_00064.png": 32328,
		"assets/introVideo/PLANES2_760x428_2_00065.png": 31582,
		"assets/introVideo/PLANES2_760x428_2_00066.png": 31547,
		"assets/introVideo/PLANES2_760x428_2_00067.png": 31722,
		"assets/introVideo/PLANES2_760x428_2_00068.png": 31733,
		"assets/introVideo/PLANES2_760x428_2_00069.png": 31778,
		"assets/introVideo/PLANES2_760x428_2_00070.png": 31399,
		"assets/introVideo/PLANES2_760x428_2_00071.png": 31325,
		"assets/introVideo/PLANES2_760x428_2_00072.png": 31417,
		"assets/introVideo/PLANES2_760x428_2_00073.png": 31586,
		"assets/introVideo/PLANES2_760x428_2_00074.png": 31367,
		"assets/introVideo/PLANES2_760x428_2_00075.png": 31551,
		"assets/introVideo/PLANES2_760x428_2_00076.png": 31663,
		"assets/introVideo/PLANES2_760x428_2_00077.png": 31606,
		"assets/introVideo/PLANES2_760x428_2_00078.png": 27373,
		"assets/introVideo/PLANES2_760x428_2_00079.png": 38131,
		"assets/introVideo/PLANES2_760x428_2_00080.png": 49513,
		"assets/introVideo/PLANES2_760x428_2_00081.png": 55558,
		"assets/introVideo/PLANES2_760x428_2_00082.png": 55425,
		"assets/introVideo/PLANES2_760x428_2_00083.png": 63446,
		"assets/introVideo/PLANES2_760x428_2_00084.png": 55806,
		"assets/introVideo/PLANES2_760x428_2_00085.png": 32101,
		"assets/introVideo/PLANES2_760x428_2_00086.png": 35110,
		"assets/introVideo/PLANES2_760x428_2_00087.png": 24472,
		"assets/introVideo/PLANES2_760x428_2_00088.png": 24735,
		"assets/introVideo/PLANES2_760x428_2_00089.png": 27232,
		"assets/introVideo/PLANES2_760x428_2_00090.png": 31909,
		"assets/introVideo/PLANES2_760x428_2_00091.png": 37887,
		"assets/introVideo/PLANES2_760x428_2_00092.png": 41589,
		"assets/introVideo/PLANES2_760x428_2_00093.png": 44954,
		"assets/introVideo/PLANES2_760x428_2_00094.png": 46878,
		"assets/introVideo/PLANES2_760x428_2_00095.png": 35978,
		"assets/introVideo/PLANES2_760x428_2_00096.png": 28364,
		"assets/introVideo/PLANES2_760x428_2_00097.png": 24931,
		"assets/introVideo/PLANES2_760x428_2_00098.png": 23092,
		"assets/introVideo/PLANES2_760x428_2_00099.png": 20337,
		"assets/introVideo/PLANES2_760x428_2_00100.png": 20965,
		"assets/introVideo/PLANES2_760x428_2_00101.png": 16840,
		"assets/introVideo/PLANES2_760x428_2_00102.png": 18312,
		"assets/introVideo/PLANES2_760x428_2_00103.png": 19676,
		"assets/introVideo/PLANES2_760x428_2_00104.png": 22288,
		"assets/introVideo/PLANES2_760x428_2_00105.png": 24766,
		"assets/introVideo/PLANES2_760x428_2_00106.png": 25318,
		"assets/introVideo/PLANES2_760x428_2_00107.png": 26875,
		"assets/introVideo/PLANES2_760x428_2_00108.png": 26148,
		"assets/introVideo/PLANES2_760x428_2_00109.png": 29306,
		"assets/introVideo/PLANES2_760x428_2_00110.png": 33877,
		"assets/introVideo/PLANES2_760x428_2_00111.png": 36917,
		"assets/introVideo/PLANES2_760x428_2_00112.png": 40927,
		"assets/introVideo/PLANES2_760x428_2_00113.png": 44402,
		"assets/introVideo/PLANES2_760x428_2_00114.png": 46123,
		"assets/introVideo/PLANES2_760x428_2_00115.png": 43948,
		"assets/introVideo/PLANES2_760x428_2_00116.png": 47485,
		"assets/introVideo/PLANES2_760x428_2_00117.png": 69134,
		"assets/introVideo/PLANES2_760x428_2_00118.png": 26660,
		"assets/introVideo/PLANES2_760x428_2_00119.png": 30547,
		"assets/introVideo/PLANES2_760x428_2_00120.png": 147,
		"assets/introVideo/PLANES2_760x428_2_00121.png": 147,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00000.png": 23107,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00001.png": 23877,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00002.png": 23388,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00003.png": 23375,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00004.png": 23631,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00005.png": 23416,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00006.png": 23243,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00007.png": 23656,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00008.png": 23530,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00009.png": 23110,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00010.png": 24229,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00011.png": 23099,
		"assets/spritesheets/cabbie/Cabbie_00000.png": 52984,
		"assets/spritesheets/cabbie/Cabbie_00001.png": 55357,
		"assets/spritesheets/cabbie/Cabbie_00002.png": 54417,
		"assets/spritesheets/cabbie/Cabbie_00003.png": 55559,
		"assets/spritesheets/cabbie/Cabbie_00004.png": 52984,
		"assets/spritesheets/cabbie/Cabbie_00005.png": 55357,
		"assets/spritesheets/cabbie/Cabbie_00006.png": 54417,
		"assets/spritesheets/cabbie/Cabbie_00007.png": 55559,
		"assets/spritesheets/cabbie/Cabbie_00008.png": 52984,
		"assets/spritesheets/cabbie/Cabbie_00009.png": 55357,
		"assets/spritesheets/cabbie/Cabbie_00010.png": 54417,
		"assets/spritesheets/cabbie/Cabbie_00011.png": 55559,
		"assets/spritesheets/cabbie2/Cabbie_2_000000.png": 29403,
		"assets/spritesheets/cabbie2/Cabbie_2_000001.png": 30133,
		"assets/spritesheets/cabbie2/Cabbie_2_000002.png": 30091,
		"assets/spritesheets/cabbie2/Cabbie_2_000003.png": 30363,
		"assets/spritesheets/cabbie2/Cabbie_2_000004.png": 29403,
		"assets/spritesheets/cabbie2/Cabbie_2_000005.png": 30133,
		"assets/spritesheets/cabbie2/Cabbie_2_000006.png": 30091,
		"assets/spritesheets/cabbie2/Cabbie_2_000007.png": 30363,
		"assets/spritesheets/cabbie2/Cabbie_2_000008.png": 29403,
		"assets/spritesheets/cabbie2/Cabbie_2_000009.png": 30133,
		"assets/spritesheets/cabbie2/Cabbie_2_000010.png": 30091,
		"assets/spritesheets/cabbie2/Cabbie_2_000011.png": 30363,
		"assets/spritesheets/dipper/Dipper_00000.png": 42861,
		"assets/spritesheets/dipper/Dipper_00001.png": 42102,
		"assets/spritesheets/dipper/Dipper_00002.png": 43889,
		"assets/spritesheets/dipper/Dipper_00003.png": 44858,
		"assets/spritesheets/dipper/Dipper_00004.png": 42861,
		"assets/spritesheets/dipper/Dipper_00005.png": 42102,
		"assets/spritesheets/dipper/Dipper_00006.png": 43889,
		"assets/spritesheets/dipper/Dipper_00007.png": 44858,
		"assets/spritesheets/dipper/Dipper_00008.png": 42861,
		"assets/spritesheets/dipper/Dipper_00009.png": 42102,
		"assets/spritesheets/dipper/Dipper_00010.png": 43889,
		"assets/spritesheets/dipper/Dipper_00011.png": 44858,
		"assets/spritesheets/dusty/Dusty_plane_00000.png": 42205,
		"assets/spritesheets/dusty/Dusty_plane_00001.png": 41887,
		"assets/spritesheets/dusty/Dusty_plane_00002.png": 41844,
		"assets/spritesheets/dusty/Dusty_plane_00003.png": 42084,
		"assets/spritesheets/dusty/Dusty_plane_00004.png": 42205,
		"assets/spritesheets/dusty/Dusty_plane_00005.png": 41887,
		"assets/spritesheets/dusty/Dusty_plane_00006.png": 41844,
		"assets/spritesheets/dusty/Dusty_plane_00007.png": 42084,
		"assets/spritesheets/dusty/Dusty_plane_00008.png": 42205,
		"assets/spritesheets/dusty/Dusty_plane_00009.png": 41887,
		"assets/spritesheets/dusty/Dusty_plane_00010.png": 41844,
		"assets/spritesheets/dusty/Dusty_plane_00011.png": 42084,
		"assets/spritesheets/dusty3/Dusty_plane5_000000.png": 37244,
		"assets/spritesheets/dusty3/Dusty_plane5_000001.png": 37237,
		"assets/spritesheets/dusty3/Dusty_plane5_000002.png": 37508,
		"assets/spritesheets/dusty3/Dusty_plane5_000003.png": 37294,
		"assets/spritesheets/dusty3/Dusty_plane5_000004.png": 37244,
		"assets/spritesheets/dusty3/Dusty_plane5_000005.png": 37237,
		"assets/spritesheets/dusty3/Dusty_plane5_000006.png": 37508,
		"assets/spritesheets/dusty3/Dusty_plane5_000007.png": 37294,
		"assets/spritesheets/dusty3/Dusty_plane5_000008.png": 37244,
		"assets/spritesheets/dusty3/Dusty_plane5_000009.png": 37237,
		"assets/spritesheets/dusty3/Dusty_plane5_000010.png": 37508,
		"assets/spritesheets/dusty3/Dusty_plane5_000011.png": 37294,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00000.png": 37742,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00001.png": 38183,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00002.png": 38257,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00003.png": 38138,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00004.png": 37877,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00005.png": 37690,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00006.png": 37651,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00007.png": 37571,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00008.png": 38136,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00009.png": 37555,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00010.png": 38029,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00011.png": 37864,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00012.png": 37635,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00013.png": 37536,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00014.png": 38870,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00015.png": 37750,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00016.png": 38578,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00017.png": 38044,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00018.png": 38457,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00019.png": 38578,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00020.png": 38226,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00021.png": 38117,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00022.png": 37594,
		"assets/spritesheets/dusty4/Dusty_angle1_noBlink_00023.png": 38267,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000000.png": 44863,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000001.png": 57748,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000002.png": 61309,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000003.png": 66150,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000004.png": 71220,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000005.png": 80209,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000006.png": 89628,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000007.png": 141270,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000008.png": 142272,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000009.png": 151184,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000010.png": 155663,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000011.png": 143911,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000012.png": 152923,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000013.png": 153803,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000014.png": 156388,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000015.png": 161131,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000016.png": 163013,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000017.png": 168408,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000018.png": 171911,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000019.png": 176562,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000020.png": 176295,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000021.png": 177574,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000022.png": 178892,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000023.png": 178828,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000024.png": 181333,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000025.png": 182502,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000026.png": 183696,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000027.png": 183900,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000028.png": 184202,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000029.png": 184966,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000030.png": 186517,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000031.png": 187589,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000032.png": 187509,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000033.png": 188604,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000034.png": 188671,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000035.png": 189333,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000036.png": 189996,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000037.png": 190633,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000038.png": 190641,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000039.png": 191665,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000040.png": 192978,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000041.png": 195457,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000042.png": 198068,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000043.png": 200478,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000044.png": 202250,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000045.png": 201778,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000046.png": 202928,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000047.png": 202853,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000048.png": 197876,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000049.png": 196513,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000050.png": 195361,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000051.png": 195956,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000052.png": 192320,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000053.png": 190679,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000054.png": 182292,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000055.png": 173949,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000056.png": 173379,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000057.png": 167080,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000058.png": 159508,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000059.png": 154649,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000060.png": 149554,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000061.png": 144791,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000062.png": 145619,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000063.png": 147450,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000064.png": 139375,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000065.png": 129016,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000066.png": 122665,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000067.png": 115999,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000068.png": 104335,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000069.png": 90041,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000070.png": 67744,
		"assets/spritesheets/logo/PLANE_logo_tall_480x260_000071.png": 49910,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00000.png": 38168,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00001.png": 38373,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00002.png": 39121,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00003.png": 38658,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00004.png": 37967,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00005.png": 38120,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00006.png": 38238,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00007.png": 38184,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00008.png": 38402,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00009.png": 38168,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00010.png": 38307,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00011.png": 38533,
		"assets/wipescreen/Blade_wpscrn_86400.png": 201,
		"assets/wipescreen/Blade_wpscrn_86401.png": 215,
		"assets/wipescreen/Blade_wpscrn_86402.png": 231,
		"assets/wipescreen/Blade_wpscrn_86403.png": 250,
		"assets/wipescreen/Blade_wpscrn_86404.png": 378,
		"assets/wipescreen/Blade_wpscrn_86405.png": 417,
		"assets/wipescreen/Blade_wpscrn_86406.png": 468,
		"assets/wipescreen/Blade_wpscrn_86407.png": 554,
		"assets/wipescreen/Blade_wpscrn_86408.png": 652,
		"assets/wipescreen/Blade_wpscrn_86409.png": 1006,
		"assets/wipescreen/Blade_wpscrn_86410.png": 1860,
		"assets/wipescreen/Blade_wpscrn_86411.png": 2433,
		"assets/wipescreen/Blade_wpscrn_86412.png": 3414,
		"assets/wipescreen/Blade_wpscrn_86413.png": 4599,
		"assets/wipescreen/Blade_wpscrn_86414.png": 6088,
		"assets/wipescreen/Blade_wpscrn_86415.png": 7087,
		"assets/wipescreen/Blade_wpscrn_86416.png": 7985,
		"assets/wipescreen/Blade_wpscrn_86417.png": 8299,
		"assets/wipescreen/Blade_wpscrn_86418.png": 9740,
		"assets/wipescreen/Blade_wpscrn_86419.png": 9951,
		"assets/wipescreen/Blade_wpscrn_86420.png": 8802,
		"assets/wipescreen/Blade_wpscrn_86421.png": 9505,
		"assets/wipescreen/Blade_wpscrn_86422.png": 9563,
		"assets/wipescreen/Blade_wpscrn_86423.png": 9605,
		"assets/wipescreen/Blade_wpscrn_86424.png": 9725,
		"assets/wipescreen/Blade_wpscrn_86425.png": 9806,
		"assets/wipescreen/Blade_wpscrn_86426.png": 9447,
		"assets/wipescreen/Blade_wpscrn_86427.png": 9430,
		"assets/wipescreen/Blade_wpscrn_86428.png": 9541,
		"assets/wipescreen/Blade_wpscrn_86429.png": 8761,
		"assets/wipescreen/Blade_wpscrn_86430.png": 8956,
		"assets/wipescreen/Blade_wpscrn_86431.png": 8584,
		"assets/wipescreen/Blade_wpscrn_86432.png": 8334,
		"assets/wipescreen/Blade_wpscrn_86433.png": 8112,
		"assets/wipescreen/Blade_wpscrn_86434.png": 7973,
		"assets/wipescreen/Blade_wpscrn_86435.png": 7768,
		"assets/wipescreen/Blade_wpscrn_86436.png": 7439,
		"assets/wipescreen/Blade_wpscrn_86437.png": 7285,
		"assets/wipescreen/Blade_wpscrn_86438.png": 7250,
		"assets/wipescreen/Blade_wpscrn_86439.png": 53419,
		"assets/wipescreen/Blade_wpscrn_86440.png": 6957,
		"assets/wipescreen/Blade_wpscrn_86441.png": 6662,
		"assets/wipescreen/Blade_wpscrn_86442.png": 6792,
		"assets/wipescreen/Blade_wpscrn_86443.png": 6525,
		"assets/wipescreen/Blade_wpscrn_86444.png": 6444,
		"assets/wipescreen/Blade_wpscrn_86445.png": 6307,
		"assets/wipescreen/Blade_wpscrn_86446.png": 6497,
		"assets/wipescreen/Blade_wpscrn_86447.png": 6318,
		"assets/wipescreen/Blade_wpscrn_86448.png": 6446,
		"assets/wipescreen/Blade_wpscrn_86449.png": 6745,
		"assets/wipescreen/Blade_wpscrn_86450.png": 6751,
		"assets/wipescreen/Blade_wpscrn_86451.png": 6802,
		"assets/wipescreen/Blade_wpscrn_86452.png": 6540,
		"assets/wipescreen/Blade_wpscrn_86453.png": 6597,
		"assets/wipescreen/Blade_wpscrn_86454.png": 6865,
		"assets/wipescreen/Blade_wpscrn_86455.png": 7119,
		"assets/wipescreen/Blade_wpscrn_86456.png": 7389,
		"assets/wipescreen/Blade_wpscrn_86457.png": 7558,
		"assets/wipescreen/Blade_wpscrn_86458.png": 7676,
		"assets/wipescreen/Blade_wpscrn_86459.png": 7989,
		"assets/wipescreen/Blade_wpscrn_86460.png": 7930,
		"assets/wipescreen/Blade_wpscrn_86461.png": 8444,
		"assets/wipescreen/Blade_wpscrn_86462.png": 8452,
		"assets/wipescreen/Blade_wpscrn_86463.png": 8707,
		"assets/wipescreen/Blade_wpscrn_86464.png": 9187,
		"assets/wipescreen/Blade_wpscrn_86465.png": 8925,
		"assets/wipescreen/Blade_wpscrn_86466.png": 64898,
		"assets/wipescreen/Blade_wpscrn_86467.png": 9551,
		"assets/wipescreen/Blade_wpscrn_86468.png": 10072,
		"assets/wipescreen/Blade_wpscrn_86469.png": 10782,
		"assets/wipescreen/Blade_wpscrn_86470.png": 10585,
		"assets/wipescreen/Blade_wpscrn_86471.png": 10952,
		"assets/wipescreen/Blade_wpscrn_86472.png": 11172,
		"assets/wipescreen/Blade_wpscrn_86473.png": 11106,
		"assets/wipescreen/Blade_wpscrn_86474.png": 11555,
		"assets/wipescreen/Blade_wpscrn_86475.png": 12083,
		"assets/wipescreen/Blade_wpscrn_86476.png": 12038,
		"assets/wipescreen/Blade_wpscrn_86477.png": 12378,
		"assets/wipescreen/Blade_wpscrn_86478.png": 12908,
		"assets/wipescreen/Blade_wpscrn_86479.png": 13302,
		"assets/wipescreen/Blade_wpscrn_86480.png": 13315,
		"assets/wipescreen/Blade_wpscrn_86481.png": 13731,
		"assets/wipescreen/Blade_wpscrn_86482.png": 14094,
		"assets/wipescreen/Blade_wpscrn_86483.png": 14194,
		"assets/wipescreen/Blade_wpscrn_86484.png": 14701,
		"assets/wipescreen/Blade_wpscrn_86485.png": 15129,
		"assets/wipescreen/Blade_wpscrn_86486.png": 14921,
		"assets/wipescreen/Blade_wpscrn_86487.png": 15735,
		"assets/wipescreen/Blade_wpscrn_86488.png": 16272,
		"assets/wipescreen/Blade_wpscrn_86489.png": 16274,
		"assets/wipescreen/Blade_wpscrn_86490.png": 16795,
		"assets/wipescreen/Blade_wpscrn_86491.png": 17408,
		"assets/wipescreen/Blade_wpscrn_86492.png": 17013,
		"assets/wipescreen/Blade_wpscrn_86493.png": 17979,
		"assets/wipescreen/Blade_wpscrn_86494.png": 18472,
		"assets/wipescreen/Blade_wpscrn_86495.png": 18965,
		"assets/wipescreen/Blade_wpscrn_86496.png": 19403,
		"assets/wipescreen/Blade_wpscrn_86497.png": 20007,
		"assets/wipescreen/Blade_wpscrn_86498.png": 19739,
		"assets/wipescreen/Blade_wpscrn_86499.png": 20416,
		"assets/wipescreen/Blade_wpscrn_86500.png": 21481,
		"assets/wipescreen/Blade_wpscrn_86501.png": 22984,
		"assets/wipescreen/Blade_wpscrn_86502.png": 23037,
		"assets/wipescreen/Blade_wpscrn_86503.png": 23716,
		"assets/wipescreen/Blade_wpscrn_86504.png": 25045,
		"assets/wipescreen/Blade_wpscrn_86505.png": 25387,
		"assets/wipescreen/Blade_wpscrn_86506.png": 27141,
		"assets/wipescreen/Blade_wpscrn_86507.png": 27514,
		"assets/wipescreen/Blade_wpscrn_86508.png": 29231,
		"assets/wipescreen/Blade_wpscrn_86509.png": 28856,
		"assets/wipescreen/Blade_wpscrn_86510.png": 30107,
		"assets/wipescreen/Blade_wpscrn_86511.png": 30028,
		"assets/wipescreen/Blade_wpscrn_86512.png": 31126,
		"assets/wipescreen/Blade_wpscrn_86513.png": 33086,
		"assets/wipescreen/Blade_wpscrn_86514.png": 33528,
		"assets/wipescreen/Blade_wpscrn_86515.png": 35772,
		"assets/wipescreen/Blade_wpscrn_86516.png": 38216,
		"assets/wipescreen/Blade_wpscrn_86517.png": 39283,
		"assets/wipescreen/Blade_wpscrn_86518.png": 41045,
		"assets/wipescreen/Blade_wpscrn_86519.png": 42462,
		"assets/wipescreen/Blade_wpscrn_86520.png": 44357,
		"assets/wipescreen/Blade_wpscrn_86521.png": 44277,
		"assets/wipescreen/Blade_wpscrn_86522.png": 46880,
		"assets/wipescreen/Blade_wpscrn_86523.png": 51633,
		"assets/wipescreen/Blade_wpscrn_86524.png": 53920,
		"assets/wipescreen/Blade_wpscrn_86525.png": 57262,
		"assets/wipescreen/Blade_wpscrn_86526.png": 59485,
		"assets/wipescreen/Blade_wpscrn_86527.png": 60836,
		"assets/wipescreen/Blade_wpscrn_86528.png": 62752,
		"assets/wipescreen/Blade_wpscrn_86529.png": 68154,
		"assets/wipescreen/Blade_wpscrn_86530.png": 71826,
		"assets/wipescreen/Blade_wpscrn_86531.png": 74571,
		"assets/wipescreen/Blade_wpscrn_86532.png": 82726,
		"assets/wipescreen/Blade_wpscrn_86533.png": 87171,
		"assets/wipescreen/Blade_wpscrn_86534.png": 92673,
		"assets/wipescreen/Blade_wpscrn_86535.png": 99316,
		"assets/wipescreen/Blade_wpscrn_86536.png": 108424,
		"assets/wipescreen/Blade_wpscrn_86537.png": 113392,
		"assets/wipescreen/Blade_wpscrn_86538.png": 117094,
		"assets/wipescreen/Blade_wpscrn_86539.png": 128159,
		"assets/wipescreen/Blade_wpscrn_86540.png": 134071,
		"assets/wipescreen/Blade_wpscrn_86541.png": 144900,
		"assets/wipescreen/Blade_wpscrn_86542.png": 154831,
		"assets/wipescreen/Blade_wpscrn_86543.png": 162406,
		"assets/wipescreen/Blade_wpscrn_86544.png": 157747,
		"assets/wipescreen/Blade_wpscrn_86545.png": 166538,
		"assets/wipescreen/Blade_wpscrn_86546.png": 157864,
		"assets/wipescreen/Blade_wpscrn_86547.png": 154220,
		"assets/wipescreen/Blade_wpscrn_86548.png": 155863,
		"assets/wipescreen/Blade_wpscrn_86549.png": 144400,
		"assets/wipescreen/Blade_wpscrn_86550.png": 138269,
		"assets/wipescreen/Blade_wpscrn_86551.png": 133615,
		"assets/wipescreen/Blade_wpscrn_86552.png": 122833,
		"assets/wipescreen/Blade_wpscrn_86553.png": 117078,
		"assets/wipescreen/Blade_wpscrn_86554.png": 120303,
		"assets/wipescreen/Blade_wpscrn_86555.png": 106093
	}
}
},{}],13:[function(require,module,exports){
module.exports={
    "manifest": [
        {
            "id": "Blade",
            "src": "assets/audio/blade.ogg"
        },
        {
            "id": "Cabbie",
            "src": "assets/audio/cabbie.ogg"
        },
        {
            "id": "Dipper",
            "src": "assets/audio/dipper.ogg"
        },
        {
            "id": "Dusty",
            "src": "assets/audio/dusty.ogg"
        },
        {
            "id": "Team",
            "src": "assets/audio/team.ogg"
        },
        {
            "id": "Windlifter",
            "src": "assets/audio/windlifter.ogg"
        },
        {
            "id": "IntroVideo",
            "src": "assets/audio/comingatyou.ogg"
        },
        {
            "id": "Wipescreen",
            "src": "assets/audio/wipescreen.ogg"
        }

    ],
    "characterAudioIds": {
        "dusty": "Dusty",
        "bladeranger": "Blade",
        "cabbie": "Cabbie",
        "dipper": "Dipper",
        "windlifter": "Windlifter",
        "team": "Team"
    }
}
},{}],14:[function(require,module,exports){
module.exports={
    "class": "canned",
    "copy": "Now that we know more about you, it's your turn to ask %character% some questions",
    "options": [
        {
            "text": "What is your job at Piston Peak?",
            "value": "job"
        },
        {
            "text": "How do you fight forest fires?",
            "value": "forestfires"
        },
        {
            "text": "Have you always been a firefighter?",
            "value": "firefighter"
        },
        {
            "text": "Who is your best friend?",
            "value": "bestfriend"
        },
        {
            "text": "Where is your favorite place to fly?",
            "value": "favoriteplace"
        },
        {
            "text": "What is your favorite food?",
            "value": "favorite-food"
        },
        {
            "text": "What is your favorite color?",
            "value": "favorite-color"
        },
        {
            "text": "What is your favorite sport?",
            "value": "favorite-sport"
        }
    ]
}
},{}],15:[function(require,module,exports){
module.exports={
    "name": "character-select",
    "class": "character-select",
    "copy": "Who do you want to write to?",
    "options": [
        {
            "text": "Dusty",
            "value": "dusty"
        },
        {
            "text": "Blade Ranger",
            "value": "bladeranger"
        },
        {
            "text": "Cabbie",
            "value": "cabbie"
        },
        {
            "text": "Dipper",
            "value": "dipper"
        },
        {
            "text": "Windlifter",
            "value": "windlifter"
        },
        {
            "text": "The Team",
            "value": "team"
        }
    ],
    "required": true
}
},{}],16:[function(require,module,exports){
module.exports={
    "questions": [
        {
            "name": "favorite-color",
            "class": "favorite-color",
            "copy": "What's your favorite color?",
            "options": [
                {
                    "text": "Red",
                    "value": "red"
                },
                {
                    "text": "Blue",
                    "value": "blue"
                },
                {
                    "text": "Orange",
                    "value": "orange"
                },
                {
                    "text": "Green",
                    "value": "green"
                },
                {
                    "text": "Yellow",
                    "value": "yellow"
                },
                {
                    "text": "Purple",
                    "value": "purple"
                }
            ]
        },
        {
            "name": "favorite-food",
            "class": "favorite-food",
            "copy": "What is your favorite food?",
            "options": [
                {
                    "text": "Pizza",
                    "value": "pizza"
                },
                {
                    "text": "Ice Cream",
                    "value": "icecream"
                },
                {
                    "text": "Broccoli",
                    "value": "broccoli"
                },
                {
                    "text": "French Fries",
                    "value": "frenchfries"
                },
                {
                    "text": "Chicken Nuggets",
                    "value": "chickennuggets"
                },
                {
                    "text": "PB&J",
                    "value": "pbj"
                }
            ]
        },
        {
            "name": "favorite-sport",
            "class": "favorite-sport",
            "copy": "What is your favorite sport?",
            "options": [
                {
                    "text": "Football",
                    "value": "football"
                },
                {
                    "text": "Baseball",
                    "value": "baseball"
                },
                {
                    "text": "Hockey",
                    "value": "hockey"
                },
                {
                    "text": "Swimming/Diving",
                    "value": "swimming"
                },
                {
                    "text": "Soccer",
                    "value": "soccer"
                },
                {
                    "text": "Racing",
                    "value": "racing"
                }
            ]
        }
    ]
}
},{}],17:[function(require,module,exports){
module.exports={
    "dusty" : {
        "greeting": "Hi there!",
        "body1": "I was really excited to receive your airmail!",
        "body2": "I've gotta get back to fighting fires here, but you stay strong!",
        "sincerely": "Over and out",
        "job": "I'm a SEAT, or a Single-Engine Air Tanker, with the Piston Peak Air Attack Team, an elite group of firefighting aircraft.",
        "forestfires": "I can scoop water from lakes and dive into the forest to drop the water on wildfires. Speed counts when an air rescue is under way, so I'm always ready to fly into danger!",
        "firefighter": "Before joining the Air Attack Team, I was a world-famous air racer – I even raced around the world!  Now I race to put out fires.",
        "bestfriend": "It wasn't easy becoming a champion racer or a firefighter but I've had an amazing team of friends with me every step of the way!",
        "favoriteplace": "I have been flying for as long as I can remember but my favorite place to fly is above my hometown, Propwash Junction. I do some fancy flying there!",
        "favorite-food": "%template% sounds delicious! I mean, anything's better to eat than Vitaminamulch.",
        "favorite-food-plural": "%template% sound delicious! I mean, anything's better to eat than Vitaminamulch.",
        "favorite-color": "My favorite color is GREEN. Green means go! And I love to go fast.",
        "favorite-sport": "I was a champion racer not too long ago. Racing is definitely my favorite sport."
    },
    "dipper": {
        "greeting": "Hi there,",
        "body1": "I'm Dipper. That's what everyone calls me. So you can too!",
        "body2": "Thanks for writing to me %template%.",
        "sincerely": "Remember, the sky's the limit!",
        "job": "I have a really important job fighting wildfires. I'm an air tanker with the Piston Peak Attack Team.",
        "forestfires": "I fight forest fires in several ways.  Sometimes I drop retardant to contain a fire.  I can also scoop water from the lake and drop it directly on the fire. My boss Blade Ranger calls me a Mud-Dropper!",
        "firefighter": "I wasn't always a firefighter. I used to haul cargo up in Anchorage. Yep, a lot of guys in Alaska. I was beating them off with a stick!",
        "bestfriend": "My best friend is champion racer Dusty Crophopper. I'm his biggest fan!",
        "favoriteplace": "My favorite place to fly is the Fusel Lodge, right here in Piston Peak. It's so beautiful. And where Dusty and I had our first date! It was a date, right? I'm pretty sure it was a date.",
        "favorite-food": "While %template% sounds really good, there's nothing better than a fresh can of oil!",
        "favorite-food-plural": "While %template% sound really good, there's nothing better than a fresh can of oil!",
        "favorite-color": "What's my favorite color? YELLOW like the sunshine.. and like ME!",
        "favorite-sport": "Swimming/diving is my favorite sport! I love dipping in and out of the water."
    },
    "windlifter": {
        "greeting": "Hello friend!",
        "body1": "I enjoyed reading your letter!",
        "body2": "Thanks for your letter %template%.",
        "sincerely": "Your new friend",
        "job": "I am a Heavy-Lift Helicopter with the Piston Peak Air Attack Team, an elite crew of firefighting aircraft.",
        "forestfires": "Blade calls me a \"Mud Dropper\" because I have a detachable tank loaded with fire retardant to help put out the fires.  Mud is slang for retardant.  I can hold more retardant than anyone else on the team.",
        "firefighter": "I wasn't always a firefighter. I used to be a lumberjack, lifting dozens of heavy logs and carrying them to the lumber mill.  But now I am a firefighter and this keeps me very busy.",
        "bestfriend": "I would like to be YOUR best friend.",
        "favoriteplace": "I like to fly many places and be one with the wind. The wind speaks, and I listen.",
        "favorite-food": "%template% sounds delicious! Have you tried it with a can of oil? That's my favorite food.",
        "favorite-food-plural": "%template% sound delicious! Have you tried them with a can of oil? That's my favorite food.",
        "favorite-color": "My favorite color is BLUE like the water and the sky.",
        "favorite-sport": "I don't play many sports, but I am an avid weight lifter. You'll often see me lifting heavy loads of logs in my off time."
    },
    "bladeranger": {
        "greeting": "Hi Champ!",
        "body1": "I'm Blade Ranger. But you can call me Blade.",
        "body2": "Remember, you can do anything!  You just have to train hard and have courage.  Thanks for your letter %template%.",
        "sincerely": "Your partner",
        "job": "I'm a Fire and Rescue Helicopter, and the Chief in Charge here at Piston Peak.",
        "forestfires": "When there's a fire, I give the orders for the Air Attack Team to spring into action!",
        "firefighter": "I've been the Chief for a long time, but I wasn't always a firefighter.  This is my second career, and my most rewarding.  Now I fly in when others fly out to help those who need it most.",
        "bestfriend": "My best friends are all the trailblazers here at Piston Peak. We like to think of ourselves as the heroes of the sky!",
        "favoriteplace": "I like to fly to many places, but my favorite place is above Piston Peak. I patrol the skies and make sure all the tourists are camping by the book. Remember, safety first!",
        "favorite-food": "You say you like to eat %template%? I prefer a fresh can of oil.",
        "favorite-food-plural": "You say you like to eat %template%? I prefer a fresh can of oil.",
        "favorite-color": "My favorite color is RED, the color of Fire Safety.",
        "favorite-sport": "If I had to choose, football would be my favorite sport."
    },
    "cabbie": {
        "greeting": "Attention %template%!",
        "body1": "Cabbie here.",
        "body2": "Thanks for the message.",
        "sincerely": "Over and out",
        "job": "I'm an ex-military cargo plane with the Piston Peak Attack Team - firefighting is a big responsibility.",
        "forestfires": "I carry the Smokejumpers - who clear fallen trees and debris. During a fire, I drop them from the sky, right over the flames.",
        "firefighter": "I wasn't always a firefighter. I used to drop airborne utility vehicles behind enemy lines during war. Now I drop Smokejumpers at Piston Peak.",
        "bestfriend": "Who's my best friend? That's probably Top Secret but I can say the Smokejumpers are my closest recruits.",
        "favoriteplace": "I've flown over many places in my time. My favorite spot is Anchor Lake - a long body of water with an anchor-shaped island.",
        "favorite-food": "In the military, all food is rationed but I'll take as much fresh oil as I can get! ",
        "favorite-food-plural": "In the military, all food is rationed but I'll take as much fresh oil as I can get! ",
        "favorite-color": "My favorite color is GREEN - it can help me hide above the pine trees.",
        "favorite-sport": "Baseball is my favorite sport. I always have five smokejumpers in my cargo - just enough to cover the bases."
    },
    "team": {
        "greeting": "Hey friend!",
        "body1": "Thanks for writing to us.",
        "body2": "Time to get back to work!",
        "sincerely": "Let's make it count!",
        "job": "The Piston Peak Air Attack Team is an elite group of firefighting aircrafts.",
        "forestfires": "We fly in when others are flyin out. It takes a special kinda plane.",
        "firefighter": "Life doesn't always go the way you expect it. This is a second career for all of us. ",
        "bestfriend": "It takes honor, trust and bravery to earn your wings. We don't have just one best friend because we need every plane we've got to help.",
        "favoriteplace": "Piston Peak has some great places to fly. But our favorite spot is the wooden railway bridge - with the thundering Whitewall Falls behind it.",
        "favorite-food": "%template% sounds great but we'd rather slurp down fresh cans of oil. HOIST!",
        "favorite-food-plural": "%template% sound great but we'd rather slurp down fresh cans of oil. HOIST!",
        "favorite-color": "We like all colors of the rainbow. But as a team, our favorite color is %template%, just like you!",
        "favorite-sport": "It's hard to pick a favorite sport - we're a fan of anything that let us work as a team!"
    }
}
},{}],18:[function(require,module,exports){
var device = {
    isAndroid: function() {
        return navigator.userAgent.match(/Android/i) !== null;
    },
    isAndroidTablet: function() {
        return navigator.userAgent.match(/Android/i) !== null
            && (
            ((window.orientation === 0 || window.orientation === 180 ) && screen.width > 640)
                || ((window.orientation === -90 || window.orientation === 90) && screen.height > 640)
            );
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) !== null;
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null;
    },
    isIpad: function() {
        return navigator.userAgent.match(/iPad/i) !== null;
    },
    isOpera: function() {
        return navigator.userAgent.match(/Opera Mini/i) !== null;
    },
    isWindows: function() {
        return navigator.userAgent.match(/IEMobile/i) !== null;
    },
    isTablet: function() {
        return this.isAndroidTablet() || this.isIpad();
    },
    isMobile: function() {
//        return true;
        return !this.isTablet() && (this.isIOS() || this.isAndroid() || this.isBlackBerry() || this.isOpera() || this.isWindows());
    },
    currentDevice: function() {
        if (this.isMobile())
            return "mobile";
        if (this.isTablet())
            return "tablet";
        return "desktop";
    },
    currentDeviceName: function() {
        switch(true) {
            case this.isAndroid(): {
                return "Android";
            }

            case this.isBlackBerry(): {
                return "BlackBerry";
            }

            case this.isOpera(): {
                return "Opera Mini";
            }

            case this.isWindows(): {
                return "IEMobile";
            }

            case this.isIOS(): {
                if (this.isIpad())
                    return "iPad";
                return "iPhone";
            }
            default: {
                return "Desktop";
            }
        }
    }
};



module.exports = device;
},{}],19:[function(require,module,exports){




// adds our custom modifications to the PIXI library
require('./pixi/libModifications');



var MainView = require('./views/mainView');
var device = require('./device');




// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};





// =================================================================== //
/* ************************* Password Screen ************************* */
// =================================================================== //

var $passwordScreen = $('#passwordScreen');

if(document.URL.indexOf('disney-planes2-airmail-staging.azurewebsites.net') !== -1) {
    $(function() {
        "use strict";

        var password = 'disneyPlanesTwo';

        var $passwordInput = $passwordScreen.find('input[type=password]');

        $passwordScreen.find('form').submit(function(e) {
            e.preventDefault();

            if($passwordInput.val() === password) {
                $passwordScreen.fadeOut(50);
            }
        });
    });

    $passwordScreen.show();
} else {
    $passwordScreen.remove();
}



$(function() {
    app.mainView = new MainView();

    app.mainView.start();
});


module.exports = app;




},{"./device":18,"./pixi/libModifications":25,"./views/mainView":34}],20:[function(require,module,exports){



// =================================================================== //
/* ************************** Audio Loader *************************** */
// =================================================================== //
var audioAssetData = require('./data/audioAssets.json');
var numAudioAssets = audioAssetData.manifest.length;



function startAudioLoader() {
    // if initializeDefaultPlugins returns false, we cannot play sound
    if (!createjs.Sound.initializeDefaultPlugins()) { return; }

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", function() {
        "use strict";

    });
    createjs.Sound.registerManifest(audioAssetData.manifest);

    createjs.Sound.setVolume(0.4);
}


// =================================================================== //
/* ************************* Primary Loader ************************** */
// =================================================================== //
var assetData = require('./data/assets.json');

var fileNames = Object.keys(assetData.assets);
var totalFiles = fileNames.length;

var loader = new PIXI.AssetLoader(fileNames);
var startTime;

function startLoader(view) {

    loader.onProgress = function() {
        var percentageLoaded = (totalFiles - this.loadCount)/totalFiles;
        var timeElapsed = _.now() - startTime;

        view.onAssetProgress(percentageLoaded, timeElapsed);
    };
    loader.onComplete = function() {
        view.onAssetsLoaded();
    };

    startTime = _.now();

    startAudioLoader();
    loader.load();
}









module.exports = {
    start: startLoader
};
},{"./data/assets.json":12,"./data/audioAssets.json":13}],21:[function(require,module,exports){



var Question = Backbone.Model.extend({
    defaults: {
        name: '',
        value: '',
        copy: '',
        options: [],
        required: false
    }
});



module.exports = Question;
},{}],22:[function(require,module,exports){


(function() {
    "use strict";

    var Character = require('../pixi/character');
    var scene;


    // =================================================================== //
    /* *********************** Texture Functions ************************* */
    // =================================================================== //
    function getBladeTextures() {
        return PIXI.getTextures('assets/spritesheets/blade/Guide_BladeRanger_body_970x600_000', 0, 12);
    }
    function getCabbieTextures() {
        return PIXI.getTextures('assets/spritesheets/cabbie/Cabbie_000', 0, 12);
    }
    function getCabbie2Textures() {
        return PIXI.getTextures('assets/spritesheets/cabbie2/Cabbie_2_0000', 0, 12);
    }
    function getDipperTextures() {
        return PIXI.getTextures('assets/spritesheets/dipper/Dipper_000', 0, 12);
    }
    function getDustyTextures() {
        return PIXI.getTextures('assets/spritesheets/dusty/Dusty_plane_000', 0, 12);
    }
    function getDusty3Textures() {
        return PIXI.getTextures('assets/spritesheets/dusty3/Dusty_plane5_0000', 0, 12);
    }
    function getDusty4Textures() {
        return PIXI.getTextures('assets/spritesheets/dusty4/Dusty_angle1_noBlink_000', 0, 24);
    }
    function getWindlifterTextures() {
        return PIXI.getTextures('assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_000', 0, 12);
    }


    // =================================================================== //
    /* ********************* Initialize Functions ************************ */
    // =================================================================== //
    function initCharacter(name, textures, anchor) {
        var idleAnimation = new PIXI.MovieClip(textures);
        idleAnimation.anchor = anchor;

        var char = new Character(name, idleAnimation);

        char.windowX = -1;
        char.windowY = -1;

        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blur = 0;
        char.filters = [blurFilter];

        scene.addChild(char);

        return char;
    }

    var characterInitFunctions = {
        blade: _.once(function() {
            return initCharacter('Blade', getBladeTextures(), {x: 457/970, y: 346/600});
        }),
        cabbie: _.once(function() {
            return initCharacter('Cabbie', getCabbieTextures(), {x: 545/1200, y: 351/622});
        }),
        cabbieTwo: _.once(function() {
            return initCharacter('Cabbie2', getCabbie2Textures(), {x: 408/750, y: 238/380});
        }),
        dipper: _.once(function() {
            return initCharacter('Dipper', getDipperTextures(), {x: 539/1200, y: 435/638});
        }),
        dusty: _.once(function() {
            return initCharacter('Dusty', getDustyTextures(), {x: 480/1200, y: 405/983});
        }),
        dustyDark: _.once(function() {
            return initCharacter('Dusty3', getDusty3Textures(), {x: 335/600, y: 165/360});
        }),
        dustyFour: _.once(function() {
            return initCharacter('Dusty4', getDusty4Textures(), {x: 373/600, y: 154/341});
        }),
        windlifter: _.once(function() {
            return initCharacter('Windlifter', getWindlifterTextures(), {x: 310/600, y: 228/371});
        })
    };
    // =================================================================== //
    /* *********************** Texture Functions ************************* */
    // =================================================================== //



    var allCharacters = {
        initialize: function(pixiScene) {
            scene = pixiScene;
        }
    };


    _.each(characterInitFunctions, function(initFnc, character) {
        Object.defineProperty(allCharacters, character, {
            configurable: false,
            get: function() {
                return initFnc();
            }
        });
    });


    module.exports = allCharacters;
})();








},{"../pixi/character":23}],23:[function(require,module,exports){

(function() {
    "use strict";

    var extend = require('./extend');


    // displayObject should be an instance of PIXI.Sprite or PIXI.MovieClip
    var Character = function(name, movieClip) {
        PIXI.DisplayObjectContainer.call(this); // Parent constructor

        this.name = name;
        this.idle = null;
        this.animating = false;
        this.states = {};
        this.onUpdateCallback = function() {};

        if(!_.isUndefined(movieClip)) {
            this.setIdleState(movieClip);
        }
    };

    Character.prototype = {
        setIdleState: function(pixiSprite) {
            this.idle = pixiSprite;

            if(pixiSprite instanceof PIXI.MovieClip) {
                pixiSprite.visible = true;
                pixiSprite.loop = true;
                pixiSprite.gotoAndPlay(0);  //start clip
            }

            this.addChild(pixiSprite);   //add to display object container
        },

        //add movie clip to play when character changes to state
        addState: function(state, movieClip) {
            movieClip.visible = false;
            this.states[state] = movieClip;
            this.addChild(movieClip);
        },

        // public API function. Waits until current state is finished before switching to next state.
        goToState: function(state) {
            if(_.isUndefined(this.states[state])) {
                throw 'Error: Character ' + this.name + ' does not contain state: ' + state;
            }

            if(this.idle instanceof PIXI.MovieClip) {
                this.idle.onComplete = _.bind(this.swapState, this, state);

                // after current animation finishes go to this state next
                this.idle.loop = false;
            } else {
                swapState(this, state);
                //switch immediately if character idle state is a single sprite
            }
        },

        //add callback to run on character update
        onUpdate: function(callback) {
            this.onUpdateCallback = callback;
        },

        // called on each animation frame by whatever Pixi scene contains this character
        update: function() {
            this.onUpdateCallback();
        },

        destroy: function() {
            if(!_.isUndefined(this.parent)) this.parent.removeChild(this);

            _.each(this.children, function(child) {
                child.destroy();
            });
        },

        setStatic: function() {
            this.idle.gotoAndStop(0);
        },
        setDynamic: function() {
            this.idle.gotoAndPlay(0);
        },
        flip: function() {
            this.scale.x = -(this.scale.x);
        },
        pushToTop: function() {
            if(_.isUndefined(this.parent)) {
                console.log('Error! No parent defined for character:',this.name + '.','It is likely pustToTop() was called after character was added but before PIXI scene was updated.');
                return;
            }

            var length = this.parent.children.length;

            this.parent.addChildAt(this, length-1);
        }

    };


    // changes state immediately
    // NOTE: Function should only be used internally by character.goToState()
    function swapState(char, state) {
        var idleState = char.idle;
        var newState = char.states[state];

        newState.onComplete = function() {  //switch back to idle after run
            if(idleState instanceof PIXI.MovieClip) {
                idleState.loop = true;
                idleState.gotoAndPlay(0);
            }

            newState.visible = false;
            idleState.visible = true;
        };

        idleState.visible = false;

        newState.loop = false;
        newState.visible = true;
        newState.gotoAndPlay(0);
    }



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //

    // extends Display Object Container
    extend(PIXI.DisplayObjectContainer, Character);

    module.exports = Character;
})();
},{"./extend":24}],24:[function(require,module,exports){

function extend(base, sub) {
    // Avoid instantiating the base class just to setup inheritance
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // for a polyfill
    // Also, do a recursive merge of two prototypes, so we don't overwrite
    // the existing prototype, but still maintain the inheritance chain
    // Thanks to @ccnokes
    var origProto = sub.prototype;
    sub.prototype = Object.create(base.prototype);

    for (var key in origProto)  {
        sub.prototype[key] = origProto[key];
    }

    // Remember the constructor property was set wrong, let's fix it
    sub.prototype.constructor = sub;
    // In ECMAScript5+ (all modern browsers), you can make the constructor property
    // non-enumerable if you define it like this instead
    Object.defineProperty(sub.prototype, 'constructor', {
        enumerable: false,
        value: sub
    });
}



module.exports = extend;
},{}],25:[function(require,module,exports){
(function() {
    "use strict";

    /*
     * Custom Edits for the PIXI Library
     */


    // =================================================================== //
    /* ******************* Relative Position Functions ******************* */
    // =================================================================== //

    var $window = $(window);

    PIXI.DisplayObject.prototype._windowX = 0;
    PIXI.DisplayObject.prototype._windowY = 0;


    PIXI.DisplayObject.prototype._setPositionX = function(windowWidth) {
        this.position.x = (windowWidth * this._windowX) + this._bumpX;
    };
    PIXI.DisplayObject.prototype._setPositionY = function(windowHeight) {
        this.position.y = (windowHeight * this._windowY) + this._bumpY;
    };

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

            this._setPositionX($window.width());
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'windowY', {
        get: function() {
            return this._windowY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._windowY = value;

            this._setPositionY($window.height());
        }
    });


    PIXI.DisplayObject.prototype._bumpX = 0;
    PIXI.DisplayObject.prototype._bumpY = 0;

    // bumpX and bumpY are properties on all display objects used for
    // shifting the positioning by flat pixel values. Useful for stuff
    // like hover animations while still moving around a character.
    Object.defineProperty(PIXI.DisplayObject.prototype, 'bumpX', {
        get: function() {
            return this._bumpX;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._bumpX = value;

            this.position.x = ($window.width() * this._windowX) + value;
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'bumpY', {
        get: function() {
            return this._bumpY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._bumpY = value;

            this.position.y = ($window.height() * this._windowY) + value;
        }
    });

    // =================================================================== //
    /* ************************* Scaling Functions *********************** */
    // =================================================================== //


    // windowScale corresponds to window size
    //   ex: windowScale = 0.25 means 1/4 size of window
    // scaleMin and scaleMax correspond to natural sprite size
    //   ex: scaleMin = 0.5 means sprite will not shrink to more than half of its original size.
    PIXI.DisplayObject.prototype._windowScale = -1;
    PIXI.DisplayObject.prototype.scaleMin = 0;
    PIXI.DisplayObject.prototype.scaleMax = Number.MAX_VALUE;

    PIXI.DisplayObject.prototype._scaleType = 'contain';
    PIXI.DisplayObject.prototype._scaleFnc = Math.min;

    // WindowScale: value between 0 & 1, or -1
    // This defines what % of the window (height or width, whichever is smaller)
    // the object will be sized. Example: a windowScale of 0.5 will size the displayObject
    // to half the size of the window.
    Object.defineProperty(PIXI.DisplayObject.prototype, 'windowScale', {
        get: function() {
            return this._windowScale;
        },
        set: function(value) {
            this._windowScale = value;

            this._setScale($window.width(), $window.height());
        }
    });

    // Two possible values: contain or cover. Used with windowScale to decide whether to take the
    // smaller bound (contain) or the larger bound (cover) when deciding content size relative to screen.
    Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleType', {
        get: function() {
            return this._scaleType;
        },
        set: function(value) {
            this._scaleType = value;

            this._scaleFnc = (value === 'contain') ? Math.min : Math.max;
        }
    });



    PIXI.DisplayObject.prototype._setScale = function(windowWidth, windowHeight) {
        var localBounds = this.getLocalBounds();

        var scale = this._windowScale * this._scaleFnc(windowHeight/localBounds.height, windowWidth/localBounds.width);

        //keep scale within our defined bounds
        scale = Math.max(this.scaleMin, Math.min(scale, this.scaleMax));


        this.scale.x = scale * this._animationScaleX;
        this.scale.y = scale * this._animationScaleY;
    };


    // USE ONLY IF WINDOWSCALE IS ALSO SET
    PIXI.DisplayObject.prototype._animationScaleX = 1;
    PIXI.DisplayObject.prototype._animationScaleY = 1;
    Object.defineProperty(PIXI.DisplayObject.prototype, 'animationScaleX', {
        get: function() {
            return this._animationScaleX;
        },
        set: function(value) {
            this._animationScaleX = value;

            this._setScale($window.width(), $window.height());
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'animationScaleY', {
        get: function() {
            return this._animationScaleY;
        },
        set: function(value) {
            this._animationScaleY = value;

            this._setScale($window.width(), $window.height());
        }
    });



    // =================================================================== //
    /* ********************* Window Resize Functions ********************* */
    // =================================================================== //

    // This function should be called for each display object on window resize,
    // adjusting the pixel position to mirror the relative positions windowX and windowY
    // and adjusting scale if it's set
    PIXI.DisplayObject.prototype._onWindowResize = function(width, height) {
        this._setPositionX(width);
        this._setPositionY(height);

        if(this._windowScale !== -1) {
            this._setScale(width, height);
        }

        _.each(this.children, function(displayObject) {
            displayObject._onWindowResize(width, height);
        });
    };



    // =================================================================== //
    /* ******************* Spritesheet Texture Functions ****************** */
    // =================================================================== //

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
    };


    // =================================================================== //
    /* ************************** Memory Cleanup ************************* */
    // =================================================================== //
    PIXI.Sprite.prototype.destroy = function(destroyBaseTexture) {
        if(_.isUndefined(destroyBaseTexture)) destroyBaseTexture = true;

        if(!_.isUndefined(this.parent)) this.parent.removeChild(this);

        this.texture.destroy(destroyBaseTexture);
    };

    PIXI.MovieClip.prototype.destroy = function(destroyBaseTexture) {
        if(_.isUndefined(destroyBaseTexture)) destroyBaseTexture = true;

        if(!_.isUndefined(this.parent)) this.parent.removeChild(this);

        _.each(this.textures, function(texture) {
            texture.destroy(destroyBaseTexture);
        });
    };






})();
},{}],26:[function(require,module,exports){

(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');

    var allCharacters = require('./allCharacters');

    var backgroundModule = require('../animations/background');
    var bladewipeModule = require('../animations/bladewipe');
    var dustyDipperModule = require('../animations/dustyDipper');
    var parachutersModule = require('../animations/parachuters');
    var characterModule = require('../animations/characterModule');
    var responseModule = require('../animations/responseModule');


    // ============================================================ //
    /* *************** Primary Pixi Animation Class *************** */
    // ============================================================ //

    var MainScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        allCharacters.initialize(this);


        backgroundModule.initialize();
        backgroundModule.addBackgroundToScene(this);
        parachutersModule.initialize(this);
        backgroundModule.addRestToScene(this);

        bladewipeModule.initialize(this);
        characterModule.initialize(this);
        dustyDipperModule.initialize(this);
        responseModule.initialize(this);
    };

    // ============================================================ //
    /* ****************** Public API Functions ******************** */
    // ============================================================ //

    MainScene.prototype = {
        playWipescreen: function() {
            bladewipeModule.playVideo();
        },
        onWipescreenComplete:function(callback) {
            bladewipeModule.onVideoComplete(callback);
        },
        onUserCharacterOut: function(callback) {
            characterModule.onAnimationOutComplete(callback);
        },
        hideVideo: function() {
            bladewipeModule.hideVideo();
        },
        startEnterNameAnimation: function() {
            dustyDipperModule.animateIn();

            var startTime = 2000;
            setTimeout(parachutersModule.animateNext, startTime);
            setTimeout(parachutersModule.animateNext, startTime + 6000);
            setTimeout(parachutersModule.animateNext, startTime + 15000);
        },
        showResponse: function() {
            parachutersModule.hide();
            backgroundModule.hide();
        },
        animateInUserCharacter: function() {
            characterModule.animateIn();
        },
        animateOutUserCharacter: function() {
            characterModule.animateOut();
        },

        // ==================================================================== //
        /* *************************** Parallax Stuff ************************* */
        // ==================================================================== //
        shiftBackgroundLayers: function(x) {
            backgroundModule.shiftBackgroundLayers(x);
        },
        setView: function(view) {
            this.view = view;
        },
        _onWindowResize: function(width, height) {
            Scene.prototype._onWindowResize.call(this, width, height);
        }
    };



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, MainScene);


    module.exports = MainScene;
})();
},{"../animations/background":1,"../animations/bladewipe":2,"../animations/characterModule":3,"../animations/dustyDipper":4,"../animations/parachuters":7,"../animations/responseModule":9,"./allCharacters":22,"./extend":24,"./scene":27}],27:[function(require,module,exports){



var extend = require('./extend');


var Scene = function() {
    this.paused = false;
    this.updateCB = function(){};

    PIXI.Stage.apply(this, arguments);
};

Scene.prototype = {
    onUpdate: function(updateCB) {
        this.updateCB = updateCB;
    },
    update: function() {
        this.updateCB();
    },
    pause: function() {
        this.paused = true;
    },
    resume: function() {
        this.paused = false;
    },
    isPaused: function() {
        return this.paused;
    }
};


extend(PIXI.Stage, Scene);






module.exports = Scene;
},{"./extend":24}],28:[function(require,module,exports){

(function() {
    "use strict";


    var Scene = require('./scene');

    var $window = $(window);

    var ScenesManager = {
        scenes: {},
        currentScene: null,
        renderer: null,

        initialize: function (width, height, $parentDiv) {

            if (ScenesManager.renderer) return this;

            ScenesManager.renderer = PIXI.autoDetectRenderer(width, height, null, true, true);

            ScenesManager.renderer.view.setAttribute('id', 'pixi-view');
            $parentDiv.append(ScenesManager.renderer.view);
            requestAnimFrame(ScenesManager.loop);

            return this;
        },
        loop: function () {
            requestAnimFrame(function () { ScenesManager.loop() });

            if (!ScenesManager.currentScene || ScenesManager.currentScene.isPaused()) return;

            ScenesManager.currentScene.update();
            ScenesManager.renderer.render(ScenesManager.currentScene);
        },
        createScene: function(id, SceneConstructor) {
            if (ScenesManager.scenes[id]) return undefined;

            SceneConstructor = SceneConstructor || Scene;   //default to Scene base class

            var scene = new SceneConstructor();
            ScenesManager.scenes[id] = scene;

            return scene;
        },
        goToScene: function(id) {
            if (ScenesManager.scenes[id]) {
                if (ScenesManager.currentScene) ScenesManager.currentScene.pause();

                ScenesManager.currentScene = ScenesManager.scenes[id];

                // Trigger resize to make sure all child objects in the
                // new scene are correctly positioned
                ScenesManager.onWindowResize();

                // Resume new scene
                ScenesManager.currentScene.resume();

                return true;
            }
            return false;
        },
        onWindowResize: function() {
            if(!ScenesManager.currentScene) return;

            var width = $window.width();
            var height = $window.height();

            ScenesManager.currentScene._onWindowResize(width, height);
            ScenesManager.renderer.resize(width, height);
        }
    };




    $window.on('resize', ScenesManager.onWindowResize);





    module.exports = ScenesManager;
})();
},{"./scene":27}],29:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"option\">\n                <div class=\"full-relative\">\n                    <div class=\"empty-space\"></div>\n                    <div class=\"content\">\n                        <input type=\"radio\" name=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" onclick=\"\"/>\n                        <label for=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"full-relative\" onclick=\"\"></label>\n                        <div class=\"background\"></div>\n                        <div class=\"text\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n                        <div class=\"box-shadow\"></div>\n                    </div>\n                </div>\n            </div>\n        ";
  return buffer;
  }

  buffer += "<div class=\"full-relative\">\n    <div class=\"copy\">\n        ";
  if (helper = helpers.copy) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.copy); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    </div>\n\n    <div class=\"options clearfix\">\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":45}],30:[function(require,module,exports){



var itemAnimationsModule = require('../animations/pageItems');

var device = require('../device');
var isMobile = device.isMobile();


var QuestionView = require('./questionView');


var CannedQuestionView = QuestionView.extend({
    getAnimations: function() {
        "use strict";

        return itemAnimationsModule.getRandomCannedAnimations(this.$options);
    },
    isCanned: function() {
        "use strict";

        return true;
    },

    removeOptions: function() {
        "use strict";

        this.$options.remove();
    },
    setOptions: function(options) {
        "use strict";

        this.model.set('options', options);

        //reinitialize
        this.el.innerHTML = this.template(this.model.attributes);

        this.$options = this.$el.find('div.option');

        if(!isMobile)
            this.initAnimations();
    },

    setCharacter: function(character) {
        "use strict";

        var copy = this.model.get('copy').replace('%character%', character);

        this.model.set('copy', copy);
        this.$copy.html(copy);
    }


});





module.exports = CannedQuestionView;
},{"../animations/pageItems":6,"../device":18,"./questionView":35}],31:[function(require,module,exports){


(function() {
    "use strict";
    var device = require('../device');

    var scenesManager = require('../pixi/scenesManager');
    var dustyDipperModule = require('../animations/dustyDipper');


    function getClipboardText(e) {
        if(!_.isUndefined(e.originalEvent)) e = e.originalEvent;

        if (window.clipboardData && window.clipboardData.getData) { // IE
            return window.clipboardData.getData('Text');
        } else {
            return e.clipboardData.getData('text/plain');
        }
    }


    var EnterNameView = Backbone.View.extend({
        el: 'div.name.page',
        events: {
            'change input.name': 'onNameChange',
            'keydown input.name': 'onNameChange',
            'keyup input.name': 'onNameChange',
            'paste input.name': 'onNameChange'
        },
        // ============================================================ //
        /* ********************** Initialization ********************** */
        // ============================================================ //
        initialize: function (options) {
            this.model = new Backbone.Model({value: ''});

            this.$nameInput = this.$el.find('input[type=text].name');
            this.$placeholder = this.$el.find('div.placeholder');
            this.$placeholderInner = this.$placeholder.find('> div');
            this.$title = this.$el.find('div.title');

            this.hideCallback = function(){};

            _.bindAll(this, 'startAnimation','show','hide','setInactive');
        },
        initScene: function() {
            this.scene = scenesManager.scenes.main;
        },

        // ============================================================ //
        /* ***************** Run Animation Functions ****************** */
        // ============================================================ //
        startAnimation: function() {
            this.preAnimationSetup();
            this.initScene();

            this.scene.startEnterNameAnimation();   //animate in characters

            var animationTime = 0.3;

            TweenLite.to(this.$title, animationTime, {opacity: 1, y: 0, ease: 'Back.easeOut'});
            TweenLite.to(this.$nameInput, animationTime, {opacity: 1});
            TweenLite.to(this.$placeholderInner, animationTime, {opacity: 1, y: 0, ease: 'Back.easeOut', delay: 0.15});
        },

        preAnimationSetup: function() {
            TweenLite.set(this.$title, {opacity: 0, y: -75});
            TweenLite.set(this.$nameInput, {opacity: 0});
            TweenLite.set(this.$placeholderInner, {opacity: 0, y: -50});
        },


        // ============================================================ //
        /* ************************ Show/Hide ************************* */
        // ============================================================ //
        show: function () {
            this.$el.addClass('active');

            if(!device.isMobile()) {
                setTimeout(this.startAnimation, 0);
            }
        },
        hide: function () {
            if(!device.isMobile()) {
                dustyDipperModule.onAnimationOutComplete(this.setInactive);

                TweenLite.to(this.$el, 0.3, {opacity: 0});

                //run hide animation
                dustyDipperModule.animateOut();
            } else {
                this.setInactive();
            }
        },
        isCanned: function() {
            return false;
        },
        setInactive: function() {
            this.$el.removeClass('active');

            this.hideCallback();
        },
        onHideComplete: function(callback) {
            this.hideCallback = callback;
        },

        onNameChange: function(e) {
            if(e.which === 32) return false;

            var val = this.$nameInput.val();

            if(e.type === 'paste') {
                var text = getClipboardText(e);

                val += text.split(' ').join('');

                this.$nameInput.val(val);

                this.$placeholder.toggle(val === '');
                this.model.set({value: val});

                return false;
            }

            this.$placeholder.toggle(val === '');
            this.model.set({value: val});
        }
    });





    module.exports = EnterNameView;
})();

},{"../animations/dustyDipper":4,"../device":18,"../pixi/scenesManager":28}],32:[function(require,module,exports){





(function() {
    "use strict";


    var FooterView = Backbone.View.extend({
        el: '#footer',
        events: {
            'click a.volume': 'onVolumeToggle'
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function(options) {
            this.volumeOn = true;
            this.numDots = options.numDots;


            this.initJqueryVariables();
            this.initVolumeAnimationTimelines();
            this.initCounter();
        },

        initJqueryVariables: function() {
            this.$volumeSvgPaths = this.$el.find('a.volume path');
            this.$counter = this.$el.find('div.counter');
            this.$dots = this.$counter.find('> .dot');
        },
        initVolumeAnimationTimelines: function() {
            this.volumeOnAnimation = this.getTimelineVolumeOn();
            this.volumeOffAnimation = this.getTimelineVolumeOff();
        },
        initCounter: function() {
            var numDots = this.numDots;

            var $dot = this.$dots.eq(0);

            for(var i = 2; i <= numDots; i++) {
                var $newDot = $dot.clone();
                $newDot.find('> div.number').html(i);
                $newDot.appendTo(this.$counter);
            }

            this.$dots = this.$counter.find('> .dot');
            this.$activeDot = $dot;
            $dot.addClass('active');
        },


        // ==================================================================== //
        /* ******************* Volume Animation Functions ********************* */
        // ==================================================================== //
        toggleVolume: function() {
            this.volumeOn = !this.volumeOn;

            if(this.volumeOn) {
                this.volumeOnAnimation.play(0);
            } else {
                this.volumeOffAnimation.play(0);
            }

            createjs.Sound.setMute(this.volumeOn);
        },

        getTimelineVolumeOn: function() {
            var timeline = new TimelineMax({
                paused: true
            });

            var options = {startMatrix: [0,0,0,0,22,32], endMatrix: [1,0,0,1,0,0], easing: 'Back.easeOut', opacity: 1};

            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(0), 0.5, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(1), 0.25, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(2), 0, options);

            return timeline;
        },
        getTimelineVolumeOff: function() {
            var timeline = new TimelineMax({
                paused: true
            });

            var options = {startMatrix: [1,0,0,1,0,0], endMatrix: [0,0,0,0,22,32], easing: 'Back.easeIn', opacity: 0};

            //default on
            this.$volumeSvgPaths.attr('transform', 'matrix(1,0,0,1,0,0)');
            this.$volumeSvgPaths.css('opacity', 1);

            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(0), 0, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(1), 0.25, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(2), 0.5, options);

            return timeline;
        },
        addSvgPathAnimation: function(timeline, $path, startTime, options) {
            var animationSpeed = 0.2;

            var pathMatrix = _.clone(options.startMatrix);

            var tweenAttrs = {
                ease: options.easing,
                onUpdate: function() {
                    $path.attr('transform', 'matrix(' + pathMatrix.join(',') + ')');
                }
            };

            _.extend(tweenAttrs, options.endMatrix);

            timeline.add(TweenLite.to($path, animationSpeed, {opacity: options.opacity}), animationSpeed * startTime);
            timeline.add(TweenLite.to(pathMatrix, animationSpeed, tweenAttrs), animationSpeed * startTime);
        },
        // ==================================================================== //
        /* ************************ Counter Functions ************************* */
        // ==================================================================== //
        setCounter: function(i) {
            this.$activeDot.removeClass('active');

            this.$dots.eq(i).addClass('active');
            this.$activeDot = this.$dots.eq(i);
        },
        hideCounter: function() {
            this.$counter.hide();
        },
        hide: function() {
            this.$el.hide();
        },
        show: function() {
            this.$el.show();
        },

        height: function() {
            return this.$el.outerHeight() + this.$counter.outerHeight();
        },


        // ==================================================================== //
        /* ************************* Event Listeners ************************** */
        // ==================================================================== //
        onVolumeToggle: function(e) {
            e.preventDefault();

            this.toggleVolume();
        }
    });














    module.exports = FooterView;
})();
},{}],33:[function(require,module,exports){

(function() {
    "use strict";

    var device = require('../device');

    if(!device.isMobile()) {
        var introModule = require('../animations/intro');
    }

    var IntroView = Backbone.View.extend({
        el: '#intro-view',
        events: {
            'click a.begin': 'onBeginClick',
            'touchend a.begin': 'onBeginClick'
        },
        // ============================================================ //
        /* ****************** Initialization Stuff ******************** */
        // ============================================================ //
        initialize: function(options) {
            this.onCompleteCallback = function(){};

            this.initJqueryVariables();
            this.initAnimationTimeline();

            this.$beginBtn.hide();
        },
        initJqueryVariables: function() {
            this.$beginScreen = this.$el.find('div.begin-screen');
            this.$beginLines = this.$beginScreen.find('div.line');
            this.$beginBtn = this.$beginScreen.find('a.begin');
        },
        initAnimationTimeline: function() {
            if(device.isMobile()) {
                this.timelineHide = this.getMobileTimelineHide();
                this.timelineBeginScreenIn = this.getMobileTimelineBeginScreenIn();
            } else {
                this.timelineHide = this.getTimelineHide();
                this.timelineBeginScreenIn = this.getTimelineBeginScreenIn();
            }
        },

        // ============================================================ //
        /* ******************** Render Functions ********************** */
        // ============================================================ //
        showBeginScreen: function() {
            var timeline = this.timelineBeginScreenIn;

            if(device.isMobile()) {
                //show characters
                this.showMobileCharacters();
            }

            setTimeout(_.bind(timeline.play, timeline), 200);
        },

        showMobileCharacters: function() {
            var $mobileCharacters = $('#mobile-characters').find('div.character');

            var $dusty = $mobileCharacters.filter('.dusty3');
            var $dipper = $mobileCharacters.filter('.dipper');
            var $parachuter1 = $mobileCharacters.filter('.parachuter1');
            var $parachuter2 = $mobileCharacters.filter('.parachuter2');
            var $parachuter3 = $mobileCharacters.filter('.parachuter3');


            $dusty.addClass('active');
            $dipper.addClass('active flip');
            $parachuter1.addClass('active');
            $parachuter2.addClass('active');
            $parachuter3.addClass('active');

        },


        // ============================================================ //
        /* ***************** Animation Functions ********************** */
        // ============================================================ //
        getMobileTimelineBeginScreenIn: function() {
            var timeline = new TimelineMax({
                paused: true
            });

            timeline.add(function() {
                TweenLite.set(this.$beginLines, {x: 0, opacity: 1});
                TweenLite.set(this.$beginBtn, {opacity: 1});

                this.$beginBtn.show();
                this.mainView.showContent();
            }.bind(this), 0);

            return timeline;
        },
        getTimelineBeginScreenIn: function() {
            /****************** Static Variables **************/
            var animationTime = 0.4;
            var easing = 'Back.easeOut';

            var tweens = _.map(this.$beginLines, function(line) {
                return TweenLite.to(line, animationTime, {
                    x: 0,
                    opacity: 1,
                    ease: easing
                });
            });

            var timeline = new TimelineMax({
                paused: true,
                tweens: tweens,
                stagger: 0.08,
                onStart: function() {
                    TweenLite.set(this.$beginBtn, {
                        scale: 0.7
                    });
                    this.$beginBtn.show();
                }.bind(this)
            });

            var btnInTime = 0.4;

            timeline.add(TweenLite.to(this.$beginBtn, 0.6, {
                opacity: 1,
                scaleY: 1,
                ease: 'Elastic.easeOut'
            }), btnInTime);
            timeline.add(TweenLite.to(this.$beginBtn, 0.6, {
                scaleX: 1,
                ease: 'Elastic.easeOut'
            }), btnInTime + (animationTime * 0.05));

            timeline.add(function() {
                introModule.showLogo();
            }, 0.65);

            return timeline;
        },

        getMobileTimelineHide: function() {
            var timeline = new TimelineMax({
                paused: true
            });

            timeline.add(function() {
                this.$el.remove();
                this.onCompleteCallback();
            }.bind(this), 0);

            return timeline;
        },
        getTimelineHide: function() {
            var introFrames = introModule.getIntroFrames();

            /****************** Static Variables **************/
            var animationTime = 1.6;
            var easing = 'Cubic.easeInOut';

            /********************* Timeline *******************/
            var timeline = new TimelineMax({
                paused: true,
                onComplete: this.onAnimationFinished,
                onCompleteScope: this
            });
            timeline.add(TweenLite.to(this.$beginScreen, animationTime/4, {
                opacity: 0,
                ease: easing
            }), 0);


            timeline.add(TweenLite.to(introFrames.top, animationTime, {
                windowY: 0,
                ease: easing
            }), 0);
            timeline.add(TweenLite.to(introFrames.btm, animationTime, {
                windowY: 1,
                ease: easing
            }), 0);

            return timeline;
        },
        onAnimationFinished: function() {
            this.$el.remove();

            introModule.destroy();

            this.onCompleteCallback();
        },

        setMainView: function(view) {
            this.mainView = view;
        },
        // ============================================================ //
        /* ************************* Events *************************** */
        // ============================================================ //
        onBeginClick: function(e) {
            e.preventDefault();

            this.hide();
        },

        // ============================================================ //
        /* *********************** Public API ************************* */
        // ============================================================ //
        hide: function() {
            this.timelineHide.play();

            this.mainView.showContent();
        },
        onComplete: function(callback) {
            this.onCompleteCallback = callback;
        }

    });








    module.exports = IntroView;
})();
},{"../animations/intro":5,"../device":18}],34:[function(require,module,exports){

(function() {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~ Helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~
    var loader = require('../loader');
    var device = require('../device');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~ PIXI Scene ~~~~~~~~~~~~~~~~~~~~~~~~
    var MainScene = require('../pixi/mainScene');
    var scenesManager = require('../pixi/scenesManager');

    // ~~~~~~~~~~~~~~~~~~~~~~~~ Collections ~~~~~~~~~~~~~~~~~~~~~~~~
    var allQuestions = require('../collections/allQuestions');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Views ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var IntroView = require('./introView');
    var EnterNameView = require('./enterNameView');
    var QuestionView = require('./questionView');
    var CannedQuestionView = require('./cannedQuestionView');
    var SelectCharacterView = require('./selectCharacterView');
    var ResponseView = require('./responseView');
    var FooterView = require('./footerView');

    var isMobile = device.isMobile();

    if(!isMobile) {
        var introModule = require('../animations/intro');
    }


    // =================================================================== //
    /* ************************* Mainview Class ************************** */
    // =================================================================== //

    function getValues(views) {
        return _.map(views, function(view) {return view.model.attributes.value; });
    }

    var MainView = Backbone.View.extend({
        animating: false,
        pages: [],
        activePageIndex: 0,
        el: '#content',
        events: {
            'click a.next': 'onNext',
            'touchend a.next': 'onNext',
            'click a.finish-send': 'onFinish',
            'touchend a.finish-send': 'onFinish',
            'click a.skip': 'onSkip',
            'touchend a.skip': 'onSkip',
            'mousemove': 'onMouseMove'
        },

        onAssetProgress: function(percentageLoaded, timeElapsed) {
            introModule.updateLoader(percentageLoaded, timeElapsed);
        },
        onAssetsLoaded: function() {
            this.scene = scenesManager.createScene('main', MainScene);
            scenesManager.goToScene('main');

            scenesManager.onWindowResize();

            introModule.onComplete(this.introView.showBeginScreen.bind(this.introView));
            introModule.assetsLoaded();
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function() {
            if(!_.isUndefined(introModule))
                introModule.initialize();

            if(isMobile) {
                this.$el.addClass('mobile');
            }

            $('#assetLoader').remove();

            this.initJqueryVariables();

            if(!isMobile) {
                //create canvas element
                scenesManager.initialize(this.$window.width(), this.$window.height(), this.$el);
            }

            // create views
            this.initIntroView();
            this.initPages();

            this.footer = new FooterView({numDots: this.pages.length});
            this.responseView = new ResponseView();

            this.initWindowEvents();

            this.hideContent();
        },

        initWindowEvents: function() {
            this.$window.on('resize', _.bind(this.repositionPageNav, this));

//            if (window.DeviceOrientationEvent) {
//                console.log('deviceorientation');
//
//                window.addEventListener("deviceorientation", function(event) {
//                    console.log('orientation', event.beta, event.gamma);
//                }, true);
//            } else if (window.DeviceMotionEvent) {
//                console.log('devicemotion');
//
//                window.addEventListener('devicemotion', function(event) {
//                    console.log('motion', event.acceleration.x * 2, event.acceleration.y * 2);
//                }, true);
//            } else {
//                console.log('moz orientation');
//
//                window.addEventListener("MozOrientation", function(orientation) {
//                    console.log('moz', orientation.x * 50, orientation.y * 50);
//                }, true);
//            }
        },

        initIntroView: function() {
            var introView = new IntroView();

            introView.setMainView(this);
            introView.onComplete(_.bind(this.showFirstPage, this));

            this.introView = introView;
        },

        initPages: function() {
            var charModel = _.first(allQuestions.models);
            var questionModels = _.rest(allQuestions.models);

            var partitionedQuestionModels = _.partition(questionModels, function(model) {
                return model.get('class') !== 'canned';
            });

            var personalityModels = partitionedQuestionModels[0];
            var cannedModels = partitionedQuestionModels[1];




            var enterNameView = new EnterNameView();
            var selectCharView = new SelectCharacterView({model: charModel, parent: this.$pagesContainer});

            var personalityViews = _.map(personalityModels, function(model) {
                return new QuestionView({model: model, parent: this.$pagesContainer});
            }.bind(this));

            var cannedViews = _.map(cannedModels, function(model) {
                return new CannedQuestionView({model: model, parent: this.$pagesContainer});
            }.bind(this));



            this.cannedViews = cannedViews;
            this.selectCharacterView = selectCharView;

            this.pages = [enterNameView, selectCharView].concat(personalityViews, cannedViews);
        },
        initJqueryVariables: function() {
            this.$window = $(window);

            this.$pagesContainer = this.$el.find('div.pages-ctn');

            this.$pageNav = this.$pagesContainer.find('div.page-nav');
            this.$next = this.$pageNav.find('a.next');
            this.$finishSend = this.$pageNav.find('a.finish-send');

            this.$skipCtr = this.$pageNav.find('div.skip');
            this.$skip = this.$skipCtr.find('a.skip');

            this.$header = $('#header');
        },

        // ==================================================================== //
        /* ******************** Canned Question View Stuff ******************** */
        // ==================================================================== //
        updateViewOptionsWithUnused: function(cannedView) {
            var usedOptions = _.compact(getValues(this.cannedViews));

            var options = allQuestions.getUnusedCannedOptions(3, usedOptions);

            cannedView.setOptions(options);
        },
        // ==================================================================== //
        /* *********************** Change View Functions ********************** */
        // ==================================================================== //
        showFirstPage: function() {
            this.pages[0].show();

            this.$pageNav.css('opacity', 0);
            this.$next.addClass('active');
            this.$skip.addClass('active');

            this.repositionPageNav(false);

            TweenLite.to(this.$pageNav, 0.3, {opacity: 1});
        },

        nextPage: function() {
            this.animating = true;
            //hide active page
            var activePage = this.pages[this.activePageIndex];
            var nextPage = this.pages[this.activePageIndex + 1];

            if(nextPage.isCanned()) {
                this.updateViewOptionsWithUnused(nextPage);

                if(!activePage.isCanned()) {
                    this.showSkip();
                }
            } else {
                this.hideSkip();
            }

            //active page is character select
            if(this.activePageIndex === 1) {
                this.updateCannedCopy();

                if(!isMobile) {
                    //animate in character
                    this.scene.animateInUserCharacter();
                } else {
                    this.showMobileCharacter();
                }
            }

            activePage.onHideComplete(this.showPageAfterHide.bind(this));

            this.activePageIndex++;
            activePage.hide();
            this.repositionPageNav(true);

            this.footer.setCounter(this.activePageIndex);
        },
        showMobileCharacter: function() {
            var character = this.selectCharacterView.model.get('value');

            if(character === 'team') {
                this.showMobileTeam();
                return;
            }

            var $mobileCharacters = $('#mobile-characters').find('div.character');

            var $character = $mobileCharacters.filter('.'+character);

            $character.addClass('active selected');
        },
        showMobileTeam: function() {
            var $mobileCharacters = $('#mobile-characters').find('div.character');

            var $characters = $mobileCharacters.filter('.dusty3, .dipper, .cabbie2, .bladeranger, .windlifter');

            $characters.addClass('active team');
        },

        showPageAfterHide: function() {
            var lastPage = this.pages[this.activePageIndex-1];
            if(lastPage.isCanned()) {
                lastPage.removeOptions();   //canned options are repeated and share the same ID
            }

            //show next page
            var nextPage = this.pages[this.activePageIndex];

            nextPage.onShowComplete(function() {
                this.animating = false;
            }.bind(this));
            nextPage.show();

            if(this.activePageIndex === this.pages.length-1) {
                this.showFinishBtn();
                this.hideSkip();
            }
        },
        showFinishBtn: function() {
            this.$next.hide();
            this.$finishSend.addClass('active');
        },

        finishAndSend: function() {
            this.$pagesContainer.hide();
            this.footer.hideCounter();

            var pageModels = _.map(this.pages, function(page) {
                return page.model;
            });
            this.responseView.setResponse(pageModels);

            if(!isMobile) {
                this.scene.onUserCharacterOut(_.bind(this.scene.playWipescreen, this.scene));

                var me = this;
                this.scene.onWipescreenComplete(function() {
                    me.responseView.show();
                    me.scene.showResponse();
                });

                this.scene.animateOutUserCharacter();
            } else {
                $('#mobile-backgrounds').hide();

                this.responseView.show();
            }
        },
        repositionPageNav: function(animate) {
            var activePage = this.pages[this.activePageIndex];

            var pixelPosition = (activePage.$el.offset().top + activePage.$el.outerHeight());

            var windowHeight = this.$window.height();

            var topFrac = Math.min(pixelPosition/windowHeight, (windowHeight - this.footer.height() - this.$pageNav.outerHeight())/windowHeight);

            var percTop = 100 * topFrac + '%';

            if(!!animate) {
                var animationTime = isMobile ? 0.1 : 0.2;

                TweenLite.to(this.$pageNav, animationTime, {top: percTop, ease:'Quad.easeInOut'});
                return;
            }
            this.$pageNav.css('top', percTop);
        },


        hideSkip: function() {
            if(isMobile) {
                this.$skipCtr.css({height: 0});
                return;
            }
            TweenLite.to(this.$skip, 0.2, {bottom: '100%', opacity: 0});
        },
        showSkip: function() {
            if(isMobile) {
                this.$skipCtr.attr('style', '');
                return;
            }
            TweenLite.to(this.$skip, 0.2, {bottom: 0, opacity: 1});
        },

        showContent: function() {
            this.$pagesContainer.show();
            this.footer.show();
            this.$header.show();
        },
        hideContent: function() {
            this.$pagesContainer.hide();
            this.$header.hide();
            this.footer.hide();
        },
        updateCannedCopy: function() {
            var character = this.selectCharacterView.getSelectedCharacter();

            _.each(this.cannedViews, function(view) {
                view.setCharacter(character);
            });
        },
        // ==================================================================== //
        /* ************************* Render Functions ************************* */
        // ==================================================================== //
        start: function() {
            if(!device.isMobile()) {
                loader.start(this);
            } else {
                this.introView.showBeginScreen();
            }
        },

        // ==================================================================== //
        /* ************************* Event Listeners ************************** */
        // ==================================================================== //
        onNext: function(e) {
            e.preventDefault();

            if(this.animating
                || this.pages[this.activePageIndex].model.attributes.value === ''
                || this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        },
        onFinish: function(e) {
            e.preventDefault();

            if(this.animating) return;

            this.finishAndSend();
        },
        onMouseMove: function(e) {
            e.preventDefault();

            if(_.isUndefined(this.scene)) return;

            this.scene.shiftBackgroundLayers(e.pageX/this.$window.width());
        },
        onSkip: function(e) {
            e.preventDefault();

            if(this.animating || this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        }
    });









    module.exports = MainView;



})();
},{"../animations/intro":5,"../collections/allQuestions":11,"../device":18,"../loader":20,"../pixi/mainScene":26,"../pixi/scenesManager":28,"./cannedQuestionView":30,"./enterNameView":31,"./footerView":32,"./introView":33,"./questionView":35,"./responseView":36,"./selectCharacterView":37}],35:[function(require,module,exports){



var template = require('../templates/question.hbs');
var itemAnimationsModule = require('../animations/pageItems');

var device = require('../device');
var isMobile = device.isMobile();

var QuestionView = Backbone.View.extend({
    // Variables
    showCallback: function(){},
    hideCallback: function(){},
    className: 'question page',
    template: template,

    events: {
        'click label': 'onRadioChange',
        'touchend label': 'onRadioChange'
    },
    // Functions
    initialize: function(options) {
        this.render();

        options.parent.append(this.el);

        this.$el.addClass(this.model.attributes.class);

        this.$copy = this.$el.find('div.copy');
        this.$options = this.$el.find('div.option');
        this.$inputs = this.$el.find('input[type=radio]');

        if(this.$options.length !== 0 && !isMobile)
            this.initAnimations();
    },
    getAnimations: function() {
        "use strict";

        return itemAnimationsModule.getRandomPersonalityAnimations(this.$options);
    },
    initAnimations: function() {
        "use strict";

        var animations = this.getAnimations();

        this.animationIn = animations[0];
        this.animationOut = animations[1];

        this.animationIn.vars.onComplete = function() {
            this.showCallback();
        }.bind(this);

        this.animationOut.vars.onComplete = function() {
            this.$el.removeClass('active');

            this.hideCallback();
        }.bind(this);
    },

    isCanned: function() {
        return false;
    },

    // ============================================================ //
    /* ******************** Render Functions ********************** */
    // ============================================================ //
    render: function() {
        if(this.el.innerHTML === '')
            this.el.innerHTML = this.template(this.model.attributes);

        return this;
    },


    // ============================================================ //
    /* ***************** Animation Functions ********************** */
    // ============================================================ //
    show: function() {
        this.$el.addClass('active');

        if(!isMobile) {
            this.animationIn.play();
        } else {
            this.showCallback();
        }
    },
    hide: function() {
        if(!isMobile) {
            this.animationOut.play();
        } else {
            this.$el.removeClass('active');

            this.hideCallback();
        }

    },
    onHideComplete: function(callback) {
        this.hideCallback = callback;
    },
    onShowComplete: function(callback) {
        this.showCallback = callback;
    },


    // ============================================================ //
    /* ********************* Event Listeners ********************** */
    // ============================================================ //
    onRadioChange: function(e) {
        "use strict";
        e.preventDefault();

        var $activeInput = this.$inputs.filter('[checked]');
        var $input = $(e.currentTarget).siblings('input');

        if($activeInput !== $input) {
            $activeInput.prop('checked', false);
            $input.prop('checked', true);
        }

        var text = $input.siblings('div.text').html();

        this.model.set({value: $input.attr('value'), text: text});
    }
});


module.exports = QuestionView;
},{"../animations/pageItems":6,"../device":18,"../templates/question.hbs":29}],36:[function(require,module,exports){




(function() {
    "use strict";


    var responseMap = require('../data/responseMap.json');
    var cannedQuestionData = require('../data/cannedQuestions.json');
    var personalityQuestionData = require('../data/personalityQuestions.json');

    var responseModule = require('../animations/responseModule');

    var device = require('../device');
    var isMobile = device.isMobile();

    // ============================================================ //
    /* *********** Setup Canned/Personality Orders **************** */
    // ============================================================ //
    function getOrder(options, property) {
        return _.chain(options)
            .pluck(property)
            .object(_.range(options.length))
            .value();
    }

    function getCorrectPersonalityModel(model, personalityModels) {
        var val = model.get('value');

        var personalityModel = _.filter(personalityModels, function(mod) {
            return val === mod.get('name');
        })[0];

        return personalityModel;
    }


    var cannedOrder = getOrder(cannedQuestionData.options, 'value');
    var personalityOrder = getOrder(personalityQuestionData.questions, 'name');



    // ============================================================ //
    /* ******************** Response View ************************* */
    // ============================================================ //

    function isAnswered(model) {
        return model.get('value') !== '';
    }
    
    function isTrueCanned(value) {
      return _.isUndefined(personalityOrder[value]);
    }

    function lastCharIsPunctuation(str) {
        var c = str.charAt(str.length-1);

        return c === '.' || c === ',' || c === '!';
    }

    var ResponseView = Backbone.View.extend({
        character: '',
        el: '#response',
        events: {
            'click a#printversion': 'print'
        },

        initialize: function() {
            this.$background = $('#response-bg');
            this.$signature = $('#card-from');
        },

        getUsername: function(nameModel) {
            return nameModel.get('value') || 'Friend';
        },

        getCannedResponses: function(cannedValues, character) {

            var response = _.chain(cannedValues)
                .sortBy(function(value) { return cannedOrder[value]; })    // sort based on cannedOrder object above
                .map(function(value) { return responseMap[character][value]; }) // grab responses for each question
                .value();       // exit chain

            return response;
        },

        getPersonalityResponses: function(personalityCannedModels, personalityModels, character) {

            var response = _.chain(personalityCannedModels)
                .sortBy(function(model) { return personalityOrder[model.get('value')]; })    // sort based on personalityOrder object above
                .map(function(model) {                                                      // grab responses for each question
                    var personalityModel = getCorrectPersonalityModel(model, personalityModels);

                    var template;
                    if(personalityModel.get('value') === 'frenchfries' || personalityModel.get('value') === 'chickennuggets') {
                        template = responseMap[character][model.get('value') + '-plural'];
                    } else {
                        template = responseMap[character][model.get('value')];
                    }


                    return template.replace('%template%', personalityModel.get('text'));
                })
                .value();       // exit chain

            return response;
        },


        setResponse: function(models) {
            var nameModel = models[0];
            var characterModel = models[1];
            var questionModels = _.rest(models, 2);

            var userName = this.getUsername(nameModel);
            var character = characterModel.get('value');
            this.character = character;

            var answeredQuestions = _.filter(questionModels, isAnswered);
            
            var cannedModels = _.filter(answeredQuestions, function(model) { return model.get('class') === 'canned'; });
            var personalityModels = _.filter(answeredQuestions, function(model) { return model.get('class') !== 'canned'; });


            var trueCannedValues;
            if(cannedModels.length === 0) {
              trueCannedValues = _.chain(cannedQuestionData.options)
                  .pluck('value')
                  .filter(isTrueCanned)
                  .value();
            } else {
              trueCannedValues = _.chain(cannedModels)
                  .map(function(model) { return model.get('value'); })
                  .filter(isTrueCanned)
                  .value();
            }


            var personalityCannedModels = _.filter(cannedModels, function(model) {return !isTrueCanned(model.get('value')); });

            
            var cannedResponses = this.getCannedResponses(trueCannedValues, character);
            var personalityResponses = this.getPersonalityResponses(personalityCannedModels, personalityModels, character);


            this.$background.addClass(character);
            this.$signature.addClass(character);



            var greeting = responseMap[character]['greeting'].replace('%template%', userName);
            var body1 = responseMap[character]['body1'];
            var body2 = responseMap[character]['body2'].replace('%template%', userName);
            var sincerely = responseMap[character].sincerely;

            if(!lastCharIsPunctuation(sincerely)) {
                sincerely += ',';
            }


            var response = body1 + ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ') + ' ' + body2;


            $('#card-greeting').html(greeting);
            $('#card-body').html(response);
            $('#card-sincerely').html(sincerely);
//            $('#card-from').html(character);
        },

        show: function() {
            this.$el.show();
            this.$background.show();


            if(!isMobile) {
                setTimeout(function() {
                    responseModule.animateIn(this.character);
                }.bind(this), 400);
            } else {
                $('#letterbg-ctr').addClass('active');
                this.showMobileCharacters();
            }
        },
        showMobileCharacters: function() {
            var $mobileCtr = $('#mobile-characters');

            var $activeCharacters = $mobileCtr.find('div.character.active');

            if(this.character === 'team') {
                $activeCharacters.filter('.dusty3').removeClass('active team response');

                $mobileCtr.find('div.character.dusty2').addClass('active team response front');
            } else if (this.character === 'dusty') {
                $activeCharacters.removeClass('active team response');

                $mobileCtr.find('div.character.dusty2').addClass('active response front');
            } else {
                $activeCharacters.addClass('front');
            }

            $activeCharacters.addClass('response');
        },

        hide: function() {

        },
        
        print: function(e) {
            e.preventDefault();
            // window.print();

            var g = $('#card-greeting').html();
            var b = $('#card-body').html();
            var s = $('#card-sincerely').html();
//            var f = $('#card-from').html();
            window.open(window.location.href + 'print.php' + '?char=' + this.character + '&greeting='+ g + '&body=' + b + '&sincerely=' + s + '&from=' + this.character);
            
        }
    });













    module.exports = ResponseView;
})();
},{"../animations/responseModule":9,"../data/cannedQuestions.json":14,"../data/personalityQuestions.json":16,"../data/responseMap.json":17,"../device":18}],37:[function(require,module,exports){




(function() {
    "use strict";


    var audioAssets = require('../data/audioAssets.json');

    var QuestionView = require('./questionView');

    var characterModule = require('../animations/characterModule');

    var characterAudioIds = audioAssets.characterAudioIds;

    var device = require('../device');
    var isMobile = device.isMobile();

    var SelectCharacterView = QuestionView.extend({

        initialize: function(options) {
            //parent constructor
            QuestionView.prototype.initialize.call(this, options);
        },

        show: function() {
            if(isMobile) {
                this.hideMobileCharacters();
            }

            QuestionView.prototype.show.call(this);
        },

        hideMobileCharacters: function() {
            var $mobileCharacters = $('#mobile-characters').find('div.character');

            $mobileCharacters.removeClass('active intro flip');
        },

        getSelectedCharacter: function() {
            return this.model.get('text');
        },
        onRadioChange: function(e) {
            e.preventDefault();
            QuestionView.prototype.onRadioChange.call(this, e);

            var $input = $(e.currentTarget).siblings('input');

            var char = $input.attr('id');

            createjs.Sound.play(characterAudioIds[char]);

            characterModule.setCharacter(char);
        }
    });











    module.exports = SelectCharacterView;
})();
},{"../animations/characterModule":3,"../data/audioAssets.json":13,"../device":18,"./questionView":35}],38:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":39,"./handlebars/exception":40,"./handlebars/runtime":41,"./handlebars/safe-string":42,"./handlebars/utils":43}],39:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":40,"./utils":43}],40:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],41:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":39,"./exception":40,"./utils":43}],42:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],43:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":42}],44:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":38}],45:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":44}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyby5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYWdlSXRlbXMuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGxhY2VKdXN0T2Zmc2NyZWVuLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9RdWVzdGlvbkNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucy5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvZGF0YS9hc3NldHMuanNvbiIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvZGF0YS9hdWRpb0Fzc2V0cy5qc29uIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL2RhdGEvcmVzcG9uc2VNYXAuanNvbiIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvZGV2aWNlLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9mYWtlXzgwYTU0YWRiLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9sb2FkZXIuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL21vZGVscy9xdWVzdGlvbi5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvcGl4aS9hbGxDaGFyYWN0ZXJzLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9waXhpL2NoYXJhY3Rlci5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvcGl4aS9leHRlbmQuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL3BpeGkvbGliTW9kaWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvcGl4aS9tYWluU2NlbmUuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL3BpeGkvc2NlbmUuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL3BpeGkvc2NlbmVzTWFuYWdlci5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvdmlld3MvY2FubmVkUXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy92aWV3cy9lbnRlck5hbWVWaWV3LmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy92aWV3cy9mb290ZXJWaWV3LmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy92aWV3cy9pbnRyb1ZpZXcuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL3ZpZXdzL21haW5WaWV3LmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL2pzL3NyYy92aWV3cy9xdWVzdGlvblZpZXcuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvanMvc3JjL3ZpZXdzL3Jlc3BvbnNlVmlldy5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvdmlld3Mvc2VsZWN0Q2hhcmFjdGVyVmlldy5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9iYXNlLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvZXhjZXB0aW9uLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiL1VzZXJzL2FsZWMvY29kaW5nUHJvamVjdHMvcGhwL3BsYW5lcy1haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvdXRpbHMuanMiLCIvVXNlcnMvYWxlYy9jb2RpbmdQcm9qZWN0cy9waHAvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9Vc2Vycy9hbGVjL2NvZGluZ1Byb2plY3RzL3BocC9wbGFuZXMtYWlybWFpbC9ub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25nQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBiYWNrZ3JvdW5kLCBtaWRkbGVncm91bmQsIGZvcmVncm91bmQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBiYWNrZ3JvdW5kID0gaW5pdEJhY2tncm91bmQoKTtcbiAgICBtaWRkbGVncm91bmQgPSBpbml0TWlkZGxlZ3JvdW5kKCk7XG4gICAgZm9yZWdyb3VuZCA9IGluaXRGb3JlZ3JvdW5kKCk7XG59XG5mdW5jdGlvbiBzZXRBdHRycyhzcHJpdGUpIHtcbiAgICBzcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuICAgIHNwcml0ZS53aW5kb3dYID0gMC41O1xuICAgIHNwcml0ZS53aW5kb3dZID0gMTtcblxuICAgIHNwcml0ZS5zY2FsZVR5cGUgPSAnY292ZXInO1xuICAgIHNwcml0ZS53aW5kb3dTY2FsZSA9IDEuMDY7XG59XG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZCgpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9zaXRlX2JnLmpwZycpO1xuXG4gICAgc2V0QXR0cnMoYmFja2dyb3VuZCk7XG5cbiAgICByZXR1cm4gYmFja2dyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRNaWRkbGVncm91bmQoKSB7XG4gICAgdmFyIG1pZGRsZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9taWRncm91bmQucG5nJyk7XG4gICAgc2V0QXR0cnMobWlkZGxlZ3JvdW5kKTtcbiAgICByZXR1cm4gbWlkZGxlZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdEZvcmVncm91bmQoKSB7XG4gICAgdmFyIGZvcmVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9yZWdyb3VuZF90cmVlcy5wbmcnKTtcbiAgICBzZXRBdHRycyhmb3JlZ3JvdW5kKTtcbiAgICByZXR1cm4gZm9yZWdyb3VuZDtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFkZEJhY2tncm91bmRUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbiAgICB9LFxuICAgIGFkZFJlc3RUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChtaWRkbGVncm91bmQpO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChmb3JlZ3JvdW5kKTtcbiAgICB9LFxuICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGJhY2tncm91bmQpKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRSYXRpbyA9IDAuNzU7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRSYXRpbyA9IDEuNTtcbiAgICAgICAgdmFyIGZvcmVncm91bmRSYXRpbyA9IDM7XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRYID0gMC41IC0gKHggLSAwLjUpICogYmFja2dyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBtaWRkbGVncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIGZvcmVncm91bmRYID0gMC41IC0gKHggLS41KSAqIGZvcmVncm91bmRSYXRpby81MDtcblxuICAgICAgICBiYWNrZ3JvdW5kLndpbmRvd1ggPSBiYWNrZ3JvdW5kWDtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLndpbmRvd1ggPSBtaWRkbGVncm91bmRYO1xuICAgICAgICBmb3JlZ3JvdW5kLndpbmRvd1ggPSBmb3JlZ3JvdW5kWDtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBiYWNrZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgZm9yZWdyb3VuZC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgYmFja2dyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIG1pZGRsZWdyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIGZvcmVncm91bmQuZGVzdHJveSgpO1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgd2lwZXNjcmVlblZpZGVvLCB2aWRlb1RpbWVsaW5lO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgd2lwZXNjcmVlblZpZGVvID0gZ2VuZXJhdGVCbGFkZVdpcGVBbmltYXRpb24oKTtcbiAgICB2aWRlb1RpbWVsaW5lID0gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUod2lwZXNjcmVlblZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVCbGFkZVdpcGVBbmltYXRpb24oKSB7XG4gICAgdmFyIHRleHR1cmVzID0gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2JywgNDAwLCA1NTYpO1xuXG4gICAgdmFyIHdpcGVzY3JlZW5WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcCh0ZXh0dXJlcyk7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1ggPSAwLjU7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1NjYWxlID0gMTtcbiAgICB3aXBlc2NyZWVuVmlkZW8uc2NhbGVUeXBlID0gJ2NvdmVyJztcblxuICAgIHdpcGVzY3JlZW5WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG4gICAgd2lwZXNjcmVlblZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ubG9vcCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHdpcGVzY3JlZW5WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcbiAgICB2aWRlby5fdHdlZW5GcmFtZSA9IDA7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmlkZW8sICd0d2VlbkZyYW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5nb3RvQW5kU3RvcCh2YWx1ZSk7XG5cbi8vICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQucGxheSgnV2lwZXNjcmVlbicpO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG5cbiAgICB2YXIgZmFkZU91dFRpbWUgPSAwLjI7XG4gICAgdmFyIGZhZGVPdXRTdGFydCA9IHRpbWVsaW5lLmR1cmF0aW9uKCkgLSAwLjE7XG5cbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnY2FsbGJhY2snLCB0aW1lbGluZS5kdXJhdGlvbigpIC0gMC4xKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odmlkZW8sIGZhZGVPdXRUaW1lLCB7XG4gICAgICAgIGFscGhhOiAwLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0J1xuICAgIH0pLCBmYWRlT3V0U3RhcnQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQod2lwZXNjcmVlblZpZGVvKTtcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIGhpZGVWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgfSxcbiAgICBvblZpZGVvQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUuYWRkKGNhbGxiYWNrLCAnY2FsbGJhY2snKTtcbiAgICB9XG59O1xuXG5cblxuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgYWxsQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4uL3BpeGkvYWxsQ2hhcmFjdGVycycpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGNoYXJhY3Rlck5hbWU7XG52YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuXG5cblxuZnVuY3Rpb24gZ2V0T2Zmc2NyZWVuWChjaGFyYWN0ZXIpIHtcbiAgICB2YXIgd2lkdGggPSBjaGFyYWN0ZXIuZ2V0Qm91bmRzKCkud2lkdGg7XG4gICAgdmFyIGFuY2hvclggPSBjaGFyYWN0ZXIuaWRsZS5hbmNob3IueDtcbiAgICB2YXIgd2luZG93V2lkdGggPSAkd2luZG93LndpZHRoKCk7XG5cbiAgICByZXR1cm4gKHdpbmRvd1dpZHRoICsgYW5jaG9yWCp3aWR0aCkvd2luZG93V2lkdGg7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYW5pbWF0ZUluLCBhbmltYXRlT3V0O1xuXG52YXIgYW5pbWF0aW9uc0luID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHk7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgICAgICAgICBkdXN0eS53aW5kb3dYID0gMC42O1xuICAgICAgICAgICAgZHVzdHkud2luZG93U2NhbGUgPSAwLjQyO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuXG4gICAgICAgICAgICBibGFkZS53aW5kb3dTY2FsZSA9IDAuNjtcbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1ggPSAtLjQ7XG4gICAgICAgICAgICBibGFkZS53aW5kb3dZID0gMC43NTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE2LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjYWJiaWUpO1xuICAgICAgICAgICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjY7XG4gICAgICAgICAgICBjYWJiaWUucm90YXRpb24gPSAwLjU1O1xuICAgICAgICAgICAgY2FiYmllLndpbmRvd1ggPSAwLjQ2O1xuXG4gICAgICAgICAgICBjYWJiaWUuc2NhbGUueCA9IDAuODtcbiAgICAgICAgICAgIGNhYmJpZS5zY2FsZS55ID0gMC44O1xuXG4gICAgICAgICAgICBjYWJiaWUuZmlsdGVyc1swXS5ibHVyID0gNztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgc3dlZXBUaW1lID0gYW5pbWF0aW9uVGltZSAqIDcvODtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTUsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZS5zY2FsZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLmZpbHRlcnNbMF0sIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcblxuICAgICAgICAgICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjU7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgZGlwcGVyLnJvdGF0aW9uID0gMC41NTtcbiAgICAgICAgICAgIGRpcHBlci53aW5kb3dYID0gMC40NjtcblxuICAgICAgICAgICAgZGlwcGVyLnNjYWxlLnggPSAwLjg7XG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueSA9IDAuODtcblxuICAgICAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDc7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHN3ZWVwVGltZSA9IGFuaW1hdGlvblRpbWUgKiA3Lzg7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE4LFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIuc2NhbGUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2luZGxpZnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgICAgICAgICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC41NjtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHdpbmRsaWZ0ZXIpO1xuICAgICAgICAgICAgd2luZGxpZnRlci53aW5kb3dYID0gMC42O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMyxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxudmFyIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUoKSB7XG4gICAgb25BbmltYXRpb25PdXRDYWxsYmFjaygpO1xufVxuXG52YXIgYW5pbWF0aW9uc091dCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjUsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjUsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0JyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FiYmllOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBjYWJiaWUuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7Ymx1cjogNH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtibHVyOiA0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuMyxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluJyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUgKiA3LzgsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4xLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIFRlYW0gQW5pbWF0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gdGVhbUFuaW1hdGlvblNldHVwKGR1c3R5LCBibGFkZSwgY2FiYmllLCBkaXBwZXIsIHdpbmRsaWZ0ZXIpIHtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEdXN0eSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgIGR1c3R5LndpbmRvd1ggPSAxIC0gZ2V0T2Zmc2NyZWVuWChkdXN0eSk7XG4gICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMjc7XG4gICAgZHVzdHkucm90YXRpb24gPSAwLjY7XG4gICAgZHVzdHkuZmlsdGVyc1swXS5ibHVyID0gMDtcbiAgICBUd2VlbkxpdGUua2lsbFR3ZWVuc09mKGR1c3R5KTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBCbGFkZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oYmxhZGUpO1xuICAgIGJsYWRlLndpbmRvd1ggPSAwLjQ1O1xuICAgIGJsYWRlLmlkbGUud2luZG93U2NhbGUgPSAwLjMzO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENhYmJpZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2FiYmllKTtcbiAgICBjYWJiaWUud2luZG93WCA9IDAuMTQ7XG4gICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjI1O1xuICAgIGNhYmJpZS5maWx0ZXJzWzBdLmJsdXIgPSAwO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IERpcHBlciB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBkaXBwZXIucm90YXRpb24gPSAtMC4zO1xuICAgIGRpcHBlci53aW5kb3dYID0gLTAuMjtcbiAgICBkaXBwZXIud2luZG93WSA9IDAuMjU7XG4gICAgZGlwcGVyLmZpbHRlcnNbMF0uYmx1ciA9IDA7XG4gICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjIyO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBXaW5kbGlmdGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAtMC4xO1xuICAgIHdpbmRsaWZ0ZXIud2luZG93WSA9IDAuNztcbi8vICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMDg7XG4gICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC4xMjtcbiAgICB3aW5kbGlmdGVyLnJvdGF0aW9uID0gLTAuMztcbiAgICB3aW5kbGlmdGVyLmZpbHRlcnNbMF0uYmx1ciA9IDA7XG4gICAgd2luZGxpZnRlci5mbGlwKCk7XG5cblxuICAgIHJlcXVlc3RBbmltRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGR1c3R5LnB1c2hUb1RvcCgpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlSW5UZWFtKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMy44O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuLy8gICAgYW5pbWF0aW9uVGltZSA9IDEwO1xuXG4gICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eUZvdXI7XG4gICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcbiAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWVUd287XG4gICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgdGVhbUFuaW1hdGlvblNldHVwKGR1c3R5LCBibGFkZSwgY2FiYmllLCBkaXBwZXIsIHdpbmRsaWZ0ZXIpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+IEFuaW1hdGlvbiBTdGFydCBMYWJlbHMgfn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdCbGFkZScsIDApO1xuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdDYWJiaWUnLCBhbmltYXRpb25UaW1lICogMC4xMyk7XG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ1dpbmRsaWZ0ZXInLCBhbmltYXRpb25UaW1lICogMC4xNSk7XG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ0RpcHBlcicsIGFuaW1hdGlvblRpbWUgKiAwLjQ2KTtcbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnRHVzdHknLCBhbmltYXRpb25UaW1lICogMC44NSk7XG5cblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDYWJiaWUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGNhYmJpZUFuaW1hdGlvblRpbWUgPSBhbmltYXRpb25UaW1lICogMS4zO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oY2FiYmllLCBjYWJiaWVBbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IGdldE9mZnNjcmVlblgoY2FiYmllKSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksICdDYWJiaWUnKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oY2FiYmllLCBjYWJiaWVBbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMyxcbiAgICAgICAgZWFzZTogJ0V4cG8uZWFzZU91dCdcbiAgICB9KSwgJ0NhYmJpZScpO1xuXG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQmxhZGUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGJsYWRlQW5pbWF0aW9uVGltZSA9IGFuaW1hdGlvblRpbWU7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsYWRlLCBibGFkZUFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WDogZ2V0T2Zmc2NyZWVuWChibGFkZSksXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAnQmxhZGUnKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmxhZGUsIGJsYWRlQW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjUsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksICdCbGFkZScpO1xuXG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IFdpbmRsaWZ0ZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciB3aW5kbGlmdGVyQW5pbVRpbWUgPSBhbmltYXRpb25UaW1lICogMS42O1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCB3aW5kbGlmdGVyQW5pbVRpbWUsIHtcbiAgICAgICAgd2luZG93WDogZ2V0T2Zmc2NyZWVuWCh3aW5kbGlmdGVyKSxcbiAgICAgICAgcm90YXRpb246IDAuNCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksICdXaW5kbGlmdGVyJyk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIHdpbmRsaWZ0ZXJBbmltVGltZSAqIDAuNywge1xuICAgICAgICB3aW5kb3dZOiAwLjM1LFxuICAgICAgICBlYXNlOiAnUXVhZC5lYXNlSW4nXG4gICAgfSksICdXaW5kbGlmdGVyJyk7XG5cblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEaXBwZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGRpcHBlckFuaW1UaW1lID0gYW5pbWF0aW9uVGltZSAqIDEuNTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBkaXBwZXJBbmltVGltZSwge1xuICAgICAgICB3aW5kb3dYOiBnZXRPZmZzY3JlZW5YKGRpcHBlciksXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgJ0RpcHBlcicpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGRpcHBlckFuaW1UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuNixcbiAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICB9KSwgJ0RpcHBlcicpO1xuXG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRHVzdHkgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGR1c3R5QW5pbVRpbWUgPSBhbmltYXRpb25UaW1lICogMC43O1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgZHVzdHlBbmltVGltZSwge1xuICAgICAgICB3aW5kb3dYOiAwLjIsXG4gICAgICAgIGVhc2U6ICdRdWFkLmVhc2VJbk91dCdcbiAgICB9KSwgJ0R1c3R5Jyk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBkdXN0eUFuaW1UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMjQsXG4gICAgICAgIGVhc2U6ICdTaW5lLmVhc2VPdXQnXG4gICAgfSksICdEdXN0eScpO1xuXG5cblxuXG5cbiAgICB0aW1lbGluZS5wbGF5KCk7XG5cbi8vICAgIG5ldyBUaW1lbGluZU1heCh7XG4vLyAgICAgICAgc3RhZ2dlcjogMC4yNyxcbi8vICAgICAgICBhbGlnbjogJ3N0YXJ0Jyxcbi8vICAgICAgICB0d2VlbnM6IFtcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI0LFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMC4yLFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNTksXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjgzLFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjUyLFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMC4wNSxcbi8vICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjIsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjc4LFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC43LFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNixcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KVxuLy8gICAgICAgIF1cbi8vICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlT3V0VGVhbSgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuODtcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluJztcblxuICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG4gICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllO1xuICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcbiAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICBlYXNlOiAnQmFjay5lYXNlSW4nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WDogZ2V0T2Zmc2NyZWVuWChkdXN0eSksXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuXG4gICAgdGltZWxpbmUucGxheSgpO1xuLy8gICAgbmV3IFRpbWVsaW5lTWF4KHtcbi8vICAgICAgICBzdGFnZ2VyOiAwLjI5LFxuLy8gICAgICAgIGFsaWduOiAnc3RhcnQnLFxuLy8gICAgICAgIHR3ZWVuczogW1xuLy8gICAgICAgICAgICBuZXcgVGltZWxpbmVNYXgoe1xuLy8gICAgICAgICAgICAgICAgdHdlZW5zOiBbXG4vLyAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjEsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbi8vICAgICAgICAgICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuNixcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIF1cbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjgsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjIsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC4yLFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMS40LFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNixcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuNixcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgbmV3IFRpbWVsaW5lTWF4KHtcbi8vICAgICAgICAgICAgICAgIHR3ZWVuczogW1xuLy8gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WTogMC41LFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlSW4nXG4vLyAgICAgICAgICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjMsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICBdXG4vLyAgICAgICAgICAgIH0pXG4vLyAgICAgICAgXSxcbi8vICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgZHVzdHkuZGVzdHJveSgpO1xuLy9cbi8vICAgICAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjaygpO1xuLy8gICAgICAgIH1cbi8vICAgIH0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcblxuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgYW5pbWF0ZUluVGVhbSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0ZUluID0gYW5pbWF0aW9uc0luW2NoYXJhY3Rlck5hbWVdO1xuICAgICAgICBhbmltYXRlT3V0ID0gYW5pbWF0aW9uc091dFtjaGFyYWN0ZXJOYW1lXTtcblxuICAgICAgICBzZXRUaW1lb3V0KGFuaW1hdGVJbiwgNzAwKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihjaGFyYWN0ZXJOYW1lID09PSAndGVhbScpIHtcbiAgICAgICAgICAgIGFuaW1hdGVPdXRUZWFtKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYW5pbWF0ZU91dCgpO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgY2hhcmFjdGVyTmFtZSA9IGNoYXJhY3RlcjtcbiAgICB9LFxuICAgIGFsbENoYXJhY3RlcnM6IGFsbENoYXJhY3RlcnNcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbnZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi4vcGl4aS9hbGxDaGFyYWN0ZXJzJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBkdXN0eSwgZGlwcGVyLCB0aW1lbGluZUluLCB0aW1lbGluZU91dCwgdGltZWxpbmVEdXN0eUhvdmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGR1c3R5ID0gaW5pdGlhbGl6ZUR1c3R5KCk7XG4gICAgZGlwcGVyID0gaW5pdGlhbGl6ZURpcHBlcigpO1xuXG4gICAgdGltZWxpbmVJbiA9IGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpO1xuICAgIHRpbWVsaW5lT3V0ID0gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplRHVzdHkoKSB7XG4gICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eUZvdXI7XG5cbiAgICBkdXN0eS5pZGxlLndpbmRvd1NjYWxlID0gMC4zMjtcbiAgICBkdXN0eS53aW5kb3dYID0gMC4xODtcbiAgICBkdXN0eS53aW5kb3dZID0gLTE7XG5cbiAgICByZXR1cm4gZHVzdHk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEaXBwZXIoKSB7XG4gICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgZGlwcGVyLmZsaXAoKTtcblxuICAgIGRpcHBlci53aW5kb3dYID0gMC43NTtcbiAgICBkaXBwZXIud2luZG93WSA9IC0xO1xuICAgIGRpcHBlci5yb3RhdGlvbiA9IC0wLjQwO1xuXG4gICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSA4NjUvMTM2NjtcbiAgICBkaXBwZXIuaWRsZS5hbmltYXRpb25TY2FsZVggPSAwLjc7XG4gICAgZGlwcGVyLmlkbGUuYW5pbWF0aW9uU2NhbGVZID0gMC43O1xuXG4gICAgZGlwcGVyLmZpbHRlcnNbMF0uYmx1ciA9IDEwO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgSW4gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgdGltZWxpbmVEdXN0eUluID0gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpO1xuXG4gICAgdGltZWxpbmUuYWRkKHRpbWVsaW5lRHVzdHlJbi5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkucGxheSgpLCB0aW1lbGluZUR1c3R5SW4uZHVyYXRpb24oKSk7XG5cbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikucGxheSgpLCAwLjQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC41MixcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SG92ZXIoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDE7XG4gICAgdmFyIGVhc2luZyA9ICdRdWFkLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIHJlcGVhdDogLTFcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYnVtcFk6IC0xNSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYnVtcFk6IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEaXBwZXJJbihkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMDtcbiAgICB2YXIgc3dlZXBTdGFydFRpbWUgPSBhbmltYXRpb25UaW1lICogMC4xMTtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMzAsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksIDApO1xuXG4gICAgLy9zd2VlcCByaWdodFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IDAuODYsXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgc3dlZXBTdGFydFRpbWUpO1xuXG4gICAgLy8gc2NhbGUgdXBcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlci5pZGxlLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICBibHVyOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0ZSBPdXQgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBvbkFuaW1hdGlvbk91dENvbXBsZXRlID0gZnVuY3Rpb24oKXt9O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCkge1xuICAgIHZhciB0aW1lbGluZU91dCA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lT3V0LmFkZChnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpLnBsYXkoKSwgMCk7XG4gICAgdGltZWxpbmVPdXQuYWRkKGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpLnBsYXkoKSwgMCk7XG5cbiAgIHJldHVybiB0aW1lbGluZU91dDtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIuaWRsZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuNCxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjQsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAtMC4zLFxuICAgICAgICB3aW5kb3dYOiAxLjEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZS8yLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjQ7XG4gICAgdmFyIGVhc2luZyA9ICdFeHBvLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGR1c3R5LmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHkuaWRsZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuMyxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjMsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogLTAuMixcbiAgICAgICAgd2luZG93WDogMC43LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBibHVyOiAxMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcbiAgICB9KSxcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZUluLnBsYXkoMCk7XG4gICAgfSxcbiAgICBhbmltYXRlT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZWxpbmVPdXQucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uSW5Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGltZWxpbmVJbi52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFtdLmNvbmNhdChhbmltYXRpb25Nb2R1bGUsIE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZ2V0SW50cm9UZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAnLCAwLCAxMjIpO1xufVxuZnVuY3Rpb24gZ2V0TG9nb1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMCcsIDAsIDcyKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHJ1bm5pbmcgPSB0cnVlO1xudmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbnZhciBzdGFnZSA9IG5ldyBQSVhJLlN0YWdlKDB4NjZGRjk5KTtcbnZhciByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAvLyBhZGQgdGhlIHJlbmRlcmVyIHZpZXcgZWxlbWVudCB0byB0aGUgRE9NXG4gICAgcmVuZGVyZXIudmlldy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3BpeGktaW50cm8nKTtcbiAgICAkKCcjY29udGVudCcpLmFwcGVuZChyZW5kZXJlci52aWV3KTtcblxuICAgIHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0ZSk7XG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgaWYoIXJ1bm5pbmcpIHJldHVybjtcblxuICAgIHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0ZSk7XG5cbiAgICAvLyByZW5kZXIgdGhlIHN0YWdlXG4gICAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIEludHJvIFZpZGVvICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHZpZGVvVGltZWxpbmUsIHZpZGVvO1xuXG52YXIgdmlkZW9Db21wbGV0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG52YXIgYmdDb2xvcnMgPSB7XG4gICAgdG9wTGVmdDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICB0b3A6IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgdG9wUmlnaHQ6IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgYnRtTGVmdDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICBidG06IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgYnRtUmlnaHQ6IG5ldyBQSVhJLkdyYXBoaWNzKClcbn07XG52YXIgaW50cm9WaWRlb0NvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBpbnRyb0ZyYW1lVG9wID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGludHJvRnJhbWVCdG0gPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG52YXIgaW50cm9GcmFtZVRvcEJnO1xudmFyIGludHJvRnJhbWVCdG1CZztcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJhY2tncm91bmRDb2xvcnMoKSB7XG5cbiAgICBfLmVhY2goYmdDb2xvcnMsIGZ1bmN0aW9uKGdyYXBoaWMpIHtcbiAgICAgICAgZ3JhcGhpYy5iZWdpbkZpbGwoMHgwNzA4MEIpO1xuICAgICAgICBncmFwaGljLmxpbmVTdHlsZSgwKTtcblxuICAgICAgICBncmFwaGljLmRyYXdSZWN0KDAsIDAsIDEsIDEpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplSW50cm9GcmFtZVRvcCgpIHtcbiAgICBpbnRyb0ZyYW1lVG9wQmcgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaW50cm8tdG9wLnBuZycpO1xuICAgIGludHJvRnJhbWVUb3BCZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG5cbiAgICBpbnRyb0ZyYW1lVG9wLndpbmRvd1ggPSAuNTtcbiAgICBpbnRyb0ZyYW1lVG9wLndpbmRvd1kgPSAuNTtcblxuICAgIGJnQ29sb3JzLnRvcExlZnQud2luZG93WCA9IC0uNTtcbiAgICBiZ0NvbG9ycy50b3BMZWZ0LndpbmRvd1kgPSAtLjU7XG4gICAgYmdDb2xvcnMudG9wLndpbmRvd1ggPSAtLjU7XG4gICAgYmdDb2xvcnMudG9wLndpbmRvd1kgPSAtLjU7XG5cbiAgICBiZ0NvbG9ycy50b3BSaWdodC53aW5kb3dZID0gLS41O1xuXG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChiZ0NvbG9ycy50b3BMZWZ0KTtcbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGJnQ29sb3JzLnRvcCk7XG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChiZ0NvbG9ycy50b3BSaWdodCk7XG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChpbnRyb0ZyYW1lVG9wQmcpO1xuXG4gICAgaW50cm9GcmFtZVRvcEJnLnNjYWxlTWluID0gMC44O1xuXG4gICAgaW50cm9WaWRlb0NvbnRhaW5lci5hZGRDaGlsZChpbnRyb0ZyYW1lVG9wKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUludHJvRnJhbWVCdG0oKSB7XG4gICAgaW50cm9GcmFtZUJ0bUJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL2ludHJvLWJ0bS5wbmcnKTtcbiAgICBpbnRyb0ZyYW1lQnRtQmcuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDApO1xuXG4gICAgaW50cm9GcmFtZUJ0bS53aW5kb3dYID0gLjU7XG4gICAgaW50cm9GcmFtZUJ0bS53aW5kb3dZID0gLjU7XG5cbiAgICBiZ0NvbG9ycy5idG1MZWZ0LndpbmRvd1ggPSAtLjU7XG4gICAgYmdDb2xvcnMuYnRtLndpbmRvd1ggPSAtLjU7XG5cbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGJnQ29sb3JzLmJ0bUxlZnQpO1xuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoYmdDb2xvcnMuYnRtKTtcbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGJnQ29sb3JzLmJ0bVJpZ2h0KTtcbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGludHJvRnJhbWVCdG1CZyk7XG5cbiAgICBpbnRyb0ZyYW1lQnRtQmcuc2NhbGVNaW4gPSAwLjg7XG5cbiAgICBpbnRyb1ZpZGVvQ29udGFpbmVyLmFkZENoaWxkKGludHJvRnJhbWVCdG0pO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW8oKSB7XG4gICAgdmFyIGludHJvVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0SW50cm9UZXh0dXJlcygpKTtcblxuICAgIGludHJvVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgaW50cm9WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG5cbiAgICBpbnRyb1ZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICBpbnRyb1ZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIHJldHVybiBpbnRyb1ZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICBpbml0aWFsaXplQmFja2dyb3VuZENvbG9ycygpO1xuXG4gICAgc3RhZ2UuYWRkQ2hpbGQoaW50cm9WaWRlb0NvbnRhaW5lcik7XG59KSgpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIExvZ28gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgbG9nbywgbG9nb1RpbWVsaW5lO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplTG9nbygpIHtcbiAgICB2YXIgbG9nbyA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRMb2dvVGV4dHVyZXMoKSk7XG5cbiAgICBsb2dvLndpbmRvd1kgPSAwO1xuICAgIGxvZ28uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuXG4gICAgbG9nby52aXNpYmxlID0gZmFsc2U7XG4gICAgbG9nby5sb29wID0gZmFsc2U7XG5cbiAgICBsb2dvLl90d2VlbkZyYW1lID0gMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobG9nbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbG9nbztcbn1cblxuZnVuY3Rpb24gZ2V0TG9nb0FuaW1hdGlvblRpbWVsaW5lKGxvZ28pIHtcbiAgICB2YXIgZnBzID0gMzI7XG4gICAgdmFyIG51bUZyYW1lcyA9IGxvZ28udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbG9nby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxvZ28udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8obG9nbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgICAgICBjcmVhdGVqcy5Tb3VuZC5wbGF5KCdJbnRyb1ZpZGVvJywge2RlbGF5OiA1MH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgdmlkZW9Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBkZWxheSA9IDA7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIGRlbGF5KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgbG9hZGluZ1NjcmVlbiA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBsb2FkaW5nQmFyID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbnZhciBsb2FkaW5nQmFja2dyb3VuZCA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG52YXIgbG9hZGVyTG9nbyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9wcmVsb2FkZXJfbG9nby5wbmcnKTtcblxuZnVuY3Rpb24gc2V0R3JhcGhpY1NjYWxlKG9iaiwgd2lkdGgsIGhlaWdodCkge1xuICAgIG9iai5zY2FsZS54ID0gb2JqLl9ncmFwaGljU2NhbGUgKiB3aWR0aDtcblxuICAgIGlmKCFfLmlzVW5kZWZpbmVkKGhlaWdodCkpIHtcbiAgICAgICAgb2JqLnNjYWxlLnkgPSBvYmouX2dyYXBoaWNTY2FsZSAqIGhlaWdodDtcbiAgICB9XG59XG5mdW5jdGlvbiBpbml0TG9hZGluZ0JhcigpIHtcbiAgICBsb2FkaW5nQmFyLmJlZ2luRmlsbCgweEMyMDAxQik7XG4gICAgbG9hZGluZ0Jhci5saW5lU3R5bGUoMCk7XG5cbiAgICBsb2FkaW5nQmFyLmRyYXdSZWN0KDAsIDAsIDEsIDE1KTtcblxuICAgIGxvYWRpbmdCYXIuX2dyYXBoaWNTY2FsZSA9IDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvYWRpbmdCYXIsICdncmFwaGljU2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JhcGhpY1NjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY1NjYWxlID0gdmFsO1xuXG4gICAgICAgICAgICBzZXRHcmFwaGljU2NhbGUodGhpcywgJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbG9hZGluZ1NjcmVlbi5hZGRDaGlsZChsb2FkaW5nQmFyKTtcbn1cbmZ1bmN0aW9uIGluaXRMb2FkaW5nQmFja2dyb3VuZCgpIHtcbiAgICBsb2FkaW5nQmFja2dyb3VuZC5iZWdpbkZpbGwoMHgwODA5MEIpO1xuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmxpbmVTdHlsZSgwKTtcbiAgICBsb2FkaW5nQmFja2dyb3VuZC5kcmF3UmVjdCgwLCAwLCAxLCAxKTtcblxuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLl9ncmFwaGljU2NhbGUgPSAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsb2FkaW5nQmFja2dyb3VuZCwgJ2dyYXBoaWNTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFwaGljU2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljU2NhbGUgPSB2YWw7XG5cbiAgICAgICAgICAgIHNldEdyYXBoaWNTY2FsZSh0aGlzLCAkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBsb2FkaW5nQmFja2dyb3VuZC5ncmFwaGljU2NhbGUgPSAxO1xuXG4gICAgbG9hZGluZ1NjcmVlbi5hZGRDaGlsZChsb2FkaW5nQmFja2dyb3VuZCk7XG59XG5cbmZ1bmN0aW9uIGluaXRMb2dvKCkge1xuICAgIGxvYWRlckxvZ28ud2luZG93WCA9IDAuNTtcbiAgICBsb2FkZXJMb2dvLndpbmRvd1kgPSAwLjU7XG5cbiAgICBsb2FkZXJMb2dvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LC41KTtcblxuICAgIGxvYWRpbmdTY3JlZW4uYWRkQ2hpbGQobG9hZGVyTG9nbyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICBpbml0TG9hZGluZ0JhY2tncm91bmQoKTtcbiAgICBpbml0TG9hZGluZ0JhcigpO1xuICAgIGluaXRMb2dvKCk7XG5cbiAgICBzdGFnZS5hZGRDaGlsZChsb2FkaW5nU2NyZWVuKTtcbn0pKCk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiBPbiBXaW5kb3cgUmVzaXplICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgIHVwZGF0ZUxvYWRpbmdTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHVwZGF0ZVZpZGVvQW5kRnJhbWUod2lkdGgsIGhlaWdodCk7XG5cbiAgICBzdGFnZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgcmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xufVxuZnVuY3Rpb24gdXBkYXRlTG9nbyh3aWR0aCwgaGVpZ2h0LCB2aWRlb0hlaWdodCkge1xuICAgIGlmKF8uaXNVbmRlZmluZWQobG9nbykpIHJldHVybjtcblxuICAgIHZhciBib3VuZHMgPSBsb2dvLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICB2YXIgbmV3TG9nb0hlaWdodCA9IChoZWlnaHQgLSB2aWRlb0hlaWdodCkvMjtcbiAgICB2YXIgc2NhbGUgPSBNYXRoLm1pbihuZXdMb2dvSGVpZ2h0Lyhib3VuZHMuaGVpZ2h0IC0gNTUpLCAxKTtcblxuICAgIGxvZ28uc2NhbGUueCA9IHNjYWxlO1xuICAgIGxvZ28uc2NhbGUueSA9IHNjYWxlO1xuXG4gICAgLy9jYWxjIHBvc2l0aW9uXG4gICAgbG9nby53aW5kb3dZID0gbmV3TG9nb0hlaWdodC9oZWlnaHQgLSAwLjU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxvYWRpbmdTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzZXRHcmFwaGljU2NhbGUobG9hZGluZ0Jhciwgd2lkdGgpO1xuICAgIHNldEdyYXBoaWNTY2FsZShsb2FkaW5nQmFja2dyb3VuZCwgd2lkdGgsIGhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVZpZGVvQW5kRnJhbWUod2lkdGgsIGhlaWdodCkge1xuICAgIGlmKF8uaXNVbmRlZmluZWQoaW50cm9GcmFtZVRvcEJnKSkgcmV0dXJuO1xuXG4gICAgdmFyIG1heEhlaWdodCA9IDAuODc7XG4gICAgdmFyIG1heFdpZHRoID0gMC45NTtcblxuICAgIHZhciBsb2NhbEJvdW5kcyA9IGludHJvRnJhbWVUb3BCZy5nZXRMb2NhbEJvdW5kcygpO1xuICAgIHZhciBidG1Cb3VuZHMgPSBpbnRyb0ZyYW1lQnRtQmcuZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgIHZhciBzY2FsZSA9IE1hdGgubWluKG1heEhlaWdodCAqIDAuNSAqIGhlaWdodC9sb2NhbEJvdW5kcy5oZWlnaHQsIG1heFdpZHRoICogd2lkdGgvbG9jYWxCb3VuZHMud2lkdGgpO1xuXG4gICAgLy9rZWVwIHNjYWxlIHdpdGhpbiBvdXIgZGVmaW5lZCBib3VuZHNcbiAgICBzY2FsZSA9IE1hdGgubWF4KGludHJvRnJhbWVUb3BCZy5zY2FsZU1pbiwgTWF0aC5taW4oc2NhbGUsIGludHJvRnJhbWVUb3BCZy5zY2FsZU1heCkpO1xuXG4gICAgdmFyIGJ0bVNjYWxlID0gc2NhbGUgKiBsb2NhbEJvdW5kcy53aWR0aC9idG1Cb3VuZHMud2lkdGg7XG4gICAgdmFyIHZpZGVvU2NhbGUgPSBzY2FsZSAqIDEuMDI0O1xuXG4gICAgaW50cm9GcmFtZVRvcEJnLnNjYWxlLnggPSBzY2FsZTtcbiAgICBpbnRyb0ZyYW1lVG9wQmcuc2NhbGUueSA9IHNjYWxlO1xuXG4gICAgaW50cm9GcmFtZUJ0bUJnLnNjYWxlLnggPSBidG1TY2FsZTtcbiAgICBpbnRyb0ZyYW1lQnRtQmcuc2NhbGUueSA9IGJ0bVNjYWxlO1xuXG4gICAgdmlkZW8uc2NhbGUueCA9IHZpZGVvU2NhbGU7XG4gICAgdmlkZW8uc2NhbGUueSA9IHZpZGVvU2NhbGU7XG5cbiAgICB1cGRhdGVUb3BGcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgbG9jYWxCb3VuZHMud2lkdGggKiBzY2FsZSwgbG9jYWxCb3VuZHMuaGVpZ2h0ICogc2NhbGUpO1xuICAgIHVwZGF0ZUJ0bUZyYW1lQmFja2dyb3VuZCh3aWR0aCwgaGVpZ2h0LCBidG1Cb3VuZHMud2lkdGggKiBzY2FsZSwgYnRtQm91bmRzLmhlaWdodCAqIHNjYWxlKTtcbiAgICB1cGRhdGVMb2dvKHdpZHRoLCBoZWlnaHQsIHZpZGVvU2NhbGUgKiB2aWRlby5nZXRMb2NhbEJvdW5kcygpLmhlaWdodCk7XG59XG5mdW5jdGlvbiB1cGRhdGVUb3BGcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgZnJhbWVXaWR0aCwgZnJhbWVIZWlnaHQpIHtcbiAgICB2YXIgc2lkZVdpZHRoID0gKHdpZHRoLWZyYW1lV2lkdGgpLzIgKyBmcmFtZVdpZHRoICogMTAwLzk3NTtcbiAgICB2YXIgdG9wSGVpZ2h0ID0gKGhlaWdodC8yLWZyYW1lSGVpZ2h0KSArIGZyYW1lSGVpZ2h0ICogMTAwLzMyNjtcblxuICAgIGJnQ29sb3JzLnRvcExlZnQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy50b3BMZWZ0LnNjYWxlLnkgPSBoZWlnaHQvMjtcblxuICAgIGJnQ29sb3JzLnRvcC5zY2FsZS54ID0gd2lkdGg7XG4gICAgYmdDb2xvcnMudG9wLnNjYWxlLnkgPSB0b3BIZWlnaHQ7XG5cbiAgICBiZ0NvbG9ycy50b3BSaWdodC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LnNjYWxlLnkgPSBoZWlnaHQvMjtcbiAgICBiZ0NvbG9ycy50b3BSaWdodC53aW5kb3dYID0gKHdpZHRoLXNpZGVXaWR0aCkvd2lkdGggLSAwLjU7XG59XG5mdW5jdGlvbiB1cGRhdGVCdG1GcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgZnJhbWVXaWR0aCwgZnJhbWVIZWlnaHQpIHtcbiAgICB2YXIgc2lkZVdpZHRoID0gKHdpZHRoLWZyYW1lV2lkdGgpLzIgKyBmcmFtZVdpZHRoICogMTAwLzk3NTtcbiAgICB2YXIgYnRtSGVpZ2h0ID0gKGhlaWdodC8yLWZyYW1lSGVpZ2h0KSArIGZyYW1lSGVpZ2h0ICogMTAwLzMyNjtcblxuICAgIGJnQ29sb3JzLmJ0bUxlZnQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy5idG1MZWZ0LnNjYWxlLnkgPSBoZWlnaHQvMjtcblxuICAgIGJnQ29sb3JzLmJ0bS5zY2FsZS54ID0gd2lkdGg7XG4gICAgYmdDb2xvcnMuYnRtLnNjYWxlLnkgPSBidG1IZWlnaHQ7XG4gICAgYmdDb2xvcnMuYnRtLndpbmRvd1kgPSAoaGVpZ2h0LWJ0bUhlaWdodCkvaGVpZ2h0IC0gMC41O1xuXG4gICAgYmdDb2xvcnMuYnRtUmlnaHQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy5idG1SaWdodC5zY2FsZS55ID0gaGVpZ2h0LzI7XG4gICAgYmdDb2xvcnMuYnRtUmlnaHQud2luZG93WCA9ICh3aWR0aC1zaWRlV2lkdGgpL3dpZHRoIC0gMC41O1xufVxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG4gICAgfSxcbiAgICBnZXRJbnRyb0ZyYW1lczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGludHJvRnJhbWVUb3AsXG4gICAgICAgICAgICBidG06IGludHJvRnJhbWVCdG1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgdXBkYXRlTG9hZGVyOiBmdW5jdGlvbihwZXJjZW50LCB0aW1lRWxhcHNlZCkge1xuICAgICAgICB2YXIgb2xkWCA9IGxvYWRpbmdCYXIuZ3JhcGhpY1NjYWxlO1xuICAgICAgICB2YXIgbmV3WCA9IHBlcmNlbnQ7XG5cbiAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSB0aW1lRWxhcHNlZC8xMDAwICogKG5ld1ggLSBvbGRYKS9uZXdYO1xuXG4gICAgICAgIFR3ZWVuTGl0ZS50byhsb2FkaW5nQmFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICBncmFwaGljU2NhbGU6IG5ld1hcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW8gPSBpbml0aWFsaXplVmlkZW8oKTtcbiAgICAgICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKTtcbiAgICAgICAgbG9nbyA9IGluaXRpYWxpemVMb2dvKCk7XG4gICAgICAgIGxvZ29UaW1lbGluZSA9IGdldExvZ29BbmltYXRpb25UaW1lbGluZShsb2dvKTtcblxuICAgICAgICBpbnRyb1ZpZGVvQ29udGFpbmVyLmFkZENoaWxkKHZpZGVvKTtcblxuICAgICAgICBpbml0aWFsaXplSW50cm9GcmFtZVRvcCgpO1xuICAgICAgICBpbml0aWFsaXplSW50cm9GcmFtZUJ0bSgpO1xuXG4gICAgICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQobG9nbyk7XG5cbiAgICAgICAgb25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8obG9hZGluZ1NjcmVlbiwgMC40LCB7XG4gICAgICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoc2VsZi5wbGF5VmlkZW8uYmluZChzZWxmKSwgNjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgNjAwKTtcbiAgICB9KSxcbiAgICBzaG93TG9nbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvZ29UaW1lbGluZS5wbGF5KCk7XG4gICAgfSxcbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuICAgICAgICBsb2dvLmRlc3Ryb3koKTtcblxuICAgICAgICBpbnRyb1ZpZGVvQ29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgaW50cm9GcmFtZVRvcCA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVCdG0gPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lVG9wQmcgPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lQnRtQmcgPSBudWxsO1xuXG4gICAgICAgIHN0YWdlID0gbnVsbDtcbiAgICAgICAgcmVuZGVyZXIgPSBudWxsO1xuICAgICAgICB2aWRlbyA9IG51bGw7XG4gICAgICAgIGxvZ28gPSBudWxsO1xuXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAkKCcjcGl4aS1pbnRybycpLnJlbW92ZSgpO1xuXG4gICAgICAgICR3aW5kb3cub2ZmKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG4gICAgfVxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcbnZhciBhbmltYXRpb25UaW1lID0gMC40O1xuXG5cblxudmFyIHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnMgPSBbXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXRSb3RhdGUpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgZmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tVG9wKSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dFJvdGF0ZSldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tVG9wKSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldXG5dO1xuXG52YXIgY2FubmVkQW5pbWF0aW9uUGFpcnMgPSBbXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXVxuXTtcblxuXG5cbmZ1bmN0aW9uIHN0YWdnZXJJdGVtcygkaXRlbXMpIHtcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIHR3ZWVuczogXy5tYXAoJGl0ZW1zLCB0aGlzKSxcbiAgICAgICAgc3RhZ2dlcjogMC4wN1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKiBJbmRpdmlkdWFsIEFuaW1hdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGZhZGVJbigkaXRlbSwgcHJvcCwgZGlzdGFuY2UsIGVhc2luZykge1xuICAgIHZhciBmcm9tID0ge29wYWNpdHk6IDB9O1xuICAgIGZyb21bcHJvcF0gPSBkaXN0YW5jZTtcblxuICAgIHZhciB0byA9IHtvcGFjaXR5OiAxLCBlYXNlOiBlYXNpbmd9O1xuICAgIHRvW3Byb3BdID0gMDtcblxuICAgIHJldHVybiBUd2VlbkxpdGUuZnJvbVRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCBmcm9tLCB0byk7XG59XG5mdW5jdGlvbiBmYWRlSW5Ob01vdmVtZW50KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCAwLCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gZmFkZUluRnJvbVJpZ2h0KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCA3NSwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbkZyb21Ub3AoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneScsIC03NSwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUZhZGVJbkZyb21SaWdodCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgNzUsICdCYWNrLmVhc2VPdXQnKTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUZhZGVJbkZyb21Ub3AoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneScsIC03NSwgJ0JhY2suZWFzZU91dCcpO1xufVxuZnVuY3Rpb24gcm90YXRlSW5MZWZ0KCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS5mcm9tVG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtyb3RhdGlvblk6IC05MCwgdHJhbnNmb3JtT3JpZ2luOlwibGVmdCA1MCUgLTEwMFwifSwge3JvdGF0aW9uWTogMH0pO1xufVxuXG5mdW5jdGlvbiBzbmFwT3V0KCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50bygkaXRlbSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDAsIHNjYWxlOiAwLjQsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCUgMFwiLCBlYXNlOiAnQmFjay5lYXNlSW4nfSk7XG59XG5mdW5jdGlvbiBzbmFwT3V0Um90YXRlKCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50bygkaXRlbSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDAsIHNjYWxlOiAwLjQsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCUgMFwiLCByb3RhdGlvbjogLTQ1LCBlYXNlOiAnQmFjay5lYXNlSW4nfSk7XG59XG5cblxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBnZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnM6IGZ1bmN0aW9uKCRpdGVtcykge1xuICAgICAgICB2YXIgaSA9IF8ucmFuZG9tKHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnNbaV0sIGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgICAgcmV0dXJuIGZuYygkaXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldFJhbmRvbUNhbm5lZEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCRpdGVtcykge1xuICAgICAgICB2YXIgaSA9IF8ucmFuZG9tKGNhbm5lZEFuaW1hdGlvblBhaXJzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChjYW5uZWRBbmltYXRpb25QYWlyc1tpXSwgZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZm5jKCRpdGVtcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHBhcmFjaHV0ZXJzLCBwYXJhY2h1dGVyc0NvbnRhaW5lcjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBwYXJhY2h1dGVycyA9IF8uc2h1ZmZsZShbZ2V0QmxhY2tvdXQoKSwgZ2V0RHJpcCgpLCBnZXREeW5hbWl0ZSgpXSk7XG5cbiAgICBfLmVhY2gocGFyYWNodXRlcnMsIGZ1bmN0aW9uKHBhcmFjaHV0ZXIpIHtcbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDA7XG5cbiAgICAgICAgcGFyYWNodXRlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1ggPSAwLjU7XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WSA9IC0xO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0QmxhY2tvdXQoKSB7XG4gICAgdmFyIGJsYWNrb3V0SWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIik7XG4gICAgYmxhY2tvdXRJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAyNi82MSxcbiAgICAgICAgeTogMzMvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0JsYWNrb3V0JywgYmxhY2tvdXRJZGxlU3RhdGUpO1xufVxuZnVuY3Rpb24gZ2V0RHJpcCgpIHtcbiAgICB2YXIgZHJpcElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHJpcC5wbmdcIik7XG4gICAgZHJpcElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDM2LzYxLFxuICAgICAgICB5OiAyNi85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignRHJpcCcsIGRyaXBJZGxlU3RhdGUpO1xufVxuZnVuY3Rpb24gZ2V0RHluYW1pdGUoKSB7XG4gICAgdmFyIGR5bmFtaXRlSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9keW5hbWl0ZS5wbmdcIik7XG4gICAgZHluYW1pdGVJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAyNy82MSxcbiAgICAgICAgeTogMzAvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0R5bmFtaXRlJywgZHluYW1pdGVJZGxlU3RhdGUpO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGFuaW1hdGVQYXJhY2h1dGVyKHBhcmFjaHV0ZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDM1O1xuXG4gICAgdmFyIGRlcHRoID0gTWF0aC5yYW5kb20oKSAqIDU7XG4gICAgdmFyIHggPSAwLjEgKyAoTWF0aC5yYW5kb20oKSAqIDAuOCk7XG4gICAgdmFyIHNjYWxlID0gMSAtIGRlcHRoICogMC4yLzU7XG5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4ocGFyYWNodXRlcik7XG4gICAgcGFyYWNodXRlci53aW5kb3dYID0geDtcblxuICAgIHZhciByb3RhdGlvbiA9IDAuMztcblxuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDEsXG4gICAgICAgIGVhc2U6ICdTaW5lLmVhc2VPdXQnLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBhcmFjaHV0ZXIudmlzaWJpbGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGFyYWNodXRlci5zY2FsZSA9IHt4OiBzY2FsZSwgeTogc2NhbGV9O1xuICAgIHBhcmFjaHV0ZXIuZmlsdGVyc1swXS5ibHVyID0gZGVwdGggKiAzLzU7XG4gICAgcGFyYWNodXRlci5yb3RhdGlvbiA9IHJvdGF0aW9uO1xuXG4gICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pO1xufVxuZnVuY3Rpb24gc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pIHtcbiAgICB2YXIgc3dheVRpbWUgPSAxLjI7XG4gICAgdmFyIGRlYyA9IDAuMDM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgcm90YXRpb246IC1yb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCdcbiAgICB9KTtcbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0JyxcbiAgICAgICAgZGVsYXk6IHN3YXlUaW1lLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKHJvdGF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uIC0gZGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICAgICAgICBfLmVhY2gocGFyYWNodXRlcnMsIF8uYmluZChwYXJhY2h1dGVyc0NvbnRhaW5lci5hZGRDaGlsZCwgcGFyYWNodXRlcnNDb250YWluZXIpKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZChwYXJhY2h1dGVyc0NvbnRhaW5lcik7XG4gICAgfSksXG4gICAgYW5pbWF0ZU5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihwYXJhY2h1dGVycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgYW5pbWF0ZVBhcmFjaHV0ZXIocGFyYWNodXRlcnMuc2hpZnQoKSk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIF8uZWFjaChwYXJhY2h1dGVycywgZnVuY3Rpb24ocGFyYWNodXRlcikge1xuICAgICAgICAgICAgcGFyYWNodXRlci5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFthbmltYXRpb25Nb2R1bGVdLmNvbmNhdChPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgdmFyIGhlaWdodCA9IGNoYXJhY3Rlci5zY2FsZS55ICogY2hhcmFjdGVyLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xuXG4gICAgY2hhcmFjdGVyLndpbmRvd1kgPSAtKGhlaWdodC8yKS8kKHdpbmRvdykuaGVpZ2h0KCk7XG59OyIsIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi4vcGl4aS9hbGxDaGFyYWN0ZXJzJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxudmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxudmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG52YXIgbGV0dGVyQmc7XG5cbmZ1bmN0aW9uIGdldE9mZnNjcmVlblgoY2hhcmFjdGVyKSB7XG4gICAgdmFyIHdpZHRoID0gY2hhcmFjdGVyLmdldEJvdW5kcygpLndpZHRoO1xuICAgIHZhciBhbmNob3JYID0gY2hhcmFjdGVyLmlkbGUuYW5jaG9yLng7XG4gICAgdmFyIHdpbmRvd1dpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuXG4gICAgcmV0dXJuICh3aW5kb3dXaWR0aCArIGFuY2hvclgqd2lkdGgpL3dpbmRvd1dpZHRoO1xufVxuXG5cbnZhciBhbmltYXRlSW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjI7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eURhcms7XG5cbiAgICAgICAgICAgIGR1c3R5LnB1c2hUb1RvcCgpO1xuICAgICAgICAgICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzc7XG4gICAgICAgICAgICBkdXN0eS53aW5kb3dYID0gMC4yO1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC43MSxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjIzLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG5cbiAgICAgICAgICAgIGJsYWRlLnB1c2hUb1RvcCgpO1xuICAgICAgICAgICAgYmxhZGUuaWRsZS53aW5kb3dTY2FsZSA9IDAuNTtcbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1ggPSAwLjM7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oYmxhZGUpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjc0LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FiYmllOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcblxuICAgICAgICAgICAgY2FiYmllLnB1c2hUb1RvcCgpO1xuICAgICAgICAgICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjY7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2FiYmllKTtcbiAgICAgICAgICAgIGNhYmJpZS53aW5kb3dYID0gMC4zNTtcbiAgICAgICAgICAgIGNhYmJpZS5yb3RhdGlvbiA9IDA7XG4gICAgICAgICAgICBjYWJiaWUuZmlsdGVyc1swXS5ibHVyID0gMDtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTgsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBkaXBwZXIucHVzaFRvVG9wKCk7XG4gICAgICAgICAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgZGlwcGVyLndpbmRvd1ggPSAwLjQ7XG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueCA9IC0xO1xuICAgICAgICAgICAgZGlwcGVyLnJvdGF0aW9uID0gMDtcbiAgICAgICAgICAgIGRpcHBlci5maWx0ZXJzWzBdLmJsdXIgPSAwO1xuXG4gICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNjUsXG4gICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI5LFxuICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aW5kbGlmdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgICAgICAgICB3aW5kbGlmdGVyLnB1c2hUb1RvcCgpO1xuICAgICAgICAgICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC40NTtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbih3aW5kbGlmdGVyKTtcbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIud2luZG93WCA9IDAuNTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE3LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjcsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVhbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eUZvdXI7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuICAgICAgICAgICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllVHdvO1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIHByZVRlYW1BbmltYXRpb25TZXR1cChkdXN0eSwgYmxhZGUsIGNhYmJpZSwgZGlwcGVyLCB3aW5kbGlmdGVyKTtcblxuXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fiBBbmltYXRpb24gU3RhcnQgTGFiZWxzIH5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdEdXN0eScsIDApO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkTGFiZWwoJ0JsYWRlJywgYW5pbWF0aW9uVGltZSAqIDAuMTUpO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkTGFiZWwoJ0RpcHBlcicsIGFuaW1hdGlvblRpbWUgKiAwLjMpO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkTGFiZWwoJ0NhYmJpZScsIGFuaW1hdGlvblRpbWUgKiAwLjQ1KTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdXaW5kbGlmdGVyJywgYW5pbWF0aW9uVGltZSAqIDAuNik7XG5cblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNTIsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAnRHVzdHknKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuODcsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC40NixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAnQmxhZGUnKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE2LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ0RpcHBlcicpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuODUsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksICdDYWJiaWUnKTtcblxuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjA4LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAnV2luZGxpZnRlcicpO1xuXG5cblxuICAgICAgICAgICAgdGltZWxpbmUucGxheSgpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmZ1bmN0aW9uIHByZVRlYW1BbmltYXRpb25TZXR1cChkdXN0eSwgYmxhZGUsIGNhYmJpZSwgZGlwcGVyLCB3aW5kbGlmdGVyKSB7XG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IER1c3R5IH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgZHVzdHkud2luZG93WCA9IDAuMztcbiAgICBkdXN0eS5pZGxlLndpbmRvd1NjYWxlID0gMC4zMjtcbiAgICBkdXN0eS5yb3RhdGlvbiA9IDAuNDg7XG4gICAgZHVzdHkuc2V0U3RhdGljKCk7XG4gICAgZHVzdHkucHVzaFRvVG9wKCk7XG5cblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihibGFkZSk7XG4gICAgYmxhZGUud2luZG93WCA9IDAuNjtcbiAgICBibGFkZS5pZGxlLndpbmRvd1NjYWxlID0gMC4zNDtcbiAgICBibGFkZS5zZXRTdGF0aWMoKTtcblxuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgZGlwcGVyLndpbmRvd1ggPSAwO1xuICAgIGRpcHBlci5yb3RhdGlvbiA9IDAuMDg7XG4gICAgZGlwcGVyLnNldFN0YXRpYygpO1xuXG5cbiAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAxIC0gZ2V0T2Zmc2NyZWVuWCh3aW5kbGlmdGVyKTtcbiAgICB3aW5kbGlmdGVyLndpbmRvd1kgPSAwLjE7XG4gICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC4xNDtcbiAgICB3aW5kbGlmdGVyLnNldFN0YXRpYygpO1xuXG5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2FiYmllKTtcbiAgICBjYWJiaWUud2luZG93WCA9IDAuNjtcbiAgICBjYWJiaWUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMjI7XG4gICAgY2FiYmllLnNldFN0YXRpYygpO1xufVxuXG5mdW5jdGlvbiBhZGRMZXR0ZXJCZyhzY2VuZSkge1xuICAgIGxldHRlckJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL3Jlc3BvbnNlX2xldHRlcl9iZy5qcGcnKTtcblxuICAgIGxldHRlckJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAuNSk7XG4gICAgbGV0dGVyQmcud2luZG93WCA9IDAuNTtcbiAgICBsZXR0ZXJCZy53aW5kb3dZID0gMC41O1xuXG4gICAgbGV0dGVyQmcudmlzaWJsZSA9IGZhbHNlO1xuXG5cblxuICAgIHNjZW5lLmFkZENoaWxkKGxldHRlckJnKTtcbn1cblxuZnVuY3Rpb24gcHVzaFRvVG9wKHNwcml0ZSkge1xuICAgIHZhciBsZW5ndGggPSBzcHJpdGUucGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcbiAgICBzcHJpdGUucGFyZW50LmFkZENoaWxkQXQoc3ByaXRlLCBsZW5ndGgtMSk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYW5pbWF0ZUluOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgcHVzaFRvVG9wKGxldHRlckJnKTtcbiAgICAgICAgbGV0dGVyQmcudmlzaWJsZSA9IHRydWU7XG5cbiAgICAgICAgYW5pbWF0ZUluW2NoYXJhY3Rlcl0oKTtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGFkZExldHRlckJnKHNjZW5lKTtcbiAgICB9XG59OyIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9xdWVzdGlvbicpO1xuXG5cbnZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IFF1ZXN0aW9uXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbGxlY3Rpb247IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gcmVxdWlyZSgnLi9RdWVzdGlvbkNvbGxlY3Rpb24nKTtcblxuICAgIHZhciBjaGFyYWN0ZXJTZWxlY3QgPSByZXF1aXJlKCcuLi9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uJyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24nKTtcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24nKTtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKG51bSkge1xuICAgICAgICByZXR1cm4gXy5maXJzdChfLnNodWZmbGUocGVyc29uYWxpdHlRdWVzdGlvbkRhdGEucXVlc3Rpb25zKSwgbnVtKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGdldEVtcHR5Q2FubmVkUXVlc3Rpb25zKG51bSkge1xuICAgICAgICByZXR1cm4gXy5tYXAoXy5yYW5nZShudW0pLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBjYW5uZWRRdWVzdGlvbkRhdGEuY2xhc3MsXG4gICAgICAgICAgICAgICAgY29weTogY2FubmVkUXVlc3Rpb25EYXRhLmNvcHksXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Nhbm5lZC1xdWVzdGlvbicgKyBpLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cblxuXG4gICAgdmFyIGFsbFF1ZXN0aW9ucyA9IG5ldyBRdWVzdGlvbkNvbGxlY3Rpb24oKTtcblxuXG4gICAgLy9zaHVmZmxlIHF1ZXN0aW9ucyBhbmQgcGljayAzXG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25zID0gZ2V0UmFuZG9tUGVyc29uYWxpdHlRdWVzdGlvbnMoMyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9ucyA9IGdldEVtcHR5Q2FubmVkUXVlc3Rpb25zKDMpO1xuXG5cbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNoYXJhY3RlclNlbGVjdCk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChwZXJzb25hbGl0eVF1ZXN0aW9ucyk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChjYW5uZWRRdWVzdGlvbnMpO1xuXG5cblxuICAgIGZ1bmN0aW9uIGZpbHRlclVudXNlZChvcHRpb25zLCB1c2VkKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcihvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VkLmluZGV4T2Yob3B0aW9uLnZhbHVlKSA9PT0gLTE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFsbFF1ZXN0aW9ucy5nZXRVbnVzZWRDYW5uZWRPcHRpb25zID0gZnVuY3Rpb24obnVtLCB1c2VkKSB7XG4gICAgICAgIHZhciBwb3NzaWJsZU9wdGlvbnMgPSBfLnNodWZmbGUoZmlsdGVyVW51c2VkKGNhbm5lZFF1ZXN0aW9uRGF0YS5vcHRpb25zLCB1c2VkKSk7XG5cbiAgICAgICAgcmV0dXJuIF8uZmlyc3QocG9zc2libGVPcHRpb25zLCBudW0pO1xuICAgIH07XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gYWxsUXVlc3Rpb25zO1xufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ0b3RhbFNpemVcIjogMjY3MTU2NzksXG5cdFwiYXNzZXRzXCI6IHtcblx0XHRcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCI6IDI1MDYsXG5cdFx0XCJhc3NldHMvaW1nL2J1dHRvbi5wbmdcIjogNzU0NCxcblx0XHRcImFzc2V0cy9pbWcvZHJpcC5wbmdcIjogMzI4OCxcblx0XHRcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCI6IDI0MjAsXG5cdFx0XCJhc3NldHMvaW1nL2Zvb3Rlci5wbmdcIjogNDMzOTgsXG5cdFx0XCJhc3NldHMvaW1nL2ZvcmVncm91bmRfdHJlZXMucG5nXCI6IDExNTcxNCxcblx0XHRcImFzc2V0cy9pbWcvaGVhZGVyLnBuZ1wiOiA5MTEzOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYmFzZWJhbGwucG5nXCI6IDE0Mjk3LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibGFkZV9yYW5nZXIucG5nXCI6IDE1MzA4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibHVlLnBuZ1wiOiAxMDc0OSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYnJvY2NvbGkucG5nXCI6IDE0MDQ1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYWJiaWUucG5nXCI6IDE4OTgxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYW5uZWQtYnRuLnBuZ1wiOiAxMjQ3Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZGlwcGVyLnBuZ1wiOiAxODkyMyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZHVzdHkucG5nXCI6IDIwMzI4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9mb290YmFsbC5wbmdcIjogMTM2MjksXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2ZyaWVzLnBuZ1wiOiAxMTkyOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZ3JlZW4ucG5nXCI6IDEwNzQ3LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ob2NrZXkucG5nXCI6IDEzMDUyLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9pY2VjcmVhbS5wbmdcIjogMTI0NDIsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL251Z2dldHMucG5nXCI6IDEzMzQ3LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9vcmFuZ2UucG5nXCI6IDEwNzI0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wYmoucG5nXCI6IDEyMzg0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9waXp6YS5wbmdcIjogMTM3NjUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3ByaW50ZXIucG5nXCI6IDQxMyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcHVycGxlLnBuZ1wiOiAxMDc4NCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcmFjaW5nLnBuZ1wiOiAxMTQ5MSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcmVkLnBuZ1wiOiAxMDY1Myxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvc2VuZC1idG4ucG5nXCI6IDk5MjEsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3NvY2Nlci5wbmdcIjogMTUxODksXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3N3aW1fZGl2ZS5wbmdcIjogMTE0MjgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3RoZV90ZWFtLnBuZ1wiOiAxNzA5Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdm9sdW1lLnBuZ1wiOiAxNjMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3dpbmRsaWZ0ZXIucG5nXCI6IDE2ODIyLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy95ZWxsb3cucG5nXCI6IDEwNjcyLFxuXHRcdFwiYXNzZXRzL2ltZy9pbi10aGVhdGVycy5wbmdcIjogMjk2Nyxcblx0XHRcImFzc2V0cy9pbWcvaW4tdGhlYXRyZXMzZC5wbmdcIjogNTE5MCxcblx0XHRcImFzc2V0cy9pbWcvaW50cm8tYnRtLnBuZ1wiOiAxOTA4MTMsXG5cdFx0XCJhc3NldHMvaW1nL2ludHJvLXRvcC5wbmdcIjogMTg5MjE2LFxuXHRcdFwiYXNzZXRzL2ltZy9sb2dvLnBuZ1wiOiAxMjkxMjgsXG5cdFx0XCJhc3NldHMvaW1nL21pZGdyb3VuZC5wbmdcIjogNjQ2ODksXG5cdFx0XCJhc3NldHMvaW1nL3BnLnBuZ1wiOiAxNTUyLFxuXHRcdFwiYXNzZXRzL2ltZy9wcmVsb2FkZXJfbG9nby5wbmdcIjogMTMwMzg5LFxuXHRcdFwiYXNzZXRzL2ltZy9wcmludC5wbmdcIjogMjc1MSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfYmxhZGUuanBnXCI6IDE5MDI4NSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfY2FiYmllLmpwZ1wiOiAyNzA4MzgsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2RpcHBlci5qcGdcIjogNDQzOTE5LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kdXN0eS5qcGdcIjogMTk3NjQyLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ190ZWFtLmpwZ1wiOiA0MjY5OTksXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX3dpbmRsaWZ0ZXIuanBnXCI6IDIyMTk0OSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfbGV0dGVyX2JnLmpwZ1wiOiA3NTcxMyxcblx0XHRcImFzc2V0cy9pbWcvc2VuZE1vcmUucG5nXCI6IDEyMzMxLFxuXHRcdFwiYXNzZXRzL2ltZy9zaXRlX2JnLmpwZ1wiOiAxODQwNTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDAyLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMy5wbmdcIjogNTQ0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDQucG5nXCI6IDk5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA1LnBuZ1wiOiAxMzkwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDYucG5nXCI6IDkwMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA3LnBuZ1wiOiAxMTUzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDgucG5nXCI6IDE0MTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwOS5wbmdcIjogMTU2MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDEwLnBuZ1wiOiAxNjM5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTEucG5nXCI6IDE4NzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMi5wbmdcIjogMTk1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDEzLnBuZ1wiOiAyMDQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTQucG5nXCI6IDIwNzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxNS5wbmdcIjogMjA4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE2LnBuZ1wiOiAyMjU4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTcucG5nXCI6IDI0NDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxOC5wbmdcIjogMjUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE5LnBuZ1wiOiAyNzQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjAucG5nXCI6IDI4OTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyMS5wbmdcIjogMzA0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIyLnBuZ1wiOiAzMTYwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjMucG5nXCI6IDMzMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNC5wbmdcIjogMzQ4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI1LnBuZ1wiOiAzNjI5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjYucG5nXCI6IDM3NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNy5wbmdcIjogMzg0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI4LnBuZ1wiOiAzOTQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjkucG5nXCI6IDQwMjgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMC5wbmdcIjogNDA3OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDMxLnBuZ1wiOiA0MDg0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzIucG5nXCI6IDQxMTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMy5wbmdcIjogNDE3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM0LnBuZ1wiOiA0MjA5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzUucG5nXCI6IDQxMDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNi5wbmdcIjogNDE1OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM3LnBuZ1wiOiA0MjMwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzgucG5nXCI6IDQyOTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzOS5wbmdcIjogNDM2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQwLnBuZ1wiOiA0NDQzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDEucG5nXCI6IDQ1MjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0Mi5wbmdcIjogNDU0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQzLnBuZ1wiOiA0NTk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDQucG5nXCI6IDQ2NjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0NS5wbmdcIjogNDcxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ2LnBuZ1wiOiA0Nzc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDcucG5nXCI6IDQ4NzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0OC5wbmdcIjogNDk0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ5LnBuZ1wiOiA0OTcxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTAucG5nXCI6IDUwOTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1MS5wbmdcIjogNTEyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUyLnBuZ1wiOiA1MjExLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTMucG5nXCI6IDUzMDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1NC5wbmdcIjogODE0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU1LnBuZ1wiOiAxNDU0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU2LnBuZ1wiOiAyMTMwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU3LnBuZ1wiOiAzMTA1Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU4LnBuZ1wiOiAzNjcyMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU5LnBuZ1wiOiA0MTc0OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYwLnBuZ1wiOiA0MzA3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYxLnBuZ1wiOiAzODExOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYyLnBuZ1wiOiAzMTI1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYzLnBuZ1wiOiAzMzg2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY0LnBuZ1wiOiAzMjMyOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY1LnBuZ1wiOiAzMTU4Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY2LnBuZ1wiOiAzMTU0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY3LnBuZ1wiOiAzMTcyMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY4LnBuZ1wiOiAzMTczMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY5LnBuZ1wiOiAzMTc3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcwLnBuZ1wiOiAzMTM5OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcxLnBuZ1wiOiAzMTMyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcyLnBuZ1wiOiAzMTQxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDczLnBuZ1wiOiAzMTU4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc0LnBuZ1wiOiAzMTM2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc1LnBuZ1wiOiAzMTU1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc2LnBuZ1wiOiAzMTY2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc3LnBuZ1wiOiAzMTYwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc4LnBuZ1wiOiAyNzM3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc5LnBuZ1wiOiAzODEzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgwLnBuZ1wiOiA0OTUxMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgxLnBuZ1wiOiA1NTU1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgyLnBuZ1wiOiA1NTQyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgzLnBuZ1wiOiA2MzQ0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg0LnBuZ1wiOiA1NTgwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg1LnBuZ1wiOiAzMjEwMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg2LnBuZ1wiOiAzNTExMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg3LnBuZ1wiOiAyNDQ3Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg4LnBuZ1wiOiAyNDczNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg5LnBuZ1wiOiAyNzIzMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkwLnBuZ1wiOiAzMTkwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkxLnBuZ1wiOiAzNzg4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkyLnBuZ1wiOiA0MTU4OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkzLnBuZ1wiOiA0NDk1NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk0LnBuZ1wiOiA0Njg3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk1LnBuZ1wiOiAzNTk3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk2LnBuZ1wiOiAyODM2NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk3LnBuZ1wiOiAyNDkzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk4LnBuZ1wiOiAyMzA5Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk5LnBuZ1wiOiAyMDMzNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAwLnBuZ1wiOiAyMDk2NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAxLnBuZ1wiOiAxNjg0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAyLnBuZ1wiOiAxODMxMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAzLnBuZ1wiOiAxOTY3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA0LnBuZ1wiOiAyMjI4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA1LnBuZ1wiOiAyNDc2Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA2LnBuZ1wiOiAyNTMxOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA3LnBuZ1wiOiAyNjg3NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA4LnBuZ1wiOiAyNjE0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA5LnBuZ1wiOiAyOTMwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEwLnBuZ1wiOiAzMzg3Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTExLnBuZ1wiOiAzNjkxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEyLnBuZ1wiOiA0MDkyNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEzLnBuZ1wiOiA0NDQwMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE0LnBuZ1wiOiA0NjEyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE1LnBuZ1wiOiA0Mzk0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE2LnBuZ1wiOiA0NzQ4NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE3LnBuZ1wiOiA2OTEzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE4LnBuZ1wiOiAyNjY2MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE5LnBuZ1wiOiAzMDU0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTIwLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEyMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDIzMTA3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDEucG5nXCI6IDIzODc3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDIzMzg4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDIzMzc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDQucG5nXCI6IDIzNjMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDIzNDE2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDIzMjQzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDcucG5nXCI6IDIzNjU2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDIzNTMwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDIzMTEwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTAucG5nXCI6IDI0MjI5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDIzMDk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAwLnBuZ1wiOiA1Mjk4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMS5wbmdcIjogNTUzNTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDIucG5nXCI6IDU0NDE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAzLnBuZ1wiOiA1NTU1OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNC5wbmdcIjogNTI5ODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDUucG5nXCI6IDU1MzU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA2LnBuZ1wiOiA1NDQxNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNy5wbmdcIjogNTU1NTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDgucG5nXCI6IDUyOTg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA5LnBuZ1wiOiA1NTM1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAxMC5wbmdcIjogNTQ0MTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTEucG5nXCI6IDU1NTU5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwMC5wbmdcIjogMjk0MDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDAxLnBuZ1wiOiAzMDEzMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDIucG5nXCI6IDMwMDkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwMy5wbmdcIjogMzAzNjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDA0LnBuZ1wiOiAyOTQwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDUucG5nXCI6IDMwMTMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwNi5wbmdcIjogMzAwOTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDA3LnBuZ1wiOiAzMDM2Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDgucG5nXCI6IDI5NDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwOS5wbmdcIjogMzAxMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDEwLnBuZ1wiOiAzMDA5MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMTEucG5nXCI6IDMwMzYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAwLnBuZ1wiOiA0Mjg2MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMS5wbmdcIjogNDIxMDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDIucG5nXCI6IDQzODg5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAzLnBuZ1wiOiA0NDg1OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNC5wbmdcIjogNDI4NjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDUucG5nXCI6IDQyMTAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA2LnBuZ1wiOiA0Mzg4OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNy5wbmdcIjogNDQ4NTgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDgucG5nXCI6IDQyODYxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA5LnBuZ1wiOiA0MjEwMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMC5wbmdcIjogNDM4ODksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTEucG5nXCI6IDQ0ODU4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMC5wbmdcIjogNDIyMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDAxLnBuZ1wiOiA0MTg4Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDIucG5nXCI6IDQxODQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMy5wbmdcIjogNDIwODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA0LnBuZ1wiOiA0MjIwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDUucG5nXCI6IDQxODg3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNi5wbmdcIjogNDE4NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA3LnBuZ1wiOiA0MjA4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDgucG5nXCI6IDQyMjA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwOS5wbmdcIjogNDE4ODcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDEwLnBuZ1wiOiA0MTg0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMTEucG5nXCI6IDQyMDg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMC5wbmdcIjogMzcyNDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDAxLnBuZ1wiOiAzNzIzNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDIucG5nXCI6IDM3NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMy5wbmdcIjogMzcyOTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA0LnBuZ1wiOiAzNzI0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDUucG5nXCI6IDM3MjM3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNi5wbmdcIjogMzc1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA3LnBuZ1wiOiAzNzI5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDgucG5nXCI6IDM3MjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwOS5wbmdcIjogMzcyMzcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDEwLnBuZ1wiOiAzNzUwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMTEucG5nXCI6IDM3Mjk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDAucG5nXCI6IDM3NzQyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDEucG5nXCI6IDM4MTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDIucG5nXCI6IDM4MjU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDMucG5nXCI6IDM4MTM4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDQucG5nXCI6IDM3ODc3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDUucG5nXCI6IDM3NjkwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDYucG5nXCI6IDM3NjUxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDcucG5nXCI6IDM3NTcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDgucG5nXCI6IDM4MTM2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDkucG5nXCI6IDM3NTU1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTAucG5nXCI6IDM4MDI5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTEucG5nXCI6IDM3ODY0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTIucG5nXCI6IDM3NjM1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTMucG5nXCI6IDM3NTM2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTQucG5nXCI6IDM4ODcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTUucG5nXCI6IDM3NzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTYucG5nXCI6IDM4NTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTcucG5nXCI6IDM4MDQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTgucG5nXCI6IDM4NDU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTkucG5nXCI6IDM4NTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjAucG5nXCI6IDM4MjI2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjEucG5nXCI6IDM4MTE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjIucG5nXCI6IDM3NTk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjMucG5nXCI6IDM4MjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwMC5wbmdcIjogNDQ4NjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDAxLnBuZ1wiOiA1Nzc0OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDIucG5nXCI6IDYxMzA5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwMy5wbmdcIjogNjYxNTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA0LnBuZ1wiOiA3MTIyMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDUucG5nXCI6IDgwMjA5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwNi5wbmdcIjogODk2MjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA3LnBuZ1wiOiAxNDEyNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA4LnBuZ1wiOiAxNDIyNzIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA5LnBuZ1wiOiAxNTExODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDEwLnBuZ1wiOiAxNTU2NjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDExLnBuZ1wiOiAxNDM5MTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDEyLnBuZ1wiOiAxNTI5MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDEzLnBuZ1wiOiAxNTM4MDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE0LnBuZ1wiOiAxNTYzODgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE1LnBuZ1wiOiAxNjExMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE2LnBuZ1wiOiAxNjMwMTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE3LnBuZ1wiOiAxNjg0MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE4LnBuZ1wiOiAxNzE5MTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE5LnBuZ1wiOiAxNzY1NjIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIwLnBuZ1wiOiAxNzYyOTUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIxLnBuZ1wiOiAxNzc1NzQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIyLnBuZ1wiOiAxNzg4OTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIzLnBuZ1wiOiAxNzg4MjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI0LnBuZ1wiOiAxODEzMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI1LnBuZ1wiOiAxODI1MDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI2LnBuZ1wiOiAxODM2OTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI3LnBuZ1wiOiAxODM5MDAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI4LnBuZ1wiOiAxODQyMDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI5LnBuZ1wiOiAxODQ5NjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMwLnBuZ1wiOiAxODY1MTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMxLnBuZ1wiOiAxODc1ODksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMyLnBuZ1wiOiAxODc1MDksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMzLnBuZ1wiOiAxODg2MDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM0LnBuZ1wiOiAxODg2NzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM1LnBuZ1wiOiAxODkzMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM2LnBuZ1wiOiAxODk5OTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM3LnBuZ1wiOiAxOTA2MzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM4LnBuZ1wiOiAxOTA2NDEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM5LnBuZ1wiOiAxOTE2NjUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQwLnBuZ1wiOiAxOTI5NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQxLnBuZ1wiOiAxOTU0NTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQyLnBuZ1wiOiAxOTgwNjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQzLnBuZ1wiOiAyMDA0NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ0LnBuZ1wiOiAyMDIyNTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ1LnBuZ1wiOiAyMDE3NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ2LnBuZ1wiOiAyMDI5MjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ3LnBuZ1wiOiAyMDI4NTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ4LnBuZ1wiOiAxOTc4NzYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ5LnBuZ1wiOiAxOTY1MTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUwLnBuZ1wiOiAxOTUzNjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUxLnBuZ1wiOiAxOTU5NTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUyLnBuZ1wiOiAxOTIzMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUzLnBuZ1wiOiAxOTA2NzksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU0LnBuZ1wiOiAxODIyOTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU1LnBuZ1wiOiAxNzM5NDksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU2LnBuZ1wiOiAxNzMzNzksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU3LnBuZ1wiOiAxNjcwODAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU4LnBuZ1wiOiAxNTk1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU5LnBuZ1wiOiAxNTQ2NDksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYwLnBuZ1wiOiAxNDk1NTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYxLnBuZ1wiOiAxNDQ3OTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYyLnBuZ1wiOiAxNDU2MTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYzLnBuZ1wiOiAxNDc0NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY0LnBuZ1wiOiAxMzkzNzUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY1LnBuZ1wiOiAxMjkwMTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY2LnBuZ1wiOiAxMjI2NjUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY3LnBuZ1wiOiAxMTU5OTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY4LnBuZ1wiOiAxMDQzMzUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY5LnBuZ1wiOiA5MDA0MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwNzAucG5nXCI6IDY3NzQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA3MS5wbmdcIjogNDk5MTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDM4MTY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAxLnBuZ1wiOiAzODM3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMi5wbmdcIjogMzkxMjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDM4NjU4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA0LnBuZ1wiOiAzNzk2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNS5wbmdcIjogMzgxMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDM4MjM4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA3LnBuZ1wiOiAzODE4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwOC5wbmdcIjogMzg0MDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDM4MTY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDEwLnBuZ1wiOiAzODMwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMS5wbmdcIjogMzg1MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDAucG5nXCI6IDIwMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwMS5wbmdcIjogMjE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAyLnBuZ1wiOiAyMzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDMucG5nXCI6IDI1MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNC5wbmdcIjogMzc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA1LnBuZ1wiOiA0MTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDYucG5nXCI6IDQ2OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNy5wbmdcIjogNTU0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA4LnBuZ1wiOiA2NTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDkucG5nXCI6IDEwMDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTAucG5nXCI6IDE4NjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTEucG5nXCI6IDI0MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTIucG5nXCI6IDM0MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTMucG5nXCI6IDQ1OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTQucG5nXCI6IDYwODgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTUucG5nXCI6IDcwODcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTYucG5nXCI6IDc5ODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTcucG5nXCI6IDgyOTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTgucG5nXCI6IDk3NDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTkucG5nXCI6IDk5NTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjAucG5nXCI6IDg4MDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjEucG5nXCI6IDk1MDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjIucG5nXCI6IDk1NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjMucG5nXCI6IDk2MDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjQucG5nXCI6IDk3MjUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjUucG5nXCI6IDk4MDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjYucG5nXCI6IDk0NDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjcucG5nXCI6IDk0MzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjgucG5nXCI6IDk1NDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjkucG5nXCI6IDg3NjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzAucG5nXCI6IDg5NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzEucG5nXCI6IDg1ODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzIucG5nXCI6IDgzMzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzMucG5nXCI6IDgxMTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzQucG5nXCI6IDc5NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzUucG5nXCI6IDc3NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzYucG5nXCI6IDc0MzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzcucG5nXCI6IDcyODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzgucG5nXCI6IDcyNTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzkucG5nXCI6IDUzNDE5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQwLnBuZ1wiOiA2OTU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQxLnBuZ1wiOiA2NjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQyLnBuZ1wiOiA2NzkyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQzLnBuZ1wiOiA2NTI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ0LnBuZ1wiOiA2NDQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ1LnBuZ1wiOiA2MzA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ2LnBuZ1wiOiA2NDk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ3LnBuZ1wiOiA2MzE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ4LnBuZ1wiOiA2NDQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ5LnBuZ1wiOiA2NzQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUwLnBuZ1wiOiA2NzUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUxLnBuZ1wiOiA2ODAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUyLnBuZ1wiOiA2NTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUzLnBuZ1wiOiA2NTk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU0LnBuZ1wiOiA2ODY1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU1LnBuZ1wiOiA3MTE5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU2LnBuZ1wiOiA3Mzg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU3LnBuZ1wiOiA3NTU4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU4LnBuZ1wiOiA3Njc2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU5LnBuZ1wiOiA3OTg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYwLnBuZ1wiOiA3OTMwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYxLnBuZ1wiOiA4NDQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYyLnBuZ1wiOiA4NDUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYzLnBuZ1wiOiA4NzA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY0LnBuZ1wiOiA5MTg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY1LnBuZ1wiOiA4OTI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY2LnBuZ1wiOiA2NDg5OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ny5wbmdcIjogOTU1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OC5wbmdcIjogMTAwNzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjkucG5nXCI6IDEwNzgyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcwLnBuZ1wiOiAxMDU4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MS5wbmdcIjogMTA5NTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzIucG5nXCI6IDExMTcyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDczLnBuZ1wiOiAxMTEwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NC5wbmdcIjogMTE1NTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzUucG5nXCI6IDEyMDgzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc2LnBuZ1wiOiAxMjAzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ny5wbmdcIjogMTIzNzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzgucG5nXCI6IDEyOTA4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc5LnBuZ1wiOiAxMzMwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MC5wbmdcIjogMTMzMTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODEucG5nXCI6IDEzNzMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgyLnBuZ1wiOiAxNDA5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4My5wbmdcIjogMTQxOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODQucG5nXCI6IDE0NzAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg1LnBuZ1wiOiAxNTEyOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ni5wbmdcIjogMTQ5MjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODcucG5nXCI6IDE1NzM1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg4LnBuZ1wiOiAxNjI3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OS5wbmdcIjogMTYyNzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTAucG5nXCI6IDE2Nzk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkxLnBuZ1wiOiAxNzQwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Mi5wbmdcIjogMTcwMTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTMucG5nXCI6IDE3OTc5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk0LnBuZ1wiOiAxODQ3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NS5wbmdcIjogMTg5NjUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTYucG5nXCI6IDE5NDAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk3LnBuZ1wiOiAyMDAwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OC5wbmdcIjogMTk3MzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTkucG5nXCI6IDIwNDE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAwLnBuZ1wiOiAyMTQ4MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMS5wbmdcIjogMjI5ODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDIucG5nXCI6IDIzMDM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAzLnBuZ1wiOiAyMzcxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNC5wbmdcIjogMjUwNDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDUucG5nXCI6IDI1Mzg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA2LnBuZ1wiOiAyNzE0MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNy5wbmdcIjogMjc1MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDgucG5nXCI6IDI5MjMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA5LnBuZ1wiOiAyODg1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMC5wbmdcIjogMzAxMDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTEucG5nXCI6IDMwMDI4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEyLnBuZ1wiOiAzMTEyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMy5wbmdcIjogMzMwODYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTQucG5nXCI6IDMzNTI4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE1LnBuZ1wiOiAzNTc3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNi5wbmdcIjogMzgyMTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTcucG5nXCI6IDM5MjgzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE4LnBuZ1wiOiA0MTA0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOS5wbmdcIjogNDI0NjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjAucG5nXCI6IDQ0MzU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIxLnBuZ1wiOiA0NDI3Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMi5wbmdcIjogNDY4ODAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjMucG5nXCI6IDUxNjMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI0LnBuZ1wiOiA1MzkyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNS5wbmdcIjogNTcyNjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjYucG5nXCI6IDU5NDg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI3LnBuZ1wiOiA2MDgzNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOC5wbmdcIjogNjI3NTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjkucG5nXCI6IDY4MTU0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMwLnBuZ1wiOiA3MTgyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMS5wbmdcIjogNzQ1NzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzIucG5nXCI6IDgyNzI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMzLnBuZ1wiOiA4NzE3MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNC5wbmdcIjogOTI2NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzUucG5nXCI6IDk5MzE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM2LnBuZ1wiOiAxMDg0MjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzcucG5nXCI6IDExMzM5Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOC5wbmdcIjogMTE3MDk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM5LnBuZ1wiOiAxMjgxNTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDAucG5nXCI6IDEzNDA3MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MS5wbmdcIjogMTQ0OTAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQyLnBuZ1wiOiAxNTQ4MzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDMucG5nXCI6IDE2MjQwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NC5wbmdcIjogMTU3NzQ3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ1LnBuZ1wiOiAxNjY1MzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDYucG5nXCI6IDE1Nzg2NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ny5wbmdcIjogMTU0MjIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ4LnBuZ1wiOiAxNTU4NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDkucG5nXCI6IDE0NDQwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MC5wbmdcIjogMTM4MjY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUxLnBuZ1wiOiAxMzM2MTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTIucG5nXCI6IDEyMjgzMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1My5wbmdcIjogMTE3MDc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU0LnBuZ1wiOiAxMjAzMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTUucG5nXCI6IDEwNjA5M1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwibWFuaWZlc3RcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiQmxhZGVcIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL2JsYWRlLm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJDYWJiaWVcIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL2NhYmJpZS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiRGlwcGVyXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9kaXBwZXIub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkR1c3R5XCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9kdXN0eS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiVGVhbVwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vdGVhbS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiV2luZGxpZnRlclwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vd2luZGxpZnRlci5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiSW50cm9WaWRlb1wiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vY29taW5nYXR5b3Uub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIldpcGVzY3JlZW5cIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL3dpcGVzY3JlZW4ub2dnXCJcbiAgICAgICAgfVxuXG4gICAgXSxcbiAgICBcImNoYXJhY3RlckF1ZGlvSWRzXCI6IHtcbiAgICAgICAgXCJkdXN0eVwiOiBcIkR1c3R5XCIsXG4gICAgICAgIFwiYmxhZGVyYW5nZXJcIjogXCJCbGFkZVwiLFxuICAgICAgICBcImNhYmJpZVwiOiBcIkNhYmJpZVwiLFxuICAgICAgICBcImRpcHBlclwiOiBcIkRpcHBlclwiLFxuICAgICAgICBcIndpbmRsaWZ0ZXJcIjogXCJXaW5kbGlmdGVyXCIsXG4gICAgICAgIFwidGVhbVwiOiBcIlRlYW1cIlxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJjbGFzc1wiOiBcImNhbm5lZFwiLFxuICAgIFwiY29weVwiOiBcIk5vdyB0aGF0IHdlIGtub3cgbW9yZSBhYm91dCB5b3UsIGl0J3MgeW91ciB0dXJuIHRvIGFzayAlY2hhcmFjdGVyJSBzb21lIHF1ZXN0aW9uc1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgaXMgeW91ciBqb2IgYXQgUGlzdG9uIFBlYWs/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiam9iXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGRvIHlvdSBmaWdodCBmb3Jlc3QgZmlyZXM/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZm9yZXN0ZmlyZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIYXZlIHlvdSBhbHdheXMgYmVlbiBhIGZpcmVmaWdodGVyP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZpcmVmaWdodGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hvIGlzIHlvdXIgYmVzdCBmcmllbmQ/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmVzdGZyaWVuZFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoZXJlIGlzIHlvdXIgZmF2b3JpdGUgcGxhY2UgdG8gZmx5P1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZhdm9yaXRlcGxhY2VcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgZm9vZD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmYXZvcml0ZS1mb29kXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIGNvbG9yP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZhdm9yaXRlLWNvbG9yXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIHNwb3J0P1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZhdm9yaXRlLXNwb3J0XCJcbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJuYW1lXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY2xhc3NcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjb3B5XCI6IFwiV2hvIGRvIHlvdSB3YW50IHRvIHdyaXRlIHRvP1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkR1c3R5XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZHVzdHlcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJCbGFkZSBSYW5nZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJibGFkZXJhbmdlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkNhYmJpZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNhYmJpZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkRpcHBlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRpcHBlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ3aW5kbGlmdGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlIFRlYW1cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ0ZWFtXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgXCJyZXF1aXJlZFwiOiB0cnVlXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwicXVlc3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCdzIHlvdXIgZmF2b3JpdGUgY29sb3I/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJibHVlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3JhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJvcmFuZ2VcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJHcmVlblwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJZZWxsb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInllbGxvd1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlB1cnBsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicHVycGxlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWZvb2RcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1mb29kXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgZm9vZD9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQaXp6YVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGl6emFcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJY2UgQ3JlYW1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImljZWNyZWFtXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQnJvY2NvbGlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJyb2Njb2xpXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRnJlbmNoIEZyaWVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJmcmVuY2hmcmllc1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNoaWNrZW4gTnVnZ2V0c1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiY2hpY2tlbm51Z2dldHNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQQiZKXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwYmpcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtc3BvcnRcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1zcG9ydFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIHNwb3J0P1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkZvb3RiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb290YmFsbFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJhc2ViYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJiYXNlYmFsbFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvY2tleVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaG9ja2V5XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU3dpbW1pbmcvRGl2aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzd2ltbWluZ1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNvY2NlclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic29jY2VyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmFjaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyYWNpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJkdXN0eVwiIDoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGkgdGhlcmUhXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJJIHdhcyByZWFsbHkgZXhjaXRlZCB0byByZWNlaXZlIHlvdXIgYWlybWFpbCFcIixcbiAgICAgICAgXCJib2R5MlwiOiBcIkkndmUgZ290dGEgZ2V0IGJhY2sgdG8gZmlnaHRpbmcgZmlyZXMgaGVyZSwgYnV0IHlvdSBzdGF5IHN0cm9uZyFcIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJPdmVyIGFuZCBvdXRcIixcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYSBTRUFULCBvciBhIFNpbmdsZS1FbmdpbmUgQWlyIFRhbmtlciwgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtLCBhbiBlbGl0ZSBncm91cCBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnQuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGNhbiBzY29vcCB3YXRlciBmcm9tIGxha2VzIGFuZCBkaXZlIGludG8gdGhlIGZvcmVzdCB0byBkcm9wIHRoZSB3YXRlciBvbiB3aWxkZmlyZXMuIFNwZWVkIGNvdW50cyB3aGVuIGFuIGFpciByZXNjdWUgaXMgdW5kZXIgd2F5LCBzbyBJJ20gYWx3YXlzIHJlYWR5IHRvIGZseSBpbnRvIGRhbmdlciFcIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkJlZm9yZSBqb2luaW5nIHRoZSBBaXIgQXR0YWNrIFRlYW0sIEkgd2FzIGEgd29ybGQtZmFtb3VzIGFpciByYWNlciDigJMgSSBldmVuIHJhY2VkIGFyb3VuZCB0aGUgd29ybGQhICBOb3cgSSByYWNlIHRvIHB1dCBvdXQgZmlyZXMuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkl0IHdhc24ndCBlYXN5IGJlY29taW5nIGEgY2hhbXBpb24gcmFjZXIgb3IgYSBmaXJlZmlnaHRlciBidXQgSSd2ZSBoYWQgYW4gYW1hemluZyB0ZWFtIG9mIGZyaWVuZHMgd2l0aCBtZSBldmVyeSBzdGVwIG9mIHRoZSB3YXkhXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkgaGF2ZSBiZWVuIGZseWluZyBmb3IgYXMgbG9uZyBhcyBJIGNhbiByZW1lbWJlciBidXQgbXkgZmF2b3JpdGUgcGxhY2UgdG8gZmx5IGlzIGFib3ZlIG15IGhvbWV0b3duLCBQcm9wd2FzaCBKdW5jdGlvbi4gSSBkbyBzb21lIGZhbmN5IGZseWluZyB0aGVyZSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBzb3VuZHMgZGVsaWNpb3VzISBJIG1lYW4sIGFueXRoaW5nJ3MgYmV0dGVyIHRvIGVhdCB0aGFuIFZpdGFtaW5hbXVsY2guXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZC1wbHVyYWxcIjogXCIldGVtcGxhdGUlIHNvdW5kIGRlbGljaW91cyEgSSBtZWFuLCBhbnl0aGluZydzIGJldHRlciB0byBlYXQgdGhhbiBWaXRhbWluYW11bGNoLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgR1JFRU4uIEdyZWVuIG1lYW5zIGdvISBBbmQgSSBsb3ZlIHRvIGdvIGZhc3QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJIHdhcyBhIGNoYW1waW9uIHJhY2VyIG5vdCB0b28gbG9uZyBhZ28uIFJhY2luZyBpcyBkZWZpbml0ZWx5IG15IGZhdm9yaXRlIHNwb3J0LlwiXG4gICAgfSxcbiAgICBcImRpcHBlclwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIaSB0aGVyZSxcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkknbSBEaXBwZXIuIFRoYXQncyB3aGF0IGV2ZXJ5b25lIGNhbGxzIG1lLiBTbyB5b3UgY2FuIHRvbyFcIixcbiAgICAgICAgXCJib2R5MlwiOiBcIlRoYW5rcyBmb3Igd3JpdGluZyB0byBtZSAldGVtcGxhdGUlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIlJlbWVtYmVyLCB0aGUgc2t5J3MgdGhlIGxpbWl0IVwiLFxuICAgICAgICBcImpvYlwiOiBcIkkgaGF2ZSBhIHJlYWxseSBpbXBvcnRhbnQgam9iIGZpZ2h0aW5nIHdpbGRmaXJlcy4gSSdtIGFuIGFpciB0YW5rZXIgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQXR0YWNrIFRlYW0uXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGZpZ2h0IGZvcmVzdCBmaXJlcyBpbiBzZXZlcmFsIHdheXMuICBTb21ldGltZXMgSSBkcm9wIHJldGFyZGFudCB0byBjb250YWluIGEgZmlyZS4gIEkgY2FuIGFsc28gc2Nvb3Agd2F0ZXIgZnJvbSB0aGUgbGFrZSBhbmQgZHJvcCBpdCBkaXJlY3RseSBvbiB0aGUgZmlyZS4gTXkgYm9zcyBCbGFkZSBSYW5nZXIgY2FsbHMgbWUgYSBNdWQtRHJvcHBlciFcIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHVzZWQgdG8gaGF1bCBjYXJnbyB1cCBpbiBBbmNob3JhZ2UuIFllcCwgYSBsb3Qgb2YgZ3V5cyBpbiBBbGFza2EuIEkgd2FzIGJlYXRpbmcgdGhlbSBvZmYgd2l0aCBhIHN0aWNrIVwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZCBpcyBjaGFtcGlvbiByYWNlciBEdXN0eSBDcm9waG9wcGVyLiBJJ20gaGlzIGJpZ2dlc3QgZmFuIVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJNeSBmYXZvcml0ZSBwbGFjZSB0byBmbHkgaXMgdGhlIEZ1c2VsIExvZGdlLCByaWdodCBoZXJlIGluIFBpc3RvbiBQZWFrLiBJdCdzIHNvIGJlYXV0aWZ1bC4gQW5kIHdoZXJlIER1c3R5IGFuZCBJIGhhZCBvdXIgZmlyc3QgZGF0ZSEgSXQgd2FzIGEgZGF0ZSwgcmlnaHQ/IEknbSBwcmV0dHkgc3VyZSBpdCB3YXMgYSBkYXRlLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJXaGlsZSAldGVtcGxhdGUlIHNvdW5kcyByZWFsbHkgZ29vZCwgdGhlcmUncyBub3RoaW5nIGJldHRlciB0aGFuIGEgZnJlc2ggY2FuIG9mIG9pbCFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kLXBsdXJhbFwiOiBcIldoaWxlICV0ZW1wbGF0ZSUgc291bmQgcmVhbGx5IGdvb2QsIHRoZXJlJ3Mgbm90aGluZyBiZXR0ZXIgdGhhbiBhIGZyZXNoIGNhbiBvZiBvaWwhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJXaGF0J3MgbXkgZmF2b3JpdGUgY29sb3I/IFlFTExPVyBsaWtlIHRoZSBzdW5zaGluZS4uIGFuZCBsaWtlIE1FIVwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiU3dpbW1pbmcvZGl2aW5nIGlzIG15IGZhdm9yaXRlIHNwb3J0ISBJIGxvdmUgZGlwcGluZyBpbiBhbmQgb3V0IG9mIHRoZSB3YXRlci5cIlxuICAgIH0sXG4gICAgXCJ3aW5kbGlmdGVyXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhlbGxvIGZyaWVuZCFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkkgZW5qb3llZCByZWFkaW5nIHlvdXIgbGV0dGVyIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGhhbmtzIGZvciB5b3VyIGxldHRlciAldGVtcGxhdGUlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIllvdXIgbmV3IGZyaWVuZFwiLFxuICAgICAgICBcImpvYlwiOiBcIkkgYW0gYSBIZWF2eS1MaWZ0IEhlbGljb3B0ZXIgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtLCBhbiBlbGl0ZSBjcmV3IG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdC5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkJsYWRlIGNhbGxzIG1lIGEgXFxcIk11ZCBEcm9wcGVyXFxcIiBiZWNhdXNlIEkgaGF2ZSBhIGRldGFjaGFibGUgdGFuayBsb2FkZWQgd2l0aCBmaXJlIHJldGFyZGFudCB0byBoZWxwIHB1dCBvdXQgdGhlIGZpcmVzLiAgTXVkIGlzIHNsYW5nIGZvciByZXRhcmRhbnQuICBJIGNhbiBob2xkIG1vcmUgcmV0YXJkYW50IHRoYW4gYW55b25lIGVsc2Ugb24gdGhlIHRlYW0uXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGJlIGEgbHVtYmVyamFjaywgbGlmdGluZyBkb3plbnMgb2YgaGVhdnkgbG9ncyBhbmQgY2FycnlpbmcgdGhlbSB0byB0aGUgbHVtYmVyIG1pbGwuICBCdXQgbm93IEkgYW0gYSBmaXJlZmlnaHRlciBhbmQgdGhpcyBrZWVwcyBtZSB2ZXJ5IGJ1c3kuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkkgd291bGQgbGlrZSB0byBiZSBZT1VSIGJlc3QgZnJpZW5kLlwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGxpa2UgdG8gZmx5IG1hbnkgcGxhY2VzIGFuZCBiZSBvbmUgd2l0aCB0aGUgd2luZC4gVGhlIHdpbmQgc3BlYWtzLCBhbmQgSSBsaXN0ZW4uXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIiV0ZW1wbGF0ZSUgc291bmRzIGRlbGljaW91cyEgSGF2ZSB5b3UgdHJpZWQgaXQgd2l0aCBhIGNhbiBvZiBvaWw/IFRoYXQncyBteSBmYXZvcml0ZSBmb29kLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2QtcGx1cmFsXCI6IFwiJXRlbXBsYXRlJSBzb3VuZCBkZWxpY2lvdXMhIEhhdmUgeW91IHRyaWVkIHRoZW0gd2l0aCBhIGNhbiBvZiBvaWw/IFRoYXQncyBteSBmYXZvcml0ZSBmb29kLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgQkxVRSBsaWtlIHRoZSB3YXRlciBhbmQgdGhlIHNreS5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkkgZG9uJ3QgcGxheSBtYW55IHNwb3J0cywgYnV0IEkgYW0gYW4gYXZpZCB3ZWlnaHQgbGlmdGVyLiBZb3UnbGwgb2Z0ZW4gc2VlIG1lIGxpZnRpbmcgaGVhdnkgbG9hZHMgb2YgbG9ncyBpbiBteSBvZmYgdGltZS5cIlxuICAgIH0sXG4gICAgXCJibGFkZXJhbmdlclwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIaSBDaGFtcCFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkknbSBCbGFkZSBSYW5nZXIuIEJ1dCB5b3UgY2FuIGNhbGwgbWUgQmxhZGUuXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJSZW1lbWJlciwgeW91IGNhbiBkbyBhbnl0aGluZyEgIFlvdSBqdXN0IGhhdmUgdG8gdHJhaW4gaGFyZCBhbmQgaGF2ZSBjb3VyYWdlLiAgVGhhbmtzIGZvciB5b3VyIGxldHRlciAldGVtcGxhdGUlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIllvdXIgcGFydG5lclwiLFxuICAgICAgICBcImpvYlwiOiBcIkknbSBhIEZpcmUgYW5kIFJlc2N1ZSBIZWxpY29wdGVyLCBhbmQgdGhlIENoaWVmIGluIENoYXJnZSBoZXJlIGF0IFBpc3RvbiBQZWFrLlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2hlbiB0aGVyZSdzIGEgZmlyZSwgSSBnaXZlIHRoZSBvcmRlcnMgZm9yIHRoZSBBaXIgQXR0YWNrIFRlYW0gdG8gc3ByaW5nIGludG8gYWN0aW9uIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSd2ZSBiZWVuIHRoZSBDaGllZiBmb3IgYSBsb25nIHRpbWUsIGJ1dCBJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gIFRoaXMgaXMgbXkgc2Vjb25kIGNhcmVlciwgYW5kIG15IG1vc3QgcmV3YXJkaW5nLiAgTm93IEkgZmx5IGluIHdoZW4gb3RoZXJzIGZseSBvdXQgdG8gaGVscCB0aG9zZSB3aG8gbmVlZCBpdCBtb3N0LlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZHMgYXJlIGFsbCB0aGUgdHJhaWxibGF6ZXJzIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFdlIGxpa2UgdG8gdGhpbmsgb2Ygb3Vyc2VsdmVzIGFzIHRoZSBoZXJvZXMgb2YgdGhlIHNreSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBsaWtlIHRvIGZseSB0byBtYW55IHBsYWNlcywgYnV0IG15IGZhdm9yaXRlIHBsYWNlIGlzIGFib3ZlIFBpc3RvbiBQZWFrLiBJIHBhdHJvbCB0aGUgc2tpZXMgYW5kIG1ha2Ugc3VyZSBhbGwgdGhlIHRvdXJpc3RzIGFyZSBjYW1waW5nIGJ5IHRoZSBib29rLiBSZW1lbWJlciwgc2FmZXR5IGZpcnN0IVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJZb3Ugc2F5IHlvdSBsaWtlIHRvIGVhdCAldGVtcGxhdGUlPyBJIHByZWZlciBhIGZyZXNoIGNhbiBvZiBvaWwuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZC1wbHVyYWxcIjogXCJZb3Ugc2F5IHlvdSBsaWtlIHRvIGVhdCAldGVtcGxhdGUlPyBJIHByZWZlciBhIGZyZXNoIGNhbiBvZiBvaWwuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBSRUQsIHRoZSBjb2xvciBvZiBGaXJlIFNhZmV0eS5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIklmIEkgaGFkIHRvIGNob29zZSwgZm9vdGJhbGwgd291bGQgYmUgbXkgZmF2b3JpdGUgc3BvcnQuXCJcbiAgICB9LFxuICAgIFwiY2FiYmllXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkF0dGVudGlvbiAldGVtcGxhdGUlIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiQ2FiYmllIGhlcmUuXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaGFua3MgZm9yIHRoZSBtZXNzYWdlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIk92ZXIgYW5kIG91dFwiLFxuICAgICAgICBcImpvYlwiOiBcIkknbSBhbiBleC1taWxpdGFyeSBjYXJnbyBwbGFuZSB3aXRoIHRoZSBQaXN0b24gUGVhayBBdHRhY2sgVGVhbSAtIGZpcmVmaWdodGluZyBpcyBhIGJpZyByZXNwb25zaWJpbGl0eS5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgY2FycnkgdGhlIFNtb2tlanVtcGVycyAtIHdobyBjbGVhciBmYWxsZW4gdHJlZXMgYW5kIGRlYnJpcy4gRHVyaW5nIGEgZmlyZSwgSSBkcm9wIHRoZW0gZnJvbSB0aGUgc2t5LCByaWdodCBvdmVyIHRoZSBmbGFtZXMuXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGRyb3AgYWlyYm9ybmUgdXRpbGl0eSB2ZWhpY2xlcyBiZWhpbmQgZW5lbXkgbGluZXMgZHVyaW5nIHdhci4gTm93IEkgZHJvcCBTbW9rZWp1bXBlcnMgYXQgUGlzdG9uIFBlYWsuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIldobydzIG15IGJlc3QgZnJpZW5kPyBUaGF0J3MgcHJvYmFibHkgVG9wIFNlY3JldCBidXQgSSBjYW4gc2F5IHRoZSBTbW9rZWp1bXBlcnMgYXJlIG15IGNsb3Nlc3QgcmVjcnVpdHMuXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkndmUgZmxvd24gb3ZlciBtYW55IHBsYWNlcyBpbiBteSB0aW1lLiBNeSBmYXZvcml0ZSBzcG90IGlzIEFuY2hvciBMYWtlIC0gYSBsb25nIGJvZHkgb2Ygd2F0ZXIgd2l0aCBhbiBhbmNob3Itc2hhcGVkIGlzbGFuZC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiSW4gdGhlIG1pbGl0YXJ5LCBhbGwgZm9vZCBpcyByYXRpb25lZCBidXQgSSdsbCB0YWtlIGFzIG11Y2ggZnJlc2ggb2lsIGFzIEkgY2FuIGdldCEgXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZC1wbHVyYWxcIjogXCJJbiB0aGUgbWlsaXRhcnksIGFsbCBmb29kIGlzIHJhdGlvbmVkIGJ1dCBJJ2xsIHRha2UgYXMgbXVjaCBmcmVzaCBvaWwgYXMgSSBjYW4gZ2V0ISBcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIk15IGZhdm9yaXRlIGNvbG9yIGlzIEdSRUVOIC0gaXQgY2FuIGhlbHAgbWUgaGlkZSBhYm92ZSB0aGUgcGluZSB0cmVlcy5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkJhc2ViYWxsIGlzIG15IGZhdm9yaXRlIHNwb3J0LiBJIGFsd2F5cyBoYXZlIGZpdmUgc21va2VqdW1wZXJzIGluIG15IGNhcmdvIC0ganVzdCBlbm91Z2ggdG8gY292ZXIgdGhlIGJhc2VzLlwiXG4gICAgfSxcbiAgICBcInRlYW1cIjoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGV5IGZyaWVuZCFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIlRoYW5rcyBmb3Igd3JpdGluZyB0byB1cy5cIixcbiAgICAgICAgXCJib2R5MlwiOiBcIlRpbWUgdG8gZ2V0IGJhY2sgdG8gd29yayFcIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJMZXQncyBtYWtlIGl0IGNvdW50IVwiLFxuICAgICAgICBcImpvYlwiOiBcIlRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0gaXMgYW4gZWxpdGUgZ3JvdXAgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0cy5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIldlIGZseSBpbiB3aGVuIG90aGVycyBhcmUgZmx5aW4gb3V0LiBJdCB0YWtlcyBhIHNwZWNpYWwga2luZGEgcGxhbmUuXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJMaWZlIGRvZXNuJ3QgYWx3YXlzIGdvIHRoZSB3YXkgeW91IGV4cGVjdCBpdC4gVGhpcyBpcyBhIHNlY29uZCBjYXJlZXIgZm9yIGFsbCBvZiB1cy4gXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkl0IHRha2VzIGhvbm9yLCB0cnVzdCBhbmQgYnJhdmVyeSB0byBlYXJuIHlvdXIgd2luZ3MuIFdlIGRvbid0IGhhdmUganVzdCBvbmUgYmVzdCBmcmllbmQgYmVjYXVzZSB3ZSBuZWVkIGV2ZXJ5IHBsYW5lIHdlJ3ZlIGdvdCB0byBoZWxwLlwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJQaXN0b24gUGVhayBoYXMgc29tZSBncmVhdCBwbGFjZXMgdG8gZmx5LiBCdXQgb3VyIGZhdm9yaXRlIHNwb3QgaXMgdGhlIHdvb2RlbiByYWlsd2F5IGJyaWRnZSAtIHdpdGggdGhlIHRodW5kZXJpbmcgV2hpdGV3YWxsIEZhbGxzIGJlaGluZCBpdC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBzb3VuZHMgZ3JlYXQgYnV0IHdlJ2QgcmF0aGVyIHNsdXJwIGRvd24gZnJlc2ggY2FucyBvZiBvaWwuIEhPSVNUIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2QtcGx1cmFsXCI6IFwiJXRlbXBsYXRlJSBzb3VuZCBncmVhdCBidXQgd2UnZCByYXRoZXIgc2x1cnAgZG93biBmcmVzaCBjYW5zIG9mIG9pbC4gSE9JU1QhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJXZSBsaWtlIGFsbCBjb2xvcnMgb2YgdGhlIHJhaW5ib3cuIEJ1dCBhcyBhIHRlYW0sIG91ciBmYXZvcml0ZSBjb2xvciBpcyAldGVtcGxhdGUlLCBqdXN0IGxpa2UgeW91IVwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiSXQncyBoYXJkIHRvIHBpY2sgYSBmYXZvcml0ZSBzcG9ydCAtIHdlJ3JlIGEgZmFuIG9mIGFueXRoaW5nIHRoYXQgbGV0IHVzIHdvcmsgYXMgYSB0ZWFtIVwiXG4gICAgfVxufSIsInZhciBkZXZpY2UgPSB7XG4gICAgaXNBbmRyb2lkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc0FuZHJvaWRUYWJsZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAhPT0gbnVsbFxuICAgICAgICAgICAgJiYgKFxuICAgICAgICAgICAgKCh3aW5kb3cub3JpZW50YXRpb24gPT09IDAgfHwgd2luZG93Lm9yaWVudGF0aW9uID09PSAxODAgKSAmJiBzY3JlZW4ud2lkdGggPiA2NDApXG4gICAgICAgICAgICAgICAgfHwgKCh3aW5kb3cub3JpZW50YXRpb24gPT09IC05MCB8fCB3aW5kb3cub3JpZW50YXRpb24gPT09IDkwKSAmJiBzY3JlZW4uaGVpZ2h0ID4gNjQwKVxuICAgICAgICAgICAgKTtcbiAgICB9LFxuICAgIGlzQmxhY2tCZXJyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNJT1M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzSXBhZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNPcGVyYTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9PcGVyYSBNaW5pL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNXaW5kb3dzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNUYWJsZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0FuZHJvaWRUYWJsZXQoKSB8fCB0aGlzLmlzSXBhZCgpO1xuICAgIH0sXG4gICAgaXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNUYWJsZXQoKSAmJiAodGhpcy5pc0lPUygpIHx8IHRoaXMuaXNBbmRyb2lkKCkgfHwgdGhpcy5pc0JsYWNrQmVycnkoKSB8fCB0aGlzLmlzT3BlcmEoKSB8fCB0aGlzLmlzV2luZG93cygpKTtcbiAgICB9LFxuICAgIGN1cnJlbnREZXZpY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pc01vYmlsZSgpKVxuICAgICAgICAgICAgcmV0dXJuIFwibW9iaWxlXCI7XG4gICAgICAgIGlmICh0aGlzLmlzVGFibGV0KCkpXG4gICAgICAgICAgICByZXR1cm4gXCJ0YWJsZXRcIjtcbiAgICAgICAgcmV0dXJuIFwiZGVza3RvcFwiO1xuICAgIH0sXG4gICAgY3VycmVudERldmljZU5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2l0Y2godHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSB0aGlzLmlzQW5kcm9pZCgpOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQW5kcm9pZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNCbGFja0JlcnJ5KCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJCbGFja0JlcnJ5XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc09wZXJhKCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJPcGVyYSBNaW5pXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc1dpbmRvd3MoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIklFTW9iaWxlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc0lPUygpOiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJcGFkKCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImlQYWRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJpUGhvbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJEZXNrdG9wXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXZpY2U7IiwiXG5cblxuXG4vLyBhZGRzIG91ciBjdXN0b20gbW9kaWZpY2F0aW9ucyB0byB0aGUgUElYSSBsaWJyYXJ5XG5yZXF1aXJlKCcuL3BpeGkvbGliTW9kaWZpY2F0aW9ucycpO1xuXG5cblxudmFyIE1haW5WaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9tYWluVmlldycpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4vZGV2aWNlJyk7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQXBwICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFwcCA9IHt9O1xuXG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUGFzc3dvcmQgU2NyZWVuICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyICRwYXNzd29yZFNjcmVlbiA9ICQoJyNwYXNzd29yZFNjcmVlbicpO1xuXG5pZihkb2N1bWVudC5VUkwuaW5kZXhPZignZGlzbmV5LXBsYW5lczItYWlybWFpbC1zdGFnaW5nLmF6dXJld2Vic2l0ZXMubmV0JykgIT09IC0xKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJ2Rpc25leVBsYW5lc1R3byc7XG5cbiAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2lucHV0W3R5cGU9cGFzc3dvcmRdJyk7XG5cbiAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZigkcGFzc3dvcmRJbnB1dC52YWwoKSA9PT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmFkZU91dCg1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHBhc3N3b3JkU2NyZWVuLnNob3coKTtcbn0gZWxzZSB7XG4gICAgJHBhc3N3b3JkU2NyZWVuLnJlbW92ZSgpO1xufVxuXG5cblxuJChmdW5jdGlvbigpIHtcbiAgICBhcHAubWFpblZpZXcgPSBuZXcgTWFpblZpZXcoKTtcblxuICAgIGFwcC5tYWluVmlldy5zdGFydCgpO1xufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4iLCJcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBBdWRpbyBMb2FkZXIgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYXVkaW9Bc3NldERhdGEgPSByZXF1aXJlKCcuL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xudmFyIG51bUF1ZGlvQXNzZXRzID0gYXVkaW9Bc3NldERhdGEubWFuaWZlc3QubGVuZ3RoO1xuXG5cblxuZnVuY3Rpb24gc3RhcnRBdWRpb0xvYWRlcigpIHtcbiAgICAvLyBpZiBpbml0aWFsaXplRGVmYXVsdFBsdWdpbnMgcmV0dXJucyBmYWxzZSwgd2UgY2Fubm90IHBsYXkgc291bmRcbiAgICBpZiAoIWNyZWF0ZWpzLlNvdW5kLmluaXRpYWxpemVEZWZhdWx0UGx1Z2lucygpKSB7IHJldHVybjsgfVxuXG4gICAgY3JlYXRlanMuU291bmQuYWx0ZXJuYXRlRXh0ZW5zaW9ucyA9IFtcIm1wM1wiXTtcbiAgICBjcmVhdGVqcy5Tb3VuZC5hZGRFdmVudExpc3RlbmVyKFwiZmlsZWxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgfSk7XG4gICAgY3JlYXRlanMuU291bmQucmVnaXN0ZXJNYW5pZmVzdChhdWRpb0Fzc2V0RGF0YS5tYW5pZmVzdCk7XG5cbiAgICBjcmVhdGVqcy5Tb3VuZC5zZXRWb2x1bWUoMC40KTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFByaW1hcnkgTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYXNzZXREYXRhID0gcmVxdWlyZSgnLi9kYXRhL2Fzc2V0cy5qc29uJyk7XG5cbnZhciBmaWxlTmFtZXMgPSBPYmplY3Qua2V5cyhhc3NldERhdGEuYXNzZXRzKTtcbnZhciB0b3RhbEZpbGVzID0gZmlsZU5hbWVzLmxlbmd0aDtcblxudmFyIGxvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKGZpbGVOYW1lcyk7XG52YXIgc3RhcnRUaW1lO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG5cbiAgICBsb2FkZXIub25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZUxvYWRlZCA9ICh0b3RhbEZpbGVzIC0gdGhpcy5sb2FkQ291bnQpL3RvdGFsRmlsZXM7XG4gICAgICAgIHZhciB0aW1lRWxhcHNlZCA9IF8ubm93KCkgLSBzdGFydFRpbWU7XG5cbiAgICAgICAgdmlldy5vbkFzc2V0UHJvZ3Jlc3MocGVyY2VudGFnZUxvYWRlZCwgdGltZUVsYXBzZWQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy5vbkFzc2V0c0xvYWRlZCgpO1xuICAgIH07XG5cbiAgICBzdGFydFRpbWUgPSBfLm5vdygpO1xuXG4gICAgc3RhcnRBdWRpb0xvYWRlcigpO1xuICAgIGxvYWRlci5sb2FkKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdGFydDogc3RhcnRMb2FkZXJcbn07IiwiXG5cblxudmFyIFF1ZXN0aW9uID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjb3B5OiAnJyxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgIH1cbn0pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbjsiLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG4gICAgdmFyIHNjZW5lO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBmdW5jdGlvbiBnZXRCbGFkZVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDYWJiaWVUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENhYmJpZTJUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREaXBwZXJUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER1c3R5VGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RHVzdHkzVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RHVzdHk0VGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5NC9EdXN0eV9hbmdsZTFfbm9CbGlua18wMDAnLCAwLCAyNCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFdpbmRsaWZ0ZXJUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAnLCAwLCAxMik7XG4gICAgfVxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBmdW5jdGlvbiBpbml0Q2hhcmFjdGVyKG5hbWUsIHRleHR1cmVzLCBhbmNob3IpIHtcbiAgICAgICAgdmFyIGlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAodGV4dHVyZXMpO1xuICAgICAgICBpZGxlQW5pbWF0aW9uLmFuY2hvciA9IGFuY2hvcjtcblxuICAgICAgICB2YXIgY2hhciA9IG5ldyBDaGFyYWN0ZXIobmFtZSwgaWRsZUFuaW1hdGlvbik7XG5cbiAgICAgICAgY2hhci53aW5kb3dYID0gLTE7XG4gICAgICAgIGNoYXIud2luZG93WSA9IC0xO1xuXG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuICAgICAgICBjaGFyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIGNoYXI7XG4gICAgfVxuXG4gICAgdmFyIGNoYXJhY3RlckluaXRGdW5jdGlvbnMgPSB7XG4gICAgICAgIGJsYWRlOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignQmxhZGUnLCBnZXRCbGFkZVRleHR1cmVzKCksIHt4OiA0NTcvOTcwLCB5OiAzNDYvNjAwfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBjYWJiaWU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdDYWJiaWUnLCBnZXRDYWJiaWVUZXh0dXJlcygpLCB7eDogNTQ1LzEyMDAsIHk6IDM1MS82MjJ9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGNhYmJpZVR3bzogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0NhYmJpZTInLCBnZXRDYWJiaWUyVGV4dHVyZXMoKSwge3g6IDQwOC83NTAsIHk6IDIzOC8zODB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGRpcHBlcjogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0RpcHBlcicsIGdldERpcHBlclRleHR1cmVzKCksIHt4OiA1MzkvMTIwMCwgeTogNDM1LzYzOH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgZHVzdHk6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEdXN0eScsIGdldER1c3R5VGV4dHVyZXMoKSwge3g6IDQ4MC8xMjAwLCB5OiA0MDUvOTgzfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBkdXN0eURhcms6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEdXN0eTMnLCBnZXREdXN0eTNUZXh0dXJlcygpLCB7eDogMzM1LzYwMCwgeTogMTY1LzM2MH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgZHVzdHlGb3VyOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRHVzdHk0JywgZ2V0RHVzdHk0VGV4dHVyZXMoKSwge3g6IDM3My82MDAsIHk6IDE1NC8zNDF9KTtcbiAgICAgICAgfSksXG4gICAgICAgIHdpbmRsaWZ0ZXI6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdXaW5kbGlmdGVyJywgZ2V0V2luZGxpZnRlclRleHR1cmVzKCksIHt4OiAzMTAvNjAwLCB5OiAyMjgvMzcxfSk7XG4gICAgICAgIH0pXG4gICAgfTtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbiAgICB2YXIgYWxsQ2hhcmFjdGVycyA9IHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ocGl4aVNjZW5lKSB7XG4gICAgICAgICAgICBzY2VuZSA9IHBpeGlTY2VuZTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIF8uZWFjaChjaGFyYWN0ZXJJbml0RnVuY3Rpb25zLCBmdW5jdGlvbihpbml0Rm5jLCBjaGFyYWN0ZXIpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFsbENoYXJhY3RlcnMsIGNoYXJhY3Rlciwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXRGbmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gYWxsQ2hhcmFjdGVycztcbn0pKCk7XG5cblxuXG5cblxuXG5cbiIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxuICAgIC8vIGRpc3BsYXlPYmplY3Qgc2hvdWxkIGJlIGFuIGluc3RhbmNlIG9mIFBJWEkuU3ByaXRlIG9yIFBJWEkuTW92aWVDbGlwXG4gICAgdmFyIENoYXJhY3RlciA9IGZ1bmN0aW9uKG5hbWUsIG1vdmllQ2xpcCkge1xuICAgICAgICBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTsgLy8gUGFyZW50IGNvbnN0cnVjdG9yXG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcblxuICAgICAgICBpZighXy5pc1VuZGVmaW5lZChtb3ZpZUNsaXApKSB7XG4gICAgICAgICAgICB0aGlzLnNldElkbGVTdGF0ZShtb3ZpZUNsaXApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIHNldElkbGVTdGF0ZTogZnVuY3Rpb24ocGl4aVNwcml0ZSkge1xuICAgICAgICAgICAgdGhpcy5pZGxlID0gcGl4aVNwcml0ZTtcblxuICAgICAgICAgICAgaWYocGl4aVNwcml0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICAgICAgcGl4aVNwcml0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwaXhpU3ByaXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBpeGlTcHJpdGUuZ290b0FuZFBsYXkoMCk7ICAvL3N0YXJ0IGNsaXBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChwaXhpU3ByaXRlKTsgICAvL2FkZCB0byBkaXNwbGF5IG9iamVjdCBjb250YWluZXJcbiAgICAgICAgfSxcblxuICAgICAgICAvL2FkZCBtb3ZpZSBjbGlwIHRvIHBsYXkgd2hlbiBjaGFyYWN0ZXIgY2hhbmdlcyB0byBzdGF0ZVxuICAgICAgICBhZGRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIG1vdmllQ2xpcCkge1xuICAgICAgICAgICAgbW92aWVDbGlwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW3N0YXRlXSA9IG1vdmllQ2xpcDtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobW92aWVDbGlwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBwdWJsaWMgQVBJIGZ1bmN0aW9uLiBXYWl0cyB1bnRpbCBjdXJyZW50IHN0YXRlIGlzIGZpbmlzaGVkIGJlZm9yZSBzd2l0Y2hpbmcgdG8gbmV4dCBzdGF0ZS5cbiAgICAgICAgZ29Ub1N0YXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnN0YXRlc1tzdGF0ZV0pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0Vycm9yOiBDaGFyYWN0ZXIgJyArIHRoaXMubmFtZSArICcgZG9lcyBub3QgY29udGFpbiBzdGF0ZTogJyArIHN0YXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlkbGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaWRsZS5vbkNvbXBsZXRlID0gXy5iaW5kKHRoaXMuc3dhcFN0YXRlLCB0aGlzLCBzdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZnRlciBjdXJyZW50IGFuaW1hdGlvbiBmaW5pc2hlcyBnbyB0byB0aGlzIHN0YXRlIG5leHRcbiAgICAgICAgICAgICAgICB0aGlzLmlkbGUubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2FwU3RhdGUodGhpcywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIC8vc3dpdGNoIGltbWVkaWF0ZWx5IGlmIGNoYXJhY3RlciBpZGxlIHN0YXRlIGlzIGEgc2luZ2xlIHNwcml0ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vYWRkIGNhbGxiYWNrIHRvIHJ1biBvbiBjaGFyYWN0ZXIgdXBkYXRlXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2FsbGVkIG9uIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGJ5IHdoYXRldmVyIFBpeGkgc2NlbmUgY29udGFpbnMgdGhpcyBjaGFyYWN0ZXJcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U3RhdGljOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZS5nb3RvQW5kU3RvcCgwKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RHluYW1pYzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUuZ290b0FuZFBsYXkoMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZsaXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gLSh0aGlzLnNjYWxlLngpO1xuICAgICAgICB9LFxuICAgICAgICBwdXNoVG9Ub3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnBhcmVudCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IhIE5vIHBhcmVudCBkZWZpbmVkIGZvciBjaGFyYWN0ZXI6Jyx0aGlzLm5hbWUgKyAnLicsJ0l0IGlzIGxpa2VseSBwdXN0VG9Ub3AoKSB3YXMgY2FsbGVkIGFmdGVyIGNoYXJhY3RlciB3YXMgYWRkZWQgYnV0IGJlZm9yZSBQSVhJIHNjZW5lIHdhcyB1cGRhdGVkLicpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcblxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCh0aGlzLCBsZW5ndGgtMSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIC8vIGNoYW5nZXMgc3RhdGUgaW1tZWRpYXRlbHlcbiAgICAvLyBOT1RFOiBGdW5jdGlvbiBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgY2hhcmFjdGVyLmdvVG9TdGF0ZSgpXG4gICAgZnVuY3Rpb24gc3dhcFN0YXRlKGNoYXIsIHN0YXRlKSB7XG4gICAgICAgIHZhciBpZGxlU3RhdGUgPSBjaGFyLmlkbGU7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IGNoYXIuc3RhdGVzW3N0YXRlXTtcblxuICAgICAgICBuZXdTdGF0ZS5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7ICAvL3N3aXRjaCBiYWNrIHRvIGlkbGUgYWZ0ZXIgcnVuXG4gICAgICAgICAgICBpZihpZGxlU3RhdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIG5ld1N0YXRlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIG5ld1N0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgIH1cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIGV4dGVuZHMgRGlzcGxheSBPYmplY3QgQ29udGFpbmVyXG4gICAgZXh0ZW5kKFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lciwgQ2hhcmFjdGVyKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2hhcmFjdGVyO1xufSkoKTsiLCJcbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBzdWIpIHtcbiAgICAvLyBBdm9pZCBpbnN0YW50aWF0aW5nIHRoZSBiYXNlIGNsYXNzIGp1c3QgdG8gc2V0dXAgaW5oZXJpdGFuY2VcbiAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2NyZWF0ZVxuICAgIC8vIGZvciBhIHBvbHlmaWxsXG4gICAgLy8gQWxzbywgZG8gYSByZWN1cnNpdmUgbWVyZ2Ugb2YgdHdvIHByb3RvdHlwZXMsIHNvIHdlIGRvbid0IG92ZXJ3cml0ZVxuICAgIC8vIHRoZSBleGlzdGluZyBwcm90b3R5cGUsIGJ1dCBzdGlsbCBtYWludGFpbiB0aGUgaW5oZXJpdGFuY2UgY2hhaW5cbiAgICAvLyBUaGFua3MgdG8gQGNjbm9rZXNcbiAgICB2YXIgb3JpZ1Byb3RvID0gc3ViLnByb3RvdHlwZTtcbiAgICBzdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3JpZ1Byb3RvKSAge1xuICAgICAgICBzdWIucHJvdG90eXBlW2tleV0gPSBvcmlnUHJvdG9ba2V5XTtcbiAgICB9XG5cbiAgICAvLyBSZW1lbWJlciB0aGUgY29uc3RydWN0b3IgcHJvcGVydHkgd2FzIHNldCB3cm9uZywgbGV0J3MgZml4IGl0XG4gICAgc3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgICAvLyBJbiBFQ01BU2NyaXB0NSsgKGFsbCBtb2Rlcm4gYnJvd3NlcnMpLCB5b3UgY2FuIG1ha2UgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5XG4gICAgLy8gbm9uLWVudW1lcmFibGUgaWYgeW91IGRlZmluZSBpdCBsaWtlIHRoaXMgaW5zdGVhZFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWIucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc3ViXG4gICAgfSk7XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDsiLCIoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKlxuICAgICAqIEN1c3RvbSBFZGl0cyBmb3IgdGhlIFBJWEkgTGlicmFyeVxuICAgICAqL1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBSZWxhdGl2ZSBQb3NpdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93WCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93WSA9IDA7XG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWCA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9ICh3aW5kb3dXaWR0aCAqIHRoaXMuX3dpbmRvd1gpICsgdGhpcy5fYnVtcFg7XG4gICAgfTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRQb3NpdGlvblkgPSBmdW5jdGlvbih3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gKHdpbmRvd0hlaWdodCAqIHRoaXMuX3dpbmRvd1kpICsgdGhpcy5fYnVtcFk7XG4gICAgfTtcblxuICAgIC8vIHdpbmRvd1ggYW5kIHdpbmRvd1kgYXJlIHByb3BlcnRpZXMgYWRkZWQgdG8gYWxsIFBpeGkgZGlzcGxheSBvYmplY3RzIHRoYXRcbiAgICAvLyBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIHBvc2l0aW9uLnggYW5kIHBvc2l0aW9uLnlcbiAgICAvLyB0aGVzZSBwcm9wZXJ0aWVzIHdpbGwgYmUgYSB2YWx1ZSBiZXR3ZWVuIDAgJiAxIGFuZCBwb3NpdGlvbiB0aGUgZGlzcGxheVxuICAgIC8vIG9iamVjdCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHdpbmRvdyB3aWR0aCAmIGhlaWdodCBpbnN0ZWFkIG9mIGEgZmxhdCBwaXhlbCB2YWx1ZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93WCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl93aW5kb3dYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCgkd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1k7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1kgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25ZKCR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9idW1wWSA9IDA7XG5cbiAgICAvLyBidW1wWCBhbmQgYnVtcFkgYXJlIHByb3BlcnRpZXMgb24gYWxsIGRpc3BsYXkgb2JqZWN0cyB1c2VkIGZvclxuICAgIC8vIHNoaWZ0aW5nIHRoZSBwb3NpdGlvbmluZyBieSBmbGF0IHBpeGVsIHZhbHVlcy4gVXNlZnVsIGZvciBzdHVmZlxuICAgIC8vIGxpa2UgaG92ZXIgYW5pbWF0aW9ucyB3aGlsZSBzdGlsbCBtb3ZpbmcgYXJvdW5kIGEgY2hhcmFjdGVyLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYnVtcFgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVtcFg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX2J1bXBYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9ICgkd2luZG93LndpZHRoKCkgKiB0aGlzLl93aW5kb3dYKSArIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gKCR3aW5kb3cuaGVpZ2h0KCkgKiB0aGlzLl93aW5kb3dZKSArIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBTY2FsaW5nIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gd2luZG93U2NhbGUgY29ycmVzcG9uZHMgdG8gd2luZG93IHNpemVcbiAgICAvLyAgIGV4OiB3aW5kb3dTY2FsZSA9IDAuMjUgbWVhbnMgMS80IHNpemUgb2Ygd2luZG93XG4gICAgLy8gc2NhbGVNaW4gYW5kIHNjYWxlTWF4IGNvcnJlc3BvbmQgdG8gbmF0dXJhbCBzcHJpdGUgc2l6ZVxuICAgIC8vICAgZXg6IHNjYWxlTWluID0gMC41IG1lYW5zIHNwcml0ZSB3aWxsIG5vdCBzaHJpbmsgdG8gbW9yZSB0aGFuIGhhbGYgb2YgaXRzIG9yaWdpbmFsIHNpemUuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93U2NhbGUgPSAtMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNjYWxlTWluID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNjYWxlTWF4ID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlVHlwZSA9ICdjb250YWluJztcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zY2FsZUZuYyA9IE1hdGgubWluO1xuXG4gICAgLy8gV2luZG93U2NhbGU6IHZhbHVlIGJldHdlZW4gMCAmIDEsIG9yIC0xXG4gICAgLy8gVGhpcyBkZWZpbmVzIHdoYXQgJSBvZiB0aGUgd2luZG93IChoZWlnaHQgb3Igd2lkdGgsIHdoaWNoZXZlciBpcyBzbWFsbGVyKVxuICAgIC8vIHRoZSBvYmplY3Qgd2lsbCBiZSBzaXplZC4gRXhhbXBsZTogYSB3aW5kb3dTY2FsZSBvZiAwLjUgd2lsbCBzaXplIHRoZSBkaXNwbGF5T2JqZWN0XG4gICAgLy8gdG8gaGFsZiB0aGUgc2l6ZSBvZiB0aGUgd2luZG93LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93U2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93U2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1NjYWxlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFR3byBwb3NzaWJsZSB2YWx1ZXM6IGNvbnRhaW4gb3IgY292ZXIuIFVzZWQgd2l0aCB3aW5kb3dTY2FsZSB0byBkZWNpZGUgd2hldGhlciB0byB0YWtlIHRoZVxuICAgIC8vIHNtYWxsZXIgYm91bmQgKGNvbnRhaW4pIG9yIHRoZSBsYXJnZXIgYm91bmQgKGNvdmVyKSB3aGVuIGRlY2lkaW5nIGNvbnRlbnQgc2l6ZSByZWxhdGl2ZSB0byBzY3JlZW4uXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdzY2FsZVR5cGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVUeXBlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2FsZVR5cGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2NhbGVGbmMgPSAodmFsdWUgPT09ICdjb250YWluJykgPyBNYXRoLm1pbiA6IE1hdGgubWF4O1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0U2NhbGUgPSBmdW5jdGlvbih3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KSB7XG4gICAgICAgIHZhciBsb2NhbEJvdW5kcyA9IHRoaXMuZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLl93aW5kb3dTY2FsZSAqIHRoaXMuX3NjYWxlRm5jKHdpbmRvd0hlaWdodC9sb2NhbEJvdW5kcy5oZWlnaHQsIHdpbmRvd1dpZHRoL2xvY2FsQm91bmRzLndpZHRoKTtcblxuICAgICAgICAvL2tlZXAgc2NhbGUgd2l0aGluIG91ciBkZWZpbmVkIGJvdW5kc1xuICAgICAgICBzY2FsZSA9IE1hdGgubWF4KHRoaXMuc2NhbGVNaW4sIE1hdGgubWluKHNjYWxlLCB0aGlzLnNjYWxlTWF4KSk7XG5cblxuICAgICAgICB0aGlzLnNjYWxlLnggPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgdGhpcy5zY2FsZS55ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgfTtcblxuXG4gICAgLy8gVVNFIE9OTFkgSUYgV0lORE9XU0NBTEUgSVMgQUxTTyBTRVRcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVggPSAxO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWSA9IDE7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIFdpbmRvdyBSZXNpemUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBmb3IgZWFjaCBkaXNwbGF5IG9iamVjdCBvbiB3aW5kb3cgcmVzaXplLFxuICAgIC8vIGFkanVzdGluZyB0aGUgcGl4ZWwgcG9zaXRpb24gdG8gbWlycm9yIHRoZSByZWxhdGl2ZSBwb3NpdGlvbnMgd2luZG93WCBhbmQgd2luZG93WVxuICAgIC8vIGFuZCBhZGp1c3Rpbmcgc2NhbGUgaWYgaXQncyBzZXRcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKHdpZHRoKTtcbiAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25ZKGhlaWdodCk7XG5cbiAgICAgICAgaWYodGhpcy5fd2luZG93U2NhbGUgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuLCBmdW5jdGlvbihkaXNwbGF5T2JqZWN0KSB7XG4gICAgICAgICAgICBkaXNwbGF5T2JqZWN0Ll9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBTcHJpdGVzaGVldCBUZXh0dXJlIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyB1c2VkIHRvIGdldCBpbmRpdmlkdWFsIHRleHR1cmVzIG9mIHNwcml0ZXNoZWV0IGpzb24gZmlsZXNcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgY2FsbDogZ2V0RmlsZU5hbWVzKCdhbmltYXRpb25faWRsZV8nLCAxLCAxMDUpO1xuICAgIC8vIFJldHVybnM6IFsnYW5pbWF0aW9uX2lkbGVfMDAxLnBuZycsICdhbmltYXRpb25faWRsZV8wMDIucG5nJywgLi4uICwgJ2FuaW1hdGlvbl9pZGxlXzEwNC5wbmcnXVxuICAgIC8vXG4gICAgZnVuY3Rpb24gZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHZhciBudW1EaWdpdHMgPSAocmFuZ2VFbmQtMSkudG9TdHJpbmcoKS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UocmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgIHZhciBudW1aZXJvcyA9IG51bURpZ2l0cyAtIG51bS50b1N0cmluZygpLmxlbmd0aDsgICAvL2V4dHJhIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIHZhciB6ZXJvcyA9IG5ldyBBcnJheShudW1aZXJvcyArIDEpLmpvaW4oJzAnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQcmVmaXggKyB6ZXJvcyArIG51bSArICcucG5nJztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgUElYSS5nZXRUZXh0dXJlcyA9IGZ1bmN0aW9uKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChnZXRGaWxlTmFtZXMoZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKTtcbiAgICB9O1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogTWVtb3J5IENsZWFudXAgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGRlc3Ryb3lCYXNlVGV4dHVyZSkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGRlc3Ryb3lCYXNlVGV4dHVyZSkpIGRlc3Ryb3lCYXNlVGV4dHVyZSA9IHRydWU7XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICB0aGlzLnRleHR1cmUuZGVzdHJveShkZXN0cm95QmFzZVRleHR1cmUpO1xuICAgIH07XG5cbiAgICBQSVhJLk1vdmllQ2xpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGRlc3Ryb3lCYXNlVGV4dHVyZSkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGRlc3Ryb3lCYXNlVGV4dHVyZSkpIGRlc3Ryb3lCYXNlVGV4dHVyZSA9IHRydWU7XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICBfLmVhY2godGhpcy50ZXh0dXJlcywgZnVuY3Rpb24odGV4dHVyZSkge1xuICAgICAgICAgICAgdGV4dHVyZS5kZXN0cm95KGRlc3Ryb3lCYXNlVGV4dHVyZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuXG5cblxuXG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG4gICAgdmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuL2FsbENoYXJhY3RlcnMnKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9iYWNrZ3JvdW5kJyk7XG4gICAgdmFyIGJsYWRld2lwZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvYmxhZGV3aXBlJyk7XG4gICAgdmFyIGR1c3R5RGlwcGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9kdXN0eURpcHBlcicpO1xuICAgIHZhciBwYXJhY2h1dGVyc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMnKTtcbiAgICB2YXIgY2hhcmFjdGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9jaGFyYWN0ZXJNb2R1bGUnKTtcbiAgICB2YXIgcmVzcG9uc2VNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlJyk7XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKiBQcmltYXJ5IFBpeGkgQW5pbWF0aW9uIENsYXNzICoqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3BhcmVudCBjb25zdHJ1Y3RvclxuICAgICAgICBTY2VuZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGFsbENoYXJhY3RlcnMuaW5pdGlhbGl6ZSh0aGlzKTtcblxuXG4gICAgICAgIGJhY2tncm91bmRNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZEJhY2tncm91bmRUb1NjZW5lKHRoaXMpO1xuICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZFJlc3RUb1NjZW5lKHRoaXMpO1xuXG4gICAgICAgIGJsYWRld2lwZU1vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgcmVzcG9uc2VNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZUluVXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBhcmFsbGF4IFN0dWZmICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLnNoaWZ0QmFja2dyb3VuZExheWVycyh4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmlldzogZnVuY3Rpb24odmlldykge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgfSxcbiAgICAgICAgX29uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBTY2VuZS5wcm90b3R5cGUuX29uV2luZG93UmVzaXplLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogRXh0ZW5kIGFuZCBFeHBvcnQgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cblxuICAgIC8vIEV4dGVuZHMgU2NlbmUgQ2xhc3NcbiAgICBleHRlbmQoU2NlbmUsIE1haW5TY2VuZSk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFpblNjZW5lO1xufSkoKTsiLCJcblxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG52YXIgU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ0IgPSBmdW5jdGlvbigpe307XG5cbiAgICBQSVhJLlN0YWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5TY2VuZS5wcm90b3R5cGUgPSB7XG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZUNCKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IgPSB1cGRhdGVDQjtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IoKTtcbiAgICB9LFxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVzdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIGlzUGF1c2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGF1c2VkO1xuICAgIH1cbn07XG5cblxuZXh0ZW5kKFBJWEkuU3RhZ2UsIFNjZW5lKTtcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgdmFyIFNjZW5lc01hbmFnZXIgPSB7XG4gICAgICAgIHNjZW5lczoge30sXG4gICAgICAgIGN1cnJlbnRTY2VuZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZXI6IG51bGwsXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsICRwYXJlbnREaXYpIHtcblxuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIucmVuZGVyZXIpIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2lkdGgsIGhlaWdodCwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3BpeGktdmlldycpO1xuICAgICAgICAgICAgJHBhcmVudERpdi5hcHBlbmQoU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3KTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoU2NlbmVzTWFuYWdlci5sb29wKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGxvb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoZnVuY3Rpb24gKCkgeyBTY2VuZXNNYW5hZ2VyLmxvb3AoKSB9KTtcblxuICAgICAgICAgICAgaWYgKCFTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSB8fCBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpKSByZXR1cm47XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnVwZGF0ZSgpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci5yZW5kZXIoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVTY2VuZTogZnVuY3Rpb24oaWQsIFNjZW5lQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIFNjZW5lQ29uc3RydWN0b3IgPSBTY2VuZUNvbnN0cnVjdG9yIHx8IFNjZW5lOyAgIC8vZGVmYXVsdCB0byBTY2VuZSBiYXNlIGNsYXNzXG5cbiAgICAgICAgICAgIHZhciBzY2VuZSA9IG5ldyBTY2VuZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0gPSBzY2VuZTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9LFxuICAgICAgICBnb1RvU2NlbmU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5wYXVzZSgpO1xuXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgPSBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF07XG5cbiAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHJlc2l6ZSB0byBtYWtlIHN1cmUgYWxsIGNoaWxkIG9iamVjdHMgaW4gdGhlXG4gICAgICAgICAgICAgICAgLy8gbmV3IHNjZW5lIGFyZSBjb3JyZWN0bHkgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlc3VtZSBuZXcgc2NlbmVcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5yZXN1bWUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLl9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG5cblxuICAgICR3aW5kb3cub24oJ3Jlc2l6ZScsIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUpO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XG59KSgpOyIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBzZWxmPXRoaXM7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhLGRlcHRoMSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyO1xuICBidWZmZXIgKz0gXCJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJvcHRpb25cXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImVtcHR5LXNwYWNlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5uYW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiIHZhbHVlPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBpZD1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgb25jbGljaz1cXFwiXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcImZ1bGwtcmVsYXRpdmVcXFwiIG9uY2xpY2s9XFxcIlxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJiYWNrZ3JvdW5kXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudGV4dCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50ZXh0KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgICAgICBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuY29weSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5jb3B5KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5vcHRpb25zKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtV2l0aERlcHRoKDEsIHByb2dyYW0xLCBkYXRhLCBkZXB0aDApLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuICAgIDwvZGl2PlxcbjwvZGl2PlwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsIlxuXG5cbnZhciBpdGVtQW5pbWF0aW9uc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFnZUl0ZW1zJyk7XG5cbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcbnZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG5cbnZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG5cbnZhciBDYW5uZWRRdWVzdGlvblZpZXcgPSBRdWVzdGlvblZpZXcuZXh0ZW5kKHtcbiAgICBnZXRBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1BbmltYXRpb25zTW9kdWxlLmdldFJhbmRvbUNhbm5lZEFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgfSxcbiAgICBpc0Nhbm5lZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICByZW1vdmVPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucy5yZW1vdmUoKTtcbiAgICB9LFxuICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ29wdGlvbnMnLCBvcHRpb25zKTtcblxuICAgICAgICAvL3JlaW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuXG4gICAgICAgIGlmKCFpc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIGNvcHkgPSB0aGlzLm1vZGVsLmdldCgnY29weScpLnJlcGxhY2UoJyVjaGFyYWN0ZXIlJywgY2hhcmFjdGVyKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnY29weScsIGNvcHkpO1xuICAgICAgICB0aGlzLiRjb3B5Lmh0bWwoY29weSk7XG4gICAgfVxuXG5cbn0pO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FubmVkUXVlc3Rpb25WaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG5cblxuICAgIGZ1bmN0aW9uIGdldENsaXBib2FyZFRleHQoZSkge1xuICAgICAgICBpZighXy5pc1VuZGVmaW5lZChlLm9yaWdpbmFsRXZlbnQpKSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuXG4gICAgICAgIGlmICh3aW5kb3cuY2xpcGJvYXJkRGF0YSAmJiB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKSB7IC8vIElFXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSgnVGV4dCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleWRvd24gaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlcklubmVyID0gdGhpcy4kcGxhY2Vob2xkZXIuZmluZCgnPiBkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnZGl2LnRpdGxlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICBfLmJpbmRBbGwodGhpcywgJ3N0YXJ0QW5pbWF0aW9uJywnc2hvdycsJ2hpZGUnLCdzZXRJbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0U2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuc2NlbmVzLm1haW47XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIFJ1biBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcmVBbmltYXRpb25TZXR1cCgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2NlbmUoKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zdGFydEVudGVyTmFtZUFuaW1hdGlvbigpOyAgIC8vYW5pbWF0ZSBpbiBjaGFyYWN0ZXJzXG5cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMC4zO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kdGl0bGUsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxLCB5OiAwLCBlYXNlOiAnQmFjay5lYXNlT3V0J30pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJG5hbWVJbnB1dCwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDF9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwbGFjZWhvbGRlcklubmVyLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMSwgeTogMCwgZWFzZTogJ0JhY2suZWFzZU91dCcsIGRlbGF5OiAwLjE1fSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJlQW5pbWF0aW9uU2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiR0aXRsZSwge29wYWNpdHk6IDAsIHk6IC03NX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRuYW1lSW5wdXQsIHtvcGFjaXR5OiAwfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIHtvcGFjaXR5OiAwLCB5OiAtNTB9KTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogU2hvdy9IaWRlICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnN0YXJ0QW5pbWF0aW9uLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUub25BbmltYXRpb25PdXRDb21wbGV0ZSh0aGlzLnNldEluYWN0aXZlKTtcblxuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRlbCwgMC4zLCB7b3BhY2l0eTogMH0pO1xuXG4gICAgICAgICAgICAgICAgLy9ydW4gaGlkZSBhbmltYXRpb25cbiAgICAgICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5hY3RpdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaXNDYW5uZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBzZXRJbmFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfSxcblxuICAgICAgICBvbk5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmKGUud2hpY2ggPT09IDMyKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLiRuYW1lSW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgIGlmKGUudHlwZSA9PT0gJ3Bhc3RlJykge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gZ2V0Q2xpcGJvYXJkVGV4dChlKTtcblxuICAgICAgICAgICAgICAgIHZhbCArPSB0ZXh0LnNwbGl0KCcgJykuam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQudmFsKHZhbCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlci50b2dnbGUodmFsID09PSAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB2YWx9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXIudG9nZ2xlKHZhbCA9PT0gJycpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB2YWx9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVZpZXc7XG59KSgpO1xuIiwiXG5cblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIEZvb3RlclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2Zvb3RlcicsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEudm9sdW1lJzogJ29uVm9sdW1lVG9nZ2xlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5udW1Eb3RzID0gb3B0aW9ucy5udW1Eb3RzO1xuXG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb3VudGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocyA9IHRoaXMuJGVsLmZpbmQoJ2Eudm9sdW1lIHBhdGgnKTtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYuY291bnRlcicpO1xuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPbigpO1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT2ZmKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBudW1Eb3RzID0gdGhpcy5udW1Eb3RzO1xuXG4gICAgICAgICAgICB2YXIgJGRvdCA9IHRoaXMuJGRvdHMuZXEoMCk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDI7IGkgPD0gbnVtRG90czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRuZXdEb3QgPSAkZG90LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5maW5kKCc+IGRpdi5udW1iZXInKS5odG1sKGkpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuYXBwZW5kVG8odGhpcy4kY291bnRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gJGRvdDtcbiAgICAgICAgICAgICRkb3QuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiBWb2x1bWUgQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdG9nZ2xlVm9sdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSAhdGhpcy52b2x1bWVPbjtcblxuICAgICAgICAgICAgaWYodGhpcy52b2x1bWVPbikge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQuc2V0TXV0ZSh0aGlzLnZvbHVtZU9uKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRUaW1lbGluZVZvbHVtZU9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFswLDAsMCwwLDIyLDMyXSwgZW5kTWF0cml4OiBbMSwwLDAsMSwwLDBdLCBlYXNpbmc6ICdCYWNrLmVhc2VPdXQnLCBvcGFjaXR5OiAxfTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMC41LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMSksIDAuMjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgyKSwgMCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPZmY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtzdGFydE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZW5kTWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVhc2luZzogJ0JhY2suZWFzZUluJywgb3BhY2l0eTogMH07XG5cbiAgICAgICAgICAgIC8vZGVmYXVsdCBvblxuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuYXR0cigndHJhbnNmb3JtJywgJ21hdHJpeCgxLDAsMCwxLDAsMCknKTtcbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmNzcygnb3BhY2l0eScsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDApLCAwLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMSksIDAuMjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgyKSwgMC41LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBhZGRTdmdQYXRoQW5pbWF0aW9uOiBmdW5jdGlvbih0aW1lbGluZSwgJHBhdGgsIHN0YXJ0VGltZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblNwZWVkID0gMC4yO1xuXG4gICAgICAgICAgICB2YXIgcGF0aE1hdHJpeCA9IF8uY2xvbmUob3B0aW9ucy5zdGFydE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHZhciB0d2VlbkF0dHJzID0ge1xuICAgICAgICAgICAgICAgIGVhc2U6IG9wdGlvbnMuZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBhdGguYXR0cigndHJhbnNmb3JtJywgJ21hdHJpeCgnICsgcGF0aE1hdHJpeC5qb2luKCcsJykgKyAnKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF8uZXh0ZW5kKHR3ZWVuQXR0cnMsIG9wdGlvbnMuZW5kTWF0cml4KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50bygkcGF0aCwgYW5pbWF0aW9uU3BlZWQsIHtvcGFjaXR5OiBvcHRpb25zLm9wYWNpdHl9KSwgYW5pbWF0aW9uU3BlZWQgKiBzdGFydFRpbWUpO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhwYXRoTWF0cml4LCBhbmltYXRpb25TcGVlZCwgdHdlZW5BdHRycyksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIENvdW50ZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2V0Q291bnRlcjogZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy4kZG90cy5lcShpKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QgPSB0aGlzLiRkb3RzLmVxKGkpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlQ291bnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRjb3VudGVyLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwub3V0ZXJIZWlnaHQoKSArIHRoaXMuJGNvdW50ZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIG9uVm9sdW1lVG9nZ2xlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlVm9sdW1lKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBGb290ZXJWaWV3O1xufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICB2YXIgaW50cm9Nb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2ludHJvJyk7XG4gICAgfVxuXG4gICAgdmFyIEludHJvVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjaW50cm8tdmlldycsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEuYmVnaW4nOiAnb25CZWdpbkNsaWNrJyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLmJlZ2luJzogJ29uQmVnaW5DbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uVGltZWxpbmUoKTtcblxuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luU2NyZWVuID0gdGhpcy4kZWwuZmluZCgnZGl2LmJlZ2luLXNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5MaW5lcyA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2Rpdi5saW5lJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkJ0biA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2EuYmVnaW4nKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEFuaW1hdGlvblRpbWVsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldE1vYmlsZVRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRNb2JpbGVUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldFRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93QmVnaW5TY3JlZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW47XG5cbiAgICAgICAgICAgIGlmKGRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgLy9zaG93IGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2JpbGVDaGFyYWN0ZXJzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoXy5iaW5kKHRpbWVsaW5lLnBsYXksIHRpbWVsaW5lKSwgMjAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93TW9iaWxlQ2hhcmFjdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJG1vYmlsZUNoYXJhY3RlcnMgPSAkKCcjbW9iaWxlLWNoYXJhY3RlcnMnKS5maW5kKCdkaXYuY2hhcmFjdGVyJyk7XG5cbiAgICAgICAgICAgIHZhciAkZHVzdHkgPSAkbW9iaWxlQ2hhcmFjdGVycy5maWx0ZXIoJy5kdXN0eTMnKTtcbiAgICAgICAgICAgIHZhciAkZGlwcGVyID0gJG1vYmlsZUNoYXJhY3RlcnMuZmlsdGVyKCcuZGlwcGVyJyk7XG4gICAgICAgICAgICB2YXIgJHBhcmFjaHV0ZXIxID0gJG1vYmlsZUNoYXJhY3RlcnMuZmlsdGVyKCcucGFyYWNodXRlcjEnKTtcbiAgICAgICAgICAgIHZhciAkcGFyYWNodXRlcjIgPSAkbW9iaWxlQ2hhcmFjdGVycy5maWx0ZXIoJy5wYXJhY2h1dGVyMicpO1xuICAgICAgICAgICAgdmFyICRwYXJhY2h1dGVyMyA9ICRtb2JpbGVDaGFyYWN0ZXJzLmZpbHRlcignLnBhcmFjaHV0ZXIzJyk7XG5cblxuICAgICAgICAgICAgJGR1c3R5LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICRkaXBwZXIuYWRkQ2xhc3MoJ2FjdGl2ZSBmbGlwJyk7XG4gICAgICAgICAgICAkcGFyYWNodXRlcjEuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJHBhcmFjaHV0ZXIyLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICRwYXJhY2h1dGVyMy5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGdldE1vYmlsZVRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luTGluZXMsIHt4OiAwLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge29wYWNpdHk6IDF9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5WaWV3LnNob3dDb250ZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQmFjay5lYXNlT3V0JztcblxuICAgICAgICAgICAgdmFyIHR3ZWVucyA9IF8ubWFwKHRoaXMuJGJlZ2luTGluZXMsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGxpbmUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHdlZW5zOiB0d2VlbnMsXG4gICAgICAgICAgICAgICAgc3RhZ2dlcjogMC4wOCxcbiAgICAgICAgICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuN1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uc2hvdygpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBidG5JblRpbWUgPSAwLjQ7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIHNjYWxlWDogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSArIChhbmltYXRpb25UaW1lICogMC4wNSkpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaW50cm9Nb2R1bGUuc2hvd0xvZ28oKTtcbiAgICAgICAgICAgIH0sIDAuNjUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TW9iaWxlVGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9GcmFtZXMgPSBpbnRyb01vZHVsZS5nZXRJbnRyb0ZyYW1lcygpO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKiBUaW1lbGluZSAqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5vbkFuaW1hdGlvbkZpbmlzaGVkLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGVTY29wZTogdGhpc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luU2NyZWVuLCBhbmltYXRpb25UaW1lLzQsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMudG9wLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMuYnRtLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0TWFpblZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcgPSB2aWV3O1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2hvd0NvbnRlbnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBIZWxwZXJzIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcicpO1xuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gUElYSSBTY2VuZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgTWFpblNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9tYWluU2NlbmUnKTtcbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENvbGxlY3Rpb25zIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBWaWV3cyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgSW50cm9WaWV3ID0gcmVxdWlyZSgnLi9pbnRyb1ZpZXcnKTtcbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IHJlcXVpcmUoJy4vZW50ZXJOYW1lVmlldycpO1xuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuICAgIHZhciBDYW5uZWRRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL2Nhbm5lZFF1ZXN0aW9uVmlldycpO1xuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gcmVxdWlyZSgnLi9zZWxlY3RDaGFyYWN0ZXJWaWV3Jyk7XG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IHJlcXVpcmUoJy4vcmVzcG9uc2VWaWV3Jyk7XG4gICAgdmFyIEZvb3RlclZpZXcgPSByZXF1aXJlKCcuL2Zvb3RlclZpZXcnKTtcblxuICAgIHZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG4gICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBpbnRyb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm8nKTtcbiAgICB9XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIE1haW52aWV3IENsYXNzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVzKHZpZXdzKSB7XG4gICAgICAgIHJldHVybiBfLm1hcCh2aWV3cywgZnVuY3Rpb24odmlldykge3JldHVybiB2aWV3Lm1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7IH0pO1xuICAgIH1cblxuICAgIHZhciBNYWluVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgcGFnZXM6IFtdLFxuICAgICAgICBhY3RpdmVQYWdlSW5kZXg6IDAsXG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdjbGljayBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25Bc3NldFByb2dyZXNzOiBmdW5jdGlvbihwZXJjZW50YWdlTG9hZGVkLCB0aW1lRWxhcHNlZCkge1xuICAgICAgICAgICAgaW50cm9Nb2R1bGUudXBkYXRlTG9hZGVyKHBlcmNlbnRhZ2VMb2FkZWQsIHRpbWVFbGFwc2VkKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Bc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBNYWluU2NlbmUpO1xuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5vbkNvbXBsZXRlKHRoaXMuaW50cm9WaWV3LnNob3dCZWdpblNjcmVlbi5iaW5kKHRoaXMuaW50cm9WaWV3KSk7XG4gICAgICAgICAgICBpbnRyb01vZHVsZS5hc3NldHNMb2FkZWQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKGludHJvTW9kdWxlKSlcbiAgICAgICAgICAgICAgICBpbnRyb01vZHVsZS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ21vYmlsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcjYXNzZXRMb2FkZXInKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG5cbiAgICAgICAgICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vY3JlYXRlIGNhbnZhcyBlbGVtZW50XG4gICAgICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5pbml0aWFsaXplKHRoaXMuJHdpbmRvdy53aWR0aCgpLCB0aGlzLiR3aW5kb3cuaGVpZ2h0KCksIHRoaXMuJGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0V2luZG93RXZlbnRzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNvbnRlbnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0V2luZG93RXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5vbigncmVzaXplJywgXy5iaW5kKHRoaXMucmVwb3NpdGlvblBhZ2VOYXYsIHRoaXMpKTtcblxuLy8gICAgICAgICAgICBpZiAod2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2VvcmllbnRhdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3JpZW50YXRpb24nLCBldmVudC5iZXRhLCBldmVudC5nYW1tYSk7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2Vtb3Rpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW90aW9uJywgZXZlbnQuYWNjZWxlcmF0aW9uLnggKiAyLCBldmVudC5hY2NlbGVyYXRpb24ueSAqIDIpO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW96IG9yaWVudGF0aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJNb3pPcmllbnRhdGlvblwiLCBmdW5jdGlvbihvcmllbnRhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3onLCBvcmllbnRhdGlvbi54ICogNTAsIG9yaWVudGF0aW9uLnkgKiA1MCk7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRJbnRyb1ZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvVmlldyA9IG5ldyBJbnRyb1ZpZXcoKTtcblxuICAgICAgICAgICAgaW50cm9WaWV3LnNldE1haW5WaWV3KHRoaXMpO1xuICAgICAgICAgICAgaW50cm9WaWV3Lm9uQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd0ZpcnN0UGFnZSwgdGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmludHJvVmlldyA9IGludHJvVmlldztcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0UGFnZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoYXJNb2RlbCA9IF8uZmlyc3QoYWxsUXVlc3Rpb25zLm1vZGVscyk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Nb2RlbHMgPSBfLnJlc3QoYWxsUXVlc3Rpb25zLm1vZGVscyk7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aXRpb25lZFF1ZXN0aW9uTW9kZWxzID0gXy5wYXJ0aXRpb24ocXVlc3Rpb25Nb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vZGVsLmdldCgnY2xhc3MnKSAhPT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5TW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbk1vZGVsc1swXTtcbiAgICAgICAgICAgIHZhciBjYW5uZWRNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uTW9kZWxzWzFdO1xuXG5cblxuXG4gICAgICAgICAgICB2YXIgZW50ZXJOYW1lVmlldyA9IG5ldyBFbnRlck5hbWVWaWV3KCk7XG4gICAgICAgICAgICB2YXIgc2VsZWN0Q2hhclZpZXcgPSBuZXcgU2VsZWN0Q2hhcmFjdGVyVmlldyh7bW9kZWw6IGNoYXJNb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlWaWV3cyA9IF8ubWFwKHBlcnNvbmFsaXR5TW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVlc3Rpb25WaWV3KHttb2RlbDogbW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHZhciBjYW5uZWRWaWV3cyA9IF8ubWFwKGNhbm5lZE1vZGVscywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENhbm5lZFF1ZXN0aW9uVmlldyh7bW9kZWw6IG1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG5cblxuICAgICAgICAgICAgdGhpcy5jYW5uZWRWaWV3cyA9IGNhbm5lZFZpZXdzO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RDaGFyYWN0ZXJWaWV3ID0gc2VsZWN0Q2hhclZpZXc7XG5cbiAgICAgICAgICAgIHRoaXMucGFnZXMgPSBbZW50ZXJOYW1lVmlldywgc2VsZWN0Q2hhclZpZXddLmNvbmNhdChwZXJzb25hbGl0eVZpZXdzLCBjYW5uZWRWaWV3cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5wYWdlcy1jdG4nKTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdiA9IHRoaXMuJHBhZ2VzQ29udGFpbmVyLmZpbmQoJ2Rpdi5wYWdlLW5hdicpO1xuICAgICAgICAgICAgdGhpcy4kbmV4dCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5uZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLiRmaW5pc2hTZW5kID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLmZpbmlzaC1zZW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHNraXBDdHIgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2Rpdi5za2lwJyk7XG4gICAgICAgICAgICB0aGlzLiRza2lwID0gdGhpcy4kc2tpcEN0ci5maW5kKCdhLnNraXAnKTtcblxuICAgICAgICAgICAgdGhpcy4kaGVhZGVyID0gJCgnI2hlYWRlcicpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIENhbm5lZCBRdWVzdGlvbiBWaWV3IFN0dWZmICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZDogZnVuY3Rpb24oY2FubmVkVmlldykge1xuICAgICAgICAgICAgdmFyIHVzZWRPcHRpb25zID0gXy5jb21wYWN0KGdldFZhbHVlcyh0aGlzLmNhbm5lZFZpZXdzKSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gYWxsUXVlc3Rpb25zLmdldFVudXNlZENhbm5lZE9wdGlvbnMoMywgdXNlZE9wdGlvbnMpO1xuXG4gICAgICAgICAgICBjYW5uZWRWaWV3LnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIENoYW5nZSBWaWV3IEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dGaXJzdFBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlc1swXS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYuY3NzKCdvcGFjaXR5JywgMCk7XG4gICAgICAgICAgICB0aGlzLiRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuJHNraXAuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLnJlcG9zaXRpb25QYWdlTmF2KGZhbHNlKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBhZ2VOYXYsIDAuMywge29wYWNpdHk6IDF9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAvL2hpZGUgYWN0aXZlIHBhZ2VcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4ICsgMV07XG5cbiAgICAgICAgICAgIGlmKG5leHRQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZChuZXh0UGFnZSk7XG5cbiAgICAgICAgICAgICAgICBpZighYWN0aXZlUGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NraXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9hY3RpdmUgcGFnZSBpcyBjaGFyYWN0ZXIgc2VsZWN0XG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FubmVkQ29weSgpO1xuXG4gICAgICAgICAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYW5pbWF0ZSBpbiBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TW9iaWxlQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVQYWdlLm9uSGlkZUNvbXBsZXRlKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUGFnZUluZGV4Kys7XG4gICAgICAgICAgICBhY3RpdmVQYWdlLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMucmVwb3NpdGlvblBhZ2VOYXYodHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNldENvdW50ZXIodGhpcy5hY3RpdmVQYWdlSW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93TW9iaWxlQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXIgPSB0aGlzLnNlbGVjdENoYXJhY3RlclZpZXcubW9kZWwuZ2V0KCd2YWx1ZScpO1xuXG4gICAgICAgICAgICBpZihjaGFyYWN0ZXIgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd01vYmlsZVRlYW0oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkbW9iaWxlQ2hhcmFjdGVycyA9ICQoJyNtb2JpbGUtY2hhcmFjdGVycycpLmZpbmQoJ2Rpdi5jaGFyYWN0ZXInKTtcblxuICAgICAgICAgICAgdmFyICRjaGFyYWN0ZXIgPSAkbW9iaWxlQ2hhcmFjdGVycy5maWx0ZXIoJy4nK2NoYXJhY3Rlcik7XG5cbiAgICAgICAgICAgICRjaGFyYWN0ZXIuYWRkQ2xhc3MoJ2FjdGl2ZSBzZWxlY3RlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93TW9iaWxlVGVhbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJG1vYmlsZUNoYXJhY3RlcnMgPSAkKCcjbW9iaWxlLWNoYXJhY3RlcnMnKS5maW5kKCdkaXYuY2hhcmFjdGVyJyk7XG5cbiAgICAgICAgICAgIHZhciAkY2hhcmFjdGVycyA9ICRtb2JpbGVDaGFyYWN0ZXJzLmZpbHRlcignLmR1c3R5MywgLmRpcHBlciwgLmNhYmJpZTIsIC5ibGFkZXJhbmdlciwgLndpbmRsaWZ0ZXInKTtcblxuICAgICAgICAgICAgJGNoYXJhY3RlcnMuYWRkQ2xhc3MoJ2FjdGl2ZSB0ZWFtJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd1BhZ2VBZnRlckhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxhc3RQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleC0xXTtcbiAgICAgICAgICAgIGlmKGxhc3RQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICBsYXN0UGFnZS5yZW1vdmVPcHRpb25zKCk7ICAgLy9jYW5uZWQgb3B0aW9ucyBhcmUgcmVwZWF0ZWQgYW5kIHNoYXJlIHRoZSBzYW1lIElEXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2hvdyBuZXh0IHBhZ2VcbiAgICAgICAgICAgIHZhciBuZXh0UGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICBuZXh0UGFnZS5vblNob3dDb21wbGV0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIG5leHRQYWdlLnNob3coKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPT09IHRoaXMucGFnZXMubGVuZ3RoLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dGaW5pc2hCdG4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVTa2lwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dGaW5pc2hCdG46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kbmV4dC5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRmaW5pc2hTZW5kLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hBbmRTZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLmhpZGVDb3VudGVyKCk7XG5cbiAgICAgICAgICAgIHZhciBwYWdlTW9kZWxzID0gXy5tYXAodGhpcy5wYWdlcywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLm1vZGVsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldy5zZXRSZXNwb25zZShwYWdlTW9kZWxzKTtcblxuICAgICAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vblVzZXJDaGFyYWN0ZXJPdXQoXy5iaW5kKHRoaXMuc2NlbmUucGxheVdpcGVzY3JlZW4sIHRoaXMuc2NlbmUpKTtcblxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vbldpcGVzY3JlZW5Db21wbGV0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUucmVzcG9uc2VWaWV3LnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2NlbmUuc2hvd1Jlc3BvbnNlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJyNtb2JpbGUtYmFja2dyb3VuZHMnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldy5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlcG9zaXRpb25QYWdlTmF2OiBmdW5jdGlvbihhbmltYXRlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgcGl4ZWxQb3NpdGlvbiA9IChhY3RpdmVQYWdlLiRlbC5vZmZzZXQoKS50b3AgKyBhY3RpdmVQYWdlLiRlbC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IHRoaXMuJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgICAgICAgICAgdmFyIHRvcEZyYWMgPSBNYXRoLm1pbihwaXhlbFBvc2l0aW9uL3dpbmRvd0hlaWdodCwgKHdpbmRvd0hlaWdodCAtIHRoaXMuZm9vdGVyLmhlaWdodCgpIC0gdGhpcy4kcGFnZU5hdi5vdXRlckhlaWdodCgpKS93aW5kb3dIZWlnaHQpO1xuXG4gICAgICAgICAgICB2YXIgcGVyY1RvcCA9IDEwMCAqIHRvcEZyYWMgKyAnJSc7XG5cbiAgICAgICAgICAgIGlmKCEhYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gaXNNb2JpbGUgPyAwLjEgOiAwLjI7XG5cbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGFnZU5hdiwgYW5pbWF0aW9uVGltZSwge3RvcDogcGVyY1RvcCwgZWFzZTonUXVhZC5lYXNlSW5PdXQnfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdi5jc3MoJ3RvcCcsIHBlcmNUb3ApO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgaGlkZVNraXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRza2lwQ3RyLmNzcyh7aGVpZ2h0OiAwfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHNraXAsIDAuMiwge2JvdHRvbTogJzEwMCUnLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dTa2lwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc2tpcEN0ci5hdHRyKCdzdHlsZScsICcnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kc2tpcCwgMC4yLCB7Ym90dG9tOiAwLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLnNob3coKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlQ2FubmVkQ29weTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gdGhpcy5zZWxlY3RDaGFyYWN0ZXJWaWV3LmdldFNlbGVjdGVkQ2hhcmFjdGVyKCk7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLmNhbm5lZFZpZXdzLCBmdW5jdGlvbih2aWV3KSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICBsb2FkZXIuc3RhcnQodGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50cm9WaWV3LnNob3dCZWdpblNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIG9uTmV4dDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZ1xuICAgICAgICAgICAgICAgIHx8IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdLm1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgPT09ICcnXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5hY3RpdmVQYWdlSW5kZXggPj0gKHRoaXMucGFnZXMubGVuZ3RoIC0gMSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkZpbmlzaDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZykgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLmZpbmlzaEFuZFNlbmQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Nb3VzZU1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnNjZW5lKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNoaWZ0QmFja2dyb3VuZExheWVycyhlLnBhZ2VYL3RoaXMuJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Ta2lwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nIHx8IHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFpblZpZXc7XG5cblxuXG59KSgpOyIsIlxuXG5cbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMnKTtcbnZhciBpdGVtQW5pbWF0aW9uc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFnZUl0ZW1zJyk7XG5cbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcbnZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG52YXIgUXVlc3Rpb25WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIC8vIFZhcmlhYmxlc1xuICAgIHNob3dDYWxsYmFjazogZnVuY3Rpb24oKXt9LFxuICAgIGhpZGVDYWxsYmFjazogZnVuY3Rpb24oKXt9LFxuICAgIGNsYXNzTmFtZTogJ3F1ZXN0aW9uIHBhZ2UnLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgbGFiZWwnOiAnb25SYWRpb0NoYW5nZScsXG4gICAgICAgICd0b3VjaGVuZCBsYWJlbCc6ICdvblJhZGlvQ2hhbmdlJ1xuICAgIH0sXG4gICAgLy8gRnVuY3Rpb25zXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIG9wdGlvbnMucGFyZW50LmFwcGVuZCh0aGlzLmVsKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuXG4gICAgICAgIHRoaXMuJGNvcHkgPSB0aGlzLiRlbC5maW5kKCdkaXYuY29weScpO1xuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuICAgICAgICB0aGlzLiRpbnB1dHMgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXScpO1xuXG4gICAgICAgIGlmKHRoaXMuJG9wdGlvbnMubGVuZ3RoICE9PSAwICYmICFpc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuICAgIGdldEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICByZXR1cm4gaXRlbUFuaW1hdGlvbnNNb2R1bGUuZ2V0UmFuZG9tUGVyc29uYWxpdHlBbmltYXRpb25zKHRoaXMuJG9wdGlvbnMpO1xuICAgIH0sXG4gICAgaW5pdEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgYW5pbWF0aW9ucyA9IHRoaXMuZ2V0QW5pbWF0aW9ucygpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSW4gPSBhbmltYXRpb25zWzBdO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dCA9IGFuaW1hdGlvbnNbMV07XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25Jbi52YXJzLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0NhbGxiYWNrKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC52YXJzLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH0sXG5cbiAgICBpc0Nhbm5lZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5lbC5pbm5lckhUTUwgPT09ICcnKVxuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uSW4ucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25PdXQucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25TaG93Q29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc2hvd0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgb25SYWRpb0NoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciAkYWN0aXZlSW5wdXQgPSB0aGlzLiRpbnB1dHMuZmlsdGVyKCdbY2hlY2tlZF0nKTtcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5zaWJsaW5ncygnaW5wdXQnKTtcblxuICAgICAgICBpZigkYWN0aXZlSW5wdXQgIT09ICRpbnB1dCkge1xuICAgICAgICAgICAgJGFjdGl2ZUlucHV0LnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRleHQgPSAkaW5wdXQuc2libGluZ3MoJ2Rpdi50ZXh0JykuaHRtbCgpO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogJGlucHV0LmF0dHIoJ3ZhbHVlJyksIHRleHQ6IHRleHR9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIHJlc3BvbnNlTWFwID0gcmVxdWlyZSgnLi4vZGF0YS9yZXNwb25zZU1hcC5qc29uJyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24nKTtcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24nKTtcblxuICAgIHZhciByZXNwb25zZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcmVzcG9uc2VNb2R1bGUnKTtcblxuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcbiAgICB2YXIgaXNNb2JpbGUgPSBkZXZpY2UuaXNNb2JpbGUoKTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqIFNldHVwIENhbm5lZC9QZXJzb25hbGl0eSBPcmRlcnMgKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIGZ1bmN0aW9uIGdldE9yZGVyKG9wdGlvbnMsIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBfLmNoYWluKG9wdGlvbnMpXG4gICAgICAgICAgICAucGx1Y2socHJvcGVydHkpXG4gICAgICAgICAgICAub2JqZWN0KF8ucmFuZ2Uob3B0aW9ucy5sZW5ndGgpKVxuICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29ycmVjdFBlcnNvbmFsaXR5TW9kZWwobW9kZWwsIHBlcnNvbmFsaXR5TW9kZWxzKSB7XG4gICAgICAgIHZhciB2YWwgPSBtb2RlbC5nZXQoJ3ZhbHVlJyk7XG5cbiAgICAgICAgdmFyIHBlcnNvbmFsaXR5TW9kZWwgPSBfLmZpbHRlcihwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSBtb2QuZ2V0KCduYW1lJyk7XG4gICAgICAgIH0pWzBdO1xuXG4gICAgICAgIHJldHVybiBwZXJzb25hbGl0eU1vZGVsO1xuICAgIH1cblxuXG4gICAgdmFyIGNhbm5lZE9yZGVyID0gZ2V0T3JkZXIoY2FubmVkUXVlc3Rpb25EYXRhLm9wdGlvbnMsICd2YWx1ZScpO1xuICAgIHZhciBwZXJzb25hbGl0eU9yZGVyID0gZ2V0T3JkZXIocGVyc29uYWxpdHlRdWVzdGlvbkRhdGEucXVlc3Rpb25zLCAnbmFtZScpO1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlc3BvbnNlIFZpZXcgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgZnVuY3Rpb24gaXNBbnN3ZXJlZChtb2RlbCkge1xuICAgICAgICByZXR1cm4gbW9kZWwuZ2V0KCd2YWx1ZScpICE9PSAnJztcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gaXNUcnVlQ2FubmVkKHZhbHVlKSB7XG4gICAgICByZXR1cm4gXy5pc1VuZGVmaW5lZChwZXJzb25hbGl0eU9yZGVyW3ZhbHVlXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGFzdENoYXJJc1B1bmN0dWF0aW9uKHN0cikge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoc3RyLmxlbmd0aC0xKTtcblxuICAgICAgICByZXR1cm4gYyA9PT0gJy4nIHx8IGMgPT09ICcsJyB8fCBjID09PSAnISc7XG4gICAgfVxuXG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgY2hhcmFjdGVyOiAnJyxcbiAgICAgICAgZWw6ICcjcmVzcG9uc2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhI3ByaW50dmVyc2lvbic6ICdwcmludCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQgPSAkKCcjcmVzcG9uc2UtYmcnKTtcbiAgICAgICAgICAgIHRoaXMuJHNpZ25hdHVyZSA9ICQoJyNjYXJkLWZyb20nKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVc2VybmFtZTogZnVuY3Rpb24obmFtZU1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZU1vZGVsLmdldCgndmFsdWUnKSB8fCAnRnJpZW5kJztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDYW5uZWRSZXNwb25zZXM6IGZ1bmN0aW9uKGNhbm5lZFZhbHVlcywgY2hhcmFjdGVyKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF8uY2hhaW4oY2FubmVkVmFsdWVzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIGNhbm5lZE9yZGVyW3ZhbHVlXTsgfSkgICAgLy8gc29ydCBiYXNlZCBvbiBjYW5uZWRPcmRlciBvYmplY3QgYWJvdmVcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW3ZhbHVlXTsgfSkgLy8gZ3JhYiByZXNwb25zZXMgZm9yIGVhY2ggcXVlc3Rpb25cbiAgICAgICAgICAgICAgICAudmFsdWUoKTsgICAgICAgLy8gZXhpdCBjaGFpblxuXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc29uYWxpdHlSZXNwb25zZXM6IGZ1bmN0aW9uKHBlcnNvbmFsaXR5Q2FubmVkTW9kZWxzLCBwZXJzb25hbGl0eU1vZGVscywgY2hhcmFjdGVyKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF8uY2hhaW4ocGVyc29uYWxpdHlDYW5uZWRNb2RlbHMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeShmdW5jdGlvbihtb2RlbCkgeyByZXR1cm4gcGVyc29uYWxpdHlPcmRlclttb2RlbC5nZXQoJ3ZhbHVlJyldOyB9KSAgICAvLyBzb3J0IGJhc2VkIG9uIHBlcnNvbmFsaXR5T3JkZXIgb2JqZWN0IGFib3ZlXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtb2RlbCkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgcmVzcG9uc2VzIGZvciBlYWNoIHF1ZXN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBwZXJzb25hbGl0eU1vZGVsID0gZ2V0Q29ycmVjdFBlcnNvbmFsaXR5TW9kZWwobW9kZWwsIHBlcnNvbmFsaXR5TW9kZWxzKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBlcnNvbmFsaXR5TW9kZWwuZ2V0KCd2YWx1ZScpID09PSAnZnJlbmNoZnJpZXMnIHx8IHBlcnNvbmFsaXR5TW9kZWwuZ2V0KCd2YWx1ZScpID09PSAnY2hpY2tlbm51Z2dldHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuZ2V0KCd2YWx1ZScpICsgJy1wbHVyYWwnXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVttb2RlbC5nZXQoJ3ZhbHVlJyldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgnJXRlbXBsYXRlJScsIHBlcnNvbmFsaXR5TW9kZWwuZ2V0KCd0ZXh0JykpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnZhbHVlKCk7ICAgICAgIC8vIGV4aXQgY2hhaW5cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgc2V0UmVzcG9uc2U6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgICAgICAgdmFyIG5hbWVNb2RlbCA9IG1vZGVsc1swXTtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXJNb2RlbCA9IG1vZGVsc1sxXTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbk1vZGVscyA9IF8ucmVzdChtb2RlbHMsIDIpO1xuXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldFVzZXJuYW1lKG5hbWVNb2RlbCk7XG4gICAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gY2hhcmFjdGVyTW9kZWwuZ2V0KCd2YWx1ZScpO1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXI7XG5cbiAgICAgICAgICAgIHZhciBhbnN3ZXJlZFF1ZXN0aW9ucyA9IF8uZmlsdGVyKHF1ZXN0aW9uTW9kZWxzLCBpc0Fuc3dlcmVkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNhbm5lZE1vZGVscyA9IF8uZmlsdGVyKGFuc3dlcmVkUXVlc3Rpb25zLCBmdW5jdGlvbihtb2RlbCkgeyByZXR1cm4gbW9kZWwuZ2V0KCdjbGFzcycpID09PSAnY2FubmVkJzsgfSk7XG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBfLmZpbHRlcihhbnN3ZXJlZFF1ZXN0aW9ucywgZnVuY3Rpb24obW9kZWwpIHsgcmV0dXJuIG1vZGVsLmdldCgnY2xhc3MnKSAhPT0gJ2Nhbm5lZCc7IH0pO1xuXG5cbiAgICAgICAgICAgIHZhciB0cnVlQ2FubmVkVmFsdWVzO1xuICAgICAgICAgICAgaWYoY2FubmVkTW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICB0cnVlQ2FubmVkVmFsdWVzID0gXy5jaGFpbihjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucylcbiAgICAgICAgICAgICAgICAgIC5wbHVjaygndmFsdWUnKVxuICAgICAgICAgICAgICAgICAgLmZpbHRlcihpc1RydWVDYW5uZWQpXG4gICAgICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRydWVDYW5uZWRWYWx1ZXMgPSBfLmNoYWluKGNhbm5lZE1vZGVscylcbiAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obW9kZWwpIHsgcmV0dXJuIG1vZGVsLmdldCgndmFsdWUnKTsgfSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaXNUcnVlQ2FubmVkKVxuICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5Q2FubmVkTW9kZWxzID0gXy5maWx0ZXIoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge3JldHVybiAhaXNUcnVlQ2FubmVkKG1vZGVsLmdldCgndmFsdWUnKSk7IH0pO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjYW5uZWRSZXNwb25zZXMgPSB0aGlzLmdldENhbm5lZFJlc3BvbnNlcyh0cnVlQ2FubmVkVmFsdWVzLCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5UmVzcG9uc2VzID0gdGhpcy5nZXRQZXJzb25hbGl0eVJlc3BvbnNlcyhwZXJzb25hbGl0eUNhbm5lZE1vZGVscywgcGVyc29uYWxpdHlNb2RlbHMsIGNoYXJhY3Rlcik7XG5cblxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5hZGRDbGFzcyhjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgdGhpcy4kc2lnbmF0dXJlLmFkZENsYXNzKGNoYXJhY3Rlcik7XG5cblxuXG4gICAgICAgICAgICB2YXIgZ3JlZXRpbmcgPSByZXNwb25zZU1hcFtjaGFyYWN0ZXJdWydncmVldGluZyddLnJlcGxhY2UoJyV0ZW1wbGF0ZSUnLCB1c2VyTmFtZSk7XG4gICAgICAgICAgICB2YXIgYm9keTEgPSByZXNwb25zZU1hcFtjaGFyYWN0ZXJdWydib2R5MSddO1xuICAgICAgICAgICAgdmFyIGJvZHkyID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnYm9keTInXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgdXNlck5hbWUpO1xuICAgICAgICAgICAgdmFyIHNpbmNlcmVseSA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl0uc2luY2VyZWx5O1xuXG4gICAgICAgICAgICBpZighbGFzdENoYXJJc1B1bmN0dWF0aW9uKHNpbmNlcmVseSkpIHtcbiAgICAgICAgICAgICAgICBzaW5jZXJlbHkgKz0gJywnO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGJvZHkxICsgJyAnICsgY2FubmVkUmVzcG9uc2VzLmpvaW4oJyAnKSArICcgJyArIHBlcnNvbmFsaXR5UmVzcG9uc2VzLmpvaW4oJyAnKSArICcgJyArIGJvZHkyO1xuXG5cbiAgICAgICAgICAgICQoJyNjYXJkLWdyZWV0aW5nJykuaHRtbChncmVldGluZyk7XG4gICAgICAgICAgICAkKCcjY2FyZC1ib2R5JykuaHRtbChyZXNwb25zZSk7XG4gICAgICAgICAgICAkKCcjY2FyZC1zaW5jZXJlbHknKS5odG1sKHNpbmNlcmVseSk7XG4vLyAgICAgICAgICAgICQoJyNjYXJkLWZyb20nKS5odG1sKGNoYXJhY3Rlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcblxuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZU1vZHVsZS5hbmltYXRlSW4odGhpcy5jaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnI2xldHRlcmJnLWN0cicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2JpbGVDaGFyYWN0ZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dNb2JpbGVDaGFyYWN0ZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkbW9iaWxlQ3RyID0gJCgnI21vYmlsZS1jaGFyYWN0ZXJzJyk7XG5cbiAgICAgICAgICAgIHZhciAkYWN0aXZlQ2hhcmFjdGVycyA9ICRtb2JpbGVDdHIuZmluZCgnZGl2LmNoYXJhY3Rlci5hY3RpdmUnKTtcblxuICAgICAgICAgICAgaWYodGhpcy5jaGFyYWN0ZXIgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgICAgICRhY3RpdmVDaGFyYWN0ZXJzLmZpbHRlcignLmR1c3R5MycpLnJlbW92ZUNsYXNzKCdhY3RpdmUgdGVhbSByZXNwb25zZScpO1xuXG4gICAgICAgICAgICAgICAgJG1vYmlsZUN0ci5maW5kKCdkaXYuY2hhcmFjdGVyLmR1c3R5MicpLmFkZENsYXNzKCdhY3RpdmUgdGVhbSByZXNwb25zZSBmcm9udCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXJhY3RlciA9PT0gJ2R1c3R5Jykge1xuICAgICAgICAgICAgICAgICRhY3RpdmVDaGFyYWN0ZXJzLnJlbW92ZUNsYXNzKCdhY3RpdmUgdGVhbSByZXNwb25zZScpO1xuXG4gICAgICAgICAgICAgICAgJG1vYmlsZUN0ci5maW5kKCdkaXYuY2hhcmFjdGVyLmR1c3R5MicpLmFkZENsYXNzKCdhY3RpdmUgcmVzcG9uc2UgZnJvbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGFjdGl2ZUNoYXJhY3RlcnMuYWRkQ2xhc3MoJ2Zyb250Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRhY3RpdmVDaGFyYWN0ZXJzLmFkZENsYXNzKCdyZXNwb25zZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBwcmludDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy8gd2luZG93LnByaW50KCk7XG5cbiAgICAgICAgICAgIHZhciBnID0gJCgnI2NhcmQtZ3JlZXRpbmcnKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgYiA9ICQoJyNjYXJkLWJvZHknKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgcyA9ICQoJyNjYXJkLXNpbmNlcmVseScpLmh0bWwoKTtcbi8vICAgICAgICAgICAgdmFyIGYgPSAkKCcjY2FyZC1mcm9tJykuaHRtbCgpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4od2luZG93LmxvY2F0aW9uLmhyZWYgKyAncHJpbnQucGhwJyArICc/Y2hhcj0nICsgdGhpcy5jaGFyYWN0ZXIgKyAnJmdyZWV0aW5nPScrIGcgKyAnJmJvZHk9JyArIGIgKyAnJnNpbmNlcmVseT0nICsgcyArICcmZnJvbT0nICsgdGhpcy5jaGFyYWN0ZXIpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VWaWV3O1xufSkoKTsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi4vZGF0YS9hdWRpb0Fzc2V0cy5qc29uJyk7XG5cbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcblxuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG4gICAgdmFyIGNoYXJhY3RlckF1ZGlvSWRzID0gYXVkaW9Bc3NldHMuY2hhcmFjdGVyQXVkaW9JZHM7XG5cbiAgICB2YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG4gICAgdmFyIGlzTW9iaWxlID0gZGV2aWNlLmlzTW9iaWxlKCk7XG5cbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IFF1ZXN0aW9uVmlldy5leHRlbmQoe1xuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIC8vcGFyZW50IGNvbnN0cnVjdG9yXG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTW9iaWxlQ2hhcmFjdGVycygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnNob3cuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlTW9iaWxlQ2hhcmFjdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJG1vYmlsZUNoYXJhY3RlcnMgPSAkKCcjbW9iaWxlLWNoYXJhY3RlcnMnKS5maW5kKCdkaXYuY2hhcmFjdGVyJyk7XG5cbiAgICAgICAgICAgICRtb2JpbGVDaGFyYWN0ZXJzLnJlbW92ZUNsYXNzKCdhY3RpdmUgaW50cm8gZmxpcCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNlbGVjdGVkQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgndGV4dCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLm9uUmFkaW9DaGFuZ2UuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5zaWJsaW5ncygnaW5wdXQnKTtcblxuICAgICAgICAgICAgdmFyIGNoYXIgPSAkaW5wdXQuYXR0cignaWQnKTtcblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQucGxheShjaGFyYWN0ZXJBdWRpb0lkc1tjaGFyXSk7XG5cbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5zZXRDaGFyYWN0ZXIoY2hhcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
