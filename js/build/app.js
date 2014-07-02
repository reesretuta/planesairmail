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
},{"../pixi/character":19,"./placeJustOffscreen":8}],4:[function(require,module,exports){


"use strict";

var Character = require('../pixi/character');
var placeJustOffscreen = require('./placeJustOffscreen');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var dusty, dipper, timelineIn, timelineOut;


// =================================================================== //
/* ************************ Helper Functions ************************* */
// =================================================================== //
function getDustyIdleTextures() {
    return PIXI.getTextures('assets/spritesheets/dusty/two/Dusty_plane_light_000', 0, 12);
}
function getDipperIdleTextures() {
    return PIXI.getTextures('assets/spritesheets/dipper/Dipper_000', 0, 12);
}

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
    var dusty = new Character('Dusty');

    var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());

    dustyIdleAnimation.anchor = {x: 641/1200, y: 340/638};

    dusty.setIdleState(dustyIdleAnimation);

    dusty.windowScale = 0.47;
    dusty.windowX = 0.18;
    dusty.windowY = -1;

    var blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 0;

    dusty.filters = [blurFilter];

    return dusty;
}

function initializeDipper() {
    var dipper = new Character('Dipper');

    var dipperIdleState = new PIXI.MovieClip(getDipperIdleTextures());

    dipperIdleState.scale.x = -1;
    dipperIdleState.anchor = {
        x: 571/1200,
        y: 410/638
    };

    dipper.setIdleState(dipperIdleState);

    dipper.windowX = 0.75;
    dipper.windowY = -1;
    dipper.rotation = -0.40;

    dipper.windowScale = 865/1366;
    dipper.animationScaleX = 0.7;
    dipper.animationScaleY = 0.7;

    var blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 10;

    dipper.filters = [blurFilter];

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

    var ogAttributes = _.pick(dusty, 'windowX', 'windowScale');

    var timeline = new TimelineMax({
        paused: true,
        onStart: function() {
            placeJustOffscreen(dusty);
            _.extend(dusty, ogAttributes);
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

    var ogAttributes = _.pick(dipper, 'windowX', 'rotation', 'windowScale', 'animationScaleX', 'animationScaleY');

    var blurFilter = dipper.filters[0];

    var timeline = new TimelineMax({
        paused: true,
        onStart: function() {
            placeJustOffscreen(dipper);
            _.extend(dipper, ogAttributes);
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
    timeline.add(TweenLite.to(dipper, animationTime + sweepStartTime, {
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
//            dipper.destroy(false);
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

    timeline.add(TweenLite.to(dipper, animationTime, {
        animationScaleX: 1.4,
        animationScaleY: 1.4,
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

    timeline.add(TweenLite.to(dusty, animationTime, {
        animationScaleX: 1.3,
        animationScaleY: 1.3,
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

        scene.addChild(dipper);
        scene.addChild(dusty);
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
},{"../pixi/character":19,"./placeJustOffscreen":8}],5:[function(require,module,exports){




"use strict";


function getIntroTextures() {
    return PIXI.getTextures('assets/introVideo/PLANES2_760x428_00', 0, 122);
}

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var video, videoTimeline;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //

function initialize() {
    video = initializeVideo();
    videoTimeline = initializeVideoTimeline(video);
}

function initializeVideo(scene) {
    var introVideo = new PIXI.MovieClip(getIntroTextures());

    introVideo.windowX = 0.5;
    introVideo.windowY = 0.5;
    introVideo.anchor = new PIXI.Point(0.5, 0.5);

    introVideo.visible = false;
    introVideo.loop = false;

    introVideo.scaleMin = 1;
    introVideo.scaleMax = 2;
    introVideo.windowScale = 0.6;

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
        }
    });

    timeline.append(TweenLite.to(video, animationTime, {
        tweenFrame: numFrames-1,
        ease: easing
    }));

    return timeline;
}




// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //



var animationModule = {
    initialize: function(scene) {
        initialize();

        scene.addChild(video);
    },
    getVideo: function() {
        return video;
    },
    playVideo: function() {
        videoTimeline.play(0);
    },
    onComplete: function(callback) {
        videoTimeline.vars.onComplete = callback;
    }

};


_.bindAll.apply(_, [].concat(animationModule, Object.keys(animationModule)));


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
},{"../pixi/character":19,"./placeJustOffscreen":8}],8:[function(require,module,exports){

module.exports = function(character) {
    var height = character.scale.y * character.getLocalBounds().height;

    character.windowY = -(height/2)/$(window).height();
};
},{}],9:[function(require,module,exports){



var Question = require('../models/question');


var QuestionCollection = Backbone.Collection.extend({
    model: Question
});




module.exports = QuestionCollection;
},{"../models/question":18}],10:[function(require,module,exports){




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

},{"../data/cannedQuestions.json":13,"../data/characterSelect.json":14,"../data/personalityQuestions.json":15,"./QuestionCollection":9}],11:[function(require,module,exports){
module.exports={
	"totalSize": 32556751,
	"assets": {
		"assets/img/150x150.gif": 537,
		"assets/img/blackout.png": 6686,
		"assets/img/button.png": 27047,
		"assets/img/drip.png": 9288,
		"assets/img/dynamite.png": 6493,
		"assets/img/footer.png": 85448,
		"assets/img/foreground_trees.png": 278624,
		"assets/img/header.png": 182681,
		"assets/img/icons/blade_ranger.png": 83570,
		"assets/img/icons/cabbie.png": 78215,
		"assets/img/icons/canned-btn.png": 52666,
		"assets/img/icons/dipper.png": 93598,
		"assets/img/icons/dusty.png": 97734,
		"assets/img/icons/printer.png": 1550,
		"assets/img/icons/send-btn.png": 30715,
		"assets/img/icons/the_team.png": 74326,
		"assets/img/icons/volume.png": 3220,
		"assets/img/icons/windlifter.png": 105323,
		"assets/img/in-theaters.png": 4130,
		"assets/img/intro-btm.png": 179061,
		"assets/img/intro-top.png": 176551,
		"assets/img/logo.png": 27675,
		"assets/img/midground.png": 203420,
		"assets/img/response_bg_dusty.jpg": 197642,
		"assets/img/response_letter_bg.jpg": 75713,
		"assets/img/site_bg.jpg": 184052,
		"assets/introVideo/PLANES2_760x428_00000.png": 147,
		"assets/introVideo/PLANES2_760x428_00001.png": 147,
		"assets/introVideo/PLANES2_760x428_00002.png": 147,
		"assets/introVideo/PLANES2_760x428_00003.png": 557,
		"assets/introVideo/PLANES2_760x428_00004.png": 1006,
		"assets/introVideo/PLANES2_760x428_00005.png": 1384,
		"assets/introVideo/PLANES2_760x428_00006.png": 929,
		"assets/introVideo/PLANES2_760x428_00007.png": 1157,
		"assets/introVideo/PLANES2_760x428_00008.png": 1408,
		"assets/introVideo/PLANES2_760x428_00009.png": 1546,
		"assets/introVideo/PLANES2_760x428_00010.png": 1639,
		"assets/introVideo/PLANES2_760x428_00011.png": 1908,
		"assets/introVideo/PLANES2_760x428_00012.png": 1986,
		"assets/introVideo/PLANES2_760x428_00013.png": 2023,
		"assets/introVideo/PLANES2_760x428_00014.png": 2076,
		"assets/introVideo/PLANES2_760x428_00015.png": 2121,
		"assets/introVideo/PLANES2_760x428_00016.png": 2269,
		"assets/introVideo/PLANES2_760x428_00017.png": 2450,
		"assets/introVideo/PLANES2_760x428_00018.png": 2568,
		"assets/introVideo/PLANES2_760x428_00019.png": 2727,
		"assets/introVideo/PLANES2_760x428_00020.png": 2888,
		"assets/introVideo/PLANES2_760x428_00021.png": 3045,
		"assets/introVideo/PLANES2_760x428_00022.png": 3180,
		"assets/introVideo/PLANES2_760x428_00023.png": 3325,
		"assets/introVideo/PLANES2_760x428_00024.png": 3487,
		"assets/introVideo/PLANES2_760x428_00025.png": 3600,
		"assets/introVideo/PLANES2_760x428_00026.png": 3712,
		"assets/introVideo/PLANES2_760x428_00027.png": 3822,
		"assets/introVideo/PLANES2_760x428_00028.png": 3924,
		"assets/introVideo/PLANES2_760x428_00029.png": 3999,
		"assets/introVideo/PLANES2_760x428_00030.png": 4035,
		"assets/introVideo/PLANES2_760x428_00031.png": 4091,
		"assets/introVideo/PLANES2_760x428_00032.png": 4147,
		"assets/introVideo/PLANES2_760x428_00033.png": 4162,
		"assets/introVideo/PLANES2_760x428_00034.png": 4217,
		"assets/introVideo/PLANES2_760x428_00035.png": 4108,
		"assets/introVideo/PLANES2_760x428_00036.png": 4167,
		"assets/introVideo/PLANES2_760x428_00037.png": 4236,
		"assets/introVideo/PLANES2_760x428_00038.png": 4263,
		"assets/introVideo/PLANES2_760x428_00039.png": 4370,
		"assets/introVideo/PLANES2_760x428_00040.png": 4438,
		"assets/introVideo/PLANES2_760x428_00041.png": 4498,
		"assets/introVideo/PLANES2_760x428_00042.png": 4534,
		"assets/introVideo/PLANES2_760x428_00043.png": 4635,
		"assets/introVideo/PLANES2_760x428_00044.png": 4646,
		"assets/introVideo/PLANES2_760x428_00045.png": 4740,
		"assets/introVideo/PLANES2_760x428_00046.png": 4783,
		"assets/introVideo/PLANES2_760x428_00047.png": 4832,
		"assets/introVideo/PLANES2_760x428_00048.png": 4986,
		"assets/introVideo/PLANES2_760x428_00049.png": 4983,
		"assets/introVideo/PLANES2_760x428_00050.png": 5040,
		"assets/introVideo/PLANES2_760x428_00051.png": 5133,
		"assets/introVideo/PLANES2_760x428_00052.png": 5203,
		"assets/introVideo/PLANES2_760x428_00053.png": 5369,
		"assets/introVideo/PLANES2_760x428_00054.png": 8286,
		"assets/introVideo/PLANES2_760x428_00055.png": 8073,
		"assets/introVideo/PLANES2_760x428_00056.png": 13797,
		"assets/introVideo/PLANES2_760x428_00057.png": 23174,
		"assets/introVideo/PLANES2_760x428_00058.png": 30850,
		"assets/introVideo/PLANES2_760x428_00059.png": 36133,
		"assets/introVideo/PLANES2_760x428_00060.png": 38099,
		"assets/introVideo/PLANES2_760x428_00061.png": 33445,
		"assets/introVideo/PLANES2_760x428_00062.png": 29573,
		"assets/introVideo/PLANES2_760x428_00063.png": 30370,
		"assets/introVideo/PLANES2_760x428_00064.png": 29705,
		"assets/introVideo/PLANES2_760x428_00065.png": 29855,
		"assets/introVideo/PLANES2_760x428_00066.png": 29700,
		"assets/introVideo/PLANES2_760x428_00067.png": 30254,
		"assets/introVideo/PLANES2_760x428_00068.png": 29556,
		"assets/introVideo/PLANES2_760x428_00069.png": 29661,
		"assets/introVideo/PLANES2_760x428_00070.png": 29720,
		"assets/introVideo/PLANES2_760x428_00071.png": 29814,
		"assets/introVideo/PLANES2_760x428_00072.png": 29810,
		"assets/introVideo/PLANES2_760x428_00073.png": 29769,
		"assets/introVideo/PLANES2_760x428_00074.png": 29509,
		"assets/introVideo/PLANES2_760x428_00075.png": 29769,
		"assets/introVideo/PLANES2_760x428_00076.png": 29641,
		"assets/introVideo/PLANES2_760x428_00077.png": 29498,
		"assets/introVideo/PLANES2_760x428_00078.png": 27394,
		"assets/introVideo/PLANES2_760x428_00079.png": 37602,
		"assets/introVideo/PLANES2_760x428_00080.png": 50130,
		"assets/introVideo/PLANES2_760x428_00081.png": 56464,
		"assets/introVideo/PLANES2_760x428_00082.png": 56449,
		"assets/introVideo/PLANES2_760x428_00083.png": 63129,
		"assets/introVideo/PLANES2_760x428_00084.png": 56346,
		"assets/introVideo/PLANES2_760x428_00085.png": 31585,
		"assets/introVideo/PLANES2_760x428_00086.png": 36186,
		"assets/introVideo/PLANES2_760x428_00087.png": 24798,
		"assets/introVideo/PLANES2_760x428_00088.png": 23865,
		"assets/introVideo/PLANES2_760x428_00089.png": 27931,
		"assets/introVideo/PLANES2_760x428_00090.png": 32099,
		"assets/introVideo/PLANES2_760x428_00091.png": 36948,
		"assets/introVideo/PLANES2_760x428_00092.png": 41183,
		"assets/introVideo/PLANES2_760x428_00093.png": 44423,
		"assets/introVideo/PLANES2_760x428_00094.png": 48476,
		"assets/introVideo/PLANES2_760x428_00095.png": 35879,
		"assets/introVideo/PLANES2_760x428_00096.png": 28115,
		"assets/introVideo/PLANES2_760x428_00097.png": 24723,
		"assets/introVideo/PLANES2_760x428_00098.png": 22251,
		"assets/introVideo/PLANES2_760x428_00099.png": 20630,
		"assets/introVideo/PLANES2_760x428_00100.png": 21010,
		"assets/introVideo/PLANES2_760x428_00101.png": 16370,
		"assets/introVideo/PLANES2_760x428_00102.png": 18193,
		"assets/introVideo/PLANES2_760x428_00103.png": 19893,
		"assets/introVideo/PLANES2_760x428_00104.png": 22471,
		"assets/introVideo/PLANES2_760x428_00105.png": 24596,
		"assets/introVideo/PLANES2_760x428_00106.png": 25534,
		"assets/introVideo/PLANES2_760x428_00107.png": 27118,
		"assets/introVideo/PLANES2_760x428_00108.png": 26107,
		"assets/introVideo/PLANES2_760x428_00109.png": 29131,
		"assets/introVideo/PLANES2_760x428_00110.png": 33558,
		"assets/introVideo/PLANES2_760x428_00111.png": 36476,
		"assets/introVideo/PLANES2_760x428_00112.png": 41015,
		"assets/introVideo/PLANES2_760x428_00113.png": 44689,
		"assets/introVideo/PLANES2_760x428_00114.png": 45964,
		"assets/introVideo/PLANES2_760x428_00115.png": 44052,
		"assets/introVideo/PLANES2_760x428_00116.png": 46498,
		"assets/introVideo/PLANES2_760x428_00117.png": 69783,
		"assets/introVideo/PLANES2_760x428_00118.png": 26587,
		"assets/introVideo/PLANES2_760x428_00119.png": 30952,
		"assets/introVideo/PLANES2_760x428_00120.png": 147,
		"assets/introVideo/PLANES2_760x428_00121.png": 147,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00000.png": 43103,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00001.png": 44320,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00002.png": 43065,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00003.png": 42886,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00004.png": 44170,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00005.png": 43012,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00006.png": 43453,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00007.png": 45734,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00008.png": 42698,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00009.png": 42512,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00010.png": 44691,
		"assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00011.png": 42399,
		"assets/spritesheets/cabbie/Cabbie_00000.png": 83268,
		"assets/spritesheets/cabbie/Cabbie_00001.png": 84282,
		"assets/spritesheets/cabbie/Cabbie_00002.png": 84750,
		"assets/spritesheets/cabbie/Cabbie_00003.png": 85108,
		"assets/spritesheets/cabbie/Cabbie_00004.png": 83268,
		"assets/spritesheets/cabbie/Cabbie_00005.png": 84282,
		"assets/spritesheets/cabbie/Cabbie_00006.png": 84750,
		"assets/spritesheets/cabbie/Cabbie_00007.png": 85108,
		"assets/spritesheets/cabbie/Cabbie_00008.png": 83268,
		"assets/spritesheets/cabbie/Cabbie_00009.png": 84282,
		"assets/spritesheets/cabbie/Cabbie_00010.png": 84750,
		"assets/spritesheets/cabbie/Cabbie_00011.png": 85108,
		"assets/spritesheets/dipper/Dipper_00000.png": 64070,
		"assets/spritesheets/dipper/Dipper_00001.png": 62983,
		"assets/spritesheets/dipper/Dipper_00002.png": 65773,
		"assets/spritesheets/dipper/Dipper_00003.png": 66644,
		"assets/spritesheets/dipper/Dipper_00004.png": 64070,
		"assets/spritesheets/dipper/Dipper_00005.png": 62983,
		"assets/spritesheets/dipper/Dipper_00006.png": 65773,
		"assets/spritesheets/dipper/Dipper_00007.png": 66644,
		"assets/spritesheets/dipper/Dipper_00008.png": 64070,
		"assets/spritesheets/dipper/Dipper_00009.png": 62983,
		"assets/spritesheets/dipper/Dipper_00010.png": 65773,
		"assets/spritesheets/dipper/Dipper_00011.png": 66644,
		"assets/spritesheets/dusty/one/Dusty_plane_00000.png": 126623,
		"assets/spritesheets/dusty/one/Dusty_plane_00001.png": 124253,
		"assets/spritesheets/dusty/one/Dusty_plane_00002.png": 124303,
		"assets/spritesheets/dusty/one/Dusty_plane_00003.png": 126005,
		"assets/spritesheets/dusty/one/Dusty_plane_00004.png": 126623,
		"assets/spritesheets/dusty/one/Dusty_plane_00005.png": 124253,
		"assets/spritesheets/dusty/one/Dusty_plane_00006.png": 124303,
		"assets/spritesheets/dusty/one/Dusty_plane_00007.png": 126005,
		"assets/spritesheets/dusty/one/Dusty_plane_00008.png": 126623,
		"assets/spritesheets/dusty/one/Dusty_plane_00009.png": 124253,
		"assets/spritesheets/dusty/one/Dusty_plane_00010.png": 124303,
		"assets/spritesheets/dusty/one/Dusty_plane_00011.png": 126005,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00000.png": 58166,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00001.png": 58003,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00002.png": 57644,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00003.png": 58131,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00004.png": 58166,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00005.png": 58003,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00006.png": 57644,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00007.png": 58131,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00008.png": 58166,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00009.png": 58003,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00010.png": 57644,
		"assets/spritesheets/dusty/two/Dusty_plane_light_00011.png": 58131,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00000.png": 77667,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00001.png": 77507,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00002.png": 77220,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00003.png": 77162,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00004.png": 77757,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00005.png": 78667,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00006.png": 77303,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00007.png": 77794,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00008.png": 78676,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00009.png": 77920,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00010.png": 77576,
		"assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00011.png": 77895,
		"assets/wipescreen/Blade_wpscrn_86400.png": 2322,
		"assets/wipescreen/Blade_wpscrn_86401.png": 3200,
		"assets/wipescreen/Blade_wpscrn_86402.png": 1393,
		"assets/wipescreen/Blade_wpscrn_86403.png": 1526,
		"assets/wipescreen/Blade_wpscrn_86404.png": 2727,
		"assets/wipescreen/Blade_wpscrn_86405.png": 3140,
		"assets/wipescreen/Blade_wpscrn_86406.png": 3763,
		"assets/wipescreen/Blade_wpscrn_86407.png": 4426,
		"assets/wipescreen/Blade_wpscrn_86408.png": 6003,
		"assets/wipescreen/Blade_wpscrn_86409.png": 9412,
		"assets/wipescreen/Blade_wpscrn_86410.png": 11185,
		"assets/wipescreen/Blade_wpscrn_86411.png": 14357,
		"assets/wipescreen/Blade_wpscrn_86412.png": 16323,
		"assets/wipescreen/Blade_wpscrn_86413.png": 19729,
		"assets/wipescreen/Blade_wpscrn_86414.png": 22047,
		"assets/wipescreen/Blade_wpscrn_86415.png": 25111,
		"assets/wipescreen/Blade_wpscrn_86416.png": 26551,
		"assets/wipescreen/Blade_wpscrn_86417.png": 29019,
		"assets/wipescreen/Blade_wpscrn_86418.png": 30202,
		"assets/wipescreen/Blade_wpscrn_86419.png": 31300,
		"assets/wipescreen/Blade_wpscrn_86420.png": 31717,
		"assets/wipescreen/Blade_wpscrn_86421.png": 32101,
		"assets/wipescreen/Blade_wpscrn_86422.png": 32895,
		"assets/wipescreen/Blade_wpscrn_86423.png": 33212,
		"assets/wipescreen/Blade_wpscrn_86424.png": 33744,
		"assets/wipescreen/Blade_wpscrn_86425.png": 33614,
		"assets/wipescreen/Blade_wpscrn_86426.png": 33414,
		"assets/wipescreen/Blade_wpscrn_86427.png": 33590,
		"assets/wipescreen/Blade_wpscrn_86428.png": 33514,
		"assets/wipescreen/Blade_wpscrn_86429.png": 32589,
		"assets/wipescreen/Blade_wpscrn_86430.png": 32335,
		"assets/wipescreen/Blade_wpscrn_86431.png": 32144,
		"assets/wipescreen/Blade_wpscrn_86432.png": 31536,
		"assets/wipescreen/Blade_wpscrn_86433.png": 30857,
		"assets/wipescreen/Blade_wpscrn_86434.png": 29891,
		"assets/wipescreen/Blade_wpscrn_86435.png": 29426,
		"assets/wipescreen/Blade_wpscrn_86436.png": 29418,
		"assets/wipescreen/Blade_wpscrn_86437.png": 28381,
		"assets/wipescreen/Blade_wpscrn_86438.png": 28142,
		"assets/wipescreen/Blade_wpscrn_86439.png": 27268,
		"assets/wipescreen/Blade_wpscrn_86440.png": 26569,
		"assets/wipescreen/Blade_wpscrn_86441.png": 26566,
		"assets/wipescreen/Blade_wpscrn_86442.png": 25871,
		"assets/wipescreen/Blade_wpscrn_86443.png": 25354,
		"assets/wipescreen/Blade_wpscrn_86444.png": 24564,
		"assets/wipescreen/Blade_wpscrn_86445.png": 24201,
		"assets/wipescreen/Blade_wpscrn_86446.png": 24146,
		"assets/wipescreen/Blade_wpscrn_86447.png": 23612,
		"assets/wipescreen/Blade_wpscrn_86448.png": 23639,
		"assets/wipescreen/Blade_wpscrn_86449.png": 23809,
		"assets/wipescreen/Blade_wpscrn_86450.png": 23170,
		"assets/wipescreen/Blade_wpscrn_86451.png": 23262,
		"assets/wipescreen/Blade_wpscrn_86452.png": 23206,
		"assets/wipescreen/Blade_wpscrn_86453.png": 22791,
		"assets/wipescreen/Blade_wpscrn_86454.png": 23064,
		"assets/wipescreen/Blade_wpscrn_86455.png": 23355,
		"assets/wipescreen/Blade_wpscrn_86456.png": 23779,
		"assets/wipescreen/Blade_wpscrn_86457.png": 24743,
		"assets/wipescreen/Blade_wpscrn_86458.png": 25878,
		"assets/wipescreen/Blade_wpscrn_86459.png": 26526,
		"assets/wipescreen/Blade_wpscrn_86460.png": 27666,
		"assets/wipescreen/Blade_wpscrn_86461.png": 28688,
		"assets/wipescreen/Blade_wpscrn_86462.png": 29589,
		"assets/wipescreen/Blade_wpscrn_86463.png": 30394,
		"assets/wipescreen/Blade_wpscrn_86464.png": 31296,
		"assets/wipescreen/Blade_wpscrn_86465.png": 32248,
		"assets/wipescreen/Blade_wpscrn_86466.png": 33897,
		"assets/wipescreen/Blade_wpscrn_86467.png": 35348,
		"assets/wipescreen/Blade_wpscrn_86468.png": 36236,
		"assets/wipescreen/Blade_wpscrn_86469.png": 37568,
		"assets/wipescreen/Blade_wpscrn_86470.png": 39880,
		"assets/wipescreen/Blade_wpscrn_86471.png": 41099,
		"assets/wipescreen/Blade_wpscrn_86472.png": 42037,
		"assets/wipescreen/Blade_wpscrn_86473.png": 42495,
		"assets/wipescreen/Blade_wpscrn_86474.png": 44553,
		"assets/wipescreen/Blade_wpscrn_86475.png": 45446,
		"assets/wipescreen/Blade_wpscrn_86476.png": 46745,
		"assets/wipescreen/Blade_wpscrn_86477.png": 48696,
		"assets/wipescreen/Blade_wpscrn_86478.png": 49873,
		"assets/wipescreen/Blade_wpscrn_86479.png": 51718,
		"assets/wipescreen/Blade_wpscrn_86480.png": 53863,
		"assets/wipescreen/Blade_wpscrn_86481.png": 54520,
		"assets/wipescreen/Blade_wpscrn_86482.png": 56496,
		"assets/wipescreen/Blade_wpscrn_86483.png": 56293,
		"assets/wipescreen/Blade_wpscrn_86484.png": 58824,
		"assets/wipescreen/Blade_wpscrn_86485.png": 59594,
		"assets/wipescreen/Blade_wpscrn_86486.png": 60634,
		"assets/wipescreen/Blade_wpscrn_86487.png": 62893,
		"assets/wipescreen/Blade_wpscrn_86488.png": 63999,
		"assets/wipescreen/Blade_wpscrn_86489.png": 66105,
		"assets/wipescreen/Blade_wpscrn_86490.png": 66340,
		"assets/wipescreen/Blade_wpscrn_86491.png": 69207,
		"assets/wipescreen/Blade_wpscrn_86492.png": 68767,
		"assets/wipescreen/Blade_wpscrn_86493.png": 70582,
		"assets/wipescreen/Blade_wpscrn_86494.png": 70269,
		"assets/wipescreen/Blade_wpscrn_86495.png": 73303,
		"assets/wipescreen/Blade_wpscrn_86496.png": 75902,
		"assets/wipescreen/Blade_wpscrn_86497.png": 77539,
		"assets/wipescreen/Blade_wpscrn_86498.png": 81621,
		"assets/wipescreen/Blade_wpscrn_86499.png": 82277,
		"assets/wipescreen/Blade_wpscrn_86500.png": 85056,
		"assets/wipescreen/Blade_wpscrn_86501.png": 87060,
		"assets/wipescreen/Blade_wpscrn_86502.png": 88341,
		"assets/wipescreen/Blade_wpscrn_86503.png": 88904,
		"assets/wipescreen/Blade_wpscrn_86504.png": 93208,
		"assets/wipescreen/Blade_wpscrn_86505.png": 99777,
		"assets/wipescreen/Blade_wpscrn_86506.png": 102861,
		"assets/wipescreen/Blade_wpscrn_86507.png": 109845,
		"assets/wipescreen/Blade_wpscrn_86508.png": 112169,
		"assets/wipescreen/Blade_wpscrn_86509.png": 115915,
		"assets/wipescreen/Blade_wpscrn_86510.png": 116902,
		"assets/wipescreen/Blade_wpscrn_86511.png": 123321,
		"assets/wipescreen/Blade_wpscrn_86512.png": 126347,
		"assets/wipescreen/Blade_wpscrn_86513.png": 133749,
		"assets/wipescreen/Blade_wpscrn_86514.png": 138770,
		"assets/wipescreen/Blade_wpscrn_86515.png": 146949,
		"assets/wipescreen/Blade_wpscrn_86516.png": 154320,
		"assets/wipescreen/Blade_wpscrn_86517.png": 159479,
		"assets/wipescreen/Blade_wpscrn_86518.png": 166218,
		"assets/wipescreen/Blade_wpscrn_86519.png": 171621,
		"assets/wipescreen/Blade_wpscrn_86520.png": 178271,
		"assets/wipescreen/Blade_wpscrn_86521.png": 185887,
		"assets/wipescreen/Blade_wpscrn_86522.png": 197291,
		"assets/wipescreen/Blade_wpscrn_86523.png": 206123,
		"assets/wipescreen/Blade_wpscrn_86524.png": 224682,
		"assets/wipescreen/Blade_wpscrn_86525.png": 236638,
		"assets/wipescreen/Blade_wpscrn_86526.png": 242599,
		"assets/wipescreen/Blade_wpscrn_86527.png": 262182,
		"assets/wipescreen/Blade_wpscrn_86528.png": 274806,
		"assets/wipescreen/Blade_wpscrn_86529.png": 285940,
		"assets/wipescreen/Blade_wpscrn_86530.png": 307438,
		"assets/wipescreen/Blade_wpscrn_86531.png": 323270,
		"assets/wipescreen/Blade_wpscrn_86532.png": 350573,
		"assets/wipescreen/Blade_wpscrn_86533.png": 376116,
		"assets/wipescreen/Blade_wpscrn_86534.png": 405574,
		"assets/wipescreen/Blade_wpscrn_86535.png": 437657,
		"assets/wipescreen/Blade_wpscrn_86536.png": 476489,
		"assets/wipescreen/Blade_wpscrn_86537.png": 484285,
		"assets/wipescreen/Blade_wpscrn_86538.png": 532946,
		"assets/wipescreen/Blade_wpscrn_86539.png": 556126,
		"assets/wipescreen/Blade_wpscrn_86540.png": 594544,
		"assets/wipescreen/Blade_wpscrn_86541.png": 648492,
		"assets/wipescreen/Blade_wpscrn_86542.png": 713799,
		"assets/wipescreen/Blade_wpscrn_86543.png": 732926,
		"assets/wipescreen/Blade_wpscrn_86544.png": 702981,
		"assets/wipescreen/Blade_wpscrn_86545.png": 758384,
		"assets/wipescreen/Blade_wpscrn_86546.png": 743540,
		"assets/wipescreen/Blade_wpscrn_86547.png": 684989,
		"assets/wipescreen/Blade_wpscrn_86548.png": 673956,
		"assets/wipescreen/Blade_wpscrn_86549.png": 655186,
		"assets/wipescreen/Blade_wpscrn_86550.png": 618637,
		"assets/wipescreen/Blade_wpscrn_86551.png": 599749,
		"assets/wipescreen/Blade_wpscrn_86552.png": 553890,
		"assets/wipescreen/Blade_wpscrn_86553.png": 525996,
		"assets/wipescreen/Blade_wpscrn_86554.png": 512021,
		"assets/wipescreen/Blade_wpscrn_86555.png": 354906
	}
}
},{}],12:[function(require,module,exports){
module.exports={
    "dusty": "assets/audio/dusty.mp3",
    "bladeranger": "assets/audio/blade.mp3",
    "cabbie": "assets/audio/Mustang_2012_Start.mp3",
    "dipper": "assets/audio/dipper.mp3",
    "windlifter": "assets/audio/windlifter.mp3",
    "team": "assets/audio/Yellow_Generic_Start.mp3"
}
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
module.exports={
    "dusty" : {
        "job": "I'm a SEAT, or a Single-Engine Air Tanker, with the Piston Peak Air Attack Team, an elite group of firefighting aircraft.",
        "forestfires": "I can scoop water from lakes and dive into the forest to drop the water on wildfires. Speed counts when an air rescue is under way, so I'm always ready to fly into danger!",
        "firefighter": "Before joining the Air Attack Team, I was a world-famous air racer – I even raced around the world!  Now I race to put out fires. ",
        "bestfriend": "It wasn't easy becoming a champion racer or a firefighter but I've had an amazing team of friends with me every step of the way! ",
        "favoriteplace": "I have been flying for as long as I can remember but my favorite place to fly is above my hometown, Pumpwash Junction. I do some fancy flying there!",
        "favorite-food": "Anything's better to eat than Vitaminamulch. Especially %template%!",
        "favorite-color": "My favorite color is GREEN. Green means go! And I love to go fast.",
        "favorite-sport": "Cool! Your favorite sport is %template%!"
    },
    "dipper": {
        "job": "I have a really important job fighting wildfires. I'm a Super-scooper with the Piston Peak Attack Team.",
        "forestfires": "I fight forest fires in several ways.  Sometimes I drop retardant to contain a fire.  I can also scoop water from the lake and drop it directly on the fire. My boss Blade Ranger calls me a Mud-Dropper!",
        "firefighter": "I wasn't always a firefighter. I used to haul cargo up in Anchorage. Yep, a lot of guys in Alaska. I was beating them off with a stick!",
        "bestfriend": "My best friend is champion racer Dusty Crophopper. I'm his biggest fan!",
        "favoriteplace": "My favorite place to fly is the Fusel Lodge, right here in Piston Peak. It's so beautiful. And where Dusty and I had our first date! It was a date, right? I'm pretty sure it was a date."
    },
    "windlifter": {
        "job": "I am a Heavy-Lift Helicopter with the Piston Peak Air Attack Team, an elite crew of firefighting aircraft. ",
        "forestfires": "Blade calls me a “Mud Dropper” because I have a detachable tank loaded with fire retardant to help put out the fires.  Mud is slang for retardant.  Windlifter can hold more retardant than anyone else on the team.",
        "firefighter": "Windlifter wasn't always a firefighter. Windlifter used to be a lumberjack, lifting dozens of heavy logs and carrying them to the lumber mill.  But now I am a firefighter and this keeps me very busy.",
        "bestfriend": "Windlifter would like to be YOUR best friend.",
        "favoriteplace": "Windlifter likes to fly many places and be one with the wind. The wind speaks, Windlifter listens."
    },
    "blade": {
        "job": "I'm a Fire and Rescue Helicopter, and the Copter in Charge here at Piston Peak. ",
        "forestfires": "When there's a fire, I give the orders for the Air Attack Team to spring into action!",
        "firefighter": "I've been the Chopper Captain for a long time, but I wasn't always a firefighter. I was a TV star on a show about police helicopters! But I realized I didn't want to pretend to save lives, I wanted to save them for real!",
        "bestfriend": "My best friends are all the trailblazers here at Piston Peak. We like to think of ourselves as the heroes of the sky!",
        "favoriteplace": "I like to fly to many places, but my favorite place is above Piston Peak. I patrol the skies and make sure all the tourists are camping by the book. Remember, safety first!"
    },
    "cabbie": {
        "job": "I'm an ex-military cargo plane with the Piston Peak Attack Team - firefighting is a big responsibility.",
        "forestfires": "I carry the Smokejumpers - who clear fallen trees and debris. During a fire, I drop them from the sky, right over the flames.",
        "firefighter": "I've been the Chopper Captain for a long time, but I wasn't always a firefighter. I was a TV star on a show about police helicopters! But I realized I didn't want to pretend to save lives, I wanted to save them for real!",
        "bestfriend": "My best friends are all the trailblazers here at Piston Peak. We like to think of ourselves as the heroes of the sky!",
        "favoriteplace": "I like to fly to many places, but my favorite place is above Piston Peak. I patrol the skies and make sure all the tourists are camping by the book. Remember, safety first!"
    },
    "team": {
        "job": "The Piston Peak Air Attack Team is an elite group of firefighting aircrafts. ",
        "forestfires": "We fly in when others are flyin out. It takes a special kinda plane.",
        "firefighter": "Life doesn't always go the way you expect it. This is a second career for all of us. ",
        "bestfriend": "It takes honor, trust and bravery to earn your wings. We don't have just one best friend because we need every plane we've got to help. ",
        "favoriteplace": "Piston Peak has some great places to fly. But our favorite spot is the wooden railway bridge - with the thundering Whitewall Falls behind it."
    }
}
},{}],17:[function(require,module,exports){




// adds our custom modifications to the PIXI library
require('./pixi/libModifications');



var MainView = require('./views/mainView');
var AssetLoadingView = require('./views/assetLoadingView');


// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};





// after assets loaded & jquery loaded
app.render = _.after(2, function() {
    app.mainView = new MainView();

    app.mainView.start();
});




// =================================================================== //
/* ************************** Asset Loading ************************** */
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

                app.assetLoader = new AssetLoadingView({onComplete: app.render});
            }
        });
    });

    $passwordScreen.show();

    console.log($passwordScreen);
} else {
    app.assetLoader = new AssetLoadingView({onComplete: app.render});

    $passwordScreen.remove();
}



$(function() {
    FastClick.attach(document.body);

    app.render();
});



module.exports = app;




},{"./pixi/libModifications":21,"./views/assetLoadingView":27,"./views/mainView":31}],18:[function(require,module,exports){



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
},{}],19:[function(require,module,exports){

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


    Character.prototype.setIdleState = function(pixiSprite) {
        this.idle = pixiSprite;

        if(pixiSprite instanceof PIXI.MovieClip) {
            pixiSprite.visible = true;
            pixiSprite.loop = true;
            pixiSprite.gotoAndPlay(0);  //start clip
        }

        this.addChild(pixiSprite);   //add to display object container
    };

    //add movie clip to play when character changes to state
    Character.prototype.addState = function(state, movieClip) {
        movieClip.visible = false;
        this.states[state] = movieClip;
        this.addChild(movieClip);
    };

    // public API function. Waits until current state is finished before switching to next state.
    Character.prototype.goToState = function(state) {

        if(_.isUndefined(this.states[state])) {
            throw 'Error: Character ' + this.name + ' does not contain state: ' + state;
        }

        if(this.idle instanceof PIXI.MovieClip) {
            this.idle.onComplete = _.bind(this.swapState, this, state);

            // after current animation finishes go to this state next
            this.idle.loop = false;
        } else {
            this.swapState(state);
            //switch immediately if character idle state is a single sprite
        }
    };

    // changes state immediately
    // NOTE: Function should only be used internally by character.goToState()
    Character.prototype.swapState = function(state) {

        var idleState = this.idle;
        var newState = this.states[state];

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
    };

    //add callback to run on character update
    Character.prototype.onUpdate = function(callback) {
        this.onUpdateCallback = callback;
    };

    // called on each animation frame by whatever Pixi scene contains this character
    Character.prototype.update = function() {
        this.onUpdateCallback();
    };



    Character.prototype.destroy = function() {
        this.parent.removeChild(this);

        _.each(this.children, function(child) {
            child.destroy();
        });
    };













    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //

    // extends Display Object Container
    extend(PIXI.DisplayObjectContainer, Character);

    module.exports = Character;
})();
},{"./extend":20}],20:[function(require,module,exports){

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
},{}],21:[function(require,module,exports){
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

        this.parent.removeChild(this);
        this.texture.destroy(destroyBaseTexture);
    };

    PIXI.MovieClip.prototype.destroy = function(destroyBaseTexture) {
        if(_.isUndefined(destroyBaseTexture)) destroyBaseTexture = true;

        this.parent.removeChild(this);
        _.each(this.textures, function(texture) {
            texture.destroy(destroyBaseTexture);
        });
    };






})();
},{}],22:[function(require,module,exports){

(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');

    var introVideoModule = require('../animations/introVideo');
    var backgroundModule = require('../animations/background');
    var bladewipeModule = require('../animations/bladewipe');
    var dustyDipperModule = require('../animations/dustyDipper');
    var parachutersModule = require('../animations/parachuters');
    var characterModule = require('../animations/characterModule');


    function initializeHeaderFooter(scene) {
        var header = PIXI.Sprite.fromImage('assets/img/header.png');

        header.windowScale = 1;
        header.anchor = new PIXI.Point(0.5, 0);
        header.windowX = 0.5;
        header.windowY = 0;

        var footer = PIXI.Sprite.fromImage('assets/img/footer.png');

        footer.windowScale = 1;
        footer.anchor = new PIXI.Point(.5, 1);
        footer.windowX = 0.5;
        footer.windowY = 1;

        scene.addChild(header);
        scene.addChild(footer);
    }

    // ============================================================ //
    /* *************** Primary Pixi Animation Class *************** */
    // ============================================================ //

    var MainScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        backgroundModule.initialize();
        backgroundModule.addBackgroundToScene(this);
        parachutersModule.initialize(this);
        backgroundModule.addRestToScene(this);

        bladewipeModule.initialize(this);
        dustyDipperModule.initialize(this);
        characterModule.initialize(this);

        initializeHeaderFooter(this);

        introVideoModule.initialize(this);
        this.introVideo = introVideoModule.getVideo();
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

            if(!_.isUndefined(this.view)) {
                var scale = this.introVideo.scale;
                var bounds = this.introVideo.getLocalBounds();

                this.view.onWindowResize(width, height, (bounds.width * scale.x), (bounds.height * scale.y));
            }
        }
    };








    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, MainScene);


    module.exports = MainScene;
})();
},{"../animations/background":1,"../animations/bladewipe":2,"../animations/characterModule":3,"../animations/dustyDipper":4,"../animations/introVideo":5,"../animations/parachuters":7,"./extend":20,"./scene":23}],23:[function(require,module,exports){



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
},{"./extend":20}],24:[function(require,module,exports){

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
},{"./scene":23}],25:[function(require,module,exports){





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

            console.log('play', filePath);
        }
    }
};


_.each(audioAssets, function(filePath) {
    soundPlayer.add(filePath);
});



module.exports = soundPlayer;
},{"./data/audioAssets.json":12}],26:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"option\">\n            <div class=\"full-relative\">\n                <div class=\"empty-space\"></div>\n                <div class=\"content\">\n                    <input type=\"radio\" name=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <label for=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"full-relative\"></label>\n                    <div class=\"background\"></div>\n                    <div class=\"text\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n                    <div class=\"box-shadow\"></div>\n                </div>\n            </div>\n        </div>\n    ";
  return buffer;
  }

  buffer += "<div class=\"copy\">\n    ";
  if (helper = helpers.copy) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.copy); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n</div>\n\n<div class=\"options clearfix\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":42}],27:[function(require,module,exports){


"use strict";


var assetData = require('../data/assets.json');

var fileNames = Object.keys(assetData.assets);
var totalFiles = fileNames.length;




// ============================================================ //
/* ************************** Loader ************************** */
// ============================================================ //

var loader = new PIXI.AssetLoader(fileNames);

function startLoader(view) {
    loader.onProgress = function() {
        view.update(this.loadCount);
    };
    loader.onComplete = _.bind(view.assetsLoaded, view);

    loader.load();
}


// ============================================================ //
/* *************************** View *************************** */
// ============================================================ //

var AssetLoadingView = Backbone.View.extend({
    el: '#assetLoader',
    initialize: function(options) {
        this.$text = this.$el.find('> .text');
        this.$text.html('0.00%');

        this.onCompleteCallback = options.onComplete || function(){};

        startLoader(this);
    },
    update: function(loadCount) {
        var percentage = Math.round(10000 * (totalFiles-loadCount)/totalFiles)/100;

        this.$text.html(percentage + '%');
    },
    assetsLoaded: function() {
        this.onCompleteCallback();

        this.$text.hide();
        var $el = this.$el;
        TweenLite.to($el, 1.4, {
            opacity: 0,
            onComplete: function() {
                $el.hide();
            }
        });
    }
});






module.exports = AssetLoadingView;
},{"../data/assets.json":11}],28:[function(require,module,exports){


(function() {
    "use strict";

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
            this.initScene();

            this.model = new Backbone.Model({value: ''});

            this.$nameInput = this.$el.find('input[type=text].name');
            this.$placeholder = this.$el.find('div.placeholder');
            this.$placeholderInner = this.$placeholder.find('> div');
            this.$title = this.$el.find('div.title');

            this.hideCallback = function(){};

            _.bindAll(this, 'startAnimation','show','hide','setInactive');
        },
        initScene: function() {
            this.scene = scenesManager.scenes['main'];
        },

        // ============================================================ //
        /* ***************** Run Animation Functions ****************** */
        // ============================================================ //
        startAnimation: function() {
            $('#pixi-view').removeClass('front');

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

            scenesManager.goToScene('main');

            this.preAnimationSetup();
            setTimeout(this.startAnimation, 0);
        },
        hide: function () {
            dustyDipperModule.onAnimationOutComplete(this.setInactive);

            TweenLite.to(this.$el, 0.3, {opacity: 0});

            //run hide animation
            dustyDipperModule.animateOut();
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

},{"../animations/dustyDipper":4,"../pixi/scenesManager":24}],29:[function(require,module,exports){





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
},{"../soundPlayer":25}],30:[function(require,module,exports){

(function() {
    "use strict";

    var scenesManager = require('../pixi/scenesManager');

    var introVideoModule = require('../animations/introVideo');

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
            this.initScene();

            this.$beginBtn.hide();
        },
        initJqueryVariables: function() {
            this.$beginScreen = this.$el.find('div.begin-screen');
            this.$beginLines = this.$beginScreen.find('div.line');
            this.$beginBtn = this.$beginScreen.find('a.begin');

            var $viewPorts = this.$el.find('div.viewport');

            this.$viewPortTop = $viewPorts.filter('.top');
            this.$viewPortBottom = $viewPorts.filter('.btm');

            this.$verticalSides = $viewPorts.find('.vertical');
            this.$horizontalSides = $viewPorts.find('.horizontal');
            this.$backgrounds = $viewPorts.find('.background');
        },
        initAnimationTimeline: function() {
            this.timelineHide = this.getTimelineHide();
            this.timelineBeginScreenIn = this.getTimelineBeginScreenIn();
        },
        initScene: function() {
            this.scene = scenesManager.scenes['main'];

            this.scene.setView(this);
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


            return timeline;
        },

        getTimelineHide: function() {
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

            timeline.add(TweenLite.to(this.$viewPortTop, animationTime, {
                top: '-50%',
                ease: easing
            }), 0);
            timeline.add(TweenLite.to(this.$viewPortBottom, animationTime, {
                bottom: '-50%',
                ease: easing
            }), 0);

            return timeline;
        },
        onAnimationFinished: function() {
            this.setInactive();

            this.onCompleteCallback();
        },

        setActive: function() {
            this.$el.removeClass('inactive');
        },
        setInactive: function() {
            this.$el.addClass('inactive');
        },

        // ============================================================ //
        /* ************************* Events *************************** */
        // ============================================================ //

        onBeginClick: function(e) {
            e.preventDefault();

            this.hide();
        },
        onWindowResize: function(windowWidth, windowHeight, videoWidth, videoHeight) {
            this.$backgrounds.width(videoWidth * 1.275 | 0);
            this.$horizontalSides.height(((windowHeight - videoHeight)/2 + 1) | 0); //round up
            this.$verticalSides.width(((windowWidth - videoWidth)/2 + 1) | 0); //round up

        },

        // ============================================================ //
        /* *********************** Public API ************************* */
        // ============================================================ //
        start: function() {
            this.setActive();

            $('#pixi-view').addClass('front');

            introVideoModule.onComplete(_.bind(this.showBeginScreen, this));
            introVideoModule.playVideo();
        },
        hide: function() {
            this.timelineHide.play();
        },
        onComplete: function(callback) {
            this.onCompleteCallback = callback;
        }

    });








    module.exports = IntroView;
})();
},{"../animations/introVideo":5,"../pixi/scenesManager":24}],31:[function(require,module,exports){

(function() {
    "use strict";

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


    function getValues(views) {
        return _.map(views, function(view) {return view.model.attributes.value; });
    }

    var MainView = Backbone.View.extend({
        el: '#content',
        events: {
            'click a.next': 'onNext',
            'click a.finish-send': 'onFinish',
            'click a.skip': 'onSkip',
            'mousemove': 'onMouseMove'
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function() {
            this.animating = false;
            this.pages = [];
            this.activePageIndex = 0;

            this.initJqueryVariables();

            //create canvas element
            scenesManager.initialize(this.$window.width(), this.$window.height(), this.$el);

            this.scene = scenesManager.createScene('main', MainScene);
            scenesManager.goToScene('main');

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
        },

        initWindowEvents: function() {
            this.$window.on('resize', _.bind(this.repositionPageNav, this));
//
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

            this.$next.css('opacity', 0);
            this.$next.addClass('active');

            this.repositionPageNav(false);

            TweenLite.to(this.$next, 0.3, {opacity: 1});
        },

        nextPage: function() {
            this.animating = true;
            //hide active page
            var activePage = this.pages[this.activePageIndex];
            var nextPage = this.pages[this.activePageIndex + 1];

            if(nextPage.isCanned()) {
                this.updateViewOptionsWithUnused(nextPage);
            }

            if(this.activePageIndex === 0) { //character select page
                this.hideSkip();
            }

            if(this.activePageIndex === 1) {
                //animate in character
                this.scene.animateInUserCharacter();
                this.showSkip();
            }

            activePage.onHideComplete(_.bind(this.showPageAfterHide, this));

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

            this.scene.onUserCharacterOut(_.bind(this.scene.playWipescreen, this.scene));

            var me = this;
            this.scene.onWipescreenComplete(function() {
                me.responseView.show();
                me.scene.showResponse();
            });


            this.scene.animateOutUserCharacter();
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

        // ==================================================================== //
        /* ************************* Render Functions ************************* */
        // ==================================================================== //
        start: function() {
            var introView = this.introView;

            setTimeout(function() {
                introView.start(); //start intro

                //trigger window resize
                scenesManager.onWindowResize();
            }, 300);
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

            this.scene.shiftBackgroundLayers(e.pageX/this.$window.width());
        },
        onSkip: function(e) {
            e.preventDefault();

            console.log('skip', this.animating, this.activePageIndex, this.pages.length);

            if(this.animating || this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        }
    });









    module.exports = MainView;



})();
},{"../collections/allQuestions":10,"../pixi/mainScene":22,"../pixi/scenesManager":24,"./enterNameView":28,"./footerView":29,"./introView":30,"./questionView":32,"./responseView":33,"./selectCharacterView":34}],32:[function(require,module,exports){


var template = require('../templates/question.hbs');
var itemAnimationsModule = require('../animations/pageItems');

var QuestionView = Backbone.View.extend({
    // Variables
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

        if(this.$options.length !== 0)
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
            if(_.isFunction(this.showCallback)) {
                this.showCallback();
            }
        }.bind(this);

        this.animationOut.vars.onComplete = function() {
            this.$el.removeClass('active');

            if(_.isFunction(this.hideCallback)) {
                this.hideCallback();
            }
        }.bind(this);
    },
    setAnimationIn: function() {
        "use strict";


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

        this.animationIn.play();
    },
    hide: function() {
        this.animationOut.play();
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
},{"../animations/pageItems":6,"../templates/question.hbs":26}],33:[function(require,module,exports){




(function() {
    "use strict";

    var responseMap = require('../data/responseMap.json');

    var ResponseView = Backbone.View.extend({
        el: '#response',
        events: {
            'click a#printversion': 'print'
        },

        initialize: function() {
            //this.scene = scenesManager.createScene('response', ResponseScene);

            this.$background = $('#response-bg');

        },
        
        setResponse: function(models) {
            var nameModel = models[0];
            var characterModel = models[1];

            this.$background.addClass(characterModel.attributes.value);

            var answeredQuestions = _.filter(_.rest(models, 2), function(model) {return model.attributes.value !== ''});

            var partitionedQuestions = _.partition(answeredQuestions, function(model) {
                return model.attributes.class !== 'canned';
            });

            var personalityModels = partitionedQuestions[0];
            var cannedModels = partitionedQuestions[1];


            var character = characterModel.attributes.value;
            var response = "";

            // ******** sort here ********

            var personalityResponses = _.map(personalityModels, function(model)  {
                return responseMap[character][model.attributes.name].replace('%template%', model.attributes.text);
            });

            var cannedResponses = _.map(cannedModels, function(model) {
                return responseMap[character][model.attributes.value];
            });

            response += ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ');

            $('#card-header').find('span').html(nameModel.attributes.value);
            $('#card-sincerely').find('span').html(nameModel.attributes.value);
            $('#card-body').html(response);
            $('#card-from').html(character);
        },

        show: function() {
            this.$el.show();
            this.$background.show();
            //scenesManager.goToScene('response');
        },
        hide: function() {

        },
        
        print: function(){
          window.print();
        }


    });













    module.exports = ResponseView;
})();
},{"../data/responseMap.json":16}],34:[function(require,module,exports){




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
},{"../animations/characterModule":3,"../data/audioAssets.json":12,"../soundPlayer":25,"./questionView":32}],35:[function(require,module,exports){
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
},{"./handlebars/base":36,"./handlebars/exception":37,"./handlebars/runtime":38,"./handlebars/safe-string":39,"./handlebars/utils":40}],36:[function(require,module,exports){
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
},{"./exception":37,"./utils":40}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
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
},{"./base":36,"./exception":37,"./utils":40}],39:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],40:[function(require,module,exports){
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
},{"./safe-string":39}],41:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":35}],42:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":41}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyb1ZpZGVvLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3BhZ2VJdGVtcy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYXJhY2h1dGVycy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wbGFjZUp1c3RPZmZzY3JlZW4uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL1F1ZXN0aW9uQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2F1ZGlvQXNzZXRzLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9yZXNwb25zZU1hcC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlXzhiYWNmYmZkLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9tb2RlbHMvcXVlc3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvY2hhcmFjdGVyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2V4dGVuZC5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9saWJNb2RpZmljYXRpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL21haW5TY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZXNNYW5hZ2VyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9zb3VuZFBsYXllci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvYXNzZXRMb2FkaW5nVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZW50ZXJOYW1lVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZm9vdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvaW50cm9WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9tYWluVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9yZXNwb25zZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3NlbGVjdENoYXJhY3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvYmFzZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9zYWZlLXN0cmluZy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGJhY2tncm91bmQsIG1pZGRsZWdyb3VuZCwgZm9yZWdyb3VuZDtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGJhY2tncm91bmQgPSBpbml0QmFja2dyb3VuZCgpO1xuICAgIG1pZGRsZWdyb3VuZCA9IGluaXRNaWRkbGVncm91bmQoKTtcbiAgICBmb3JlZ3JvdW5kID0gaW5pdEZvcmVncm91bmQoKTtcbn1cbmZ1bmN0aW9uIHNldEF0dHJzKHNwcml0ZSkge1xuICAgIHNwcml0ZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgc3ByaXRlLndpbmRvd1ggPSAwLjU7XG4gICAgc3ByaXRlLndpbmRvd1kgPSAxO1xuXG4gICAgc3ByaXRlLnNjYWxlVHlwZSA9ICdjb3Zlcic7XG4gICAgc3ByaXRlLndpbmRvd1NjYWxlID0gMS4wNjtcbn1cbmZ1bmN0aW9uIGluaXRCYWNrZ3JvdW5kKCkge1xuICAgIHZhciBiYWNrZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL3NpdGVfYmcuanBnJyk7XG5cbiAgICBzZXRBdHRycyhiYWNrZ3JvdW5kKTtcblxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdE1pZGRsZWdyb3VuZCgpIHtcbiAgICB2YXIgbWlkZGxlZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL21pZGdyb3VuZC5wbmcnKTtcbiAgICBzZXRBdHRycyhtaWRkbGVncm91bmQpO1xuICAgIHJldHVybiBtaWRkbGVncm91bmQ7XG59XG5mdW5jdGlvbiBpbml0Rm9yZWdyb3VuZCgpIHtcbiAgICB2YXIgZm9yZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZycpO1xuICAgIHNldEF0dHJzKGZvcmVncm91bmQpO1xuICAgIHJldHVybiBmb3JlZ3JvdW5kO1xufVxuXG5cblxuXG5cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG4gICAgfSksXG4gICAgYWRkQmFja2dyb3VuZFRvU2NlbmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGJhY2tncm91bmQpO1xuICAgIH0sXG4gICAgYWRkUmVzdFRvU2NlbmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKG1pZGRsZWdyb3VuZCk7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGZvcmVncm91bmQpO1xuICAgIH0sXG4gICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHZhciBiYWNrZ3JvdW5kUmF0aW8gPSAwLjc1O1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kUmF0aW8gPSAxLjU7XG4gICAgICAgIHZhciBmb3JlZ3JvdW5kUmF0aW8gPSAzO1xuXG4gICAgICAgIHZhciBiYWNrZ3JvdW5kWCA9IDAuNSAtICh4IC0gMC41KSAqIGJhY2tncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFggPSAwLjUgLSAoeCAtLjUpICogbWlkZGxlZ3JvdW5kUmF0aW8vNTA7XG4gICAgICAgIHZhciBmb3JlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBmb3JlZ3JvdW5kUmF0aW8vNTA7XG5cbiAgICAgICAgYmFja2dyb3VuZC53aW5kb3dYID0gYmFja2dyb3VuZFg7XG4gICAgICAgIG1pZGRsZWdyb3VuZC53aW5kb3dYID0gbWlkZGxlZ3JvdW5kWDtcbiAgICAgICAgZm9yZWdyb3VuZC53aW5kb3dYID0gZm9yZWdyb3VuZFg7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYmFja2dyb3VuZC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIG1pZGRsZWdyb3VuZC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGZvcmVncm91bmQudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGJhY2tncm91bmQuZGVzdHJveSgpO1xuICAgICAgICBtaWRkbGVncm91bmQuZGVzdHJveSgpO1xuICAgICAgICBmb3JlZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHdpcGVzY3JlZW5WaWRlbywgdmlkZW9UaW1lbGluZTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHdpcGVzY3JlZW5WaWRlbyA9IGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKCk7XG4gICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHdpcGVzY3JlZW5WaWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKCkge1xuICAgIHZhciB0ZXh0dXJlcyA9IFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NicsIDQwMCwgNTU2KTtcblxuICAgIHZhciB3aXBlc2NyZWVuVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAodGV4dHVyZXMpO1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dYID0gMC41O1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dZID0gMC41O1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dTY2FsZSA9IDE7XG4gICAgd2lwZXNjcmVlblZpZGVvLnNjYWxlVHlwZSA9ICdjb3Zlcic7XG5cbiAgICB3aXBlc2NyZWVuVmlkZW8uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xuICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgd2lwZXNjcmVlblZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIHJldHVybiB3aXBlc2NyZWVuVmlkZW87XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmlkZW8uX3R3ZWVuRnJhbWUgPSAwO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuZ290b0FuZFN0b3AodmFsdWUpO1xuXG4vLyAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdmFsdWU7XG4vLyAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHZpZGVvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cblxuICAgIHZhciBmYWRlT3V0VGltZSA9IDAuMjtcbiAgICB2YXIgZmFkZU91dFN0YXJ0ID0gdGltZWxpbmUuZHVyYXRpb24oKSAtIDAuMTtcblxuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdjYWxsYmFjaycsIHRpbWVsaW5lLmR1cmF0aW9uKCkgLSAwLjEpO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh2aWRlbywgZmFkZU91dFRpbWUsIHtcbiAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgfSksIGZhZGVPdXRTdGFydCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZCh3aXBlc2NyZWVuVmlkZW8pO1xuICAgIH0sXG4gICAgcGxheVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5wbGF5KDApO1xuICAgIH0sXG4gICAgaGlkZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2lwZXNjcmVlblZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uVmlkZW9Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5hZGQoY2FsbGJhY2ssICdjYWxsYmFjaycpO1xuICAgIH1cbn07XG5cblxuXG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFthbmltYXRpb25Nb2R1bGVdLmNvbmNhdChPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiBIZWxwZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGdldER1c3R5SWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAnLCAwLCAxMik7XG59XG5mdW5jdGlvbiBnZXREaXBwZXJJZGxlVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAnLCAwLCAxMik7XG59XG5mdW5jdGlvbiBnZXRCbGFkZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAnLCAwLCAxMik7XG59XG5mdW5jdGlvbiBnZXRDYWJiaWVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMCcsIDAsIDEyKTtcbn1cbmZ1bmN0aW9uIGdldFdpbmRsaWZ0ZXJUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMCcsIDAsIDEyKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGNoYXIsIGNoYXJhY3Rlck5hbWUsIGFsbENoYXJhY3RlcnMsIGRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgYWxsQ2hhcmFjdGVycyA9IHtcbiAgICAgICAgZHVzdHk6IF8ub25jZShpbml0RHVzdHkpLFxuICAgICAgICBibGFkZXJhbmdlcjogXy5vbmNlKGluaXRCbGFkZSksXG4gICAgICAgIGNhYmJpZTogXy5vbmNlKGluaXRDYWJiaWUpLFxuICAgICAgICBkaXBwZXI6IF8ub25jZShpbml0RGlwcGVyKSxcbiAgICAgICAgd2luZGxpZnRlcjogXy5vbmNlKGluaXRXaW5kbGlmdGVyKVxuICAgIH07XG5cbiAgICBkaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xufVxuXG5mdW5jdGlvbiBpbml0RHVzdHkoKSB7XG4gICAgdmFyIGR1c3R5ID0gbmV3IENoYXJhY3RlcignRHVzdHknKTtcblxuICAgIHZhciBkdXN0eUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSk7XG4gICAgZHVzdHlJZGxlQW5pbWF0aW9uLmFuY2hvciA9IHt4OiA0ODAvMTIwMCwgeTogNDA1Lzk4M307XG4gICAgZHVzdHlJZGxlQW5pbWF0aW9uLndpbmRvd1NjYWxlID0gMC40MjtcblxuICAgIGR1c3R5LnNldElkbGVTdGF0ZShkdXN0eUlkbGVBbmltYXRpb24pO1xuXG4gICAgZHVzdHkud2luZG93WSA9IC0xO1xuXG4gICAgcmV0dXJuIGR1c3R5O1xufVxuZnVuY3Rpb24gaW5pdEJsYWRlKCkge1xuICAgIHZhciBibGFkZUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0QmxhZGVUZXh0dXJlcygpKTtcbiAgICBibGFkZUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDQ1Ny85NzAsIHk6IDM0Ni82MDB9O1xuICAgIGJsYWRlSWRsZUFuaW1hdGlvbi53aW5kb3dTY2FsZSA9IDAuNjtcblxuICAgIHZhciBibGFkZSA9IG5ldyBDaGFyYWN0ZXIoJ0JsYWRlJywgYmxhZGVJZGxlQW5pbWF0aW9uKTtcblxuICAgIGJsYWRlLndpbmRvd1kgPSAtMTtcblxuICAgIHJldHVybiBibGFkZTtcbn1cbmZ1bmN0aW9uIGluaXRDYWJiaWUoKSB7XG4gICAgdmFyIGNhYmJpZUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0Q2FiYmllVGV4dHVyZXMoKSk7XG4gICAgY2FiYmllSWRsZUFuaW1hdGlvbi5hbmNob3IgPSB7eDogNTQ1LzEyMDAsIHk6IDM1MS82MjJ9O1xuICAgIGNhYmJpZUlkbGVBbmltYXRpb24ud2luZG93U2NhbGUgPSAwLjY7XG5cbiAgICB2YXIgY2FiYmllID0gbmV3IENoYXJhY3RlcignQ2FiYmllJywgY2FiYmllSWRsZUFuaW1hdGlvbik7XG5cbiAgICBjYWJiaWUud2luZG93WSA9IC0xO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgYmx1ckZpbHRlci5ibHVyID0gOTtcblxuICAgIGNhYmJpZS5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgcmV0dXJuIGNhYmJpZTtcbn1cbmZ1bmN0aW9uIGluaXREaXBwZXIoKSB7XG4gICAgdmFyIGRpcHBlcklkbGVTdGF0ZSA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXREaXBwZXJJZGxlVGV4dHVyZXMoKSk7XG4gICAgZGlwcGVySWRsZVN0YXRlLmFuY2hvciA9IHt4OiA1MzkvMTIwMCwgeTogNDM1LzYzOH07XG4gICAgZGlwcGVySWRsZVN0YXRlLndpbmRvd1NjYWxlID0gMC42O1xuXG4gICAgdmFyIGRpcHBlciA9IG5ldyBDaGFyYWN0ZXIoJ0RpcHBlcicsIGRpcHBlcklkbGVTdGF0ZSk7XG5cbiAgICBkaXBwZXIud2luZG93WSA9IC0xO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgYmx1ckZpbHRlci5ibHVyID0gOTtcblxuICAgIGRpcHBlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cbmZ1bmN0aW9uIGluaXRXaW5kbGlmdGVyKCkge1xuICAgIHZhciB3aW5kbGlmZXJJZGxlU3RhdGUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0V2luZGxpZnRlclRleHR1cmVzKCkpO1xuICAgIHdpbmRsaWZlcklkbGVTdGF0ZS5hbmNob3IgPSB7eDogMC41LCB5OiAwLjV9O1xuICAgIHdpbmRsaWZlcklkbGVTdGF0ZS53aW5kb3dTY2FsZSA9IDAuNTY7XG5cbiAgICB2YXIgd2luZGxpZnRlciA9IG5ldyBDaGFyYWN0ZXIoJ1dpbmRsaWZ0ZXInLCB3aW5kbGlmZXJJZGxlU3RhdGUpO1xuICAgIHdpbmRsaWZ0ZXIud2luZG93WSA9IC0xO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgIHdpbmRsaWZ0ZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgIHJldHVybiB3aW5kbGlmdGVyO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYW5pbWF0ZUluLCBhbmltYXRlT3V0O1xuXG52YXIgYW5pbWF0aW9uc0luID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjaGFyKTtcbiAgICAgICAgICAgIGNoYXIud2luZG93WCA9IDAuNjtcblxuICAgICAgICAgICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaGFyKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBibGFkZXJhbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyLndpbmRvd1ggPSAtLjQ7XG4gICAgICAgICAgICBjaGFyLndpbmRvd1kgPSAwLjc1O1xuXG4gICAgICAgICAgICBkaXNwbGF5T2JqZWN0Q29udGFpbmVyLmFkZENoaWxkKGNoYXIpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjYWJiaWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNoYXIpO1xuICAgICAgICAgICAgY2hhci5yb3RhdGlvbiA9IDAuNTU7XG4gICAgICAgICAgICBjaGFyLndpbmRvd1ggPSAwLjQ2O1xuXG4gICAgICAgICAgICBjaGFyLnNjYWxlLnggPSAwLjg7XG4gICAgICAgICAgICBjaGFyLnNjYWxlLnkgPSAwLjg7XG5cbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gY2hhci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gNztcblxuICAgICAgICAgICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaGFyKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHN3ZWVwVGltZSA9IGFuaW1hdGlvblRpbWUgKiA3Lzg7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNSxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhci5zY2FsZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgYmx1cjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNoYXIpO1xuICAgICAgICAgICAgY2hhci5yb3RhdGlvbiA9IDAuNTU7XG4gICAgICAgICAgICBjaGFyLndpbmRvd1ggPSAwLjQ2O1xuXG4gICAgICAgICAgICBjaGFyLnNjYWxlLnggPSAwLjg7XG4gICAgICAgICAgICBjaGFyLnNjYWxlLnkgPSAwLjg7XG5cbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gY2hhci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gNztcblxuICAgICAgICAgICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaGFyKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHN3ZWVwVGltZSA9IGFuaW1hdGlvblRpbWUgKiA3Lzg7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xOCxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhci5zY2FsZSwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBhbmltYXRpb25UaW1lIC0gc3dlZXBUaW1lLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgc3dlZXBUaW1lLCB7XG4gICAgICAgICAgICAgICAgYmx1cjogMCxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aW5kbGlmdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjaGFyKTtcbiAgICAgICAgICAgIGNoYXIud2luZG93WCA9IDAuNjtcblxuICAgICAgICAgICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaGFyKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbnZhciBvbkFuaW1hdGlvbk91dENhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG5mdW5jdGlvbiBvbkFuaW1hdGlvbk91dENvbXBsZXRlKCkge1xuXG4vLyAgICBjaGFyLmRlc3Ryb3koKTtcbiAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrKCk7XG59XG5cbnZhciBhbmltYXRpb25zT3V0ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ2lyYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVzdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yNSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC41LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjQsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhYmJpZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gY2hhci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtibHVyOiA0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpcHBlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC40LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gY2hhci5maWx0ZXJzWzBdO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtibHVyOiA0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC4zLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW4nLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2hhciwgYW5pbWF0aW9uVGltZSAqIDcvOCwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBUZWFtIEFuaW1hdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIHRlYW1BbmltYXRpb25TZXR1cChkdXN0eSwgYmxhZGUsIGNhYmJpZSwgZGlwcGVyLCB3aW5kbGlmdGVyKSB7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRHVzdHkgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgZHVzdHkud2luZG93WSA9IDAuMztcbiAgICBkdXN0eS53aW5kb3dYID0gMS4zO1xuICAgIGR1c3R5LmlkbGUud2luZG93U2NhbGUgPSAwLjM7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQmxhZGUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgYmxhZGUud2luZG93WCA9IC0uNDtcbiAgICBibGFkZS53aW5kb3dZID0gMC43NTtcbiAgICBibGFkZS5pZGxlLndpbmRvd1NjYWxlID0gMC40O1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENhYmJpZSB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2FiYmllKTtcbiAgICBjYWJiaWUucm90YXRpb24gPSAwLjU1O1xuICAgIGNhYmJpZS53aW5kb3dYID0gMC40NjtcbiAgICBjYWJiaWUuaWRsZS53aW5kb3dTY2FsZSA9IDAuMztcbiAgICBjYWJiaWUuZmlsdGVyc1swXS5ibHVyID0gNDtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBEaXBwZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gMC41NTtcbiAgICBkaXBwZXIud2luZG93WCA9IDAuNDY7XG4gICAgZGlwcGVyLmZpbHRlcnNbMF0uYmx1ciA9IDE7XG4gICAgZGlwcGVyLmlkbGUud2luZG93U2NhbGUgPSAwLjU7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IFdpbmRsaWZ0ZXIgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHdpbmRsaWZ0ZXIud2luZG93WCA9IDEuNDtcbiAgICB3aW5kbGlmdGVyLndpbmRvd1kgPSAwLjg7XG4gICAgd2luZGxpZnRlci5pZGxlLndpbmRvd1NjYWxlID0gMC4zO1xuICAgIHdpbmRsaWZ0ZXIuZmlsdGVyc1swXS5ibHVyID0gNDtcblxuXG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChibGFkZSk7XG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChkdXN0eSk7XG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjYWJiaWUpO1xuICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoZGlwcGVyKTtcbiAgICBkaXNwbGF5T2JqZWN0Q29udGFpbmVyLmFkZENoaWxkKHdpbmRsaWZ0ZXIpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlSW5UZWFtKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4zO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBkdXN0eSA9IGNoYXJbMF07XG4gICAgdmFyIGJsYWRlID0gY2hhclsxXTtcbiAgICB2YXIgY2FiYmllID0gY2hhclsyXTtcbiAgICB2YXIgZGlwcGVyID0gY2hhclszXTtcbiAgICB2YXIgd2luZGxpZnRlciA9IGNoYXJbNF07XG5cbiAgICB0ZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcik7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBzdGFnZ2VyOiAwLjI3LFxuICAgICAgICBhbGlnbjogJ3N0YXJ0JyxcbiAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIxLFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjY4LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuOCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsYWRlLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC42NCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjE2LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4yLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNjgsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh3aW5kbGlmdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC40LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuODIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGVPdXRUZWFtKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS44O1xuICAgIHZhciBlYXNpbmcgPSAnQ2lyYy5lYXNlSW4nO1xuXG4gICAgdmFyIGR1c3R5ID0gY2hhclswXTtcbiAgICB2YXIgYmxhZGUgPSBjaGFyWzFdO1xuICAgIHZhciBjYWJiaWUgPSBjaGFyWzJdO1xuICAgIHZhciBkaXBwZXIgPSBjaGFyWzNdO1xuICAgIHZhciB3aW5kbGlmdGVyID0gY2hhcls0XTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHN0YWdnZXI6IDAuMjksXG4gICAgICAgIGFsaWduOiAnc3RhcnQnLFxuICAgICAgICB0d2VlbnM6IFtcbiAgICAgICAgICAgIG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlSW4nXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC41LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oY2FiYmllLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4xLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IC0wLjMsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjIsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IC0wLjIsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC42LFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgXSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgY2hhciA9IFtpbml0RHVzdHkoKSwgaW5pdEJsYWRlKCksIGluaXRDYWJiaWUoKSwgaW5pdERpcHBlcigpLCBpbml0V2luZGxpZnRlcigpXTtcblxuICAgICAgICAgICAgYW5pbWF0ZUluVGVhbSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hhciA9IGFsbENoYXJhY3RlcnNbY2hhcmFjdGVyTmFtZV0oKTtcblxuICAgICAgICBhbmltYXRlSW4gPSBhbmltYXRpb25zSW5bY2hhcmFjdGVyTmFtZV07XG4gICAgICAgIGFuaW1hdGVPdXQgPSBhbmltYXRpb25zT3V0W2NoYXJhY3Rlck5hbWVdO1xuXG4gICAgICAgIGFuaW1hdGVJbigpO1xuICAgIH0sXG4gICAgYW5pbWF0ZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT09ICd0ZWFtJykge1xuICAgICAgICAgICAgYW5pbWF0ZU91dFRlYW0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmltYXRlT3V0KCk7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBzZXRDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBjaGFyYWN0ZXJOYW1lID0gY2hhcmFjdGVyO1xuICAgIH0sXG4gICAgYWxsQ2hhcmFjdGVyczogYWxsQ2hhcmFjdGVyc1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGR1c3R5LCBkaXBwZXIsIHRpbWVsaW5lSW4sIHRpbWVsaW5lT3V0O1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiBIZWxwZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGdldER1c3R5SWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAnLCAwLCAxMik7XG59XG5mdW5jdGlvbiBnZXREaXBwZXJJZGxlVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAnLCAwLCAxMik7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgZHVzdHkgPSBpbml0aWFsaXplRHVzdHkoKTtcbiAgICBkaXBwZXIgPSBpbml0aWFsaXplRGlwcGVyKCk7XG5cbiAgICB0aW1lbGluZUluID0gZ2VuZXJhdGVBbmltYXRpb25JblRpbWVsaW5lKCk7XG4gICAgdGltZWxpbmVPdXQgPSBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEdXN0eSgpIHtcbiAgICB2YXIgZHVzdHkgPSBuZXcgQ2hhcmFjdGVyKCdEdXN0eScpO1xuXG4gICAgdmFyIGR1c3R5SWRsZUFuaW1hdGlvbiA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXREdXN0eUlkbGVUZXh0dXJlcygpKTtcblxuICAgIGR1c3R5SWRsZUFuaW1hdGlvbi5hbmNob3IgPSB7eDogNjQxLzEyMDAsIHk6IDM0MC82Mzh9O1xuXG4gICAgZHVzdHkuc2V0SWRsZVN0YXRlKGR1c3R5SWRsZUFuaW1hdGlvbik7XG5cbiAgICBkdXN0eS53aW5kb3dTY2FsZSA9IDAuNDc7XG4gICAgZHVzdHkud2luZG93WCA9IDAuMTg7XG4gICAgZHVzdHkud2luZG93WSA9IC0xO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgIGR1c3R5LmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG5cbiAgICByZXR1cm4gZHVzdHk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEaXBwZXIoKSB7XG4gICAgdmFyIGRpcHBlciA9IG5ldyBDaGFyYWN0ZXIoJ0RpcHBlcicpO1xuXG4gICAgdmFyIGRpcHBlcklkbGVTdGF0ZSA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXREaXBwZXJJZGxlVGV4dHVyZXMoKSk7XG5cbiAgICBkaXBwZXJJZGxlU3RhdGUuc2NhbGUueCA9IC0xO1xuICAgIGRpcHBlcklkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDU3MS8xMjAwLFxuICAgICAgICB5OiA0MTAvNjM4XG4gICAgfTtcblxuICAgIGRpcHBlci5zZXRJZGxlU3RhdGUoZGlwcGVySWRsZVN0YXRlKTtcblxuICAgIGRpcHBlci53aW5kb3dYID0gMC43NTtcbiAgICBkaXBwZXIud2luZG93WSA9IC0xO1xuICAgIGRpcHBlci5yb3RhdGlvbiA9IC0wLjQwO1xuXG4gICAgZGlwcGVyLndpbmRvd1NjYWxlID0gODY1LzEzNjY7XG4gICAgZGlwcGVyLmFuaW1hdGlvblNjYWxlWCA9IDAuNztcbiAgICBkaXBwZXIuYW5pbWF0aW9uU2NhbGVZID0gMC43O1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgYmx1ckZpbHRlci5ibHVyID0gMTA7XG5cbiAgICBkaXBwZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgIHJldHVybiBkaXBwZXI7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRlIEluICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25JblRpbWVsaW5lKCkge1xuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdmFyIHRpbWVsaW5lRHVzdHlJbiA9IGdlbmVyYXRlVGltZWxpbmVEdXN0eUluKGR1c3R5KTtcblxuICAgIHRpbWVsaW5lLmFkZCh0aW1lbGluZUR1c3R5SW4ucGxheSgpLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZUR1c3R5SG92ZXIoZHVzdHkpLnBsYXkoKSwgdGltZWxpbmVEdXN0eUluLmR1cmF0aW9uKCkpO1xuXG4gICAgdGltZWxpbmUuYWRkKGdlbmVyYXRlVGltZWxpbmVEaXBwZXJJbihkaXBwZXIpLnBsYXkoKSwgMC40KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgb2dBdHRyaWJ1dGVzID0gXy5waWNrKGR1c3R5LCAnd2luZG93WCcsICd3aW5kb3dTY2FsZScpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkdXN0eSk7XG4gICAgICAgICAgICBfLmV4dGVuZChkdXN0eSwgb2dBdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjUyLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMTtcbiAgICB2YXIgZWFzaW5nID0gJ1F1YWQuZWFzZUluT3V0JztcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgcmVwZWF0OiAtMVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBidW1wWTogLTE1LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBidW1wWTogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi4wO1xuICAgIHZhciBzd2VlcFN0YXJ0VGltZSA9IGFuaW1hdGlvblRpbWUgKiAwLjExO1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBvZ0F0dHJpYnV0ZXMgPSBfLnBpY2soZGlwcGVyLCAnd2luZG93WCcsICdyb3RhdGlvbicsICd3aW5kb3dTY2FsZScsICdhbmltYXRpb25TY2FsZVgnLCAnYW5pbWF0aW9uU2NhbGVZJyk7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgICAgICAgICAgXy5leHRlbmQoZGlwcGVyLCBvZ0F0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjMwLFxuICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgIH0pLCAwKTtcblxuICAgIC8vc3dlZXAgcmlnaHRcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dYOiAwLjg2LFxuICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIHN3ZWVwU3RhcnRUaW1lKTtcblxuICAgIC8vIHNjYWxlIHVwXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGJsdXI6IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRlIE91dCAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uT3V0VGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lT3V0ID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgZGlwcGVyLmRlc3Ryb3koZmFsc2UpO1xuICAgICAgICAgICAgZHVzdHkuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lT3V0LmFkZChnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpLnBsYXkoKSwgMCk7XG4gICAgdGltZWxpbmVPdXQuYWRkKGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpLnBsYXkoKSwgMCk7XG5cbiAgIHJldHVybiB0aW1lbGluZU91dDtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLjQsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS40LFxuICAgICAgICB3aW5kb3dZOiAtMC4zLFxuICAgICAgICB3aW5kb3dYOiAxLjEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUvMiwge1xuICAgICAgICBibHVyOiAxMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMi40O1xuICAgIHZhciBlYXNpbmcgPSAnRXhwby5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkdXN0eS5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS4zLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuMyxcbiAgICAgICAgd2luZG93WTogLTAuMSxcbiAgICAgICAgd2luZG93WDogMC42LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZGlwcGVyKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZHVzdHkpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lSW4ucGxheSgwKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZU91dC5wbGF5KDApO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25JbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aW1lbGluZUluLnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDb21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbmZ1bmN0aW9uIGdldEludHJvVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMCcsIDAsIDEyMik7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB2aWRlbywgdmlkZW9UaW1lbGluZTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHZpZGVvID0gaW5pdGlhbGl6ZVZpZGVvKCk7XG4gICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvKHNjZW5lKSB7XG4gICAgdmFyIGludHJvVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0SW50cm9UZXh0dXJlcygpKTtcblxuICAgIGludHJvVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgaW50cm9WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG5cbiAgICBpbnRyb1ZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICBpbnRyb1ZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIGludHJvVmlkZW8uc2NhbGVNaW4gPSAxO1xuICAgIGludHJvVmlkZW8uc2NhbGVNYXggPSAyO1xuICAgIGludHJvVmlkZW8ud2luZG93U2NhbGUgPSAwLjY7XG5cbiAgICByZXR1cm4gaW50cm9WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcblxuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8odmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQodmlkZW8pO1xuICAgIH0sXG4gICAgZ2V0VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmlkZW87XG4gICAgfSxcbiAgICBwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnBsYXkoMCk7XG4gICAgfSxcbiAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcbnZhciBhbmltYXRpb25UaW1lID0gMC40O1xuXG5cblxudmFyIHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnMgPSBbXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXRSb3RhdGUpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgZmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tVG9wKSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dFJvdGF0ZSldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tVG9wKSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldXG5dO1xuXG52YXIgY2FubmVkQW5pbWF0aW9uUGFpcnMgPSBbXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXVxuXTtcblxuXG5cbmZ1bmN0aW9uIHN0YWdnZXJJdGVtcygkaXRlbXMpIHtcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIHR3ZWVuczogXy5tYXAoJGl0ZW1zLCB0aGlzKSxcbiAgICAgICAgc3RhZ2dlcjogMC4wN1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKiBJbmRpdmlkdWFsIEFuaW1hdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGZhZGVJbigkaXRlbSwgcHJvcCwgZGlzdGFuY2UsIGVhc2luZykge1xuICAgIHZhciBmcm9tID0ge29wYWNpdHk6IDB9O1xuICAgIGZyb21bcHJvcF0gPSBkaXN0YW5jZTtcblxuICAgIHZhciB0byA9IHtvcGFjaXR5OiAxLCBlYXNlOiBlYXNpbmd9O1xuICAgIHRvW3Byb3BdID0gMDtcblxuICAgIHJldHVybiBUd2VlbkxpdGUuZnJvbVRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCBmcm9tLCB0byk7XG59XG5mdW5jdGlvbiBmYWRlSW5Ob01vdmVtZW50KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCAwLCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gZmFkZUluRnJvbVJpZ2h0KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCA3NSwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbkZyb21Ub3AoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneScsIC03NSwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUZhZGVJbkZyb21SaWdodCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgNzUsICdCYWNrLmVhc2VPdXQnKTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUZhZGVJbkZyb21Ub3AoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneScsIC03NSwgJ0JhY2suZWFzZU91dCcpO1xufVxuZnVuY3Rpb24gcm90YXRlSW5MZWZ0KCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS5mcm9tVG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtyb3RhdGlvblk6IC05MCwgdHJhbnNmb3JtT3JpZ2luOlwibGVmdCA1MCUgLTEwMFwifSwge3JvdGF0aW9uWTogMH0pO1xufVxuXG5mdW5jdGlvbiBzbmFwT3V0KCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50bygkaXRlbSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDAsIHNjYWxlOiAwLjQsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCUgMFwiLCBlYXNlOiAnQmFjay5lYXNlSW4nfSk7XG59XG5mdW5jdGlvbiBzbmFwT3V0Um90YXRlKCRpdGVtKSB7XG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50bygkaXRlbSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDAsIHNjYWxlOiAwLjQsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCUgMFwiLCByb3RhdGlvbjogLTQ1LCBlYXNlOiAnQmFjay5lYXNlSW4nfSk7XG59XG5cblxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBnZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnM6IGZ1bmN0aW9uKCRpdGVtcykge1xuICAgICAgICB2YXIgaSA9IF8ucmFuZG9tKHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKHBlcnNvbmFsaXR5QW5pbWF0aW9uUGFpcnNbaV0sIGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgICAgcmV0dXJuIGZuYygkaXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldFJhbmRvbUNhbm5lZEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCRpdGVtcykge1xuICAgICAgICB2YXIgaSA9IF8ucmFuZG9tKGNhbm5lZEFuaW1hdGlvblBhaXJzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChjYW5uZWRBbmltYXRpb25QYWlyc1tpXSwgZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZm5jKCRpdGVtcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHBhcmFjaHV0ZXJzLCBwYXJhY2h1dGVyc0NvbnRhaW5lcjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBwYXJhY2h1dGVycyA9IF8uc2h1ZmZsZShbZ2V0QmxhY2tvdXQoKSwgZ2V0RHJpcCgpLCBnZXREeW5hbWl0ZSgpXSk7XG5cbiAgICBfLmVhY2gocGFyYWNodXRlcnMsIGZ1bmN0aW9uKHBhcmFjaHV0ZXIpIHtcbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDA7XG5cbiAgICAgICAgcGFyYWNodXRlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1ggPSAwLjU7XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WSA9IC0xO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0QmxhY2tvdXQoKSB7XG4gICAgdmFyIGJsYWNrb3V0SWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIik7XG4gICAgYmxhY2tvdXRJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAyNi82MSxcbiAgICAgICAgeTogMzMvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0JsYWNrb3V0JywgYmxhY2tvdXRJZGxlU3RhdGUpO1xufVxuZnVuY3Rpb24gZ2V0RHJpcCgpIHtcbiAgICB2YXIgZHJpcElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHJpcC5wbmdcIik7XG4gICAgZHJpcElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDM2LzYxLFxuICAgICAgICB5OiAyNi85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignRHJpcCcsIGRyaXBJZGxlU3RhdGUpO1xufVxuZnVuY3Rpb24gZ2V0RHluYW1pdGUoKSB7XG4gICAgdmFyIGR5bmFtaXRlSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9keW5hbWl0ZS5wbmdcIik7XG4gICAgZHluYW1pdGVJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAyNy82MSxcbiAgICAgICAgeTogMzAvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0R5bmFtaXRlJywgZHluYW1pdGVJZGxlU3RhdGUpO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGFuaW1hdGVQYXJhY2h1dGVyKHBhcmFjaHV0ZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDM1O1xuXG4gICAgdmFyIGRlcHRoID0gTWF0aC5yYW5kb20oKSAqIDU7XG4gICAgdmFyIHggPSAwLjEgKyAoTWF0aC5yYW5kb20oKSAqIDAuOCk7XG4gICAgdmFyIHNjYWxlID0gMSAtIGRlcHRoICogMC4yLzU7XG5cbiAgICBwbGFjZUp1c3RPZmZzY3JlZW4ocGFyYWNodXRlcik7XG4gICAgcGFyYWNodXRlci53aW5kb3dYID0geDtcblxuICAgIHZhciByb3RhdGlvbiA9IDAuMztcblxuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDEsXG4gICAgICAgIGVhc2U6ICdTaW5lLmVhc2VPdXQnLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBhcmFjaHV0ZXIudmlzaWJpbGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGFyYWNodXRlci5zY2FsZSA9IHt4OiBzY2FsZSwgeTogc2NhbGV9O1xuICAgIHBhcmFjaHV0ZXIuZmlsdGVyc1swXS5ibHVyID0gZGVwdGggKiAzLzU7XG4gICAgcGFyYWNodXRlci5yb3RhdGlvbiA9IHJvdGF0aW9uO1xuXG4gICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pO1xufVxuZnVuY3Rpb24gc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pIHtcbiAgICB2YXIgc3dheVRpbWUgPSAxLjI7XG4gICAgdmFyIGRlYyA9IDAuMDM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgcm90YXRpb246IC1yb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCdcbiAgICB9KTtcbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0JyxcbiAgICAgICAgZGVsYXk6IHN3YXlUaW1lLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKHJvdGF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uIC0gZGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICAgICAgICBfLmVhY2gocGFyYWNodXRlcnMsIF8uYmluZChwYXJhY2h1dGVyc0NvbnRhaW5lci5hZGRDaGlsZCwgcGFyYWNodXRlcnNDb250YWluZXIpKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZChwYXJhY2h1dGVyc0NvbnRhaW5lcik7XG4gICAgfSksXG4gICAgYW5pbWF0ZU5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihwYXJhY2h1dGVycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgYW5pbWF0ZVBhcmFjaHV0ZXIocGFyYWNodXRlcnMuc2hpZnQoKSk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIF8uZWFjaChwYXJhY2h1dGVycywgZnVuY3Rpb24ocGFyYWNodXRlcikge1xuICAgICAgICAgICAgcGFyYWNodXRlci5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFthbmltYXRpb25Nb2R1bGVdLmNvbmNhdChPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgdmFyIGhlaWdodCA9IGNoYXJhY3Rlci5zY2FsZS55ICogY2hhcmFjdGVyLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xuXG4gICAgY2hhcmFjdGVyLndpbmRvd1kgPSAtKGhlaWdodC8yKS8kKHdpbmRvdykuaGVpZ2h0KCk7XG59OyIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9xdWVzdGlvbicpO1xuXG5cbnZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IFF1ZXN0aW9uXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbGxlY3Rpb247IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gcmVxdWlyZSgnLi9RdWVzdGlvbkNvbGxlY3Rpb24nKTtcblxuICAgIHZhciBjaGFyYWN0ZXJTZWxlY3QgPSByZXF1aXJlKCcuLi9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uJyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24nKTtcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24nKTtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKG51bSkge1xuICAgICAgICByZXR1cm4gXy5maXJzdChfLnNodWZmbGUocGVyc29uYWxpdHlRdWVzdGlvbkRhdGEucXVlc3Rpb25zKSwgbnVtKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGdldEVtcHR5Q2FubmVkUXVlc3Rpb25zKG51bSkge1xuICAgICAgICByZXR1cm4gXy5tYXAoXy5yYW5nZShudW0pLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBjYW5uZWRRdWVzdGlvbkRhdGEuY2xhc3MsXG4gICAgICAgICAgICAgICAgY29weTogY2FubmVkUXVlc3Rpb25EYXRhLmNvcHksXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Nhbm5lZC1xdWVzdGlvbicgKyBpLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cblxuXG4gICAgdmFyIGFsbFF1ZXN0aW9ucyA9IG5ldyBRdWVzdGlvbkNvbGxlY3Rpb24oKTtcblxuXG4gICAgLy9zaHVmZmxlIHF1ZXN0aW9ucyBhbmQgcGljayAzXG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25zID0gZ2V0UmFuZG9tUGVyc29uYWxpdHlRdWVzdGlvbnMoMyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9ucyA9IGdldEVtcHR5Q2FubmVkUXVlc3Rpb25zKDMpO1xuXG5cbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNoYXJhY3RlclNlbGVjdCk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChwZXJzb25hbGl0eVF1ZXN0aW9ucyk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChjYW5uZWRRdWVzdGlvbnMpO1xuXG5cblxuICAgIGZ1bmN0aW9uIGZpbHRlclVudXNlZChvcHRpb25zLCB1c2VkKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcihvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VkLmluZGV4T2Yob3B0aW9uLnZhbHVlKSA9PT0gLTE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFsbFF1ZXN0aW9ucy5nZXRVbnVzZWRDYW5uZWRPcHRpb25zID0gZnVuY3Rpb24obnVtLCB1c2VkKSB7XG4gICAgICAgIHZhciBwb3NzaWJsZU9wdGlvbnMgPSBfLnNodWZmbGUoZmlsdGVyVW51c2VkKGNhbm5lZFF1ZXN0aW9uRGF0YS5vcHRpb25zLCB1c2VkKSk7XG5cbiAgICAgICAgcmV0dXJuIF8uZmlyc3QocG9zc2libGVPcHRpb25zLCBudW0pO1xuICAgIH07XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gYWxsUXVlc3Rpb25zO1xufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ0b3RhbFNpemVcIjogMzI1NTY3NTEsXG5cdFwiYXNzZXRzXCI6IHtcblx0XHRcImFzc2V0cy9pbWcvMTUweDE1MC5naWZcIjogNTM3LFxuXHRcdFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIjogNjY4Nixcblx0XHRcImFzc2V0cy9pbWcvYnV0dG9uLnBuZ1wiOiAyNzA0Nyxcblx0XHRcImFzc2V0cy9pbWcvZHJpcC5wbmdcIjogOTI4OCxcblx0XHRcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCI6IDY0OTMsXG5cdFx0XCJhc3NldHMvaW1nL2Zvb3Rlci5wbmdcIjogODU0NDgsXG5cdFx0XCJhc3NldHMvaW1nL2ZvcmVncm91bmRfdHJlZXMucG5nXCI6IDI3ODYyNCxcblx0XHRcImFzc2V0cy9pbWcvaGVhZGVyLnBuZ1wiOiAxODI2ODEsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2JsYWRlX3Jhbmdlci5wbmdcIjogODM1NzAsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2NhYmJpZS5wbmdcIjogNzgyMTUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Nhbm5lZC1idG4ucG5nXCI6IDUyNjY2LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9kaXBwZXIucG5nXCI6IDkzNTk4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9kdXN0eS5wbmdcIjogOTc3MzQsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3ByaW50ZXIucG5nXCI6IDE1NTAsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3NlbmQtYnRuLnBuZ1wiOiAzMDcxNSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdGhlX3RlYW0ucG5nXCI6IDc0MzI2LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy92b2x1bWUucG5nXCI6IDMyMjAsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3dpbmRsaWZ0ZXIucG5nXCI6IDEwNTMyMyxcblx0XHRcImFzc2V0cy9pbWcvaW4tdGhlYXRlcnMucG5nXCI6IDQxMzAsXG5cdFx0XCJhc3NldHMvaW1nL2ludHJvLWJ0bS5wbmdcIjogMTc5MDYxLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby10b3AucG5nXCI6IDE3NjU1MSxcblx0XHRcImFzc2V0cy9pbWcvbG9nby5wbmdcIjogMjc2NzUsXG5cdFx0XCJhc3NldHMvaW1nL21pZGdyb3VuZC5wbmdcIjogMjAzNDIwLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kdXN0eS5qcGdcIjogMTk3NjQyLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9sZXR0ZXJfYmcuanBnXCI6IDc1NzEzLFxuXHRcdFwiYXNzZXRzL2ltZy9zaXRlX2JnLmpwZ1wiOiAxODQwNTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAyLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDMucG5nXCI6IDU1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNC5wbmdcIjogMTAwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNS5wbmdcIjogMTM4NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNi5wbmdcIjogOTI5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA3LnBuZ1wiOiAxMTU3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA4LnBuZ1wiOiAxNDA4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA5LnBuZ1wiOiAxNTQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEwLnBuZ1wiOiAxNjM5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDExLnBuZ1wiOiAxOTA4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEyLnBuZ1wiOiAxOTg2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEzLnBuZ1wiOiAyMDIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE0LnBuZ1wiOiAyMDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE1LnBuZ1wiOiAyMTIxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE2LnBuZ1wiOiAyMjY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE3LnBuZ1wiOiAyNDUwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE4LnBuZ1wiOiAyNTY4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE5LnBuZ1wiOiAyNzI3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIwLnBuZ1wiOiAyODg4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIxLnBuZ1wiOiAzMDQ1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIyLnBuZ1wiOiAzMTgwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIzLnBuZ1wiOiAzMzI1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI0LnBuZ1wiOiAzNDg3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI1LnBuZ1wiOiAzNjAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI2LnBuZ1wiOiAzNzEyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI3LnBuZ1wiOiAzODIyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI4LnBuZ1wiOiAzOTI0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI5LnBuZ1wiOiAzOTk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMwLnBuZ1wiOiA0MDM1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMxLnBuZ1wiOiA0MDkxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMyLnBuZ1wiOiA0MTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMzLnBuZ1wiOiA0MTYyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM0LnBuZ1wiOiA0MjE3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM1LnBuZ1wiOiA0MTA4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM2LnBuZ1wiOiA0MTY3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM3LnBuZ1wiOiA0MjM2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM4LnBuZ1wiOiA0MjYzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM5LnBuZ1wiOiA0MzcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQwLnBuZ1wiOiA0NDM4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQxLnBuZ1wiOiA0NDk4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQyLnBuZ1wiOiA0NTM0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQzLnBuZ1wiOiA0NjM1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ0LnBuZ1wiOiA0NjQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ1LnBuZ1wiOiA0NzQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ2LnBuZ1wiOiA0NzgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ3LnBuZ1wiOiA0ODMyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ4LnBuZ1wiOiA0OTg2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ5LnBuZ1wiOiA0OTgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUwLnBuZ1wiOiA1MDQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUxLnBuZ1wiOiA1MTMzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUyLnBuZ1wiOiA1MjAzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUzLnBuZ1wiOiA1MzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU0LnBuZ1wiOiA4Mjg2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU1LnBuZ1wiOiA4MDczLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU2LnBuZ1wiOiAxMzc5Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Ny5wbmdcIjogMjMxNzQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTgucG5nXCI6IDMwODUwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU5LnBuZ1wiOiAzNjEzMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2MC5wbmdcIjogMzgwOTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjEucG5nXCI6IDMzNDQ1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDYyLnBuZ1wiOiAyOTU3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2My5wbmdcIjogMzAzNzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjQucG5nXCI6IDI5NzA1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY1LnBuZ1wiOiAyOTg1NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2Ni5wbmdcIjogMjk3MDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjcucG5nXCI6IDMwMjU0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY4LnBuZ1wiOiAyOTU1Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2OS5wbmdcIjogMjk2NjEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzAucG5nXCI6IDI5NzIwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDcxLnBuZ1wiOiAyOTgxNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3Mi5wbmdcIjogMjk4MTAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzMucG5nXCI6IDI5NzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc0LnBuZ1wiOiAyOTUwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3NS5wbmdcIjogMjk3NjksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzYucG5nXCI6IDI5NjQxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc3LnBuZ1wiOiAyOTQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3OC5wbmdcIjogMjczOTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzkucG5nXCI6IDM3NjAyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgwLnBuZ1wiOiA1MDEzMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4MS5wbmdcIjogNTY0NjQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODIucG5nXCI6IDU2NDQ5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgzLnBuZ1wiOiA2MzEyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4NC5wbmdcIjogNTYzNDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODUucG5nXCI6IDMxNTg1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg2LnBuZ1wiOiAzNjE4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4Ny5wbmdcIjogMjQ3OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODgucG5nXCI6IDIzODY1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg5LnBuZ1wiOiAyNzkzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5MC5wbmdcIjogMzIwOTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTEucG5nXCI6IDM2OTQ4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDkyLnBuZ1wiOiA0MTE4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5My5wbmdcIjogNDQ0MjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTQucG5nXCI6IDQ4NDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk1LnBuZ1wiOiAzNTg3OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5Ni5wbmdcIjogMjgxMTUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTcucG5nXCI6IDI0NzIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk4LnBuZ1wiOiAyMjI1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5OS5wbmdcIjogMjA2MzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDAucG5nXCI6IDIxMDEwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAxLnBuZ1wiOiAxNjM3MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwMi5wbmdcIjogMTgxOTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDMucG5nXCI6IDE5ODkzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA0LnBuZ1wiOiAyMjQ3MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNS5wbmdcIjogMjQ1OTYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDYucG5nXCI6IDI1NTM0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA3LnBuZ1wiOiAyNzExOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwOC5wbmdcIjogMjYxMDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDkucG5nXCI6IDI5MTMxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEwLnBuZ1wiOiAzMzU1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMS5wbmdcIjogMzY0NzYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTIucG5nXCI6IDQxMDE1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEzLnBuZ1wiOiA0NDY4OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNC5wbmdcIjogNDU5NjQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTUucG5nXCI6IDQ0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE2LnBuZ1wiOiA0NjQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNy5wbmdcIjogNjk3ODMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTgucG5nXCI6IDI2NTg3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE5LnBuZ1wiOiAzMDk1Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEyMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTIxLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwMC5wbmdcIjogNDMxMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwMS5wbmdcIjogNDQzMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwMi5wbmdcIjogNDMwNjUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwMy5wbmdcIjogNDI4ODYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwNC5wbmdcIjogNDQxNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwNS5wbmdcIjogNDMwMTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwNi5wbmdcIjogNDM0NTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwNy5wbmdcIjogNDU3MzQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwOC5wbmdcIjogNDI2OTgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAwOS5wbmdcIjogNDI1MTIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAxMC5wbmdcIjogNDQ2OTEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2JsYWRlL0d1aWRlX0JsYWRlUmFuZ2VyX2JvZHlfOTcweDYwMF8wMDAxMS5wbmdcIjogNDIzOTksXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDAucG5nXCI6IDgzMjY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAxLnBuZ1wiOiA4NDI4Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMi5wbmdcIjogODQ3NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDMucG5nXCI6IDg1MTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA0LnBuZ1wiOiA4MzI2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNS5wbmdcIjogODQyODIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDYucG5nXCI6IDg0NzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA3LnBuZ1wiOiA4NTEwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwOC5wbmdcIjogODMyNjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDkucG5nXCI6IDg0MjgyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDEwLnBuZ1wiOiA4NDc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAxMS5wbmdcIjogODUxMDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDAucG5nXCI6IDY0MDcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAxLnBuZ1wiOiA2Mjk4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMi5wbmdcIjogNjU3NzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDMucG5nXCI6IDY2NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA0LnBuZ1wiOiA2NDA3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNS5wbmdcIjogNjI5ODMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDYucG5nXCI6IDY1NzczLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA3LnBuZ1wiOiA2NjY0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwOC5wbmdcIjogNjQwNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDkucG5nXCI6IDYyOTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDEwLnBuZ1wiOiA2NTc3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMS5wbmdcIjogNjY2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMC5wbmdcIjogMTI2NjIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDEucG5nXCI6IDEyNDI1Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDAyLnBuZ1wiOiAxMjQzMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMy5wbmdcIjogMTI2MDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDQucG5nXCI6IDEyNjYyMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA1LnBuZ1wiOiAxMjQyNTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwNi5wbmdcIjogMTI0MzAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDcucG5nXCI6IDEyNjAwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA4LnBuZ1wiOiAxMjY2MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwOS5wbmdcIjogMTI0MjUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMTAucG5nXCI6IDEyNDMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDExLnBuZ1wiOiAxMjYwMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMC5wbmdcIjogNTgxNjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMS5wbmdcIjogNTgwMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMi5wbmdcIjogNTc2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMy5wbmdcIjogNTgxMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNC5wbmdcIjogNTgxNjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNS5wbmdcIjogNTgwMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNi5wbmdcIjogNTc2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNy5wbmdcIjogNTgxMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwOC5wbmdcIjogNTgxNjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwOS5wbmdcIjogNTgwMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAxMC5wbmdcIjogNTc2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAxMS5wbmdcIjogNTgxMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDc3NjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAxLnBuZ1wiOiA3NzUwNyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMi5wbmdcIjogNzcyMjAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDc3MTYyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA0LnBuZ1wiOiA3Nzc1Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNS5wbmdcIjogNzg2NjcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDc3MzAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA3LnBuZ1wiOiA3Nzc5NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwOC5wbmdcIjogNzg2NzYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDc3OTIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDEwLnBuZ1wiOiA3NzU3Nixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMS5wbmdcIjogNzc4OTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDAucG5nXCI6IDIzMjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDEucG5nXCI6IDMyMDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDIucG5nXCI6IDEzOTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDMucG5nXCI6IDE1MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDQucG5nXCI6IDI3MjcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDUucG5nXCI6IDMxNDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDYucG5nXCI6IDM3NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDcucG5nXCI6IDQ0MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDgucG5nXCI6IDYwMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDkucG5nXCI6IDk0MTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTAucG5nXCI6IDExMTg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDExLnBuZ1wiOiAxNDM1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMi5wbmdcIjogMTYzMjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTMucG5nXCI6IDE5NzI5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE0LnBuZ1wiOiAyMjA0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNS5wbmdcIjogMjUxMTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTYucG5nXCI6IDI2NTUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE3LnBuZ1wiOiAyOTAxOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxOC5wbmdcIjogMzAyMDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTkucG5nXCI6IDMxMzAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIwLnBuZ1wiOiAzMTcxNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMS5wbmdcIjogMzIxMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjIucG5nXCI6IDMyODk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIzLnBuZ1wiOiAzMzIxMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNC5wbmdcIjogMzM3NDQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjUucG5nXCI6IDMzNjE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI2LnBuZ1wiOiAzMzQxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNy5wbmdcIjogMzM1OTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjgucG5nXCI6IDMzNTE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI5LnBuZ1wiOiAzMjU4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMC5wbmdcIjogMzIzMzUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzEucG5nXCI6IDMyMTQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMyLnBuZ1wiOiAzMTUzNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMy5wbmdcIjogMzA4NTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzQucG5nXCI6IDI5ODkxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM1LnBuZ1wiOiAyOTQyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNi5wbmdcIjogMjk0MTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzcucG5nXCI6IDI4MzgxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM4LnBuZ1wiOiAyODE0Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzOS5wbmdcIjogMjcyNjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDAucG5nXCI6IDI2NTY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQxLnBuZ1wiOiAyNjU2Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Mi5wbmdcIjogMjU4NzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDMucG5nXCI6IDI1MzU0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ0LnBuZ1wiOiAyNDU2NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NS5wbmdcIjogMjQyMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDYucG5nXCI6IDI0MTQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ3LnBuZ1wiOiAyMzYxMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OC5wbmdcIjogMjM2MzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDkucG5nXCI6IDIzODA5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUwLnBuZ1wiOiAyMzE3MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MS5wbmdcIjogMjMyNjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTIucG5nXCI6IDIzMjA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUzLnBuZ1wiOiAyMjc5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NC5wbmdcIjogMjMwNjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTUucG5nXCI6IDIzMzU1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU2LnBuZ1wiOiAyMzc3OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ny5wbmdcIjogMjQ3NDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTgucG5nXCI6IDI1ODc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU5LnBuZ1wiOiAyNjUyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MC5wbmdcIjogMjc2NjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjEucG5nXCI6IDI4Njg4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYyLnBuZ1wiOiAyOTU4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2My5wbmdcIjogMzAzOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjQucG5nXCI6IDMxMjk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY1LnBuZ1wiOiAzMjI0OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ni5wbmdcIjogMzM4OTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjcucG5nXCI6IDM1MzQ4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY4LnBuZ1wiOiAzNjIzNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OS5wbmdcIjogMzc1NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzAucG5nXCI6IDM5ODgwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcxLnBuZ1wiOiA0MTA5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Mi5wbmdcIjogNDIwMzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzMucG5nXCI6IDQyNDk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc0LnBuZ1wiOiA0NDU1Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NS5wbmdcIjogNDU0NDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzYucG5nXCI6IDQ2NzQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc3LnBuZ1wiOiA0ODY5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3OC5wbmdcIjogNDk4NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzkucG5nXCI6IDUxNzE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgwLnBuZ1wiOiA1Mzg2Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MS5wbmdcIjogNTQ1MjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODIucG5nXCI6IDU2NDk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgzLnBuZ1wiOiA1NjI5Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4NC5wbmdcIjogNTg4MjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODUucG5nXCI6IDU5NTk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg2LnBuZ1wiOiA2MDYzNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ny5wbmdcIjogNjI4OTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODgucG5nXCI6IDYzOTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg5LnBuZ1wiOiA2NjEwNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5MC5wbmdcIjogNjYzNDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTEucG5nXCI6IDY5MjA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkyLnBuZ1wiOiA2ODc2Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5My5wbmdcIjogNzA1ODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTQucG5nXCI6IDcwMjY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk1LnBuZ1wiOiA3MzMwMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Ni5wbmdcIjogNzU5MDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTcucG5nXCI6IDc3NTM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk4LnBuZ1wiOiA4MTYyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OS5wbmdcIjogODIyNzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDAucG5nXCI6IDg1MDU2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAxLnBuZ1wiOiA4NzA2MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMi5wbmdcIjogODgzNDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDMucG5nXCI6IDg4OTA0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA0LnBuZ1wiOiA5MzIwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNS5wbmdcIjogOTk3NzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDYucG5nXCI6IDEwMjg2MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNy5wbmdcIjogMTA5ODQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA4LnBuZ1wiOiAxMTIxNjksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDkucG5nXCI6IDExNTkxNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMC5wbmdcIjogMTE2OTAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTExLnBuZ1wiOiAxMjMzMjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTIucG5nXCI6IDEyNjM0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMy5wbmdcIjogMTMzNzQ5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE0LnBuZ1wiOiAxMzg3NzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTUucG5nXCI6IDE0Njk0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNi5wbmdcIjogMTU0MzIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE3LnBuZ1wiOiAxNTk0NzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTgucG5nXCI6IDE2NjIxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOS5wbmdcIjogMTcxNjIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIwLnBuZ1wiOiAxNzgyNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjEucG5nXCI6IDE4NTg4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMi5wbmdcIjogMTk3MjkxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIzLnBuZ1wiOiAyMDYxMjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjQucG5nXCI6IDIyNDY4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNS5wbmdcIjogMjM2NjM4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI2LnBuZ1wiOiAyNDI1OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjcucG5nXCI6IDI2MjE4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOC5wbmdcIjogMjc0ODA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI5LnBuZ1wiOiAyODU5NDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzAucG5nXCI6IDMwNzQzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMS5wbmdcIjogMzIzMjcwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMyLnBuZ1wiOiAzNTA1NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzMucG5nXCI6IDM3NjExNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNC5wbmdcIjogNDA1NTc0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM1LnBuZ1wiOiA0Mzc2NTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzYucG5nXCI6IDQ3NjQ4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNy5wbmdcIjogNDg0Mjg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM4LnBuZ1wiOiA1MzI5NDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzkucG5nXCI6IDU1NjEyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MC5wbmdcIjogNTk0NTQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQxLnBuZ1wiOiA2NDg0OTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDIucG5nXCI6IDcxMzc5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0My5wbmdcIjogNzMyOTI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ0LnBuZ1wiOiA3MDI5ODEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDUucG5nXCI6IDc1ODM4NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ni5wbmdcIjogNzQzNTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ3LnBuZ1wiOiA2ODQ5ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDgucG5nXCI6IDY3Mzk1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0OS5wbmdcIjogNjU1MTg2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUwLnBuZ1wiOiA2MTg2MzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTEucG5nXCI6IDU5OTc0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1Mi5wbmdcIjogNTUzODkwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUzLnBuZ1wiOiA1MjU5OTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTQucG5nXCI6IDUxMjAyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1NS5wbmdcIjogMzU0OTA2XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJkdXN0eVwiOiBcImFzc2V0cy9hdWRpby9kdXN0eS5tcDNcIixcbiAgICBcImJsYWRlcmFuZ2VyXCI6IFwiYXNzZXRzL2F1ZGlvL2JsYWRlLm1wM1wiLFxuICAgIFwiY2FiYmllXCI6IFwiYXNzZXRzL2F1ZGlvL011c3RhbmdfMjAxMl9TdGFydC5tcDNcIixcbiAgICBcImRpcHBlclwiOiBcImFzc2V0cy9hdWRpby9kaXBwZXIubXAzXCIsXG4gICAgXCJ3aW5kbGlmdGVyXCI6IFwiYXNzZXRzL2F1ZGlvL3dpbmRsaWZ0ZXIubXAzXCIsXG4gICAgXCJ0ZWFtXCI6IFwiYXNzZXRzL2F1ZGlvL1llbGxvd19HZW5lcmljX1N0YXJ0Lm1wM1wiXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiY2xhc3NcIjogXCJjYW5uZWRcIixcbiAgICBcImNvcHlcIjogXCJOb3cgdGhhdCB3ZSBrbm93IG1vcmUgYWJvdXQgeW91LCBpdCdzIHlvdXIgdHVybiB0byBhc2sgZmlyZSByYW5nZXIgc29tZSBxdWVzdGlvbnNcIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgam9iIGF0IFBpc3RvbiBQZWFrP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImpvYlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBkbyB5b3UgZmlnaHQgZm9yZXN0IGZpcmVzP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZvcmVzdGZpcmVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSGF2ZSB5b3UgYWx3YXlzIGJlZW4gYSBmaXJlZmlnaHRlcj9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmaXJlZmlnaHRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldobyBpcyB5b3VyIGJlc3QgZnJpZW5kP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJlc3RmcmllbmRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGVyZSBpcyB5b3VyIGZhdm9yaXRlIHBsYWNlIHRvIGZseT9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmYXZvcml0ZXBsYWNlXCJcbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJuYW1lXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY2xhc3NcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjb3B5XCI6IFwiV2hvIGRvIHlvdSB3YW50IHRvIHdyaXRlIHRvP1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkR1c3R5XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZHVzdHlcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJCbGFkZSBSYW5nZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJibGFkZXJhbmdlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkNhYmJpZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNhYmJpZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkRpcHBlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRpcHBlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ3aW5kbGlmdGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlIFRlYW1cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ0ZWFtXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgXCJyZXF1aXJlZFwiOiB0cnVlXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwicXVlc3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCdzIHlvdXIgZmF2b3JpdGUgY29sb3I/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJibHVlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3JhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJvcmFuZ2VcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJHcmVlblwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJZZWxsb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInllbGxvd1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlB1cnBsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicHVycGxlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWZvb2RcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1mb29kXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgZm9vZD9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQaXp6YVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGl6emFcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJY2UgQ3JlYW1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImljZWNyZWFtXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQnJvY2NvbGlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJyb2Njb2xpXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRnJlbmNoIEZyaWVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJmcmVuY2hmcmllc1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNoaWNrZW4gTnVnZ2V0c1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiY2hpY2tlbm51Z2dldHNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQQiZKXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwYmpcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtc3BvcnRcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1zcG9ydFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIHNwb3J0P1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkZvb3RiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb290YmFsbFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJhc2ViYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJiYXNlYmFsbFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvY2tleVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaG9ja2V5XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU3dpbW1pbmcvRGl2aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzd2ltbWluZ1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNvY2NlclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic29jY2VyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmFjaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyYWNpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJkdXN0eVwiIDoge1xuICAgICAgICBcImpvYlwiOiBcIkknbSBhIFNFQVQsIG9yIGEgU2luZ2xlLUVuZ2luZSBBaXIgVGFua2VyLCB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdC5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgY2FuIHNjb29wIHdhdGVyIGZyb20gbGFrZXMgYW5kIGRpdmUgaW50byB0aGUgZm9yZXN0IHRvIGRyb3AgdGhlIHdhdGVyIG9uIHdpbGRmaXJlcy4gU3BlZWQgY291bnRzIHdoZW4gYW4gYWlyIHJlc2N1ZSBpcyB1bmRlciB3YXksIHNvIEknbSBhbHdheXMgcmVhZHkgdG8gZmx5IGludG8gZGFuZ2VyIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiQmVmb3JlIGpvaW5pbmcgdGhlIEFpciBBdHRhY2sgVGVhbSwgSSB3YXMgYSB3b3JsZC1mYW1vdXMgYWlyIHJhY2VyIOKAkyBJIGV2ZW4gcmFjZWQgYXJvdW5kIHRoZSB3b3JsZCEgIE5vdyBJIHJhY2UgdG8gcHV0IG91dCBmaXJlcy4gXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIkl0IHdhc24ndCBlYXN5IGJlY29taW5nIGEgY2hhbXBpb24gcmFjZXIgb3IgYSBmaXJlZmlnaHRlciBidXQgSSd2ZSBoYWQgYW4gYW1hemluZyB0ZWFtIG9mIGZyaWVuZHMgd2l0aCBtZSBldmVyeSBzdGVwIG9mIHRoZSB3YXkhIFwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGhhdmUgYmVlbiBmbHlpbmcgZm9yIGFzIGxvbmcgYXMgSSBjYW4gcmVtZW1iZXIgYnV0IG15IGZhdm9yaXRlIHBsYWNlIHRvIGZseSBpcyBhYm92ZSBteSBob21ldG93biwgUHVtcHdhc2ggSnVuY3Rpb24uIEkgZG8gc29tZSBmYW5jeSBmbHlpbmcgdGhlcmUhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIkFueXRoaW5nJ3MgYmV0dGVyIHRvIGVhdCB0aGFuIFZpdGFtaW5hbXVsY2guIEVzcGVjaWFsbHkgJXRlbXBsYXRlJSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIk15IGZhdm9yaXRlIGNvbG9yIGlzIEdSRUVOLiBHcmVlbiBtZWFucyBnbyEgQW5kIEkgbG92ZSB0byBnbyBmYXN0LlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiQ29vbCEgWW91ciBmYXZvcml0ZSBzcG9ydCBpcyAldGVtcGxhdGUlIVwiXG4gICAgfSxcbiAgICBcImRpcHBlclwiOiB7XG4gICAgICAgIFwiam9iXCI6IFwiSSBoYXZlIGEgcmVhbGx5IGltcG9ydGFudCBqb2IgZmlnaHRpbmcgd2lsZGZpcmVzLiBJJ20gYSBTdXBlci1zY29vcGVyIHdpdGggdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtLlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBmaWdodCBmb3Jlc3QgZmlyZXMgaW4gc2V2ZXJhbCB3YXlzLiAgU29tZXRpbWVzIEkgZHJvcCByZXRhcmRhbnQgdG8gY29udGFpbiBhIGZpcmUuICBJIGNhbiBhbHNvIHNjb29wIHdhdGVyIGZyb20gdGhlIGxha2UgYW5kIGRyb3AgaXQgZGlyZWN0bHkgb24gdGhlIGZpcmUuIE15IGJvc3MgQmxhZGUgUmFuZ2VyIGNhbGxzIG1lIGEgTXVkLURyb3BwZXIhXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGhhdWwgY2FyZ28gdXAgaW4gQW5jaG9yYWdlLiBZZXAsIGEgbG90IG9mIGd1eXMgaW4gQWxhc2thLiBJIHdhcyBiZWF0aW5nIHRoZW0gb2ZmIHdpdGggYSBzdGljayFcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiTXkgYmVzdCBmcmllbmQgaXMgY2hhbXBpb24gcmFjZXIgRHVzdHkgQ3JvcGhvcHBlci4gSSdtIGhpcyBiaWdnZXN0IGZhbiFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiTXkgZmF2b3JpdGUgcGxhY2UgdG8gZmx5IGlzIHRoZSBGdXNlbCBMb2RnZSwgcmlnaHQgaGVyZSBpbiBQaXN0b24gUGVhay4gSXQncyBzbyBiZWF1dGlmdWwuIEFuZCB3aGVyZSBEdXN0eSBhbmQgSSBoYWQgb3VyIGZpcnN0IGRhdGUhIEl0IHdhcyBhIGRhdGUsIHJpZ2h0PyBJJ20gcHJldHR5IHN1cmUgaXQgd2FzIGEgZGF0ZS5cIlxuICAgIH0sXG4gICAgXCJ3aW5kbGlmdGVyXCI6IHtcbiAgICAgICAgXCJqb2JcIjogXCJJIGFtIGEgSGVhdnktTGlmdCBIZWxpY29wdGVyIHdpdGggdGhlIFBpc3RvbiBQZWFrIEFpciBBdHRhY2sgVGVhbSwgYW4gZWxpdGUgY3JldyBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnQuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiQmxhZGUgY2FsbHMgbWUgYSDigJxNdWQgRHJvcHBlcuKAnSBiZWNhdXNlIEkgaGF2ZSBhIGRldGFjaGFibGUgdGFuayBsb2FkZWQgd2l0aCBmaXJlIHJldGFyZGFudCB0byBoZWxwIHB1dCBvdXQgdGhlIGZpcmVzLiAgTXVkIGlzIHNsYW5nIGZvciByZXRhcmRhbnQuICBXaW5kbGlmdGVyIGNhbiBob2xkIG1vcmUgcmV0YXJkYW50IHRoYW4gYW55b25lIGVsc2Ugb24gdGhlIHRlYW0uXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJXaW5kbGlmdGVyIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gV2luZGxpZnRlciB1c2VkIHRvIGJlIGEgbHVtYmVyamFjaywgbGlmdGluZyBkb3plbnMgb2YgaGVhdnkgbG9ncyBhbmQgY2FycnlpbmcgdGhlbSB0byB0aGUgbHVtYmVyIG1pbGwuICBCdXQgbm93IEkgYW0gYSBmaXJlZmlnaHRlciBhbmQgdGhpcyBrZWVwcyBtZSB2ZXJ5IGJ1c3kuXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIldpbmRsaWZ0ZXIgd291bGQgbGlrZSB0byBiZSBZT1VSIGJlc3QgZnJpZW5kLlwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJXaW5kbGlmdGVyIGxpa2VzIHRvIGZseSBtYW55IHBsYWNlcyBhbmQgYmUgb25lIHdpdGggdGhlIHdpbmQuIFRoZSB3aW5kIHNwZWFrcywgV2luZGxpZnRlciBsaXN0ZW5zLlwiXG4gICAgfSxcbiAgICBcImJsYWRlXCI6IHtcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYSBGaXJlIGFuZCBSZXNjdWUgSGVsaWNvcHRlciwgYW5kIHRoZSBDb3B0ZXIgaW4gQ2hhcmdlIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2hlbiB0aGVyZSdzIGEgZmlyZSwgSSBnaXZlIHRoZSBvcmRlcnMgZm9yIHRoZSBBaXIgQXR0YWNrIFRlYW0gdG8gc3ByaW5nIGludG8gYWN0aW9uIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSd2ZSBiZWVuIHRoZSBDaG9wcGVyIENhcHRhaW4gZm9yIGEgbG9uZyB0aW1lLCBidXQgSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgd2FzIGEgVFYgc3RhciBvbiBhIHNob3cgYWJvdXQgcG9saWNlIGhlbGljb3B0ZXJzISBCdXQgSSByZWFsaXplZCBJIGRpZG4ndCB3YW50IHRvIHByZXRlbmQgdG8gc2F2ZSBsaXZlcywgSSB3YW50ZWQgdG8gc2F2ZSB0aGVtIGZvciByZWFsIVwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZHMgYXJlIGFsbCB0aGUgdHJhaWxibGF6ZXJzIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFdlIGxpa2UgdG8gdGhpbmsgb2Ygb3Vyc2VsdmVzIGFzIHRoZSBoZXJvZXMgb2YgdGhlIHNreSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBsaWtlIHRvIGZseSB0byBtYW55IHBsYWNlcywgYnV0IG15IGZhdm9yaXRlIHBsYWNlIGlzIGFib3ZlIFBpc3RvbiBQZWFrLiBJIHBhdHJvbCB0aGUgc2tpZXMgYW5kIG1ha2Ugc3VyZSBhbGwgdGhlIHRvdXJpc3RzIGFyZSBjYW1waW5nIGJ5IHRoZSBib29rLiBSZW1lbWJlciwgc2FmZXR5IGZpcnN0IVwiXG4gICAgfSxcbiAgICBcImNhYmJpZVwiOiB7XG4gICAgICAgIFwiam9iXCI6IFwiSSdtIGFuIGV4LW1pbGl0YXJ5IGNhcmdvIHBsYW5lIHdpdGggdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtIC0gZmlyZWZpZ2h0aW5nIGlzIGEgYmlnIHJlc3BvbnNpYmlsaXR5LlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBjYXJyeSB0aGUgU21va2VqdW1wZXJzIC0gd2hvIGNsZWFyIGZhbGxlbiB0cmVlcyBhbmQgZGVicmlzLiBEdXJpbmcgYSBmaXJlLCBJIGRyb3AgdGhlbSBmcm9tIHRoZSBza3ksIHJpZ2h0IG92ZXIgdGhlIGZsYW1lcy5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkndmUgYmVlbiB0aGUgQ2hvcHBlciBDYXB0YWluIGZvciBhIGxvbmcgdGltZSwgYnV0IEkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHdhcyBhIFRWIHN0YXIgb24gYSBzaG93IGFib3V0IHBvbGljZSBoZWxpY29wdGVycyEgQnV0IEkgcmVhbGl6ZWQgSSBkaWRuJ3Qgd2FudCB0byBwcmV0ZW5kIHRvIHNhdmUgbGl2ZXMsIEkgd2FudGVkIHRvIHNhdmUgdGhlbSBmb3IgcmVhbCFcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiTXkgYmVzdCBmcmllbmRzIGFyZSBhbGwgdGhlIHRyYWlsYmxhemVycyBoZXJlIGF0IFBpc3RvbiBQZWFrLiBXZSBsaWtlIHRvIHRoaW5rIG9mIG91cnNlbHZlcyBhcyB0aGUgaGVyb2VzIG9mIHRoZSBza3khXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkgbGlrZSB0byBmbHkgdG8gbWFueSBwbGFjZXMsIGJ1dCBteSBmYXZvcml0ZSBwbGFjZSBpcyBhYm92ZSBQaXN0b24gUGVhay4gSSBwYXRyb2wgdGhlIHNraWVzIGFuZCBtYWtlIHN1cmUgYWxsIHRoZSB0b3VyaXN0cyBhcmUgY2FtcGluZyBieSB0aGUgYm9vay4gUmVtZW1iZXIsIHNhZmV0eSBmaXJzdCFcIlxuICAgIH0sXG4gICAgXCJ0ZWFtXCI6IHtcbiAgICAgICAgXCJqb2JcIjogXCJUaGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtIGlzIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdHMuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2UgZmx5IGluIHdoZW4gb3RoZXJzIGFyZSBmbHlpbiBvdXQuIEl0IHRha2VzIGEgc3BlY2lhbCBraW5kYSBwbGFuZS5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkxpZmUgZG9lc24ndCBhbHdheXMgZ28gdGhlIHdheSB5b3UgZXhwZWN0IGl0LiBUaGlzIGlzIGEgc2Vjb25kIGNhcmVlciBmb3IgYWxsIG9mIHVzLiBcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgdGFrZXMgaG9ub3IsIHRydXN0IGFuZCBicmF2ZXJ5IHRvIGVhcm4geW91ciB3aW5ncy4gV2UgZG9uJ3QgaGF2ZSBqdXN0IG9uZSBiZXN0IGZyaWVuZCBiZWNhdXNlIHdlIG5lZWQgZXZlcnkgcGxhbmUgd2UndmUgZ290IHRvIGhlbHAuIFwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJQaXN0b24gUGVhayBoYXMgc29tZSBncmVhdCBwbGFjZXMgdG8gZmx5LiBCdXQgb3VyIGZhdm9yaXRlIHNwb3QgaXMgdGhlIHdvb2RlbiByYWlsd2F5IGJyaWRnZSAtIHdpdGggdGhlIHRodW5kZXJpbmcgV2hpdGV3YWxsIEZhbGxzIGJlaGluZCBpdC5cIlxuICAgIH1cbn0iLCJcblxuXG5cbi8vIGFkZHMgb3VyIGN1c3RvbSBtb2RpZmljYXRpb25zIHRvIHRoZSBQSVhJIGxpYnJhcnlcbnJlcXVpcmUoJy4vcGl4aS9saWJNb2RpZmljYXRpb25zJyk7XG5cblxuXG52YXIgTWFpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL21haW5WaWV3Jyk7XG52YXIgQXNzZXRMb2FkaW5nVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXNzZXRMb2FkaW5nVmlldycpO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQXBwICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFwcCA9IHt9O1xuXG5cblxuXG5cbi8vIGFmdGVyIGFzc2V0cyBsb2FkZWQgJiBqcXVlcnkgbG9hZGVkXG5hcHAucmVuZGVyID0gXy5hZnRlcigyLCBmdW5jdGlvbigpIHtcbiAgICBhcHAubWFpblZpZXcgPSBuZXcgTWFpblZpZXcoKTtcblxuICAgIGFwcC5tYWluVmlldy5zdGFydCgpO1xufSk7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEFzc2V0IExvYWRpbmcgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyICRwYXNzd29yZFNjcmVlbiA9ICQoJyNwYXNzd29yZFNjcmVlbicpO1xuXG5pZihkb2N1bWVudC5VUkwuaW5kZXhPZignZGlzbmV5LXBsYW5lczItYWlybWFpbC1zdGFnaW5nLmF6dXJld2Vic2l0ZXMubmV0JykgIT09IC0xKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJ2Rpc25leVBsYW5lc1R3byc7XG5cbiAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2lucHV0W3R5cGU9cGFzc3dvcmRdJyk7XG5cbiAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZigkcGFzc3dvcmRJbnB1dC52YWwoKSA9PT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmFkZU91dCg1MCk7XG5cbiAgICAgICAgICAgICAgICBhcHAuYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkaW5nVmlldyh7b25Db21wbGV0ZTogYXBwLnJlbmRlcn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRwYXNzd29yZFNjcmVlbi5zaG93KCk7XG5cbiAgICBjb25zb2xlLmxvZygkcGFzc3dvcmRTY3JlZW4pO1xufSBlbHNlIHtcbiAgICBhcHAuYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkaW5nVmlldyh7b25Db21wbGV0ZTogYXBwLnJlbmRlcn0pO1xuXG4gICAgJHBhc3N3b3JkU2NyZWVuLnJlbW92ZSgpO1xufVxuXG5cblxuJChmdW5jdGlvbigpIHtcbiAgICBGYXN0Q2xpY2suYXR0YWNoKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgYXBwLnJlbmRlcigpO1xufSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcblxuXG5cbiIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY29weTogJycsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICB9XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb247IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG4gICAgLy8gZGlzcGxheU9iamVjdCBzaG91bGQgYmUgYW4gaW5zdGFuY2Ugb2YgUElYSS5TcHJpdGUgb3IgUElYSS5Nb3ZpZUNsaXBcbiAgICB2YXIgQ2hhcmFjdGVyID0gZnVuY3Rpb24obmFtZSwgbW92aWVDbGlwKSB7XG4gICAgICAgIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpOyAvLyBQYXJlbnQgY29uc3RydWN0b3JcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlkbGUgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKG1vdmllQ2xpcCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SWRsZVN0YXRlKG1vdmllQ2xpcCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLnNldElkbGVTdGF0ZSA9IGZ1bmN0aW9uKHBpeGlTcHJpdGUpIHtcbiAgICAgICAgdGhpcy5pZGxlID0gcGl4aVNwcml0ZTtcblxuICAgICAgICBpZihwaXhpU3ByaXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgIHBpeGlTcHJpdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBwaXhpU3ByaXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgcGl4aVNwcml0ZS5nb3RvQW5kUGxheSgwKTsgIC8vc3RhcnQgY2xpcFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRDaGlsZChwaXhpU3ByaXRlKTsgICAvL2FkZCB0byBkaXNwbGF5IG9iamVjdCBjb250YWluZXJcbiAgICB9O1xuXG4gICAgLy9hZGQgbW92aWUgY2xpcCB0byBwbGF5IHdoZW4gY2hhcmFjdGVyIGNoYW5nZXMgdG8gc3RhdGVcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLmFkZFN0YXRlID0gZnVuY3Rpb24oc3RhdGUsIG1vdmllQ2xpcCkge1xuICAgICAgICBtb3ZpZUNsaXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlc1tzdGF0ZV0gPSBtb3ZpZUNsaXA7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobW92aWVDbGlwKTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIEFQSSBmdW5jdGlvbi4gV2FpdHMgdW50aWwgY3VycmVudCBzdGF0ZSBpcyBmaW5pc2hlZCBiZWZvcmUgc3dpdGNoaW5nIHRvIG5leHQgc3RhdGUuXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5nb1RvU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuXG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5zdGF0ZXNbc3RhdGVdKSkge1xuICAgICAgICAgICAgdGhyb3cgJ0Vycm9yOiBDaGFyYWN0ZXIgJyArIHRoaXMubmFtZSArICcgZG9lcyBub3QgY29udGFpbiBzdGF0ZTogJyArIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5pZGxlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZS5vbkNvbXBsZXRlID0gXy5iaW5kKHRoaXMuc3dhcFN0YXRlLCB0aGlzLCBzdGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIGFmdGVyIGN1cnJlbnQgYW5pbWF0aW9uIGZpbmlzaGVzIGdvIHRvIHRoaXMgc3RhdGUgbmV4dFxuICAgICAgICAgICAgdGhpcy5pZGxlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3dhcFN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgIC8vc3dpdGNoIGltbWVkaWF0ZWx5IGlmIGNoYXJhY3RlciBpZGxlIHN0YXRlIGlzIGEgc2luZ2xlIHNwcml0ZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGNoYW5nZXMgc3RhdGUgaW1tZWRpYXRlbHlcbiAgICAvLyBOT1RFOiBGdW5jdGlvbiBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgY2hhcmFjdGVyLmdvVG9TdGF0ZSgpXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5zd2FwU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuXG4gICAgICAgIHZhciBpZGxlU3RhdGUgPSB0aGlzLmlkbGU7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHRoaXMuc3RhdGVzW3N0YXRlXTtcblxuICAgICAgICBuZXdTdGF0ZS5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7ICAvL3N3aXRjaCBiYWNrIHRvIGlkbGUgYWZ0ZXIgcnVuXG4gICAgICAgICAgICBpZihpZGxlU3RhdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIG5ld1N0YXRlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIG5ld1N0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgIH07XG5cbiAgICAvL2FkZCBjYWxsYmFjayB0byBydW4gb24gY2hhcmFjdGVyIHVwZGF0ZVxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUub25VcGRhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9O1xuXG4gICAgLy8gY2FsbGVkIG9uIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGJ5IHdoYXRldmVyIFBpeGkgc2NlbmUgY29udGFpbnMgdGhpcyBjaGFyYWN0ZXJcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2soKTtcbiAgICB9O1xuXG5cblxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogRXh0ZW5kIGFuZCBFeHBvcnQgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gZXh0ZW5kcyBEaXNwbGF5IE9iamVjdCBDb250YWluZXJcbiAgICBleHRlbmQoUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLCBDaGFyYWN0ZXIpO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDaGFyYWN0ZXI7XG59KSgpOyIsIlxuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIHN1Yikge1xuICAgIC8vIEF2b2lkIGluc3RhbnRpYXRpbmcgdGhlIGJhc2UgY2xhc3MganVzdCB0byBzZXR1cCBpbmhlcml0YW5jZVxuICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvY3JlYXRlXG4gICAgLy8gZm9yIGEgcG9seWZpbGxcbiAgICAvLyBBbHNvLCBkbyBhIHJlY3Vyc2l2ZSBtZXJnZSBvZiB0d28gcHJvdG90eXBlcywgc28gd2UgZG9uJ3Qgb3ZlcndyaXRlXG4gICAgLy8gdGhlIGV4aXN0aW5nIHByb3RvdHlwZSwgYnV0IHN0aWxsIG1haW50YWluIHRoZSBpbmhlcml0YW5jZSBjaGFpblxuICAgIC8vIFRoYW5rcyB0byBAY2Nub2tlc1xuICAgIHZhciBvcmlnUHJvdG8gPSBzdWIucHJvdG90eXBlO1xuICAgIHN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2UucHJvdG90eXBlKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvcmlnUHJvdG8pICB7XG4gICAgICAgIHN1Yi5wcm90b3R5cGVba2V5XSA9IG9yaWdQcm90b1trZXldO1xuICAgIH1cblxuICAgIC8vIFJlbWVtYmVyIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB3YXMgc2V0IHdyb25nLCBsZXQncyBmaXggaXRcbiAgICBzdWIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViO1xuICAgIC8vIEluIEVDTUFTY3JpcHQ1KyAoYWxsIG1vZGVybiBicm93c2VycyksIHlvdSBjYW4gbWFrZSB0aGUgY29uc3RydWN0b3IgcHJvcGVydHlcbiAgICAvLyBub24tZW51bWVyYWJsZSBpZiB5b3UgZGVmaW5lIGl0IGxpa2UgdGhpcyBpbnN0ZWFkXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN1Yi5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzdWJcbiAgICB9KTtcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kOyIsIihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qXG4gICAgICogQ3VzdG9tIEVkaXRzIGZvciB0aGUgUElYSSBMaWJyYXJ5XG4gICAgICovXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFJlbGF0aXZlIFBvc2l0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dZID0gMDtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25YID0gZnVuY3Rpb24od2luZG93V2lkdGgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKHdpbmRvd1dpZHRoICogdGhpcy5fd2luZG93WCkgKyB0aGlzLl9idW1wWDtcbiAgICB9O1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWSA9IGZ1bmN0aW9uKHdpbmRvd0hlaWdodCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAod2luZG93SGVpZ2h0ICogdGhpcy5fd2luZG93WSkgKyB0aGlzLl9idW1wWTtcbiAgICB9O1xuXG4gICAgLy8gd2luZG93WCBhbmQgd2luZG93WSBhcmUgcHJvcGVydGllcyBhZGRlZCB0byBhbGwgUGl4aSBkaXNwbGF5IG9iamVjdHMgdGhhdFxuICAgIC8vIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgcG9zaXRpb24ueCBhbmQgcG9zaXRpb24ueVxuICAgIC8vIHRoZXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhIHZhbHVlIGJldHdlZW4gMCAmIDEgYW5kIHBvc2l0aW9uIHRoZSBkaXNwbGF5XG4gICAgLy8gb2JqZWN0IGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2luZG93IHdpZHRoICYgaGVpZ2h0IGluc3RlYWQgb2YgYSBmbGF0IHBpeGVsIHZhbHVlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1g7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1ggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKCR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1knLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBZID0gMDtcblxuICAgIC8vIGJ1bXBYIGFuZCBidW1wWSBhcmUgcHJvcGVydGllcyBvbiBhbGwgZGlzcGxheSBvYmplY3RzIHVzZWQgZm9yXG4gICAgLy8gc2hpZnRpbmcgdGhlIHBvc2l0aW9uaW5nIGJ5IGZsYXQgcGl4ZWwgdmFsdWVzLiBVc2VmdWwgZm9yIHN0dWZmXG4gICAgLy8gbGlrZSBob3ZlciBhbmltYXRpb25zIHdoaWxlIHN0aWxsIG1vdmluZyBhcm91bmQgYSBjaGFyYWN0ZXIuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKCR3aW5kb3cud2lkdGgoKSAqIHRoaXMuX3dpbmRvd1gpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAoJHdpbmRvdy5oZWlnaHQoKSAqIHRoaXMuX3dpbmRvd1kpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFNjYWxpbmcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbiAgICAvLyB3aW5kb3dTY2FsZSBjb3JyZXNwb25kcyB0byB3aW5kb3cgc2l6ZVxuICAgIC8vICAgZXg6IHdpbmRvd1NjYWxlID0gMC4yNSBtZWFucyAxLzQgc2l6ZSBvZiB3aW5kb3dcbiAgICAvLyBzY2FsZU1pbiBhbmQgc2NhbGVNYXggY29ycmVzcG9uZCB0byBuYXR1cmFsIHNwcml0ZSBzaXplXG4gICAgLy8gICBleDogc2NhbGVNaW4gPSAwLjUgbWVhbnMgc3ByaXRlIHdpbGwgbm90IHNocmluayB0byBtb3JlIHRoYW4gaGFsZiBvZiBpdHMgb3JpZ2luYWwgc2l6ZS5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dTY2FsZSA9IC0xO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNaW4gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNYXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVUeXBlID0gJ2NvbnRhaW4nO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlRm5jID0gTWF0aC5taW47XG5cbiAgICAvLyBXaW5kb3dTY2FsZTogdmFsdWUgYmV0d2VlbiAwICYgMSwgb3IgLTFcbiAgICAvLyBUaGlzIGRlZmluZXMgd2hhdCAlIG9mIHRoZSB3aW5kb3cgKGhlaWdodCBvciB3aWR0aCwgd2hpY2hldmVyIGlzIHNtYWxsZXIpXG4gICAgLy8gdGhlIG9iamVjdCB3aWxsIGJlIHNpemVkLiBFeGFtcGxlOiBhIHdpbmRvd1NjYWxlIG9mIDAuNSB3aWxsIHNpemUgdGhlIGRpc3BsYXlPYmplY3RcbiAgICAvLyB0byBoYWxmIHRoZSBzaXplIG9mIHRoZSB3aW5kb3cuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fd2luZG93U2NhbGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVHdvIHBvc3NpYmxlIHZhbHVlczogY29udGFpbiBvciBjb3Zlci4gVXNlZCB3aXRoIHdpbmRvd1NjYWxlIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHRha2UgdGhlXG4gICAgLy8gc21hbGxlciBib3VuZCAoY29udGFpbikgb3IgdGhlIGxhcmdlciBib3VuZCAoY292ZXIpIHdoZW4gZGVjaWRpbmcgY29udGVudCBzaXplIHJlbGF0aXZlIHRvIHNjcmVlbi5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3NjYWxlVHlwZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVR5cGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlVHlwZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zY2FsZUZuYyA9ICh2YWx1ZSA9PT0gJ2NvbnRhaW4nKSA/IE1hdGgubWluIDogTWF0aC5tYXg7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRTY2FsZSA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdmFyIGxvY2FsQm91bmRzID0gdGhpcy5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuX3dpbmRvd1NjYWxlICogdGhpcy5fc2NhbGVGbmMod2luZG93SGVpZ2h0L2xvY2FsQm91bmRzLmhlaWdodCwgd2luZG93V2lkdGgvbG9jYWxCb3VuZHMud2lkdGgpO1xuXG4gICAgICAgIC8va2VlcCBzY2FsZSB3aXRoaW4gb3VyIGRlZmluZWQgYm91bmRzXG4gICAgICAgIHNjYWxlID0gTWF0aC5tYXgodGhpcy5zY2FsZU1pbiwgTWF0aC5taW4oc2NhbGUsIHRoaXMuc2NhbGVNYXgpKTtcblxuXG4gICAgICAgIHRoaXMuc2NhbGUueCA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB0aGlzLnNjYWxlLnkgPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICB9O1xuXG5cbiAgICAvLyBVU0UgT05MWSBJRiBXSU5ET1dTQ0FMRSBJUyBBTFNPIFNFVFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWCA9IDE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVZID0gMTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogV2luZG93IFJlc2l6ZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIGZvciBlYWNoIGRpc3BsYXkgb2JqZWN0IG9uIHdpbmRvdyByZXNpemUsXG4gICAgLy8gYWRqdXN0aW5nIHRoZSBwaXhlbCBwb3NpdGlvbiB0byBtaXJyb3IgdGhlIHJlbGF0aXZlIHBvc2l0aW9ucyB3aW5kb3dYIGFuZCB3aW5kb3dZXG4gICAgLy8gYW5kIGFkanVzdGluZyBzY2FsZSBpZiBpdCdzIHNldFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX29uV2luZG93UmVzaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgod2lkdGgpO1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoaGVpZ2h0KTtcblxuICAgICAgICBpZih0aGlzLl93aW5kb3dTY2FsZSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmN0aW9uKGRpc3BsYXlPYmplY3QpIHtcbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3QuX29uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFNwcml0ZXNoZWV0IFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gdXNlZCB0byBnZXQgaW5kaXZpZHVhbCB0ZXh0dXJlcyBvZiBzcHJpdGVzaGVldCBqc29uIGZpbGVzXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIGNhbGw6IGdldEZpbGVOYW1lcygnYW5pbWF0aW9uX2lkbGVfJywgMSwgMTA1KTtcbiAgICAvLyBSZXR1cm5zOiBbJ2FuaW1hdGlvbl9pZGxlXzAwMS5wbmcnLCAnYW5pbWF0aW9uX2lkbGVfMDAyLnBuZycsIC4uLiAsICdhbmltYXRpb25faWRsZV8xMDQucG5nJ11cbiAgICAvL1xuICAgIGZ1bmN0aW9uIGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICB2YXIgbnVtRGlnaXRzID0gKHJhbmdlRW5kLTEpLnRvU3RyaW5nKCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICB2YXIgbnVtWmVyb3MgPSBudW1EaWdpdHMgLSBudW0udG9TdHJpbmcoKS5sZW5ndGg7ICAgLy9leHRyYSBjaGFyYWN0ZXJzXG4gICAgICAgICAgICB2YXIgemVyb3MgPSBuZXcgQXJyYXkobnVtWmVyb3MgKyAxKS5qb2luKCcwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlUHJlZml4ICsgemVyb3MgKyBudW0gKyAnLnBuZyc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFBJWEkuZ2V0VGV4dHVyZXMgPSBmdW5jdGlvbihmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICByZXR1cm4gXy5tYXAoZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgUElYSS5UZXh0dXJlLmZyb21GcmFtZSk7XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogTWVtb3J5IENsZWFudXAgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGRlc3Ryb3lCYXNlVGV4dHVyZSkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGRlc3Ryb3lCYXNlVGV4dHVyZSkpIGRlc3Ryb3lCYXNlVGV4dHVyZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHRoaXMudGV4dHVyZS5kZXN0cm95KGRlc3Ryb3lCYXNlVGV4dHVyZSk7XG4gICAgfTtcblxuICAgIFBJWEkuTW92aWVDbGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oZGVzdHJveUJhc2VUZXh0dXJlKSB7XG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQoZGVzdHJveUJhc2VUZXh0dXJlKSkgZGVzdHJveUJhc2VUZXh0dXJlID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgXy5lYWNoKHRoaXMudGV4dHVyZXMsIGZ1bmN0aW9uKHRleHR1cmUpIHtcbiAgICAgICAgICAgIHRleHR1cmUuZGVzdHJveShkZXN0cm95QmFzZVRleHR1cmUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG5cblxufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciBpbnRyb1ZpZGVvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRyb1ZpZGVvJyk7XG4gICAgdmFyIGJhY2tncm91bmRNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JhY2tncm91bmQnKTtcbiAgICB2YXIgYmxhZGV3aXBlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9ibGFkZXdpcGUnKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG4gICAgdmFyIHBhcmFjaHV0ZXJzTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYXJhY2h1dGVycycpO1xuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplSGVhZGVyRm9vdGVyKHNjZW5lKSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaGVhZGVyLnBuZycpO1xuXG4gICAgICAgIGhlYWRlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGhlYWRlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDApO1xuICAgICAgICBoZWFkZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgaGVhZGVyLndpbmRvd1kgPSAwO1xuXG4gICAgICAgIHZhciBmb290ZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9vdGVyLnBuZycpO1xuXG4gICAgICAgIGZvb3Rlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGZvb3Rlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgICAgIGZvb3Rlci53aW5kb3dYID0gMC41O1xuICAgICAgICBmb290ZXIud2luZG93WSA9IDE7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZm9vdGVyKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiogUHJpbWFyeSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBNYWluU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgU2NlbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmluaXRpYWxpemUoKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRCYWNrZ3JvdW5kVG9TY2VuZSh0aGlzKTtcbiAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRSZXN0VG9TY2VuZSh0aGlzKTtcblxuICAgICAgICBibGFkZXdpcGVNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG5cbiAgICAgICAgaW5pdGlhbGl6ZUhlYWRlckZvb3Rlcih0aGlzKTtcblxuICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIHRoaXMuaW50cm9WaWRlbyA9IGludHJvVmlkZW9Nb2R1bGUuZ2V0VmlkZW8oKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZUluVXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBhcmFsbGF4IFN0dWZmICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLnNoaWZ0QmFja2dyb3VuZExheWVycyh4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmlldzogZnVuY3Rpb24odmlldykge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgfSxcbiAgICAgICAgX29uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBTY2VuZS5wcm90b3R5cGUuX29uV2luZG93UmVzaXplLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMudmlldykpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLmludHJvVmlkZW8uc2NhbGU7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuaW50cm9WaWRlby5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Lm9uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQsIChib3VuZHMud2lkdGggKiBzY2FsZS54KSwgKGJvdW5kcy5oZWlnaHQgKiBzY2FsZS55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuXG5cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbiAgICAvLyBFeHRlbmRzIFNjZW5lIENsYXNzXG4gICAgZXh0ZW5kKFNjZW5lLCBNYWluU2NlbmUpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5TY2VuZTtcbn0pKCk7IiwiXG5cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxudmFyIFNjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNCID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgUElYSS5TdGFnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuU2NlbmUucHJvdG90eXBlID0ge1xuICAgIG9uVXBkYXRlOiBmdW5jdGlvbih1cGRhdGVDQikge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCID0gdXBkYXRlQ0I7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCKCk7XG4gICAgfSxcbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlc3VtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgfSxcbiAgICBpc1BhdXNlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlZDtcbiAgICB9XG59O1xuXG5cbmV4dGVuZChQSVhJLlN0YWdlLCBTY2VuZSk7XG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgU2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJyk7XG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIHZhciBTY2VuZXNNYW5hZ2VyID0ge1xuICAgICAgICBzY2VuZXM6IHt9LFxuICAgICAgICBjdXJyZW50U2NlbmU6IG51bGwsXG4gICAgICAgIHJlbmRlcmVyOiBudWxsLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCAkcGFyZW50RGl2KSB7XG5cbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyKSByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpZHRoLCBoZWlnaHQsIG51bGwsIHRydWUsIHRydWUpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcuc2V0QXR0cmlidXRlKCdpZCcsICdwaXhpLXZpZXcnKTtcbiAgICAgICAgICAgICRwYXJlbnREaXYuYXBwZW5kKFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldyk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKFNjZW5lc01hbmFnZXIubG9vcCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBsb29wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uICgpIHsgU2NlbmVzTWFuYWdlci5sb29wKCkgfSk7XG5cbiAgICAgICAgICAgIGlmICghU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgfHwgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUuaXNQYXVzZWQoKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS51cGRhdGUoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVuZGVyKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlU2NlbmU6IGZ1bmN0aW9uKGlkLCBTY2VuZUNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBTY2VuZUNvbnN0cnVjdG9yID0gU2NlbmVDb25zdHJ1Y3RvciB8fCBTY2VuZTsgICAvL2RlZmF1bHQgdG8gU2NlbmUgYmFzZSBjbGFzc1xuXG4gICAgICAgICAgICB2YXIgc2NlbmUgPSBuZXcgU2NlbmVDb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdID0gc2NlbmU7XG5cbiAgICAgICAgICAgIHJldHVybiBzY2VuZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ29Ub1NjZW5lOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkge1xuICAgICAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSkgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lID0gU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciByZXNpemUgdG8gbWFrZSBzdXJlIGFsbCBjaGlsZCBvYmplY3RzIGluIHRoZVxuICAgICAgICAgICAgICAgIC8vIG5ldyBzY2VuZSBhcmUgY29ycmVjdGx5IHBvc2l0aW9uZWRcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXN1bWUgbmV3IHNjZW5lXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucmVzdW1lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCJcblxuXG5cblxudmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxudmFyIHNvdW5kUGxheWVyID0ge1xuICAgIG11dGVkOiBmYWxzZSxcbiAgICB2b2x1bWU6IDAuNCxcbiAgICBzb3VuZHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXSA9IHRoaXMuc291bmRzW2ZpbGVQYXRoXSB8fCBuZXcgQXVkaW8oZmlsZVBhdGgpO1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5hZGQoZmlsZVBhdGgpO1xuXG4gICAgICAgIGlmKCF0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0udm9sdW1lID0gdGhpcy52b2x1bWU7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0ucGxheSgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheScsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXy5lYWNoKGF1ZGlvQXNzZXRzLCBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHNvdW5kUGxheWVyLmFkZChmaWxlUGF0aCk7XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc291bmRQbGF5ZXI7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZW1wdHktc3BhY2VcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5uYW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiIHZhbHVlPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBpZD1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj48L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudGV4dCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50ZXh0KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYm94LXNoYWRvd1xcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3B5KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcHkpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMSwgcHJvZ3JhbTEsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvYXNzZXRzLmpzb24nKTtcblxudmFyIGZpbGVOYW1lcyA9IE9iamVjdC5rZXlzKGFzc2V0RGF0YS5hc3NldHMpO1xudmFyIHRvdGFsRmlsZXMgPSBmaWxlTmFtZXMubGVuZ3RoO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy51cGRhdGUodGhpcy5sb2FkQ291bnQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBfLmJpbmQodmlldy5hc3NldHNMb2FkZWQsIHZpZXcpO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBWaWV3ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBBc3NldExvYWRpbmdWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnI2Fzc2V0TG9hZGVyJyxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJHRleHQgPSB0aGlzLiRlbC5maW5kKCc+IC50ZXh0Jyk7XG4gICAgICAgIHRoaXMuJHRleHQuaHRtbCgnMC4wMCUnKTtcblxuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IG9wdGlvbnMub25Db21wbGV0ZSB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgICAgc3RhcnRMb2FkZXIodGhpcyk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGxvYWRDb3VudCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwMDAgKiAodG90YWxGaWxlcy1sb2FkQ291bnQpL3RvdGFsRmlsZXMpLzEwMDtcblxuICAgICAgICB0aGlzLiR0ZXh0Lmh0bWwocGVyY2VudGFnZSArICclJyk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuXG4gICAgICAgIHRoaXMuJHRleHQuaGlkZSgpO1xuICAgICAgICB2YXIgJGVsID0gdGhpcy4kZWw7XG4gICAgICAgIFR3ZWVuTGl0ZS50bygkZWwsIDEuNCwge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRlbC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldExvYWRpbmdWaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleWRvd24gaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlcklubmVyID0gdGhpcy4kcGxhY2Vob2xkZXIuZmluZCgnPiBkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnZGl2LnRpdGxlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICBfLmJpbmRBbGwodGhpcywgJ3N0YXJ0QW5pbWF0aW9uJywnc2hvdycsJ2hpZGUnLCdzZXRJbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0U2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuc2NlbmVzWydtYWluJ107XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIFJ1biBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI3BpeGktdmlldycpLnJlbW92ZUNsYXNzKCdmcm9udCcpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnN0YXJ0RW50ZXJOYW1lQW5pbWF0aW9uKCk7ICAgLy9hbmltYXRlIGluIGNoYXJhY3RlcnNcblxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjM7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiR0aXRsZSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kbmFtZUlucHV0LCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxLCB5OiAwLCBlYXNlOiAnQmFjay5lYXNlT3V0JywgZGVsYXk6IDAuMTV9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJlQW5pbWF0aW9uU2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiR0aXRsZSwge29wYWNpdHk6IDAsIHk6IC03NX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRuYW1lSW5wdXQsIHtvcGFjaXR5OiAwfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIHtvcGFjaXR5OiAwLCB5OiAtNTB9KTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogU2hvdy9IaWRlICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgdGhpcy5wcmVBbmltYXRpb25TZXR1cCgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnN0YXJ0QW5pbWF0aW9uLCAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUub25BbmltYXRpb25PdXRDb21wbGV0ZSh0aGlzLnNldEluYWN0aXZlKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJGVsLCAwLjMsIHtvcGFjaXR5OiAwfSk7XG5cbiAgICAgICAgICAgIC8vcnVuIGhpZGUgYW5pbWF0aW9uXG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ2FubmVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25OYW1lQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy4kbmFtZUlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlci50b2dnbGUodmFsID09PSAnJyk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRlck5hbWVWaWV3O1xufSkoKTtcbiIsIlxuXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc291bmRQbGF5ZXIgPSByZXF1aXJlKCcuLi9zb3VuZFBsYXllcicpO1xuXG4gICAgdmFyIEZvb3RlclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2Zvb3RlcicsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEudm9sdW1lJzogJ29uVm9sdW1lVG9nZ2xlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5udW1Eb3RzID0gb3B0aW9ucy5udW1Eb3RzO1xuXG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb3VudGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocyA9IHRoaXMuJGVsLmZpbmQoJ2Eudm9sdW1lIHBhdGgnKTtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYuY291bnRlcicpO1xuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPbigpO1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT2ZmKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBudW1Eb3RzID0gdGhpcy5udW1Eb3RzO1xuXG4gICAgICAgICAgICB2YXIgJGRvdCA9IHRoaXMuJGRvdHMuZXEoMCk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDI7IGkgPD0gbnVtRG90czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRuZXdEb3QgPSAkZG90LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5maW5kKCc+IGRpdi5udW1iZXInKS5odG1sKGkpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuYXBwZW5kVG8odGhpcy4kY291bnRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gJGRvdDtcbiAgICAgICAgICAgICRkb3QuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiBWb2x1bWUgQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdG9nZ2xlVm9sdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSAhdGhpcy52b2x1bWVPbjtcblxuICAgICAgICAgICAgaWYodGhpcy52b2x1bWVPbikge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgICAgICBzb3VuZFBsYXllci5vbigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9mZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtzdGFydE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlbmRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVhc2luZzogJ0JhY2suZWFzZU91dCcsIG9wYWNpdHk6IDF9O1xuXG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDApLCAwLjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgxKSwgMC4yNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDIpLCAwLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBnZXRUaW1lbGluZVZvbHVtZU9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMSwwLDAsMSwwLDBdLCBlbmRNYXRyaXg6IFswLDAsMCwwLDIyLDMyXSwgZWFzaW5nOiAnQmFjay5lYXNlSW4nLCBvcGFjaXR5OiAwfTtcblxuICAgICAgICAgICAgLy9kZWZhdWx0IG9uXG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5hdHRyKCd0cmFuc2Zvcm0nLCAnbWF0cml4KDEsMCwwLDEsMCwwKScpO1xuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuY3NzKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgxKSwgMC4yNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDIpLCAwLjUsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZFN2Z1BhdGhBbmltYXRpb246IGZ1bmN0aW9uKHRpbWVsaW5lLCAkcGF0aCwgc3RhcnRUaW1lLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uU3BlZWQgPSAwLjI7XG5cbiAgICAgICAgICAgIHZhciBwYXRoTWF0cml4ID0gXy5jbG9uZShvcHRpb25zLnN0YXJ0TWF0cml4KTtcblxuICAgICAgICAgICAgdmFyIHR3ZWVuQXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgZWFzZTogb3B0aW9ucy5lYXNpbmcsXG4gICAgICAgICAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkcGF0aC5hdHRyKCd0cmFuc2Zvcm0nLCAnbWF0cml4KCcgKyBwYXRoTWF0cml4LmpvaW4oJywnKSArICcpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgXy5leHRlbmQodHdlZW5BdHRycywgb3B0aW9ucy5lbmRNYXRyaXgpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKCRwYXRoLCBhbmltYXRpb25TcGVlZCwge29wYWNpdHk6IG9wdGlvbnMub3BhY2l0eX0pLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHBhdGhNYXRyaXgsIGFuaW1hdGlvblNwZWVkLCB0d2VlbkF0dHJzKSwgYW5pbWF0aW9uU3BlZWQgKiBzdGFydFRpbWUpO1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogQ291bnRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzZXRDb3VudGVyOiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLiRkb3RzLmVxKGkpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdCA9IHRoaXMuJGRvdHMuZXEoaSk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGVDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIuaGlkZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwub3V0ZXJIZWlnaHQoKSArIHRoaXMuJGNvdW50ZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIG9uVm9sdW1lVG9nZ2xlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlVm9sdW1lKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBGb290ZXJWaWV3O1xufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vcGl4aS9zY2VuZXNNYW5hZ2VyJyk7XG5cbiAgICB2YXIgaW50cm9WaWRlb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm9WaWRlbycpO1xuXG4gICAgdmFyIEludHJvVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjaW50cm8tdmlldycsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEuYmVnaW4nOiAnb25CZWdpbkNsaWNrJ1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvblRpbWVsaW5lKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRTY2VuZSgpO1xuXG4gICAgICAgICAgICB0aGlzLiRiZWdpbkJ0bi5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5TY3JlZW4gPSB0aGlzLiRlbC5maW5kKCdkaXYuYmVnaW4tc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkxpbmVzID0gdGhpcy4kYmVnaW5TY3JlZW4uZmluZCgnZGl2LmxpbmUnKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuID0gdGhpcy4kYmVnaW5TY3JlZW4uZmluZCgnYS5iZWdpbicpO1xuXG4gICAgICAgICAgICB2YXIgJHZpZXdQb3J0cyA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi52aWV3cG9ydCcpO1xuXG4gICAgICAgICAgICB0aGlzLiR2aWV3UG9ydFRvcCA9ICR2aWV3UG9ydHMuZmlsdGVyKCcudG9wJyk7XG4gICAgICAgICAgICB0aGlzLiR2aWV3UG9ydEJvdHRvbSA9ICR2aWV3UG9ydHMuZmlsdGVyKCcuYnRtJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHZlcnRpY2FsU2lkZXMgPSAkdmlld1BvcnRzLmZpbmQoJy52ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgdGhpcy4kaG9yaXpvbnRhbFNpZGVzID0gJHZpZXdQb3J0cy5maW5kKCcuaG9yaXpvbnRhbCcpO1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZHMgPSAkdmlld1BvcnRzLmZpbmQoJy5iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRBbmltYXRpb25UaW1lbGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZSA9IHRoaXMuZ2V0VGltZWxpbmVIaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbiA9IHRoaXMuZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRTY2VuZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5zY2VuZXNbJ21haW4nXTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRWaWV3KHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dCZWdpblNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbjtcblxuICAgICAgICAgICAgc2V0VGltZW91dChfLmJpbmQodGltZWxpbmUucGxheSwgdGltZWxpbmUpLCAyMDApO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMC40O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdCYWNrLmVhc2VPdXQnO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5zID0gXy5tYXAodGhpcy4kYmVnaW5MaW5lcywgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2VlbkxpdGUudG8obGluZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0d2VlbnM6IHR3ZWVucyxcbiAgICAgICAgICAgICAgICBzdGFnZ2VyOiAwLjA4LFxuICAgICAgICAgICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luQnRuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMC43XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRiZWdpbkJ0bi5zaG93KCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJ0bkluVGltZSA9IDAuNDtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpbkJ0biwgMC42LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICBzY2FsZVk6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0VsYXN0aWMuZWFzZU91dCdcbiAgICAgICAgICAgIH0pLCBidG5JblRpbWUpO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpbkJ0biwgMC42LCB7XG4gICAgICAgICAgICAgICAgc2NhbGVYOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lICsgKGFuaW1hdGlvblRpbWUgKiAwLjA1KSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFRpbWVsaW5lSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKiBUaW1lbGluZSAqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5vbkFuaW1hdGlvbkZpbmlzaGVkLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGVTY29wZTogdGhpc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5TY3JlZW4sIGFuaW1hdGlvblRpbWUvNCwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kdmlld1BvcnRUb3AsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB0b3A6ICctNTAlJyxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kdmlld1BvcnRCb3R0b20sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICBib3R0b206ICctNTAlJyxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW5hY3RpdmUoKTtcblxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2soKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRBY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2luYWN0aXZlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEluYWN0aXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdpbmFjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50cyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAgICAgb25CZWdpbkNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24od2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmRzLndpZHRoKHZpZGVvV2lkdGggKiAxLjI3NSB8IDApO1xuICAgICAgICAgICAgdGhpcy4kaG9yaXpvbnRhbFNpZGVzLmhlaWdodCgoKHdpbmRvd0hlaWdodCAtIHZpZGVvSGVpZ2h0KS8yICsgMSkgfCAwKTsgLy9yb3VuZCB1cFxuICAgICAgICAgICAgdGhpcy4kdmVydGljYWxTaWRlcy53aWR0aCgoKHdpbmRvd1dpZHRoIC0gdmlkZW9XaWR0aCkvMiArIDEpIHwgMCk7IC8vcm91bmQgdXBcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XG5cbiAgICAgICAgICAgICQoJyNwaXhpLXZpZXcnKS5hZGRDbGFzcygnZnJvbnQnKTtcblxuICAgICAgICAgICAgaW50cm9WaWRlb01vZHVsZS5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dCZWdpblNjcmVlbiwgdGhpcykpO1xuICAgICAgICAgICAgaW50cm9WaWRlb01vZHVsZS5wbGF5VmlkZW8oKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbnRyb1ZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IHJlcXVpcmUoJy4uL3BpeGkvbWFpblNjZW5lJyk7XG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDb2xsZWN0aW9ucyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zJyk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gVmlld3Mgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIEludHJvVmlldyA9IHJlcXVpcmUoJy4vaW50cm9WaWV3Jyk7XG4gICAgdmFyIEVudGVyTmFtZVZpZXcgPSByZXF1aXJlKCcuL2VudGVyTmFtZVZpZXcnKTtcbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IHJlcXVpcmUoJy4vc2VsZWN0Q2hhcmFjdGVyVmlldycpO1xuICAgIHZhciBSZXNwb25zZVZpZXcgPSByZXF1aXJlKCcuL3Jlc3BvbnNlVmlldycpO1xuICAgIHZhciBGb290ZXJWaWV3ID0gcmVxdWlyZSgnLi9mb290ZXJWaWV3Jyk7XG5cblxuICAgIGZ1bmN0aW9uIGdldFZhbHVlcyh2aWV3cykge1xuICAgICAgICByZXR1cm4gXy5tYXAodmlld3MsIGZ1bmN0aW9uKHZpZXcpIHtyZXR1cm4gdmlldy5tb2RlbC5hdHRyaWJ1dGVzLnZhbHVlOyB9KTtcbiAgICB9XG5cbiAgICB2YXIgTWFpblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdjbGljayBhLnNraXAnOiAnb25Ta2lwJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXggPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcblxuICAgICAgICAgICAgLy9jcmVhdGUgY2FudmFzIGVsZW1lbnRcbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuaW5pdGlhbGl6ZSh0aGlzLiR3aW5kb3cud2lkdGgoKSwgdGhpcy4kd2luZG93LmhlaWdodCgpLCB0aGlzLiRlbCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLmNyZWF0ZVNjZW5lKCdtYWluJywgTWFpblNjZW5lKTtcbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuZ29Ub1NjZW5lKCdtYWluJyk7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB2aWV3c1xuICAgICAgICAgICAgdGhpcy5pbml0SW50cm9WaWV3KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRQYWdlcygpO1xuXG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXJWaWV3KHtudW1Eb3RzOiB0aGlzLnBhZ2VzLmxlbmd0aH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcgPSBuZXcgUmVzcG9uc2VWaWV3KCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdFdpbmRvd0V2ZW50cygpO1xuXG4gICAgICAgICAgICAvL3NldHVwIG9wdGlvbnMgZm9yIGZpcnN0IGNhbm5lZCB2aWV3XG4gICAgICAgICAgICB0aGlzLmNhbm5lZFZpZXdzID0gXy5maWx0ZXIodGhpcy5wYWdlcywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MgPT09ICdjYW5uZWQnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFdpbmRvd0V2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cub24oJ3Jlc2l6ZScsIF8uYmluZCh0aGlzLnJlcG9zaXRpb25QYWdlTmF2LCB0aGlzKSk7XG4vL1xuLy8gICAgICAgICAgICBpZiAod2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2VvcmllbnRhdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3JpZW50YXRpb24nLCBldmVudC5iZXRhLCBldmVudC5nYW1tYSk7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2Vtb3Rpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW90aW9uJywgZXZlbnQuYWNjZWxlcmF0aW9uLnggKiAyLCBldmVudC5hY2NlbGVyYXRpb24ueSAqIDIpO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW96IG9yaWVudGF0aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJNb3pPcmllbnRhdGlvblwiLCBmdW5jdGlvbihvcmllbnRhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3onLCBvcmllbnRhdGlvbi54ICogNTAsIG9yaWVudGF0aW9uLnkgKiA1MCk7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRJbnRyb1ZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvVmlldyA9IG5ldyBJbnRyb1ZpZXcoKTtcblxuICAgICAgICAgICAgaW50cm9WaWV3Lm9uQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd0ZpcnN0UGFnZSwgdGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmludHJvVmlldyA9IGludHJvVmlldztcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0UGFnZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoYXJNb2RlbCA9IF8uZmlyc3QoYWxsUXVlc3Rpb25zLm1vZGVscyk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Nb2RlbHMgPSBfLnJlc3QoYWxsUXVlc3Rpb25zLm1vZGVscyk7XG5cbiAgICAgICAgICAgIHZhciBlbnRlck5hbWVWaWV3ID0gbmV3IEVudGVyTmFtZVZpZXcoKTtcbiAgICAgICAgICAgIHZhciBzZWxlY3RDaGFyVmlldyA9IG5ldyBTZWxlY3RDaGFyYWN0ZXJWaWV3KHttb2RlbDogY2hhck1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG5cbiAgICAgICAgICAgIHZhciBxdWVzdGlvblZpZXdzID0gXy5tYXAocXVlc3Rpb25Nb2RlbHMsIGZ1bmN0aW9uKHF1ZXN0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXN0aW9uVmlldyh7bW9kZWw6IHF1ZXN0aW9uTW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gW2VudGVyTmFtZVZpZXcsIHNlbGVjdENoYXJWaWV3XS5jb25jYXQocXVlc3Rpb25WaWV3cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5wYWdlcy1jdG4nKTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdiA9IHRoaXMuJHBhZ2VzQ29udGFpbmVyLmZpbmQoJ2Rpdi5wYWdlLW5hdicpO1xuICAgICAgICAgICAgdGhpcy4kbmV4dCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5uZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLiRmaW5pc2hTZW5kID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLmZpbmlzaC1zZW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHNraXAgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2Euc2tpcCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIENhbm5lZCBRdWVzdGlvbiBWaWV3IFN0dWZmICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZDogZnVuY3Rpb24oY2FubmVkVmlldykge1xuICAgICAgICAgICAgdmFyIHVzZWRPcHRpb25zID0gXy5jb21wYWN0KGdldFZhbHVlcyh0aGlzLmNhbm5lZFZpZXdzKSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gYWxsUXVlc3Rpb25zLmdldFVudXNlZENhbm5lZE9wdGlvbnMoMywgdXNlZE9wdGlvbnMpO1xuXG4gICAgICAgICAgICBjYW5uZWRWaWV3LnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIENoYW5nZSBWaWV3IEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dGaXJzdFBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlc1swXS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuJG5leHQuY3NzKCdvcGFjaXR5JywgMCk7XG4gICAgICAgICAgICB0aGlzLiRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdihmYWxzZSk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRuZXh0LCAwLjMsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dFBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgLy9oaWRlIGFjdGl2ZSBwYWdlXG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleCArIDFdO1xuXG4gICAgICAgICAgICBpZihuZXh0UGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3T3B0aW9uc1dpdGhVbnVzZWQobmV4dFBhZ2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gMCkgeyAvL2NoYXJhY3RlciBzZWxlY3QgcGFnZVxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93U2tpcCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVQYWdlLm9uSGlkZUNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dQYWdlQWZ0ZXJIaWRlLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUGFnZUluZGV4Kys7XG4gICAgICAgICAgICBhY3RpdmVQYWdlLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMucmVwb3NpdGlvblBhZ2VOYXYodHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNldENvdW50ZXIodGhpcy5hY3RpdmVQYWdlSW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93UGFnZUFmdGVySGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4LTFdO1xuICAgICAgICAgICAgaWYobGFzdFBhZ2UuaXNDYW5uZWQoKSkge1xuICAgICAgICAgICAgICAgIGxhc3RQYWdlLnJlbW92ZU9wdGlvbnMoKTsgICAvL2Nhbm5lZCBvcHRpb25zIGFyZSByZXBlYXRlZCBhbmQgc2hhcmUgdGhlIHNhbWUgSURcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaG93IG5leHQgcGFnZVxuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG5cbiAgICAgICAgICAgIG5leHRQYWdlLm9uU2hvd0NvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgbmV4dFBhZ2Uuc2hvdygpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gdGhpcy5wYWdlcy5sZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmlzaEJ0bigpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVNraXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2hvd0ZpbmlzaEJ0bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0LmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGZpbmlzaFNlbmQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEFuZFNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIuaGlkZUNvdW50ZXIoKTtcblxuICAgICAgICAgICAgdmFyIHBhZ2VNb2RlbHMgPSBfLm1hcCh0aGlzLnBhZ2VzLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UubW9kZWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VWaWV3LnNldFJlc3BvbnNlKHBhZ2VNb2RlbHMpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLm9uVXNlckNoYXJhY3Rlck91dChfLmJpbmQodGhpcy5zY2VuZS5wbGF5V2lwZXNjcmVlbiwgdGhpcy5zY2VuZSkpO1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5vbldpcGVzY3JlZW5Db21wbGV0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtZS5yZXNwb25zZVZpZXcuc2hvdygpO1xuICAgICAgICAgICAgICAgIG1lLnNjZW5lLnNob3dSZXNwb25zZSgpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlT3V0VXNlckNoYXJhY3RlcigpO1xuICAgICAgICB9LFxuICAgICAgICByZXBvc2l0aW9uUGFnZU5hdjogZnVuY3Rpb24oYW5pbWF0ZSkge1xuICAgICAgICAgICAgdmFyIGFjdGl2ZVBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgdmFyIHBpeGVsUG9zaXRpb24gPSAoYWN0aXZlUGFnZS4kZWwub2Zmc2V0KCkudG9wICsgYWN0aXZlUGFnZS4kZWwub3V0ZXJIZWlnaHQoKSk7XG5cbiAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSB0aGlzLiR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIHZhciB0b3BGcmFjID0gTWF0aC5taW4ocGl4ZWxQb3NpdGlvbi93aW5kb3dIZWlnaHQsICh3aW5kb3dIZWlnaHQgLSB0aGlzLmZvb3Rlci5oZWlnaHQoKSAtIHRoaXMuJHBhZ2VOYXYub3V0ZXJIZWlnaHQoKSkvd2luZG93SGVpZ2h0KTtcblxuICAgICAgICAgICAgdmFyIHBlcmNUb3AgPSAxMDAgKiB0b3BGcmFjICsgJyUnO1xuXG4gICAgICAgICAgICBpZighIWFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGFnZU5hdiwgMC4yLCB7dG9wOiBwZXJjVG9wLCBlYXNlOidRdWFkLmVhc2VJbk91dCd9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygndG9wJywgcGVyY1RvcCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBoaWRlU2tpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kc2tpcCwgMC4yLCB7Ym90dG9tOiAnMTAwJSd9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1NraXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHNraXAsIDAuMiwge2JvdHRvbTogMH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSB0aGlzLmludHJvVmlldztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpbnRyb1ZpZXcuc3RhcnQoKTsgLy9zdGFydCBpbnRyb1xuXG4gICAgICAgICAgICAgICAgLy90cmlnZ2VyIHdpbmRvdyByZXNpemVcbiAgICAgICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIG9uTmV4dDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZ1xuICAgICAgICAgICAgICAgIHx8IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdLm1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgPT09ICcnXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5hY3RpdmVQYWdlSW5kZXggPj0gKHRoaXMucGFnZXMubGVuZ3RoIC0gMSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkZpbmlzaDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZykgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLmZpbmlzaEFuZFNlbmQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Nb3VzZU1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaGlmdEJhY2tncm91bmRMYXllcnMoZS5wYWdlWC90aGlzLiR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2tpcDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2tpcCcsIHRoaXMuYW5pbWF0aW5nLCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCwgdGhpcy5wYWdlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuaW1hdGluZyB8fCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA+PSAodGhpcy5wYWdlcy5sZW5ndGggLSAxKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5WaWV3O1xuXG5cblxufSkoKTsiLCJcblxudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3F1ZXN0aW9uLmhicycpO1xudmFyIGl0ZW1BbmltYXRpb25zTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYWdlSXRlbXMnKTtcblxudmFyIFF1ZXN0aW9uVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAvLyBWYXJpYWJsZXNcbiAgICBjbGFzc05hbWU6ICdxdWVzdGlvbiBwYWdlJyxcbiAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIGlucHV0W3R5cGU9cmFkaW9dJzogJ29uUmFkaW9DaGFuZ2UnXG4gICAgfSxcbiAgICAvLyBGdW5jdGlvbnNcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAgICAgb3B0aW9ucy5wYXJlbnQuYXBwZW5kKHRoaXMuZWwpO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKHRoaXMubW9kZWwuYXR0cmlidXRlcy5jbGFzcyk7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucyA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5vcHRpb24nKTtcblxuICAgICAgICBpZih0aGlzLiRvcHRpb25zLmxlbmd0aCAhPT0gMClcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbnMoKTtcbiAgICB9LFxuICAgIGluaXRBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIGFuaW1hdGlvbnM7XG5cbiAgICAgICAgaWYodGhpcy5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICBhbmltYXRpb25zID0gaXRlbUFuaW1hdGlvbnNNb2R1bGUuZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluID0gYW5pbWF0aW9uc1swXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQgPSBhbmltYXRpb25zWzFdO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSW4udmFycy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy5zaG93Q2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0LnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy5oaWRlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH0sXG4gICAgc2V0QW5pbWF0aW9uSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgfSxcblxuXG4gICAgcmVtb3ZlT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHRoaXMuJG9wdGlvbnMucmVtb3ZlKCk7XG4gICAgfSxcbiAgICBzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdvcHRpb25zJywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy9yZWluaXRpYWxpemVcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucyA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5vcHRpb24nKTtcbiAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucygpO1xuICAgIH0sXG4gICAgaXNDYW5uZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuYXR0cmlidXRlcy5jbGFzcyA9PT0gJ2Nhbm5lZCc7XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuZWwuaW5uZXJIVE1MID09PSAnJylcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25Jbi5wbGF5KCk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQucGxheSgpO1xuICAgIH0sXG4gICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBvblNob3dDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciB0ZXh0ID0gJChlLmN1cnJlbnRUYXJnZXQpLnNpYmxpbmdzKCdkaXYudGV4dCcpLmh0bWwoKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7dmFsdWU6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyksIHRleHQ6IHRleHR9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciByZXNwb25zZU1hcCA9IHJlcXVpcmUoJy4uL2RhdGEvcmVzcG9uc2VNYXAuanNvbicpO1xuXG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjcmVzcG9uc2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhI3ByaW50dmVyc2lvbic6ICdwcmludCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ3Jlc3BvbnNlJywgUmVzcG9uc2VTY2VuZSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQgPSAkKCcjcmVzcG9uc2UtYmcnKTtcblxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgc2V0UmVzcG9uc2U6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgICAgICAgdmFyIG5hbWVNb2RlbCA9IG1vZGVsc1swXTtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXJNb2RlbCA9IG1vZGVsc1sxXTtcblxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5hZGRDbGFzcyhjaGFyYWN0ZXJNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcblxuICAgICAgICAgICAgdmFyIGFuc3dlcmVkUXVlc3Rpb25zID0gXy5maWx0ZXIoXy5yZXN0KG1vZGVscywgMiksIGZ1bmN0aW9uKG1vZGVsKSB7cmV0dXJuIG1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgIT09ICcnfSk7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aXRpb25lZFF1ZXN0aW9ucyA9IF8ucGFydGl0aW9uKGFuc3dlcmVkUXVlc3Rpb25zLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbC5hdHRyaWJ1dGVzLmNsYXNzICE9PSAnY2FubmVkJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1swXTtcbiAgICAgICAgICAgIHZhciBjYW5uZWRNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1sxXTtcblxuXG4gICAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gY2hhcmFjdGVyTW9kZWwuYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8vICoqKioqKioqIHNvcnQgaGVyZSAqKioqKioqKlxuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlSZXNwb25zZXMgPSBfLm1hcChwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuYXR0cmlidXRlcy5uYW1lXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgbW9kZWwuYXR0cmlidXRlcy50ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY2FubmVkUmVzcG9uc2VzID0gXy5tYXAoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc3BvbnNlICs9ICcgJyArIGNhbm5lZFJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBwZXJzb25hbGl0eVJlc3BvbnNlcy5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgICQoJyNjYXJkLWhlYWRlcicpLmZpbmQoJ3NwYW4nKS5odG1sKG5hbWVNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcbiAgICAgICAgICAgICQoJyNjYXJkLXNpbmNlcmVseScpLmZpbmQoJ3NwYW4nKS5odG1sKG5hbWVNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcbiAgICAgICAgICAgICQoJyNjYXJkLWJvZHknKS5odG1sKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoJyNjYXJkLWZyb20nKS5odG1sKGNoYXJhY3Rlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcbiAgICAgICAgICAgIC8vc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ3Jlc3BvbnNlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBwcmludDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICAgICAgfVxuXG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VWaWV3O1xufSkoKTsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIHNvdW5kUGxheWVyID0gcmVxdWlyZSgnLi4vc291bmRQbGF5ZXInKTtcbiAgICB2YXIgYXVkaW9Bc3NldHMgPSByZXF1aXJlKCcuLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gUXVlc3Rpb25WaWV3LmV4dGVuZCh7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgY2hhciA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgICAgIHZhciBmaWxlUGF0aCA9IGF1ZGlvQXNzZXRzW2NoYXJdO1xuXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5KGZpbGVQYXRoKTtcblxuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLnNldENoYXJhY3RlcihjaGFyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNlbGVjdENoYXJhY3RlclZpZXc7XG59KSgpOyIsIlwidXNlIHN0cmljdFwiO1xuLypnbG9iYWxzIEhhbmRsZWJhcnM6IHRydWUgKi9cbnZhciBiYXNlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9iYXNlXCIpO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3V0aWxzXCIpO1xudmFyIHJ1bnRpbWUgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3J1bnRpbWVcIik7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxudmFyIGNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn07XG5cbnZhciBIYW5kbGViYXJzID0gY3JlYXRlKCk7XG5IYW5kbGViYXJzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIYW5kbGViYXJzOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFZFUlNJT04gPSBcIjEuMy4wXCI7XG5leHBvcnRzLlZFUlNJT04gPSBWRVJTSU9OO3ZhciBDT01QSUxFUl9SRVZJU0lPTiA9IDQ7XG5leHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc+PSAxLjAuMCdcbn07XG5leHBvcnRzLlJFVklTSU9OX0NIQU5HRVMgPSBSRVZJU0lPTl9DSEFOR0VTO1xudmFyIGlzQXJyYXkgPSBVdGlscy5pc0FycmF5LFxuICAgIGlzRnVuY3Rpb24gPSBVdGlscy5pc0Z1bmN0aW9uLFxuICAgIHRvU3RyaW5nID0gVXRpbHMudG9TdHJpbmcsXG4gICAgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5mdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG59XG5cbmV4cG9ydHMuSGFuZGxlYmFyc0Vudmlyb25tZW50ID0gSGFuZGxlYmFyc0Vudmlyb25tZW50O0hhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbiwgaW52ZXJzZSkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoaW52ZXJzZSB8fCBmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnZlcnNlKSB7IGZuLm5vdCA9IGludmVyc2U7IH1cbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHN0cikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5wYXJ0aWFscywgIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gc3RyO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGFyZykge1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJNaXNzaW5nIGhlbHBlcjogJ1wiICsgYXJnICsgXCInXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSB8fCBmdW5jdGlvbigpIHt9LCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuLCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICAgIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGlmKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaTxqOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgZGF0YS5sYXN0ICA9IChpID09PSAoY29udGV4dC5sZW5ndGgtMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ldLCB7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcih2YXIga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmKGRhdGEpIHsgXG4gICAgICAgICAgICAgIGRhdGEua2V5ID0ga2V5OyBcbiAgICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtkYXRhOiBkYXRhfSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaSA9PT0gMCl7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBVdGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmICghVXRpbHMuaXNFbXB0eShjb250ZXh0KSkgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGxldmVsID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsID8gcGFyc2VJbnQob3B0aW9ucy5kYXRhLmxldmVsLCAxMCkgOiAxO1xuICAgIGluc3RhbmNlLmxvZyhsZXZlbCwgY29udGV4dCk7XG4gIH0pO1xufVxuXG52YXIgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IHsgMDogJ2RlYnVnJywgMTogJ2luZm8nLCAyOiAnd2FybicsIDM6ICdlcnJvcicgfSxcblxuICAvLyBTdGF0ZSBlbnVtXG4gIERFQlVHOiAwLFxuICBJTkZPOiAxLFxuICBXQVJOOiAyLFxuICBFUlJPUjogMyxcbiAgbGV2ZWw6IDMsXG5cbiAgLy8gY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgb2JqKSB7XG4gICAgaWYgKGxvZ2dlci5sZXZlbCA8PSBsZXZlbCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgY29uc29sZVttZXRob2RdLmNhbGwoY29uc29sZSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5leHBvcnRzLmxvZ2dlciA9IGxvZ2dlcjtcbmZ1bmN0aW9uIGxvZyhsZXZlbCwgb2JqKSB7IGxvZ2dlci5sb2cobGV2ZWwsIG9iaik7IH1cblxuZXhwb3J0cy5sb2cgPSBsb2c7dmFyIGNyZWF0ZUZyYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBvYmogPSB7fTtcbiAgVXRpbHMuZXh0ZW5kKG9iaiwgb2JqZWN0KTtcbiAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgdmFyIGxpbmU7XG4gIGlmIChub2RlICYmIG5vZGUuZmlyc3RMaW5lKSB7XG4gICAgbGluZSA9IG5vZGUuZmlyc3RMaW5lO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG5cbiAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIGlmIChsaW5lKSB7XG4gICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiA9IG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4Y2VwdGlvbjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi9iYXNlXCIpLkNPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSByZXF1aXJlKFwiLi9iYXNlXCIpLlJFVklTSU9OX0NIQU5HRVM7XG5cbmZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKFwiK2NvbXBpbGVySW5mb1sxXStcIikuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uOy8vIFRPRE86IFJlbW92ZSB0aGlzIGxpbmUgYW5kIGJyZWFrIHVwIGNvbXBpbGVQYXJ0aWFsXG5cbmZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk5vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZVwiKTtcbiAgfVxuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIHZhciBpbnZva2VQYXJ0aWFsV3JhcHBlciA9IGZ1bmN0aW9uKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7IHJldHVybiByZXN1bHQ7IH1cblxuICAgIGlmIChlbnYuY29tcGlsZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuICAgICAgcGFydGlhbHNbbmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB7IGRhdGE6IGRhdGEgIT09IHVuZGVmaW5lZCB9LCBlbnYpO1xuICAgICAgcmV0dXJuIHBhcnRpYWxzW25hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgdmFyIGNvbnRhaW5lciA9IHtcbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXTtcbiAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSBwcm9ncmFtKGksIGZuLCBkYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHByb2dyYW0oaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBjb21tb24pO1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBwYXJhbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgcHJvZ3JhbVdpdGhEZXB0aDogZW52LlZNLnByb2dyYW1XaXRoRGVwdGgsXG4gICAgbm9vcDogZW52LlZNLm5vb3AsXG4gICAgY29tcGlsZXJJbmZvOiBudWxsXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgbmFtZXNwYWNlID0gb3B0aW9ucy5wYXJ0aWFsID8gb3B0aW9ucyA6IGVudixcbiAgICAgICAgaGVscGVycyxcbiAgICAgICAgcGFydGlhbHM7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIHBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlU3BlYy5jYWxsKFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBuYW1lc3BhY2UsIGNvbnRleHQsXG4gICAgICAgICAgaGVscGVycyxcbiAgICAgICAgICBwYXJ0aWFscyxcbiAgICAgICAgICBvcHRpb25zLmRhdGEpO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGVudi5WTS5jaGVja1JldmlzaW9uKGNvbnRhaW5lci5jb21waWxlckluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtmdW5jdGlvbiBwcm9ncmFtV2l0aERlcHRoKGksIGZuLCBkYXRhIC8qLCAkZGVwdGggKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YV0uY29uY2F0KGFyZ3MpKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGFyZ3MubGVuZ3RoO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtV2l0aERlcHRoID0gcHJvZ3JhbVdpdGhEZXB0aDtmdW5jdGlvbiBwcm9ncmFtKGksIGZuLCBkYXRhKSB7XG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW0gPSBwcm9ncmFtO2Z1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgdmFyIG9wdGlvbnMgPSB7IHBhcnRpYWw6IHRydWUsIGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuXG4gIGlmKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gIH0gZWxzZSBpZihwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO2Z1bmN0aW9uIG5vb3AoKSB7IHJldHVybiBcIlwiOyB9XG5cbmV4cG9ydHMubm9vcCA9IG5vb3A7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBcIlwiICsgdGhpcy5zdHJpbmc7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNhZmVTdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmpzaGludCAtVzAwNCAqL1xudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBlc2NhcGUgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImI3gyNztcIixcbiAgXCJgXCI6IFwiJiN4NjA7XCJcbn07XG5cbnZhciBiYWRDaGFycyA9IC9bJjw+XCInYF0vZztcbnZhciBwb3NzaWJsZSA9IC9bJjw+XCInYF0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl0gfHwgXCImYW1wO1wiO1xufVxuXG5mdW5jdGlvbiBleHRlbmQob2JqLCB2YWx1ZSkge1xuICBmb3IodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDt2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9O1xufVxudmFyIGlzRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xufTtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgaWYgKHN0cmluZyBpbnN0YW5jZW9mIFNhZmVTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAoIXN0cmluZyAmJiBzdHJpbmcgIT09IDApIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gIHN0cmluZyA9IFwiXCIgKyBzdHJpbmc7XG5cbiAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7IiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpW1wiZGVmYXVsdFwiXTtcbiJdfQ==
