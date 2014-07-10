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
            createjs.Sound.play('Logodrop', {delay: 0});
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

            scenesManager.onWindowResize();

            TweenLite.to(dusty, animationTime, {
                windowX: 0.68,
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

            scenesManager.onWindowResize();

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

            scenesManager.onWindowResize();

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

            scenesManager.onWindowResize();

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

            scenesManager.onWindowResize();

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

            scenesManager.onWindowResize();

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
        },
        {
            "id": "Logodrop",
            "src": "assets/audio/logodrop.ogg"
        },
        {
            "id": "Siteopens",
            "src": "assets/audio/site_opens.ogg"
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


var HeaderView = require('./views/headerView');
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

    app.headerView = new HeaderView();



    app.mainView.start();


});


module.exports = app;




},{"./device":18,"./pixi/libModifications":25,"./views/headerView":33,"./views/mainView":35}],20:[function(require,module,exports){



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

},{"hbsfy/runtime":46}],30:[function(require,module,exports){



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
},{"../animations/pageItems":6,"../device":18,"./questionView":36}],31:[function(require,module,exports){


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


function openInNewTab(url) {
    var win = window.open(url, '_blank');
}


var HeaderView = Backbone.View.extend({
    el: '#header',
    events: {
        'click a.showtimes': 'onShowtimesClick',
        'click a.trailer': 'onTrailerClick'
    },
    initialize: function() {
        "use strict";

    },

    onShowtimesClick: function(e) {
        "use strict";
        e.preventDefault();

        var url = e.currentTarget.getAttribute('href');
        var newTab = (2 === e.which || e.metaKey || e.ctrlKey);

        ga('send', 'event', 'Find Showtimes', 'click', ipAddress, {
            hitCallback: function() {

                document.location = url;
            }
        });

    },
    onTrailerClick: function(e) {
        "use strict";
        e.preventDefault();

        var url = e.currentTarget.getAttribute('href');
        var newTab = (2 === e.which || e.metaKey || e.ctrlKey);

        ga('send', 'event', 'View Trailer', 'click', ipAddress, {
            hitCallback: function() {

                document.location = url;
            }
        });
    }



});




module.exports = HeaderView;
},{}],34:[function(require,module,exports){

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
                onCompleteScope: this,
                onStart: function() {
                    createjs.Sound.play('Siteopens', {delay: 0});
                }
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
},{"../animations/intro":5,"../device":18}],35:[function(require,module,exports){

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

                if(device.isIOS()) this.$el.addClass('ios');
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

        nextPage: _.throttle(function() {
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

                var character = this.selectCharacterView.model.get('text');

                ga('send', 'event', 'Character Select', character, ipAddress);

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
        }, 200, {trailing: false}),

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

            ga('send', 'event', 'Finish and send letter', 'click', ipAddress);

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

            var docHeight = $(document).height();

            var topFrac = Math.min(pixelPosition/docHeight, (docHeight - this.footer.height() - this.$pageNav.outerHeight())/docHeight);

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
},{"../animations/intro":5,"../collections/allQuestions":11,"../device":18,"../loader":20,"../pixi/mainScene":26,"../pixi/scenesManager":28,"./cannedQuestionView":30,"./enterNameView":31,"./footerView":32,"./introView":34,"./questionView":36,"./responseView":37,"./selectCharacterView":38}],36:[function(require,module,exports){



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
},{"../animations/pageItems":6,"../device":18,"../templates/question.hbs":29}],37:[function(require,module,exports){




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
            'click a#printversion': 'print',
            'click #sendmore': 'onSendMore'
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
                var $letterBgCtr = $('#letterbg-ctr');
                var $cardWrap = $('#card-wrap');

                var height = $cardWrap.outerHeight();

                $letterBgCtr.height(height);
                $letterBgCtr.addClass('active');

                this.setMobileContentHeight();

                this.showMobileCharacters();
            }
        },

        setMobileContentHeight: function() {
            var $sendMore = $('#sendmore');
            var $footer = $('#footer');
            var $content = $('#content');

            var offsetTop = $sendMore.offset().top;
            var height = $sendMore.height();
            var footerHeight = $footer.height();

            $content.css('min-height', offsetTop*1.04 + height + footerHeight);
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
            
        },
        onSendMore: function(e) {
            e.preventDefault();

            var url = e.currentTarget.getAttribute('href');
            var newTab = (2 === e.which || e.metaKey || e.ctrlKey);

            ga('send', 'event', 'More airmail', 'click', ipAddress, {
                hitCallback: function() {
                    document.location = url;
                }
            });
        }
    });













    module.exports = ResponseView;
})();
},{"../animations/responseModule":9,"../data/cannedQuestions.json":14,"../data/personalityQuestions.json":16,"../data/responseMap.json":17,"../device":18}],38:[function(require,module,exports){




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
},{"../animations/characterModule":3,"../data/audioAssets.json":13,"../device":18,"./questionView":36}],39:[function(require,module,exports){
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
},{"./handlebars/base":40,"./handlebars/exception":41,"./handlebars/runtime":42,"./handlebars/safe-string":43,"./handlebars/utils":44}],40:[function(require,module,exports){
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
},{"./exception":41,"./utils":44}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{"./base":40,"./exception":41,"./utils":44}],43:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],44:[function(require,module,exports){
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
},{"./safe-string":43}],45:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":39}],46:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":45}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyby5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYWdlSXRlbXMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGxhY2VKdXN0T2Zmc2NyZWVuLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9RdWVzdGlvbkNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hc3NldHMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hdWRpb0Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcmVzcG9uc2VNYXAuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGV2aWNlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlX2QzMzQzM2QuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2xvYWRlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvbW9kZWxzL3F1ZXN0aW9uLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2FsbENoYXJhY3RlcnMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvY2hhcmFjdGVyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2V4dGVuZC5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9saWJNb2RpZmljYXRpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL21haW5TY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZXNNYW5hZ2VyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb24uaGJzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9jYW5uZWRRdWVzdGlvblZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2VudGVyTmFtZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2Zvb3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2hlYWRlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2ludHJvVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvbWFpblZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3F1ZXN0aW9uVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcmVzcG9uc2VWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9zZWxlY3RDaGFyYWN0ZXJWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGJhY2tncm91bmQsIG1pZGRsZWdyb3VuZCwgZm9yZWdyb3VuZDtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGJhY2tncm91bmQgPSBpbml0QmFja2dyb3VuZCgpO1xuICAgIG1pZGRsZWdyb3VuZCA9IGluaXRNaWRkbGVncm91bmQoKTtcbiAgICBmb3JlZ3JvdW5kID0gaW5pdEZvcmVncm91bmQoKTtcbn1cbmZ1bmN0aW9uIHNldEF0dHJzKHNwcml0ZSkge1xuICAgIHNwcml0ZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgc3ByaXRlLndpbmRvd1ggPSAwLjU7XG4gICAgc3ByaXRlLndpbmRvd1kgPSAxO1xuXG4gICAgc3ByaXRlLnNjYWxlVHlwZSA9ICdjb3Zlcic7XG4gICAgc3ByaXRlLndpbmRvd1NjYWxlID0gMS4wNjtcbn1cbmZ1bmN0aW9uIGluaXRCYWNrZ3JvdW5kKCkge1xuICAgIHZhciBiYWNrZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL3NpdGVfYmcuanBnJyk7XG5cbiAgICBzZXRBdHRycyhiYWNrZ3JvdW5kKTtcblxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdE1pZGRsZWdyb3VuZCgpIHtcbiAgICB2YXIgbWlkZGxlZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL21pZGdyb3VuZC5wbmcnKTtcbiAgICBzZXRBdHRycyhtaWRkbGVncm91bmQpO1xuICAgIHJldHVybiBtaWRkbGVncm91bmQ7XG59XG5mdW5jdGlvbiBpbml0Rm9yZWdyb3VuZCgpIHtcbiAgICB2YXIgZm9yZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZycpO1xuICAgIHNldEF0dHJzKGZvcmVncm91bmQpO1xuICAgIHJldHVybiBmb3JlZ3JvdW5kO1xufVxuXG5cblxuXG5cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG4gICAgfSksXG4gICAgYWRkQmFja2dyb3VuZFRvU2NlbmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGJhY2tncm91bmQpO1xuICAgIH0sXG4gICAgYWRkUmVzdFRvU2NlbmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKG1pZGRsZWdyb3VuZCk7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGZvcmVncm91bmQpO1xuICAgIH0sXG4gICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQoYmFja2dyb3VuZCkpIHJldHVybjtcblxuICAgICAgICB2YXIgYmFja2dyb3VuZFJhdGlvID0gMC43NTtcbiAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFJhdGlvID0gMS41O1xuICAgICAgICB2YXIgZm9yZWdyb3VuZFJhdGlvID0gMztcblxuICAgICAgICB2YXIgYmFja2dyb3VuZFggPSAwLjUgLSAoeCAtIDAuNSkgKiBiYWNrZ3JvdW5kUmF0aW8vNTA7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRYID0gMC41IC0gKHggLS41KSAqIG1pZGRsZWdyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgZm9yZWdyb3VuZFggPSAwLjUgLSAoeCAtLjUpICogZm9yZWdyb3VuZFJhdGlvLzUwO1xuXG4gICAgICAgIGJhY2tncm91bmQud2luZG93WCA9IGJhY2tncm91bmRYO1xuICAgICAgICBtaWRkbGVncm91bmQud2luZG93WCA9IG1pZGRsZWdyb3VuZFg7XG4gICAgICAgIGZvcmVncm91bmQud2luZG93WCA9IGZvcmVncm91bmRYO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGJhY2tncm91bmQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBtaWRkbGVncm91bmQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBmb3JlZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBiYWNrZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgZm9yZWdyb3VuZC5kZXN0cm95KCk7XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB3aXBlc2NyZWVuVmlkZW8sIHZpZGVvVGltZWxpbmU7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICB3aXBlc2NyZWVuVmlkZW8gPSBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpO1xuICAgIHZpZGVvVGltZWxpbmUgPSBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh3aXBlc2NyZWVuVmlkZW8pO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpIHtcbiAgICB2YXIgdGV4dHVyZXMgPSBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODYnLCA0MDAsIDU1Nik7XG5cbiAgICB2YXIgd2lwZXNjcmVlblZpZGVvID0gbmV3IFBJWEkuTW92aWVDbGlwKHRleHR1cmVzKTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93U2NhbGUgPSAxO1xuICAgIHdpcGVzY3JlZW5WaWRlby5zY2FsZVR5cGUgPSAnY292ZXInO1xuXG4gICAgd2lwZXNjcmVlblZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIHdpcGVzY3JlZW5WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICByZXR1cm4gd2lwZXNjcmVlblZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmdvdG9BbmRTdG9wKHZhbHVlKTtcblxuLy8gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuLy8gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1t2YWx1ZSB8IDBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pO1xufVxuXG5mdW5jdGlvbiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmFyIGZwcyA9IDI0O1xuICAgIHZhciBudW1GcmFtZXMgPSB2aWRlby50ZXh0dXJlcy5sZW5ndGg7XG5cbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgdmFyIGVhc2luZyA9IG5ldyBTdGVwcGVkRWFzZShudW1GcmFtZXMpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTGl0ZSh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZpZGVvLnR3ZWVuRnJhbWUgPSAwO1xuXG4gICAgICAgICAgICBjcmVhdGVqcy5Tb3VuZC5wbGF5KCdXaXBlc2NyZWVuJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHZpZGVvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cblxuICAgIHZhciBmYWRlT3V0VGltZSA9IDAuMjtcbiAgICB2YXIgZmFkZU91dFN0YXJ0ID0gdGltZWxpbmUuZHVyYXRpb24oKSAtIDAuMTtcblxuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdjYWxsYmFjaycsIHRpbWVsaW5lLmR1cmF0aW9uKCkgLSAwLjEpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh2aWRlbywgZmFkZU91dFRpbWUsIHtcbiAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgfSksIGZhZGVPdXRTdGFydCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZCh3aXBlc2NyZWVuVmlkZW8pO1xuICAgIH0sXG4gICAgcGxheVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5wbGF5KDApO1xuICAgIH0sXG4gICAgaGlkZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2lwZXNjcmVlblZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uVmlkZW9Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5hZGQoY2FsbGJhY2ssICdjYWxsYmFjaycpO1xuICAgIH1cbn07XG5cblxuXG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFthbmltYXRpb25Nb2R1bGVdLmNvbmNhdChPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi4vcGl4aS9hbGxDaGFyYWN0ZXJzJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgY2hhcmFjdGVyTmFtZTtcbnZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG5cblxuXG5mdW5jdGlvbiBnZXRPZmZzY3JlZW5YKGNoYXJhY3Rlcikge1xuICAgIHZhciB3aWR0aCA9IGNoYXJhY3Rlci5nZXRCb3VuZHMoKS53aWR0aDtcbiAgICB2YXIgYW5jaG9yWCA9IGNoYXJhY3Rlci5pZGxlLmFuY2hvci54O1xuICAgIHZhciB3aW5kb3dXaWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcblxuICAgIHJldHVybiAod2luZG93V2lkdGggKyBhbmNob3JYKndpZHRoKS93aW5kb3dXaWR0aDtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBhbmltYXRlSW4sIGFuaW1hdGVPdXQ7XG5cbnZhciBhbmltYXRpb25zSW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjM7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eTtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgICAgIGR1c3R5LndpbmRvd1ggPSAwLjY7XG4gICAgICAgICAgICBkdXN0eS53aW5kb3dTY2FsZSA9IDAuNDI7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMyxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG5cbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgYmxhZGUud2luZG93WCA9IC0uNDtcbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1kgPSAwLjc1O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FiYmllOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgICAgICAgICBjYWJiaWUuaWRsZS53aW5kb3dTY2FsZSA9IDAuNjtcbiAgICAgICAgICAgIGNhYmJpZS5yb3RhdGlvbiA9IDAuNTU7XG4gICAgICAgICAgICBjYWJiaWUud2luZG93WCA9IDAuNDY7XG5cbiAgICAgICAgICAgIGNhYmJpZS5zY2FsZS54ID0gMC44O1xuICAgICAgICAgICAgY2FiYmllLnNjYWxlLnkgPSAwLjg7XG5cbiAgICAgICAgICAgIGNhYmJpZS5maWx0ZXJzWzBdLmJsdXIgPSA3O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBzd2VlcFRpbWUgPSBhbmltYXRpb25UaW1lICogNy84O1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNSxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLnNjYWxlLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUuZmlsdGVyc1swXSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgYmx1cjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNTtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgICAgICBkaXBwZXIucm90YXRpb24gPSAwLjU1O1xuICAgICAgICAgICAgZGlwcGVyLndpbmRvd1ggPSAwLjQ2O1xuXG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueCA9IDAuODtcbiAgICAgICAgICAgIGRpcHBlci5zY2FsZS55ID0gMC44O1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gNztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgc3dlZXBUaW1lID0gYW5pbWF0aW9uVGltZSAqIDcvODtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTgsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlci5zY2FsZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgYmx1cjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aW5kbGlmdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgICAgICAgICB3aW5kbGlmdGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjU2O1xuXG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4od2luZGxpZnRlcik7XG4gICAgICAgICAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAwLjY7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG52YXIgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuZnVuY3Rpb24gb25BbmltYXRpb25PdXRDb21wbGV0ZSgpIHtcbiAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrKCk7XG59XG5cbnZhciBhbmltYXRpb25zT3V0ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ2lyYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogLTAuNSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjI0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjYWJiaWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGNhYmJpZS5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtibHVyOiA0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpcHBlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjEsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSwge2JsdXI6IDR9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2luZGxpZnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC4zLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW4nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSAqIDcvOCwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogVGVhbSBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiB0ZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcikge1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IER1c3R5IH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgZHVzdHkud2luZG93WCA9IDEgLSBnZXRPZmZzY3JlZW5YKGR1c3R5KTtcbiAgICBkdXN0eS5pZGxlLndpbmRvd1NjYWxlID0gMC4yNztcbiAgICBkdXN0eS5yb3RhdGlvbiA9IDAuNjtcbiAgICBkdXN0eS5maWx0ZXJzWzBdLmJsdXIgPSAwO1xuICAgIFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YoZHVzdHkpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IEJsYWRlIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihibGFkZSk7XG4gICAgYmxhZGUud2luZG93WCA9IDAuNDU7XG4gICAgYmxhZGUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzM7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQ2FiYmllIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjYWJiaWUpO1xuICAgIGNhYmJpZS53aW5kb3dYID0gMC4xNDtcbiAgICBjYWJiaWUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMjU7XG4gICAgY2FiYmllLmZpbHRlcnNbMF0uYmx1ciA9IDA7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRGlwcGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIGRpcHBlci5yb3RhdGlvbiA9IC0wLjM7XG4gICAgZGlwcGVyLndpbmRvd1ggPSAtMC4yO1xuICAgIGRpcHBlci53aW5kb3dZID0gMC4yNTtcbiAgICBkaXBwZXIuZmlsdGVyc1swXS5ibHVyID0gMDtcbiAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMjI7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IFdpbmRsaWZ0ZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHdpbmRsaWZ0ZXIud2luZG93WCA9IC0wLjE7XG4gICAgd2luZGxpZnRlci53aW5kb3dZID0gMC43O1xuLy8gICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC4wODtcbiAgICB3aW5kbGlmdGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjEyO1xuICAgIHdpbmRsaWZ0ZXIucm90YXRpb24gPSAtMC4zO1xuICAgIHdpbmRsaWZ0ZXIuZmlsdGVyc1swXS5ibHVyID0gMDtcbiAgICB3aW5kbGlmdGVyLmZsaXAoKTtcblxuXG4gICAgcmVxdWVzdEFuaW1GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgZHVzdHkucHVzaFRvVG9wKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGVJblRlYW0oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAzLjg7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4vLyAgICBhbmltYXRpb25UaW1lID0gMTA7XG5cbiAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5Rm91cjtcbiAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZVR3bztcbiAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICB0ZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcik7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn4gQW5pbWF0aW9uIFN0YXJ0IExhYmVscyB+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ0JsYWRlJywgMCk7XG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ0NhYmJpZScsIGFuaW1hdGlvblRpbWUgKiAwLjEzKTtcbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnV2luZGxpZnRlcicsIGFuaW1hdGlvblRpbWUgKiAwLjE1KTtcbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnRGlwcGVyJywgYW5pbWF0aW9uVGltZSAqIDAuNDYpO1xuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdEdXN0eScsIGFuaW1hdGlvblRpbWUgKiAwLjg1KTtcblxuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENhYmJpZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgY2FiYmllQW5pbWF0aW9uVGltZSA9IGFuaW1hdGlvblRpbWUgKiAxLjM7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhjYWJiaWUsIGNhYmJpZUFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WDogZ2V0T2Zmc2NyZWVuWChjYWJiaWUpLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgJ0NhYmJpZScpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhjYWJiaWUsIGNhYmJpZUFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICBlYXNlOiAnRXhwby5lYXNlT3V0J1xuICAgIH0pLCAnQ2FiYmllJyk7XG5cblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBCbGFkZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgYmxhZGVBbmltYXRpb25UaW1lID0gYW5pbWF0aW9uVGltZTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmxhZGUsIGJsYWRlQW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dYOiBnZXRPZmZzY3JlZW5YKGJsYWRlKSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksICdCbGFkZScpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibGFkZSwgYmxhZGVBbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuNSxcbiAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICB9KSwgJ0JsYWRlJyk7XG5cblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gV2luZGxpZnRlciB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIHdpbmRsaWZ0ZXJBbmltVGltZSA9IGFuaW1hdGlvblRpbWUgKiAxLjY7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIHdpbmRsaWZ0ZXJBbmltVGltZSwge1xuICAgICAgICB3aW5kb3dYOiBnZXRPZmZzY3JlZW5YKHdpbmRsaWZ0ZXIpLFxuICAgICAgICByb3RhdGlvbjogMC40LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgJ1dpbmRsaWZ0ZXInKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8od2luZGxpZnRlciwgd2luZGxpZnRlckFuaW1UaW1lICogMC43LCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMzUsXG4gICAgICAgIGVhc2U6ICdRdWFkLmVhc2VJbidcbiAgICB9KSwgJ1dpbmRsaWZ0ZXInKTtcblxuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IERpcHBlciB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgZGlwcGVyQW5pbVRpbWUgPSBhbmltYXRpb25UaW1lICogMS41O1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGRpcHBlckFuaW1UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IGdldE9mZnNjcmVlblgoZGlwcGVyKSxcbiAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAnRGlwcGVyJyk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgZGlwcGVyQW5pbVRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC42LFxuICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgIH0pLCAnRGlwcGVyJyk7XG5cblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEdXN0eSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgZHVzdHlBbmltVGltZSA9IGFuaW1hdGlvblRpbWUgKiAwLjc7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBkdXN0eUFuaW1UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IDAuMixcbiAgICAgICAgZWFzZTogJ1F1YWQuZWFzZUluT3V0J1xuICAgIH0pLCAnRHVzdHknKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGR1c3R5QW5pbVRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4yNCxcbiAgICAgICAgZWFzZTogJ1NpbmUuZWFzZU91dCdcbiAgICB9KSwgJ0R1c3R5Jyk7XG5cblxuXG5cblxuICAgIHRpbWVsaW5lLnBsYXkoKTtcblxuLy8gICAgbmV3IFRpbWVsaW5lTWF4KHtcbi8vICAgICAgICBzdGFnZ2VyOiAwLjI3LFxuLy8gICAgICAgIGFsaWduOiAnc3RhcnQnLFxuLy8gICAgICAgIHR3ZWVuczogW1xuLy8gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjQsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC41OSxcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuODMsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNTIsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjA1LFxuLy8gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNzgsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjcsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE2LFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pXG4vLyAgICAgICAgXVxuLy8gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGVPdXRUZWFtKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS44O1xuICAgIHZhciBlYXNpbmcgPSAnQ2lyYy5lYXNlSW4nO1xuXG4gICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eUZvdXI7XG4gICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcbiAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG4gICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjEsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dYOiBnZXRPZmZzY3JlZW5YKGR1c3R5KSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG5cbiAgICB0aW1lbGluZS5wbGF5KCk7XG4vLyAgICBuZXcgVGltZWxpbmVNYXgoe1xuLy8gICAgICAgIHN0YWdnZXI6IDAuMjksXG4vLyAgICAgICAgYWxpZ246ICdzdGFydCcsXG4vLyAgICAgICAgdHdlZW5zOiBbXG4vLyAgICAgICAgICAgIG5ldyBUaW1lbGluZU1heCh7XG4vLyAgICAgICAgICAgICAgICB0d2VlbnM6IFtcbi8vICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuLy8gICAgICAgICAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WDogMS42LFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgXVxuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuOCxcbi8vICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuMixcbi8vICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjIsXG4vLyAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjQsXG4vLyAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgICAgICAgICAgfSksXG4vLyAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgd2luZG93WTogMC42LFxuLy8gICAgICAgICAgICAgICAgd2luZG93WDogMS42LFxuLy8gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgIH0pLFxuLy8gICAgICAgICAgICBuZXcgVGltZWxpbmVNYXgoe1xuLy8gICAgICAgICAgICAgICAgdHdlZW5zOiBbXG4vLyAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbi8vICAgICAgICAgICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuMyxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4vLyAgICAgICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIF1cbi8vICAgICAgICAgICAgfSlcbi8vICAgICAgICBdLFxuLy8gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICBkdXN0eS5kZXN0cm95KCk7XG4vL1xuLy8gICAgICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrKCk7XG4vLyAgICAgICAgfVxuLy8gICAgfSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuXG4gICAgfSksXG4gICAgYW5pbWF0ZUluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoY2hhcmFjdGVyTmFtZSA9PT0gJ3RlYW0nKSB7XG4gICAgICAgICAgICBhbmltYXRlSW5UZWFtKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlSW4gPSBhbmltYXRpb25zSW5bY2hhcmFjdGVyTmFtZV07XG4gICAgICAgIGFuaW1hdGVPdXQgPSBhbmltYXRpb25zT3V0W2NoYXJhY3Rlck5hbWVdO1xuXG4gICAgICAgIHNldFRpbWVvdXQoYW5pbWF0ZUluLCA3MDApO1xuICAgIH0sXG4gICAgYW5pbWF0ZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgYW5pbWF0ZU91dFRlYW0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmltYXRlT3V0KCk7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBzZXRDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBjaGFyYWN0ZXJOYW1lID0gY2hhcmFjdGVyO1xuICAgIH0sXG4gICAgYWxsQ2hhcmFjdGVyczogYWxsQ2hhcmFjdGVyc1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxudmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuLi9waXhpL2FsbENoYXJhY3RlcnMnKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGR1c3R5LCBkaXBwZXIsIHRpbWVsaW5lSW4sIHRpbWVsaW5lT3V0LCB0aW1lbGluZUR1c3R5SG92ZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgZHVzdHkgPSBpbml0aWFsaXplRHVzdHkoKTtcbiAgICBkaXBwZXIgPSBpbml0aWFsaXplRGlwcGVyKCk7XG5cbiAgICB0aW1lbGluZUluID0gZ2VuZXJhdGVBbmltYXRpb25JblRpbWVsaW5lKCk7XG4gICAgdGltZWxpbmVPdXQgPSBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEdXN0eSgpIHtcbiAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5Rm91cjtcblxuICAgIGR1c3R5LmlkbGUud2luZG93U2NhbGUgPSAwLjMyO1xuICAgIGR1c3R5LndpbmRvd1ggPSAwLjE4O1xuICAgIGR1c3R5LndpbmRvd1kgPSAtMTtcblxuICAgIHJldHVybiBkdXN0eTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZURpcHBlcigpIHtcbiAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG5cbiAgICBkaXBwZXIuZmxpcCgpO1xuXG4gICAgZGlwcGVyLndpbmRvd1ggPSAwLjc1O1xuICAgIGRpcHBlci53aW5kb3dZID0gLTE7XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuNDA7XG5cbiAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDg2NS8xMzY2O1xuICAgIGRpcHBlci5pZGxlLmFuaW1hdGlvblNjYWxlWCA9IDAuNztcbiAgICBkaXBwZXIuaWRsZS5hbmltYXRpb25TY2FsZVkgPSAwLjc7XG5cbiAgICBkaXBwZXIuZmlsdGVyc1swXS5ibHVyID0gMTA7XG5cbiAgICByZXR1cm4gZGlwcGVyO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0ZSBJbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciB0aW1lbGluZUR1c3R5SW4gPSBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSk7XG5cbiAgICB0aW1lbGluZS5hZGQodGltZWxpbmVEdXN0eUluLnBsYXkoKSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KS5wbGF5KCksIHRpbWVsaW5lRHVzdHlJbi5kdXJhdGlvbigpKTtcblxuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKS5wbGF5KCksIDAuNCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUluKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjUyLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMTtcbiAgICB2YXIgZWFzaW5nID0gJ1F1YWQuZWFzZUluT3V0JztcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgcmVwZWF0OiAtMVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBidW1wWTogLTE1LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBidW1wWTogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4wO1xuICAgIHZhciBzd2VlcFN0YXJ0VGltZSA9IGFuaW1hdGlvblRpbWUgKiAwLjExO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZGlwcGVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4zMCxcbiAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICB9KSwgMCk7XG5cbiAgICAvL3N3ZWVwIHJpZ2h0XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WDogMC44NixcbiAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCBzd2VlcFN0YXJ0VGltZSk7XG5cbiAgICAvLyBzY2FsZSB1cFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLmlkbGUsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGJsdXI6IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRlIE91dCAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uT3V0VGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lT3V0ID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmVPdXQuYWRkKGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KGRpcHBlcikucGxheSgpLCAwKTtcbiAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkucGxheSgpLCAwKTtcblxuICAgcmV0dXJuIHRpbWVsaW5lT3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlci5pZGxlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS40LFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuNCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgIHdpbmRvd1g6IDEuMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzIsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuNDtcbiAgICB2YXIgZWFzaW5nID0gJ0V4cG8uZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZHVzdHkuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eS5pZGxlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS4zLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuMyxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAtMC4yLFxuICAgICAgICB3aW5kb3dYOiAwLjcsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lSW4ucGxheSgwKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZU91dC5wbGF5KDApO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25JbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aW1lbGluZUluLnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDb21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBnZXRJbnRyb1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMCcsIDAsIDEyMik7XG59XG5mdW5jdGlvbiBnZXRMb2dvVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwJywgMCwgNzIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgcnVubmluZyA9IHRydWU7XG52YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxudmFyIHN0YWdlID0gbmV3IFBJWEkuU3RhZ2UoMHg2NkZGOTkpO1xudmFyIHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpLCBudWxsLCB0cnVlLCB0cnVlKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIC8vIGFkZCB0aGUgcmVuZGVyZXIgdmlldyBlbGVtZW50IHRvIHRoZSBET01cbiAgICByZW5kZXJlci52aWV3LnNldEF0dHJpYnV0ZSgnaWQnLCAncGl4aS1pbnRybycpO1xuICAgICQoJyNjb250ZW50JykuYXBwZW5kKHJlbmRlcmVyLnZpZXcpO1xuXG4gICAgcmVxdWVzdEFuaW1GcmFtZShhbmltYXRlKTtcblxuICAgICR3aW5kb3cub24oJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICBpZighcnVubmluZykgcmV0dXJuO1xuXG4gICAgcmVxdWVzdEFuaW1GcmFtZShhbmltYXRlKTtcblxuICAgIC8vIHJlbmRlciB0aGUgc3RhZ2VcbiAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogSW50cm8gVmlkZW8gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgdmlkZW9UaW1lbGluZSwgdmlkZW87XG5cbnZhciB2aWRlb0NvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbnZhciBiZ0NvbG9ycyA9IHtcbiAgICB0b3BMZWZ0OiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIHRvcDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICB0b3BSaWdodDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICBidG1MZWZ0OiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIGJ0bTogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICBidG1SaWdodDogbmV3IFBJWEkuR3JhcGhpY3MoKVxufTtcbnZhciBpbnRyb1ZpZGVvQ29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGludHJvRnJhbWVUb3AgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG52YXIgaW50cm9GcmFtZUJ0bSA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBpbnRyb0ZyYW1lVG9wQmc7XG52YXIgaW50cm9GcmFtZUJ0bUJnO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplQmFja2dyb3VuZENvbG9ycygpIHtcblxuICAgIF8uZWFjaChiZ0NvbG9ycywgZnVuY3Rpb24oZ3JhcGhpYykge1xuICAgICAgICBncmFwaGljLmJlZ2luRmlsbCgweDA3MDgwQik7XG4gICAgICAgIGdyYXBoaWMubGluZVN0eWxlKDApO1xuXG4gICAgICAgIGdyYXBoaWMuZHJhd1JlY3QoMCwgMCwgMSwgMSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVJbnRyb0ZyYW1lVG9wKCkge1xuICAgIGludHJvRnJhbWVUb3BCZyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9pbnRyby10b3AucG5nJyk7XG4gICAgaW50cm9GcmFtZVRvcEJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAxKTtcblxuICAgIGludHJvRnJhbWVUb3Aud2luZG93WCA9IC41O1xuICAgIGludHJvRnJhbWVUb3Aud2luZG93WSA9IC41O1xuXG4gICAgYmdDb2xvcnMudG9wTGVmdC53aW5kb3dYID0gLS41O1xuICAgIGJnQ29sb3JzLnRvcExlZnQud2luZG93WSA9IC0uNTtcbiAgICBiZ0NvbG9ycy50b3Aud2luZG93WCA9IC0uNTtcbiAgICBiZ0NvbG9ycy50b3Aud2luZG93WSA9IC0uNTtcblxuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LndpbmRvd1kgPSAtLjU7XG5cbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGJnQ29sb3JzLnRvcExlZnQpO1xuICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQoYmdDb2xvcnMudG9wKTtcbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGJnQ29sb3JzLnRvcFJpZ2h0KTtcbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGludHJvRnJhbWVUb3BCZyk7XG5cbiAgICBpbnRyb0ZyYW1lVG9wQmcuc2NhbGVNaW4gPSAwLjg7XG5cbiAgICBpbnRyb1ZpZGVvQ29udGFpbmVyLmFkZENoaWxkKGludHJvRnJhbWVUb3ApO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplSW50cm9GcmFtZUJ0bSgpIHtcbiAgICBpbnRyb0ZyYW1lQnRtQmcgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaW50cm8tYnRtLnBuZycpO1xuICAgIGludHJvRnJhbWVCdG1CZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMCk7XG5cbiAgICBpbnRyb0ZyYW1lQnRtLndpbmRvd1ggPSAuNTtcbiAgICBpbnRyb0ZyYW1lQnRtLndpbmRvd1kgPSAuNTtcblxuICAgIGJnQ29sb3JzLmJ0bUxlZnQud2luZG93WCA9IC0uNTtcbiAgICBiZ0NvbG9ycy5idG0ud2luZG93WCA9IC0uNTtcblxuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoYmdDb2xvcnMuYnRtTGVmdCk7XG4gICAgaW50cm9GcmFtZUJ0bS5hZGRDaGlsZChiZ0NvbG9ycy5idG0pO1xuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoYmdDb2xvcnMuYnRtUmlnaHQpO1xuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoaW50cm9GcmFtZUJ0bUJnKTtcblxuICAgIGludHJvRnJhbWVCdG1CZy5zY2FsZU1pbiA9IDAuODtcblxuICAgIGludHJvVmlkZW9Db250YWluZXIuYWRkQ2hpbGQoaW50cm9GcmFtZUJ0bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlbygpIHtcbiAgICB2YXIgaW50cm9WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRJbnRyb1RleHR1cmVzKCkpO1xuXG4gICAgaW50cm9WaWRlby53aW5kb3dYID0gMC41O1xuICAgIGludHJvVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcblxuICAgIGludHJvVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIGludHJvVmlkZW8ubG9vcCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIGludHJvVmlkZW87XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmlkZW8uX3R3ZWVuRnJhbWUgPSAwO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIGluaXRpYWxpemVCYWNrZ3JvdW5kQ29sb3JzKCk7XG5cbiAgICBzdGFnZS5hZGRDaGlsZChpbnRyb1ZpZGVvQ29udGFpbmVyKTtcbn0pKCk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogTG9nbyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBsb2dvLCBsb2dvVGltZWxpbmU7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVMb2dvKCkge1xuICAgIHZhciBsb2dvID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldExvZ29UZXh0dXJlcygpKTtcblxuICAgIGxvZ28ud2luZG93WSA9IDA7XG4gICAgbG9nby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG5cbiAgICBsb2dvLnZpc2libGUgPSBmYWxzZTtcbiAgICBsb2dvLmxvb3AgPSBmYWxzZTtcblxuICAgIGxvZ28uX3R3ZWVuRnJhbWUgPSAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsb2dvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBsb2dvO1xufVxuXG5mdW5jdGlvbiBnZXRMb2dvQW5pbWF0aW9uVGltZWxpbmUobG9nbykge1xuICAgIHZhciBmcHMgPSAzMjtcbiAgICB2YXIgbnVtRnJhbWVzID0gbG9nby50ZXh0dXJlcy5sZW5ndGg7XG5cbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgdmFyIGVhc2luZyA9IG5ldyBTdGVwcGVkRWFzZShudW1GcmFtZXMpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTGl0ZSh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsb2dvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgbG9nby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgICAgIGNyZWF0ZWpzLlNvdW5kLnBsYXkoJ0xvZ29kcm9wJywge2RlbGF5OiAwfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8obG9nbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgICAgICBjcmVhdGVqcy5Tb3VuZC5wbGF5KCdJbnRyb1ZpZGVvJywge2RlbGF5OiA1MH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgdmlkZW9Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBkZWxheSA9IDA7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIGRlbGF5KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgbG9hZGluZ1NjcmVlbiA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBsb2FkaW5nQmFyID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbnZhciBsb2FkaW5nQmFja2dyb3VuZCA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG52YXIgbG9hZGVyTG9nbyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9wcmVsb2FkZXJfbG9nby5wbmcnKTtcblxuZnVuY3Rpb24gc2V0R3JhcGhpY1NjYWxlKG9iaiwgd2lkdGgsIGhlaWdodCkge1xuICAgIG9iai5zY2FsZS54ID0gb2JqLl9ncmFwaGljU2NhbGUgKiB3aWR0aDtcblxuICAgIGlmKCFfLmlzVW5kZWZpbmVkKGhlaWdodCkpIHtcbiAgICAgICAgb2JqLnNjYWxlLnkgPSBvYmouX2dyYXBoaWNTY2FsZSAqIGhlaWdodDtcbiAgICB9XG59XG5mdW5jdGlvbiBpbml0TG9hZGluZ0JhcigpIHtcbiAgICBsb2FkaW5nQmFyLmJlZ2luRmlsbCgweEMyMDAxQik7XG4gICAgbG9hZGluZ0Jhci5saW5lU3R5bGUoMCk7XG5cbiAgICBsb2FkaW5nQmFyLmRyYXdSZWN0KDAsIDAsIDEsIDE1KTtcblxuICAgIGxvYWRpbmdCYXIuX2dyYXBoaWNTY2FsZSA9IDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvYWRpbmdCYXIsICdncmFwaGljU2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JhcGhpY1NjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY1NjYWxlID0gdmFsO1xuXG4gICAgICAgICAgICBzZXRHcmFwaGljU2NhbGUodGhpcywgJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbG9hZGluZ1NjcmVlbi5hZGRDaGlsZChsb2FkaW5nQmFyKTtcbn1cbmZ1bmN0aW9uIGluaXRMb2FkaW5nQmFja2dyb3VuZCgpIHtcbiAgICBsb2FkaW5nQmFja2dyb3VuZC5iZWdpbkZpbGwoMHgwODA5MEIpO1xuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmxpbmVTdHlsZSgwKTtcbiAgICBsb2FkaW5nQmFja2dyb3VuZC5kcmF3UmVjdCgwLCAwLCAxLCAxKTtcblxuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLl9ncmFwaGljU2NhbGUgPSAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsb2FkaW5nQmFja2dyb3VuZCwgJ2dyYXBoaWNTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFwaGljU2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljU2NhbGUgPSB2YWw7XG5cbiAgICAgICAgICAgIHNldEdyYXBoaWNTY2FsZSh0aGlzLCAkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBsb2FkaW5nQmFja2dyb3VuZC5ncmFwaGljU2NhbGUgPSAxO1xuXG4gICAgbG9hZGluZ1NjcmVlbi5hZGRDaGlsZChsb2FkaW5nQmFja2dyb3VuZCk7XG59XG5cbmZ1bmN0aW9uIGluaXRMb2dvKCkge1xuICAgIGxvYWRlckxvZ28ud2luZG93WCA9IDAuNTtcbiAgICBsb2FkZXJMb2dvLndpbmRvd1kgPSAwLjU7XG5cbiAgICBsb2FkZXJMb2dvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LC41KTtcblxuICAgIGxvYWRpbmdTY3JlZW4uYWRkQ2hpbGQobG9hZGVyTG9nbyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICBpbml0TG9hZGluZ0JhY2tncm91bmQoKTtcbiAgICBpbml0TG9hZGluZ0JhcigpO1xuICAgIGluaXRMb2dvKCk7XG5cbiAgICBzdGFnZS5hZGRDaGlsZChsb2FkaW5nU2NyZWVuKTtcbn0pKCk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiBPbiBXaW5kb3cgUmVzaXplICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgIHVwZGF0ZUxvYWRpbmdTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHVwZGF0ZVZpZGVvQW5kRnJhbWUod2lkdGgsIGhlaWdodCk7XG5cbiAgICBzdGFnZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgcmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xufVxuZnVuY3Rpb24gdXBkYXRlTG9nbyh3aWR0aCwgaGVpZ2h0LCB2aWRlb0hlaWdodCkge1xuICAgIGlmKF8uaXNVbmRlZmluZWQobG9nbykpIHJldHVybjtcblxuICAgIHZhciBib3VuZHMgPSBsb2dvLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICB2YXIgbmV3TG9nb0hlaWdodCA9IChoZWlnaHQgLSB2aWRlb0hlaWdodCkvMjtcbiAgICB2YXIgc2NhbGUgPSBNYXRoLm1pbihuZXdMb2dvSGVpZ2h0Lyhib3VuZHMuaGVpZ2h0IC0gNTUpLCAxKTtcblxuICAgIGxvZ28uc2NhbGUueCA9IHNjYWxlO1xuICAgIGxvZ28uc2NhbGUueSA9IHNjYWxlO1xuXG4gICAgLy9jYWxjIHBvc2l0aW9uXG4gICAgbG9nby53aW5kb3dZID0gbmV3TG9nb0hlaWdodC9oZWlnaHQgLSAwLjU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxvYWRpbmdTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzZXRHcmFwaGljU2NhbGUobG9hZGluZ0Jhciwgd2lkdGgpO1xuICAgIHNldEdyYXBoaWNTY2FsZShsb2FkaW5nQmFja2dyb3VuZCwgd2lkdGgsIGhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVZpZGVvQW5kRnJhbWUod2lkdGgsIGhlaWdodCkge1xuICAgIGlmKF8uaXNVbmRlZmluZWQoaW50cm9GcmFtZVRvcEJnKSkgcmV0dXJuO1xuXG4gICAgdmFyIG1heEhlaWdodCA9IDAuODc7XG4gICAgdmFyIG1heFdpZHRoID0gMC45NTtcblxuICAgIHZhciBsb2NhbEJvdW5kcyA9IGludHJvRnJhbWVUb3BCZy5nZXRMb2NhbEJvdW5kcygpO1xuICAgIHZhciBidG1Cb3VuZHMgPSBpbnRyb0ZyYW1lQnRtQmcuZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgIHZhciBzY2FsZSA9IE1hdGgubWluKG1heEhlaWdodCAqIDAuNSAqIGhlaWdodC9sb2NhbEJvdW5kcy5oZWlnaHQsIG1heFdpZHRoICogd2lkdGgvbG9jYWxCb3VuZHMud2lkdGgpO1xuXG4gICAgLy9rZWVwIHNjYWxlIHdpdGhpbiBvdXIgZGVmaW5lZCBib3VuZHNcbiAgICBzY2FsZSA9IE1hdGgubWF4KGludHJvRnJhbWVUb3BCZy5zY2FsZU1pbiwgTWF0aC5taW4oc2NhbGUsIGludHJvRnJhbWVUb3BCZy5zY2FsZU1heCkpO1xuXG4gICAgdmFyIGJ0bVNjYWxlID0gc2NhbGUgKiBsb2NhbEJvdW5kcy53aWR0aC9idG1Cb3VuZHMud2lkdGg7XG4gICAgdmFyIHZpZGVvU2NhbGUgPSBzY2FsZSAqIDEuMDI0O1xuXG4gICAgaW50cm9GcmFtZVRvcEJnLnNjYWxlLnggPSBzY2FsZTtcbiAgICBpbnRyb0ZyYW1lVG9wQmcuc2NhbGUueSA9IHNjYWxlO1xuXG4gICAgaW50cm9GcmFtZUJ0bUJnLnNjYWxlLnggPSBidG1TY2FsZTtcbiAgICBpbnRyb0ZyYW1lQnRtQmcuc2NhbGUueSA9IGJ0bVNjYWxlO1xuXG4gICAgdmlkZW8uc2NhbGUueCA9IHZpZGVvU2NhbGU7XG4gICAgdmlkZW8uc2NhbGUueSA9IHZpZGVvU2NhbGU7XG5cbiAgICB1cGRhdGVUb3BGcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgbG9jYWxCb3VuZHMud2lkdGggKiBzY2FsZSwgbG9jYWxCb3VuZHMuaGVpZ2h0ICogc2NhbGUpO1xuICAgIHVwZGF0ZUJ0bUZyYW1lQmFja2dyb3VuZCh3aWR0aCwgaGVpZ2h0LCBidG1Cb3VuZHMud2lkdGggKiBzY2FsZSwgYnRtQm91bmRzLmhlaWdodCAqIHNjYWxlKTtcbiAgICB1cGRhdGVMb2dvKHdpZHRoLCBoZWlnaHQsIHZpZGVvU2NhbGUgKiB2aWRlby5nZXRMb2NhbEJvdW5kcygpLmhlaWdodCk7XG59XG5mdW5jdGlvbiB1cGRhdGVUb3BGcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgZnJhbWVXaWR0aCwgZnJhbWVIZWlnaHQpIHtcbiAgICB2YXIgc2lkZVdpZHRoID0gKHdpZHRoLWZyYW1lV2lkdGgpLzIgKyBmcmFtZVdpZHRoICogMTAwLzk3NTtcbiAgICB2YXIgdG9wSGVpZ2h0ID0gKGhlaWdodC8yLWZyYW1lSGVpZ2h0KSArIGZyYW1lSGVpZ2h0ICogMTAwLzMyNjtcblxuICAgIGJnQ29sb3JzLnRvcExlZnQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy50b3BMZWZ0LnNjYWxlLnkgPSBoZWlnaHQvMjtcblxuICAgIGJnQ29sb3JzLnRvcC5zY2FsZS54ID0gd2lkdGg7XG4gICAgYmdDb2xvcnMudG9wLnNjYWxlLnkgPSB0b3BIZWlnaHQ7XG5cbiAgICBiZ0NvbG9ycy50b3BSaWdodC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LnNjYWxlLnkgPSBoZWlnaHQvMjtcbiAgICBiZ0NvbG9ycy50b3BSaWdodC53aW5kb3dYID0gKHdpZHRoLXNpZGVXaWR0aCkvd2lkdGggLSAwLjU7XG59XG5mdW5jdGlvbiB1cGRhdGVCdG1GcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgZnJhbWVXaWR0aCwgZnJhbWVIZWlnaHQpIHtcbiAgICB2YXIgc2lkZVdpZHRoID0gKHdpZHRoLWZyYW1lV2lkdGgpLzIgKyBmcmFtZVdpZHRoICogMTAwLzk3NTtcbiAgICB2YXIgYnRtSGVpZ2h0ID0gKGhlaWdodC8yLWZyYW1lSGVpZ2h0KSArIGZyYW1lSGVpZ2h0ICogMTAwLzMyNjtcblxuICAgIGJnQ29sb3JzLmJ0bUxlZnQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy5idG1MZWZ0LnNjYWxlLnkgPSBoZWlnaHQvMjtcblxuICAgIGJnQ29sb3JzLmJ0bS5zY2FsZS54ID0gd2lkdGg7XG4gICAgYmdDb2xvcnMuYnRtLnNjYWxlLnkgPSBidG1IZWlnaHQ7XG4gICAgYmdDb2xvcnMuYnRtLndpbmRvd1kgPSAoaGVpZ2h0LWJ0bUhlaWdodCkvaGVpZ2h0IC0gMC41O1xuXG4gICAgYmdDb2xvcnMuYnRtUmlnaHQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy5idG1SaWdodC5zY2FsZS55ID0gaGVpZ2h0LzI7XG4gICAgYmdDb2xvcnMuYnRtUmlnaHQud2luZG93WCA9ICh3aWR0aC1zaWRlV2lkdGgpL3dpZHRoIC0gMC41O1xufVxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG4gICAgfSxcbiAgICBnZXRJbnRyb0ZyYW1lczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGludHJvRnJhbWVUb3AsXG4gICAgICAgICAgICBidG06IGludHJvRnJhbWVCdG1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgdXBkYXRlTG9hZGVyOiBmdW5jdGlvbihwZXJjZW50LCB0aW1lRWxhcHNlZCkge1xuICAgICAgICB2YXIgb2xkWCA9IGxvYWRpbmdCYXIuZ3JhcGhpY1NjYWxlO1xuICAgICAgICB2YXIgbmV3WCA9IHBlcmNlbnQ7XG5cbiAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSB0aW1lRWxhcHNlZC8xMDAwICogKG5ld1ggLSBvbGRYKS9uZXdYO1xuXG4gICAgICAgIFR3ZWVuTGl0ZS50byhsb2FkaW5nQmFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICBncmFwaGljU2NhbGU6IG5ld1hcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW8gPSBpbml0aWFsaXplVmlkZW8oKTtcbiAgICAgICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKTtcbiAgICAgICAgbG9nbyA9IGluaXRpYWxpemVMb2dvKCk7XG4gICAgICAgIGxvZ29UaW1lbGluZSA9IGdldExvZ29BbmltYXRpb25UaW1lbGluZShsb2dvKTtcblxuICAgICAgICBpbnRyb1ZpZGVvQ29udGFpbmVyLmFkZENoaWxkKHZpZGVvKTtcblxuICAgICAgICBpbml0aWFsaXplSW50cm9GcmFtZVRvcCgpO1xuICAgICAgICBpbml0aWFsaXplSW50cm9GcmFtZUJ0bSgpO1xuXG4gICAgICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQobG9nbyk7XG5cbiAgICAgICAgb25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8obG9hZGluZ1NjcmVlbiwgMC40LCB7XG4gICAgICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoc2VsZi5wbGF5VmlkZW8uYmluZChzZWxmKSwgNjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgNjAwKTtcbiAgICB9KSxcbiAgICBzaG93TG9nbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvZ29UaW1lbGluZS5wbGF5KCk7XG4gICAgfSxcbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuICAgICAgICBsb2dvLmRlc3Ryb3koKTtcblxuICAgICAgICBpbnRyb1ZpZGVvQ29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgaW50cm9GcmFtZVRvcCA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVCdG0gPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lVG9wQmcgPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lQnRtQmcgPSBudWxsO1xuXG4gICAgICAgIHN0YWdlID0gbnVsbDtcbiAgICAgICAgcmVuZGVyZXIgPSBudWxsO1xuICAgICAgICB2aWRlbyA9IG51bGw7XG4gICAgICAgIGxvZ28gPSBudWxsO1xuXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAkKCcjcGl4aS1pbnRybycpLnJlbW92ZSgpO1xuXG4gICAgICAgICR3aW5kb3cub2ZmKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG4gICAgfVxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcbnZhciBhbmltYXRpb25UaW1lID0gMC40O1xuXG5cblxudmFyIHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnMgPSBbXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXRSb3RhdGUpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgZmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tVG9wKSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dFJvdGF0ZSldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tVG9wKSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldXG5dO1xuXG52YXIgY2FubmVkQW5pbWF0aW9uUGFpcnMgPSBbXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXVxuXTtcblxuXG5cbmZ1bmN0aW9uIHN0YWdnZXJJdGVtcygkaXRlbXMpIHtcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIHR3ZWVuczogXy5tYXAoJGl0ZW1zLCB0aGlzKSxcbiAgICAgICAgc3RhZ2dlcjogMC4wN1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKiBJbmRpdmlkdWFsIEFuaW1hdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGZhZGVJbigkaXRlbSwgcHJvcCwgZGlzdGFuY2UsIGVhc2luZykge1xuICAgIHZhciBmcm9tID0ge29wYWNpdHk6IDB9O1xuICAgIGZyb21bcHJvcF0gPSBkaXN0YW5jZTtcblxuICAgIHZhciB0byA9IHtvcGFjaXR5OiAxLCBlYXNlOiBlYXNpbmd9O1xuICAgIHRvW3Byb3BdID0gMDtcblxuICAgIHJldHVybiBUd2VlbkxpdGUuZnJvbVRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCBmcm9tLCB0byk7XG59XG5mdW5jdGlvbiBmYWRlSW5Ob01vdmVtZW50KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCAwLCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gZmFkZUluRnJvbVJpZ2h0KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCA3NSwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbkZyb21Ub3AoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneScsIC03NSwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUZhZGVJbkZyb21SaWdodCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgNzUsICdCYWNrLmVhc2VPdXQnKTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUZhZGVJbkZyb21Ub3AoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneScsIC03NSwgJ0JhY2suZWFzZU91dCcpO1xufVxuZnVuY3Rpb24gcm90YXRlSW5MZWZ0KCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS5mcm9tVG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtyb3RhdGlvblk6IC05MCwgdHJhbnNmb3JtT3JpZ2luOlwibGVmdCA1MCUgLTEwMFwifSwge3JvdGF0aW9uWTogMH0pO1xufVxuXG5mdW5jdGlvbiBzbmFwT3V0KCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50bygkaXRlbSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDAsIHNjYWxlOiAwLjQsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCUgMFwiLCBlYXNlOiAnQmFjay5lYXNlSW4nfSk7XG59XG5mdW5jdGlvbiBzbmFwT3V0Um90YXRlKCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50bygkaXRlbSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDAsIHNjYWxlOiAwLjQsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCUgMFwiLCByb3RhdGlvbjogLTQ1LCBlYXNlOiAnQmFjay5lYXNlSW4nfSk7XG59XG5cblxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBnZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnM6IGZ1bmN0aW9uKCRpdGVtcykge1xuICAgICAgICB2YXIgaSA9IF8ucmFuZG9tKHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnNbaV0sIGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgICAgcmV0dXJuIGZuYygkaXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldFJhbmRvbUNhbm5lZEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCRpdGVtcykge1xuICAgICAgICB2YXIgaSA9IF8ucmFuZG9tKGNhbm5lZEFuaW1hdGlvblBhaXJzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChjYW5uZWRBbmltYXRpb25QYWlyc1tpXSwgZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZm5jKCRpdGVtcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHBhcmFjaHV0ZXJzLCBwYXJhY2h1dGVyc0NvbnRhaW5lcjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBwYXJhY2h1dGVycyA9IF8uc2h1ZmZsZShbZ2V0QmxhY2tvdXQoKSwgZ2V0RHJpcCgpLCBnZXREeW5hbWl0ZSgpXSk7XG5cbiAgICBfLmVhY2gocGFyYWNodXRlcnMsIGZ1bmN0aW9uKHBhcmFjaHV0ZXIpIHtcbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDA7XG5cbiAgICAgICAgcGFyYWNodXRlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1ggPSAwLjU7XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WSA9IC0xO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0QmxhY2tvdXQoKSB7XG4gICAgdmFyIGJsYWNrb3V0SWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIik7XG4gICAgYmxhY2tvdXRJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAyNi82MSxcbiAgICAgICAgeTogMzMvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0JsYWNrb3V0JywgYmxhY2tvdXRJZGxlU3RhdGUpO1xufVxuZnVuY3Rpb24gZ2V0RHJpcCgpIHtcbiAgICB2YXIgZHJpcElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHJpcC5wbmdcIik7XG4gICAgZHJpcElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDM2LzYxLFxuICAgICAgICB5OiAyNi85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignRHJpcCcsIGRyaXBJZGxlU3RhdGUpO1xufVxuZnVuY3Rpb24gZ2V0RHluYW1pdGUoKSB7XG4gICAgdmFyIGR5bmFtaXRlSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9keW5hbWl0ZS5wbmdcIik7XG4gICAgZHluYW1pdGVJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAyNy82MSxcbiAgICAgICAgeTogMzAvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0R5bmFtaXRlJywgZHluYW1pdGVJZGxlU3RhdGUpO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGFuaW1hdGVQYXJhY2h1dGVyKHBhcmFjaHV0ZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDM1O1xuXG4gICAgdmFyIGRlcHRoID0gTWF0aC5yYW5kb20oKSAqIDU7XG4gICAgdmFyIHggPSAwLjEgKyAoTWF0aC5yYW5kb20oKSAqIDAuOCk7XG4gICAgdmFyIHNjYWxlID0gMSAtIGRlcHRoICogMC4yLzU7XG5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4ocGFyYWNodXRlcik7XG4gICAgcGFyYWNodXRlci53aW5kb3dYID0geDtcblxuICAgIHZhciByb3RhdGlvbiA9IDAuMztcblxuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDEsXG4gICAgICAgIGVhc2U6ICdTaW5lLmVhc2VPdXQnLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBhcmFjaHV0ZXIudmlzaWJpbGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGFyYWNodXRlci5zY2FsZSA9IHt4OiBzY2FsZSwgeTogc2NhbGV9O1xuICAgIHBhcmFjaHV0ZXIuZmlsdGVyc1swXS5ibHVyID0gZGVwdGggKiAzLzU7XG4gICAgcGFyYWNodXRlci5yb3RhdGlvbiA9IHJvdGF0aW9uO1xuXG4gICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pO1xufVxuZnVuY3Rpb24gc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pIHtcbiAgICB2YXIgc3dheVRpbWUgPSAxLjI7XG4gICAgdmFyIGRlYyA9IDAuMDM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgcm90YXRpb246IC1yb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCdcbiAgICB9KTtcbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0JyxcbiAgICAgICAgZGVsYXk6IHN3YXlUaW1lLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKHJvdGF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uIC0gZGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICAgICAgICBfLmVhY2gocGFyYWNodXRlcnMsIF8uYmluZChwYXJhY2h1dGVyc0NvbnRhaW5lci5hZGRDaGlsZCwgcGFyYWNodXRlcnNDb250YWluZXIpKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZChwYXJhY2h1dGVyc0NvbnRhaW5lcik7XG4gICAgfSksXG4gICAgYW5pbWF0ZU5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihwYXJhY2h1dGVycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgYW5pbWF0ZVBhcmFjaHV0ZXIocGFyYWNodXRlcnMuc2hpZnQoKSk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIF8uZWFjaChwYXJhY2h1dGVycywgZnVuY3Rpb24ocGFyYWNodXRlcikge1xuICAgICAgICAgICAgcGFyYWNodXRlci5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFthbmltYXRpb25Nb2R1bGVdLmNvbmNhdChPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgdmFyIGhlaWdodCA9IGNoYXJhY3Rlci5zY2FsZS55ICogY2hhcmFjdGVyLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xuXG4gICAgY2hhcmFjdGVyLndpbmRvd1kgPSAtKGhlaWdodC8yKS8kKHdpbmRvdykuaGVpZ2h0KCk7XG59OyIsIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi4vcGl4aS9hbGxDaGFyYWN0ZXJzJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxudmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxudmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG52YXIgbGV0dGVyQmc7XG5cbmZ1bmN0aW9uIGdldE9mZnNjcmVlblgoY2hhcmFjdGVyKSB7XG4gICAgdmFyIHdpZHRoID0gY2hhcmFjdGVyLmdldEJvdW5kcygpLndpZHRoO1xuICAgIHZhciBhbmNob3JYID0gY2hhcmFjdGVyLmlkbGUuYW5jaG9yLng7XG4gICAgdmFyIHdpbmRvd1dpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuXG4gICAgcmV0dXJuICh3aW5kb3dXaWR0aCArIGFuY2hvclgqd2lkdGgpL3dpbmRvd1dpZHRoO1xufVxuXG5cbnZhciBhbmltYXRlSW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjI7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eURhcms7XG5cbiAgICAgICAgICAgIGR1c3R5LnB1c2hUb1RvcCgpO1xuICAgICAgICAgICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzc7XG4gICAgICAgICAgICBkdXN0eS53aW5kb3dYID0gMC4yO1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjY4LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjMsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcblxuICAgICAgICAgICAgYmxhZGUucHVzaFRvVG9wKCk7XG4gICAgICAgICAgICBibGFkZS5pZGxlLndpbmRvd1NjYWxlID0gMC41O1xuICAgICAgICAgICAgYmxhZGUud2luZG93WCA9IDAuMztcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihibGFkZSk7XG5cbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC43NCxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI0LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIGNhYmJpZS5wdXNoVG9Ub3AoKTtcbiAgICAgICAgICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgICAgICAgICBjYWJiaWUud2luZG93WCA9IDAuMzU7XG4gICAgICAgICAgICBjYWJiaWUucm90YXRpb24gPSAwO1xuICAgICAgICAgICAgY2FiYmllLmZpbHRlcnNbMF0uYmx1ciA9IDA7XG5cbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTgsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBkaXBwZXIucHVzaFRvVG9wKCk7XG4gICAgICAgICAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgZGlwcGVyLndpbmRvd1ggPSAwLjQ7XG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueCA9IC0xO1xuICAgICAgICAgICAgZGlwcGVyLnJvdGF0aW9uID0gMDtcbiAgICAgICAgICAgIGRpcHBlci5maWx0ZXJzWzBdLmJsdXIgPSAwO1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgd2luZG93WDogMC42NSxcbiAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjksXG4gICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIucHVzaFRvVG9wKCk7XG4gICAgICAgICAgICB3aW5kbGlmdGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjQ1O1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHdpbmRsaWZ0ZXIpO1xuICAgICAgICAgICAgd2luZGxpZnRlci53aW5kb3dYID0gMC41O1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNyxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI3LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlYW06IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuICAgICAgICAgICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZVR3bztcbiAgICAgICAgICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcbiAgICAgICAgICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgICAgICAgICBwcmVUZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcik7XG5cbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn4gQW5pbWF0aW9uIFN0YXJ0IExhYmVscyB+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgICAgICAgICB0aW1lbGluZS5hZGRMYWJlbCgnRHVzdHknLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdCbGFkZScsIGFuaW1hdGlvblRpbWUgKiAwLjE1KTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdEaXBwZXInLCBhbmltYXRpb25UaW1lICogMC4zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZExhYmVsKCdDYWJiaWUnLCBhbmltYXRpb25UaW1lICogMC40NSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGRMYWJlbCgnV2luZGxpZnRlcicsIGFuaW1hdGlvblRpbWUgKiAwLjYpO1xuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjUyLFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ0R1c3R5Jyk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjg3LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNDYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ0JsYWRlJyk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNixcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjIyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksICdEaXBwZXInKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjg1LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAnQ2FiYmllJyk7XG5cblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4wOCxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgJ1dpbmRsaWZ0ZXInKTtcblxuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5mdW5jdGlvbiBwcmVUZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcikge1xuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEdXN0eSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgIGR1c3R5LndpbmRvd1ggPSAwLjM7XG4gICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzI7XG4gICAgZHVzdHkucm90YXRpb24gPSAwLjQ4O1xuICAgIGR1c3R5LnNldFN0YXRpYygpO1xuICAgIGR1c3R5LnB1c2hUb1RvcCgpO1xuXG5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oYmxhZGUpO1xuICAgIGJsYWRlLndpbmRvd1ggPSAwLjY7XG4gICAgYmxhZGUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzQ7XG4gICAgYmxhZGUuc2V0U3RhdGljKCk7XG5cblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgIGRpcHBlci53aW5kb3dYID0gMDtcbiAgICBkaXBwZXIucm90YXRpb24gPSAwLjA4O1xuICAgIGRpcHBlci5zZXRTdGF0aWMoKTtcblxuXG4gICAgd2luZGxpZnRlci53aW5kb3dYID0gMSAtIGdldE9mZnNjcmVlblgod2luZGxpZnRlcik7XG4gICAgd2luZGxpZnRlci53aW5kb3dZID0gMC4xO1xuICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMTQ7XG4gICAgd2luZGxpZnRlci5zZXRTdGF0aWMoKTtcblxuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgY2FiYmllLndpbmRvd1ggPSAwLjY7XG4gICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjIyO1xuICAgIGNhYmJpZS5zZXRTdGF0aWMoKTtcbn1cblxuZnVuY3Rpb24gYWRkTGV0dGVyQmcoc2NlbmUpIHtcbiAgICBsZXR0ZXJCZyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9yZXNwb25zZV9sZXR0ZXJfYmcuanBnJyk7XG5cbiAgICBsZXR0ZXJCZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgLjUpO1xuICAgIGxldHRlckJnLndpbmRvd1ggPSAwLjU7XG4gICAgbGV0dGVyQmcud2luZG93WSA9IDAuNTtcblxuICAgIGxldHRlckJnLnZpc2libGUgPSBmYWxzZTtcblxuXG5cbiAgICBzY2VuZS5hZGRDaGlsZChsZXR0ZXJCZyk7XG59XG5cbmZ1bmN0aW9uIHB1c2hUb1RvcChzcHJpdGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gc3ByaXRlLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgc3ByaXRlLnBhcmVudC5hZGRDaGlsZEF0KHNwcml0ZSwgbGVuZ3RoLTEpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgICAgIHB1c2hUb1RvcChsZXR0ZXJCZyk7XG4gICAgICAgIGxldHRlckJnLnZpc2libGUgPSB0cnVlO1xuXG4gICAgICAgIGFuaW1hdGVJbltjaGFyYWN0ZXJdKCk7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBhZGRMZXR0ZXJCZyhzY2VuZSk7XG4gICAgfVxufTsiLCJcblxuXG52YXIgUXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc3Rpb24nKTtcblxuXG52YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBRdWVzdGlvblxufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db2xsZWN0aW9uOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUXVlc3Rpb25Db2xsZWN0aW9uJyk7XG5cbiAgICB2YXIgY2hhcmFjdGVyU2VsZWN0ID0gcmVxdWlyZSgnLi4vZGF0YS9jaGFyYWN0ZXJTZWxlY3QuanNvbicpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uJyk7XG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9wZXJzb25hbGl0eVF1ZXN0aW9ucy5qc29uJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoXy5zaHVmZmxlKHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhLnF1ZXN0aW9ucyksIG51bSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXRFbXB0eUNhbm5lZFF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UobnVtKSwgZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjbGFzczogY2FubmVkUXVlc3Rpb25EYXRhLmNsYXNzLFxuICAgICAgICAgICAgICAgIGNvcHk6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jb3B5LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdjYW5uZWQtcXVlc3Rpb24nICsgaSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSBuZXcgUXVlc3Rpb25Db2xsZWN0aW9uKCk7XG5cblxuICAgIC8vc2h1ZmZsZSBxdWVzdGlvbnMgYW5kIHBpY2sgM1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9ucyA9IGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKDMpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbnMgPSBnZXRFbXB0eUNhbm5lZFF1ZXN0aW9ucygzKTtcblxuXG4gICAgYWxsUXVlc3Rpb25zLmFkZChjaGFyYWN0ZXJTZWxlY3QpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQocGVyc29uYWxpdHlRdWVzdGlvbnMpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2FubmVkUXVlc3Rpb25zKTtcblxuXG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJVbnVzZWQob3B0aW9ucywgdXNlZCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlZC5pbmRleE9mKG9wdGlvbi52YWx1ZSkgPT09IC0xO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhbGxRdWVzdGlvbnMuZ2V0VW51c2VkQ2FubmVkT3B0aW9ucyA9IGZ1bmN0aW9uKG51bSwgdXNlZCkge1xuICAgICAgICB2YXIgcG9zc2libGVPcHRpb25zID0gXy5zaHVmZmxlKGZpbHRlclVudXNlZChjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucywgdXNlZCkpO1xuXG4gICAgICAgIHJldHVybiBfLmZpcnN0KHBvc3NpYmxlT3B0aW9ucywgbnVtKTtcbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbFF1ZXN0aW9ucztcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidG90YWxTaXplXCI6IDI2NzE1Njc5LFxuXHRcImFzc2V0c1wiOiB7XG5cdFx0XCJhc3NldHMvaW1nL2JsYWNrb3V0LnBuZ1wiOiAyNTA2LFxuXHRcdFwiYXNzZXRzL2ltZy9idXR0b24ucG5nXCI6IDc1NDQsXG5cdFx0XCJhc3NldHMvaW1nL2RyaXAucG5nXCI6IDMyODgsXG5cdFx0XCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiOiAyNDIwLFxuXHRcdFwiYXNzZXRzL2ltZy9mb290ZXIucG5nXCI6IDQzMzk4LFxuXHRcdFwiYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZ1wiOiAxMTU3MTQsXG5cdFx0XCJhc3NldHMvaW1nL2hlYWRlci5wbmdcIjogOTExMzgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Jhc2ViYWxsLnBuZ1wiOiAxNDI5Nyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYmxhZGVfcmFuZ2VyLnBuZ1wiOiAxNTMwOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYmx1ZS5wbmdcIjogMTA3NDksXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Jyb2Njb2xpLnBuZ1wiOiAxNDA0NSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvY2FiYmllLnBuZ1wiOiAxODk4MSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvY2FubmVkLWJ0bi5wbmdcIjogMTI0NzYsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2RpcHBlci5wbmdcIjogMTg5MjMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2R1c3R5LnBuZ1wiOiAyMDMyOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZm9vdGJhbGwucG5nXCI6IDEzNjI5LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9mcmllcy5wbmdcIjogMTE5MjgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2dyZWVuLnBuZ1wiOiAxMDc0Nyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvaG9ja2V5LnBuZ1wiOiAxMzA1Mixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvaWNlY3JlYW0ucG5nXCI6IDEyNDQyLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9udWdnZXRzLnBuZ1wiOiAxMzM0Nyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvb3JhbmdlLnBuZ1wiOiAxMDcyNCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcGJqLnBuZ1wiOiAxMjM4NCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcGl6emEucG5nXCI6IDEzNzY1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wcmludGVyLnBuZ1wiOiA0MTMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3B1cnBsZS5wbmdcIjogMTA3ODQsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3JhY2luZy5wbmdcIjogMTE0OTEsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3JlZC5wbmdcIjogMTA2NTMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3NlbmQtYnRuLnBuZ1wiOiA5OTIxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zb2NjZXIucG5nXCI6IDE1MTg5LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zd2ltX2RpdmUucG5nXCI6IDExNDI4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy90aGVfdGVhbS5wbmdcIjogMTcwOTYsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3ZvbHVtZS5wbmdcIjogMTYzLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy93aW5kbGlmdGVyLnBuZ1wiOiAxNjgyMixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMveWVsbG93LnBuZ1wiOiAxMDY3Mixcblx0XHRcImFzc2V0cy9pbWcvaW4tdGhlYXRlcnMucG5nXCI6IDI5NjcsXG5cdFx0XCJhc3NldHMvaW1nL2luLXRoZWF0cmVzM2QucG5nXCI6IDUxOTAsXG5cdFx0XCJhc3NldHMvaW1nL2ludHJvLWJ0bS5wbmdcIjogMTkwODEzLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby10b3AucG5nXCI6IDE4OTIxNixcblx0XHRcImFzc2V0cy9pbWcvbG9nby5wbmdcIjogMTI5MTI4LFxuXHRcdFwiYXNzZXRzL2ltZy9taWRncm91bmQucG5nXCI6IDY0Njg5LFxuXHRcdFwiYXNzZXRzL2ltZy9wZy5wbmdcIjogMTU1Mixcblx0XHRcImFzc2V0cy9pbWcvcHJlbG9hZGVyX2xvZ28ucG5nXCI6IDEzMDM4OSxcblx0XHRcImFzc2V0cy9pbWcvcHJpbnQucG5nXCI6IDI3NTEsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2JsYWRlLmpwZ1wiOiAxOTAyODUsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2NhYmJpZS5qcGdcIjogMjcwODM4LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kaXBwZXIuanBnXCI6IDQ0MzkxOSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfZHVzdHkuanBnXCI6IDE5NzY0Mixcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfdGVhbS5qcGdcIjogNDI2OTk5LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ193aW5kbGlmdGVyLmpwZ1wiOiAyMjE5NDksXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2xldHRlcl9iZy5qcGdcIjogNzU3MTMsXG5cdFx0XCJhc3NldHMvaW1nL3NlbmRNb3JlLnBuZ1wiOiAxMjMzMSxcblx0XHRcImFzc2V0cy9pbWcvc2l0ZV9iZy5qcGdcIjogMTg0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDAxLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMi5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDMucG5nXCI6IDU0NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA0LnBuZ1wiOiA5OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwNS5wbmdcIjogMTM5MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA2LnBuZ1wiOiA5MDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwNy5wbmdcIjogMTE1Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA4LnBuZ1wiOiAxNDEzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDkucG5nXCI6IDE1NjEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMC5wbmdcIjogMTYzOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDExLnBuZ1wiOiAxODc3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTIucG5nXCI6IDE5NTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMy5wbmdcIjogMjA0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE0LnBuZ1wiOiAyMDczLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTUucG5nXCI6IDIwODgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxNi5wbmdcIjogMjI1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE3LnBuZ1wiOiAyNDQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTgucG5nXCI6IDI1MzQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxOS5wbmdcIjogMjc0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIwLnBuZ1wiOiAyODk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjEucG5nXCI6IDMwNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyMi5wbmdcIjogMzE2MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIzLnBuZ1wiOiAzMzI1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjQucG5nXCI6IDM0ODgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNS5wbmdcIjogMzYyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI2LnBuZ1wiOiAzNzYzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjcucG5nXCI6IDM4NDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyOC5wbmdcIjogMzk0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI5LnBuZ1wiOiA0MDI4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzAucG5nXCI6IDQwNzksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMS5wbmdcIjogNDA4NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDMyLnBuZ1wiOiA0MTE0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzMucG5nXCI6IDQxNzYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNC5wbmdcIjogNDIwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM1LnBuZ1wiOiA0MTA3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzYucG5nXCI6IDQxNTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNy5wbmdcIjogNDIzMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM4LnBuZ1wiOiA0Mjk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzkucG5nXCI6IDQzNjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0MC5wbmdcIjogNDQ0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQxLnBuZ1wiOiA0NTIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDIucG5nXCI6IDQ1NDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0My5wbmdcIjogNDU5NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ0LnBuZ1wiOiA0NjY3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDUucG5nXCI6IDQ3MTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0Ni5wbmdcIjogNDc3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ3LnBuZ1wiOiA0ODcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDgucG5nXCI6IDQ5NDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0OS5wbmdcIjogNDk3MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUwLnBuZ1wiOiA1MDk3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTEucG5nXCI6IDUxMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1Mi5wbmdcIjogNTIxMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUzLnBuZ1wiOiA1MzAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTQucG5nXCI6IDgxNDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1NS5wbmdcIjogMTQ1NDMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1Ni5wbmdcIjogMjEzMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1Ny5wbmdcIjogMzEwNTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1OC5wbmdcIjogMzY3MjAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1OS5wbmdcIjogNDE3NDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2MC5wbmdcIjogNDMwNzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2MS5wbmdcIjogMzgxMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2Mi5wbmdcIjogMzEyNTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2My5wbmdcIjogMzM4NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2NC5wbmdcIjogMzIzMjgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2NS5wbmdcIjogMzE1ODIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2Ni5wbmdcIjogMzE1NDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2Ny5wbmdcIjogMzE3MjIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2OC5wbmdcIjogMzE3MzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA2OS5wbmdcIjogMzE3NzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3MC5wbmdcIjogMzEzOTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3MS5wbmdcIjogMzEzMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3Mi5wbmdcIjogMzE0MTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3My5wbmdcIjogMzE1ODYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3NC5wbmdcIjogMzEzNjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3NS5wbmdcIjogMzE1NTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3Ni5wbmdcIjogMzE2NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3Ny5wbmdcIjogMzE2MDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3OC5wbmdcIjogMjczNzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA3OS5wbmdcIjogMzgxMzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4MC5wbmdcIjogNDk1MTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4MS5wbmdcIjogNTU1NTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4Mi5wbmdcIjogNTU0MjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4My5wbmdcIjogNjM0NDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4NC5wbmdcIjogNTU4MDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4NS5wbmdcIjogMzIxMDEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4Ni5wbmdcIjogMzUxMTAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4Ny5wbmdcIjogMjQ0NzIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4OC5wbmdcIjogMjQ3MzUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA4OS5wbmdcIjogMjcyMzIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5MC5wbmdcIjogMzE5MDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5MS5wbmdcIjogMzc4ODcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5Mi5wbmdcIjogNDE1ODksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5My5wbmdcIjogNDQ5NTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5NC5wbmdcIjogNDY4NzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5NS5wbmdcIjogMzU5NzgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5Ni5wbmdcIjogMjgzNjQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5Ny5wbmdcIjogMjQ5MzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5OC5wbmdcIjogMjMwOTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA5OS5wbmdcIjogMjAzMzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMC5wbmdcIjogMjA5NjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMS5wbmdcIjogMTY4NDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMi5wbmdcIjogMTgzMTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwMy5wbmdcIjogMTk2NzYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNC5wbmdcIjogMjIyODgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNS5wbmdcIjogMjQ3NjYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNi5wbmdcIjogMjUzMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwNy5wbmdcIjogMjY4NzUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwOC5wbmdcIjogMjYxNDgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEwOS5wbmdcIjogMjkzMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMC5wbmdcIjogMzM4NzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMS5wbmdcIjogMzY5MTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMi5wbmdcIjogNDA5MjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExMy5wbmdcIjogNDQ0MDIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNC5wbmdcIjogNDYxMjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNS5wbmdcIjogNDM5NDgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNi5wbmdcIjogNDc0ODUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExNy5wbmdcIjogNjkxMzQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExOC5wbmdcIjogMjY2NjAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDExOS5wbmdcIjogMzA1NDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEyMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAxMjEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiAyMzEwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAxLnBuZ1wiOiAyMzg3Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAyLnBuZ1wiOiAyMzM4OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiAyMzM3NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA0LnBuZ1wiOiAyMzYzMSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA1LnBuZ1wiOiAyMzQxNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiAyMzI0Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA3LnBuZ1wiOiAyMzY1Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA4LnBuZ1wiOiAyMzUzMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiAyMzExMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDEwLnBuZ1wiOiAyNDIyOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMDExLnBuZ1wiOiAyMzA5OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMC5wbmdcIjogNTI5ODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDEucG5nXCI6IDU1MzU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAyLnBuZ1wiOiA1NDQxNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMy5wbmdcIjogNTU1NTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDQucG5nXCI6IDUyOTg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA1LnBuZ1wiOiA1NTM1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNi5wbmdcIjogNTQ0MTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDcucG5nXCI6IDU1NTU5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA4LnBuZ1wiOiA1Mjk4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwOS5wbmdcIjogNTUzNTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTAucG5nXCI6IDU0NDE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDExLnBuZ1wiOiA1NTU1OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDAucG5nXCI6IDI5NDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwMS5wbmdcIjogMzAxMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDAyLnBuZ1wiOiAzMDA5MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDMucG5nXCI6IDMwMzYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwNC5wbmdcIjogMjk0MDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDA1LnBuZ1wiOiAzMDEzMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDYucG5nXCI6IDMwMDkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAwNy5wbmdcIjogMzAzNjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDA4LnBuZ1wiOiAyOTQwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwMDkucG5nXCI6IDMwMTMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUyL0NhYmJpZV8yXzAwMDAxMC5wbmdcIjogMzAwOTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZTIvQ2FiYmllXzJfMDAwMDExLnBuZ1wiOiAzMDM2Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMC5wbmdcIjogNDI4NjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDEucG5nXCI6IDQyMTAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAyLnBuZ1wiOiA0Mzg4OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMy5wbmdcIjogNDQ4NTgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDQucG5nXCI6IDQyODYxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA1LnBuZ1wiOiA0MjEwMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNi5wbmdcIjogNDM4ODksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDcucG5nXCI6IDQ0ODU4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA4LnBuZ1wiOiA0Mjg2MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwOS5wbmdcIjogNDIxMDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTAucG5nXCI6IDQzODg5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDExLnBuZ1wiOiA0NDg1OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDAucG5nXCI6IDQyMjA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMS5wbmdcIjogNDE4ODcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDAyLnBuZ1wiOiA0MTg0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDMucG5nXCI6IDQyMDg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNC5wbmdcIjogNDIyMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA1LnBuZ1wiOiA0MTg4Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDYucG5nXCI6IDQxODQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNy5wbmdcIjogNDIwODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA4LnBuZ1wiOiA0MjIwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDkucG5nXCI6IDQxODg3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAxMC5wbmdcIjogNDE4NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDExLnBuZ1wiOiA0MjA4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDAucG5nXCI6IDM3MjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMS5wbmdcIjogMzcyMzcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDAyLnBuZ1wiOiAzNzUwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDMucG5nXCI6IDM3Mjk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNC5wbmdcIjogMzcyNDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA1LnBuZ1wiOiAzNzIzNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDYucG5nXCI6IDM3NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNy5wbmdcIjogMzcyOTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA4LnBuZ1wiOiAzNzI0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDkucG5nXCI6IDM3MjM3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAxMC5wbmdcIjogMzc1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDExLnBuZ1wiOiAzNzI5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAwLnBuZ1wiOiAzNzc0Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAxLnBuZ1wiOiAzODE4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAyLnBuZ1wiOiAzODI1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDAzLnBuZ1wiOiAzODEzOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA0LnBuZ1wiOiAzNzg3Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA1LnBuZ1wiOiAzNzY5MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA2LnBuZ1wiOiAzNzY1MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA3LnBuZ1wiOiAzNzU3MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA4LnBuZ1wiOiAzODEzNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDA5LnBuZ1wiOiAzNzU1NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDEwLnBuZ1wiOiAzODAyOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDExLnBuZ1wiOiAzNzg2NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDEyLnBuZ1wiOiAzNzYzNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDEzLnBuZ1wiOiAzNzUzNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE0LnBuZ1wiOiAzODg3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE1LnBuZ1wiOiAzNzc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE2LnBuZ1wiOiAzODU3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE3LnBuZ1wiOiAzODA0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE4LnBuZ1wiOiAzODQ1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDE5LnBuZ1wiOiAzODU3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIwLnBuZ1wiOiAzODIyNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIxLnBuZ1wiOiAzODExNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIyLnBuZ1wiOiAzNzU5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMDIzLnBuZ1wiOiAzODI2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDAucG5nXCI6IDQ0ODYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwMS5wbmdcIjogNTc3NDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDAyLnBuZ1wiOiA2MTMwOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDMucG5nXCI6IDY2MTUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwNC5wbmdcIjogNzEyMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA1LnBuZ1wiOiA4MDIwOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDYucG5nXCI6IDg5NjI4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwNy5wbmdcIjogMTQxMjcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwOC5wbmdcIjogMTQyMjcyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwOS5wbmdcIjogMTUxMTg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMC5wbmdcIjogMTU1NjYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMS5wbmdcIjogMTQzOTExLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMi5wbmdcIjogMTUyOTIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxMy5wbmdcIjogMTUzODAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNC5wbmdcIjogMTU2Mzg4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNS5wbmdcIjogMTYxMTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNi5wbmdcIjogMTYzMDEzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxNy5wbmdcIjogMTY4NDA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxOC5wbmdcIjogMTcxOTExLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAxOS5wbmdcIjogMTc2NTYyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMC5wbmdcIjogMTc2Mjk1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMS5wbmdcIjogMTc3NTc0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMi5wbmdcIjogMTc4ODkyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyMy5wbmdcIjogMTc4ODI4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNC5wbmdcIjogMTgxMzMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNS5wbmdcIjogMTgyNTAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNi5wbmdcIjogMTgzNjk2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyNy5wbmdcIjogMTgzOTAwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyOC5wbmdcIjogMTg0MjAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAyOS5wbmdcIjogMTg0OTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMC5wbmdcIjogMTg2NTE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMS5wbmdcIjogMTg3NTg5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMi5wbmdcIjogMTg3NTA5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzMy5wbmdcIjogMTg4NjA0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNC5wbmdcIjogMTg4NjcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNS5wbmdcIjogMTg5MzMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNi5wbmdcIjogMTg5OTk2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzNy5wbmdcIjogMTkwNjMzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzOC5wbmdcIjogMTkwNjQxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAzOS5wbmdcIjogMTkxNjY1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0MC5wbmdcIjogMTkyOTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0MS5wbmdcIjogMTk1NDU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0Mi5wbmdcIjogMTk4MDY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0My5wbmdcIjogMjAwNDc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0NC5wbmdcIjogMjAyMjUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0NS5wbmdcIjogMjAxNzc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0Ni5wbmdcIjogMjAyOTI4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0Ny5wbmdcIjogMjAyODUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0OC5wbmdcIjogMTk3ODc2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA0OS5wbmdcIjogMTk2NTEzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1MC5wbmdcIjogMTk1MzYxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1MS5wbmdcIjogMTk1OTU2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1Mi5wbmdcIjogMTkyMzIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1My5wbmdcIjogMTkwNjc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1NC5wbmdcIjogMTgyMjkyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1NS5wbmdcIjogMTczOTQ5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1Ni5wbmdcIjogMTczMzc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1Ny5wbmdcIjogMTY3MDgwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1OC5wbmdcIjogMTU5NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA1OS5wbmdcIjogMTU0NjQ5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2MC5wbmdcIjogMTQ5NTU0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2MS5wbmdcIjogMTQ0NzkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2Mi5wbmdcIjogMTQ1NjE5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2My5wbmdcIjogMTQ3NDUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2NC5wbmdcIjogMTM5Mzc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2NS5wbmdcIjogMTI5MDE2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2Ni5wbmdcIjogMTIyNjY1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2Ny5wbmdcIjogMTE1OTk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2OC5wbmdcIjogMTA0MzM1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA2OS5wbmdcIjogOTAwNDEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDcwLnBuZ1wiOiA2Nzc0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwNzEucG5nXCI6IDQ5OTEwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiAzODE2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMS5wbmdcIjogMzgzNzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDM5MTIxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiAzODY1OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNC5wbmdcIjogMzc5NjcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDM4MTIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiAzODIzOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNy5wbmdcIjogMzgxODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDM4NDAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiAzODE2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMC5wbmdcIjogMzgzMDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDM4NTMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAwLnBuZ1wiOiAyMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDEucG5nXCI6IDIxNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwMi5wbmdcIjogMjMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAzLnBuZ1wiOiAyNTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDQucG5nXCI6IDM3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNS5wbmdcIjogNDE3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA2LnBuZ1wiOiA0NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDcucG5nXCI6IDU1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwOC5wbmdcIjogNjUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA5LnBuZ1wiOiAxMDA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEwLnBuZ1wiOiAxODYwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDExLnBuZ1wiOiAyNDMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEyLnBuZ1wiOiAzNDE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEzLnBuZ1wiOiA0NTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE0LnBuZ1wiOiA2MDg4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE1LnBuZ1wiOiA3MDg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE2LnBuZ1wiOiA3OTg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE3LnBuZ1wiOiA4Mjk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE4LnBuZ1wiOiA5NzQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE5LnBuZ1wiOiA5OTUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIwLnBuZ1wiOiA4ODAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIxLnBuZ1wiOiA5NTA1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIyLnBuZ1wiOiA5NTYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIzLnBuZ1wiOiA5NjA1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI0LnBuZ1wiOiA5NzI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI1LnBuZ1wiOiA5ODA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI2LnBuZ1wiOiA5NDQ3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI3LnBuZ1wiOiA5NDMwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI4LnBuZ1wiOiA5NTQxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI5LnBuZ1wiOiA4NzYxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMwLnBuZ1wiOiA4OTU2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMxLnBuZ1wiOiA4NTg0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMyLnBuZ1wiOiA4MzM0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMzLnBuZ1wiOiA4MTEyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM0LnBuZ1wiOiA3OTczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM1LnBuZ1wiOiA3NzY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM2LnBuZ1wiOiA3NDM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM3LnBuZ1wiOiA3Mjg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM4LnBuZ1wiOiA3MjUwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM5LnBuZ1wiOiA1MzQxOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MC5wbmdcIjogNjk1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MS5wbmdcIjogNjY2Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Mi5wbmdcIjogNjc5Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0My5wbmdcIjogNjUyNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NC5wbmdcIjogNjQ0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NS5wbmdcIjogNjMwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ni5wbmdcIjogNjQ5Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ny5wbmdcIjogNjMxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OC5wbmdcIjogNjQ0Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OS5wbmdcIjogNjc0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MC5wbmdcIjogNjc1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MS5wbmdcIjogNjgwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Mi5wbmdcIjogNjU0MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1My5wbmdcIjogNjU5Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NC5wbmdcIjogNjg2NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NS5wbmdcIjogNzExOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ni5wbmdcIjogNzM4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ny5wbmdcIjogNzU1OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OC5wbmdcIjogNzY3Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OS5wbmdcIjogNzk4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MC5wbmdcIjogNzkzMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MS5wbmdcIjogODQ0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Mi5wbmdcIjogODQ1Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2My5wbmdcIjogODcwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NC5wbmdcIjogOTE4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NS5wbmdcIjogODkyNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ni5wbmdcIjogNjQ4OTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjcucG5nXCI6IDk1NTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjgucG5nXCI6IDEwMDcyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY5LnBuZ1wiOiAxMDc4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MC5wbmdcIjogMTA1ODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzEucG5nXCI6IDEwOTUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcyLnBuZ1wiOiAxMTE3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3My5wbmdcIjogMTExMDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzQucG5nXCI6IDExNTU1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc1LnBuZ1wiOiAxMjA4Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ni5wbmdcIjogMTIwMzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzcucG5nXCI6IDEyMzc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc4LnBuZ1wiOiAxMjkwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3OS5wbmdcIjogMTMzMDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODAucG5nXCI6IDEzMzE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgxLnBuZ1wiOiAxMzczMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Mi5wbmdcIjogMTQwOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODMucG5nXCI6IDE0MTk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg0LnBuZ1wiOiAxNDcwMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4NS5wbmdcIjogMTUxMjksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODYucG5nXCI6IDE0OTIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg3LnBuZ1wiOiAxNTczNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OC5wbmdcIjogMTYyNzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODkucG5nXCI6IDE2Mjc0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkwLnBuZ1wiOiAxNjc5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5MS5wbmdcIjogMTc0MDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTIucG5nXCI6IDE3MDEzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkzLnBuZ1wiOiAxNzk3OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NC5wbmdcIjogMTg0NzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTUucG5nXCI6IDE4OTY1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk2LnBuZ1wiOiAxOTQwMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Ny5wbmdcIjogMjAwMDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTgucG5nXCI6IDE5NzM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk5LnBuZ1wiOiAyMDQxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMC5wbmdcIjogMjE0ODEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDEucG5nXCI6IDIyOTg0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAyLnBuZ1wiOiAyMzAzNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMy5wbmdcIjogMjM3MTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDQucG5nXCI6IDI1MDQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA1LnBuZ1wiOiAyNTM4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNi5wbmdcIjogMjcxNDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDcucG5nXCI6IDI3NTE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA4LnBuZ1wiOiAyOTIzMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOS5wbmdcIjogMjg4NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTAucG5nXCI6IDMwMTA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTExLnBuZ1wiOiAzMDAyOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMi5wbmdcIjogMzExMjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTMucG5nXCI6IDMzMDg2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE0LnBuZ1wiOiAzMzUyOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNS5wbmdcIjogMzU3NzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTYucG5nXCI6IDM4MjE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE3LnBuZ1wiOiAzOTI4Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOC5wbmdcIjogNDEwNDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTkucG5nXCI6IDQyNDYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIwLnBuZ1wiOiA0NDM1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMS5wbmdcIjogNDQyNzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjIucG5nXCI6IDQ2ODgwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIzLnBuZ1wiOiA1MTYzMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNC5wbmdcIjogNTM5MjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjUucG5nXCI6IDU3MjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI2LnBuZ1wiOiA1OTQ4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNy5wbmdcIjogNjA4MzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjgucG5nXCI6IDYyNzUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI5LnBuZ1wiOiA2ODE1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMC5wbmdcIjogNzE4MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzEucG5nXCI6IDc0NTcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMyLnBuZ1wiOiA4MjcyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMy5wbmdcIjogODcxNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzQucG5nXCI6IDkyNjczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM1LnBuZ1wiOiA5OTMxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNi5wbmdcIjogMTA4NDI0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM3LnBuZ1wiOiAxMTMzOTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzgucG5nXCI6IDExNzA5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOS5wbmdcIjogMTI4MTU5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQwLnBuZ1wiOiAxMzQwNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDEucG5nXCI6IDE0NDkwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Mi5wbmdcIjogMTU0ODMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQzLnBuZ1wiOiAxNjI0MDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDQucG5nXCI6IDE1Nzc0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NS5wbmdcIjogMTY2NTM4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ2LnBuZ1wiOiAxNTc4NjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDcucG5nXCI6IDE1NDIyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0OC5wbmdcIjogMTU1ODYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ5LnBuZ1wiOiAxNDQ0MDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTAucG5nXCI6IDEzODI2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MS5wbmdcIjogMTMzNjE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUyLnBuZ1wiOiAxMjI4MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTMucG5nXCI6IDExNzA3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1NC5wbmdcIjogMTIwMzAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU1LnBuZ1wiOiAxMDYwOTNcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcIm1hbmlmZXN0XCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkJsYWRlXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9ibGFkZS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiQ2FiYmllXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9jYWJiaWUub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkRpcHBlclwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vZGlwcGVyLm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJEdXN0eVwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vZHVzdHkub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIlRlYW1cIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL3RlYW0ub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL3dpbmRsaWZ0ZXIub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkludHJvVmlkZW9cIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL2NvbWluZ2F0eW91Lm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJXaXBlc2NyZWVuXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby93aXBlc2NyZWVuLm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJMb2dvZHJvcFwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vbG9nb2Ryb3Aub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIlNpdGVvcGVuc1wiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vc2l0ZV9vcGVucy5vZ2dcIlxuICAgICAgICB9XG5cbiAgICBdLFxuICAgIFwiY2hhcmFjdGVyQXVkaW9JZHNcIjoge1xuICAgICAgICBcImR1c3R5XCI6IFwiRHVzdHlcIixcbiAgICAgICAgXCJibGFkZXJhbmdlclwiOiBcIkJsYWRlXCIsXG4gICAgICAgIFwiY2FiYmllXCI6IFwiQ2FiYmllXCIsXG4gICAgICAgIFwiZGlwcGVyXCI6IFwiRGlwcGVyXCIsXG4gICAgICAgIFwid2luZGxpZnRlclwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgXCJ0ZWFtXCI6IFwiVGVhbVwiXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImNsYXNzXCI6IFwiY2FubmVkXCIsXG4gICAgXCJjb3B5XCI6IFwiTm93IHRoYXQgd2Uga25vdyBtb3JlIGFib3V0IHlvdSwgaXQncyB5b3VyIHR1cm4gdG8gYXNrICVjaGFyYWN0ZXIlIHNvbWUgcXVlc3Rpb25zXCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGpvYiBhdCBQaXN0b24gUGVhaz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJqb2JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG8geW91IGZpZ2h0IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb3Jlc3RmaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhhdmUgeW91IGFsd2F5cyBiZWVuIGEgZmlyZWZpZ2h0ZXI/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmlyZWZpZ2h0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaG8gaXMgeW91ciBiZXN0IGZyaWVuZD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJiZXN0ZnJpZW5kXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hlcmUgaXMgeW91ciBmYXZvcml0ZSBwbGFjZSB0byBmbHk/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGVwbGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBmb29kP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZhdm9yaXRlLWZvb2RcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgY29sb3I/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGUtY29sb3JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgc3BvcnQ/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGUtc3BvcnRcIlxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcIm5hbWVcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjbGFzc1wiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNvcHlcIjogXCJXaG8gZG8geW91IHdhbnQgdG8gd3JpdGUgdG8/XCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRHVzdHlcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkdXN0eVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsYWRlIFJhbmdlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsYWRlcmFuZ2VyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2FiYmllXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiY2FiYmllXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRGlwcGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZGlwcGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2luZGxpZnRlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIndpbmRsaWZ0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJUaGUgVGVhbVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInRlYW1cIlxuICAgICAgICB9XG4gICAgXSxcbiAgICBcInJlcXVpcmVkXCI6IHRydWVcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0J3MgeW91ciBmYXZvcml0ZSBjb2xvcj9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInJlZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsdWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsdWVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJPcmFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm9yYW5nZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkdyZWVuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJncmVlblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlllbGxvd1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwieWVsbG93XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHVycGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwdXJwbGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtZm9vZFwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLWZvb2RcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBmb29kP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlBpenphXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwaXp6YVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkljZSBDcmVhbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaWNlY3JlYW1cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCcm9jY29saVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYnJvY2NvbGlcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJGcmVuY2ggRnJpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZyZW5jaGZyaWVzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2hpY2tlbiBOdWdnZXRzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJjaGlja2VubnVnZ2V0c1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlBCJkpcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInBialwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1zcG9ydFwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLXNwb3J0XCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgc3BvcnQ/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRm9vdGJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZvb3RiYWxsXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmFzZWJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJhc2ViYWxsXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG9ja2V5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJob2NrZXlcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTd2ltbWluZy9EaXZpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInN3aW1taW5nXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU29jY2VyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzb2NjZXJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSYWNpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInJhY2luZ1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImR1c3R5XCIgOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIaSB0aGVyZSFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkkgd2FzIHJlYWxseSBleGNpdGVkIHRvIHJlY2VpdmUgeW91ciBhaXJtYWlsIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiSSd2ZSBnb3R0YSBnZXQgYmFjayB0byBmaWdodGluZyBmaXJlcyBoZXJlLCBidXQgeW91IHN0YXkgc3Ryb25nIVwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIk92ZXIgYW5kIG91dFwiLFxuICAgICAgICBcImpvYlwiOiBcIkknbSBhIFNFQVQsIG9yIGEgU2luZ2xlLUVuZ2luZSBBaXIgVGFua2VyLCB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdC5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgY2FuIHNjb29wIHdhdGVyIGZyb20gbGFrZXMgYW5kIGRpdmUgaW50byB0aGUgZm9yZXN0IHRvIGRyb3AgdGhlIHdhdGVyIG9uIHdpbGRmaXJlcy4gU3BlZWQgY291bnRzIHdoZW4gYW4gYWlyIHJlc2N1ZSBpcyB1bmRlciB3YXksIHNvIEknbSBhbHdheXMgcmVhZHkgdG8gZmx5IGludG8gZGFuZ2VyIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiQmVmb3JlIGpvaW5pbmcgdGhlIEFpciBBdHRhY2sgVGVhbSwgSSB3YXMgYSB3b3JsZC1mYW1vdXMgYWlyIHJhY2VyIOKAkyBJIGV2ZW4gcmFjZWQgYXJvdW5kIHRoZSB3b3JsZCEgIE5vdyBJIHJhY2UgdG8gcHV0IG91dCBmaXJlcy5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgd2Fzbid0IGVhc3kgYmVjb21pbmcgYSBjaGFtcGlvbiByYWNlciBvciBhIGZpcmVmaWdodGVyIGJ1dCBJJ3ZlIGhhZCBhbiBhbWF6aW5nIHRlYW0gb2YgZnJpZW5kcyB3aXRoIG1lIGV2ZXJ5IHN0ZXAgb2YgdGhlIHdheSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBoYXZlIGJlZW4gZmx5aW5nIGZvciBhcyBsb25nIGFzIEkgY2FuIHJlbWVtYmVyIGJ1dCBteSBmYXZvcml0ZSBwbGFjZSB0byBmbHkgaXMgYWJvdmUgbXkgaG9tZXRvd24sIFByb3B3YXNoIEp1bmN0aW9uLiBJIGRvIHNvbWUgZmFuY3kgZmx5aW5nIHRoZXJlIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCIldGVtcGxhdGUlIHNvdW5kcyBkZWxpY2lvdXMhIEkgbWVhbiwgYW55dGhpbmcncyBiZXR0ZXIgdG8gZWF0IHRoYW4gVml0YW1pbmFtdWxjaC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kLXBsdXJhbFwiOiBcIiV0ZW1wbGF0ZSUgc291bmQgZGVsaWNpb3VzISBJIG1lYW4sIGFueXRoaW5nJ3MgYmV0dGVyIHRvIGVhdCB0aGFuIFZpdGFtaW5hbXVsY2guXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBHUkVFTi4gR3JlZW4gbWVhbnMgZ28hIEFuZCBJIGxvdmUgdG8gZ28gZmFzdC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkkgd2FzIGEgY2hhbXBpb24gcmFjZXIgbm90IHRvbyBsb25nIGFnby4gUmFjaW5nIGlzIGRlZmluaXRlbHkgbXkgZmF2b3JpdGUgc3BvcnQuXCJcbiAgICB9LFxuICAgIFwiZGlwcGVyXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhpIHRoZXJlLFwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiSSdtIERpcHBlci4gVGhhdCdzIHdoYXQgZXZlcnlvbmUgY2FsbHMgbWUuIFNvIHlvdSBjYW4gdG9vIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGhhbmtzIGZvciB3cml0aW5nIHRvIG1lICV0ZW1wbGF0ZSUuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiUmVtZW1iZXIsIHRoZSBza3kncyB0aGUgbGltaXQhXCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSBoYXZlIGEgcmVhbGx5IGltcG9ydGFudCBqb2IgZmlnaHRpbmcgd2lsZGZpcmVzLiBJJ20gYW4gYWlyIHRhbmtlciB3aXRoIHRoZSBQaXN0b24gUGVhayBBdHRhY2sgVGVhbS5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgZmlnaHQgZm9yZXN0IGZpcmVzIGluIHNldmVyYWwgd2F5cy4gIFNvbWV0aW1lcyBJIGRyb3AgcmV0YXJkYW50IHRvIGNvbnRhaW4gYSBmaXJlLiAgSSBjYW4gYWxzbyBzY29vcCB3YXRlciBmcm9tIHRoZSBsYWtlIGFuZCBkcm9wIGl0IGRpcmVjdGx5IG9uIHRoZSBmaXJlLiBNeSBib3NzIEJsYWRlIFJhbmdlciBjYWxscyBtZSBhIE11ZC1Ecm9wcGVyIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgdXNlZCB0byBoYXVsIGNhcmdvIHVwIGluIEFuY2hvcmFnZS4gWWVwLCBhIGxvdCBvZiBndXlzIGluIEFsYXNrYS4gSSB3YXMgYmVhdGluZyB0aGVtIG9mZiB3aXRoIGEgc3RpY2shXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kIGlzIGNoYW1waW9uIHJhY2VyIER1c3R5IENyb3Bob3BwZXIuIEknbSBoaXMgYmlnZ2VzdCBmYW4hXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIk15IGZhdm9yaXRlIHBsYWNlIHRvIGZseSBpcyB0aGUgRnVzZWwgTG9kZ2UsIHJpZ2h0IGhlcmUgaW4gUGlzdG9uIFBlYWsuIEl0J3Mgc28gYmVhdXRpZnVsLiBBbmQgd2hlcmUgRHVzdHkgYW5kIEkgaGFkIG91ciBmaXJzdCBkYXRlISBJdCB3YXMgYSBkYXRlLCByaWdodD8gSSdtIHByZXR0eSBzdXJlIGl0IHdhcyBhIGRhdGUuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIldoaWxlICV0ZW1wbGF0ZSUgc291bmRzIHJlYWxseSBnb29kLCB0aGVyZSdzIG5vdGhpbmcgYmV0dGVyIHRoYW4gYSBmcmVzaCBjYW4gb2Ygb2lsIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2QtcGx1cmFsXCI6IFwiV2hpbGUgJXRlbXBsYXRlJSBzb3VuZCByZWFsbHkgZ29vZCwgdGhlcmUncyBub3RoaW5nIGJldHRlciB0aGFuIGEgZnJlc2ggY2FuIG9mIG9pbCFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIldoYXQncyBteSBmYXZvcml0ZSBjb2xvcj8gWUVMTE9XIGxpa2UgdGhlIHN1bnNoaW5lLi4gYW5kIGxpa2UgTUUhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJTd2ltbWluZy9kaXZpbmcgaXMgbXkgZmF2b3JpdGUgc3BvcnQhIEkgbG92ZSBkaXBwaW5nIGluIGFuZCBvdXQgb2YgdGhlIHdhdGVyLlwiXG4gICAgfSxcbiAgICBcIndpbmRsaWZ0ZXJcIjoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGVsbG8gZnJpZW5kIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiSSBlbmpveWVkIHJlYWRpbmcgeW91ciBsZXR0ZXIhXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaGFua3MgZm9yIHlvdXIgbGV0dGVyICV0ZW1wbGF0ZSUuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiWW91ciBuZXcgZnJpZW5kXCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSBhbSBhIEhlYXZ5LUxpZnQgSGVsaWNvcHRlciB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGNyZXcgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0LlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiQmxhZGUgY2FsbHMgbWUgYSBcXFwiTXVkIERyb3BwZXJcXFwiIGJlY2F1c2UgSSBoYXZlIGEgZGV0YWNoYWJsZSB0YW5rIGxvYWRlZCB3aXRoIGZpcmUgcmV0YXJkYW50IHRvIGhlbHAgcHV0IG91dCB0aGUgZmlyZXMuICBNdWQgaXMgc2xhbmcgZm9yIHJldGFyZGFudC4gIEkgY2FuIGhvbGQgbW9yZSByZXRhcmRhbnQgdGhhbiBhbnlvbmUgZWxzZSBvbiB0aGUgdGVhbS5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHVzZWQgdG8gYmUgYSBsdW1iZXJqYWNrLCBsaWZ0aW5nIGRvemVucyBvZiBoZWF2eSBsb2dzIGFuZCBjYXJyeWluZyB0aGVtIHRvIHRoZSBsdW1iZXIgbWlsbC4gIEJ1dCBub3cgSSBhbSBhIGZpcmVmaWdodGVyIGFuZCB0aGlzIGtlZXBzIG1lIHZlcnkgYnVzeS5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSSB3b3VsZCBsaWtlIHRvIGJlIFlPVVIgYmVzdCBmcmllbmQuXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkgbGlrZSB0byBmbHkgbWFueSBwbGFjZXMgYW5kIGJlIG9uZSB3aXRoIHRoZSB3aW5kLiBUaGUgd2luZCBzcGVha3MsIGFuZCBJIGxpc3Rlbi5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBzb3VuZHMgZGVsaWNpb3VzISBIYXZlIHlvdSB0cmllZCBpdCB3aXRoIGEgY2FuIG9mIG9pbD8gVGhhdCdzIG15IGZhdm9yaXRlIGZvb2QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZC1wbHVyYWxcIjogXCIldGVtcGxhdGUlIHNvdW5kIGRlbGljaW91cyEgSGF2ZSB5b3UgdHJpZWQgdGhlbSB3aXRoIGEgY2FuIG9mIG9pbD8gVGhhdCdzIG15IGZhdm9yaXRlIGZvb2QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBCTFVFIGxpa2UgdGhlIHdhdGVyIGFuZCB0aGUgc2t5LlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiSSBkb24ndCBwbGF5IG1hbnkgc3BvcnRzLCBidXQgSSBhbSBhbiBhdmlkIHdlaWdodCBsaWZ0ZXIuIFlvdSdsbCBvZnRlbiBzZWUgbWUgbGlmdGluZyBoZWF2eSBsb2FkcyBvZiBsb2dzIGluIG15IG9mZiB0aW1lLlwiXG4gICAgfSxcbiAgICBcImJsYWRlcmFuZ2VyXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhpIENoYW1wIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiSSdtIEJsYWRlIFJhbmdlci4gQnV0IHlvdSBjYW4gY2FsbCBtZSBCbGFkZS5cIixcbiAgICAgICAgXCJib2R5MlwiOiBcIlJlbWVtYmVyLCB5b3UgY2FuIGRvIGFueXRoaW5nISAgWW91IGp1c3QgaGF2ZSB0byB0cmFpbiBoYXJkIGFuZCBoYXZlIGNvdXJhZ2UuICBUaGFua3MgZm9yIHlvdXIgbGV0dGVyICV0ZW1wbGF0ZSUuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiWW91ciBwYXJ0bmVyXCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSdtIGEgRmlyZSBhbmQgUmVzY3VlIEhlbGljb3B0ZXIsIGFuZCB0aGUgQ2hpZWYgaW4gQ2hhcmdlIGhlcmUgYXQgUGlzdG9uIFBlYWsuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJXaGVuIHRoZXJlJ3MgYSBmaXJlLCBJIGdpdmUgdGhlIG9yZGVycyBmb3IgdGhlIEFpciBBdHRhY2sgVGVhbSB0byBzcHJpbmcgaW50byBhY3Rpb24hXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJJ3ZlIGJlZW4gdGhlIENoaWVmIGZvciBhIGxvbmcgdGltZSwgYnV0IEkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiAgVGhpcyBpcyBteSBzZWNvbmQgY2FyZWVyLCBhbmQgbXkgbW9zdCByZXdhcmRpbmcuICBOb3cgSSBmbHkgaW4gd2hlbiBvdGhlcnMgZmx5IG91dCB0byBoZWxwIHRob3NlIHdobyBuZWVkIGl0IG1vc3QuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kcyBhcmUgYWxsIHRoZSB0cmFpbGJsYXplcnMgaGVyZSBhdCBQaXN0b24gUGVhay4gV2UgbGlrZSB0byB0aGluayBvZiBvdXJzZWx2ZXMgYXMgdGhlIGhlcm9lcyBvZiB0aGUgc2t5IVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGxpa2UgdG8gZmx5IHRvIG1hbnkgcGxhY2VzLCBidXQgbXkgZmF2b3JpdGUgcGxhY2UgaXMgYWJvdmUgUGlzdG9uIFBlYWsuIEkgcGF0cm9sIHRoZSBza2llcyBhbmQgbWFrZSBzdXJlIGFsbCB0aGUgdG91cmlzdHMgYXJlIGNhbXBpbmcgYnkgdGhlIGJvb2suIFJlbWVtYmVyLCBzYWZldHkgZmlyc3QhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIllvdSBzYXkgeW91IGxpa2UgdG8gZWF0ICV0ZW1wbGF0ZSU/IEkgcHJlZmVyIGEgZnJlc2ggY2FuIG9mIG9pbC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kLXBsdXJhbFwiOiBcIllvdSBzYXkgeW91IGxpa2UgdG8gZWF0ICV0ZW1wbGF0ZSU/IEkgcHJlZmVyIGEgZnJlc2ggY2FuIG9mIG9pbC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIk15IGZhdm9yaXRlIGNvbG9yIGlzIFJFRCwgdGhlIGNvbG9yIG9mIEZpcmUgU2FmZXR5LlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiSWYgSSBoYWQgdG8gY2hvb3NlLCBmb290YmFsbCB3b3VsZCBiZSBteSBmYXZvcml0ZSBzcG9ydC5cIlxuICAgIH0sXG4gICAgXCJjYWJiaWVcIjoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiQXR0ZW50aW9uICV0ZW1wbGF0ZSUhXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJDYWJiaWUgaGVyZS5cIixcbiAgICAgICAgXCJib2R5MlwiOiBcIlRoYW5rcyBmb3IgdGhlIG1lc3NhZ2UuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiT3ZlciBhbmQgb3V0XCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSdtIGFuIGV4LW1pbGl0YXJ5IGNhcmdvIHBsYW5lIHdpdGggdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtIC0gZmlyZWZpZ2h0aW5nIGlzIGEgYmlnIHJlc3BvbnNpYmlsaXR5LlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBjYXJyeSB0aGUgU21va2VqdW1wZXJzIC0gd2hvIGNsZWFyIGZhbGxlbiB0cmVlcyBhbmQgZGVicmlzLiBEdXJpbmcgYSBmaXJlLCBJIGRyb3AgdGhlbSBmcm9tIHRoZSBza3ksIHJpZ2h0IG92ZXIgdGhlIGZsYW1lcy5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHVzZWQgdG8gZHJvcCBhaXJib3JuZSB1dGlsaXR5IHZlaGljbGVzIGJlaGluZCBlbmVteSBsaW5lcyBkdXJpbmcgd2FyLiBOb3cgSSBkcm9wIFNtb2tlanVtcGVycyBhdCBQaXN0b24gUGVhay5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiV2hvJ3MgbXkgYmVzdCBmcmllbmQ/IFRoYXQncyBwcm9iYWJseSBUb3AgU2VjcmV0IGJ1dCBJIGNhbiBzYXkgdGhlIFNtb2tlanVtcGVycyBhcmUgbXkgY2xvc2VzdCByZWNydWl0cy5cIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSd2ZSBmbG93biBvdmVyIG1hbnkgcGxhY2VzIGluIG15IHRpbWUuIE15IGZhdm9yaXRlIHNwb3QgaXMgQW5jaG9yIExha2UgLSBhIGxvbmcgYm9keSBvZiB3YXRlciB3aXRoIGFuIGFuY2hvci1zaGFwZWQgaXNsYW5kLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJJbiB0aGUgbWlsaXRhcnksIGFsbCBmb29kIGlzIHJhdGlvbmVkIGJ1dCBJJ2xsIHRha2UgYXMgbXVjaCBmcmVzaCBvaWwgYXMgSSBjYW4gZ2V0ISBcIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kLXBsdXJhbFwiOiBcIkluIHRoZSBtaWxpdGFyeSwgYWxsIGZvb2QgaXMgcmF0aW9uZWQgYnV0IEknbGwgdGFrZSBhcyBtdWNoIGZyZXNoIG9pbCBhcyBJIGNhbiBnZXQhIFwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgR1JFRU4gLSBpdCBjYW4gaGVscCBtZSBoaWRlIGFib3ZlIHRoZSBwaW5lIHRyZWVzLlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiQmFzZWJhbGwgaXMgbXkgZmF2b3JpdGUgc3BvcnQuIEkgYWx3YXlzIGhhdmUgZml2ZSBzbW9rZWp1bXBlcnMgaW4gbXkgY2FyZ28gLSBqdXN0IGVub3VnaCB0byBjb3ZlciB0aGUgYmFzZXMuXCJcbiAgICB9LFxuICAgIFwidGVhbVwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIZXkgZnJpZW5kIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiVGhhbmtzIGZvciB3cml0aW5nIHRvIHVzLlwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGltZSB0byBnZXQgYmFjayB0byB3b3JrIVwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIkxldCdzIG1ha2UgaXQgY291bnQhXCIsXG4gICAgICAgIFwiam9iXCI6IFwiVGhlIFBpc3RvbiBQZWFrIEFpciBBdHRhY2sgVGVhbSBpcyBhbiBlbGl0ZSBncm91cCBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnRzLlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2UgZmx5IGluIHdoZW4gb3RoZXJzIGFyZSBmbHlpbiBvdXQuIEl0IHRha2VzIGEgc3BlY2lhbCBraW5kYSBwbGFuZS5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkxpZmUgZG9lc24ndCBhbHdheXMgZ28gdGhlIHdheSB5b3UgZXhwZWN0IGl0LiBUaGlzIGlzIGEgc2Vjb25kIGNhcmVlciBmb3IgYWxsIG9mIHVzLiBcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgdGFrZXMgaG9ub3IsIHRydXN0IGFuZCBicmF2ZXJ5IHRvIGVhcm4geW91ciB3aW5ncy4gV2UgZG9uJ3QgaGF2ZSBqdXN0IG9uZSBiZXN0IGZyaWVuZCBiZWNhdXNlIHdlIG5lZWQgZXZlcnkgcGxhbmUgd2UndmUgZ290IHRvIGhlbHAuXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIlBpc3RvbiBQZWFrIGhhcyBzb21lIGdyZWF0IHBsYWNlcyB0byBmbHkuIEJ1dCBvdXIgZmF2b3JpdGUgc3BvdCBpcyB0aGUgd29vZGVuIHJhaWx3YXkgYnJpZGdlIC0gd2l0aCB0aGUgdGh1bmRlcmluZyBXaGl0ZXdhbGwgRmFsbHMgYmVoaW5kIGl0LlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCIldGVtcGxhdGUlIHNvdW5kcyBncmVhdCBidXQgd2UnZCByYXRoZXIgc2x1cnAgZG93biBmcmVzaCBjYW5zIG9mIG9pbC4gSE9JU1QhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZC1wbHVyYWxcIjogXCIldGVtcGxhdGUlIHNvdW5kIGdyZWF0IGJ1dCB3ZSdkIHJhdGhlciBzbHVycCBkb3duIGZyZXNoIGNhbnMgb2Ygb2lsLiBIT0lTVCFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIldlIGxpa2UgYWxsIGNvbG9ycyBvZiB0aGUgcmFpbmJvdy4gQnV0IGFzIGEgdGVhbSwgb3VyIGZhdm9yaXRlIGNvbG9yIGlzICV0ZW1wbGF0ZSUsIGp1c3QgbGlrZSB5b3UhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJdCdzIGhhcmQgdG8gcGljayBhIGZhdm9yaXRlIHNwb3J0IC0gd2UncmUgYSBmYW4gb2YgYW55dGhpbmcgdGhhdCBsZXQgdXMgd29yayBhcyBhIHRlYW0hXCJcbiAgICB9XG59IiwidmFyIGRldmljZSA9IHtcbiAgICBpc0FuZHJvaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzQW5kcm9pZFRhYmxldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpICE9PSBudWxsXG4gICAgICAgICAgICAmJiAoXG4gICAgICAgICAgICAoKHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gMCB8fCB3aW5kb3cub3JpZW50YXRpb24gPT09IDE4MCApICYmIHNjcmVlbi53aWR0aCA+IDY0MClcbiAgICAgICAgICAgICAgICB8fCAoKHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gLTkwIHx8IHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gOTApICYmIHNjcmVlbi5oZWlnaHQgPiA2NDApXG4gICAgICAgICAgICApO1xuICAgIH0sXG4gICAgaXNCbGFja0JlcnJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc0lPUzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNJcGFkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWQvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc09wZXJhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL09wZXJhIE1pbmkvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc1dpbmRvd3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvSUVNb2JpbGUvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc1RhYmxldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQW5kcm9pZFRhYmxldCgpIHx8IHRoaXMuaXNJcGFkKCk7XG4gICAgfSxcbiAgICBpc01vYmlsZTogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc1RhYmxldCgpICYmICh0aGlzLmlzSU9TKCkgfHwgdGhpcy5pc0FuZHJvaWQoKSB8fCB0aGlzLmlzQmxhY2tCZXJyeSgpIHx8IHRoaXMuaXNPcGVyYSgpIHx8IHRoaXMuaXNXaW5kb3dzKCkpO1xuICAgIH0sXG4gICAgY3VycmVudERldmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKCkpXG4gICAgICAgICAgICByZXR1cm4gXCJtb2JpbGVcIjtcbiAgICAgICAgaWYgKHRoaXMuaXNUYWJsZXQoKSlcbiAgICAgICAgICAgIHJldHVybiBcInRhYmxldFwiO1xuICAgICAgICByZXR1cm4gXCJkZXNrdG9wXCI7XG4gICAgfSxcbiAgICBjdXJyZW50RGV2aWNlTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3aXRjaCh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNBbmRyb2lkKCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJBbmRyb2lkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc0JsYWNrQmVycnkoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkJsYWNrQmVycnlcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzT3BlcmEoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk9wZXJhIE1pbmlcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzV2luZG93cygpOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSUVNb2JpbGVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzSU9TKCk6IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0lwYWQoKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiaVBhZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBcImlQaG9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkRlc2t0b3BcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRldmljZTsiLCJcblxuXG5cbi8vIGFkZHMgb3VyIGN1c3RvbSBtb2RpZmljYXRpb25zIHRvIHRoZSBQSVhJIGxpYnJhcnlcbnJlcXVpcmUoJy4vcGl4aS9saWJNb2RpZmljYXRpb25zJyk7XG5cblxudmFyIEhlYWRlclZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2hlYWRlclZpZXcnKTtcbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFpblZpZXcnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuL2RldmljZScpO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFwcCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhcHAgPSB7fTtcblxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFBhc3N3b3JkIFNjcmVlbiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciAkcGFzc3dvcmRTY3JlZW4gPSAkKCcjcGFzc3dvcmRTY3JlZW4nKTtcblxuaWYoZG9jdW1lbnQuVVJMLmluZGV4T2YoJ2Rpc25leS1wbGFuZXMyLWFpcm1haWwtc3RhZ2luZy5henVyZXdlYnNpdGVzLm5ldCcpICE9PSAtMSkge1xuICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciBwYXNzd29yZCA9ICdkaXNuZXlQbGFuZXNUd28nO1xuXG4gICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dCA9ICRwYXNzd29yZFNjcmVlbi5maW5kKCdpbnB1dFt0eXBlPXBhc3N3b3JkXScpO1xuXG4gICAgICAgICRwYXNzd29yZFNjcmVlbi5maW5kKCdmb3JtJykuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYoJHBhc3N3b3JkSW5wdXQudmFsKCkgPT09IHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZhZGVPdXQoNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRwYXNzd29yZFNjcmVlbi5zaG93KCk7XG59IGVsc2Uge1xuICAgICRwYXNzd29yZFNjcmVlbi5yZW1vdmUoKTtcbn1cblxuXG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgYXBwLm1haW5WaWV3ID0gbmV3IE1haW5WaWV3KCk7XG5cbiAgICBhcHAuaGVhZGVyVmlldyA9IG5ldyBIZWFkZXJWaWV3KCk7XG5cblxuXG4gICAgYXBwLm1haW5WaWV3LnN0YXJ0KCk7XG5cblxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4iLCJcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBBdWRpbyBMb2FkZXIgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYXVkaW9Bc3NldERhdGEgPSByZXF1aXJlKCcuL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xudmFyIG51bUF1ZGlvQXNzZXRzID0gYXVkaW9Bc3NldERhdGEubWFuaWZlc3QubGVuZ3RoO1xuXG5cblxuZnVuY3Rpb24gc3RhcnRBdWRpb0xvYWRlcigpIHtcbiAgICAvLyBpZiBpbml0aWFsaXplRGVmYXVsdFBsdWdpbnMgcmV0dXJucyBmYWxzZSwgd2UgY2Fubm90IHBsYXkgc291bmRcbiAgICBpZiAoIWNyZWF0ZWpzLlNvdW5kLmluaXRpYWxpemVEZWZhdWx0UGx1Z2lucygpKSB7IHJldHVybjsgfVxuXG4gICAgY3JlYXRlanMuU291bmQuYWx0ZXJuYXRlRXh0ZW5zaW9ucyA9IFtcIm1wM1wiXTtcbiAgICBjcmVhdGVqcy5Tb3VuZC5hZGRFdmVudExpc3RlbmVyKFwiZmlsZWxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgfSk7XG4gICAgY3JlYXRlanMuU291bmQucmVnaXN0ZXJNYW5pZmVzdChhdWRpb0Fzc2V0RGF0YS5tYW5pZmVzdCk7XG5cbiAgICBjcmVhdGVqcy5Tb3VuZC5zZXRWb2x1bWUoMC40KTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFByaW1hcnkgTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYXNzZXREYXRhID0gcmVxdWlyZSgnLi9kYXRhL2Fzc2V0cy5qc29uJyk7XG5cbnZhciBmaWxlTmFtZXMgPSBPYmplY3Qua2V5cyhhc3NldERhdGEuYXNzZXRzKTtcbnZhciB0b3RhbEZpbGVzID0gZmlsZU5hbWVzLmxlbmd0aDtcblxudmFyIGxvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKGZpbGVOYW1lcyk7XG52YXIgc3RhcnRUaW1lO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG5cbiAgICBsb2FkZXIub25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZUxvYWRlZCA9ICh0b3RhbEZpbGVzIC0gdGhpcy5sb2FkQ291bnQpL3RvdGFsRmlsZXM7XG4gICAgICAgIHZhciB0aW1lRWxhcHNlZCA9IF8ubm93KCkgLSBzdGFydFRpbWU7XG5cbiAgICAgICAgdmlldy5vbkFzc2V0UHJvZ3Jlc3MocGVyY2VudGFnZUxvYWRlZCwgdGltZUVsYXBzZWQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy5vbkFzc2V0c0xvYWRlZCgpO1xuICAgIH07XG5cbiAgICBzdGFydFRpbWUgPSBfLm5vdygpO1xuXG4gICAgc3RhcnRBdWRpb0xvYWRlcigpO1xuICAgIGxvYWRlci5sb2FkKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdGFydDogc3RhcnRMb2FkZXJcbn07IiwiXG5cblxudmFyIFF1ZXN0aW9uID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjb3B5OiAnJyxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgIH1cbn0pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbjsiLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG4gICAgdmFyIHNjZW5lO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBmdW5jdGlvbiBnZXRCbGFkZVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDYWJiaWVUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENhYmJpZTJUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllMi9DYWJiaWVfMl8wMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREaXBwZXJUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER1c3R5VGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RHVzdHkzVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RHVzdHk0VGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5NC9EdXN0eV9hbmdsZTFfbm9CbGlua18wMDAnLCAwLCAyNCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFdpbmRsaWZ0ZXJUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAnLCAwLCAxMik7XG4gICAgfVxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBmdW5jdGlvbiBpbml0Q2hhcmFjdGVyKG5hbWUsIHRleHR1cmVzLCBhbmNob3IpIHtcbiAgICAgICAgdmFyIGlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAodGV4dHVyZXMpO1xuICAgICAgICBpZGxlQW5pbWF0aW9uLmFuY2hvciA9IGFuY2hvcjtcblxuICAgICAgICB2YXIgY2hhciA9IG5ldyBDaGFyYWN0ZXIobmFtZSwgaWRsZUFuaW1hdGlvbik7XG5cbiAgICAgICAgY2hhci53aW5kb3dYID0gLTE7XG4gICAgICAgIGNoYXIud2luZG93WSA9IC0xO1xuXG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuICAgICAgICBjaGFyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoY2hhcik7XG5cbiAgICAgICAgcmV0dXJuIGNoYXI7XG4gICAgfVxuXG4gICAgdmFyIGNoYXJhY3RlckluaXRGdW5jdGlvbnMgPSB7XG4gICAgICAgIGJsYWRlOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignQmxhZGUnLCBnZXRCbGFkZVRleHR1cmVzKCksIHt4OiA0NTcvOTcwLCB5OiAzNDYvNjAwfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBjYWJiaWU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdDYWJiaWUnLCBnZXRDYWJiaWVUZXh0dXJlcygpLCB7eDogNTQ1LzEyMDAsIHk6IDM1MS82MjJ9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGNhYmJpZVR3bzogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0NhYmJpZTInLCBnZXRDYWJiaWUyVGV4dHVyZXMoKSwge3g6IDQwOC83NTAsIHk6IDIzOC8zODB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGRpcHBlcjogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0RpcHBlcicsIGdldERpcHBlclRleHR1cmVzKCksIHt4OiA1MzkvMTIwMCwgeTogNDM1LzYzOH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgZHVzdHk6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEdXN0eScsIGdldER1c3R5VGV4dHVyZXMoKSwge3g6IDQ4MC8xMjAwLCB5OiA0MDUvOTgzfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBkdXN0eURhcms6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEdXN0eTMnLCBnZXREdXN0eTNUZXh0dXJlcygpLCB7eDogMzM1LzYwMCwgeTogMTY1LzM2MH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgZHVzdHlGb3VyOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRHVzdHk0JywgZ2V0RHVzdHk0VGV4dHVyZXMoKSwge3g6IDM3My82MDAsIHk6IDE1NC8zNDF9KTtcbiAgICAgICAgfSksXG4gICAgICAgIHdpbmRsaWZ0ZXI6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdXaW5kbGlmdGVyJywgZ2V0V2luZGxpZnRlclRleHR1cmVzKCksIHt4OiAzMTAvNjAwLCB5OiAyMjgvMzcxfSk7XG4gICAgICAgIH0pXG4gICAgfTtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbiAgICB2YXIgYWxsQ2hhcmFjdGVycyA9IHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ocGl4aVNjZW5lKSB7XG4gICAgICAgICAgICBzY2VuZSA9IHBpeGlTY2VuZTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIF8uZWFjaChjaGFyYWN0ZXJJbml0RnVuY3Rpb25zLCBmdW5jdGlvbihpbml0Rm5jLCBjaGFyYWN0ZXIpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFsbENoYXJhY3RlcnMsIGNoYXJhY3Rlciwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXRGbmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gYWxsQ2hhcmFjdGVycztcbn0pKCk7XG5cblxuXG5cblxuXG5cbiIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxuICAgIC8vIGRpc3BsYXlPYmplY3Qgc2hvdWxkIGJlIGFuIGluc3RhbmNlIG9mIFBJWEkuU3ByaXRlIG9yIFBJWEkuTW92aWVDbGlwXG4gICAgdmFyIENoYXJhY3RlciA9IGZ1bmN0aW9uKG5hbWUsIG1vdmllQ2xpcCkge1xuICAgICAgICBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTsgLy8gUGFyZW50IGNvbnN0cnVjdG9yXG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcblxuICAgICAgICBpZighXy5pc1VuZGVmaW5lZChtb3ZpZUNsaXApKSB7XG4gICAgICAgICAgICB0aGlzLnNldElkbGVTdGF0ZShtb3ZpZUNsaXApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIHNldElkbGVTdGF0ZTogZnVuY3Rpb24ocGl4aVNwcml0ZSkge1xuICAgICAgICAgICAgdGhpcy5pZGxlID0gcGl4aVNwcml0ZTtcblxuICAgICAgICAgICAgaWYocGl4aVNwcml0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICAgICAgcGl4aVNwcml0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwaXhpU3ByaXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBpeGlTcHJpdGUuZ290b0FuZFBsYXkoMCk7ICAvL3N0YXJ0IGNsaXBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChwaXhpU3ByaXRlKTsgICAvL2FkZCB0byBkaXNwbGF5IG9iamVjdCBjb250YWluZXJcbiAgICAgICAgfSxcblxuICAgICAgICAvL2FkZCBtb3ZpZSBjbGlwIHRvIHBsYXkgd2hlbiBjaGFyYWN0ZXIgY2hhbmdlcyB0byBzdGF0ZVxuICAgICAgICBhZGRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIG1vdmllQ2xpcCkge1xuICAgICAgICAgICAgbW92aWVDbGlwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW3N0YXRlXSA9IG1vdmllQ2xpcDtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobW92aWVDbGlwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBwdWJsaWMgQVBJIGZ1bmN0aW9uLiBXYWl0cyB1bnRpbCBjdXJyZW50IHN0YXRlIGlzIGZpbmlzaGVkIGJlZm9yZSBzd2l0Y2hpbmcgdG8gbmV4dCBzdGF0ZS5cbiAgICAgICAgZ29Ub1N0YXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnN0YXRlc1tzdGF0ZV0pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0Vycm9yOiBDaGFyYWN0ZXIgJyArIHRoaXMubmFtZSArICcgZG9lcyBub3QgY29udGFpbiBzdGF0ZTogJyArIHN0YXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlkbGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaWRsZS5vbkNvbXBsZXRlID0gXy5iaW5kKHRoaXMuc3dhcFN0YXRlLCB0aGlzLCBzdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZnRlciBjdXJyZW50IGFuaW1hdGlvbiBmaW5pc2hlcyBnbyB0byB0aGlzIHN0YXRlIG5leHRcbiAgICAgICAgICAgICAgICB0aGlzLmlkbGUubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2FwU3RhdGUodGhpcywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIC8vc3dpdGNoIGltbWVkaWF0ZWx5IGlmIGNoYXJhY3RlciBpZGxlIHN0YXRlIGlzIGEgc2luZ2xlIHNwcml0ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vYWRkIGNhbGxiYWNrIHRvIHJ1biBvbiBjaGFyYWN0ZXIgdXBkYXRlXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2FsbGVkIG9uIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGJ5IHdoYXRldmVyIFBpeGkgc2NlbmUgY29udGFpbnMgdGhpcyBjaGFyYWN0ZXJcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U3RhdGljOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZS5nb3RvQW5kU3RvcCgwKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RHluYW1pYzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUuZ290b0FuZFBsYXkoMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZsaXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gLSh0aGlzLnNjYWxlLngpO1xuICAgICAgICB9LFxuICAgICAgICBwdXNoVG9Ub3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnBhcmVudCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IhIE5vIHBhcmVudCBkZWZpbmVkIGZvciBjaGFyYWN0ZXI6Jyx0aGlzLm5hbWUgKyAnLicsJ0l0IGlzIGxpa2VseSBwdXN0VG9Ub3AoKSB3YXMgY2FsbGVkIGFmdGVyIGNoYXJhY3RlciB3YXMgYWRkZWQgYnV0IGJlZm9yZSBQSVhJIHNjZW5lIHdhcyB1cGRhdGVkLicpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcblxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCh0aGlzLCBsZW5ndGgtMSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIC8vIGNoYW5nZXMgc3RhdGUgaW1tZWRpYXRlbHlcbiAgICAvLyBOT1RFOiBGdW5jdGlvbiBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgY2hhcmFjdGVyLmdvVG9TdGF0ZSgpXG4gICAgZnVuY3Rpb24gc3dhcFN0YXRlKGNoYXIsIHN0YXRlKSB7XG4gICAgICAgIHZhciBpZGxlU3RhdGUgPSBjaGFyLmlkbGU7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IGNoYXIuc3RhdGVzW3N0YXRlXTtcblxuICAgICAgICBuZXdTdGF0ZS5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7ICAvL3N3aXRjaCBiYWNrIHRvIGlkbGUgYWZ0ZXIgcnVuXG4gICAgICAgICAgICBpZihpZGxlU3RhdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIG5ld1N0YXRlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIG5ld1N0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgIH1cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIGV4dGVuZHMgRGlzcGxheSBPYmplY3QgQ29udGFpbmVyXG4gICAgZXh0ZW5kKFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lciwgQ2hhcmFjdGVyKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2hhcmFjdGVyO1xufSkoKTsiLCJcbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBzdWIpIHtcbiAgICAvLyBBdm9pZCBpbnN0YW50aWF0aW5nIHRoZSBiYXNlIGNsYXNzIGp1c3QgdG8gc2V0dXAgaW5oZXJpdGFuY2VcbiAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2NyZWF0ZVxuICAgIC8vIGZvciBhIHBvbHlmaWxsXG4gICAgLy8gQWxzbywgZG8gYSByZWN1cnNpdmUgbWVyZ2Ugb2YgdHdvIHByb3RvdHlwZXMsIHNvIHdlIGRvbid0IG92ZXJ3cml0ZVxuICAgIC8vIHRoZSBleGlzdGluZyBwcm90b3R5cGUsIGJ1dCBzdGlsbCBtYWludGFpbiB0aGUgaW5oZXJpdGFuY2UgY2hhaW5cbiAgICAvLyBUaGFua3MgdG8gQGNjbm9rZXNcbiAgICB2YXIgb3JpZ1Byb3RvID0gc3ViLnByb3RvdHlwZTtcbiAgICBzdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3JpZ1Byb3RvKSAge1xuICAgICAgICBzdWIucHJvdG90eXBlW2tleV0gPSBvcmlnUHJvdG9ba2V5XTtcbiAgICB9XG5cbiAgICAvLyBSZW1lbWJlciB0aGUgY29uc3RydWN0b3IgcHJvcGVydHkgd2FzIHNldCB3cm9uZywgbGV0J3MgZml4IGl0XG4gICAgc3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgICAvLyBJbiBFQ01BU2NyaXB0NSsgKGFsbCBtb2Rlcm4gYnJvd3NlcnMpLCB5b3UgY2FuIG1ha2UgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5XG4gICAgLy8gbm9uLWVudW1lcmFibGUgaWYgeW91IGRlZmluZSBpdCBsaWtlIHRoaXMgaW5zdGVhZFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWIucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc3ViXG4gICAgfSk7XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDsiLCIoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKlxuICAgICAqIEN1c3RvbSBFZGl0cyBmb3IgdGhlIFBJWEkgTGlicmFyeVxuICAgICAqL1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBSZWxhdGl2ZSBQb3NpdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93WCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93WSA9IDA7XG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWCA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9ICh3aW5kb3dXaWR0aCAqIHRoaXMuX3dpbmRvd1gpICsgdGhpcy5fYnVtcFg7XG4gICAgfTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRQb3NpdGlvblkgPSBmdW5jdGlvbih3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gKHdpbmRvd0hlaWdodCAqIHRoaXMuX3dpbmRvd1kpICsgdGhpcy5fYnVtcFk7XG4gICAgfTtcblxuICAgIC8vIHdpbmRvd1ggYW5kIHdpbmRvd1kgYXJlIHByb3BlcnRpZXMgYWRkZWQgdG8gYWxsIFBpeGkgZGlzcGxheSBvYmplY3RzIHRoYXRcbiAgICAvLyBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIHBvc2l0aW9uLnggYW5kIHBvc2l0aW9uLnlcbiAgICAvLyB0aGVzZSBwcm9wZXJ0aWVzIHdpbGwgYmUgYSB2YWx1ZSBiZXR3ZWVuIDAgJiAxIGFuZCBwb3NpdGlvbiB0aGUgZGlzcGxheVxuICAgIC8vIG9iamVjdCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHdpbmRvdyB3aWR0aCAmIGhlaWdodCBpbnN0ZWFkIG9mIGEgZmxhdCBwaXhlbCB2YWx1ZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93WCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl93aW5kb3dYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCgkd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1k7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1kgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25ZKCR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9idW1wWSA9IDA7XG5cbiAgICAvLyBidW1wWCBhbmQgYnVtcFkgYXJlIHByb3BlcnRpZXMgb24gYWxsIGRpc3BsYXkgb2JqZWN0cyB1c2VkIGZvclxuICAgIC8vIHNoaWZ0aW5nIHRoZSBwb3NpdGlvbmluZyBieSBmbGF0IHBpeGVsIHZhbHVlcy4gVXNlZnVsIGZvciBzdHVmZlxuICAgIC8vIGxpa2UgaG92ZXIgYW5pbWF0aW9ucyB3aGlsZSBzdGlsbCBtb3ZpbmcgYXJvdW5kIGEgY2hhcmFjdGVyLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYnVtcFgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVtcFg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX2J1bXBYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9ICgkd2luZG93LndpZHRoKCkgKiB0aGlzLl93aW5kb3dYKSArIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gKCR3aW5kb3cuaGVpZ2h0KCkgKiB0aGlzLl93aW5kb3dZKSArIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBTY2FsaW5nIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gd2luZG93U2NhbGUgY29ycmVzcG9uZHMgdG8gd2luZG93IHNpemVcbiAgICAvLyAgIGV4OiB3aW5kb3dTY2FsZSA9IDAuMjUgbWVhbnMgMS80IHNpemUgb2Ygd2luZG93XG4gICAgLy8gc2NhbGVNaW4gYW5kIHNjYWxlTWF4IGNvcnJlc3BvbmQgdG8gbmF0dXJhbCBzcHJpdGUgc2l6ZVxuICAgIC8vICAgZXg6IHNjYWxlTWluID0gMC41IG1lYW5zIHNwcml0ZSB3aWxsIG5vdCBzaHJpbmsgdG8gbW9yZSB0aGFuIGhhbGYgb2YgaXRzIG9yaWdpbmFsIHNpemUuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93U2NhbGUgPSAtMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNjYWxlTWluID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNjYWxlTWF4ID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlVHlwZSA9ICdjb250YWluJztcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zY2FsZUZuYyA9IE1hdGgubWluO1xuXG4gICAgLy8gV2luZG93U2NhbGU6IHZhbHVlIGJldHdlZW4gMCAmIDEsIG9yIC0xXG4gICAgLy8gVGhpcyBkZWZpbmVzIHdoYXQgJSBvZiB0aGUgd2luZG93IChoZWlnaHQgb3Igd2lkdGgsIHdoaWNoZXZlciBpcyBzbWFsbGVyKVxuICAgIC8vIHRoZSBvYmplY3Qgd2lsbCBiZSBzaXplZC4gRXhhbXBsZTogYSB3aW5kb3dTY2FsZSBvZiAwLjUgd2lsbCBzaXplIHRoZSBkaXNwbGF5T2JqZWN0XG4gICAgLy8gdG8gaGFsZiB0aGUgc2l6ZSBvZiB0aGUgd2luZG93LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93U2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93U2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1NjYWxlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFR3byBwb3NzaWJsZSB2YWx1ZXM6IGNvbnRhaW4gb3IgY292ZXIuIFVzZWQgd2l0aCB3aW5kb3dTY2FsZSB0byBkZWNpZGUgd2hldGhlciB0byB0YWtlIHRoZVxuICAgIC8vIHNtYWxsZXIgYm91bmQgKGNvbnRhaW4pIG9yIHRoZSBsYXJnZXIgYm91bmQgKGNvdmVyKSB3aGVuIGRlY2lkaW5nIGNvbnRlbnQgc2l6ZSByZWxhdGl2ZSB0byBzY3JlZW4uXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdzY2FsZVR5cGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVUeXBlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2FsZVR5cGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2NhbGVGbmMgPSAodmFsdWUgPT09ICdjb250YWluJykgPyBNYXRoLm1pbiA6IE1hdGgubWF4O1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0U2NhbGUgPSBmdW5jdGlvbih3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KSB7XG4gICAgICAgIHZhciBsb2NhbEJvdW5kcyA9IHRoaXMuZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLl93aW5kb3dTY2FsZSAqIHRoaXMuX3NjYWxlRm5jKHdpbmRvd0hlaWdodC9sb2NhbEJvdW5kcy5oZWlnaHQsIHdpbmRvd1dpZHRoL2xvY2FsQm91bmRzLndpZHRoKTtcblxuICAgICAgICAvL2tlZXAgc2NhbGUgd2l0aGluIG91ciBkZWZpbmVkIGJvdW5kc1xuICAgICAgICBzY2FsZSA9IE1hdGgubWF4KHRoaXMuc2NhbGVNaW4sIE1hdGgubWluKHNjYWxlLCB0aGlzLnNjYWxlTWF4KSk7XG5cblxuICAgICAgICB0aGlzLnNjYWxlLnggPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgdGhpcy5zY2FsZS55ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgfTtcblxuXG4gICAgLy8gVVNFIE9OTFkgSUYgV0lORE9XU0NBTEUgSVMgQUxTTyBTRVRcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVggPSAxO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWSA9IDE7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIFdpbmRvdyBSZXNpemUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBmb3IgZWFjaCBkaXNwbGF5IG9iamVjdCBvbiB3aW5kb3cgcmVzaXplLFxuICAgIC8vIGFkanVzdGluZyB0aGUgcGl4ZWwgcG9zaXRpb24gdG8gbWlycm9yIHRoZSByZWxhdGl2ZSBwb3NpdGlvbnMgd2luZG93WCBhbmQgd2luZG93WVxuICAgIC8vIGFuZCBhZGp1c3Rpbmcgc2NhbGUgaWYgaXQncyBzZXRcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKHdpZHRoKTtcbiAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25ZKGhlaWdodCk7XG5cbiAgICAgICAgaWYodGhpcy5fd2luZG93U2NhbGUgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuLCBmdW5jdGlvbihkaXNwbGF5T2JqZWN0KSB7XG4gICAgICAgICAgICBkaXNwbGF5T2JqZWN0Ll9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBTcHJpdGVzaGVldCBUZXh0dXJlIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyB1c2VkIHRvIGdldCBpbmRpdmlkdWFsIHRleHR1cmVzIG9mIHNwcml0ZXNoZWV0IGpzb24gZmlsZXNcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgY2FsbDogZ2V0RmlsZU5hbWVzKCdhbmltYXRpb25faWRsZV8nLCAxLCAxMDUpO1xuICAgIC8vIFJldHVybnM6IFsnYW5pbWF0aW9uX2lkbGVfMDAxLnBuZycsICdhbmltYXRpb25faWRsZV8wMDIucG5nJywgLi4uICwgJ2FuaW1hdGlvbl9pZGxlXzEwNC5wbmcnXVxuICAgIC8vXG4gICAgZnVuY3Rpb24gZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHZhciBudW1EaWdpdHMgPSAocmFuZ2VFbmQtMSkudG9TdHJpbmcoKS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UocmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgIHZhciBudW1aZXJvcyA9IG51bURpZ2l0cyAtIG51bS50b1N0cmluZygpLmxlbmd0aDsgICAvL2V4dHJhIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIHZhciB6ZXJvcyA9IG5ldyBBcnJheShudW1aZXJvcyArIDEpLmpvaW4oJzAnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQcmVmaXggKyB6ZXJvcyArIG51bSArICcucG5nJztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgUElYSS5nZXRUZXh0dXJlcyA9IGZ1bmN0aW9uKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChnZXRGaWxlTmFtZXMoZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKTtcbiAgICB9O1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogTWVtb3J5IENsZWFudXAgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGRlc3Ryb3lCYXNlVGV4dHVyZSkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGRlc3Ryb3lCYXNlVGV4dHVyZSkpIGRlc3Ryb3lCYXNlVGV4dHVyZSA9IHRydWU7XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICB0aGlzLnRleHR1cmUuZGVzdHJveShkZXN0cm95QmFzZVRleHR1cmUpO1xuICAgIH07XG5cbiAgICBQSVhJLk1vdmllQ2xpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGRlc3Ryb3lCYXNlVGV4dHVyZSkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGRlc3Ryb3lCYXNlVGV4dHVyZSkpIGRlc3Ryb3lCYXNlVGV4dHVyZSA9IHRydWU7XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQodGhpcy5wYXJlbnQpKSB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICBfLmVhY2godGhpcy50ZXh0dXJlcywgZnVuY3Rpb24odGV4dHVyZSkge1xuICAgICAgICAgICAgdGV4dHVyZS5kZXN0cm95KGRlc3Ryb3lCYXNlVGV4dHVyZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuXG5cblxuXG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG4gICAgdmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuL2FsbENoYXJhY3RlcnMnKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9iYWNrZ3JvdW5kJyk7XG4gICAgdmFyIGJsYWRld2lwZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvYmxhZGV3aXBlJyk7XG4gICAgdmFyIGR1c3R5RGlwcGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9kdXN0eURpcHBlcicpO1xuICAgIHZhciBwYXJhY2h1dGVyc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMnKTtcbiAgICB2YXIgY2hhcmFjdGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9jaGFyYWN0ZXJNb2R1bGUnKTtcbiAgICB2YXIgcmVzcG9uc2VNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlJyk7XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKiBQcmltYXJ5IFBpeGkgQW5pbWF0aW9uIENsYXNzICoqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3BhcmVudCBjb25zdHJ1Y3RvclxuICAgICAgICBTY2VuZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGFsbENoYXJhY3RlcnMuaW5pdGlhbGl6ZSh0aGlzKTtcblxuXG4gICAgICAgIGJhY2tncm91bmRNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZEJhY2tncm91bmRUb1NjZW5lKHRoaXMpO1xuICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZFJlc3RUb1NjZW5lKHRoaXMpO1xuXG4gICAgICAgIGJsYWRld2lwZU1vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgcmVzcG9uc2VNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZUluVXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBhcmFsbGF4IFN0dWZmICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLnNoaWZ0QmFja2dyb3VuZExheWVycyh4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmlldzogZnVuY3Rpb24odmlldykge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgfSxcbiAgICAgICAgX29uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBTY2VuZS5wcm90b3R5cGUuX29uV2luZG93UmVzaXplLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogRXh0ZW5kIGFuZCBFeHBvcnQgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cblxuICAgIC8vIEV4dGVuZHMgU2NlbmUgQ2xhc3NcbiAgICBleHRlbmQoU2NlbmUsIE1haW5TY2VuZSk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFpblNjZW5lO1xufSkoKTsiLCJcblxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG52YXIgU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ0IgPSBmdW5jdGlvbigpe307XG5cbiAgICBQSVhJLlN0YWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5TY2VuZS5wcm90b3R5cGUgPSB7XG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZUNCKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IgPSB1cGRhdGVDQjtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IoKTtcbiAgICB9LFxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVzdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIGlzUGF1c2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGF1c2VkO1xuICAgIH1cbn07XG5cblxuZXh0ZW5kKFBJWEkuU3RhZ2UsIFNjZW5lKTtcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgdmFyIFNjZW5lc01hbmFnZXIgPSB7XG4gICAgICAgIHNjZW5lczoge30sXG4gICAgICAgIGN1cnJlbnRTY2VuZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZXI6IG51bGwsXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsICRwYXJlbnREaXYpIHtcblxuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIucmVuZGVyZXIpIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2lkdGgsIGhlaWdodCwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3BpeGktdmlldycpO1xuICAgICAgICAgICAgJHBhcmVudERpdi5hcHBlbmQoU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3KTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoU2NlbmVzTWFuYWdlci5sb29wKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGxvb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoZnVuY3Rpb24gKCkgeyBTY2VuZXNNYW5hZ2VyLmxvb3AoKSB9KTtcblxuICAgICAgICAgICAgaWYgKCFTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSB8fCBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpKSByZXR1cm47XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnVwZGF0ZSgpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci5yZW5kZXIoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVTY2VuZTogZnVuY3Rpb24oaWQsIFNjZW5lQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIFNjZW5lQ29uc3RydWN0b3IgPSBTY2VuZUNvbnN0cnVjdG9yIHx8IFNjZW5lOyAgIC8vZGVmYXVsdCB0byBTY2VuZSBiYXNlIGNsYXNzXG5cbiAgICAgICAgICAgIHZhciBzY2VuZSA9IG5ldyBTY2VuZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0gPSBzY2VuZTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9LFxuICAgICAgICBnb1RvU2NlbmU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5wYXVzZSgpO1xuXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgPSBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF07XG5cbiAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHJlc2l6ZSB0byBtYWtlIHN1cmUgYWxsIGNoaWxkIG9iamVjdHMgaW4gdGhlXG4gICAgICAgICAgICAgICAgLy8gbmV3IHNjZW5lIGFyZSBjb3JyZWN0bHkgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlc3VtZSBuZXcgc2NlbmVcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5yZXN1bWUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLl9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG5cblxuICAgICR3aW5kb3cub24oJ3Jlc2l6ZScsIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUpO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XG59KSgpOyIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBzZWxmPXRoaXM7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhLGRlcHRoMSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyO1xuICBidWZmZXIgKz0gXCJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJvcHRpb25cXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImVtcHR5LXNwYWNlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5uYW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiIHZhbHVlPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBpZD1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgb25jbGljaz1cXFwiXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcImZ1bGwtcmVsYXRpdmVcXFwiIG9uY2xpY2s9XFxcIlxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJiYWNrZ3JvdW5kXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudGV4dCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50ZXh0KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgICAgICBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuY29weSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5jb3B5KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5vcHRpb25zKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtV2l0aERlcHRoKDEsIHByb2dyYW0xLCBkYXRhLCBkZXB0aDApLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuICAgIDwvZGl2PlxcbjwvZGl2PlwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsIlxuXG5cbnZhciBpdGVtQW5pbWF0aW9uc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFnZUl0ZW1zJyk7XG5cbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcbnZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG5cbnZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG5cbnZhciBDYW5uZWRRdWVzdGlvblZpZXcgPSBRdWVzdGlvblZpZXcuZXh0ZW5kKHtcbiAgICBnZXRBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1BbmltYXRpb25zTW9kdWxlLmdldFJhbmRvbUNhbm5lZEFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgfSxcbiAgICBpc0Nhbm5lZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICByZW1vdmVPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucy5yZW1vdmUoKTtcbiAgICB9LFxuICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ29wdGlvbnMnLCBvcHRpb25zKTtcblxuICAgICAgICAvL3JlaW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuXG4gICAgICAgIGlmKCFpc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIGNvcHkgPSB0aGlzLm1vZGVsLmdldCgnY29weScpLnJlcGxhY2UoJyVjaGFyYWN0ZXIlJywgY2hhcmFjdGVyKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnY29weScsIGNvcHkpO1xuICAgICAgICB0aGlzLiRjb3B5Lmh0bWwoY29weSk7XG4gICAgfVxuXG5cbn0pO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FubmVkUXVlc3Rpb25WaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG5cblxuICAgIGZ1bmN0aW9uIGdldENsaXBib2FyZFRleHQoZSkge1xuICAgICAgICBpZighXy5pc1VuZGVmaW5lZChlLm9yaWdpbmFsRXZlbnQpKSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuXG4gICAgICAgIGlmICh3aW5kb3cuY2xpcGJvYXJkRGF0YSAmJiB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKSB7IC8vIElFXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSgnVGV4dCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleWRvd24gaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlcklubmVyID0gdGhpcy4kcGxhY2Vob2xkZXIuZmluZCgnPiBkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnZGl2LnRpdGxlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICBfLmJpbmRBbGwodGhpcywgJ3N0YXJ0QW5pbWF0aW9uJywnc2hvdycsJ2hpZGUnLCdzZXRJbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0U2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuc2NlbmVzLm1haW47XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIFJ1biBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcmVBbmltYXRpb25TZXR1cCgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2NlbmUoKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zdGFydEVudGVyTmFtZUFuaW1hdGlvbigpOyAgIC8vYW5pbWF0ZSBpbiBjaGFyYWN0ZXJzXG5cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMC4zO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kdGl0bGUsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxLCB5OiAwLCBlYXNlOiAnQmFjay5lYXNlT3V0J30pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJG5hbWVJbnB1dCwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDF9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwbGFjZWhvbGRlcklubmVyLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMSwgeTogMCwgZWFzZTogJ0JhY2suZWFzZU91dCcsIGRlbGF5OiAwLjE1fSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJlQW5pbWF0aW9uU2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiR0aXRsZSwge29wYWNpdHk6IDAsIHk6IC03NX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRuYW1lSW5wdXQsIHtvcGFjaXR5OiAwfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIHtvcGFjaXR5OiAwLCB5OiAtNTB9KTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogU2hvdy9IaWRlICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnN0YXJ0QW5pbWF0aW9uLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUub25BbmltYXRpb25PdXRDb21wbGV0ZSh0aGlzLnNldEluYWN0aXZlKTtcblxuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRlbCwgMC4zLCB7b3BhY2l0eTogMH0pO1xuXG4gICAgICAgICAgICAgICAgLy9ydW4gaGlkZSBhbmltYXRpb25cbiAgICAgICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5hY3RpdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaXNDYW5uZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBzZXRJbmFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfSxcblxuICAgICAgICBvbk5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmKGUud2hpY2ggPT09IDMyKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLiRuYW1lSW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgIGlmKGUudHlwZSA9PT0gJ3Bhc3RlJykge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gZ2V0Q2xpcGJvYXJkVGV4dChlKTtcblxuICAgICAgICAgICAgICAgIHZhbCArPSB0ZXh0LnNwbGl0KCcgJykuam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQudmFsKHZhbCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlci50b2dnbGUodmFsID09PSAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB2YWx9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXIudG9nZ2xlKHZhbCA9PT0gJycpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB2YWx9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVZpZXc7XG59KSgpO1xuIiwiXG5cblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIEZvb3RlclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2Zvb3RlcicsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEudm9sdW1lJzogJ29uVm9sdW1lVG9nZ2xlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5udW1Eb3RzID0gb3B0aW9ucy5udW1Eb3RzO1xuXG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb3VudGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocyA9IHRoaXMuJGVsLmZpbmQoJ2Eudm9sdW1lIHBhdGgnKTtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYuY291bnRlcicpO1xuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPbigpO1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT2ZmKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBudW1Eb3RzID0gdGhpcy5udW1Eb3RzO1xuXG4gICAgICAgICAgICB2YXIgJGRvdCA9IHRoaXMuJGRvdHMuZXEoMCk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDI7IGkgPD0gbnVtRG90czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRuZXdEb3QgPSAkZG90LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5maW5kKCc+IGRpdi5udW1iZXInKS5odG1sKGkpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuYXBwZW5kVG8odGhpcy4kY291bnRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gJGRvdDtcbiAgICAgICAgICAgICRkb3QuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiBWb2x1bWUgQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdG9nZ2xlVm9sdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSAhdGhpcy52b2x1bWVPbjtcblxuICAgICAgICAgICAgaWYodGhpcy52b2x1bWVPbikge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQuc2V0TXV0ZSh0aGlzLnZvbHVtZU9uKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRUaW1lbGluZVZvbHVtZU9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFswLDAsMCwwLDIyLDMyXSwgZW5kTWF0cml4OiBbMSwwLDAsMSwwLDBdLCBlYXNpbmc6ICdCYWNrLmVhc2VPdXQnLCBvcGFjaXR5OiAxfTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMC41LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMSksIDAuMjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgyKSwgMCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPZmY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtzdGFydE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZW5kTWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVhc2luZzogJ0JhY2suZWFzZUluJywgb3BhY2l0eTogMH07XG5cbiAgICAgICAgICAgIC8vZGVmYXVsdCBvblxuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuYXR0cigndHJhbnNmb3JtJywgJ21hdHJpeCgxLDAsMCwxLDAsMCknKTtcbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmNzcygnb3BhY2l0eScsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDApLCAwLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMSksIDAuMjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgyKSwgMC41LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBhZGRTdmdQYXRoQW5pbWF0aW9uOiBmdW5jdGlvbih0aW1lbGluZSwgJHBhdGgsIHN0YXJ0VGltZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblNwZWVkID0gMC4yO1xuXG4gICAgICAgICAgICB2YXIgcGF0aE1hdHJpeCA9IF8uY2xvbmUob3B0aW9ucy5zdGFydE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHZhciB0d2VlbkF0dHJzID0ge1xuICAgICAgICAgICAgICAgIGVhc2U6IG9wdGlvbnMuZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBhdGguYXR0cigndHJhbnNmb3JtJywgJ21hdHJpeCgnICsgcGF0aE1hdHJpeC5qb2luKCcsJykgKyAnKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF8uZXh0ZW5kKHR3ZWVuQXR0cnMsIG9wdGlvbnMuZW5kTWF0cml4KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50bygkcGF0aCwgYW5pbWF0aW9uU3BlZWQsIHtvcGFjaXR5OiBvcHRpb25zLm9wYWNpdHl9KSwgYW5pbWF0aW9uU3BlZWQgKiBzdGFydFRpbWUpO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhwYXRoTWF0cml4LCBhbmltYXRpb25TcGVlZCwgdHdlZW5BdHRycyksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIENvdW50ZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2V0Q291bnRlcjogZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy4kZG90cy5lcShpKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QgPSB0aGlzLiRkb3RzLmVxKGkpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlQ291bnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRjb3VudGVyLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwub3V0ZXJIZWlnaHQoKSArIHRoaXMuJGNvdW50ZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIG9uVm9sdW1lVG9nZ2xlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlVm9sdW1lKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBGb290ZXJWaWV3O1xufSkoKTsiLCJcblxuZnVuY3Rpb24gb3BlbkluTmV3VGFiKHVybCkge1xuICAgIHZhciB3aW4gPSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcbn1cblxuXG52YXIgSGVhZGVyVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICBlbDogJyNoZWFkZXInLFxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgYS5zaG93dGltZXMnOiAnb25TaG93dGltZXNDbGljaycsXG4gICAgICAgICdjbGljayBhLnRyYWlsZXInOiAnb25UcmFpbGVyQ2xpY2snXG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB9LFxuXG4gICAgb25TaG93dGltZXNDbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgIHZhciBuZXdUYWIgPSAoMiA9PT0gZS53aGljaCB8fCBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KTtcblxuICAgICAgICBnYSgnc2VuZCcsICdldmVudCcsICdGaW5kIFNob3d0aW1lcycsICdjbGljaycsIGlwQWRkcmVzcywge1xuICAgICAgICAgICAgaGl0Q2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24gPSB1cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcbiAgICBvblRyYWlsZXJDbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgIHZhciBuZXdUYWIgPSAoMiA9PT0gZS53aGljaCB8fCBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KTtcblxuICAgICAgICBnYSgnc2VuZCcsICdldmVudCcsICdWaWV3IFRyYWlsZXInLCAnY2xpY2snLCBpcEFkZHJlc3MsIHtcbiAgICAgICAgICAgIGhpdENhbGxiYWNrOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uID0gdXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJWaWV3OyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xuXG4gICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgIHZhciBpbnRyb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm8nKTtcbiAgICB9XG5cbiAgICB2YXIgSW50cm9WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNpbnRyby12aWV3JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5iZWdpbic6ICdvbkJlZ2luQ2xpY2snLFxuICAgICAgICAgICAgJ3RvdWNoZW5kIGEuYmVnaW4nOiAnb25CZWdpbkNsaWNrJ1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb25UaW1lbGluZSgpO1xuXG4gICAgICAgICAgICB0aGlzLiRiZWdpbkJ0bi5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5TY3JlZW4gPSB0aGlzLiRlbC5maW5kKCdkaXYuYmVnaW4tc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkxpbmVzID0gdGhpcy4kYmVnaW5TY3JlZW4uZmluZCgnZGl2LmxpbmUnKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuID0gdGhpcy4kYmVnaW5TY3JlZW4uZmluZCgnYS5iZWdpbicpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0QW5pbWF0aW9uVGltZWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZSA9IHRoaXMuZ2V0TW9iaWxlVGltZWxpbmVIaWRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW4gPSB0aGlzLmdldE1vYmlsZVRpbWVsaW5lQmVnaW5TY3JlZW5JbigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZSA9IHRoaXMuZ2V0VGltZWxpbmVIaWRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW4gPSB0aGlzLmdldFRpbWVsaW5lQmVnaW5TY3JlZW5JbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dCZWdpblNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbjtcblxuICAgICAgICAgICAgaWYoZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAvL3Nob3cgY2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd01vYmlsZUNoYXJhY3RlcnMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChfLmJpbmQodGltZWxpbmUucGxheSwgdGltZWxpbmUpLCAyMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dNb2JpbGVDaGFyYWN0ZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkbW9iaWxlQ2hhcmFjdGVycyA9ICQoJyNtb2JpbGUtY2hhcmFjdGVycycpLmZpbmQoJ2Rpdi5jaGFyYWN0ZXInKTtcblxuICAgICAgICAgICAgdmFyICRkdXN0eSA9ICRtb2JpbGVDaGFyYWN0ZXJzLmZpbHRlcignLmR1c3R5MycpO1xuICAgICAgICAgICAgdmFyICRkaXBwZXIgPSAkbW9iaWxlQ2hhcmFjdGVycy5maWx0ZXIoJy5kaXBwZXInKTtcbiAgICAgICAgICAgIHZhciAkcGFyYWNodXRlcjEgPSAkbW9iaWxlQ2hhcmFjdGVycy5maWx0ZXIoJy5wYXJhY2h1dGVyMScpO1xuICAgICAgICAgICAgdmFyICRwYXJhY2h1dGVyMiA9ICRtb2JpbGVDaGFyYWN0ZXJzLmZpbHRlcignLnBhcmFjaHV0ZXIyJyk7XG4gICAgICAgICAgICB2YXIgJHBhcmFjaHV0ZXIzID0gJG1vYmlsZUNoYXJhY3RlcnMuZmlsdGVyKCcucGFyYWNodXRlcjMnKTtcblxuXG4gICAgICAgICAgICAkZHVzdHkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJGRpcHBlci5hZGRDbGFzcygnYWN0aXZlIGZsaXAnKTtcbiAgICAgICAgICAgICRwYXJhY2h1dGVyMS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkcGFyYWNodXRlcjIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJHBhcmFjaHV0ZXIzLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgZ2V0TW9iaWxlVGltZWxpbmVCZWdpblNjcmVlbkluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kYmVnaW5MaW5lcywge3g6IDAsIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luQnRuLCB7b3BhY2l0eTogMX0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2hvd0NvbnRlbnQoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMC40O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdCYWNrLmVhc2VPdXQnO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5zID0gXy5tYXAodGhpcy4kYmVnaW5MaW5lcywgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2VlbkxpdGUudG8obGluZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0d2VlbnM6IHR3ZWVucyxcbiAgICAgICAgICAgICAgICBzdGFnZ2VyOiAwLjA4LFxuICAgICAgICAgICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luQnRuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMC43XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRiZWdpbkJ0bi5zaG93KCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJ0bkluVGltZSA9IDAuNDtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpbkJ0biwgMC42LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICBzY2FsZVk6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0VsYXN0aWMuZWFzZU91dCdcbiAgICAgICAgICAgIH0pLCBidG5JblRpbWUpO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpbkJ0biwgMC42LCB7XG4gICAgICAgICAgICAgICAgc2NhbGVYOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lICsgKGFuaW1hdGlvblRpbWUgKiAwLjA1KSk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpbnRyb01vZHVsZS5zaG93TG9nbygpO1xuICAgICAgICAgICAgfSwgMC42NSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRNb2JpbGVUaW1lbGluZUhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb0ZyYW1lcyA9IGludHJvTW9kdWxlLmdldEludHJvRnJhbWVzKCk7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqIFRpbWVsaW5lICoqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0aW9uRmluaXNoZWQsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVNjb3BlOiB0aGlzLFxuICAgICAgICAgICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVqcy5Tb3VuZC5wbGF5KCdTaXRlb3BlbnMnLCB7ZGVsYXk6IDB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5TY3JlZW4sIGFuaW1hdGlvblRpbWUvNCwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMudG9wLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMuYnRtLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0TWFpblZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcgPSB2aWV3O1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2hvd0NvbnRlbnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBIZWxwZXJzIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcicpO1xuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gUElYSSBTY2VuZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgTWFpblNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9tYWluU2NlbmUnKTtcbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENvbGxlY3Rpb25zIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBWaWV3cyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgSW50cm9WaWV3ID0gcmVxdWlyZSgnLi9pbnRyb1ZpZXcnKTtcbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IHJlcXVpcmUoJy4vZW50ZXJOYW1lVmlldycpO1xuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuICAgIHZhciBDYW5uZWRRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL2Nhbm5lZFF1ZXN0aW9uVmlldycpO1xuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gcmVxdWlyZSgnLi9zZWxlY3RDaGFyYWN0ZXJWaWV3Jyk7XG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IHJlcXVpcmUoJy4vcmVzcG9uc2VWaWV3Jyk7XG4gICAgdmFyIEZvb3RlclZpZXcgPSByZXF1aXJlKCcuL2Zvb3RlclZpZXcnKTtcblxuICAgIHZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG4gICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBpbnRyb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm8nKTtcbiAgICB9XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIE1haW52aWV3IENsYXNzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVzKHZpZXdzKSB7XG4gICAgICAgIHJldHVybiBfLm1hcCh2aWV3cywgZnVuY3Rpb24odmlldykge3JldHVybiB2aWV3Lm1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7IH0pO1xuICAgIH1cblxuICAgIHZhciBNYWluVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgcGFnZXM6IFtdLFxuICAgICAgICBhY3RpdmVQYWdlSW5kZXg6IDAsXG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdjbGljayBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICd0b3VjaGVuZCBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25Bc3NldFByb2dyZXNzOiBmdW5jdGlvbihwZXJjZW50YWdlTG9hZGVkLCB0aW1lRWxhcHNlZCkge1xuICAgICAgICAgICAgaW50cm9Nb2R1bGUudXBkYXRlTG9hZGVyKHBlcmNlbnRhZ2VMb2FkZWQsIHRpbWVFbGFwc2VkKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Bc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBNYWluU2NlbmUpO1xuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5vbkNvbXBsZXRlKHRoaXMuaW50cm9WaWV3LnNob3dCZWdpblNjcmVlbi5iaW5kKHRoaXMuaW50cm9WaWV3KSk7XG4gICAgICAgICAgICBpbnRyb01vZHVsZS5hc3NldHNMb2FkZWQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKGludHJvTW9kdWxlKSlcbiAgICAgICAgICAgICAgICBpbnRyb01vZHVsZS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ21vYmlsZScpO1xuXG4gICAgICAgICAgICAgICAgaWYoZGV2aWNlLmlzSU9TKCkpIHRoaXMuJGVsLmFkZENsYXNzKCdpb3MnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCgnI2Fzc2V0TG9hZGVyJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuaW5pdGlhbGl6ZSh0aGlzLiR3aW5kb3cud2lkdGgoKSwgdGhpcy4kd2luZG93LmhlaWdodCgpLCB0aGlzLiRlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB2aWV3c1xuICAgICAgICAgICAgdGhpcy5pbml0SW50cm9WaWV3KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRQYWdlcygpO1xuXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXJWaWV3KHtudW1Eb3RzOiB0aGlzLnBhZ2VzLmxlbmd0aH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcgPSBuZXcgUmVzcG9uc2VWaWV3KCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdFdpbmRvd0V2ZW50cygpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDb250ZW50KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFdpbmRvd0V2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cub24oJ3Jlc2l6ZScsIF8uYmluZCh0aGlzLnJlcG9zaXRpb25QYWdlTmF2LCB0aGlzKSk7XG5cbi8vICAgICAgICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlb3JpZW50YXRpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29yaWVudGF0aW9uJywgZXZlbnQuYmV0YSwgZXZlbnQuZ2FtbWEpO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlbW90aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21vdGlvbicsIGV2ZW50LmFjY2VsZXJhdGlvbi54ICogMiwgZXZlbnQuYWNjZWxlcmF0aW9uLnkgKiAyKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veiBvcmllbnRhdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiTW96T3JpZW50YXRpb25cIiwgZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW96Jywgb3JpZW50YXRpb24ueCAqIDUwLCBvcmllbnRhdGlvbi55ICogNTApO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SW50cm9WaWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSBuZXcgSW50cm9WaWV3KCk7XG5cbiAgICAgICAgICAgIGludHJvVmlldy5zZXRNYWluVmlldyh0aGlzKTtcbiAgICAgICAgICAgIGludHJvVmlldy5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dGaXJzdFBhZ2UsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcgPSBpbnRyb1ZpZXc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFBhZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyTW9kZWwgPSBfLmZpcnN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTW9kZWxzID0gXy5yZXN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuXG4gICAgICAgICAgICB2YXIgcGFydGl0aW9uZWRRdWVzdGlvbk1vZGVscyA9IF8ucGFydGl0aW9uKHF1ZXN0aW9uTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbC5nZXQoJ2NsYXNzJykgIT09ICdjYW5uZWQnO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwZXJzb25hbGl0eU1vZGVscyA9IHBhcnRpdGlvbmVkUXVlc3Rpb25Nb2RlbHNbMF07XG4gICAgICAgICAgICB2YXIgY2FubmVkTW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbk1vZGVsc1sxXTtcblxuICAgICAgICAgICAgdmFyIGVudGVyTmFtZVZpZXcgPSBuZXcgRW50ZXJOYW1lVmlldygpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdENoYXJWaWV3ID0gbmV3IFNlbGVjdENoYXJhY3RlclZpZXcoe21vZGVsOiBjaGFyTW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5Vmlld3MgPSBfLm1hcChwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXN0aW9uVmlldyh7bW9kZWw6IG1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB2YXIgY2FubmVkVmlld3MgPSBfLm1hcChjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDYW5uZWRRdWVzdGlvblZpZXcoe21vZGVsOiBtb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuXG5cbiAgICAgICAgICAgIHRoaXMuY2FubmVkVmlld3MgPSBjYW5uZWRWaWV3cztcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0Q2hhcmFjdGVyVmlldyA9IHNlbGVjdENoYXJWaWV3O1xuXG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gW2VudGVyTmFtZVZpZXcsIHNlbGVjdENoYXJWaWV3XS5jb25jYXQocGVyc29uYWxpdHlWaWV3cywgY2FubmVkVmlld3MpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYucGFnZXMtY3RuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYgPSB0aGlzLiRwYWdlc0NvbnRhaW5lci5maW5kKCdkaXYucGFnZS1uYXYnKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EubmV4dCcpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5maW5pc2gtc2VuZCcpO1xuXG4gICAgICAgICAgICB0aGlzLiRza2lwQ3RyID0gdGhpcy4kcGFnZU5hdi5maW5kKCdkaXYuc2tpcCcpO1xuICAgICAgICAgICAgdGhpcy4kc2tpcCA9IHRoaXMuJHNraXBDdHIuZmluZCgnYS5za2lwJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGhlYWRlciA9ICQoJyNoZWFkZXInKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBDYW5uZWQgUXVlc3Rpb24gVmlldyBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICB1cGRhdGVWaWV3T3B0aW9uc1dpdGhVbnVzZWQ6IGZ1bmN0aW9uKGNhbm5lZFZpZXcpIHtcbiAgICAgICAgICAgIHZhciB1c2VkT3B0aW9ucyA9IF8uY29tcGFjdChnZXRWYWx1ZXModGhpcy5jYW5uZWRWaWV3cykpO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGFsbFF1ZXN0aW9ucy5nZXRVbnVzZWRDYW5uZWRPcHRpb25zKDMsIHVzZWRPcHRpb25zKTtcblxuICAgICAgICAgICAgY2FubmVkVmlldy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBDaGFuZ2UgVmlldyBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93Rmlyc3RQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZXNbMF0uc2hvdygpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygnb3BhY2l0eScsIDApO1xuICAgICAgICAgICAgdGhpcy4kbmV4dC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLiRza2lwLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdihmYWxzZSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwYWdlTmF2LCAwLjMsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dFBhZ2U6IF8udGhyb3R0bGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAvL2hpZGUgYWN0aXZlIHBhZ2VcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4ICsgMV07XG5cbiAgICAgICAgICAgIGlmKG5leHRQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZChuZXh0UGFnZSk7XG5cbiAgICAgICAgICAgICAgICBpZighYWN0aXZlUGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NraXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9hY3RpdmUgcGFnZSBpcyBjaGFyYWN0ZXIgc2VsZWN0XG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FubmVkQ29weSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IHRoaXMuc2VsZWN0Q2hhcmFjdGVyVmlldy5tb2RlbC5nZXQoJ3RleHQnKTtcblxuICAgICAgICAgICAgICAgIGdhKCdzZW5kJywgJ2V2ZW50JywgJ0NoYXJhY3RlciBTZWxlY3QnLCBjaGFyYWN0ZXIsIGlwQWRkcmVzcyk7XG5cbiAgICAgICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hbmltYXRlIGluIGNoYXJhY3RlclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVJblVzZXJDaGFyYWN0ZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2JpbGVDaGFyYWN0ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUodGhpcy5zaG93UGFnZUFmdGVySGlkZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdih0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5mb290ZXIuc2V0Q291bnRlcih0aGlzLmFjdGl2ZVBhZ2VJbmRleCk7XG4gICAgICAgIH0sIDIwMCwge3RyYWlsaW5nOiBmYWxzZX0pLFxuXG4gICAgICAgIHNob3dNb2JpbGVDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IHRoaXMuc2VsZWN0Q2hhcmFjdGVyVmlldy5tb2RlbC5nZXQoJ3ZhbHVlJyk7XG5cbiAgICAgICAgICAgIGlmKGNoYXJhY3RlciA9PT0gJ3RlYW0nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TW9iaWxlVGVhbSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyICRtb2JpbGVDaGFyYWN0ZXJzID0gJCgnI21vYmlsZS1jaGFyYWN0ZXJzJykuZmluZCgnZGl2LmNoYXJhY3RlcicpO1xuXG4gICAgICAgICAgICB2YXIgJGNoYXJhY3RlciA9ICRtb2JpbGVDaGFyYWN0ZXJzLmZpbHRlcignLicrY2hhcmFjdGVyKTtcblxuICAgICAgICAgICAgJGNoYXJhY3Rlci5hZGRDbGFzcygnYWN0aXZlIHNlbGVjdGVkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dNb2JpbGVUZWFtOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkbW9iaWxlQ2hhcmFjdGVycyA9ICQoJyNtb2JpbGUtY2hhcmFjdGVycycpLmZpbmQoJ2Rpdi5jaGFyYWN0ZXInKTtcblxuICAgICAgICAgICAgdmFyICRjaGFyYWN0ZXJzID0gJG1vYmlsZUNoYXJhY3RlcnMuZmlsdGVyKCcuZHVzdHkzLCAuZGlwcGVyLCAuY2FiYmllMiwgLmJsYWRlcmFuZ2VyLCAud2luZGxpZnRlcicpO1xuXG4gICAgICAgICAgICAkY2hhcmFjdGVycy5hZGRDbGFzcygnYWN0aXZlIHRlYW0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93UGFnZUFmdGVySGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4LTFdO1xuICAgICAgICAgICAgaWYobGFzdFBhZ2UuaXNDYW5uZWQoKSkge1xuICAgICAgICAgICAgICAgIGxhc3RQYWdlLnJlbW92ZU9wdGlvbnMoKTsgICAvL2Nhbm5lZCBvcHRpb25zIGFyZSByZXBlYXRlZCBhbmQgc2hhcmUgdGhlIHNhbWUgSURcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaG93IG5leHQgcGFnZVxuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG5cbiAgICAgICAgICAgIG5leHRQYWdlLm9uU2hvd0NvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgbmV4dFBhZ2Uuc2hvdygpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gdGhpcy5wYWdlcy5sZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmlzaEJ0bigpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2hvd0ZpbmlzaEJ0bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0LmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGZpbmlzaFNlbmQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEFuZFNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuaGlkZUNvdW50ZXIoKTtcblxuICAgICAgICAgICAgdmFyIHBhZ2VNb2RlbHMgPSBfLm1hcCh0aGlzLnBhZ2VzLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UubW9kZWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VWaWV3LnNldFJlc3BvbnNlKHBhZ2VNb2RlbHMpO1xuXG4gICAgICAgICAgICBnYSgnc2VuZCcsICdldmVudCcsICdGaW5pc2ggYW5kIHNlbmQgbGV0dGVyJywgJ2NsaWNrJywgaXBBZGRyZXNzKTtcblxuICAgICAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vblVzZXJDaGFyYWN0ZXJPdXQoXy5iaW5kKHRoaXMuc2NlbmUucGxheVdpcGVzY3JlZW4sIHRoaXMuc2NlbmUpKTtcblxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vbldpcGVzY3JlZW5Db21wbGV0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUucmVzcG9uc2VWaWV3LnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2NlbmUuc2hvd1Jlc3BvbnNlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJyNtb2JpbGUtYmFja2dyb3VuZHMnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldy5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlcG9zaXRpb25QYWdlTmF2OiBmdW5jdGlvbihhbmltYXRlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgcGl4ZWxQb3NpdGlvbiA9IChhY3RpdmVQYWdlLiRlbC5vZmZzZXQoKS50b3AgKyBhY3RpdmVQYWdlLiRlbC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgICAgICAgdmFyIGRvY0hlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpO1xuXG4gICAgICAgICAgICB2YXIgdG9wRnJhYyA9IE1hdGgubWluKHBpeGVsUG9zaXRpb24vZG9jSGVpZ2h0LCAoZG9jSGVpZ2h0IC0gdGhpcy5mb290ZXIuaGVpZ2h0KCkgLSB0aGlzLiRwYWdlTmF2Lm91dGVySGVpZ2h0KCkpL2RvY0hlaWdodCk7XG5cbiAgICAgICAgICAgIHZhciBwZXJjVG9wID0gMTAwICogdG9wRnJhYyArICclJztcblxuICAgICAgICAgICAgaWYoISFhbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSBpc01vYmlsZSA/IDAuMSA6IDAuMjtcblxuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwYWdlTmF2LCBhbmltYXRpb25UaW1lLCB7dG9wOiBwZXJjVG9wLCBlYXNlOidRdWFkLmVhc2VJbk91dCd9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygndG9wJywgcGVyY1RvcCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBoaWRlU2tpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJHNraXBDdHIuY3NzKHtoZWlnaHQ6IDB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kc2tpcCwgMC4yLCB7Ym90dG9tOiAnMTAwJScsIG9wYWNpdHk6IDB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1NraXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRza2lwQ3RyLmF0dHIoJ3N0eWxlJywgJycpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRza2lwLCAwLjIsIHtib3R0b206IDAsIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93Q29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuc2hvdygpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlQ29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVDYW5uZWRDb3B5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXIgPSB0aGlzLnNlbGVjdENoYXJhY3RlclZpZXcuZ2V0U2VsZWN0ZWRDaGFyYWN0ZXIoKTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuY2FubmVkVmlld3MsIGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldENoYXJhY3RlcihjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIGxvYWRlci5zdGFydCh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcuc2hvd0JlZ2luU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25OZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF0ubW9kZWwuYXR0cmlidXRlcy52YWx1ZSA9PT0gJydcbiAgICAgICAgICAgICAgICB8fCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA+PSAodGhpcy5wYWdlcy5sZW5ndGggLSAxKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRmluaXNoOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuZmluaXNoQW5kU2VuZCgpO1xuICAgICAgICB9LFxuICAgICAgICBvbk1vdXNlTW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZihfLmlzVW5kZWZpbmVkKHRoaXMuc2NlbmUpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzKGUucGFnZVgvdGhpcy4kd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9LFxuICAgICAgICBvblNraXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hbmltYXRpbmcgfHwgdGhpcy5hY3RpdmVQYWdlSW5kZXggPj0gKHRoaXMucGFnZXMubGVuZ3RoIC0gMSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluVmlldztcblxuXG5cbn0pKCk7IiwiXG5cblxudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3F1ZXN0aW9uLmhicycpO1xudmFyIGl0ZW1BbmltYXRpb25zTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYWdlSXRlbXMnKTtcblxudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xudmFyIGlzTW9iaWxlID0gZGV2aWNlLmlzTW9iaWxlKCk7XG5cbnZhciBRdWVzdGlvblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgLy8gVmFyaWFibGVzXG4gICAgc2hvd0NhbGxiYWNrOiBmdW5jdGlvbigpe30sXG4gICAgaGlkZUNhbGxiYWNrOiBmdW5jdGlvbigpe30sXG4gICAgY2xhc3NOYW1lOiAncXVlc3Rpb24gcGFnZScsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBsYWJlbCc6ICdvblJhZGlvQ2hhbmdlJyxcbiAgICAgICAgJ3RvdWNoZW5kIGxhYmVsJzogJ29uUmFkaW9DaGFuZ2UnXG4gICAgfSxcbiAgICAvLyBGdW5jdGlvbnNcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAgICAgb3B0aW9ucy5wYXJlbnQuYXBwZW5kKHRoaXMuZWwpO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKHRoaXMubW9kZWwuYXR0cmlidXRlcy5jbGFzcyk7XG5cbiAgICAgICAgdGhpcy4kY29weSA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5jb3B5Jyk7XG4gICAgICAgIHRoaXMuJG9wdGlvbnMgPSB0aGlzLiRlbC5maW5kKCdkaXYub3B0aW9uJyk7XG4gICAgICAgIHRoaXMuJGlucHV0cyA9IHRoaXMuJGVsLmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dJyk7XG5cbiAgICAgICAgaWYodGhpcy4kb3B0aW9ucy5sZW5ndGggIT09IDAgJiYgIWlzTW9iaWxlKVxuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucygpO1xuICAgIH0sXG4gICAgZ2V0QW5pbWF0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHJldHVybiBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgfSxcbiAgICBpbml0QW5pbWF0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciBhbmltYXRpb25zID0gdGhpcy5nZXRBbmltYXRpb25zKCk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25JbiA9IGFuaW1hdGlvbnNbMF07XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0ID0gYW5pbWF0aW9uc1sxXTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluLnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2soKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0LnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgfSxcblxuICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmVsLmlubmVySFRNTCA9PT0gJycpXG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Jbi5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBvblNob3dDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyICRhY3RpdmVJbnB1dCA9IHRoaXMuJGlucHV0cy5maWx0ZXIoJ1tjaGVja2VkXScpO1xuICAgICAgICB2YXIgJGlucHV0ID0gJChlLmN1cnJlbnRUYXJnZXQpLnNpYmxpbmdzKCdpbnB1dCcpO1xuXG4gICAgICAgIGlmKCRhY3RpdmVJbnB1dCAhPT0gJGlucHV0KSB7XG4gICAgICAgICAgICAkYWN0aXZlSW5wdXQucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGV4dCA9ICRpbnB1dC5zaWJsaW5ncygnZGl2LnRleHQnKS5odG1sKCk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiAkaW5wdXQuYXR0cigndmFsdWUnKSwgdGV4dDogdGV4dH0pO1xuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgcmVzcG9uc2VNYXAgPSByZXF1aXJlKCcuLi9kYXRhL3Jlc3BvbnNlTWFwLmpzb24nKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9jYW5uZWRRdWVzdGlvbnMuanNvbicpO1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbicpO1xuXG4gICAgdmFyIHJlc3BvbnNlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9yZXNwb25zZU1vZHVsZScpO1xuXG4gICAgdmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xuICAgIHZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKiogU2V0dXAgQ2FubmVkL1BlcnNvbmFsaXR5IE9yZGVycyAqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgZnVuY3Rpb24gZ2V0T3JkZXIob3B0aW9ucywgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIF8uY2hhaW4ob3B0aW9ucylcbiAgICAgICAgICAgIC5wbHVjayhwcm9wZXJ0eSlcbiAgICAgICAgICAgIC5vYmplY3QoXy5yYW5nZShvcHRpb25zLmxlbmd0aCkpXG4gICAgICAgICAgICAudmFsdWUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb3JyZWN0UGVyc29uYWxpdHlNb2RlbChtb2RlbCwgcGVyc29uYWxpdHlNb2RlbHMpIHtcbiAgICAgICAgdmFyIHZhbCA9IG1vZGVsLmdldCgndmFsdWUnKTtcblxuICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbCA9IF8uZmlsdGVyKHBlcnNvbmFsaXR5TW9kZWxzLCBmdW5jdGlvbihtb2QpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwgPT09IG1vZC5nZXQoJ25hbWUnKTtcbiAgICAgICAgfSlbMF07XG5cbiAgICAgICAgcmV0dXJuIHBlcnNvbmFsaXR5TW9kZWw7XG4gICAgfVxuXG5cbiAgICB2YXIgY2FubmVkT3JkZXIgPSBnZXRPcmRlcihjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucywgJ3ZhbHVlJyk7XG4gICAgdmFyIHBlcnNvbmFsaXR5T3JkZXIgPSBnZXRPcmRlcihwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YS5xdWVzdGlvbnMsICduYW1lJyk7XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVzcG9uc2UgVmlldyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBmdW5jdGlvbiBpc0Fuc3dlcmVkKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5nZXQoJ3ZhbHVlJykgIT09ICcnO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBpc1RydWVDYW5uZWQodmFsdWUpIHtcbiAgICAgIHJldHVybiBfLmlzVW5kZWZpbmVkKHBlcnNvbmFsaXR5T3JkZXJbdmFsdWVdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsYXN0Q2hhcklzUHVuY3R1YXRpb24oc3RyKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJBdChzdHIubGVuZ3RoLTEpO1xuXG4gICAgICAgIHJldHVybiBjID09PSAnLicgfHwgYyA9PT0gJywnIHx8IGMgPT09ICchJztcbiAgICB9XG5cbiAgICB2YXIgUmVzcG9uc2VWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBjaGFyYWN0ZXI6ICcnLFxuICAgICAgICBlbDogJyNyZXNwb25zZScsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEjcHJpbnR2ZXJzaW9uJzogJ3ByaW50JyxcbiAgICAgICAgICAgICdjbGljayAjc2VuZG1vcmUnOiAnb25TZW5kTW9yZSdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQgPSAkKCcjcmVzcG9uc2UtYmcnKTtcbiAgICAgICAgICAgIHRoaXMuJHNpZ25hdHVyZSA9ICQoJyNjYXJkLWZyb20nKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVc2VybmFtZTogZnVuY3Rpb24obmFtZU1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZU1vZGVsLmdldCgndmFsdWUnKSB8fCAnRnJpZW5kJztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDYW5uZWRSZXNwb25zZXM6IGZ1bmN0aW9uKGNhbm5lZFZhbHVlcywgY2hhcmFjdGVyKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF8uY2hhaW4oY2FubmVkVmFsdWVzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIGNhbm5lZE9yZGVyW3ZhbHVlXTsgfSkgICAgLy8gc29ydCBiYXNlZCBvbiBjYW5uZWRPcmRlciBvYmplY3QgYWJvdmVcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW3ZhbHVlXTsgfSkgLy8gZ3JhYiByZXNwb25zZXMgZm9yIGVhY2ggcXVlc3Rpb25cbiAgICAgICAgICAgICAgICAudmFsdWUoKTsgICAgICAgLy8gZXhpdCBjaGFpblxuXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc29uYWxpdHlSZXNwb25zZXM6IGZ1bmN0aW9uKHBlcnNvbmFsaXR5Q2FubmVkTW9kZWxzLCBwZXJzb25hbGl0eU1vZGVscywgY2hhcmFjdGVyKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF8uY2hhaW4ocGVyc29uYWxpdHlDYW5uZWRNb2RlbHMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeShmdW5jdGlvbihtb2RlbCkgeyByZXR1cm4gcGVyc29uYWxpdHlPcmRlclttb2RlbC5nZXQoJ3ZhbHVlJyldOyB9KSAgICAvLyBzb3J0IGJhc2VkIG9uIHBlcnNvbmFsaXR5T3JkZXIgb2JqZWN0IGFib3ZlXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtb2RlbCkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgcmVzcG9uc2VzIGZvciBlYWNoIHF1ZXN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBwZXJzb25hbGl0eU1vZGVsID0gZ2V0Q29ycmVjdFBlcnNvbmFsaXR5TW9kZWwobW9kZWwsIHBlcnNvbmFsaXR5TW9kZWxzKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBlcnNvbmFsaXR5TW9kZWwuZ2V0KCd2YWx1ZScpID09PSAnZnJlbmNoZnJpZXMnIHx8IHBlcnNvbmFsaXR5TW9kZWwuZ2V0KCd2YWx1ZScpID09PSAnY2hpY2tlbm51Z2dldHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuZ2V0KCd2YWx1ZScpICsgJy1wbHVyYWwnXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVttb2RlbC5nZXQoJ3ZhbHVlJyldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgnJXRlbXBsYXRlJScsIHBlcnNvbmFsaXR5TW9kZWwuZ2V0KCd0ZXh0JykpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnZhbHVlKCk7ICAgICAgIC8vIGV4aXQgY2hhaW5cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgc2V0UmVzcG9uc2U6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgICAgICAgdmFyIG5hbWVNb2RlbCA9IG1vZGVsc1swXTtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXJNb2RlbCA9IG1vZGVsc1sxXTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbk1vZGVscyA9IF8ucmVzdChtb2RlbHMsIDIpO1xuXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldFVzZXJuYW1lKG5hbWVNb2RlbCk7XG4gICAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gY2hhcmFjdGVyTW9kZWwuZ2V0KCd2YWx1ZScpO1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXI7XG5cbiAgICAgICAgICAgIHZhciBhbnN3ZXJlZFF1ZXN0aW9ucyA9IF8uZmlsdGVyKHF1ZXN0aW9uTW9kZWxzLCBpc0Fuc3dlcmVkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNhbm5lZE1vZGVscyA9IF8uZmlsdGVyKGFuc3dlcmVkUXVlc3Rpb25zLCBmdW5jdGlvbihtb2RlbCkgeyByZXR1cm4gbW9kZWwuZ2V0KCdjbGFzcycpID09PSAnY2FubmVkJzsgfSk7XG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBfLmZpbHRlcihhbnN3ZXJlZFF1ZXN0aW9ucywgZnVuY3Rpb24obW9kZWwpIHsgcmV0dXJuIG1vZGVsLmdldCgnY2xhc3MnKSAhPT0gJ2Nhbm5lZCc7IH0pO1xuXG5cbiAgICAgICAgICAgIHZhciB0cnVlQ2FubmVkVmFsdWVzO1xuICAgICAgICAgICAgaWYoY2FubmVkTW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICB0cnVlQ2FubmVkVmFsdWVzID0gXy5jaGFpbihjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucylcbiAgICAgICAgICAgICAgICAgIC5wbHVjaygndmFsdWUnKVxuICAgICAgICAgICAgICAgICAgLmZpbHRlcihpc1RydWVDYW5uZWQpXG4gICAgICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRydWVDYW5uZWRWYWx1ZXMgPSBfLmNoYWluKGNhbm5lZE1vZGVscylcbiAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obW9kZWwpIHsgcmV0dXJuIG1vZGVsLmdldCgndmFsdWUnKTsgfSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaXNUcnVlQ2FubmVkKVxuICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5Q2FubmVkTW9kZWxzID0gXy5maWx0ZXIoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge3JldHVybiAhaXNUcnVlQ2FubmVkKG1vZGVsLmdldCgndmFsdWUnKSk7IH0pO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjYW5uZWRSZXNwb25zZXMgPSB0aGlzLmdldENhbm5lZFJlc3BvbnNlcyh0cnVlQ2FubmVkVmFsdWVzLCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5UmVzcG9uc2VzID0gdGhpcy5nZXRQZXJzb25hbGl0eVJlc3BvbnNlcyhwZXJzb25hbGl0eUNhbm5lZE1vZGVscywgcGVyc29uYWxpdHlNb2RlbHMsIGNoYXJhY3Rlcik7XG5cblxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5hZGRDbGFzcyhjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgdGhpcy4kc2lnbmF0dXJlLmFkZENsYXNzKGNoYXJhY3Rlcik7XG5cblxuXG4gICAgICAgICAgICB2YXIgZ3JlZXRpbmcgPSByZXNwb25zZU1hcFtjaGFyYWN0ZXJdWydncmVldGluZyddLnJlcGxhY2UoJyV0ZW1wbGF0ZSUnLCB1c2VyTmFtZSk7XG4gICAgICAgICAgICB2YXIgYm9keTEgPSByZXNwb25zZU1hcFtjaGFyYWN0ZXJdWydib2R5MSddO1xuICAgICAgICAgICAgdmFyIGJvZHkyID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnYm9keTInXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgdXNlck5hbWUpO1xuICAgICAgICAgICAgdmFyIHNpbmNlcmVseSA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl0uc2luY2VyZWx5O1xuXG4gICAgICAgICAgICBpZighbGFzdENoYXJJc1B1bmN0dWF0aW9uKHNpbmNlcmVseSkpIHtcbiAgICAgICAgICAgICAgICBzaW5jZXJlbHkgKz0gJywnO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGJvZHkxICsgJyAnICsgY2FubmVkUmVzcG9uc2VzLmpvaW4oJyAnKSArICcgJyArIHBlcnNvbmFsaXR5UmVzcG9uc2VzLmpvaW4oJyAnKSArICcgJyArIGJvZHkyO1xuXG5cbiAgICAgICAgICAgICQoJyNjYXJkLWdyZWV0aW5nJykuaHRtbChncmVldGluZyk7XG4gICAgICAgICAgICAkKCcjY2FyZC1ib2R5JykuaHRtbChyZXNwb25zZSk7XG4gICAgICAgICAgICAkKCcjY2FyZC1zaW5jZXJlbHknKS5odG1sKHNpbmNlcmVseSk7XG4vLyAgICAgICAgICAgICQoJyNjYXJkLWZyb20nKS5odG1sKGNoYXJhY3Rlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcblxuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZU1vZHVsZS5hbmltYXRlSW4odGhpcy5jaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyICRsZXR0ZXJCZ0N0ciA9ICQoJyNsZXR0ZXJiZy1jdHInKTtcbiAgICAgICAgICAgICAgICB2YXIgJGNhcmRXcmFwID0gJCgnI2NhcmQtd3JhcCcpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9ICRjYXJkV3JhcC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAgICAgJGxldHRlckJnQ3RyLmhlaWdodChoZWlnaHQpO1xuICAgICAgICAgICAgICAgICRsZXR0ZXJCZ0N0ci5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldE1vYmlsZUNvbnRlbnRIZWlnaHQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd01vYmlsZUNoYXJhY3RlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRNb2JpbGVDb250ZW50SGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkc2VuZE1vcmUgPSAkKCcjc2VuZG1vcmUnKTtcbiAgICAgICAgICAgIHZhciAkZm9vdGVyID0gJCgnI2Zvb3RlcicpO1xuICAgICAgICAgICAgdmFyICRjb250ZW50ID0gJCgnI2NvbnRlbnQnKTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9ICRzZW5kTW9yZS5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gJHNlbmRNb3JlLmhlaWdodCgpO1xuICAgICAgICAgICAgdmFyIGZvb3RlckhlaWdodCA9ICRmb290ZXIuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICRjb250ZW50LmNzcygnbWluLWhlaWdodCcsIG9mZnNldFRvcCoxLjA0ICsgaGVpZ2h0ICsgZm9vdGVySGVpZ2h0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93TW9iaWxlQ2hhcmFjdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJG1vYmlsZUN0ciA9ICQoJyNtb2JpbGUtY2hhcmFjdGVycycpO1xuXG4gICAgICAgICAgICB2YXIgJGFjdGl2ZUNoYXJhY3RlcnMgPSAkbW9iaWxlQ3RyLmZpbmQoJ2Rpdi5jaGFyYWN0ZXIuYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuY2hhcmFjdGVyID09PSAndGVhbScpIHtcbiAgICAgICAgICAgICAgICAkYWN0aXZlQ2hhcmFjdGVycy5maWx0ZXIoJy5kdXN0eTMnKS5yZW1vdmVDbGFzcygnYWN0aXZlIHRlYW0gcmVzcG9uc2UnKTtcblxuICAgICAgICAgICAgICAgICRtb2JpbGVDdHIuZmluZCgnZGl2LmNoYXJhY3Rlci5kdXN0eTInKS5hZGRDbGFzcygnYWN0aXZlIHRlYW0gcmVzcG9uc2UgZnJvbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyYWN0ZXIgPT09ICdkdXN0eScpIHtcbiAgICAgICAgICAgICAgICAkYWN0aXZlQ2hhcmFjdGVycy5yZW1vdmVDbGFzcygnYWN0aXZlIHRlYW0gcmVzcG9uc2UnKTtcblxuICAgICAgICAgICAgICAgICRtb2JpbGVDdHIuZmluZCgnZGl2LmNoYXJhY3Rlci5kdXN0eTInKS5hZGRDbGFzcygnYWN0aXZlIHJlc3BvbnNlIGZyb250Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRhY3RpdmVDaGFyYWN0ZXJzLmFkZENsYXNzKCdmcm9udCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkYWN0aXZlQ2hhcmFjdGVycy5hZGRDbGFzcygncmVzcG9uc2UnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgcHJpbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vIHdpbmRvdy5wcmludCgpO1xuXG4gICAgICAgICAgICB2YXIgZyA9ICQoJyNjYXJkLWdyZWV0aW5nJykuaHRtbCgpO1xuICAgICAgICAgICAgdmFyIGIgPSAkKCcjY2FyZC1ib2R5JykuaHRtbCgpO1xuICAgICAgICAgICAgdmFyIHMgPSAkKCcjY2FyZC1zaW5jZXJlbHknKS5odG1sKCk7XG4vLyAgICAgICAgICAgIHZhciBmID0gJCgnI2NhcmQtZnJvbScpLmh0bWwoKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJ3ByaW50LnBocCcgKyAnP2NoYXI9JyArIHRoaXMuY2hhcmFjdGVyICsgJyZncmVldGluZz0nKyBnICsgJyZib2R5PScgKyBiICsgJyZzaW5jZXJlbHk9JyArIHMgKyAnJmZyb209JyArIHRoaXMuY2hhcmFjdGVyKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBvblNlbmRNb3JlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgICAgICB2YXIgbmV3VGFiID0gKDIgPT09IGUud2hpY2ggfHwgZS5tZXRhS2V5IHx8IGUuY3RybEtleSk7XG5cbiAgICAgICAgICAgIGdhKCdzZW5kJywgJ2V2ZW50JywgJ01vcmUgYWlybWFpbCcsICdjbGljaycsIGlwQWRkcmVzcywge1xuICAgICAgICAgICAgICAgIGhpdENhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24gPSB1cmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VWaWV3O1xufSkoKTsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi4vZGF0YS9hdWRpb0Fzc2V0cy5qc29uJyk7XG5cbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcblxuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG4gICAgdmFyIGNoYXJhY3RlckF1ZGlvSWRzID0gYXVkaW9Bc3NldHMuY2hhcmFjdGVyQXVkaW9JZHM7XG5cbiAgICB2YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG4gICAgdmFyIGlzTW9iaWxlID0gZGV2aWNlLmlzTW9iaWxlKCk7XG5cbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IFF1ZXN0aW9uVmlldy5leHRlbmQoe1xuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIC8vcGFyZW50IGNvbnN0cnVjdG9yXG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTW9iaWxlQ2hhcmFjdGVycygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnNob3cuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlTW9iaWxlQ2hhcmFjdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJG1vYmlsZUNoYXJhY3RlcnMgPSAkKCcjbW9iaWxlLWNoYXJhY3RlcnMnKS5maW5kKCdkaXYuY2hhcmFjdGVyJyk7XG5cbiAgICAgICAgICAgICRtb2JpbGVDaGFyYWN0ZXJzLnJlbW92ZUNsYXNzKCdhY3RpdmUgaW50cm8gZmxpcCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNlbGVjdGVkQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgndGV4dCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLm9uUmFkaW9DaGFuZ2UuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5zaWJsaW5ncygnaW5wdXQnKTtcblxuICAgICAgICAgICAgdmFyIGNoYXIgPSAkaW5wdXQuYXR0cignaWQnKTtcblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQucGxheShjaGFyYWN0ZXJBdWRpb0lkc1tjaGFyXSk7XG5cbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5zZXRDaGFyYWN0ZXIoY2hhcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
