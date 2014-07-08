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
    dusty.filters[0].blur = 0;
    dusty.setStatic();
    TweenLite.killTweensOf(dusty);

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


    requestAnimFrame(function() {
        dusty.pushToTop();
    });
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
                windowX: 0.17,
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
	"totalSize": 26048799,
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
		"assets/img/intro-btm.png": 81955,
		"assets/img/intro-top.png": 79346,
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
		"assets/spritesheets/dusty3/Dusty_plane_00000.png": 42179,
		"assets/spritesheets/dusty3/Dusty_plane_00001.png": 42005,
		"assets/spritesheets/dusty3/Dusty_plane_00002.png": 41595,
		"assets/spritesheets/dusty3/Dusty_plane_00003.png": 41269,
		"assets/spritesheets/dusty3/Dusty_plane_00004.png": 42179,
		"assets/spritesheets/dusty3/Dusty_plane_00005.png": 42005,
		"assets/spritesheets/dusty3/Dusty_plane_00006.png": 41595,
		"assets/spritesheets/dusty3/Dusty_plane_00007.png": 41269,
		"assets/spritesheets/dusty3/Dusty_plane_00008.png": 42179,
		"assets/spritesheets/dusty3/Dusty_plane_00009.png": 42005,
		"assets/spritesheets/dusty3/Dusty_plane_00010.png": 41595,
		"assets/spritesheets/dusty3/Dusty_plane_00011.png": 41269,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyby5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYWdlSXRlbXMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcGxhY2VKdXN0T2Zmc2NyZWVuLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9RdWVzdGlvbkNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hc3NldHMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hdWRpb0Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcmVzcG9uc2VNYXAuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGV2aWNlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlXzIwMTAzYWQyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9sb2FkZXIuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL21vZGVscy9xdWVzdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9hbGxDaGFyYWN0ZXJzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2NoYXJhY3Rlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9leHRlbmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvbGliTW9kaWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9tYWluU2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvc2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvc2NlbmVzTWFuYWdlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZW50ZXJOYW1lVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZm9vdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvaW50cm9WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9tYWluVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9yZXNwb25zZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3NlbGVjdENoYXJhY3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvYmFzZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9zYWZlLXN0cmluZy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2phQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBiYWNrZ3JvdW5kLCBtaWRkbGVncm91bmQsIGZvcmVncm91bmQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBiYWNrZ3JvdW5kID0gaW5pdEJhY2tncm91bmQoKTtcbiAgICBtaWRkbGVncm91bmQgPSBpbml0TWlkZGxlZ3JvdW5kKCk7XG4gICAgZm9yZWdyb3VuZCA9IGluaXRGb3JlZ3JvdW5kKCk7XG59XG5mdW5jdGlvbiBzZXRBdHRycyhzcHJpdGUpIHtcbiAgICBzcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuICAgIHNwcml0ZS53aW5kb3dYID0gMC41O1xuICAgIHNwcml0ZS53aW5kb3dZID0gMTtcblxuICAgIHNwcml0ZS5zY2FsZVR5cGUgPSAnY292ZXInO1xuICAgIHNwcml0ZS53aW5kb3dTY2FsZSA9IDEuMDY7XG59XG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZCgpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9zaXRlX2JnLmpwZycpO1xuXG4gICAgc2V0QXR0cnMoYmFja2dyb3VuZCk7XG5cbiAgICByZXR1cm4gYmFja2dyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRNaWRkbGVncm91bmQoKSB7XG4gICAgdmFyIG1pZGRsZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9taWRncm91bmQucG5nJyk7XG4gICAgc2V0QXR0cnMobWlkZGxlZ3JvdW5kKTtcbiAgICByZXR1cm4gbWlkZGxlZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdEZvcmVncm91bmQoKSB7XG4gICAgdmFyIGZvcmVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9yZWdyb3VuZF90cmVlcy5wbmcnKTtcbiAgICBzZXRBdHRycyhmb3JlZ3JvdW5kKTtcbiAgICByZXR1cm4gZm9yZWdyb3VuZDtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFkZEJhY2tncm91bmRUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbiAgICB9LFxuICAgIGFkZFJlc3RUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChtaWRkbGVncm91bmQpO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChmb3JlZ3JvdW5kKTtcbiAgICB9LFxuICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGJhY2tncm91bmQpKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRSYXRpbyA9IDAuNzU7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRSYXRpbyA9IDEuNTtcbiAgICAgICAgdmFyIGZvcmVncm91bmRSYXRpbyA9IDM7XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRYID0gMC41IC0gKHggLSAwLjUpICogYmFja2dyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBtaWRkbGVncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIGZvcmVncm91bmRYID0gMC41IC0gKHggLS41KSAqIGZvcmVncm91bmRSYXRpby81MDtcblxuICAgICAgICBiYWNrZ3JvdW5kLndpbmRvd1ggPSBiYWNrZ3JvdW5kWDtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLndpbmRvd1ggPSBtaWRkbGVncm91bmRYO1xuICAgICAgICBmb3JlZ3JvdW5kLndpbmRvd1ggPSBmb3JlZ3JvdW5kWDtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBiYWNrZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgZm9yZWdyb3VuZC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgYmFja2dyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIG1pZGRsZWdyb3VuZC5kZXN0cm95KCk7XG4gICAgICAgIGZvcmVncm91bmQuZGVzdHJveSgpO1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgd2lwZXNjcmVlblZpZGVvLCB2aWRlb1RpbWVsaW5lO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgd2lwZXNjcmVlblZpZGVvID0gZ2VuZXJhdGVCbGFkZVdpcGVBbmltYXRpb24oKTtcbiAgICB2aWRlb1RpbWVsaW5lID0gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUod2lwZXNjcmVlblZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVCbGFkZVdpcGVBbmltYXRpb24oKSB7XG4gICAgdmFyIHRleHR1cmVzID0gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2JywgNDAwLCA1NTYpO1xuXG4gICAgdmFyIHdpcGVzY3JlZW5WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcCh0ZXh0dXJlcyk7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1ggPSAwLjU7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1NjYWxlID0gMTtcbiAgICB3aXBlc2NyZWVuVmlkZW8uc2NhbGVUeXBlID0gJ2NvdmVyJztcblxuICAgIHdpcGVzY3JlZW5WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG4gICAgd2lwZXNjcmVlblZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ubG9vcCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHdpcGVzY3JlZW5WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcbiAgICB2aWRlby5fdHdlZW5GcmFtZSA9IDA7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmlkZW8sICd0d2VlbkZyYW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5nb3RvQW5kU3RvcCh2YWx1ZSk7XG5cbi8vICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQucGxheSgnV2lwZXNjcmVlbicpO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG5cbiAgICB2YXIgZmFkZU91dFRpbWUgPSAwLjI7XG4gICAgdmFyIGZhZGVPdXRTdGFydCA9IHRpbWVsaW5lLmR1cmF0aW9uKCkgLSAwLjE7XG5cbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnY2FsbGJhY2snLCB0aW1lbGluZS5kdXJhdGlvbigpIC0gMC4xKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odmlkZW8sIGZhZGVPdXRUaW1lLCB7XG4gICAgICAgIGFscGhhOiAwLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0J1xuICAgIH0pLCBmYWRlT3V0U3RhcnQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQod2lwZXNjcmVlblZpZGVvKTtcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIGhpZGVWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgfSxcbiAgICBvblZpZGVvQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUuYWRkKGNhbGxiYWNrLCAnY2FsbGJhY2snKTtcbiAgICB9XG59O1xuXG5cblxuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgYWxsQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4uL3BpeGkvYWxsQ2hhcmFjdGVycycpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBjaGFyYWN0ZXJOYW1lO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBhbmltYXRlSW4sIGFuaW1hdGVPdXQ7XG5cbnZhciBhbmltYXRpb25zSW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjM7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eTtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgICAgIGR1c3R5LndpbmRvd1ggPSAwLjY7XG4gICAgICAgICAgICBkdXN0eS53aW5kb3dTY2FsZSA9IDAuNDI7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMyxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG5cbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgYmxhZGUud2luZG93WCA9IC0uNDtcbiAgICAgICAgICAgIGJsYWRlLndpbmRvd1kgPSAwLjc1O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FiYmllOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjYWJiaWUgPSBhbGxDaGFyYWN0ZXJzLmNhYmJpZTtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgICAgICAgICBjYWJiaWUuaWRsZS53aW5kb3dTY2FsZSA9IDAuNjtcbiAgICAgICAgICAgIGNhYmJpZS5yb3RhdGlvbiA9IDAuNTU7XG4gICAgICAgICAgICBjYWJiaWUud2luZG93WCA9IDAuNDY7XG5cbiAgICAgICAgICAgIGNhYmJpZS5zY2FsZS54ID0gMC44O1xuICAgICAgICAgICAgY2FiYmllLnNjYWxlLnkgPSAwLjg7XG5cbiAgICAgICAgICAgIGNhYmJpZS5maWx0ZXJzWzBdLmJsdXIgPSA3O1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBzd2VlcFRpbWUgPSBhbmltYXRpb25UaW1lICogNy84O1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNSxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLnNjYWxlLCBzd2VlcFRpbWUsIHtcbiAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUuZmlsdGVyc1swXSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgYmx1cjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNTtcblxuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgICAgICBkaXBwZXIucm90YXRpb24gPSAwLjU1O1xuICAgICAgICAgICAgZGlwcGVyLndpbmRvd1ggPSAwLjQ2O1xuXG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueCA9IDAuODtcbiAgICAgICAgICAgIGRpcHBlci5zY2FsZS55ID0gMC44O1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gNztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgc3dlZXBUaW1lID0gYW5pbWF0aW9uVGltZSAqIDcvODtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTgsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlci5zY2FsZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgYmx1cjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aW5kbGlmdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgICAgICAgICB3aW5kbGlmdGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjU2O1xuXG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4od2luZGxpZnRlcik7XG4gICAgICAgICAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAwLjY7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG52YXIgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuZnVuY3Rpb24gb25BbmltYXRpb25PdXRDb21wbGV0ZSgpIHtcbiAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrKCk7XG59XG5cbnZhciBhbmltYXRpb25zT3V0ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ2lyYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogLTAuNSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjI0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjYWJiaWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGNhYmJpZS5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtibHVyOiA0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpcHBlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjEsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSwge2JsdXI6IDR9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2luZGxpZnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC4zLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW4nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSAqIDcvOCwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogVGVhbSBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiB0ZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcikge1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IER1c3R5IH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgZHVzdHkud2luZG93WCA9IC0wLjI7XG4gICAgZHVzdHkuaWRsZS53aW5kb3dTY2FsZSA9IDAuMzU7XG4gICAgZHVzdHkucm90YXRpb24gPSAwLjY7XG4gICAgZHVzdHkuZmlsdGVyc1swXS5ibHVyID0gMDtcbiAgICBkdXN0eS5zZXRTdGF0aWMoKTtcbiAgICBUd2VlbkxpdGUua2lsbFR3ZWVuc09mKGR1c3R5KTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBCbGFkZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oYmxhZGUpO1xuICAgIGJsYWRlLndpbmRvd1ggPSAwLjU1O1xuICAgIGJsYWRlLmlkbGUud2luZG93U2NhbGUgPSAwLjM7XG4gICAgYmxhZGUuc2V0U3RhdGljKCk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQ2FiYmllIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIGNhYmJpZS53aW5kb3dYID0gMC41O1xuICAgIGNhYmJpZS53aW5kb3dZID0gLTAuMztcbiAgICBjYWJiaWUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMjtcbiAgICBjYWJiaWUuZmlsdGVyc1swXS5ibHVyID0gNDtcbiAgICBjYWJiaWUuc2V0U3RhdGljKCk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRGlwcGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIGRpcHBlci5yb3RhdGlvbiA9IDAuNTU7XG5cbiAgICBkaXBwZXIud2luZG93WCA9IC0wLjM7XG4gICAgZGlwcGVyLndpbmRvd1kgPSAwLjY7XG5cbiAgICBkaXBwZXIuZmlsdGVyc1swXS5ibHVyID0gMztcbiAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMjtcbiAgICBkaXBwZXIuc2V0U3RhdGljKCk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IFdpbmRsaWZ0ZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHdpbmRsaWZ0ZXIud2luZG93WCA9IC0wLjM7XG4gICAgd2luZGxpZnRlci53aW5kb3dZID0gMC41O1xuICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMDg7XG4gICAgd2luZGxpZnRlci5yb3RhdGlvbiA9IDAuNDtcbiAgICB3aW5kbGlmdGVyLmZpbHRlcnNbMF0uYmx1ciA9IDE7XG4gICAgd2luZGxpZnRlci5mbGlwKCk7XG4gICAgd2luZGxpZnRlci5zZXRTdGF0aWMoKTtcblxuXG4gICAgcmVxdWVzdEFuaW1GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgZHVzdHkucHVzaFRvVG9wKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGVJblRlYW0oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjM7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIGR1c3R5ID0gYWxsQ2hhcmFjdGVycy5kdXN0eUZvdXI7XG4gICAgdmFyIGJsYWRlID0gYWxsQ2hhcmFjdGVycy5ibGFkZTtcbiAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG4gICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuICAgIHZhciB3aW5kbGlmdGVyID0gYWxsQ2hhcmFjdGVycy53aW5kbGlmdGVyO1xuXG4gICAgdGVhbUFuaW1hdGlvblNldHVwKGR1c3R5LCBibGFkZSwgY2FiYmllLCBkaXBwZXIsIHdpbmRsaWZ0ZXIpO1xuXG4gICAgbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgc3RhZ2dlcjogMC4yNyxcbiAgICAgICAgYWxpZ246ICdzdGFydCcsXG4gICAgICAgIHR3ZWVuczogW1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNTksXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC44MyxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNTIsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4wNSxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjc4LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNyxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE2LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgXVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlT3V0VGVhbSgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuODtcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluJztcblxuICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlGb3VyO1xuICAgIHZhciBibGFkZSA9IGFsbENoYXJhY3RlcnMuYmxhZGU7XG4gICAgdmFyIGNhYmJpZSA9IGFsbENoYXJhY3RlcnMuY2FiYmllO1xuICAgIHZhciBkaXBwZXIgPSBhbGxDaGFyYWN0ZXJzLmRpcHBlcjtcbiAgICB2YXIgd2luZGxpZnRlciA9IGFsbENoYXJhY3RlcnMud2luZGxpZnRlcjtcblxuICAgIG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHN0YWdnZXI6IDAuMjksXG4gICAgICAgIGFsaWduOiAnc3RhcnQnLFxuICAgICAgICB0d2VlbnM6IFtcbiAgICAgICAgICAgIG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1g6IDEuNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjgsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMS4yLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjIsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMS40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjYsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMS42LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHR3ZWVuczogW1xuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlSW4nXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dYOiAxLjMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KVxuICAgICAgICBdLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGR1c3R5LmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuXG4gICAgfSksXG4gICAgYW5pbWF0ZUluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoY2hhcmFjdGVyTmFtZSA9PT0gJ3RlYW0nKSB7XG4gICAgICAgICAgICBhbmltYXRlSW5UZWFtKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlSW4gPSBhbmltYXRpb25zSW5bY2hhcmFjdGVyTmFtZV07XG4gICAgICAgIGFuaW1hdGVPdXQgPSBhbmltYXRpb25zT3V0W2NoYXJhY3Rlck5hbWVdO1xuXG4gICAgICAgIGFuaW1hdGVJbigpO1xuICAgIH0sXG4gICAgYW5pbWF0ZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgYW5pbWF0ZU91dFRlYW0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmltYXRlT3V0KCk7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBzZXRDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBjaGFyYWN0ZXJOYW1lID0gY2hhcmFjdGVyO1xuICAgIH0sXG4gICAgYWxsQ2hhcmFjdGVyczogYWxsQ2hhcmFjdGVyc1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxudmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuLi9waXhpL2FsbENoYXJhY3RlcnMnKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGR1c3R5LCBkaXBwZXIsIHRpbWVsaW5lSW4sIHRpbWVsaW5lT3V0LCB0aW1lbGluZUR1c3R5SG92ZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgZHVzdHkgPSBpbml0aWFsaXplRHVzdHkoKTtcbiAgICBkaXBwZXIgPSBpbml0aWFsaXplRGlwcGVyKCk7XG5cbiAgICB0aW1lbGluZUluID0gZ2VuZXJhdGVBbmltYXRpb25JblRpbWVsaW5lKCk7XG4gICAgdGltZWxpbmVPdXQgPSBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEdXN0eSgpIHtcbiAgICB2YXIgZHVzdHkgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5Rm91cjtcblxuICAgIGR1c3R5LmlkbGUud2luZG93U2NhbGUgPSAwLjMyO1xuICAgIGR1c3R5LndpbmRvd1ggPSAwLjE4O1xuICAgIGR1c3R5LndpbmRvd1kgPSAtMTtcblxuICAgIHJldHVybiBkdXN0eTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZURpcHBlcigpIHtcbiAgICB2YXIgZGlwcGVyID0gYWxsQ2hhcmFjdGVycy5kaXBwZXI7XG5cbiAgICBkaXBwZXIuZmxpcCgpO1xuXG4gICAgZGlwcGVyLndpbmRvd1ggPSAwLjc1O1xuICAgIGRpcHBlci53aW5kb3dZID0gLTE7XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuNDA7XG5cbiAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDg2NS8xMzY2O1xuICAgIGRpcHBlci5pZGxlLmFuaW1hdGlvblNjYWxlWCA9IDAuNztcbiAgICBkaXBwZXIuaWRsZS5hbmltYXRpb25TY2FsZVkgPSAwLjc7XG5cbiAgICBkaXBwZXIuZmlsdGVyc1swXS5ibHVyID0gMTA7XG5cbiAgICByZXR1cm4gZGlwcGVyO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0ZSBJbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciB0aW1lbGluZUR1c3R5SW4gPSBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSk7XG5cbiAgICB0aW1lbGluZS5hZGQodGltZWxpbmVEdXN0eUluLnBsYXkoKSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KS5wbGF5KCksIHRpbWVsaW5lRHVzdHlJbi5kdXJhdGlvbigpKTtcblxuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKS5wbGF5KCksIDAuNCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUluKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjUyLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMTtcbiAgICB2YXIgZWFzaW5nID0gJ1F1YWQuZWFzZUluT3V0JztcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgcmVwZWF0OiAtMVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBidW1wWTogLTE1LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBidW1wWTogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4wO1xuICAgIHZhciBzd2VlcFN0YXJ0VGltZSA9IGFuaW1hdGlvblRpbWUgKiAwLjExO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZGlwcGVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4zMCxcbiAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICB9KSwgMCk7XG5cbiAgICAvL3N3ZWVwIHJpZ2h0XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WDogMC44NixcbiAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCBzd2VlcFN0YXJ0VGltZSk7XG5cbiAgICAvLyBzY2FsZSB1cFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLmlkbGUsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGJsdXI6IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRlIE91dCAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uT3V0VGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lT3V0ID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmVPdXQuYWRkKGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KGRpcHBlcikucGxheSgpLCAwKTtcbiAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkucGxheSgpLCAwKTtcblxuICAgcmV0dXJuIHRpbWVsaW5lT3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlci5pZGxlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS40LFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuNCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgIHdpbmRvd1g6IDEuMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzIsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuNDtcbiAgICB2YXIgZWFzaW5nID0gJ0V4cG8uZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZHVzdHkuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eS5pZGxlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS4zLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuMyxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAtMC4yLFxuICAgICAgICB3aW5kb3dYOiAwLjYsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lSW4ucGxheSgwKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZU91dC5wbGF5KDApO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25JbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aW1lbGluZUluLnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDb21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBnZXRJbnRyb1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMCcsIDAsIDEyMik7XG59XG5mdW5jdGlvbiBnZXRMb2dvVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwJywgMCwgNzIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgcnVubmluZyA9IHRydWU7XG52YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxudmFyIHN0YWdlID0gbmV3IFBJWEkuU3RhZ2UoMHg2NkZGOTkpO1xudmFyIHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpLCBudWxsLCB0cnVlLCB0cnVlKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIC8vIGFkZCB0aGUgcmVuZGVyZXIgdmlldyBlbGVtZW50IHRvIHRoZSBET01cbiAgICByZW5kZXJlci52aWV3LnNldEF0dHJpYnV0ZSgnaWQnLCAncGl4aS1pbnRybycpO1xuICAgICQoJyNjb250ZW50JykuYXBwZW5kKHJlbmRlcmVyLnZpZXcpO1xuXG4gICAgcmVxdWVzdEFuaW1GcmFtZShhbmltYXRlKTtcblxuICAgICR3aW5kb3cub24oJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICBpZighcnVubmluZykgcmV0dXJuO1xuXG4gICAgcmVxdWVzdEFuaW1GcmFtZShhbmltYXRlKTtcblxuICAgIC8vIHJlbmRlciB0aGUgc3RhZ2VcbiAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogSW50cm8gVmlkZW8gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgdmlkZW9UaW1lbGluZSwgdmlkZW87XG5cbnZhciB2aWRlb0NvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbnZhciBiZ0NvbG9ycyA9IHtcbiAgICB0b3BMZWZ0OiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIHRvcDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICB0b3BSaWdodDogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICBidG1MZWZ0OiBuZXcgUElYSS5HcmFwaGljcygpLFxuICAgIGJ0bTogbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgICBidG1SaWdodDogbmV3IFBJWEkuR3JhcGhpY3MoKVxufTtcbnZhciBpbnRyb1ZpZGVvQ29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGludHJvRnJhbWVUb3AgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG52YXIgaW50cm9GcmFtZUJ0bSA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbnZhciBpbnRyb0ZyYW1lVG9wQmc7XG52YXIgaW50cm9GcmFtZUJ0bUJnO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplQmFja2dyb3VuZENvbG9ycygpIHtcblxuICAgIF8uZWFjaChiZ0NvbG9ycywgZnVuY3Rpb24oZ3JhcGhpYykge1xuICAgICAgICBncmFwaGljLmJlZ2luRmlsbCgweDA3MDgwQik7XG4gICAgICAgIGdyYXBoaWMubGluZVN0eWxlKDApO1xuXG4gICAgICAgIGdyYXBoaWMuZHJhd1JlY3QoMCwgMCwgMSwgMSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVJbnRyb0ZyYW1lVG9wKCkge1xuICAgIGludHJvRnJhbWVUb3BCZyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9pbnRyby10b3AucG5nJyk7XG4gICAgaW50cm9GcmFtZVRvcEJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAxKTtcblxuICAgIGludHJvRnJhbWVUb3Aud2luZG93WCA9IC41O1xuICAgIGludHJvRnJhbWVUb3Aud2luZG93WSA9IC41O1xuXG4gICAgYmdDb2xvcnMudG9wTGVmdC53aW5kb3dYID0gLS41O1xuICAgIGJnQ29sb3JzLnRvcExlZnQud2luZG93WSA9IC0uNTtcbiAgICBiZ0NvbG9ycy50b3Aud2luZG93WCA9IC0uNTtcbiAgICBiZ0NvbG9ycy50b3Aud2luZG93WSA9IC0uNTtcblxuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LndpbmRvd1kgPSAtLjU7XG5cbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGJnQ29sb3JzLnRvcExlZnQpO1xuICAgIGludHJvRnJhbWVUb3AuYWRkQ2hpbGQoYmdDb2xvcnMudG9wKTtcbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGJnQ29sb3JzLnRvcFJpZ2h0KTtcbiAgICBpbnRyb0ZyYW1lVG9wLmFkZENoaWxkKGludHJvRnJhbWVUb3BCZyk7XG5cbiAgICBpbnRyb0ZyYW1lVG9wQmcuc2NhbGVNaW4gPSAwLjg7XG5cbiAgICBpbnRyb1ZpZGVvQ29udGFpbmVyLmFkZENoaWxkKGludHJvRnJhbWVUb3ApO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplSW50cm9GcmFtZUJ0bSgpIHtcbiAgICBpbnRyb0ZyYW1lQnRtQmcgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaW50cm8tYnRtLnBuZycpO1xuICAgIGludHJvRnJhbWVCdG1CZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMCk7XG5cbiAgICBpbnRyb0ZyYW1lQnRtLndpbmRvd1ggPSAuNTtcbiAgICBpbnRyb0ZyYW1lQnRtLndpbmRvd1kgPSAuNTtcblxuICAgIGJnQ29sb3JzLmJ0bUxlZnQud2luZG93WCA9IC0uNTtcbiAgICBiZ0NvbG9ycy5idG0ud2luZG93WCA9IC0uNTtcblxuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoYmdDb2xvcnMuYnRtTGVmdCk7XG4gICAgaW50cm9GcmFtZUJ0bS5hZGRDaGlsZChiZ0NvbG9ycy5idG0pO1xuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoYmdDb2xvcnMuYnRtUmlnaHQpO1xuICAgIGludHJvRnJhbWVCdG0uYWRkQ2hpbGQoaW50cm9GcmFtZUJ0bUJnKTtcblxuICAgIGludHJvRnJhbWVCdG1CZy5zY2FsZU1pbiA9IDAuODtcblxuICAgIGludHJvVmlkZW9Db250YWluZXIuYWRkQ2hpbGQoaW50cm9GcmFtZUJ0bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlbygpIHtcbiAgICB2YXIgaW50cm9WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRJbnRyb1RleHR1cmVzKCkpO1xuXG4gICAgaW50cm9WaWRlby53aW5kb3dYID0gMC41O1xuICAgIGludHJvVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcblxuICAgIGludHJvVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIGludHJvVmlkZW8ubG9vcCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIGludHJvVmlkZW87XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmlkZW8uX3R3ZWVuRnJhbWUgPSAwO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIGluaXRpYWxpemVCYWNrZ3JvdW5kQ29sb3JzKCk7XG5cbiAgICBzdGFnZS5hZGRDaGlsZChpbnRyb1ZpZGVvQ29udGFpbmVyKTtcbn0pKCk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogTG9nbyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBsb2dvLCBsb2dvVGltZWxpbmU7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVMb2dvKCkge1xuICAgIHZhciBsb2dvID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldExvZ29UZXh0dXJlcygpKTtcblxuICAgIGxvZ28ud2luZG93WSA9IDA7XG4gICAgbG9nby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG5cbiAgICBsb2dvLnZpc2libGUgPSBmYWxzZTtcbiAgICBsb2dvLmxvb3AgPSBmYWxzZTtcblxuICAgIGxvZ28uX3R3ZWVuRnJhbWUgPSAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsb2dvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBsb2dvO1xufVxuXG5mdW5jdGlvbiBnZXRMb2dvQW5pbWF0aW9uVGltZWxpbmUobG9nbykge1xuICAgIHZhciBmcHMgPSAzMjtcbiAgICB2YXIgbnVtRnJhbWVzID0gbG9nby50ZXh0dXJlcy5sZW5ndGg7XG5cbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgdmFyIGVhc2luZyA9IG5ldyBTdGVwcGVkRWFzZShudW1GcmFtZXMpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTGl0ZSh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsb2dvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgbG9nby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhsb2dvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgICAgIGNyZWF0ZWpzLlNvdW5kLnBsYXkoJ0ludHJvVmlkZW8nLCB7ZGVsYXk6IDUwfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB2aWRlb0NvbXBsZXRlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGRlbGF5ID0gMDtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHZpZGVvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgZGVsYXkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBMb2FkZXIgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBsb2FkaW5nU2NyZWVuID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xudmFyIGxvYWRpbmdCYXIgPSBuZXcgUElYSS5HcmFwaGljcygpO1xudmFyIGxvYWRpbmdCYWNrZ3JvdW5kID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbnZhciBsb2FkZXJMb2dvID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL3ByZWxvYWRlcl9sb2dvLnBuZycpO1xuXG5mdW5jdGlvbiBzZXRHcmFwaGljU2NhbGUob2JqLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgb2JqLnNjYWxlLnggPSBvYmouX2dyYXBoaWNTY2FsZSAqIHdpZHRoO1xuXG4gICAgaWYoIV8uaXNVbmRlZmluZWQoaGVpZ2h0KSkge1xuICAgICAgICBvYmouc2NhbGUueSA9IG9iai5fZ3JhcGhpY1NjYWxlICogaGVpZ2h0O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXRMb2FkaW5nQmFyKCkge1xuICAgIGxvYWRpbmdCYXIuYmVnaW5GaWxsKDB4QzIwMDFCKTtcbiAgICBsb2FkaW5nQmFyLmxpbmVTdHlsZSgwKTtcblxuICAgIGxvYWRpbmdCYXIuZHJhd1JlY3QoMCwgMCwgMSwgMTUpO1xuXG4gICAgbG9hZGluZ0Jhci5fZ3JhcGhpY1NjYWxlID0gMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobG9hZGluZ0JhciwgJ2dyYXBoaWNTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFwaGljU2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljU2NhbGUgPSB2YWw7XG5cbiAgICAgICAgICAgIHNldEdyYXBoaWNTY2FsZSh0aGlzLCAkd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBsb2FkaW5nU2NyZWVuLmFkZENoaWxkKGxvYWRpbmdCYXIpO1xufVxuZnVuY3Rpb24gaW5pdExvYWRpbmdCYWNrZ3JvdW5kKCkge1xuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmJlZ2luRmlsbCgweDA4MDkwQik7XG4gICAgbG9hZGluZ0JhY2tncm91bmQubGluZVN0eWxlKDApO1xuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmRyYXdSZWN0KDAsIDAsIDEsIDEpO1xuXG4gICAgbG9hZGluZ0JhY2tncm91bmQuX2dyYXBoaWNTY2FsZSA9IDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvYWRpbmdCYWNrZ3JvdW5kLCAnZ3JhcGhpY1NjYWxlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyYXBoaWNTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNTY2FsZSA9IHZhbDtcblxuICAgICAgICAgICAgc2V0R3JhcGhpY1NjYWxlKHRoaXMsICR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGxvYWRpbmdCYWNrZ3JvdW5kLmdyYXBoaWNTY2FsZSA9IDE7XG5cbiAgICBsb2FkaW5nU2NyZWVuLmFkZENoaWxkKGxvYWRpbmdCYWNrZ3JvdW5kKTtcbn1cblxuZnVuY3Rpb24gaW5pdExvZ28oKSB7XG4gICAgbG9hZGVyTG9nby53aW5kb3dYID0gMC41O1xuICAgIGxvYWRlckxvZ28ud2luZG93WSA9IDAuNTtcblxuICAgIGxvYWRlckxvZ28uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsLjUpO1xuXG4gICAgbG9hZGluZ1NjcmVlbi5hZGRDaGlsZChsb2FkZXJMb2dvKTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIGluaXRMb2FkaW5nQmFja2dyb3VuZCgpO1xuICAgIGluaXRMb2FkaW5nQmFyKCk7XG4gICAgaW5pdExvZ28oKTtcblxuICAgIHN0YWdlLmFkZENoaWxkKGxvYWRpbmdTY3JlZW4pO1xufSkoKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqIE9uIFdpbmRvdyBSZXNpemUgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgdmFyIHdpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgdXBkYXRlTG9hZGluZ1NpemUod2lkdGgsIGhlaWdodCk7XG4gICAgdXBkYXRlVmlkZW9BbmRGcmFtZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHN0YWdlLl9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICByZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG59XG5mdW5jdGlvbiB1cGRhdGVMb2dvKHdpZHRoLCBoZWlnaHQsIHZpZGVvSGVpZ2h0KSB7XG4gICAgaWYoXy5pc1VuZGVmaW5lZChsb2dvKSkgcmV0dXJuO1xuXG4gICAgdmFyIGJvdW5kcyA9IGxvZ28uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgIHZhciBuZXdMb2dvSGVpZ2h0ID0gKGhlaWdodCAtIHZpZGVvSGVpZ2h0KS8yO1xuICAgIHZhciBzY2FsZSA9IE1hdGgubWluKG5ld0xvZ29IZWlnaHQvKGJvdW5kcy5oZWlnaHQgLSA1NSksIDEpO1xuXG4gICAgbG9nby5zY2FsZS54ID0gc2NhbGU7XG4gICAgbG9nby5zY2FsZS55ID0gc2NhbGU7XG5cbiAgICAvL2NhbGMgcG9zaXRpb25cbiAgICBsb2dvLndpbmRvd1kgPSBuZXdMb2dvSGVpZ2h0L2hlaWdodCAtIDAuNTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9hZGluZ1NpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHNldEdyYXBoaWNTY2FsZShsb2FkaW5nQmFyLCB3aWR0aCk7XG4gICAgc2V0R3JhcGhpY1NjYWxlKGxvYWRpbmdCYWNrZ3JvdW5kLCB3aWR0aCwgaGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVmlkZW9BbmRGcmFtZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYoXy5pc1VuZGVmaW5lZChpbnRyb0ZyYW1lVG9wQmcpKSByZXR1cm47XG5cbiAgICB2YXIgbWF4SGVpZ2h0ID0gMC44NztcbiAgICB2YXIgbWF4V2lkdGggPSAwLjk1O1xuXG4gICAgdmFyIGxvY2FsQm91bmRzID0gaW50cm9GcmFtZVRvcEJnLmdldExvY2FsQm91bmRzKCk7XG4gICAgdmFyIGJ0bUJvdW5kcyA9IGludHJvRnJhbWVCdG1CZy5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgdmFyIHNjYWxlID0gTWF0aC5taW4obWF4SGVpZ2h0ICogMC41ICogaGVpZ2h0L2xvY2FsQm91bmRzLmhlaWdodCwgbWF4V2lkdGggKiB3aWR0aC9sb2NhbEJvdW5kcy53aWR0aCk7XG5cbiAgICAvL2tlZXAgc2NhbGUgd2l0aGluIG91ciBkZWZpbmVkIGJvdW5kc1xuICAgIHNjYWxlID0gTWF0aC5tYXgoaW50cm9GcmFtZVRvcEJnLnNjYWxlTWluLCBNYXRoLm1pbihzY2FsZSwgaW50cm9GcmFtZVRvcEJnLnNjYWxlTWF4KSk7XG5cbiAgICB2YXIgYnRtU2NhbGUgPSBzY2FsZSAqIGxvY2FsQm91bmRzLndpZHRoL2J0bUJvdW5kcy53aWR0aDtcbiAgICB2YXIgdmlkZW9TY2FsZSA9IHNjYWxlICogMS4wMjQ7XG5cbiAgICBpbnRyb0ZyYW1lVG9wQmcuc2NhbGUueCA9IHNjYWxlO1xuICAgIGludHJvRnJhbWVUb3BCZy5zY2FsZS55ID0gc2NhbGU7XG5cbiAgICBpbnRyb0ZyYW1lQnRtQmcuc2NhbGUueCA9IGJ0bVNjYWxlO1xuICAgIGludHJvRnJhbWVCdG1CZy5zY2FsZS55ID0gYnRtU2NhbGU7XG5cbiAgICB2aWRlby5zY2FsZS54ID0gdmlkZW9TY2FsZTtcbiAgICB2aWRlby5zY2FsZS55ID0gdmlkZW9TY2FsZTtcblxuICAgIHVwZGF0ZVRvcEZyYW1lQmFja2dyb3VuZCh3aWR0aCwgaGVpZ2h0LCBsb2NhbEJvdW5kcy53aWR0aCAqIHNjYWxlLCBsb2NhbEJvdW5kcy5oZWlnaHQgKiBzY2FsZSk7XG4gICAgdXBkYXRlQnRtRnJhbWVCYWNrZ3JvdW5kKHdpZHRoLCBoZWlnaHQsIGJ0bUJvdW5kcy53aWR0aCAqIHNjYWxlLCBidG1Cb3VuZHMuaGVpZ2h0ICogc2NhbGUpO1xuICAgIHVwZGF0ZUxvZ28od2lkdGgsIGhlaWdodCwgdmlkZW9TY2FsZSAqIHZpZGVvLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVRvcEZyYW1lQmFja2dyb3VuZCh3aWR0aCwgaGVpZ2h0LCBmcmFtZVdpZHRoLCBmcmFtZUhlaWdodCkge1xuICAgIHZhciBzaWRlV2lkdGggPSAod2lkdGgtZnJhbWVXaWR0aCkvMiArIGZyYW1lV2lkdGggKiAxMDAvOTc1O1xuICAgIHZhciB0b3BIZWlnaHQgPSAoaGVpZ2h0LzItZnJhbWVIZWlnaHQpICsgZnJhbWVIZWlnaHQgKiAxMDAvMzI2O1xuXG4gICAgYmdDb2xvcnMudG9wTGVmdC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLnRvcExlZnQuc2NhbGUueSA9IGhlaWdodC8yO1xuXG4gICAgYmdDb2xvcnMudG9wLnNjYWxlLnggPSB3aWR0aDtcbiAgICBiZ0NvbG9ycy50b3Auc2NhbGUueSA9IHRvcEhlaWdodDtcblxuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LnNjYWxlLnggPSBzaWRlV2lkdGg7XG4gICAgYmdDb2xvcnMudG9wUmlnaHQuc2NhbGUueSA9IGhlaWdodC8yO1xuICAgIGJnQ29sb3JzLnRvcFJpZ2h0LndpbmRvd1ggPSAod2lkdGgtc2lkZVdpZHRoKS93aWR0aCAtIDAuNTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUJ0bUZyYW1lQmFja2dyb3VuZCh3aWR0aCwgaGVpZ2h0LCBmcmFtZVdpZHRoLCBmcmFtZUhlaWdodCkge1xuICAgIHZhciBzaWRlV2lkdGggPSAod2lkdGgtZnJhbWVXaWR0aCkvMiArIGZyYW1lV2lkdGggKiAxMDAvOTc1O1xuICAgIHZhciBidG1IZWlnaHQgPSAoaGVpZ2h0LzItZnJhbWVIZWlnaHQpICsgZnJhbWVIZWlnaHQgKiAxMDAvMzI2O1xuXG4gICAgYmdDb2xvcnMuYnRtTGVmdC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLmJ0bUxlZnQuc2NhbGUueSA9IGhlaWdodC8yO1xuXG4gICAgYmdDb2xvcnMuYnRtLnNjYWxlLnggPSB3aWR0aDtcbiAgICBiZ0NvbG9ycy5idG0uc2NhbGUueSA9IGJ0bUhlaWdodDtcbiAgICBiZ0NvbG9ycy5idG0ud2luZG93WSA9IChoZWlnaHQtYnRtSGVpZ2h0KS9oZWlnaHQgLSAwLjU7XG5cbiAgICBiZ0NvbG9ycy5idG1SaWdodC5zY2FsZS54ID0gc2lkZVdpZHRoO1xuICAgIGJnQ29sb3JzLmJ0bVJpZ2h0LnNjYWxlLnkgPSBoZWlnaHQvMjtcbiAgICBiZ0NvbG9ycy5idG1SaWdodC53aW5kb3dYID0gKHdpZHRoLXNpZGVXaWR0aCkvd2lkdGggLSAwLjU7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcbiAgICB9LFxuICAgIGdldEludHJvRnJhbWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogaW50cm9GcmFtZVRvcCxcbiAgICAgICAgICAgIGJ0bTogaW50cm9GcmFtZUJ0bVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcGxheVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5wbGF5KDApO1xuICAgIH0sXG4gICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmlkZW9Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICB1cGRhdGVMb2FkZXI6IGZ1bmN0aW9uKHBlcmNlbnQsIHRpbWVFbGFwc2VkKSB7XG4gICAgICAgIHZhciBvbGRYID0gbG9hZGluZ0Jhci5ncmFwaGljU2NhbGU7XG4gICAgICAgIHZhciBuZXdYID0gcGVyY2VudDtcblxuICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IHRpbWVFbGFwc2VkLzEwMDAgKiAobmV3WCAtIG9sZFgpL25ld1g7XG5cbiAgICAgICAgVHdlZW5MaXRlLnRvKGxvYWRpbmdCYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgIGdyYXBoaWNTY2FsZTogbmV3WFxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFzc2V0c0xvYWRlZDogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlbyA9IGluaXRpYWxpemVWaWRlbygpO1xuICAgICAgICB2aWRlb1RpbWVsaW5lID0gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pO1xuICAgICAgICBsb2dvID0gaW5pdGlhbGl6ZUxvZ28oKTtcbiAgICAgICAgbG9nb1RpbWVsaW5lID0gZ2V0TG9nb0FuaW1hdGlvblRpbWVsaW5lKGxvZ28pO1xuXG4gICAgICAgIGludHJvVmlkZW9Db250YWluZXIuYWRkQ2hpbGQodmlkZW8pO1xuXG4gICAgICAgIGluaXRpYWxpemVJbnRyb0ZyYW1lVG9wKCk7XG4gICAgICAgIGluaXRpYWxpemVJbnRyb0ZyYW1lQnRtKCk7XG5cbiAgICAgICAgaW50cm9GcmFtZVRvcC5hZGRDaGlsZChsb2dvKTtcblxuICAgICAgICBvbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhsb2FkaW5nU2NyZWVuLCAwLjQsIHtcbiAgICAgICAgICAgICAgICBhbHBoYTogMCxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzZWxmLnBsYXlWaWRlby5iaW5kKHNlbGYpLCA2MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA2MDApO1xuICAgIH0pLFxuICAgIHNob3dMb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbG9nb1RpbWVsaW5lLnBsYXkoKTtcbiAgICB9LFxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlby5kZXN0cm95KCk7XG4gICAgICAgIGxvZ28uZGVzdHJveSgpO1xuXG4gICAgICAgIGludHJvVmlkZW9Db250YWluZXIgPSBudWxsO1xuICAgICAgICBpbnRyb0ZyYW1lVG9wID0gbnVsbDtcbiAgICAgICAgaW50cm9GcmFtZUJ0bSA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVUb3BCZyA9IG51bGw7XG4gICAgICAgIGludHJvRnJhbWVCdG1CZyA9IG51bGw7XG5cbiAgICAgICAgc3RhZ2UgPSBudWxsO1xuICAgICAgICByZW5kZXJlciA9IG51bGw7XG4gICAgICAgIHZpZGVvID0gbnVsbDtcbiAgICAgICAgbG9nbyA9IG51bGw7XG5cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgICQoJyNwaXhpLWludHJvJykucmVtb3ZlKCk7XG5cbiAgICAgICAgJHdpbmRvdy5vZmYoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcbiAgICB9XG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xudmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG5cblxuXG52YXIgcGVyc29uYWxpdHlBbmltYXRpb25QYWlycyA9IFtcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgZmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dFJvdGF0ZSldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBmYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21Ub3ApLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0Um90YXRlKV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21Ub3ApLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV1cbl07XG5cbnZhciBjYW5uZWRBbmltYXRpb25QYWlycyA9IFtcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldXG5dO1xuXG5cblxuZnVuY3Rpb24gc3RhZ2dlckl0ZW1zKCRpdGVtcykge1xuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgdHdlZW5zOiBfLm1hcCgkaXRlbXMsIHRoaXMpLFxuICAgICAgICBzdGFnZ2VyOiAwLjA3XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqIEluZGl2aWR1YWwgQW5pbWF0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZmFkZUluKCRpdGVtLCBwcm9wLCBkaXN0YW5jZSwgZWFzaW5nKSB7XG4gICAgdmFyIGZyb20gPSB7b3BhY2l0eTogMH07XG4gICAgZnJvbVtwcm9wXSA9IGRpc3RhbmNlO1xuXG4gICAgdmFyIHRvID0ge29wYWNpdHk6IDEsIGVhc2U6IGVhc2luZ307XG4gICAgdG9bcHJvcF0gPSAwO1xuXG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS5mcm9tVG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIGZyb20sIHRvKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbk5vTW92ZW1lbnQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDAsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBmYWRlSW5Gcm9tUmlnaHQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDc1LCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gZmFkZUluRnJvbVRvcCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd5JywgLTc1LCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gYm91bmNlRmFkZUluRnJvbVJpZ2h0KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCA3NSwgJ0JhY2suZWFzZU91dCcpO1xufVxuZnVuY3Rpb24gYm91bmNlRmFkZUluRnJvbVRvcCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd5JywgLTc1LCAnQmFjay5lYXNlT3V0Jyk7XG59XG5mdW5jdGlvbiByb3RhdGVJbkxlZnQoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLmZyb21UbygkaXRlbSwgYW5pbWF0aW9uVGltZSwge3JvdGF0aW9uWTogLTkwLCB0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0IDUwJSAtMTAwXCJ9LCB7cm90YXRpb25ZOiAwfSk7XG59XG5cbmZ1bmN0aW9uIHNuYXBPdXQoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMCwgc2NhbGU6IDAuNCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJSAwXCIsIGVhc2U6ICdCYWNrLmVhc2VJbid9KTtcbn1cbmZ1bmN0aW9uIHNuYXBPdXRSb3RhdGUoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMCwgc2NhbGU6IDAuNCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJSAwXCIsIHJvdGF0aW9uOiAtNDUsIGVhc2U6ICdCYWNrLmVhc2VJbid9KTtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGdldFJhbmRvbVBlcnNvbmFsaXR5QW5pbWF0aW9uczogZnVuY3Rpb24oJGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gXy5yYW5kb20ocGVyc29uYWxpdHlBbmltYXRpb25QYWlycy5sZW5ndGggLSAxKTtcblxuICAgICAgICByZXR1cm4gXy5tYXAocGVyc29uYWxpdHlBbmltYXRpb25QYWlyc1tpXSwgZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZm5jKCRpdGVtcyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9uczogZnVuY3Rpb24oJGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gXy5yYW5kb20oY2FubmVkQW5pbWF0aW9uUGFpcnMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKGNhbm5lZEFuaW1hdGlvblBhaXJzW2ldLCBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICAgIHJldHVybiBmbmMoJGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgcGFyYWNodXRlcnMsIHBhcmFjaHV0ZXJzQ29udGFpbmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHBhcmFjaHV0ZXJzID0gXy5zaHVmZmxlKFtnZXRCbGFja291dCgpLCBnZXREcmlwKCksIGdldER5bmFtaXRlKCldKTtcblxuICAgIF8uZWFjaChwYXJhY2h1dGVycywgZnVuY3Rpb24ocGFyYWNodXRlcikge1xuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgICAgICBwYXJhY2h1dGVyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dZID0gLTE7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRCbGFja291dCgpIHtcbiAgICB2YXIgYmxhY2tvdXRJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2JsYWNrb3V0LnBuZ1wiKTtcbiAgICBibGFja291dElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDI2LzYxLFxuICAgICAgICB5OiAzMy85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignQmxhY2tvdXQnLCBibGFja291dElkbGVTdGF0ZSk7XG59XG5mdW5jdGlvbiBnZXREcmlwKCkge1xuICAgIHZhciBkcmlwSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9kcmlwLnBuZ1wiKTtcbiAgICBkcmlwSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMzYvNjEsXG4gICAgICAgIHk6IDI2Lzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEcmlwJywgZHJpcElkbGVTdGF0ZSk7XG59XG5mdW5jdGlvbiBnZXREeW5hbWl0ZSgpIHtcbiAgICB2YXIgZHluYW1pdGVJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiKTtcbiAgICBkeW5hbWl0ZUlkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDI3LzYxLFxuICAgICAgICB5OiAzMC85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignRHluYW1pdGUnLCBkeW5hbWl0ZUlkbGVTdGF0ZSk7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gYW5pbWF0ZVBhcmFjaHV0ZXIocGFyYWNodXRlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMzU7XG5cbiAgICB2YXIgZGVwdGggPSBNYXRoLnJhbmRvbSgpICogNTtcbiAgICB2YXIgeCA9IDAuMSArIChNYXRoLnJhbmRvbSgpICogMC44KTtcbiAgICB2YXIgc2NhbGUgPSAxIC0gZGVwdGggKiAwLjIvNTtcblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihwYXJhY2h1dGVyKTtcbiAgICBwYXJhY2h1dGVyLndpbmRvd1ggPSB4O1xuXG4gICAgdmFyIHJvdGF0aW9uID0gMC4zO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgZWFzZTogJ1NpbmUuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGFyYWNodXRlci52aXNpYmlsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXJhY2h1dGVyLnNjYWxlID0ge3g6IHNjYWxlLCB5OiBzY2FsZX07XG4gICAgcGFyYWNodXRlci5maWx0ZXJzWzBdLmJsdXIgPSBkZXB0aCAqIDMvNTtcbiAgICBwYXJhY2h1dGVyLnJvdGF0aW9uID0gcm90YXRpb247XG5cbiAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbik7XG59XG5mdW5jdGlvbiBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbikge1xuICAgIHZhciBzd2F5VGltZSA9IDEuMjtcbiAgICB2YXIgZGVjID0gMC4wMztcblxuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICByb3RhdGlvbjogLXJvdGF0aW9uLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0J1xuICAgIH0pO1xuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICBkZWxheTogc3dheVRpbWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYocm90YXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24gLSBkZWMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHBhcmFjaHV0ZXJzQ29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gICAgICAgIF8uZWFjaChwYXJhY2h1dGVycywgXy5iaW5kKHBhcmFjaHV0ZXJzQ29udGFpbmVyLmFkZENoaWxkLCBwYXJhY2h1dGVyc0NvbnRhaW5lcikpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHBhcmFjaHV0ZXJzQ29udGFpbmVyKTtcbiAgICB9KSxcbiAgICBhbmltYXRlTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHBhcmFjaHV0ZXJzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVycy5zaGlmdCgpKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lci52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICB2YXIgaGVpZ2h0ID0gY2hhcmFjdGVyLnNjYWxlLnkgKiBjaGFyYWN0ZXIuZ2V0TG9jYWxCb3VuZHMoKS5oZWlnaHQ7XG5cbiAgICBjaGFyYWN0ZXIud2luZG93WSA9IC0oaGVpZ2h0LzIpLyQod2luZG93KS5oZWlnaHQoKTtcbn07IiwiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGFsbENoYXJhY3RlcnMgPSByZXF1aXJlKCcuLi9waXhpL2FsbENoYXJhY3RlcnMnKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG52YXIgYW5pbWF0ZUluID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS4yO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkdXN0eSA9IGFsbENoYXJhY3RlcnMuZHVzdHlEYXJrO1xuXG4gICAgICAgICAgICBkdXN0eS5pZGxlLndpbmRvd1NjYWxlID0gMC4zNztcbiAgICAgICAgICAgIGR1c3R5LndpbmRvd1ggPSAwLjI7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjcxLFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmxhZGUgPSBhbGxDaGFyYWN0ZXJzLmJsYWRlO1xuXG4gICAgICAgICAgICBibGFkZS5pZGxlLndpbmRvd1NjYWxlID0gMC41O1xuICAgICAgICAgICAgYmxhZGUud2luZG93WCA9IDAuMztcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihibGFkZSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNzQsXG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FiYmllID0gYWxsQ2hhcmFjdGVycy5jYWJiaWU7XG5cbiAgICAgICAgICAgIGNhYmJpZS5pZGxlLndpbmRvd1NjYWxlID0gMC42O1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgICAgICAgICBjYWJiaWUud2luZG93WCA9IDAuNTtcbiAgICAgICAgICAgIGNhYmJpZS5yb3RhdGlvbiA9IDAuNjU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjYWJiaWUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjU1LFxuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpcHBlciA9IGFsbENoYXJhY3RlcnMuZGlwcGVyO1xuXG4gICAgICAgICAgICBkaXBwZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgZGlwcGVyLndpbmRvd1ggPSAwLjY7XG4gICAgICAgICAgICBkaXBwZXIuc2NhbGUueCA9IDE7XG4gICAgICAgICAgICBkaXBwZXIucm90YXRpb24gPSAwLjI7XG5cbiAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgd2luZG93WDogMC40NyxcbiAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjRcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdpbmRsaWZ0ZXIgPSBhbGxDaGFyYWN0ZXJzLndpbmRsaWZ0ZXI7XG5cbiAgICAgICAgICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDU7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4od2luZGxpZnRlcik7XG4gICAgICAgICAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAwLjU7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNyxcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjI3XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVhbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBhbmltYXRlSW5bY2hhcmFjdGVyXSgpO1xuICAgIH1cbn07IiwiXG5cblxudmFyIFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3F1ZXN0aW9uJyk7XG5cblxudmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogUXVlc3Rpb25cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uQ29sbGVjdGlvbjsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1F1ZXN0aW9uQ29sbGVjdGlvbicpO1xuXG4gICAgdmFyIGNoYXJhY3RlclNlbGVjdCA9IHJlcXVpcmUoJy4uL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24nKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9jYW5uZWRRdWVzdGlvbnMuanNvbicpO1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbicpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tUGVyc29uYWxpdHlRdWVzdGlvbnMobnVtKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KF8uc2h1ZmZsZShwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YS5xdWVzdGlvbnMpLCBudW0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wdHlDYW5uZWRRdWVzdGlvbnMobnVtKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKG51bSksIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jbGFzcyxcbiAgICAgICAgICAgICAgICBjb3B5OiBjYW5uZWRRdWVzdGlvbkRhdGEuY29weSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2FubmVkLXF1ZXN0aW9uJyArIGksXG4gICAgICAgICAgICAgICAgb3B0aW9uczogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9uQ29sbGVjdGlvbigpO1xuXG5cbiAgICAvL3NodWZmbGUgcXVlc3Rpb25zIGFuZCBwaWNrIDNcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbnMgPSBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucygzKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25zID0gZ2V0RW1wdHlDYW5uZWRRdWVzdGlvbnMoMyk7XG5cblxuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2hhcmFjdGVyU2VsZWN0KTtcbiAgICBhbGxRdWVzdGlvbnMuYWRkKHBlcnNvbmFsaXR5UXVlc3Rpb25zKTtcbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNhbm5lZFF1ZXN0aW9ucyk7XG5cblxuXG4gICAgZnVuY3Rpb24gZmlsdGVyVW51c2VkKG9wdGlvbnMsIHVzZWQpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHVzZWQuaW5kZXhPZihvcHRpb24udmFsdWUpID09PSAtMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWxsUXVlc3Rpb25zLmdldFVudXNlZENhbm5lZE9wdGlvbnMgPSBmdW5jdGlvbihudW0sIHVzZWQpIHtcbiAgICAgICAgdmFyIHBvc3NpYmxlT3B0aW9ucyA9IF8uc2h1ZmZsZShmaWx0ZXJVbnVzZWQoY2FubmVkUXVlc3Rpb25EYXRhLm9wdGlvbnMsIHVzZWQpKTtcblxuICAgICAgICByZXR1cm4gXy5maXJzdChwb3NzaWJsZU9wdGlvbnMsIG51bSk7XG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhbGxRdWVzdGlvbnM7XG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInRvdGFsU2l6ZVwiOiAyNjA0ODc5OSxcblx0XCJhc3NldHNcIjoge1xuXHRcdFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIjogMjUwNixcblx0XHRcImFzc2V0cy9pbWcvYnV0dG9uLnBuZ1wiOiA3NTQ0LFxuXHRcdFwiYXNzZXRzL2ltZy9kcmlwLnBuZ1wiOiAzMjg4LFxuXHRcdFwiYXNzZXRzL2ltZy9keW5hbWl0ZS5wbmdcIjogMjQyMCxcblx0XHRcImFzc2V0cy9pbWcvZm9vdGVyLnBuZ1wiOiA0MzM5OCxcblx0XHRcImFzc2V0cy9pbWcvZm9yZWdyb3VuZF90cmVlcy5wbmdcIjogMTE1NzE0LFxuXHRcdFwiYXNzZXRzL2ltZy9oZWFkZXIucG5nXCI6IDkxMTM4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9iYXNlYmFsbC5wbmdcIjogMTQyOTcsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2JsYWRlX3Jhbmdlci5wbmdcIjogMTUzMDgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2JsdWUucG5nXCI6IDEwNzQ5LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9icm9jY29saS5wbmdcIjogMTQwNDUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2NhYmJpZS5wbmdcIjogMTg5ODEsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Nhbm5lZC1idG4ucG5nXCI6IDEyNDc2LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9kaXBwZXIucG5nXCI6IDE4OTIzLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9kdXN0eS5wbmdcIjogMjAzMjgsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Zvb3RiYWxsLnBuZ1wiOiAxMzYyOSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZnJpZXMucG5nXCI6IDExOTI4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ncmVlbi5wbmdcIjogMTA3NDcsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2hvY2tleS5wbmdcIjogMTMwNTIsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2ljZWNyZWFtLnBuZ1wiOiAxMjQ0Mixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvbnVnZ2V0cy5wbmdcIjogMTMzNDcsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL29yYW5nZS5wbmdcIjogMTA3MjQsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3Biai5wbmdcIjogMTIzODQsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3BpenphLnBuZ1wiOiAxMzc2NSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvcHJpbnRlci5wbmdcIjogNDEzLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wdXJwbGUucG5nXCI6IDEwNzg0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9yYWNpbmcucG5nXCI6IDExNDkxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9yZWQucG5nXCI6IDEwNjUzLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zZW5kLWJ0bi5wbmdcIjogOTkyMSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvc29jY2VyLnBuZ1wiOiAxNTE4OSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvc3dpbV9kaXZlLnBuZ1wiOiAxMTQyOCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdGhlX3RlYW0ucG5nXCI6IDE3MDk2LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy92b2x1bWUucG5nXCI6IDE2Myxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvd2luZGxpZnRlci5wbmdcIjogMTY4MjIsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3llbGxvdy5wbmdcIjogMTA2NzIsXG5cdFx0XCJhc3NldHMvaW1nL2luLXRoZWF0ZXJzLnBuZ1wiOiAyOTY3LFxuXHRcdFwiYXNzZXRzL2ltZy9pbi10aGVhdHJlczNkLnBuZ1wiOiA1MTkwLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby1idG0ucG5nXCI6IDgxOTU1LFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby10b3AucG5nXCI6IDc5MzQ2LFxuXHRcdFwiYXNzZXRzL2ltZy9sb2dvLnBuZ1wiOiAxMjkxMjgsXG5cdFx0XCJhc3NldHMvaW1nL21pZGdyb3VuZC5wbmdcIjogNjQ2ODksXG5cdFx0XCJhc3NldHMvaW1nL3BnLnBuZ1wiOiAxNTUyLFxuXHRcdFwiYXNzZXRzL2ltZy9wcmVsb2FkZXJfbG9nby5wbmdcIjogMTMwMzg5LFxuXHRcdFwiYXNzZXRzL2ltZy9wcmludC5wbmdcIjogMjc1MSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfYmxhZGUuanBnXCI6IDE5MDI4NSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfY2FiYmllLmpwZ1wiOiAyNzA4MzgsXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX2RpcHBlci5qcGdcIjogNDQzOTE5LFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kdXN0eS5qcGdcIjogMTk3NjQyLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ190ZWFtLmpwZ1wiOiA0MjY5OTksXG5cdFx0XCJhc3NldHMvaW1nL3Jlc3BvbnNlX2JnX3dpbmRsaWZ0ZXIuanBnXCI6IDIyMTk0OSxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfbGV0dGVyX2JnLmpwZ1wiOiA3NTcxMyxcblx0XHRcImFzc2V0cy9pbWcvc2VuZE1vcmUucG5nXCI6IDEyMzMxLFxuXHRcdFwiYXNzZXRzL2ltZy9zaXRlX2JnLmpwZ1wiOiAxODQwNTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDAyLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwMy5wbmdcIjogNTQ0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDQucG5nXCI6IDk5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA1LnBuZ1wiOiAxMzkwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDYucG5nXCI6IDkwMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDA3LnBuZ1wiOiAxMTUzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMDgucG5nXCI6IDE0MTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAwOS5wbmdcIjogMTU2MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDEwLnBuZ1wiOiAxNjM5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTEucG5nXCI6IDE4NzcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxMi5wbmdcIjogMTk1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDEzLnBuZ1wiOiAyMDQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTQucG5nXCI6IDIwNzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxNS5wbmdcIjogMjA4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE2LnBuZ1wiOiAyMjU4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMTcucG5nXCI6IDI0NDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAxOC5wbmdcIjogMjUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDE5LnBuZ1wiOiAyNzQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjAucG5nXCI6IDI4OTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyMS5wbmdcIjogMzA0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDIyLnBuZ1wiOiAzMTYwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjMucG5nXCI6IDMzMjUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNC5wbmdcIjogMzQ4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI1LnBuZ1wiOiAzNjI5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjYucG5nXCI6IDM3NjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAyNy5wbmdcIjogMzg0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDI4LnBuZ1wiOiAzOTQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMjkucG5nXCI6IDQwMjgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMC5wbmdcIjogNDA3OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDMxLnBuZ1wiOiA0MDg0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzIucG5nXCI6IDQxMTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzMy5wbmdcIjogNDE3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM0LnBuZ1wiOiA0MjA5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzUucG5nXCI6IDQxMDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzNi5wbmdcIjogNDE1OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDM3LnBuZ1wiOiA0MjMwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwMzgucG5nXCI6IDQyOTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDAzOS5wbmdcIjogNDM2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQwLnBuZ1wiOiA0NDQzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDEucG5nXCI6IDQ1MjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0Mi5wbmdcIjogNDU0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQzLnBuZ1wiOiA0NTk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDQucG5nXCI6IDQ2NjcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0NS5wbmdcIjogNDcxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ2LnBuZ1wiOiA0Nzc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNDcucG5nXCI6IDQ4NzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA0OC5wbmdcIjogNDk0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDQ5LnBuZ1wiOiA0OTcxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTAucG5nXCI6IDUwOTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1MS5wbmdcIjogNTEyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDUyLnBuZ1wiOiA1MjExLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzJfMDAwNTMucG5nXCI6IDUzMDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDA1NC5wbmdcIjogODE0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU1LnBuZ1wiOiAxNDU0Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU2LnBuZ1wiOiAyMTMwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU3LnBuZ1wiOiAzMTA1Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU4LnBuZ1wiOiAzNjcyMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDU5LnBuZ1wiOiA0MTc0OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYwLnBuZ1wiOiA0MzA3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYxLnBuZ1wiOiAzODExOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYyLnBuZ1wiOiAzMTI1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDYzLnBuZ1wiOiAzMzg2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY0LnBuZ1wiOiAzMjMyOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY1LnBuZ1wiOiAzMTU4Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY2LnBuZ1wiOiAzMTU0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY3LnBuZ1wiOiAzMTcyMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY4LnBuZ1wiOiAzMTczMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDY5LnBuZ1wiOiAzMTc3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcwLnBuZ1wiOiAzMTM5OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcxLnBuZ1wiOiAzMTMyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDcyLnBuZ1wiOiAzMTQxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDczLnBuZ1wiOiAzMTU4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc0LnBuZ1wiOiAzMTM2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc1LnBuZ1wiOiAzMTU1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc2LnBuZ1wiOiAzMTY2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc3LnBuZ1wiOiAzMTYwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc4LnBuZ1wiOiAyNzM3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDc5LnBuZ1wiOiAzODEzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgwLnBuZ1wiOiA0OTUxMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgxLnBuZ1wiOiA1NTU1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgyLnBuZ1wiOiA1NTQyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDgzLnBuZ1wiOiA2MzQ0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg0LnBuZ1wiOiA1NTgwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg1LnBuZ1wiOiAzMjEwMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg2LnBuZ1wiOiAzNTExMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg3LnBuZ1wiOiAyNDQ3Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg4LnBuZ1wiOiAyNDczNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDg5LnBuZ1wiOiAyNzIzMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkwLnBuZ1wiOiAzMTkwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkxLnBuZ1wiOiAzNzg4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkyLnBuZ1wiOiA0MTU4OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDkzLnBuZ1wiOiA0NDk1NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk0LnBuZ1wiOiA0Njg3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk1LnBuZ1wiOiAzNTk3OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk2LnBuZ1wiOiAyODM2NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk3LnBuZ1wiOiAyNDkzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk4LnBuZ1wiOiAyMzA5Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMDk5LnBuZ1wiOiAyMDMzNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAwLnBuZ1wiOiAyMDk2NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAxLnBuZ1wiOiAxNjg0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAyLnBuZ1wiOiAxODMxMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTAzLnBuZ1wiOiAxOTY3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA0LnBuZ1wiOiAyMjI4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA1LnBuZ1wiOiAyNDc2Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA2LnBuZ1wiOiAyNTMxOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA3LnBuZ1wiOiAyNjg3NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA4LnBuZ1wiOiAyNjE0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTA5LnBuZ1wiOiAyOTMwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEwLnBuZ1wiOiAzMzg3Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTExLnBuZ1wiOiAzNjkxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEyLnBuZ1wiOiA0MDkyNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTEzLnBuZ1wiOiA0NDQwMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE0LnBuZ1wiOiA0NjEyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE1LnBuZ1wiOiA0Mzk0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE2LnBuZ1wiOiA0NzQ4NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE3LnBuZ1wiOiA2OTEzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE4LnBuZ1wiOiAyNjY2MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTE5LnBuZ1wiOiAzMDU0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8yXzAwMTIwLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMl8wMDEyMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDIzMTA3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDEucG5nXCI6IDIzODc3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDIzMzg4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDIzMzc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDQucG5nXCI6IDIzNjMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDIzNDE2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDIzMjQzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDcucG5nXCI6IDIzNjU2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDIzNTMwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDIzMTEwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTAucG5nXCI6IDI0MjI5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDIzMDk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAwLnBuZ1wiOiAyNjQ3OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMS5wbmdcIjogMjYyOTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDIucG5nXCI6IDI2NjU5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAzLnBuZ1wiOiAyNzg3MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNC5wbmdcIjogMjY0NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDUucG5nXCI6IDI2MjkyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA2LnBuZ1wiOiAyNjY1OSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNy5wbmdcIjogMjc4NzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDgucG5nXCI6IDI2NDc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA5LnBuZ1wiOiAyNjI5Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAxMC5wbmdcIjogMjY2NTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTEucG5nXCI6IDI3ODcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAwLnBuZ1wiOiAyMTg3NSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMS5wbmdcIjogMjE3NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDIucG5nXCI6IDIxOTkzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAzLnBuZ1wiOiAyMjY2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNC5wbmdcIjogMjE4NzUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDUucG5nXCI6IDIxNzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA2LnBuZ1wiOiAyMTk5Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNy5wbmdcIjogMjI2NjcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDgucG5nXCI6IDIxODc1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA5LnBuZ1wiOiAyMTc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMC5wbmdcIjogMjE5OTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTEucG5nXCI6IDIyNjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMC5wbmdcIjogNDIyMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDAxLnBuZ1wiOiA0MTg4Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDIucG5nXCI6IDQxODQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwMy5wbmdcIjogNDIwODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA0LnBuZ1wiOiA0MjIwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDUucG5nXCI6IDQxODg3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwNi5wbmdcIjogNDE4NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDA3LnBuZ1wiOiA0MjA4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMDgucG5nXCI6IDQyMjA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9EdXN0eV9wbGFuZV8wMDAwOS5wbmdcIjogNDE4ODcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L0R1c3R5X3BsYW5lXzAwMDEwLnBuZ1wiOiA0MTg0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwMTEucG5nXCI6IDQyMDg0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMC5wbmdcIjogMzcyNDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDAxLnBuZ1wiOiAzNzIzNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDIucG5nXCI6IDM3NTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwMy5wbmdcIjogMzcyOTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA0LnBuZ1wiOiAzNzI0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDUucG5nXCI6IDM3MjM3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwNi5wbmdcIjogMzc1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDA3LnBuZ1wiOiAzNzI5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMDgucG5nXCI6IDM3MjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmU1XzAwMDAwOS5wbmdcIjogMzcyMzcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5My9EdXN0eV9wbGFuZTVfMDAwMDEwLnBuZ1wiOiAzNzUwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwMTEucG5nXCI6IDM3Mjk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDAucG5nXCI6IDQyMTc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDEucG5nXCI6IDQyMDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDIucG5nXCI6IDQxNTk1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDMucG5nXCI6IDQxMjY5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDQucG5nXCI6IDQyMTc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDUucG5nXCI6IDQyMDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDYucG5nXCI6IDQxNTk1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDcucG5nXCI6IDQxMjY5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDgucG5nXCI6IDQyMTc5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMDkucG5nXCI6IDQyMDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMTAucG5nXCI6IDQxNTk1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTMvRHVzdHlfcGxhbmVfMDAwMTEucG5nXCI6IDQxMjY5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDAucG5nXCI6IDM3NzQyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDEucG5nXCI6IDM4MTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDIucG5nXCI6IDM4MjU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDMucG5nXCI6IDM4MTM4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDQucG5nXCI6IDM3ODc3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDUucG5nXCI6IDM3NjkwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDYucG5nXCI6IDM3NjUxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDcucG5nXCI6IDM3NTcxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDgucG5nXCI6IDM4MTM2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMDkucG5nXCI6IDM3NTU1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTAucG5nXCI6IDM4MDI5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTEucG5nXCI6IDM3ODY0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTIucG5nXCI6IDM3NjM1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTMucG5nXCI6IDM3NTM2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTQucG5nXCI6IDM4ODcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTUucG5nXCI6IDM3NzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTYucG5nXCI6IDM4NTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTcucG5nXCI6IDM4MDQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTgucG5nXCI6IDM4NDU3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMTkucG5nXCI6IDM4NTc4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjAucG5nXCI6IDM4MjI2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjEucG5nXCI6IDM4MTE3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjIucG5nXCI6IDM3NTk0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eTQvRHVzdHlfYW5nbGUxX25vQmxpbmtfMDAwMjMucG5nXCI6IDM4MjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwMC5wbmdcIjogNDQ4NjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDAxLnBuZ1wiOiA1Nzc0OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDIucG5nXCI6IDYxMzA5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwMy5wbmdcIjogNjYxNTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA0LnBuZ1wiOiA3MTIyMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwMDUucG5nXCI6IDgwMjA5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDAwNi5wbmdcIjogODk2MjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA3LnBuZ1wiOiAxNDEyNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA4LnBuZ1wiOiAxNDIyNzIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDA5LnBuZ1wiOiAxNTExODQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDEwLnBuZ1wiOiAxNTU2NjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDExLnBuZ1wiOiAxNDM5MTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDEyLnBuZ1wiOiAxNTI5MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDEzLnBuZ1wiOiAxNTM4MDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE0LnBuZ1wiOiAxNTYzODgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE1LnBuZ1wiOiAxNjExMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE2LnBuZ1wiOiAxNjMwMTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE3LnBuZ1wiOiAxNjg0MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE4LnBuZ1wiOiAxNzE5MTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDE5LnBuZ1wiOiAxNzY1NjIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIwLnBuZ1wiOiAxNzYyOTUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIxLnBuZ1wiOiAxNzc1NzQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIyLnBuZ1wiOiAxNzg4OTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDIzLnBuZ1wiOiAxNzg4MjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI0LnBuZ1wiOiAxODEzMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI1LnBuZ1wiOiAxODI1MDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI2LnBuZ1wiOiAxODM2OTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI3LnBuZ1wiOiAxODM5MDAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI4LnBuZ1wiOiAxODQyMDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDI5LnBuZ1wiOiAxODQ5NjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMwLnBuZ1wiOiAxODY1MTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMxLnBuZ1wiOiAxODc1ODksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMyLnBuZ1wiOiAxODc1MDksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDMzLnBuZ1wiOiAxODg2MDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM0LnBuZ1wiOiAxODg2NzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM1LnBuZ1wiOiAxODkzMzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM2LnBuZ1wiOiAxODk5OTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM3LnBuZ1wiOiAxOTA2MzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM4LnBuZ1wiOiAxOTA2NDEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDM5LnBuZ1wiOiAxOTE2NjUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQwLnBuZ1wiOiAxOTI5NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQxLnBuZ1wiOiAxOTU0NTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQyLnBuZ1wiOiAxOTgwNjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQzLnBuZ1wiOiAyMDA0NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ0LnBuZ1wiOiAyMDIyNTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ1LnBuZ1wiOiAyMDE3NzgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ2LnBuZ1wiOiAyMDI5MjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ3LnBuZ1wiOiAyMDI4NTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ4LnBuZ1wiOiAxOTc4NzYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDQ5LnBuZ1wiOiAxOTY1MTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUwLnBuZ1wiOiAxOTUzNjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUxLnBuZ1wiOiAxOTU5NTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUyLnBuZ1wiOiAxOTIzMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDUzLnBuZ1wiOiAxOTA2NzksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU0LnBuZ1wiOiAxODIyOTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU1LnBuZ1wiOiAxNzM5NDksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU2LnBuZ1wiOiAxNzMzNzksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU3LnBuZ1wiOiAxNjcwODAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU4LnBuZ1wiOiAxNTk1MDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDU5LnBuZ1wiOiAxNTQ2NDksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYwLnBuZ1wiOiAxNDk1NTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYxLnBuZ1wiOiAxNDQ3OTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYyLnBuZ1wiOiAxNDU2MTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDYzLnBuZ1wiOiAxNDc0NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY0LnBuZ1wiOiAxMzkzNzUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY1LnBuZ1wiOiAxMjkwMTYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY2LnBuZ1wiOiAxMjI2NjUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY3LnBuZ1wiOiAxMTU5OTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY4LnBuZ1wiOiAxMDQzMzUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2xvZ28vUExBTkVfbG9nb190YWxsXzQ4MHgyNjBfMDAwMDY5LnBuZ1wiOiA5MDA0MSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvbG9nby9QTEFORV9sb2dvX3RhbGxfNDgweDI2MF8wMDAwNzAucG5nXCI6IDY3NzQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9sb2dvL1BMQU5FX2xvZ29fdGFsbF80ODB4MjYwXzAwMDA3MS5wbmdcIjogNDk5MTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDM4MTY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAxLnBuZ1wiOiAzODM3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMi5wbmdcIjogMzkxMjEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDM4NjU4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA0LnBuZ1wiOiAzNzk2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNS5wbmdcIjogMzgxMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDM4MjM4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA3LnBuZ1wiOiAzODE4NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwOC5wbmdcIjogMzg0MDIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDM4MTY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDEwLnBuZ1wiOiAzODMwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMS5wbmdcIjogMzg1MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDAucG5nXCI6IDIwMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwMS5wbmdcIjogMjE1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAyLnBuZ1wiOiAyMzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDMucG5nXCI6IDI1MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNC5wbmdcIjogMzc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA1LnBuZ1wiOiA0MTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDYucG5nXCI6IDQ2OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNy5wbmdcIjogNTU0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA4LnBuZ1wiOiA2NTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDkucG5nXCI6IDEwMDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTAucG5nXCI6IDE4NjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTEucG5nXCI6IDI0MzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTIucG5nXCI6IDM0MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTMucG5nXCI6IDQ1OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTQucG5nXCI6IDYwODgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTUucG5nXCI6IDcwODcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTYucG5nXCI6IDc5ODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTcucG5nXCI6IDgyOTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTgucG5nXCI6IDk3NDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTkucG5nXCI6IDk5NTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjAucG5nXCI6IDg4MDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjEucG5nXCI6IDk1MDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjIucG5nXCI6IDk1NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjMucG5nXCI6IDk2MDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjQucG5nXCI6IDk3MjUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjUucG5nXCI6IDk4MDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjYucG5nXCI6IDk0NDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjcucG5nXCI6IDk0MzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjgucG5nXCI6IDk1NDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjkucG5nXCI6IDg3NjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzAucG5nXCI6IDg5NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzEucG5nXCI6IDg1ODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzIucG5nXCI6IDgzMzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzMucG5nXCI6IDgxMTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzQucG5nXCI6IDc5NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzUucG5nXCI6IDc3NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzYucG5nXCI6IDc0MzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzcucG5nXCI6IDcyODUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzgucG5nXCI6IDcyNTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzkucG5nXCI6IDUzNDE5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQwLnBuZ1wiOiA2OTU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQxLnBuZ1wiOiA2NjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQyLnBuZ1wiOiA2NzkyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQzLnBuZ1wiOiA2NTI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ0LnBuZ1wiOiA2NDQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ1LnBuZ1wiOiA2MzA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ2LnBuZ1wiOiA2NDk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ3LnBuZ1wiOiA2MzE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ4LnBuZ1wiOiA2NDQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ5LnBuZ1wiOiA2NzQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUwLnBuZ1wiOiA2NzUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUxLnBuZ1wiOiA2ODAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUyLnBuZ1wiOiA2NTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUzLnBuZ1wiOiA2NTk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU0LnBuZ1wiOiA2ODY1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU1LnBuZ1wiOiA3MTE5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU2LnBuZ1wiOiA3Mzg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU3LnBuZ1wiOiA3NTU4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU4LnBuZ1wiOiA3Njc2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU5LnBuZ1wiOiA3OTg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYwLnBuZ1wiOiA3OTMwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYxLnBuZ1wiOiA4NDQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYyLnBuZ1wiOiA4NDUyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYzLnBuZ1wiOiA4NzA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY0LnBuZ1wiOiA5MTg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY1LnBuZ1wiOiA4OTI1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY2LnBuZ1wiOiA2NDg5OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ny5wbmdcIjogOTU1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OC5wbmdcIjogMTAwNzIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjkucG5nXCI6IDEwNzgyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcwLnBuZ1wiOiAxMDU4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MS5wbmdcIjogMTA5NTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzIucG5nXCI6IDExMTcyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDczLnBuZ1wiOiAxMTEwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NC5wbmdcIjogMTE1NTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzUucG5nXCI6IDEyMDgzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc2LnBuZ1wiOiAxMjAzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ny5wbmdcIjogMTIzNzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzgucG5nXCI6IDEyOTA4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc5LnBuZ1wiOiAxMzMwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MC5wbmdcIjogMTMzMTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODEucG5nXCI6IDEzNzMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgyLnBuZ1wiOiAxNDA5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4My5wbmdcIjogMTQxOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODQucG5nXCI6IDE0NzAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg1LnBuZ1wiOiAxNTEyOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ni5wbmdcIjogMTQ5MjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODcucG5nXCI6IDE1NzM1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg4LnBuZ1wiOiAxNjI3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OS5wbmdcIjogMTYyNzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTAucG5nXCI6IDE2Nzk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkxLnBuZ1wiOiAxNzQwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Mi5wbmdcIjogMTcwMTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTMucG5nXCI6IDE3OTc5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk0LnBuZ1wiOiAxODQ3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NS5wbmdcIjogMTg5NjUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTYucG5nXCI6IDE5NDAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk3LnBuZ1wiOiAyMDAwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OC5wbmdcIjogMTk3MzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTkucG5nXCI6IDIwNDE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAwLnBuZ1wiOiAyMTQ4MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMS5wbmdcIjogMjI5ODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDIucG5nXCI6IDIzMDM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAzLnBuZ1wiOiAyMzcxNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNC5wbmdcIjogMjUwNDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDUucG5nXCI6IDI1Mzg3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA2LnBuZ1wiOiAyNzE0MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNy5wbmdcIjogMjc1MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDgucG5nXCI6IDI5MjMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA5LnBuZ1wiOiAyODg1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMC5wbmdcIjogMzAxMDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTEucG5nXCI6IDMwMDI4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEyLnBuZ1wiOiAzMTEyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMy5wbmdcIjogMzMwODYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTQucG5nXCI6IDMzNTI4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE1LnBuZ1wiOiAzNTc3Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNi5wbmdcIjogMzgyMTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTcucG5nXCI6IDM5MjgzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE4LnBuZ1wiOiA0MTA0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOS5wbmdcIjogNDI0NjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjAucG5nXCI6IDQ0MzU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIxLnBuZ1wiOiA0NDI3Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMi5wbmdcIjogNDY4ODAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjMucG5nXCI6IDUxNjMzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI0LnBuZ1wiOiA1MzkyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNS5wbmdcIjogNTcyNjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjYucG5nXCI6IDU5NDg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI3LnBuZ1wiOiA2MDgzNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOC5wbmdcIjogNjI3NTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjkucG5nXCI6IDY4MTU0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMwLnBuZ1wiOiA3MTgyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMS5wbmdcIjogNzQ1NzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzIucG5nXCI6IDgyNzI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMzLnBuZ1wiOiA4NzE3MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNC5wbmdcIjogOTI2NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzUucG5nXCI6IDk5MzE2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM2LnBuZ1wiOiAxMDg0MjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzcucG5nXCI6IDExMzM5Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOC5wbmdcIjogMTE3MDk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM5LnBuZ1wiOiAxMjgxNTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDAucG5nXCI6IDEzNDA3MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MS5wbmdcIjogMTQ0OTAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQyLnBuZ1wiOiAxNTQ4MzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDMucG5nXCI6IDE2MjQwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NC5wbmdcIjogMTU3NzQ3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ1LnBuZ1wiOiAxNjY1MzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDYucG5nXCI6IDE1Nzg2NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ny5wbmdcIjogMTU0MjIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ4LnBuZ1wiOiAxNTU4NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDkucG5nXCI6IDE0NDQwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MC5wbmdcIjogMTM4MjY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUxLnBuZ1wiOiAxMzM2MTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTIucG5nXCI6IDEyMjgzMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1My5wbmdcIjogMTE3MDc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU0LnBuZ1wiOiAxMjAzMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTUucG5nXCI6IDEwNjA5M1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwibWFuaWZlc3RcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiQmxhZGVcIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL2JsYWRlLm9nZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJDYWJiaWVcIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL2NhYmJpZS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiRGlwcGVyXCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9kaXBwZXIub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIkR1c3R5XCIsXG4gICAgICAgICAgICBcInNyY1wiOiBcImFzc2V0cy9hdWRpby9kdXN0eS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiVGVhbVwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vdGVhbS5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiV2luZGxpZnRlclwiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vd2luZGxpZnRlci5vZ2dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiSW50cm9WaWRlb1wiLFxuICAgICAgICAgICAgXCJzcmNcIjogXCJhc3NldHMvYXVkaW8vY29taW5nYXR5b3Uub2dnXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIldpcGVzY3JlZW5cIixcbiAgICAgICAgICAgIFwic3JjXCI6IFwiYXNzZXRzL2F1ZGlvL3dpcGVzY3JlZW4ub2dnXCJcbiAgICAgICAgfVxuXG4gICAgXSxcbiAgICBcImNoYXJhY3RlckF1ZGlvSWRzXCI6IHtcbiAgICAgICAgXCJkdXN0eVwiOiBcIkR1c3R5XCIsXG4gICAgICAgIFwiYmxhZGVyYW5nZXJcIjogXCJCbGFkZVwiLFxuICAgICAgICBcImNhYmJpZVwiOiBcIkNhYmJpZVwiLFxuICAgICAgICBcImRpcHBlclwiOiBcIkRpcHBlclwiLFxuICAgICAgICBcIndpbmRsaWZ0ZXJcIjogXCJXaW5kbGlmdGVyXCIsXG4gICAgICAgIFwidGVhbVwiOiBcIlRlYW1cIlxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJjbGFzc1wiOiBcImNhbm5lZFwiLFxuICAgIFwiY29weVwiOiBcIk5vdyB0aGF0IHdlIGtub3cgbW9yZSBhYm91dCB5b3UsIGl0J3MgeW91ciB0dXJuIHRvIGFzayBmaXJlIHJhbmdlciBzb21lIHF1ZXN0aW9uc1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgaXMgeW91ciBqb2IgYXQgUGlzdG9uIFBlYWs/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiam9iXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGRvIHlvdSBmaWdodCBmb3Jlc3QgZmlyZXM/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZm9yZXN0ZmlyZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIYXZlIHlvdSBhbHdheXMgYmVlbiBhIGZpcmVmaWdodGVyP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZpcmVmaWdodGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hvIGlzIHlvdXIgYmVzdCBmcmllbmQ/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmVzdGZyaWVuZFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoZXJlIGlzIHlvdXIgZmF2b3JpdGUgcGxhY2UgdG8gZmx5P1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZhdm9yaXRlcGxhY2VcIlxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcIm5hbWVcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjbGFzc1wiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNvcHlcIjogXCJXaG8gZG8geW91IHdhbnQgdG8gd3JpdGUgdG8/XCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRHVzdHlcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkdXN0eVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsYWRlIFJhbmdlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsYWRlcmFuZ2VyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2FiYmllXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiY2FiYmllXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRGlwcGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZGlwcGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2luZGxpZnRlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIndpbmRsaWZ0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJUaGUgVGVhbVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInRlYW1cIlxuICAgICAgICB9XG4gICAgXSxcbiAgICBcInJlcXVpcmVkXCI6IHRydWVcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0J3MgeW91ciBmYXZvcml0ZSBjb2xvcj9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInJlZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsdWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsdWVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJPcmFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm9yYW5nZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkdyZWVuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJncmVlblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlllbGxvd1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwieWVsbG93XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHVycGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwdXJwbGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtZm9vZFwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLWZvb2RcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBmb29kP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlBpenphXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwaXp6YVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkljZSBDcmVhbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaWNlY3JlYW1cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCcm9jY29saVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYnJvY2NvbGlcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJGcmVuY2ggRnJpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZyZW5jaGZyaWVzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2hpY2tlbiBOdWdnZXRzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJjaGlja2VubnVnZ2V0c1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlBCJkpcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInBialwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1zcG9ydFwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLXNwb3J0XCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgc3BvcnQ/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRm9vdGJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZvb3RiYWxsXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmFzZWJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJhc2ViYWxsXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG9ja2V5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJob2NrZXlcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTd2ltbWluZy9EaXZpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInN3aW1taW5nXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU29jY2VyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzb2NjZXJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSYWNpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInJhY2luZ1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImR1c3R5XCIgOiB7XG4gICAgICAgIFwiZ3JlZXRpbmdcIjogXCJIaSB0aGVyZSFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkkgd2FzIHJlYWxseSBleGNpdGVkIHRvIHJlY2VpdmUgeW91ciBhaXJtYWlsIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiSSd2ZSBnb3R0YSBnZXQgYmFjayB0byBmaWdodGluZyBmaXJlcyBoZXJlLCBidXQgeW91IHN0YXkgc3Ryb25nIVwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIk92ZXIgYW5kIG91dFwiLFxuICAgICAgICBcImpvYlwiOiBcIkknbSBhIFNFQVQsIG9yIGEgU2luZ2xlLUVuZ2luZSBBaXIgVGFua2VyLCB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdC5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgY2FuIHNjb29wIHdhdGVyIGZyb20gbGFrZXMgYW5kIGRpdmUgaW50byB0aGUgZm9yZXN0IHRvIGRyb3AgdGhlIHdhdGVyIG9uIHdpbGRmaXJlcy4gU3BlZWQgY291bnRzIHdoZW4gYW4gYWlyIHJlc2N1ZSBpcyB1bmRlciB3YXksIHNvIEknbSBhbHdheXMgcmVhZHkgdG8gZmx5IGludG8gZGFuZ2VyIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiQmVmb3JlIGpvaW5pbmcgdGhlIEFpciBBdHRhY2sgVGVhbSwgSSB3YXMgYSB3b3JsZC1mYW1vdXMgYWlyIHJhY2VyIOKAkyBJIGV2ZW4gcmFjZWQgYXJvdW5kIHRoZSB3b3JsZCEgIE5vdyBJIHJhY2UgdG8gcHV0IG91dCBmaXJlcy5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgd2Fzbid0IGVhc3kgYmVjb21pbmcgYSBjaGFtcGlvbiByYWNlciBvciBhIGZpcmVmaWdodGVyIGJ1dCBJJ3ZlIGhhZCBhbiBhbWF6aW5nIHRlYW0gb2YgZnJpZW5kcyB3aXRoIG1lIGV2ZXJ5IHN0ZXAgb2YgdGhlIHdheSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBoYXZlIGJlZW4gZmx5aW5nIGZvciBhcyBsb25nIGFzIEkgY2FuIHJlbWVtYmVyIGJ1dCBteSBmYXZvcml0ZSBwbGFjZSB0byBmbHkgaXMgYWJvdmUgbXkgaG9tZXRvd24sIFByb3B3YXNoIEp1bmN0aW9uLiBJIGRvIHNvbWUgZmFuY3kgZmx5aW5nIHRoZXJlIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCIldGVtcGxhdGUlIHNvdW5kcyBkZWxpY2lvdXMhIEkgbWVhbiwgYW55dGhpbmcncyBiZXR0ZXIgdG8gZWF0IHRoYW4gVml0YW1pbmFtdWxjaC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIk15IGZhdm9yaXRlIGNvbG9yIGlzIEdSRUVOLiBHcmVlbiBtZWFucyBnbyEgQW5kIEkgbG92ZSB0byBnbyBmYXN0LlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiSSB3YXMgYSBjaGFtcGlvbiByYWNlciBub3QgdG9vIGxvbmcgYWdvLiBSYWNpbmcgaXMgZGVmaW5pdGVseSBteSBmYXZvcml0ZSBzcG9ydC5cIlxuICAgIH0sXG4gICAgXCJkaXBwZXJcIjoge1xuICAgICAgICBcImdyZWV0aW5nXCI6IFwiSGkgdGhlcmUsXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJJJ20gRGlwcGVyLiBUaGF0J3Mgd2hhdCBldmVyeW9uZSBjYWxscyBtZS4gU28geW91IGNhbiB0b28hXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaGFua3MgZm9yIHdyaXRpbmcgdG8gbWUgJXRlbXBsYXRlJS5cIixcbiAgICAgICAgXCJzaW5jZXJlbHlcIjogXCJSZW1lbWJlciwgdGhlIHNreSdzIHRoZSBsaW1pdCFcIixcbiAgICAgICAgXCJqb2JcIjogXCJJIGhhdmUgYSByZWFsbHkgaW1wb3J0YW50IGpvYiBmaWdodGluZyB3aWxkZmlyZXMuIEknbSBhbiBhaXIgdGFua2VyIHdpdGggdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtLlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBmaWdodCBmb3Jlc3QgZmlyZXMgaW4gc2V2ZXJhbCB3YXlzLiAgU29tZXRpbWVzIEkgZHJvcCByZXRhcmRhbnQgdG8gY29udGFpbiBhIGZpcmUuICBJIGNhbiBhbHNvIHNjb29wIHdhdGVyIGZyb20gdGhlIGxha2UgYW5kIGRyb3AgaXQgZGlyZWN0bHkgb24gdGhlIGZpcmUuIE15IGJvc3MgQmxhZGUgUmFuZ2VyIGNhbGxzIG1lIGEgTXVkLURyb3BwZXIhXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGhhdWwgY2FyZ28gdXAgaW4gQW5jaG9yYWdlLiBZZXAsIGEgbG90IG9mIGd1eXMgaW4gQWxhc2thLiBJIHdhcyBiZWF0aW5nIHRoZW0gb2ZmIHdpdGggYSBzdGljayFcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiTXkgYmVzdCBmcmllbmQgaXMgY2hhbXBpb24gcmFjZXIgRHVzdHkgQ3JvcGhvcHBlci4gSSdtIGhpcyBiaWdnZXN0IGZhbiFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiTXkgZmF2b3JpdGUgcGxhY2UgdG8gZmx5IGlzIHRoZSBGdXNlbCBMb2RnZSwgcmlnaHQgaGVyZSBpbiBQaXN0b24gUGVhay4gSXQncyBzbyBiZWF1dGlmdWwuIEFuZCB3aGVyZSBEdXN0eSBhbmQgSSBoYWQgb3VyIGZpcnN0IGRhdGUhIEl0IHdhcyBhIGRhdGUsIHJpZ2h0PyBJJ20gcHJldHR5IHN1cmUgaXQgd2FzIGEgZGF0ZS5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiV2hpbGUgJXRlbXBsYXRlJSBzb3VuZHMgcmVhbGx5IGdvb2QsIHRoZXJlJ3Mgbm90aGluZyBiZXR0ZXIgdGhhbiBhIGZyZXNoIGNhbiBvZiBvaWwhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJXaGF0J3MgbXkgZmF2b3JpdGUgY29sb3I/IFlFTExPVyBsaWtlIHRoZSBzdW5zaGluZS4uIGFuZCBsaWtlIE1FIVwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiU3dpbW1pbmcvZGl2aW5nIGlzIG15IGZhdm9yaXRlIHNwb3J0ISBJIGxvdmUgZGlwcGluZyBpbiBhbmQgb3V0IG9mIHRoZSB3YXRlci5cIlxuICAgIH0sXG4gICAgXCJ3aW5kbGlmdGVyXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhlbGxvIGZyaWVuZCFcIixcbiAgICAgICAgXCJib2R5MVwiOiBcIkkgZW5qb3llZCByZWFkaW5nIHlvdXIgbGV0dGVyIVwiLFxuICAgICAgICBcImJvZHkyXCI6IFwiVGhhbmtzIGZvciB5b3VyIGxldHRlciAldGVtcGxhdGUlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIllvdXIgbmV3IGZyaWVuZFwiLFxuICAgICAgICBcImpvYlwiOiBcIkkgYW0gYSBIZWF2eS1MaWZ0IEhlbGljb3B0ZXIgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtLCBhbiBlbGl0ZSBjcmV3IG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdC5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkJsYWRlIGNhbGxzIG1lIGEgXFxcIk11ZCBEcm9wcGVyXFxcIiBiZWNhdXNlIEkgaGF2ZSBhIGRldGFjaGFibGUgdGFuayBsb2FkZWQgd2l0aCBmaXJlIHJldGFyZGFudCB0byBoZWxwIHB1dCBvdXQgdGhlIGZpcmVzLiAgTXVkIGlzIHNsYW5nIGZvciByZXRhcmRhbnQuICBJIGNhbiBob2xkIG1vcmUgcmV0YXJkYW50IHRoYW4gYW55b25lIGVsc2Ugb24gdGhlIHRlYW0uXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGJlIGEgbHVtYmVyamFjaywgbGlmdGluZyBkb3plbnMgb2YgaGVhdnkgbG9ncyBhbmQgY2FycnlpbmcgdGhlbSB0byB0aGUgbHVtYmVyIG1pbGwuICBCdXQgbm93IEkgYW0gYSBmaXJlZmlnaHRlciBhbmQgdGhpcyBrZWVwcyBtZSB2ZXJ5IGJ1c3kuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkkgd291bGQgbGlrZSB0byBiZSBZT1VSIGJlc3QgZnJpZW5kLlwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGxpa2UgdG8gZmx5IG1hbnkgcGxhY2VzIGFuZCBiZSBvbmUgd2l0aCB0aGUgd2luZC4gVGhlIHdpbmQgc3BlYWtzLCBhbmQgSSBsaXN0ZW4uXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIiV0ZW1wbGF0ZSUgc291bmRzIGRlbGljaW91cyEgSGF2ZSB5b3UgdHJpZWQgaXQgd2l0aCBhIGNhbiBvZiBvaWw/IFRoYXQncyBteSBmYXZvcml0ZSBmb29kLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgQkxVRSBsaWtlIHRoZSB3YXRlciBhbmQgdGhlIHNreS5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkkgZG9uJ3QgcGxheSBtYW55IHNwb3J0cywgYnV0IEkgYW0gYW4gYXZpZCB3ZWlnaHQgbGlmdGVyLiBZb3UnbGwgb2Z0ZW4gc2VlIG1lIGxpZnRpbmcgaGVhdnkgbG9hZHMgb2YgbG9ncyBpbiBteSBvZmYgdGltZVwiXG4gICAgfSxcbiAgICBcImJsYWRlcmFuZ2VyXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhpIENoYW1wIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiSSdtIEJsYWRlIFJhbmdlci4gQnV0IHlvdSBjYW4gY2FsbCBtZSBCbGFkZS5cIixcbiAgICAgICAgXCJib2R5MlwiOiBcIlJlbWVtYmVyLCB5b3UgY2FuIGRvIGFueXRoaW5nISAgWW91IGp1c3QgaGF2ZSB0byB0cmFpbiBoYXJkIGFuZCBoYXZlIGNvdXJhZ2UuICBUaGFua3MgZm9yIHlvdXIgbGV0dGVyICV0ZW1wbGF0ZSUuXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiWW91ciBwYXJ0bmVyXCIsXG4gICAgICAgIFwiam9iXCI6IFwiSSdtIGEgRmlyZSBhbmQgUmVzY3VlIEhlbGljb3B0ZXIsIGFuZCB0aGUgQ2hlaWYgaW4gQ2hhcmdlIGhlcmUgYXQgUGlzdG9uIFBlYWsuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJXaGVuIHRoZXJlJ3MgYSBmaXJlLCBJIGdpdmUgdGhlIG9yZGVycyBmb3IgdGhlIEFpciBBdHRhY2sgVGVhbSB0byBzcHJpbmcgaW50byBhY3Rpb24hXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJJ3ZlIGJlZW4gdGhlIENoaWVmIGZvciBhIGxvbmcgdGltZSwgYnV0IEkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiAgVGhpcyBpcyBteSBzZWNvbmQgY2FyZWVyLCBhbmQgbXkgbW9zdCByZXdhcmRpbmcuICBOb3cgSSBmbHkgaW4gd2hlbiBvdGhlcnMgZmx5IG91dCB0byBoZWxwIHRob3NlIHdobyBuZWVkIGl0IG1vc3QuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kcyBhcmUgYWxsIHRoZSB0cmFpbGJsYXplcnMgaGVyZSBhdCBQaXN0b24gUGVhay4gV2UgbGlrZSB0byB0aGluayBvZiBvdXJzZWx2ZXMgYXMgdGhlIGhlcm9lcyBvZiB0aGUgc2t5IVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGxpa2UgdG8gZmx5IHRvIG1hbnkgcGxhY2VzLCBidXQgbXkgZmF2b3JpdGUgcGxhY2UgaXMgYWJvdmUgUGlzdG9uIFBlYWsuIEkgcGF0cm9sIHRoZSBza2llcyBhbmQgbWFrZSBzdXJlIGFsbCB0aGUgdG91cmlzdHMgYXJlIGNhbXBpbmcgYnkgdGhlIGJvb2suIFJlbWVtYmVyLCBzYWZldHkgZmlyc3QhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIllvdSBzYXkgeW91IGxpa2UgdG8gZWF0ICV0ZW1wbGF0ZSU/IEkgcHJlZmVyIGEgZnJlc2ggY2FuIG9mIG9pbC4gXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBSRUQsIHRoZSBjb2xvciBvZiBGaXJlIFNhZmV0eS5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIklmIEkgaGFkIHRvIGNob29zZSwgZm9vdGJhbGwgd291bGQgYmUgbXkgZmF2b3JpdGUgc3BvcnQuXCJcbiAgICB9LFxuICAgIFwiY2FiYmllXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkF0dGVudGlvbiAldGVtcGxhdGUlIVwiLFxuICAgICAgICBcImJvZHkxXCI6IFwiQ2FiYmllIGhlcmUuXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaGFua3MgZm9yIHRoZSBtZXNzYWdlLlwiLFxuICAgICAgICBcInNpbmNlcmVseVwiOiBcIk92ZXIgYW5kIG91dFwiLFxuICAgICAgICBcImpvYlwiOiBcIkknbSBhbiBleC1taWxpdGFyeSBjYXJnbyBwbGFuZSB3aXRoIHRoZSBQaXN0b24gUGVhayBBdHRhY2sgVGVhbSAtIGZpcmVmaWdodGluZyBpcyBhIGJpZyByZXNwb25zaWJpbGl0eS5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgY2FycnkgdGhlIFNtb2tlanVtcGVycyAtIHdobyBjbGVhciBmYWxsZW4gdHJlZXMgYW5kIGRlYnJpcy4gRHVyaW5nIGEgZmlyZSwgSSBkcm9wIHRoZW0gZnJvbSB0aGUgc2t5LCByaWdodCBvdmVyIHRoZSBmbGFtZXMuXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGRyb3AgYWlyYm9ybmUgdXRpbGl0eSB2ZWhpY2xlcyBiZWhpbmQgZW5lbXkgbGluZXMgZHVyaW5nIHdhci4gTm93IEkgZHJvcCBTbW9rZWp1bXBlcnMgYXQgUGlzdG9uIFBlYWsuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIldobydzIG15IGJlc3QgZnJpZW5kPyBUaGF0J3MgcHJvYmFibHkgVG9wIFNlY3JldCBidXQgSSBjYW4gc2F5IHRoZSBTbW9rZWp1bXBlcnMgYXJlIG15IGNsb3Nlc3QgcmVjcnVpdHMuXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkndmUgZmxvd24gb3ZlciBtYW55IHBsYWNlcyBpbiBteSB0aW1lLiBNeSBmYXZvcml0ZSBzcG90IGlzIEFuY2hvciBMYWtlIC0gYSBsb25nIGJvZHkgb2Ygd2F0ZXIgd2l0aCBhbiBhbmNob3Itc2hhcGVkIGlzbGFuZC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiSW4gdGhlIG1pbGl0YXJ5LCBhbGwgZm9vZCBpcyByYXRpb25lZCBidXQgSSdsbCB0YWtlIGFzIG11Y2ggZnJlc2ggb2lsIGFzIEkgY2FuIGdldCEgXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBHUkVFTiAtIGl0IGNhbiBoZWxwIG1lIGhpZGUgYWJvdmUgdGhlIHBpbmUgdHJlZXMuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJCYXNlYmFsbCBpcyBteSBmYXZvcml0ZSBzcG9ydC4gSSBhbHdheXMgaGF2ZSBmaXZlIHNtb2tlanVtcGVycyBpbiBteSBjYXJnbyAtIGp1c3QgZW5vdWdoIHRvIGNvdmVyIHRoZSBiYXNlcy5cIlxuICAgIH0sXG4gICAgXCJ0ZWFtXCI6IHtcbiAgICAgICAgXCJncmVldGluZ1wiOiBcIkhleSBmcmllbmQhXCIsXG4gICAgICAgIFwiYm9keTFcIjogXCJUaGFua3MgZm9yIHdyaXRpbmcgdG8gdXMuXCIsXG4gICAgICAgIFwiYm9keTJcIjogXCJUaW1lIHRvIGdldCBiYWNrIHRvIHdvcmshXCIsXG4gICAgICAgIFwic2luY2VyZWx5XCI6IFwiTGV0J3MgbWFrZSBpdCBjb3VudCFcIixcbiAgICAgICAgXCJqb2JcIjogXCJUaGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtIGlzIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdHMuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2UgZmx5IGluIHdoZW4gb3RoZXJzIGFyZSBmbHlpbiBvdXQuIEl0IHRha2VzIGEgc3BlY2lhbCBraW5kYSBwbGFuZS5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkxpZmUgZG9lc24ndCBhbHdheXMgZ28gdGhlIHdheSB5b3UgZXhwZWN0IGl0LiBUaGlzIGlzIGEgc2Vjb25kIGNhcmVlciBmb3IgYWxsIG9mIHVzLiBcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgdGFrZXMgaG9ub3IsIHRydXN0IGFuZCBicmF2ZXJ5IHRvIGVhcm4geW91ciB3aW5ncy4gV2UgZG9uJ3QgaGF2ZSBqdXN0IG9uZSBiZXN0IGZyaWVuZCBiZWNhdXNlIHdlIG5lZWQgZXZlcnkgcGxhbmUgd2UndmUgZ290IHRvIGhlbHAuIFwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJQaXN0b24gUGVhayBoYXMgc29tZSBncmVhdCBwbGFjZXMgdG8gZmx5LiBCdXQgb3VyIGZhdm9yaXRlIHNwb3QgaXMgdGhlIHdvb2RlbiByYWlsd2F5IGJyaWRnZSAtIHdpdGggdGhlIHRodW5kZXJpbmcgV2hpdGV3YWxsIEZhbGxzIGJlaGluZCBpdC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBzb3VuZHMgZ3JlYXQgYnV0IHdlJ2QgcmF0aGVyIHNsdXJwIGRvd24gZnJlc2ggY2FucyBvZiBvaWwuIEhPSVNUIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiV2UgbGlrZSBhbGwgY29sb3JzIG9mIHRoZSByYWluYm93LiBCdXQgYXMgYSB0ZWFtLCBvdXIgZmF2b3JpdGUgY29sb3IgaXMgJXRlbXBsYXRlJSwganVzdCBsaWtlIHlvdSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkl0J3MgaGFyZCB0byBwaWNrIGEgZmF2b3JpdGUgc3BvcnQgLSB3ZSdyZSBhIGZhbiBvZiBhbnl0aGluZyB0aGF0IGxldCB1cyB3b3JrIGFzIGEgdGVhbSFcIlxuICAgIH1cbn0iLCJ2YXIgZGV2aWNlID0ge1xuICAgIGlzQW5kcm9pZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpICE9PSBudWxsO1xuICAgIH0sXG4gICAgaXNBbmRyb2lkVGFibGV0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkgIT09IG51bGxcbiAgICAgICAgICAgICYmIChcbiAgICAgICAgICAgICgod2luZG93Lm9yaWVudGF0aW9uID09PSAwIHx8IHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gMTgwICkgJiYgc2NyZWVuLndpZHRoID4gNjQwKVxuICAgICAgICAgICAgICAgIHx8ICgod2luZG93Lm9yaWVudGF0aW9uID09PSAtOTAgfHwgd2luZG93Lm9yaWVudGF0aW9uID09PSA5MCkgJiYgc2NyZWVuLmhlaWdodCA+IDY0MClcbiAgICAgICAgICAgICk7XG4gICAgfSxcbiAgICBpc0JsYWNrQmVycnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzSU9TOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSkgIT09IG51bGw7XG4gICAgfSxcbiAgICBpc0lwYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZC9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzT3BlcmE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvT3BlcmEgTWluaS9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzV2luZG93czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9JRU1vYmlsZS9pKSAhPT0gbnVsbDtcbiAgICB9LFxuICAgIGlzVGFibGV0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNBbmRyb2lkVGFibGV0KCkgfHwgdGhpcy5pc0lwYWQoKTtcbiAgICB9LFxuICAgIGlzTW9iaWxlOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzVGFibGV0KCkgJiYgKHRoaXMuaXNJT1MoKSB8fCB0aGlzLmlzQW5kcm9pZCgpIHx8IHRoaXMuaXNCbGFja0JlcnJ5KCkgfHwgdGhpcy5pc09wZXJhKCkgfHwgdGhpcy5pc1dpbmRvd3MoKSk7XG4gICAgfSxcbiAgICBjdXJyZW50RGV2aWNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUoKSlcbiAgICAgICAgICAgIHJldHVybiBcIm1vYmlsZVwiO1xuICAgICAgICBpZiAodGhpcy5pc1RhYmxldCgpKVxuICAgICAgICAgICAgcmV0dXJuIFwidGFibGV0XCI7XG4gICAgICAgIHJldHVybiBcImRlc2t0b3BcIjtcbiAgICB9LFxuICAgIGN1cnJlbnREZXZpY2VOYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dpdGNoKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5pc0FuZHJvaWQoKToge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkFuZHJvaWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSB0aGlzLmlzQmxhY2tCZXJyeSgpOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQmxhY2tCZXJyeVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNPcGVyYSgpOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiT3BlcmEgTWluaVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNXaW5kb3dzKCk6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJJRU1vYmlsZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIHRoaXMuaXNJT1MoKToge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSXBhZCgpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpUGFkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiaVBob25lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRGVza3RvcFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGV2aWNlOyIsIlxuXG5cblxuLy8gYWRkcyBvdXIgY3VzdG9tIG1vZGlmaWNhdGlvbnMgdG8gdGhlIFBJWEkgbGlicmFyeVxucmVxdWlyZSgnLi9waXhpL2xpYk1vZGlmaWNhdGlvbnMnKTtcblxuXG5cbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFpblZpZXcnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuL2RldmljZScpO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFwcCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhcHAgPSB7fTtcblxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFBhc3N3b3JkIFNjcmVlbiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciAkcGFzc3dvcmRTY3JlZW4gPSAkKCcjcGFzc3dvcmRTY3JlZW4nKTtcblxuaWYoZG9jdW1lbnQuVVJMLmluZGV4T2YoJ2Rpc25leS1wbGFuZXMyLWFpcm1haWwtc3RhZ2luZy5henVyZXdlYnNpdGVzLm5ldCcpICE9PSAtMSkge1xuICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciBwYXNzd29yZCA9ICdkaXNuZXlQbGFuZXNUd28nO1xuXG4gICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dCA9ICRwYXNzd29yZFNjcmVlbi5maW5kKCdpbnB1dFt0eXBlPXBhc3N3b3JkXScpO1xuXG4gICAgICAgICRwYXNzd29yZFNjcmVlbi5maW5kKCdmb3JtJykuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYoJHBhc3N3b3JkSW5wdXQudmFsKCkgPT09IHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZhZGVPdXQoNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRwYXNzd29yZFNjcmVlbi5zaG93KCk7XG5cbiAgICBjb25zb2xlLmxvZygkcGFzc3dvcmRTY3JlZW4pO1xufSBlbHNlIHtcbiAgICAkcGFzc3dvcmRTY3JlZW4ucmVtb3ZlKCk7XG59XG5cblxuXG4kKGZ1bmN0aW9uKCkge1xuICAgIEZhc3RDbGljay5hdHRhY2goZG9jdW1lbnQuYm9keSk7XG5cbiAgICBhcHAubWFpblZpZXcgPSBuZXcgTWFpblZpZXcoKTtcblxuICAgIGFwcC5tYWluVmlldy5zdGFydCgpO1xufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4iLCJcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBBdWRpbyBMb2FkZXIgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYXVkaW9Bc3NldERhdGEgPSByZXF1aXJlKCcuL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xudmFyIG51bUF1ZGlvQXNzZXRzID0gYXVkaW9Bc3NldERhdGEubWFuaWZlc3QubGVuZ3RoO1xuXG5cblxuZnVuY3Rpb24gc3RhcnRBdWRpb0xvYWRlcigpIHtcbiAgICAvLyBpZiBpbml0aWFsaXplRGVmYXVsdFBsdWdpbnMgcmV0dXJucyBmYWxzZSwgd2UgY2Fubm90IHBsYXkgc291bmRcbiAgICBpZiAoIWNyZWF0ZWpzLlNvdW5kLmluaXRpYWxpemVEZWZhdWx0UGx1Z2lucygpKSB7IHJldHVybjsgfVxuXG4gICAgY3JlYXRlanMuU291bmQuYWx0ZXJuYXRlRXh0ZW5zaW9ucyA9IFtcIm1wM1wiXTtcbiAgICBjcmVhdGVqcy5Tb3VuZC5hZGRFdmVudExpc3RlbmVyKFwiZmlsZWxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgfSk7XG4gICAgY3JlYXRlanMuU291bmQucmVnaXN0ZXJNYW5pZmVzdChhdWRpb0Fzc2V0RGF0YS5tYW5pZmVzdCk7XG5cbiAgICBjcmVhdGVqcy5Tb3VuZC5zZXRWb2x1bWUoMC40KTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFByaW1hcnkgTG9hZGVyICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYXNzZXREYXRhID0gcmVxdWlyZSgnLi9kYXRhL2Fzc2V0cy5qc29uJyk7XG5cbnZhciBmaWxlTmFtZXMgPSBPYmplY3Qua2V5cyhhc3NldERhdGEuYXNzZXRzKTtcbnZhciB0b3RhbEZpbGVzID0gZmlsZU5hbWVzLmxlbmd0aDtcblxudmFyIGxvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKGZpbGVOYW1lcyk7XG52YXIgc3RhcnRUaW1lO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG5cbiAgICBsb2FkZXIub25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZUxvYWRlZCA9ICh0b3RhbEZpbGVzIC0gdGhpcy5sb2FkQ291bnQpL3RvdGFsRmlsZXM7XG4gICAgICAgIHZhciB0aW1lRWxhcHNlZCA9IF8ubm93KCkgLSBzdGFydFRpbWU7XG5cbiAgICAgICAgdmlldy5vbkFzc2V0UHJvZ3Jlc3MocGVyY2VudGFnZUxvYWRlZCwgdGltZUVsYXBzZWQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy5vbkFzc2V0c0xvYWRlZCgpO1xuICAgIH07XG5cbiAgICBzdGFydFRpbWUgPSBfLm5vdygpO1xuXG4gICAgc3RhcnRBdWRpb0xvYWRlcigpO1xuICAgIGxvYWRlci5sb2FkKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdGFydDogc3RhcnRMb2FkZXJcbn07IiwiXG5cblxudmFyIFF1ZXN0aW9uID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjb3B5OiAnJyxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgIH1cbn0pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbjsiLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG4gICAgdmFyIHNjZW5lO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBmdW5jdGlvbiBnZXRCbGFkZVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDYWJiaWVUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAnLCAwLCAxMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldERpcHBlclRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMCcsIDAsIDEyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RHVzdHlUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvRHVzdHlfcGxhbmVfMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREdXN0eTNUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkzL0R1c3R5X3BsYW5lNV8wMDAwJywgMCwgMTIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREdXN0eTRUZXh0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHk0L0R1c3R5X2FuZ2xlMV9ub0JsaW5rXzAwMCcsIDAsIDI0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0V2luZGxpZnRlclRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMCcsIDAsIDEyKTtcbiAgICB9XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6ZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIGZ1bmN0aW9uIGluaXRDaGFyYWN0ZXIobmFtZSwgdGV4dHVyZXMsIGFuY2hvcikge1xuICAgICAgICB2YXIgaWRsZUFuaW1hdGlvbiA9IG5ldyBQSVhJLk1vdmllQ2xpcCh0ZXh0dXJlcyk7XG4gICAgICAgIGlkbGVBbmltYXRpb24uYW5jaG9yID0gYW5jaG9yO1xuXG4gICAgICAgIHZhciBjaGFyID0gbmV3IENoYXJhY3RlcihuYW1lLCBpZGxlQW5pbWF0aW9uKTtcblxuICAgICAgICBjaGFyLndpbmRvd1ggPSAtMTtcbiAgICAgICAgY2hhci53aW5kb3dZID0gLTE7XG5cbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDA7XG4gICAgICAgIGNoYXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZChjaGFyKTtcblxuICAgICAgICByZXR1cm4gY2hhcjtcbiAgICB9XG5cbiAgICB2YXIgY2hhcmFjdGVySW5pdEZ1bmN0aW9ucyA9IHtcbiAgICAgICAgYmxhZGU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdCbGFkZScsIGdldEJsYWRlVGV4dHVyZXMoKSwge3g6IDQ1Ny85NzAsIHk6IDM0Ni82MDB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGNhYmJpZTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0NhYmJpZScsIGdldENhYmJpZVRleHR1cmVzKCksIHt4OiA1NDUvMTIwMCwgeTogMzUxLzYyMn0pO1xuICAgICAgICB9KSxcbiAgICAgICAgZGlwcGVyOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENoYXJhY3RlcignRGlwcGVyJywgZ2V0RGlwcGVyVGV4dHVyZXMoKSwge3g6IDUzOS8xMjAwLCB5OiA0MzUvNjM4fSk7XG4gICAgICAgIH0pLFxuICAgICAgICBkdXN0eTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0R1c3R5JywgZ2V0RHVzdHlUZXh0dXJlcygpLCB7eDogNDgwLzEyMDAsIHk6IDQwNS85ODN9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGR1c3R5RGFyazogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ0R1c3R5MycsIGdldER1c3R5M1RleHR1cmVzKCksIHt4OiAzMzUvNjAwLCB5OiAxNjUvMzYwfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBkdXN0eUZvdXI6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2hhcmFjdGVyKCdEdXN0eTQnLCBnZXREdXN0eTRUZXh0dXJlcygpLCB7eDogMzczLzYwMCwgeTogMTU0LzM0MX0pO1xuICAgICAgICB9KSxcbiAgICAgICAgd2luZGxpZnRlcjogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRDaGFyYWN0ZXIoJ1dpbmRsaWZ0ZXInLCBnZXRXaW5kbGlmdGVyVGV4dHVyZXMoKSwge3g6IDMxMC82MDAsIHk6IDIyOC8zNzF9KTtcbiAgICAgICAgfSlcbiAgICB9O1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBUZXh0dXJlIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cblxuICAgIHZhciBhbGxDaGFyYWN0ZXJzID0ge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihwaXhpU2NlbmUpIHtcbiAgICAgICAgICAgIHNjZW5lID0gcGl4aVNjZW5lO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgXy5lYWNoKGNoYXJhY3RlckluaXRGdW5jdGlvbnMsIGZ1bmN0aW9uKGluaXRGbmMsIGNoYXJhY3Rlcikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYWxsQ2hhcmFjdGVycywgY2hhcmFjdGVyLCB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdEZuYygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhbGxDaGFyYWN0ZXJzO1xufSkoKTtcblxuXG5cblxuXG5cblxuIiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG4gICAgLy8gZGlzcGxheU9iamVjdCBzaG91bGQgYmUgYW4gaW5zdGFuY2Ugb2YgUElYSS5TcHJpdGUgb3IgUElYSS5Nb3ZpZUNsaXBcbiAgICB2YXIgQ2hhcmFjdGVyID0gZnVuY3Rpb24obmFtZSwgbW92aWVDbGlwKSB7XG4gICAgICAgIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpOyAvLyBQYXJlbnQgY29uc3RydWN0b3JcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlkbGUgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKG1vdmllQ2xpcCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SWRsZVN0YXRlKG1vdmllQ2xpcCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgc2V0SWRsZVN0YXRlOiBmdW5jdGlvbihwaXhpU3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUgPSBwaXhpU3ByaXRlO1xuXG4gICAgICAgICAgICBpZihwaXhpU3ByaXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICBwaXhpU3ByaXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBpeGlTcHJpdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGl4aVNwcml0ZS5nb3RvQW5kUGxheSgwKTsgIC8vc3RhcnQgY2xpcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHBpeGlTcHJpdGUpOyAgIC8vYWRkIHRvIGRpc3BsYXkgb2JqZWN0IGNvbnRhaW5lclxuICAgICAgICB9LFxuXG4gICAgICAgIC8vYWRkIG1vdmllIGNsaXAgdG8gcGxheSB3aGVuIGNoYXJhY3RlciBjaGFuZ2VzIHRvIHN0YXRlXG4gICAgICAgIGFkZFN0YXRlOiBmdW5jdGlvbihzdGF0ZSwgbW92aWVDbGlwKSB7XG4gICAgICAgICAgICBtb3ZpZUNsaXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZXNbc3RhdGVdID0gbW92aWVDbGlwO1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChtb3ZpZUNsaXApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHB1YmxpYyBBUEkgZnVuY3Rpb24uIFdhaXRzIHVudGlsIGN1cnJlbnQgc3RhdGUgaXMgZmluaXNoZWQgYmVmb3JlIHN3aXRjaGluZyB0byBuZXh0IHN0YXRlLlxuICAgICAgICBnb1RvU3RhdGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgICBpZihfLmlzVW5kZWZpbmVkKHRoaXMuc3RhdGVzW3N0YXRlXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRXJyb3I6IENoYXJhY3RlciAnICsgdGhpcy5uYW1lICsgJyBkb2VzIG5vdCBjb250YWluIHN0YXRlOiAnICsgc3RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaWRsZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pZGxlLm9uQ29tcGxldGUgPSBfLmJpbmQodGhpcy5zd2FwU3RhdGUsIHRoaXMsIHN0YXRlKTtcblxuICAgICAgICAgICAgICAgIC8vIGFmdGVyIGN1cnJlbnQgYW5pbWF0aW9uIGZpbmlzaGVzIGdvIHRvIHRoaXMgc3RhdGUgbmV4dFxuICAgICAgICAgICAgICAgIHRoaXMuaWRsZS5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3YXBTdGF0ZSh0aGlzLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgLy9zd2l0Y2ggaW1tZWRpYXRlbHkgaWYgY2hhcmFjdGVyIGlkbGUgc3RhdGUgaXMgYSBzaW5nbGUgc3ByaXRlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9hZGQgY2FsbGJhY2sgdG8gcnVuIG9uIGNoYXJhY3RlciB1cGRhdGVcbiAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjYWxsZWQgb24gZWFjaCBhbmltYXRpb24gZnJhbWUgYnkgd2hhdGV2ZXIgUGl4aSBzY2VuZSBjb250YWlucyB0aGlzIGNoYXJhY3RlclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighXy5pc1VuZGVmaW5lZCh0aGlzLnBhcmVudCkpIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuXG4gICAgICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRTdGF0aWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pZGxlLmdvdG9BbmRTdG9wKDApO1xuICAgICAgICB9LFxuICAgICAgICBzZXREeW5hbWljOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZS5nb3RvQW5kUGxheSgwKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmxpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAtKHRoaXMuc2NhbGUueCk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1c2hUb1RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihfLmlzVW5kZWZpbmVkKHRoaXMucGFyZW50KSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciEgTm8gcGFyZW50IGRlZmluZWQgZm9yIGNoYXJhY3RlcjonLHRoaXMubmFtZSArICcuJywnSXQgaXMgbGlrZWx5IHB1c3RUb1RvcCgpIHdhcyBjYWxsZWQgYWZ0ZXIgY2hhcmFjdGVyIHdhcyBhZGRlZCBidXQgYmVmb3JlIFBJWEkgc2NlbmUgd2FzIHVwZGF0ZWQuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZEF0KHRoaXMsIGxlbmd0aC0xKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG4gICAgLy8gY2hhbmdlcyBzdGF0ZSBpbW1lZGlhdGVseVxuICAgIC8vIE5PVEU6IEZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlIHVzZWQgaW50ZXJuYWxseSBieSBjaGFyYWN0ZXIuZ29Ub1N0YXRlKClcbiAgICBmdW5jdGlvbiBzd2FwU3RhdGUoY2hhciwgc3RhdGUpIHtcbiAgICAgICAgdmFyIGlkbGVTdGF0ZSA9IGNoYXIuaWRsZTtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gY2hhci5zdGF0ZXNbc3RhdGVdO1xuXG4gICAgICAgIG5ld1N0YXRlLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHsgIC8vc3dpdGNoIGJhY2sgdG8gaWRsZSBhZnRlciBydW5cbiAgICAgICAgICAgIGlmKGlkbGVTdGF0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgbmV3U3RhdGUubG9vcCA9IGZhbHNlO1xuICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgbmV3U3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgfVxuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogRXh0ZW5kIGFuZCBFeHBvcnQgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gZXh0ZW5kcyBEaXNwbGF5IE9iamVjdCBDb250YWluZXJcbiAgICBleHRlbmQoUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLCBDaGFyYWN0ZXIpO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDaGFyYWN0ZXI7XG59KSgpOyIsIlxuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIHN1Yikge1xuICAgIC8vIEF2b2lkIGluc3RhbnRpYXRpbmcgdGhlIGJhc2UgY2xhc3MganVzdCB0byBzZXR1cCBpbmhlcml0YW5jZVxuICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvY3JlYXRlXG4gICAgLy8gZm9yIGEgcG9seWZpbGxcbiAgICAvLyBBbHNvLCBkbyBhIHJlY3Vyc2l2ZSBtZXJnZSBvZiB0d28gcHJvdG90eXBlcywgc28gd2UgZG9uJ3Qgb3ZlcndyaXRlXG4gICAgLy8gdGhlIGV4aXN0aW5nIHByb3RvdHlwZSwgYnV0IHN0aWxsIG1haW50YWluIHRoZSBpbmhlcml0YW5jZSBjaGFpblxuICAgIC8vIFRoYW5rcyB0byBAY2Nub2tlc1xuICAgIHZhciBvcmlnUHJvdG8gPSBzdWIucHJvdG90eXBlO1xuICAgIHN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2UucHJvdG90eXBlKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvcmlnUHJvdG8pICB7XG4gICAgICAgIHN1Yi5wcm90b3R5cGVba2V5XSA9IG9yaWdQcm90b1trZXldO1xuICAgIH1cblxuICAgIC8vIFJlbWVtYmVyIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB3YXMgc2V0IHdyb25nLCBsZXQncyBmaXggaXRcbiAgICBzdWIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViO1xuICAgIC8vIEluIEVDTUFTY3JpcHQ1KyAoYWxsIG1vZGVybiBicm93c2VycyksIHlvdSBjYW4gbWFrZSB0aGUgY29uc3RydWN0b3IgcHJvcGVydHlcbiAgICAvLyBub24tZW51bWVyYWJsZSBpZiB5b3UgZGVmaW5lIGl0IGxpa2UgdGhpcyBpbnN0ZWFkXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN1Yi5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzdWJcbiAgICB9KTtcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kOyIsIihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qXG4gICAgICogQ3VzdG9tIEVkaXRzIGZvciB0aGUgUElYSSBMaWJyYXJ5XG4gICAgICovXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFJlbGF0aXZlIFBvc2l0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dZID0gMDtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25YID0gZnVuY3Rpb24od2luZG93V2lkdGgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKHdpbmRvd1dpZHRoICogdGhpcy5fd2luZG93WCkgKyB0aGlzLl9idW1wWDtcbiAgICB9O1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWSA9IGZ1bmN0aW9uKHdpbmRvd0hlaWdodCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAod2luZG93SGVpZ2h0ICogdGhpcy5fd2luZG93WSkgKyB0aGlzLl9idW1wWTtcbiAgICB9O1xuXG4gICAgLy8gd2luZG93WCBhbmQgd2luZG93WSBhcmUgcHJvcGVydGllcyBhZGRlZCB0byBhbGwgUGl4aSBkaXNwbGF5IG9iamVjdHMgdGhhdFxuICAgIC8vIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgcG9zaXRpb24ueCBhbmQgcG9zaXRpb24ueVxuICAgIC8vIHRoZXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhIHZhbHVlIGJldHdlZW4gMCAmIDEgYW5kIHBvc2l0aW9uIHRoZSBkaXNwbGF5XG4gICAgLy8gb2JqZWN0IGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2luZG93IHdpZHRoICYgaGVpZ2h0IGluc3RlYWQgb2YgYSBmbGF0IHBpeGVsIHZhbHVlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1g7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1ggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKCR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1knLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBZID0gMDtcblxuICAgIC8vIGJ1bXBYIGFuZCBidW1wWSBhcmUgcHJvcGVydGllcyBvbiBhbGwgZGlzcGxheSBvYmplY3RzIHVzZWQgZm9yXG4gICAgLy8gc2hpZnRpbmcgdGhlIHBvc2l0aW9uaW5nIGJ5IGZsYXQgcGl4ZWwgdmFsdWVzLiBVc2VmdWwgZm9yIHN0dWZmXG4gICAgLy8gbGlrZSBob3ZlciBhbmltYXRpb25zIHdoaWxlIHN0aWxsIG1vdmluZyBhcm91bmQgYSBjaGFyYWN0ZXIuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKCR3aW5kb3cud2lkdGgoKSAqIHRoaXMuX3dpbmRvd1gpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAoJHdpbmRvdy5oZWlnaHQoKSAqIHRoaXMuX3dpbmRvd1kpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFNjYWxpbmcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbiAgICAvLyB3aW5kb3dTY2FsZSBjb3JyZXNwb25kcyB0byB3aW5kb3cgc2l6ZVxuICAgIC8vICAgZXg6IHdpbmRvd1NjYWxlID0gMC4yNSBtZWFucyAxLzQgc2l6ZSBvZiB3aW5kb3dcbiAgICAvLyBzY2FsZU1pbiBhbmQgc2NhbGVNYXggY29ycmVzcG9uZCB0byBuYXR1cmFsIHNwcml0ZSBzaXplXG4gICAgLy8gICBleDogc2NhbGVNaW4gPSAwLjUgbWVhbnMgc3ByaXRlIHdpbGwgbm90IHNocmluayB0byBtb3JlIHRoYW4gaGFsZiBvZiBpdHMgb3JpZ2luYWwgc2l6ZS5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dTY2FsZSA9IC0xO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNaW4gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNYXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVUeXBlID0gJ2NvbnRhaW4nO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlRm5jID0gTWF0aC5taW47XG5cbiAgICAvLyBXaW5kb3dTY2FsZTogdmFsdWUgYmV0d2VlbiAwICYgMSwgb3IgLTFcbiAgICAvLyBUaGlzIGRlZmluZXMgd2hhdCAlIG9mIHRoZSB3aW5kb3cgKGhlaWdodCBvciB3aWR0aCwgd2hpY2hldmVyIGlzIHNtYWxsZXIpXG4gICAgLy8gdGhlIG9iamVjdCB3aWxsIGJlIHNpemVkLiBFeGFtcGxlOiBhIHdpbmRvd1NjYWxlIG9mIDAuNSB3aWxsIHNpemUgdGhlIGRpc3BsYXlPYmplY3RcbiAgICAvLyB0byBoYWxmIHRoZSBzaXplIG9mIHRoZSB3aW5kb3cuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fd2luZG93U2NhbGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVHdvIHBvc3NpYmxlIHZhbHVlczogY29udGFpbiBvciBjb3Zlci4gVXNlZCB3aXRoIHdpbmRvd1NjYWxlIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHRha2UgdGhlXG4gICAgLy8gc21hbGxlciBib3VuZCAoY29udGFpbikgb3IgdGhlIGxhcmdlciBib3VuZCAoY292ZXIpIHdoZW4gZGVjaWRpbmcgY29udGVudCBzaXplIHJlbGF0aXZlIHRvIHNjcmVlbi5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3NjYWxlVHlwZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVR5cGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlVHlwZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zY2FsZUZuYyA9ICh2YWx1ZSA9PT0gJ2NvbnRhaW4nKSA/IE1hdGgubWluIDogTWF0aC5tYXg7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRTY2FsZSA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdmFyIGxvY2FsQm91bmRzID0gdGhpcy5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuX3dpbmRvd1NjYWxlICogdGhpcy5fc2NhbGVGbmMod2luZG93SGVpZ2h0L2xvY2FsQm91bmRzLmhlaWdodCwgd2luZG93V2lkdGgvbG9jYWxCb3VuZHMud2lkdGgpO1xuXG4gICAgICAgIC8va2VlcCBzY2FsZSB3aXRoaW4gb3VyIGRlZmluZWQgYm91bmRzXG4gICAgICAgIHNjYWxlID0gTWF0aC5tYXgodGhpcy5zY2FsZU1pbiwgTWF0aC5taW4oc2NhbGUsIHRoaXMuc2NhbGVNYXgpKTtcblxuXG4gICAgICAgIHRoaXMuc2NhbGUueCA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB0aGlzLnNjYWxlLnkgPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICB9O1xuXG5cbiAgICAvLyBVU0UgT05MWSBJRiBXSU5ET1dTQ0FMRSBJUyBBTFNPIFNFVFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWCA9IDE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVZID0gMTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogV2luZG93IFJlc2l6ZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIGZvciBlYWNoIGRpc3BsYXkgb2JqZWN0IG9uIHdpbmRvdyByZXNpemUsXG4gICAgLy8gYWRqdXN0aW5nIHRoZSBwaXhlbCBwb3NpdGlvbiB0byBtaXJyb3IgdGhlIHJlbGF0aXZlIHBvc2l0aW9ucyB3aW5kb3dYIGFuZCB3aW5kb3dZXG4gICAgLy8gYW5kIGFkanVzdGluZyBzY2FsZSBpZiBpdCdzIHNldFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX29uV2luZG93UmVzaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgod2lkdGgpO1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoaGVpZ2h0KTtcblxuICAgICAgICBpZih0aGlzLl93aW5kb3dTY2FsZSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmN0aW9uKGRpc3BsYXlPYmplY3QpIHtcbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3QuX29uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFNwcml0ZXNoZWV0IFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIHVzZWQgdG8gZ2V0IGluZGl2aWR1YWwgdGV4dHVyZXMgb2Ygc3ByaXRlc2hlZXQganNvbiBmaWxlc1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSBjYWxsOiBnZXRGaWxlTmFtZXMoJ2FuaW1hdGlvbl9pZGxlXycsIDEsIDEwNSk7XG4gICAgLy8gUmV0dXJuczogWydhbmltYXRpb25faWRsZV8wMDEucG5nJywgJ2FuaW1hdGlvbl9pZGxlXzAwMi5wbmcnLCAuLi4gLCAnYW5pbWF0aW9uX2lkbGVfMTA0LnBuZyddXG4gICAgLy9cbiAgICBmdW5jdGlvbiBnZXRGaWxlTmFtZXMoZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpIHtcbiAgICAgICAgdmFyIG51bURpZ2l0cyA9IChyYW5nZUVuZC0xKS50b1N0cmluZygpLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gXy5tYXAoXy5yYW5nZShyYW5nZVN0YXJ0LCByYW5nZUVuZCksIGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgdmFyIG51bVplcm9zID0gbnVtRGlnaXRzIC0gbnVtLnRvU3RyaW5nKCkubGVuZ3RoOyAgIC8vZXh0cmEgY2hhcmFjdGVyc1xuICAgICAgICAgICAgdmFyIHplcm9zID0gbmV3IEFycmF5KG51bVplcm9zICsgMSkuam9pbignMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsZVByZWZpeCArIHplcm9zICsgbnVtICsgJy5wbmcnO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBQSVhJLmdldFRleHR1cmVzID0gZnVuY3Rpb24oZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCksIFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUpO1xuICAgIH07XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBNZW1vcnkgQ2xlYW51cCAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oZGVzdHJveUJhc2VUZXh0dXJlKSB7XG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQoZGVzdHJveUJhc2VUZXh0dXJlKSkgZGVzdHJveUJhc2VUZXh0dXJlID0gdHJ1ZTtcblxuICAgICAgICBpZighXy5pc1VuZGVmaW5lZCh0aGlzLnBhcmVudCkpIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMudGV4dHVyZS5kZXN0cm95KGRlc3Ryb3lCYXNlVGV4dHVyZSk7XG4gICAgfTtcblxuICAgIFBJWEkuTW92aWVDbGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oZGVzdHJveUJhc2VUZXh0dXJlKSB7XG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQoZGVzdHJveUJhc2VUZXh0dXJlKSkgZGVzdHJveUJhc2VUZXh0dXJlID0gdHJ1ZTtcblxuICAgICAgICBpZighXy5pc1VuZGVmaW5lZCh0aGlzLnBhcmVudCkpIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuXG4gICAgICAgIF8uZWFjaCh0aGlzLnRleHR1cmVzLCBmdW5jdGlvbih0ZXh0dXJlKSB7XG4gICAgICAgICAgICB0ZXh0dXJlLmRlc3Ryb3koZGVzdHJveUJhc2VUZXh0dXJlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cblxuXG5cbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcbiAgICB2YXIgU2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJyk7XG5cbiAgICB2YXIgYWxsQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4vYWxsQ2hhcmFjdGVycycpO1xuXG4gICAgdmFyIGJhY2tncm91bmRNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JhY2tncm91bmQnKTtcbiAgICB2YXIgYmxhZGV3aXBlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9ibGFkZXdpcGUnKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG4gICAgdmFyIHBhcmFjaHV0ZXJzTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYXJhY2h1dGVycycpO1xuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiogUHJpbWFyeSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBNYWluU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgU2NlbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBhbGxDaGFyYWN0ZXJzLmluaXRpYWxpemUodGhpcyk7XG5cblxuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmluaXRpYWxpemUoKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRCYWNrZ3JvdW5kVG9TY2VuZSh0aGlzKTtcbiAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRSZXN0VG9TY2VuZSh0aGlzKTtcblxuICAgICAgICBibGFkZXdpcGVNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgfTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgTWFpblNjZW5lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgcGxheVdpcGVzY3JlZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLnBsYXlWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBvbldpcGVzY3JlZW5Db21wbGV0ZTpmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLm9uVmlkZW9Db21wbGV0ZShjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVXNlckNoYXJhY3Rlck91dDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5vbkFuaW1hdGlvbk91dENvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJsYWRld2lwZU1vZHVsZS5oaWRlVmlkZW8oKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnRFbnRlck5hbWVBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG5cbiAgICAgICAgICAgIHZhciBzdGFydFRpbWUgPSAyMDAwO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocGFyYWNodXRlcnNNb2R1bGUuYW5pbWF0ZU5leHQsIHN0YXJ0VGltZSArIDYwMDApO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgMTUwMDApO1xuICAgICAgICB9LFxuICAgICAgICBzaG93UmVzcG9uc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaGlkZSgpO1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVJblVzZXJDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmFuaW1hdGVJbigpO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlT3V0VXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBQYXJhbGxheCBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5zaGlmdEJhY2tncm91bmRMYXllcnMoeCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIH0sXG4gICAgICAgIF9vbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbiAgICAvLyBFeHRlbmRzIFNjZW5lIENsYXNzXG4gICAgZXh0ZW5kKFNjZW5lLCBNYWluU2NlbmUpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5TY2VuZTtcbn0pKCk7IiwiXG5cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxudmFyIFNjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNCID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgUElYSS5TdGFnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuU2NlbmUucHJvdG90eXBlID0ge1xuICAgIG9uVXBkYXRlOiBmdW5jdGlvbih1cGRhdGVDQikge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCID0gdXBkYXRlQ0I7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCKCk7XG4gICAgfSxcbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlc3VtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgfSxcbiAgICBpc1BhdXNlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlZDtcbiAgICB9XG59O1xuXG5cbmV4dGVuZChQSVhJLlN0YWdlLCBTY2VuZSk7XG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgU2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJyk7XG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIHZhciBTY2VuZXNNYW5hZ2VyID0ge1xuICAgICAgICBzY2VuZXM6IHt9LFxuICAgICAgICBjdXJyZW50U2NlbmU6IG51bGwsXG4gICAgICAgIHJlbmRlcmVyOiBudWxsLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCAkcGFyZW50RGl2KSB7XG5cbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyKSByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpZHRoLCBoZWlnaHQsIG51bGwsIHRydWUsIHRydWUpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcuc2V0QXR0cmlidXRlKCdpZCcsICdwaXhpLXZpZXcnKTtcbiAgICAgICAgICAgICRwYXJlbnREaXYuYXBwZW5kKFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldyk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKFNjZW5lc01hbmFnZXIubG9vcCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBsb29wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uICgpIHsgU2NlbmVzTWFuYWdlci5sb29wKCkgfSk7XG5cbiAgICAgICAgICAgIGlmICghU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgfHwgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUuaXNQYXVzZWQoKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS51cGRhdGUoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVuZGVyKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlU2NlbmU6IGZ1bmN0aW9uKGlkLCBTY2VuZUNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBTY2VuZUNvbnN0cnVjdG9yID0gU2NlbmVDb25zdHJ1Y3RvciB8fCBTY2VuZTsgICAvL2RlZmF1bHQgdG8gU2NlbmUgYmFzZSBjbGFzc1xuXG4gICAgICAgICAgICB2YXIgc2NlbmUgPSBuZXcgU2NlbmVDb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdID0gc2NlbmU7XG5cbiAgICAgICAgICAgIHJldHVybiBzY2VuZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ29Ub1NjZW5lOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkge1xuICAgICAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSkgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lID0gU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciByZXNpemUgdG8gbWFrZSBzdXJlIGFsbCBjaGlsZCBvYmplY3RzIGluIHRoZVxuICAgICAgICAgICAgICAgIC8vIG5ldyBzY2VuZSBhcmUgY29ycmVjdGx5IHBvc2l0aW9uZWRcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXN1bWUgbmV3IHNjZW5lXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucmVzdW1lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgc2VsZj10aGlzO1xuXG5mdW5jdGlvbiBwcm9ncmFtMShkZXB0aDAsZGF0YSxkZXB0aDEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJlbXB0eS1zcGFjZVxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEubmFtZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIiB2YWx1ZT1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgaWQ9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcImZ1bGwtcmVsYXRpdmVcXFwiPjwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGV4dFxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnRleHQpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudGV4dCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJib3gtc2hhZG93XFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImNvcHlcXFwiPlxcbiAgICAgICAgXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmNvcHkpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuY29weSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcIm9wdGlvbnMgY2xlYXJmaXhcXFwiPlxcbiAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAub3B0aW9ucyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbVdpdGhEZXB0aCgxLCBwcm9ncmFtMSwgZGF0YSwgZGVwdGgwKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIHZhciBzY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vcGl4aS9zY2VuZXNNYW5hZ2VyJyk7XG4gICAgdmFyIGR1c3R5RGlwcGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9kdXN0eURpcHBlcicpO1xuXG5cbiAgICBmdW5jdGlvbiBnZXRDbGlwYm9hcmRUZXh0KGUpIHtcbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQoZS5vcmlnaW5hbEV2ZW50KSkgZSA9IGUub3JpZ2luYWxFdmVudDtcblxuICAgICAgICBpZiAod2luZG93LmNsaXBib2FyZERhdGEgJiYgd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSkgeyAvLyBJRVxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5jbGlwYm9hcmREYXRhLmdldERhdGEoJ1RleHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBlLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdkaXYubmFtZS5wYWdlJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2hhbmdlIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXlkb3duIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXl1cCBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZScsXG4gICAgICAgICAgICAncGFzdGUgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKHt2YWx1ZTogJyd9KTtcblxuICAgICAgICAgICAgdGhpcy4kbmFtZUlucHV0ID0gdGhpcy4kZWwuZmluZCgnaW5wdXRbdHlwZT10ZXh0XS5uYW1lJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5wbGFjZWhvbGRlcicpO1xuICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXJJbm5lciA9IHRoaXMuJHBsYWNlaG9sZGVyLmZpbmQoJz4gZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZSA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi50aXRsZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgICAgXy5iaW5kQWxsKHRoaXMsICdzdGFydEFuaW1hdGlvbicsJ3Nob3cnLCdoaWRlJywnc2V0SW5hY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFNjZW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLnNjZW5lcy5tYWluO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBSdW4gQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0QW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJlQW5pbWF0aW9uU2V0dXAoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc3RhcnRFbnRlck5hbWVBbmltYXRpb24oKTsgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyc1xuXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuMztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHRpdGxlLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMSwgeTogMCwgZWFzZTogJ0JhY2suZWFzZU91dCd9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRuYW1lSW5wdXQsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGxhY2Vob2xkZXJJbm5lciwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnLCBkZWxheTogMC4xNX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByZUFuaW1hdGlvblNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kdGl0bGUsIHtvcGFjaXR5OiAwLCB5OiAtNzV9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kbmFtZUlucHV0LCB7b3BhY2l0eTogMH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRwbGFjZWhvbGRlcklubmVyLCB7b3BhY2l0eTogMCwgeTogLTUwfSk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIFNob3cvSGlkZSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zdGFydEFuaW1hdGlvbiwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUodGhpcy5zZXRJbmFjdGl2ZSk7XG5cbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kZWwsIDAuMywge29wYWNpdHk6IDB9KTtcblxuICAgICAgICAgICAgICAgIC8vcnVuIGhpZGUgYW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluYWN0aXZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25OYW1lQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZihlLndoaWNoID09PSAzMikgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy4kbmFtZUlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICBpZihlLnR5cGUgPT09ICdwYXN0ZScpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGdldENsaXBib2FyZFRleHQoZSk7XG5cbiAgICAgICAgICAgICAgICB2YWwgKz0gdGV4dC5zcGxpdCgnICcpLmpvaW4oJycpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kbmFtZUlucHV0LnZhbCh2YWwpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kcGxhY2Vob2xkZXIudG9nZ2xlKHZhbCA9PT0gJycpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyLnRvZ2dsZSh2YWwgPT09ICcnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRlck5hbWVWaWV3O1xufSkoKTtcbiIsIlxuXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBGb290ZXJWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNmb290ZXInLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLnZvbHVtZSc6ICdvblZvbHVtZVRvZ2dsZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubnVtRG90cyA9IG9wdGlvbnMubnVtRG90cztcblxuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFZvbHVtZUFuaW1hdGlvblRpbWVsaW5lcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Q291bnRlcigpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMgPSB0aGlzLiRlbC5maW5kKCdhLnZvbHVtZSBwYXRoJyk7XG4gICAgICAgICAgICB0aGlzLiRjb3VudGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LmNvdW50ZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT24oKTtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uID0gdGhpcy5nZXRUaW1lbGluZVZvbHVtZU9mZigpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0Q291bnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbnVtRG90cyA9IHRoaXMubnVtRG90cztcblxuICAgICAgICAgICAgdmFyICRkb3QgPSB0aGlzLiRkb3RzLmVxKDApO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAyOyBpIDw9IG51bURvdHM7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciAkbmV3RG90ID0gJGRvdC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuZmluZCgnPiBkaXYubnVtYmVyJykuaHRtbChpKTtcbiAgICAgICAgICAgICAgICAkbmV3RG90LmFwcGVuZFRvKHRoaXMuJGNvdW50ZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiRkb3RzID0gdGhpcy4kY291bnRlci5maW5kKCc+IC5kb3QnKTtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdCA9ICRkb3Q7XG4gICAgICAgICAgICAkZG90LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiogVm9sdW1lIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHRvZ2dsZVZvbHVtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uID0gIXRoaXMudm9sdW1lT247XG5cbiAgICAgICAgICAgIGlmKHRoaXMudm9sdW1lT24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZvbHVtZU9uQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNyZWF0ZWpzLlNvdW5kLnNldE11dGUodGhpcy52b2x1bWVPbik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVuZE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZWFzaW5nOiAnQmFjay5lYXNlT3V0Jywgb3BhY2l0eTogMX07XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAuNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVuZE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlYXNpbmc6ICdCYWNrLmVhc2VJbicsIG9wYWNpdHk6IDB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgb25cbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoMSwwLDAsMSwwLDApJyk7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5jc3MoJ29wYWNpdHknLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAuNSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkU3ZnUGF0aEFuaW1hdGlvbjogZnVuY3Rpb24odGltZWxpbmUsICRwYXRoLCBzdGFydFRpbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBhbmltYXRpb25TcGVlZCA9IDAuMjtcblxuICAgICAgICAgICAgdmFyIHBhdGhNYXRyaXggPSBfLmNsb25lKG9wdGlvbnMuc3RhcnRNYXRyaXgpO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5BdHRycyA9IHtcbiAgICAgICAgICAgICAgICBlYXNlOiBvcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXRoLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoJyArIHBhdGhNYXRyaXguam9pbignLCcpICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0d2VlbkF0dHJzLCBvcHRpb25zLmVuZE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oJHBhdGgsIGFuaW1hdGlvblNwZWVkLCB7b3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5fSksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8ocGF0aE1hdHJpeCwgYW5pbWF0aW9uU3BlZWQsIHR3ZWVuQXR0cnMpLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBDb3VudGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNldENvdW50ZXI6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMuZXEoaSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gdGhpcy4kZG90cy5lcShpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kY291bnRlci5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnNob3coKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGVsLm91dGVySGVpZ2h0KCkgKyB0aGlzLiRjb3VudGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvblZvbHVtZVRvZ2dsZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVZvbHVtZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gRm9vdGVyVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vZGV2aWNlJyk7XG5cbiAgICBpZighZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgdmFyIGludHJvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRybycpO1xuICAgIH1cblxuICAgIHZhciBJbnRyb1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2ludHJvLXZpZXcnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLmJlZ2luJzogJ29uQmVnaW5DbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uVGltZWxpbmUoKTtcblxuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luU2NyZWVuID0gdGhpcy4kZWwuZmluZCgnZGl2LmJlZ2luLXNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5MaW5lcyA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2Rpdi5saW5lJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkJ0biA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2EuYmVnaW4nKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEFuaW1hdGlvblRpbWVsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldE1vYmlsZVRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRNb2JpbGVUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldFRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93QmVnaW5TY3JlZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW47XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoXy5iaW5kKHRpbWVsaW5lLnBsYXksIHRpbWVsaW5lKSwgMjAwKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGdldE1vYmlsZVRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luTGluZXMsIHt4OiAwLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge29wYWNpdHk6IDF9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5WaWV3LnNob3dDb250ZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQmFjay5lYXNlT3V0JztcblxuICAgICAgICAgICAgdmFyIHR3ZWVucyA9IF8ubWFwKHRoaXMuJGJlZ2luTGluZXMsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGxpbmUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHdlZW5zOiB0d2VlbnMsXG4gICAgICAgICAgICAgICAgc3RhZ2dlcjogMC4wOCxcbiAgICAgICAgICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuN1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4uc2hvdygpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBidG5JblRpbWUgPSAwLjQ7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIHNjYWxlWDogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSArIChhbmltYXRpb25UaW1lICogMC4wNSkpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaW50cm9Nb2R1bGUuc2hvd0xvZ28oKTtcbiAgICAgICAgICAgIH0sIDAuNjUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TW9iaWxlVGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9GcmFtZXMgPSBpbnRyb01vZHVsZS5nZXRJbnRyb0ZyYW1lcygpO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKiBUaW1lbGluZSAqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5vbkFuaW1hdGlvbkZpbmlzaGVkLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGVTY29wZTogdGhpc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luU2NyZWVuLCBhbmltYXRpb25UaW1lLzQsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMudG9wLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oaW50cm9GcmFtZXMuYnRtLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0TWFpblZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcgPSB2aWV3O1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMubWFpblZpZXcuc2hvd0NvbnRlbnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBIZWxwZXJzIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcicpO1xuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gUElYSSBTY2VuZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgTWFpblNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9tYWluU2NlbmUnKTtcbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENvbGxlY3Rpb25zIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBWaWV3cyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgSW50cm9WaWV3ID0gcmVxdWlyZSgnLi9pbnRyb1ZpZXcnKTtcbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IHJlcXVpcmUoJy4vZW50ZXJOYW1lVmlldycpO1xuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gcmVxdWlyZSgnLi9zZWxlY3RDaGFyYWN0ZXJWaWV3Jyk7XG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IHJlcXVpcmUoJy4vcmVzcG9uc2VWaWV3Jyk7XG4gICAgdmFyIEZvb3RlclZpZXcgPSByZXF1aXJlKCcuL2Zvb3RlclZpZXcnKTtcblxuICAgIHZhciBpc01vYmlsZSA9IGRldmljZS5pc01vYmlsZSgpO1xuXG4gICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBpbnRyb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm8nKTtcbiAgICB9XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIE1haW52aWV3IENsYXNzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVzKHZpZXdzKSB7XG4gICAgICAgIHJldHVybiBfLm1hcCh2aWV3cywgZnVuY3Rpb24odmlldykge3JldHVybiB2aWV3Lm1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7IH0pO1xuICAgIH1cblxuICAgIHZhciBNYWluVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgcGFnZXM6IFtdLFxuICAgICAgICBhY3RpdmVQYWdlSW5kZXg6IDAsXG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdjbGljayBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25Bc3NldFByb2dyZXNzOiBmdW5jdGlvbihwZXJjZW50YWdlTG9hZGVkLCB0aW1lRWxhcHNlZCkge1xuICAgICAgICAgICAgaW50cm9Nb2R1bGUudXBkYXRlTG9hZGVyKHBlcmNlbnRhZ2VMb2FkZWQsIHRpbWVFbGFwc2VkKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Bc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBNYWluU2NlbmUpO1xuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICBpbnRyb01vZHVsZS5vbkNvbXBsZXRlKHRoaXMuaW50cm9WaWV3LnNob3dCZWdpblNjcmVlbi5iaW5kKHRoaXMuaW50cm9WaWV3KSk7XG4gICAgICAgICAgICBpbnRyb01vZHVsZS5hc3NldHNMb2FkZWQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKGludHJvTW9kdWxlKSlcbiAgICAgICAgICAgICAgICBpbnRyb01vZHVsZS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgIGlmKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ21vYmlsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcjYXNzZXRMb2FkZXInKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG5cbiAgICAgICAgICAgIGlmKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vY3JlYXRlIGNhbnZhcyBlbGVtZW50XG4gICAgICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5pbml0aWFsaXplKHRoaXMuJHdpbmRvdy53aWR0aCgpLCB0aGlzLiR3aW5kb3cuaGVpZ2h0KCksIHRoaXMuJGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0V2luZG93RXZlbnRzKCk7XG5cbiAgICAgICAgICAgIC8vc2V0dXAgb3B0aW9ucyBmb3IgZmlyc3QgY2FubmVkIHZpZXdcbiAgICAgICAgICAgIHRoaXMuY2FubmVkVmlld3MgPSBfLmZpbHRlcih0aGlzLnBhZ2VzLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UubW9kZWwuYXR0cmlidXRlcy5jbGFzcyA9PT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlQ29udGVudCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRXaW5kb3dFdmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kd2luZG93Lm9uKCdyZXNpemUnLCBfLmJpbmQodGhpcy5yZXBvc2l0aW9uUGFnZU5hdiwgdGhpcykpO1xuXG4vLyAgICAgICAgICAgIGlmICh3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW9yaWVudGF0aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvcmllbnRhdGlvbicsIGV2ZW50LmJldGEsIGV2ZW50LmdhbW1hKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW1vdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3Rpb24nLCBldmVudC5hY2NlbGVyYXRpb24ueCAqIDIsIGV2ZW50LmFjY2VsZXJhdGlvbi55ICogMik7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3ogb3JpZW50YXRpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIk1vek9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKG9yaWVudGF0aW9uKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veicsIG9yaWVudGF0aW9uLnggKiA1MCwgb3JpZW50YXRpb24ueSAqIDUwKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEludHJvVmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9WaWV3ID0gbmV3IEludHJvVmlldygpO1xuXG4gICAgICAgICAgICBpbnRyb1ZpZXcuc2V0TWFpblZpZXcodGhpcyk7XG4gICAgICAgICAgICBpbnRyb1ZpZXcub25Db21wbGV0ZShfLmJpbmQodGhpcy5zaG93Rmlyc3RQYWdlLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW50cm9WaWV3ID0gaW50cm9WaWV3O1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRQYWdlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2hhck1vZGVsID0gXy5maXJzdChhbGxRdWVzdGlvbnMubW9kZWxzKTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbk1vZGVscyA9IF8ucmVzdChhbGxRdWVzdGlvbnMubW9kZWxzKTtcblxuICAgICAgICAgICAgdmFyIGVudGVyTmFtZVZpZXcgPSBuZXcgRW50ZXJOYW1lVmlldygpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdENoYXJWaWV3ID0gbmV3IFNlbGVjdENoYXJhY3RlclZpZXcoe21vZGVsOiBjaGFyTW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcblxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uVmlld3MgPSBfLm1hcChxdWVzdGlvbk1vZGVscywgZnVuY3Rpb24ocXVlc3Rpb25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVlc3Rpb25WaWV3KHttb2RlbDogcXVlc3Rpb25Nb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMucGFnZXMgPSBbZW50ZXJOYW1lVmlldywgc2VsZWN0Q2hhclZpZXddLmNvbmNhdChxdWVzdGlvblZpZXdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBhZ2VzLWN0bicpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2ID0gdGhpcy4kcGFnZXNDb250YWluZXIuZmluZCgnZGl2LnBhZ2UtbmF2Jyk7XG4gICAgICAgICAgICB0aGlzLiRuZXh0ID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLm5leHQnKTtcbiAgICAgICAgICAgIHRoaXMuJGZpbmlzaFNlbmQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EuZmluaXNoLXNlbmQnKTtcblxuICAgICAgICAgICAgdGhpcy4kc2tpcCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5za2lwJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGhlYWRlciA9ICQoJyNoZWFkZXInKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBDYW5uZWQgUXVlc3Rpb24gVmlldyBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICB1cGRhdGVWaWV3T3B0aW9uc1dpdGhVbnVzZWQ6IGZ1bmN0aW9uKGNhbm5lZFZpZXcpIHtcbiAgICAgICAgICAgIHZhciB1c2VkT3B0aW9ucyA9IF8uY29tcGFjdChnZXRWYWx1ZXModGhpcy5jYW5uZWRWaWV3cykpO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGFsbFF1ZXN0aW9ucy5nZXRVbnVzZWRDYW5uZWRPcHRpb25zKDMsIHVzZWRPcHRpb25zKTtcblxuICAgICAgICAgICAgY2FubmVkVmlldy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBDaGFuZ2UgVmlldyBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93Rmlyc3RQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZXNbMF0uc2hvdygpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygnb3BhY2l0eScsIDApO1xuICAgICAgICAgICAgdGhpcy4kbmV4dC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLiRza2lwLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdihmYWxzZSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwYWdlTmF2LCAwLjMsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dFBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgLy9oaWRlIGFjdGl2ZSBwYWdlXG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleCArIDFdO1xuXG4gICAgICAgICAgICBpZihuZXh0UGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3T3B0aW9uc1dpdGhVbnVzZWQobmV4dFBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgaWYoIWFjdGl2ZVBhZ2UuaXNDYW5uZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dTa2lwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVTa2lwKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID09PSAxICYmICFpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vYW5pbWF0ZSBpbiBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVJblVzZXJDaGFyYWN0ZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWN0aXZlUGFnZS5vbkhpZGVDb21wbGV0ZSh0aGlzLnNob3dQYWdlQWZ0ZXJIaWRlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVBhZ2VJbmRleCsrO1xuICAgICAgICAgICAgYWN0aXZlUGFnZS5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnJlcG9zaXRpb25QYWdlTmF2KHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5zZXRDb3VudGVyKHRoaXMuYWN0aXZlUGFnZUluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1BhZ2VBZnRlckhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxhc3RQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleC0xXTtcbiAgICAgICAgICAgIGlmKGxhc3RQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICBsYXN0UGFnZS5yZW1vdmVPcHRpb25zKCk7ICAgLy9jYW5uZWQgb3B0aW9ucyBhcmUgcmVwZWF0ZWQgYW5kIHNoYXJlIHRoZSBzYW1lIElEXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2hvdyBuZXh0IHBhZ2VcbiAgICAgICAgICAgIHZhciBuZXh0UGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICBuZXh0UGFnZS5vblNob3dDb21wbGV0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIG5leHRQYWdlLnNob3coKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPT09IHRoaXMucGFnZXMubGVuZ3RoLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dGaW5pc2hCdG4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVTa2lwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dGaW5pc2hCdG46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kbmV4dC5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRmaW5pc2hTZW5kLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hBbmRTZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLmhpZGVDb3VudGVyKCk7XG5cbiAgICAgICAgICAgIHZhciBwYWdlTW9kZWxzID0gXy5tYXAodGhpcy5wYWdlcywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLm1vZGVsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldy5zZXRSZXNwb25zZShwYWdlTW9kZWxzKTtcblxuICAgICAgICAgICAgaWYoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vblVzZXJDaGFyYWN0ZXJPdXQoXy5iaW5kKHRoaXMuc2NlbmUucGxheVdpcGVzY3JlZW4sIHRoaXMuc2NlbmUpKTtcblxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vbldpcGVzY3JlZW5Db21wbGV0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUucmVzcG9uc2VWaWV3LnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2NlbmUuc2hvd1Jlc3BvbnNlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJyNtb2JpbGUtYmFja2dyb3VuZHMnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldy5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlcG9zaXRpb25QYWdlTmF2OiBmdW5jdGlvbihhbmltYXRlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgcGl4ZWxQb3NpdGlvbiA9IChhY3RpdmVQYWdlLiRlbC5vZmZzZXQoKS50b3AgKyBhY3RpdmVQYWdlLiRlbC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IHRoaXMuJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgICAgICAgICAgdmFyIHRvcEZyYWMgPSBNYXRoLm1pbihwaXhlbFBvc2l0aW9uL3dpbmRvd0hlaWdodCwgKHdpbmRvd0hlaWdodCAtIHRoaXMuZm9vdGVyLmhlaWdodCgpIC0gdGhpcy4kcGFnZU5hdi5vdXRlckhlaWdodCgpKS93aW5kb3dIZWlnaHQpO1xuXG4gICAgICAgICAgICB2YXIgcGVyY1RvcCA9IDEwMCAqIHRvcEZyYWMgKyAnJSc7XG5cbiAgICAgICAgICAgIGlmKCEhYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwYWdlTmF2LCAwLjIsIHt0b3A6IHBlcmNUb3AsIGVhc2U6J1F1YWQuZWFzZUluT3V0J30pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYuY3NzKCd0b3AnLCBwZXJjVG9wKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIGhpZGVTa2lwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRza2lwLCAwLjIsIHtib3R0b206ICcxMDAlJywgb3BhY2l0eTogMH0pO1xuICAgICAgICB9LFxuICAgICAgICBzaG93U2tpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kc2tpcCwgMC4yLCB7Ym90dG9tOiAwLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLnNob3coKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgbG9hZGVyLnN0YXJ0KHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludHJvVmlldy5zaG93QmVnaW5TY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbk5leHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hbmltYXRpbmdcbiAgICAgICAgICAgICAgICB8fCB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XS5tb2RlbC5hdHRyaWJ1dGVzLnZhbHVlID09PSAnJ1xuICAgICAgICAgICAgICAgIHx8IHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hbmltYXRpbmcpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5maW5pc2hBbmRTZW5kKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VNb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5zY2VuZSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaGlmdEJhY2tncm91bmRMYXllcnMoZS5wYWdlWC90aGlzLiR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2tpcDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZyB8fCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA+PSAodGhpcy5wYWdlcy5sZW5ndGggLSAxKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5WaWV3O1xuXG5cblxufSkoKTsiLCJcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcblxudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3F1ZXN0aW9uLmhicycpO1xudmFyIGl0ZW1BbmltYXRpb25zTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYWdlSXRlbXMnKTtcblxudmFyIGlzTW9iaWxlID0gZGV2aWNlLmlzTW9iaWxlKCk7XG5cbnZhciBRdWVzdGlvblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgLy8gVmFyaWFibGVzXG4gICAgc2hvd0NhbGxiYWNrOiBmdW5jdGlvbigpe30sXG4gICAgaGlkZUNhbGxiYWNrOiBmdW5jdGlvbigpe30sXG4gICAgY2xhc3NOYW1lOiAncXVlc3Rpb24gcGFnZScsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBpbnB1dFt0eXBlPXJhZGlvXSc6ICdvblJhZGlvQ2hhbmdlJ1xuICAgIH0sXG4gICAgLy8gRnVuY3Rpb25zXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIG9wdGlvbnMucGFyZW50LmFwcGVuZCh0aGlzLmVsKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuXG4gICAgICAgIHRoaXMuJG9wdGlvbnMgPSB0aGlzLiRlbC5maW5kKCdkaXYub3B0aW9uJyk7XG5cbiAgICAgICAgaWYodGhpcy4kb3B0aW9ucy5sZW5ndGggIT09IDAgJiYgIWlzTW9iaWxlKVxuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucygpO1xuICAgIH0sXG4gICAgaW5pdEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgYW5pbWF0aW9ucztcblxuICAgICAgICBpZih0aGlzLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21DYW5uZWRBbmltYXRpb25zKHRoaXMuJG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IGl0ZW1BbmltYXRpb25zTW9kdWxlLmdldFJhbmRvbVBlcnNvbmFsaXR5QW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSW4gPSBhbmltYXRpb25zWzBdO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dCA9IGFuaW1hdGlvbnNbMV07XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25Jbi52YXJzLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0NhbGxiYWNrKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC52YXJzLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH0sXG5cbiAgICByZW1vdmVPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucy5yZW1vdmUoKTtcbiAgICB9LFxuICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ29wdGlvbnMnLCBvcHRpb25zKTtcblxuICAgICAgICAvL3JlaW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuXG4gICAgICAgIGlmKCFpc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MgPT09ICdjYW5uZWQnO1xuICAgIH0sXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmVsLmlubmVySFRNTCA9PT0gJycpXG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIGlmKCFkZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Jbi5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIWRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBvblNob3dDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciB0ZXh0ID0gJChlLmN1cnJlbnRUYXJnZXQpLnNpYmxpbmdzKCdkaXYudGV4dCcpLmh0bWwoKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7dmFsdWU6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyksIHRleHQ6IHRleHR9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIHJlc3BvbnNlTWFwID0gcmVxdWlyZSgnLi4vZGF0YS9yZXNwb25zZU1hcC5qc29uJyk7XG5cbiAgICB2YXIgcmVzcG9uc2VNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3Jlc3BvbnNlTW9kdWxlJyk7XG5cblxuICAgIHZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9kZXZpY2UnKTtcbiAgICB2YXIgaXNNb2JpbGUgPSBkZXZpY2UuaXNNb2JpbGUoKTtcbiAgICB2YXIgcHJpbnRDaGFyYWN0ZXIgPSAnJztcblxuICAgIHZhciBSZXNwb25zZVZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGNoYXJhY3RlcjogJycsXG4gICAgICAgIGVsOiAnI3Jlc3BvbnNlJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYSNwcmludHZlcnNpb24nOiAncHJpbnQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kID0gJCgnI3Jlc3BvbnNlLWJnJyk7XG4gICAgICAgICAgICB0aGlzLiRsZXR0ZXJCYWNrZ3JvdW5kID0gJCgnI2xldHRlcmJnJyk7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBzZXRSZXNwb25zZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSAobW9kZWxzWzBdLmF0dHJpYnV0ZXMudmFsdWUgPT0gJycpID8gJ0ZyaWVuZCcgOiBtb2RlbHNbMF0uYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXJNb2RlbCA9IG1vZGVsc1sxXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5hZGRDbGFzcyhjaGFyYWN0ZXJNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcbiAgICAgICAgICAgIHByaW50Q2hhcmFjdGVyID0gY2hhcmFjdGVyTW9kZWwuYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJlZFF1ZXN0aW9ucyA9IF8uZmlsdGVyKF8ucmVzdChtb2RlbHMsIDIpLCBmdW5jdGlvbihtb2RlbCkge3JldHVybiBtb2RlbC5hdHRyaWJ1dGVzLnZhbHVlICE9PSAnJ30pO1xuXG4gICAgICAgICAgICB2YXIgcGFydGl0aW9uZWRRdWVzdGlvbnMgPSBfLnBhcnRpdGlvbihhbnN3ZXJlZFF1ZXN0aW9ucywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWwuYXR0cmlidXRlcy5jbGFzcyAhPT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5TW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbnNbMF07XG4gICAgICAgICAgICB2YXIgY2FubmVkTW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbnNbMV07XG5cblxuICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IGNoYXJhY3Rlck1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXI7XG5cbiAgICAgICAgICAgIC8vICoqKioqKioqIHNvcnQgaGVyZSAqKioqKioqKlxuICAgICAgICAgICAgdmFyIGNhbm5lZE9yZGVyID0ge1xuICAgICAgICAgICAgICBqb2I6IDAsXG4gICAgICAgICAgICAgIGZvcmVzdGZpcmVzOiAxLFxuICAgICAgICAgICAgICBmaXJlZmlnaHRlcjogMixcbiAgICAgICAgICAgICAgYmVzdGZyaWVuZDogMyxcbiAgICAgICAgICAgICAgZmF2b3JpdGVwbGFjZTogNFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5T3JkZXIgPSB7XG4gICAgICAgICAgICAgIGZvb2Q6IDAsXG4gICAgICAgICAgICAgIGNvbG9yOiAxLFxuICAgICAgICAgICAgICBhbmltYWw6IDJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBzb3J0ZWRDYW5uZWRNb2RlbHMgPSBfLnNvcnRCeShjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKXtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbm5lZE9yZGVyW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYW5uZWRNb2RlbHMgPSBzb3J0ZWRDYW5uZWRNb2RlbHM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzb3J0ZWRQZXJzb25hbGl0eU1vZGVscyA9IF8uc29ydEJ5KHBlcnNvbmFsaXR5TW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7XG4gICAgICAgICAgICAgIHJldHVybiBwZXJzb25hbGl0eU9yZGVyW21vZGVsLmF0dHJpYnV0ZXMubmFtZV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcGVyc29uYWxpdHlNb2RlbHMgPSBzb3J0ZWRQZXJzb25hbGl0eU1vZGVscztcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlSZXNwb25zZXMgPSBfLm1hcChwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuYXR0cmlidXRlcy5uYW1lXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgbW9kZWwuYXR0cmlidXRlcy50ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY2FubmVkUmVzcG9uc2VzID0gXy5tYXAoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgdmFyIGdyZWV0aW5nID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnZ3JlZXRpbmcnXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgdXNlck5hbWUpO1xuICAgICAgICAgICAgdmFyIGJvZHkxID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnYm9keTEnXTtcbiAgICAgICAgICAgIHZhciBib2R5MiA9IHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bJ2JvZHkyJ10ucmVwbGFjZSgnJXRlbXBsYXRlJScsIHVzZXJOYW1lKTs7XG4gICAgICAgICAgICB2YXIgc2luY2VyZWx5ID0gcmVzcG9uc2VNYXBbY2hhcmFjdGVyXVsnc2luY2VyZWx5J10gK1wiLCBcIjtcblxuXG4gICAgICAgICAgICByZXNwb25zZSArPSBib2R5MSArICcgJyArIGNhbm5lZFJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBwZXJzb25hbGl0eVJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBib2R5MjtcblxuICAgICAgICAgICAgJCgnI2NhcmQtZ3JlZXRpbmcnKS5odG1sKGdyZWV0aW5nKTtcbiAgICAgICAgICAgICQoJyNjYXJkLWJvZHknKS5odG1sKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoJyNjYXJkLXNpbmNlcmVseScpLmh0bWwoc2luY2VyZWx5KTtcbiAgICAgICAgICAgICQoJyNjYXJkLWZyb20nKS5odG1sKGNoYXJhY3Rlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJGxldHRlckJhY2tncm91bmQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBpZighaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZU1vZHVsZS5hbmltYXRlSW4odGhpcy5jaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIHByaW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvLyB3aW5kb3cucHJpbnQoKTtcblxuICAgICAgICAgICAgdmFyIGcgPSAkKCcjY2FyZC1ncmVldGluZycpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBiID0gJCgnI2NhcmQtYm9keScpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBzID0gJCgnI2NhcmQtc2luY2VyZWx5JykuaHRtbCgpO1xuICAgICAgICAgICAgdmFyIGYgPSAkKCcjY2FyZC1mcm9tJykuaHRtbCgpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4od2luZG93LmxvY2F0aW9uLmhyZWYgKyAncHJpbnQucGhwJyArICc/Y2hhcj0nICsgcHJpbnRDaGFyYWN0ZXIgKyAnJmdyZWV0aW5nPScrIGcgKyAnJmJvZHk9JyArIGIgKyAnJnNpbmNlcmVseT0nICsgcyArICcmZnJvbT0nICsgZik7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zZVZpZXc7XG59KSgpOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgYXVkaW9Bc3NldHMgPSByZXF1aXJlKCcuLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIHZhciBjaGFyYWN0ZXJBdWRpb0lkcyA9IGF1ZGlvQXNzZXRzLmNoYXJhY3RlckF1ZGlvSWRzO1xuXG4gICAgdmFyIFNlbGVjdENoYXJhY3RlclZpZXcgPSBRdWVzdGlvblZpZXcuZXh0ZW5kKHtcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAvL3BhcmVudCBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25SYWRpb0NoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5vblJhZGlvQ2hhbmdlLmNhbGwodGhpcywgZSk7XG5cbiAgICAgICAgICAgIHZhciBjaGFyID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKTtcblxuICAgICAgICAgICAgY3JlYXRlanMuU291bmQucGxheShjaGFyYWN0ZXJBdWRpb0lkc1tjaGFyXSk7XG5cbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5zZXRDaGFyYWN0ZXIoY2hhcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
