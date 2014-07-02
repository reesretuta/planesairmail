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
        "firefighter": "Before joining the Air Attack Team, I was a world-famous air racer - I even raced around the world!  Now I race to put out fires. ",
        "bestfriend": "It wasn't easy becoming a champion racer or a firefighter but I've had an amazing team of friends with me every step of the way! ",
        "favoriteplace": "I have been flying for as long as I can remember but my favorite place to fly is above my hometown, Pumpwash Junction. I do some fancy flying there!",
        "favorite-food": "Anything's better to eat than Vitaminamulch. Especially %template%!",
        "favorite-color": "My favorite color is GREEN. Green means go! And I love to go fast.",
        "favorite-sport": "The CHEETAH is my favorite animal because speed counts when an air rescue is under way."
    },
    "dipper": {
        "job": "I have a really important job fighting wildfires. I'm a Super-scooper with the Piston Peak Attack Team.",
        "forestfires": "I fight forest fires in several ways.  Sometimes I drop retardant to contain a fire.  I can also scoop water from the lake and drop it directly on the fire. My boss Blade Ranger calls me a Mud-Dropper!",
        "firefighter": "I wasn't always a firefighter. I used to haul cargo up in Anchorage. Yep, a lot of guys in Alaska. I was beating them off with a stick!",
        "bestfriend": "My best friend is champion racer Dusty Crophopper. I'm his biggest fan!",
        "favoriteplace": "My favorite place to fly is the Fusel Lodge, right here in Piston Peak. It's so beautiful. And where Dusty and I had our first date! It was a date, right? I'm pretty sure it was a date.",
        "favorite-food": "While I really like to eat %template%, there's nothing better than a fresh can of oil!",
        "favorite-color": "What's my favorite color? YELLOW like the sunshine.. and like ME!",
        "favorite-sport": "My favorite animal is the DOLPHIN. It dips in and out of the water, just like ME!"
    },
    "windlifter": {
        "job": "I am a Heavy-Lift Helicopter with the Piston Peak Air Attack Team, an elite crew of firefighting aircraft. ",
        "forestfires": "Blade calls me a “Mud Dropper” because I have a detachable tank loaded with fire retardant to help put out the fires.  Mud is slang for retardant.  Windlifter can hold more retardant than anyone else on the team.",
        "firefighter": "Windlifter wasn't always a firefighter. Windlifter used to be a lumberjack, lifting dozens of heavy logs and carrying them to the lumber mill.  But now I am a firefighter and this keeps me very busy.",
        "bestfriend": "Windlifter would like to be YOUR best friend.",
        "favoriteplace": "Windlifter likes to fly many places and be one with the wind. The wind speaks, Windlifter listens.",
        "favorite-food": "%template% is delicious! Have you tried it with a can of oil? That's Windlifter's favorite food.",
        "favorite-color": "Windlifter's favorite color is BLUE like the water and the sky.",
        "favorite-sport": "Windlifter spirit animal is the BEAR - like the Lakota, strong and silent."
    },
    "blade": {
        "job": "I'm a Fire and Rescue Helicopter, and the Copter in Charge here at Piston Peak. ",
        "forestfires": "When there's a fire, I give the orders for the Air Attack Team to spring into action!",
        "firefighter": "I've been the Chopper Captain for a long time, but I wasn't always a firefighter. I was a TV star on a show about police helicopters! But I realized I didn't want to pretend to save lives, I wanted to save them for real!",
        "bestfriend": "My best friends are all the trailblazers here at Piston Peak. We like to think of ourselves as the heroes of the sky!",
        "favoriteplace": "I like to fly to many places, but my favorite place is above Piston Peak. I patrol the skies and make sure all the tourists are camping by the book. Remember, safety first!",
        "favorite-food": "You say you like to eat %template%? I like that too. I also like a fresh can of oil.",
        "favorite-color": "My favorite color is RED, the color of Fire Safety.",
        "favorite-sport": "As the Chopper Captain, I soar above the V-6 Valley and scope out fires. I'd say the EAGLE is my favorite animal."
    },
    "cabbie": {
        "job": "I'm an ex-military cargo plane with the Piston Peak Attack Team - firefighting is a big responsibility.",
        "forestfires": "I carry the Smokejumpers - who clear fallen trees and debris. During a fire, I drop them from the sky, right over the flames.",
        "firefighter": "I wasn't always a firefighter. I used to drop airborne utility vehicles behind enemy lines during war. Now I drop Smokejumpers at Piston Peak.",
        "bestfriend": "Who's my best friend? That's probably Top Secret but I can say the Smokejumpers are my closest recruits.",
        "favoriteplace": "I've flown over many places in my time. My favorite spot is Anchor Lake - a long body of water with an anchor-shaped island.",
        "favorite-food": "In the military, %template% is rationed but I'll take as much fresh oil as I can get!",
        "favorite-color": "My favorite color is GREEN - it can help me hide above the pine trees.",
        "favorite-sport": "KANGAROOs are my favorite - They hop around carrying their cargo - a lot like me."
    },
    "team": {
        "job": "The Piston Peak Air Attack Team is an elite group of firefighting aircrafts. ",
        "forestfires": "We fly in when others are flyin out. It takes a special kinda plane.",
        "firefighter": "Life doesn't always go the way you expect it. This is a second career for all of us. ",
        "bestfriend": "It takes honor, trust and bravery to earn your wings. We don't have just one best friend because we need every plane we've got to help. ",
        "favoriteplace": "Piston Peak has some great places to fly. But our favorite spot is the wooden railway bridge - with the thundering Whitewall Falls behind it.",
        "favorite-food": "We eat %template% all the time and slurp it down with fresh cans of oil. HOIST!",
        "favorite-color": "We like all colors of the rainbow. But as a team, our favorite color is %template%, just like you!",
        "favorite-sport": "Here at Piston Peak, we are team. Like a pack of DOGs, we work together for a common goal. "
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
          
            var userName = (models[0].attributes.value == '') ? 'Friend' : models[0].attributes.value;
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
            }
            
            _.sortBy(cannedModels, function(model){
              return cannedOrder[model.attributes.value];
            });
            
            // _.sortBy(personalityModels, function(model){
            //   return personalityOrder[model.attributes.name];
            // });
            
            var personalityResponses = _.map(personalityModels, function(model)  {
              console.log(responseMap[character][model.attributes.name]);
              console.log(responseMap[character]);
              console.log('eher');
                return responseMap[character][model.attributes.name].replace('%template%', model.attributes.text);
            });

            var cannedResponses = _.map(cannedModels, function(model) {
                return responseMap[character][model.attributes.value];
            });

            response += ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ');

            $('#card-header').find('span').html(userName);
            $('#card-sincerely').find('span').html(userName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyb1ZpZGVvLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3BhZ2VJdGVtcy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYXJhY2h1dGVycy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wbGFjZUp1c3RPZmZzY3JlZW4uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL1F1ZXN0aW9uQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2F1ZGlvQXNzZXRzLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9yZXNwb25zZU1hcC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlXzhkMjAyNTVhLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9tb2RlbHMvcXVlc3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvY2hhcmFjdGVyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2V4dGVuZC5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9saWJNb2RpZmljYXRpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL21haW5TY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZXNNYW5hZ2VyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9zb3VuZFBsYXllci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvYXNzZXRMb2FkaW5nVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZW50ZXJOYW1lVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZm9vdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvaW50cm9WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9tYWluVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9yZXNwb25zZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3NlbGVjdENoYXJhY3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvYmFzZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9zYWZlLXN0cmluZy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBiYWNrZ3JvdW5kLCBtaWRkbGVncm91bmQsIGZvcmVncm91bmQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBiYWNrZ3JvdW5kID0gaW5pdEJhY2tncm91bmQoKTtcbiAgICBtaWRkbGVncm91bmQgPSBpbml0TWlkZGxlZ3JvdW5kKCk7XG4gICAgZm9yZWdyb3VuZCA9IGluaXRGb3JlZ3JvdW5kKCk7XG59XG5mdW5jdGlvbiBzZXRBdHRycyhzcHJpdGUpIHtcbiAgICBzcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuICAgIHNwcml0ZS53aW5kb3dYID0gMC41O1xuICAgIHNwcml0ZS53aW5kb3dZID0gMTtcblxuICAgIHNwcml0ZS5zY2FsZVR5cGUgPSAnY292ZXInO1xuICAgIHNwcml0ZS53aW5kb3dTY2FsZSA9IDEuMDY7XG59XG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZCgpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9zaXRlX2JnLmpwZycpO1xuXG4gICAgc2V0QXR0cnMoYmFja2dyb3VuZCk7XG5cbiAgICByZXR1cm4gYmFja2dyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRNaWRkbGVncm91bmQoKSB7XG4gICAgdmFyIG1pZGRsZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9taWRncm91bmQucG5nJyk7XG4gICAgc2V0QXR0cnMobWlkZGxlZ3JvdW5kKTtcbiAgICByZXR1cm4gbWlkZGxlZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdEZvcmVncm91bmQoKSB7XG4gICAgdmFyIGZvcmVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9yZWdyb3VuZF90cmVlcy5wbmcnKTtcbiAgICBzZXRBdHRycyhmb3JlZ3JvdW5kKTtcbiAgICByZXR1cm4gZm9yZWdyb3VuZDtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFkZEJhY2tncm91bmRUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbiAgICB9LFxuICAgIGFkZFJlc3RUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChtaWRkbGVncm91bmQpO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChmb3JlZ3JvdW5kKTtcbiAgICB9LFxuICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICB2YXIgYmFja2dyb3VuZFJhdGlvID0gMC43NTtcbiAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFJhdGlvID0gMS41O1xuICAgICAgICB2YXIgZm9yZWdyb3VuZFJhdGlvID0gMztcblxuICAgICAgICB2YXIgYmFja2dyb3VuZFggPSAwLjUgLSAoeCAtIDAuNSkgKiBiYWNrZ3JvdW5kUmF0aW8vNTA7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRYID0gMC41IC0gKHggLS41KSAqIG1pZGRsZWdyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgZm9yZWdyb3VuZFggPSAwLjUgLSAoeCAtLjUpICogZm9yZWdyb3VuZFJhdGlvLzUwO1xuXG4gICAgICAgIGJhY2tncm91bmQud2luZG93WCA9IGJhY2tncm91bmRYO1xuICAgICAgICBtaWRkbGVncm91bmQud2luZG93WCA9IG1pZGRsZWdyb3VuZFg7XG4gICAgICAgIGZvcmVncm91bmQud2luZG93WCA9IGZvcmVncm91bmRYO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGJhY2tncm91bmQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBtaWRkbGVncm91bmQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBmb3JlZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBiYWNrZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLmRlc3Ryb3koKTtcbiAgICAgICAgZm9yZWdyb3VuZC5kZXN0cm95KCk7XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB3aXBlc2NyZWVuVmlkZW8sIHZpZGVvVGltZWxpbmU7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICB3aXBlc2NyZWVuVmlkZW8gPSBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpO1xuICAgIHZpZGVvVGltZWxpbmUgPSBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh3aXBlc2NyZWVuVmlkZW8pO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpIHtcbiAgICB2YXIgdGV4dHVyZXMgPSBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODYnLCA0MDAsIDU1Nik7XG5cbiAgICB2YXIgd2lwZXNjcmVlblZpZGVvID0gbmV3IFBJWEkuTW92aWVDbGlwKHRleHR1cmVzKTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93U2NhbGUgPSAxO1xuICAgIHdpcGVzY3JlZW5WaWRlby5zY2FsZVR5cGUgPSAnY292ZXInO1xuXG4gICAgd2lwZXNjcmVlblZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIHdpcGVzY3JlZW5WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICByZXR1cm4gd2lwZXNjcmVlblZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmdvdG9BbmRTdG9wKHZhbHVlKTtcblxuLy8gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuLy8gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1t2YWx1ZSB8IDBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pO1xufVxuXG5mdW5jdGlvbiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmFyIGZwcyA9IDI0O1xuICAgIHZhciBudW1GcmFtZXMgPSB2aWRlby50ZXh0dXJlcy5sZW5ndGg7XG5cbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgdmFyIGVhc2luZyA9IG5ldyBTdGVwcGVkRWFzZShudW1GcmFtZXMpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTGl0ZSh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZpZGVvLnR3ZWVuRnJhbWUgPSAwO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG5cbiAgICB2YXIgZmFkZU91dFRpbWUgPSAwLjI7XG4gICAgdmFyIGZhZGVPdXRTdGFydCA9IHRpbWVsaW5lLmR1cmF0aW9uKCkgLSAwLjE7XG5cbiAgICB0aW1lbGluZS5hZGRMYWJlbCgnY2FsbGJhY2snLCB0aW1lbGluZS5kdXJhdGlvbigpIC0gMC4xKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odmlkZW8sIGZhZGVPdXRUaW1lLCB7XG4gICAgICAgIGFscGhhOiAwLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0J1xuICAgIH0pLCBmYWRlT3V0U3RhcnQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQod2lwZXNjcmVlblZpZGVvKTtcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIGhpZGVWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgfSxcbiAgICBvblZpZGVvQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUuYWRkKGNhbGxiYWNrLCAnY2FsbGJhY2snKTtcbiAgICB9XG59O1xuXG5cblxuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZXREdXN0eUlkbGVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0QmxhZGVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0Q2FiYmllVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAnLCAwLCAxMik7XG59XG5mdW5jdGlvbiBnZXRXaW5kbGlmdGVyVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAnLCAwLCAxMik7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBjaGFyLCBjaGFyYWN0ZXJOYW1lLCBhbGxDaGFyYWN0ZXJzLCBkaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGFsbENoYXJhY3RlcnMgPSB7XG4gICAgICAgIGR1c3R5OiBfLm9uY2UoaW5pdER1c3R5KSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IF8ub25jZShpbml0QmxhZGUpLFxuICAgICAgICBjYWJiaWU6IF8ub25jZShpbml0Q2FiYmllKSxcbiAgICAgICAgZGlwcGVyOiBfLm9uY2UoaW5pdERpcHBlciksXG4gICAgICAgIHdpbmRsaWZ0ZXI6IF8ub25jZShpbml0V2luZGxpZnRlcilcbiAgICB9O1xuXG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbn1cblxuZnVuY3Rpb24gaW5pdER1c3R5KCkge1xuICAgIHZhciBkdXN0eSA9IG5ldyBDaGFyYWN0ZXIoJ0R1c3R5Jyk7XG5cbiAgICB2YXIgZHVzdHlJZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldER1c3R5SWRsZVRleHR1cmVzKCkpO1xuICAgIGR1c3R5SWRsZUFuaW1hdGlvbi5hbmNob3IgPSB7eDogNDgwLzEyMDAsIHk6IDQwNS85ODN9O1xuICAgIGR1c3R5SWRsZUFuaW1hdGlvbi53aW5kb3dTY2FsZSA9IDAuNDI7XG5cbiAgICBkdXN0eS5zZXRJZGxlU3RhdGUoZHVzdHlJZGxlQW5pbWF0aW9uKTtcblxuICAgIGR1c3R5LndpbmRvd1kgPSAtMTtcblxuICAgIHJldHVybiBkdXN0eTtcbn1cbmZ1bmN0aW9uIGluaXRCbGFkZSgpIHtcbiAgICB2YXIgYmxhZGVJZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldEJsYWRlVGV4dHVyZXMoKSk7XG4gICAgYmxhZGVJZGxlQW5pbWF0aW9uLmFuY2hvciA9IHt4OiA0NTcvOTcwLCB5OiAzNDYvNjAwfTtcbiAgICBibGFkZUlkbGVBbmltYXRpb24ud2luZG93U2NhbGUgPSAwLjY7XG5cbiAgICB2YXIgYmxhZGUgPSBuZXcgQ2hhcmFjdGVyKCdCbGFkZScsIGJsYWRlSWRsZUFuaW1hdGlvbik7XG5cbiAgICBibGFkZS53aW5kb3dZID0gLTE7XG5cbiAgICByZXR1cm4gYmxhZGU7XG59XG5mdW5jdGlvbiBpbml0Q2FiYmllKCkge1xuICAgIHZhciBjYWJiaWVJZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldENhYmJpZVRleHR1cmVzKCkpO1xuICAgIGNhYmJpZUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDU0NS8xMjAwLCB5OiAzNTEvNjIyfTtcbiAgICBjYWJiaWVJZGxlQW5pbWF0aW9uLndpbmRvd1NjYWxlID0gMC42O1xuXG4gICAgdmFyIGNhYmJpZSA9IG5ldyBDaGFyYWN0ZXIoJ0NhYmJpZScsIGNhYmJpZUlkbGVBbmltYXRpb24pO1xuXG4gICAgY2FiYmllLndpbmRvd1kgPSAtMTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDk7XG5cbiAgICBjYWJiaWUuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgIHJldHVybiBjYWJiaWU7XG59XG5mdW5jdGlvbiBpbml0RGlwcGVyKCkge1xuICAgIHZhciBkaXBwZXJJZGxlU3RhdGUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkpO1xuICAgIGRpcHBlcklkbGVTdGF0ZS5hbmNob3IgPSB7eDogNTM5LzEyMDAsIHk6IDQzNS82Mzh9O1xuICAgIGRpcHBlcklkbGVTdGF0ZS53aW5kb3dTY2FsZSA9IDAuNjtcblxuICAgIHZhciBkaXBwZXIgPSBuZXcgQ2hhcmFjdGVyKCdEaXBwZXInLCBkaXBwZXJJZGxlU3RhdGUpO1xuXG4gICAgZGlwcGVyLndpbmRvd1kgPSAtMTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDk7XG5cbiAgICBkaXBwZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgIHJldHVybiBkaXBwZXI7XG59XG5mdW5jdGlvbiBpbml0V2luZGxpZnRlcigpIHtcbiAgICB2YXIgd2luZGxpZmVySWRsZVN0YXRlID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldFdpbmRsaWZ0ZXJUZXh0dXJlcygpKTtcbiAgICB3aW5kbGlmZXJJZGxlU3RhdGUuYW5jaG9yID0ge3g6IDAuNSwgeTogMC41fTtcbiAgICB3aW5kbGlmZXJJZGxlU3RhdGUud2luZG93U2NhbGUgPSAwLjU2O1xuXG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdXaW5kbGlmdGVyJywgd2luZGxpZmVySWRsZVN0YXRlKTtcbiAgICB3aW5kbGlmdGVyLndpbmRvd1kgPSAtMTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDA7XG5cbiAgICB3aW5kbGlmdGVyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG5cbiAgICByZXR1cm4gd2luZGxpZnRlcjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGFuaW1hdGVJbiwgYW5pbWF0ZU91dDtcblxudmFyIGFuaW1hdGlvbnNJbiA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkdXN0eTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2hhcik7XG4gICAgICAgICAgICBjaGFyLndpbmRvd1ggPSAwLjY7XG5cbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoY2hhcik7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhci53aW5kb3dYID0gLS40O1xuICAgICAgICAgICAgY2hhci53aW5kb3dZID0gMC43NTtcblxuICAgICAgICAgICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaGFyKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjM0LFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTYsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FiYmllOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjaGFyKTtcbiAgICAgICAgICAgIGNoYXIucm90YXRpb24gPSAwLjU1O1xuICAgICAgICAgICAgY2hhci53aW5kb3dYID0gMC40NjtcblxuICAgICAgICAgICAgY2hhci5zY2FsZS54ID0gMC44O1xuICAgICAgICAgICAgY2hhci5zY2FsZS55ID0gMC44O1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGNoYXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDc7XG5cbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoY2hhcik7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBzd2VlcFRpbWUgPSBhbmltYXRpb25UaW1lICogNy84O1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTUsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIuc2NhbGUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjaGFyKTtcbiAgICAgICAgICAgIGNoYXIucm90YXRpb24gPSAwLjU1O1xuICAgICAgICAgICAgY2hhci53aW5kb3dYID0gMC40NjtcblxuICAgICAgICAgICAgY2hhci5zY2FsZS54ID0gMC44O1xuICAgICAgICAgICAgY2hhci5zY2FsZS55ID0gMC44O1xuXG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGNoYXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDc7XG5cbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoY2hhcik7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zNCxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBzd2VlcFRpbWUgPSBhbmltYXRpb25UaW1lICogNy84O1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMTgsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIuc2NhbGUsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBkZWxheTogYW5pbWF0aW9uVGltZSAtIHN3ZWVwVGltZSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIHN3ZWVwVGltZSwge1xuICAgICAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGFuaW1hdGlvblRpbWUgLSBzd2VlcFRpbWUsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2luZGxpZnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oY2hhcik7XG4gICAgICAgICAgICBjaGFyLndpbmRvd1ggPSAwLjY7XG5cbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoY2hhcik7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMjIsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG52YXIgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuZnVuY3Rpb24gb25BbmltYXRpb25PdXRDb21wbGV0ZSgpIHtcblxuLy8gICAgY2hhci5kZXN0cm95KCk7XG4gICAgb25BbmltYXRpb25PdXRDYWxsYmFjaygpO1xufVxuXG52YXIgYW5pbWF0aW9uc091dCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluT3V0JztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1c3R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBUd2VlbkxpdGUudG8oY2hhciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMjUsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogLTAuNSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjI0LFxuICAgICAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQW5pbWF0aW9uT3V0Q29tcGxldGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjYWJiaWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjEsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGNoYXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7Ymx1cjogNH0pO1xuICAgICAgICB9LFxuICAgICAgICBkaXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAwLjEsXG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDb21wbGV0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgYmx1ckZpbHRlciA9IGNoYXIuZmlsdGVyc1swXTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7Ymx1cjogNH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aW5kbGlmdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WDogLTAuMyxcbiAgICAgICAgICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluJyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENvbXBsZXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUgKiA3LzgsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4xLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdCYWNrLmVhc2VJbidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogVGVhbSBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiB0ZWFtQW5pbWF0aW9uU2V0dXAoZHVzdHksIGJsYWRlLCBjYWJiaWUsIGRpcHBlciwgd2luZGxpZnRlcikge1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IER1c3R5IH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIGR1c3R5LndpbmRvd1kgPSAwLjM7XG4gICAgZHVzdHkud2luZG93WCA9IDEuMztcbiAgICBkdXN0eS5pZGxlLndpbmRvd1NjYWxlID0gMC4zO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IEJsYWRlIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIGJsYWRlLndpbmRvd1ggPSAtLjQ7XG4gICAgYmxhZGUud2luZG93WSA9IDAuNzU7XG4gICAgYmxhZGUuaWRsZS53aW5kb3dTY2FsZSA9IDAuNDtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDYWJiaWUgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNhYmJpZSk7XG4gICAgY2FiYmllLnJvdGF0aW9uID0gMC41NTtcbiAgICBjYWJiaWUud2luZG93WCA9IDAuNDY7XG4gICAgY2FiYmllLmlkbGUud2luZG93U2NhbGUgPSAwLjM7XG4gICAgY2FiYmllLmZpbHRlcnNbMF0uYmx1ciA9IDQ7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gRGlwcGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihkaXBwZXIpO1xuICAgIGRpcHBlci5yb3RhdGlvbiA9IDAuNTU7XG4gICAgZGlwcGVyLndpbmRvd1ggPSAwLjQ2O1xuICAgIGRpcHBlci5maWx0ZXJzWzBdLmJsdXIgPSAxO1xuICAgIGRpcHBlci5pZGxlLndpbmRvd1NjYWxlID0gMC41O1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBXaW5kbGlmdGVyIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB3aW5kbGlmdGVyLndpbmRvd1ggPSAxLjQ7XG4gICAgd2luZGxpZnRlci53aW5kb3dZID0gMC44O1xuICAgIHdpbmRsaWZ0ZXIuaWRsZS53aW5kb3dTY2FsZSA9IDAuMztcbiAgICB3aW5kbGlmdGVyLmZpbHRlcnNbMF0uYmx1ciA9IDQ7XG5cblxuICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoYmxhZGUpO1xuICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoZHVzdHkpO1xuICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoY2FiYmllKTtcbiAgICBkaXNwbGF5T2JqZWN0Q29udGFpbmVyLmFkZENoaWxkKGRpcHBlcik7XG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZCh3aW5kbGlmdGVyKTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZUluVGVhbSgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMztcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgZHVzdHkgPSBjaGFyWzBdO1xuICAgIHZhciBibGFkZSA9IGNoYXJbMV07XG4gICAgdmFyIGNhYmJpZSA9IGNoYXJbMl07XG4gICAgdmFyIGRpcHBlciA9IGNoYXJbM107XG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBjaGFyWzRdO1xuXG4gICAgdGVhbUFuaW1hdGlvblNldHVwKGR1c3R5LCBibGFkZSwgY2FiYmllLCBkaXBwZXIsIHdpbmRsaWZ0ZXIpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgc3RhZ2dlcjogMC4yNyxcbiAgICAgICAgYWxpZ246ICdzdGFydCcsXG4gICAgICAgIHR3ZWVuczogW1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMzQsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4yMSxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgd2luZG93WTogMC42OCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjgsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhibGFkZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNjQsXG4gICAgICAgICAgICAgICAgd2luZG93WDogMC4xNixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMixcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjY4LFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8od2luZGxpZnRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuNCxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAwLjgyLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgXVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlT3V0VGVhbSgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuODtcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluJztcblxuICAgIHZhciBkdXN0eSA9IGNoYXJbMF07XG4gICAgdmFyIGJsYWRlID0gY2hhclsxXTtcbiAgICB2YXIgY2FiYmllID0gY2hhclsyXTtcbiAgICB2YXIgZGlwcGVyID0gY2hhclszXTtcbiAgICB2YXIgd2luZGxpZnRlciA9IGNoYXJbNF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBzdGFnZ2VyOiAwLjI5LFxuICAgICAgICBhbGlnbjogJ3N0YXJ0JyxcbiAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHR3ZWVuczogW1xuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogJ0JhY2suZWFzZUluJ1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93WDogMC4yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oYmxhZGUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4zLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNSxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKGNhYmJpZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHdpbmRvd1k6IDAuMSxcbiAgICAgICAgICAgICAgICB3aW5kb3dYOiAtMC4zLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4yLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuMixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHdpbmRsaWZ0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dZOiAtMC4yLFxuICAgICAgICAgICAgICAgIHdpbmRvd1g6IDAuNixcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIF0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHVzdHkuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZChkaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcbiAgICB9KSxcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihjaGFyYWN0ZXJOYW1lID09PSAndGVhbScpIHtcbiAgICAgICAgICAgIGNoYXIgPSBbaW5pdER1c3R5KCksIGluaXRCbGFkZSgpLCBpbml0Q2FiYmllKCksIGluaXREaXBwZXIoKSwgaW5pdFdpbmRsaWZ0ZXIoKV07XG5cbiAgICAgICAgICAgIGFuaW1hdGVJblRlYW0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYXIgPSBhbGxDaGFyYWN0ZXJzW2NoYXJhY3Rlck5hbWVdKCk7XG5cbiAgICAgICAgYW5pbWF0ZUluID0gYW5pbWF0aW9uc0luW2NoYXJhY3Rlck5hbWVdO1xuICAgICAgICBhbmltYXRlT3V0ID0gYW5pbWF0aW9uc091dFtjaGFyYWN0ZXJOYW1lXTtcblxuICAgICAgICBhbmltYXRlSW4oKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihjaGFyYWN0ZXJOYW1lID09PSAndGVhbScpIHtcbiAgICAgICAgICAgIGFuaW1hdGVPdXRUZWFtKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYW5pbWF0ZU91dCgpO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgY2hhcmFjdGVyTmFtZSA9IGNoYXJhY3RlcjtcbiAgICB9LFxuICAgIGFsbENoYXJhY3RlcnM6IGFsbENoYXJhY3RlcnNcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBkdXN0eSwgZGlwcGVyLCB0aW1lbGluZUluLCB0aW1lbGluZU91dDtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZXREdXN0eUlkbGVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwJywgMCwgMTIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGR1c3R5ID0gaW5pdGlhbGl6ZUR1c3R5KCk7XG4gICAgZGlwcGVyID0gaW5pdGlhbGl6ZURpcHBlcigpO1xuXG4gICAgdGltZWxpbmVJbiA9IGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpO1xuICAgIHRpbWVsaW5lT3V0ID0gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplRHVzdHkoKSB7XG4gICAgdmFyIGR1c3R5ID0gbmV3IENoYXJhY3RlcignRHVzdHknKTtcblxuICAgIHZhciBkdXN0eUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSk7XG5cbiAgICBkdXN0eUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDY0MS8xMjAwLCB5OiAzNDAvNjM4fTtcblxuICAgIGR1c3R5LnNldElkbGVTdGF0ZShkdXN0eUlkbGVBbmltYXRpb24pO1xuXG4gICAgZHVzdHkud2luZG93U2NhbGUgPSAwLjQ3O1xuICAgIGR1c3R5LndpbmRvd1ggPSAwLjE4O1xuICAgIGR1c3R5LndpbmRvd1kgPSAtMTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDA7XG5cbiAgICBkdXN0eS5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgcmV0dXJuIGR1c3R5O1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplRGlwcGVyKCkge1xuICAgIHZhciBkaXBwZXIgPSBuZXcgQ2hhcmFjdGVyKCdEaXBwZXInKTtcblxuICAgIHZhciBkaXBwZXJJZGxlU3RhdGUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkpO1xuXG4gICAgZGlwcGVySWRsZVN0YXRlLnNjYWxlLnggPSAtMTtcbiAgICBkaXBwZXJJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiA1NzEvMTIwMCxcbiAgICAgICAgeTogNDEwLzYzOFxuICAgIH07XG5cbiAgICBkaXBwZXIuc2V0SWRsZVN0YXRlKGRpcHBlcklkbGVTdGF0ZSk7XG5cbiAgICBkaXBwZXIud2luZG93WCA9IDAuNzU7XG4gICAgZGlwcGVyLndpbmRvd1kgPSAtMTtcbiAgICBkaXBwZXIucm90YXRpb24gPSAtMC40MDtcblxuICAgIGRpcHBlci53aW5kb3dTY2FsZSA9IDg2NS8xMzY2O1xuICAgIGRpcHBlci5hbmltYXRpb25TY2FsZVggPSAwLjc7XG4gICAgZGlwcGVyLmFuaW1hdGlvblNjYWxlWSA9IDAuNztcblxuICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDEwO1xuXG4gICAgZGlwcGVyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG5cbiAgICByZXR1cm4gZGlwcGVyO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0ZSBJbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciB0aW1lbGluZUR1c3R5SW4gPSBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSk7XG5cbiAgICB0aW1lbGluZS5hZGQodGltZWxpbmVEdXN0eUluLnBsYXkoKSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KS5wbGF5KCksIHRpbWVsaW5lRHVzdHlJbi5kdXJhdGlvbigpKTtcblxuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKS5wbGF5KCksIDAuNCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUluKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIG9nQXR0cmlidXRlcyA9IF8ucGljayhkdXN0eSwgJ3dpbmRvd1gnLCAnd2luZG93U2NhbGUnKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZHVzdHkpO1xuICAgICAgICAgICAgXy5leHRlbmQoZHVzdHksIG9nQXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC41MixcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SG92ZXIoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDE7XG4gICAgdmFyIGVhc2luZyA9ICdRdWFkLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIHJlcGVhdDogLTFcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYnVtcFk6IC0xNSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYnVtcFk6IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEaXBwZXJJbihkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuMDtcbiAgICB2YXIgc3dlZXBTdGFydFRpbWUgPSBhbmltYXRpb25UaW1lICogMC4xMTtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgb2dBdHRyaWJ1dGVzID0gXy5waWNrKGRpcHBlciwgJ3dpbmRvd1gnLCAncm90YXRpb24nLCAnd2luZG93U2NhbGUnLCAnYW5pbWF0aW9uU2NhbGVYJywgJ2FuaW1hdGlvblNjYWxlWScpO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4oZGlwcGVyKTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGRpcHBlciwgb2dBdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4zMCxcbiAgICAgICAgZWFzZTogJ0JhY2suZWFzZU91dCdcbiAgICB9KSwgMCk7XG5cbiAgICAvL3N3ZWVwIHJpZ2h0XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WDogMC44NixcbiAgICAgICAgcm90YXRpb246IDAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCBzd2VlcFN0YXJ0VGltZSk7XG5cbiAgICAvLyBzY2FsZSB1cFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICBibHVyOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0ZSBPdXQgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBvbkFuaW1hdGlvbk91dENvbXBsZXRlID0gZnVuY3Rpb24oKXt9O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCkge1xuICAgIHZhciB0aW1lbGluZU91dCA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgIGRpcHBlci5kZXN0cm95KGZhbHNlKTtcbiAgICAgICAgICAgIGR1c3R5LmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgb25BbmltYXRpb25PdXRDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKS5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lT3V0LmFkZChnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KS5wbGF5KCksIDApO1xuXG4gICByZXR1cm4gdGltZWxpbmVPdXQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KGRpcHBlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS40LFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuNCxcbiAgICAgICAgd2luZG93WTogLTAuMyxcbiAgICAgICAgd2luZG93WDogMS4xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzIsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuNDtcbiAgICB2YXIgZWFzaW5nID0gJ0V4cG8uZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZHVzdHkuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuMyxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjMsXG4gICAgICAgIHdpbmRvd1k6IC0wLjEsXG4gICAgICAgIHdpbmRvd1g6IDAuNixcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGRpcHBlcik7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGR1c3R5KTtcbiAgICB9KSxcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZUluLnBsYXkoMCk7XG4gICAgfSxcbiAgICBhbmltYXRlT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZWxpbmVPdXQucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uSW5Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGltZWxpbmVJbi52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFtdLmNvbmNhdChhbmltYXRpb25Nb2R1bGUsIE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5mdW5jdGlvbiBnZXRJbnRyb1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAnLCAwLCAxMjIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgdmlkZW8sIHZpZGVvVGltZWxpbmU7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICB2aWRlbyA9IGluaXRpYWxpemVWaWRlbygpO1xuICAgIHZpZGVvVGltZWxpbmUgPSBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbyk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlbyhzY2VuZSkge1xuICAgIHZhciBpbnRyb1ZpZGVvID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldEludHJvVGV4dHVyZXMoKSk7XG5cbiAgICBpbnRyb1ZpZGVvLndpbmRvd1ggPSAwLjU7XG4gICAgaW50cm9WaWRlby53aW5kb3dZID0gMC41O1xuICAgIGludHJvVmlkZW8uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xuXG4gICAgaW50cm9WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgaW50cm9WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICBpbnRyb1ZpZGVvLnNjYWxlTWluID0gMTtcbiAgICBpbnRyb1ZpZGVvLnNjYWxlTWF4ID0gMjtcbiAgICBpbnRyb1ZpZGVvLndpbmRvd1NjYWxlID0gMC42O1xuXG4gICAgcmV0dXJuIGludHJvVmlkZW87XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKSB7XG5cbiAgICB2aWRlby5fdHdlZW5GcmFtZSA9IDA7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmlkZW8sICd0d2VlbkZyYW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1t2YWx1ZSB8IDBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHZpZGVvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHZpZGVvKTtcbiAgICB9LFxuICAgIGdldFZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvO1xuICAgIH0sXG4gICAgcGxheVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5wbGF5KDApO1xuICAgIH0sXG4gICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFtdLmNvbmNhdChhbmltYXRpb25Nb2R1bGUsIE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG52YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcblxuXG5cbnZhciBwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzID0gW1xuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBmYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0Um90YXRlKV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVRvcCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXRSb3RhdGUpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVRvcCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXVxuXTtcblxudmFyIGNhbm5lZEFuaW1hdGlvblBhaXJzID0gW1xuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV1cbl07XG5cblxuXG5mdW5jdGlvbiBzdGFnZ2VySXRlbXMoJGl0ZW1zKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICB0d2VlbnM6IF8ubWFwKCRpdGVtcywgdGhpcyksXG4gICAgICAgIHN0YWdnZXI6IDAuMDdcbiAgICB9KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKiogSW5kaXZpZHVhbCBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBmYWRlSW4oJGl0ZW0sIHByb3AsIGRpc3RhbmNlLCBlYXNpbmcpIHtcbiAgICB2YXIgZnJvbSA9IHtvcGFjaXR5OiAwfTtcbiAgICBmcm9tW3Byb3BdID0gZGlzdGFuY2U7XG5cbiAgICB2YXIgdG8gPSB7b3BhY2l0eTogMSwgZWFzZTogZWFzaW5nfTtcbiAgICB0b1twcm9wXSA9IDA7XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLmZyb21UbygkaXRlbSwgYW5pbWF0aW9uVGltZSwgZnJvbSwgdG8pO1xufVxuZnVuY3Rpb24gZmFkZUluTm9Nb3ZlbWVudCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgMCwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbkZyb21SaWdodCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgNzUsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBmYWRlSW5Gcm9tVG9wKCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3knLCAtNzUsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBib3VuY2VGYWRlSW5Gcm9tUmlnaHQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDc1LCAnQmFjay5lYXNlT3V0Jyk7XG59XG5mdW5jdGlvbiBib3VuY2VGYWRlSW5Gcm9tVG9wKCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3knLCAtNzUsICdCYWNrLmVhc2VPdXQnKTtcbn1cbmZ1bmN0aW9uIHJvdGF0ZUluTGVmdCgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUuZnJvbVRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7cm90YXRpb25ZOiAtOTAsIHRyYW5zZm9ybU9yaWdpbjpcImxlZnQgNTAlIC0xMDBcIn0sIHtyb3RhdGlvblk6IDB9KTtcbn1cblxuZnVuY3Rpb24gc25hcE91dCgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAwLCBzY2FsZTogMC40LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlIDBcIiwgZWFzZTogJ0JhY2suZWFzZUluJ30pO1xufVxuZnVuY3Rpb24gc25hcE91dFJvdGF0ZSgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAwLCBzY2FsZTogMC40LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlIDBcIiwgcm90YXRpb246IC00NSwgZWFzZTogJ0JhY2suZWFzZUluJ30pO1xufVxuXG5cblxuXG5cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgZ2V0UmFuZG9tUGVyc29uYWxpdHlBbmltYXRpb25zOiBmdW5jdGlvbigkaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBfLnJhbmRvbShwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzW2ldLCBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICAgIHJldHVybiBmbmMoJGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRSYW5kb21DYW5uZWRBbmltYXRpb25zOiBmdW5jdGlvbigkaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBfLnJhbmRvbShjYW5uZWRBbmltYXRpb25QYWlycy5sZW5ndGggLSAxKTtcblxuICAgICAgICByZXR1cm4gXy5tYXAoY2FubmVkQW5pbWF0aW9uUGFpcnNbaV0sIGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgICAgcmV0dXJuIGZuYygkaXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBwYXJhY2h1dGVycywgcGFyYWNodXRlcnNDb250YWluZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgcGFyYWNodXRlcnMgPSBfLnNodWZmbGUoW2dldEJsYWNrb3V0KCksIGdldERyaXAoKSwgZ2V0RHluYW1pdGUoKV0pO1xuXG4gICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuXG4gICAgICAgIHBhcmFjaHV0ZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dYID0gMC41O1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1kgPSAtMTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEJsYWNrb3V0KCkge1xuICAgIHZhciBibGFja291dElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCIpO1xuICAgIGJsYWNrb3V0SWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjYvNjEsXG4gICAgICAgIHk6IDMzLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdCbGFja291dCcsIGJsYWNrb3V0SWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldERyaXAoKSB7XG4gICAgdmFyIGRyaXBJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2RyaXAucG5nXCIpO1xuICAgIGRyaXBJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAzNi82MSxcbiAgICAgICAgeTogMjYvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0RyaXAnLCBkcmlwSWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldER5bmFtaXRlKCkge1xuICAgIHZhciBkeW5hbWl0ZUlkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCIpO1xuICAgIGR5bmFtaXRlSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjcvNjEsXG4gICAgICAgIHk6IDMwLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEeW5hbWl0ZScsIGR5bmFtaXRlSWRsZVN0YXRlKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAzNTtcblxuICAgIHZhciBkZXB0aCA9IE1hdGgucmFuZG9tKCkgKiA1O1xuICAgIHZhciB4ID0gMC4xICsgKE1hdGgucmFuZG9tKCkgKiAwLjgpO1xuICAgIHZhciBzY2FsZSA9IDEgLSBkZXB0aCAqIDAuMi81O1xuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHBhcmFjaHV0ZXIpO1xuICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IHg7XG5cbiAgICB2YXIgcm90YXRpb24gPSAwLjM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAxLFxuICAgICAgICBlYXNlOiAnU2luZS5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyLnZpc2liaWxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBhcmFjaHV0ZXIuc2NhbGUgPSB7eDogc2NhbGUsIHk6IHNjYWxlfTtcbiAgICBwYXJhY2h1dGVyLmZpbHRlcnNbMF0uYmx1ciA9IGRlcHRoICogMy81O1xuICAgIHBhcmFjaHV0ZXIucm90YXRpb24gPSByb3RhdGlvbjtcblxuICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKTtcbn1cbmZ1bmN0aW9uIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKSB7XG4gICAgdmFyIHN3YXlUaW1lID0gMS4yO1xuICAgIHZhciBkZWMgPSAwLjAzO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiAtcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgfSk7XG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCcsXG4gICAgICAgIGRlbGF5OiBzd2F5VGltZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihyb3RhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbiAtIGRlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBfLmJpbmQocGFyYWNodXRlcnNDb250YWluZXIuYWRkQ2hpbGQsIHBhcmFjaHV0ZXJzQ29udGFpbmVyKSk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQocGFyYWNodXRlcnNDb250YWluZXIpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVOZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYocGFyYWNodXRlcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGFuaW1hdGVQYXJhY2h1dGVyKHBhcmFjaHV0ZXJzLnNoaWZ0KCkpO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhcmFjaHV0ZXJzQ29udGFpbmVyLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBfLmVhY2gocGFyYWNodXRlcnMsIGZ1bmN0aW9uKHBhcmFjaHV0ZXIpIHtcbiAgICAgICAgICAgIHBhcmFjaHV0ZXIuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbYW5pbWF0aW9uTW9kdWxlXS5jb25jYXQoT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIHZhciBoZWlnaHQgPSBjaGFyYWN0ZXIuc2NhbGUueSAqIGNoYXJhY3Rlci5nZXRMb2NhbEJvdW5kcygpLmhlaWdodDtcblxuICAgIGNoYXJhY3Rlci53aW5kb3dZID0gLShoZWlnaHQvMikvJCh3aW5kb3cpLmhlaWdodCgpO1xufTsiLCJcblxuXG52YXIgUXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc3Rpb24nKTtcblxuXG52YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBRdWVzdGlvblxufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db2xsZWN0aW9uOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUXVlc3Rpb25Db2xsZWN0aW9uJyk7XG5cbiAgICB2YXIgY2hhcmFjdGVyU2VsZWN0ID0gcmVxdWlyZSgnLi4vZGF0YS9jaGFyYWN0ZXJTZWxlY3QuanNvbicpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uJyk7XG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9wZXJzb25hbGl0eVF1ZXN0aW9ucy5qc29uJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoXy5zaHVmZmxlKHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhLnF1ZXN0aW9ucyksIG51bSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXRFbXB0eUNhbm5lZFF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UobnVtKSwgZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjbGFzczogY2FubmVkUXVlc3Rpb25EYXRhLmNsYXNzLFxuICAgICAgICAgICAgICAgIGNvcHk6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jb3B5LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdjYW5uZWQtcXVlc3Rpb24nICsgaSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSBuZXcgUXVlc3Rpb25Db2xsZWN0aW9uKCk7XG5cblxuICAgIC8vc2h1ZmZsZSBxdWVzdGlvbnMgYW5kIHBpY2sgM1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9ucyA9IGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKDMpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbnMgPSBnZXRFbXB0eUNhbm5lZFF1ZXN0aW9ucygzKTtcblxuXG4gICAgYWxsUXVlc3Rpb25zLmFkZChjaGFyYWN0ZXJTZWxlY3QpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQocGVyc29uYWxpdHlRdWVzdGlvbnMpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2FubmVkUXVlc3Rpb25zKTtcblxuXG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJVbnVzZWQob3B0aW9ucywgdXNlZCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlZC5pbmRleE9mKG9wdGlvbi52YWx1ZSkgPT09IC0xO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhbGxRdWVzdGlvbnMuZ2V0VW51c2VkQ2FubmVkT3B0aW9ucyA9IGZ1bmN0aW9uKG51bSwgdXNlZCkge1xuICAgICAgICB2YXIgcG9zc2libGVPcHRpb25zID0gXy5zaHVmZmxlKGZpbHRlclVudXNlZChjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucywgdXNlZCkpO1xuXG4gICAgICAgIHJldHVybiBfLmZpcnN0KHBvc3NpYmxlT3B0aW9ucywgbnVtKTtcbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbFF1ZXN0aW9ucztcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidG90YWxTaXplXCI6IDMyNTU2NzUxLFxuXHRcImFzc2V0c1wiOiB7XG5cdFx0XCJhc3NldHMvaW1nLzE1MHgxNTAuZ2lmXCI6IDUzNyxcblx0XHRcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCI6IDY2ODYsXG5cdFx0XCJhc3NldHMvaW1nL2J1dHRvbi5wbmdcIjogMjcwNDcsXG5cdFx0XCJhc3NldHMvaW1nL2RyaXAucG5nXCI6IDkyODgsXG5cdFx0XCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiOiA2NDkzLFxuXHRcdFwiYXNzZXRzL2ltZy9mb290ZXIucG5nXCI6IDg1NDQ4LFxuXHRcdFwiYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZ1wiOiAyNzg2MjQsXG5cdFx0XCJhc3NldHMvaW1nL2hlYWRlci5wbmdcIjogMTgyNjgxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibGFkZV9yYW5nZXIucG5nXCI6IDgzNTcwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYWJiaWUucG5nXCI6IDc4MjE1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYW5uZWQtYnRuLnBuZ1wiOiA1MjY2Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZGlwcGVyLnBuZ1wiOiA5MzU5OCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZHVzdHkucG5nXCI6IDk3NzM0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wcmludGVyLnBuZ1wiOiAxNTUwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zZW5kLWJ0bi5wbmdcIjogMzA3MTUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3RoZV90ZWFtLnBuZ1wiOiA3NDMyNixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdm9sdW1lLnBuZ1wiOiAzMjIwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy93aW5kbGlmdGVyLnBuZ1wiOiAxMDUzMjMsXG5cdFx0XCJhc3NldHMvaW1nL2luLXRoZWF0ZXJzLnBuZ1wiOiA0MTMwLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby1idG0ucG5nXCI6IDE3OTA2MSxcblx0XHRcImFzc2V0cy9pbWcvaW50cm8tdG9wLnBuZ1wiOiAxNzY1NTEsXG5cdFx0XCJhc3NldHMvaW1nL2xvZ28ucG5nXCI6IDI3Njc1LFxuXHRcdFwiYXNzZXRzL2ltZy9taWRncm91bmQucG5nXCI6IDIwMzQyMCxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfZHVzdHkuanBnXCI6IDE5NzY0Mixcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfbGV0dGVyX2JnLmpwZ1wiOiA3NTcxMyxcblx0XHRcImFzc2V0cy9pbWcvc2l0ZV9iZy5qcGdcIjogMTg0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAwLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMi5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAzLnBuZ1wiOiA1NTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDQucG5nXCI6IDEwMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDUucG5nXCI6IDEzODQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDYucG5nXCI6IDkyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNy5wbmdcIjogMTE1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOC5wbmdcIjogMTQwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOS5wbmdcIjogMTU0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMC5wbmdcIjogMTYzOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMS5wbmdcIjogMTkwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMi5wbmdcIjogMTk4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMy5wbmdcIjogMjAyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNC5wbmdcIjogMjA3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNS5wbmdcIjogMjEyMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNi5wbmdcIjogMjI2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNy5wbmdcIjogMjQ1MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOC5wbmdcIjogMjU2OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOS5wbmdcIjogMjcyNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMC5wbmdcIjogMjg4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMS5wbmdcIjogMzA0NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMi5wbmdcIjogMzE4MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMy5wbmdcIjogMzMyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNC5wbmdcIjogMzQ4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNS5wbmdcIjogMzYwMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNi5wbmdcIjogMzcxMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNy5wbmdcIjogMzgyMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyOC5wbmdcIjogMzkyNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyOS5wbmdcIjogMzk5OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMC5wbmdcIjogNDAzNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMS5wbmdcIjogNDA5MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMi5wbmdcIjogNDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMy5wbmdcIjogNDE2Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNC5wbmdcIjogNDIxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNS5wbmdcIjogNDEwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNi5wbmdcIjogNDE2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNy5wbmdcIjogNDIzNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOC5wbmdcIjogNDI2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOS5wbmdcIjogNDM3MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0MC5wbmdcIjogNDQzOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0MS5wbmdcIjogNDQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Mi5wbmdcIjogNDUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0My5wbmdcIjogNDYzNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NC5wbmdcIjogNDY0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NS5wbmdcIjogNDc0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Ni5wbmdcIjogNDc4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Ny5wbmdcIjogNDgzMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OC5wbmdcIjogNDk4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OS5wbmdcIjogNDk4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MC5wbmdcIjogNTA0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MS5wbmdcIjogNTEzMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Mi5wbmdcIjogNTIwMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1My5wbmdcIjogNTM2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NC5wbmdcIjogODI4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NS5wbmdcIjogODA3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Ni5wbmdcIjogMTM3OTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTcucG5nXCI6IDIzMTc0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU4LnBuZ1wiOiAzMDg1MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1OS5wbmdcIjogMzYxMzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjAucG5nXCI6IDM4MDk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDYxLnBuZ1wiOiAzMzQ0NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2Mi5wbmdcIjogMjk1NzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjMucG5nXCI6IDMwMzcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY0LnBuZ1wiOiAyOTcwNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2NS5wbmdcIjogMjk4NTUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjYucG5nXCI6IDI5NzAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY3LnBuZ1wiOiAzMDI1NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2OC5wbmdcIjogMjk1NTYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjkucG5nXCI6IDI5NjYxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDcwLnBuZ1wiOiAyOTcyMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3MS5wbmdcIjogMjk4MTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzIucG5nXCI6IDI5ODEwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDczLnBuZ1wiOiAyOTc2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3NC5wbmdcIjogMjk1MDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzUucG5nXCI6IDI5NzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc2LnBuZ1wiOiAyOTY0MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3Ny5wbmdcIjogMjk0OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzgucG5nXCI6IDI3Mzk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc5LnBuZ1wiOiAzNzYwMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4MC5wbmdcIjogNTAxMzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODEucG5nXCI6IDU2NDY0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgyLnBuZ1wiOiA1NjQ0OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4My5wbmdcIjogNjMxMjksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODQucG5nXCI6IDU2MzQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg1LnBuZ1wiOiAzMTU4NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4Ni5wbmdcIjogMzYxODYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODcucG5nXCI6IDI0Nzk4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg4LnBuZ1wiOiAyMzg2NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4OS5wbmdcIjogMjc5MzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTAucG5nXCI6IDMyMDk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDkxLnBuZ1wiOiAzNjk0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5Mi5wbmdcIjogNDExODMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTMucG5nXCI6IDQ0NDIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk0LnBuZ1wiOiA0ODQ3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5NS5wbmdcIjogMzU4NzksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTYucG5nXCI6IDI4MTE1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk3LnBuZ1wiOiAyNDcyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5OC5wbmdcIjogMjIyNTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTkucG5nXCI6IDIwNjMwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAwLnBuZ1wiOiAyMTAxMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwMS5wbmdcIjogMTYzNzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDIucG5nXCI6IDE4MTkzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAzLnBuZ1wiOiAxOTg5Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNC5wbmdcIjogMjI0NzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDUucG5nXCI6IDI0NTk2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA2LnBuZ1wiOiAyNTUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNy5wbmdcIjogMjcxMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDgucG5nXCI6IDI2MTA3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA5LnBuZ1wiOiAyOTEzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMC5wbmdcIjogMzM1NTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTEucG5nXCI6IDM2NDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEyLnBuZ1wiOiA0MTAxNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMy5wbmdcIjogNDQ2ODksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTQucG5nXCI6IDQ1OTY0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE1LnBuZ1wiOiA0NDA1Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNi5wbmdcIjogNDY0OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTcucG5nXCI6IDY5NzgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE4LnBuZ1wiOiAyNjU4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExOS5wbmdcIjogMzA5NTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMjAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEyMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDQzMTAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDEucG5nXCI6IDQ0MzIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDQzMDY1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDQyODg2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDQucG5nXCI6IDQ0MTcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDQzMDEyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDQzNDUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDcucG5nXCI6IDQ1NzM0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDQyNjk4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDQyNTEyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTAucG5nXCI6IDQ0NjkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDQyMzk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAwLnBuZ1wiOiA4MzI2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMS5wbmdcIjogODQyODIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDIucG5nXCI6IDg0NzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAzLnBuZ1wiOiA4NTEwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNC5wbmdcIjogODMyNjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDUucG5nXCI6IDg0MjgyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA2LnBuZ1wiOiA4NDc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNy5wbmdcIjogODUxMDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDgucG5nXCI6IDgzMjY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA5LnBuZ1wiOiA4NDI4Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAxMC5wbmdcIjogODQ3NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTEucG5nXCI6IDg1MTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAwLnBuZ1wiOiA2NDA3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMS5wbmdcIjogNjI5ODMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDIucG5nXCI6IDY1NzczLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAzLnBuZ1wiOiA2NjY0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNC5wbmdcIjogNjQwNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDUucG5nXCI6IDYyOTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA2LnBuZ1wiOiA2NTc3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNy5wbmdcIjogNjY2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDgucG5nXCI6IDY0MDcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA5LnBuZ1wiOiA2Mjk4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMC5wbmdcIjogNjU3NzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTEucG5nXCI6IDY2NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDAucG5nXCI6IDEyNjYyMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDAxLnBuZ1wiOiAxMjQyNTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMi5wbmdcIjogMTI0MzAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDMucG5nXCI6IDEyNjAwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA0LnBuZ1wiOiAxMjY2MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwNS5wbmdcIjogMTI0MjUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDYucG5nXCI6IDEyNDMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA3LnBuZ1wiOiAxMjYwMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwOC5wbmdcIjogMTI2NjIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDkucG5nXCI6IDEyNDI1Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDEwLnBuZ1wiOiAxMjQzMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAxMS5wbmdcIjogMTI2MDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDAucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDEucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDIucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDMucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDQucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDUucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDYucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDcucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDgucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDkucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMTAucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMTEucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiA3NzY2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMS5wbmdcIjogNzc1MDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDc3MjIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiA3NzE2Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNC5wbmdcIjogNzc3NTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDc4NjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiA3NzMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNy5wbmdcIjogNzc3OTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDc4Njc2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiA3NzkyMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMC5wbmdcIjogNzc1NzYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDc3ODk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAwLnBuZ1wiOiAyMzIyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAxLnBuZ1wiOiAzMjAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAyLnBuZ1wiOiAxMzkzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAzLnBuZ1wiOiAxNTI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA0LnBuZ1wiOiAyNzI3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA1LnBuZ1wiOiAzMTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA2LnBuZ1wiOiAzNzYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA3LnBuZ1wiOiA0NDI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA4LnBuZ1wiOiA2MDAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA5LnBuZ1wiOiA5NDEyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEwLnBuZ1wiOiAxMTE4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMS5wbmdcIjogMTQzNTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTIucG5nXCI6IDE2MzIzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEzLnBuZ1wiOiAxOTcyOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNC5wbmdcIjogMjIwNDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTUucG5nXCI6IDI1MTExLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE2LnBuZ1wiOiAyNjU1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNy5wbmdcIjogMjkwMTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTgucG5nXCI6IDMwMjAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE5LnBuZ1wiOiAzMTMwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMC5wbmdcIjogMzE3MTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjEucG5nXCI6IDMyMTAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIyLnBuZ1wiOiAzMjg5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMy5wbmdcIjogMzMyMTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjQucG5nXCI6IDMzNzQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI1LnBuZ1wiOiAzMzYxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNi5wbmdcIjogMzM0MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjcucG5nXCI6IDMzNTkwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI4LnBuZ1wiOiAzMzUxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyOS5wbmdcIjogMzI1ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzAucG5nXCI6IDMyMzM1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMxLnBuZ1wiOiAzMjE0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMi5wbmdcIjogMzE1MzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzMucG5nXCI6IDMwODU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM0LnBuZ1wiOiAyOTg5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNS5wbmdcIjogMjk0MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzYucG5nXCI6IDI5NDE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM3LnBuZ1wiOiAyODM4MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzOC5wbmdcIjogMjgxNDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzkucG5nXCI6IDI3MjY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQwLnBuZ1wiOiAyNjU2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MS5wbmdcIjogMjY1NjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDIucG5nXCI6IDI1ODcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQzLnBuZ1wiOiAyNTM1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NC5wbmdcIjogMjQ1NjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDUucG5nXCI6IDI0MjAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ2LnBuZ1wiOiAyNDE0Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ny5wbmdcIjogMjM2MTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDgucG5nXCI6IDIzNjM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ5LnBuZ1wiOiAyMzgwOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MC5wbmdcIjogMjMxNzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTEucG5nXCI6IDIzMjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUyLnBuZ1wiOiAyMzIwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1My5wbmdcIjogMjI3OTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTQucG5nXCI6IDIzMDY0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU1LnBuZ1wiOiAyMzM1NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ni5wbmdcIjogMjM3NzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTcucG5nXCI6IDI0NzQzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU4LnBuZ1wiOiAyNTg3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OS5wbmdcIjogMjY1MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjAucG5nXCI6IDI3NjY2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYxLnBuZ1wiOiAyODY4OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Mi5wbmdcIjogMjk1ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjMucG5nXCI6IDMwMzk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY0LnBuZ1wiOiAzMTI5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NS5wbmdcIjogMzIyNDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjYucG5nXCI6IDMzODk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY3LnBuZ1wiOiAzNTM0OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OC5wbmdcIjogMzYyMzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjkucG5nXCI6IDM3NTY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcwLnBuZ1wiOiAzOTg4MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MS5wbmdcIjogNDEwOTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzIucG5nXCI6IDQyMDM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDczLnBuZ1wiOiA0MjQ5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NC5wbmdcIjogNDQ1NTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzUucG5nXCI6IDQ1NDQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc2LnBuZ1wiOiA0Njc0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ny5wbmdcIjogNDg2OTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzgucG5nXCI6IDQ5ODczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc5LnBuZ1wiOiA1MTcxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MC5wbmdcIjogNTM4NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODEucG5nXCI6IDU0NTIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgyLnBuZ1wiOiA1NjQ5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4My5wbmdcIjogNTYyOTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODQucG5nXCI6IDU4ODI0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg1LnBuZ1wiOiA1OTU5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ni5wbmdcIjogNjA2MzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODcucG5nXCI6IDYyODkzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg4LnBuZ1wiOiA2Mzk5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OS5wbmdcIjogNjYxMDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTAucG5nXCI6IDY2MzQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkxLnBuZ1wiOiA2OTIwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Mi5wbmdcIjogNjg3NjcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTMucG5nXCI6IDcwNTgyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk0LnBuZ1wiOiA3MDI2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NS5wbmdcIjogNzMzMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTYucG5nXCI6IDc1OTAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk3LnBuZ1wiOiA3NzUzOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OC5wbmdcIjogODE2MjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTkucG5nXCI6IDgyMjc3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAwLnBuZ1wiOiA4NTA1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMS5wbmdcIjogODcwNjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDIucG5nXCI6IDg4MzQxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAzLnBuZ1wiOiA4ODkwNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNC5wbmdcIjogOTMyMDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDUucG5nXCI6IDk5Nzc3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA2LnBuZ1wiOiAxMDI4NjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDcucG5nXCI6IDEwOTg0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOC5wbmdcIjogMTEyMTY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA5LnBuZ1wiOiAxMTU5MTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTAucG5nXCI6IDExNjkwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMS5wbmdcIjogMTIzMzIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEyLnBuZ1wiOiAxMjYzNDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTMucG5nXCI6IDEzMzc0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNC5wbmdcIjogMTM4NzcwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE1LnBuZ1wiOiAxNDY5NDksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTYucG5nXCI6IDE1NDMyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNy5wbmdcIjogMTU5NDc5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE4LnBuZ1wiOiAxNjYyMTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTkucG5nXCI6IDE3MTYyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMC5wbmdcIjogMTc4MjcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIxLnBuZ1wiOiAxODU4ODcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjIucG5nXCI6IDE5NzI5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMy5wbmdcIjogMjA2MTIzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI0LnBuZ1wiOiAyMjQ2ODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjUucG5nXCI6IDIzNjYzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNi5wbmdcIjogMjQyNTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI3LnBuZ1wiOiAyNjIxODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjgucG5nXCI6IDI3NDgwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOS5wbmdcIjogMjg1OTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMwLnBuZ1wiOiAzMDc0MzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzEucG5nXCI6IDMyMzI3MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMi5wbmdcIjogMzUwNTczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMzLnBuZ1wiOiAzNzYxMTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzQucG5nXCI6IDQwNTU3NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNS5wbmdcIjogNDM3NjU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM2LnBuZ1wiOiA0NzY0ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzcucG5nXCI6IDQ4NDI4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOC5wbmdcIjogNTMyOTQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM5LnBuZ1wiOiA1NTYxMjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDAucG5nXCI6IDU5NDU0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MS5wbmdcIjogNjQ4NDkyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQyLnBuZ1wiOiA3MTM3OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDMucG5nXCI6IDczMjkyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NC5wbmdcIjogNzAyOTgxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ1LnBuZ1wiOiA3NTgzODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDYucG5nXCI6IDc0MzU0MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ny5wbmdcIjogNjg0OTg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ4LnBuZ1wiOiA2NzM5NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDkucG5nXCI6IDY1NTE4Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MC5wbmdcIjogNjE4NjM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUxLnBuZ1wiOiA1OTk3NDksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTIucG5nXCI6IDU1Mzg5MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1My5wbmdcIjogNTI1OTk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU0LnBuZ1wiOiA1MTIwMjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTUucG5nXCI6IDM1NDkwNlxuXHR9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiZHVzdHlcIjogXCJhc3NldHMvYXVkaW8vZHVzdHkubXAzXCIsXG4gICAgXCJibGFkZXJhbmdlclwiOiBcImFzc2V0cy9hdWRpby9ibGFkZS5tcDNcIixcbiAgICBcImNhYmJpZVwiOiBcImFzc2V0cy9hdWRpby9NdXN0YW5nXzIwMTJfU3RhcnQubXAzXCIsXG4gICAgXCJkaXBwZXJcIjogXCJhc3NldHMvYXVkaW8vZGlwcGVyLm1wM1wiLFxuICAgIFwid2luZGxpZnRlclwiOiBcImFzc2V0cy9hdWRpby93aW5kbGlmdGVyLm1wM1wiLFxuICAgIFwidGVhbVwiOiBcImFzc2V0cy9hdWRpby9ZZWxsb3dfR2VuZXJpY19TdGFydC5tcDNcIlxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImNsYXNzXCI6IFwiY2FubmVkXCIsXG4gICAgXCJjb3B5XCI6IFwiTm93IHRoYXQgd2Uga25vdyBtb3JlIGFib3V0IHlvdSwgaXQncyB5b3VyIHR1cm4gdG8gYXNrIGZpcmUgcmFuZ2VyIHNvbWUgcXVlc3Rpb25zXCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGpvYiBhdCBQaXN0b24gUGVhaz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJqb2JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG8geW91IGZpZ2h0IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb3Jlc3RmaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhhdmUgeW91IGFsd2F5cyBiZWVuIGEgZmlyZWZpZ2h0ZXI/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmlyZWZpZ2h0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaG8gaXMgeW91ciBiZXN0IGZyaWVuZD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJiZXN0ZnJpZW5kXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hlcmUgaXMgeW91ciBmYXZvcml0ZSBwbGFjZSB0byBmbHk/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGVwbGFjZVwiXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwibmFtZVwiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNsYXNzXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY29weVwiOiBcIldobyBkbyB5b3Ugd2FudCB0byB3cml0ZSB0bz9cIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEdXN0eVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImR1c3R5XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmxhZGUgUmFuZ2VyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmxhZGVyYW5nZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJDYWJiaWVcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJjYWJiaWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEaXBwZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkaXBwZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaW5kbGlmdGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwid2luZGxpZnRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlRoZSBUZWFtXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwidGVhbVwiXG4gICAgICAgIH1cbiAgICBdLFxuICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcInF1ZXN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQncyB5b3VyIGZhdm9yaXRlIGNvbG9yP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmx1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmx1ZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk9yYW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwib3JhbmdlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiR3JlZW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImdyZWVuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiWWVsbG93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJ5ZWxsb3dcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQdXJwbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInB1cnBsZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1mb29kXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtZm9vZFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIGZvb2Q/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUGl6emFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInBpenphXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSWNlIENyZWFtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJpY2VjcmVhbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJyb2Njb2xpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJicm9jY29saVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkZyZW5jaCBGcmllc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZnJlbmNoZnJpZXNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDaGlja2VuIE51Z2dldHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNoaWNrZW5udWdnZXRzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUEImSlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGJqXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLXNwb3J0XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtc3BvcnRcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBzcG9ydD9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJGb290YmFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZm9vdGJhbGxcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCYXNlYmFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmFzZWJhbGxcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIb2NrZXlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImhvY2tleVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN3aW1taW5nL0RpdmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic3dpbW1pbmdcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTb2NjZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInNvY2NlclwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJhY2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmFjaW5nXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiZHVzdHlcIiA6IHtcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYSBTRUFULCBvciBhIFNpbmdsZS1FbmdpbmUgQWlyIFRhbmtlciwgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtLCBhbiBlbGl0ZSBncm91cCBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnQuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGNhbiBzY29vcCB3YXRlciBmcm9tIGxha2VzIGFuZCBkaXZlIGludG8gdGhlIGZvcmVzdCB0byBkcm9wIHRoZSB3YXRlciBvbiB3aWxkZmlyZXMuIFNwZWVkIGNvdW50cyB3aGVuIGFuIGFpciByZXNjdWUgaXMgdW5kZXIgd2F5LCBzbyBJJ20gYWx3YXlzIHJlYWR5IHRvIGZseSBpbnRvIGRhbmdlciFcIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkJlZm9yZSBqb2luaW5nIHRoZSBBaXIgQXR0YWNrIFRlYW0sIEkgd2FzIGEgd29ybGQtZmFtb3VzIGFpciByYWNlciAtIEkgZXZlbiByYWNlZCBhcm91bmQgdGhlIHdvcmxkISAgTm93IEkgcmFjZSB0byBwdXQgb3V0IGZpcmVzLiBcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgd2Fzbid0IGVhc3kgYmVjb21pbmcgYSBjaGFtcGlvbiByYWNlciBvciBhIGZpcmVmaWdodGVyIGJ1dCBJJ3ZlIGhhZCBhbiBhbWF6aW5nIHRlYW0gb2YgZnJpZW5kcyB3aXRoIG1lIGV2ZXJ5IHN0ZXAgb2YgdGhlIHdheSEgXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIkkgaGF2ZSBiZWVuIGZseWluZyBmb3IgYXMgbG9uZyBhcyBJIGNhbiByZW1lbWJlciBidXQgbXkgZmF2b3JpdGUgcGxhY2UgdG8gZmx5IGlzIGFib3ZlIG15IGhvbWV0b3duLCBQdW1wd2FzaCBKdW5jdGlvbi4gSSBkbyBzb21lIGZhbmN5IGZseWluZyB0aGVyZSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiQW55dGhpbmcncyBiZXR0ZXIgdG8gZWF0IHRoYW4gVml0YW1pbmFtdWxjaC4gRXNwZWNpYWxseSAldGVtcGxhdGUlIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgR1JFRU4uIEdyZWVuIG1lYW5zIGdvISBBbmQgSSBsb3ZlIHRvIGdvIGZhc3QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJUaGUgQ0hFRVRBSCBpcyBteSBmYXZvcml0ZSBhbmltYWwgYmVjYXVzZSBzcGVlZCBjb3VudHMgd2hlbiBhbiBhaXIgcmVzY3VlIGlzIHVuZGVyIHdheS5cIlxuICAgIH0sXG4gICAgXCJkaXBwZXJcIjoge1xuICAgICAgICBcImpvYlwiOiBcIkkgaGF2ZSBhIHJlYWxseSBpbXBvcnRhbnQgam9iIGZpZ2h0aW5nIHdpbGRmaXJlcy4gSSdtIGEgU3VwZXItc2Nvb3BlciB3aXRoIHRoZSBQaXN0b24gUGVhayBBdHRhY2sgVGVhbS5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgZmlnaHQgZm9yZXN0IGZpcmVzIGluIHNldmVyYWwgd2F5cy4gIFNvbWV0aW1lcyBJIGRyb3AgcmV0YXJkYW50IHRvIGNvbnRhaW4gYSBmaXJlLiAgSSBjYW4gYWxzbyBzY29vcCB3YXRlciBmcm9tIHRoZSBsYWtlIGFuZCBkcm9wIGl0IGRpcmVjdGx5IG9uIHRoZSBmaXJlLiBNeSBib3NzIEJsYWRlIFJhbmdlciBjYWxscyBtZSBhIE11ZC1Ecm9wcGVyIVwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgdXNlZCB0byBoYXVsIGNhcmdvIHVwIGluIEFuY2hvcmFnZS4gWWVwLCBhIGxvdCBvZiBndXlzIGluIEFsYXNrYS4gSSB3YXMgYmVhdGluZyB0aGVtIG9mZiB3aXRoIGEgc3RpY2shXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kIGlzIGNoYW1waW9uIHJhY2VyIER1c3R5IENyb3Bob3BwZXIuIEknbSBoaXMgYmlnZ2VzdCBmYW4hXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIk15IGZhdm9yaXRlIHBsYWNlIHRvIGZseSBpcyB0aGUgRnVzZWwgTG9kZ2UsIHJpZ2h0IGhlcmUgaW4gUGlzdG9uIFBlYWsuIEl0J3Mgc28gYmVhdXRpZnVsLiBBbmQgd2hlcmUgRHVzdHkgYW5kIEkgaGFkIG91ciBmaXJzdCBkYXRlISBJdCB3YXMgYSBkYXRlLCByaWdodD8gSSdtIHByZXR0eSBzdXJlIGl0IHdhcyBhIGRhdGUuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIldoaWxlIEkgcmVhbGx5IGxpa2UgdG8gZWF0ICV0ZW1wbGF0ZSUsIHRoZXJlJ3Mgbm90aGluZyBiZXR0ZXIgdGhhbiBhIGZyZXNoIGNhbiBvZiBvaWwhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJXaGF0J3MgbXkgZmF2b3JpdGUgY29sb3I/IFlFTExPVyBsaWtlIHRoZSBzdW5zaGluZS4uIGFuZCBsaWtlIE1FIVwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiTXkgZmF2b3JpdGUgYW5pbWFsIGlzIHRoZSBET0xQSElOLiBJdCBkaXBzIGluIGFuZCBvdXQgb2YgdGhlIHdhdGVyLCBqdXN0IGxpa2UgTUUhXCJcbiAgICB9LFxuICAgIFwid2luZGxpZnRlclwiOiB7XG4gICAgICAgIFwiam9iXCI6IFwiSSBhbSBhIEhlYXZ5LUxpZnQgSGVsaWNvcHRlciB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGNyZXcgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0LiBcIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkJsYWRlIGNhbGxzIG1lIGEg4oCcTXVkIERyb3BwZXLigJ0gYmVjYXVzZSBJIGhhdmUgYSBkZXRhY2hhYmxlIHRhbmsgbG9hZGVkIHdpdGggZmlyZSByZXRhcmRhbnQgdG8gaGVscCBwdXQgb3V0IHRoZSBmaXJlcy4gIE11ZCBpcyBzbGFuZyBmb3IgcmV0YXJkYW50LiAgV2luZGxpZnRlciBjYW4gaG9sZCBtb3JlIHJldGFyZGFudCB0aGFuIGFueW9uZSBlbHNlIG9uIHRoZSB0ZWFtLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiV2luZGxpZnRlciB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIFdpbmRsaWZ0ZXIgdXNlZCB0byBiZSBhIGx1bWJlcmphY2ssIGxpZnRpbmcgZG96ZW5zIG9mIGhlYXZ5IGxvZ3MgYW5kIGNhcnJ5aW5nIHRoZW0gdG8gdGhlIGx1bWJlciBtaWxsLiAgQnV0IG5vdyBJIGFtIGEgZmlyZWZpZ2h0ZXIgYW5kIHRoaXMga2VlcHMgbWUgdmVyeSBidXN5LlwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJXaW5kbGlmdGVyIHdvdWxkIGxpa2UgdG8gYmUgWU9VUiBiZXN0IGZyaWVuZC5cIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiV2luZGxpZnRlciBsaWtlcyB0byBmbHkgbWFueSBwbGFjZXMgYW5kIGJlIG9uZSB3aXRoIHRoZSB3aW5kLiBUaGUgd2luZCBzcGVha3MsIFdpbmRsaWZ0ZXIgbGlzdGVucy5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiJXRlbXBsYXRlJSBpcyBkZWxpY2lvdXMhIEhhdmUgeW91IHRyaWVkIGl0IHdpdGggYSBjYW4gb2Ygb2lsPyBUaGF0J3MgV2luZGxpZnRlcidzIGZhdm9yaXRlIGZvb2QuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJXaW5kbGlmdGVyJ3MgZmF2b3JpdGUgY29sb3IgaXMgQkxVRSBsaWtlIHRoZSB3YXRlciBhbmQgdGhlIHNreS5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIldpbmRsaWZ0ZXIgc3Bpcml0IGFuaW1hbCBpcyB0aGUgQkVBUiAtIGxpa2UgdGhlIExha290YSwgc3Ryb25nIGFuZCBzaWxlbnQuXCJcbiAgICB9LFxuICAgIFwiYmxhZGVcIjoge1xuICAgICAgICBcImpvYlwiOiBcIkknbSBhIEZpcmUgYW5kIFJlc2N1ZSBIZWxpY29wdGVyLCBhbmQgdGhlIENvcHRlciBpbiBDaGFyZ2UgaGVyZSBhdCBQaXN0b24gUGVhay4gXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJXaGVuIHRoZXJlJ3MgYSBmaXJlLCBJIGdpdmUgdGhlIG9yZGVycyBmb3IgdGhlIEFpciBBdHRhY2sgVGVhbSB0byBzcHJpbmcgaW50byBhY3Rpb24hXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJJ3ZlIGJlZW4gdGhlIENob3BwZXIgQ2FwdGFpbiBmb3IgYSBsb25nIHRpbWUsIGJ1dCBJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB3YXMgYSBUViBzdGFyIG9uIGEgc2hvdyBhYm91dCBwb2xpY2UgaGVsaWNvcHRlcnMhIEJ1dCBJIHJlYWxpemVkIEkgZGlkbid0IHdhbnQgdG8gcHJldGVuZCB0byBzYXZlIGxpdmVzLCBJIHdhbnRlZCB0byBzYXZlIHRoZW0gZm9yIHJlYWwhXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kcyBhcmUgYWxsIHRoZSB0cmFpbGJsYXplcnMgaGVyZSBhdCBQaXN0b24gUGVhay4gV2UgbGlrZSB0byB0aGluayBvZiBvdXJzZWx2ZXMgYXMgdGhlIGhlcm9lcyBvZiB0aGUgc2t5IVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGxpa2UgdG8gZmx5IHRvIG1hbnkgcGxhY2VzLCBidXQgbXkgZmF2b3JpdGUgcGxhY2UgaXMgYWJvdmUgUGlzdG9uIFBlYWsuIEkgcGF0cm9sIHRoZSBza2llcyBhbmQgbWFrZSBzdXJlIGFsbCB0aGUgdG91cmlzdHMgYXJlIGNhbXBpbmcgYnkgdGhlIGJvb2suIFJlbWVtYmVyLCBzYWZldHkgZmlyc3QhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIllvdSBzYXkgeW91IGxpa2UgdG8gZWF0ICV0ZW1wbGF0ZSU/IEkgbGlrZSB0aGF0IHRvby4gSSBhbHNvIGxpa2UgYSBmcmVzaCBjYW4gb2Ygb2lsLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiTXkgZmF2b3JpdGUgY29sb3IgaXMgUkVELCB0aGUgY29sb3Igb2YgRmlyZSBTYWZldHkuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJBcyB0aGUgQ2hvcHBlciBDYXB0YWluLCBJIHNvYXIgYWJvdmUgdGhlIFYtNiBWYWxsZXkgYW5kIHNjb3BlIG91dCBmaXJlcy4gSSdkIHNheSB0aGUgRUFHTEUgaXMgbXkgZmF2b3JpdGUgYW5pbWFsLlwiXG4gICAgfSxcbiAgICBcImNhYmJpZVwiOiB7XG4gICAgICAgIFwiam9iXCI6IFwiSSdtIGFuIGV4LW1pbGl0YXJ5IGNhcmdvIHBsYW5lIHdpdGggdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtIC0gZmlyZWZpZ2h0aW5nIGlzIGEgYmlnIHJlc3BvbnNpYmlsaXR5LlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBjYXJyeSB0aGUgU21va2VqdW1wZXJzIC0gd2hvIGNsZWFyIGZhbGxlbiB0cmVlcyBhbmQgZGVicmlzLiBEdXJpbmcgYSBmaXJlLCBJIGRyb3AgdGhlbSBmcm9tIHRoZSBza3ksIHJpZ2h0IG92ZXIgdGhlIGZsYW1lcy5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkkgd2Fzbid0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBJIHVzZWQgdG8gZHJvcCBhaXJib3JuZSB1dGlsaXR5IHZlaGljbGVzIGJlaGluZCBlbmVteSBsaW5lcyBkdXJpbmcgd2FyLiBOb3cgSSBkcm9wIFNtb2tlanVtcGVycyBhdCBQaXN0b24gUGVhay5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiV2hvJ3MgbXkgYmVzdCBmcmllbmQ/IFRoYXQncyBwcm9iYWJseSBUb3AgU2VjcmV0IGJ1dCBJIGNhbiBzYXkgdGhlIFNtb2tlanVtcGVycyBhcmUgbXkgY2xvc2VzdCByZWNydWl0cy5cIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSd2ZSBmbG93biBvdmVyIG1hbnkgcGxhY2VzIGluIG15IHRpbWUuIE15IGZhdm9yaXRlIHNwb3QgaXMgQW5jaG9yIExha2UgLSBhIGxvbmcgYm9keSBvZiB3YXRlciB3aXRoIGFuIGFuY2hvci1zaGFwZWQgaXNsYW5kLlwiLFxuICAgICAgICBcImZhdm9yaXRlLWZvb2RcIjogXCJJbiB0aGUgbWlsaXRhcnksICV0ZW1wbGF0ZSUgaXMgcmF0aW9uZWQgYnV0IEknbGwgdGFrZSBhcyBtdWNoIGZyZXNoIG9pbCBhcyBJIGNhbiBnZXQhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtY29sb3JcIjogXCJNeSBmYXZvcml0ZSBjb2xvciBpcyBHUkVFTiAtIGl0IGNhbiBoZWxwIG1lIGhpZGUgYWJvdmUgdGhlIHBpbmUgdHJlZXMuXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtc3BvcnRcIjogXCJLQU5HQVJPT3MgYXJlIG15IGZhdm9yaXRlIC0gVGhleSBob3AgYXJvdW5kIGNhcnJ5aW5nIHRoZWlyIGNhcmdvIC0gYSBsb3QgbGlrZSBtZS5cIlxuICAgIH0sXG4gICAgXCJ0ZWFtXCI6IHtcbiAgICAgICAgXCJqb2JcIjogXCJUaGUgUGlzdG9uIFBlYWsgQWlyIEF0dGFjayBUZWFtIGlzIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdHMuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiV2UgZmx5IGluIHdoZW4gb3RoZXJzIGFyZSBmbHlpbiBvdXQuIEl0IHRha2VzIGEgc3BlY2lhbCBraW5kYSBwbGFuZS5cIixcbiAgICAgICAgXCJmaXJlZmlnaHRlclwiOiBcIkxpZmUgZG9lc24ndCBhbHdheXMgZ28gdGhlIHdheSB5b3UgZXhwZWN0IGl0LiBUaGlzIGlzIGEgc2Vjb25kIGNhcmVlciBmb3IgYWxsIG9mIHVzLiBcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgdGFrZXMgaG9ub3IsIHRydXN0IGFuZCBicmF2ZXJ5IHRvIGVhcm4geW91ciB3aW5ncy4gV2UgZG9uJ3QgaGF2ZSBqdXN0IG9uZSBiZXN0IGZyaWVuZCBiZWNhdXNlIHdlIG5lZWQgZXZlcnkgcGxhbmUgd2UndmUgZ290IHRvIGhlbHAuIFwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJQaXN0b24gUGVhayBoYXMgc29tZSBncmVhdCBwbGFjZXMgdG8gZmx5LiBCdXQgb3VyIGZhdm9yaXRlIHNwb3QgaXMgdGhlIHdvb2RlbiByYWlsd2F5IGJyaWRnZSAtIHdpdGggdGhlIHRodW5kZXJpbmcgV2hpdGV3YWxsIEZhbGxzIGJlaGluZCBpdC5cIixcbiAgICAgICAgXCJmYXZvcml0ZS1mb29kXCI6IFwiV2UgZWF0ICV0ZW1wbGF0ZSUgYWxsIHRoZSB0aW1lIGFuZCBzbHVycCBpdCBkb3duIHdpdGggZnJlc2ggY2FucyBvZiBvaWwuIEhPSVNUIVwiLFxuICAgICAgICBcImZhdm9yaXRlLWNvbG9yXCI6IFwiV2UgbGlrZSBhbGwgY29sb3JzIG9mIHRoZSByYWluYm93LiBCdXQgYXMgYSB0ZWFtLCBvdXIgZmF2b3JpdGUgY29sb3IgaXMgJXRlbXBsYXRlJSwganVzdCBsaWtlIHlvdSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1zcG9ydFwiOiBcIkhlcmUgYXQgUGlzdG9uIFBlYWssIHdlIGFyZSB0ZWFtLiBMaWtlIGEgcGFjayBvZiBET0dzLCB3ZSB3b3JrIHRvZ2V0aGVyIGZvciBhIGNvbW1vbiBnb2FsLiBcIlxuICAgIH1cbn0iLCJcblxuXG5cbi8vIGFkZHMgb3VyIGN1c3RvbSBtb2RpZmljYXRpb25zIHRvIHRoZSBQSVhJIGxpYnJhcnlcbnJlcXVpcmUoJy4vcGl4aS9saWJNb2RpZmljYXRpb25zJyk7XG5cblxuXG52YXIgTWFpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL21haW5WaWV3Jyk7XG52YXIgQXNzZXRMb2FkaW5nVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXNzZXRMb2FkaW5nVmlldycpO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQXBwICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFwcCA9IHt9O1xuXG5cblxuXG5cbi8vIGFmdGVyIGFzc2V0cyBsb2FkZWQgJiBqcXVlcnkgbG9hZGVkXG5hcHAucmVuZGVyID0gXy5hZnRlcigyLCBmdW5jdGlvbigpIHtcbiAgICBhcHAubWFpblZpZXcgPSBuZXcgTWFpblZpZXcoKTtcblxuICAgIGFwcC5tYWluVmlldy5zdGFydCgpO1xufSk7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEFzc2V0IExvYWRpbmcgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyICRwYXNzd29yZFNjcmVlbiA9ICQoJyNwYXNzd29yZFNjcmVlbicpO1xuXG5pZihkb2N1bWVudC5VUkwuaW5kZXhPZignZGlzbmV5LXBsYW5lczItYWlybWFpbC1zdGFnaW5nLmF6dXJld2Vic2l0ZXMubmV0JykgIT09IC0xKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJ2Rpc25leVBsYW5lc1R3byc7XG5cbiAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2lucHV0W3R5cGU9cGFzc3dvcmRdJyk7XG5cbiAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZigkcGFzc3dvcmRJbnB1dC52YWwoKSA9PT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmFkZU91dCg1MCk7XG5cbiAgICAgICAgICAgICAgICBhcHAuYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkaW5nVmlldyh7b25Db21wbGV0ZTogYXBwLnJlbmRlcn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRwYXNzd29yZFNjcmVlbi5zaG93KCk7XG5cbiAgICBjb25zb2xlLmxvZygkcGFzc3dvcmRTY3JlZW4pO1xufSBlbHNlIHtcbiAgICBhcHAuYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkaW5nVmlldyh7b25Db21wbGV0ZTogYXBwLnJlbmRlcn0pO1xuXG4gICAgJHBhc3N3b3JkU2NyZWVuLnJlbW92ZSgpO1xufVxuXG5cblxuJChmdW5jdGlvbigpIHtcbiAgICBGYXN0Q2xpY2suYXR0YWNoKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgYXBwLnJlbmRlcigpO1xufSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcblxuXG5cbiIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY29weTogJycsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICB9XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb247IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG4gICAgLy8gZGlzcGxheU9iamVjdCBzaG91bGQgYmUgYW4gaW5zdGFuY2Ugb2YgUElYSS5TcHJpdGUgb3IgUElYSS5Nb3ZpZUNsaXBcbiAgICB2YXIgQ2hhcmFjdGVyID0gZnVuY3Rpb24obmFtZSwgbW92aWVDbGlwKSB7XG4gICAgICAgIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpOyAvLyBQYXJlbnQgY29uc3RydWN0b3JcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlkbGUgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKG1vdmllQ2xpcCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SWRsZVN0YXRlKG1vdmllQ2xpcCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLnNldElkbGVTdGF0ZSA9IGZ1bmN0aW9uKHBpeGlTcHJpdGUpIHtcbiAgICAgICAgdGhpcy5pZGxlID0gcGl4aVNwcml0ZTtcblxuICAgICAgICBpZihwaXhpU3ByaXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgIHBpeGlTcHJpdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBwaXhpU3ByaXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgcGl4aVNwcml0ZS5nb3RvQW5kUGxheSgwKTsgIC8vc3RhcnQgY2xpcFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRDaGlsZChwaXhpU3ByaXRlKTsgICAvL2FkZCB0byBkaXNwbGF5IG9iamVjdCBjb250YWluZXJcbiAgICB9O1xuXG4gICAgLy9hZGQgbW92aWUgY2xpcCB0byBwbGF5IHdoZW4gY2hhcmFjdGVyIGNoYW5nZXMgdG8gc3RhdGVcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLmFkZFN0YXRlID0gZnVuY3Rpb24oc3RhdGUsIG1vdmllQ2xpcCkge1xuICAgICAgICBtb3ZpZUNsaXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlc1tzdGF0ZV0gPSBtb3ZpZUNsaXA7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobW92aWVDbGlwKTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIEFQSSBmdW5jdGlvbi4gV2FpdHMgdW50aWwgY3VycmVudCBzdGF0ZSBpcyBmaW5pc2hlZCBiZWZvcmUgc3dpdGNoaW5nIHRvIG5leHQgc3RhdGUuXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5nb1RvU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuXG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQodGhpcy5zdGF0ZXNbc3RhdGVdKSkge1xuICAgICAgICAgICAgdGhyb3cgJ0Vycm9yOiBDaGFyYWN0ZXIgJyArIHRoaXMubmFtZSArICcgZG9lcyBub3QgY29udGFpbiBzdGF0ZTogJyArIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5pZGxlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgIHRoaXMuaWRsZS5vbkNvbXBsZXRlID0gXy5iaW5kKHRoaXMuc3dhcFN0YXRlLCB0aGlzLCBzdGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIGFmdGVyIGN1cnJlbnQgYW5pbWF0aW9uIGZpbmlzaGVzIGdvIHRvIHRoaXMgc3RhdGUgbmV4dFxuICAgICAgICAgICAgdGhpcy5pZGxlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3dhcFN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgIC8vc3dpdGNoIGltbWVkaWF0ZWx5IGlmIGNoYXJhY3RlciBpZGxlIHN0YXRlIGlzIGEgc2luZ2xlIHNwcml0ZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGNoYW5nZXMgc3RhdGUgaW1tZWRpYXRlbHlcbiAgICAvLyBOT1RFOiBGdW5jdGlvbiBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgY2hhcmFjdGVyLmdvVG9TdGF0ZSgpXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5zd2FwU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuXG4gICAgICAgIHZhciBpZGxlU3RhdGUgPSB0aGlzLmlkbGU7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHRoaXMuc3RhdGVzW3N0YXRlXTtcblxuICAgICAgICBuZXdTdGF0ZS5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7ICAvL3N3aXRjaCBiYWNrIHRvIGlkbGUgYWZ0ZXIgcnVuXG4gICAgICAgICAgICBpZihpZGxlU3RhdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIG5ld1N0YXRlLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIG5ld1N0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgIH07XG5cbiAgICAvL2FkZCBjYWxsYmFjayB0byBydW4gb24gY2hhcmFjdGVyIHVwZGF0ZVxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUub25VcGRhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9O1xuXG4gICAgLy8gY2FsbGVkIG9uIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGJ5IHdoYXRldmVyIFBpeGkgc2NlbmUgY29udGFpbnMgdGhpcyBjaGFyYWN0ZXJcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uVXBkYXRlQ2FsbGJhY2soKTtcbiAgICB9O1xuXG5cblxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcblxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogRXh0ZW5kIGFuZCBFeHBvcnQgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gZXh0ZW5kcyBEaXNwbGF5IE9iamVjdCBDb250YWluZXJcbiAgICBleHRlbmQoUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLCBDaGFyYWN0ZXIpO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDaGFyYWN0ZXI7XG59KSgpOyIsIlxuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIHN1Yikge1xuICAgIC8vIEF2b2lkIGluc3RhbnRpYXRpbmcgdGhlIGJhc2UgY2xhc3MganVzdCB0byBzZXR1cCBpbmhlcml0YW5jZVxuICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvY3JlYXRlXG4gICAgLy8gZm9yIGEgcG9seWZpbGxcbiAgICAvLyBBbHNvLCBkbyBhIHJlY3Vyc2l2ZSBtZXJnZSBvZiB0d28gcHJvdG90eXBlcywgc28gd2UgZG9uJ3Qgb3ZlcndyaXRlXG4gICAgLy8gdGhlIGV4aXN0aW5nIHByb3RvdHlwZSwgYnV0IHN0aWxsIG1haW50YWluIHRoZSBpbmhlcml0YW5jZSBjaGFpblxuICAgIC8vIFRoYW5rcyB0byBAY2Nub2tlc1xuICAgIHZhciBvcmlnUHJvdG8gPSBzdWIucHJvdG90eXBlO1xuICAgIHN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2UucHJvdG90eXBlKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvcmlnUHJvdG8pICB7XG4gICAgICAgIHN1Yi5wcm90b3R5cGVba2V5XSA9IG9yaWdQcm90b1trZXldO1xuICAgIH1cblxuICAgIC8vIFJlbWVtYmVyIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSB3YXMgc2V0IHdyb25nLCBsZXQncyBmaXggaXRcbiAgICBzdWIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViO1xuICAgIC8vIEluIEVDTUFTY3JpcHQ1KyAoYWxsIG1vZGVybiBicm93c2VycyksIHlvdSBjYW4gbWFrZSB0aGUgY29uc3RydWN0b3IgcHJvcGVydHlcbiAgICAvLyBub24tZW51bWVyYWJsZSBpZiB5b3UgZGVmaW5lIGl0IGxpa2UgdGhpcyBpbnN0ZWFkXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN1Yi5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzdWJcbiAgICB9KTtcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kOyIsIihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qXG4gICAgICogQ3VzdG9tIEVkaXRzIGZvciB0aGUgUElYSSBMaWJyYXJ5XG4gICAgICovXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFJlbGF0aXZlIFBvc2l0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dZID0gMDtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25YID0gZnVuY3Rpb24od2luZG93V2lkdGgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKHdpbmRvd1dpZHRoICogdGhpcy5fd2luZG93WCkgKyB0aGlzLl9idW1wWDtcbiAgICB9O1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWSA9IGZ1bmN0aW9uKHdpbmRvd0hlaWdodCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAod2luZG93SGVpZ2h0ICogdGhpcy5fd2luZG93WSkgKyB0aGlzLl9idW1wWTtcbiAgICB9O1xuXG4gICAgLy8gd2luZG93WCBhbmQgd2luZG93WSBhcmUgcHJvcGVydGllcyBhZGRlZCB0byBhbGwgUGl4aSBkaXNwbGF5IG9iamVjdHMgdGhhdFxuICAgIC8vIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgcG9zaXRpb24ueCBhbmQgcG9zaXRpb24ueVxuICAgIC8vIHRoZXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhIHZhbHVlIGJldHdlZW4gMCAmIDEgYW5kIHBvc2l0aW9uIHRoZSBkaXNwbGF5XG4gICAgLy8gb2JqZWN0IGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2luZG93IHdpZHRoICYgaGVpZ2h0IGluc3RlYWQgb2YgYSBmbGF0IHBpeGVsIHZhbHVlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1g7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1ggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKCR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1knLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBZID0gMDtcblxuICAgIC8vIGJ1bXBYIGFuZCBidW1wWSBhcmUgcHJvcGVydGllcyBvbiBhbGwgZGlzcGxheSBvYmplY3RzIHVzZWQgZm9yXG4gICAgLy8gc2hpZnRpbmcgdGhlIHBvc2l0aW9uaW5nIGJ5IGZsYXQgcGl4ZWwgdmFsdWVzLiBVc2VmdWwgZm9yIHN0dWZmXG4gICAgLy8gbGlrZSBob3ZlciBhbmltYXRpb25zIHdoaWxlIHN0aWxsIG1vdmluZyBhcm91bmQgYSBjaGFyYWN0ZXIuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKCR3aW5kb3cud2lkdGgoKSAqIHRoaXMuX3dpbmRvd1gpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAoJHdpbmRvdy5oZWlnaHQoKSAqIHRoaXMuX3dpbmRvd1kpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFNjYWxpbmcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbiAgICAvLyB3aW5kb3dTY2FsZSBjb3JyZXNwb25kcyB0byB3aW5kb3cgc2l6ZVxuICAgIC8vICAgZXg6IHdpbmRvd1NjYWxlID0gMC4yNSBtZWFucyAxLzQgc2l6ZSBvZiB3aW5kb3dcbiAgICAvLyBzY2FsZU1pbiBhbmQgc2NhbGVNYXggY29ycmVzcG9uZCB0byBuYXR1cmFsIHNwcml0ZSBzaXplXG4gICAgLy8gICBleDogc2NhbGVNaW4gPSAwLjUgbWVhbnMgc3ByaXRlIHdpbGwgbm90IHNocmluayB0byBtb3JlIHRoYW4gaGFsZiBvZiBpdHMgb3JpZ2luYWwgc2l6ZS5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dTY2FsZSA9IC0xO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNaW4gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNYXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVUeXBlID0gJ2NvbnRhaW4nO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlRm5jID0gTWF0aC5taW47XG5cbiAgICAvLyBXaW5kb3dTY2FsZTogdmFsdWUgYmV0d2VlbiAwICYgMSwgb3IgLTFcbiAgICAvLyBUaGlzIGRlZmluZXMgd2hhdCAlIG9mIHRoZSB3aW5kb3cgKGhlaWdodCBvciB3aWR0aCwgd2hpY2hldmVyIGlzIHNtYWxsZXIpXG4gICAgLy8gdGhlIG9iamVjdCB3aWxsIGJlIHNpemVkLiBFeGFtcGxlOiBhIHdpbmRvd1NjYWxlIG9mIDAuNSB3aWxsIHNpemUgdGhlIGRpc3BsYXlPYmplY3RcbiAgICAvLyB0byBoYWxmIHRoZSBzaXplIG9mIHRoZSB3aW5kb3cuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fd2luZG93U2NhbGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVHdvIHBvc3NpYmxlIHZhbHVlczogY29udGFpbiBvciBjb3Zlci4gVXNlZCB3aXRoIHdpbmRvd1NjYWxlIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHRha2UgdGhlXG4gICAgLy8gc21hbGxlciBib3VuZCAoY29udGFpbikgb3IgdGhlIGxhcmdlciBib3VuZCAoY292ZXIpIHdoZW4gZGVjaWRpbmcgY29udGVudCBzaXplIHJlbGF0aXZlIHRvIHNjcmVlbi5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3NjYWxlVHlwZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVR5cGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlVHlwZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zY2FsZUZuYyA9ICh2YWx1ZSA9PT0gJ2NvbnRhaW4nKSA/IE1hdGgubWluIDogTWF0aC5tYXg7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRTY2FsZSA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdmFyIGxvY2FsQm91bmRzID0gdGhpcy5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuX3dpbmRvd1NjYWxlICogdGhpcy5fc2NhbGVGbmMod2luZG93SGVpZ2h0L2xvY2FsQm91bmRzLmhlaWdodCwgd2luZG93V2lkdGgvbG9jYWxCb3VuZHMud2lkdGgpO1xuXG4gICAgICAgIC8va2VlcCBzY2FsZSB3aXRoaW4gb3VyIGRlZmluZWQgYm91bmRzXG4gICAgICAgIHNjYWxlID0gTWF0aC5tYXgodGhpcy5zY2FsZU1pbiwgTWF0aC5taW4oc2NhbGUsIHRoaXMuc2NhbGVNYXgpKTtcblxuXG4gICAgICAgIHRoaXMuc2NhbGUueCA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB0aGlzLnNjYWxlLnkgPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICB9O1xuXG5cbiAgICAvLyBVU0UgT05MWSBJRiBXSU5ET1dTQ0FMRSBJUyBBTFNPIFNFVFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWCA9IDE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVZID0gMTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogV2luZG93IFJlc2l6ZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIGZvciBlYWNoIGRpc3BsYXkgb2JqZWN0IG9uIHdpbmRvdyByZXNpemUsXG4gICAgLy8gYWRqdXN0aW5nIHRoZSBwaXhlbCBwb3NpdGlvbiB0byBtaXJyb3IgdGhlIHJlbGF0aXZlIHBvc2l0aW9ucyB3aW5kb3dYIGFuZCB3aW5kb3dZXG4gICAgLy8gYW5kIGFkanVzdGluZyBzY2FsZSBpZiBpdCdzIHNldFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX29uV2luZG93UmVzaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgod2lkdGgpO1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoaGVpZ2h0KTtcblxuICAgICAgICBpZih0aGlzLl93aW5kb3dTY2FsZSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmN0aW9uKGRpc3BsYXlPYmplY3QpIHtcbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3QuX29uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFNwcml0ZXNoZWV0IFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gdXNlZCB0byBnZXQgaW5kaXZpZHVhbCB0ZXh0dXJlcyBvZiBzcHJpdGVzaGVldCBqc29uIGZpbGVzXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIGNhbGw6IGdldEZpbGVOYW1lcygnYW5pbWF0aW9uX2lkbGVfJywgMSwgMTA1KTtcbiAgICAvLyBSZXR1cm5zOiBbJ2FuaW1hdGlvbl9pZGxlXzAwMS5wbmcnLCAnYW5pbWF0aW9uX2lkbGVfMDAyLnBuZycsIC4uLiAsICdhbmltYXRpb25faWRsZV8xMDQucG5nJ11cbiAgICAvL1xuICAgIGZ1bmN0aW9uIGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICB2YXIgbnVtRGlnaXRzID0gKHJhbmdlRW5kLTEpLnRvU3RyaW5nKCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICB2YXIgbnVtWmVyb3MgPSBudW1EaWdpdHMgLSBudW0udG9TdHJpbmcoKS5sZW5ndGg7ICAgLy9leHRyYSBjaGFyYWN0ZXJzXG4gICAgICAgICAgICB2YXIgemVyb3MgPSBuZXcgQXJyYXkobnVtWmVyb3MgKyAxKS5qb2luKCcwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlUHJlZml4ICsgemVyb3MgKyBudW0gKyAnLnBuZyc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFBJWEkuZ2V0VGV4dHVyZXMgPSBmdW5jdGlvbihmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICByZXR1cm4gXy5tYXAoZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgUElYSS5UZXh0dXJlLmZyb21GcmFtZSk7XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogTWVtb3J5IENsZWFudXAgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGRlc3Ryb3lCYXNlVGV4dHVyZSkge1xuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKGRlc3Ryb3lCYXNlVGV4dHVyZSkpIGRlc3Ryb3lCYXNlVGV4dHVyZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHRoaXMudGV4dHVyZS5kZXN0cm95KGRlc3Ryb3lCYXNlVGV4dHVyZSk7XG4gICAgfTtcblxuICAgIFBJWEkuTW92aWVDbGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oZGVzdHJveUJhc2VUZXh0dXJlKSB7XG4gICAgICAgIGlmKF8uaXNVbmRlZmluZWQoZGVzdHJveUJhc2VUZXh0dXJlKSkgZGVzdHJveUJhc2VUZXh0dXJlID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgXy5lYWNoKHRoaXMudGV4dHVyZXMsIGZ1bmN0aW9uKHRleHR1cmUpIHtcbiAgICAgICAgICAgIHRleHR1cmUuZGVzdHJveShkZXN0cm95QmFzZVRleHR1cmUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG5cblxufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciBpbnRyb1ZpZGVvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRyb1ZpZGVvJyk7XG4gICAgdmFyIGJhY2tncm91bmRNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JhY2tncm91bmQnKTtcbiAgICB2YXIgYmxhZGV3aXBlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9ibGFkZXdpcGUnKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG4gICAgdmFyIHBhcmFjaHV0ZXJzTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYXJhY2h1dGVycycpO1xuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplSGVhZGVyRm9vdGVyKHNjZW5lKSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaGVhZGVyLnBuZycpO1xuXG4gICAgICAgIGhlYWRlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGhlYWRlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDApO1xuICAgICAgICBoZWFkZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgaGVhZGVyLndpbmRvd1kgPSAwO1xuXG4gICAgICAgIHZhciBmb290ZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9vdGVyLnBuZycpO1xuXG4gICAgICAgIGZvb3Rlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGZvb3Rlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgICAgIGZvb3Rlci53aW5kb3dYID0gMC41O1xuICAgICAgICBmb290ZXIud2luZG93WSA9IDE7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZm9vdGVyKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiogUHJpbWFyeSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBNYWluU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgU2NlbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmluaXRpYWxpemUoKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRCYWNrZ3JvdW5kVG9TY2VuZSh0aGlzKTtcbiAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRSZXN0VG9TY2VuZSh0aGlzKTtcblxuICAgICAgICBibGFkZXdpcGVNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG5cbiAgICAgICAgaW5pdGlhbGl6ZUhlYWRlckZvb3Rlcih0aGlzKTtcblxuICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIHRoaXMuaW50cm9WaWRlbyA9IGludHJvVmlkZW9Nb2R1bGUuZ2V0VmlkZW8oKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZUluVXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBhcmFsbGF4IFN0dWZmICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLnNoaWZ0QmFja2dyb3VuZExheWVycyh4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmlldzogZnVuY3Rpb24odmlldykge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgfSxcbiAgICAgICAgX29uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBTY2VuZS5wcm90b3R5cGUuX29uV2luZG93UmVzaXplLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMudmlldykpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLmludHJvVmlkZW8uc2NhbGU7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuaW50cm9WaWRlby5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Lm9uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQsIChib3VuZHMud2lkdGggKiBzY2FsZS54KSwgKGJvdW5kcy5oZWlnaHQgKiBzY2FsZS55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuXG5cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbiAgICAvLyBFeHRlbmRzIFNjZW5lIENsYXNzXG4gICAgZXh0ZW5kKFNjZW5lLCBNYWluU2NlbmUpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5TY2VuZTtcbn0pKCk7IiwiXG5cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxudmFyIFNjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNCID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgUElYSS5TdGFnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuU2NlbmUucHJvdG90eXBlID0ge1xuICAgIG9uVXBkYXRlOiBmdW5jdGlvbih1cGRhdGVDQikge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCID0gdXBkYXRlQ0I7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNCKCk7XG4gICAgfSxcbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlc3VtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgfSxcbiAgICBpc1BhdXNlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlZDtcbiAgICB9XG59O1xuXG5cbmV4dGVuZChQSVhJLlN0YWdlLCBTY2VuZSk7XG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgU2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJyk7XG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIHZhciBTY2VuZXNNYW5hZ2VyID0ge1xuICAgICAgICBzY2VuZXM6IHt9LFxuICAgICAgICBjdXJyZW50U2NlbmU6IG51bGwsXG4gICAgICAgIHJlbmRlcmVyOiBudWxsLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCAkcGFyZW50RGl2KSB7XG5cbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyKSByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpZHRoLCBoZWlnaHQsIG51bGwsIHRydWUsIHRydWUpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcuc2V0QXR0cmlidXRlKCdpZCcsICdwaXhpLXZpZXcnKTtcbiAgICAgICAgICAgICRwYXJlbnREaXYuYXBwZW5kKFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldyk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKFNjZW5lc01hbmFnZXIubG9vcCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBsb29wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uICgpIHsgU2NlbmVzTWFuYWdlci5sb29wKCkgfSk7XG5cbiAgICAgICAgICAgIGlmICghU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgfHwgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUuaXNQYXVzZWQoKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS51cGRhdGUoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIucmVuZGVyKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlU2NlbmU6IGZ1bmN0aW9uKGlkLCBTY2VuZUNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBTY2VuZUNvbnN0cnVjdG9yID0gU2NlbmVDb25zdHJ1Y3RvciB8fCBTY2VuZTsgICAvL2RlZmF1bHQgdG8gU2NlbmUgYmFzZSBjbGFzc1xuXG4gICAgICAgICAgICB2YXIgc2NlbmUgPSBuZXcgU2NlbmVDb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdID0gc2NlbmU7XG5cbiAgICAgICAgICAgIHJldHVybiBzY2VuZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ29Ub1NjZW5lOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkge1xuICAgICAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSkgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lID0gU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciByZXNpemUgdG8gbWFrZSBzdXJlIGFsbCBjaGlsZCBvYmplY3RzIGluIHRoZVxuICAgICAgICAgICAgICAgIC8vIG5ldyBzY2VuZSBhcmUgY29ycmVjdGx5IHBvc2l0aW9uZWRcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXN1bWUgbmV3IHNjZW5lXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUucmVzdW1lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCJcblxuXG5cblxudmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxudmFyIHNvdW5kUGxheWVyID0ge1xuICAgIG11dGVkOiBmYWxzZSxcbiAgICB2b2x1bWU6IDAuNCxcbiAgICBzb3VuZHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXSA9IHRoaXMuc291bmRzW2ZpbGVQYXRoXSB8fCBuZXcgQXVkaW8oZmlsZVBhdGgpO1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5hZGQoZmlsZVBhdGgpO1xuXG4gICAgICAgIGlmKCF0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0udm9sdW1lID0gdGhpcy52b2x1bWU7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0ucGxheSgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheScsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXy5lYWNoKGF1ZGlvQXNzZXRzLCBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHNvdW5kUGxheWVyLmFkZChmaWxlUGF0aCk7XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc291bmRQbGF5ZXI7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZW1wdHktc3BhY2VcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5uYW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiIHZhbHVlPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBpZD1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZhbHVlKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZhbHVlKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj48L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudGV4dCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50ZXh0KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYm94LXNoYWRvd1xcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3B5KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcHkpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMSwgcHJvZ3JhbTEsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvYXNzZXRzLmpzb24nKTtcblxudmFyIGZpbGVOYW1lcyA9IE9iamVjdC5rZXlzKGFzc2V0RGF0YS5hc3NldHMpO1xudmFyIHRvdGFsRmlsZXMgPSBmaWxlTmFtZXMubGVuZ3RoO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy51cGRhdGUodGhpcy5sb2FkQ291bnQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBfLmJpbmQodmlldy5hc3NldHNMb2FkZWQsIHZpZXcpO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBWaWV3ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBBc3NldExvYWRpbmdWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnI2Fzc2V0TG9hZGVyJyxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJHRleHQgPSB0aGlzLiRlbC5maW5kKCc+IC50ZXh0Jyk7XG4gICAgICAgIHRoaXMuJHRleHQuaHRtbCgnMC4wMCUnKTtcblxuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IG9wdGlvbnMub25Db21wbGV0ZSB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgICAgc3RhcnRMb2FkZXIodGhpcyk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGxvYWRDb3VudCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwMDAgKiAodG90YWxGaWxlcy1sb2FkQ291bnQpL3RvdGFsRmlsZXMpLzEwMDtcblxuICAgICAgICB0aGlzLiR0ZXh0Lmh0bWwocGVyY2VudGFnZSArICclJyk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuXG4gICAgICAgIHRoaXMuJHRleHQuaGlkZSgpO1xuICAgICAgICB2YXIgJGVsID0gdGhpcy4kZWw7XG4gICAgICAgIFR3ZWVuTGl0ZS50bygkZWwsIDEuNCwge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRlbC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldExvYWRpbmdWaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleWRvd24gaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlcklubmVyID0gdGhpcy4kcGxhY2Vob2xkZXIuZmluZCgnPiBkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnZGl2LnRpdGxlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICBfLmJpbmRBbGwodGhpcywgJ3N0YXJ0QW5pbWF0aW9uJywnc2hvdycsJ2hpZGUnLCdzZXRJbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0U2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuc2NlbmVzWydtYWluJ107XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIFJ1biBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI3BpeGktdmlldycpLnJlbW92ZUNsYXNzKCdmcm9udCcpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnN0YXJ0RW50ZXJOYW1lQW5pbWF0aW9uKCk7ICAgLy9hbmltYXRlIGluIGNoYXJhY3RlcnNcblxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjM7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiR0aXRsZSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kbmFtZUlucHV0LCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxLCB5OiAwLCBlYXNlOiAnQmFjay5lYXNlT3V0JywgZGVsYXk6IDAuMTV9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBwcmVBbmltYXRpb25TZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJHRpdGxlLCB7b3BhY2l0eTogMCwgeTogLTc1fSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJG5hbWVJbnB1dCwge29wYWNpdHk6IDB9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kcGxhY2Vob2xkZXJJbm5lciwge29wYWNpdHk6IDAsIHk6IC01MH0pO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBTaG93L0hpZGUgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLmdvVG9TY2VuZSgnbWFpbicpO1xuXG4gICAgICAgICAgICB0aGlzLnByZUFuaW1hdGlvblNldHVwKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc3RhcnRBbmltYXRpb24sIDApO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5vbkFuaW1hdGlvbk91dENvbXBsZXRlKHRoaXMuc2V0SW5hY3RpdmUpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kZWwsIDAuMywge29wYWNpdHk6IDB9KTtcblxuICAgICAgICAgICAgLy9ydW4gaGlkZSBhbmltYXRpb25cbiAgICAgICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLmFuaW1hdGVPdXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNDYW5uZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBzZXRJbmFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfSxcblxuICAgICAgICBvbk5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLiRuYW1lSW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyLnRvZ2dsZSh2YWwgPT09ICcnKTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB2YWx9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVZpZXc7XG59KSgpO1xuIiwiXG5cblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzb3VuZFBsYXllciA9IHJlcXVpcmUoJy4uL3NvdW5kUGxheWVyJyk7XG5cbiAgICB2YXIgRm9vdGVyVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS52b2x1bWUnOiAnb25Wb2x1bWVUb2dnbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm51bURvdHMgPSBvcHRpb25zLm51bURvdHM7XG5cblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENvdW50ZXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzID0gdGhpcy4kZWwuZmluZCgnYS52b2x1bWUgcGF0aCcpO1xuICAgICAgICAgICAgdGhpcy4kY291bnRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5jb3VudGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRkb3RzID0gdGhpcy4kY291bnRlci5maW5kKCc+IC5kb3QnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFZvbHVtZUFuaW1hdGlvblRpbWVsaW5lczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uQW5pbWF0aW9uID0gdGhpcy5nZXRUaW1lbGluZVZvbHVtZU9uKCk7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPZmYoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdENvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG51bURvdHMgPSB0aGlzLm51bURvdHM7XG5cbiAgICAgICAgICAgIHZhciAkZG90ID0gdGhpcy4kZG90cy5lcSgwKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMjsgaSA8PSBudW1Eb3RzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgJG5ld0RvdCA9ICRkb3QuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAkbmV3RG90LmZpbmQoJz4gZGl2Lm51bWJlcicpLmh0bWwoaSk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5hcHBlbmRUbyh0aGlzLiRjb3VudGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QgPSAkZG90O1xuICAgICAgICAgICAgJGRvdC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqIFZvbHVtZSBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICB0b2dnbGVWb2x1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9ICF0aGlzLnZvbHVtZU9uO1xuXG4gICAgICAgICAgICBpZih0aGlzLnZvbHVtZU9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICAgICAgc291bmRQbGF5ZXIub2ZmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVuZE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZWFzaW5nOiAnQmFjay5lYXNlT3V0Jywgb3BhY2l0eTogMX07XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAuNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVuZE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlYXNpbmc6ICdCYWNrLmVhc2VJbicsIG9wYWNpdHk6IDB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgb25cbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoMSwwLDAsMSwwLDApJyk7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5jc3MoJ29wYWNpdHknLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAuNSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkU3ZnUGF0aEFuaW1hdGlvbjogZnVuY3Rpb24odGltZWxpbmUsICRwYXRoLCBzdGFydFRpbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBhbmltYXRpb25TcGVlZCA9IDAuMjtcblxuICAgICAgICAgICAgdmFyIHBhdGhNYXRyaXggPSBfLmNsb25lKG9wdGlvbnMuc3RhcnRNYXRyaXgpO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5BdHRycyA9IHtcbiAgICAgICAgICAgICAgICBlYXNlOiBvcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXRoLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoJyArIHBhdGhNYXRyaXguam9pbignLCcpICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0d2VlbkF0dHJzLCBvcHRpb25zLmVuZE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oJHBhdGgsIGFuaW1hdGlvblNwZWVkLCB7b3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5fSksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8ocGF0aE1hdHJpeCwgYW5pbWF0aW9uU3BlZWQsIHR3ZWVuQXR0cnMpLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBDb3VudGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNldENvdW50ZXI6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMuZXEoaSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gdGhpcy4kZG90cy5lcShpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kY291bnRlci5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5vdXRlckhlaWdodCgpICsgdGhpcy4kY291bnRlci5vdXRlckhlaWdodCgpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25Wb2x1bWVUb2dnbGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy50b2dnbGVWb2x1bWUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEZvb3RlclZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxuICAgIHZhciBpbnRyb1ZpZGVvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRyb1ZpZGVvJyk7XG5cbiAgICB2YXIgSW50cm9WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNpbnRyby12aWV3JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5iZWdpbic6ICdvbkJlZ2luQ2xpY2snXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uVGltZWxpbmUoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRiZWdpblNjcmVlbiA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5iZWdpbi1zY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luTGluZXMgPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdkaXYubGluZScpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4gPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdhLmJlZ2luJyk7XG5cbiAgICAgICAgICAgIHZhciAkdmlld1BvcnRzID0gdGhpcy4kZWwuZmluZCgnZGl2LnZpZXdwb3J0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHZpZXdQb3J0VG9wID0gJHZpZXdQb3J0cy5maWx0ZXIoJy50b3AnKTtcbiAgICAgICAgICAgIHRoaXMuJHZpZXdQb3J0Qm90dG9tID0gJHZpZXdQb3J0cy5maWx0ZXIoJy5idG0nKTtcblxuICAgICAgICAgICAgdGhpcy4kdmVydGljYWxTaWRlcyA9ICR2aWV3UG9ydHMuZmluZCgnLnZlcnRpY2FsJyk7XG4gICAgICAgICAgICB0aGlzLiRob3Jpem9udGFsU2lkZXMgPSAkdmlld1BvcnRzLmZpbmQoJy5ob3Jpem9udGFsJyk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kcyA9ICR2aWV3UG9ydHMuZmluZCgnLmJhY2tncm91bmQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEFuaW1hdGlvblRpbWVsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudGltZWxpbmVIaWRlID0gdGhpcy5nZXRUaW1lbGluZUhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFNjZW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLnNjZW5lc1snbWFpbiddO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNldFZpZXcodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0JlZ2luU2NyZWVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KF8uYmluZCh0aW1lbGluZS5wbGF5LCB0aW1lbGluZSksIDIwMCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBnZXRUaW1lbGluZUJlZ2luU2NyZWVuSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0JhY2suZWFzZU91dCc7XG5cbiAgICAgICAgICAgIHZhciB0d2VlbnMgPSBfLm1hcCh0aGlzLiRiZWdpbkxpbmVzLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhsaW5lLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHR3ZWVuczogdHdlZW5zLFxuICAgICAgICAgICAgICAgIHN0YWdnZXI6IDAuMDgsXG4gICAgICAgICAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kYmVnaW5CdG4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuLnNob3coKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYnRuSW5UaW1lID0gMC40O1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlWTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBzY2FsZVg6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0VsYXN0aWMuZWFzZU91dCdcbiAgICAgICAgICAgIH0pLCBidG5JblRpbWUgKyAoYW5pbWF0aW9uVGltZSAqIDAuMDUpKTtcblxuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqIFRpbWVsaW5lICoqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0aW9uRmluaXNoZWQsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVNjb3BlOiB0aGlzXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpblNjcmVlbiwgYW5pbWF0aW9uVGltZS80LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiR2aWV3UG9ydFRvcCwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHRvcDogJy01MCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiR2aWV3UG9ydEJvdHRvbSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIGJvdHRvbTogJy01MCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQW5pbWF0aW9uRmluaXNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRJbmFjdGl2ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2luYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnRzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZHMud2lkdGgodmlkZW9XaWR0aCAqIDEuMjc1IHwgMCk7XG4gICAgICAgICAgICB0aGlzLiRob3Jpem9udGFsU2lkZXMuaGVpZ2h0KCgod2luZG93SGVpZ2h0IC0gdmlkZW9IZWlnaHQpLzIgKyAxKSB8IDApOyAvL3JvdW5kIHVwXG4gICAgICAgICAgICB0aGlzLiR2ZXJ0aWNhbFNpZGVzLndpZHRoKCgod2luZG93V2lkdGggLSB2aWRlb1dpZHRoKS8yICsgMSkgfCAwKTsgLy9yb3VuZCB1cFxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcblxuICAgICAgICAgICAgJCgnI3BpeGktdmlldycpLmFkZENsYXNzKCdmcm9udCcpO1xuXG4gICAgICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLm9uQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd0JlZ2luU2NyZWVuLCB0aGlzKSk7XG4gICAgICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLnBsYXlWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudGltZWxpbmVIaWRlLnBsYXkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgTWFpblNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9tYWluU2NlbmUnKTtcbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENvbGxlY3Rpb25zIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBWaWV3cyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgSW50cm9WaWV3ID0gcmVxdWlyZSgnLi9pbnRyb1ZpZXcnKTtcbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IHJlcXVpcmUoJy4vZW50ZXJOYW1lVmlldycpO1xuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gcmVxdWlyZSgnLi9zZWxlY3RDaGFyYWN0ZXJWaWV3Jyk7XG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IHJlcXVpcmUoJy4vcmVzcG9uc2VWaWV3Jyk7XG4gICAgdmFyIEZvb3RlclZpZXcgPSByZXF1aXJlKCcuL2Zvb3RlclZpZXcnKTtcblxuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVzKHZpZXdzKSB7XG4gICAgICAgIHJldHVybiBfLm1hcCh2aWV3cywgZnVuY3Rpb24odmlldykge3JldHVybiB2aWV3Lm1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7IH0pO1xuICAgIH1cblxuICAgIHZhciBNYWluVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjY29udGVudCcsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEubmV4dCc6ICdvbk5leHQnLFxuICAgICAgICAgICAgJ2NsaWNrIGEuZmluaXNoLXNlbmQnOiAnb25GaW5pc2gnLFxuICAgICAgICAgICAgJ2NsaWNrIGEuc2tpcCc6ICdvblNraXAnLFxuICAgICAgICAgICAgJ21vdXNlbW92ZSc6ICdvbk1vdXNlTW92ZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gW107XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuXG4gICAgICAgICAgICAvL2NyZWF0ZSBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5pbml0aWFsaXplKHRoaXMuJHdpbmRvdy53aWR0aCgpLCB0aGlzLiR3aW5kb3cuaGVpZ2h0KCksIHRoaXMuJGVsKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBNYWluU2NlbmUpO1xuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0V2luZG93RXZlbnRzKCk7XG5cbiAgICAgICAgICAgIC8vc2V0dXAgb3B0aW9ucyBmb3IgZmlyc3QgY2FubmVkIHZpZXdcbiAgICAgICAgICAgIHRoaXMuY2FubmVkVmlld3MgPSBfLmZpbHRlcih0aGlzLnBhZ2VzLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UubW9kZWwuYXR0cmlidXRlcy5jbGFzcyA9PT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0V2luZG93RXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5vbigncmVzaXplJywgXy5iaW5kKHRoaXMucmVwb3NpdGlvblBhZ2VOYXYsIHRoaXMpKTtcbi8vXG4vLyAgICAgICAgICAgIGlmICh3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW9yaWVudGF0aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvcmllbnRhdGlvbicsIGV2ZW50LmJldGEsIGV2ZW50LmdhbW1hKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW1vdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3Rpb24nLCBldmVudC5hY2NlbGVyYXRpb24ueCAqIDIsIGV2ZW50LmFjY2VsZXJhdGlvbi55ICogMik7XG4vLyAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3ogb3JpZW50YXRpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIk1vek9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKG9yaWVudGF0aW9uKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veicsIG9yaWVudGF0aW9uLnggKiA1MCwgb3JpZW50YXRpb24ueSAqIDUwKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEludHJvVmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9WaWV3ID0gbmV3IEludHJvVmlldygpO1xuXG4gICAgICAgICAgICBpbnRyb1ZpZXcub25Db21wbGV0ZShfLmJpbmQodGhpcy5zaG93Rmlyc3RQYWdlLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW50cm9WaWV3ID0gaW50cm9WaWV3O1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRQYWdlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2hhck1vZGVsID0gXy5maXJzdChhbGxRdWVzdGlvbnMubW9kZWxzKTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbk1vZGVscyA9IF8ucmVzdChhbGxRdWVzdGlvbnMubW9kZWxzKTtcblxuICAgICAgICAgICAgdmFyIGVudGVyTmFtZVZpZXcgPSBuZXcgRW50ZXJOYW1lVmlldygpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdENoYXJWaWV3ID0gbmV3IFNlbGVjdENoYXJhY3RlclZpZXcoe21vZGVsOiBjaGFyTW9kZWwsIHBhcmVudDogdGhpcy4kcGFnZXNDb250YWluZXJ9KTtcblxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uVmlld3MgPSBfLm1hcChxdWVzdGlvbk1vZGVscywgZnVuY3Rpb24ocXVlc3Rpb25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVlc3Rpb25WaWV3KHttb2RlbDogcXVlc3Rpb25Nb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMucGFnZXMgPSBbZW50ZXJOYW1lVmlldywgc2VsZWN0Q2hhclZpZXddLmNvbmNhdChxdWVzdGlvblZpZXdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBhZ2VzLWN0bicpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2ID0gdGhpcy4kcGFnZXNDb250YWluZXIuZmluZCgnZGl2LnBhZ2UtbmF2Jyk7XG4gICAgICAgICAgICB0aGlzLiRuZXh0ID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLm5leHQnKTtcbiAgICAgICAgICAgIHRoaXMuJGZpbmlzaFNlbmQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EuZmluaXNoLXNlbmQnKTtcblxuICAgICAgICAgICAgdGhpcy4kc2tpcCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5za2lwJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiogQ2FubmVkIFF1ZXN0aW9uIFZpZXcgU3R1ZmYgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdXBkYXRlVmlld09wdGlvbnNXaXRoVW51c2VkOiBmdW5jdGlvbihjYW5uZWRWaWV3KSB7XG4gICAgICAgICAgICB2YXIgdXNlZE9wdGlvbnMgPSBfLmNvbXBhY3QoZ2V0VmFsdWVzKHRoaXMuY2FubmVkVmlld3MpKTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBhbGxRdWVzdGlvbnMuZ2V0VW51c2VkQ2FubmVkT3B0aW9ucygzLCB1c2VkT3B0aW9ucyk7XG5cbiAgICAgICAgICAgIGNhbm5lZFZpZXcuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogQ2hhbmdlIFZpZXcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0ZpcnN0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzWzBdLnNob3coKTtcblxuICAgICAgICAgICAgdGhpcy4kbmV4dC5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLnJlcG9zaXRpb25QYWdlTmF2KGZhbHNlKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJG5leHQsIDAuMywge29wYWNpdHk6IDF9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAvL2hpZGUgYWN0aXZlIHBhZ2VcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4ICsgMV07XG5cbiAgICAgICAgICAgIGlmKG5leHRQYWdlLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdPcHRpb25zV2l0aFVudXNlZChuZXh0UGFnZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID09PSAwKSB7IC8vY2hhcmFjdGVyIHNlbGVjdCBwYWdlXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlU2tpcCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIC8vYW5pbWF0ZSBpbiBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVJblVzZXJDaGFyYWN0ZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTa2lwKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdih0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5mb290ZXIuc2V0Q291bnRlcih0aGlzLmFjdGl2ZVBhZ2VJbmRleCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dQYWdlQWZ0ZXJIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsYXN0UGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXgtMV07XG4gICAgICAgICAgICBpZihsYXN0UGFnZS5pc0Nhbm5lZCgpKSB7XG4gICAgICAgICAgICAgICAgbGFzdFBhZ2UucmVtb3ZlT3B0aW9ucygpOyAgIC8vY2FubmVkIG9wdGlvbnMgYXJlIHJlcGVhdGVkIGFuZCBzaGFyZSB0aGUgc2FtZSBJRFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3Nob3cgbmV4dCBwYWdlXG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgbmV4dFBhZ2Uub25TaG93Q29tcGxldGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBuZXh0UGFnZS5zaG93KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID09PSB0aGlzLnBhZ2VzLmxlbmd0aC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RmluaXNoQnRuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlU2tpcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaG93RmluaXNoQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQW5kU2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5oaWRlQ291bnRlcigpO1xuXG4gICAgICAgICAgICB2YXIgcGFnZU1vZGVscyA9IF8ubWFwKHRoaXMucGFnZXMsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5tb2RlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2V0UmVzcG9uc2UocGFnZU1vZGVscyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUub25Vc2VyQ2hhcmFjdGVyT3V0KF8uYmluZCh0aGlzLnNjZW5lLnBsYXlXaXBlc2NyZWVuLCB0aGlzLnNjZW5lKSk7XG5cbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLm9uV2lwZXNjcmVlbkNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1lLnJlc3BvbnNlVmlldy5zaG93KCk7XG4gICAgICAgICAgICAgICAgbWUuc2NlbmUuc2hvd1Jlc3BvbnNlKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcG9zaXRpb25QYWdlTmF2OiBmdW5jdGlvbihhbmltYXRlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgcGl4ZWxQb3NpdGlvbiA9IChhY3RpdmVQYWdlLiRlbC5vZmZzZXQoKS50b3AgKyBhY3RpdmVQYWdlLiRlbC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IHRoaXMuJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgICAgICAgICAgdmFyIHRvcEZyYWMgPSBNYXRoLm1pbihwaXhlbFBvc2l0aW9uL3dpbmRvd0hlaWdodCwgKHdpbmRvd0hlaWdodCAtIHRoaXMuZm9vdGVyLmhlaWdodCgpIC0gdGhpcy4kcGFnZU5hdi5vdXRlckhlaWdodCgpKS93aW5kb3dIZWlnaHQpO1xuXG4gICAgICAgICAgICB2YXIgcGVyY1RvcCA9IDEwMCAqIHRvcEZyYWMgKyAnJSc7XG5cbiAgICAgICAgICAgIGlmKCEhYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRwYWdlTmF2LCAwLjIsIHt0b3A6IHBlcmNUb3AsIGVhc2U6J1F1YWQuZWFzZUluT3V0J30pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYuY3NzKCd0b3AnLCBwZXJjVG9wKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIGhpZGVTa2lwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRza2lwLCAwLjIsIHtib3R0b206ICcxMDAlJ30pO1xuICAgICAgICB9LFxuICAgICAgICBzaG93U2tpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kc2tpcCwgMC4yLCB7Ym90dG9tOiAwfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvVmlldyA9IHRoaXMuaW50cm9WaWV3O1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGludHJvVmlldy5zdGFydCgpOyAvL3N0YXJ0IGludHJvXG5cbiAgICAgICAgICAgICAgICAvL3RyaWdnZXIgd2luZG93IHJlc2l6ZVxuICAgICAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25OZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF0ubW9kZWwuYXR0cmlidXRlcy52YWx1ZSA9PT0gJydcbiAgICAgICAgICAgICAgICB8fCB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA+PSAodGhpcy5wYWdlcy5sZW5ndGggLSAxKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRmluaXNoOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuZmluaXNoQW5kU2VuZCgpO1xuICAgICAgICB9LFxuICAgICAgICBvbk1vdXNlTW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNoaWZ0QmFja2dyb3VuZExheWVycyhlLnBhZ2VYL3RoaXMuJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Ta2lwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdza2lwJywgdGhpcy5hbmltYXRpbmcsIHRoaXMuYWN0aXZlUGFnZUluZGV4LCB0aGlzLnBhZ2VzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbWF0aW5nIHx8IHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTWFpblZpZXc7XG5cblxuXG59KSgpOyIsIlxuXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcXVlc3Rpb24uaGJzJyk7XG52YXIgaXRlbUFuaW1hdGlvbnNNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3BhZ2VJdGVtcycpO1xuXG52YXIgUXVlc3Rpb25WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIC8vIFZhcmlhYmxlc1xuICAgIGNsYXNzTmFtZTogJ3F1ZXN0aW9uIHBhZ2UnLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgaW5wdXRbdHlwZT1yYWRpb10nOiAnb25SYWRpb0NoYW5nZSdcbiAgICB9LFxuICAgIC8vIEZ1bmN0aW9uc1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcblxuICAgICAgICBvcHRpb25zLnBhcmVudC5hcHBlbmQodGhpcy5lbCk7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3ModGhpcy5tb2RlbC5hdHRyaWJ1dGVzLmNsYXNzKTtcblxuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuXG4gICAgICAgIGlmKHRoaXMuJG9wdGlvbnMubGVuZ3RoICE9PSAwKVxuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucygpO1xuICAgIH0sXG4gICAgaW5pdEFuaW1hdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgYW5pbWF0aW9ucztcblxuICAgICAgICBpZih0aGlzLmlzQ2FubmVkKCkpIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21DYW5uZWRBbmltYXRpb25zKHRoaXMuJG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IGl0ZW1BbmltYXRpb25zTW9kdWxlLmdldFJhbmRvbVBlcnNvbmFsaXR5QW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSW4gPSBhbmltYXRpb25zWzBdO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dCA9IGFuaW1hdGlvbnNbMV07XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25Jbi52YXJzLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLnNob3dDYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQudmFycy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLmhpZGVDYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgfSxcbiAgICBzZXRBbmltYXRpb25JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB9LFxuXG5cbiAgICByZW1vdmVPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy4kb3B0aW9ucy5yZW1vdmUoKTtcbiAgICB9LFxuICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ29wdGlvbnMnLCBvcHRpb25zKTtcblxuICAgICAgICAvL3JlaW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLiRvcHRpb25zID0gdGhpcy4kZWwuZmluZCgnZGl2Lm9wdGlvbicpO1xuICAgICAgICB0aGlzLmluaXRBbmltYXRpb25zKCk7XG4gICAgfSxcbiAgICBpc0Nhbm5lZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5hdHRyaWJ1dGVzLmNsYXNzID09PSAnY2FubmVkJztcbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5lbC5pbm5lckhUTUwgPT09ICcnKVxuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluLnBsYXkoKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC5wbGF5KCk7XG4gICAgfSxcbiAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuICAgIG9uU2hvd0NvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnNob3dDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIHRleHQgPSAkKGUuY3VycmVudFRhcmdldCkuc2libGluZ3MoJ2Rpdi50ZXh0JykuaHRtbCgpO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgndmFsdWUnKSwgdGV4dDogdGV4dH0pO1xuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHJlc3BvbnNlTWFwID0gcmVxdWlyZSgnLi4vZGF0YS9yZXNwb25zZU1hcC5qc29uJyk7XG5cbiAgICB2YXIgUmVzcG9uc2VWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNyZXNwb25zZScsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEjcHJpbnR2ZXJzaW9uJzogJ3ByaW50J1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy90aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5jcmVhdGVTY2VuZSgncmVzcG9uc2UnLCBSZXNwb25zZVNjZW5lKTtcblxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZCA9ICQoJyNyZXNwb25zZS1iZycpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBzZXRSZXNwb25zZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSAobW9kZWxzWzBdLmF0dHJpYnV0ZXMudmFsdWUgPT0gJycpID8gJ0ZyaWVuZCcgOiBtb2RlbHNbMF0uYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXJNb2RlbCA9IG1vZGVsc1sxXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZC5hZGRDbGFzcyhjaGFyYWN0ZXJNb2RlbC5hdHRyaWJ1dGVzLnZhbHVlKTtcblxuICAgICAgICAgICAgdmFyIGFuc3dlcmVkUXVlc3Rpb25zID0gXy5maWx0ZXIoXy5yZXN0KG1vZGVscywgMiksIGZ1bmN0aW9uKG1vZGVsKSB7cmV0dXJuIG1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgIT09ICcnfSk7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aXRpb25lZFF1ZXN0aW9ucyA9IF8ucGFydGl0aW9uKGFuc3dlcmVkUXVlc3Rpb25zLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbC5hdHRyaWJ1dGVzLmNsYXNzICE9PSAnY2FubmVkJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1swXTtcbiAgICAgICAgICAgIHZhciBjYW5uZWRNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1sxXTtcblxuXG4gICAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gY2hhcmFjdGVyTW9kZWwuYXR0cmlidXRlcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8vICoqKioqKioqIHNvcnQgaGVyZSAqKioqKioqKlxuICAgICAgICAgICAgdmFyIGNhbm5lZE9yZGVyID0ge1xuICAgICAgICAgICAgICBqb2I6IDAsXG4gICAgICAgICAgICAgIGZvcmVzdGZpcmVzOiAxLFxuICAgICAgICAgICAgICBmaXJlZmlnaHRlcjogMixcbiAgICAgICAgICAgICAgYmVzdGZyaWVuZDogMyxcbiAgICAgICAgICAgICAgZmF2b3JpdGVwbGFjZTogNFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5T3JkZXIgPSB7XG4gICAgICAgICAgICAgIGZvb2Q6IDAsXG4gICAgICAgICAgICAgIGNvbG9yOiAxLFxuICAgICAgICAgICAgICBhbmltYWw6IDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXy5zb3J0QnkoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7XG4gICAgICAgICAgICAgIHJldHVybiBjYW5uZWRPcmRlclttb2RlbC5hdHRyaWJ1dGVzLnZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBfLnNvcnRCeShwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpe1xuICAgICAgICAgICAgLy8gICByZXR1cm4gcGVyc29uYWxpdHlPcmRlclttb2RlbC5hdHRyaWJ1dGVzLm5hbWVdO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwZXJzb25hbGl0eVJlc3BvbnNlcyA9IF8ubWFwKHBlcnNvbmFsaXR5TW9kZWxzLCBmdW5jdGlvbihtb2RlbCkgIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2VNYXBbY2hhcmFjdGVyXVttb2RlbC5hdHRyaWJ1dGVzLm5hbWVdKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2VNYXBbY2hhcmFjdGVyXSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlaGVyJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuYXR0cmlidXRlcy5uYW1lXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgbW9kZWwuYXR0cmlidXRlcy50ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY2FubmVkUmVzcG9uc2VzID0gXy5tYXAoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc3BvbnNlICs9ICcgJyArIGNhbm5lZFJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBwZXJzb25hbGl0eVJlc3BvbnNlcy5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgICQoJyNjYXJkLWhlYWRlcicpLmZpbmQoJ3NwYW4nKS5odG1sKHVzZXJOYW1lKTtcbiAgICAgICAgICAgICQoJyNjYXJkLXNpbmNlcmVseScpLmZpbmQoJ3NwYW4nKS5odG1sKHVzZXJOYW1lKTtcbiAgICAgICAgICAgICQoJyNjYXJkLWJvZHknKS5odG1sKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoJyNjYXJkLWZyb20nKS5odG1sKGNoYXJhY3Rlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcbiAgICAgICAgICAgIC8vc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ3Jlc3BvbnNlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBwcmludDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICAgICAgfVxuXG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VWaWV3O1xufSkoKTsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIHNvdW5kUGxheWVyID0gcmVxdWlyZSgnLi4vc291bmRQbGF5ZXInKTtcbiAgICB2YXIgYXVkaW9Bc3NldHMgPSByZXF1aXJlKCcuLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gUXVlc3Rpb25WaWV3LmV4dGVuZCh7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgY2hhciA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgICAgIHZhciBmaWxlUGF0aCA9IGF1ZGlvQXNzZXRzW2NoYXJdO1xuXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5KGZpbGVQYXRoKTtcblxuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLnNldENoYXJhY3RlcihjaGFyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNlbGVjdENoYXJhY3RlclZpZXc7XG59KSgpOyIsIlwidXNlIHN0cmljdFwiO1xuLypnbG9iYWxzIEhhbmRsZWJhcnM6IHRydWUgKi9cbnZhciBiYXNlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9iYXNlXCIpO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3V0aWxzXCIpO1xudmFyIHJ1bnRpbWUgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3J1bnRpbWVcIik7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxudmFyIGNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn07XG5cbnZhciBIYW5kbGViYXJzID0gY3JlYXRlKCk7XG5IYW5kbGViYXJzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIYW5kbGViYXJzOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFZFUlNJT04gPSBcIjEuMy4wXCI7XG5leHBvcnRzLlZFUlNJT04gPSBWRVJTSU9OO3ZhciBDT01QSUxFUl9SRVZJU0lPTiA9IDQ7XG5leHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc+PSAxLjAuMCdcbn07XG5leHBvcnRzLlJFVklTSU9OX0NIQU5HRVMgPSBSRVZJU0lPTl9DSEFOR0VTO1xudmFyIGlzQXJyYXkgPSBVdGlscy5pc0FycmF5LFxuICAgIGlzRnVuY3Rpb24gPSBVdGlscy5pc0Z1bmN0aW9uLFxuICAgIHRvU3RyaW5nID0gVXRpbHMudG9TdHJpbmcsXG4gICAgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5mdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG59XG5cbmV4cG9ydHMuSGFuZGxlYmFyc0Vudmlyb25tZW50ID0gSGFuZGxlYmFyc0Vudmlyb25tZW50O0hhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbiwgaW52ZXJzZSkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoaW52ZXJzZSB8fCBmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnZlcnNlKSB7IGZuLm5vdCA9IGludmVyc2U7IH1cbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHN0cikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5wYXJ0aWFscywgIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gc3RyO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGFyZykge1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJNaXNzaW5nIGhlbHBlcjogJ1wiICsgYXJnICsgXCInXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSB8fCBmdW5jdGlvbigpIHt9LCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuLCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICAgIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGlmKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaTxqOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgZGF0YS5sYXN0ICA9IChpID09PSAoY29udGV4dC5sZW5ndGgtMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ldLCB7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcih2YXIga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmKGRhdGEpIHsgXG4gICAgICAgICAgICAgIGRhdGEua2V5ID0ga2V5OyBcbiAgICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtkYXRhOiBkYXRhfSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaSA9PT0gMCl7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBVdGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmICghVXRpbHMuaXNFbXB0eShjb250ZXh0KSkgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGxldmVsID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsID8gcGFyc2VJbnQob3B0aW9ucy5kYXRhLmxldmVsLCAxMCkgOiAxO1xuICAgIGluc3RhbmNlLmxvZyhsZXZlbCwgY29udGV4dCk7XG4gIH0pO1xufVxuXG52YXIgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IHsgMDogJ2RlYnVnJywgMTogJ2luZm8nLCAyOiAnd2FybicsIDM6ICdlcnJvcicgfSxcblxuICAvLyBTdGF0ZSBlbnVtXG4gIERFQlVHOiAwLFxuICBJTkZPOiAxLFxuICBXQVJOOiAyLFxuICBFUlJPUjogMyxcbiAgbGV2ZWw6IDMsXG5cbiAgLy8gY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgb2JqKSB7XG4gICAgaWYgKGxvZ2dlci5sZXZlbCA8PSBsZXZlbCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgY29uc29sZVttZXRob2RdLmNhbGwoY29uc29sZSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5leHBvcnRzLmxvZ2dlciA9IGxvZ2dlcjtcbmZ1bmN0aW9uIGxvZyhsZXZlbCwgb2JqKSB7IGxvZ2dlci5sb2cobGV2ZWwsIG9iaik7IH1cblxuZXhwb3J0cy5sb2cgPSBsb2c7dmFyIGNyZWF0ZUZyYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBvYmogPSB7fTtcbiAgVXRpbHMuZXh0ZW5kKG9iaiwgb2JqZWN0KTtcbiAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgdmFyIGxpbmU7XG4gIGlmIChub2RlICYmIG5vZGUuZmlyc3RMaW5lKSB7XG4gICAgbGluZSA9IG5vZGUuZmlyc3RMaW5lO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG5cbiAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIGlmIChsaW5lKSB7XG4gICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiA9IG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4Y2VwdGlvbjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi9iYXNlXCIpLkNPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSByZXF1aXJlKFwiLi9iYXNlXCIpLlJFVklTSU9OX0NIQU5HRVM7XG5cbmZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKFwiK2NvbXBpbGVySW5mb1sxXStcIikuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uOy8vIFRPRE86IFJlbW92ZSB0aGlzIGxpbmUgYW5kIGJyZWFrIHVwIGNvbXBpbGVQYXJ0aWFsXG5cbmZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk5vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZVwiKTtcbiAgfVxuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIHZhciBpbnZva2VQYXJ0aWFsV3JhcHBlciA9IGZ1bmN0aW9uKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7IHJldHVybiByZXN1bHQ7IH1cblxuICAgIGlmIChlbnYuY29tcGlsZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuICAgICAgcGFydGlhbHNbbmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB7IGRhdGE6IGRhdGEgIT09IHVuZGVmaW5lZCB9LCBlbnYpO1xuICAgICAgcmV0dXJuIHBhcnRpYWxzW25hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgdmFyIGNvbnRhaW5lciA9IHtcbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXTtcbiAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSBwcm9ncmFtKGksIGZuLCBkYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHByb2dyYW0oaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBjb21tb24pO1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBwYXJhbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgcHJvZ3JhbVdpdGhEZXB0aDogZW52LlZNLnByb2dyYW1XaXRoRGVwdGgsXG4gICAgbm9vcDogZW52LlZNLm5vb3AsXG4gICAgY29tcGlsZXJJbmZvOiBudWxsXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgbmFtZXNwYWNlID0gb3B0aW9ucy5wYXJ0aWFsID8gb3B0aW9ucyA6IGVudixcbiAgICAgICAgaGVscGVycyxcbiAgICAgICAgcGFydGlhbHM7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIHBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlU3BlYy5jYWxsKFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBuYW1lc3BhY2UsIGNvbnRleHQsXG4gICAgICAgICAgaGVscGVycyxcbiAgICAgICAgICBwYXJ0aWFscyxcbiAgICAgICAgICBvcHRpb25zLmRhdGEpO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGVudi5WTS5jaGVja1JldmlzaW9uKGNvbnRhaW5lci5jb21waWxlckluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtmdW5jdGlvbiBwcm9ncmFtV2l0aERlcHRoKGksIGZuLCBkYXRhIC8qLCAkZGVwdGggKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YV0uY29uY2F0KGFyZ3MpKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGFyZ3MubGVuZ3RoO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtV2l0aERlcHRoID0gcHJvZ3JhbVdpdGhEZXB0aDtmdW5jdGlvbiBwcm9ncmFtKGksIGZuLCBkYXRhKSB7XG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW0gPSBwcm9ncmFtO2Z1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgdmFyIG9wdGlvbnMgPSB7IHBhcnRpYWw6IHRydWUsIGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuXG4gIGlmKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gIH0gZWxzZSBpZihwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO2Z1bmN0aW9uIG5vb3AoKSB7IHJldHVybiBcIlwiOyB9XG5cbmV4cG9ydHMubm9vcCA9IG5vb3A7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBcIlwiICsgdGhpcy5zdHJpbmc7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNhZmVTdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmpzaGludCAtVzAwNCAqL1xudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBlc2NhcGUgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImI3gyNztcIixcbiAgXCJgXCI6IFwiJiN4NjA7XCJcbn07XG5cbnZhciBiYWRDaGFycyA9IC9bJjw+XCInYF0vZztcbnZhciBwb3NzaWJsZSA9IC9bJjw+XCInYF0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl0gfHwgXCImYW1wO1wiO1xufVxuXG5mdW5jdGlvbiBleHRlbmQob2JqLCB2YWx1ZSkge1xuICBmb3IodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDt2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9O1xufVxudmFyIGlzRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xufTtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgaWYgKHN0cmluZyBpbnN0YW5jZW9mIFNhZmVTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAoIXN0cmluZyAmJiBzdHJpbmcgIT09IDApIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gIHN0cmluZyA9IFwiXCIgKyBzdHJpbmc7XG5cbiAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7IiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpW1wiZGVmYXVsdFwiXTtcbiJdfQ==
