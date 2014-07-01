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
            this.currentFrame = value;
            this.setTexture(this.textures[value | 0]);
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
        }
    });

    timeline.append(TweenLite.to(video, animationTime, {
        tweenFrame: numFrames-1,
        ease: easing
    }));

    timeline.addLabel('callback', timeline.duration());

    timeline.append(TweenLite.to(video, 0.2, {
        alpha: 0
    }));

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
},{"../pixi/character":19,"./placeJustOffscreen":8}],4:[function(require,module,exports){


"use strict";

var Character = require('../pixi/character');
var placeJustOffscreen = require('./placeJustOffscreen');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var dusty, dipper, timelineIn, timelineOut, pixiScene;


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

    dustyIdleAnimation.anchor = {x: 650/1200, y: 340/638};

    dusty.setIdleState(dustyIdleAnimation);

    dusty.windowScale = 900/1366;
    dusty.windowX = 0.15;
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
        windowY: 0.33,
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
function generateAnimationOutTimeline() {
    var timelineOut = new TimelineMax({
        paused: true,
        onComplete: function() {
            pixiScene.removeChild(dipper);
            pixiScene.removeChild(dusty);
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
    var easing = 'Circ.easeInOut';

    var blurFilter = dusty.filters[0];

    var timeline = new TimelineMax({
        paused: true
    });

    timeline.add(TweenLite.to(dusty, animationTime, {
        animationScaleX: 1.3,
        animationScaleY: 1.3,
        windowY: -0.3,
        windowX: 0.6,
        rotation: -0.2
    }), 0);

    timeline.add(TweenLite.to(blurFilter, animationTime/5, {
        blur: 10,
        ease: easing
    }), 0);

//    timeline.add(TweenLite.to(dusty, animationTime, {
//        animationScaleX: 1.2,
//        animationScaleY: 1.2,
//        windowY: 0.24,
//        windowX: -0.3,
//        ease: easing
//    }));

    return timeline;
}




// =================================================================== //
/* **************************** Public API *************************** */
// =================================================================== //

var animationModule = {
    initialize: _.once(function(scene) {
        initialize();

        pixiScene = scene;

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
        timelineOut.vars.onComplete = callback;
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
var video, videoTimeline, pixiScene;

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
            pixiScene.removeChild(video);
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

        pixiScene = scene;
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
var parachuters, parachutersContainer, pixiScene;

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
        pixiScene = scene;
    }),
    animateNext: function() {
        if(parachuters.length > 0)
            animateParachuter(parachuters.shift());
    },
    hide: function() {
        parachutersContainer.visible = false;

        pixiScene.removeChild(parachutersContainer);
    }
};


_.bindAll.apply(_, [].concat(animationModule, Object.keys(animationModule)));



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

    function getRandomCannedQuestions(numInGroup, num) {
        var cannedOptions = _.shuffle(cannedQuestionData.options);

        var cannedQuestions = _.map(_.range(num), function(i) {
            var options = _.first(_.rest(cannedOptions, i * numInGroup), numInGroup);

            return {
                class: cannedQuestionData.class,
                copy: cannedQuestionData.copy,
                name: 'canned-question' + i,
                options: options
            }
        });

        return cannedQuestions;
    }






    var allQuestions = new QuestionCollection();


    //shuffle questions and pick 3
    var personalityQuestions = getRandomPersonalityQuestions(3);
    var cannedQuestions = getRandomCannedQuestions(3, 1);


    allQuestions.add(characterSelect);
    allQuestions.add(personalityQuestions);
    allQuestions.add(cannedQuestions);


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
        "job": "I’m a SEAT, or a Single-Engine Air Tanker, with the Piston Peak Air Attack Team, an elite group of firefighting aircraft.",
        "forestfires": "I can scoop water from lakes and dive into the forest to drop the water on wildfires. Speed counts when an air rescue is under way, so I’m always ready to fly into danger!",
        "firefighter": "Before joining the Air Attack Team, I was a world-famous air racer – I even raced around the world!  Now I race to put out fires. ",
        "bestfriend": "It wasn’t easy becoming a champion racer or a firefighter but I’ve had an amazing team of friends with me every step of the way! ",
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
        "firefighter": "Windlifter wasn’t always a firefighter. Windlifter used to be a lumberjack, lifting dozens of heavy logs and carrying them to the lumber mill.  But now I am a firefighter and this keeps me very busy.",
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
} else {
    app.assetLoader = new AssetLoadingView({onComplete: app.render});

    $passwordScreen.remove();
}



$(app.render);

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
    /* ************** Spritesheet Texture Functions *************** */
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
    }








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

            console.log(this);
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
  buffer += "\n        <div class=\"option\">\n            <div class=\"full-relative\">\n                <input type=\"radio\" name=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <label for=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"full-relative\"></label>\n                <div class=\"background\"></div>\n                <div class=\"text\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n                <div class=\"box-shadow\"></div>\n            </div>\n\n\n        </div>\n    ";
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

            //run hide animation
            dustyDipperModule.animateOut();
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

            scenesManager.goToScene('main');
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



    var MainView = Backbone.View.extend({
        el: '#content',
        events: {
            'click a.next': 'onNext',
            'click a.finish-send': 'onFinish',
            'mousemove': 'onMouseMove'
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function() {
            this.pages = [];
            this.activePageIndex = 0;

            this.initJqueryVariables();

            //create canvas element
            scenesManager.initialize(this.$window.width(), this.$window.height(), this.$el);

            this.scene = scenesManager.createScene('main', MainScene);

            // create views
            this.initIntroView();
            this.initPages();

            this.footer = new FooterView({numDots: this.pages.length});
            this.responseView = new ResponseView();

            this.initWindowEvents();
        },

        initWindowEvents: function() {
//            console.log('init window Events');
//
//            this.$window.on('resize', _.bind(this.repositionPageNav, this));
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
        },


        // ==================================================================== //
        /* *********************** Change View Functions ********************** */
        // ==================================================================== //
        showFirstPage: function() {
            this.pages[0].show();

            this.$next.css('opacity', 0);
            this.$next.addClass('active');

            TweenLite.to(this.$next, 0.3, {opacity: 1});
        },

        nextPage: function() {
            //hide active page
            var activePage = this.pages[this.activePageIndex];

            if(this.activePageIndex === 1) {
                //animate in character
                this.scene.animateInUserCharacter();
            }

            activePage.onHideComplete(_.bind(this.showPageAfterHide, this));

            this.activePageIndex++;
            activePage.hide();
            this.repositionPageNav(true);
        },
        showPageAfterHide: function() {
            //show next page
            var nextPage = this.pages[this.activePageIndex];
            nextPage.show();

            this.footer.setCounter(this.activePageIndex);

            if(this.activePageIndex === this.pages.length-1) {
                this.showFinishBtn();
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

            var pixelPosition = (activePage.$el.offset().top + activePage.$el.height());

            var windowHeight = this.$window.height();

            var topFrac = Math.min(pixelPosition/windowHeight, (windowHeight - this.footer.height() - this.$pageNav.outerHeight())/windowHeight);

            var percTop = 100 * topFrac + '%';

            if(!!animate) {
                TweenLite.to(this.$pageNav, 0.2, {top: percTop, ease:'Quad.easeInOut'});
                return;
            }
            this.$pageNav.css('top', percTop);
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
            }, 200);
        },

        // ==================================================================== //
        /* ************************* Event Listeners ************************** */
        // ==================================================================== //
        onNext: function(e) {
            e.preventDefault();

            if(this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        },
        onFinish: function(e) {
            e.preventDefault();

            this.finishAndSend();
        },
        onMouseMove: function(e) {
            e.preventDefault();

            this.scene.shiftBackgroundLayers(e.pageX/this.$window.width());
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

        this.initAnimations(this.model.attributes.class);
    },
    initAnimations: function(questionType) {
        "use strict";

        var animations;

        if(questionType === 'canned') {
            animations = itemAnimationsModule.getRandomCannedAnimations(this.$options);
        } else {
            animations = itemAnimationsModule.getRandomPersonalityAnimations(this.$options);
        }

        this.animationIn = animations[0];
        this.animationOut = animations[1];

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

        initialize: function() {
            //this.scene = scenesManager.createScene('response', ResponseScene);

            this.$background = $('#response-bg');

        },

        setResponse: function(models) {

            var nameModel = models[0];
            var characterModel = models[1];


            var answeredQuestions = _.filter(_.rest(models, 2), function(model) {return model.attributes.value !== ''});

            var partitionedQuestions = _.partition(answeredQuestions, function(model) {
                return model.attributes.class !== 'canned';
            });

            var personalityModels = partitionedQuestions[0];
            var cannedModels = partitionedQuestions[1];


            var character = characterModel.attributes.value;
            var response = "";

            console.log('cahracter:', character);
            var personalityResponses = _.map(personalityModels, function(model)  {
                console.log(model.attributes.name);
                console.log(responseMap[character][model.attributes.name]);
                console.log(model.attributes);

                return responseMap[character][model.attributes.name].replace('%template%', model.attributes.text);
            });

            var cannedResponses = _.map(cannedModels, function(model) {
                return responseMap[character][model.attributes.value];
            });

            response += ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ');



            console.log(response);


//            // TODO: Change to actual generated response
//            var html = 'Name: ' + nameModel.attributes.value + '<br/>';
//
//            html += '<br/>';
//
//            html += _.reduce(personalityModels, function(str, model) {
//                return str + model.attributes.name + ': ' + model.attributes.value + '<br/>';
//            }, '');
//
//            html += '<br/>';
//
//            html += _.reduce(cannedModels, function(str, model) {
//                return str + model.attributes.name + ': ' + model.attributes.value + '<br/>';
//            }, '');
//
//            this.$el.html(html);
        },

        show: function() {
            this.$el.show();
            this.$background.show();
            //scenesManager.goToScene('response');
        },
        hide: function() {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyb1ZpZGVvLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3BhZ2VJdGVtcy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYXJhY2h1dGVycy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wbGFjZUp1c3RPZmZzY3JlZW4uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL1F1ZXN0aW9uQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2F1ZGlvQXNzZXRzLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9yZXNwb25zZU1hcC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlXzkwYWFlYzkxLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9tb2RlbHMvcXVlc3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvY2hhcmFjdGVyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2V4dGVuZC5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9saWJNb2RpZmljYXRpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL21haW5TY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZXNNYW5hZ2VyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9zb3VuZFBsYXllci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvYXNzZXRMb2FkaW5nVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZW50ZXJOYW1lVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZm9vdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvaW50cm9WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9tYWluVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9yZXNwb25zZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3NlbGVjdENoYXJhY3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvYmFzZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9zYWZlLXN0cmluZy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBiYWNrZ3JvdW5kLCBtaWRkbGVncm91bmQsIGZvcmVncm91bmQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBiYWNrZ3JvdW5kID0gaW5pdEJhY2tncm91bmQoKTtcbiAgICBtaWRkbGVncm91bmQgPSBpbml0TWlkZGxlZ3JvdW5kKCk7XG4gICAgZm9yZWdyb3VuZCA9IGluaXRGb3JlZ3JvdW5kKCk7XG59XG5mdW5jdGlvbiBzZXRBdHRycyhzcHJpdGUpIHtcbiAgICBzcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIDEpO1xuICAgIHNwcml0ZS53aW5kb3dYID0gMC41O1xuICAgIHNwcml0ZS53aW5kb3dZID0gMTtcblxuICAgIHNwcml0ZS5zY2FsZVR5cGUgPSAnY292ZXInO1xuICAgIHNwcml0ZS53aW5kb3dTY2FsZSA9IDEuMDY7XG59XG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZCgpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9zaXRlX2JnLmpwZycpO1xuXG4gICAgc2V0QXR0cnMoYmFja2dyb3VuZCk7XG5cbiAgICByZXR1cm4gYmFja2dyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRNaWRkbGVncm91bmQoKSB7XG4gICAgdmFyIG1pZGRsZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9taWRncm91bmQucG5nJyk7XG4gICAgc2V0QXR0cnMobWlkZGxlZ3JvdW5kKTtcbiAgICByZXR1cm4gbWlkZGxlZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdEZvcmVncm91bmQoKSB7XG4gICAgdmFyIGZvcmVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9yZWdyb3VuZF90cmVlcy5wbmcnKTtcbiAgICBzZXRBdHRycyhmb3JlZ3JvdW5kKTtcbiAgICByZXR1cm4gZm9yZWdyb3VuZDtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcbiAgICB9KSxcbiAgICBhZGRCYWNrZ3JvdW5kVG9TY2VuZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG4gICAgfSxcbiAgICBhZGRSZXN0VG9TY2VuZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQobWlkZGxlZ3JvdW5kKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZm9yZWdyb3VuZCk7XG4gICAgfSxcbiAgICBzaGlmdEJhY2tncm91bmRMYXllcnM6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgdmFyIGJhY2tncm91bmRSYXRpbyA9IDAuNzU7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRSYXRpbyA9IDEuNTtcbiAgICAgICAgdmFyIGZvcmVncm91bmRSYXRpbyA9IDM7XG5cbiAgICAgICAgdmFyIGJhY2tncm91bmRYID0gMC41IC0gKHggLSAwLjUpICogYmFja2dyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBtaWRkbGVncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIGZvcmVncm91bmRYID0gMC41IC0gKHggLS41KSAqIGZvcmVncm91bmRSYXRpby81MDtcblxuICAgICAgICBiYWNrZ3JvdW5kLndpbmRvd1ggPSBiYWNrZ3JvdW5kWDtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLndpbmRvd1ggPSBtaWRkbGVncm91bmRYO1xuICAgICAgICBmb3JlZ3JvdW5kLndpbmRvd1ggPSBmb3JlZ3JvdW5kWDtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBiYWNrZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgbWlkZGxlZ3JvdW5kLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgZm9yZWdyb3VuZC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB3aXBlc2NyZWVuVmlkZW8sIHZpZGVvVGltZWxpbmU7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICB3aXBlc2NyZWVuVmlkZW8gPSBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpO1xuICAgIHZpZGVvVGltZWxpbmUgPSBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh3aXBlc2NyZWVuVmlkZW8pO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpIHtcbiAgICB2YXIgdGV4dHVyZXMgPSBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODYnLCA0MDAsIDU1Nik7XG5cbiAgICB2YXIgd2lwZXNjcmVlblZpZGVvID0gbmV3IFBJWEkuTW92aWVDbGlwKHRleHR1cmVzKTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93U2NhbGUgPSAxO1xuICAgIHdpcGVzY3JlZW5WaWRlby5zY2FsZVR5cGUgPSAnY292ZXInO1xuXG4gICAgd2lwZXNjcmVlblZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIHdpcGVzY3JlZW5WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICByZXR1cm4gd2lwZXNjcmVlblZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8odmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdjYWxsYmFjaycsIHRpbWVsaW5lLmR1cmF0aW9uKCkpO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgMC4yLCB7XG4gICAgICAgIGFscGhhOiAwXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHdpcGVzY3JlZW5WaWRlbyk7XG4gICAgfSxcbiAgICBwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnBsYXkoMCk7XG4gICAgfSxcbiAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgb25WaWRlb0NvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLmFkZChjYWxsYmFjaywgJ2NhbGxiYWNrJyk7XG4gICAgfVxufTtcblxuXG5cblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW2FuaW1hdGlvbk1vZHVsZV0uY29uY2F0KE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqIEhlbHBlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMCcsIDAsIDEyKTtcbn1cbmZ1bmN0aW9uIGdldERpcHBlcklkbGVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMCcsIDAsIDEyKTtcbn1cbmZ1bmN0aW9uIGdldEJsYWRlVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvYmxhZGUvR3VpZGVfQmxhZGVSYW5nZXJfYm9keV85NzB4NjAwXzAwMCcsIDAsIDEyKTtcbn1cbmZ1bmN0aW9uIGdldENhYmJpZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0V2luZGxpZnRlclRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwJywgMCwgMTIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgY2hhciwgYWxsQ2hhcmFjdGVycywgZGlzcGxheU9iamVjdENvbnRhaW5lcjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBhbGxDaGFyYWN0ZXJzID0ge1xuICAgICAgICBkdXN0eTogaW5pdER1c3R5KCksXG4gICAgICAgIGJsYWRlcmFuZ2VyOiBpbml0QmxhZGUoKSxcbiAgICAgICAgY2FiYmllOiBpbml0Q2FiYmllKCksXG4gICAgICAgIGRpcHBlcjogaW5pdERpcHBlcigpLFxuICAgICAgICB3aW5kbGlmdGVyOiBpbml0V2luZGxpZnRlcigpXG4gICAgfTtcblxuICAgIGNoYXIgPSBhbGxDaGFyYWN0ZXJzLmR1c3R5O1xuXG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbn1cblxuZnVuY3Rpb24gaW5pdER1c3R5KCkge1xuICAgIHZhciBkdXN0eSA9IG5ldyBDaGFyYWN0ZXIoJ0R1c3R5Jyk7XG5cbiAgICB2YXIgZHVzdHlJZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldER1c3R5SWRsZVRleHR1cmVzKCkpO1xuICAgIGR1c3R5SWRsZUFuaW1hdGlvbi5hbmNob3IgPSB7eDogMC41LCB5OiA0MDUvOTgzfTtcbiAgICBkdXN0eS5zZXRJZGxlU3RhdGUoZHVzdHlJZGxlQW5pbWF0aW9uKTtcblxuICAgIGR1c3R5LndpbmRvd1NjYWxlID0gODUwLzEzNjY7XG4gICAgZHVzdHkud2luZG93WSA9IC0xO1xuXG4gICAgcmV0dXJuIGR1c3R5O1xufVxuZnVuY3Rpb24gaW5pdEJsYWRlKCkge1xuICAgIHZhciBibGFkZUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0QmxhZGVUZXh0dXJlcygpKTtcbiAgICBibGFkZUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDQ1Ny85NzAsIHk6IDM0Ni82MDB9O1xuXG4gICAgdmFyIGJsYWRlID0gbmV3IENoYXJhY3RlcignQmxhZGUnLCBibGFkZUlkbGVBbmltYXRpb24pO1xuXG4gICAgYmxhZGUud2luZG93U2NhbGUgPSAwLjY7XG4gICAgYmxhZGUud2luZG93WSA9IC0xO1xuXG4gICAgcmV0dXJuIGJsYWRlO1xufVxuZnVuY3Rpb24gaW5pdENhYmJpZSgpIHtcbiAgICB2YXIgY2FiYmllSWRsZUFuaW1hdGlvbiA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRDYWJiaWVUZXh0dXJlcygpKTtcbiAgICBjYWJiaWVJZGxlQW5pbWF0aW9uLmFuY2hvciA9IHt4OiA1NDUvMTIwMCwgeTogMzUxLzYyMn07XG5cbiAgICB2YXIgY2FiYmllID0gbmV3IENoYXJhY3RlcignQ2FiYmllJywgY2FiYmllSWRsZUFuaW1hdGlvbik7XG5cbiAgICBjYWJiaWUud2luZG93U2NhbGUgPSAwLjY7XG4gICAgY2FiYmllLndpbmRvd1kgPSAtMTtcblxuICAgIHJldHVybiBjYWJiaWU7XG59XG5mdW5jdGlvbiBpbml0RGlwcGVyKCkge1xuICAgIHZhciBkaXBwZXJJZGxlU3RhdGUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkpO1xuICAgIGRpcHBlcklkbGVTdGF0ZS5hbmNob3IgPSB7eDogNTcxLzEyMDAsIHk6IDQxMC82Mzh9O1xuXG4gICAgdmFyIGRpcHBlciA9IG5ldyBDaGFyYWN0ZXIoJ0RpcHBlcicsIGRpcHBlcklkbGVTdGF0ZSk7XG5cbiAgICBkaXBwZXIud2luZG93WSA9IC0xO1xuICAgIGRpcHBlci53aW5kb3dTY2FsZSA9IDg2NS8xMzY2O1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cbmZ1bmN0aW9uIGluaXRXaW5kbGlmdGVyKCkge1xuICAgIHZhciB3aW5kbGlmZXJJZGxlU3RhdGUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0V2luZGxpZnRlclRleHR1cmVzKCkpO1xuICAgIHdpbmRsaWZlcklkbGVTdGF0ZS5hbmNob3IgPSB7eDogMC41LCB5OiAwLjV9O1xuXG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdXaW5kbGlmdGVyJywgd2luZGxpZmVySWRsZVN0YXRlKTtcbiAgICB3aW5kbGlmdGVyLndpbmRvd1kgPSAtMTtcbiAgICB3aW5kbGlmdGVyLndpbmRvd1NjYWxlID0gOTcwLzEzNjY7XG5cbiAgICByZXR1cm4gd2luZGxpZnRlcjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBhbmltYXRlSW4oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjg7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgLy9hZGQgY2hhcmFjdGVyIGluXG4gICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaGFyKTtcblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjaGFyKTtcbiAgICBjaGFyLndpbmRvd1ggPSAwLjY7XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICB3aW5kb3dYOiAwLjI1LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KTtcbn1cblxudmFyIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIGFuaW1hdGVPdXQoKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjg7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMjUsXG4gICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDYWxsYmFja1xuICAgIH0pO1xufVxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogYW5pbWF0ZUluLFxuICAgIGFuaW1hdGVPdXQ6IGFuaW1hdGVPdXQsXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgY2hhciA9IGFsbENoYXJhY3RlcnNbY2hhcmFjdGVyXTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgZHVzdHksIGRpcHBlciwgdGltZWxpbmVJbiwgdGltZWxpbmVPdXQsIHBpeGlTY2VuZTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZXREdXN0eUlkbGVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwJywgMCwgMTIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGR1c3R5ID0gaW5pdGlhbGl6ZUR1c3R5KCk7XG4gICAgZGlwcGVyID0gaW5pdGlhbGl6ZURpcHBlcigpO1xuXG4gICAgdGltZWxpbmVJbiA9IGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpO1xuICAgIHRpbWVsaW5lT3V0ID0gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplRHVzdHkoKSB7XG4gICAgdmFyIGR1c3R5ID0gbmV3IENoYXJhY3RlcignRHVzdHknKTtcblxuICAgIHZhciBkdXN0eUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSk7XG5cbiAgICBkdXN0eUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDY1MC8xMjAwLCB5OiAzNDAvNjM4fTtcblxuICAgIGR1c3R5LnNldElkbGVTdGF0ZShkdXN0eUlkbGVBbmltYXRpb24pO1xuXG4gICAgZHVzdHkud2luZG93U2NhbGUgPSA5MDAvMTM2NjtcbiAgICBkdXN0eS53aW5kb3dYID0gMC4xNTtcbiAgICBkdXN0eS53aW5kb3dZID0gLTE7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuXG4gICAgZHVzdHkuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgIHJldHVybiBkdXN0eTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZURpcHBlcigpIHtcbiAgICB2YXIgZGlwcGVyID0gbmV3IENoYXJhY3RlcignRGlwcGVyJyk7XG5cbiAgICB2YXIgZGlwcGVySWRsZVN0YXRlID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldERpcHBlcklkbGVUZXh0dXJlcygpKTtcblxuICAgIGRpcHBlcklkbGVTdGF0ZS5zY2FsZS54ID0gLTE7XG4gICAgZGlwcGVySWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogNTcxLzEyMDAsXG4gICAgICAgIHk6IDQxMC82MzhcbiAgICB9O1xuXG4gICAgZGlwcGVyLnNldElkbGVTdGF0ZShkaXBwZXJJZGxlU3RhdGUpO1xuXG4gICAgZGlwcGVyLndpbmRvd1ggPSAwLjc1O1xuICAgIGRpcHBlci53aW5kb3dZID0gLTE7XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuNDA7XG5cbiAgICBkaXBwZXIud2luZG93U2NhbGUgPSA4NjUvMTM2NjtcbiAgICBkaXBwZXIuYW5pbWF0aW9uU2NhbGVYID0gMC43O1xuICAgIGRpcHBlci5hbmltYXRpb25TY2FsZVkgPSAwLjc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICBibHVyRmlsdGVyLmJsdXIgPSAxMDtcblxuICAgIGRpcHBlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgSW4gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgdGltZWxpbmVEdXN0eUluID0gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpO1xuXG4gICAgdGltZWxpbmUuYWRkKHRpbWVsaW5lRHVzdHlJbi5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkucGxheSgpLCB0aW1lbGluZUR1c3R5SW4uZHVyYXRpb24oKSk7XG5cbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikucGxheSgpLCAwLjQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBvZ0F0dHJpYnV0ZXMgPSBfLnBpY2soZHVzdHksICd3aW5kb3dYJywgJ3dpbmRvd1NjYWxlJyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGR1c3R5LCBvZ0F0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuNTIsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxO1xuICAgIHZhciBlYXNpbmcgPSAnUXVhZC5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICByZXBlYXQ6IC0xXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAtMTUsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjA7XG4gICAgdmFyIHN3ZWVwU3RhcnRUaW1lID0gYW5pbWF0aW9uVGltZSAqIDAuMTE7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIG9nQXR0cmlidXRlcyA9IF8ucGljayhkaXBwZXIsICd3aW5kb3dYJywgJ3JvdGF0aW9uJywgJ3dpbmRvd1NjYWxlJywgJ2FuaW1hdGlvblNjYWxlWCcsICdhbmltYXRpb25TY2FsZVknKTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgICAgICBfLmV4dGVuZChkaXBwZXIsIG9nQXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMzMsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksIDApO1xuXG4gICAgLy9zd2VlcCByaWdodFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IDAuODYsXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgc3dlZXBTdGFydFRpbWUpO1xuXG4gICAgLy8gc2NhbGUgdXBcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMSxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYmx1cjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgT3V0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmVPdXQgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGl4aVNjZW5lLnJlbW92ZUNoaWxkKGRpcHBlcik7XG4gICAgICAgICAgICBwaXhpU2NlbmUucmVtb3ZlQ2hpbGQoZHVzdHkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKS5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lT3V0LmFkZChnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KS5wbGF5KCksIDApO1xuXG4gICByZXR1cm4gdGltZWxpbmVPdXQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KGRpcHBlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS40LFxuICAgICAgICBhbmltYXRpb25TY2FsZVk6IDEuNCxcbiAgICAgICAgd2luZG93WTogLTAuMyxcbiAgICAgICAgd2luZG93WDogMS4xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzIsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQW5pbWF0aW9uRHVzdHlPdXQoZHVzdHkpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDIuNDtcbiAgICB2YXIgZWFzaW5nID0gJ0NpcmMuZWFzZUluT3V0JztcblxuICAgIHZhciBibHVyRmlsdGVyID0gZHVzdHkuZmlsdGVyc1swXTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuMyxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjMsXG4gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgIHdpbmRvd1g6IDAuNixcbiAgICAgICAgcm90YXRpb246IC0wLjJcbiAgICB9KSwgMCk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGJsdXJGaWx0ZXIsIGFuaW1hdGlvblRpbWUvNSwge1xuICAgICAgICBibHVyOiAxMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4vLyAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4vLyAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLjIsXG4vLyAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjIsXG4vLyAgICAgICAgd2luZG93WTogMC4yNCxcbi8vICAgICAgICB3aW5kb3dYOiAtMC4zLFxuLy8gICAgICAgIGVhc2U6IGVhc2luZ1xuLy8gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBwaXhpU2NlbmUgPSBzY2VuZTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZChkaXBwZXIpO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChkdXN0eSk7XG4gICAgfSksXG4gICAgYW5pbWF0ZUluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZWxpbmVJbi5wbGF5KDApO1xuICAgIH0sXG4gICAgYW5pbWF0ZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lT3V0LnBsYXkoMCk7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbkluQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRpbWVsaW5lSW4udmFycy5vbkNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aW1lbGluZU91dC52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFtdLmNvbmNhdChhbmltYXRpb25Nb2R1bGUsIE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5mdW5jdGlvbiBnZXRJbnRyb1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAnLCAwLCAxMjIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgdmlkZW8sIHZpZGVvVGltZWxpbmUsIHBpeGlTY2VuZTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHZpZGVvID0gaW5pdGlhbGl6ZVZpZGVvKCk7XG4gICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvKHNjZW5lKSB7XG4gICAgdmFyIGludHJvVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0SW50cm9UZXh0dXJlcygpKTtcblxuICAgIGludHJvVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgaW50cm9WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG5cbiAgICBpbnRyb1ZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICBpbnRyb1ZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIGludHJvVmlkZW8uc2NhbGVNaW4gPSAxO1xuICAgIGludHJvVmlkZW8uc2NhbGVNYXggPSAyO1xuICAgIGludHJvVmlkZW8ud2luZG93U2NhbGUgPSAwLjY7XG5cbiAgICByZXR1cm4gaW50cm9WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcblxuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwaXhpU2NlbmUucmVtb3ZlQ2hpbGQodmlkZW8pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHZpZGVvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHBpeGlTY2VuZSA9IHNjZW5lO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZCh2aWRlbyk7XG4gICAgfSxcbiAgICBnZXRWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2aWRlbztcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUudmFycy5vbkNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xudmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG5cblxuXG52YXIgcGVyc29uYWxpdHlBbmltYXRpb25QYWlycyA9IFtcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgZmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dFJvdGF0ZSldLFxuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBmYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21Ub3ApLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0Um90YXRlKV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGJvdW5jZUZhZGVJbkZyb21Ub3ApLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV1cbl07XG5cbnZhciBjYW5uZWRBbmltYXRpb25QYWlycyA9IFtcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVJpZ2h0KSwgXy5iaW5kKHN0YWdnZXJJdGVtcywgc25hcE91dCldXG5dO1xuXG5cblxuZnVuY3Rpb24gc3RhZ2dlckl0ZW1zKCRpdGVtcykge1xuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgdHdlZW5zOiBfLm1hcCgkaXRlbXMsIHRoaXMpLFxuICAgICAgICBzdGFnZ2VyOiAwLjA3XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqIEluZGl2aWR1YWwgQW5pbWF0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZmFkZUluKCRpdGVtLCBwcm9wLCBkaXN0YW5jZSwgZWFzaW5nKSB7XG4gICAgdmFyIGZyb20gPSB7b3BhY2l0eTogMH07XG4gICAgZnJvbVtwcm9wXSA9IGRpc3RhbmNlO1xuXG4gICAgdmFyIHRvID0ge29wYWNpdHk6IDEsIGVhc2U6IGVhc2luZ307XG4gICAgdG9bcHJvcF0gPSAwO1xuXG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS5mcm9tVG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIGZyb20sIHRvKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbk5vTW92ZW1lbnQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDAsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBmYWRlSW5Gcm9tUmlnaHQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDc1LCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gZmFkZUluRnJvbVRvcCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd5JywgLTc1LCBlYXNpbmcpO1xufVxuZnVuY3Rpb24gYm91bmNlRmFkZUluRnJvbVJpZ2h0KCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3gnLCA3NSwgJ0JhY2suZWFzZU91dCcpO1xufVxuZnVuY3Rpb24gYm91bmNlRmFkZUluRnJvbVRvcCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd5JywgLTc1LCAnQmFjay5lYXNlT3V0Jyk7XG59XG5mdW5jdGlvbiByb3RhdGVJbkxlZnQoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLmZyb21UbygkaXRlbSwgYW5pbWF0aW9uVGltZSwge3JvdGF0aW9uWTogLTkwLCB0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0IDUwJSAtMTAwXCJ9LCB7cm90YXRpb25ZOiAwfSk7XG59XG5cbmZ1bmN0aW9uIHNuYXBPdXQoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMCwgc2NhbGU6IDAuNCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJSAwXCIsIGVhc2U6ICdCYWNrLmVhc2VJbid9KTtcbn1cbmZ1bmN0aW9uIHNuYXBPdXRSb3RhdGUoJGl0ZW0pIHtcbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMCwgc2NhbGU6IDAuNCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJSAwXCIsIHJvdGF0aW9uOiAtNDUsIGVhc2U6ICdCYWNrLmVhc2VJbid9KTtcbn1cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGdldFJhbmRvbVBlcnNvbmFsaXR5QW5pbWF0aW9uczogZnVuY3Rpb24oJGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gXy5yYW5kb20ocGVyc29uYWxpdHlBbmltYXRpb25QYWlycy5sZW5ndGggLSAxKTtcblxuICAgICAgICByZXR1cm4gXy5tYXAocGVyc29uYWxpdHlBbmltYXRpb25QYWlyc1tpXSwgZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZm5jKCRpdGVtcyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9uczogZnVuY3Rpb24oJGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gXy5yYW5kb20oY2FubmVkQW5pbWF0aW9uUGFpcnMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKGNhbm5lZEFuaW1hdGlvblBhaXJzW2ldLCBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICAgIHJldHVybiBmbmMoJGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgcGFyYWNodXRlcnMsIHBhcmFjaHV0ZXJzQ29udGFpbmVyLCBwaXhpU2NlbmU7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgcGFyYWNodXRlcnMgPSBfLnNodWZmbGUoW2dldEJsYWNrb3V0KCksIGdldERyaXAoKSwgZ2V0RHluYW1pdGUoKV0pO1xuXG4gICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuXG4gICAgICAgIHBhcmFjaHV0ZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dYID0gMC41O1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1kgPSAtMTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEJsYWNrb3V0KCkge1xuICAgIHZhciBibGFja291dElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCIpO1xuICAgIGJsYWNrb3V0SWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjYvNjEsXG4gICAgICAgIHk6IDMzLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdCbGFja291dCcsIGJsYWNrb3V0SWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldERyaXAoKSB7XG4gICAgdmFyIGRyaXBJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2RyaXAucG5nXCIpO1xuICAgIGRyaXBJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAzNi82MSxcbiAgICAgICAgeTogMjYvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0RyaXAnLCBkcmlwSWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldER5bmFtaXRlKCkge1xuICAgIHZhciBkeW5hbWl0ZUlkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCIpO1xuICAgIGR5bmFtaXRlSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjcvNjEsXG4gICAgICAgIHk6IDMwLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEeW5hbWl0ZScsIGR5bmFtaXRlSWRsZVN0YXRlKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAzNTtcblxuICAgIHZhciBkZXB0aCA9IE1hdGgucmFuZG9tKCkgKiA1O1xuICAgIHZhciB4ID0gMC4xICsgKE1hdGgucmFuZG9tKCkgKiAwLjgpO1xuICAgIHZhciBzY2FsZSA9IDEgLSBkZXB0aCAqIDAuMi81O1xuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHBhcmFjaHV0ZXIpO1xuICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IHg7XG5cbiAgICB2YXIgcm90YXRpb24gPSAwLjM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAxLFxuICAgICAgICBlYXNlOiAnU2luZS5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyLnZpc2liaWxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBhcmFjaHV0ZXIuc2NhbGUgPSB7eDogc2NhbGUsIHk6IHNjYWxlfTtcbiAgICBwYXJhY2h1dGVyLmZpbHRlcnNbMF0uYmx1ciA9IGRlcHRoICogMy81O1xuICAgIHBhcmFjaHV0ZXIucm90YXRpb24gPSByb3RhdGlvbjtcblxuICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKTtcbn1cbmZ1bmN0aW9uIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKSB7XG4gICAgdmFyIHN3YXlUaW1lID0gMS4yO1xuICAgIHZhciBkZWMgPSAwLjAzO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiAtcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgfSk7XG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCcsXG4gICAgICAgIGRlbGF5OiBzd2F5VGltZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihyb3RhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbiAtIGRlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBfLmJpbmQocGFyYWNodXRlcnNDb250YWluZXIuYWRkQ2hpbGQsIHBhcmFjaHV0ZXJzQ29udGFpbmVyKSk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQocGFyYWNodXRlcnNDb250YWluZXIpO1xuICAgICAgICBwaXhpU2NlbmUgPSBzY2VuZTtcbiAgICB9KSxcbiAgICBhbmltYXRlTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHBhcmFjaHV0ZXJzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVycy5zaGlmdCgpKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lci52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgcGl4aVNjZW5lLnJlbW92ZUNoaWxkKHBhcmFjaHV0ZXJzQ29udGFpbmVyKTtcbiAgICB9XG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgdmFyIGhlaWdodCA9IGNoYXJhY3Rlci5zY2FsZS55ICogY2hhcmFjdGVyLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xuXG4gICAgY2hhcmFjdGVyLndpbmRvd1kgPSAtKGhlaWdodC8yKS8kKHdpbmRvdykuaGVpZ2h0KCk7XG59OyIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9xdWVzdGlvbicpO1xuXG5cbnZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IFF1ZXN0aW9uXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbGxlY3Rpb247IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gcmVxdWlyZSgnLi9RdWVzdGlvbkNvbGxlY3Rpb24nKTtcblxuICAgIHZhciBjaGFyYWN0ZXJTZWxlY3QgPSByZXF1aXJlKCcuLi9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uJyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24nKTtcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24nKTtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKG51bSkge1xuICAgICAgICByZXR1cm4gXy5maXJzdChfLnNodWZmbGUocGVyc29uYWxpdHlRdWVzdGlvbkRhdGEucXVlc3Rpb25zKSwgbnVtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21DYW5uZWRRdWVzdGlvbnMobnVtSW5Hcm91cCwgbnVtKSB7XG4gICAgICAgIHZhciBjYW5uZWRPcHRpb25zID0gXy5zaHVmZmxlKGNhbm5lZFF1ZXN0aW9uRGF0YS5vcHRpb25zKTtcblxuICAgICAgICB2YXIgY2FubmVkUXVlc3Rpb25zID0gXy5tYXAoXy5yYW5nZShudW0pLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZmlyc3QoXy5yZXN0KGNhbm5lZE9wdGlvbnMsIGkgKiBudW1Jbkdyb3VwKSwgbnVtSW5Hcm91cCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jbGFzcyxcbiAgICAgICAgICAgICAgICBjb3B5OiBjYW5uZWRRdWVzdGlvbkRhdGEuY29weSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2FubmVkLXF1ZXN0aW9uJyArIGksXG4gICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY2FubmVkUXVlc3Rpb25zO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9uQ29sbGVjdGlvbigpO1xuXG5cbiAgICAvL3NodWZmbGUgcXVlc3Rpb25zIGFuZCBwaWNrIDNcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbnMgPSBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucygzKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25zID0gZ2V0UmFuZG9tQ2FubmVkUXVlc3Rpb25zKDMsIDEpO1xuXG5cbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNoYXJhY3RlclNlbGVjdCk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChwZXJzb25hbGl0eVF1ZXN0aW9ucyk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChjYW5uZWRRdWVzdGlvbnMpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbFF1ZXN0aW9ucztcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidG90YWxTaXplXCI6IDMyNTU2NzUxLFxuXHRcImFzc2V0c1wiOiB7XG5cdFx0XCJhc3NldHMvaW1nLzE1MHgxNTAuZ2lmXCI6IDUzNyxcblx0XHRcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCI6IDY2ODYsXG5cdFx0XCJhc3NldHMvaW1nL2J1dHRvbi5wbmdcIjogMjcwNDcsXG5cdFx0XCJhc3NldHMvaW1nL2RyaXAucG5nXCI6IDkyODgsXG5cdFx0XCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiOiA2NDkzLFxuXHRcdFwiYXNzZXRzL2ltZy9mb290ZXIucG5nXCI6IDg1NDQ4LFxuXHRcdFwiYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZ1wiOiAyNzg2MjQsXG5cdFx0XCJhc3NldHMvaW1nL2hlYWRlci5wbmdcIjogMTgyNjgxLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibGFkZV9yYW5nZXIucG5nXCI6IDgzNTcwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYWJiaWUucG5nXCI6IDc4MjE1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYW5uZWQtYnRuLnBuZ1wiOiA1MjY2Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZGlwcGVyLnBuZ1wiOiA5MzU5OCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZHVzdHkucG5nXCI6IDk3NzM0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wcmludGVyLnBuZ1wiOiAxNTUwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zZW5kLWJ0bi5wbmdcIjogMzA3MTUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3RoZV90ZWFtLnBuZ1wiOiA3NDMyNixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdm9sdW1lLnBuZ1wiOiAzMjIwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy93aW5kbGlmdGVyLnBuZ1wiOiAxMDUzMjMsXG5cdFx0XCJhc3NldHMvaW1nL2luLXRoZWF0ZXJzLnBuZ1wiOiA0MTMwLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby1idG0ucG5nXCI6IDE3OTA2MSxcblx0XHRcImFzc2V0cy9pbWcvaW50cm8tdG9wLnBuZ1wiOiAxNzY1NTEsXG5cdFx0XCJhc3NldHMvaW1nL2xvZ28ucG5nXCI6IDI3Njc1LFxuXHRcdFwiYXNzZXRzL2ltZy9taWRncm91bmQucG5nXCI6IDIwMzQyMCxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfZHVzdHkuanBnXCI6IDE5NzY0Mixcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfbGV0dGVyX2JnLmpwZ1wiOiA3NTcxMyxcblx0XHRcImFzc2V0cy9pbWcvc2l0ZV9iZy5qcGdcIjogMTg0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAwLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMi5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAzLnBuZ1wiOiA1NTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDQucG5nXCI6IDEwMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDUucG5nXCI6IDEzODQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDYucG5nXCI6IDkyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNy5wbmdcIjogMTE1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOC5wbmdcIjogMTQwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOS5wbmdcIjogMTU0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMC5wbmdcIjogMTYzOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMS5wbmdcIjogMTkwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMi5wbmdcIjogMTk4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMy5wbmdcIjogMjAyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNC5wbmdcIjogMjA3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNS5wbmdcIjogMjEyMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNi5wbmdcIjogMjI2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNy5wbmdcIjogMjQ1MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOC5wbmdcIjogMjU2OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOS5wbmdcIjogMjcyNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMC5wbmdcIjogMjg4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMS5wbmdcIjogMzA0NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMi5wbmdcIjogMzE4MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMy5wbmdcIjogMzMyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNC5wbmdcIjogMzQ4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNS5wbmdcIjogMzYwMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNi5wbmdcIjogMzcxMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNy5wbmdcIjogMzgyMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyOC5wbmdcIjogMzkyNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyOS5wbmdcIjogMzk5OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMC5wbmdcIjogNDAzNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMS5wbmdcIjogNDA5MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMi5wbmdcIjogNDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMy5wbmdcIjogNDE2Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNC5wbmdcIjogNDIxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNS5wbmdcIjogNDEwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNi5wbmdcIjogNDE2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNy5wbmdcIjogNDIzNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOC5wbmdcIjogNDI2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOS5wbmdcIjogNDM3MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0MC5wbmdcIjogNDQzOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0MS5wbmdcIjogNDQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Mi5wbmdcIjogNDUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0My5wbmdcIjogNDYzNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NC5wbmdcIjogNDY0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NS5wbmdcIjogNDc0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Ni5wbmdcIjogNDc4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Ny5wbmdcIjogNDgzMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OC5wbmdcIjogNDk4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OS5wbmdcIjogNDk4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MC5wbmdcIjogNTA0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MS5wbmdcIjogNTEzMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Mi5wbmdcIjogNTIwMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1My5wbmdcIjogNTM2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NC5wbmdcIjogODI4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NS5wbmdcIjogODA3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Ni5wbmdcIjogMTM3OTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTcucG5nXCI6IDIzMTc0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU4LnBuZ1wiOiAzMDg1MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1OS5wbmdcIjogMzYxMzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjAucG5nXCI6IDM4MDk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDYxLnBuZ1wiOiAzMzQ0NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2Mi5wbmdcIjogMjk1NzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjMucG5nXCI6IDMwMzcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY0LnBuZ1wiOiAyOTcwNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2NS5wbmdcIjogMjk4NTUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjYucG5nXCI6IDI5NzAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY3LnBuZ1wiOiAzMDI1NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2OC5wbmdcIjogMjk1NTYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjkucG5nXCI6IDI5NjYxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDcwLnBuZ1wiOiAyOTcyMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3MS5wbmdcIjogMjk4MTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzIucG5nXCI6IDI5ODEwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDczLnBuZ1wiOiAyOTc2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3NC5wbmdcIjogMjk1MDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzUucG5nXCI6IDI5NzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc2LnBuZ1wiOiAyOTY0MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3Ny5wbmdcIjogMjk0OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzgucG5nXCI6IDI3Mzk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc5LnBuZ1wiOiAzNzYwMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4MC5wbmdcIjogNTAxMzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODEucG5nXCI6IDU2NDY0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgyLnBuZ1wiOiA1NjQ0OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4My5wbmdcIjogNjMxMjksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODQucG5nXCI6IDU2MzQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg1LnBuZ1wiOiAzMTU4NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4Ni5wbmdcIjogMzYxODYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODcucG5nXCI6IDI0Nzk4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg4LnBuZ1wiOiAyMzg2NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4OS5wbmdcIjogMjc5MzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTAucG5nXCI6IDMyMDk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDkxLnBuZ1wiOiAzNjk0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5Mi5wbmdcIjogNDExODMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTMucG5nXCI6IDQ0NDIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk0LnBuZ1wiOiA0ODQ3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5NS5wbmdcIjogMzU4NzksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTYucG5nXCI6IDI4MTE1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk3LnBuZ1wiOiAyNDcyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5OC5wbmdcIjogMjIyNTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTkucG5nXCI6IDIwNjMwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAwLnBuZ1wiOiAyMTAxMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwMS5wbmdcIjogMTYzNzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDIucG5nXCI6IDE4MTkzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAzLnBuZ1wiOiAxOTg5Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNC5wbmdcIjogMjI0NzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDUucG5nXCI6IDI0NTk2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA2LnBuZ1wiOiAyNTUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNy5wbmdcIjogMjcxMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDgucG5nXCI6IDI2MTA3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA5LnBuZ1wiOiAyOTEzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMC5wbmdcIjogMzM1NTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTEucG5nXCI6IDM2NDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEyLnBuZ1wiOiA0MTAxNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMy5wbmdcIjogNDQ2ODksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTQucG5nXCI6IDQ1OTY0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE1LnBuZ1wiOiA0NDA1Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNi5wbmdcIjogNDY0OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTcucG5nXCI6IDY5NzgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE4LnBuZ1wiOiAyNjU4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExOS5wbmdcIjogMzA5NTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMjAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEyMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDAucG5nXCI6IDQzMTAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDEucG5nXCI6IDQ0MzIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDQzMDY1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDMucG5nXCI6IDQyODg2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDQucG5nXCI6IDQ0MTcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDQzMDEyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDYucG5nXCI6IDQzNDUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDcucG5nXCI6IDQ1NzM0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDQyNjk4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMDkucG5nXCI6IDQyNTEyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTAucG5nXCI6IDQ0NjkxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9ibGFkZS9HdWlkZV9CbGFkZVJhbmdlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDQyMzk5LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAwLnBuZ1wiOiA4MzI2OCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwMS5wbmdcIjogODQyODIsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDIucG5nXCI6IDg0NzUwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDAzLnBuZ1wiOiA4NTEwOCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNC5wbmdcIjogODMyNjgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDUucG5nXCI6IDg0MjgyLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA2LnBuZ1wiOiA4NDc1MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAwNy5wbmdcIjogODUxMDgsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMDgucG5nXCI6IDgzMjY4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9jYWJiaWUvQ2FiYmllXzAwMDA5LnBuZ1wiOiA4NDI4Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvY2FiYmllL0NhYmJpZV8wMDAxMC5wbmdcIjogODQ3NTAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2NhYmJpZS9DYWJiaWVfMDAwMTEucG5nXCI6IDg1MTA4LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAwLnBuZ1wiOiA2NDA3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMS5wbmdcIjogNjI5ODMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDIucG5nXCI6IDY1NzczLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAzLnBuZ1wiOiA2NjY0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNC5wbmdcIjogNjQwNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDUucG5nXCI6IDYyOTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA2LnBuZ1wiOiA2NTc3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNy5wbmdcIjogNjY2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDgucG5nXCI6IDY0MDcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA5LnBuZ1wiOiA2Mjk4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMC5wbmdcIjogNjU3NzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTEucG5nXCI6IDY2NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDAucG5nXCI6IDEyNjYyMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDAxLnBuZ1wiOiAxMjQyNTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMi5wbmdcIjogMTI0MzAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDMucG5nXCI6IDEyNjAwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA0LnBuZ1wiOiAxMjY2MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwNS5wbmdcIjogMTI0MjUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDYucG5nXCI6IDEyNDMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA3LnBuZ1wiOiAxMjYwMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwOC5wbmdcIjogMTI2NjIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDkucG5nXCI6IDEyNDI1Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDEwLnBuZ1wiOiAxMjQzMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAxMS5wbmdcIjogMTI2MDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDAucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDEucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDIucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDMucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDQucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDUucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDYucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDcucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDgucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDkucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMTAucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMTEucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAwLnBuZ1wiOiA3NzY2Nyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwMS5wbmdcIjogNzc1MDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDIucG5nXCI6IDc3MjIwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDAzLnBuZ1wiOiA3NzE2Mixcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNC5wbmdcIjogNzc3NTcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDUucG5nXCI6IDc4NjY3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA2LnBuZ1wiOiA3NzMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAwNy5wbmdcIjogNzc3OTQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMDgucG5nXCI6IDc4Njc2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy93aW5kbGlmdGVyL0d1aWRlX1dpbmRsaWZ0ZXJfYm9keV85NzB4NjAwXzAwMDA5LnBuZ1wiOiA3NzkyMCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvd2luZGxpZnRlci9HdWlkZV9XaW5kbGlmdGVyX2JvZHlfOTcweDYwMF8wMDAxMC5wbmdcIjogNzc1NzYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL3dpbmRsaWZ0ZXIvR3VpZGVfV2luZGxpZnRlcl9ib2R5Xzk3MHg2MDBfMDAwMTEucG5nXCI6IDc3ODk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAwLnBuZ1wiOiAyMzIyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAxLnBuZ1wiOiAzMjAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAyLnBuZ1wiOiAxMzkzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAzLnBuZ1wiOiAxNTI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA0LnBuZ1wiOiAyNzI3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA1LnBuZ1wiOiAzMTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA2LnBuZ1wiOiAzNzYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA3LnBuZ1wiOiA0NDI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA4LnBuZ1wiOiA2MDAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA5LnBuZ1wiOiA5NDEyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEwLnBuZ1wiOiAxMTE4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMS5wbmdcIjogMTQzNTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTIucG5nXCI6IDE2MzIzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEzLnBuZ1wiOiAxOTcyOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNC5wbmdcIjogMjIwNDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTUucG5nXCI6IDI1MTExLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE2LnBuZ1wiOiAyNjU1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNy5wbmdcIjogMjkwMTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTgucG5nXCI6IDMwMjAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE5LnBuZ1wiOiAzMTMwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMC5wbmdcIjogMzE3MTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjEucG5nXCI6IDMyMTAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIyLnBuZ1wiOiAzMjg5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMy5wbmdcIjogMzMyMTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjQucG5nXCI6IDMzNzQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI1LnBuZ1wiOiAzMzYxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNi5wbmdcIjogMzM0MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjcucG5nXCI6IDMzNTkwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI4LnBuZ1wiOiAzMzUxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyOS5wbmdcIjogMzI1ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzAucG5nXCI6IDMyMzM1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMxLnBuZ1wiOiAzMjE0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMi5wbmdcIjogMzE1MzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzMucG5nXCI6IDMwODU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM0LnBuZ1wiOiAyOTg5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNS5wbmdcIjogMjk0MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzYucG5nXCI6IDI5NDE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM3LnBuZ1wiOiAyODM4MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzOC5wbmdcIjogMjgxNDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzkucG5nXCI6IDI3MjY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQwLnBuZ1wiOiAyNjU2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MS5wbmdcIjogMjY1NjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDIucG5nXCI6IDI1ODcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQzLnBuZ1wiOiAyNTM1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NC5wbmdcIjogMjQ1NjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDUucG5nXCI6IDI0MjAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ2LnBuZ1wiOiAyNDE0Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ny5wbmdcIjogMjM2MTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDgucG5nXCI6IDIzNjM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ5LnBuZ1wiOiAyMzgwOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MC5wbmdcIjogMjMxNzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTEucG5nXCI6IDIzMjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUyLnBuZ1wiOiAyMzIwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1My5wbmdcIjogMjI3OTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTQucG5nXCI6IDIzMDY0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU1LnBuZ1wiOiAyMzM1NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ni5wbmdcIjogMjM3NzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTcucG5nXCI6IDI0NzQzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU4LnBuZ1wiOiAyNTg3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OS5wbmdcIjogMjY1MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjAucG5nXCI6IDI3NjY2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYxLnBuZ1wiOiAyODY4OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Mi5wbmdcIjogMjk1ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjMucG5nXCI6IDMwMzk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY0LnBuZ1wiOiAzMTI5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NS5wbmdcIjogMzIyNDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjYucG5nXCI6IDMzODk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY3LnBuZ1wiOiAzNTM0OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OC5wbmdcIjogMzYyMzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjkucG5nXCI6IDM3NTY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcwLnBuZ1wiOiAzOTg4MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MS5wbmdcIjogNDEwOTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzIucG5nXCI6IDQyMDM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDczLnBuZ1wiOiA0MjQ5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NC5wbmdcIjogNDQ1NTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzUucG5nXCI6IDQ1NDQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc2LnBuZ1wiOiA0Njc0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ny5wbmdcIjogNDg2OTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzgucG5nXCI6IDQ5ODczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc5LnBuZ1wiOiA1MTcxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MC5wbmdcIjogNTM4NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODEucG5nXCI6IDU0NTIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgyLnBuZ1wiOiA1NjQ5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4My5wbmdcIjogNTYyOTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODQucG5nXCI6IDU4ODI0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg1LnBuZ1wiOiA1OTU5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ni5wbmdcIjogNjA2MzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODcucG5nXCI6IDYyODkzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg4LnBuZ1wiOiA2Mzk5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OS5wbmdcIjogNjYxMDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTAucG5nXCI6IDY2MzQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkxLnBuZ1wiOiA2OTIwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Mi5wbmdcIjogNjg3NjcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTMucG5nXCI6IDcwNTgyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk0LnBuZ1wiOiA3MDI2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NS5wbmdcIjogNzMzMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTYucG5nXCI6IDc1OTAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk3LnBuZ1wiOiA3NzUzOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OC5wbmdcIjogODE2MjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTkucG5nXCI6IDgyMjc3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAwLnBuZ1wiOiA4NTA1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMS5wbmdcIjogODcwNjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDIucG5nXCI6IDg4MzQxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAzLnBuZ1wiOiA4ODkwNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNC5wbmdcIjogOTMyMDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDUucG5nXCI6IDk5Nzc3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA2LnBuZ1wiOiAxMDI4NjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDcucG5nXCI6IDEwOTg0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOC5wbmdcIjogMTEyMTY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA5LnBuZ1wiOiAxMTU5MTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTAucG5nXCI6IDExNjkwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMS5wbmdcIjogMTIzMzIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEyLnBuZ1wiOiAxMjYzNDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTMucG5nXCI6IDEzMzc0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNC5wbmdcIjogMTM4NzcwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE1LnBuZ1wiOiAxNDY5NDksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTYucG5nXCI6IDE1NDMyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNy5wbmdcIjogMTU5NDc5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE4LnBuZ1wiOiAxNjYyMTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTkucG5nXCI6IDE3MTYyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMC5wbmdcIjogMTc4MjcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIxLnBuZ1wiOiAxODU4ODcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjIucG5nXCI6IDE5NzI5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMy5wbmdcIjogMjA2MTIzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI0LnBuZ1wiOiAyMjQ2ODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjUucG5nXCI6IDIzNjYzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNi5wbmdcIjogMjQyNTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI3LnBuZ1wiOiAyNjIxODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjgucG5nXCI6IDI3NDgwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOS5wbmdcIjogMjg1OTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMwLnBuZ1wiOiAzMDc0MzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzEucG5nXCI6IDMyMzI3MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMi5wbmdcIjogMzUwNTczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMzLnBuZ1wiOiAzNzYxMTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzQucG5nXCI6IDQwNTU3NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNS5wbmdcIjogNDM3NjU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM2LnBuZ1wiOiA0NzY0ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzcucG5nXCI6IDQ4NDI4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOC5wbmdcIjogNTMyOTQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM5LnBuZ1wiOiA1NTYxMjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDAucG5nXCI6IDU5NDU0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MS5wbmdcIjogNjQ4NDkyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQyLnBuZ1wiOiA3MTM3OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDMucG5nXCI6IDczMjkyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NC5wbmdcIjogNzAyOTgxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ1LnBuZ1wiOiA3NTgzODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDYucG5nXCI6IDc0MzU0MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ny5wbmdcIjogNjg0OTg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ4LnBuZ1wiOiA2NzM5NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDkucG5nXCI6IDY1NTE4Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MC5wbmdcIjogNjE4NjM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUxLnBuZ1wiOiA1OTk3NDksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTIucG5nXCI6IDU1Mzg5MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1My5wbmdcIjogNTI1OTk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU0LnBuZ1wiOiA1MTIwMjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTUucG5nXCI6IDM1NDkwNlxuXHR9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiZHVzdHlcIjogXCJhc3NldHMvYXVkaW8vZHVzdHkubXAzXCIsXG4gICAgXCJibGFkZXJhbmdlclwiOiBcImFzc2V0cy9hdWRpby9ibGFkZS5tcDNcIixcbiAgICBcImNhYmJpZVwiOiBcImFzc2V0cy9hdWRpby9NdXN0YW5nXzIwMTJfU3RhcnQubXAzXCIsXG4gICAgXCJkaXBwZXJcIjogXCJhc3NldHMvYXVkaW8vZGlwcGVyLm1wM1wiLFxuICAgIFwid2luZGxpZnRlclwiOiBcImFzc2V0cy9hdWRpby93aW5kbGlmdGVyLm1wM1wiLFxuICAgIFwidGVhbVwiOiBcImFzc2V0cy9hdWRpby9ZZWxsb3dfR2VuZXJpY19TdGFydC5tcDNcIlxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImNsYXNzXCI6IFwiY2FubmVkXCIsXG4gICAgXCJjb3B5XCI6IFwiTm93IHRoYXQgd2Uga25vdyBtb3JlIGFib3V0IHlvdSwgaXQncyB5b3VyIHR1cm4gdG8gYXNrIGZpcmUgcmFuZ2VyIHNvbWUgcXVlc3Rpb25zXCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGpvYiBhdCBQaXN0b24gUGVhaz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJqb2JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG8geW91IGZpZ2h0IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmb3Jlc3RmaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhhdmUgeW91IGFsd2F5cyBiZWVuIGEgZmlyZWZpZ2h0ZXI/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmlyZWZpZ2h0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaG8gaXMgeW91ciBiZXN0IGZyaWVuZD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJiZXN0ZnJpZW5kXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hlcmUgaXMgeW91ciBmYXZvcml0ZSBwbGFjZSB0byBmbHk/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGVwbGFjZVwiXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwibmFtZVwiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNsYXNzXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY29weVwiOiBcIldobyBkbyB5b3Ugd2FudCB0byB3cml0ZSB0bz9cIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEdXN0eVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImR1c3R5XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmxhZGUgUmFuZ2VyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmxhZGVyYW5nZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJDYWJiaWVcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJjYWJiaWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEaXBwZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkaXBwZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaW5kbGlmdGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwid2luZGxpZnRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlRoZSBUZWFtXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwidGVhbVwiXG4gICAgICAgIH1cbiAgICBdLFxuICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcInF1ZXN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQncyB5b3VyIGZhdm9yaXRlIGNvbG9yP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmx1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmx1ZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk9yYW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwib3JhbmdlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiR3JlZW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImdyZWVuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiWWVsbG93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJ5ZWxsb3dcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQdXJwbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInB1cnBsZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1mb29kXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtZm9vZFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIGZvb2Q/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUGl6emFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInBpenphXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSWNlIENyZWFtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJpY2VjcmVhbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJyb2Njb2xpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJicm9jY29saVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkZyZW5jaCBGcmllc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZnJlbmNoZnJpZXNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDaGlja2VuIE51Z2dldHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNoaWNrZW5udWdnZXRzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUEImSlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGJqXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLXNwb3J0XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtc3BvcnRcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBzcG9ydD9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJGb290YmFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZm9vdGJhbGxcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCYXNlYmFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmFzZWJhbGxcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIb2NrZXlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImhvY2tleVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN3aW1taW5nL0RpdmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic3dpbW1pbmdcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTb2NjZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInNvY2NlclwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJhY2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmFjaW5nXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiZHVzdHlcIiA6IHtcbiAgICAgICAgXCJqb2JcIjogXCJJ4oCZbSBhIFNFQVQsIG9yIGEgU2luZ2xlLUVuZ2luZSBBaXIgVGFua2VyLCB3aXRoIHRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0sIGFuIGVsaXRlIGdyb3VwIG9mIGZpcmVmaWdodGluZyBhaXJjcmFmdC5cIixcbiAgICAgICAgXCJmb3Jlc3RmaXJlc1wiOiBcIkkgY2FuIHNjb29wIHdhdGVyIGZyb20gbGFrZXMgYW5kIGRpdmUgaW50byB0aGUgZm9yZXN0IHRvIGRyb3AgdGhlIHdhdGVyIG9uIHdpbGRmaXJlcy4gU3BlZWQgY291bnRzIHdoZW4gYW4gYWlyIHJlc2N1ZSBpcyB1bmRlciB3YXksIHNvIEnigJltIGFsd2F5cyByZWFkeSB0byBmbHkgaW50byBkYW5nZXIhXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJCZWZvcmUgam9pbmluZyB0aGUgQWlyIEF0dGFjayBUZWFtLCBJIHdhcyBhIHdvcmxkLWZhbW91cyBhaXIgcmFjZXIg4oCTIEkgZXZlbiByYWNlZCBhcm91bmQgdGhlIHdvcmxkISAgTm93IEkgcmFjZSB0byBwdXQgb3V0IGZpcmVzLiBcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiSXQgd2FzbuKAmXQgZWFzeSBiZWNvbWluZyBhIGNoYW1waW9uIHJhY2VyIG9yIGEgZmlyZWZpZ2h0ZXIgYnV0IEnigJl2ZSBoYWQgYW4gYW1hemluZyB0ZWFtIG9mIGZyaWVuZHMgd2l0aCBtZSBldmVyeSBzdGVwIG9mIHRoZSB3YXkhIFwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGhhdmUgYmVlbiBmbHlpbmcgZm9yIGFzIGxvbmcgYXMgSSBjYW4gcmVtZW1iZXIgYnV0IG15IGZhdm9yaXRlIHBsYWNlIHRvIGZseSBpcyBhYm92ZSBteSBob21ldG93biwgUHVtcHdhc2ggSnVuY3Rpb24uIEkgZG8gc29tZSBmYW5jeSBmbHlpbmcgdGhlcmUhXCIsXG4gICAgICAgIFwiZmF2b3JpdGUtZm9vZFwiOiBcIkFueXRoaW5nJ3MgYmV0dGVyIHRvIGVhdCB0aGFuIFZpdGFtaW5hbXVsY2guIEVzcGVjaWFsbHkgJXRlbXBsYXRlJSFcIixcbiAgICAgICAgXCJmYXZvcml0ZS1jb2xvclwiOiBcIk15IGZhdm9yaXRlIGNvbG9yIGlzIEdSRUVOLiBHcmVlbiBtZWFucyBnbyEgQW5kIEkgbG92ZSB0byBnbyBmYXN0LlwiLFxuICAgICAgICBcImZhdm9yaXRlLXNwb3J0XCI6IFwiQ29vbCEgWW91ciBmYXZvcml0ZSBzcG9ydCBpcyAldGVtcGxhdGUlIVwiXG4gICAgfSxcbiAgICBcImRpcHBlclwiOiB7XG4gICAgICAgIFwiam9iXCI6IFwiSSBoYXZlIGEgcmVhbGx5IGltcG9ydGFudCBqb2IgZmlnaHRpbmcgd2lsZGZpcmVzLiBJJ20gYSBTdXBlci1zY29vcGVyIHdpdGggdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtLlwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiSSBmaWdodCBmb3Jlc3QgZmlyZXMgaW4gc2V2ZXJhbCB3YXlzLiAgU29tZXRpbWVzIEkgZHJvcCByZXRhcmRhbnQgdG8gY29udGFpbiBhIGZpcmUuICBJIGNhbiBhbHNvIHNjb29wIHdhdGVyIGZyb20gdGhlIGxha2UgYW5kIGRyb3AgaXQgZGlyZWN0bHkgb24gdGhlIGZpcmUuIE15IGJvc3MgQmxhZGUgUmFuZ2VyIGNhbGxzIG1lIGEgTXVkLURyb3BwZXIhXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB1c2VkIHRvIGhhdWwgY2FyZ28gdXAgaW4gQW5jaG9yYWdlLiBZZXAsIGEgbG90IG9mIGd1eXMgaW4gQWxhc2thLiBJIHdhcyBiZWF0aW5nIHRoZW0gb2ZmIHdpdGggYSBzdGljayFcIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiTXkgYmVzdCBmcmllbmQgaXMgY2hhbXBpb24gcmFjZXIgRHVzdHkgQ3JvcGhvcHBlci4gSSdtIGhpcyBiaWdnZXN0IGZhbiFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiTXkgZmF2b3JpdGUgcGxhY2UgdG8gZmx5IGlzIHRoZSBGdXNlbCBMb2RnZSwgcmlnaHQgaGVyZSBpbiBQaXN0b24gUGVhay4gSXQncyBzbyBiZWF1dGlmdWwuIEFuZCB3aGVyZSBEdXN0eSBhbmQgSSBoYWQgb3VyIGZpcnN0IGRhdGUhIEl0IHdhcyBhIGRhdGUsIHJpZ2h0PyBJJ20gcHJldHR5IHN1cmUgaXQgd2FzIGEgZGF0ZS5cIlxuICAgIH0sXG4gICAgXCJ3aW5kbGlmdGVyXCI6IHtcbiAgICAgICAgXCJqb2JcIjogXCJJIGFtIGEgSGVhdnktTGlmdCBIZWxpY29wdGVyIHdpdGggdGhlIFBpc3RvbiBQZWFrIEFpciBBdHRhY2sgVGVhbSwgYW4gZWxpdGUgY3JldyBvZiBmaXJlZmlnaHRpbmcgYWlyY3JhZnQuIFwiLFxuICAgICAgICBcImZvcmVzdGZpcmVzXCI6IFwiQmxhZGUgY2FsbHMgbWUgYSDigJxNdWQgRHJvcHBlcuKAnSBiZWNhdXNlIEkgaGF2ZSBhIGRldGFjaGFibGUgdGFuayBsb2FkZWQgd2l0aCBmaXJlIHJldGFyZGFudCB0byBoZWxwIHB1dCBvdXQgdGhlIGZpcmVzLiAgTXVkIGlzIHNsYW5nIGZvciByZXRhcmRhbnQuICBXaW5kbGlmdGVyIGNhbiBob2xkIG1vcmUgcmV0YXJkYW50IHRoYW4gYW55b25lIGVsc2Ugb24gdGhlIHRlYW0uXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJXaW5kbGlmdGVyIHdhc27igJl0IGFsd2F5cyBhIGZpcmVmaWdodGVyLiBXaW5kbGlmdGVyIHVzZWQgdG8gYmUgYSBsdW1iZXJqYWNrLCBsaWZ0aW5nIGRvemVucyBvZiBoZWF2eSBsb2dzIGFuZCBjYXJyeWluZyB0aGVtIHRvIHRoZSBsdW1iZXIgbWlsbC4gIEJ1dCBub3cgSSBhbSBhIGZpcmVmaWdodGVyIGFuZCB0aGlzIGtlZXBzIG1lIHZlcnkgYnVzeS5cIixcbiAgICAgICAgXCJiZXN0ZnJpZW5kXCI6IFwiV2luZGxpZnRlciB3b3VsZCBsaWtlIHRvIGJlIFlPVVIgYmVzdCBmcmllbmQuXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIldpbmRsaWZ0ZXIgbGlrZXMgdG8gZmx5IG1hbnkgcGxhY2VzIGFuZCBiZSBvbmUgd2l0aCB0aGUgd2luZC4gVGhlIHdpbmQgc3BlYWtzLCBXaW5kbGlmdGVyIGxpc3RlbnMuXCJcbiAgICB9LFxuICAgIFwiYmxhZGVcIjoge1xuICAgICAgICBcImpvYlwiOiBcIkknbSBhIEZpcmUgYW5kIFJlc2N1ZSBIZWxpY29wdGVyLCBhbmQgdGhlIENvcHRlciBpbiBDaGFyZ2UgaGVyZSBhdCBQaXN0b24gUGVhay4gXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJXaGVuIHRoZXJlJ3MgYSBmaXJlLCBJIGdpdmUgdGhlIG9yZGVycyBmb3IgdGhlIEFpciBBdHRhY2sgVGVhbSB0byBzcHJpbmcgaW50byBhY3Rpb24hXCIsXG4gICAgICAgIFwiZmlyZWZpZ2h0ZXJcIjogXCJJJ3ZlIGJlZW4gdGhlIENob3BwZXIgQ2FwdGFpbiBmb3IgYSBsb25nIHRpbWUsIGJ1dCBJIHdhc24ndCBhbHdheXMgYSBmaXJlZmlnaHRlci4gSSB3YXMgYSBUViBzdGFyIG9uIGEgc2hvdyBhYm91dCBwb2xpY2UgaGVsaWNvcHRlcnMhIEJ1dCBJIHJlYWxpemVkIEkgZGlkbid0IHdhbnQgdG8gcHJldGVuZCB0byBzYXZlIGxpdmVzLCBJIHdhbnRlZCB0byBzYXZlIHRoZW0gZm9yIHJlYWwhXCIsXG4gICAgICAgIFwiYmVzdGZyaWVuZFwiOiBcIk15IGJlc3QgZnJpZW5kcyBhcmUgYWxsIHRoZSB0cmFpbGJsYXplcnMgaGVyZSBhdCBQaXN0b24gUGVhay4gV2UgbGlrZSB0byB0aGluayBvZiBvdXJzZWx2ZXMgYXMgdGhlIGhlcm9lcyBvZiB0aGUgc2t5IVwiLFxuICAgICAgICBcImZhdm9yaXRlcGxhY2VcIjogXCJJIGxpa2UgdG8gZmx5IHRvIG1hbnkgcGxhY2VzLCBidXQgbXkgZmF2b3JpdGUgcGxhY2UgaXMgYWJvdmUgUGlzdG9uIFBlYWsuIEkgcGF0cm9sIHRoZSBza2llcyBhbmQgbWFrZSBzdXJlIGFsbCB0aGUgdG91cmlzdHMgYXJlIGNhbXBpbmcgYnkgdGhlIGJvb2suIFJlbWVtYmVyLCBzYWZldHkgZmlyc3QhXCJcbiAgICB9LFxuICAgIFwiY2FiYmllXCI6IHtcbiAgICAgICAgXCJqb2JcIjogXCJJJ20gYW4gZXgtbWlsaXRhcnkgY2FyZ28gcGxhbmUgd2l0aCB0aGUgUGlzdG9uIFBlYWsgQXR0YWNrIFRlYW0gLSBmaXJlZmlnaHRpbmcgaXMgYSBiaWcgcmVzcG9uc2liaWxpdHkuXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJJIGNhcnJ5IHRoZSBTbW9rZWp1bXBlcnMgLSB3aG8gY2xlYXIgZmFsbGVuIHRyZWVzIGFuZCBkZWJyaXMuIER1cmluZyBhIGZpcmUsIEkgZHJvcCB0aGVtIGZyb20gdGhlIHNreSwgcmlnaHQgb3ZlciB0aGUgZmxhbWVzLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiSSd2ZSBiZWVuIHRoZSBDaG9wcGVyIENhcHRhaW4gZm9yIGEgbG9uZyB0aW1lLCBidXQgSSB3YXNuJ3QgYWx3YXlzIGEgZmlyZWZpZ2h0ZXIuIEkgd2FzIGEgVFYgc3RhciBvbiBhIHNob3cgYWJvdXQgcG9saWNlIGhlbGljb3B0ZXJzISBCdXQgSSByZWFsaXplZCBJIGRpZG4ndCB3YW50IHRvIHByZXRlbmQgdG8gc2F2ZSBsaXZlcywgSSB3YW50ZWQgdG8gc2F2ZSB0aGVtIGZvciByZWFsIVwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJNeSBiZXN0IGZyaWVuZHMgYXJlIGFsbCB0aGUgdHJhaWxibGF6ZXJzIGhlcmUgYXQgUGlzdG9uIFBlYWsuIFdlIGxpa2UgdG8gdGhpbmsgb2Ygb3Vyc2VsdmVzIGFzIHRoZSBoZXJvZXMgb2YgdGhlIHNreSFcIixcbiAgICAgICAgXCJmYXZvcml0ZXBsYWNlXCI6IFwiSSBsaWtlIHRvIGZseSB0byBtYW55IHBsYWNlcywgYnV0IG15IGZhdm9yaXRlIHBsYWNlIGlzIGFib3ZlIFBpc3RvbiBQZWFrLiBJIHBhdHJvbCB0aGUgc2tpZXMgYW5kIG1ha2Ugc3VyZSBhbGwgdGhlIHRvdXJpc3RzIGFyZSBjYW1waW5nIGJ5IHRoZSBib29rLiBSZW1lbWJlciwgc2FmZXR5IGZpcnN0IVwiXG4gICAgfSxcbiAgICBcInRlYW1cIjoge1xuICAgICAgICBcImpvYlwiOiBcIlRoZSBQaXN0b24gUGVhayBBaXIgQXR0YWNrIFRlYW0gaXMgYW4gZWxpdGUgZ3JvdXAgb2YgZmlyZWZpZ2h0aW5nIGFpcmNyYWZ0cy4gXCIsXG4gICAgICAgIFwiZm9yZXN0ZmlyZXNcIjogXCJXZSBmbHkgaW4gd2hlbiBvdGhlcnMgYXJlIGZseWluIG91dC4gSXQgdGFrZXMgYSBzcGVjaWFsIGtpbmRhIHBsYW5lLlwiLFxuICAgICAgICBcImZpcmVmaWdodGVyXCI6IFwiTGlmZSBkb2Vzbid0IGFsd2F5cyBnbyB0aGUgd2F5IHlvdSBleHBlY3QgaXQuIFRoaXMgaXMgYSBzZWNvbmQgY2FyZWVyIGZvciBhbGwgb2YgdXMuIFwiLFxuICAgICAgICBcImJlc3RmcmllbmRcIjogXCJJdCB0YWtlcyBob25vciwgdHJ1c3QgYW5kIGJyYXZlcnkgdG8gZWFybiB5b3VyIHdpbmdzLiBXZSBkb24ndCBoYXZlIGp1c3Qgb25lIGJlc3QgZnJpZW5kIGJlY2F1c2Ugd2UgbmVlZCBldmVyeSBwbGFuZSB3ZSd2ZSBnb3QgdG8gaGVscC4gXCIsXG4gICAgICAgIFwiZmF2b3JpdGVwbGFjZVwiOiBcIlBpc3RvbiBQZWFrIGhhcyBzb21lIGdyZWF0IHBsYWNlcyB0byBmbHkuIEJ1dCBvdXIgZmF2b3JpdGUgc3BvdCBpcyB0aGUgd29vZGVuIHJhaWx3YXkgYnJpZGdlIC0gd2l0aCB0aGUgdGh1bmRlcmluZyBXaGl0ZXdhbGwgRmFsbHMgYmVoaW5kIGl0LlwiXG4gICAgfVxufSIsIlxuXG5cblxuLy8gYWRkcyBvdXIgY3VzdG9tIG1vZGlmaWNhdGlvbnMgdG8gdGhlIFBJWEkgbGlicmFyeVxucmVxdWlyZSgnLi9waXhpL2xpYk1vZGlmaWNhdGlvbnMnKTtcblxuXG5cbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFpblZpZXcnKTtcbnZhciBBc3NldExvYWRpbmdWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9hc3NldExvYWRpbmdWaWV3Jyk7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBcHAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYXBwID0ge307XG5cblxuXG5cblxuLy8gYWZ0ZXIgYXNzZXRzIGxvYWRlZCAmIGpxdWVyeSBsb2FkZWRcbmFwcC5yZW5kZXIgPSBfLmFmdGVyKDIsIGZ1bmN0aW9uKCkge1xuICAgIGFwcC5tYWluVmlldyA9IG5ldyBNYWluVmlldygpO1xuXG4gICAgYXBwLm1haW5WaWV3LnN0YXJ0KCk7XG59KTtcblxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBBc3NldCBMb2FkaW5nICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciAkcGFzc3dvcmRTY3JlZW4gPSAkKCcjcGFzc3dvcmRTY3JlZW4nKTtcblxuaWYoZG9jdW1lbnQuVVJMLmluZGV4T2YoJ2Rpc25leS1wbGFuZXMyLWFpcm1haWwtc3RhZ2luZy5henVyZXdlYnNpdGVzLm5ldCcpICE9PSAtMSkge1xuICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciBwYXNzd29yZCA9ICdkaXNuZXlQbGFuZXNUd28nO1xuXG4gICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dCA9ICRwYXNzd29yZFNjcmVlbi5maW5kKCdpbnB1dFt0eXBlPXBhc3N3b3JkXScpO1xuXG5cbiAgICAgICAgJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZigkcGFzc3dvcmRJbnB1dC52YWwoKSA9PT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmFkZU91dCg1MCk7XG5cbiAgICAgICAgICAgICAgICBhcHAuYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkaW5nVmlldyh7b25Db21wbGV0ZTogYXBwLnJlbmRlcn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0gZWxzZSB7XG4gICAgYXBwLmFzc2V0TG9hZGVyID0gbmV3IEFzc2V0TG9hZGluZ1ZpZXcoe29uQ29tcGxldGU6IGFwcC5yZW5kZXJ9KTtcblxuICAgICRwYXNzd29yZFNjcmVlbi5yZW1vdmUoKTtcbn1cblxuXG5cbiQoYXBwLnJlbmRlcik7XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwO1xuXG5cblxuIiwiXG5cblxudmFyIFF1ZXN0aW9uID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjb3B5OiAnJyxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgIH1cbn0pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbjsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbiAgICAvLyBkaXNwbGF5T2JqZWN0IHNob3VsZCBiZSBhbiBpbnN0YW5jZSBvZiBQSVhJLlNwcml0ZSBvciBQSVhJLk1vdmllQ2xpcFxuICAgIHZhciBDaGFyYWN0ZXIgPSBmdW5jdGlvbihuYW1lLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7IC8vIFBhcmVudCBjb25zdHJ1Y3RvclxuXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaWRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQobW92aWVDbGlwKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRJZGxlU3RhdGUobW92aWVDbGlwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuc2V0SWRsZVN0YXRlID0gZnVuY3Rpb24ocGl4aVNwcml0ZSkge1xuICAgICAgICB0aGlzLmlkbGUgPSBwaXhpU3ByaXRlO1xuXG4gICAgICAgIGlmKHBpeGlTcHJpdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgcGl4aVNwcml0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHBpeGlTcHJpdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICBwaXhpU3ByaXRlLmdvdG9BbmRQbGF5KDApOyAgLy9zdGFydCBjbGlwXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZENoaWxkKHBpeGlTcHJpdGUpOyAgIC8vYWRkIHRvIGRpc3BsYXkgb2JqZWN0IGNvbnRhaW5lclxuICAgIH07XG5cbiAgICAvL2FkZCBtb3ZpZSBjbGlwIHRvIHBsYXkgd2hlbiBjaGFyYWN0ZXIgY2hhbmdlcyB0byBzdGF0ZVxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuYWRkU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSwgbW92aWVDbGlwKSB7XG4gICAgICAgIG1vdmllQ2xpcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGVzW3N0YXRlXSA9IG1vdmllQ2xpcDtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChtb3ZpZUNsaXApO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgQVBJIGZ1bmN0aW9uLiBXYWl0cyB1bnRpbCBjdXJyZW50IHN0YXRlIGlzIGZpbmlzaGVkIGJlZm9yZSBzd2l0Y2hpbmcgdG8gbmV4dCBzdGF0ZS5cbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLmdvVG9TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG5cbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnN0YXRlc1tzdGF0ZV0pKSB7XG4gICAgICAgICAgICB0aHJvdyAnRXJyb3I6IENoYXJhY3RlciAnICsgdGhpcy5uYW1lICsgJyBkb2VzIG5vdCBjb250YWluIHN0YXRlOiAnICsgc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmlkbGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgdGhpcy5pZGxlLm9uQ29tcGxldGUgPSBfLmJpbmQodGhpcy5zd2FwU3RhdGUsIHRoaXMsIHN0YXRlKTtcblxuICAgICAgICAgICAgLy8gYWZ0ZXIgY3VycmVudCBhbmltYXRpb24gZmluaXNoZXMgZ28gdG8gdGhpcyBzdGF0ZSBuZXh0XG4gICAgICAgICAgICB0aGlzLmlkbGUubG9vcCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zd2FwU3RhdGUoc3RhdGUpO1xuICAgICAgICAgICAgLy9zd2l0Y2ggaW1tZWRpYXRlbHkgaWYgY2hhcmFjdGVyIGlkbGUgc3RhdGUgaXMgYSBzaW5nbGUgc3ByaXRlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gY2hhbmdlcyBzdGF0ZSBpbW1lZGlhdGVseVxuICAgIC8vIE5PVEU6IEZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlIHVzZWQgaW50ZXJuYWxseSBieSBjaGFyYWN0ZXIuZ29Ub1N0YXRlKClcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLnN3YXBTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG5cbiAgICAgICAgdmFyIGlkbGVTdGF0ZSA9IHRoaXMuaWRsZTtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gdGhpcy5zdGF0ZXNbc3RhdGVdO1xuXG4gICAgICAgIG5ld1N0YXRlLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHsgIC8vc3dpdGNoIGJhY2sgdG8gaWRsZSBhZnRlciBydW5cbiAgICAgICAgICAgIGlmKGlkbGVTdGF0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgbmV3U3RhdGUubG9vcCA9IGZhbHNlO1xuICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgbmV3U3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgfTtcblxuICAgIC8vYWRkIGNhbGxiYWNrIHRvIHJ1biBvbiBjaGFyYWN0ZXIgdXBkYXRlXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5vblVwZGF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH07XG5cbiAgICAvLyBjYWxsZWQgb24gZWFjaCBhbmltYXRpb24gZnJhbWUgYnkgd2hhdGV2ZXIgUGl4aSBzY2VuZSBjb250YWlucyB0aGlzIGNoYXJhY3RlclxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjaygpO1xuICAgIH07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBleHRlbmRzIERpc3BsYXkgT2JqZWN0IENvbnRhaW5lclxuICAgIGV4dGVuZChQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIsIENoYXJhY3Rlcik7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENoYXJhY3Rlcjtcbn0pKCk7IiwiXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgc3ViKSB7XG4gICAgLy8gQXZvaWQgaW5zdGFudGlhdGluZyB0aGUgYmFzZSBjbGFzcyBqdXN0IHRvIHNldHVwIGluaGVyaXRhbmNlXG4gICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9jcmVhdGVcbiAgICAvLyBmb3IgYSBwb2x5ZmlsbFxuICAgIC8vIEFsc28sIGRvIGEgcmVjdXJzaXZlIG1lcmdlIG9mIHR3byBwcm90b3R5cGVzLCBzbyB3ZSBkb24ndCBvdmVyd3JpdGVcbiAgICAvLyB0aGUgZXhpc3RpbmcgcHJvdG90eXBlLCBidXQgc3RpbGwgbWFpbnRhaW4gdGhlIGluaGVyaXRhbmNlIGNoYWluXG4gICAgLy8gVGhhbmtzIHRvIEBjY25va2VzXG4gICAgdmFyIG9yaWdQcm90byA9IHN1Yi5wcm90b3R5cGU7XG4gICAgc3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoYmFzZS5wcm90b3R5cGUpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9yaWdQcm90bykgIHtcbiAgICAgICAgc3ViLnByb3RvdHlwZVtrZXldID0gb3JpZ1Byb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8gUmVtZW1iZXIgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHdhcyBzZXQgd3JvbmcsIGxldCdzIGZpeCBpdFxuICAgIHN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWI7XG4gICAgLy8gSW4gRUNNQVNjcmlwdDUrIChhbGwgbW9kZXJuIGJyb3dzZXJzKSwgeW91IGNhbiBtYWtlIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eVxuICAgIC8vIG5vbi1lbnVtZXJhYmxlIGlmIHlvdSBkZWZpbmUgaXQgbGlrZSB0aGlzIGluc3RlYWRcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3ViLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHN1YlxuICAgIH0pO1xufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7IiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLypcbiAgICAgKiBDdXN0b20gRWRpdHMgZm9yIHRoZSBQSVhJIExpYnJhcnlcbiAgICAgKi9cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogUmVsYXRpdmUgUG9zaXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1ggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1kgPSAwO1xuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRQb3NpdGlvblggPSBmdW5jdGlvbih3aW5kb3dXaWR0aCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSAod2luZG93V2lkdGggKiB0aGlzLl93aW5kb3dYKSArIHRoaXMuX2J1bXBYO1xuICAgIH07XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25ZID0gZnVuY3Rpb24od2luZG93SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9ICh3aW5kb3dIZWlnaHQgKiB0aGlzLl93aW5kb3dZKSArIHRoaXMuX2J1bXBZO1xuICAgIH07XG5cbiAgICAvLyB3aW5kb3dYIGFuZCB3aW5kb3dZIGFyZSBwcm9wZXJ0aWVzIGFkZGVkIHRvIGFsbCBQaXhpIGRpc3BsYXkgb2JqZWN0cyB0aGF0XG4gICAgLy8gc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBvZiBwb3NpdGlvbi54IGFuZCBwb3NpdGlvbi55XG4gICAgLy8gdGhlc2UgcHJvcGVydGllcyB3aWxsIGJlIGEgdmFsdWUgYmV0d2VlbiAwICYgMSBhbmQgcG9zaXRpb24gdGhlIGRpc3BsYXlcbiAgICAvLyBvYmplY3QgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aW5kb3cgd2lkdGggJiBoZWlnaHQgaW5zdGVhZCBvZiBhIGZsYXQgcGl4ZWwgdmFsdWVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1gnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgoJHdpbmRvdy53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93WScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl93aW5kb3dZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWSgkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9idW1wWCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFkgPSAwO1xuXG4gICAgLy8gYnVtcFggYW5kIGJ1bXBZIGFyZSBwcm9wZXJ0aWVzIG9uIGFsbCBkaXNwbGF5IG9iamVjdHMgdXNlZCBmb3JcbiAgICAvLyBzaGlmdGluZyB0aGUgcG9zaXRpb25pbmcgYnkgZmxhdCBwaXhlbCB2YWx1ZXMuIFVzZWZ1bCBmb3Igc3R1ZmZcbiAgICAvLyBsaWtlIGhvdmVyIGFuaW1hdGlvbnMgd2hpbGUgc3RpbGwgbW92aW5nIGFyb3VuZCBhIGNoYXJhY3Rlci5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSAoJHdpbmRvdy53aWR0aCgpICogdGhpcy5fd2luZG93WCkgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYnVtcFknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVtcFk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX2J1bXBZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9ICgkd2luZG93LmhlaWdodCgpICogdGhpcy5fd2luZG93WSkgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogU2NhbGluZyBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuICAgIC8vIHdpbmRvd1NjYWxlIGNvcnJlc3BvbmRzIHRvIHdpbmRvdyBzaXplXG4gICAgLy8gICBleDogd2luZG93U2NhbGUgPSAwLjI1IG1lYW5zIDEvNCBzaXplIG9mIHdpbmRvd1xuICAgIC8vIHNjYWxlTWluIGFuZCBzY2FsZU1heCBjb3JyZXNwb25kIHRvIG5hdHVyYWwgc3ByaXRlIHNpemVcbiAgICAvLyAgIGV4OiBzY2FsZU1pbiA9IDAuNSBtZWFucyBzcHJpdGUgd2lsbCBub3Qgc2hyaW5rIHRvIG1vcmUgdGhhbiBoYWxmIG9mIGl0cyBvcmlnaW5hbCBzaXplLlxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3dpbmRvd1NjYWxlID0gLTE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zY2FsZU1pbiA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zY2FsZU1heCA9IE51bWJlci5NQVhfVkFMVUU7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zY2FsZVR5cGUgPSAnY29udGFpbic7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVGbmMgPSBNYXRoLm1pbjtcblxuICAgIC8vIFdpbmRvd1NjYWxlOiB2YWx1ZSBiZXR3ZWVuIDAgJiAxLCBvciAtMVxuICAgIC8vIFRoaXMgZGVmaW5lcyB3aGF0ICUgb2YgdGhlIHdpbmRvdyAoaGVpZ2h0IG9yIHdpZHRoLCB3aGljaGV2ZXIgaXMgc21hbGxlcilcbiAgICAvLyB0aGUgb2JqZWN0IHdpbGwgYmUgc2l6ZWQuIEV4YW1wbGU6IGEgd2luZG93U2NhbGUgb2YgMC41IHdpbGwgc2l6ZSB0aGUgZGlzcGxheU9iamVjdFxuICAgIC8vIHRvIGhhbGYgdGhlIHNpemUgb2YgdGhlIHdpbmRvdy5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1NjYWxlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl93aW5kb3dTY2FsZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUd28gcG9zc2libGUgdmFsdWVzOiBjb250YWluIG9yIGNvdmVyLiBVc2VkIHdpdGggd2luZG93U2NhbGUgdG8gZGVjaWRlIHdoZXRoZXIgdG8gdGFrZSB0aGVcbiAgICAvLyBzbWFsbGVyIGJvdW5kIChjb250YWluKSBvciB0aGUgbGFyZ2VyIGJvdW5kIChjb3Zlcikgd2hlbiBkZWNpZGluZyBjb250ZW50IHNpemUgcmVsYXRpdmUgdG8gc2NyZWVuLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnc2NhbGVUeXBlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlVHlwZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVUeXBlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRm5jID0gKHZhbHVlID09PSAnY29udGFpbicpID8gTWF0aC5taW4gOiBNYXRoLm1heDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFNjYWxlID0gZnVuY3Rpb24od2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCkge1xuICAgICAgICB2YXIgbG9jYWxCb3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5fd2luZG93U2NhbGUgKiB0aGlzLl9zY2FsZUZuYyh3aW5kb3dIZWlnaHQvbG9jYWxCb3VuZHMuaGVpZ2h0LCB3aW5kb3dXaWR0aC9sb2NhbEJvdW5kcy53aWR0aCk7XG5cbiAgICAgICAgLy9rZWVwIHNjYWxlIHdpdGhpbiBvdXIgZGVmaW5lZCBib3VuZHNcbiAgICAgICAgc2NhbGUgPSBNYXRoLm1heCh0aGlzLnNjYWxlTWluLCBNYXRoLm1pbihzY2FsZSwgdGhpcy5zY2FsZU1heCkpO1xuXG5cbiAgICAgICAgdGhpcy5zY2FsZS54ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIHRoaXMuc2NhbGUueSA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgIH07XG5cblxuICAgIC8vIFVTRSBPTkxZIElGIFdJTkRPV1NDQUxFIElTIEFMU08gU0VUXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVYID0gMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVkgPSAxO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBXaW5kb3cgUmVzaXplIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQgZm9yIGVhY2ggZGlzcGxheSBvYmplY3Qgb24gd2luZG93IHJlc2l6ZSxcbiAgICAvLyBhZGp1c3RpbmcgdGhlIHBpeGVsIHBvc2l0aW9uIHRvIG1pcnJvciB0aGUgcmVsYXRpdmUgcG9zaXRpb25zIHdpbmRvd1ggYW5kIHdpbmRvd1lcbiAgICAvLyBhbmQgYWRqdXN0aW5nIHNjYWxlIGlmIGl0J3Mgc2V0XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCh3aWR0aCk7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWShoZWlnaHQpO1xuXG4gICAgICAgIGlmKHRoaXMuX3dpbmRvd1NjYWxlICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oZGlzcGxheU9iamVjdCkge1xuICAgICAgICAgICAgZGlzcGxheU9iamVjdC5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqIFNwcml0ZXNoZWV0IFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gdXNlZCB0byBnZXQgaW5kaXZpZHVhbCB0ZXh0dXJlcyBvZiBzcHJpdGVzaGVldCBqc29uIGZpbGVzXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIGNhbGw6IGdldEZpbGVOYW1lcygnYW5pbWF0aW9uX2lkbGVfJywgMSwgMTA1KTtcbiAgICAvLyBSZXR1cm5zOiBbJ2FuaW1hdGlvbl9pZGxlXzAwMS5wbmcnLCAnYW5pbWF0aW9uX2lkbGVfMDAyLnBuZycsIC4uLiAsICdhbmltYXRpb25faWRsZV8xMDQucG5nJ11cbiAgICAvL1xuICAgIGZ1bmN0aW9uIGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICB2YXIgbnVtRGlnaXRzID0gKHJhbmdlRW5kLTEpLnRvU3RyaW5nKCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgZnVuY3Rpb24obnVtKSB7XG5cbiAgICAgICAgICAgIHZhciBudW1aZXJvcyA9IG51bURpZ2l0cyAtIG51bS50b1N0cmluZygpLmxlbmd0aDsgICAvL2V4dHJhIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIHZhciB6ZXJvcyA9IG5ldyBBcnJheShudW1aZXJvcyArIDEpLmpvaW4oJzAnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQcmVmaXggKyB6ZXJvcyArIG51bSArICcucG5nJztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgUElYSS5nZXRUZXh0dXJlcyA9IGZ1bmN0aW9uKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChnZXRGaWxlTmFtZXMoZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKTtcbiAgICB9XG5cblxuXG5cblxuXG5cblxufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciBpbnRyb1ZpZGVvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRyb1ZpZGVvJyk7XG4gICAgdmFyIGJhY2tncm91bmRNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JhY2tncm91bmQnKTtcbiAgICB2YXIgYmxhZGV3aXBlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9ibGFkZXdpcGUnKTtcbiAgICB2YXIgZHVzdHlEaXBwZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2R1c3R5RGlwcGVyJyk7XG4gICAgdmFyIHBhcmFjaHV0ZXJzTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9wYXJhY2h1dGVycycpO1xuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplSGVhZGVyRm9vdGVyKHNjZW5lKSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaGVhZGVyLnBuZycpO1xuXG4gICAgICAgIGhlYWRlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGhlYWRlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDApO1xuICAgICAgICBoZWFkZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgaGVhZGVyLndpbmRvd1kgPSAwO1xuXG4gICAgICAgIHZhciBmb290ZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9vdGVyLnBuZycpO1xuXG4gICAgICAgIGZvb3Rlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGZvb3Rlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgICAgIGZvb3Rlci53aW5kb3dYID0gMC41O1xuICAgICAgICBmb290ZXIud2luZG93WSA9IDE7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZm9vdGVyKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiogUHJpbWFyeSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBNYWluU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgU2NlbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmluaXRpYWxpemUoKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRCYWNrZ3JvdW5kVG9TY2VuZSh0aGlzKTtcbiAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRSZXN0VG9TY2VuZSh0aGlzKTtcblxuICAgICAgICBibGFkZXdpcGVNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG5cbiAgICAgICAgaW5pdGlhbGl6ZUhlYWRlckZvb3Rlcih0aGlzKTtcblxuICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIHRoaXMuaW50cm9WaWRlbyA9IGludHJvVmlkZW9Nb2R1bGUuZ2V0VmlkZW8oKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBvbldpcGVzY3JlZW5Db21wbGV0ZTpmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLm9uVmlkZW9Db21wbGV0ZShjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVXNlckNoYXJhY3Rlck91dDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5vbkFuaW1hdGlvbk91dENvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJsYWRld2lwZU1vZHVsZS5oaWRlVmlkZW8oKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnRFbnRlck5hbWVBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZUluKCk7XG5cbiAgICAgICAgICAgIHZhciBzdGFydFRpbWUgPSAyMDAwO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocGFyYWNodXRlcnNNb2R1bGUuYW5pbWF0ZU5leHQsIHN0YXJ0VGltZSArIDYwMDApO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgMTUwMDApO1xuICAgICAgICB9LFxuICAgICAgICBzaG93UmVzcG9uc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaGlkZSgpO1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVJblVzZXJDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmFuaW1hdGVJbigpO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlT3V0VXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBQYXJhbGxheCBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5zaGlmdEJhY2tncm91bmRMYXllcnMoeCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIH0sXG4gICAgICAgIF9vbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICBpZighXy5pc1VuZGVmaW5lZCh0aGlzLnZpZXcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5pbnRyb1ZpZGVvLnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSB0aGlzLmludHJvVmlkZW8uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudmlldy5vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0LCAoYm91bmRzLndpZHRoICogc2NhbGUueCksIChib3VuZHMuaGVpZ2h0ICogc2NhbGUueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG4gICAgLy8gRXh0ZW5kcyBTY2VuZSBDbGFzc1xuICAgIGV4dGVuZChTY2VuZSwgTWFpblNjZW5lKTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluU2NlbmU7XG59KSgpOyIsIlxuXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbnZhciBTY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDQiA9IGZ1bmN0aW9uKCl7fTtcblxuICAgIFBJWEkuU3RhZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblNjZW5lLnByb3RvdHlwZSA9IHtcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24odXBkYXRlQ0IpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDQiA9IHVwZGF0ZUNCO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDQigpO1xuICAgIH0sXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgfSxcbiAgICByZXN1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgaXNQYXVzZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXVzZWQ7XG4gICAgfVxufTtcblxuXG5leHRlbmQoUElYSS5TdGFnZSwgU2NlbmUpO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgU2NlbmVzTWFuYWdlciA9IHtcbiAgICAgICAgc2NlbmVzOiB7fSxcbiAgICAgICAgY3VycmVudFNjZW5lOiBudWxsLFxuICAgICAgICByZW5kZXJlcjogbnVsbCxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgJHBhcmVudERpdikge1xuXG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5yZW5kZXJlcikgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih3aWR0aCwgaGVpZ2h0LCBudWxsLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3LnNldEF0dHJpYnV0ZSgnaWQnLCAncGl4aS12aWV3Jyk7XG4gICAgICAgICAgICAkcGFyZW50RGl2LmFwcGVuZChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShTY2VuZXNNYW5hZ2VyLmxvb3ApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgbG9vcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShmdW5jdGlvbiAoKSB7IFNjZW5lc01hbmFnZXIubG9vcCgpIH0pO1xuXG4gICAgICAgICAgICBpZiAoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lIHx8IFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLmlzUGF1c2VkKCkpIHJldHVybjtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUudXBkYXRlKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlbmRlcihTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZVNjZW5lOiBmdW5jdGlvbihpZCwgU2NlbmVDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgU2NlbmVDb25zdHJ1Y3RvciA9IFNjZW5lQ29uc3RydWN0b3IgfHwgU2NlbmU7ICAgLy9kZWZhdWx0IHRvIFNjZW5lIGJhc2UgY2xhc3NcblxuICAgICAgICAgICAgdmFyIHNjZW5lID0gbmV3IFNjZW5lQ29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSA9IHNjZW5lO1xuXG4gICAgICAgICAgICByZXR1cm4gc2NlbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdvVG9TY2VuZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHtcbiAgICAgICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnBhdXNlKCk7XG5cbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSA9IFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXTtcblxuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgcmVzaXplIHRvIG1ha2Ugc3VyZSBhbGwgY2hpbGQgb2JqZWN0cyBpbiB0aGVcbiAgICAgICAgICAgICAgICAvLyBuZXcgc2NlbmUgYXJlIGNvcnJlY3RseSBwb3NpdGlvbmVkXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzdW1lIG5ldyBzY2VuZVxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnJlc3VtZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCJcblxuXG5cblxudmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxudmFyIHNvdW5kUGxheWVyID0ge1xuICAgIG11dGVkOiBmYWxzZSxcbiAgICB2b2x1bWU6IDAuNCxcbiAgICBzb3VuZHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXSA9IHRoaXMuc291bmRzW2ZpbGVQYXRoXSB8fCBuZXcgQXVkaW8oZmlsZVBhdGgpO1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5hZGQoZmlsZVBhdGgpO1xuXG4gICAgICAgIGlmKCF0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0udm9sdW1lID0gdGhpcy52b2x1bWU7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0ucGxheSgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheScsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXy5lYWNoKGF1ZGlvQXNzZXRzLCBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHNvdW5kUGxheWVyLmFkZChmaWxlUGF0aCk7XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc291bmRQbGF5ZXI7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm5hbWUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgdmFsdWU9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIGlkPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiAvPlxcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy50ZXh0KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnRleHQpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcblxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3B5KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcHkpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMSwgcHJvZ3JhbTEsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvYXNzZXRzLmpzb24nKTtcblxudmFyIGZpbGVOYW1lcyA9IE9iamVjdC5rZXlzKGFzc2V0RGF0YS5hc3NldHMpO1xudmFyIHRvdGFsRmlsZXMgPSBmaWxlTmFtZXMubGVuZ3RoO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy51cGRhdGUodGhpcy5sb2FkQ291bnQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBfLmJpbmQodmlldy5hc3NldHNMb2FkZWQsIHZpZXcpO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBWaWV3ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBBc3NldExvYWRpbmdWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnI2Fzc2V0TG9hZGVyJyxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJHRleHQgPSB0aGlzLiRlbC5maW5kKCc+IC50ZXh0Jyk7XG4gICAgICAgIHRoaXMuJHRleHQuaHRtbCgnMC4wMCUnKTtcblxuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IG9wdGlvbnMub25Db21wbGV0ZSB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgICAgc3RhcnRMb2FkZXIodGhpcyk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGxvYWRDb3VudCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwMDAgKiAodG90YWxGaWxlcy1sb2FkQ291bnQpL3RvdGFsRmlsZXMpLzEwMDtcblxuICAgICAgICB0aGlzLiR0ZXh0Lmh0bWwocGVyY2VudGFnZSArICclJyk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuXG4gICAgICAgIHRoaXMuJHRleHQuaGlkZSgpO1xuICAgICAgICB2YXIgJGVsID0gdGhpcy4kZWw7XG4gICAgICAgIFR3ZWVuTGl0ZS50bygkZWwsIDEuNCwge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRlbC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldExvYWRpbmdWaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleWRvd24gaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlcklubmVyID0gdGhpcy4kcGxhY2Vob2xkZXIuZmluZCgnPiBkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnZGl2LnRpdGxlJyk7XG5cblxuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIF8uYmluZEFsbCh0aGlzLCAnc3RhcnRBbmltYXRpb24nLCdzaG93JywnaGlkZScsJ3NldEluYWN0aXZlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRTY2VuZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5zY2VuZXNbJ21haW4nXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKiogUnVuIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzdGFydEFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjcGl4aS12aWV3JykucmVtb3ZlQ2xhc3MoJ2Zyb250Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc3RhcnRFbnRlck5hbWVBbmltYXRpb24oKTsgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyc1xuXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuMztcblxuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHRpdGxlLCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMSwgeTogMCwgZWFzZTogJ0JhY2suZWFzZU91dCd9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiRuYW1lSW5wdXQsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGxhY2Vob2xkZXJJbm5lciwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnLCBkZWxheTogMC4xNX0pO1xuICAgICAgICB9LFxuICAgICAgICBwcmVBbmltYXRpb25TZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJHRpdGxlLCB7b3BhY2l0eTogMCwgeTogLTc1fSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJG5hbWVJbnB1dCwge29wYWNpdHk6IDB9KTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kcGxhY2Vob2xkZXJJbm5lciwge29wYWNpdHk6IDAsIHk6IC01MH0pO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBTaG93L0hpZGUgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLmdvVG9TY2VuZSgnbWFpbicpO1xuXG4gICAgICAgICAgICB0aGlzLnByZUFuaW1hdGlvblNldHVwKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc3RhcnRBbmltYXRpb24sIDApO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5vbkFuaW1hdGlvbk91dENvbXBsZXRlKHRoaXMuc2V0SW5hY3RpdmUpO1xuXG4gICAgICAgICAgICAvL3J1biBoaWRlIGFuaW1hdGlvblxuICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRJbmFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfSxcblxuICAgICAgICBvbk5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLiRuYW1lSW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyLnRvZ2dsZSh2YWwgPT09ICcnKTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB2YWx9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVZpZXc7XG59KSgpO1xuIiwiXG5cblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzb3VuZFBsYXllciA9IHJlcXVpcmUoJy4uL3NvdW5kUGxheWVyJyk7XG5cbiAgICB2YXIgRm9vdGVyVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS52b2x1bWUnOiAnb25Wb2x1bWVUb2dnbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm51bURvdHMgPSBvcHRpb25zLm51bURvdHM7XG5cblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENvdW50ZXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzID0gdGhpcy4kZWwuZmluZCgnYS52b2x1bWUgcGF0aCcpO1xuICAgICAgICAgICAgdGhpcy4kY291bnRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5jb3VudGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRkb3RzID0gdGhpcy4kY291bnRlci5maW5kKCc+IC5kb3QnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFZvbHVtZUFuaW1hdGlvblRpbWVsaW5lczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uQW5pbWF0aW9uID0gdGhpcy5nZXRUaW1lbGluZVZvbHVtZU9uKCk7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPZmYoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdENvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG51bURvdHMgPSB0aGlzLm51bURvdHM7XG5cbiAgICAgICAgICAgIHZhciAkZG90ID0gdGhpcy4kZG90cy5lcSgwKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMjsgaSA8PSBudW1Eb3RzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgJG5ld0RvdCA9ICRkb3QuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAkbmV3RG90LmZpbmQoJz4gZGl2Lm51bWJlcicpLmh0bWwoaSk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5hcHBlbmRUbyh0aGlzLiRjb3VudGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QgPSAkZG90O1xuICAgICAgICAgICAgJGRvdC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqIFZvbHVtZSBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICB0b2dnbGVWb2x1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9ICF0aGlzLnZvbHVtZU9uO1xuXG4gICAgICAgICAgICBpZih0aGlzLnZvbHVtZU9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICAgICAgc291bmRQbGF5ZXIub2ZmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVuZE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZWFzaW5nOiAnQmFjay5lYXNlT3V0Jywgb3BhY2l0eTogMX07XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAuNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVuZE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlYXNpbmc6ICdCYWNrLmVhc2VJbicsIG9wYWNpdHk6IDB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgb25cbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoMSwwLDAsMSwwLDApJyk7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5jc3MoJ29wYWNpdHknLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAuNSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkU3ZnUGF0aEFuaW1hdGlvbjogZnVuY3Rpb24odGltZWxpbmUsICRwYXRoLCBzdGFydFRpbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBhbmltYXRpb25TcGVlZCA9IDAuMjtcblxuICAgICAgICAgICAgdmFyIHBhdGhNYXRyaXggPSBfLmNsb25lKG9wdGlvbnMuc3RhcnRNYXRyaXgpO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5BdHRycyA9IHtcbiAgICAgICAgICAgICAgICBlYXNlOiBvcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXRoLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoJyArIHBhdGhNYXRyaXguam9pbignLCcpICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0d2VlbkF0dHJzLCBvcHRpb25zLmVuZE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oJHBhdGgsIGFuaW1hdGlvblNwZWVkLCB7b3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5fSksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8ocGF0aE1hdHJpeCwgYW5pbWF0aW9uU3BlZWQsIHR3ZWVuQXR0cnMpLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBDb3VudGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNldENvdW50ZXI6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMuZXEoaSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gdGhpcy4kZG90cy5lcShpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kY291bnRlci5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5vdXRlckhlaWdodCgpICsgdGhpcy4kY291bnRlci5vdXRlckhlaWdodCgpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25Wb2x1bWVUb2dnbGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy50b2dnbGVWb2x1bWUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEZvb3RlclZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxuICAgIHZhciBpbnRyb1ZpZGVvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRyb1ZpZGVvJyk7XG5cbiAgICB2YXIgSW50cm9WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNpbnRyby12aWV3JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5iZWdpbic6ICdvbkJlZ2luQ2xpY2snXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gU3R1ZmYgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uVGltZWxpbmUoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRKcXVlcnlWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5TY3JlZW4gPSB0aGlzLiRlbC5maW5kKCdkaXYuYmVnaW4tc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkxpbmVzID0gdGhpcy4kYmVnaW5TY3JlZW4uZmluZCgnZGl2LmxpbmUnKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luQnRuID0gdGhpcy4kYmVnaW5TY3JlZW4uZmluZCgnYS5iZWdpbicpO1xuXG4gICAgICAgICAgICB2YXIgJHZpZXdQb3J0cyA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi52aWV3cG9ydCcpO1xuXG4gICAgICAgICAgICB0aGlzLiR2aWV3UG9ydFRvcCA9ICR2aWV3UG9ydHMuZmlsdGVyKCcudG9wJyk7XG4gICAgICAgICAgICB0aGlzLiR2aWV3UG9ydEJvdHRvbSA9ICR2aWV3UG9ydHMuZmlsdGVyKCcuYnRtJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHZlcnRpY2FsU2lkZXMgPSAkdmlld1BvcnRzLmZpbmQoJy52ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgdGhpcy4kaG9yaXpvbnRhbFNpZGVzID0gJHZpZXdQb3J0cy5maW5kKCcuaG9yaXpvbnRhbCcpO1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZHMgPSAkdmlld1BvcnRzLmZpbmQoJy5iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRBbmltYXRpb25UaW1lbGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZSA9IHRoaXMuZ2V0VGltZWxpbmVIaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbiA9IHRoaXMuZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRTY2VuZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5zY2VuZXNbJ21haW4nXTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRWaWV3KHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dCZWdpblNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbjtcblxuICAgICAgICAgICAgc2V0VGltZW91dChfLmJpbmQodGltZWxpbmUucGxheSwgdGltZWxpbmUpLCAyMDApO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMC40O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdCYWNrLmVhc2VPdXQnO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5zID0gXy5tYXAodGhpcy4kYmVnaW5MaW5lcywgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2VlbkxpdGUudG8obGluZSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0d2VlbnM6IHR3ZWVucyxcbiAgICAgICAgICAgICAgICBzdGFnZ2VyOiAwLjA4LFxuICAgICAgICAgICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJGJlZ2luQnRuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMC43XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBidG5JblRpbWUgPSAwLjQ7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIHNjYWxlWDogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSArIChhbmltYXRpb25UaW1lICogMC4wNSkpO1xuXG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRUaW1lbGluZUhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKiogVGltZWxpbmUgKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRpb25GaW5pc2hlZCxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlU2NvcGU6IHRoaXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luU2NyZWVuLCBhbmltYXRpb25UaW1lLzQsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJHZpZXdQb3J0VG9wLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnLTUwJScsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJHZpZXdQb3J0Qm90dG9tLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAnLTUwJScsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25BbmltYXRpb25GaW5pc2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNldEluYWN0aXZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QWN0aXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdpbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRJbmFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaW5hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgICAgIG9uQmVnaW5DbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kcy53aWR0aCh2aWRlb1dpZHRoICogMS4yNzUgfCAwKTtcbiAgICAgICAgICAgIHRoaXMuJGhvcml6b250YWxTaWRlcy5oZWlnaHQoKCh3aW5kb3dIZWlnaHQgLSB2aWRlb0hlaWdodCkvMiArIDEpIHwgMCk7IC8vcm91bmQgdXBcbiAgICAgICAgICAgIHRoaXMuJHZlcnRpY2FsU2lkZXMud2lkdGgoKCh3aW5kb3dXaWR0aCAtIHZpZGVvV2lkdGgpLzIgKyAxKSB8IDApOyAvL3JvdW5kIHVwXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZSgpO1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLmdvVG9TY2VuZSgnbWFpbicpO1xuICAgICAgICAgICAgJCgnI3BpeGktdmlldycpLmFkZENsYXNzKCdmcm9udCcpO1xuXG4gICAgICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLm9uQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd0JlZ2luU2NyZWVuLCB0aGlzKSk7XG4gICAgICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLnBsYXlWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudGltZWxpbmVIaWRlLnBsYXkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgTWFpblNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9tYWluU2NlbmUnKTtcbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IENvbGxlY3Rpb25zIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMnKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBWaWV3cyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgSW50cm9WaWV3ID0gcmVxdWlyZSgnLi9pbnRyb1ZpZXcnKTtcbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IHJlcXVpcmUoJy4vZW50ZXJOYW1lVmlldycpO1xuICAgIHZhciBRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gcmVxdWlyZSgnLi9zZWxlY3RDaGFyYWN0ZXJWaWV3Jyk7XG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IHJlcXVpcmUoJy4vcmVzcG9uc2VWaWV3Jyk7XG4gICAgdmFyIEZvb3RlclZpZXcgPSByZXF1aXJlKCcuL2Zvb3RlclZpZXcnKTtcblxuXG5cbiAgICB2YXIgTWFpblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gW107XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuXG4gICAgICAgICAgICAvL2NyZWF0ZSBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5pbml0aWFsaXplKHRoaXMuJHdpbmRvdy53aWR0aCgpLCB0aGlzLiR3aW5kb3cuaGVpZ2h0KCksIHRoaXMuJGVsKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBNYWluU2NlbmUpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgdmlld3NcbiAgICAgICAgICAgIHRoaXMuaW5pdEludHJvVmlldygpO1xuICAgICAgICAgICAgdGhpcy5pbml0UGFnZXMoKTtcblxuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBuZXcgRm9vdGVyVmlldyh7bnVtRG90czogdGhpcy5wYWdlcy5sZW5ndGh9KTtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VWaWV3ID0gbmV3IFJlc3BvbnNlVmlldygpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRXaW5kb3dFdmVudHMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0V2luZG93RXZlbnRzOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coJ2luaXQgd2luZG93IEV2ZW50cycpO1xuLy9cbi8vICAgICAgICAgICAgdGhpcy4kd2luZG93Lm9uKCdyZXNpemUnLCBfLmJpbmQodGhpcy5yZXBvc2l0aW9uUGFnZU5hdiwgdGhpcykpO1xuLy9cbi8vICAgICAgICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlb3JpZW50YXRpb24nKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29yaWVudGF0aW9uJywgZXZlbnQuYmV0YSwgZXZlbnQuZ2FtbWEpO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlbW90aW9uJyk7XG4vL1xuLy8gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21vdGlvbicsIGV2ZW50LmFjY2VsZXJhdGlvbi54ICogMiwgZXZlbnQuYWNjZWxlcmF0aW9uLnkgKiAyKTtcbi8vICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuLy8gICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veiBvcmllbnRhdGlvbicpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiTW96T3JpZW50YXRpb25cIiwgZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW96Jywgb3JpZW50YXRpb24ueCAqIDUwLCBvcmllbnRhdGlvbi55ICogNTApO1xuLy8gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4vLyAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SW50cm9WaWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSBuZXcgSW50cm9WaWV3KCk7XG5cbiAgICAgICAgICAgIGludHJvVmlldy5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dGaXJzdFBhZ2UsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcgPSBpbnRyb1ZpZXc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFBhZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyTW9kZWwgPSBfLmZpcnN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTW9kZWxzID0gXy5yZXN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuXG4gICAgICAgICAgICB2YXIgZW50ZXJOYW1lVmlldyA9IG5ldyBFbnRlck5hbWVWaWV3KCk7XG4gICAgICAgICAgICB2YXIgc2VsZWN0Q2hhclZpZXcgPSBuZXcgU2VsZWN0Q2hhcmFjdGVyVmlldyh7bW9kZWw6IGNoYXJNb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25WaWV3cyA9IF8ubWFwKHF1ZXN0aW9uTW9kZWxzLCBmdW5jdGlvbihxdWVzdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVzdGlvblZpZXcoe21vZGVsOiBxdWVzdGlvbk1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtlbnRlck5hbWVWaWV3LCBzZWxlY3RDaGFyVmlld10uY29uY2F0KHF1ZXN0aW9uVmlld3MpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYucGFnZXMtY3RuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYgPSB0aGlzLiRwYWdlc0NvbnRhaW5lci5maW5kKCdkaXYucGFnZS1uYXYnKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EubmV4dCcpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5maW5pc2gtc2VuZCcpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogQ2hhbmdlIFZpZXcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0ZpcnN0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzWzBdLnNob3coKTtcblxuICAgICAgICAgICAgdGhpcy4kbmV4dC5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kbmV4dCwgMC4zLCB7b3BhY2l0eTogMX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vaGlkZSBhY3RpdmUgcGFnZVxuICAgICAgICAgICAgdmFyIGFjdGl2ZVBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdih0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1BhZ2VBZnRlckhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9zaG93IG5leHQgcGFnZVxuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICBuZXh0UGFnZS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNldENvdW50ZXIodGhpcy5hY3RpdmVQYWdlSW5kZXgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gdGhpcy5wYWdlcy5sZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmlzaEJ0bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaG93RmluaXNoQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQW5kU2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5oaWRlQ291bnRlcigpO1xuXG4gICAgICAgICAgICB2YXIgcGFnZU1vZGVscyA9IF8ubWFwKHRoaXMucGFnZXMsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5tb2RlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2V0UmVzcG9uc2UocGFnZU1vZGVscyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUub25Vc2VyQ2hhcmFjdGVyT3V0KF8uYmluZCh0aGlzLnNjZW5lLnBsYXlXaXBlc2NyZWVuLCB0aGlzLnNjZW5lKSk7XG5cbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLm9uV2lwZXNjcmVlbkNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1lLnJlc3BvbnNlVmlldy5zaG93KCk7XG4gICAgICAgICAgICAgICAgbWUuc2NlbmUuc2hvd1Jlc3BvbnNlKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcG9zaXRpb25QYWdlTmF2OiBmdW5jdGlvbihhbmltYXRlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgcGl4ZWxQb3NpdGlvbiA9IChhY3RpdmVQYWdlLiRlbC5vZmZzZXQoKS50b3AgKyBhY3RpdmVQYWdlLiRlbC5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSB0aGlzLiR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIHZhciB0b3BGcmFjID0gTWF0aC5taW4ocGl4ZWxQb3NpdGlvbi93aW5kb3dIZWlnaHQsICh3aW5kb3dIZWlnaHQgLSB0aGlzLmZvb3Rlci5oZWlnaHQoKSAtIHRoaXMuJHBhZ2VOYXYub3V0ZXJIZWlnaHQoKSkvd2luZG93SGVpZ2h0KTtcblxuICAgICAgICAgICAgdmFyIHBlcmNUb3AgPSAxMDAgKiB0b3BGcmFjICsgJyUnO1xuXG4gICAgICAgICAgICBpZighIWFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGFnZU5hdiwgMC4yLCB7dG9wOiBwZXJjVG9wLCBlYXNlOidRdWFkLmVhc2VJbk91dCd9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygndG9wJywgcGVyY1RvcCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvVmlldyA9IHRoaXMuaW50cm9WaWV3O1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGludHJvVmlldy5zdGFydCgpOyAvL3N0YXJ0IGludHJvXG5cbiAgICAgICAgICAgICAgICAvL3RyaWdnZXIgd2luZG93IHJlc2l6ZVxuICAgICAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25OZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5maW5pc2hBbmRTZW5kKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VNb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzKGUucGFnZVgvdGhpcy4kd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluVmlldztcblxuXG5cbn0pKCk7IiwiXG5cbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMnKTtcbnZhciBpdGVtQW5pbWF0aW9uc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFnZUl0ZW1zJyk7XG5cbnZhciBRdWVzdGlvblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgLy8gVmFyaWFibGVzXG4gICAgY2xhc3NOYW1lOiAncXVlc3Rpb24gcGFnZScsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBpbnB1dFt0eXBlPXJhZGlvXSc6ICdvblJhZGlvQ2hhbmdlJ1xuICAgIH0sXG4gICAgLy8gRnVuY3Rpb25zXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIG9wdGlvbnMucGFyZW50LmFwcGVuZCh0aGlzLmVsKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuXG4gICAgICAgIHRoaXMuJG9wdGlvbnMgPSB0aGlzLiRlbC5maW5kKCdkaXYub3B0aW9uJyk7XG5cbiAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuICAgIH0sXG4gICAgaW5pdEFuaW1hdGlvbnM6IGZ1bmN0aW9uKHF1ZXN0aW9uVHlwZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgYW5pbWF0aW9ucztcblxuICAgICAgICBpZihxdWVzdGlvblR5cGUgPT09ICdjYW5uZWQnKSB7XG4gICAgICAgICAgICBhbmltYXRpb25zID0gaXRlbUFuaW1hdGlvbnNNb2R1bGUuZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluID0gYW5pbWF0aW9uc1swXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQgPSBhbmltYXRpb25zWzFdO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0LnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy5oaWRlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH0sXG4gICAgc2V0QW5pbWF0aW9uSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuZWwuaW5uZXJIVE1MID09PSAnJylcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25Jbi5wbGF5KCk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC5wbGF5KCk7XG4gICAgfSxcbiAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHZhciB0ZXh0ID0gJChlLmN1cnJlbnRUYXJnZXQpLnNpYmxpbmdzKCdkaXYudGV4dCcpLmh0bWwoKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7dmFsdWU6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyksIHRleHQ6IHRleHR9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciByZXNwb25zZU1hcCA9IHJlcXVpcmUoJy4uL2RhdGEvcmVzcG9uc2VNYXAuanNvbicpO1xuXG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjcmVzcG9uc2UnLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy90aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5jcmVhdGVTY2VuZSgncmVzcG9uc2UnLCBSZXNwb25zZVNjZW5lKTtcblxuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZCA9ICQoJyNyZXNwb25zZS1iZycpO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVzcG9uc2U6IGZ1bmN0aW9uKG1vZGVscykge1xuXG4gICAgICAgICAgICB2YXIgbmFtZU1vZGVsID0gbW9kZWxzWzBdO1xuICAgICAgICAgICAgdmFyIGNoYXJhY3Rlck1vZGVsID0gbW9kZWxzWzFdO1xuXG5cbiAgICAgICAgICAgIHZhciBhbnN3ZXJlZFF1ZXN0aW9ucyA9IF8uZmlsdGVyKF8ucmVzdChtb2RlbHMsIDIpLCBmdW5jdGlvbihtb2RlbCkge3JldHVybiBtb2RlbC5hdHRyaWJ1dGVzLnZhbHVlICE9PSAnJ30pO1xuXG4gICAgICAgICAgICB2YXIgcGFydGl0aW9uZWRRdWVzdGlvbnMgPSBfLnBhcnRpdGlvbihhbnN3ZXJlZFF1ZXN0aW9ucywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWwuYXR0cmlidXRlcy5jbGFzcyAhPT0gJ2Nhbm5lZCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHBlcnNvbmFsaXR5TW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbnNbMF07XG4gICAgICAgICAgICB2YXIgY2FubmVkTW9kZWxzID0gcGFydGl0aW9uZWRRdWVzdGlvbnNbMV07XG5cblxuICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IGNoYXJhY3Rlck1vZGVsLmF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2FocmFjdGVyOicsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlSZXNwb25zZXMgPSBfLm1hcChwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24obW9kZWwpICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobW9kZWwuYXR0cmlidXRlcy5uYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMubmFtZV0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vZGVsLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlTWFwW2NoYXJhY3Rlcl1bbW9kZWwuYXR0cmlidXRlcy5uYW1lXS5yZXBsYWNlKCcldGVtcGxhdGUlJywgbW9kZWwuYXR0cmlidXRlcy50ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY2FubmVkUmVzcG9uc2VzID0gXy5tYXAoY2FubmVkTW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZU1hcFtjaGFyYWN0ZXJdW21vZGVsLmF0dHJpYnV0ZXMudmFsdWVdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc3BvbnNlICs9ICcgJyArIGNhbm5lZFJlc3BvbnNlcy5qb2luKCcgJykgKyAnICcgKyBwZXJzb25hbGl0eVJlc3BvbnNlcy5qb2luKCcgJyk7XG5cblxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cblxuLy8gICAgICAgICAgICAvLyBUT0RPOiBDaGFuZ2UgdG8gYWN0dWFsIGdlbmVyYXRlZCByZXNwb25zZVxuLy8gICAgICAgICAgICB2YXIgaHRtbCA9ICdOYW1lOiAnICsgbmFtZU1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgKyAnPGJyLz4nO1xuLy9cbi8vICAgICAgICAgICAgaHRtbCArPSAnPGJyLz4nO1xuLy9cbi8vICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24oc3RyLCBtb2RlbCkge1xuLy8gICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArIG1vZGVsLmF0dHJpYnV0ZXMubmFtZSArICc6ICcgKyBtb2RlbC5hdHRyaWJ1dGVzLnZhbHVlICsgJzxici8+Jztcbi8vICAgICAgICAgICAgfSwgJycpO1xuLy9cbi8vICAgICAgICAgICAgaHRtbCArPSAnPGJyLz4nO1xuLy9cbi8vICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKHN0ciwgbW9kZWwpIHtcbi8vICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyBtb2RlbC5hdHRyaWJ1dGVzLm5hbWUgKyAnOiAnICsgbW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG4vLyAgICAgICAgICAgIH0sICcnKTtcbi8vXG4vLyAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwoaHRtbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kLnNob3coKTtcbiAgICAgICAgICAgIC8vc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ3Jlc3BvbnNlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNlVmlldztcbn0pKCk7IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBzb3VuZFBsYXllciA9IHJlcXVpcmUoJy4uL3NvdW5kUGxheWVyJyk7XG4gICAgdmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi4vZGF0YS9hdWRpb0Fzc2V0cy5qc29uJyk7XG5cbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcblxuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG5cbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IFF1ZXN0aW9uVmlldy5leHRlbmQoe1xuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIC8vcGFyZW50IGNvbnN0cnVjdG9yXG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfSxcblxuICAgICAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBRdWVzdGlvblZpZXcucHJvdG90eXBlLm9uUmFkaW9DaGFuZ2UuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICAgICAgdmFyIGNoYXIgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZVBhdGggPSBhdWRpb0Fzc2V0c1tjaGFyXTtcblxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheShmaWxlUGF0aCk7XG5cbiAgICAgICAgICAgIGNoYXJhY3Rlck1vZHVsZS5zZXRDaGFyYWN0ZXIoY2hhcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
