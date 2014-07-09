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
        "favoriteplace": "I have been flying for as long as I can remember but my favorite place to fly is above my hometown, Pumpwash Junction. I do some fancy flying there!",
        "favorite-food": "%template% sounds delicious! I mean, anything's better to eat than Vitaminamulch.",
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
        "favorite-color": "My favorite color is BLUE like the water and the sky.",
        "favorite-sport": "I don't play many sports, but I am an avid weight lifter. You'll often see me lifting heavy loads of logs in my off time"
    },
    "bladeranger": {
        "greeting": "Hi Champ!",
        "body1": "I'm Blade Ranger. But you can call me Blade.",
        "body2": "Remember, you can do anything!  You just have to train hard and have courage.  Thanks for your letter %template%.",
        "sincerely": "Your partner",
        "job": "I'm a Fire and Rescue Helicopter, and the Cheif in Charge here at Piston Peak.",
        "forestfires": "When there's a fire, I give the orders for the Air Attack Team to spring into action!",
        "firefighter": "I've been the Chief for a long time, but I wasn't always a firefighter.  This is my second career, and my most rewarding.  Now I fly in when others fly out to help those who need it most.",
        "bestfriend": "My best friends are all the trailblazers here at Piston Peak. We like to think of ourselves as the heroes of the sky!",
        "favoriteplace": "I like to fly to many places, but my favorite place is above Piston Peak. I patrol the skies and make sure all the tourists are camping by the book. Remember, safety first!",
        "favorite-food": "You say you like to eat %template%? I prefer a fresh can of oil. ",
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
        "favorite-color": "My favorite color is GREEN - it can help me hide above the pine trees.",
        "favorite-sport": "Baseball is my favorite sport. I always have five smokejumpers in my cargo - just enough to cover the bases."
    },
    "team": {
        "greeting": "Hey friend!",
        "body1": "Thanks for writing to us.",
        "body2": "Time to get back to work!",
        "sincerely": "Let's make it count!",
        "job": "The Piston Peak Air Attack Team is an elite group of firefighting aircrafts. ",
        "forestfires": "We fly in when others are flyin out. It takes a special kinda plane.",
        "firefighter": "Life doesn't always go the way you expect it. This is a second career for all of us. ",
        "bestfriend": "It takes honor, trust and bravery to earn your wings. We don't have just one best friend because we need every plane we've got to help. ",
        "favoriteplace": "Piston Peak has some great places to fly. But our favorite spot is the wooden railway bridge - with the thundering Whitewall Falls behind it.",
        "favorite-food": "%template% sounds great but we'd rather slurp down fresh cans of oil. HOIST!",
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

    console.log($passwordScreen);
} else {
    $passwordScreen.remove();
}



$(function() {
    FastClick.attach(document.body);

    app.mainView = new MainView();

    app.mainView.start();
});


module.exports = app;




},{"./device":18,"./pixi/libModifications":25,"./views/mainView":33}],20:[function(require,module,exports){



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
    + "\" />\n                        <label for=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"full-relative\"></label>\n                        <div class=\"background\"></div>\n                        <div class=\"text\">";
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

},{"hbsfy/runtime":44}],30:[function(require,module,exports){


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

},{"../animations/dustyDipper":4,"../device":18,"../pixi/scenesManager":28}],31:[function(require,module,exports){





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
},{}],32:[function(require,module,exports){

(function() {
    "use strict";

    var device = require('../device');

    if(!device.isMobile()) {
        var introModule = require('../animations/intro');
    }

    var IntroView = Backbone.View.extend({
        el: '#intro-view',
        events: {
            'click a.begin': 'onBeginClick'
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

            setTimeout(_.bind(timeline.play, timeline), 200);
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
},{"../animations/intro":5,"../device":18}],33:[function(require,module,exports){

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
            'click a.finish-send': 'onFinish',
            'click a.skip': 'onSkip',
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

            //setup options for first canned view
            this.cannedViews = _.filter(this.pages, function(page) {
                return page.model.attributes.class === 'canned';
            });

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

            var enterNameView = new EnterNameView();
            var selectCharView = new SelectCharacterView({model: charModel, parent: this.$pagesContainer});

            var questionViews = _.map(questionModels, function(questionModel) {
                return new QuestionView({model: questionModel, parent: this.$pagesContainer});
            }, this);

            this.cannedViews = _.filter(questionViews, function(questionView) {
                return questionView.isCanned();
            });
            this.selectCharacterView = selectCharView;

            console.log(this.cannedViews);

            this.pages = [enterNameView, selectCharView].concat(questionViews);
        },
        initJqueryVariables: function() {
            this.$window = $(window);

            this.$pagesContainer = this.$el.find('div.pages-ctn');

            this.$pageNav = this.$pagesContainer.find('div.page-nav');
            this.$next = this.$pageNav.find('a.next');
            this.$finishSend = this.$pageNav.find('a.finish-send');

            this.$skip = this.$pageNav.find('a.skip');

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
                }
            }

            activePage.onHideComplete(this.showPageAfterHide.bind(this));

            this.activePageIndex++;
            activePage.hide();
            this.repositionPageNav(true);

            this.footer.setCounter(this.activePageIndex);
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
                TweenLite.to(this.$pageNav, 0.2, {top: percTop, ease:'Quad.easeInOut'});
                return;
            }
            this.$pageNav.css('top', percTop);
        },


        hideSkip: function() {
            TweenLite.to(this.$skip, 0.2, {bottom: '100%', opacity: 0});
        },
        showSkip: function() {
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
                view.setCharacter(character.text);
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
},{"../animations/intro":5,"../collections/allQuestions":11,"../device":18,"../loader":20,"../pixi/mainScene":26,"../pixi/scenesManager":28,"./enterNameView":30,"./footerView":31,"./introView":32,"./questionView":34,"./responseView":35,"./selectCharacterView":36}],34:[function(require,module,exports){

var device = require('../device');

var template = require('../templates/question.hbs');
var itemAnimationsModule = require('../animations/pageItems');

var isMobile = device.isMobile();

var QuestionView = Backbone.View.extend({
    // Variables
    showCallback: function(){},
    hideCallback: function(){},
    className: 'question page',
    template: template,

    events: {
        'click input[type=radio]': 'onRadioChange'
    },
    // Functions
    initialize: function(options) {
        this.render();

        options.parent.append(this.el);

        this.$el.addClass(this.model.attributes.class);

        this.$copy = this.$el.find('div.copy');
        this.$options = this.$el.find('div.option');

        if(this.$options.length !== 0 && !isMobile)
            this.initAnimations();
    },
    getAnimations: function() {
        "use strict";

        if(this.isCanned()) {
            return itemAnimationsModule.getRandomCannedAnimations(this.$options);
        } else {
            return itemAnimationsModule.getRandomPersonalityAnimations(this.$options);
        }

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
    },
    isCanned: function() {
        "use strict";
        return this.model.attributes.class === 'canned';
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

        if(!device.isMobile()) {
            this.animationIn.play();
        } else {
            this.showCallback();
        }
    },
    hide: function() {
        if(!device.isMobile()) {
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

        var text = $(e.currentTarget).siblings('div.text').html();

        this.model.set({value: e.currentTarget.getAttribute('value'), text: text});
    }
});


module.exports = QuestionView;
},{"../animations/pageItems":6,"../device":18,"../templates/question.hbs":29}],35:[function(require,module,exports){




(function() {
    "use strict";


    var responseMap = require('../data/responseMap.json');

    var responseModule = require('../animations/responseModule');


    var device = require('../device');
    var isMobile = device.isMobile();
    var printCharacter = '';

    var ResponseView = Backbone.View.extend({
        character: '',
        el: '#response',
        events: {
            'click a#printversion': 'print'
        },

        initialize: function() {
            this.$background = $('#response-bg');
            this.$letterBackground = $('#letterbg');
            this.$signature = $('#card-from');
        },
        
        setResponse: function(models) {
          
            var userName = (models[0].attributes.value == '') ? 'Friend' : models[0].attributes.value;
            var characterModel = models[1];
            
            this.$background.addClass(characterModel.attributes.value);
            this.$signature.addClass(characterModel.attributes.value);
            printCharacter = characterModel.attributes.value;
            var answeredQuestions = _.filter(_.rest(models, 2), function(model) {return model.attributes.value !== ''});

            var partitionedQuestions = _.partition(answeredQuestions, function(model) {
                return model.attributes.class !== 'canned';
            });

            var personalityModels = partitionedQuestions[0];
            var cannedModels = partitionedQuestions[1];


            var character = characterModel.attributes.value;
            var response = "";
            this.character = character;

            // ******** sort here ********
            var cannedOrder = {
              job: 0,
              forestfires: 1,
              firefighter: 2,
              bestfriend: 3,
              favoriteplace: 4
            };
            
            var personalityOrder = {
              food: 0,
              color: 1,
              animal: 2
            };

            var sortedCannedModels = _.sortBy(cannedModels, function(model){
              return cannedOrder[model.attributes.value];
            });
            cannedModels = sortedCannedModels;
            
            var sortedPersonalityModels = _.sortBy(personalityModels, function(model){
              return personalityOrder[model.attributes.name];
            });
            
            personalityModels = sortedPersonalityModels;
            

            var personalityResponses = _.map(personalityModels, function(model)  {
                return responseMap[character][model.attributes.name].replace('%template%', model.attributes.text);
            });

            var cannedResponses = _.map(cannedModels, function(model) {
                return responseMap[character][model.attributes.value];
            });


            var greeting = responseMap[character]['greeting'].replace('%template%', userName);
            var body1 = responseMap[character]['body1'];
            var body2 = responseMap[character]['body2'].replace('%template%', userName);;
            var sincerely = responseMap[character]['sincerely'] +", ";


            response += body1 + ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ') + ' ' + body2;

            $('#card-greeting').html(greeting);
            $('#card-body').html(response);
            $('#card-sincerely').html(sincerely);
            $('#card-from').html(character);
        },

        show: function() {
            this.$el.show();
            this.$background.show();
            this.$letterBackground.addClass('active');

            if(!isMobile) {
                setTimeout(function() {
                    responseModule.animateIn(this.character);
                }.bind(this), 400);
            }
        },
        hide: function() {

        },
        
        print: function(e) {
            e.preventDefault();
            // window.print();

            var g = $('#card-greeting').html();
            var b = $('#card-body').html();
            var s = $('#card-sincerely').html();
            var f = $('#card-from').html();
            window.open(window.location.href + 'print.php' + '?char=' + printCharacter + '&greeting='+ g + '&body=' + b + '&sincerely=' + s + '&from=' + f);
            
        }
    });













    module.exports = ResponseView;
})();
},{"../animations/responseModule":9,"../data/responseMap.json":17,"../device":18}],36:[function(require,module,exports){




(function() {
    "use strict";


    var audioAssets = require('../data/audioAssets.json');

    var QuestionView = require('./questionView');

    var characterModule = require('../animations/characterModule');


    var characterAudioIds = audioAssets.characterAudioIds;

    var SelectCharacterView = QuestionView.extend({

        initialize: function(options) {
            //parent constructor
            QuestionView.prototype.initialize.call(this, options);
        },

        getSelectedCharacter: function() {
            var value = this.model.get('value');
            var options = this.model.get('options');

            return _.findWhere(options, {value: value});
        },
        onRadioChange: function(e) {
            QuestionView.prototype.onRadioChange.call(this, e);

            var char = e.currentTarget.getAttribute('id');

            createjs.Sound.play(characterAudioIds[char]);

            characterModule.setCharacter(char);
        }
    });











    module.exports = SelectCharacterView;
})();
},{"../animations/characterModule":3,"../data/audioAssets.json":13,"./questionView":34}],37:[function(require,module,exports){
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
},{"./handlebars/base":38,"./handlebars/exception":39,"./handlebars/runtime":40,"./handlebars/safe-string":41,"./handlebars/utils":42}],38:[function(require,module,exports){
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
},{"./exception":39,"./utils":42}],39:[function(require,module,exports){
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
},{}],40:[function(require,module,exports){
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
},{"./base":38,"./exception":39,"./utils":42}],41:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],42:[function(require,module,exports){
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
},{"./safe-string":41}],43:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":37}],44:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":43}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyby5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYWdlSXRlbXMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGxhY2VKdXN0T2Zmc2NyZWVuLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9RdWVzdGlvbkNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hc3NldHMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hdWRpb0Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcmVzcG9uc2VNYXAuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGV2aWNlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlXzk3YmM5MDkxLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9sb2FkZXIuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL21vZGVscy9xdWVzdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9hbGxDaGFyYWN0ZXJzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2NoYXJhY3Rlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9leHRlbmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvbGliTW9kaWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9tYWluU2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvc2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvc2NlbmVzTWFuYWdlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZW50ZXJOYW1lVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZm9vdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvaW50cm9WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9tYWluVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9yZXNwb25zZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3NlbGVjdENoYXJhY3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvYmFzZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9zYWZlLXN0cmluZy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYmFja2dyb3VuZCwgbWlkZGxlZ3JvdW5kLCBmb3JlZ3JvdW5kO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgYmFja2dyb3VuZCA9IGluaXRCYWNrZ3JvdW5kKCk7XG4gICAgbWlkZGxlZ3JvdW5kID0gaW5pdE1pZGRsZWdyb3VuZCgpO1xuICAgIGZvcmVncm91bmQgPSBpbml0Rm9yZWdyb3VuZCgpO1xufVxuZnVuY3Rpb24gc2V0QXR0cnMoc3ByaXRlKSB7XG4gICAgc3ByaXRlLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAxKTtcbiAgICBzcHJpdGUud2luZG93WCA9IDAuNTtcbiAgICBzcHJpdGUud2luZG93WSA9IDE7XG5cbiAgICBzcHJpdGUuc2NhbGVUeXBlID0gJ2NvdmVyJztcbiAgICBzcHJpdGUud2luZG93U2NhbGUgPSAxLjA2O1xufVxuZnVuY3Rpb24gaW5pdEJhY2tncm91bmQoKSB7XG4gICAgdmFyIGJhY2tncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvc2l0ZV9iZy5qcGcnKTtcblxuICAgIHNldEF0dHJzKGJhY2tncm91bmQpO1xuXG4gICAgcmV0dXJuIGJhY2tncm91bmQ7XG59XG5mdW5jdGlvbiBpbml0TWlkZGxlZ3JvdW5kKCkge1xuICAgIHZhciBtaWRkbGVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvbWlkZ3JvdW5kLnBuZycpO1xuICAgIHNldEF0dHJzKG1pZGRsZWdyb3VuZCk7XG4gICAgcmV0dXJuIG1pZGRsZWdyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRGb3JlZ3JvdW5kKCkge1xuICAgIHZhciBmb3JlZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL2ZvcmVncm91bmRfdHJlZXMucG5nJyk7XG4gICAgc2V0QXR0cnMoZm9yZWdyb3VuZCk7XG4gICAgcmV0dXJuIGZvcmVncm91bmQ7XG59XG5cblxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcbiAgICB9KSxcbiAgICBhZGRCYWNrZ3JvdW5kVG9TY2VuZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG4gICAgfSxcbiAgICBhZGRSZXN0VG9TY2VuZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQobWlkZGxlZ3JvdW5kKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZm9yZWdyb3VuZCk7XG4gICAgfSxcbiAgICBzaGlmdEJhY2tncm91bmRMYXllcnM6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZChiYWNrZ3JvdW5kKSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBiYWNrZ3JvdW5kUmF0aW8gPSAwLjc1O1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kUmF0aW8gPSAxLjU7XG4gICAgICAgIHZhciBmb3JlZ3JvdW5kUmF0aW8gPSAzO1xuXG4gICAgICAgIHZhciBiYWNrZ3JvdW5kWCA9IDAuNSAtICh4IC0gMC41KSAqIGJhY2tncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFggPSAwLjUgLSAoeCAtLjUpICogbWlkZGxlZ3JvdW5kUmF0aW8vNTA7XG4gICAgICAgIHZhciBmb3JlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBmb3JlZ3JvdW5kUmF0aW8vNTA7XG5cbiAgICAgICAgYmFja2dyb3VuZC53aW5kb3dYID0gYmFja2dyb3VuZFg7XG4gICAgICAgIG1pZGRsZWdyb3VuZC53aW5kb3dYID0gbWlkZGxlZ3JvdW5kWDtcbiAgICAgICAgZm9yZWdyb3VuZC53aW5kb3dYID0gZm9yZWdyb3VuZFg7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYmFja2dyb3VuZC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIG1pZGRsZWdyb3VuZC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGZvcmVncm91bmQudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGJhY2tncm91bmQuZGVzdHJveSgpO1xuICAgICAgICBtaWRkbGVncm91bmQuZGVzdHJveSgpO1xuICAgICAgICBmb3JlZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHdpcGVzY3JlZW5WaWRlbywgdmlkZW9UaW1lbGluZTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHdpcGVzY3JlZW5WaWRlbyA9IGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKCk7XG4gICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHdpcGVzY3JlZW5WaWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKCkge1xuICAgIHZhciB0ZXh0dXJlcyA9IFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NicsIDQwMCwgNTU2KTtcblxuICAgIHZhciB3aXBlc2NyZWVuVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAodGV4dHVyZXMpO1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dYID0gMC41O1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dZID0gMC41O1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dTY2FsZSA9IDE7XG4gICAgd2lwZXNjcmVlblZpZGVvLnNjYWxlVHlwZSA9ICdjb3Zlcic7XG5cbiAgICB3aXBlc2NyZWVuVmlkZW8uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xuICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgd2lwZXNjcmVlblZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIHJldHVybiB3aXBlc2NyZWVuVmlkZW87XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmlkZW8uX3R3ZWVuRnJhbWUgPSAwO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuZ290b0FuZFN0b3AodmFsdWUpO1xuXG4vLyAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdmFsdWU7XG4vLyAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG5cbiAgICAgICAgICAgIGNyZWF0ZWpzLlNvdW5kLnBsYXkoJ1dpcGVzY3JlZW4nKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8odmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuXG4gICAgdmFyIGZhZGVPdXRUaW1lID0gMC4yO1xuICAgIHZhciBmYWRlT3V0U3RhcnQgPSB0aW1lbGluZS5kdXJhdGlvbigpIC0gMC4xO1xuXG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ2NhbGxiYWNrJywgdGltZWxpbmUuZHVyYXRpb24oKSAtIDAuMSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHZpZGVvLCBmYWRlT3V0VGltZSwge1xuICAgICAgICBhbHBoYTogMCxcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCdcbiAgICB9KSwgZmFkZU91dFN0YXJ0KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHdpcGVzY3JlZW5WaWRlbyk7XG4gICAgfSxcbiAgICBwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnBsYXkoMCk7XG4gICAgfSxcbiAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgb25WaWRlb0NvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLmFkZChjYWxsYmFjaywgJ2NhbGxiYWNrJyk7XG4gICAgfVxufTtcblxuXG5cblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuLi9waXhpL2FsbENoYXJhY3RlcnMnKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBjaGFyYWN0ZXJOYW1lO1xudmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cblxuXG5cbmZ1bmN0aW9uIGdldE9mZnNjcmVlblgoY2hhcmFjdGVyKSB7XG4gICAgdmFyIHdpZHRoID0gY2hhcmFjdGVyLmdldEJvdW5kcygpLndpZHRoO1xuICAgIHZhciBhbmNob3JYID0gY2hhcmFjdGVyLmlkbGUuYW5jaG9yLng7XG4gICAgdmFyIHdpbmRvd1dpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuXG4gICAgcmV0dXJuICh3aW5kb3dXaWR0aCArIGFuY2hvclgqd2lkdGgpL3dpbmRvd1dpZHRoO1xufVxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGFuaW1hdGVJbiwgYW5pbWF0ZU91dDtcblxudmFyIGFuaW1hdGlvbnNJbiA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkdXN0eTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5O1xuXG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgICAgICAgICAgZHVzdHkud2luZG93WCA9IDAuNjtcbiAgICAgICAgICAgIGR1c3R5LndpbmRvd1NjYWxlID0gMC40MjtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcblxuICAgICAgICAgICAgYmxhZGUud2luZG93U2NhbGUgPSAwLjY7XG4gICAgICAgICAgICBibGFkZS53aW5kb3dYID0gLS40O1xuICAgICAgICAgICAgYmxhZGUud2luZG93WSA9IDAuNzU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjYWJiaWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllO1xuXG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2FiYmllKTtcbiAgICAgICAgICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgY2FiYmllLnJvdGF0aW9uID0gMC41NTtcbiAgICAgICAgICAgIGNhYmJpZS53aW5kb3dYID0gMC40NjtcblxuICAgICAgICAgICAgY2FiYmllLnNjYWxlLnggPSAwLjg7XG4gICAgICAgICAgICBjYWJiaWUuc2NhbGUueSA9IDAuODtcblxuICAgICAgICAgICAgY2FiYmllLmZpbHRlcnNbMF0uYmx1ciA9IDc7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHN3ZWVwVGltZSA9IGFuaW1hdGlvblRpbWUgKiA3Lzg7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE1LFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUuc2NhbGUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZS5maWx0ZXJzWzBdLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICBibHVyOiAwLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpcHBlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG5cbiAgICAgICAgICAgIGRpcHBlci5pZGxlLndpbmRvd1NjYWxlID0gMC41O1xuXG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZGlwcGVyKTtcbiAgICAgICAgICAgIGRpcHBlci5yb3RhdGlvbiA9IDAuNTU7XG4gICAgICAgICAgICBkaXBwZXIud2luZG93WCA9IDAuNDY7XG5cbiAgICAgICAgICAgIGRpcHBlci5zY2FsZS54ID0gMC44O1xuICAgICAgICAgICAgZGlwcGVyLnNjYWxlLnkgPSAwLjg7XG5cbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG4gICAgICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSA3O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBzd2VlcFRpbWUgPSBhbmltYXRpb25UaW1lICogNy84O1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xOCxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLnNjYWxlLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICBibHVyOiAwLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNTY7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbih3aW5kbGlmdGVyKTtcbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIud2luZG93WCA9IDAuNjtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbnZhciBvbkFuaW1hdGlvbk91dENhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG5mdW5jdGlvbiBvbkFuaW1hdGlvbk91dENvbXBsZXRlKCkge1xuICAgIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2soKTtcbn1cblxudmFyIGFuaW1hdGlvbnNPdXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjM7XG4gICAgdmFyIGVhc2luZyA9ICdDaXJjLmVhc2VJbk91dCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkdXN0eTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI1LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC41LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjQsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjEsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gY2FiYmllLmZpbHRlcnNbMF07XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSwge2JsdXI6IDR9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7Ymx1cjogNH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aW5kbGlmdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjMsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbicsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lICogNy84LCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogLTAuMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlSW4nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBUZWFtIEFuaW1hdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIHRlYW1BbmltYXRpb25TZXR1cChkdXN0eSwgYmxhZGUsIGNhYmJpZSwgZGlwcGVyLCB3aW5kbGlmdGVyKSB7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRHVzdHkgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICBkdXN0eS53aW5kb3dYID0gMSAtIGdldE9mZnNjcmVlblgoZHVzdHkpO1xuICAgIGR1c3R5LmlkbGUud2luZG93U2NhbGUgPSAwLjI3O1xuICAgIGR1c3R5LnJvdGF0aW9uID0gMC42O1xuICAgIGR1c3R5LmZpbHRlcnNbMF0uYmx1ciA9IDA7XG4gICAgVHdlZW5MaXRlLmtpbGxUd2VlbnNPZihkdXN0eSk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQmxhZGUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGJsYWRlKTtcbiAgICBibGFkZS53aW5kb3dYID0gMC40NTtcbiAgICBibGFkZS5pZGxlLndpbmRvd1NjYWxlID0gMC4zMztcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDYWJiaWUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgY2FiYmllLndpbmRvd1ggPSAwLjE0O1xuICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC4yNTtcbiAgICBjYWJiaWUuZmlsdGVyc1swXS5ibHVyID0gMDtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEaXBwZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuMztcbiAgICBkaXBwZXIud2luZG93WCA9IC0wLjI7XG4gICAgZGlwcGVyLndpbmRvd1kgPSAwLjI1O1xuICAgIGRpcHBlci5maWx0ZXJzWzBdLmJsdXIgPSAwO1xuICAgIGRpcHBlci5pZGxlLndpbmRvd1NjYWxlID0gMC4yMjtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gV2luZGxpZnRlciB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgd2luZGxpZnRlci53aW5kb3dYID0gLTAuMTtcbiAgICB3aW5kbGlmdGVyLndpbmRvd1kgPSAwLjc7XG4vLyAgICB3aW5kbGlmdGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjA4O1xuICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMTI7XG4gICAgd2luZGxpZnRlci5yb3RhdGlvbiA9IC0wLjM7XG4gICAgd2luZGxpZnRlci5maWx0ZXJzWzBdLmJsdXIgPSAwO1xuICAgIHdpbmRsaWZ0ZXIuZmxpcCgpO1xuXG5cbiAgICByZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICBkdXN0eS5wdXNoVG9Ub3AoKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZUluVGVhbSgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDMuODtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbi8vICAgIGFuaW1hdGlvblRpbWUgPSAxMDtcblxuICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG4gICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllVHdvO1xuICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcbiAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgIHRlYW1BbmltYXRpb25TZXR1cChkdXN0eSwgYmxhZGUsIGNhYmJpZSwgZGlwcGVyLCB3aW5kbGlmdGVyKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fiBBbmltYXRpb24gU3RhcnQgTGFiZWxzIH5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnQmxhZGUnLCAwKTtcbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnQ2FiYmllJywgYW5pbWF0aW9uVGltZSAqIDAuMTMpO1xuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdXaW5kbGlmdGVyJywgYW5pbWF0aW9uVGltZSAqIDAuMTUpO1xuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdEaXBwZXInLCBhbmltYXRpb25UaW1lICogMC40Nik7XG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ0R1c3R5JywgYW5pbWF0aW9uVGltZSAqIDAuODUpO1xuXG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQ2FiYmllIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBjYWJiaWVBbmltYXRpb25UaW1lID0gYW5pbWF0aW9uVGltZSAqIDEuMztcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGNhYmJpZSwgY2FiYmllQW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dYOiBnZXRPZmZzY3JlZW5YKGNhYmJpZSksXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAnQ2FiYmllJyk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGNhYmJpZSwgY2FiYmllQW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgIGVhc2U6ICdFeHBvLmVhc2VPdXQnXG4gICAgfSksICdDYWJiaWUnKTtcblxuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IEJsYWRlIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBibGFkZUFuaW1hdGlvblRpbWUgPSBhbmltYXRpb25UaW1lO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibGFkZSwgYmxhZGVBbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IGdldE9mZnNjcmVlblgoYmxhZGUpLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgJ0JsYWRlJyk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsYWRlLCBibGFkZUFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC41LFxuICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgIH0pLCAnQmxhZGUnKTtcblxuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBXaW5kbGlmdGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgd2luZGxpZnRlckFuaW1UaW1lID0gYW5pbWF0aW9uVGltZSAqIDEuNjtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8od2luZGxpZnRlciwgd2luZGxpZnRlckFuaW1UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IGdldE9mZnNjcmVlblgod2luZGxpZnRlciksXG4gICAgICAgIHJvdGF0aW9uOiAwLjQsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAnV2luZGxpZnRlcicpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCB3aW5kbGlmdGVyQW5pbVRpbWUgKiAwLjcsIHtcbiAgICAgICAgd2luZG93WTogMC4zNSxcbiAgICAgICAgZWFzZTogJ1F1YWQuZWFzZUluJ1xuICAgIH0pLCAnV2luZGxpZnRlcicpO1xuXG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRGlwcGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBkaXBwZXJBbmltVGltZSA9IGFuaW1hdGlvblRpbWUgKiAxLjU7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgZGlwcGVyQW5pbVRpbWUsIHtcbiAgICAgICAgd2luZG93WDogZ2V0T2Zmc2NyZWVuWChkaXBwZXIpLFxuICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksICdEaXBwZXInKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBkaXBwZXJBbmltVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjYsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksICdEaXBwZXInKTtcblxuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IER1c3R5IH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBkdXN0eUFuaW1UaW1lID0gYW5pbWF0aW9uVGltZSAqIDAuNztcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGR1c3R5QW5pbVRpbWUsIHtcbiAgICAgICAgd2luZG93WDogMC4yLFxuICAgICAgICBlYXNlOiAnUXVhZC5lYXNlSW5PdXQnXG4gICAgfSksICdEdXN0eScpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgZHVzdHlBbmltVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjI0LFxuICAgICAgICBlYXNlOiAnU2luZS5lYXNlT3V0J1xuICAgIH0pLCAnRHVzdHknKTtcblxuXG5cblxuXG4gICAgdGltZWxpbmUucGxheSgpO1xuXG4vLyAgICBuZXcgVGltZWxpbmVNYXgoe1xuLy8gICAgICAgIHN0YWdnZXI6IDAuMjcsXG4vLyAgICAgICAgYWxpZ246ICdzdGFydCcsXG4vLyAgICAgICAgdHdlZW5zOiBbXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNCxcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMixcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjU5LFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMC44Myxcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC41Mixcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMDUsXG4vLyAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC4yLFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMC43OCxcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNyxcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTYsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSlcbi8vICAgICAgICBdXG4vLyAgICB9KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZU91dFRlYW0oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjg7XG4gICAgdmFyIGVhc2luZyA9ICdDaXJjLmVhc2VJbic7XG5cbiAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5Rm91cjtcbiAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcbiAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuICAgIH0pLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IGdldE9mZnNjcmVlblgoZHVzdHkpLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cblxuICAgIHRpbWVsaW5lLnBsYXkoKTtcbi8vICAgIG5ldyBUaW1lbGluZU1heCh7XG4vLyAgICAgICAgc3RhZ2dlcjogMC4yOSxcbi8vICAgICAgICBhbGlnbjogJ3N0YXJ0Jyxcbi8vICAgICAgICB0d2VlbnM6IFtcbi8vICAgICAgICAgICAgbmV3IFRpbWVsaW5lTWF4KHtcbi8vICAgICAgICAgICAgICAgIHR3ZWVuczogW1xuLy8gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlSW4nXG4vLyAgICAgICAgICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjYsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICBdXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC44LFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMS4yLFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuNCxcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjYsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjYsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIG5ldyBUaW1lbGluZU1heCh7XG4vLyAgICAgICAgICAgICAgICB0d2VlbnM6IFtcbi8vICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuLy8gICAgICAgICAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WDogMS4zLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgXVxuLy8gICAgICAgICAgICB9KVxuLy8gICAgICAgIF0sXG4vLyAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgIGR1c3R5LmRlc3Ryb3koKTtcbi8vXG4vLyAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2soKTtcbi8vICAgICAgICB9XG4vLyAgICB9KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG5cbiAgICB9KSxcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihjaGFyYWN0ZXJOYW1lID09PSAndGVhbScpIHtcbiAgICAgICAgICAgIGFuaW1hdGVJblRlYW0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1hdGVJbiA9IGFuaW1hdGlvbnNJbltjaGFyYWN0ZXJOYW1lXTtcbiAgICAgICAgYW5pbWF0ZU91dCA9IGFuaW1hdGlvbnNPdXRbY2hhcmFjdGVyTmFtZV07XG5cbiAgICAgICAgc2V0VGltZW91dChhbmltYXRlSW4sIDcwMCk7XG4gICAgfSxcbiAgICBhbmltYXRlT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoY2hhcmFjdGVyTmFtZSA9PT0gJ3RlYW0nKSB7XG4gICAgICAgICAgICBhbmltYXRlT3V0VGVhbSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFuaW1hdGVPdXQoKTtcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuICAgIHNldENoYXJhY3RlcjogZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgICAgIGNoYXJhY3Rlck5hbWUgPSBjaGFyYWN0ZXI7XG4gICAgfSxcbiAgICBhbGxDaGFyYWN0ZXJzOiBhbGxDaGFyYWN0ZXJzXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG52YXIgYWxsQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4uL3BpeGkvYWxsQ2hhcmFjdGVycycpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgZHVzdHksIGRpcHBlciwgdGltZWxpbmVJbiwgdGltZWxpbmVPdXQsIHRpbWVsaW5lRHVzdHlIb3ZlcjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBkdXN0eSA9IGluaXRpYWxpemVEdXN0eSgpO1xuICAgIGRpcHBlciA9IGluaXRpYWxpemVEaXBwZXIoKTtcblxuICAgIHRpbWVsaW5lSW4gPSBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKTtcbiAgICB0aW1lbGluZU91dCA9IGdlbmVyYXRlQW5pbWF0aW9uT3V0VGltZWxpbmUoKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUR1c3R5KCkge1xuICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuXG4gICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzI7XG4gICAgZHVzdHkud2luZG93WCA9IDAuMTg7XG4gICAgZHVzdHkud2luZG93WSA9IC0xO1xuXG4gICAgcmV0dXJuIGR1c3R5O1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplRGlwcGVyKCkge1xuICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcblxuICAgIGRpcHBlci5mbGlwKCk7XG5cbiAgICBkaXBwZXIud2luZG93WCA9IDAuNzU7XG4gICAgZGlwcGVyLndpbmRvd1kgPSAtMTtcbiAgICBkaXBwZXIucm90YXRpb24gPSAtMC40MDtcblxuICAgIGRpcHBlci5pZGxlLndpbmRvd1NjYWxlID0gODY1LzEzNjY7XG4gICAgZGlwcGVyLmlkbGUuYW5pbWF0aW9uU2NhbGVYID0gMC43O1xuICAgIGRpcHBlci5pZGxlLmFuaW1hdGlvblNjYWxlWSA9IDAuNztcblxuICAgIGRpcHBlci5maWx0ZXJzWzBdLmJsdXIgPSAxMDtcblxuICAgIHJldHVybiBkaXBwZXI7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRlIEluICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25JblRpbWVsaW5lKCkge1xuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdmFyIHRpbWVsaW5lRHVzdHlJbiA9IGdlbmVyYXRlVGltZWxpbmVEdXN0eUluKGR1c3R5KTtcblxuICAgIHRpbWVsaW5lLmFkZCh0aW1lbGluZUR1c3R5SW4ucGxheSgpLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZUR1c3R5SG92ZXIoZHVzdHkpLnBsYXkoKSwgdGltZWxpbmVEdXN0eUluLmR1cmF0aW9uKCkpO1xuXG4gICAgdGltZWxpbmUuYWRkKGdlbmVyYXRlVGltZWxpbmVEaXBwZXJJbihkaXBwZXIpLnBsYXkoKSwgMC40KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuNTIsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxO1xuICAgIHZhciBlYXNpbmcgPSAnUXVhZC5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICByZXBlYXQ6IC0xXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAtMTUsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjA7XG4gICAgdmFyIHN3ZWVwU3RhcnRUaW1lID0gYW5pbWF0aW9uVGltZSAqIDAuMTE7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjMwLFxuICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgIH0pLCAwKTtcblxuICAgIC8vc3dlZXAgcmlnaHRcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dYOiAwLjg2LFxuICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIHN3ZWVwU3RhcnRUaW1lKTtcblxuICAgIC8vIHNjYWxlIHVwXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIuaWRsZSwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMSxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYmx1cjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgT3V0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgb25BbmltYXRpb25PdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCl7fTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmVPdXQgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb25BbmltYXRpb25PdXRDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKS5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lT3V0LmFkZChnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KS5wbGF5KCksIDApO1xuXG4gICByZXR1cm4gdGltZWxpbmVPdXQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KGRpcHBlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLmlkbGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLjQsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS40LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogLTAuMyxcbiAgICAgICAgd2luZG93WDogMS4xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUvMiwge1xuICAgICAgICBibHVyOiAxMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi40O1xuICAgIHZhciBlYXNpbmcgPSAnRXhwby5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkdXN0eS5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LmlkbGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLjMsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS4zLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IC0wLjIsXG4gICAgICAgIHdpbmRvd1g6IDAuNyxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG4gICAgfSksXG4gICAgYW5pbWF0ZUluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZWxpbmVJbi5wbGF5KDApO1xuICAgIH0sXG4gICAgYW5pbWF0ZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lT3V0LnBsYXkoMCk7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbkluQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRpbWVsaW5lSW4udmFycy5vbkNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGdldEludHJvVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwJywgMCwgMTIyKTtcbn1cbmZ1bmN0aW9uIGdldExvZ29UZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAnLCAwLCA3Mik7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBydW5uaW5nID0gdHJ1ZTtcbnZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG52YXIgc3RhZ2UgPSBuZXcgUElYSS5TdGFnZSgweDY2RkY5OSk7XG52YXIgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcigkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCksIG51bGwsIHRydWUsIHRydWUpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgLy8gYWRkIHRoZSByZW5kZXJlciB2aWV3IGVsZW1lbnQgdG8gdGhlIERPTVxuICAgIHJlbmRlcmVyLnZpZXcuc2V0QXR0cmlidXRlKCdpZCcsICdwaXhpLWludHJvJyk7XG4gICAgJCgnI2NvbnRlbnQnKS5hcHBlbmQocmVuZGVyZXIudmlldyk7XG5cbiAgICByZXF1ZXN0QW5pbUZyYW1lKGFuaW1hdGUpO1xuXG4gICAgJHdpbmRvdy5vbigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGlmKCFydW5uaW5nKSByZXR1cm47XG5cbiAgICByZXF1ZXN0QW5pbUZyYW1lKGFuaW1hdGUpO1xuXG4gICAgLy8gcmVuZGVyIHRoZSBzdGFnZVxuICAgIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBJbnRybyBWaWRlbyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB2aWRlb1RpbWVsaW5lLCB2aWRlbztcblxudmFyIHZpZGVvQ29tcGxldGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxudmFyIGJnQ29sb3JzID0ge1xuICAgIHRvcExlZnQ6IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgdG9wOiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIHRvcFJpZ2h0OiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIGJ0bUxlZnQ6IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgYnRtOiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIGJ0bVJpZ2h0OiBuZXcgUElYSS5HcmFwaGljcygpXG59O1xudmFyIGludHJvVmlkZW9Db250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG52YXIgaW50cm9GcmFtZVRvcCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBpbnRyb0ZyYW1lQnRtID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGludHJvRnJhbWVUb3BCZztcbnZhciBpbnRyb0ZyYW1lQnRtQmc7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVCYWNrZ3JvdW5kQ29sb3JzKCkge1xuXG4gICAgXy5lYWNoKGJnQ29sb3JzLCBmdW5jdGlvbihncmFwaGljKSB7XG4gICAgICAgIGdyYXBoaWMuYmVnaW5GaWxsKDB4MDcwODBCKTtcbiAgICAgICAgZ3JhcGhpYy5saW5lU3R5bGUoMCk7XG5cbiAgICAgICAgZ3JhcGhpYy5kcmF3UmVjdCgwLCAwLCAxLCAxKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUludHJvRnJhbWVUb3AoKSB7XG4gICAgaW50cm9GcmFtZVRvcEJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL2ludHJvLXRvcC5wbmcnKTtcbiAgICBpbnRyb0ZyYW1lVG9wQmcuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuXG4gICAgaW50cm9GcmFtZVRvcC53aW5kb3dYID0gLjU7XG4gICAgaW50cm9GcmFtZVRvcC53aW5kb3dZID0gLjU7XG5cbiAgICBiZ0NvbG9ycy50b3BMZWZ0LndpbmRvd1ggPSAtLjU7XG4gICAgYmdDb2xvcnMudG9wTGVmdC53aW5kb3dZID0gLS41O1xuICAgIGJnQ29sb3JzLnRvcC53aW5kb3dYID0gLS41O1xuICAgIGJnQ29sb3JzLnRvcC53aW5kb3dZID0gLS41O1xuXG4gICAgYmdDb2xvcnMudG9wUmlnaHQud2luZG93WSA9IC0uNTtcblxuICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQoYmdDb2xvcnMudG9wTGVmdCk7XG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChiZ0NvbG9ycy50b3ApO1xuICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQoYmdDb2xvcnMudG9wUmlnaHQpO1xuICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQoaW50cm9GcmFtZVRvcEJnKTtcblxuICAgIGludHJvRnJhbWVUb3BCZy5zY2FsZU1pbiA9IDAuODtcblxuICAgIGludHJvVmlkZW9Db250YWluZXIuYWRkQ2hpbGQoaW50cm9GcmFtZVRvcCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVJbnRyb0ZyYW1lQnRtKCkge1xuICAgIGludHJvRnJhbWVCdG1CZyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9pbnRyby1idG0ucG5nJyk7XG4gICAgaW50cm9GcmFtZUJ0bUJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAwKTtcblxuICAgIGludHJvRnJhbWVCdG0ud2luZG93WCA9IC41O1xuICAgIGludHJvRnJhbWVCdG0ud2luZG93WSA9IC41O1xuXG4gICAgYmdDb2xvcnMuYnRtTGVmdC53aW5kb3dYID0gLS41O1xuICAgIGJnQ29sb3JzLmJ0bS53aW5kb3dYID0gLS41O1xuXG4gICAgaW50cm9GcmFtZUJ0bS5hZGRDaGlsZChiZ0NvbG9ycy5idG1MZWZ0KTtcbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGJnQ29sb3JzLmJ0bSk7XG4gICAgaW50cm9GcmFtZUJ0bS5hZGRDaGlsZChiZ0NvbG9ycy5idG1SaWdodCk7XG4gICAgaW50cm9GcmFtZUJ0bS5hZGRDaGlsZChpbnRyb0ZyYW1lQnRtQmcpO1xuXG4gICAgaW50cm9GcmFtZUJ0bUJnLnNjYWxlTWluID0gMC44O1xuXG4gICAgaW50cm9WaWRlb0NvbnRhaW5lci5hZGRDaGlsZChpbnRyb0ZyYW1lQnRtKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvKCkge1xuICAgIHZhciBpbnRyb1ZpZGVvID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldEludHJvVGV4dHVyZXMoKSk7XG5cbiAgICBpbnRyb1ZpZGVvLndpbmRvd1ggPSAwLjU7XG4gICAgaW50cm9WaWRlby53aW5kb3dZID0gMC41O1xuICAgIGludHJvVmlkZW8uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xuXG4gICAgaW50cm9WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgaW50cm9WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICByZXR1cm4gaW50cm9WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcbiAgICB2aWRlby5fdHdlZW5GcmFtZSA9IDA7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmlkZW8sICd0d2VlbkZyYW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1t2YWx1ZSB8IDBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pO1xufVxuXG4oZnVuY3Rpb24oKSB7XG4gICAgaW5pdGlhbGl6ZUJhY2tncm91bmRDb2xvcnMoKTtcblxuICAgIHN0YWdlLmFkZENoaWxkKGludHJvVmlkZW9Db250YWluZXIpO1xufSkoKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBMb2dvICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGxvZ28sIGxvZ29UaW1lbGluZTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUxvZ28oKSB7XG4gICAgdmFyIGxvZ28gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0TG9nb1RleHR1cmVzKCkpO1xuXG4gICAgbG9nby53aW5kb3dZID0gMDtcbiAgICBsb2dvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAxKTtcblxuICAgIGxvZ28udmlzaWJsZSA9IGZhbHNlO1xuICAgIGxvZ28ubG9vcCA9IGZhbHNlO1xuXG4gICAgbG9nby5fdHdlZW5GcmFtZSA9IDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvZ28sICd0d2VlbkZyYW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1t2YWx1ZSB8IDBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxvZ287XG59XG5cbmZ1bmN0aW9uIGdldExvZ29BbmltYXRpb25UaW1lbGluZShsb2dvKSB7XG4gICAgdmFyIGZwcyA9IDMyO1xuICAgIHZhciBudW1GcmFtZXMgPSBsb2dvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxvZ28udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBsb2dvLnR3ZWVuRnJhbWUgPSAwO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGxvZ28sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmFyIGZwcyA9IDI0O1xuICAgIHZhciBudW1GcmFtZXMgPSB2aWRlby50ZXh0dXJlcy5sZW5ndGg7XG5cbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgdmFyIGVhc2luZyA9IG5ldyBTdGVwcGVkRWFzZShudW1GcmFtZXMpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTGl0ZSh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZpZGVvLnR3ZWVuRnJhbWUgPSAwO1xuICAgICAgICAgICAgY3JlYXRlanMuU291bmQucGxheSgnSW50cm9WaWRlbycsIHtkZWxheTogNTB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHZpZGVvQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgZGVsYXkgPSAwO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCBkZWxheSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGxvYWRpbmdTY3JlZW4gPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG52YXIgbG9hZGluZ0JhciA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG52YXIgbG9hZGluZ0JhY2tncm91bmQgPSBuZXcgUElYSS5HcmFwaGljcygpO1xudmFyIGxvYWRlckxvZ28gPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvcHJlbG9hZGVyX2xvZ28ucG5nJyk7XG5cbmZ1bmN0aW9uIHNldEdyYXBoaWNTY2FsZShvYmosIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBvYmouc2NhbGUueCA9IG9iai5fZ3JhcGhpY1NjYWxlICogd2lkdGg7XG5cbiAgICBpZighXy5pc1VuZGVmaW5lZChoZWlnaHQpKSB7XG4gICAgICAgIG9iai5zY2FsZS55ID0gb2JqLl9ncmFwaGljU2NhbGUgKiBoZWlnaHQ7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdExvYWRpbmdCYXIoKSB7XG4gICAgbG9hZGluZ0Jhci5iZWdpbkZpbGwoMHhDMjAwMUIpO1xuICAgIGxvYWRpbmdCYXIubGluZVN0eWxlKDApO1xuXG4gICAgbG9hZGluZ0Jhci5kcmF3UmVjdCgwLCAwLCAxLCAxNSk7XG5cbiAgICBsb2FkaW5nQmFyLl9ncmFwaGljU2NhbGUgPSAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsb2FkaW5nQmFyLCAnZ3JhcGhpY1NjYWxlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyYXBoaWNTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNTY2FsZSA9IHZhbDtcblxuICAgICAgICAgICAgc2V0R3JhcGhpY1NjYWxlKHRoaXMsICR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGxvYWRpbmdTY3JlZW4uYWRkQ2hpbGQobG9hZGluZ0Jhcik7XG59XG5mdW5jdGlvbiBpbml0TG9hZGluZ0JhY2tncm91bmQoKSB7XG4gICAgbG9hZGluZ0JhY2tncm91bmQuYmVnaW5GaWxsKDB4MDgwOTBCKTtcbiAgICBsb2FkaW5nQmFja2dyb3VuZC5saW5lU3R5bGUoMCk7XG4gICAgbG9hZGluZ0JhY2tncm91bmQuZHJhd1JlY3QoMCwgMCwgMSwgMSk7XG5cbiAgICBsb2FkaW5nQmFja2dyb3VuZC5fZ3JhcGhpY1NjYWxlID0gMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobG9hZGluZ0JhY2tncm91bmQsICdncmFwaGljU2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JhcGhpY1NjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY1NjYWxlID0gdmFsO1xuXG4gICAgICAgICAgICBzZXRHcmFwaGljU2NhbGUodGhpcywgJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbG9hZGluZ0JhY2tncm91bmQuZ3JhcGhpY1NjYWxlID0gMTtcblxuICAgIGxvYWRpbmdTY3JlZW4uYWRkQ2hpbGQobG9hZGluZ0JhY2tncm91bmQpO1xufVxuXG5mdW5jdGlvbiBpbml0TG9nbygpIHtcbiAgICBsb2FkZXJMb2dvLndpbmRvd1ggPSAwLjU7XG4gICAgbG9hZGVyTG9nby53aW5kb3dZID0gMC41O1xuXG4gICAgbG9hZGVyTG9nby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwuNSk7XG5cbiAgICBsb2FkaW5nU2NyZWVuLmFkZENoaWxkKGxvYWRlckxvZ28pO1xufVxuXG4oZnVuY3Rpb24oKSB7XG4gICAgaW5pdExvYWRpbmdCYWNrZ3JvdW5kKCk7XG4gICAgaW5pdExvYWRpbmdCYXIoKTtcbiAgICBpbml0TG9nbygpO1xuXG4gICAgc3RhZ2UuYWRkQ2hpbGQobG9hZGluZ1NjcmVlbik7XG59KSgpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiogT24gV2luZG93IFJlc2l6ZSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICB2YXIgd2lkdGggPSAkd2luZG93LndpZHRoKCk7XG4gICAgdmFyIGhlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICB1cGRhdGVMb2FkaW5nU2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICB1cGRhdGVWaWRlb0FuZEZyYW1lKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgc3RhZ2UuX29uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUxvZ28od2lkdGgsIGhlaWdodCwgdmlkZW9IZWlnaHQpIHtcbiAgICBpZihfLmlzVW5kZWZpbmVkKGxvZ28pKSByZXR1cm47XG5cbiAgICB2YXIgYm91bmRzID0gbG9nby5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgdmFyIG5ld0xvZ29IZWlnaHQgPSAoaGVpZ2h0IC0gdmlkZW9IZWlnaHQpLzI7XG4gICAgdmFyIHNjYWxlID0gTWF0aC5taW4obmV3TG9nb0hlaWdodC8oYm91bmRzLmhlaWdodCAtIDU1KSwgMSk7XG5cbiAgICBsb2dvLnNjYWxlLnggPSBzY2FsZTtcbiAgICBsb2dvLnNjYWxlLnkgPSBzY2FsZTtcblxuICAgIC8vY2FsYyBwb3NpdGlvblxuICAgIGxvZ28ud2luZG93WSA9IG5ld0xvZ29IZWlnaHQvaGVpZ2h0IC0gMC41O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2FkaW5nU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgc2V0R3JhcGhpY1NjYWxlKGxvYWRpbmdCYXIsIHdpZHRoKTtcbiAgICBzZXRHcmFwaGljU2NhbGUobG9hZGluZ0JhY2tncm91bmQsIHdpZHRoLCBoZWlnaHQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVWaWRlb0FuZEZyYW1lKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZihfLmlzVW5kZWZpbmVkKGludHJvRnJhbWVUb3BCZykpIHJldHVybjtcblxuICAgIHZhciBtYXhIZWlnaHQgPSAwLjg3O1xuICAgIHZhciBtYXhXaWR0aCA9IDAuOTU7XG5cbiAgICB2YXIgbG9jYWxCb3VuZHMgPSBpbnRyb0ZyYW1lVG9wQmcuZ2V0TG9jYWxCb3VuZHMoKTtcbiAgICB2YXIgYnRtQm91bmRzID0gaW50cm9GcmFtZUJ0bUJnLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICB2YXIgc2NhbGUgPSBNYXRoLm1pbihtYXhIZWlnaHQgKiAwLjUgKiBoZWlnaHQvbG9jYWxCb3VuZHMuaGVpZ2h0LCBtYXhXaWR0aCAqIHdpZHRoL2xvY2FsQm91bmRzLndpZHRoKTtcblxuICAgIC8va2VlcCBzY2FsZSB3aXRoaW4gb3VyIGRlZmluZWQgYm91bmRzXG4gICAgc2NhbGUgPSBNYXRoLm1heChpbnRyb0ZyYW1lVG9wQmcuc2NhbGVNaW4sIE1hdGgubWluKHNjYWxlLCBpbnRyb0ZyYW1lVG9wQmcuc2NhbGVNYXgpKTtcblxuICAgIHZhciBidG1TY2FsZSA9IHNjYWxlICogbG9jYWxCb3VuZHMud2lkdGgvYnRtQm91bmRzLndpZHRoO1xuICAgIHZhciB2aWRlb1NjYWxlID0gc2NhbGUgKiAxLjAyNDtcblxuICAgIGludHJvRnJhbWVUb3BCZy5zY2FsZS54ID0gc2NhbGU7XG4gICAgaW50cm9GcmFtZVRvcEJnLnNjYWxlLnkgPSBzY2FsZTtcblxuICAgIGludHJvRnJhbWVCdG1CZy5zY2FsZS54ID0gYnRtU2NhbGU7XG4gICAgaW50cm9GcmFtZUJ0bUJnLnNjYWxlLnkgPSBidG1TY2FsZTtcblxuICAgIHZpZGVvLnNjYWxlLnggPSB2aWRlb1NjYWxlO1xuICAgIHZpZGVvLnNjYWxlLnkgPSB2aWRlb1NjYWxlO1xuXG4gICAgdXBkYXRlVG9wRnJhbWVCYWNrZ3JvdW5kKHdpZHRoLCBoZWlnaHQsIGxvY2FsQm91bmRzLndpZHRoICogc2NhbGUsIGxvY2FsQm91bmRzLmhlaWdodCAqIHNjYWxlKTtcbiAgICB1cGRhdGVCdG1GcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgYnRtQm91bmRzLndpZHRoICogc2NhbGUsIGJ0bUJvdW5kcy5oZWlnaHQgKiBzY2FsZSk7XG4gICAgdXBkYXRlTG9nbyh3aWR0aCwgaGVpZ2h0LCB2aWRlb1NjYWxlICogdmlkZW8uZ2V0TG9jYWxCb3VuZHMoKS5oZWlnaHQpO1xufVxuZnVuY3Rpb24gdXBkYXRlVG9wRnJhbWVCYWNrZ3JvdW5kKHdpZHRoLCBoZWlnaHQsIGZyYW1lV2lkdGgsIGZyYW1lSGVpZ2h0KSB7XG4gICAgdmFyIHNpZGVXaWR0aCA9ICh3aWR0aC1mcmFtZVdpZHRoKS8yICsgZnJhbWVXaWR0aCAqIDEwMC85NzU7XG4gICAgdmFyIHRvcEhlaWdodCA9IChoZWlnaHQvMi1mcmFtZUhlaWdodCkgKyBmcmFtZUhlaWdodCAqIDEwMC8zMjY7XG5cbiAgICBiZ0NvbG9ycy50b3BMZWZ0LnNjYWxlLnggPSBzaWRlV2lkdGg7XG4gICAgYmdDb2xvcnMudG9wTGVmdC5zY2FsZS55ID0gaGVpZ2h0LzI7XG5cbiAgICBiZ0NvbG9ycy50b3Auc2NhbGUueCA9IHdpZHRoO1xuICAgIGJnQ29sb3JzLnRvcC5zY2FsZS55ID0gdG9wSGVpZ2h0O1xuXG4gICAgYmdDb2xvcnMudG9wUmlnaHQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy50b3BSaWdodC5zY2FsZS55ID0gaGVpZ2h0LzI7XG4gICAgYmdDb2xvcnMudG9wUmlnaHQud2luZG93WCA9ICh3aWR0aC1zaWRlV2lkdGgpL3dpZHRoIC0gMC41O1xufVxuZnVuY3Rpb24gdXBkYXRlQnRtRnJhbWVCYWNrZ3JvdW5kKHdpZHRoLCBoZWlnaHQsIGZyYW1lV2lkdGgsIGZyYW1lSGVpZ2h0KSB7XG4gICAgdmFyIHNpZGVXaWR0aCA9ICh3aWR0aC1mcmFtZVdpZHRoKS8yICsgZnJhbWVXaWR0aCAqIDEwMC85NzU7XG4gICAgdmFyIGJ0bUhlaWdodCA9IChoZWlnaHQvMi1mcmFtZUhlaWdodCkgKyBmcmFtZUhlaWdodCAqIDEwMC8zMjY7XG5cbiAgICBiZ0NvbG9ycy5idG1MZWZ0LnNjYWxlLnggPSBzaWRlV2lkdGg7XG4gICAgYmdDb2xvcnMuYnRtTGVmdC5zY2FsZS55ID0gaGVpZ2h0LzI7XG5cbiAgICBiZ0NvbG9ycy5idG0uc2NhbGUueCA9IHdpZHRoO1xuICAgIGJnQ29sb3JzLmJ0bS5zY2FsZS55ID0gYnRtSGVpZ2h0O1xuICAgIGJnQ29sb3JzLmJ0bS53aW5kb3dZID0gKGhlaWdodC1idG1IZWlnaHQpL2hlaWdodCAtIDAuNTtcblxuICAgIGJnQ29sb3JzLmJ0bVJpZ2h0LnNjYWxlLnggPSBzaWRlV2lkdGg7XG4gICAgYmdDb2xvcnMuYnRtUmlnaHQuc2NhbGUueSA9IGhlaWdodC8yO1xuICAgIGJnQ29sb3JzLmJ0bVJpZ2h0LndpbmRvd1ggPSAod2lkdGgtc2lkZVdpZHRoKS93aWR0aCAtIDAuNTtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0sXG4gICAgZ2V0SW50cm9GcmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBpbnRyb0ZyYW1lVG9wLFxuICAgICAgICAgICAgYnRtOiBpbnRyb0ZyYW1lQnRtXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnBsYXkoMCk7XG4gICAgfSxcbiAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2aWRlb0NvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuICAgIHVwZGF0ZUxvYWRlcjogZnVuY3Rpb24ocGVyY2VudCwgdGltZUVsYXBzZWQpIHtcbiAgICAgICAgdmFyIG9sZFggPSBsb2FkaW5nQmFyLmdyYXBoaWNTY2FsZTtcbiAgICAgICAgdmFyIG5ld1ggPSBwZXJjZW50O1xuXG4gICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gdGltZUVsYXBzZWQvMTAwMCAqIChuZXdYIC0gb2xkWCkvbmV3WDtcblxuICAgICAgICBUd2VlbkxpdGUudG8obG9hZGluZ0JhciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgZ3JhcGhpY1NjYWxlOiBuZXdYXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYXNzZXRzTG9hZGVkOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvID0gaW5pdGlhbGl6ZVZpZGVvKCk7XG4gICAgICAgIHZpZGVvVGltZWxpbmUgPSBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbyk7XG4gICAgICAgIGxvZ28gPSBpbml0aWFsaXplTG9nbygpO1xuICAgICAgICBsb2dvVGltZWxpbmUgPSBnZXRMb2dvQW5pbWF0aW9uVGltZWxpbmUobG9nbyk7XG5cbiAgICAgICAgaW50cm9WaWRlb0NvbnRhaW5lci5hZGRDaGlsZCh2aWRlbyk7XG5cbiAgICAgICAgaW5pdGlhbGl6ZUludHJvRnJhbWVUb3AoKTtcbiAgICAgICAgaW5pdGlhbGl6ZUludHJvRnJhbWVCdG0oKTtcblxuICAgICAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGxvZ28pO1xuXG4gICAgICAgIG9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGxvYWRpbmdTY3JlZW4sIDAuNCwge1xuICAgICAgICAgICAgICAgIGFscGhhOiAwLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHNlbGYucGxheVZpZGVvLmJpbmQoc2VsZiksIDYwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDYwMCk7XG4gICAgfSksXG4gICAgc2hvd0xvZ286IGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2dvVGltZWxpbmUucGxheSgpO1xuICAgIH0sXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvLmRlc3Ryb3koKTtcbiAgICAgICAgbG9nby5kZXN0cm95KCk7XG5cbiAgICAgICAgaW50cm9WaWRlb0NvbnRhaW5lciA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVUb3AgPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lQnRtID0gbnVsbDtcbiAgICAgICAgaW50cm9GcmFtZVRvcEJnID0gbnVsbDtcbiAgICAgICAgaW50cm9GcmFtZUJ0bUJnID0gbnVsbDtcblxuICAgICAgICBzdGFnZSA9IG51bGw7XG4gICAgICAgIHJlbmRlcmVyID0gbnVsbDtcbiAgICAgICAgdmlkZW8gPSBudWxsO1xuICAgICAgICBsb2dvID0gbnVsbDtcblxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJCgnI3BpeGktaW50cm8nKS5yZW1vdmUoKTtcblxuICAgICAgICAkd2luZG93Lm9mZigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuICAgIH1cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFthbmltYXRpb25Nb2R1bGVdLmNvbmNhdChPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG52YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcblxuXG5cbnZhciBwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzID0gW1xuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBmYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0Um90YXRlKV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVRvcCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXRSb3RhdGUpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVRvcCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXVxuXTtcblxudmFyIGNhbm5lZEFuaW1hdGlvblBhaXJzID0gW1xuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV1cbl07XG5cblxuXG5mdW5jdGlvbiBzdGFnZ2VySXRlbXMoJGl0ZW1zKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICB0d2VlbnM6IF8ubWFwKCRpdGVtcywgdGhpcyksXG4gICAgICAgIHN0YWdnZXI6IDAuMDdcbiAgICB9KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKiogSW5kaXZpZHVhbCBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBmYWRlSW4oJGl0ZW0sIHByb3AsIGRpc3RhbmNlLCBlYXNpbmcpIHtcbiAgICB2YXIgZnJvbSA9IHtvcGFjaXR5OiAwfTtcbiAgICBmcm9tW3Byb3BdID0gZGlzdGFuY2U7XG5cbiAgICB2YXIgdG8gPSB7b3BhY2l0eTogMSwgZWFzZTogZWFzaW5nfTtcbiAgICB0b1twcm9wXSA9IDA7XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLmZyb21UbygkaXRlbSwgYW5pbWF0aW9uVGltZSwgZnJvbSwgdG8pO1xufVxuZnVuY3Rpb24gZmFkZUluTm9Nb3ZlbWVudCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgMCwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbkZyb21SaWdodCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgNzUsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBmYWRlSW5Gcm9tVG9wKCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3knLCAtNzUsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBib3VuY2VGYWRlSW5Gcm9tUmlnaHQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDc1LCAnQmFjay5lYXNlT3V0Jyk7XG59XG5mdW5jdGlvbiBib3VuY2VGYWRlSW5Gcm9tVG9wKCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3knLCAtNzUsICdCYWNrLmVhc2VPdXQnKTtcbn1cbmZ1bmN0aW9uIHJvdGF0ZUluTGVmdCgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUuZnJvbVRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7cm90YXRpb25ZOiAtOTAsIHRyYW5zZm9ybU9yaWdpbjpcImxlZnQgNTAlIC0xMDBcIn0sIHtyb3RhdGlvblk6IDB9KTtcbn1cblxuZnVuY3Rpb24gc25hcE91dCgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAwLCBzY2FsZTogMC40LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlIDBcIiwgZWFzZTogJ0JhY2suZWFzZUluJ30pO1xufVxuZnVuY3Rpb24gc25hcE91dFJvdGF0ZSgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAwLCBzY2FsZTogMC40LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlIDBcIiwgcm90YXRpb246IC00NSwgZWFzZTogJ0JhY2suZWFzZUluJ30pO1xufVxuXG5cblxuXG5cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgZ2V0UmFuZG9tUGVyc29uYWxpdHlBbmltYXRpb25zOiBmdW5jdGlvbigkaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBfLnJhbmRvbShwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzW2ldLCBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICAgIHJldHVybiBmbmMoJGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRSYW5kb21DYW5uZWRBbmltYXRpb25zOiBmdW5jdGlvbigkaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBfLnJhbmRvbShjYW5uZWRBbmltYXRpb25QYWlycy5sZW5ndGggLSAxKTtcblxuICAgICAgICByZXR1cm4gXy5tYXAoY2FubmVkQW5pbWF0aW9uUGFpcnNbaV0sIGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgICAgcmV0dXJuIGZuYygkaXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBwYXJhY2h1dGVycywgcGFyYWNodXRlcnNDb250YWluZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgcGFyYWNodXRlcnMgPSBfLnNodWZmbGUoW2dldEJsYWNrb3V0KCksIGdldERyaXAoKSwgZ2V0RHluYW1pdGUoKV0pO1xuXG4gICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuXG4gICAgICAgIHBhcmFjaHV0ZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dYID0gMC41O1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1kgPSAtMTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEJsYWNrb3V0KCkge1xuICAgIHZhciBibGFja291dElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCIpO1xuICAgIGJsYWNrb3V0SWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjYvNjEsXG4gICAgICAgIHk6IDMzLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdCbGFja291dCcsIGJsYWNrb3V0SWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldERyaXAoKSB7XG4gICAgdmFyIGRyaXBJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2RyaXAucG5nXCIpO1xuICAgIGRyaXBJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAzNi82MSxcbiAgICAgICAgeTogMjYvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0RyaXAnLCBkcmlwSWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldER5bmFtaXRlKCkge1xuICAgIHZhciBkeW5hbWl0ZUlkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCIpO1xuICAgIGR5bmFtaXRlSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjcvNjEsXG4gICAgICAgIHk6IDMwLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEeW5hbWl0ZScsIGR5bmFtaXRlSWRsZVN0YXRlKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAzNTtcblxuICAgIHZhciBkZXB0aCA9IE1hdGgucmFuZG9tKCkgKiA1O1xuICAgIHZhciB4ID0gMC4xICsgKE1hdGgucmFuZG9tKCkgKiAwLjgpO1xuICAgIHZhciBzY2FsZSA9IDEgLSBkZXB0aCAqIDAuMi81O1xuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHBhcmFjaHV0ZXIpO1xuICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IHg7XG5cbiAgICB2YXIgcm90YXRpb24gPSAwLjM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAxLFxuICAgICAgICBlYXNlOiAnU2luZS5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyLnZpc2liaWxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBhcmFjaHV0ZXIuc2NhbGUgPSB7eDogc2NhbGUsIHk6IHNjYWxlfTtcbiAgICBwYXJhY2h1dGVyLmZpbHRlcnNbMF0uYmx1ciA9IGRlcHRoICogMy81O1xuICAgIHBhcmFjaHV0ZXIucm90YXRpb24gPSByb3RhdGlvbjtcblxuICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKTtcbn1cbmZ1bmN0aW9uIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKSB7XG4gICAgdmFyIHN3YXlUaW1lID0gMS4yO1xuICAgIHZhciBkZWMgPSAwLjAzO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiAtcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgfSk7XG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCcsXG4gICAgICAgIGRlbGF5OiBzd2F5VGltZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihyb3RhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbiAtIGRlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBfLmJpbmQocGFyYWNodXRlcnNDb250YWluZXIuYWRkQ2hpbGQsIHBhcmFjaHV0ZXJzQ29udGFpbmVyKSk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQocGFyYWNodXRlcnNDb250YWluZXIpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVOZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYocGFyYWNodXRlcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGFuaW1hdGVQYXJhY2h1dGVyKHBhcmFjaHV0ZXJzLnNoaWZ0KCkpO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhcmFjaHV0ZXJzQ29udGFpbmVyLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBfLmVhY2gocGFyYWNodXRlcnMsIGZ1bmN0aW9uKHBhcmFjaHV0ZXIpIHtcbiAgICAgICAgICAgIHBhcmFjaHV0ZXIuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIHZhciBoZWlnaHQgPSBjaGFyYWN0ZXIuc2NhbGUueSAqIGNoYXJhY3Rlci5nZXRMb2NhbEJvdW5kcygpLmhlaWdodDtcblxuICAgIGNoYXJhY3Rlci53aW5kb3dZID0gLShoZWlnaHQvMikvJCh3aW5kb3cpLmhlaWdodCgpO1xufTsiLCJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgYWxsQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4uL3BpeGkvYWxsQ2hhcmFjdGVycycpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbnZhciBzY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vcGl4aS9zY2VuZXNNYW5hZ2VyJyk7XG5cbnZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xudmFyIGxldHRlckJnO1xuXG5mdW5jdGlvbiBnZXRPZmZzY3JlZW5YKGNoYXJhY3Rlcikge1xuICAgIHZhciB3aWR0aCA9IGNoYXJhY3Rlci5nZXRCb3VuZHMoKS53aWR0aDtcbiAgICB2YXIgYW5jaG9yWCA9IGNoYXJhY3Rlci5pZGxlLmFuY2hvci54O1xuICAgIHZhciB3aW5kb3dXaWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcblxuICAgIHJldHVybiAod2luZG93V2lkdGggKyBhbmNob3JYKndpZHRoKS93aW5kb3dXaWR0aDtcbn1cblxuXG52YXIgYW5pbWF0ZUluID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS4yO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlEYXJrO1xuXG4gICAgICAgICAgICBkdXN0eS5wdXNoVG9Ub3AoKTtcbiAgICAgICAgICAgIGR1c3R5LmlkbGUud2luZG93U2NhbGUgPSAwLjM3O1xuICAgICAgICAgICAgZHVzdHkud2luZG93WCA9IDAuMjtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNzEsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yMyxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuXG4gICAgICAgICAgICBibGFkZS5wdXNoVG9Ub3AoKTtcbiAgICAgICAgICAgIGJsYWRlLmlkbGUud2luZG93U2NhbGUgPSAwLjU7XG4gICAgICAgICAgICBibGFkZS53aW5kb3dYID0gMC4zO1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGJsYWRlKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC43NCxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI0LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIGNhYmJpZS5wdXNoVG9Ub3AoKTtcbiAgICAgICAgICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgICAgICAgICBjYWJiaWUud2luZG93WCA9IDAuMzU7XG4gICAgICAgICAgICBjYWJiaWUucm90YXRpb24gPSAwO1xuICAgICAgICAgICAgY2FiYmllLmZpbHRlcnNbMF0uYmx1ciA9IDA7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE4LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcblxuICAgICAgICAgICAgZGlwcGVyLnB1c2hUb1RvcCgpO1xuICAgICAgICAgICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjQ7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZGlwcGVyKTtcbiAgICAgICAgICAgIGRpcHBlci53aW5kb3dYID0gMC40O1xuICAgICAgICAgICAgZGlwcGVyLnNjYWxlLnggPSAtMTtcbiAgICAgICAgICAgIGRpcHBlci5yb3RhdGlvbiA9IDA7XG4gICAgICAgICAgICBkaXBwZXIuZmlsdGVyc1swXS5ibHVyID0gMDtcblxuICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICB3aW5kb3dYOiAwLjY1LFxuICAgICAgICAgICAgICAgd2luZG93WTogMC4yOSxcbiAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2luZGxpZnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgICAgICAgICAgd2luZGxpZnRlci5wdXNoVG9Ub3AoKTtcbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDU7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4od2luZGxpZnRlcik7XG4gICAgICAgICAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAwLjU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNyxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI3LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlYW06IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuICAgICAgICAgICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZVR3bztcbiAgICAgICAgICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcbiAgICAgICAgICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgICAgICAgICBwcmVUZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcik7XG5cblxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn4gQW5pbWF0aW9uIFN0YXJ0IExhYmVscyB+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgICAgICAgICB0aW1lbGluZS5hZGRMYWJlbCgnRHVzdHknLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdCbGFkZScsIGFuaW1hdGlvblRpbWUgKiAwLjE1KTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdEaXBwZXInLCBhbmltYXRpb25UaW1lICogMC4zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdDYWJiaWUnLCBhbmltYXRpb25UaW1lICogMC40NSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGRMYWJlbCgnV2luZGxpZnRlcicsIGFuaW1hdGlvblRpbWUgKiAwLjYpO1xuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjUyLFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ0R1c3R5Jyk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjg3LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNDYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ0JsYWRlJyk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNixcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjIyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksICdEaXBwZXInKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjg1LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAnQ2FiYmllJyk7XG5cblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4wOCxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ1dpbmRsaWZ0ZXInKTtcblxuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5mdW5jdGlvbiBwcmVUZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcikge1xuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEdXN0eSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgIGR1c3R5LndpbmRvd1ggPSAwLjM7XG4gICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzI7XG4gICAgZHVzdHkucm90YXRpb24gPSAwLjQ4O1xuICAgIGR1c3R5LnNldFN0YXRpYygpO1xuICAgIGR1c3R5LnB1c2hUb1RvcCgpO1xuXG5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oYmxhZGUpO1xuICAgIGJsYWRlLndpbmRvd1ggPSAwLjY7XG4gICAgYmxhZGUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzQ7XG4gICAgYmxhZGUuc2V0U3RhdGljKCk7XG5cblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgIGRpcHBlci53aW5kb3dYID0gMDtcbiAgICBkaXBwZXIucm90YXRpb24gPSAwLjA4O1xuICAgIGRpcHBlci5zZXRTdGF0aWMoKTtcblxuXG4gICAgd2luZGxpZnRlci53aW5kb3dYID0gMSAtIGdldE9mZnNjcmVlblgod2luZGxpZnRlcik7XG4gICAgd2luZGxpZnRlci53aW5kb3dZID0gMC4xO1xuICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMTQ7XG4gICAgd2luZGxpZnRlci5zZXRTdGF0aWMoKTtcblxuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgY2FiYmllLndpbmRvd1ggPSAwLjY7XG4gICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjIyO1xuICAgIGNhYmJpZS5zZXRTdGF0aWMoKTtcbn1cblxuZnVuY3Rpb24gYWRkTGV0dGVyQmcoc2NlbmUpIHtcbiAgICBsZXR0ZXJCZyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9yZXNwb25zZV9sZXR0ZXJfYmcuanBnJyk7XG5cbiAgICBsZXR0ZXJCZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgLjUpO1xuICAgIGxldHRlckJnLndpbmRvd1ggPSAwLjU7XG4gICAgbGV0dGVyQmcud2luZG93WSA9IDAuNTtcblxuICAgIGxldHRlckJnLnZpc2libGUgPSBmYWxzZTtcblxuXG5cbiAgICBzY2VuZS5hZGRDaGlsZChsZXR0ZXJCZyk7XG59XG5cbmZ1bmN0aW9uIHB1c2hUb1RvcChzcHJpdGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gc3ByaXRlLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgc3ByaXRlLnBhcmVudC5hZGRDaGlsZEF0KHNwcml0ZSwgbGVuZ3RoLTEpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgICAgIHB1c2hUb1RvcChsZXR0ZXJCZyk7XG4gICAgICAgIGxldHRlckJnLnZpc2libGUgPSB0cnVlO1xuXG4gICAgICAgIGFuaW1hdGVJbltjaGFyYWN0ZXJdKCk7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBhZGRMZXR0ZXJCZyhzY2VuZSk7XG4gICAgfVxufTsiLCJcblxuXG52YXIgUXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc3Rpb24nKTtcblxuXG52YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBRdWVzdGlvblxufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db2xsZWN0aW9uOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUXVlc3Rpb25Db2xsZWN0aW9uJyk7XG5cbiAgICB2YXIgY2hhcmFjdGVyU2VsZWN0ID0gcmVxdWlyZSgnLi4vZGF0YS9jaGFyYWN0ZXJTZWxlY3QuanNvbicpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uJyk7XG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9wZXJzb25hbGl0eVF1ZXN0aW9ucy5qc29uJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoXy5zaHVmZmxlKHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhLnF1ZXN0aW9ucyksIG51bSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXRFbXB0eUNhbm5lZFF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UobnVtKSwgZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjbGFzczogY2FubmVkUXVlc3Rpb25EYXRhLmNsYXNzLFxuICAgICAgICAgICAgICAgIGNvcHk6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jb3B5LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdjYW5uZWQtcXVlc3Rpb24nICsgaSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSBuZXcgUXVlc3Rpb25Db2xsZWN0aW9uKCk7XG5cblxuICAgIC8vc2h1ZmZsZSBxdWVzdGlvbnMgYW5kIHBpY2sgM1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9ucyA9IGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKDMpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbnMgPSBnZXRFbXB0eUNhbm5lZFF1ZXN0aW9ucygzKTtcblxuXG4gICAgYWxsUXVlc3Rpb25zLmFkZChjaGFyYWN0ZXJTZWxlY3QpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQocGVyc29uYWxpdHlRdWVzdGlvbnMpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2FubmVkUXVlc3Rpb25zKTtcblxuXG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJVbnVzZWQob3B0aW9ucywgdXNlZCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlZC5pbmRleE9mKG9wdGlvbi52YWx1ZSkgPT09IC0xO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhbGxRdWVzdGlvbnMuZ2V0VW51c2VkQ2FubmVkT3B0aW9ucyA9IGZ1bmN0aW9uKG51bSwgdXNlZCkge1xuICAgICAgICB2YXIgcG9zc2libGVPcHRpb25zID0gXy5zaHVmZmxlKGZpbHRlclVudXNlZChjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucywgdXNlZCkpO1xuXG4gICAgICAgIHJldHVybiBfLmZpcnN0KHBvc3NpYmxlT3B0aW9ucywgbnVtKTtcbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbFF1ZXN0aW9ucztcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidG90YWxTaXplXCI6IDI2NzE1Njc5LFxuXHRcImFzc2V0c1wiOiB7XG5cdFx0XCJhc3NldHMvaW1nL2JsYWNrb3V0LnBuZ1wiOiAyNTA2LFxuXHRcdFwiYXNzZXRzL2ltZy9idXR0b24ucG5nXCI6IDc1NDQsXG5cdFx0XCJhc3NldHMvaW1nL2RyaXAucG5nXCI6IDMyODgsXG5cdFx0XCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiOiAyNDIwLFxuXHRcdFwiYXNzZXRzL2ltZy9mb290ZXIucG5nXCI6IDQzMzk4LFxuXHRcdFwiYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZ1wiOiAxMTU3MTQsXG5cdFx0XCJhc3NldHMvaW1nL2hlYWRlci5wbmdcIjogOTExMzgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Jhc2ViYWxsLnBuZ1wiOiAxNDI5Nyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYmxhZGVfcmFuZ2VyLnBuZ1wiOiAxNTMwOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYmx1ZS5wbmdcIjogMTA3NDksXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Jyb2Njb2xpLnBuZ1wiOiAxNDA0NSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvY2FiYmllLnBuZ1wiOiAxODk4MSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvY2FubmVkLWJ0bi5wbmdcIjogMTI0NzYsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2RpcHBlci5wbmdcIjogMTg5MjMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2R1c3R5LnBuZ1wiOiAyMDMyOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZm9vdGJhbGwucG5nXCI6IDEzNjI5LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9mcmllcy5wbmdcIjogMTE5MjgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2dyZWVuLnBuZ1wiOiAxMDc0Nyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvaG9ja2V5LnBuZ1wiOiAxMzA1Mixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvaWNlY3JlYW0ucG5nXCI6IDEyNDQyLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9udWdnZXRzLnBuZ1wiOiAxMzM0Nyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvb3JhbmdlLnBuZ1wiOiAxMDcyNCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcGJqLnBuZ1wiOiAxMjM4NCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcGl6emEucG5nXCI6IDEzNzY1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wcmludGVyLnBuZ1wiOiA0MTMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3B1cnBsZS5wbmdcIjogMTA3ODQsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3JhY2luZy5wbmdcIjogMTE0OTEsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3JlZC5wbmdcIjogMTA2NTMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3NlbmQtYnRuLnBuZ1wiOiA5OTIxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zb2NjZXIucG5nXCI6IDE1MTg5LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zd2ltX2RpdmUucG5nXCI6IDExNDI4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy90aGVfdGVhbS5wbmdcIjogMTcwOTYsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3ZvbHVtZS5wbmdcIjogMTYzLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy93aW5kbGlmdGVyLnBuZ1wiOiAxNjgyMixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMveWVsbG93LnBuZ1wiOiAxMDY3Mixcblx0XHRcImFzc2V0cy9pbWcvaW4tdGhlYXRlcnMucG5nXCI6IDI5NjcsXG5cdFx0XCJhc3NldHMvaW1nL2luLXRoZWF0cmVzM2QucG5nXCI6IDUxOTAsXG5cdFx0XCJhc3NldHMvaW1nL2ludHJvLWJ0bS5wbmdcIjogMTkwODEzLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby10b3AucG5nXCI6IDE4OTIxNixcblx0XHRcImFzc2V0cy9pbWcvbG9nby5wbmdcIjogMTI5MTI4LFxuXHRcdFwiYXNzZXRzL2ltZy9taWRncm91bmQucG5nXCI6IDY0Njg5LFxuXHRcdFwiYXNzZXRzL2ltZy9wZy5wbmdcIjogMTU1Mixcblx0XHRcImFzc2V0cy9pbWcvcHJlbG9hZGVyX2xvZ28ucG5nXCI6IDEzMDM4OSxcblx0XHRcImFzc2V0cy9pbWcvcHJpbnQucG5nXCI6IDI3NTEsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2JsYWRlLmpwZ1wiOiAxOTAyODUsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2NhYmJpZS5qcGdcIjogMjcwODM4LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kaXBwZXIuanBnXCI6IDQ0MzkxOSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfZHVzdHkuanBnXCI6IDE5NzY0Mixcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfdGVhbS5qcGdcIjogNDI2OTk5LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ193aW5kbGlmdGVyLmpwZ1wiOiAyMjE5NDksXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2xldHRlcl9iZy5qcGdcIjogNzU3MTMsXG5cdFx0XCJhc3NldHMvaW1nL3NlbmRNb3JlLnBuZ1wiOiAxMjMzMSxcblx0XHRcImFzc2V0cy9pbWcvc2l0ZV9iZy5qcGdcIjogMTg0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDAxLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMi5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDMucG5nXCI6IDU0NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA0LnBuZ1wiOiA5OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwNS5wbmdcIjogMTM5MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA2LnBuZ1wiOiA5MDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwNy5wbmdcIjogMTE1Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA4LnBuZ1wiOiAxNDEzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDkucG5nXCI6IDE1NjEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMC5wbmdcIjogMTYzOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDExLnBuZ1wiOiAxODc3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTIucG5nXCI6IDE5NTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMy5wbmdcIjogMjA0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE0LnBuZ1wiOiAyMDczLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTUucG5nXCI6IDIwODgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxNi5wbmdcIjogMjI1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE3LnBuZ1wiOiAyNDQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTgucG5nXCI6IDI1MzQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxOS5wbmdcIjogMjc0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIwLnBuZ1wiOiAyODk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjEucG5nXCI6IDMwNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyMi5wbmdcIjogMzE2MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIzLnBuZ1wiOiAzMzI1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjQucG5nXCI6IDM0ODgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNS5wbmdcIjogMzYyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI2LnBuZ1wiOiAzNzYzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjcucG5nXCI6IDM4NDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyOC5wbmdcIjogMzk0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI5LnBuZ1wiOiA0MDI4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzAucG5nXCI6IDQwNzksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMS5wbmdcIjogNDA4NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDMyLnBuZ1wiOiA0MTE0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzMucG5nXCI6IDQxNzYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNC5wbmdcIjogNDIwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM1LnBuZ1wiOiA0MTA3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzYucG5nXCI6IDQxNTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNy5wbmdcIjogNDIzMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM4LnBuZ1wiOiA0Mjk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzkucG5nXCI6IDQzNjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0MC5wbmdcIjogNDQ0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQxLnBuZ1wiOiA0NTIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDIucG5nXCI6IDQ1NDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0My5wbmdcIjogNDU5NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ0LnBuZ1wiOiA0NjY3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDUucG5nXCI6IDQ3MTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0Ni5wbmdcIjogNDc3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ3LnBuZ1wiOiA0ODcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDgucG5nXCI6IDQ5NDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0OS5wbmdcIjogNDk3MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUwLnBuZ1wiOiA1MDk3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTEucG5nXCI6IDUxMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1Mi5wbmdcIjogNTIxMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUzLnBuZ1wiOiA1MzAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTQucG5nXCI6IDgxNDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1NS5wbmdcIjogMTQ1NDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1Ni5wbmdcIjogMjEzMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1Ny5wbmdcIjogMzEwNTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1OC5wbmdcIjogMzY3MjAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1OS5wbmdcIjogNDE3NDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2MC5wbmdcIjogNDMwNzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2MS5wbmdcIjogMzgxMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2Mi5wbmdcIjogMzEyNTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2My5wbmdcIjogMzM4NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2NC5wbmdcIjogMzIzMjgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2NS5wbmdcIjogMzE1ODIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2Ni5wbmdcIjogMzE1NDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2Ny5wbmdcIjogMzE3MjIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2OC5wbmdcIjogMzE3MzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2OS5wbmdcIjogMzE3NzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3MC5wbmdcIjogMzEzOTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3MS5wbmdcIjogMzEzMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3Mi5wbmdcIjogMzE0MTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3My5wbmdcIjogMzE1ODYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3NC5wbmdcIjogMzEzNjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3NS5wbmdcIjogMzE1NTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3Ni5wbmdcIjogMzE2NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3Ny5wbmdcIjogMzE2MDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3OC5wbmdcIjogMjczNzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3OS5wbmdcIjogMzgxMzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4MC5wbmdcIjogNDk1MTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4MS5wbmdcIjogNTU1NTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4Mi5wbmdcIjogNTU0MjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4My5wbmdcIjogNjM0NDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4NC5wbmdcIjogNTU4MDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4NS5wbmdcIjogMzIxMDEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4Ni5wbmdcIjogMzUxMTAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4Ny5wbmdcIjogMjQ0NzIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4OC5wbmdcIjogMjQ3MzUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4OS5wbmdcIjogMjcyMzIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5MC5wbmdcIjogMzE5MDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5MS5wbmdcIjogMzc4ODcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5Mi5wbmdcIjogNDE1ODksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5My5wbmdcIjogNDQ5NTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5NC5wbmdcIjogNDY4NzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5NS5wbmdcIjogMzU5NzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5Ni5wbmdcIjogMjgzNjQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5Ny5wbmdcIjogMjQ5MzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5OC5wbmdcIjogMjMwOTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5OS5wbmdcIjogMjAzMzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMC5wbmdcIjogMjA5NjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMS5wbmdcIjogMTY4NDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMi5wbmdcIjogMTgzMTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMy5wbmdcIjogMTk2NzYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNC5wbmdcIjogMjIyODgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNS5wbmdcIjogMjQ3NjYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNi5wbmdcIjogMjUzMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNy5wbmdcIjogMjY4NzUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwOC5wbmdcIjogMjYxNDgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwOS5wbmdcIjogMjkzMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMC5wbmdcIjogMzM4NzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMS5wbmdcIjogMzY5MTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMi5wbmdcIjogNDA5MjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMy5wbmdcIjogNDQ0MDIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNC5wbmdcIjogNDYxMjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNS5wbmdcIjogNDM5NDgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNi5wbmdcIjogNDc0ODUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNy5wbmdcIjogNjkxMzQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExOC5wbmdcIjogMjY2NjAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExOS5wbmdcIjogMzA1NDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEyMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAxMjEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiAyMzEwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAxLnBuZ1wiOiAyMzg3Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAyLnBuZ1wiOiAyMzM4OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiAyMzM3NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA0LnBuZ1wiOiAyMzYzMSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA1LnBuZ1wiOiAyMzQxNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiAyMzI0Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA3LnBuZ1wiOiAyMzY1Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA4LnBuZ1wiOiAyMzUzMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiAyMzExMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDEwLnBuZ1wiOiAyNDIyOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDExLnBuZ1wiOiAyMzA5OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMC5wbmdcIjogNTI5ODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDEucG5nXCI6IDU1MzU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAyLnBuZ1wiOiA1NDQxNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMy5wbmdcIjogNTU1NTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDQucG5nXCI6IDUyOTg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA1LnBuZ1wiOiA1NTM1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNi5wbmdcIjogNTQ0MTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDcucG5nXCI6IDU1NTU5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA4LnBuZ1wiOiA1Mjk4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwOS5wbmdcIjogNTUzNTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTAucG5nXCI6IDU0NDE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDExLnBuZ1wiOiA1NTU1OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDAucG5nXCI6IDI5NDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwMS5wbmdcIjogMzAxMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDAyLnBuZ1wiOiAzMDA5MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDMucG5nXCI6IDMwMzYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwNC5wbmdcIjogMjk0MDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDA1LnBuZ1wiOiAzMDEzMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDYucG5nXCI6IDMwMDkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwNy5wbmdcIjogMzAzNjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDA4LnBuZ1wiOiAyOTQwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDkucG5nXCI6IDMwMTMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAxMC5wbmdcIjogMzAwOTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDExLnBuZ1wiOiAzMDM2Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMC5wbmdcIjogNDI4NjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDEucG5nXCI6IDQyMTAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAyLnBuZ1wiOiA0Mzg4OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMy5wbmdcIjogNDQ4NTgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDQucG5nXCI6IDQyODYxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA1LnBuZ1wiOiA0MjEwMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNi5wbmdcIjogNDM4ODksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDcucG5nXCI6IDQ0ODU4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA4LnBuZ1wiOiA0Mjg2MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwOS5wbmdcIjogNDIxMDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTAucG5nXCI6IDQzODg5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDExLnBuZ1wiOiA0NDg1OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDAucG5nXCI6IDQyMjA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMS5wbmdcIjogNDE4ODcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDAyLnBuZ1wiOiA0MTg0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDMucG5nXCI6IDQyMDg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNC5wbmdcIjogNDIyMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA1LnBuZ1wiOiA0MTg4Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDYucG5nXCI6IDQxODQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNy5wbmdcIjogNDIwODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA4LnBuZ1wiOiA0MjIwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDkucG5nXCI6IDQxODg3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAxMC5wbmdcIjogNDE4NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDExLnBuZ1wiOiA0MjA4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDAucG5nXCI6IDM3MjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMS5wbmdcIjogMzcyMzcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDAyLnBuZ1wiOiAzNzUwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDMucG5nXCI6IDM3Mjk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNC5wbmdcIjogMzcyNDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA1LnBuZ1wiOiAzNzIzNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDYucG5nXCI6IDM3NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNy5wbmdcIjogMzcyOTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA4LnBuZ1wiOiAzNzI0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDkucG5nXCI6IDM3MjM3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAxMC5wbmdcIjogMzc1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDExLnBuZ1wiOiAzNzI5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAwLnBuZ1wiOiAzNzc0Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAxLnBuZ1wiOiAzODE4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAyLnBuZ1wiOiAzODI1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAzLnBuZ1wiOiAzODEzOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA0LnBuZ1wiOiAzNzg3Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA1LnBuZ1wiOiAzNzY5MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA2LnBuZ1wiOiAzNzY1MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA3LnBuZ1wiOiAzNzU3MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA4LnBuZ1wiOiAzODEzNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA5LnBuZ1wiOiAzNzU1NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDEwLnBuZ1wiOiAzODAyOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDExLnBuZ1wiOiAzNzg2NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDEyLnBuZ1wiOiAzNzYzNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDEzLnBuZ1wiOiAzNzUzNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE0LnBuZ1wiOiAzODg3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE1LnBuZ1wiOiAzNzc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE2LnBuZ1wiOiAzODU3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE3LnBuZ1wiOiAzODA0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE4LnBuZ1wiOiAzODQ1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE5LnBuZ1wiOiAzODU3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIwLnBuZ1wiOiAzODIyNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIxLnBuZ1wiOiAzODExNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIyLnBuZ1wiOiAzNzU5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIzLnBuZ1wiOiAzODI2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDAucG5nXCI6IDQ0ODYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwMS5wbmdcIjogNTc3NDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDAyLnBuZ1wiOiA2MTMwOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDMucG5nXCI6IDY2MTUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwNC5wbmdcIjogNzEyMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA1LnBuZ1wiOiA4MDIwOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDYucG5nXCI6IDg5NjI4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwNy5wbmdcIjogMTQxMjcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwOC5wbmdcIjogMTQyMjcyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwOS5wbmdcIjogMTUxMTg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMC5wbmdcIjogMTU1NjYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMS5wbmdcIjogMTQzOTExLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMi5wbmdcIjogMTUyOTIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMy5wbmdcIjogMTUzODAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNC5wbmdcIjogMTU2Mzg4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNS5wbmdcIjogMTYxMTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNi5wbmdcIjogMTYzMDEzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNy5wbmdcIjogMTY4NDA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxOC5wbmdcIjogMTcxOTExLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxOS5wbmdcIjogMTc2NTYyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMC5wbmdcIjogMTc2Mjk1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMS5wbmdcIjogMTc3NTc0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMi5wbmdcIjogMTc4ODkyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMy5wbmdcIjogMTc4ODI4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNC5wbmdcIjogMTgxMzMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNS5wbmdcIjogMTgyNTAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNi5wbmdcIjogMTgzNjk2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNy5wbmdcIjogMTgzOTAwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyOC5wbmdcIjogMTg0MjAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyOS5wbmdcIjogMTg0OTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMC5wbmdcIjogMTg2NTE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMS5wbmdcIjogMTg3NTg5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMi5wbmdcIjogMTg3NTA5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMy5wbmdcIjogMTg4NjA0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNC5wbmdcIjogMTg4NjcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNS5wbmdcIjogMTg5MzMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNi5wbmdcIjogMTg5OTk2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNy5wbmdcIjogMTkwNjMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzOC5wbmdcIjogMTkwNjQxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzOS5wbmdcIjogMTkxNjY1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0MC5wbmdcIjogMTkyOTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0MS5wbmdcIjogMTk1NDU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0Mi5wbmdcIjogMTk4MDY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0My5wbmdcIjogMjAwNDc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0NC5wbmdcIjogMjAyMjUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0NS5wbmdcIjogMjAxNzc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0Ni5wbmdcIjogMjAyOTI4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0Ny5wbmdcIjogMjAyODUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0OC5wbmdcIjogMTk3ODc2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0OS5wbmdcIjogMTk2NTEzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1MC5wbmdcIjogMTk1MzYxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1MS5wbmdcIjogMTk1OTU2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1Mi5wbmdcIjogMTkyMzIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1My5wbmdcIjogMTkwNjc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1NC5wbmdcIjogMTgyMjkyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1NS5wbmdcIjogMTczOTQ5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1Ni5wbmdcIjogMTczMzc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1Ny5wbmdcIjogMTY3MDgwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1OC5wbmdcIjogMTU5NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1OS5wbmdcIjogMTU0NjQ5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2MC5wbmdcIjogMTQ5NTU0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2MS5wbmdcIjogMTQ0NzkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2Mi5wbmdcIjogMTQ1NjE5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2My5wbmdcIjogMTQ3NDUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2NC5wbmdcIjogMTM5Mzc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2NS5wbmdcIjogMTI5MDE2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2Ni5wbmdcIjogMTIyNjY1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2Ny5wbmdcIjogMTE1OTk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2OC5wbmdcIjogMTA0MzM1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2OS5wbmdcIjogOTAwNDEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDcwLnBuZ1wiOiA2Nzc0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwNzEucG5nXCI6IDQ5OTEwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiAzODE2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMS5wbmdcIjogMzgzNzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDM5MTIxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiAzODY1OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNC5wbmdcIjogMzc5NjcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDM4MTIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiAzODIzOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNy5wbmdcIjogMzgxODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDM4NDAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiAzODE2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMC5wbmdcIjogMzgzMDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDM4NTMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAwLnBuZ1wiOiAyMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDEucG5nXCI6IDIxNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwMi5wbmdcIjogMjMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAzLnBuZ1wiOiAyNTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDQucG5nXCI6IDM3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNS5wbmdcIjogNDE3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA2LnBuZ1wiOiA0NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDcucG5nXCI6IDU1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwOC5wbmdcIjogNjUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA5LnBuZ1wiOiAxMDA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEwLnBuZ1wiOiAxODYwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDExLnBuZ1wiOiAyNDMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEyLnBuZ1wiOiAzNDE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEzLnBuZ1wiOiA0NTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE0LnBuZ1wiOiA2MDg4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE1LnBuZ1wiOiA3MDg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE2LnBuZ1wiOiA3OTg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE3LnBuZ1wiOiA4Mjk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE4LnBuZ1wiOiA5NzQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE5LnBuZ1wiOiA5OTUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIwLnBuZ1wiOiA4ODAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIxLnBuZ1wiOiA5NTA1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIyLnBuZ1wiOiA5NTYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIzLnBuZ1wiOiA5NjA1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI0LnBuZ1wiOiA5NzI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI1LnBuZ1wiOiA5ODA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI2LnBuZ1wiOiA5NDQ3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI3LnBuZ1wiOiA5NDMwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI4LnBuZ1wiOiA5NTQxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI5LnBuZ1wiOiA4NzYxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMwLnBuZ1wiOiA4OTU2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMxLnBuZ1wiOiA4NTg0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMyLnBuZ1wiOiA4MzM0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMzLnBuZ1wiOiA4MTEyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM0LnBuZ1wiOiA3OTczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM1LnBuZ1wiOiA3NzY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM2LnBuZ1wiOiA3NDM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM3LnBuZ1wiOiA3Mjg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM4LnBuZ1wiOiA3MjUwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM5LnBuZ1wiOiA1MzQxOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MC5wbmdcIjogNjk1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MS5wbmdcIjogNjY2Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Mi5wbmdcIjogNjc5Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0My5wbmdcIjogNjUyNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NC5wbmdcIjogNjQ0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NS5wbmdcIjogNjMwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ni5wbmdcIjogNjQ5Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ny5wbmdcIjogNjMxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OC5wbmdcIjogNjQ0Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OS5wbmdcIjogNjc0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MC5wbmdcIjogNjc1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MS5wbmdcIjogNjgwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Mi5wbmdcIjogNjU0MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1My5wbmdcIjogNjU5Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NC5wbmdcIjogNjg2NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NS5wbmdcIjogNzExOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ni5wbmdcIjogNzM4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ny5wbmdcIjogNzU1OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OC5wbmdcIjogNzY3Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OS5wbmdcIjogNzk4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MC5wbmdcIjogNzkzMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MS5wbmdcIjogODQ0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Mi5wbmdcIjogODQ1Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2My5wbmdcIjogODcwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NC5wbmdcIjogOTE4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NS5wbmdcIjogODkyNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ni5wbmdcIjogNjQ4OTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjcucG5nXCI6IDk1NTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjgucG5nXCI6IDEwMDcyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY5LnBuZ1wiOiAxMDc4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MC5wbmdcIjogMTA1ODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzEucG5nXCI6IDEwOTUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcyLnBuZ1wiOiAxMTE3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3My5wbmdcIjogMTExMDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzQucG5nXCI6IDExNTU1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc1LnBuZ1wiOiAxMjA4Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ni5wbmdcIjogMTIwMzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzcucG5nXCI6IDEyMzc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc4LnBuZ1wiOiAxMjkwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3OS5wbmdcIjogMTMzMDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODAucG5nXCI6IDEzMzE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgxLnBuZ1wiOiAxMzczMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Mi5wbmdcIjogMTQwOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODMucG5nXCI6IDE0MTk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg0LnBuZ1wiOiAxNDcwMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4NS5wbmdcIjogMTUxMjksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODYucG5nXCI6IDE0OTIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg3LnBuZ1wiOiAxNTczNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OC5wbmdcIjogMTYyNzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODkucG5nXCI6IDE2Mjc0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkwLnBuZ1wiOiAxNjc5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5MS5wbmdcIjogMTc0MDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTIucG5nXCI6IDE3MDEzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkzLnBuZ1wiOiAxNzk3OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NC5wbmdcIjogMTg0NzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTUucG5nXCI6IDE4OTY1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk2LnBuZ1wiOiAxOTQwMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Ny5wbmdcIjogMjAwMDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTgucG5nXCI6IDE5NzM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk5LnBuZ1wiOiAyMDQxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMC5wbmdcIjogMjE0ODEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDEucG5nXCI6IDIyOTg0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAyLnBuZ1wiOiAyMzAzNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMy5wbmdcIjogMjM3MTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDQucG5nXCI6IDI1MDQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA1LnBuZ1wiOiAyNTM4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNi5wbmdcIjogMjcxNDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDcucG5nXCI6IDI3NTE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA4LnBuZ1wiOiAyOTIzMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOS5wbmdcIjogMjg4NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTAucG5nXCI6IDMwMTA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTExLnBuZ1wiOiAzMDAyOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMi5wbmdcIjogMzExMjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTMucG5nXCI6IDMzMDg2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE0LnBuZ1wiOiAzMzUyOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNS5wbmdcIjogMzU3NzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTYucG5nXCI6IDM4MjE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE3LnBuZ1wiOiAzOTI4Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOC5wbmdcIjogNDEwNDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTkucG5nXCI6IDQyNDYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIwLnBuZ1wiOiA0NDM1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMS5wbmdcIjogNDQyNzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjIucG5nXCI6IDQ2ODgwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIzLnBuZ1wiOiA1MTYzMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNC5wbmdcIjogNTM5MjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjUucG5nXCI6IDU3MjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI2LnBuZ1wiOiA1OTQ4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNy5wbmdcIjogNjA4MzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjgucG5nXCI6IDYyNzUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI5LnBuZ1wiOiA2ODE1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMC5wbmdcIjogNzE4MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzEucG5nXCI6IDc0NTcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMyLnBuZ1wiOiA4MjcyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMy5wbmdcIjogODcxNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzQucG5nXCI6IDkyNjczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM1LnBuZ1wiOiA5OTMxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNi5wbmdcIjogMTA4NDI0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM3LnBuZ1wiOiAxMTMzOTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzgucG5nXCI6IDExNzA5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOS5wbmdcIjogMTI4MTU5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQwLnBuZ1wiOiAxMzQwNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDEucG5nXCI6IDE0NDkwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Mi5wbmdcIjogMTU0ODMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQzLnBuZ1wiOiAxNjI0MDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDQucG5nXCI6IDE1Nzc0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NS5wbmdcIjogMTY2NTM4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ2LnBuZ1wiOiAxNTc4NjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDcucG5nXCI6IDE1NDIyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0OC5wbmdcIjogMTU1ODYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ5LnBuZ1wiOiAxNDQ0MDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTAucG5nXCI6IDEzODI2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MS5wbmdcIjogMTMzNjE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUyLnBuZ1wiOiAxMjI4MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTMucG5nXCI6IDExNzA3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1NC5wbmdcIjogMTIwMzAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU1LnBuZ1wiOiAxMDYwOTNcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcIm1hbmlmZXN0XCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkJsYWRlXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9ibGFkZS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiQ2FiYmllXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9jYWJiaWUub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkRpcHBlclwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vZGlwcGVyLm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJEdXN0eVwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vZHVzdHkub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIlRlYW1cIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL3RlYW0ub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL3dpbmRsaWZ0ZXIub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkludHJvVmlkZW9cIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL2NvbWluZ2F0eW91Lm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJXaXBlc2NyZWVuXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby93aXBlc2NyZWVuLm9nZ1wiXG4gICAgICAgIH1cblxuICAgIF0sXG4gICAgXCJjaGFyYWN0ZXJBdWRpb0lkc1wiOiB7XG4gICAgICAgIFwiZHVzdHlcIjogXCJEdXN0eVwiLFxuICAgICAgICBcImJsYWRlcmFuZ2VyXCI6IFwiQmxhZGVcIixcbiAgICAgICAgXCJjYWJiaWVcIjogXCJDYWJiaWVcIixcbiAgICAgICAgXCJkaXBwZXJcIjogXCJEaXBwZXJcIixcbiAgICAgICAgXCJ3aW5kbGlmdGVyXCI6IFwiV2luZGxpZnRlclwiLFxuICAgICAgICBcInRlYW1cIjogXCJUZWFtXCJcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiY2xhc3NcIjogXCJjYW5uZWRcIixcbiAgICBcImNvcHlcIjogXCJOb3cgdGhhdCB3ZSBrbm93IG1vcmUgYWJvdXQgeW91LCBpdCdzIHlvdXIgdHVybiB0byBhc2sgJWNoYXJhY3RlciUgc29tZSBxdWVzdGlvbnNcIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgam9iIGF0IFBpc3RvbiBQZWFrP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImpvYlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBkbyB5b3UgZmlnaHQgZm9yZXN0IGZpcmVzP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZvcmVzdGZpcmVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSGF2ZSB5b3UgYWx3YXlzIGJlZW4gYSBmaXJlZmlnaHRlcj9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmaXJlZmlnaHRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldobyBpcyB5b3VyIGJlc3QgZnJpZW5kP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJlc3RmcmllbmRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGVyZSBpcyB5b3VyIGZhdm9yaXRlIHBsYWNlIHRvIGZseT9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmYXZvcml0ZXBsYWNlXCJcbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJuYW1lXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY2xhc3NcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjb3B5XCI6IFwiV2hvIGRvIHlvdSB3YW50IHRvIHdyaXRlIHRvP1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkR1c3R5XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZHVzdHlcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJCbGFkZSBSYW5nZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJibGFkZXJhbmdlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkNhYmJpZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNhYmJpZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkRpcHBlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRpcHBlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ3aW5kbGlmdGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlIFRlYW1cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ0ZWFtXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgXCJyZXF1aXJlZFwiOiB0cnVlXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwicXVlc3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCdzIHlvdXIgZmF2b3JpdGUgY29sb3I/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJibHVlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3JhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJvcmFuZ2VcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJHcmVlblwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJZZWxsb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInllbGxvd1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlB1cnBsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicHVycGxlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWZvb2RcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1mb29kXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgZm9vZD9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQaXp6YVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGl6emFcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJY2UgQ3JlYW1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImljZWNyZWFtXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQnJvY2NvbGlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJyb2Njb2xpXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRnJlbmNoIEZyaWVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJmcmVuY2hmcmllc1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNoaWNrZW4gTnVnZ2V0c1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiY2hpY2tlbm51Z2dldHNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQQiZKXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwYmpcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtc3BvcnRcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1zcG9ydFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIHNwb3J0P1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkZvb3RiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb290YmFsbFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJhc2ViYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJiYXNlYmFsbFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvY2tleVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaG9ja2V5XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU3dpbW1pbmcvRGl2aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzd2ltbWluZ1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNvY2NlclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic29jY2VyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmFjaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyYWNpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJkdXN0eVwiIDoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGkgdGhlcmUhXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJJIHdhcyByZWFsbHkgZXhjaXRlZCB0byByZWNlaXZlIHlvdXIgYWlybWFpbCFcIixcbiAgICAgICAgXCJib2R5MlwiOiBcIkkndmUgZ290dGEgZ2V0IGJhY2sgdG8gZmlnaHRpbmcgZmlyZXMgaGVyZSwgYnV0IHlvdSBzdGF5IHN0cm9uZyFcIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJPdmVyIGFuZCBvdXRcIixcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYSBTRUFULCBvciBhIFNpbmdsZS1FbmdpbmUgQWlyIFRhbmtlciwgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtLCBhbiBlbGl0ZSBncm91cCBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnQuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGNhbiBzY29vcCB3YXRlciBmcm9tIGxha2VzIGFuZCBkaXZlIGludG8gdGhlIGZvcmVzdCB0byBkcm9wIHRoZSB3YXRlciBvbiB3aWxkZmlyZXMuIFNwZWVkIGNvdW50cyB3aGVuIGFuIGFpciByZXNjdWUgaXMgdW5kZXIgd2F5LCBzbyBJJ20gYWx3YXlzIHJlYWR5IHRvIGZseSBpbnRvIGRhbmdlciFcIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkJlZm9yZSBqb2luaW5nIHRoZSBBaXIgQXR0YWNrIFRlYW0sIEkgd2FzIGEgd29ybGQtZmFtb3VzIGFpciByYWNlciDigJMgSSBldmVuIHJhY2VkIGFyb3VuZCB0aGUgd29ybGQhICBOb3cgSSByYWNlIHRvIHB1dCBvdXQgZmlyZXMuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkl0IHdhc24ndCBlYXN5IGJlY29taW5nIGEgY2hhbXBpb24gcmFjZXIgb3IgYSBmaXJlZmlnaHRlciBidXQgSSd2ZSBoYWQgYW4gYW1hemluZyB0ZWFtIG9mIGZyaWVuZHMgd2l0aCBtZSBldmVyeSBzdGVwIG9mIHRoZSB3YXkhXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkgaGF2ZSBiZWVuIGZseWluZyBmb3IgYXMgbG9uZyBhcyBJIGNhbiByZW1lbWJlciBidXQgbXkgZmF2b3JpdGUgcGxhY2UgdG8gZmx5IGlzIGFib3ZlIG15IGhvbWV0b3duLCBQdW1wd2FzaCBKdW5jdGlvbi4gSSBkbyBzb21lIGZhbmN5IGZseWluZyB0aGVyZSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBzb3VuZHMgZGVsaWNpb3VzISBJIG1lYW4sIGFueXRoaW5nJ3MgYmV0dGVyIHRvIGVhdCB0aGFuIFZpdGFtaW5hbXVsY2guXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBHUkVFTi4gR3JlZW4gbWVhbnMgZ28hIEFuZCBJIGxvdmUgdG8gZ28gZmFzdC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkkgd2FzIGEgY2hhbXBpb24gcmFjZXIgbm90IHRvbyBsb25nIGFnby4gUmFjaW5nIGlzIGRlZmluaXRlbHkgbXkgZmF2b3JpdGUgc3BvcnQuXCJcbiAgICB9LFxuICAgIFwiZGlwcGVyXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhpIHRoZXJlLFwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiSSdtIERpcHBlci4gVGhhdCdzIHdoYXQgZXZlcnlvbmUgY2FsbHMgbWUuIFNvIHlvdSBjYW4gdG9vIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGhhbmtzIGZvciB3cml0aW5nIHRvIG1lICV0ZW1wbGF0ZSUuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiUmVtZW1iZXIsIHRoZSBza3kncyB0aGUgbGltaXQhXCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSBoYXZlIGEgcmVhbGx5IGltcG9ydGFudCBqb2IgZmlnaHRpbmcgd2lsZGZpcmVzLiBJJ20gYW4gYWlyIHRhbmtlciB3aXRoIHRoZSBQaXN0b24gUGVhayBBdHRhY2sgVGVhbS5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgZmlnaHQgZm9yZXN0IGZpcmVzIGluIHNldmVyYWwgd2F5cy4gIFNvbWV0aW1lcyBJIGRyb3AgcmV0YXJkYW50IHRvIGNvbnRhaW4gYSBmaXJlLiAgSSBjYW4gYWxzbyBzY29vcCB3YXRlciBmcm9tIHRoZSBsYWtlIGFuZCBkcm9wIGl0IGRpcmVjdGx5IG9uIHRoZSBmaXJlLiBNeSBib3NzIEJsYWRlIFJhbmdlciBjYWxscyBtZSBhIE11ZC1Ecm9wcGVyIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgdXNlZCB0byBoYXVsIGNhcmdvIHVwIGluIEFuY2hvcmFnZS4gWWVwLCBhIGxvdCBvZiBndXlzIGluIEFsYXNrYS4gSSB3YXMgYmVhdGluZyB0aGVtIG9mZiB3aXRoIGEgc3RpY2shXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kIGlzIGNoYW1waW9uIHJhY2VyIER1c3R5IENyb3Bob3BwZXIuIEknbSBoaXMgYmlnZ2VzdCBmYW4hXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIk15IGZhdm9yaXRlIHBsYWNlIHRvIGZseSBpcyB0aGUgRnVzZWwgTG9kZ2UsIHJpZ2h0IGhlcmUgaW4gUGlzdG9uIFBlYWsuIEl0J3Mgc28gYmVhdXRpZnVsLiBBbmQgd2hlcmUgRHVzdHkgYW5kIEkgaGFkIG91ciBmaXJzdCBkYXRlISBJdCB3YXMgYSBkYXRlLCByaWdodD8gSSdtIHByZXR0eSBzdXJlIGl0IHdhcyBhIGRhdGUuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIldoaWxlICV0ZW1wbGF0ZSUgc291bmRzIHJlYWxseSBnb29kLCB0aGVyZSdzIG5vdGhpbmcgYmV0dGVyIHRoYW4gYSBmcmVzaCBjYW4gb2Ygb2lsIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiV2hhdCdzIG15IGZhdm9yaXRlIGNvbG9yPyBZRUxMT1cgbGlrZSB0aGUgc3Vuc2hpbmUuLiBhbmQgbGlrZSBNRSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIlN3aW1taW5nL2RpdmluZyBpcyBteSBmYXZvcml0ZSBzcG9ydCEgSSBsb3ZlIGRpcHBpbmcgaW4gYW5kIG91dCBvZiB0aGUgd2F0ZXIuXCJcbiAgICB9LFxuICAgIFwid2luZGxpZnRlclwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIZWxsbyBmcmllbmQhXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJJIGVuam95ZWQgcmVhZGluZyB5b3VyIGxldHRlciFcIixcbiAgICAgICAgXCJib2R5MlwiOiBcIlRoYW5rcyBmb3IgeW91ciBsZXR0ZXIgJXRlbXBsYXRlJS5cIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJZb3VyIG5ldyBmcmllbmRcIixcbiAgICAgICAgXCJqb2JcIjogXCJJIGFtIGEgSGVhdnktTGlmdCBIZWxpY29wdGVyIHdpdGggdGhlIFBpc3RvbiBQZWFrIEFpciBBdHRhY2sgVGVhbSwgYW4gZWxpdGUgY3JldyBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnQuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJCbGFkZSBjYWxscyBtZSBhIFxcXCJNdWQgRHJvcHBlclxcXCIgYmVjYXVzZSBJIGhhdmUgYSBkZXRhY2hhYmxlIHRhbmsgbG9hZGVkIHdpdGggZmlyZSByZXRhcmRhbnQgdG8gaGVscCBwdXQgb3V0IHRoZSBmaXJlcy4gIE11ZCBpcyBzbGFuZyBmb3IgcmV0YXJkYW50LiAgSSBjYW4gaG9sZCBtb3JlIHJldGFyZGFudCB0aGFuIGFueW9uZSBlbHNlIG9uIHRoZSB0ZWFtLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgdXNlZCB0byBiZSBhIGx1bWJlcmphY2ssIGxpZnRpbmcgZG96ZW5zIG9mIGhlYXZ5IGxvZ3MgYW5kIGNhcnJ5aW5nIHRoZW0gdG8gdGhlIGx1bWJlciBtaWxsLiAgQnV0IG5vdyBJIGFtIGEgZmlyZWZpZ2h0ZXIgYW5kIHRoaXMga2VlcHMgbWUgdmVyeSBidXN5LlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJJIHdvdWxkIGxpa2UgdG8gYmUgWU9VUiBiZXN0IGZyaWVuZC5cIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBsaWtlIHRvIGZseSBtYW55IHBsYWNlcyBhbmQgYmUgb25lIHdpdGggdGhlIHdpbmQuIFRoZSB3aW5kIHNwZWFrcywgYW5kIEkgbGlzdGVuLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCIldGVtcGxhdGUlIHNvdW5kcyBkZWxpY2lvdXMhIEhhdmUgeW91IHRyaWVkIGl0IHdpdGggYSBjYW4gb2Ygb2lsPyBUaGF0J3MgbXkgZmF2b3JpdGUgZm9vZC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIk15IGZhdm9yaXRlIGNvbG9yIGlzIEJMVUUgbGlrZSB0aGUgd2F0ZXIgYW5kIHRoZSBza3kuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJIGRvbid0IHBsYXkgbWFueSBzcG9ydHMsIGJ1dCBJIGFtIGFuIGF2aWQgd2VpZ2h0IGxpZnRlci4gWW91J2xsIG9mdGVuIHNlZSBtZSBsaWZ0aW5nIGhlYXZ5IGxvYWRzIG9mIGxvZ3MgaW4gbXkgb2ZmIHRpbWVcIlxuICAgIH0sXG4gICAgXCJibGFkZXJhbmdlclwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIaSBDaGFtcCFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkknbSBCbGFkZSBSYW5nZXIuIEJ1dCB5b3UgY2FuIGNhbGwgbWUgQmxhZGUuXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJSZW1lbWJlciwgeW91IGNhbiBkbyBhbnl0aGluZyEgIFlvdSBqdXN0IGhhdmUgdG8gdHJhaW4gaGFyZCBhbmQgaGF2ZSBjb3VyYWdlLiAgVGhhbmtzIGZvciB5b3VyIGxldHRlciAldGVtcGxhdGUlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIllvdXIgcGFydG5lclwiLFxuICAgICAgICBcImpvYlwiOiBcIkknbSBhIEZpcmUgYW5kIFJlc2N1ZSBIZWxpY29wdGVyLCBhbmQgdGhlIENoZWlmIGluIENoYXJnZSBoZXJlIGF0IFBpc3RvbiBQZWFrLlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2hlbiB0aGVyZSdzIGEgZmlyZSwgSSBnaXZlIHRoZSBvcmRlcnMgZm9yIHRoZSBBaXIgQXR0YWNrIFRlYW0gdG8gc3ByaW5nIGludG8gYWN0aW9uIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSd2ZSBiZWVuIHRoZSBDaGllZiBmb3IgYSBsb25nIHRpbWUsIGJ1dCBJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gIFRoaXMgaXMgbXkgc2Vjb25kIGNhcmVlciwgYW5kIG15IG1vc3QgcmV3YXJkaW5nLiAgTm93IEkgZmx5IGluIHdoZW4gb3RoZXJzIGZseSBvdXQgdG8gaGVscCB0aG9zZSB3aG8gbmVlZCBpdCBtb3N0LlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZHMgYXJlIGFsbCB0aGUgdHJhaWxibGF6ZXJzIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFdlIGxpa2UgdG8gdGhpbmsgb2Ygb3Vyc2VsdmVzIGFzIHRoZSBoZXJvZXMgb2YgdGhlIHNreSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBsaWtlIHRvIGZseSB0byBtYW55IHBsYWNlcywgYnV0IG15IGZhdm9yaXRlIHBsYWNlIGlzIGFib3ZlIFBpc3RvbiBQZWFrLiBJIHBhdHJvbCB0aGUgc2tpZXMgYW5kIG1ha2Ugc3VyZSBhbGwgdGhlIHRvdXJpc3RzIGFyZSBjYW1waW5nIGJ5IHRoZSBib29rLiBSZW1lbWJlciwgc2FmZXR5IGZpcnN0IVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJZb3Ugc2F5IHlvdSBsaWtlIHRvIGVhdCAldGVtcGxhdGUlPyBJIHByZWZlciBhIGZyZXNoIGNhbiBvZiBvaWwuIFwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgUkVELCB0aGUgY29sb3Igb2YgRmlyZSBTYWZldHkuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJZiBJIGhhZCB0byBjaG9vc2UsIGZvb3RiYWxsIHdvdWxkIGJlIG15IGZhdm9yaXRlIHNwb3J0LlwiXG4gICAgfSxcbiAgICBcImNhYmJpZVwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJBdHRlbnRpb24gJXRlbXBsYXRlJSFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkNhYmJpZSBoZXJlLlwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGhhbmtzIGZvciB0aGUgbWVzc2FnZS5cIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJPdmVyIGFuZCBvdXRcIixcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYW4gZXgtbWlsaXRhcnkgY2FyZ28gcGxhbmUgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQXR0YWNrIFRlYW0gLSBmaXJlZmlnaHRpbmcgaXMgYSBiaWcgcmVzcG9uc2liaWxpdHkuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGNhcnJ5IHRoZSBTbW9rZWp1bXBlcnMgLSB3aG8gY2xlYXIgZmFsbGVuIHRyZWVzIGFuZCBkZWJyaXMuIER1cmluZyBhIGZpcmUsIEkgZHJvcCB0aGVtIGZyb20gdGhlIHNreSwgcmlnaHQgb3ZlciB0aGUgZmxhbWVzLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgdXNlZCB0byBkcm9wIGFpcmJvcm5lIHV0aWxpdHkgdmVoaWNsZXMgYmVoaW5kIGVuZW15IGxpbmVzIGR1cmluZyB3YXIuIE5vdyBJIGRyb3AgU21va2VqdW1wZXJzIGF0IFBpc3RvbiBQZWFrLlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJXaG8ncyBteSBiZXN0IGZyaWVuZD8gVGhhdCdzIHByb2JhYmx5IFRvcCBTZWNyZXQgYnV0IEkgY2FuIHNheSB0aGUgU21va2VqdW1wZXJzIGFyZSBteSBjbG9zZXN0IHJlY3J1aXRzLlwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJJ3ZlIGZsb3duIG92ZXIgbWFueSBwbGFjZXMgaW4gbXkgdGltZS4gTXkgZmF2b3JpdGUgc3BvdCBpcyBBbmNob3IgTGFrZSAtIGEgbG9uZyBib2R5IG9mIHdhdGVyIHdpdGggYW4gYW5jaG9yLXNoYXBlZCBpc2xhbmQuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIkluIHRoZSBtaWxpdGFyeSwgYWxsIGZvb2QgaXMgcmF0aW9uZWQgYnV0IEknbGwgdGFrZSBhcyBtdWNoIGZyZXNoIG9pbCBhcyBJIGNhbiBnZXQhIFwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgR1JFRU4gLSBpdCBjYW4gaGVscCBtZSBoaWRlIGFib3ZlIHRoZSBwaW5lIHRyZWVzLlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiQmFzZWJhbGwgaXMgbXkgZmF2b3JpdGUgc3BvcnQuIEkgYWx3YXlzIGhhdmUgZml2ZSBzbW9rZWp1bXBlcnMgaW4gbXkgY2FyZ28gLSBqdXN0IGVub3VnaCB0byBjb3ZlciB0aGUgYmFzZXMuXCJcbiAgICB9LFxuICAgIFwidGVhbVwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIZXkgZnJpZW5kIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiVGhhbmtzIGZvciB3cml0aW5nIHRvIHVzLlwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGltZSB0byBnZXQgYmFjayB0byB3b3JrIVwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIkxldCdzIG1ha2UgaXQgY291bnQhXCIsXG4gICAgICAgIFwiam9iXCI6IFwiVGhlIFBpc3RvbiBQZWFrIEFpciBBdHRhY2sgVGVhbSBpcyBhbiBlbGl0ZSBncm91cCBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnRzLiBcIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIldlIGZseSBpbiB3aGVuIG90aGVycyBhcmUgZmx5aW4gb3V0LiBJdCB0YWtlcyBhIHNwZWNpYWwga2luZGEgcGxhbmUuXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJMaWZlIGRvZXNuJ3QgYWx3YXlzIGdvIHRoZSB3YXkgeW91IGV4cGVjdCBpdC4gVGhpcyBpcyBhIHNlY29uZCBjYXJlZXIgZm9yIGFsbCBvZiB1cy4gXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkl0IHRha2VzIGhvbm9yLCB0cnVzdCBhbmQgYnJhdmVyeSB0byBlYXJuIHlvdXIgd2luZ3MuIFdlIGRvbid0IGhhdmUganVzdCBvbmUgYmVzdCBmcmllbmQgYmVjYXVzZSB3ZSBuZWVkIGV2ZXJ5IHBsYW5lIHdlJ3ZlIGdvdCB0byBoZWxwLiBcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiUGlzdG9uIFBlYWsgaGFzIHNvbWUgZ3JlYXQgcGxhY2VzIHRvIGZseS4gQnV0IG91ciBmYXZvcml0ZSBzcG90IGlzIHRoZSB3b29kZW4gcmFpbHdheSBicmlkZ2UgLSB3aXRoIHRoZSB0aHVuZGVyaW5nIFdoaXRld2FsbCBGYWxscyBiZWhpbmQgaXQuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIiV0ZW1wbGF0ZSUgc291bmRzIGdyZWF0IGJ1dCB3ZSdkIHJhdGhlciBzbHVycCBkb3duIGZyZXNoIGNhbnMgb2Ygb2lsLiBIT0lTVCFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIldlIGxpa2UgYWxsIGNvbG9ycyBvZiB0aGUgcmFpbmJvdy4gQnV0IGFzIGEgdGVhbSwgb3VyIGZhdm9yaXRlIGNvbG9yIGlzICV0ZW1wbGF0ZSUsIGp1c3QgbGlrZSB5b3UhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJdCdzIGhhcmQgdG8gcGljayBhIGZhdm9yaXRlIHNwb3J0IC0gd2UncmUgYSBmYW4gb2YgYW55dGhpbmcgdGhhdCBsZXQgdXMgd29yayBhcyBhIHRlYW0hXCJcbiAgICB9XG59IiwidmFyIGRldmljZSA9IHtcbiAgICBpc0FuZHJvaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzQW5kcm9pZFRhYmxldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpICE9PSBudWxsXG4gICAgICAgICAgICAmJiAoXG4gICAgICAgICAgICAoKHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gMCB8fCB3aW5kb3cub3JpZW50YXRpb24gPT09IDE4MCApICYmIHNjcmVlbi53aWR0aCA+IDY0MClcbiAgICAgICAgICAgICAgICB8fCAoKHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gLTkwIHx8IHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gOTApICYmIHNjcmVlbi5oZWlnaHQgPiA2NDApXG4gICAgICAgICAgICApO1xuICAgIH0sXG4gICAgaXNCbGFja0JlcnJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc0lPUzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNJcGFkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWQvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc09wZXJhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL09wZXJhIE1pbmkvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc1dpbmRvd3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvSUVNb2JpbGUvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc1RhYmxldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQW5kcm9pZFRhYmxldCgpIHx8IHRoaXMuaXNJcGFkKCk7XG4gICAgfSxcbiAgICBpc01vYmlsZTogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc1RhYmxldCgpICYmICh0aGlzLmlzSU9TKCkgfHwgdGhpcy5pc0FuZHJvaWQoKSB8fCB0aGlzLmlzQmxhY2tCZXJyeSgpIHx8IHRoaXMuaXNPcGVyYSgpIHx8IHRoaXMuaXNXaW5kb3dzKCkpO1xuICAgIH0sXG4gICAgY3VycmVudERldmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKCkpXG4gICAgICAgICAgICByZXR1cm4gXCJtb2JpbGVcIjtcbiAgICAgICAgaWYgKHRoaXMuaXNUYWJsZXQoKSlcbiAgICAgICAgICAgIHJldHVybiBcInRhYmxldFwiO1xuICAgICAgICByZXR1cm4gXCJkZXNrdG9wXCI7XG4gICAgfSxcbiAgICBjdXJyZW50RGV2aWNlTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3aXRjaCh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNBbmRyb2lkKCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJBbmRyb2lkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc0JsYWNrQmVycnkoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkJsYWNrQmVycnlcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzT3BlcmEoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk9wZXJhIE1pbmlcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzV2luZG93cygpOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSUVNb2JpbGVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzSU9TKCk6IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0lwYWQoKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiaVBhZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBcImlQaG9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkRlc2t0b3BcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRldmljZTsiLCJcblxuXG5cbi8vIGFkZHMgb3VyIGN1c3RvbSBtb2RpZmljYXRpb25zIHRvIHRoZSBQSVhJIGxpYnJhcnlcbnJlcXVpcmUoJy4vcGl4aS9saWJNb2RpZmljYXRpb25zJyk7XG5cblxuXG52YXIgTWFpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL21haW5WaWV3Jyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi9kZXZpY2UnKTtcblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBcHAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYXBwID0ge307XG5cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBQYXNzd29yZCBTY3JlZW4gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgJHBhc3N3b3JkU2NyZWVuID0gJCgnI3Bhc3N3b3JkU2NyZWVuJyk7XG5cbmlmKGRvY3VtZW50LlVSTC5pbmRleE9mKCdkaXNuZXktcGxhbmVzMi1haXJtYWlsLXN0YWdpbmcuYXp1cmV3ZWJzaXRlcy5uZXQnKSAhPT0gLTEpIHtcbiAgICAkKGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgcGFzc3dvcmQgPSAnZGlzbmV5UGxhbmVzVHdvJztcblxuICAgICAgICB2YXIgJHBhc3N3b3JkSW5wdXQgPSAkcGFzc3dvcmRTY3JlZW4uZmluZCgnaW5wdXRbdHlwZT1wYXNzd29yZF0nKTtcblxuICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmluZCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKCRwYXNzd29yZElucHV0LnZhbCgpID09PSBwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICRwYXNzd29yZFNjcmVlbi5mYWRlT3V0KDUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkcGFzc3dvcmRTY3JlZW4uc2hvdygpO1xuXG4gICAgY29uc29sZS5sb2coJHBhc3N3b3JkU2NyZWVuKTtcbn0gZWxzZSB7XG4gICAgJHBhc3N3b3JkU2NyZWVuLnJlbW92ZSgpO1xufVxuXG5cblxuJChmdW5jdGlvbigpIHtcbiAgICBGYXN0Q2xpY2suYXR0YWNoKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgYXBwLm1haW5WaWV3ID0gbmV3IE1haW5WaWV3KCk7XG5cbiAgICBhcHAubWFpblZpZXcuc3RhcnQoKTtcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gYXBwO1xuXG5cblxuIiwiXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogQXVkaW8gTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGF1ZGlvQXNzZXREYXRhID0gcmVxdWlyZSgnLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcbnZhciBudW1BdWRpb0Fzc2V0cyA9IGF1ZGlvQXNzZXREYXRhLm1hbmlmZXN0Lmxlbmd0aDtcblxuXG5cbmZ1bmN0aW9uIHN0YXJ0QXVkaW9Mb2FkZXIoKSB7XG4gICAgLy8gaWYgaW5pdGlhbGl6ZURlZmF1bHRQbHVnaW5zIHJldHVybnMgZmFsc2UsIHdlIGNhbm5vdCBwbGF5IHNvdW5kXG4gICAgaWYgKCFjcmVhdGVqcy5Tb3VuZC5pbml0aWFsaXplRGVmYXVsdFBsdWdpbnMoKSkgeyByZXR1cm47IH1cblxuICAgIGNyZWF0ZWpzLlNvdW5kLmFsdGVybmF0ZUV4dGVuc2lvbnMgPSBbXCJtcDNcIl07XG4gICAgY3JlYXRlanMuU291bmQuYWRkRXZlbnRMaXN0ZW5lcihcImZpbGVsb2FkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIH0pO1xuICAgIGNyZWF0ZWpzLlNvdW5kLnJlZ2lzdGVyTWFuaWZlc3QoYXVkaW9Bc3NldERhdGEubWFuaWZlc3QpO1xuXG4gICAgY3JlYXRlanMuU291bmQuc2V0Vm9sdW1lKDAuNCk7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBQcmltYXJ5IExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4vZGF0YS9hc3NldHMuanNvbicpO1xuXG52YXIgZmlsZU5hbWVzID0gT2JqZWN0LmtleXMoYXNzZXREYXRhLmFzc2V0cyk7XG52YXIgdG90YWxGaWxlcyA9IGZpbGVOYW1lcy5sZW5ndGg7XG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xudmFyIHN0YXJ0VGltZTtcblxuZnVuY3Rpb24gc3RhcnRMb2FkZXIodmlldykge1xuXG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2VMb2FkZWQgPSAodG90YWxGaWxlcyAtIHRoaXMubG9hZENvdW50KS90b3RhbEZpbGVzO1xuICAgICAgICB2YXIgdGltZUVsYXBzZWQgPSBfLm5vdygpIC0gc3RhcnRUaW1lO1xuXG4gICAgICAgIHZpZXcub25Bc3NldFByb2dyZXNzKHBlcmNlbnRhZ2VMb2FkZWQsIHRpbWVFbGFwc2VkKTtcbiAgICB9O1xuICAgIGxvYWRlci5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZXcub25Bc3NldHNMb2FkZWQoKTtcbiAgICB9O1xuXG4gICAgc3RhcnRUaW1lID0gXy5ub3coKTtcblxuICAgIHN0YXJ0QXVkaW9Mb2FkZXIoKTtcbiAgICBsb2FkZXIubG9hZCgpO1xufVxuXG5cblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgc3RhcnQ6IHN0YXJ0TG9hZGVyXG59OyIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY29weTogJycsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICB9XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb247IiwiXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xuICAgIHZhciBzY2VuZTtcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgZnVuY3Rpb24gZ2V0QmxhZGVUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Q2FiYmllVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDYWJiaWUyVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RGlwcGVyVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREdXN0eVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER1c3R5M1RleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER1c3R5NFRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwJywgMCwgMjQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRXaW5kbGlmdGVyVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xuICAgIH1cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXplIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgZnVuY3Rpb24gaW5pdENoYXJhY3RlcihuYW1lLCB0ZXh0dXJlcywgYW5jaG9yKSB7XG4gICAgICAgIHZhciBpZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKHRleHR1cmVzKTtcbiAgICAgICAgaWRsZUFuaW1hdGlvbi5hbmNob3IgPSBhbmNob3I7XG5cbiAgICAgICAgdmFyIGNoYXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWUsIGlkbGVBbmltYXRpb24pO1xuXG4gICAgICAgIGNoYXIud2luZG93WCA9IC0xO1xuICAgICAgICBjaGFyLndpbmRvd1kgPSAtMTtcblxuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gMDtcbiAgICAgICAgY2hhci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGNoYXIpO1xuXG4gICAgICAgIHJldHVybiBjaGFyO1xuICAgIH1cblxuICAgIHZhciBjaGFyYWN0ZXJJbml0RnVuY3Rpb25zID0ge1xuICAgICAgICBibGFkZTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0JsYWRlJywgZ2V0QmxhZGVUZXh0dXJlcygpLCB7eDogNDU3Lzk3MCwgeTogMzQ2LzYwMH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgY2FiYmllOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignQ2FiYmllJywgZ2V0Q2FiYmllVGV4dHVyZXMoKSwge3g6IDU0NS8xMjAwLCB5OiAzNTEvNjIyfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBjYWJiaWVUd286IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdDYWJiaWUyJywgZ2V0Q2FiYmllMlRleHR1cmVzKCksIHt4OiA0MDgvNzUwLCB5OiAyMzgvMzgwfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBkaXBwZXI6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEaXBwZXInLCBnZXREaXBwZXJUZXh0dXJlcygpLCB7eDogNTM5LzEyMDAsIHk6IDQzNS82Mzh9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGR1c3R5OiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRHVzdHknLCBnZXREdXN0eVRleHR1cmVzKCksIHt4OiA0ODAvMTIwMCwgeTogNDA1Lzk4M30pO1xuICAgICAgICB9KSxcbiAgICAgICAgZHVzdHlEYXJrOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRHVzdHkzJywgZ2V0RHVzdHkzVGV4dHVyZXMoKSwge3g6IDMzNS82MDAsIHk6IDE2NS8zNjB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGR1c3R5Rm91cjogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0R1c3R5NCcsIGdldER1c3R5NFRleHR1cmVzKCksIHt4OiAzNzMvNjAwLCB5OiAxNTQvMzQxfSk7XG4gICAgICAgIH0pLFxuICAgICAgICB3aW5kbGlmdGVyOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignV2luZGxpZnRlcicsIGdldFdpbmRsaWZ0ZXJUZXh0dXJlcygpLCB7eDogMzEwLzYwMCwgeTogMjI4LzM3MX0pO1xuICAgICAgICB9KVxuICAgIH07XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG4gICAgdmFyIGFsbENoYXJhY3RlcnMgPSB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHBpeGlTY2VuZSkge1xuICAgICAgICAgICAgc2NlbmUgPSBwaXhpU2NlbmU7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBfLmVhY2goY2hhcmFjdGVySW5pdEZ1bmN0aW9ucywgZnVuY3Rpb24oaW5pdEZuYywgY2hhcmFjdGVyKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhbGxDaGFyYWN0ZXJzLCBjaGFyYWN0ZXIsIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0Rm5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbENoYXJhY3RlcnM7XG59KSgpO1xuXG5cblxuXG5cblxuXG4iLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbiAgICAvLyBkaXNwbGF5T2JqZWN0IHNob3VsZCBiZSBhbiBpbnN0YW5jZSBvZiBQSVhJLlNwcml0ZSBvciBQSVhJLk1vdmllQ2xpcFxuICAgIHZhciBDaGFyYWN0ZXIgPSBmdW5jdGlvbihuYW1lLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7IC8vIFBhcmVudCBjb25zdHJ1Y3RvclxuXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaWRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQobW92aWVDbGlwKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRJZGxlU3RhdGUobW92aWVDbGlwKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBzZXRJZGxlU3RhdGU6IGZ1bmN0aW9uKHBpeGlTcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZSA9IHBpeGlTcHJpdGU7XG5cbiAgICAgICAgICAgIGlmKHBpeGlTcHJpdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIHBpeGlTcHJpdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGl4aVNwcml0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwaXhpU3ByaXRlLmdvdG9BbmRQbGF5KDApOyAgLy9zdGFydCBjbGlwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQocGl4aVNwcml0ZSk7ICAgLy9hZGQgdG8gZGlzcGxheSBvYmplY3QgY29udGFpbmVyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9hZGQgbW92aWUgY2xpcCB0byBwbGF5IHdoZW4gY2hhcmFjdGVyIGNoYW5nZXMgdG8gc3RhdGVcbiAgICAgICAgYWRkU3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgICAgIG1vdmllQ2xpcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tzdGF0ZV0gPSBtb3ZpZUNsaXA7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKG1vdmllQ2xpcCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcHVibGljIEFQSSBmdW5jdGlvbi4gV2FpdHMgdW50aWwgY3VycmVudCBzdGF0ZSBpcyBmaW5pc2hlZCBiZWZvcmUgc3dpdGNoaW5nIHRvIG5leHQgc3RhdGUuXG4gICAgICAgIGdvVG9TdGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5zdGF0ZXNbc3RhdGVdKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdFcnJvcjogQ2hhcmFjdGVyICcgKyB0aGlzLm5hbWUgKyAnIGRvZXMgbm90IGNvbnRhaW4gc3RhdGU6ICcgKyBzdGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5pZGxlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlkbGUub25Db21wbGV0ZSA9IF8uYmluZCh0aGlzLnN3YXBTdGF0ZSwgdGhpcywgc3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWZ0ZXIgY3VycmVudCBhbmltYXRpb24gZmluaXNoZXMgZ28gdG8gdGhpcyBzdGF0ZSBuZXh0XG4gICAgICAgICAgICAgICAgdGhpcy5pZGxlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3dhcFN0YXRlKHRoaXMsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICAvL3N3aXRjaCBpbW1lZGlhdGVseSBpZiBjaGFyYWN0ZXIgaWRsZSBzdGF0ZSBpcyBhIHNpbmdsZSBzcHJpdGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvL2FkZCBjYWxsYmFjayB0byBydW4gb24gY2hhcmFjdGVyIHVwZGF0ZVxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNhbGxlZCBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZSBieSB3aGF0ZXZlciBQaXhpIHNjZW5lIGNvbnRhaW5zIHRoaXMgY2hhcmFjdGVyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2soKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFN0YXRpYzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUuZ290b0FuZFN0b3AoMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldER5bmFtaWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pZGxlLmdvdG9BbmRQbGF5KDApO1xuICAgICAgICB9LFxuICAgICAgICBmbGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IC0odGhpcy5zY2FsZS54KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVzaFRvVG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yISBObyBwYXJlbnQgZGVmaW5lZCBmb3IgY2hhcmFjdGVyOicsdGhpcy5uYW1lICsgJy4nLCdJdCBpcyBsaWtlbHkgcHVzdFRvVG9wKCkgd2FzIGNhbGxlZCBhZnRlciBjaGFyYWN0ZXIgd2FzIGFkZGVkIGJ1dCBiZWZvcmUgUElYSSBzY2VuZSB3YXMgdXBkYXRlZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsZW5ndGggPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAgICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkQXQodGhpcywgbGVuZ3RoLTEpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICAvLyBjaGFuZ2VzIHN0YXRlIGltbWVkaWF0ZWx5XG4gICAgLy8gTk9URTogRnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5IGJ5IGNoYXJhY3Rlci5nb1RvU3RhdGUoKVxuICAgIGZ1bmN0aW9uIHN3YXBTdGF0ZShjaGFyLCBzdGF0ZSkge1xuICAgICAgICB2YXIgaWRsZVN0YXRlID0gY2hhci5pZGxlO1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSBjaGFyLnN0YXRlc1tzdGF0ZV07XG5cbiAgICAgICAgbmV3U3RhdGUub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkgeyAgLy9zd2l0Y2ggYmFjayB0byBpZGxlIGFmdGVyIHJ1blxuICAgICAgICAgICAgaWYoaWRsZVN0YXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBuZXdTdGF0ZS5sb29wID0gZmFsc2U7XG4gICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBuZXdTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICB9XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBleHRlbmRzIERpc3BsYXkgT2JqZWN0IENvbnRhaW5lclxuICAgIGV4dGVuZChQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIsIENoYXJhY3Rlcik7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENoYXJhY3Rlcjtcbn0pKCk7IiwiXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgc3ViKSB7XG4gICAgLy8gQXZvaWQgaW5zdGFudGlhdGluZyB0aGUgYmFzZSBjbGFzcyBqdXN0IHRvIHNldHVwIGluaGVyaXRhbmNlXG4gICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9jcmVhdGVcbiAgICAvLyBmb3IgYSBwb2x5ZmlsbFxuICAgIC8vIEFsc28sIGRvIGEgcmVjdXJzaXZlIG1lcmdlIG9mIHR3byBwcm90b3R5cGVzLCBzbyB3ZSBkb24ndCBvdmVyd3JpdGVcbiAgICAvLyB0aGUgZXhpc3RpbmcgcHJvdG90eXBlLCBidXQgc3RpbGwgbWFpbnRhaW4gdGhlIGluaGVyaXRhbmNlIGNoYWluXG4gICAgLy8gVGhhbmtzIHRvIEBjY25va2VzXG4gICAgdmFyIG9yaWdQcm90byA9IHN1Yi5wcm90b3R5cGU7XG4gICAgc3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoYmFzZS5wcm90b3R5cGUpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9yaWdQcm90bykgIHtcbiAgICAgICAgc3ViLnByb3RvdHlwZVtrZXldID0gb3JpZ1Byb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8gUmVtZW1iZXIgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHdhcyBzZXQgd3JvbmcsIGxldCdzIGZpeCBpdFxuICAgIHN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWI7XG4gICAgLy8gSW4gRUNNQVNjcmlwdDUrIChhbGwgbW9kZXJuIGJyb3dzZXJzKSwgeW91IGNhbiBtYWtlIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eVxuICAgIC8vIG5vbi1lbnVtZXJhYmxlIGlmIHlvdSBkZWZpbmUgaXQgbGlrZSB0aGlzIGluc3RlYWRcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3ViLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHN1YlxuICAgIH0pO1xufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7IiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLypcbiAgICAgKiBDdXN0b20gRWRpdHMgZm9yIHRoZSBQSVhJIExpYnJhcnlcbiAgICAgKi9cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogUmVsYXRpdmUgUG9zaXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1ggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1kgPSAwO1xuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRQb3NpdGlvblggPSBmdW5jdGlvbih3aW5kb3dXaWR0aCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSAod2luZG93V2lkdGggKiB0aGlzLl93aW5kb3dYKSArIHRoaXMuX2J1bXBYO1xuICAgIH07XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25ZID0gZnVuY3Rpb24od2luZG93SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9ICh3aW5kb3dIZWlnaHQgKiB0aGlzLl93aW5kb3dZKSArIHRoaXMuX2J1bXBZO1xuICAgIH07XG5cbiAgICAvLyB3aW5kb3dYIGFuZCB3aW5kb3dZIGFyZSBwcm9wZXJ0aWVzIGFkZGVkIHRvIGFsbCBQaXhpIGRpc3BsYXkgb2JqZWN0cyB0aGF0XG4gICAgLy8gc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBvZiBwb3NpdGlvbi54IGFuZCBwb3NpdGlvbi55XG4gICAgLy8gdGhlc2UgcHJvcGVydGllcyB3aWxsIGJlIGEgdmFsdWUgYmV0d2VlbiAwICYgMSBhbmQgcG9zaXRpb24gdGhlIGRpc3BsYXlcbiAgICAvLyBvYmplY3QgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aW5kb3cgd2lkdGggJiBoZWlnaHQgaW5zdGVhZCBvZiBhIGZsYXQgcGl4ZWwgdmFsdWVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1gnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgoJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93WScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl93aW5kb3dZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWSgkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9idW1wWCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFkgPSAwO1xuXG4gICAgLy8gYnVtcFggYW5kIGJ1bXBZIGFyZSBwcm9wZXJ0aWVzIG9uIGFsbCBkaXNwbGF5IG9iamVjdHMgdXNlZCBmb3JcbiAgICAvLyBzaGlmdGluZyB0aGUgcG9zaXRpb25pbmcgYnkgZmxhdCBwaXhlbCB2YWx1ZXMuIFVzZWZ1bCBmb3Igc3R1ZmZcbiAgICAvLyBsaWtlIGhvdmVyIGFuaW1hdGlvbnMgd2hpbGUgc3RpbGwgbW92aW5nIGFyb3VuZCBhIGNoYXJhY3Rlci5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSAoJHdpbmRvdy53aWR0aCgpICogdGhpcy5fd2luZG93WCkgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYnVtcFknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVtcFk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX2J1bXBZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9ICgkd2luZG93LmhlaWdodCgpICogdGhpcy5fd2luZG93WSkgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogU2NhbGluZyBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuICAgIC8vIHdpbmRvd1NjYWxlIGNvcnJlc3BvbmRzIHRvIHdpbmRvdyBzaXplXG4gICAgLy8gICBleDogd2luZG93U2NhbGUgPSAwLjI1IG1lYW5zIDEvNCBzaXplIG9mIHdpbmRvd1xuICAgIC8vIHNjYWxlTWluIGFuZCBzY2FsZU1heCBjb3JyZXNwb25kIHRvIG5hdHVyYWwgc3ByaXRlIHNpemVcbiAgICAvLyAgIGV4OiBzY2FsZU1pbiA9IDAuNSBtZWFucyBzcHJpdGUgd2lsbCBub3Qgc2hyaW5rIHRvIG1vcmUgdGhhbiBoYWxmIG9mIGl0cyBvcmlnaW5hbCBzaXplLlxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1NjYWxlID0gLTE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zY2FsZU1pbiA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zY2FsZU1heCA9IE51bWJlci5NQVhfVkFMVUU7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zY2FsZVR5cGUgPSAnY29udGFpbic7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVGbmMgPSBNYXRoLm1pbjtcblxuICAgIC8vIFdpbmRvd1NjYWxlOiB2YWx1ZSBiZXR3ZWVuIDAgJiAxLCBvciAtMVxuICAgIC8vIFRoaXMgZGVmaW5lcyB3aGF0ICUgb2YgdGhlIHdpbmRvdyAoaGVpZ2h0IG9yIHdpZHRoLCB3aGljaGV2ZXIgaXMgc21hbGxlcilcbiAgICAvLyB0aGUgb2JqZWN0IHdpbGwgYmUgc2l6ZWQuIEV4YW1wbGU6IGEgd2luZG93U2NhbGUgb2YgMC41IHdpbGwgc2l6ZSB0aGUgZGlzcGxheU9iamVjdFxuICAgIC8vIHRvIGhhbGYgdGhlIHNpemUgb2YgdGhlIHdpbmRvdy5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1NjYWxlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl93aW5kb3dTY2FsZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUd28gcG9zc2libGUgdmFsdWVzOiBjb250YWluIG9yIGNvdmVyLiBVc2VkIHdpdGggd2luZG93U2NhbGUgdG8gZGVjaWRlIHdoZXRoZXIgdG8gdGFrZSB0aGVcbiAgICAvLyBzbWFsbGVyIGJvdW5kIChjb250YWluKSBvciB0aGUgbGFyZ2VyIGJvdW5kIChjb3Zlcikgd2hlbiBkZWNpZGluZyBjb250ZW50IHNpemUgcmVsYXRpdmUgdG8gc2NyZWVuLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnc2NhbGVUeXBlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlVHlwZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVUeXBlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRm5jID0gKHZhbHVlID09PSAnY29udGFpbicpID8gTWF0aC5taW4gOiBNYXRoLm1heDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFNjYWxlID0gZnVuY3Rpb24od2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCkge1xuICAgICAgICB2YXIgbG9jYWxCb3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5fd2luZG93U2NhbGUgKiB0aGlzLl9zY2FsZUZuYyh3aW5kb3dIZWlnaHQvbG9jYWxCb3VuZHMuaGVpZ2h0LCB3aW5kb3dXaWR0aC9sb2NhbEJvdW5kcy53aWR0aCk7XG5cbiAgICAgICAgLy9rZWVwIHNjYWxlIHdpdGhpbiBvdXIgZGVmaW5lZCBib3VuZHNcbiAgICAgICAgc2NhbGUgPSBNYXRoLm1heCh0aGlzLnNjYWxlTWluLCBNYXRoLm1pbihzY2FsZSwgdGhpcy5zY2FsZU1heCkpO1xuXG5cbiAgICAgICAgdGhpcy5zY2FsZS54ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIHRoaXMuc2NhbGUueSA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgIH07XG5cblxuICAgIC8vIFVTRSBPTkxZIElGIFdJTkRPV1NDQUxFIElTIEFMU08gU0VUXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVYID0gMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVkgPSAxO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBXaW5kb3cgUmVzaXplIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQgZm9yIGVhY2ggZGlzcGxheSBvYmplY3Qgb24gd2luZG93IHJlc2l6ZSxcbiAgICAvLyBhZGp1c3RpbmcgdGhlIHBpeGVsIHBvc2l0aW9uIHRvIG1pcnJvciB0aGUgcmVsYXRpdmUgcG9zaXRpb25zIHdpbmRvd1ggYW5kIHdpbmRvd1lcbiAgICAvLyBhbmQgYWRqdXN0aW5nIHNjYWxlIGlmIGl0J3Mgc2V0XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCh3aWR0aCk7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWShoZWlnaHQpO1xuXG4gICAgICAgIGlmKHRoaXMuX3dpbmRvd1NjYWxlICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oZGlzcGxheU9iamVjdCkge1xuICAgICAgICAgICAgZGlzcGxheU9iamVjdC5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogU3ByaXRlc2hlZXQgVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gdXNlZCB0byBnZXQgaW5kaXZpZHVhbCB0ZXh0dXJlcyBvZiBzcHJpdGVzaGVldCBqc29uIGZpbGVzXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIGNhbGw6IGdldEZpbGVOYW1lcygnYW5pbWF0aW9uX2lkbGVfJywgMSwgMTA1KTtcbiAgICAvLyBSZXR1cm5zOiBbJ2FuaW1hdGlvbl9pZGxlXzAwMS5wbmcnLCAnYW5pbWF0aW9uX2lkbGVfMDAyLnBuZycsIC4uLiAsICdhbmltYXRpb25faWRsZV8xMDQucG5nJ11cbiAgICAvL1xuICAgIGZ1bmN0aW9uIGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICB2YXIgbnVtRGlnaXRzID0gKHJhbmdlRW5kLTEpLnRvU3RyaW5nKCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICB2YXIgbnVtWmVyb3MgPSBudW1EaWdpdHMgLSBudW0udG9TdHJpbmcoKS5sZW5ndGg7ICAgLy9leHRyYSBjaGFyYWN0ZXJzXG4gICAgICAgICAgICB2YXIgemVyb3MgPSBuZXcgQXJyYXkobnVtWmVyb3MgKyAxKS5qb2luKCcwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlUHJlZml4ICsgemVyb3MgKyBudW0gKyAnLnBuZyc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFBJWEkuZ2V0VGV4dHVyZXMgPSBmdW5jdGlvbihmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICByZXR1cm4gXy5tYXAoZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgUElYSS5UZXh0dXJlLmZyb21GcmFtZSk7XG4gICAgfTtcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIE1lbW9yeSBDbGVhbnVwICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihkZXN0cm95QmFzZVRleHR1cmUpIHtcbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZChkZXN0cm95QmFzZVRleHR1cmUpKSBkZXN0cm95QmFzZVRleHR1cmUgPSB0cnVlO1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy50ZXh0dXJlLmRlc3Ryb3koZGVzdHJveUJhc2VUZXh0dXJlKTtcbiAgICB9O1xuXG4gICAgUElYSS5Nb3ZpZUNsaXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihkZXN0cm95QmFzZVRleHR1cmUpIHtcbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZChkZXN0cm95QmFzZVRleHR1cmUpKSBkZXN0cm95QmFzZVRleHR1cmUgPSB0cnVlO1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG5cbiAgICAgICAgXy5lYWNoKHRoaXMudGV4dHVyZXMsIGZ1bmN0aW9uKHRleHR1cmUpIHtcbiAgICAgICAgICAgIHRleHR1cmUuZGVzdHJveShkZXN0cm95QmFzZVRleHR1cmUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG5cblxufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi9hbGxDaGFyYWN0ZXJzJyk7XG5cbiAgICB2YXIgYmFja2dyb3VuZE1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvYmFja2dyb3VuZCcpO1xuICAgIHZhciBibGFkZXdpcGVNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JsYWRld2lwZScpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcbiAgICB2YXIgcGFyYWNodXRlcnNNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3BhcmFjaHV0ZXJzJyk7XG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG4gICAgdmFyIHJlc3BvbnNlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9yZXNwb25zZU1vZHVsZScpO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiogUHJpbWFyeSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBNYWluU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgU2NlbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBhbGxDaGFyYWN0ZXJzLmluaXRpYWxpemUodGhpcyk7XG5cblxuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmluaXRpYWxpemUoKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRCYWNrZ3JvdW5kVG9TY2VuZSh0aGlzKTtcbiAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRSZXN0VG9TY2VuZSh0aGlzKTtcblxuICAgICAgICBibGFkZXdpcGVNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIHJlc3BvbnNlTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgfTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgTWFpblNjZW5lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgcGxheVdpcGVzY3JlZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLnBsYXlWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBvbldpcGVzY3JlZW5Db21wbGV0ZTpmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLm9uVmlkZW9Db21wbGV0ZShjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVXNlckNoYXJhY3Rlck91dDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5vbkFuaW1hdGlvbk91dENvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJsYWRld2lwZU1vZHVsZS5oaWRlVmlkZW8oKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnRFbnRlck5hbWVBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG5cbiAgICAgICAgICAgIHZhciBzdGFydFRpbWUgPSAyMDAwO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocGFyYWNodXRlcnNNb2R1bGUuYW5pbWF0ZU5leHQsIHN0YXJ0VGltZSArIDYwMDApO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgMTUwMDApO1xuICAgICAgICB9LFxuICAgICAgICBzaG93UmVzcG9uc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaGlkZSgpO1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVJblVzZXJDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmFuaW1hdGVJbigpO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlT3V0VXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBQYXJhbGxheCBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5zaGlmdEJhY2tncm91bmRMYXllcnMoeCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIH0sXG4gICAgICAgIF9vbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbiAgICAvLyBFeHRlbmRzIFNjZW5lIENsYXNzXG4gICAgZXh0ZW5kKFNjZW5lLCBNYWluU2NlbmUpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5TY2VuZTtcbn0pKCk7IiwiXG5cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxudmFyIFNjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNCID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgUElYSS5TdGFnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuU2NlbmUucHJvdG90eXBlID0ge1xuICAgIG9uVXBkYXRlOiBmdW5jdGlvbih1cGRhdGVDQikge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCID0gdXBkYXRlQ0I7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCKCk7XG4gICAgfSxcbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlc3VtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgfSxcbiAgICBpc1BhdXNlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlZDtcbiAgICB9XG59O1xuXG5cbmV4dGVuZChQSVhJLlN0YWdlLCBTY2VuZSk7XG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgU2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJyk7XG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIHZhciBTY2VuZXNNYW5hZ2VyID0ge1xuICAgICAgICBzY2VuZXM6IHt9LFxuICAgICAgICBjdXJyZW50U2NlbmU6IG51bGwsXG4gICAgICAgIHJlbmRlcmVyOiBudWxsLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCAkcGFyZW50RGl2KSB7XG5cbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyKSByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpZHRoLCBoZWlnaHQsIG51bGwsIHRydWUsIHRydWUpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcuc2V0QXR0cmlidXRlKCdpZCcsICdwaXhpLXZpZXcnKTtcbiAgICAgICAgICAgICRwYXJlbnREaXYuYXBwZW5kKFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldyk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKFNjZW5lc01hbmFnZXIubG9vcCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBsb29wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uICgpIHsgU2NlbmVzTWFuYWdlci5sb29wKCkgfSk7XG5cbiAgICAgICAgICAgIGlmICghU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgfHwgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUuaXNQYXVzZWQoKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS51cGRhdGUoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVuZGVyKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlU2NlbmU6IGZ1bmN0aW9uKGlkLCBTY2VuZUNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBTY2VuZUNvbnN0cnVjdG9yID0gU2NlbmVDb25zdHJ1Y3RvciB8fCBTY2VuZTsgICAvL2RlZmF1bHQgdG8gU2NlbmUgYmFzZSBjbGFzc1xuXG4gICAgICAgICAgICB2YXIgc2NlbmUgPSBuZXcgU2NlbmVDb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdID0gc2NlbmU7XG5cbiAgICAgICAgICAgIHJldHVybiBzY2VuZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ29Ub1NjZW5lOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkge1xuICAgICAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSkgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lID0gU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciByZXNpemUgdG8gbWFrZSBzdXJlIGFsbCBjaGlsZCBvYmplY3RzIGluIHRoZVxuICAgICAgICAgICAgICAgIC8vIG5ldyBzY2VuZSBhcmUgY29ycmVjdGx5IHBvc2l0aW9uZWRcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXN1bWUgbmV3IHNjZW5lXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucmVzdW1lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgc2VsZj10aGlzO1xuXG5mdW5jdGlvbiBwcm9ncmFtMShkZXB0aDAsZGF0YSxkZXB0aDEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJlbXB0eS1zcGFjZVxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEubmFtZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIiB2YWx1ZT1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgaWQ9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcImZ1bGwtcmVsYXRpdmVcXFwiPjwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGV4dFxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnRleHQpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudGV4dCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJib3gtc2hhZG93XFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImNvcHlcXFwiPlxcbiAgICAgICAgXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmNvcHkpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuY29weSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcIm9wdGlvbnMgY2xlYXJmaXhcXFwiPlxcbiAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAub3B0aW9ucyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbVdpdGhEZXB0aCgxLCBwcm9ncmFtMSwgZGF0YSwgZGVwdGgwKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIHZhciBzY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vcGl4aS9zY2VuZXNNYW5hZ2VyJyk7XG4gICAgdmFyIGR1c3R5RGlwcGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9kdXN0eURpcHBlcicpO1xuXG5cbiAgICBmdW5jdGlvbiBnZXRDbGlwYm9hcmRUZXh0KGUpIHtcbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQoZS5vcmlnaW5hbEV2ZW50KSkgZSA9IGUub3JpZ2luYWxFdmVudDtcblxuICAgICAgICBpZiAod2luZG93LmNsaXBib2FyZERhdGEgJiYgd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSkgeyAvLyBJRVxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5jbGlwYm9hcmREYXRhLmdldERhdGEoJ1RleHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBlLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdkaXYubmFtZS5wYWdlJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2hhbmdlIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXlkb3duIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXl1cCBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZScsXG4gICAgICAgICAgICAncGFzdGUgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKHt2YWx1ZTogJyd9KTtcblxuICAgICAgICAgICAgdGhpcy4kbmFtZUlucHV0ID0gdGhpcy4kZWwuZmluZCgnaW5wdXRbdHlwZT10ZXh0XS5uYW1lJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5wbGFjZWhvbGRlcicpO1xuICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXJJbm5lciA9IHRoaXMuJHBsYWNlaG9sZGVyLmZpbmQoJz4gZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZSA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi50aXRsZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgICAgXy5iaW5kQWxsKHRoaXMsICdzdGFydEFuaW1hdGlvbicsJ3Nob3cnLCdoaWRlJywnc2V0SW5hY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFNjZW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLnNjZW5lcy5tYWluO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBSdW4gQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0QW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJlQW5pbWF0aW9uU2V0dXAoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc3RhcnRFbnRlck5hbWVBbmltYXRpb24oKTsgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyc1xuXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuMztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHRpdGxlLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMSwgeTogMCwgZWFzZTogJ0JhY2suZWFzZU91dCd9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRuYW1lSW5wdXQsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGxhY2Vob2xkZXJJbm5lciwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnLCBkZWxheTogMC4xNX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByZUFuaW1hdGlvblNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kdGl0bGUsIHtvcGFjaXR5OiAwLCB5OiAtNzV9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kbmFtZUlucHV0LCB7b3BhY2l0eTogMH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRwbGFjZWhvbGRlcklubmVyLCB7b3BhY2l0eTogMCwgeTogLTUwfSk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIFNob3cvSGlkZSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zdGFydEFuaW1hdGlvbiwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUodGhpcy5zZXRJbmFjdGl2ZSk7XG5cbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kZWwsIDAuMywge29wYWNpdHk6IDB9KTtcblxuICAgICAgICAgICAgICAgIC8vcnVuIGhpZGUgYW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluYWN0aXZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25OYW1lQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZihlLndoaWNoID09PSAzMikgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy4kbmFtZUlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICBpZihlLnR5cGUgPT09ICdwYXN0ZScpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGdldENsaXBib2FyZFRleHQoZSk7XG5cbiAgICAgICAgICAgICAgICB2YWwgKz0gdGV4dC5zcGxpdCgnICcpLmpvaW4oJycpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kbmFtZUlucHV0LnZhbCh2YWwpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXIudG9nZ2xlKHZhbCA9PT0gJycpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyLnRvZ2dsZSh2YWwgPT09ICcnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRlck5hbWVWaWV3O1xufSkoKTtcbiIsIlxuXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBGb290ZXJWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNmb290ZXInLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLnZvbHVtZSc6ICdvblZvbHVtZVRvZ2dsZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubnVtRG90cyA9IG9wdGlvbnMubnVtRG90cztcblxuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFZvbHVtZUFuaW1hdGlvblRpbWVsaW5lcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Q291bnRlcigpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMgPSB0aGlzLiRlbC5maW5kKCdhLnZvbHVtZSBwYXRoJyk7XG4gICAgICAgICAgICB0aGlzLiRjb3VudGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LmNvdW50ZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT24oKTtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uID0gdGhpcy5nZXRUaW1lbGluZVZvbHVtZU9mZigpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0Q291bnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbnVtRG90cyA9IHRoaXMubnVtRG90cztcblxuICAgICAgICAgICAgdmFyICRkb3QgPSB0aGlzLiRkb3RzLmVxKDApO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAyOyBpIDw9IG51bURvdHM7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciAkbmV3RG90ID0gJGRvdC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuZmluZCgnPiBkaXYubnVtYmVyJykuaHRtbChpKTtcbiAgICAgICAgICAgICAgICAkbmV3RG90LmFwcGVuZFRvKHRoaXMuJGNvdW50ZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiRkb3RzID0gdGhpcy4kY291bnRlci5maW5kKCc+IC5kb3QnKTtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdCA9ICRkb3Q7XG4gICAgICAgICAgICAkZG90LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiogVm9sdW1lIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHRvZ2dsZVZvbHVtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uID0gIXRoaXMudm9sdW1lT247XG5cbiAgICAgICAgICAgIGlmKHRoaXMudm9sdW1lT24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZvbHVtZU9uQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNyZWF0ZWpzLlNvdW5kLnNldE11dGUodGhpcy52b2x1bWVPbik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVuZE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZWFzaW5nOiAnQmFjay5lYXNlT3V0Jywgb3BhY2l0eTogMX07XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAuNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVuZE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlYXNpbmc6ICdCYWNrLmVhc2VJbicsIG9wYWNpdHk6IDB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgb25cbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoMSwwLDAsMSwwLDApJyk7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5jc3MoJ29wYWNpdHknLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAuNSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkU3ZnUGF0aEFuaW1hdGlvbjogZnVuY3Rpb24odGltZWxpbmUsICRwYXRoLCBzdGFydFRpbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBhbmltYXRpb25TcGVlZCA9IDAuMjtcblxuICAgICAgICAgICAgdmFyIHBhdGhNYXRyaXggPSBfLmNsb25lKG9wdGlvbnMuc3RhcnRNYXRyaXgpO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5BdHRycyA9IHtcbiAgICAgICAgICAgICAgICBlYXNlOiBvcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXRoLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoJyArIHBhdGhNYXRyaXguam9pbignLCcpICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0d2VlbkF0dHJzLCBvcHRpb25zLmVuZE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oJHBhdGgsIGFuaW1hdGlvblNwZWVkLCB7b3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5fSksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8ocGF0aE1hdHJpeCwgYW5pbWF0aW9uU3BlZWQsIHR3ZWVuQXR0cnMpLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBDb3VudGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNldENvdW50ZXI6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMuZXEoaSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gdGhpcy4kZG90cy5lcShpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kY291bnRlci5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnNob3coKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsLm91dGVySGVpZ2h0KCkgKyB0aGlzLiRjb3VudGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvblZvbHVtZVRvZ2dsZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVZvbHVtZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gRm9vdGVyVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG5cbiAgICBpZighZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgdmFyIGludHJvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRybycpO1xuICAgIH1cblxuICAgIHZhciBJbnRyb1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2ludHJvLXZpZXcnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLmJlZ2luJzogJ29uQmVnaW5DbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uVGltZWxpbmUoKTtcblxuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luU2NyZWVuID0gdGhpcy4kZWwuZmluZCgnZGl2LmJlZ2luLXNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5MaW5lcyA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2Rpdi5saW5lJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkJ0biA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2EuYmVnaW4nKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEFuaW1hdGlvblRpbWVsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldE1vYmlsZVRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRNb2JpbGVUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldFRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93QmVnaW5TY3JlZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW47XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoXy5iaW5kKHRpbWVsaW5lLnBsYXksIHRpbWVsaW5lKSwgMjAwKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGdldE1vYmlsZVRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luTGluZXMsIHt4OiAwLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge29wYWNpdHk6IDF9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5WaWV3LnNob3dDb250ZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQmFjay5lYXNlT3V0JztcblxuICAgICAgICAgICAgdmFyIHR3ZWVucyA9IF8ubWFwKHRoaXMuJGJlZ2luTGluZXMsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGxpbmUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHdlZW5zOiB0d2VlbnMsXG4gICAgICAgICAgICAgICAgc3RhZ2dlcjogMC4wOCxcbiAgICAgICAgICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuN1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uc2hvdygpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBidG5JblRpbWUgPSAwLjQ7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIHNjYWxlWDogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSArIChhbmltYXRpb25UaW1lICogMC4wNSkpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaW50cm9Nb2R1bGUuc2hvd0xvZ28oKTtcbiAgICAgICAgICAgIH0sIDAuNjUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TW9iaWxlVGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9GcmFtZXMgPSBpbnRyb01vZHVsZS5nZXRJbnRyb0ZyYW1lcygpO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKiBUaW1lbGluZSAqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5vbkFuaW1hdGlvbkZpbmlzaGVkLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGVTY29wZTogdGhpc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luU2NyZWVuLCBhbmltYXRpb25UaW1lLzQsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMudG9wLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMuYnRtLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0TWFpblZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcgPSB2aWV3O1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2hvd0NvbnRlbnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBIZWxwZXJzIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcicpO1xuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gUElYSSBTY2VuZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgTWFpblNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9tYWluU2NlbmUnKTtcbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENvbGxlY3Rpb25zIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBWaWV3cyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgSW50cm9WaWV3ID0gcmVxdWlyZSgnLi9pbnRyb1ZpZXcnKTtcbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IHJlcXVpcmUoJy4vZW50ZXJOYW1lVmlldycpO1xuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gcmVxdWlyZSgnLi9zZWxlY3RDaGFyYWN0ZXJWaWV3Jyk7XG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IHJlcXVpcmUoJy4vcmVzcG9uc2VWaWV3Jyk7XG4gICAgdmFyIEZvb3RlclZpZXcgPSByZXF1aXJlKCcuL2Zvb3RlclZpZXcnKTtcblxuICAgIHZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG4gICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBpbnRyb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm8nKTtcbiAgICB9XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIE1haW52aWV3IENsYXNzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVzKHZpZXdzKSB7XG4gICAgICAgIHJldHVybiBfLm1hcCh2aWV3cywgZnVuY3Rpb24odmlldykge3JldHVybiB2aWV3Lm1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7IH0pO1xuICAgIH1cblxuICAgIHZhciBNYWluVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgcGFnZXM6IFtdLFxuICAgICAgICBhY3RpdmVQYWdlSW5kZXg6IDAsXG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdjbGljayBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25Bc3NldFByb2dyZXNzOiBmdW5jdGlvbihwZXJjZW50YWdlTG9hZGVkLCB0aW1lRWxhcHNlZCkge1xuICAgICAgICAgICAgaW50cm9Nb2R1bGUudXBkYXRlTG9hZGVyKHBlcmNlbnRhZ2VMb2FkZWQsIHRpbWVFbGFwc2VkKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Bc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBNYWluU2NlbmUpO1xuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5vbkNvbXBsZXRlKHRoaXMuaW50cm9WaWV3LnNob3dCZWdpblNjcmVlbi5iaW5kKHRoaXMuaW50cm9WaWV3KSk7XG4gICAgICAgICAgICBpbnRyb01vZHVsZS5hc3NldHNMb2FkZWQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKGludHJvTW9kdWxlKSlcbiAgICAgICAgICAgICAgICBpbnRyb01vZHVsZS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ21vYmlsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcjYXNzZXRMb2FkZXInKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG5cbiAgICAgICAgICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vY3JlYXRlIGNhbnZhcyBlbGVtZW50XG4gICAgICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5pbml0aWFsaXplKHRoaXMuJHdpbmRvdy53aWR0aCgpLCB0aGlzLiR3aW5kb3cuaGVpZ2h0KCksIHRoaXMuJGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0V2luZG93RXZlbnRzKCk7XG5cbiAgICAgICAgICAgIC8vc2V0dXAgb3B0aW9ucyBmb3IgZmlyc3QgY2FubmVkIHZpZXdcbiAgICAgICAgICAgIHRoaXMuY2FubmVkVmlld3MgPSBfLmZpbHRlcih0aGlzLnBhZ2VzLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UubW9kZWwuYXR0cmlidXRlcy5jbGFzcyA9PT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlQ29udGVudCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRXaW5kb3dFdmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kd2luZG93Lm9uKCdyZXNpemUnLCBfLmJpbmQodGhpcy5yZXBvc2l0aW9uUGFnZU5hdiwgdGhpcykpO1xuXG4vLyAgICAgICAgICAgIGlmICh3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW9yaWVudGF0aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvcmllbnRhdGlvbicsIGV2ZW50LmJldGEsIGV2ZW50LmdhbW1hKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW1vdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3Rpb24nLCBldmVudC5hY2NlbGVyYXRpb24ueCAqIDIsIGV2ZW50LmFjY2VsZXJhdGlvbi55ICogMik7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3ogb3JpZW50YXRpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIk1vek9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKG9yaWVudGF0aW9uKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veicsIG9yaWVudGF0aW9uLnggKiA1MCwgb3JpZW50YXRpb24ueSAqIDUwKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEludHJvVmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9WaWV3ID0gbmV3IEludHJvVmlldygpO1xuXG4gICAgICAgICAgICBpbnRyb1ZpZXcuc2V0TWFpblZpZXcodGhpcyk7XG4gICAgICAgICAgICBpbnRyb1ZpZXcub25Db21wbGV0ZShfLmJpbmQodGhpcy5zaG93Rmlyc3RQYWdlLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW50cm9WaWV3ID0gaW50cm9WaWV3O1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRQYWdlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2hhck1vZGVsID0gXy5maXJzdChhbGxRdWVzdGlvbnMubW9kZWxzKTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbk1vZGVscyA9IF8ucmVzdChhbGxRdWVzdGlvbnMubW9kZWxzKTtcblxuICAgICAgICAgICAgdmFyIGVudGVyTmFtZVZpZXcgPSBuZXcgRW50ZXJOYW1lVmlldygpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdENoYXJWaWV3ID0gbmV3IFNlbGVjdENoYXJhY3RlclZpZXcoe21vZGVsOiBjaGFyTW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcblxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uVmlld3MgPSBfLm1hcChxdWVzdGlvbk1vZGVscywgZnVuY3Rpb24ocXVlc3Rpb25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVlc3Rpb25WaWV3KHttb2RlbDogcXVlc3Rpb25Nb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FubmVkVmlld3MgPSBfLmZpbHRlcihxdWVzdGlvblZpZXdzLCBmdW5jdGlvbihxdWVzdGlvblZpZXcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlc3Rpb25WaWV3LmlzQ2FubmVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0Q2hhcmFjdGVyVmlldyA9IHNlbGVjdENoYXJWaWV3O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNhbm5lZFZpZXdzKTtcblxuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtlbnRlck5hbWVWaWV3LCBzZWxlY3RDaGFyVmlld10uY29uY2F0KHF1ZXN0aW9uVmlld3MpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYucGFnZXMtY3RuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYgPSB0aGlzLiRwYWdlc0NvbnRhaW5lci5maW5kKCdkaXYucGFnZS1uYXYnKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EubmV4dCcpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5maW5pc2gtc2VuZCcpO1xuXG4gICAgICAgICAgICB0aGlzLiRza2lwID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLnNraXAnKTtcblxuICAgICAgICAgICAgdGhpcy4kaGVhZGVyID0gJCgnI2hlYWRlcicpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIENhbm5lZCBRdWVzdGlvbiBWaWV3IFN0dWZmICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZDogZnVuY3Rpb24oY2FubmVkVmlldykge1xuICAgICAgICAgICAgdmFyIHVzZWRPcHRpb25zID0gXy5jb21wYWN0KGdldFZhbHVlcyh0aGlzLmNhbm5lZFZpZXdzKSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gYWxsUXVlc3Rpb25zLmdldFVudXNlZENhbm5lZE9wdGlvbnMoMywgdXNlZE9wdGlvbnMpO1xuXG4gICAgICAgICAgICBjYW5uZWRWaWV3LnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIENoYW5nZSBWaWV3IEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dGaXJzdFBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlc1swXS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYuY3NzKCdvcGFjaXR5JywgMCk7XG4gICAgICAgICAgICB0aGlzLiRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuJHNraXAuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLnJlcG9zaXRpb25QYWdlTmF2KGZhbHNlKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBhZ2VOYXYsIDAuMywge29wYWNpdHk6IDF9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAvL2hpZGUgYWN0aXZlIHBhZ2VcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4ICsgMV07XG5cbiAgICAgICAgICAgIGlmKG5leHRQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZChuZXh0UGFnZSk7XG5cbiAgICAgICAgICAgICAgICBpZighYWN0aXZlUGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NraXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9hY3RpdmUgcGFnZSBpcyBjaGFyYWN0ZXIgc2VsZWN0XG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FubmVkQ29weSgpO1xuXG4gICAgICAgICAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYW5pbWF0ZSBpbiBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVQYWdlLm9uSGlkZUNvbXBsZXRlKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUGFnZUluZGV4Kys7XG4gICAgICAgICAgICBhY3RpdmVQYWdlLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMucmVwb3NpdGlvblBhZ2VOYXYodHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNldENvdW50ZXIodGhpcy5hY3RpdmVQYWdlSW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93UGFnZUFmdGVySGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4LTFdO1xuICAgICAgICAgICAgaWYobGFzdFBhZ2UuaXNDYW5uZWQoKSkge1xuICAgICAgICAgICAgICAgIGxhc3RQYWdlLnJlbW92ZU9wdGlvbnMoKTsgICAvL2Nhbm5lZCBvcHRpb25zIGFyZSByZXBlYXRlZCBhbmQgc2hhcmUgdGhlIHNhbWUgSURcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaG93IG5leHQgcGFnZVxuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG5cbiAgICAgICAgICAgIG5leHRQYWdlLm9uU2hvd0NvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgbmV4dFBhZ2Uuc2hvdygpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gdGhpcy5wYWdlcy5sZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmlzaEJ0bigpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2hvd0ZpbmlzaEJ0bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0LmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGZpbmlzaFNlbmQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEFuZFNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuaGlkZUNvdW50ZXIoKTtcblxuICAgICAgICAgICAgdmFyIHBhZ2VNb2RlbHMgPSBfLm1hcCh0aGlzLnBhZ2VzLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UubW9kZWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VWaWV3LnNldFJlc3BvbnNlKHBhZ2VNb2RlbHMpO1xuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLm9uVXNlckNoYXJhY3Rlck91dChfLmJpbmQodGhpcy5zY2VuZS5wbGF5V2lwZXNjcmVlbiwgdGhpcy5zY2VuZSkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLm9uV2lwZXNjcmVlbkNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtZS5yZXNwb25zZVZpZXcuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICBtZS5zY2VuZS5zaG93UmVzcG9uc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYW5pbWF0ZU91dFVzZXJDaGFyYWN0ZXIoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnI21vYmlsZS1iYWNrZ3JvdW5kcycpLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzcG9uc2VWaWV3LnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVwb3NpdGlvblBhZ2VOYXY6IGZ1bmN0aW9uKGFuaW1hdGUpIHtcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG5cbiAgICAgICAgICAgIHZhciBwaXhlbFBvc2l0aW9uID0gKGFjdGl2ZVBhZ2UuJGVsLm9mZnNldCgpLnRvcCArIGFjdGl2ZVBhZ2UuJGVsLm91dGVySGVpZ2h0KCkpO1xuXG4gICAgICAgICAgICB2YXIgd2luZG93SGVpZ2h0ID0gdGhpcy4kd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICB2YXIgdG9wRnJhYyA9IE1hdGgubWluKHBpeGVsUG9zaXRpb24vd2luZG93SGVpZ2h0LCAod2luZG93SGVpZ2h0IC0gdGhpcy5mb290ZXIuaGVpZ2h0KCkgLSB0aGlzLiRwYWdlTmF2Lm91dGVySGVpZ2h0KCkpL3dpbmRvd0hlaWdodCk7XG5cbiAgICAgICAgICAgIHZhciBwZXJjVG9wID0gMTAwICogdG9wRnJhYyArICclJztcblxuICAgICAgICAgICAgaWYoISFhbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBhZ2VOYXYsIDAuMiwge3RvcDogcGVyY1RvcCwgZWFzZTonUXVhZC5lYXNlSW5PdXQnfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdi5jc3MoJ3RvcCcsIHBlcmNUb3ApO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgaGlkZVNraXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHNraXAsIDAuMiwge2JvdHRvbTogJzEwMCUnLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dTa2lwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRza2lwLCAwLjIsIHtib3R0b206IDAsIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93Q29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuc2hvdygpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlQ29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVDYW5uZWRDb3B5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXIgPSB0aGlzLnNlbGVjdENoYXJhY3RlclZpZXcuZ2V0U2VsZWN0ZWRDaGFyYWN0ZXIoKTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuY2FubmVkVmlld3MsIGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldENoYXJhY3RlcihjaGFyYWN0ZXIudGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgbG9hZGVyLnN0YXJ0KHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludHJvVmlldy5zaG93QmVnaW5TY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbk5leHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hbmltYXRpbmdcbiAgICAgICAgICAgICAgICB8fCB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XS5tb2RlbC5hdHRyaWJ1dGVzLnZhbHVlID09PSAnJ1xuICAgICAgICAgICAgICAgIHx8IHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hbmltYXRpbmcpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5maW5pc2hBbmRTZW5kKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VNb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5zY2VuZSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaGlmdEJhY2tncm91bmRMYXllcnMoZS5wYWdlWC90aGlzLiR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2tpcDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZyB8fCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA+PSAodGhpcy5wYWdlcy5sZW5ndGggLSAxKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5WaWV3O1xuXG5cblxufSkoKTsiLCJcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3F1ZXN0aW9uLmhicycpO1xudmFyIGl0ZW1BbmltYXRpb25zTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYWdlSXRlbXMnKTtcblxudmFyIGlzTW9iaWxlID0gZGV2aWNlLmlzTW9iaWxlKCk7XG5cbnZhciBRdWVzdGlvblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgLy8gVmFyaWFibGVzXG4gICAgc2hvd0NhbGxiYWNrOiBmdW5jdGlvbigpe30sXG4gICAgaGlkZUNhbGxiYWNrOiBmdW5jdGlvbigpe30sXG4gICAgY2xhc3NOYW1lOiAncXVlc3Rpb24gcGFnZScsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBpbnB1dFt0eXBlPXJhZGlvXSc6ICdvblJhZGlvQ2hhbmdlJ1xuICAgIH0sXG4gICAgLy8gRnVuY3Rpb25zXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIG9wdGlvbnMucGFyZW50LmFwcGVuZCh0aGlzLmVsKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuXG4gICAgICAgIHRoaXMuJGNvcHkgPSB0aGlzLiRlbC5maW5kKCdkaXYuY29weScpO1xuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuXG4gICAgICAgIGlmKHRoaXMuJG9wdGlvbnMubGVuZ3RoICE9PSAwICYmICFpc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuICAgIGdldEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICBpZih0aGlzLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21DYW5uZWRBbmltYXRpb25zKHRoaXMuJG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1BbmltYXRpb25zTW9kdWxlLmdldFJhbmRvbVBlcnNvbmFsaXR5QW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBpbml0QW5pbWF0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciBhbmltYXRpb25zID0gdGhpcy5nZXRBbmltYXRpb25zKCk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25JbiA9IGFuaW1hdGlvbnNbMF07XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0ID0gYW5pbWF0aW9uc1sxXTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluLnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2soKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0LnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgfSxcblxuICAgIHJlbW92ZU9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB0aGlzLiRvcHRpb25zLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgc2V0T3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnb3B0aW9ucycsIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vcmVpbml0aWFsaXplXG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHRoaXMuJG9wdGlvbnMgPSB0aGlzLiRlbC5maW5kKCdkaXYub3B0aW9uJyk7XG5cbiAgICAgICAgaWYoIWlzTW9iaWxlKVxuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucygpO1xuICAgIH0sXG5cbiAgICBzZXRDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgY29weSA9IHRoaXMubW9kZWwuZ2V0KCdjb3B5JykucmVwbGFjZSgnJWNoYXJhY3RlciUnLCBjaGFyYWN0ZXIpO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdjb3B5JywgY29weSk7XG4gICAgICAgIHRoaXMuJGNvcHkuaHRtbChjb3B5KTtcbiAgICB9LFxuICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MgPT09ICdjYW5uZWQnO1xuICAgIH0sXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmVsLmlubmVySFRNTCA9PT0gJycpXG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Jbi5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBvblNob3dDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciB0ZXh0ID0gJChlLmN1cnJlbnRUYXJnZXQpLnNpYmxpbmdzKCdkaXYudGV4dCcpLmh0bWwoKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7dmFsdWU6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyksIHRleHQ6IHRleHR9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIHJlc3BvbnNlTWFwID0gcmVxdWlyZSgnLi4vZGF0YS9yZXNwb25zZU1hcC5qc29uJyk7XG5cbiAgICB2YXIgcmVzcG9uc2VNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlJyk7XG5cblxuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcbiAgICB2YXIgaXNNb2JpbGUgPSBkZXZpY2UuaXNNb2JpbGUoKTtcbiAgICB2YXIgcHJpbnRDaGFyYWN0ZXIgPSAnJztcblxuICAgIHZhciBSZXNwb25zZVZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGNoYXJhY3RlcjogJycsXG4gICAgICAgIGVsOiAnI3Jlc3BvbnNlJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYSNwcmludHZlcnNpb24nOiAncHJpbnQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kID0gJCgnI3Jlc3BvbnNlLWJnJyk7XG4gICAgICAgICAgICB0aGlzLiRsZXR0ZXJCYWNrZ3JvdW5kID0gJCgnI2xldHRlcmJnJyk7XG4gICAgICAgICAgICB0aGlzLiRzaWduYXR1cmUgPSAkKCcjY2FyZC1mcm9tJyk7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBzZXRSZXNwb25zZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSAobW9kZWxzWzBdLmF0dHJpYnV0ZXMudmFsdWUgPT0gJycpID8gJ0ZyaWVuZCcgOiBtb2RlbHNbMF0uYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXJNb2RlbCA9IG1vZGVsc1sxXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5hZGRDbGFzcyhjaGFyYWN0ZXJNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuJHNpZ25hdHVyZS5hZGRDbGFzcyhjaGFyYWN0ZXJNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcbiAgICAgICAgICAgIHByaW50Q2hhcmFjdGVyID0gY2hhcmFjdGVyTW9kZWwuYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJlZFF1ZXN0aW9ucyA9IF8uZmlsdGVyKF8ucmVzdChtb2RlbHMsIDIpLCBmdW5jdGlvbihtb2RlbCkge3JldHVybiBtb2RlbC5hdHRyaWJ1dGVzLnZhbHVlICE9PSAnJ30pO1xuXG4gICAgICAgICAgICB2YXIgcGFydGl0aW9uZWRRdWVzdGlvbnMgPSBfLnBhcnRpdGlvbihhbnN3ZXJlZFF1ZXN0aW9ucywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWwuYXR0cmlidXRlcy5jbGFzcyAhPT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5TW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbnNbMF07XG4gICAgICAgICAgICB2YXIgY2FubmVkTW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbnNbMV07XG5cblxuICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IGNoYXJhY3Rlck1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXI7XG5cbiAgICAgICAgICAgIC8vICoqKioqKioqIHNvcnQgaGVyZSAqKioqKioqKlxuICAgICAgICAgICAgdmFyIGNhbm5lZE9yZGVyID0ge1xuICAgICAgICAgICAgICBqb2I6IDAsXG4gICAgICAgICAgICAgIGZvcmVzdGZpcmVzOiAxLFxuICAgICAgICAgICAgICBmaXJlZmlnaHRlcjogMixcbiAgICAgICAgICAgICAgYmVzdGZyaWVuZDogMyxcbiAgICAgICAgICAgICAgZmF2b3JpdGVwbGFjZTogNFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5T3JkZXIgPSB7XG4gICAgICAgICAgICAgIGZvb2Q6IDAsXG4gICAgICAgICAgICAgIGNvbG9yOiAxLFxuICAgICAgICAgICAgICBhbmltYWw6IDJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBzb3J0ZWRDYW5uZWRNb2RlbHMgPSBfLnNvcnRCeShjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKXtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbm5lZE9yZGVyW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYW5uZWRNb2RlbHMgPSBzb3J0ZWRDYW5uZWRNb2RlbHM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzb3J0ZWRQZXJzb25hbGl0eU1vZGVscyA9IF8uc29ydEJ5KHBlcnNvbmFsaXR5TW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7XG4gICAgICAgICAgICAgIHJldHVybiBwZXJzb25hbGl0eU9yZGVyW21vZGVsLmF0dHJpYnV0ZXMubmFtZV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcGVyc29uYWxpdHlNb2RlbHMgPSBzb3J0ZWRQZXJzb25hbGl0eU1vZGVscztcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlSZXNwb25zZXMgPSBfLm1hcChwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuYXR0cmlidXRlcy5uYW1lXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgbW9kZWwuYXR0cmlidXRlcy50ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY2FubmVkUmVzcG9uc2VzID0gXy5tYXAoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgdmFyIGdyZWV0aW5nID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnZ3JlZXRpbmcnXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgdXNlck5hbWUpO1xuICAgICAgICAgICAgdmFyIGJvZHkxID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnYm9keTEnXTtcbiAgICAgICAgICAgIHZhciBib2R5MiA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bJ2JvZHkyJ10ucmVwbGFjZSgnJXRlbXBsYXRlJScsIHVzZXJOYW1lKTs7XG4gICAgICAgICAgICB2YXIgc2luY2VyZWx5ID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnc2luY2VyZWx5J10gK1wiLCBcIjtcblxuXG4gICAgICAgICAgICByZXNwb25zZSArPSBib2R5MSArICcgJyArIGNhbm5lZFJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBwZXJzb25hbGl0eVJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBib2R5MjtcblxuICAgICAgICAgICAgJCgnI2NhcmQtZ3JlZXRpbmcnKS5odG1sKGdyZWV0aW5nKTtcbiAgICAgICAgICAgICQoJyNjYXJkLWJvZHknKS5odG1sKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoJyNjYXJkLXNpbmNlcmVseScpLmh0bWwoc2luY2VyZWx5KTtcbiAgICAgICAgICAgICQoJyNjYXJkLWZyb20nKS5odG1sKGNoYXJhY3Rlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJGxldHRlckJhY2tncm91bmQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZU1vZHVsZS5hbmltYXRlSW4odGhpcy5jaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIHByaW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvLyB3aW5kb3cucHJpbnQoKTtcblxuICAgICAgICAgICAgdmFyIGcgPSAkKCcjY2FyZC1ncmVldGluZycpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBiID0gJCgnI2NhcmQtYm9keScpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBzID0gJCgnI2NhcmQtc2luY2VyZWx5JykuaHRtbCgpO1xuICAgICAgICAgICAgdmFyIGYgPSAkKCcjY2FyZC1mcm9tJykuaHRtbCgpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4od2luZG93LmxvY2F0aW9uLmhyZWYgKyAncHJpbnQucGhwJyArICc/Y2hhcj0nICsgcHJpbnRDaGFyYWN0ZXIgKyAnJmdyZWV0aW5nPScrIGcgKyAnJmJvZHk9JyArIGIgKyAnJnNpbmNlcmVseT0nICsgcyArICcmZnJvbT0nICsgZik7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zZVZpZXc7XG59KSgpOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgYXVkaW9Bc3NldHMgPSByZXF1aXJlKCcuLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIHZhciBjaGFyYWN0ZXJBdWRpb0lkcyA9IGF1ZGlvQXNzZXRzLmNoYXJhY3RlckF1ZGlvSWRzO1xuXG4gICAgdmFyIFNlbGVjdENoYXJhY3RlclZpZXcgPSBRdWVzdGlvblZpZXcuZXh0ZW5kKHtcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAvL3BhcmVudCBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2VsZWN0ZWRDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5tb2RlbC5nZXQoJ3ZhbHVlJyk7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMubW9kZWwuZ2V0KCdvcHRpb25zJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgY2hhciA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgICAgIGNyZWF0ZWpzLlNvdW5kLnBsYXkoY2hhcmFjdGVyQXVkaW9JZHNbY2hhcl0pO1xuXG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuc2V0Q2hhcmFjdGVyKGNoYXIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gU2VsZWN0Q2hhcmFjdGVyVmlldztcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbHMgSGFuZGxlYmFyczogdHJ1ZSAqL1xudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2Jhc2VcIik7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvdXRpbHNcIik7XG52YXIgcnVudGltZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvcnVudGltZVwiKTtcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufTtcblxudmFyIEhhbmRsZWJhcnMgPSBjcmVhdGUoKTtcbkhhbmRsZWJhcnMuY3JlYXRlID0gY3JlYXRlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVkVSU0lPTiA9IFwiMS4zLjBcIjtcbmV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNDtcbmV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz49IDEuMC4wJ1xufTtcbmV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG52YXIgaXNBcnJheSA9IFV0aWxzLmlzQXJyYXksXG4gICAgaXNGdW5jdGlvbiA9IFV0aWxzLmlzRnVuY3Rpb24sXG4gICAgdG9TdHJpbmcgPSBVdGlscy50b1N0cmluZyxcbiAgICBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbn1cblxuZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuLCBpbnZlcnNlKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChpbnZlcnNlIHx8IGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGludmVyc2UpIHsgZm4ubm90ID0gaW52ZXJzZTsgfVxuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgc3RyKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCAgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBzdHI7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk1pc3NpbmcgaGVscGVyOiAnXCIgKyBhcmcgKyBcIidcIik7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlIHx8IGZ1bmN0aW9uKCkge30sIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbihjb250ZXh0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBmbiA9IG9wdGlvbnMuZm4sIGludmVyc2UgPSBvcHRpb25zLmludmVyc2U7XG4gICAgdmFyIGkgPSAwLCByZXQgPSBcIlwiLCBkYXRhO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgaWYoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvcih2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpPGo7IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICBkYXRhLmxhc3QgID0gKGkgPT09IChjb250ZXh0Lmxlbmd0aC0xKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbaV0sIHsgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYoZGF0YSkgeyBcbiAgICAgICAgICAgICAgZGF0YS5rZXkgPSBrZXk7IFxuICAgICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRba2V5XSwge2RhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihpID09PSAwKXtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2lmJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHsgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpOyB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IFV0aWxzLmlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzWydpZiddLmNhbGwodGhpcywgY29uZGl0aW9uYWwsIHtmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2h9KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKCFVdGlscy5pc0VtcHR5KGNvbnRleHQpKSByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gICAgaW5zdGFuY2UubG9nKGxldmVsLCBjb250ZXh0KTtcbiAgfSk7XG59XG5cbnZhciBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogeyAwOiAnZGVidWcnLCAxOiAnaW5mbycsIDI6ICd3YXJuJywgMzogJ2Vycm9yJyB9LFxuXG4gIC8vIFN0YXRlIGVudW1cbiAgREVCVUc6IDAsXG4gIElORk86IDEsXG4gIFdBUk46IDIsXG4gIEVSUk9SOiAzLFxuICBsZXZlbDogMyxcblxuICAvLyBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCBvYmopIHtcbiAgICBpZiAobG9nZ2VyLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICBjb25zb2xlW21ldGhvZF0uY2FsbChjb25zb2xlLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbmV4cG9ydHMubG9nZ2VyID0gbG9nZ2VyO1xuZnVuY3Rpb24gbG9nKGxldmVsLCBvYmopIHsgbG9nZ2VyLmxvZyhsZXZlbCwgb2JqKTsgfVxuXG5leHBvcnRzLmxvZyA9IGxvZzt2YXIgY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICBVdGlscy5leHRlbmQob2JqLCBvYmplY3QpO1xuICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuY3JlYXRlRnJhbWUgPSBjcmVhdGVGcmFtZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICB2YXIgbGluZTtcbiAgaWYgKG5vZGUgJiYgbm9kZS5maXJzdExpbmUpIHtcbiAgICBsaW5lID0gbm9kZS5maXJzdExpbmU7XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cblxuICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgaWYgKGxpbmUpIHtcbiAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gbm9kZS5maXJzdENvbHVtbjtcbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhjZXB0aW9uOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBDT01QSUxFUl9SRVZJU0lPTiA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcblxuZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG4gICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIHZhciBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKFwiK3J1bnRpbWVWZXJzaW9ucytcIikgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uIChcIitjb21waWxlclZlcnNpb25zK1wiKS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJJbmZvWzFdK1wiKS5cIik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247Ly8gVE9ETzogUmVtb3ZlIHRoaXMgbGluZSBhbmQgYnJlYWsgdXAgY29tcGlsZVBhcnRpYWxcblxuZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlXCIpO1xuICB9XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgdmFyIGludm9rZVBhcnRpYWxXcmFwcGVyID0gZnVuY3Rpb24ocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gICAgaWYgKGVudi5jb21waWxlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHsgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG4gICAgICBwYXJ0aWFsc1tuYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHsgZGF0YTogZGF0YSAhPT0gdW5kZWZpbmVkIH0sIGVudik7XG4gICAgICByZXR1cm4gcGFydGlhbHNbbmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlXCIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBKdXN0IGFkZCB3YXRlclxuICB2YXIgY29udGFpbmVyID0ge1xuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGZuLCBkYXRhKSB7XG4gICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldO1xuICAgICAgaWYoZGF0YSkge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHByb2dyYW0oaSwgZm4sIGRhdGEpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gcHJvZ3JhbShpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcbiAgICBtZXJnZTogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgdmFyIHJldCA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiAocGFyYW0gIT09IGNvbW1vbikpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIGNvbW1vbik7XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBwcm9ncmFtV2l0aERlcHRoOiBlbnYuVk0ucHJvZ3JhbVdpdGhEZXB0aCxcbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuYW1lc3BhY2UgPSBvcHRpb25zLnBhcnRpYWwgPyBvcHRpb25zIDogZW52LFxuICAgICAgICBoZWxwZXJzLFxuICAgICAgICBwYXJ0aWFscztcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBoZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgcGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVTcGVjLmNhbGwoXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIG5hbWVzcGFjZSwgY29udGV4dCxcbiAgICAgICAgICBoZWxwZXJzLFxuICAgICAgICAgIHBhcnRpYWxzLFxuICAgICAgICAgIG9wdGlvbnMuZGF0YSk7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgZW52LlZNLmNoZWNrUmV2aXNpb24oY29udGFpbmVyLmNvbXBpbGVySW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO2Z1bmN0aW9uIHByb2dyYW1XaXRoRGVwdGgoaSwgZm4sIGRhdGEgLyosICRkZXB0aCAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG5cbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgW2NvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhXS5jb25jYXQoYXJncykpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gYXJncy5sZW5ndGg7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW1XaXRoRGVwdGggPSBwcm9ncmFtV2l0aERlcHRoO2Z1bmN0aW9uIHByb2dyYW0oaSwgZm4sIGRhdGEpIHtcbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGEpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbSA9IHByb2dyYW07ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICB2YXIgb3B0aW9ucyA9IHsgcGFydGlhbDogdHJ1ZSwgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG5cbiAgaWYocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBmb3VuZFwiKTtcbiAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7ZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuIFwiXCI7IH1cblxuZXhwb3J0cy5ub29wID0gbm9vcDsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiXCIgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2FmZVN0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcbi8qanNoaW50IC1XMDA0ICovXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIGVzY2FwZSA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6IFwiJnF1b3Q7XCIsXG4gIFwiJ1wiOiBcIiYjeDI3O1wiLFxuICBcImBcIjogXCImI3g2MDtcIlxufTtcblxudmFyIGJhZENoYXJzID0gL1smPD5cIidgXS9nO1xudmFyIHBvc3NpYmxlID0gL1smPD5cIidgXS87XG5cbmZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG4gIHJldHVybiBlc2NhcGVbY2hyXSB8fCBcIiZhbXA7XCI7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHZhbHVlKSB7XG4gIGZvcih2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHZhbHVlW2tleV07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO3ZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gIH07XG59XG52YXIgaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG59O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICBpZiAoc3RyaW5nIGluc3RhbmNlb2YgU2FmZVN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICghc3RyaW5nICYmIHN0cmluZyAhPT0gMCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICBpZighcG9zc2libGUudGVzdChzdHJpbmcpKSB7IHJldHVybiBzdHJpbmc7IH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTsiLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdO1xuIl19
