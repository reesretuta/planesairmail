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
    dusty.setStatic();

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
},{"../pixi/allCharacters":22,"./placeJustOffscreen":8}],4:[function(require,module,exports){


"use strict";


var placeJustOffscreen = require('./placeJustOffscreen');

var allCharacters = require('../pixi/allCharacters');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var dusty, dipper, timelineIn, timelineOut;

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

    dusty.idle.windowScale = 0.4;
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
            dusty.destroy();

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
        windowY: -0.1,
        windowX: 0.6,
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
    return PIXI.getTextures('assets/spritesheets/logo/PLANE_logo_tall_0000', 0, 72);
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
        },
        onComplete: function() {
            video.destroy();

            videoCompleteCallback();
        }
    });

    timeline.append(TweenLite.to(video, animationTime, {
        tweenFrame: numFrames-1,
        ease: easing
    }));

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
    var scale = Math.min(newLogoHeight/(bounds.height - 55), 1.2);

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
    var sideWidth = (width-frameWidth)/2;
    var topHeight = (height/2-frameHeight);

    bgColors.topLeft.scale.x = sideWidth;
    bgColors.topLeft.scale.y = height/2;

    bgColors.top.scale.x = width;
    bgColors.top.scale.y = topHeight;

    bgColors.topRight.scale.x = sideWidth;
    bgColors.topRight.scale.y = height/2;
    bgColors.topRight.windowX = frameWidth/(2*width);
}
function updateBtmFrameBackground(width, height, frameWidth, frameHeight) {
    var sideWidth = (width-frameWidth)/2;
    var btmHeight = (height/2-frameHeight);

    bgColors.btmLeft.scale.x = sideWidth;
    bgColors.btmLeft.scale.y = height/2;

    bgColors.btm.scale.x = width;
    bgColors.btm.scale.y = btmHeight;
    bgColors.btm.windowY = frameHeight/height;

    bgColors.btmRight.scale.x = sideWidth;
    bgColors.btmRight.scale.y = height/2;
    bgColors.btmRight.windowX = frameWidth/(2*width);
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

var animateIn = (function() {
    var animationTime = 1.2;
    var easing = 'Cubic.easeInOut';

    return {
        dusty: function() {
            var dusty = allCharacters.dustyDark;

            dusty.idle.windowScale = 0.37;
            dusty.windowX = 0.2;
            placeJustOffscreen(dusty);

            TweenLite.to(dusty, animationTime, {
                windowX: 0.71,
                windowY: 0.23
            });
        },
        bladeranger: function() {
            var blade = allCharacters.blade;

            blade.idle.windowScale = 0.5;
            blade.windowX = 0.3;
            placeJustOffscreen(blade);

            TweenLite.to(blade, animationTime, {
                windowX: 0.74,
                windowY: 0.24
            });
        },
        cabbie: function() {
            var cabbie = allCharacters.cabbie;

            cabbie.idle.windowScale = 0.6;
            placeJustOffscreen(cabbie);
            cabbie.windowX = 0.5;
            cabbie.rotation = 0.65;

            TweenLite.to(cabbie, animationTime, {
                windowX: 0.55,
                windowY: 0.24
            });
        },
        dipper: function() {
            var dipper = allCharacters.dipper;

            dipper.idle.windowScale = 0.4;
            placeJustOffscreen(dipper);
            dipper.windowX = 0.6;
            dipper.scale.x = 1;
            dipper.rotation = 0.2;

           TweenLite.to(dipper, animationTime, {
               windowX: 0.47,
               windowY: 0.24
           });
        },
        windlifter: function() {
            var windlifter = allCharacters.windlifter;

            windlifter.idle.windowScale = 0.45;
            placeJustOffscreen(windlifter);
            windlifter.windowX = 0.5;

            TweenLite.to(windlifter, animationTime, {
                windowX: 0.14,
                windowY: 0.27
            });
        },
        team: function() {
            "use strict";


        }
    };
})();





module.exports = {
    animateIn: function(character) {
        animateIn[character]();
    }
};
},{"../animations/placeJustOffscreen":8,"../pixi/allCharacters":22}],10:[function(require,module,exports){



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
	"totalSize": 15751020,
	"assets": {
		"assets/img/PG.png": 1552,
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
		"assets/img/intro-btm.png": 81955,
		"assets/img/intro-top.png": 79346,
		"assets/img/logo.png": 129128,
		"assets/img/midground.png": 64689,
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
		"assets/spritesheets/cabbie/Cabbie_00000.png": 26478,
		"assets/spritesheets/cabbie/Cabbie_00001.png": 26292,
		"assets/spritesheets/cabbie/Cabbie_00002.png": 26659,
		"assets/spritesheets/cabbie/Cabbie_00003.png": 27871,
		"assets/spritesheets/cabbie/Cabbie_00004.png": 26478,
		"assets/spritesheets/cabbie/Cabbie_00005.png": 26292,
		"assets/spritesheets/cabbie/Cabbie_00006.png": 26659,
		"assets/spritesheets/cabbie/Cabbie_00007.png": 27871,
		"assets/spritesheets/cabbie/Cabbie_00008.png": 26478,
		"assets/spritesheets/cabbie/Cabbie_00009.png": 26292,
		"assets/spritesheets/cabbie/Cabbie_00010.png": 26659,
		"assets/spritesheets/cabbie/Cabbie_00011.png": 27871,
		"assets/spritesheets/dipper/Dipper_00000.png": 21875,
		"assets/spritesheets/dipper/Dipper_00001.png": 21750,
		"assets/spritesheets/dipper/Dipper_00002.png": 21993,
		"assets/spritesheets/dipper/Dipper_00003.png": 22667,
		"assets/spritesheets/dipper/Dipper_00004.png": 21875,
		"assets/spritesheets/dipper/Dipper_00005.png": 21750,
		"assets/spritesheets/dipper/Dipper_00006.png": 21993,
		"assets/spritesheets/dipper/Dipper_00007.png": 22667,
		"assets/spritesheets/dipper/Dipper_00008.png": 21875,
		"assets/spritesheets/dipper/Dipper_00009.png": 21750,
		"assets/spritesheets/dipper/Dipper_00010.png": 21993,
		"assets/spritesheets/dipper/Dipper_00011.png": 22667,
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
		"assets/spritesheets/logo/PLANE_logo_tall_000000.png": 726,
		"assets/spritesheets/logo/PLANE_logo_tall_000001.png": 1410,
		"assets/spritesheets/logo/PLANE_logo_tall_000002.png": 1962,
		"assets/spritesheets/logo/PLANE_logo_tall_000003.png": 4978,
		"assets/spritesheets/logo/PLANE_logo_tall_000004.png": 10156,
		"assets/spritesheets/logo/PLANE_logo_tall_000005.png": 14054,
		"assets/spritesheets/logo/PLANE_logo_tall_000006.png": 17900,
		"assets/spritesheets/logo/PLANE_logo_tall_000007.png": 25656,
		"assets/spritesheets/logo/PLANE_logo_tall_000008.png": 26553,
		"assets/spritesheets/logo/PLANE_logo_tall_000009.png": 25997,
		"assets/spritesheets/logo/PLANE_logo_tall_000010.png": 25385,
		"assets/spritesheets/logo/PLANE_logo_tall_000011.png": 25943,
		"assets/spritesheets/logo/PLANE_logo_tall_000012.png": 27802,
		"assets/spritesheets/logo/PLANE_logo_tall_000013.png": 27504,
		"assets/spritesheets/logo/PLANE_logo_tall_000014.png": 27342,
		"assets/spritesheets/logo/PLANE_logo_tall_000015.png": 29012,
		"assets/spritesheets/logo/PLANE_logo_tall_000016.png": 29908,
		"assets/spritesheets/logo/PLANE_logo_tall_000017.png": 29489,
		"assets/spritesheets/logo/PLANE_logo_tall_000018.png": 31055,
		"assets/spritesheets/logo/PLANE_logo_tall_000019.png": 30716,
		"assets/spritesheets/logo/PLANE_logo_tall_000020.png": 30063,
		"assets/spritesheets/logo/PLANE_logo_tall_000021.png": 30850,
		"assets/spritesheets/logo/PLANE_logo_tall_000022.png": 30557,
		"assets/spritesheets/logo/PLANE_logo_tall_000023.png": 30433,
		"assets/spritesheets/logo/PLANE_logo_tall_000024.png": 30548,
		"assets/spritesheets/logo/PLANE_logo_tall_000025.png": 30586,
		"assets/spritesheets/logo/PLANE_logo_tall_000026.png": 30261,
		"assets/spritesheets/logo/PLANE_logo_tall_000027.png": 30510,
		"assets/spritesheets/logo/PLANE_logo_tall_000028.png": 30608,
		"assets/spritesheets/logo/PLANE_logo_tall_000029.png": 30010,
		"assets/spritesheets/logo/PLANE_logo_tall_000030.png": 30182,
		"assets/spritesheets/logo/PLANE_logo_tall_000031.png": 29934,
		"assets/spritesheets/logo/PLANE_logo_tall_000032.png": 29843,
		"assets/spritesheets/logo/PLANE_logo_tall_000033.png": 30322,
		"assets/spritesheets/logo/PLANE_logo_tall_000034.png": 29883,
		"assets/spritesheets/logo/PLANE_logo_tall_000035.png": 29925,
		"assets/spritesheets/logo/PLANE_logo_tall_000036.png": 29806,
		"assets/spritesheets/logo/PLANE_logo_tall_000037.png": 29989,
		"assets/spritesheets/logo/PLANE_logo_tall_000038.png": 29377,
		"assets/spritesheets/logo/PLANE_logo_tall_000039.png": 29830,
		"assets/spritesheets/logo/PLANE_logo_tall_000040.png": 29907,
		"assets/spritesheets/logo/PLANE_logo_tall_000041.png": 29433,
		"assets/spritesheets/logo/PLANE_logo_tall_000042.png": 29319,
		"assets/spritesheets/logo/PLANE_logo_tall_000043.png": 28859,
		"assets/spritesheets/logo/PLANE_logo_tall_000044.png": 27751,
		"assets/spritesheets/logo/PLANE_logo_tall_000045.png": 28409,
		"assets/spritesheets/logo/PLANE_logo_tall_000046.png": 27363,
		"assets/spritesheets/logo/PLANE_logo_tall_000047.png": 27241,
		"assets/spritesheets/logo/PLANE_logo_tall_000048.png": 27448,
		"assets/spritesheets/logo/PLANE_logo_tall_000049.png": 26918,
		"assets/spritesheets/logo/PLANE_logo_tall_000050.png": 27473,
		"assets/spritesheets/logo/PLANE_logo_tall_000051.png": 26489,
		"assets/spritesheets/logo/PLANE_logo_tall_000052.png": 25144,
		"assets/spritesheets/logo/PLANE_logo_tall_000053.png": 24671,
		"assets/spritesheets/logo/PLANE_logo_tall_000054.png": 23937,
		"assets/spritesheets/logo/PLANE_logo_tall_000055.png": 22225,
		"assets/spritesheets/logo/PLANE_logo_tall_000056.png": 21069,
		"assets/spritesheets/logo/PLANE_logo_tall_000057.png": 21479,
		"assets/spritesheets/logo/PLANE_logo_tall_000058.png": 20366,
		"assets/spritesheets/logo/PLANE_logo_tall_000059.png": 19667,
		"assets/spritesheets/logo/PLANE_logo_tall_000060.png": 19927,
		"assets/spritesheets/logo/PLANE_logo_tall_000061.png": 20130,
		"assets/spritesheets/logo/PLANE_logo_tall_000062.png": 19665,
		"assets/spritesheets/logo/PLANE_logo_tall_000063.png": 19216,
		"assets/spritesheets/logo/PLANE_logo_tall_000064.png": 19107,
		"assets/spritesheets/logo/PLANE_logo_tall_000065.png": 18322,
		"assets/spritesheets/logo/PLANE_logo_tall_000066.png": 18113,
		"assets/spritesheets/logo/PLANE_logo_tall_000067.png": 16621,
		"assets/spritesheets/logo/PLANE_logo_tall_000068.png": 14635,
		"assets/spritesheets/logo/PLANE_logo_tall_000069.png": 13163,
		"assets/spritesheets/logo/PLANE_logo_tall_000070.png": 10522,
		"assets/spritesheets/logo/PLANE_logo_tall_000071.png": 7863,
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
    "dusty": "assets/audio/dusty.mp3",
    "bladeranger": "assets/audio/blade.mp3",
    "cabbie": "assets/audio/cabbie.mp3",
    "dipper": "assets/audio/dipper.mp3",
    "windlifter": "assets/audio/windlifter.mp3",
    "team": "assets/audio/team.mp3"
}
},{}],14:[function(require,module,exports){
module.exports={
    "class": "canned",
    "copy": "Now that we know more about you, it's your turn to ask fire ranger some questions",
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
        "greeting": "Hi Hot Stuff!",
        "body1": "I was really excited to receive your airmail!",
        "body2": "I've gotta get back to fighting fires here, but you stay strong Hot Stuff!",
        "sincerely": "10-4",
        "job": "I'm a SEAT, or a Single-Engine Air Tanker, with the Piston Peak Air Attack Team, an elite group of firefighting aircraft.",
        "forestfires": "I can scoop water from lakes and dive into the forest to drop the water on wildfires. Speed counts when an air rescue is under way, so I'm always ready to fly into danger!",
        "firefighter": "Before joining the Air Attack Team, I was a world-famous air racer – I even raced around the world!  Now I race to put out fires.",
        "bestfriend": "It wasn't easy becoming a champion racer or a firefighter but I've had an amazing team of friends with me every step of the way!",
        "favoriteplace": "I have been flying for as long as I can remember but my favorite place to fly is above my hometown, Propwash Junction. I do some fancy flying there!",
        "favorite-food": "%template% sounds delicious! I mean, anything's better to eat than Vitaminamulch.",
        "favorite-color": "My favorite color is GREEN. Green means go! And I love to go fast.",
        "favorite-sport": "I was a champion racer not too long ago. Racing is definitely my favorite sport."
    },
    "dipper": {
        "greeting": "Hi there, Dust Muffin!",
        "body1": "I'm Dipper. That's what everyone calls me. So you can too!",
        "body2": "Thanks for writing to me %template%.",
        "sincerely": "Remember, the sky's the limit!",
        "job": "I have a really important job fighting wildfires. I'm a Super-scooper with the Piston Peak Attack Team.",
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
        "favoriteplace": "I like to fly many places and be one with the wind. The wind speaks, Windlifter listens.",
        "favorite-food": "%template% sounds delicious! Have you tried it with a can of oil? That's my favorite food.",
        "favorite-color": "My favorite color is BLUE like the water and the sky.",
        "favorite-sport": "I don't play many sports, but I am an avid weight lifter. You'll often see me lifting heavy loads of logs in my off time"
    },
    "bladeranger": {
        "greeting": "Hi Champ!",
        "body1": "I'm Blade Ranger. But my friends just call me Blade.",
        "body2": "Well, I should get back to work. Where there's smoke, there's fire fire attack! Thanks for your letter %template%.",
        "sincerely": "Your partner",
        "job": "I'm a Fire and Rescue Helicopter, and the Copter in Charge here at Piston Peak. ",
        "forestfires": "When there's a fire, I give the orders for the Air Attack Team to spring into action!",
        "firefighter": "I've been the Chopper Captain for a long time, but I wasn't always a firefighter. I was a TV star on a show about police helicopters! But I realized I didn't want to pretend to save lives, I wanted to save them for real!",
        "bestfriend": "My best friends are all the trailblazers here at Piston Peak. We like to think of ourselves as the heroes of the sky!",
        "favoriteplace": "I like to fly to many places, but my favorite place is above Piston Peak. I patrol the skies and make sure all the tourists are camping by the book. Remember, safety first!",
        "favorite-food": "You say you like to eat %template%? I prefer a fresh can of oil. ",
        "favorite-color": "My favorite color is RED, the color of Fire Safety.",
        "favorite-sport": "If I had to choose, football would be my favorite sport."
    },
    "cabbie": {
        "greeting": "Salute %template%!",
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
        "sincerely": "Hoist!",
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




},{"./device":18,"./pixi/libModifications":25,"./views/mainView":34}],20:[function(require,module,exports){




// =================================================================== //
/* ***************************** Loader ****************************** */
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
    loader.load();
}


module.exports = {
    start: startLoader
};
},{"./data/assets.json":12}],21:[function(require,module,exports){



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
},{"../animations/background":1,"../animations/bladewipe":2,"../animations/characterModule":3,"../animations/dustyDipper":4,"../animations/parachuters":7,"./allCharacters":22,"./extend":24,"./scene":27}],27:[function(require,module,exports){



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





var audioAssets = require('./data/audioAssets.json');

var soundPlayer = {
    muted: false,
    volume: 0.4,
    sounds: {},
    on: function() {
        this.muted = false;
    },
    off: function() {
        this.muted = true;
    },
    add: function(filePath) {
        this.sounds[filePath] = this.sounds[filePath] || new Audio(filePath);
    },
    play: function(filePath) {
        this.add(filePath);

        if(!this.muted) {
            this.sounds[filePath].volume = this.volume;
            this.sounds[filePath].play();
        }
    }
};


_.each(audioAssets, function(filePath) {
    soundPlayer.add(filePath);
});



module.exports = soundPlayer;
},{"./data/audioAssets.json":13}],30:[function(require,module,exports){
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

},{"hbsfy/runtime":45}],31:[function(require,module,exports){


(function() {
    "use strict";
    var device = require('../device');

    var scenesManager = require('../pixi/scenesManager');
    var dustyDipperModule = require('../animations/dustyDipper');

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
            var val = this.$nameInput.val();

            this.$placeholder.toggle(val === '');

            this.model.set({value: val});
        }
    });





    module.exports = EnterNameView;
})();

},{"../animations/dustyDipper":4,"../device":18,"../pixi/scenesManager":28}],32:[function(require,module,exports){





(function() {
    "use strict";

    var soundPlayer = require('../soundPlayer');

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
                soundPlayer.on();
            } else {
                this.volumeOffAnimation.play(0);
                soundPlayer.off();
            }
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
},{"../soundPlayer":29}],33:[function(require,module,exports){

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

            if(this.activePageIndex === 1 && !isMobile) {
                //animate in character
                this.scene.animateInUserCharacter();
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
            TweenLite.to(this.$skip, 0.2, {bottom: '100%'});
        },
        showSkip: function() {
            TweenLite.to(this.$skip, 0.2, {bottom: 0});
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
},{"../animations/intro":5,"../collections/allQuestions":11,"../device":18,"../loader":20,"../pixi/mainScene":26,"../pixi/scenesManager":28,"./enterNameView":31,"./footerView":32,"./introView":33,"./questionView":35,"./responseView":36,"./selectCharacterView":37}],35:[function(require,module,exports){

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

        this.$options = this.$el.find('div.option');

        if(this.$options.length !== 0 && !isMobile)
            this.initAnimations();
    },
    initAnimations: function() {
        "use strict";

        var animations;

        if(this.isCanned()) {
            animations = itemAnimationsModule.getRandomCannedAnimations(this.$options);
        } else {
            animations = itemAnimationsModule.getRandomPersonalityAnimations(this.$options);
        }

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
},{"../animations/pageItems":6,"../device":18,"../templates/question.hbs":30}],36:[function(require,module,exports){




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
        },
        
        setResponse: function(models) {
          
            var userName = (models[0].attributes.value == '') ? 'Friend' : models[0].attributes.value;
            var characterModel = models[1];
            
            this.$background.addClass(characterModel.attributes.value);
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
},{"../animations/responseModule":9,"../data/responseMap.json":17,"../device":18}],37:[function(require,module,exports){




(function() {
    "use strict";


    var soundPlayer = require('../soundPlayer');
    var audioAssets = require('../data/audioAssets.json');

    var QuestionView = require('./questionView');

    var characterModule = require('../animations/characterModule');


    var SelectCharacterView = QuestionView.extend({

        initialize: function(options) {
            //parent constructor
            QuestionView.prototype.initialize.call(this, options);
        },

        onRadioChange: function(e) {
            QuestionView.prototype.onRadioChange.call(this, e);

            var char = e.currentTarget.getAttribute('id');

            var filePath = audioAssets[char];

            soundPlayer.play(filePath);

            characterModule.setCharacter(char);
        }
    });











    module.exports = SelectCharacterView;
})();
},{"../animations/characterModule":3,"../data/audioAssets.json":13,"../soundPlayer":29,"./questionView":35}],38:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyby5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYWdlSXRlbXMuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGxhY2VKdXN0T2Zmc2NyZWVuLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9RdWVzdGlvbkNvbGxlY3Rpb24uanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucy5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvZGF0YS9hc3NldHMuanNvbiIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvZGF0YS9hdWRpb0Fzc2V0cy5qc29uIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL2RhdGEvcmVzcG9uc2VNYXAuanNvbiIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvZGV2aWNlLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9mYWtlX2I1MjViZTJmLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9sb2FkZXIuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL21vZGVscy9xdWVzdGlvbi5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvcGl4aS9hbGxDaGFyYWN0ZXJzLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy9waXhpL2NoYXJhY3Rlci5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvcGl4aS9leHRlbmQuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3BpeGkvbGliTW9kaWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvcGl4aS9tYWluU2NlbmUuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3BpeGkvc2NlbmUuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3BpeGkvc2NlbmVzTWFuYWdlci5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvc291bmRQbGF5ZXIuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3ZpZXdzL2VudGVyTmFtZVZpZXcuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3ZpZXdzL2Zvb3RlclZpZXcuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3ZpZXdzL2ludHJvVmlldy5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvdmlld3MvbWFpblZpZXcuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvanMvc3JjL3ZpZXdzL3F1ZXN0aW9uVmlldy5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9qcy9zcmMvdmlld3MvcmVzcG9uc2VWaWV3LmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL2pzL3NyYy92aWV3cy9zZWxlY3RDaGFyYWN0ZXJWaWV3LmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvcmVlc3JldHV0YS9TaXRlcy9CTFQvcGxhbmVzLWFpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIi9Vc2Vycy9yZWVzcmV0dXRhL1NpdGVzL0JMVC9wbGFuZXMtYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL3JlZXNyZXR1dGEvU2l0ZXMvQkxUL3BsYW5lcy1haXJtYWlsL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBiYWNrZ3JvdW5kLCBtaWRkbGVncm91bmQsIGZvcmVncm91bmQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBiYWNrZ3JvdW5kID0gaW5pdEJhY2tncm91bmQoKTtcbiAgICBtaWRkbGVncm91bmQgPSBpbml0TWlkZGxlZ3JvdW5kKCk7XG4gICAgZm9yZWdyb3VuZCA9IGluaXRGb3JlZ3JvdW5kKCk7XG59XG5mdW5jdGlvbiBzZXRBdHRycyhzcHJpdGUpIHtcbiAgICBzcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuICAgIHNwcml0ZS53aW5kb3dYID0gMC41O1xuICAgIHNwcml0ZS53aW5kb3dZID0gMTtcblxuICAgIHNwcml0ZS5zY2FsZVR5cGUgPSAnY292ZXInO1xuICAgIHNwcml0ZS53aW5kb3dTY2FsZSA9IDEuMDY7XG59XG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZCgpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9zaXRlX2JnLmpwZycpO1xuXG4gICAgc2V0QXR0cnMoYmFja2dyb3VuZCk7XG5cbiAgICByZXR1cm4gYmFja2dyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRNaWRkbGVncm91bmQoKSB7XG4gICAgdmFyIG1pZGRsZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9taWRncm91bmQucG5nJyk7XG4gICAgc2V0QXR0cnMobWlkZGxlZ3JvdW5kKTtcbiAgICByZXR1cm4gbWlkZGxlZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdEZvcmVncm91bmQoKSB7XG4gICAgdmFyIGZvcmVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9yZWdyb3VuZF90cmVlcy5wbmcnKTtcbiAgICBzZXRBdHRycyhmb3JlZ3JvdW5kKTtcbiAgICByZXR1cm4gZm9yZWdyb3VuZDtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFkZEJhY2tncm91bmRUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbiAgICB9LFxuICAgIGFkZFJlc3RUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChtaWRkbGVncm91bmQpO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChmb3JlZ3JvdW5kKTtcbiAgICB9LFxuICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGJhY2tncm91bmQpKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRSYXRpbyA9IDAuNzU7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRSYXRpbyA9IDEuNTtcbiAgICAgICAgdmFyIGZvcmVncm91bmRSYXRpbyA9IDM7XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRYID0gMC41IC0gKHggLSAwLjUpICogYmFja2dyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBtaWRkbGVncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIGZvcmVncm91bmRYID0gMC41IC0gKHggLS41KSAqIGZvcmVncm91bmRSYXRpby81MDtcblxuICAgICAgICBiYWNrZ3JvdW5kLndpbmRvd1ggPSBiYWNrZ3JvdW5kWDtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLndpbmRvd1ggPSBtaWRkbGVncm91bmRYO1xuICAgICAgICBmb3JlZ3JvdW5kLndpbmRvd1ggPSBmb3JlZ3JvdW5kWDtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBiYWNrZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgZm9yZWdyb3VuZC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgYmFja2dyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIG1pZGRsZWdyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIGZvcmVncm91bmQuZGVzdHJveSgpO1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgd2lwZXNjcmVlblZpZGVvLCB2aWRlb1RpbWVsaW5lO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgd2lwZXNjcmVlblZpZGVvID0gZ2VuZXJhdGVCbGFkZVdpcGVBbmltYXRpb24oKTtcbiAgICB2aWRlb1RpbWVsaW5lID0gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUod2lwZXNjcmVlblZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVCbGFkZVdpcGVBbmltYXRpb24oKSB7XG4gICAgdmFyIHRleHR1cmVzID0gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2JywgNDAwLCA1NTYpO1xuXG4gICAgdmFyIHdpcGVzY3JlZW5WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcCh0ZXh0dXJlcyk7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1ggPSAwLjU7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1NjYWxlID0gMTtcbiAgICB3aXBlc2NyZWVuVmlkZW8uc2NhbGVUeXBlID0gJ2NvdmVyJztcblxuICAgIHdpcGVzY3JlZW5WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG4gICAgd2lwZXNjcmVlblZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ubG9vcCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHdpcGVzY3JlZW5WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcbiAgICB2aWRlby5fdHdlZW5GcmFtZSA9IDA7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmlkZW8sICd0d2VlbkZyYW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5nb3RvQW5kU3RvcCh2YWx1ZSk7XG5cbi8vICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8odmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuXG4gICAgdmFyIGZhZGVPdXRUaW1lID0gMC4yO1xuICAgIHZhciBmYWRlT3V0U3RhcnQgPSB0aW1lbGluZS5kdXJhdGlvbigpIC0gMC4xO1xuXG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ2NhbGxiYWNrJywgdGltZWxpbmUuZHVyYXRpb24oKSAtIDAuMSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHZpZGVvLCBmYWRlT3V0VGltZSwge1xuICAgICAgICBhbHBoYTogMCxcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCdcbiAgICB9KSwgZmFkZU91dFN0YXJ0KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHdpcGVzY3JlZW5WaWRlbyk7XG4gICAgfSxcbiAgICBwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnBsYXkoMCk7XG4gICAgfSxcbiAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgb25WaWRlb0NvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLmFkZChjYWxsYmFjaywgJ2NhbGxiYWNrJyk7XG4gICAgfVxufTtcblxuXG5cblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuLi9waXhpL2FsbENoYXJhY3RlcnMnKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgY2hhcmFjdGVyTmFtZTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYW5pbWF0ZUluLCBhbmltYXRlT3V0O1xuXG52YXIgYW5pbWF0aW9uc0luID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHk7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgICAgICAgICBkdXN0eS53aW5kb3dYID0gMC42O1xuICAgICAgICAgICAgZHVzdHkud2luZG93U2NhbGUgPSAwLjQyO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuXG4gICAgICAgICAgICBibGFkZS53aW5kb3dTY2FsZSA9IDAuNjtcbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1ggPSAtLjQ7XG4gICAgICAgICAgICBibGFkZS53aW5kb3dZID0gMC43NTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE2LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjYWJiaWUpO1xuICAgICAgICAgICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjY7XG4gICAgICAgICAgICBjYWJiaWUucm90YXRpb24gPSAwLjU1O1xuICAgICAgICAgICAgY2FiYmllLndpbmRvd1ggPSAwLjQ2O1xuXG4gICAgICAgICAgICBjYWJiaWUuc2NhbGUueCA9IDAuODtcbiAgICAgICAgICAgIGNhYmJpZS5zY2FsZS55ID0gMC44O1xuXG4gICAgICAgICAgICBjYWJiaWUuZmlsdGVyc1swXS5ibHVyID0gNztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgc3dlZXBUaW1lID0gYW5pbWF0aW9uVGltZSAqIDcvODtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTUsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZS5zY2FsZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLmZpbHRlcnNbMF0sIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcblxuICAgICAgICAgICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjU7XG5cbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgZGlwcGVyLnJvdGF0aW9uID0gMC41NTtcbiAgICAgICAgICAgIGRpcHBlci53aW5kb3dYID0gMC40NjtcblxuICAgICAgICAgICAgZGlwcGVyLnNjYWxlLnggPSAwLjg7XG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueSA9IDAuODtcblxuICAgICAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDc7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHN3ZWVwVGltZSA9IGFuaW1hdGlvblRpbWUgKiA3Lzg7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE4LFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIuc2NhbGUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2luZGxpZnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgICAgICAgICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC41NjtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHdpbmRsaWZ0ZXIpO1xuICAgICAgICAgICAgd2luZGxpZnRlci53aW5kb3dYID0gMC42O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMyxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxudmFyIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUoKSB7XG4gICAgb25BbmltYXRpb25PdXRDYWxsYmFjaygpO1xufVxuXG52YXIgYW5pbWF0aW9uc091dCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjUsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjUsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0JyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FiYmllOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBjYWJiaWUuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7Ymx1cjogNH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtibHVyOiA0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuMyxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluJyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUgKiA3LzgsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4xLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIFRlYW0gQW5pbWF0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gdGVhbUFuaW1hdGlvblNldHVwKGR1c3R5LCBibGFkZSwgY2FiYmllLCBkaXBwZXIsIHdpbmRsaWZ0ZXIpIHtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEdXN0eSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgIGR1c3R5LndpbmRvd1ggPSAtMC4yO1xuICAgIGR1c3R5LmlkbGUud2luZG93U2NhbGUgPSAwLjM1O1xuICAgIGR1c3R5LnJvdGF0aW9uID0gMC42O1xuICAgIGR1c3R5LnNldFN0YXRpYygpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IEJsYWRlIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihibGFkZSk7XG4gICAgYmxhZGUud2luZG93WCA9IDAuNTU7XG4gICAgYmxhZGUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMztcbiAgICBibGFkZS5zZXRTdGF0aWMoKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDYWJiaWUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgY2FiYmllLndpbmRvd1ggPSAwLjU7XG4gICAgY2FiYmllLndpbmRvd1kgPSAtMC4zO1xuICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC4yO1xuICAgIGNhYmJpZS5maWx0ZXJzWzBdLmJsdXIgPSA0O1xuICAgIGNhYmJpZS5zZXRTdGF0aWMoKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEaXBwZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gMC41NTtcblxuICAgIGRpcHBlci53aW5kb3dYID0gLTAuMztcbiAgICBkaXBwZXIud2luZG93WSA9IDAuNjtcblxuICAgIGRpcHBlci5maWx0ZXJzWzBdLmJsdXIgPSAzO1xuICAgIGRpcHBlci5pZGxlLndpbmRvd1NjYWxlID0gMC4yO1xuICAgIGRpcHBlci5zZXRTdGF0aWMoKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gV2luZGxpZnRlciB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgd2luZGxpZnRlci53aW5kb3dYID0gLTAuMztcbiAgICB3aW5kbGlmdGVyLndpbmRvd1kgPSAwLjU7XG4gICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC4wODtcbiAgICB3aW5kbGlmdGVyLnJvdGF0aW9uID0gMC40O1xuICAgIHdpbmRsaWZ0ZXIuZmlsdGVyc1swXS5ibHVyID0gMTtcbiAgICB3aW5kbGlmdGVyLmZsaXAoKTtcbiAgICB3aW5kbGlmdGVyLnNldFN0YXRpYygpO1xuXG5cbiAgICBkdXN0eS5wdXNoVG9Ub3AoKTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZUluVGVhbSgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5Rm91cjtcbiAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcbiAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICB0ZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcik7XG5cbiAgICBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBzdGFnZ2VyOiAwLjI3LFxuICAgICAgICBhbGlnbjogJ3N0YXJ0JyxcbiAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI0LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC41OSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjgzLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC41MixcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjA1LFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNzgsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC43LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGVPdXRUZWFtKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS44O1xuICAgIHZhciBlYXNpbmcgPSAnQ2lyYy5lYXNlSW4nO1xuXG4gICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eUZvdXI7XG4gICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcbiAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG4gICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgc3RhZ2dlcjogMC4yOSxcbiAgICAgICAgYWxpZ246ICdzdGFydCcsXG4gICAgICAgIHR3ZWVuczogW1xuICAgICAgICAgICAgbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICB0d2VlbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WDogMS42LFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuOCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNixcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgXSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcblxuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgYW5pbWF0ZUluVGVhbSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0ZUluID0gYW5pbWF0aW9uc0luW2NoYXJhY3Rlck5hbWVdO1xuICAgICAgICBhbmltYXRlT3V0ID0gYW5pbWF0aW9uc091dFtjaGFyYWN0ZXJOYW1lXTtcblxuICAgICAgICBhbmltYXRlSW4oKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihjaGFyYWN0ZXJOYW1lID09PSAndGVhbScpIHtcbiAgICAgICAgICAgIGFuaW1hdGVPdXRUZWFtKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYW5pbWF0ZU91dCgpO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgY2hhcmFjdGVyTmFtZSA9IGNoYXJhY3RlcjtcbiAgICB9LFxuICAgIGFsbENoYXJhY3RlcnM6IGFsbENoYXJhY3RlcnNcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbnZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi4vcGl4aS9hbGxDaGFyYWN0ZXJzJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBkdXN0eSwgZGlwcGVyLCB0aW1lbGluZUluLCB0aW1lbGluZU91dDtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBkdXN0eSA9IGluaXRpYWxpemVEdXN0eSgpO1xuICAgIGRpcHBlciA9IGluaXRpYWxpemVEaXBwZXIoKTtcblxuICAgIHRpbWVsaW5lSW4gPSBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKTtcbiAgICB0aW1lbGluZU91dCA9IGdlbmVyYXRlQW5pbWF0aW9uT3V0VGltZWxpbmUoKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUR1c3R5KCkge1xuICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuXG4gICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDtcbiAgICBkdXN0eS53aW5kb3dYID0gMC4xODtcbiAgICBkdXN0eS53aW5kb3dZID0gLTE7XG5cbiAgICByZXR1cm4gZHVzdHk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEaXBwZXIoKSB7XG4gICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgZGlwcGVyLmZsaXAoKTtcblxuICAgIGRpcHBlci53aW5kb3dYID0gMC43NTtcbiAgICBkaXBwZXIud2luZG93WSA9IC0xO1xuICAgIGRpcHBlci5yb3RhdGlvbiA9IC0wLjQwO1xuXG4gICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSA4NjUvMTM2NjtcbiAgICBkaXBwZXIuaWRsZS5hbmltYXRpb25TY2FsZVggPSAwLjc7XG4gICAgZGlwcGVyLmlkbGUuYW5pbWF0aW9uU2NhbGVZID0gMC43O1xuXG4gICAgZGlwcGVyLmZpbHRlcnNbMF0uYmx1ciA9IDEwO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgSW4gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgdGltZWxpbmVEdXN0eUluID0gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpO1xuXG4gICAgdGltZWxpbmUuYWRkKHRpbWVsaW5lRHVzdHlJbi5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkucGxheSgpLCB0aW1lbGluZUR1c3R5SW4uZHVyYXRpb24oKSk7XG5cbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikucGxheSgpLCAwLjQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC41MixcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SG92ZXIoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDE7XG4gICAgdmFyIGVhc2luZyA9ICdRdWFkLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIHJlcGVhdDogLTFcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYnVtcFk6IC0xNSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYnVtcFk6IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEaXBwZXJJbihkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMDtcbiAgICB2YXIgc3dlZXBTdGFydFRpbWUgPSBhbmltYXRpb25UaW1lICogMC4xMTtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMzAsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksIDApO1xuXG4gICAgLy9zd2VlcCByaWdodFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IDAuODYsXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgc3dlZXBTdGFydFRpbWUpO1xuXG4gICAgLy8gc2NhbGUgdXBcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlci5pZGxlLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICBibHVyOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0ZSBPdXQgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBvbkFuaW1hdGlvbk91dENvbXBsZXRlID0gZnVuY3Rpb24oKXt9O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCkge1xuICAgIHZhciB0aW1lbGluZU91dCA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmVPdXQuYWRkKGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KGRpcHBlcikucGxheSgpLCAwKTtcbiAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkucGxheSgpLCAwKTtcblxuICAgcmV0dXJuIHRpbWVsaW5lT3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlci5pZGxlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS40LFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuNCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgIHdpbmRvd1g6IDEuMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzIsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuNDtcbiAgICB2YXIgZWFzaW5nID0gJ0V4cG8uZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZHVzdHkuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eS5pZGxlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS4zLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuMyxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAtMC4xLFxuICAgICAgICB3aW5kb3dYOiAwLjYsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lSW4ucGxheSgwKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZU91dC5wbGF5KDApO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25JbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aW1lbGluZUluLnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDb21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBnZXRJbnRyb1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMCcsIDAsIDEyMik7XG59XG5mdW5jdGlvbiBnZXRMb2dvVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMCcsIDAsIDcyKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHJ1bm5pbmcgPSB0cnVlO1xudmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbnZhciBzdGFnZSA9IG5ldyBQSVhJLlN0YWdlKDB4NjZGRjk5KTtcbnZhciByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAvLyBhZGQgdGhlIHJlbmRlcmVyIHZpZXcgZWxlbWVudCB0byB0aGUgRE9NXG4gICAgcmVuZGVyZXIudmlldy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3BpeGktaW50cm8nKTtcbiAgICAkKCcjY29udGVudCcpLmFwcGVuZChyZW5kZXJlci52aWV3KTtcblxuICAgIHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0ZSk7XG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgaWYoIXJ1bm5pbmcpIHJldHVybjtcblxuICAgIHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0ZSk7XG5cbiAgICAvLyByZW5kZXIgdGhlIHN0YWdlXG4gICAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIEludHJvIFZpZGVvICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHZpZGVvVGltZWxpbmUsIHZpZGVvO1xuXG52YXIgdmlkZW9Db21wbGV0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG52YXIgYmdDb2xvcnMgPSB7XG4gICAgdG9wTGVmdDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICB0b3A6IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgdG9wUmlnaHQ6IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgYnRtTGVmdDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICBidG06IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gICAgYnRtUmlnaHQ6IG5ldyBQSVhJLkdyYXBoaWNzKClcbn07XG52YXIgaW50cm9WaWRlb0NvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBpbnRyb0ZyYW1lVG9wID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGludHJvRnJhbWVCdG0gPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG52YXIgaW50cm9GcmFtZVRvcEJnO1xudmFyIGludHJvRnJhbWVCdG1CZztcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJhY2tncm91bmRDb2xvcnMoKSB7XG5cbiAgICBfLmVhY2goYmdDb2xvcnMsIGZ1bmN0aW9uKGdyYXBoaWMpIHtcbiAgICAgICAgZ3JhcGhpYy5iZWdpbkZpbGwoMHgwNzA4MEIpO1xuICAgICAgICBncmFwaGljLmxpbmVTdHlsZSgwKTtcblxuICAgICAgICBncmFwaGljLmRyYXdSZWN0KDAsIDAsIDEsIDEpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplSW50cm9GcmFtZVRvcCgpIHtcbiAgICBpbnRyb0ZyYW1lVG9wQmcgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaW50cm8tdG9wLnBuZycpO1xuICAgIGludHJvRnJhbWVUb3BCZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG5cbiAgICBpbnRyb0ZyYW1lVG9wLndpbmRvd1ggPSAuNTtcbiAgICBpbnRyb0ZyYW1lVG9wLndpbmRvd1kgPSAuNTtcblxuICAgIGJnQ29sb3JzLnRvcExlZnQud2luZG93WCA9IC0uNTtcbiAgICBiZ0NvbG9ycy50b3BMZWZ0LndpbmRvd1kgPSAtLjU7XG4gICAgYmdDb2xvcnMudG9wLndpbmRvd1ggPSAtLjU7XG4gICAgYmdDb2xvcnMudG9wLndpbmRvd1kgPSAtLjU7XG5cbiAgICBiZ0NvbG9ycy50b3BSaWdodC53aW5kb3dZID0gLS41O1xuXG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChiZ0NvbG9ycy50b3BMZWZ0KTtcbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGJnQ29sb3JzLnRvcCk7XG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChiZ0NvbG9ycy50b3BSaWdodCk7XG4gICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChpbnRyb0ZyYW1lVG9wQmcpO1xuXG4gICAgaW50cm9GcmFtZVRvcEJnLnNjYWxlTWluID0gMC44O1xuXG4gICAgaW50cm9WaWRlb0NvbnRhaW5lci5hZGRDaGlsZChpbnRyb0ZyYW1lVG9wKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUludHJvRnJhbWVCdG0oKSB7XG4gICAgaW50cm9GcmFtZUJ0bUJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL2ludHJvLWJ0bS5wbmcnKTtcbiAgICBpbnRyb0ZyYW1lQnRtQmcuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDApO1xuXG4gICAgaW50cm9GcmFtZUJ0bS53aW5kb3dYID0gLjU7XG4gICAgaW50cm9GcmFtZUJ0bS53aW5kb3dZID0gLjU7XG5cbiAgICBiZ0NvbG9ycy5idG1MZWZ0LndpbmRvd1ggPSAtLjU7XG4gICAgYmdDb2xvcnMuYnRtLndpbmRvd1ggPSAtLjU7XG5cbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGJnQ29sb3JzLmJ0bUxlZnQpO1xuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoYmdDb2xvcnMuYnRtKTtcbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGJnQ29sb3JzLmJ0bVJpZ2h0KTtcbiAgICBpbnRyb0ZyYW1lQnRtLmFkZENoaWxkKGludHJvRnJhbWVCdG1CZyk7XG5cbiAgICBpbnRyb0ZyYW1lQnRtQmcuc2NhbGVNaW4gPSAwLjg7XG5cbiAgICBpbnRyb1ZpZGVvQ29udGFpbmVyLmFkZENoaWxkKGludHJvRnJhbWVCdG0pO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW8oKSB7XG4gICAgdmFyIGludHJvVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0SW50cm9UZXh0dXJlcygpKTtcblxuICAgIGludHJvVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgaW50cm9WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG5cbiAgICBpbnRyb1ZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICBpbnRyb1ZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIHJldHVybiBpbnRyb1ZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICBpbml0aWFsaXplQmFja2dyb3VuZENvbG9ycygpO1xuXG4gICAgc3RhZ2UuYWRkQ2hpbGQoaW50cm9WaWRlb0NvbnRhaW5lcik7XG59KSgpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIExvZ28gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgbG9nbywgbG9nb1RpbWVsaW5lO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplTG9nbygpIHtcbiAgICB2YXIgbG9nbyA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRMb2dvVGV4dHVyZXMoKSk7XG5cbiAgICBsb2dvLndpbmRvd1kgPSAwO1xuICAgIGxvZ28uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuXG4gICAgbG9nby52aXNpYmxlID0gZmFsc2U7XG4gICAgbG9nby5sb29wID0gZmFsc2U7XG5cbiAgICBsb2dvLl90d2VlbkZyYW1lID0gMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobG9nbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbG9nbztcbn1cblxuZnVuY3Rpb24gZ2V0TG9nb0FuaW1hdGlvblRpbWVsaW5lKGxvZ28pIHtcbiAgICB2YXIgZnBzID0gMzI7XG4gICAgdmFyIG51bUZyYW1lcyA9IGxvZ28udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbG9nby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxvZ28udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8obG9nbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB2aWRlb0NvbXBsZXRlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBMb2FkZXIgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBsb2FkaW5nU2NyZWVuID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGxvYWRpbmdCYXIgPSBuZXcgUElYSS5HcmFwaGljcygpO1xudmFyIGxvYWRpbmdCYWNrZ3JvdW5kID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbnZhciBsb2FkZXJMb2dvID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL3ByZWxvYWRlcl9sb2dvLnBuZycpO1xuXG5mdW5jdGlvbiBzZXRHcmFwaGljU2NhbGUob2JqLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgb2JqLnNjYWxlLnggPSBvYmouX2dyYXBoaWNTY2FsZSAqIHdpZHRoO1xuXG4gICAgaWYoIV8uaXNVbmRlZmluZWQoaGVpZ2h0KSkge1xuICAgICAgICBvYmouc2NhbGUueSA9IG9iai5fZ3JhcGhpY1NjYWxlICogaGVpZ2h0O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXRMb2FkaW5nQmFyKCkge1xuICAgIGxvYWRpbmdCYXIuYmVnaW5GaWxsKDB4QzIwMDFCKTtcbiAgICBsb2FkaW5nQmFyLmxpbmVTdHlsZSgwKTtcblxuICAgIGxvYWRpbmdCYXIuZHJhd1JlY3QoMCwgMCwgMSwgMTUpO1xuXG4gICAgbG9hZGluZ0Jhci5fZ3JhcGhpY1NjYWxlID0gMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobG9hZGluZ0JhciwgJ2dyYXBoaWNTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFwaGljU2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljU2NhbGUgPSB2YWw7XG5cbiAgICAgICAgICAgIHNldEdyYXBoaWNTY2FsZSh0aGlzLCAkd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBsb2FkaW5nU2NyZWVuLmFkZENoaWxkKGxvYWRpbmdCYXIpO1xufVxuZnVuY3Rpb24gaW5pdExvYWRpbmdCYWNrZ3JvdW5kKCkge1xuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmJlZ2luRmlsbCgweDA4MDkwQik7XG4gICAgbG9hZGluZ0JhY2tncm91bmQubGluZVN0eWxlKDApO1xuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmRyYXdSZWN0KDAsIDAsIDEsIDEpO1xuXG4gICAgbG9hZGluZ0JhY2tncm91bmQuX2dyYXBoaWNTY2FsZSA9IDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvYWRpbmdCYWNrZ3JvdW5kLCAnZ3JhcGhpY1NjYWxlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyYXBoaWNTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNTY2FsZSA9IHZhbDtcblxuICAgICAgICAgICAgc2V0R3JhcGhpY1NjYWxlKHRoaXMsICR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmdyYXBoaWNTY2FsZSA9IDE7XG5cbiAgICBsb2FkaW5nU2NyZWVuLmFkZENoaWxkKGxvYWRpbmdCYWNrZ3JvdW5kKTtcbn1cblxuZnVuY3Rpb24gaW5pdExvZ28oKSB7XG4gICAgbG9hZGVyTG9nby53aW5kb3dYID0gMC41O1xuICAgIGxvYWRlckxvZ28ud2luZG93WSA9IDAuNTtcblxuICAgIGxvYWRlckxvZ28uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsLjUpO1xuXG4gICAgbG9hZGluZ1NjcmVlbi5hZGRDaGlsZChsb2FkZXJMb2dvKTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIGluaXRMb2FkaW5nQmFja2dyb3VuZCgpO1xuICAgIGluaXRMb2FkaW5nQmFyKCk7XG4gICAgaW5pdExvZ28oKTtcblxuICAgIHN0YWdlLmFkZENoaWxkKGxvYWRpbmdTY3JlZW4pO1xufSkoKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqIE9uIFdpbmRvdyBSZXNpemUgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgdmFyIHdpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgdXBkYXRlTG9hZGluZ1NpemUod2lkdGgsIGhlaWdodCk7XG4gICAgdXBkYXRlVmlkZW9BbmRGcmFtZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHN0YWdlLl9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICByZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG59XG5mdW5jdGlvbiB1cGRhdGVMb2dvKHdpZHRoLCBoZWlnaHQsIHZpZGVvSGVpZ2h0KSB7XG4gICAgaWYoXy5pc1VuZGVmaW5lZChsb2dvKSkgcmV0dXJuO1xuXG4gICAgdmFyIGJvdW5kcyA9IGxvZ28uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgIHZhciBuZXdMb2dvSGVpZ2h0ID0gKGhlaWdodCAtIHZpZGVvSGVpZ2h0KS8yO1xuICAgIHZhciBzY2FsZSA9IE1hdGgubWluKG5ld0xvZ29IZWlnaHQvKGJvdW5kcy5oZWlnaHQgLSA1NSksIDEuMik7XG5cbiAgICBsb2dvLnNjYWxlLnggPSBzY2FsZTtcbiAgICBsb2dvLnNjYWxlLnkgPSBzY2FsZTtcblxuICAgIC8vY2FsYyBwb3NpdGlvblxuICAgIGxvZ28ud2luZG93WSA9IG5ld0xvZ29IZWlnaHQvaGVpZ2h0IC0gMC41O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2FkaW5nU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgc2V0R3JhcGhpY1NjYWxlKGxvYWRpbmdCYXIsIHdpZHRoKTtcbiAgICBzZXRHcmFwaGljU2NhbGUobG9hZGluZ0JhY2tncm91bmQsIHdpZHRoLCBoZWlnaHQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVWaWRlb0FuZEZyYW1lKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZihfLmlzVW5kZWZpbmVkKGludHJvRnJhbWVUb3BCZykpIHJldHVybjtcblxuICAgIHZhciBtYXhIZWlnaHQgPSAwLjg3O1xuICAgIHZhciBtYXhXaWR0aCA9IDAuOTU7XG5cbiAgICB2YXIgbG9jYWxCb3VuZHMgPSBpbnRyb0ZyYW1lVG9wQmcuZ2V0TG9jYWxCb3VuZHMoKTtcbiAgICB2YXIgYnRtQm91bmRzID0gaW50cm9GcmFtZUJ0bUJnLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICB2YXIgc2NhbGUgPSBNYXRoLm1pbihtYXhIZWlnaHQgKiAwLjUgKiBoZWlnaHQvbG9jYWxCb3VuZHMuaGVpZ2h0LCBtYXhXaWR0aCAqIHdpZHRoL2xvY2FsQm91bmRzLndpZHRoKTtcblxuICAgIC8va2VlcCBzY2FsZSB3aXRoaW4gb3VyIGRlZmluZWQgYm91bmRzXG4gICAgc2NhbGUgPSBNYXRoLm1heChpbnRyb0ZyYW1lVG9wQmcuc2NhbGVNaW4sIE1hdGgubWluKHNjYWxlLCBpbnRyb0ZyYW1lVG9wQmcuc2NhbGVNYXgpKTtcblxuICAgIHZhciBidG1TY2FsZSA9IHNjYWxlICogbG9jYWxCb3VuZHMud2lkdGgvYnRtQm91bmRzLndpZHRoO1xuICAgIHZhciB2aWRlb1NjYWxlID0gc2NhbGUgKiAxLjAyNDtcblxuICAgIGludHJvRnJhbWVUb3BCZy5zY2FsZS54ID0gc2NhbGU7XG4gICAgaW50cm9GcmFtZVRvcEJnLnNjYWxlLnkgPSBzY2FsZTtcblxuICAgIGludHJvRnJhbWVCdG1CZy5zY2FsZS54ID0gYnRtU2NhbGU7XG4gICAgaW50cm9GcmFtZUJ0bUJnLnNjYWxlLnkgPSBidG1TY2FsZTtcblxuICAgIHZpZGVvLnNjYWxlLnggPSB2aWRlb1NjYWxlO1xuICAgIHZpZGVvLnNjYWxlLnkgPSB2aWRlb1NjYWxlO1xuXG4gICAgdXBkYXRlVG9wRnJhbWVCYWNrZ3JvdW5kKHdpZHRoLCBoZWlnaHQsIGxvY2FsQm91bmRzLndpZHRoICogc2NhbGUsIGxvY2FsQm91bmRzLmhlaWdodCAqIHNjYWxlKTtcbiAgICB1cGRhdGVCdG1GcmFtZUJhY2tncm91bmQod2lkdGgsIGhlaWdodCwgYnRtQm91bmRzLndpZHRoICogc2NhbGUsIGJ0bUJvdW5kcy5oZWlnaHQgKiBzY2FsZSk7XG4gICAgdXBkYXRlTG9nbyh3aWR0aCwgaGVpZ2h0LCB2aWRlb1NjYWxlICogdmlkZW8uZ2V0TG9jYWxCb3VuZHMoKS5oZWlnaHQpO1xufVxuZnVuY3Rpb24gdXBkYXRlVG9wRnJhbWVCYWNrZ3JvdW5kKHdpZHRoLCBoZWlnaHQsIGZyYW1lV2lkdGgsIGZyYW1lSGVpZ2h0KSB7XG4gICAgdmFyIHNpZGVXaWR0aCA9ICh3aWR0aC1mcmFtZVdpZHRoKS8yO1xuICAgIHZhciB0b3BIZWlnaHQgPSAoaGVpZ2h0LzItZnJhbWVIZWlnaHQpO1xuXG4gICAgYmdDb2xvcnMudG9wTGVmdC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLnRvcExlZnQuc2NhbGUueSA9IGhlaWdodC8yO1xuXG4gICAgYmdDb2xvcnMudG9wLnNjYWxlLnggPSB3aWR0aDtcbiAgICBiZ0NvbG9ycy50b3Auc2NhbGUueSA9IHRvcEhlaWdodDtcblxuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LnNjYWxlLnggPSBzaWRlV2lkdGg7XG4gICAgYmdDb2xvcnMudG9wUmlnaHQuc2NhbGUueSA9IGhlaWdodC8yO1xuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LndpbmRvd1ggPSBmcmFtZVdpZHRoLygyKndpZHRoKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUJ0bUZyYW1lQmFja2dyb3VuZCh3aWR0aCwgaGVpZ2h0LCBmcmFtZVdpZHRoLCBmcmFtZUhlaWdodCkge1xuICAgIHZhciBzaWRlV2lkdGggPSAod2lkdGgtZnJhbWVXaWR0aCkvMjtcbiAgICB2YXIgYnRtSGVpZ2h0ID0gKGhlaWdodC8yLWZyYW1lSGVpZ2h0KTtcblxuICAgIGJnQ29sb3JzLmJ0bUxlZnQuc2NhbGUueCA9IHNpZGVXaWR0aDtcbiAgICBiZ0NvbG9ycy5idG1MZWZ0LnNjYWxlLnkgPSBoZWlnaHQvMjtcblxuICAgIGJnQ29sb3JzLmJ0bS5zY2FsZS54ID0gd2lkdGg7XG4gICAgYmdDb2xvcnMuYnRtLnNjYWxlLnkgPSBidG1IZWlnaHQ7XG4gICAgYmdDb2xvcnMuYnRtLndpbmRvd1kgPSBmcmFtZUhlaWdodC9oZWlnaHQ7XG5cbiAgICBiZ0NvbG9ycy5idG1SaWdodC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLmJ0bVJpZ2h0LnNjYWxlLnkgPSBoZWlnaHQvMjtcbiAgICBiZ0NvbG9ycy5idG1SaWdodC53aW5kb3dYID0gZnJhbWVXaWR0aC8oMip3aWR0aCk7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcbiAgICB9LFxuICAgIGdldEludHJvRnJhbWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogaW50cm9GcmFtZVRvcCxcbiAgICAgICAgICAgIGJ0bTogaW50cm9GcmFtZUJ0bVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcGxheVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5wbGF5KDApO1xuICAgIH0sXG4gICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmlkZW9Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICB1cGRhdGVMb2FkZXI6IGZ1bmN0aW9uKHBlcmNlbnQsIHRpbWVFbGFwc2VkKSB7XG4gICAgICAgIHZhciBvbGRYID0gbG9hZGluZ0Jhci5ncmFwaGljU2NhbGU7XG4gICAgICAgIHZhciBuZXdYID0gcGVyY2VudDtcblxuICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IHRpbWVFbGFwc2VkLzEwMDAgKiAobmV3WCAtIG9sZFgpL25ld1g7XG5cbiAgICAgICAgVHdlZW5MaXRlLnRvKGxvYWRpbmdCYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgIGdyYXBoaWNTY2FsZTogbmV3WFxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFzc2V0c0xvYWRlZDogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlbyA9IGluaXRpYWxpemVWaWRlbygpO1xuICAgICAgICB2aWRlb1RpbWVsaW5lID0gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pO1xuICAgICAgICBsb2dvID0gaW5pdGlhbGl6ZUxvZ28oKTtcbiAgICAgICAgbG9nb1RpbWVsaW5lID0gZ2V0TG9nb0FuaW1hdGlvblRpbWVsaW5lKGxvZ28pO1xuXG4gICAgICAgIGludHJvVmlkZW9Db250YWluZXIuYWRkQ2hpbGQodmlkZW8pO1xuXG4gICAgICAgIGluaXRpYWxpemVJbnRyb0ZyYW1lVG9wKCk7XG4gICAgICAgIGluaXRpYWxpemVJbnRyb0ZyYW1lQnRtKCk7XG5cbiAgICAgICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChsb2dvKTtcblxuICAgICAgICBvbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhsb2FkaW5nU2NyZWVuLCAwLjQsIHtcbiAgICAgICAgICAgICAgICBhbHBoYTogMCxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzZWxmLnBsYXlWaWRlby5iaW5kKHNlbGYpLCA2MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA2MDApO1xuICAgIH0pLFxuICAgIHNob3dMb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbG9nb1RpbWVsaW5lLnBsYXkoKTtcbiAgICB9LFxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlby5kZXN0cm95KCk7XG4gICAgICAgIGxvZ28uZGVzdHJveSgpO1xuXG4gICAgICAgIGludHJvVmlkZW9Db250YWluZXIgPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lVG9wID0gbnVsbDtcbiAgICAgICAgaW50cm9GcmFtZUJ0bSA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVUb3BCZyA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVCdG1CZyA9IG51bGw7XG5cbiAgICAgICAgc3RhZ2UgPSBudWxsO1xuICAgICAgICByZW5kZXJlciA9IG51bGw7XG4gICAgICAgIHZpZGVvID0gbnVsbDtcbiAgICAgICAgbG9nbyA9IG51bGw7XG5cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgICQoJyNwaXhpLWludHJvJykucmVtb3ZlKCk7XG5cbiAgICAgICAgJHdpbmRvdy5vZmYoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcbiAgICB9XG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xudmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG5cblxuXG52YXIgcGVyc29uYWxpdHlBbmltYXRpb25QYWlycyA9IFtcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgZmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dFJvdGF0ZSldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBmYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21Ub3ApLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0Um90YXRlKV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21Ub3ApLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV1cbl07XG5cbnZhciBjYW5uZWRBbmltYXRpb25QYWlycyA9IFtcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldXG5dO1xuXG5cblxuZnVuY3Rpb24gc3RhZ2dlckl0ZW1zKCRpdGVtcykge1xuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgdHdlZW5zOiBfLm1hcCgkaXRlbXMsIHRoaXMpLFxuICAgICAgICBzdGFnZ2VyOiAwLjA3XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqIEluZGl2aWR1YWwgQW5pbWF0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZmFkZUluKCRpdGVtLCBwcm9wLCBkaXN0YW5jZSwgZWFzaW5nKSB7XG4gICAgdmFyIGZyb20gPSB7b3BhY2l0eTogMH07XG4gICAgZnJvbVtwcm9wXSA9IGRpc3RhbmNlO1xuXG4gICAgdmFyIHRvID0ge29wYWNpdHk6IDEsIGVhc2U6IGVhc2luZ307XG4gICAgdG9bcHJvcF0gPSAwO1xuXG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS5mcm9tVG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIGZyb20sIHRvKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbk5vTW92ZW1lbnQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDAsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBmYWRlSW5Gcm9tUmlnaHQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDc1LCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gZmFkZUluRnJvbVRvcCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd5JywgLTc1LCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gYm91bmNlRmFkZUluRnJvbVJpZ2h0KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCA3NSwgJ0JhY2suZWFzZU91dCcpO1xufVxuZnVuY3Rpb24gYm91bmNlRmFkZUluRnJvbVRvcCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd5JywgLTc1LCAnQmFjay5lYXNlT3V0Jyk7XG59XG5mdW5jdGlvbiByb3RhdGVJbkxlZnQoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLmZyb21UbygkaXRlbSwgYW5pbWF0aW9uVGltZSwge3JvdGF0aW9uWTogLTkwLCB0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0IDUwJSAtMTAwXCJ9LCB7cm90YXRpb25ZOiAwfSk7XG59XG5cbmZ1bmN0aW9uIHNuYXBPdXQoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMCwgc2NhbGU6IDAuNCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJSAwXCIsIGVhc2U6ICdCYWNrLmVhc2VJbid9KTtcbn1cbmZ1bmN0aW9uIHNuYXBPdXRSb3RhdGUoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMCwgc2NhbGU6IDAuNCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJSAwXCIsIHJvdGF0aW9uOiAtNDUsIGVhc2U6ICdCYWNrLmVhc2VJbid9KTtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGdldFJhbmRvbVBlcnNvbmFsaXR5QW5pbWF0aW9uczogZnVuY3Rpb24oJGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gXy5yYW5kb20ocGVyc29uYWxpdHlBbmltYXRpb25QYWlycy5sZW5ndGggLSAxKTtcblxuICAgICAgICByZXR1cm4gXy5tYXAocGVyc29uYWxpdHlBbmltYXRpb25QYWlyc1tpXSwgZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZm5jKCRpdGVtcyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9uczogZnVuY3Rpb24oJGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gXy5yYW5kb20oY2FubmVkQW5pbWF0aW9uUGFpcnMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKGNhbm5lZEFuaW1hdGlvblBhaXJzW2ldLCBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICAgIHJldHVybiBmbmMoJGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgcGFyYWNodXRlcnMsIHBhcmFjaHV0ZXJzQ29udGFpbmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHBhcmFjaHV0ZXJzID0gXy5zaHVmZmxlKFtnZXRCbGFja291dCgpLCBnZXREcmlwKCksIGdldER5bmFtaXRlKCldKTtcblxuICAgIF8uZWFjaChwYXJhY2h1dGVycywgZnVuY3Rpb24ocGFyYWNodXRlcikge1xuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgICAgICBwYXJhY2h1dGVyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dZID0gLTE7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRCbGFja291dCgpIHtcbiAgICB2YXIgYmxhY2tvdXRJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2JsYWNrb3V0LnBuZ1wiKTtcbiAgICBibGFja291dElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDI2LzYxLFxuICAgICAgICB5OiAzMy85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignQmxhY2tvdXQnLCBibGFja291dElkbGVTdGF0ZSk7XG59XG5mdW5jdGlvbiBnZXREcmlwKCkge1xuICAgIHZhciBkcmlwSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9kcmlwLnBuZ1wiKTtcbiAgICBkcmlwSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMzYvNjEsXG4gICAgICAgIHk6IDI2Lzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEcmlwJywgZHJpcElkbGVTdGF0ZSk7XG59XG5mdW5jdGlvbiBnZXREeW5hbWl0ZSgpIHtcbiAgICB2YXIgZHluYW1pdGVJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiKTtcbiAgICBkeW5hbWl0ZUlkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDI3LzYxLFxuICAgICAgICB5OiAzMC85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignRHluYW1pdGUnLCBkeW5hbWl0ZUlkbGVTdGF0ZSk7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gYW5pbWF0ZVBhcmFjaHV0ZXIocGFyYWNodXRlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMzU7XG5cbiAgICB2YXIgZGVwdGggPSBNYXRoLnJhbmRvbSgpICogNTtcbiAgICB2YXIgeCA9IDAuMSArIChNYXRoLnJhbmRvbSgpICogMC44KTtcbiAgICB2YXIgc2NhbGUgPSAxIC0gZGVwdGggKiAwLjIvNTtcblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihwYXJhY2h1dGVyKTtcbiAgICBwYXJhY2h1dGVyLndpbmRvd1ggPSB4O1xuXG4gICAgdmFyIHJvdGF0aW9uID0gMC4zO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgZWFzZTogJ1NpbmUuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGFyYWNodXRlci52aXNpYmlsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXJhY2h1dGVyLnNjYWxlID0ge3g6IHNjYWxlLCB5OiBzY2FsZX07XG4gICAgcGFyYWNodXRlci5maWx0ZXJzWzBdLmJsdXIgPSBkZXB0aCAqIDMvNTtcbiAgICBwYXJhY2h1dGVyLnJvdGF0aW9uID0gcm90YXRpb247XG5cbiAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbik7XG59XG5mdW5jdGlvbiBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbikge1xuICAgIHZhciBzd2F5VGltZSA9IDEuMjtcbiAgICB2YXIgZGVjID0gMC4wMztcblxuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICByb3RhdGlvbjogLXJvdGF0aW9uLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0J1xuICAgIH0pO1xuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICBkZWxheTogc3dheVRpbWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYocm90YXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24gLSBkZWMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHBhcmFjaHV0ZXJzQ29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gICAgICAgIF8uZWFjaChwYXJhY2h1dGVycywgXy5iaW5kKHBhcmFjaHV0ZXJzQ29udGFpbmVyLmFkZENoaWxkLCBwYXJhY2h1dGVyc0NvbnRhaW5lcikpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHBhcmFjaHV0ZXJzQ29udGFpbmVyKTtcbiAgICB9KSxcbiAgICBhbmltYXRlTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHBhcmFjaHV0ZXJzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVycy5zaGlmdCgpKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lci52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICB2YXIgaGVpZ2h0ID0gY2hhcmFjdGVyLnNjYWxlLnkgKiBjaGFyYWN0ZXIuZ2V0TG9jYWxCb3VuZHMoKS5oZWlnaHQ7XG5cbiAgICBjaGFyYWN0ZXIud2luZG93WSA9IC0oaGVpZ2h0LzIpLyQod2luZG93KS5oZWlnaHQoKTtcbn07IiwiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuLi9waXhpL2FsbENoYXJhY3RlcnMnKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG52YXIgYW5pbWF0ZUluID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS4yO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlEYXJrO1xuXG4gICAgICAgICAgICBkdXN0eS5pZGxlLndpbmRvd1NjYWxlID0gMC4zNztcbiAgICAgICAgICAgIGR1c3R5LndpbmRvd1ggPSAwLjI7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjcxLFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuXG4gICAgICAgICAgICBibGFkZS5pZGxlLndpbmRvd1NjYWxlID0gMC41O1xuICAgICAgICAgICAgYmxhZGUud2luZG93WCA9IDAuMztcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihibGFkZSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNzQsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgICAgICAgICBjYWJiaWUud2luZG93WCA9IDAuNTtcbiAgICAgICAgICAgIGNhYmJpZS5yb3RhdGlvbiA9IDAuNjU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjU1LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgZGlwcGVyLndpbmRvd1ggPSAwLjY7XG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueCA9IDE7XG4gICAgICAgICAgICBkaXBwZXIucm90YXRpb24gPSAwLjI7XG5cbiAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgd2luZG93WDogMC40NyxcbiAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjRcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDU7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4od2luZGxpZnRlcik7XG4gICAgICAgICAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAwLjU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNCxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI3XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVhbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBhbmltYXRlSW5bY2hhcmFjdGVyXSgpO1xuICAgIH1cbn07IiwiXG5cblxudmFyIFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3F1ZXN0aW9uJyk7XG5cblxudmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogUXVlc3Rpb25cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uQ29sbGVjdGlvbjsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1F1ZXN0aW9uQ29sbGVjdGlvbicpO1xuXG4gICAgdmFyIGNoYXJhY3RlclNlbGVjdCA9IHJlcXVpcmUoJy4uL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24nKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9jYW5uZWRRdWVzdGlvbnMuanNvbicpO1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbicpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tUGVyc29uYWxpdHlRdWVzdGlvbnMobnVtKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KF8uc2h1ZmZsZShwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YS5xdWVzdGlvbnMpLCBudW0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wdHlDYW5uZWRRdWVzdGlvbnMobnVtKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKG51bSksIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jbGFzcyxcbiAgICAgICAgICAgICAgICBjb3B5OiBjYW5uZWRRdWVzdGlvbkRhdGEuY29weSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2FubmVkLXF1ZXN0aW9uJyArIGksXG4gICAgICAgICAgICAgICAgb3B0aW9uczogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9uQ29sbGVjdGlvbigpO1xuXG5cbiAgICAvL3NodWZmbGUgcXVlc3Rpb25zIGFuZCBwaWNrIDNcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbnMgPSBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucygzKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25zID0gZ2V0RW1wdHlDYW5uZWRRdWVzdGlvbnMoMyk7XG5cblxuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2hhcmFjdGVyU2VsZWN0KTtcbiAgICBhbGxRdWVzdGlvbnMuYWRkKHBlcnNvbmFsaXR5UXVlc3Rpb25zKTtcbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNhbm5lZFF1ZXN0aW9ucyk7XG5cblxuXG4gICAgZnVuY3Rpb24gZmlsdGVyVW51c2VkKG9wdGlvbnMsIHVzZWQpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHVzZWQuaW5kZXhPZihvcHRpb24udmFsdWUpID09PSAtMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWxsUXVlc3Rpb25zLmdldFVudXNlZENhbm5lZE9wdGlvbnMgPSBmdW5jdGlvbihudW0sIHVzZWQpIHtcbiAgICAgICAgdmFyIHBvc3NpYmxlT3B0aW9ucyA9IF8uc2h1ZmZsZShmaWx0ZXJVbnVzZWQoY2FubmVkUXVlc3Rpb25EYXRhLm9wdGlvbnMsIHVzZWQpKTtcblxuICAgICAgICByZXR1cm4gXy5maXJzdChwb3NzaWJsZU9wdGlvbnMsIG51bSk7XG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhbGxRdWVzdGlvbnM7XG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInRvdGFsU2l6ZVwiOiAxNTc1MTAyMCxcblx0XCJhc3NldHNcIjoge1xuXHRcdFwiYXNzZXRzL2ltZy9QRy5wbmdcIjogMTU1Mixcblx0XHRcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCI6IDI1MDYsXG5cdFx0XCJhc3NldHMvaW1nL2J1dHRvbi5wbmdcIjogNzU0NCxcblx0XHRcImFzc2V0cy9pbWcvZHJpcC5wbmdcIjogMzI4OCxcblx0XHRcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCI6IDI0MjAsXG5cdFx0XCJhc3NldHMvaW1nL2Zvb3Rlci5wbmdcIjogNDMzOTgsXG5cdFx0XCJhc3NldHMvaW1nL2ZvcmVncm91bmRfdHJlZXMucG5nXCI6IDExNTcxNCxcblx0XHRcImFzc2V0cy9pbWcvaGVhZGVyLnBuZ1wiOiA5MTEzOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYmFzZWJhbGwucG5nXCI6IDE0Mjk3LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibGFkZV9yYW5nZXIucG5nXCI6IDE1MzA4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibHVlLnBuZ1wiOiAxMDc0OSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvYnJvY2NvbGkucG5nXCI6IDE0MDQ1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYWJiaWUucG5nXCI6IDE4OTgxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYW5uZWQtYnRuLnBuZ1wiOiAxMjQ3Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZGlwcGVyLnBuZ1wiOiAxODkyMyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZHVzdHkucG5nXCI6IDIwMzI4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9mb290YmFsbC5wbmdcIjogMTM2MjksXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2ZyaWVzLnBuZ1wiOiAxMTkyOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZ3JlZW4ucG5nXCI6IDEwNzQ3LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ob2NrZXkucG5nXCI6IDEzMDUyLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9pY2VjcmVhbS5wbmdcIjogMTI0NDIsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL251Z2dldHMucG5nXCI6IDEzMzQ3LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9vcmFuZ2UucG5nXCI6IDEwNzI0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wYmoucG5nXCI6IDEyMzg0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9waXp6YS5wbmdcIjogMTM3NjUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3ByaW50ZXIucG5nXCI6IDQxMyxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcHVycGxlLnBuZ1wiOiAxMDc4NCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcmFjaW5nLnBuZ1wiOiAxMTQ5MSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcmVkLnBuZ1wiOiAxMDY1Myxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvc2VuZC1idG4ucG5nXCI6IDk5MjEsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3NvY2Nlci5wbmdcIjogMTUxODksXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3N3aW1fZGl2ZS5wbmdcIjogMTE0MjgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3RoZV90ZWFtLnBuZ1wiOiAxNzA5Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdm9sdW1lLnBuZ1wiOiAxNjMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3dpbmRsaWZ0ZXIucG5nXCI6IDE2ODIyLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy95ZWxsb3cucG5nXCI6IDEwNjcyLFxuXHRcdFwiYXNzZXRzL2ltZy9pbi10aGVhdGVycy5wbmdcIjogMjk2Nyxcblx0XHRcImFzc2V0cy9pbWcvaW4tdGhlYXRyZXMzZC5wbmdcIjogNTE5MCxcblx0XHRcImFzc2V0cy9pbWcvaW50cm8tYnRtLnBuZ1wiOiA4MTk1NSxcblx0XHRcImFzc2V0cy9pbWcvaW50cm8tdG9wLnBuZ1wiOiA3OTM0Nixcblx0XHRcImFzc2V0cy9pbWcvbG9nby5wbmdcIjogMTI5MTI4LFxuXHRcdFwiYXNzZXRzL2ltZy9taWRncm91bmQucG5nXCI6IDY0Njg5LFxuXHRcdFwiYXNzZXRzL2ltZy9wcmludC5wbmdcIjogMjc1MSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfYmxhZGUuanBnXCI6IDE5MDI4NSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfY2FiYmllLmpwZ1wiOiAyNzA4MzgsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2RpcHBlci5qcGdcIjogNDQzOTE5LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kdXN0eS5qcGdcIjogMTk3NjQyLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ190ZWFtLmpwZ1wiOiA0MjY5OTksXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX3dpbmRsaWZ0ZXIuanBnXCI6IDIyMTk0OSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfbGV0dGVyX2JnLmpwZ1wiOiA3NTcxMyxcblx0XHRcImFzc2V0cy9pbWcvc2VuZE1vcmUucG5nXCI6IDEyMzMxLFxuXHRcdFwiYXNzZXRzL2ltZy9zaXRlX2JnLmpwZ1wiOiAxODQwNTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDAyLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMy5wbmdcIjogNTQ0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDQucG5nXCI6IDk5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA1LnBuZ1wiOiAxMzkwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDYucG5nXCI6IDkwMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA3LnBuZ1wiOiAxMTUzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDgucG5nXCI6IDE0MTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwOS5wbmdcIjogMTU2MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDEwLnBuZ1wiOiAxNjM5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTEucG5nXCI6IDE4NzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMi5wbmdcIjogMTk1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDEzLnBuZ1wiOiAyMDQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTQucG5nXCI6IDIwNzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxNS5wbmdcIjogMjA4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE2LnBuZ1wiOiAyMjU4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTcucG5nXCI6IDI0NDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxOC5wbmdcIjogMjUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE5LnBuZ1wiOiAyNzQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjAucG5nXCI6IDI4OTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyMS5wbmdcIjogMzA0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIyLnBuZ1wiOiAzMTYwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjMucG5nXCI6IDMzMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNC5wbmdcIjogMzQ4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI1LnBuZ1wiOiAzNjI5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjYucG5nXCI6IDM3NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNy5wbmdcIjogMzg0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI4LnBuZ1wiOiAzOTQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjkucG5nXCI6IDQwMjgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMC5wbmdcIjogNDA3OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDMxLnBuZ1wiOiA0MDg0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzIucG5nXCI6IDQxMTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMy5wbmdcIjogNDE3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM0LnBuZ1wiOiA0MjA5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzUucG5nXCI6IDQxMDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNi5wbmdcIjogNDE1OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM3LnBuZ1wiOiA0MjMwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzgucG5nXCI6IDQyOTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzOS5wbmdcIjogNDM2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQwLnBuZ1wiOiA0NDQzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDEucG5nXCI6IDQ1MjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0Mi5wbmdcIjogNDU0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQzLnBuZ1wiOiA0NTk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDQucG5nXCI6IDQ2NjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0NS5wbmdcIjogNDcxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ2LnBuZ1wiOiA0Nzc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDcucG5nXCI6IDQ4NzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0OC5wbmdcIjogNDk0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ5LnBuZ1wiOiA0OTcxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTAucG5nXCI6IDUwOTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1MS5wbmdcIjogNTEyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUyLnBuZ1wiOiA1MjExLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTMucG5nXCI6IDUzMDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1NC5wbmdcIjogODE0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU1LnBuZ1wiOiAxNDU0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU2LnBuZ1wiOiAyMTMwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU3LnBuZ1wiOiAzMTA1Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU4LnBuZ1wiOiAzNjcyMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU5LnBuZ1wiOiA0MTc0OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYwLnBuZ1wiOiA0MzA3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYxLnBuZ1wiOiAzODExOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYyLnBuZ1wiOiAzMTI1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYzLnBuZ1wiOiAzMzg2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY0LnBuZ1wiOiAzMjMyOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY1LnBuZ1wiOiAzMTU4Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY2LnBuZ1wiOiAzMTU0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY3LnBuZ1wiOiAzMTcyMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY4LnBuZ1wiOiAzMTczMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY5LnBuZ1wiOiAzMTc3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcwLnBuZ1wiOiAzMTM5OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcxLnBuZ1wiOiAzMTMyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcyLnBuZ1wiOiAzMTQxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDczLnBuZ1wiOiAzMTU4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc0LnBuZ1wiOiAzMTM2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc1LnBuZ1wiOiAzMTU1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc2LnBuZ1wiOiAzMTY2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc3LnBuZ1wiOiAzMTYwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc4LnBuZ1wiOiAyNzM3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc5LnBuZ1wiOiAzODEzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgwLnBuZ1wiOiA0OTUxMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgxLnBuZ1wiOiA1NTU1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgyLnBuZ1wiOiA1NTQyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgzLnBuZ1wiOiA2MzQ0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg0LnBuZ1wiOiA1NTgwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg1LnBuZ1wiOiAzMjEwMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg2LnBuZ1wiOiAzNTExMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg3LnBuZ1wiOiAyNDQ3Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg4LnBuZ1wiOiAyNDczNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg5LnBuZ1wiOiAyNzIzMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkwLnBuZ1wiOiAzMTkwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkxLnBuZ1wiOiAzNzg4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkyLnBuZ1wiOiA0MTU4OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkzLnBuZ1wiOiA0NDk1NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk0LnBuZ1wiOiA0Njg3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk1LnBuZ1wiOiAzNTk3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk2LnBuZ1wiOiAyODM2NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk3LnBuZ1wiOiAyNDkzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk4LnBuZ1wiOiAyMzA5Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk5LnBuZ1wiOiAyMDMzNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAwLnBuZ1wiOiAyMDk2NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAxLnBuZ1wiOiAxNjg0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAyLnBuZ1wiOiAxODMxMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAzLnBuZ1wiOiAxOTY3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA0LnBuZ1wiOiAyMjI4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA1LnBuZ1wiOiAyNDc2Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA2LnBuZ1wiOiAyNTMxOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA3LnBuZ1wiOiAyNjg3NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA4LnBuZ1wiOiAyNjE0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA5LnBuZ1wiOiAyOTMwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEwLnBuZ1wiOiAzMzg3Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTExLnBuZ1wiOiAzNjkxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEyLnBuZ1wiOiA0MDkyNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEzLnBuZ1wiOiA0NDQwMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE0LnBuZ1wiOiA0NjEyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE1LnBuZ1wiOiA0Mzk0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE2LnBuZ1wiOiA0NzQ4NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE3LnBuZ1wiOiA2OTEzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE4LnBuZ1wiOiAyNjY2MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE5LnBuZ1wiOiAzMDU0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTIwLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEyMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDIzMTA3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDEucG5nXCI6IDIzODc3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDIzMzg4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDIzMzc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDQucG5nXCI6IDIzNjMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDIzNDE2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDIzMjQzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDcucG5nXCI6IDIzNjU2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDIzNTMwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDIzMTEwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTAucG5nXCI6IDI0MjI5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDIzMDk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAwLnBuZ1wiOiAyNjQ3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMS5wbmdcIjogMjYyOTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDIucG5nXCI6IDI2NjU5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAzLnBuZ1wiOiAyNzg3MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNC5wbmdcIjogMjY0NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDUucG5nXCI6IDI2MjkyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA2LnBuZ1wiOiAyNjY1OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNy5wbmdcIjogMjc4NzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDgucG5nXCI6IDI2NDc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA5LnBuZ1wiOiAyNjI5Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAxMC5wbmdcIjogMjY2NTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTEucG5nXCI6IDI3ODcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAwLnBuZ1wiOiAyMTg3NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMS5wbmdcIjogMjE3NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDIucG5nXCI6IDIxOTkzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAzLnBuZ1wiOiAyMjY2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNC5wbmdcIjogMjE4NzUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDUucG5nXCI6IDIxNzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA2LnBuZ1wiOiAyMTk5Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNy5wbmdcIjogMjI2NjcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDgucG5nXCI6IDIxODc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA5LnBuZ1wiOiAyMTc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMC5wbmdcIjogMjE5OTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTEucG5nXCI6IDIyNjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMC5wbmdcIjogNDIyMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDAxLnBuZ1wiOiA0MTg4Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDIucG5nXCI6IDQxODQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMy5wbmdcIjogNDIwODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA0LnBuZ1wiOiA0MjIwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDUucG5nXCI6IDQxODg3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNi5wbmdcIjogNDE4NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA3LnBuZ1wiOiA0MjA4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDgucG5nXCI6IDQyMjA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwOS5wbmdcIjogNDE4ODcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDEwLnBuZ1wiOiA0MTg0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMTEucG5nXCI6IDQyMDg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMC5wbmdcIjogMzcyNDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDAxLnBuZ1wiOiAzNzIzNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDIucG5nXCI6IDM3NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMy5wbmdcIjogMzcyOTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA0LnBuZ1wiOiAzNzI0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDUucG5nXCI6IDM3MjM3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNi5wbmdcIjogMzc1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA3LnBuZ1wiOiAzNzI5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDgucG5nXCI6IDM3MjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwOS5wbmdcIjogMzcyMzcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDEwLnBuZ1wiOiAzNzUwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMTEucG5nXCI6IDM3Mjk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDAucG5nXCI6IDM3NzQyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDEucG5nXCI6IDM4MTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDIucG5nXCI6IDM4MjU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDMucG5nXCI6IDM4MTM4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDQucG5nXCI6IDM3ODc3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDUucG5nXCI6IDM3NjkwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDYucG5nXCI6IDM3NjUxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDcucG5nXCI6IDM3NTcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDgucG5nXCI6IDM4MTM2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDkucG5nXCI6IDM3NTU1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTAucG5nXCI6IDM4MDI5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTEucG5nXCI6IDM3ODY0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTIucG5nXCI6IDM3NjM1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTMucG5nXCI6IDM3NTM2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTQucG5nXCI6IDM4ODcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTUucG5nXCI6IDM3NzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTYucG5nXCI6IDM4NTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTcucG5nXCI6IDM4MDQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTgucG5nXCI6IDM4NDU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTkucG5nXCI6IDM4NTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjAucG5nXCI6IDM4MjI2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjEucG5nXCI6IDM4MTE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjIucG5nXCI6IDM3NTk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjMucG5nXCI6IDM4MjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF8wMDAwMDAucG5nXCI6IDcyNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDAxLnBuZ1wiOiAxNDEwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF8wMDAwMDIucG5nXCI6IDE5NjIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzAwMDAwMy5wbmdcIjogNDk3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDA0LnBuZ1wiOiAxMDE1Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDA1LnBuZ1wiOiAxNDA1NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDA2LnBuZ1wiOiAxNzkwMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDA3LnBuZ1wiOiAyNTY1Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDA4LnBuZ1wiOiAyNjU1Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDA5LnBuZ1wiOiAyNTk5Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDEwLnBuZ1wiOiAyNTM4NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDExLnBuZ1wiOiAyNTk0Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDEyLnBuZ1wiOiAyNzgwMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDEzLnBuZ1wiOiAyNzUwNCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDE0LnBuZ1wiOiAyNzM0Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDE1LnBuZ1wiOiAyOTAxMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDE2LnBuZ1wiOiAyOTkwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDE3LnBuZ1wiOiAyOTQ4OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDE4LnBuZ1wiOiAzMTA1NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDE5LnBuZ1wiOiAzMDcxNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDIwLnBuZ1wiOiAzMDA2Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDIxLnBuZ1wiOiAzMDg1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDIyLnBuZ1wiOiAzMDU1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDIzLnBuZ1wiOiAzMDQzMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDI0LnBuZ1wiOiAzMDU0OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDI1LnBuZ1wiOiAzMDU4Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDI2LnBuZ1wiOiAzMDI2MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDI3LnBuZ1wiOiAzMDUxMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDI4LnBuZ1wiOiAzMDYwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDI5LnBuZ1wiOiAzMDAxMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDMwLnBuZ1wiOiAzMDE4Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDMxLnBuZ1wiOiAyOTkzNCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDMyLnBuZ1wiOiAyOTg0Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDMzLnBuZ1wiOiAzMDMyMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDM0LnBuZ1wiOiAyOTg4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDM1LnBuZ1wiOiAyOTkyNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDM2LnBuZ1wiOiAyOTgwNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDM3LnBuZ1wiOiAyOTk4OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDM4LnBuZ1wiOiAyOTM3Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDM5LnBuZ1wiOiAyOTgzMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQwLnBuZ1wiOiAyOTkwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQxLnBuZ1wiOiAyOTQzMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQyLnBuZ1wiOiAyOTMxOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQzLnBuZ1wiOiAyODg1OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQ0LnBuZ1wiOiAyNzc1MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQ1LnBuZ1wiOiAyODQwOSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQ2LnBuZ1wiOiAyNzM2Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQ3LnBuZ1wiOiAyNzI0MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQ4LnBuZ1wiOiAyNzQ0OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDQ5LnBuZ1wiOiAyNjkxOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDUwLnBuZ1wiOiAyNzQ3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDUxLnBuZ1wiOiAyNjQ4OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDUyLnBuZ1wiOiAyNTE0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDUzLnBuZ1wiOiAyNDY3MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDU0LnBuZ1wiOiAyMzkzNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDU1LnBuZ1wiOiAyMjIyNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDU2LnBuZ1wiOiAyMTA2OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDU3LnBuZ1wiOiAyMTQ3OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDU4LnBuZ1wiOiAyMDM2Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDU5LnBuZ1wiOiAxOTY2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDYwLnBuZ1wiOiAxOTkyNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDYxLnBuZ1wiOiAyMDEzMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDYyLnBuZ1wiOiAxOTY2NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDYzLnBuZ1wiOiAxOTIxNixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDY0LnBuZ1wiOiAxOTEwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDY1LnBuZ1wiOiAxODMyMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDY2LnBuZ1wiOiAxODExMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDY3LnBuZ1wiOiAxNjYyMSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDY4LnBuZ1wiOiAxNDYzNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDY5LnBuZ1wiOiAxMzE2Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDcwLnBuZ1wiOiAxMDUyMixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfMDAwMDcxLnBuZ1wiOiA3ODYzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiAzODE2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMS5wbmdcIjogMzgzNzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDM5MTIxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiAzODY1OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNC5wbmdcIjogMzc5NjcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDM4MTIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiAzODIzOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNy5wbmdcIjogMzgxODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDM4NDAyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiAzODE2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMC5wbmdcIjogMzgzMDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDM4NTMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAwLnBuZ1wiOiAyMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDEucG5nXCI6IDIxNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwMi5wbmdcIjogMjMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAzLnBuZ1wiOiAyNTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDQucG5nXCI6IDM3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNS5wbmdcIjogNDE3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA2LnBuZ1wiOiA0NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDcucG5nXCI6IDU1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwOC5wbmdcIjogNjUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA5LnBuZ1wiOiAxMDA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEwLnBuZ1wiOiAxODYwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDExLnBuZ1wiOiAyNDMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEyLnBuZ1wiOiAzNDE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEzLnBuZ1wiOiA0NTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE0LnBuZ1wiOiA2MDg4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE1LnBuZ1wiOiA3MDg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE2LnBuZ1wiOiA3OTg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE3LnBuZ1wiOiA4Mjk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE4LnBuZ1wiOiA5NzQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE5LnBuZ1wiOiA5OTUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIwLnBuZ1wiOiA4ODAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIxLnBuZ1wiOiA5NTA1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIyLnBuZ1wiOiA5NTYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIzLnBuZ1wiOiA5NjA1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI0LnBuZ1wiOiA5NzI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI1LnBuZ1wiOiA5ODA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI2LnBuZ1wiOiA5NDQ3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI3LnBuZ1wiOiA5NDMwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI4LnBuZ1wiOiA5NTQxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI5LnBuZ1wiOiA4NzYxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMwLnBuZ1wiOiA4OTU2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMxLnBuZ1wiOiA4NTg0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMyLnBuZ1wiOiA4MzM0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMzLnBuZ1wiOiA4MTEyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM0LnBuZ1wiOiA3OTczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM1LnBuZ1wiOiA3NzY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM2LnBuZ1wiOiA3NDM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM3LnBuZ1wiOiA3Mjg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM4LnBuZ1wiOiA3MjUwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM5LnBuZ1wiOiA1MzQxOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MC5wbmdcIjogNjk1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MS5wbmdcIjogNjY2Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Mi5wbmdcIjogNjc5Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0My5wbmdcIjogNjUyNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NC5wbmdcIjogNjQ0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NS5wbmdcIjogNjMwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ni5wbmdcIjogNjQ5Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ny5wbmdcIjogNjMxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OC5wbmdcIjogNjQ0Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OS5wbmdcIjogNjc0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MC5wbmdcIjogNjc1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MS5wbmdcIjogNjgwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Mi5wbmdcIjogNjU0MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1My5wbmdcIjogNjU5Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NC5wbmdcIjogNjg2NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NS5wbmdcIjogNzExOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ni5wbmdcIjogNzM4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ny5wbmdcIjogNzU1OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OC5wbmdcIjogNzY3Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OS5wbmdcIjogNzk4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MC5wbmdcIjogNzkzMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MS5wbmdcIjogODQ0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Mi5wbmdcIjogODQ1Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2My5wbmdcIjogODcwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NC5wbmdcIjogOTE4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NS5wbmdcIjogODkyNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ni5wbmdcIjogNjQ4OTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjcucG5nXCI6IDk1NTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjgucG5nXCI6IDEwMDcyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY5LnBuZ1wiOiAxMDc4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MC5wbmdcIjogMTA1ODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzEucG5nXCI6IDEwOTUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcyLnBuZ1wiOiAxMTE3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3My5wbmdcIjogMTExMDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzQucG5nXCI6IDExNTU1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc1LnBuZ1wiOiAxMjA4Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ni5wbmdcIjogMTIwMzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzcucG5nXCI6IDEyMzc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc4LnBuZ1wiOiAxMjkwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3OS5wbmdcIjogMTMzMDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODAucG5nXCI6IDEzMzE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgxLnBuZ1wiOiAxMzczMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Mi5wbmdcIjogMTQwOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODMucG5nXCI6IDE0MTk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg0LnBuZ1wiOiAxNDcwMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4NS5wbmdcIjogMTUxMjksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODYucG5nXCI6IDE0OTIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg3LnBuZ1wiOiAxNTczNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OC5wbmdcIjogMTYyNzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODkucG5nXCI6IDE2Mjc0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkwLnBuZ1wiOiAxNjc5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5MS5wbmdcIjogMTc0MDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTIucG5nXCI6IDE3MDEzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkzLnBuZ1wiOiAxNzk3OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NC5wbmdcIjogMTg0NzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTUucG5nXCI6IDE4OTY1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk2LnBuZ1wiOiAxOTQwMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Ny5wbmdcIjogMjAwMDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTgucG5nXCI6IDE5NzM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk5LnBuZ1wiOiAyMDQxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMC5wbmdcIjogMjE0ODEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDEucG5nXCI6IDIyOTg0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAyLnBuZ1wiOiAyMzAzNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMy5wbmdcIjogMjM3MTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDQucG5nXCI6IDI1MDQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA1LnBuZ1wiOiAyNTM4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNi5wbmdcIjogMjcxNDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDcucG5nXCI6IDI3NTE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA4LnBuZ1wiOiAyOTIzMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOS5wbmdcIjogMjg4NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTAucG5nXCI6IDMwMTA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTExLnBuZ1wiOiAzMDAyOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMi5wbmdcIjogMzExMjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTMucG5nXCI6IDMzMDg2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE0LnBuZ1wiOiAzMzUyOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNS5wbmdcIjogMzU3NzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTYucG5nXCI6IDM4MjE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE3LnBuZ1wiOiAzOTI4Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOC5wbmdcIjogNDEwNDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTkucG5nXCI6IDQyNDYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIwLnBuZ1wiOiA0NDM1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMS5wbmdcIjogNDQyNzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjIucG5nXCI6IDQ2ODgwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIzLnBuZ1wiOiA1MTYzMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNC5wbmdcIjogNTM5MjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjUucG5nXCI6IDU3MjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI2LnBuZ1wiOiA1OTQ4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNy5wbmdcIjogNjA4MzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjgucG5nXCI6IDYyNzUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI5LnBuZ1wiOiA2ODE1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMC5wbmdcIjogNzE4MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzEucG5nXCI6IDc0NTcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMyLnBuZ1wiOiA4MjcyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMy5wbmdcIjogODcxNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzQucG5nXCI6IDkyNjczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM1LnBuZ1wiOiA5OTMxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNi5wbmdcIjogMTA4NDI0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM3LnBuZ1wiOiAxMTMzOTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzgucG5nXCI6IDExNzA5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOS5wbmdcIjogMTI4MTU5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQwLnBuZ1wiOiAxMzQwNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDEucG5nXCI6IDE0NDkwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Mi5wbmdcIjogMTU0ODMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQzLnBuZ1wiOiAxNjI0MDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDQucG5nXCI6IDE1Nzc0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NS5wbmdcIjogMTY2NTM4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ2LnBuZ1wiOiAxNTc4NjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDcucG5nXCI6IDE1NDIyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0OC5wbmdcIjogMTU1ODYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ5LnBuZ1wiOiAxNDQ0MDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTAucG5nXCI6IDEzODI2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MS5wbmdcIjogMTMzNjE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUyLnBuZ1wiOiAxMjI4MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTMucG5nXCI6IDExNzA3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1NC5wbmdcIjogMTIwMzAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU1LnBuZ1wiOiAxMDYwOTNcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImR1c3R5XCI6IFwiYXNzZXRzL2F1ZGlvL2R1c3R5Lm1wM1wiLFxuICAgIFwiYmxhZGVyYW5nZXJcIjogXCJhc3NldHMvYXVkaW8vYmxhZGUubXAzXCIsXG4gICAgXCJjYWJiaWVcIjogXCJhc3NldHMvYXVkaW8vY2FiYmllLm1wM1wiLFxuICAgIFwiZGlwcGVyXCI6IFwiYXNzZXRzL2F1ZGlvL2RpcHBlci5tcDNcIixcbiAgICBcIndpbmRsaWZ0ZXJcIjogXCJhc3NldHMvYXVkaW8vd2luZGxpZnRlci5tcDNcIixcbiAgICBcInRlYW1cIjogXCJhc3NldHMvYXVkaW8vdGVhbS5tcDNcIlxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImNsYXNzXCI6IFwiY2FubmVkXCIsXG4gICAgXCJjb3B5XCI6IFwiTm93IHRoYXQgd2Uga25vdyBtb3JlIGFib3V0IHlvdSwgaXQncyB5b3VyIHR1cm4gdG8gYXNrIGZpcmUgcmFuZ2VyIHNvbWUgcXVlc3Rpb25zXCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGpvYiBhdCBQaXN0b24gUGVhaz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJqb2JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG8geW91IGZpZ2h0IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb3Jlc3RmaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhhdmUgeW91IGFsd2F5cyBiZWVuIGEgZmlyZWZpZ2h0ZXI/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmlyZWZpZ2h0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaG8gaXMgeW91ciBiZXN0IGZyaWVuZD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJiZXN0ZnJpZW5kXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hlcmUgaXMgeW91ciBmYXZvcml0ZSBwbGFjZSB0byBmbHk/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGVwbGFjZVwiXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwibmFtZVwiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNsYXNzXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY29weVwiOiBcIldobyBkbyB5b3Ugd2FudCB0byB3cml0ZSB0bz9cIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEdXN0eVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImR1c3R5XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmxhZGUgUmFuZ2VyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmxhZGVyYW5nZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJDYWJiaWVcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJjYWJiaWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEaXBwZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkaXBwZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaW5kbGlmdGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwid2luZGxpZnRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlRoZSBUZWFtXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwidGVhbVwiXG4gICAgICAgIH1cbiAgICBdLFxuICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcInF1ZXN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQncyB5b3VyIGZhdm9yaXRlIGNvbG9yP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmx1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmx1ZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk9yYW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwib3JhbmdlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiR3JlZW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImdyZWVuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiWWVsbG93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJ5ZWxsb3dcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQdXJwbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInB1cnBsZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1mb29kXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtZm9vZFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIGZvb2Q/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUGl6emFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInBpenphXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSWNlIENyZWFtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJpY2VjcmVhbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJyb2Njb2xpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJicm9jY29saVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkZyZW5jaCBGcmllc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZnJlbmNoZnJpZXNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDaGlja2VuIE51Z2dldHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNoaWNrZW5udWdnZXRzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUEImSlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGJqXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLXNwb3J0XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtc3BvcnRcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBzcG9ydD9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJGb290YmFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZm9vdGJhbGxcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCYXNlYmFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmFzZWJhbGxcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIb2NrZXlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImhvY2tleVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN3aW1taW5nL0RpdmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic3dpbW1pbmdcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTb2NjZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInNvY2NlclwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJhY2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmFjaW5nXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiZHVzdHlcIiA6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhpIEhvdCBTdHVmZiFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkkgd2FzIHJlYWxseSBleGNpdGVkIHRvIHJlY2VpdmUgeW91ciBhaXJtYWlsIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiSSd2ZSBnb3R0YSBnZXQgYmFjayB0byBmaWdodGluZyBmaXJlcyBoZXJlLCBidXQgeW91IHN0YXkgc3Ryb25nIEhvdCBTdHVmZiFcIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCIxMC00XCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSdtIGEgU0VBVCwgb3IgYSBTaW5nbGUtRW5naW5lIEFpciBUYW5rZXIsIHdpdGggdGhlIFBpc3RvbiBQZWFrIEFpciBBdHRhY2sgVGVhbSwgYW4gZWxpdGUgZ3JvdXAgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0LlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBjYW4gc2Nvb3Agd2F0ZXIgZnJvbSBsYWtlcyBhbmQgZGl2ZSBpbnRvIHRoZSBmb3Jlc3QgdG8gZHJvcCB0aGUgd2F0ZXIgb24gd2lsZGZpcmVzLiBTcGVlZCBjb3VudHMgd2hlbiBhbiBhaXIgcmVzY3VlIGlzIHVuZGVyIHdheSwgc28gSSdtIGFsd2F5cyByZWFkeSB0byBmbHkgaW50byBkYW5nZXIhXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJCZWZvcmUgam9pbmluZyB0aGUgQWlyIEF0dGFjayBUZWFtLCBJIHdhcyBhIHdvcmxkLWZhbW91cyBhaXIgcmFjZXIg4oCTIEkgZXZlbiByYWNlZCBhcm91bmQgdGhlIHdvcmxkISAgTm93IEkgcmFjZSB0byBwdXQgb3V0IGZpcmVzLlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJJdCB3YXNuJ3QgZWFzeSBiZWNvbWluZyBhIGNoYW1waW9uIHJhY2VyIG9yIGEgZmlyZWZpZ2h0ZXIgYnV0IEkndmUgaGFkIGFuIGFtYXppbmcgdGVhbSBvZiBmcmllbmRzIHdpdGggbWUgZXZlcnkgc3RlcCBvZiB0aGUgd2F5IVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGhhdmUgYmVlbiBmbHlpbmcgZm9yIGFzIGxvbmcgYXMgSSBjYW4gcmVtZW1iZXIgYnV0IG15IGZhdm9yaXRlIHBsYWNlIHRvIGZseSBpcyBhYm92ZSBteSBob21ldG93biwgUHJvcHdhc2ggSnVuY3Rpb24uIEkgZG8gc29tZSBmYW5jeSBmbHlpbmcgdGhlcmUhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIiV0ZW1wbGF0ZSUgc291bmRzIGRlbGljaW91cyEgSSBtZWFuLCBhbnl0aGluZydzIGJldHRlciB0byBlYXQgdGhhbiBWaXRhbWluYW11bGNoLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgR1JFRU4uIEdyZWVuIG1lYW5zIGdvISBBbmQgSSBsb3ZlIHRvIGdvIGZhc3QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJIHdhcyBhIGNoYW1waW9uIHJhY2VyIG5vdCB0b28gbG9uZyBhZ28uIFJhY2luZyBpcyBkZWZpbml0ZWx5IG15IGZhdm9yaXRlIHNwb3J0LlwiXG4gICAgfSxcbiAgICBcImRpcHBlclwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIaSB0aGVyZSwgRHVzdCBNdWZmaW4hXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJJJ20gRGlwcGVyLiBUaGF0J3Mgd2hhdCBldmVyeW9uZSBjYWxscyBtZS4gU28geW91IGNhbiB0b28hXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaGFua3MgZm9yIHdyaXRpbmcgdG8gbWUgJXRlbXBsYXRlJS5cIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJSZW1lbWJlciwgdGhlIHNreSdzIHRoZSBsaW1pdCFcIixcbiAgICAgICAgXCJqb2JcIjogXCJJIGhhdmUgYSByZWFsbHkgaW1wb3J0YW50IGpvYiBmaWdodGluZyB3aWxkZmlyZXMuIEknbSBhIFN1cGVyLXNjb29wZXIgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQXR0YWNrIFRlYW0uXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGZpZ2h0IGZvcmVzdCBmaXJlcyBpbiBzZXZlcmFsIHdheXMuICBTb21ldGltZXMgSSBkcm9wIHJldGFyZGFudCB0byBjb250YWluIGEgZmlyZS4gIEkgY2FuIGFsc28gc2Nvb3Agd2F0ZXIgZnJvbSB0aGUgbGFrZSBhbmQgZHJvcCBpdCBkaXJlY3RseSBvbiB0aGUgZmlyZS4gTXkgYm9zcyBCbGFkZSBSYW5nZXIgY2FsbHMgbWUgYSBNdWQtRHJvcHBlciFcIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHVzZWQgdG8gaGF1bCBjYXJnbyB1cCBpbiBBbmNob3JhZ2UuIFllcCwgYSBsb3Qgb2YgZ3V5cyBpbiBBbGFza2EuIEkgd2FzIGJlYXRpbmcgdGhlbSBvZmYgd2l0aCBhIHN0aWNrIVwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZCBpcyBjaGFtcGlvbiByYWNlciBEdXN0eSBDcm9waG9wcGVyLiBJJ20gaGlzIGJpZ2dlc3QgZmFuIVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJNeSBmYXZvcml0ZSBwbGFjZSB0byBmbHkgaXMgdGhlIEZ1c2VsIExvZGdlLCByaWdodCBoZXJlIGluIFBpc3RvbiBQZWFrLiBJdCdzIHNvIGJlYXV0aWZ1bC4gQW5kIHdoZXJlIER1c3R5IGFuZCBJIGhhZCBvdXIgZmlyc3QgZGF0ZSEgSXQgd2FzIGEgZGF0ZSwgcmlnaHQ/IEknbSBwcmV0dHkgc3VyZSBpdCB3YXMgYSBkYXRlLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJXaGlsZSAldGVtcGxhdGUlIHNvdW5kcyByZWFsbHkgZ29vZCwgdGhlcmUncyBub3RoaW5nIGJldHRlciB0aGFuIGEgZnJlc2ggY2FuIG9mIG9pbCFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIldoYXQncyBteSBmYXZvcml0ZSBjb2xvcj8gWUVMTE9XIGxpa2UgdGhlIHN1bnNoaW5lLi4gYW5kIGxpa2UgTUUhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJTd2ltbWluZy9kaXZpbmcgaXMgbXkgZmF2b3JpdGUgc3BvcnQhIEkgbG92ZSBkaXBwaW5nIGluIGFuZCBvdXQgb2YgdGhlIHdhdGVyLlwiXG4gICAgfSxcbiAgICBcIndpbmRsaWZ0ZXJcIjoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGVsbG8gZnJpZW5kIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiSSBlbmpveWVkIHJlYWRpbmcgeW91ciBsZXR0ZXIhXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaGFua3MgZm9yIHlvdXIgbGV0dGVyICV0ZW1wbGF0ZSUuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiWW91ciBuZXcgZnJpZW5kXCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSBhbSBhIEhlYXZ5LUxpZnQgSGVsaWNvcHRlciB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGNyZXcgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0LlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiQmxhZGUgY2FsbHMgbWUgYSBcXFwiTXVkIERyb3BwZXJcXFwiIGJlY2F1c2UgSSBoYXZlIGEgZGV0YWNoYWJsZSB0YW5rIGxvYWRlZCB3aXRoIGZpcmUgcmV0YXJkYW50IHRvIGhlbHAgcHV0IG91dCB0aGUgZmlyZXMuICBNdWQgaXMgc2xhbmcgZm9yIHJldGFyZGFudC4gIEkgY2FuIGhvbGQgbW9yZSByZXRhcmRhbnQgdGhhbiBhbnlvbmUgZWxzZSBvbiB0aGUgdGVhbS5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHVzZWQgdG8gYmUgYSBsdW1iZXJqYWNrLCBsaWZ0aW5nIGRvemVucyBvZiBoZWF2eSBsb2dzIGFuZCBjYXJyeWluZyB0aGVtIHRvIHRoZSBsdW1iZXIgbWlsbC4gIEJ1dCBub3cgSSBhbSBhIGZpcmVmaWdodGVyIGFuZCB0aGlzIGtlZXBzIG1lIHZlcnkgYnVzeS5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSSB3b3VsZCBsaWtlIHRvIGJlIFlPVVIgYmVzdCBmcmllbmQuXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkgbGlrZSB0byBmbHkgbWFueSBwbGFjZXMgYW5kIGJlIG9uZSB3aXRoIHRoZSB3aW5kLiBUaGUgd2luZCBzcGVha3MsIFdpbmRsaWZ0ZXIgbGlzdGVucy5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBzb3VuZHMgZGVsaWNpb3VzISBIYXZlIHlvdSB0cmllZCBpdCB3aXRoIGEgY2FuIG9mIG9pbD8gVGhhdCdzIG15IGZhdm9yaXRlIGZvb2QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBCTFVFIGxpa2UgdGhlIHdhdGVyIGFuZCB0aGUgc2t5LlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiSSBkb24ndCBwbGF5IG1hbnkgc3BvcnRzLCBidXQgSSBhbSBhbiBhdmlkIHdlaWdodCBsaWZ0ZXIuIFlvdSdsbCBvZnRlbiBzZWUgbWUgbGlmdGluZyBoZWF2eSBsb2FkcyBvZiBsb2dzIGluIG15IG9mZiB0aW1lXCJcbiAgICB9LFxuICAgIFwiYmxhZGVyYW5nZXJcIjoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGkgQ2hhbXAhXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJJJ20gQmxhZGUgUmFuZ2VyLiBCdXQgbXkgZnJpZW5kcyBqdXN0IGNhbGwgbWUgQmxhZGUuXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJXZWxsLCBJIHNob3VsZCBnZXQgYmFjayB0byB3b3JrLiBXaGVyZSB0aGVyZSdzIHNtb2tlLCB0aGVyZSdzIGZpcmUgZmlyZSBhdHRhY2shIFRoYW5rcyBmb3IgeW91ciBsZXR0ZXIgJXRlbXBsYXRlJS5cIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJZb3VyIHBhcnRuZXJcIixcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYSBGaXJlIGFuZCBSZXNjdWUgSGVsaWNvcHRlciwgYW5kIHRoZSBDb3B0ZXIgaW4gQ2hhcmdlIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2hlbiB0aGVyZSdzIGEgZmlyZSwgSSBnaXZlIHRoZSBvcmRlcnMgZm9yIHRoZSBBaXIgQXR0YWNrIFRlYW0gdG8gc3ByaW5nIGludG8gYWN0aW9uIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSd2ZSBiZWVuIHRoZSBDaG9wcGVyIENhcHRhaW4gZm9yIGEgbG9uZyB0aW1lLCBidXQgSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgd2FzIGEgVFYgc3RhciBvbiBhIHNob3cgYWJvdXQgcG9saWNlIGhlbGljb3B0ZXJzISBCdXQgSSByZWFsaXplZCBJIGRpZG4ndCB3YW50IHRvIHByZXRlbmQgdG8gc2F2ZSBsaXZlcywgSSB3YW50ZWQgdG8gc2F2ZSB0aGVtIGZvciByZWFsIVwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZHMgYXJlIGFsbCB0aGUgdHJhaWxibGF6ZXJzIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFdlIGxpa2UgdG8gdGhpbmsgb2Ygb3Vyc2VsdmVzIGFzIHRoZSBoZXJvZXMgb2YgdGhlIHNreSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBsaWtlIHRvIGZseSB0byBtYW55IHBsYWNlcywgYnV0IG15IGZhdm9yaXRlIHBsYWNlIGlzIGFib3ZlIFBpc3RvbiBQZWFrLiBJIHBhdHJvbCB0aGUgc2tpZXMgYW5kIG1ha2Ugc3VyZSBhbGwgdGhlIHRvdXJpc3RzIGFyZSBjYW1waW5nIGJ5IHRoZSBib29rLiBSZW1lbWJlciwgc2FmZXR5IGZpcnN0IVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJZb3Ugc2F5IHlvdSBsaWtlIHRvIGVhdCAldGVtcGxhdGUlPyBJIHByZWZlciBhIGZyZXNoIGNhbiBvZiBvaWwuIFwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgUkVELCB0aGUgY29sb3Igb2YgRmlyZSBTYWZldHkuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJJZiBJIGhhZCB0byBjaG9vc2UsIGZvb3RiYWxsIHdvdWxkIGJlIG15IGZhdm9yaXRlIHNwb3J0LlwiXG4gICAgfSxcbiAgICBcImNhYmJpZVwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJTYWx1dGUgJXRlbXBsYXRlJSFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkNhYmJpZSBoZXJlLlwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGhhbmtzIGZvciB0aGUgbWVzc2FnZS5cIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJPdmVyIGFuZCBvdXRcIixcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYW4gZXgtbWlsaXRhcnkgY2FyZ28gcGxhbmUgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQXR0YWNrIFRlYW0gLSBmaXJlZmlnaHRpbmcgaXMgYSBiaWcgcmVzcG9uc2liaWxpdHkuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGNhcnJ5IHRoZSBTbW9rZWp1bXBlcnMgLSB3aG8gY2xlYXIgZmFsbGVuIHRyZWVzIGFuZCBkZWJyaXMuIER1cmluZyBhIGZpcmUsIEkgZHJvcCB0aGVtIGZyb20gdGhlIHNreSwgcmlnaHQgb3ZlciB0aGUgZmxhbWVzLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgdXNlZCB0byBkcm9wIGFpcmJvcm5lIHV0aWxpdHkgdmVoaWNsZXMgYmVoaW5kIGVuZW15IGxpbmVzIGR1cmluZyB3YXIuIE5vdyBJIGRyb3AgU21va2VqdW1wZXJzIGF0IFBpc3RvbiBQZWFrLlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJXaG8ncyBteSBiZXN0IGZyaWVuZD8gVGhhdCdzIHByb2JhYmx5IFRvcCBTZWNyZXQgYnV0IEkgY2FuIHNheSB0aGUgU21va2VqdW1wZXJzIGFyZSBteSBjbG9zZXN0IHJlY3J1aXRzLlwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJJ3ZlIGZsb3duIG92ZXIgbWFueSBwbGFjZXMgaW4gbXkgdGltZS4gTXkgZmF2b3JpdGUgc3BvdCBpcyBBbmNob3IgTGFrZSAtIGEgbG9uZyBib2R5IG9mIHdhdGVyIHdpdGggYW4gYW5jaG9yLXNoYXBlZCBpc2xhbmQuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIkluIHRoZSBtaWxpdGFyeSwgYWxsIGZvb2QgaXMgcmF0aW9uZWQgYnV0IEknbGwgdGFrZSBhcyBtdWNoIGZyZXNoIG9pbCBhcyBJIGNhbiBnZXQhIFwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgR1JFRU4gLSBpdCBjYW4gaGVscCBtZSBoaWRlIGFib3ZlIHRoZSBwaW5lIHRyZWVzLlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiQmFzZWJhbGwgaXMgbXkgZmF2b3JpdGUgc3BvcnQuIEkgYWx3YXlzIGhhdmUgZml2ZSBzbW9rZWp1bXBlcnMgaW4gbXkgY2FyZ28gLSBqdXN0IGVub3VnaCB0byBjb3ZlciB0aGUgYmFzZXMuXCJcbiAgICB9LFxuICAgIFwidGVhbVwiOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIZXkgZnJpZW5kIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiVGhhbmtzIGZvciB3cml0aW5nIHRvIHVzLlwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGltZSB0byBnZXQgYmFjayB0byB3b3JrIVwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIkhvaXN0IVwiLFxuICAgICAgICBcImpvYlwiOiBcIlRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0gaXMgYW4gZWxpdGUgZ3JvdXAgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0cy4gXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJXZSBmbHkgaW4gd2hlbiBvdGhlcnMgYXJlIGZseWluIG91dC4gSXQgdGFrZXMgYSBzcGVjaWFsIGtpbmRhIHBsYW5lLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiTGlmZSBkb2Vzbid0IGFsd2F5cyBnbyB0aGUgd2F5IHlvdSBleHBlY3QgaXQuIFRoaXMgaXMgYSBzZWNvbmQgY2FyZWVyIGZvciBhbGwgb2YgdXMuIFwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJJdCB0YWtlcyBob25vciwgdHJ1c3QgYW5kIGJyYXZlcnkgdG8gZWFybiB5b3VyIHdpbmdzLiBXZSBkb24ndCBoYXZlIGp1c3Qgb25lIGJlc3QgZnJpZW5kIGJlY2F1c2Ugd2UgbmVlZCBldmVyeSBwbGFuZSB3ZSd2ZSBnb3QgdG8gaGVscC4gXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIlBpc3RvbiBQZWFrIGhhcyBzb21lIGdyZWF0IHBsYWNlcyB0byBmbHkuIEJ1dCBvdXIgZmF2b3JpdGUgc3BvdCBpcyB0aGUgd29vZGVuIHJhaWx3YXkgYnJpZGdlIC0gd2l0aCB0aGUgdGh1bmRlcmluZyBXaGl0ZXdhbGwgRmFsbHMgYmVoaW5kIGl0LlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCIldGVtcGxhdGUlIHNvdW5kcyBncmVhdCBidXQgd2UnZCByYXRoZXIgc2x1cnAgZG93biBmcmVzaCBjYW5zIG9mIG9pbC4gSE9JU1QhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJXZSBsaWtlIGFsbCBjb2xvcnMgb2YgdGhlIHJhaW5ib3cuIEJ1dCBhcyBhIHRlYW0sIG91ciBmYXZvcml0ZSBjb2xvciBpcyAldGVtcGxhdGUlLCBqdXN0IGxpa2UgeW91IVwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiSXQncyBoYXJkIHRvIHBpY2sgYSBmYXZvcml0ZSBzcG9ydCAtIHdlJ3JlIGEgZmFuIG9mIGFueXRoaW5nIHRoYXQgbGV0IHVzIHdvcmsgYXMgYSB0ZWFtIVwiXG4gICAgfVxufSIsInZhciBkZXZpY2UgPSB7XG4gICAgaXNBbmRyb2lkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc0FuZHJvaWRUYWJsZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAhPT0gbnVsbFxuICAgICAgICAgICAgJiYgKFxuICAgICAgICAgICAgKCh3aW5kb3cub3JpZW50YXRpb24gPT09IDAgfHwgd2luZG93Lm9yaWVudGF0aW9uID09PSAxODAgKSAmJiBzY3JlZW4ud2lkdGggPiA2NDApXG4gICAgICAgICAgICAgICAgfHwgKCh3aW5kb3cub3JpZW50YXRpb24gPT09IC05MCB8fCB3aW5kb3cub3JpZW50YXRpb24gPT09IDkwKSAmJiBzY3JlZW4uaGVpZ2h0ID4gNjQwKVxuICAgICAgICAgICAgKTtcbiAgICB9LFxuICAgIGlzQmxhY2tCZXJyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNJT1M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzSXBhZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNPcGVyYTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9PcGVyYSBNaW5pL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNXaW5kb3dzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNUYWJsZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0FuZHJvaWRUYWJsZXQoKSB8fCB0aGlzLmlzSXBhZCgpO1xuICAgIH0sXG4gICAgaXNNb2JpbGU6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNUYWJsZXQoKSAmJiAodGhpcy5pc0lPUygpIHx8IHRoaXMuaXNBbmRyb2lkKCkgfHwgdGhpcy5pc0JsYWNrQmVycnkoKSB8fCB0aGlzLmlzT3BlcmEoKSB8fCB0aGlzLmlzV2luZG93cygpKTtcbiAgICB9LFxuICAgIGN1cnJlbnREZXZpY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pc01vYmlsZSgpKVxuICAgICAgICAgICAgcmV0dXJuIFwibW9iaWxlXCI7XG4gICAgICAgIGlmICh0aGlzLmlzVGFibGV0KCkpXG4gICAgICAgICAgICByZXR1cm4gXCJ0YWJsZXRcIjtcbiAgICAgICAgcmV0dXJuIFwiZGVza3RvcFwiO1xuICAgIH0sXG4gICAgY3VycmVudERldmljZU5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2l0Y2godHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSB0aGlzLmlzQW5kcm9pZCgpOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQW5kcm9pZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNCbGFja0JlcnJ5KCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJCbGFja0JlcnJ5XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc09wZXJhKCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJPcGVyYSBNaW5pXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc1dpbmRvd3MoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIklFTW9iaWxlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc0lPUygpOiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJcGFkKCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImlQYWRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJpUGhvbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJEZXNrdG9wXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXZpY2U7IiwiXG5cblxuXG4vLyBhZGRzIG91ciBjdXN0b20gbW9kaWZpY2F0aW9ucyB0byB0aGUgUElYSSBsaWJyYXJ5XG5yZXF1aXJlKCcuL3BpeGkvbGliTW9kaWZpY2F0aW9ucycpO1xuXG5cblxudmFyIE1haW5WaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9tYWluVmlldycpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4vZGV2aWNlJyk7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQXBwICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFwcCA9IHt9O1xuXG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUGFzc3dvcmQgU2NyZWVuICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyICRwYXNzd29yZFNjcmVlbiA9ICQoJyNwYXNzd29yZFNjcmVlbicpO1xuXG5pZihkb2N1bWVudC5VUkwuaW5kZXhPZignZGlzbmV5LXBsYW5lczItYWlybWFpbC1zdGFnaW5nLmF6dXJld2Vic2l0ZXMubmV0JykgIT09IC0xKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJ2Rpc25leVBsYW5lc1R3byc7XG5cbiAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2lucHV0W3R5cGU9cGFzc3dvcmRdJyk7XG5cbiAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZigkcGFzc3dvcmRJbnB1dC52YWwoKSA9PT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmFkZU91dCg1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHBhc3N3b3JkU2NyZWVuLnNob3coKTtcblxuICAgIGNvbnNvbGUubG9nKCRwYXNzd29yZFNjcmVlbik7XG59IGVsc2Uge1xuICAgICRwYXNzd29yZFNjcmVlbi5yZW1vdmUoKTtcbn1cblxuXG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KTtcblxuICAgIGFwcC5tYWluVmlldyA9IG5ldyBNYWluVmlldygpO1xuXG4gICAgYXBwLm1haW5WaWV3LnN0YXJ0KCk7XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcblxuXG5cbiIsIlxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4vZGF0YS9hc3NldHMuanNvbicpO1xuXG52YXIgZmlsZU5hbWVzID0gT2JqZWN0LmtleXMoYXNzZXREYXRhLmFzc2V0cyk7XG52YXIgdG90YWxGaWxlcyA9IGZpbGVOYW1lcy5sZW5ndGg7XG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xudmFyIHN0YXJ0VGltZTtcblxuZnVuY3Rpb24gc3RhcnRMb2FkZXIodmlldykge1xuXG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2VMb2FkZWQgPSAodG90YWxGaWxlcyAtIHRoaXMubG9hZENvdW50KS90b3RhbEZpbGVzO1xuICAgICAgICB2YXIgdGltZUVsYXBzZWQgPSBfLm5vdygpIC0gc3RhcnRUaW1lO1xuXG4gICAgICAgIHZpZXcub25Bc3NldFByb2dyZXNzKHBlcmNlbnRhZ2VMb2FkZWQsIHRpbWVFbGFwc2VkKTtcbiAgICB9O1xuICAgIGxvYWRlci5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZXcub25Bc3NldHNMb2FkZWQoKTtcbiAgICB9O1xuXG4gICAgc3RhcnRUaW1lID0gXy5ub3coKTtcbiAgICBsb2FkZXIubG9hZCgpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHN0YXJ0OiBzdGFydExvYWRlclxufTsiLCJcblxuXG52YXIgUXVlc3Rpb24gPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIGNvcHk6ICcnLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgfVxufSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uOyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbiAgICB2YXIgc2NlbmU7XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBUZXh0dXJlIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIGZ1bmN0aW9uIGdldEJsYWRlVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENhYmJpZVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RGlwcGVyVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREdXN0eVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER1c3R5M1RleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER1c3R5NFRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwJywgMCwgMjQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRXaW5kbGlmdGVyVGV4dHVyZXMoKSB7XG4gICAgICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xuICAgIH1cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXplIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgZnVuY3Rpb24gaW5pdENoYXJhY3RlcihuYW1lLCB0ZXh0dXJlcywgYW5jaG9yKSB7XG4gICAgICAgIHZhciBpZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKHRleHR1cmVzKTtcbiAgICAgICAgaWRsZUFuaW1hdGlvbi5hbmNob3IgPSBhbmNob3I7XG5cbiAgICAgICAgdmFyIGNoYXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWUsIGlkbGVBbmltYXRpb24pO1xuXG4gICAgICAgIGNoYXIud2luZG93WCA9IC0xO1xuICAgICAgICBjaGFyLndpbmRvd1kgPSAtMTtcblxuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gMDtcbiAgICAgICAgY2hhci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGNoYXIpO1xuXG4gICAgICAgIHJldHVybiBjaGFyO1xuICAgIH1cblxuICAgIHZhciBjaGFyYWN0ZXJJbml0RnVuY3Rpb25zID0ge1xuICAgICAgICBibGFkZTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0JsYWRlJywgZ2V0QmxhZGVUZXh0dXJlcygpLCB7eDogNDU3Lzk3MCwgeTogMzQ2LzYwMH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgY2FiYmllOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignQ2FiYmllJywgZ2V0Q2FiYmllVGV4dHVyZXMoKSwge3g6IDU0NS8xMjAwLCB5OiAzNTEvNjIyfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBkaXBwZXI6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEaXBwZXInLCBnZXREaXBwZXJUZXh0dXJlcygpLCB7eDogNTM5LzEyMDAsIHk6IDQzNS82Mzh9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGR1c3R5OiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRHVzdHknLCBnZXREdXN0eVRleHR1cmVzKCksIHt4OiA0ODAvMTIwMCwgeTogNDA1Lzk4M30pO1xuICAgICAgICB9KSxcbiAgICAgICAgZHVzdHlEYXJrOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRHVzdHkzJywgZ2V0RHVzdHkzVGV4dHVyZXMoKSwge3g6IDMzNS82MDAsIHk6IDE2NS8zNjB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGR1c3R5Rm91cjogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0R1c3R5NCcsIGdldER1c3R5NFRleHR1cmVzKCksIHt4OiAzNzMvNjAwLCB5OiAxNTQvMzQxfSk7XG4gICAgICAgIH0pLFxuICAgICAgICB3aW5kbGlmdGVyOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignV2luZGxpZnRlcicsIGdldFdpbmRsaWZ0ZXJUZXh0dXJlcygpLCB7eDogMzEwLzYwMCwgeTogMjI4LzM3MX0pO1xuICAgICAgICB9KVxuICAgIH07XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG4gICAgdmFyIGFsbENoYXJhY3RlcnMgPSB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHBpeGlTY2VuZSkge1xuICAgICAgICAgICAgc2NlbmUgPSBwaXhpU2NlbmU7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBfLmVhY2goY2hhcmFjdGVySW5pdEZ1bmN0aW9ucywgZnVuY3Rpb24oaW5pdEZuYywgY2hhcmFjdGVyKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhbGxDaGFyYWN0ZXJzLCBjaGFyYWN0ZXIsIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0Rm5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbENoYXJhY3RlcnM7XG59KSgpO1xuXG5cblxuXG5cblxuXG4iLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbiAgICAvLyBkaXNwbGF5T2JqZWN0IHNob3VsZCBiZSBhbiBpbnN0YW5jZSBvZiBQSVhJLlNwcml0ZSBvciBQSVhJLk1vdmllQ2xpcFxuICAgIHZhciBDaGFyYWN0ZXIgPSBmdW5jdGlvbihuYW1lLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7IC8vIFBhcmVudCBjb25zdHJ1Y3RvclxuXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaWRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQobW92aWVDbGlwKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRJZGxlU3RhdGUobW92aWVDbGlwKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBzZXRJZGxlU3RhdGU6IGZ1bmN0aW9uKHBpeGlTcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZSA9IHBpeGlTcHJpdGU7XG5cbiAgICAgICAgICAgIGlmKHBpeGlTcHJpdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIHBpeGlTcHJpdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGl4aVNwcml0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwaXhpU3ByaXRlLmdvdG9BbmRQbGF5KDApOyAgLy9zdGFydCBjbGlwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQocGl4aVNwcml0ZSk7ICAgLy9hZGQgdG8gZGlzcGxheSBvYmplY3QgY29udGFpbmVyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9hZGQgbW92aWUgY2xpcCB0byBwbGF5IHdoZW4gY2hhcmFjdGVyIGNoYW5nZXMgdG8gc3RhdGVcbiAgICAgICAgYWRkU3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgICAgIG1vdmllQ2xpcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tzdGF0ZV0gPSBtb3ZpZUNsaXA7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKG1vdmllQ2xpcCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcHVibGljIEFQSSBmdW5jdGlvbi4gV2FpdHMgdW50aWwgY3VycmVudCBzdGF0ZSBpcyBmaW5pc2hlZCBiZWZvcmUgc3dpdGNoaW5nIHRvIG5leHQgc3RhdGUuXG4gICAgICAgIGdvVG9TdGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5zdGF0ZXNbc3RhdGVdKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdFcnJvcjogQ2hhcmFjdGVyICcgKyB0aGlzLm5hbWUgKyAnIGRvZXMgbm90IGNvbnRhaW4gc3RhdGU6ICcgKyBzdGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5pZGxlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlkbGUub25Db21wbGV0ZSA9IF8uYmluZCh0aGlzLnN3YXBTdGF0ZSwgdGhpcywgc3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWZ0ZXIgY3VycmVudCBhbmltYXRpb24gZmluaXNoZXMgZ28gdG8gdGhpcyBzdGF0ZSBuZXh0XG4gICAgICAgICAgICAgICAgdGhpcy5pZGxlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3dhcFN0YXRlKHRoaXMsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICAvL3N3aXRjaCBpbW1lZGlhdGVseSBpZiBjaGFyYWN0ZXIgaWRsZSBzdGF0ZSBpcyBhIHNpbmdsZSBzcHJpdGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvL2FkZCBjYWxsYmFjayB0byBydW4gb24gY2hhcmFjdGVyIHVwZGF0ZVxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNhbGxlZCBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZSBieSB3aGF0ZXZlciBQaXhpIHNjZW5lIGNvbnRhaW5zIHRoaXMgY2hhcmFjdGVyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2soKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFN0YXRpYzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUuZ290b0FuZFN0b3AoMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldER5bmFtaWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pZGxlLmdvdG9BbmRQbGF5KDApO1xuICAgICAgICB9LFxuICAgICAgICBmbGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IC0odGhpcy5zY2FsZS54KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVzaFRvVG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAgICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkQXQodGhpcywgbGVuZ3RoLTEpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICAvLyBjaGFuZ2VzIHN0YXRlIGltbWVkaWF0ZWx5XG4gICAgLy8gTk9URTogRnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5IGJ5IGNoYXJhY3Rlci5nb1RvU3RhdGUoKVxuICAgIGZ1bmN0aW9uIHN3YXBTdGF0ZShjaGFyLCBzdGF0ZSkge1xuICAgICAgICB2YXIgaWRsZVN0YXRlID0gY2hhci5pZGxlO1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSBjaGFyLnN0YXRlc1tzdGF0ZV07XG5cbiAgICAgICAgbmV3U3RhdGUub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkgeyAgLy9zd2l0Y2ggYmFjayB0byBpZGxlIGFmdGVyIHJ1blxuICAgICAgICAgICAgaWYoaWRsZVN0YXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBuZXdTdGF0ZS5sb29wID0gZmFsc2U7XG4gICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBuZXdTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICB9XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBleHRlbmRzIERpc3BsYXkgT2JqZWN0IENvbnRhaW5lclxuICAgIGV4dGVuZChQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIsIENoYXJhY3Rlcik7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENoYXJhY3Rlcjtcbn0pKCk7IiwiXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgc3ViKSB7XG4gICAgLy8gQXZvaWQgaW5zdGFudGlhdGluZyB0aGUgYmFzZSBjbGFzcyBqdXN0IHRvIHNldHVwIGluaGVyaXRhbmNlXG4gICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9jcmVhdGVcbiAgICAvLyBmb3IgYSBwb2x5ZmlsbFxuICAgIC8vIEFsc28sIGRvIGEgcmVjdXJzaXZlIG1lcmdlIG9mIHR3byBwcm90b3R5cGVzLCBzbyB3ZSBkb24ndCBvdmVyd3JpdGVcbiAgICAvLyB0aGUgZXhpc3RpbmcgcHJvdG90eXBlLCBidXQgc3RpbGwgbWFpbnRhaW4gdGhlIGluaGVyaXRhbmNlIGNoYWluXG4gICAgLy8gVGhhbmtzIHRvIEBjY25va2VzXG4gICAgdmFyIG9yaWdQcm90byA9IHN1Yi5wcm90b3R5cGU7XG4gICAgc3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoYmFzZS5wcm90b3R5cGUpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9yaWdQcm90bykgIHtcbiAgICAgICAgc3ViLnByb3RvdHlwZVtrZXldID0gb3JpZ1Byb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8gUmVtZW1iZXIgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHdhcyBzZXQgd3JvbmcsIGxldCdzIGZpeCBpdFxuICAgIHN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWI7XG4gICAgLy8gSW4gRUNNQVNjcmlwdDUrIChhbGwgbW9kZXJuIGJyb3dzZXJzKSwgeW91IGNhbiBtYWtlIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eVxuICAgIC8vIG5vbi1lbnVtZXJhYmxlIGlmIHlvdSBkZWZpbmUgaXQgbGlrZSB0aGlzIGluc3RlYWRcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3ViLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHN1YlxuICAgIH0pO1xufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7IiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLypcbiAgICAgKiBDdXN0b20gRWRpdHMgZm9yIHRoZSBQSVhJIExpYnJhcnlcbiAgICAgKi9cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogUmVsYXRpdmUgUG9zaXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1ggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1kgPSAwO1xuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRQb3NpdGlvblggPSBmdW5jdGlvbih3aW5kb3dXaWR0aCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSAod2luZG93V2lkdGggKiB0aGlzLl93aW5kb3dYKSArIHRoaXMuX2J1bXBYO1xuICAgIH07XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25ZID0gZnVuY3Rpb24od2luZG93SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9ICh3aW5kb3dIZWlnaHQgKiB0aGlzLl93aW5kb3dZKSArIHRoaXMuX2J1bXBZO1xuICAgIH07XG5cbiAgICAvLyB3aW5kb3dYIGFuZCB3aW5kb3dZIGFyZSBwcm9wZXJ0aWVzIGFkZGVkIHRvIGFsbCBQaXhpIGRpc3BsYXkgb2JqZWN0cyB0aGF0XG4gICAgLy8gc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBvZiBwb3NpdGlvbi54IGFuZCBwb3NpdGlvbi55XG4gICAgLy8gdGhlc2UgcHJvcGVydGllcyB3aWxsIGJlIGEgdmFsdWUgYmV0d2VlbiAwICYgMSBhbmQgcG9zaXRpb24gdGhlIGRpc3BsYXlcbiAgICAvLyBvYmplY3QgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aW5kb3cgd2lkdGggJiBoZWlnaHQgaW5zdGVhZCBvZiBhIGZsYXQgcGl4ZWwgdmFsdWVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1gnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgoJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93WScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl93aW5kb3dZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWSgkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9idW1wWCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFkgPSAwO1xuXG4gICAgLy8gYnVtcFggYW5kIGJ1bXBZIGFyZSBwcm9wZXJ0aWVzIG9uIGFsbCBkaXNwbGF5IG9iamVjdHMgdXNlZCBmb3JcbiAgICAvLyBzaGlmdGluZyB0aGUgcG9zaXRpb25pbmcgYnkgZmxhdCBwaXhlbCB2YWx1ZXMuIFVzZWZ1bCBmb3Igc3R1ZmZcbiAgICAvLyBsaWtlIGhvdmVyIGFuaW1hdGlvbnMgd2hpbGUgc3RpbGwgbW92aW5nIGFyb3VuZCBhIGNoYXJhY3Rlci5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSAoJHdpbmRvdy53aWR0aCgpICogdGhpcy5fd2luZG93WCkgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYnVtcFknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVtcFk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX2J1bXBZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9ICgkd2luZG93LmhlaWdodCgpICogdGhpcy5fd2luZG93WSkgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogU2NhbGluZyBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuICAgIC8vIHdpbmRvd1NjYWxlIGNvcnJlc3BvbmRzIHRvIHdpbmRvdyBzaXplXG4gICAgLy8gICBleDogd2luZG93U2NhbGUgPSAwLjI1IG1lYW5zIDEvNCBzaXplIG9mIHdpbmRvd1xuICAgIC8vIHNjYWxlTWluIGFuZCBzY2FsZU1heCBjb3JyZXNwb25kIHRvIG5hdHVyYWwgc3ByaXRlIHNpemVcbiAgICAvLyAgIGV4OiBzY2FsZU1pbiA9IDAuNSBtZWFucyBzcHJpdGUgd2lsbCBub3Qgc2hyaW5rIHRvIG1vcmUgdGhhbiBoYWxmIG9mIGl0cyBvcmlnaW5hbCBzaXplLlxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1NjYWxlID0gLTE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zY2FsZU1pbiA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zY2FsZU1heCA9IE51bWJlci5NQVhfVkFMVUU7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zY2FsZVR5cGUgPSAnY29udGFpbic7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVGbmMgPSBNYXRoLm1pbjtcblxuICAgIC8vIFdpbmRvd1NjYWxlOiB2YWx1ZSBiZXR3ZWVuIDAgJiAxLCBvciAtMVxuICAgIC8vIFRoaXMgZGVmaW5lcyB3aGF0ICUgb2YgdGhlIHdpbmRvdyAoaGVpZ2h0IG9yIHdpZHRoLCB3aGljaGV2ZXIgaXMgc21hbGxlcilcbiAgICAvLyB0aGUgb2JqZWN0IHdpbGwgYmUgc2l6ZWQuIEV4YW1wbGU6IGEgd2luZG93U2NhbGUgb2YgMC41IHdpbGwgc2l6ZSB0aGUgZGlzcGxheU9iamVjdFxuICAgIC8vIHRvIGhhbGYgdGhlIHNpemUgb2YgdGhlIHdpbmRvdy5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1NjYWxlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl93aW5kb3dTY2FsZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUd28gcG9zc2libGUgdmFsdWVzOiBjb250YWluIG9yIGNvdmVyLiBVc2VkIHdpdGggd2luZG93U2NhbGUgdG8gZGVjaWRlIHdoZXRoZXIgdG8gdGFrZSB0aGVcbiAgICAvLyBzbWFsbGVyIGJvdW5kIChjb250YWluKSBvciB0aGUgbGFyZ2VyIGJvdW5kIChjb3Zlcikgd2hlbiBkZWNpZGluZyBjb250ZW50IHNpemUgcmVsYXRpdmUgdG8gc2NyZWVuLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnc2NhbGVUeXBlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlVHlwZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVUeXBlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRm5jID0gKHZhbHVlID09PSAnY29udGFpbicpID8gTWF0aC5taW4gOiBNYXRoLm1heDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFNjYWxlID0gZnVuY3Rpb24od2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCkge1xuICAgICAgICB2YXIgbG9jYWxCb3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5fd2luZG93U2NhbGUgKiB0aGlzLl9zY2FsZUZuYyh3aW5kb3dIZWlnaHQvbG9jYWxCb3VuZHMuaGVpZ2h0LCB3aW5kb3dXaWR0aC9sb2NhbEJvdW5kcy53aWR0aCk7XG5cbiAgICAgICAgLy9rZWVwIHNjYWxlIHdpdGhpbiBvdXIgZGVmaW5lZCBib3VuZHNcbiAgICAgICAgc2NhbGUgPSBNYXRoLm1heCh0aGlzLnNjYWxlTWluLCBNYXRoLm1pbihzY2FsZSwgdGhpcy5zY2FsZU1heCkpO1xuXG5cbiAgICAgICAgdGhpcy5zY2FsZS54ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIHRoaXMuc2NhbGUueSA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgIH07XG5cblxuICAgIC8vIFVTRSBPTkxZIElGIFdJTkRPV1NDQUxFIElTIEFMU08gU0VUXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVYID0gMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVkgPSAxO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBXaW5kb3cgUmVzaXplIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQgZm9yIGVhY2ggZGlzcGxheSBvYmplY3Qgb24gd2luZG93IHJlc2l6ZSxcbiAgICAvLyBhZGp1c3RpbmcgdGhlIHBpeGVsIHBvc2l0aW9uIHRvIG1pcnJvciB0aGUgcmVsYXRpdmUgcG9zaXRpb25zIHdpbmRvd1ggYW5kIHdpbmRvd1lcbiAgICAvLyBhbmQgYWRqdXN0aW5nIHNjYWxlIGlmIGl0J3Mgc2V0XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCh3aWR0aCk7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWShoZWlnaHQpO1xuXG4gICAgICAgIGlmKHRoaXMuX3dpbmRvd1NjYWxlICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oZGlzcGxheU9iamVjdCkge1xuICAgICAgICAgICAgZGlzcGxheU9iamVjdC5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogU3ByaXRlc2hlZXQgVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gdXNlZCB0byBnZXQgaW5kaXZpZHVhbCB0ZXh0dXJlcyBvZiBzcHJpdGVzaGVldCBqc29uIGZpbGVzXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIGNhbGw6IGdldEZpbGVOYW1lcygnYW5pbWF0aW9uX2lkbGVfJywgMSwgMTA1KTtcbiAgICAvLyBSZXR1cm5zOiBbJ2FuaW1hdGlvbl9pZGxlXzAwMS5wbmcnLCAnYW5pbWF0aW9uX2lkbGVfMDAyLnBuZycsIC4uLiAsICdhbmltYXRpb25faWRsZV8xMDQucG5nJ11cbiAgICAvL1xuICAgIGZ1bmN0aW9uIGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICB2YXIgbnVtRGlnaXRzID0gKHJhbmdlRW5kLTEpLnRvU3RyaW5nKCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICB2YXIgbnVtWmVyb3MgPSBudW1EaWdpdHMgLSBudW0udG9TdHJpbmcoKS5sZW5ndGg7ICAgLy9leHRyYSBjaGFyYWN0ZXJzXG4gICAgICAgICAgICB2YXIgemVyb3MgPSBuZXcgQXJyYXkobnVtWmVyb3MgKyAxKS5qb2luKCcwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlUHJlZml4ICsgemVyb3MgKyBudW0gKyAnLnBuZyc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFBJWEkuZ2V0VGV4dHVyZXMgPSBmdW5jdGlvbihmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICByZXR1cm4gXy5tYXAoZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgUElYSS5UZXh0dXJlLmZyb21GcmFtZSk7XG4gICAgfTtcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIE1lbW9yeSBDbGVhbnVwICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihkZXN0cm95QmFzZVRleHR1cmUpIHtcbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZChkZXN0cm95QmFzZVRleHR1cmUpKSBkZXN0cm95QmFzZVRleHR1cmUgPSB0cnVlO1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy50ZXh0dXJlLmRlc3Ryb3koZGVzdHJveUJhc2VUZXh0dXJlKTtcbiAgICB9O1xuXG4gICAgUElYSS5Nb3ZpZUNsaXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihkZXN0cm95QmFzZVRleHR1cmUpIHtcbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZChkZXN0cm95QmFzZVRleHR1cmUpKSBkZXN0cm95QmFzZVRleHR1cmUgPSB0cnVlO1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG5cbiAgICAgICAgXy5lYWNoKHRoaXMudGV4dHVyZXMsIGZ1bmN0aW9uKHRleHR1cmUpIHtcbiAgICAgICAgICAgIHRleHR1cmUuZGVzdHJveShkZXN0cm95QmFzZVRleHR1cmUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG5cblxufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciBhbGxDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi9hbGxDaGFyYWN0ZXJzJyk7XG5cbiAgICB2YXIgYmFja2dyb3VuZE1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvYmFja2dyb3VuZCcpO1xuICAgIHZhciBibGFkZXdpcGVNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JsYWRld2lwZScpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcbiAgICB2YXIgcGFyYWNodXRlcnNNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3BhcmFjaHV0ZXJzJyk7XG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKiBQcmltYXJ5IFBpeGkgQW5pbWF0aW9uIENsYXNzICoqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3BhcmVudCBjb25zdHJ1Y3RvclxuICAgICAgICBTY2VuZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGFsbENoYXJhY3RlcnMuaW5pdGlhbGl6ZSh0aGlzKTtcblxuXG4gICAgICAgIGJhY2tncm91bmRNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZEJhY2tncm91bmRUb1NjZW5lKHRoaXMpO1xuICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZFJlc3RUb1NjZW5lKHRoaXMpO1xuXG4gICAgICAgIGJsYWRld2lwZU1vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZUluVXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBhcmFsbGF4IFN0dWZmICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLnNoaWZ0QmFja2dyb3VuZExheWVycyh4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmlldzogZnVuY3Rpb24odmlldykge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgfSxcbiAgICAgICAgX29uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBTY2VuZS5wcm90b3R5cGUuX29uV2luZG93UmVzaXplLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogRXh0ZW5kIGFuZCBFeHBvcnQgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cblxuICAgIC8vIEV4dGVuZHMgU2NlbmUgQ2xhc3NcbiAgICBleHRlbmQoU2NlbmUsIE1haW5TY2VuZSk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFpblNjZW5lO1xufSkoKTsiLCJcblxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG52YXIgU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ0IgPSBmdW5jdGlvbigpe307XG5cbiAgICBQSVhJLlN0YWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5TY2VuZS5wcm90b3R5cGUgPSB7XG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZUNCKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IgPSB1cGRhdGVDQjtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IoKTtcbiAgICB9LFxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVzdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIGlzUGF1c2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGF1c2VkO1xuICAgIH1cbn07XG5cblxuZXh0ZW5kKFBJWEkuU3RhZ2UsIFNjZW5lKTtcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgdmFyIFNjZW5lc01hbmFnZXIgPSB7XG4gICAgICAgIHNjZW5lczoge30sXG4gICAgICAgIGN1cnJlbnRTY2VuZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZXI6IG51bGwsXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsICRwYXJlbnREaXYpIHtcblxuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIucmVuZGVyZXIpIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2lkdGgsIGhlaWdodCwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3BpeGktdmlldycpO1xuICAgICAgICAgICAgJHBhcmVudERpdi5hcHBlbmQoU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3KTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoU2NlbmVzTWFuYWdlci5sb29wKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGxvb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoZnVuY3Rpb24gKCkgeyBTY2VuZXNNYW5hZ2VyLmxvb3AoKSB9KTtcblxuICAgICAgICAgICAgaWYgKCFTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSB8fCBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpKSByZXR1cm47XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnVwZGF0ZSgpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci5yZW5kZXIoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVTY2VuZTogZnVuY3Rpb24oaWQsIFNjZW5lQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIFNjZW5lQ29uc3RydWN0b3IgPSBTY2VuZUNvbnN0cnVjdG9yIHx8IFNjZW5lOyAgIC8vZGVmYXVsdCB0byBTY2VuZSBiYXNlIGNsYXNzXG5cbiAgICAgICAgICAgIHZhciBzY2VuZSA9IG5ldyBTY2VuZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0gPSBzY2VuZTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9LFxuICAgICAgICBnb1RvU2NlbmU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5wYXVzZSgpO1xuXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgPSBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF07XG5cbiAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHJlc2l6ZSB0byBtYWtlIHN1cmUgYWxsIGNoaWxkIG9iamVjdHMgaW4gdGhlXG4gICAgICAgICAgICAgICAgLy8gbmV3IHNjZW5lIGFyZSBjb3JyZWN0bHkgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlc3VtZSBuZXcgc2NlbmVcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5yZXN1bWUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLl9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG5cblxuICAgICR3aW5kb3cub24oJ3Jlc2l6ZScsIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUpO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XG59KSgpOyIsIlxuXG5cblxuXG52YXIgYXVkaW9Bc3NldHMgPSByZXF1aXJlKCcuL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xuXG52YXIgc291bmRQbGF5ZXIgPSB7XG4gICAgbXV0ZWQ6IGZhbHNlLFxuICAgIHZvbHVtZTogMC40LFxuICAgIHNvdW5kczoge30sXG4gICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5zb3VuZHNbZmlsZVBhdGhdID0gdGhpcy5zb3VuZHNbZmlsZVBhdGhdIHx8IG5ldyBBdWRpbyhmaWxlUGF0aCk7XG4gICAgfSxcbiAgICBwbGF5OiBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgICAgICB0aGlzLmFkZChmaWxlUGF0aCk7XG5cbiAgICAgICAgaWYoIXRoaXMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXS52b2x1bWUgPSB0aGlzLnZvbHVtZTtcbiAgICAgICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXS5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbl8uZWFjaChhdWRpb0Fzc2V0cywgZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICBzb3VuZFBsYXllci5hZGQoZmlsZVBhdGgpO1xufSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvdW5kUGxheWVyOyIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBzZWxmPXRoaXM7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhLGRlcHRoMSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyO1xuICBidWZmZXIgKz0gXCJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJvcHRpb25cXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImVtcHR5LXNwYWNlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5uYW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiIHZhbHVlPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBpZD1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJiYWNrZ3JvdW5kXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudGV4dCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50ZXh0KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgICAgICBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuY29weSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5jb3B5KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5vcHRpb25zKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtV2l0aERlcHRoKDEsIHByb2dyYW0xLCBkYXRhLCBkZXB0aDApLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuICAgIDwvZGl2PlxcbjwvZGl2PlwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG5cbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdkaXYubmFtZS5wYWdlJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2hhbmdlIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXlkb3duIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXl1cCBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZScsXG4gICAgICAgICAgICAncGFzdGUgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKHt2YWx1ZTogJyd9KTtcblxuICAgICAgICAgICAgdGhpcy4kbmFtZUlucHV0ID0gdGhpcy4kZWwuZmluZCgnaW5wdXRbdHlwZT10ZXh0XS5uYW1lJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5wbGFjZWhvbGRlcicpO1xuICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXJJbm5lciA9IHRoaXMuJHBsYWNlaG9sZGVyLmZpbmQoJz4gZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZSA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi50aXRsZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgICAgXy5iaW5kQWxsKHRoaXMsICdzdGFydEFuaW1hdGlvbicsJ3Nob3cnLCdoaWRlJywnc2V0SW5hY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFNjZW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLnNjZW5lcy5tYWluO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBSdW4gQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0QW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJlQW5pbWF0aW9uU2V0dXAoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc3RhcnRFbnRlck5hbWVBbmltYXRpb24oKTsgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyc1xuXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuMztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHRpdGxlLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMSwgeTogMCwgZWFzZTogJ0JhY2suZWFzZU91dCd9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRuYW1lSW5wdXQsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGxhY2Vob2xkZXJJbm5lciwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnLCBkZWxheTogMC4xNX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByZUFuaW1hdGlvblNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kdGl0bGUsIHtvcGFjaXR5OiAwLCB5OiAtNzV9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kbmFtZUlucHV0LCB7b3BhY2l0eTogMH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRwbGFjZWhvbGRlcklubmVyLCB7b3BhY2l0eTogMCwgeTogLTUwfSk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIFNob3cvSGlkZSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zdGFydEFuaW1hdGlvbiwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUodGhpcy5zZXRJbmFjdGl2ZSk7XG5cbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kZWwsIDAuMywge29wYWNpdHk6IDB9KTtcblxuICAgICAgICAgICAgICAgIC8vcnVuIGhpZGUgYW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluYWN0aXZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25OYW1lQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy4kbmFtZUlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlci50b2dnbGUodmFsID09PSAnJyk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRlck5hbWVWaWV3O1xufSkoKTtcbiIsIlxuXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc291bmRQbGF5ZXIgPSByZXF1aXJlKCcuLi9zb3VuZFBsYXllcicpO1xuXG4gICAgdmFyIEZvb3RlclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2Zvb3RlcicsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEudm9sdW1lJzogJ29uVm9sdW1lVG9nZ2xlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5udW1Eb3RzID0gb3B0aW9ucy5udW1Eb3RzO1xuXG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb3VudGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocyA9IHRoaXMuJGVsLmZpbmQoJ2Eudm9sdW1lIHBhdGgnKTtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYuY291bnRlcicpO1xuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPbigpO1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT2ZmKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBudW1Eb3RzID0gdGhpcy5udW1Eb3RzO1xuXG4gICAgICAgICAgICB2YXIgJGRvdCA9IHRoaXMuJGRvdHMuZXEoMCk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDI7IGkgPD0gbnVtRG90czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRuZXdEb3QgPSAkZG90LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5maW5kKCc+IGRpdi5udW1iZXInKS5odG1sKGkpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuYXBwZW5kVG8odGhpcy4kY291bnRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gJGRvdDtcbiAgICAgICAgICAgICRkb3QuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiBWb2x1bWUgQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdG9nZ2xlVm9sdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSAhdGhpcy52b2x1bWVPbjtcblxuICAgICAgICAgICAgaWYodGhpcy52b2x1bWVPbikge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgICAgICBzb3VuZFBsYXllci5vbigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9mZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtzdGFydE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlbmRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVhc2luZzogJ0JhY2suZWFzZU91dCcsIG9wYWNpdHk6IDF9O1xuXG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDApLCAwLjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgxKSwgMC4yNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDIpLCAwLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBnZXRUaW1lbGluZVZvbHVtZU9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMSwwLDAsMSwwLDBdLCBlbmRNYXRyaXg6IFswLDAsMCwwLDIyLDMyXSwgZWFzaW5nOiAnQmFjay5lYXNlSW4nLCBvcGFjaXR5OiAwfTtcblxuICAgICAgICAgICAgLy9kZWZhdWx0IG9uXG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5hdHRyKCd0cmFuc2Zvcm0nLCAnbWF0cml4KDEsMCwwLDEsMCwwKScpO1xuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuY3NzKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgxKSwgMC4yNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDIpLCAwLjUsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZFN2Z1BhdGhBbmltYXRpb246IGZ1bmN0aW9uKHRpbWVsaW5lLCAkcGF0aCwgc3RhcnRUaW1lLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uU3BlZWQgPSAwLjI7XG5cbiAgICAgICAgICAgIHZhciBwYXRoTWF0cml4ID0gXy5jbG9uZShvcHRpb25zLnN0YXJ0TWF0cml4KTtcblxuICAgICAgICAgICAgdmFyIHR3ZWVuQXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgZWFzZTogb3B0aW9ucy5lYXNpbmcsXG4gICAgICAgICAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkcGF0aC5hdHRyKCd0cmFuc2Zvcm0nLCAnbWF0cml4KCcgKyBwYXRoTWF0cml4LmpvaW4oJywnKSArICcpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgXy5leHRlbmQodHdlZW5BdHRycywgb3B0aW9ucy5lbmRNYXRyaXgpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKCRwYXRoLCBhbmltYXRpb25TcGVlZCwge29wYWNpdHk6IG9wdGlvbnMub3BhY2l0eX0pLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHBhdGhNYXRyaXgsIGFuaW1hdGlvblNwZWVkLCB0d2VlbkF0dHJzKSwgYW5pbWF0aW9uU3BlZWQgKiBzdGFydFRpbWUpO1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogQ291bnRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzZXRDb3VudGVyOiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLiRkb3RzLmVxKGkpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdCA9IHRoaXMuJGRvdHMuZXEoaSk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGVDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5vdXRlckhlaWdodCgpICsgdGhpcy4kY291bnRlci5vdXRlckhlaWdodCgpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25Wb2x1bWVUb2dnbGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy50b2dnbGVWb2x1bWUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEZvb3RlclZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2RldmljZScpO1xuXG4gICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgIHZhciBpbnRyb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm8nKTtcbiAgICB9XG5cbiAgICB2YXIgSW50cm9WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNpbnRyby12aWV3JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5iZWdpbic6ICdvbkJlZ2luQ2xpY2snXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvblRpbWVsaW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRiZWdpblNjcmVlbiA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5iZWdpbi1zY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luTGluZXMgPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdkaXYubGluZScpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4gPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdhLmJlZ2luJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRBbmltYXRpb25UaW1lbGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVIaWRlID0gdGhpcy5nZXRNb2JpbGVUaW1lbGluZUhpZGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbiA9IHRoaXMuZ2V0TW9iaWxlVGltZWxpbmVCZWdpblNjcmVlbkluKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVIaWRlID0gdGhpcy5nZXRUaW1lbGluZUhpZGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbiA9IHRoaXMuZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0JlZ2luU2NyZWVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KF8uYmluZCh0aW1lbGluZS5wbGF5LCB0aW1lbGluZSksIDIwMCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBnZXRNb2JpbGVUaW1lbGluZUJlZ2luU2NyZWVuSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkxpbmVzLCB7eDogMCwgb3BhY2l0eTogMX0pO1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kYmVnaW5CdG4sIHtvcGFjaXR5OiAxfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRiZWdpbkJ0bi5zaG93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWluVmlldy5zaG93Q29udGVudCgpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBnZXRUaW1lbGluZUJlZ2luU2NyZWVuSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0JhY2suZWFzZU91dCc7XG5cbiAgICAgICAgICAgIHZhciB0d2VlbnMgPSBfLm1hcCh0aGlzLiRiZWdpbkxpbmVzLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhsaW5lLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHR3ZWVuczogdHdlZW5zLFxuICAgICAgICAgICAgICAgIHN0YWdnZXI6IDAuMDgsXG4gICAgICAgICAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kYmVnaW5CdG4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLnNob3coKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYnRuSW5UaW1lID0gMC40O1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlWTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBzY2FsZVg6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0VsYXN0aWMuZWFzZU91dCdcbiAgICAgICAgICAgIH0pLCBidG5JblRpbWUgKyAoYW5pbWF0aW9uVGltZSAqIDAuMDUpKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGludHJvTW9kdWxlLnNob3dMb2dvKCk7XG4gICAgICAgICAgICB9LCAwLjY1KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldE1vYmlsZVRpbWVsaW5lSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBnZXRUaW1lbGluZUhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvRnJhbWVzID0gaW50cm9Nb2R1bGUuZ2V0SW50cm9GcmFtZXMoKTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKiogVGltZWxpbmUgKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRpb25GaW5pc2hlZCxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlU2NvcGU6IHRoaXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpblNjcmVlbiwgYW5pbWF0aW9uVGltZS80LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGludHJvRnJhbWVzLnRvcCwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGludHJvRnJhbWVzLmJ0bSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25BbmltYXRpb25GaW5pc2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgaW50cm9Nb2R1bGUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldE1haW5WaWV3OiBmdW5jdGlvbih2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1haW5WaWV3ID0gdmlldztcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnRzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25CZWdpbkNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUucGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLm1haW5WaWV3LnNob3dDb250ZW50KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbnRyb1ZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gSGVscGVycyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBsb2FkZXIgPSByZXF1aXJlKCcuLi9sb2FkZXInKTtcbiAgICB2YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IFBJWEkgU2NlbmUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIE1haW5TY2VuZSA9IHJlcXVpcmUoJy4uL3BpeGkvbWFpblNjZW5lJyk7XG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDb2xsZWN0aW9ucyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zJyk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gVmlld3Mgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIEludHJvVmlldyA9IHJlcXVpcmUoJy4vaW50cm9WaWV3Jyk7XG4gICAgdmFyIEVudGVyTmFtZVZpZXcgPSByZXF1aXJlKCcuL2VudGVyTmFtZVZpZXcnKTtcbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IHJlcXVpcmUoJy4vc2VsZWN0Q2hhcmFjdGVyVmlldycpO1xuICAgIHZhciBSZXNwb25zZVZpZXcgPSByZXF1aXJlKCcuL3Jlc3BvbnNlVmlldycpO1xuICAgIHZhciBGb290ZXJWaWV3ID0gcmVxdWlyZSgnLi9mb290ZXJWaWV3Jyk7XG5cbiAgICB2YXIgaXNNb2JpbGUgPSBkZXZpY2UuaXNNb2JpbGUoKTtcblxuICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICB2YXIgaW50cm9Nb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2ludHJvJyk7XG4gICAgfVxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBNYWludmlldyBDbGFzcyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIGZ1bmN0aW9uIGdldFZhbHVlcyh2aWV3cykge1xuICAgICAgICByZXR1cm4gXy5tYXAodmlld3MsIGZ1bmN0aW9uKHZpZXcpIHtyZXR1cm4gdmlldy5tb2RlbC5hdHRyaWJ1dGVzLnZhbHVlOyB9KTtcbiAgICB9XG5cbiAgICB2YXIgTWFpblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGFuaW1hdGluZzogZmFsc2UsXG4gICAgICAgIHBhZ2VzOiBbXSxcbiAgICAgICAgYWN0aXZlUGFnZUluZGV4OiAwLFxuICAgICAgICBlbDogJyNjb250ZW50JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5uZXh0JzogJ29uTmV4dCcsXG4gICAgICAgICAgICAnY2xpY2sgYS5maW5pc2gtc2VuZCc6ICdvbkZpbmlzaCcsXG4gICAgICAgICAgICAnY2xpY2sgYS5za2lwJzogJ29uU2tpcCcsXG4gICAgICAgICAgICAnbW91c2Vtb3ZlJzogJ29uTW91c2VNb3ZlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uQXNzZXRQcm9ncmVzczogZnVuY3Rpb24ocGVyY2VudGFnZUxvYWRlZCwgdGltZUVsYXBzZWQpIHtcbiAgICAgICAgICAgIGludHJvTW9kdWxlLnVwZGF0ZUxvYWRlcihwZXJjZW50YWdlTG9hZGVkLCB0aW1lRWxhcHNlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQXNzZXRzTG9hZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLmNyZWF0ZVNjZW5lKCdtYWluJywgTWFpblNjZW5lKTtcbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuZ29Ub1NjZW5lKCdtYWluJyk7XG5cbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgaW50cm9Nb2R1bGUub25Db21wbGV0ZSh0aGlzLmludHJvVmlldy5zaG93QmVnaW5TY3JlZW4uYmluZCh0aGlzLmludHJvVmlldykpO1xuICAgICAgICAgICAgaW50cm9Nb2R1bGUuYXNzZXRzTG9hZGVkKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighXy5pc1VuZGVmaW5lZChpbnRyb01vZHVsZSkpXG4gICAgICAgICAgICAgICAgaW50cm9Nb2R1bGUuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICBpZihpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdtb2JpbGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCgnI2Fzc2V0TG9hZGVyJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuaW5pdGlhbGl6ZSh0aGlzLiR3aW5kb3cud2lkdGgoKSwgdGhpcy4kd2luZG93LmhlaWdodCgpLCB0aGlzLiRlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB2aWV3c1xuICAgICAgICAgICAgdGhpcy5pbml0SW50cm9WaWV3KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRQYWdlcygpO1xuXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXJWaWV3KHtudW1Eb3RzOiB0aGlzLnBhZ2VzLmxlbmd0aH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcgPSBuZXcgUmVzcG9uc2VWaWV3KCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdFdpbmRvd0V2ZW50cygpO1xuXG4gICAgICAgICAgICAvL3NldHVwIG9wdGlvbnMgZm9yIGZpcnN0IGNhbm5lZCB2aWV3XG4gICAgICAgICAgICB0aGlzLmNhbm5lZFZpZXdzID0gXy5maWx0ZXIodGhpcy5wYWdlcywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MgPT09ICdjYW5uZWQnO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNvbnRlbnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0V2luZG93RXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5vbigncmVzaXplJywgXy5iaW5kKHRoaXMucmVwb3NpdGlvblBhZ2VOYXYsIHRoaXMpKTtcblxuLy8gICAgICAgICAgICBpZiAod2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2VvcmllbnRhdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3JpZW50YXRpb24nLCBldmVudC5iZXRhLCBldmVudC5nYW1tYSk7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2Vtb3Rpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW90aW9uJywgZXZlbnQuYWNjZWxlcmF0aW9uLnggKiAyLCBldmVudC5hY2NlbGVyYXRpb24ueSAqIDIpO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW96IG9yaWVudGF0aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJNb3pPcmllbnRhdGlvblwiLCBmdW5jdGlvbihvcmllbnRhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3onLCBvcmllbnRhdGlvbi54ICogNTAsIG9yaWVudGF0aW9uLnkgKiA1MCk7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRJbnRyb1ZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvVmlldyA9IG5ldyBJbnRyb1ZpZXcoKTtcblxuICAgICAgICAgICAgaW50cm9WaWV3LnNldE1haW5WaWV3KHRoaXMpO1xuICAgICAgICAgICAgaW50cm9WaWV3Lm9uQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd0ZpcnN0UGFnZSwgdGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmludHJvVmlldyA9IGludHJvVmlldztcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0UGFnZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoYXJNb2RlbCA9IF8uZmlyc3QoYWxsUXVlc3Rpb25zLm1vZGVscyk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Nb2RlbHMgPSBfLnJlc3QoYWxsUXVlc3Rpb25zLm1vZGVscyk7XG5cbiAgICAgICAgICAgIHZhciBlbnRlck5hbWVWaWV3ID0gbmV3IEVudGVyTmFtZVZpZXcoKTtcbiAgICAgICAgICAgIHZhciBzZWxlY3RDaGFyVmlldyA9IG5ldyBTZWxlY3RDaGFyYWN0ZXJWaWV3KHttb2RlbDogY2hhck1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG5cbiAgICAgICAgICAgIHZhciBxdWVzdGlvblZpZXdzID0gXy5tYXAocXVlc3Rpb25Nb2RlbHMsIGZ1bmN0aW9uKHF1ZXN0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXN0aW9uVmlldyh7bW9kZWw6IHF1ZXN0aW9uTW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gW2VudGVyTmFtZVZpZXcsIHNlbGVjdENoYXJWaWV3XS5jb25jYXQocXVlc3Rpb25WaWV3cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5wYWdlcy1jdG4nKTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdiA9IHRoaXMuJHBhZ2VzQ29udGFpbmVyLmZpbmQoJ2Rpdi5wYWdlLW5hdicpO1xuICAgICAgICAgICAgdGhpcy4kbmV4dCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5uZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLiRmaW5pc2hTZW5kID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLmZpbmlzaC1zZW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHNraXAgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2Euc2tpcCcpO1xuXG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIgPSAkKCcjaGVhZGVyJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiogQ2FubmVkIFF1ZXN0aW9uIFZpZXcgU3R1ZmYgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdXBkYXRlVmlld09wdGlvbnNXaXRoVW51c2VkOiBmdW5jdGlvbihjYW5uZWRWaWV3KSB7XG4gICAgICAgICAgICB2YXIgdXNlZE9wdGlvbnMgPSBfLmNvbXBhY3QoZ2V0VmFsdWVzKHRoaXMuY2FubmVkVmlld3MpKTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBhbGxRdWVzdGlvbnMuZ2V0VW51c2VkQ2FubmVkT3B0aW9ucygzLCB1c2VkT3B0aW9ucyk7XG5cbiAgICAgICAgICAgIGNhbm5lZFZpZXcuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogQ2hhbmdlIFZpZXcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0ZpcnN0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzWzBdLnNob3coKTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdi5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kc2tpcC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMucmVwb3NpdGlvblBhZ2VOYXYoZmFsc2UpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGFnZU5hdiwgMC4zLCB7b3BhY2l0eTogMX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vaGlkZSBhY3RpdmUgcGFnZVxuICAgICAgICAgICAgdmFyIGFjdGl2ZVBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcbiAgICAgICAgICAgIHZhciBuZXh0UGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXggKyAxXTtcblxuICAgICAgICAgICAgaWYobmV4dFBhZ2UuaXNDYW5uZWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld09wdGlvbnNXaXRoVW51c2VkKG5leHRQYWdlKTtcblxuICAgICAgICAgICAgICAgIGlmKCFhY3RpdmVQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93U2tpcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlU2tpcCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gMSAmJiAhaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUodGhpcy5zaG93UGFnZUFmdGVySGlkZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdih0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5mb290ZXIuc2V0Q291bnRlcih0aGlzLmFjdGl2ZVBhZ2VJbmRleCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dQYWdlQWZ0ZXJIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsYXN0UGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXgtMV07XG4gICAgICAgICAgICBpZihsYXN0UGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgbGFzdFBhZ2UucmVtb3ZlT3B0aW9ucygpOyAgIC8vY2FubmVkIG9wdGlvbnMgYXJlIHJlcGVhdGVkIGFuZCBzaGFyZSB0aGUgc2FtZSBJRFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3Nob3cgbmV4dCBwYWdlXG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgbmV4dFBhZ2Uub25TaG93Q29tcGxldGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBuZXh0UGFnZS5zaG93KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID09PSB0aGlzLnBhZ2VzLmxlbmd0aC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RmluaXNoQnRuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlU2tpcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaG93RmluaXNoQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQW5kU2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5oaWRlQ291bnRlcigpO1xuXG4gICAgICAgICAgICB2YXIgcGFnZU1vZGVscyA9IF8ubWFwKHRoaXMucGFnZXMsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5tb2RlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2V0UmVzcG9uc2UocGFnZU1vZGVscyk7XG5cbiAgICAgICAgICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUub25Vc2VyQ2hhcmFjdGVyT3V0KF8uYmluZCh0aGlzLnNjZW5lLnBsYXlXaXBlc2NyZWVuLCB0aGlzLnNjZW5lKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUub25XaXBlc2NyZWVuQ29tcGxldGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lLnJlc3BvbnNlVmlldy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIG1lLnNjZW5lLnNob3dSZXNwb25zZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlT3V0VXNlckNoYXJhY3RlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcjbW9iaWxlLWJhY2tncm91bmRzJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXBvc2l0aW9uUGFnZU5hdjogZnVuY3Rpb24oYW5pbWF0ZSkge1xuICAgICAgICAgICAgdmFyIGFjdGl2ZVBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgdmFyIHBpeGVsUG9zaXRpb24gPSAoYWN0aXZlUGFnZS4kZWwub2Zmc2V0KCkudG9wICsgYWN0aXZlUGFnZS4kZWwub3V0ZXJIZWlnaHQoKSk7XG5cbiAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSB0aGlzLiR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIHZhciB0b3BGcmFjID0gTWF0aC5taW4ocGl4ZWxQb3NpdGlvbi93aW5kb3dIZWlnaHQsICh3aW5kb3dIZWlnaHQgLSB0aGlzLmZvb3Rlci5oZWlnaHQoKSAtIHRoaXMuJHBhZ2VOYXYub3V0ZXJIZWlnaHQoKSkvd2luZG93SGVpZ2h0KTtcblxuICAgICAgICAgICAgdmFyIHBlcmNUb3AgPSAxMDAgKiB0b3BGcmFjICsgJyUnO1xuXG4gICAgICAgICAgICBpZighIWFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGFnZU5hdiwgMC4yLCB7dG9wOiBwZXJjVG9wLCBlYXNlOidRdWFkLmVhc2VJbk91dCd9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygndG9wJywgcGVyY1RvcCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBoaWRlU2tpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kc2tpcCwgMC4yLCB7Ym90dG9tOiAnMTAwJSd9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1NraXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHNraXAsIDAuMiwge2JvdHRvbTogMH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dDb250ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlci5zaG93KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGVDb250ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIGxvYWRlci5zdGFydCh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcuc2hvd0JlZ2luU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25OZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF0ubW9kZWwuYXR0cmlidXRlcy52YWx1ZSA9PT0gJydcbiAgICAgICAgICAgICAgICB8fCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA+PSAodGhpcy5wYWdlcy5sZW5ndGggLSAxKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRmluaXNoOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuZmluaXNoQW5kU2VuZCgpO1xuICAgICAgICB9LFxuICAgICAgICBvbk1vdXNlTW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZihfLmlzVW5kZWZpbmVkKHRoaXMuc2NlbmUpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzKGUucGFnZVgvdGhpcy4kd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9LFxuICAgICAgICBvblNraXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hbmltYXRpbmcgfHwgdGhpcy5hY3RpdmVQYWdlSW5kZXggPj0gKHRoaXMucGFnZXMubGVuZ3RoIC0gMSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluVmlldztcblxuXG5cbn0pKCk7IiwiXG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG5cbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMnKTtcbnZhciBpdGVtQW5pbWF0aW9uc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFnZUl0ZW1zJyk7XG5cbnZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG52YXIgUXVlc3Rpb25WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIC8vIFZhcmlhYmxlc1xuICAgIHNob3dDYWxsYmFjazogZnVuY3Rpb24oKXt9LFxuICAgIGhpZGVDYWxsYmFjazogZnVuY3Rpb24oKXt9LFxuICAgIGNsYXNzTmFtZTogJ3F1ZXN0aW9uIHBhZ2UnLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgaW5wdXRbdHlwZT1yYWRpb10nOiAnb25SYWRpb0NoYW5nZSdcbiAgICB9LFxuICAgIC8vIEZ1bmN0aW9uc1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcblxuICAgICAgICBvcHRpb25zLnBhcmVudC5hcHBlbmQodGhpcy5lbCk7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3ModGhpcy5tb2RlbC5hdHRyaWJ1dGVzLmNsYXNzKTtcblxuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuXG4gICAgICAgIGlmKHRoaXMuJG9wdGlvbnMubGVuZ3RoICE9PSAwICYmICFpc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuICAgIGluaXRBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIGFuaW1hdGlvbnM7XG5cbiAgICAgICAgaWYodGhpcy5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICBhbmltYXRpb25zID0gaXRlbUFuaW1hdGlvbnNNb2R1bGUuZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluID0gYW5pbWF0aW9uc1swXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQgPSBhbmltYXRpb25zWzFdO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSW4udmFycy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxsYmFjaygpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQudmFycy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHRoaXMuJG9wdGlvbnMucmVtb3ZlKCk7XG4gICAgfSxcbiAgICBzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdvcHRpb25zJywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy9yZWluaXRpYWxpemVcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucyA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5vcHRpb24nKTtcblxuICAgICAgICBpZighaXNNb2JpbGUpXG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb25zKCk7XG4gICAgfSxcbiAgICBpc0Nhbm5lZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5hdHRyaWJ1dGVzLmNsYXNzID09PSAnY2FubmVkJztcbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5lbC5pbm5lckhUTUwgPT09ICcnKVxuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICBpZighZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uSW4ucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25PdXQucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25TaG93Q29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc2hvd0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgb25SYWRpb0NoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgdGV4dCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5zaWJsaW5ncygnZGl2LnRleHQnKS5odG1sKCk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpLCB0ZXh0OiB0ZXh0fSk7XG4gICAgfVxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvblZpZXc7IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciByZXNwb25zZU1hcCA9IHJlcXVpcmUoJy4uL2RhdGEvcmVzcG9uc2VNYXAuanNvbicpO1xuXG4gICAgdmFyIHJlc3BvbnNlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9yZXNwb25zZU1vZHVsZScpO1xuXG5cbiAgICB2YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG4gICAgdmFyIGlzTW9iaWxlID0gZGV2aWNlLmlzTW9iaWxlKCk7XG4gICAgdmFyIHByaW50Q2hhcmFjdGVyID0gJyc7XG5cbiAgICB2YXIgUmVzcG9uc2VWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBjaGFyYWN0ZXI6ICcnLFxuICAgICAgICBlbDogJyNyZXNwb25zZScsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEjcHJpbnR2ZXJzaW9uJzogJ3ByaW50J1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZCA9ICQoJyNyZXNwb25zZS1iZycpO1xuICAgICAgICAgICAgdGhpcy4kbGV0dGVyQmFja2dyb3VuZCA9ICQoJyNsZXR0ZXJiZycpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgc2V0UmVzcG9uc2U6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHVzZXJOYW1lID0gKG1vZGVsc1swXS5hdHRyaWJ1dGVzLnZhbHVlID09ICcnKSA/ICdGcmllbmQnIDogbW9kZWxzWzBdLmF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgY2hhcmFjdGVyTW9kZWwgPSBtb2RlbHNbMV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQuYWRkQ2xhc3MoY2hhcmFjdGVyTW9kZWwuYXR0cmlidXRlcy52YWx1ZSk7XG4gICAgICAgICAgICBwcmludENoYXJhY3RlciA9IGNoYXJhY3Rlck1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgYW5zd2VyZWRRdWVzdGlvbnMgPSBfLmZpbHRlcihfLnJlc3QobW9kZWxzLCAyKSwgZnVuY3Rpb24obW9kZWwpIHtyZXR1cm4gbW9kZWwuYXR0cmlidXRlcy52YWx1ZSAhPT0gJyd9KTtcblxuICAgICAgICAgICAgdmFyIHBhcnRpdGlvbmVkUXVlc3Rpb25zID0gXy5wYXJ0aXRpb24oYW5zd2VyZWRRdWVzdGlvbnMsIGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MgIT09ICdjYW5uZWQnO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwZXJzb25hbGl0eU1vZGVscyA9IHBhcnRpdGlvbmVkUXVlc3Rpb25zWzBdO1xuICAgICAgICAgICAgdmFyIGNhbm5lZE1vZGVscyA9IHBhcnRpdGlvbmVkUXVlc3Rpb25zWzFdO1xuXG5cbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXIgPSBjaGFyYWN0ZXJNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyO1xuXG4gICAgICAgICAgICAvLyAqKioqKioqKiBzb3J0IGhlcmUgKioqKioqKipcbiAgICAgICAgICAgIHZhciBjYW5uZWRPcmRlciA9IHtcbiAgICAgICAgICAgICAgam9iOiAwLFxuICAgICAgICAgICAgICBmb3Jlc3RmaXJlczogMSxcbiAgICAgICAgICAgICAgZmlyZWZpZ2h0ZXI6IDIsXG4gICAgICAgICAgICAgIGJlc3RmcmllbmQ6IDMsXG4gICAgICAgICAgICAgIGZhdm9yaXRlcGxhY2U6IDRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwZXJzb25hbGl0eU9yZGVyID0ge1xuICAgICAgICAgICAgICBmb29kOiAwLFxuICAgICAgICAgICAgICBjb2xvcjogMSxcbiAgICAgICAgICAgICAgYW5pbWFsOiAyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc29ydGVkQ2FubmVkTW9kZWxzID0gXy5zb3J0QnkoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7XG4gICAgICAgICAgICAgIHJldHVybiBjYW5uZWRPcmRlclttb2RlbC5hdHRyaWJ1dGVzLnZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2FubmVkTW9kZWxzID0gc29ydGVkQ2FubmVkTW9kZWxzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc29ydGVkUGVyc29uYWxpdHlNb2RlbHMgPSBfLnNvcnRCeShwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpe1xuICAgICAgICAgICAgICByZXR1cm4gcGVyc29uYWxpdHlPcmRlclttb2RlbC5hdHRyaWJ1dGVzLm5hbWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBlcnNvbmFsaXR5TW9kZWxzID0gc29ydGVkUGVyc29uYWxpdHlNb2RlbHM7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5UmVzcG9uc2VzID0gXy5tYXAocGVyc29uYWxpdHlNb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKSAge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMubmFtZV0ucmVwbGFjZSgnJXRlbXBsYXRlJScsIG1vZGVsLmF0dHJpYnV0ZXMudGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGNhbm5lZFJlc3BvbnNlcyA9IF8ubWFwKGNhbm5lZE1vZGVscywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVttb2RlbC5hdHRyaWJ1dGVzLnZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIHZhciBncmVldGluZyA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bJ2dyZWV0aW5nJ10ucmVwbGFjZSgnJXRlbXBsYXRlJScsIHVzZXJOYW1lKTtcbiAgICAgICAgICAgIHZhciBib2R5MSA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bJ2JvZHkxJ107XG4gICAgICAgICAgICB2YXIgYm9keTIgPSByZXNwb25zZU1hcFtjaGFyYWN0ZXJdWydib2R5MiddLnJlcGxhY2UoJyV0ZW1wbGF0ZSUnLCB1c2VyTmFtZSk7O1xuICAgICAgICAgICAgdmFyIHNpbmNlcmVseSA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bJ3NpbmNlcmVseSddICtcIiwgXCI7XG5cblxuICAgICAgICAgICAgcmVzcG9uc2UgKz0gYm9keTEgKyAnICcgKyBjYW5uZWRSZXNwb25zZXMuam9pbignICcpICsgJyAnICsgcGVyc29uYWxpdHlSZXNwb25zZXMuam9pbignICcpICsgJyAnICsgYm9keTI7XG5cbiAgICAgICAgICAgICQoJyNjYXJkLWdyZWV0aW5nJykuaHRtbChncmVldGluZyk7XG4gICAgICAgICAgICAkKCcjY2FyZC1ib2R5JykuaHRtbChyZXNwb25zZSk7XG4gICAgICAgICAgICAkKCcjY2FyZC1zaW5jZXJlbHknKS5odG1sKHNpbmNlcmVseSk7XG4gICAgICAgICAgICAkKCcjY2FyZC1mcm9tJykuaHRtbChjaGFyYWN0ZXIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRsZXR0ZXJCYWNrZ3JvdW5kLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VNb2R1bGUuYW5pbWF0ZUluKHRoaXMuY2hhcmFjdGVyKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDQwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBwcmludDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy8gd2luZG93LnByaW50KCk7XG5cbiAgICAgICAgICAgIHZhciBnID0gJCgnI2NhcmQtZ3JlZXRpbmcnKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgYiA9ICQoJyNjYXJkLWJvZHknKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgcyA9ICQoJyNjYXJkLXNpbmNlcmVseScpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBmID0gJCgnI2NhcmQtZnJvbScpLmh0bWwoKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJ3ByaW50LnBocCcgKyAnP2NoYXI9JyArIHByaW50Q2hhcmFjdGVyICsgJyZncmVldGluZz0nKyBnICsgJyZib2R5PScgKyBiICsgJyZzaW5jZXJlbHk9JyArIHMgKyAnJmZyb209JyArIGYpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VWaWV3O1xufSkoKTsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIHNvdW5kUGxheWVyID0gcmVxdWlyZSgnLi4vc291bmRQbGF5ZXInKTtcbiAgICB2YXIgYXVkaW9Bc3NldHMgPSByZXF1aXJlKCcuLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gUXVlc3Rpb25WaWV3LmV4dGVuZCh7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgY2hhciA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgICAgIHZhciBmaWxlUGF0aCA9IGF1ZGlvQXNzZXRzW2NoYXJdO1xuXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5KGZpbGVQYXRoKTtcblxuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLnNldENoYXJhY3RlcihjaGFyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNlbGVjdENoYXJhY3RlclZpZXc7XG59KSgpOyIsIlwidXNlIHN0cmljdFwiO1xuLypnbG9iYWxzIEhhbmRsZWJhcnM6IHRydWUgKi9cbnZhciBiYXNlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9iYXNlXCIpO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3V0aWxzXCIpO1xudmFyIHJ1bnRpbWUgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3J1bnRpbWVcIik7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxudmFyIGNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn07XG5cbnZhciBIYW5kbGViYXJzID0gY3JlYXRlKCk7XG5IYW5kbGViYXJzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIYW5kbGViYXJzOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFZFUlNJT04gPSBcIjEuMy4wXCI7XG5leHBvcnRzLlZFUlNJT04gPSBWRVJTSU9OO3ZhciBDT01QSUxFUl9SRVZJU0lPTiA9IDQ7XG5leHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc+PSAxLjAuMCdcbn07XG5leHBvcnRzLlJFVklTSU9OX0NIQU5HRVMgPSBSRVZJU0lPTl9DSEFOR0VTO1xudmFyIGlzQXJyYXkgPSBVdGlscy5pc0FycmF5LFxuICAgIGlzRnVuY3Rpb24gPSBVdGlscy5pc0Z1bmN0aW9uLFxuICAgIHRvU3RyaW5nID0gVXRpbHMudG9TdHJpbmcsXG4gICAgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5mdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG59XG5cbmV4cG9ydHMuSGFuZGxlYmFyc0Vudmlyb25tZW50ID0gSGFuZGxlYmFyc0Vudmlyb25tZW50O0hhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbiwgaW52ZXJzZSkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoaW52ZXJzZSB8fCBmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnZlcnNlKSB7IGZuLm5vdCA9IGludmVyc2U7IH1cbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHN0cikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5wYXJ0aWFscywgIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gc3RyO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGFyZykge1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJNaXNzaW5nIGhlbHBlcjogJ1wiICsgYXJnICsgXCInXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSB8fCBmdW5jdGlvbigpIHt9LCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuLCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICAgIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGlmKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaTxqOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgZGF0YS5sYXN0ICA9IChpID09PSAoY29udGV4dC5sZW5ndGgtMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ldLCB7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcih2YXIga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmKGRhdGEpIHsgXG4gICAgICAgICAgICAgIGRhdGEua2V5ID0ga2V5OyBcbiAgICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtkYXRhOiBkYXRhfSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaSA9PT0gMCl7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBVdGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmICghVXRpbHMuaXNFbXB0eShjb250ZXh0KSkgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGxldmVsID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsID8gcGFyc2VJbnQob3B0aW9ucy5kYXRhLmxldmVsLCAxMCkgOiAxO1xuICAgIGluc3RhbmNlLmxvZyhsZXZlbCwgY29udGV4dCk7XG4gIH0pO1xufVxuXG52YXIgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IHsgMDogJ2RlYnVnJywgMTogJ2luZm8nLCAyOiAnd2FybicsIDM6ICdlcnJvcicgfSxcblxuICAvLyBTdGF0ZSBlbnVtXG4gIERFQlVHOiAwLFxuICBJTkZPOiAxLFxuICBXQVJOOiAyLFxuICBFUlJPUjogMyxcbiAgbGV2ZWw6IDMsXG5cbiAgLy8gY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgb2JqKSB7XG4gICAgaWYgKGxvZ2dlci5sZXZlbCA8PSBsZXZlbCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgY29uc29sZVttZXRob2RdLmNhbGwoY29uc29sZSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5leHBvcnRzLmxvZ2dlciA9IGxvZ2dlcjtcbmZ1bmN0aW9uIGxvZyhsZXZlbCwgb2JqKSB7IGxvZ2dlci5sb2cobGV2ZWwsIG9iaik7IH1cblxuZXhwb3J0cy5sb2cgPSBsb2c7dmFyIGNyZWF0ZUZyYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBvYmogPSB7fTtcbiAgVXRpbHMuZXh0ZW5kKG9iaiwgb2JqZWN0KTtcbiAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgdmFyIGxpbmU7XG4gIGlmIChub2RlICYmIG5vZGUuZmlyc3RMaW5lKSB7XG4gICAgbGluZSA9IG5vZGUuZmlyc3RMaW5lO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG5cbiAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIGlmIChsaW5lKSB7XG4gICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiA9IG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4Y2VwdGlvbjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi9iYXNlXCIpLkNPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSByZXF1aXJlKFwiLi9iYXNlXCIpLlJFVklTSU9OX0NIQU5HRVM7XG5cbmZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKFwiK2NvbXBpbGVySW5mb1sxXStcIikuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uOy8vIFRPRE86IFJlbW92ZSB0aGlzIGxpbmUgYW5kIGJyZWFrIHVwIGNvbXBpbGVQYXJ0aWFsXG5cbmZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk5vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZVwiKTtcbiAgfVxuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIHZhciBpbnZva2VQYXJ0aWFsV3JhcHBlciA9IGZ1bmN0aW9uKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7IHJldHVybiByZXN1bHQ7IH1cblxuICAgIGlmIChlbnYuY29tcGlsZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuICAgICAgcGFydGlhbHNbbmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB7IGRhdGE6IGRhdGEgIT09IHVuZGVmaW5lZCB9LCBlbnYpO1xuICAgICAgcmV0dXJuIHBhcnRpYWxzW25hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgdmFyIGNvbnRhaW5lciA9IHtcbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXTtcbiAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSBwcm9ncmFtKGksIGZuLCBkYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHByb2dyYW0oaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBjb21tb24pO1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBwYXJhbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgcHJvZ3JhbVdpdGhEZXB0aDogZW52LlZNLnByb2dyYW1XaXRoRGVwdGgsXG4gICAgbm9vcDogZW52LlZNLm5vb3AsXG4gICAgY29tcGlsZXJJbmZvOiBudWxsXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgbmFtZXNwYWNlID0gb3B0aW9ucy5wYXJ0aWFsID8gb3B0aW9ucyA6IGVudixcbiAgICAgICAgaGVscGVycyxcbiAgICAgICAgcGFydGlhbHM7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIHBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlU3BlYy5jYWxsKFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBuYW1lc3BhY2UsIGNvbnRleHQsXG4gICAgICAgICAgaGVscGVycyxcbiAgICAgICAgICBwYXJ0aWFscyxcbiAgICAgICAgICBvcHRpb25zLmRhdGEpO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGVudi5WTS5jaGVja1JldmlzaW9uKGNvbnRhaW5lci5jb21waWxlckluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtmdW5jdGlvbiBwcm9ncmFtV2l0aERlcHRoKGksIGZuLCBkYXRhIC8qLCAkZGVwdGggKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YV0uY29uY2F0KGFyZ3MpKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGFyZ3MubGVuZ3RoO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtV2l0aERlcHRoID0gcHJvZ3JhbVdpdGhEZXB0aDtmdW5jdGlvbiBwcm9ncmFtKGksIGZuLCBkYXRhKSB7XG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW0gPSBwcm9ncmFtO2Z1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgdmFyIG9wdGlvbnMgPSB7IHBhcnRpYWw6IHRydWUsIGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuXG4gIGlmKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gIH0gZWxzZSBpZihwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO2Z1bmN0aW9uIG5vb3AoKSB7IHJldHVybiBcIlwiOyB9XG5cbmV4cG9ydHMubm9vcCA9IG5vb3A7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBcIlwiICsgdGhpcy5zdHJpbmc7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNhZmVTdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmpzaGludCAtVzAwNCAqL1xudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBlc2NhcGUgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImI3gyNztcIixcbiAgXCJgXCI6IFwiJiN4NjA7XCJcbn07XG5cbnZhciBiYWRDaGFycyA9IC9bJjw+XCInYF0vZztcbnZhciBwb3NzaWJsZSA9IC9bJjw+XCInYF0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl0gfHwgXCImYW1wO1wiO1xufVxuXG5mdW5jdGlvbiBleHRlbmQob2JqLCB2YWx1ZSkge1xuICBmb3IodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDt2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9O1xufVxudmFyIGlzRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xufTtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgaWYgKHN0cmluZyBpbnN0YW5jZW9mIFNhZmVTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAoIXN0cmluZyAmJiBzdHJpbmcgIT09IDApIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gIHN0cmluZyA9IFwiXCIgKyBzdHJpbmc7XG5cbiAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7IiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpW1wiZGVmYXVsdFwiXTtcbiJdfQ==
