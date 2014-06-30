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

    console.log('window width', $(window).width());
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





_.bindAll.apply(_, [].concat(animationModule, Object.keys(animationModule)));





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

    _.each(allCharacters, function(ch) {
        displayObjectContainer.addChild(ch);
    });
}

function initDusty() {
    var dusty = new Character('Dusty');

    var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
    dustyIdleAnimation.anchor = {x: 0.5, y: 405/983};
    dusty.setIdleState(dustyIdleAnimation);

    dusty.windowScale = 850/1366;
    dusty.windowX = 0.25;
    dusty.windowY = -1;

    return dusty;
}
function initBlade() {
    var blade = new Character('Blade');

    return blade;
}
function initCabbie() {
    var cabbie = new Character('Cabbie');

    return cabbie;
}
function initDipper() {
    var dipper = new Character('Dipper');

    return dipper;
}
function initWindlifter() {
    var windlifter = new Character('Windlifter');

    return windlifter;
}

// =================================================================== //
/* *********************** Animation Functions *********************** */
// =================================================================== //

function animateIn() {
    var animationTime = 1.8;
    var easing = 'Cubic.easeInOut';

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
        paused: true
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




"use strict";

var Character = require('../pixi/character');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //
var background, responseContainer;

// =================================================================== //
/* ************************* Initialization ************************** */
// =================================================================== //
function initialize() {
    background = initializeBackground();

    responseContainer = new PIXI.DisplayObjectContainer();
    responseContainer.visible = false;

    responseContainer.addChild(background);
}

function initializeBackground() {
    var bg = PIXI.Sprite.fromImage("assets/img/response_bg_dusty.jpg");

    bg.anchor = new PIXI.Point(.5, .5);
    bg.windowScale = 1;
    bg.scaleType = 'cover';

    bg.windowX = 0.5;
    bg.windowY = 0.5;

    return bg;
}







var animationModule = {
    initialize: _.once(function(scene) {
        initialize();

        scene.addChild(responseContainer);
    }),
    show: function() {
        responseContainer.visible = true;
    }
};



module.exports = animationModule;
},{"../pixi/character":19}],10:[function(require,module,exports){



var Question = require('../models/question');


var QuestionCollection = Backbone.Collection.extend({
    model: Question
});




module.exports = QuestionCollection;
},{"../models/question":18}],11:[function(require,module,exports){




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
    var cannedQuestions = getRandomCannedQuestions(3, 3);



    allQuestions.add(characterSelect);
    allQuestions.add(personalityQuestions);
    allQuestions.add(cannedQuestions);


    module.exports = allQuestions;
})();

},{"../data/cannedQuestions.json":14,"../data/characterSelect.json":15,"../data/personalityQuestions.json":16,"./QuestionCollection":10}],12:[function(require,module,exports){
module.exports={
	"totalSize": 36550837,
	"assets": {
		"assets/img/150x150.gif": 537,
		"assets/img/blackout.png": 6686,
		"assets/img/button.png": 27047,
		"assets/img/dipper.png": 252254,
		"assets/img/drip.png": 9288,
		"assets/img/dynamite.png": 6493,
		"assets/img/foreground_trees.png": 278624,
		"assets/img/header.png": 179873,
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
},{}],13:[function(require,module,exports){
module.exports={
    "dusty": "assets/audio/dusty.mp3",
    "bladeranger": "assets/audio/blade.mp3",
    "cabbie": "assets/audio/Mustang_2012_Start.mp3",
    "dipper": "assets/audio/dipper.mp3",
    "windlifter": "assets/audio/windlifter.mp3",
    "team": "assets/audio/Yellow_Generic_Start.mp3"
}
},{}],14:[function(require,module,exports){
module.exports={
    "class": "canned",
    "copy": "Now that we know more about you, it's your turn to ask fire ranger some questions",
    "options": [
        {
            "text": "What is your favorite thing about the Piston Peak Attack Team?",
            "value": "favoriteThing"
        },
        {
            "text": "What was your hardest mission?",
            "value": "hardestMission"
        },
        {
            "text": "Who are your best friends on the PPAT?",
            "value": "bestFriends"
        },
        {
            "text": "What is your job at Piston Peak?",
            "value": "job"
        },
        {
            "text": "How do you fight forest fires?",
            "value": "fightFires"
        },
        {
            "text": "How do you prevent forest fires?",
            "value": "youPreventFires"
        },
        {
            "text": "How can I prevent forest fires?",
            "value": "IPreventFires"
        },
        {
            "text": "Fire fire fire forest fire forest?",
            "value": "fireForest"
        },
        {
            "text": "Lorem Ipsum 1?",
            "value": "loremipsum1"
        },
        {
            "text": "Lorem Ipsum 2?",
            "value": "loremipsum2"
        },
        {
            "text": "Lorem Ipsum 3?",
            "value": "loremipsum3"
        },
        {
            "text": "Lorem Ipsum 4?",
            "value": "loremipsum4"
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
            "name": "favorite-disney-movie",
            "class": "favorite-disney-movie",
            "copy": "What is your favorite Disney movie?",
            "options": [
                {
                    "text": "The Lion King",
                    "value": "thelionking"
                },
                {
                    "text": "Phantom of the Megaplex",
                    "value": "phantom"
                },
                {
                    "text": "Game of Thrones",
                    "value": "gameofthrones"
                },
                {
                    "text": "Hercules",
                    "value": "hercules"
                },
                {
                    "text": "Breakin' 2: Electric Boogaloo",
                    "value": "breakin"
                },
                {
                    "text": "Memento",
                    "value": "memento"
                }
            ],
            "required": false
        },
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
            ],
            "required": false
        },
        {
            "name": "question4",
            "class": "question4",
            "copy": "Lorem Ipsum?",
            "options": [
                {
                    "text": "Lorem",
                    "value": "lorem"
                },
                {
                    "text": "Ipsum",
                    "value": "ipsum"
                },
                {
                    "text": "Dolor",
                    "value": "dolor"
                },
                {
                    "text": "Sit",
                    "value": "sit"
                },
                {
                    "text": "Amet",
                    "value": "amet"
                },
                {
                    "text": "Consectetur",
                    "value": "consectetur"
                }
            ],
            "required": false
        },
        {
            "name": "question5",
            "class": "question5",
            "copy": "Lorem Ipsum 2?",
            "options": [
                {
                    "text": "Lorem 2",
                    "value": "lorem2"
                },
                {
                    "text": "Ipsum 2",
                    "value": "ipsum2"
                },
                {
                    "text": "Dolor 2",
                    "value": "dolor2"
                },
                {
                    "text": "Sit 2",
                    "value": "sit2"
                },
                {
                    "text": "Amet 2",
                    "value": "amet2"
                },
                {
                    "text": "Consectetur 2",
                    "value": "consectetur2"
                }
            ],
            "required": false
        }
    ]
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
    var responseModule = require('../animations/response');
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

        responseModule.initialize(this);
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
            responseModule.show();
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
},{"../animations/background":1,"../animations/bladewipe":2,"../animations/characterModule":3,"../animations/dustyDipper":4,"../animations/introVideo":5,"../animations/parachuters":7,"../animations/response":9,"./extend":20,"./scene":23}],23:[function(require,module,exports){



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
},{"./data/audioAssets.json":13}],26:[function(require,module,exports){
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
},{"../data/assets.json":12}],28:[function(require,module,exports){


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
            console.log('init window Events');

            this.$window.on('resize', _.bind(this.repositionPageNav, this));

            if (window.DeviceOrientationEvent) {
                console.log('deviceorientation');

                window.addEventListener("deviceorientation", function(event) {
                    console.log('orientation', event.beta, event.gamma);
                }, true);
            } else if (window.DeviceMotionEvent) {
                console.log('devicemotion');

                window.addEventListener('devicemotion', function(event) {
                    console.log('motion', event.acceleration.x * 2, event.acceleration.y * 2);
                }, true);
            } else {
                console.log('moz orientation');

                window.addEventListener("MozOrientation", function(orientation) {
                    console.log('moz', orientation.x * 50, orientation.y * 50);
                }, true);
            }
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
//                me.$backgrounds.hide();
                me.responseView.show();
                me.scene.showResponse();
            });

            //set canvas to be in front of trees
//            $('#pixi-view').addClass('middle');

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
},{"../collections/allQuestions":11,"../pixi/mainScene":22,"../pixi/scenesManager":24,"./enterNameView":28,"./footerView":29,"./introView":30,"./questionView":32,"./responseView":33,"./selectCharacterView":34}],32:[function(require,module,exports){


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

        this.model.set({value: e.currentTarget.getAttribute('value')});
    }
});


module.exports = QuestionView;
},{"../animations/pageItems":6,"../templates/question.hbs":26}],33:[function(require,module,exports){




(function() {
    "use strict";

    var ResponseView = Backbone.View.extend({
        el: '#response',

        initialize: function() {
            //this.scene = scenesManager.createScene('response', ResponseScene);
        },

        setResponse: function(models) {

            var nameModel = _.first(models);

            var partitionedQuestions = _.partition(_.rest(models), function(model) {
                return model.attributes.class !== 'canned';
            });

            var personalityModels = partitionedQuestions[0];
            var cannedModels = partitionedQuestions[1];




            // TODO: Change to actual generated response
            var html = 'Name: ' + nameModel.attributes.value + '<br/>';

            html += '<br/>';

            html += _.reduce(personalityModels, function(str, model) {
                return str + model.attributes.name + ': ' + model.attributes.value + '<br/>';
            }, '');

            html += '<br/>';

            html += _.reduce(cannedModels, function(str, model) {
                return str + model.attributes.name + ': ' + model.attributes.value + '<br/>';
            }, '');

            this.$el.html(html);
        },

        show: function() {
            this.$el.show();

            //scenesManager.goToScene('response');
        },
        hide: function() {

        }


    });













    module.exports = ResponseView;
})();
},{}],34:[function(require,module,exports){




(function() {
    "use strict";


    var soundPlayer = require('../soundPlayer');
    var audioAssets = require('../data/audioAssets.json');

    var QuestionView = require('./questionView');


    var SelectCharacterView = QuestionView.extend({

        initialize: function(options) {
            //parent constructor
            QuestionView.prototype.initialize.call(this, options);
        },

        onRadioChange: function(e) {
            QuestionView.prototype.onRadioChange.call(this, e);

            var filePath = audioAssets[e.currentTarget.getAttribute('id')];

            soundPlayer.play(filePath);
        }
    });











    module.exports = SelectCharacterView;
})();
},{"../data/audioAssets.json":13,"../soundPlayer":25,"./questionView":32}],35:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyb1ZpZGVvLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3BhZ2VJdGVtcy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wYXJhY2h1dGVycy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9wbGFjZUp1c3RPZmZzY3JlZW4uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvcmVzcG9uc2UuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL1F1ZXN0aW9uQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2F1ZGlvQXNzZXRzLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZmFrZV9kZTA2OTNiNy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvbW9kZWxzL3F1ZXN0aW9uLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2NoYXJhY3Rlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9leHRlbmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvbGliTW9kaWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9tYWluU2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvc2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvc2NlbmVzTWFuYWdlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvc291bmRQbGF5ZXIuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2Fzc2V0TG9hZGluZ1ZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2VudGVyTmFtZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2Zvb3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL2ludHJvVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvbWFpblZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3F1ZXN0aW9uVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcmVzcG9uc2VWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9zZWxlY3RDaGFyYWN0ZXJWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBiYWNrZ3JvdW5kLCBtaWRkbGVncm91bmQsIGZvcmVncm91bmQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBiYWNrZ3JvdW5kID0gaW5pdEJhY2tncm91bmQoKTtcbiAgICBtaWRkbGVncm91bmQgPSBpbml0TWlkZGxlZ3JvdW5kKCk7XG4gICAgZm9yZWdyb3VuZCA9IGluaXRGb3JlZ3JvdW5kKCk7XG5cbiAgICBjb25zb2xlLmxvZygnd2luZG93IHdpZHRoJywgJCh3aW5kb3cpLndpZHRoKCkpO1xufVxuZnVuY3Rpb24gc2V0QXR0cnMoc3ByaXRlKSB7XG4gICAgc3ByaXRlLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KC41LCAxKTtcbiAgICBzcHJpdGUud2luZG93WCA9IDAuNTtcbiAgICBzcHJpdGUud2luZG93WSA9IDE7XG5cbiAgICBzcHJpdGUuc2NhbGVUeXBlID0gJ2NvdmVyJztcbiAgICBzcHJpdGUud2luZG93U2NhbGUgPSAxLjA2O1xufVxuZnVuY3Rpb24gaW5pdEJhY2tncm91bmQoKSB7XG4gICAgdmFyIGJhY2tncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvc2l0ZV9iZy5qcGcnKTtcblxuICAgIHNldEF0dHJzKGJhY2tncm91bmQpO1xuXG4gICAgcmV0dXJuIGJhY2tncm91bmQ7XG59XG5mdW5jdGlvbiBpbml0TWlkZGxlZ3JvdW5kKCkge1xuICAgIHZhciBtaWRkbGVncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvbWlkZ3JvdW5kLnBuZycpO1xuICAgIHNldEF0dHJzKG1pZGRsZWdyb3VuZCk7XG4gICAgcmV0dXJuIG1pZGRsZWdyb3VuZDtcbn1cbmZ1bmN0aW9uIGluaXRGb3JlZ3JvdW5kKCkge1xuICAgIHZhciBmb3JlZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL2ZvcmVncm91bmRfdHJlZXMucG5nJyk7XG4gICAgc2V0QXR0cnMoZm9yZWdyb3VuZCk7XG4gICAgcmV0dXJuIGZvcmVncm91bmQ7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG4gICAgfSksXG4gICAgYWRkQmFja2dyb3VuZFRvU2NlbmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGJhY2tncm91bmQpO1xuICAgIH0sXG4gICAgYWRkUmVzdFRvU2NlbmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKG1pZGRsZWdyb3VuZCk7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGZvcmVncm91bmQpO1xuICAgIH0sXG4gICAgc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHZhciBiYWNrZ3JvdW5kUmF0aW8gPSAwLjc1O1xuICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kUmF0aW8gPSAxLjU7XG4gICAgICAgIHZhciBmb3JlZ3JvdW5kUmF0aW8gPSAzO1xuXG4gICAgICAgIHZhciBiYWNrZ3JvdW5kWCA9IDAuNSAtICh4IC0gMC41KSAqIGJhY2tncm91bmRSYXRpby81MDtcbiAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFggPSAwLjUgLSAoeCAtLjUpICogbWlkZGxlZ3JvdW5kUmF0aW8vNTA7XG4gICAgICAgIHZhciBmb3JlZ3JvdW5kWCA9IDAuNSAtICh4IC0uNSkgKiBmb3JlZ3JvdW5kUmF0aW8vNTA7XG5cbiAgICAgICAgYmFja2dyb3VuZC53aW5kb3dYID0gYmFja2dyb3VuZFg7XG4gICAgICAgIG1pZGRsZWdyb3VuZC53aW5kb3dYID0gbWlkZGxlZ3JvdW5kWDtcbiAgICAgICAgZm9yZWdyb3VuZC53aW5kb3dYID0gZm9yZWdyb3VuZFg7XG4gICAgfVxuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHdpcGVzY3JlZW5WaWRlbywgdmlkZW9UaW1lbGluZTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHdpcGVzY3JlZW5WaWRlbyA9IGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKCk7XG4gICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHdpcGVzY3JlZW5WaWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKCkge1xuICAgIHZhciB0ZXh0dXJlcyA9IFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NicsIDQwMCwgNTU2KTtcblxuICAgIHZhciB3aXBlc2NyZWVuVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAodGV4dHVyZXMpO1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dYID0gMC41O1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dZID0gMC41O1xuICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dTY2FsZSA9IDE7XG4gICAgd2lwZXNjcmVlblZpZGVvLnNjYWxlVHlwZSA9ICdjb3Zlcic7XG5cbiAgICB3aXBlc2NyZWVuVmlkZW8uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xuICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgd2lwZXNjcmVlblZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIHJldHVybiB3aXBlc2NyZWVuVmlkZW87XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmlkZW8uX3R3ZWVuRnJhbWUgPSAwO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgdGltZWxpbmUuYWRkTGFiZWwoJ2NhbGxiYWNrJywgdGltZWxpbmUuZHVyYXRpb24oKSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHZpZGVvLCAwLjIsIHtcbiAgICAgICAgYWxwaGE6IDBcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQod2lwZXNjcmVlblZpZGVvKTtcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIGhpZGVWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gZmFsc2U7XG4gICAgfSxcbiAgICBvblZpZGVvQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUuYWRkKGNhbGxiYWNrLCAnY2FsbGJhY2snKTtcbiAgICB9XG59O1xuXG5cblxuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcblxuXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4uL3BpeGkvY2hhcmFjdGVyJyk7XG52YXIgcGxhY2VKdXN0T2Zmc2NyZWVuID0gcmVxdWlyZSgnLi9wbGFjZUp1c3RPZmZzY3JlZW4nKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqIEhlbHBlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMCcsIDAsIDEyKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGNoYXIsIGFsbENoYXJhY3RlcnMsIGRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgYWxsQ2hhcmFjdGVycyA9IHtcbiAgICAgICAgZHVzdHk6IGluaXREdXN0eSgpLFxuICAgICAgICBibGFkZXJhbmdlcjogaW5pdEJsYWRlKCksXG4gICAgICAgIGNhYmJpZTogaW5pdENhYmJpZSgpLFxuICAgICAgICBkaXBwZXI6IGluaXREaXBwZXIoKSxcbiAgICAgICAgd2luZGxpZnRlcjogaW5pdFdpbmRsaWZ0ZXIoKVxuICAgIH07XG5cbiAgICBjaGFyID0gYWxsQ2hhcmFjdGVycy5kdXN0eTtcblxuICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgICBfLmVhY2goYWxsQ2hhcmFjdGVycywgZnVuY3Rpb24oY2gpIHtcbiAgICAgICAgZGlzcGxheU9iamVjdENvbnRhaW5lci5hZGRDaGlsZChjaCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXREdXN0eSgpIHtcbiAgICB2YXIgZHVzdHkgPSBuZXcgQ2hhcmFjdGVyKCdEdXN0eScpO1xuXG4gICAgdmFyIGR1c3R5SWRsZUFuaW1hdGlvbiA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXREdXN0eUlkbGVUZXh0dXJlcygpKTtcbiAgICBkdXN0eUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDAuNSwgeTogNDA1Lzk4M307XG4gICAgZHVzdHkuc2V0SWRsZVN0YXRlKGR1c3R5SWRsZUFuaW1hdGlvbik7XG5cbiAgICBkdXN0eS53aW5kb3dTY2FsZSA9IDg1MC8xMzY2O1xuICAgIGR1c3R5LndpbmRvd1ggPSAwLjI1O1xuICAgIGR1c3R5LndpbmRvd1kgPSAtMTtcblxuICAgIHJldHVybiBkdXN0eTtcbn1cbmZ1bmN0aW9uIGluaXRCbGFkZSgpIHtcbiAgICB2YXIgYmxhZGUgPSBuZXcgQ2hhcmFjdGVyKCdCbGFkZScpO1xuXG4gICAgcmV0dXJuIGJsYWRlO1xufVxuZnVuY3Rpb24gaW5pdENhYmJpZSgpIHtcbiAgICB2YXIgY2FiYmllID0gbmV3IENoYXJhY3RlcignQ2FiYmllJyk7XG5cbiAgICByZXR1cm4gY2FiYmllO1xufVxuZnVuY3Rpb24gaW5pdERpcHBlcigpIHtcbiAgICB2YXIgZGlwcGVyID0gbmV3IENoYXJhY3RlcignRGlwcGVyJyk7XG5cbiAgICByZXR1cm4gZGlwcGVyO1xufVxuZnVuY3Rpb24gaW5pdFdpbmRsaWZ0ZXIoKSB7XG4gICAgdmFyIHdpbmRsaWZ0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdXaW5kbGlmdGVyJyk7XG5cbiAgICByZXR1cm4gd2luZGxpZnRlcjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBhbmltYXRlSW4oKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjg7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGNoYXIpO1xuICAgIGNoYXIud2luZG93WCA9IDAuNjtcblxuICAgIHJldHVybiBUd2VlbkxpdGUudG8oY2hhciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAwLjMsXG4gICAgICAgIHdpbmRvd1g6IDAuMjUsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pO1xufVxuXG52YXIgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuZnVuY3Rpb24gYW5pbWF0ZU91dCgpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuODtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4yNSxcbiAgICAgICAgd2luZG93WDogLTAuNCxcbiAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICBvbkNvbXBsZXRlOiBvbkFuaW1hdGlvbk91dENhbGxiYWNrXG4gICAgfSk7XG59XG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZGlzcGxheU9iamVjdENvbnRhaW5lcik7XG4gICAgfSksXG4gICAgYW5pbWF0ZUluOiBhbmltYXRlSW4sXG4gICAgYW5pbWF0ZU91dDogYW5pbWF0ZU91dCxcbiAgICBvbkFuaW1hdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBvbkFuaW1hdGlvbk91dENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcbiAgICBzZXRDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICBjaGFyID0gYWxsQ2hhcmFjdGVyc1tjaGFyYWN0ZXJdO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBkdXN0eSwgZGlwcGVyLCB0aW1lbGluZUluLCB0aW1lbGluZU91dDtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZXREdXN0eUlkbGVUZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwJywgMCwgMTIpO1xufVxuZnVuY3Rpb24gZ2V0RGlwcGVySWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwJywgMCwgMTIpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGR1c3R5ID0gaW5pdGlhbGl6ZUR1c3R5KCk7XG4gICAgZGlwcGVyID0gaW5pdGlhbGl6ZURpcHBlcigpO1xuXG4gICAgdGltZWxpbmVJbiA9IGdlbmVyYXRlQW5pbWF0aW9uSW5UaW1lbGluZSgpO1xuICAgIHRpbWVsaW5lT3V0ID0gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplRHVzdHkoKSB7XG4gICAgdmFyIGR1c3R5ID0gbmV3IENoYXJhY3RlcignRHVzdHknKTtcblxuICAgIHZhciBkdXN0eUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSk7XG5cbiAgICBkdXN0eUlkbGVBbmltYXRpb24uYW5jaG9yID0ge3g6IDY1MC8xMjAwLCB5OiAzNDAvNjM4fTtcblxuICAgIGR1c3R5LnNldElkbGVTdGF0ZShkdXN0eUlkbGVBbmltYXRpb24pO1xuXG4gICAgZHVzdHkud2luZG93U2NhbGUgPSA5MDAvMTM2NjtcbiAgICBkdXN0eS53aW5kb3dYID0gMC4xNTtcbiAgICBkdXN0eS53aW5kb3dZID0gLTE7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuXG4gICAgZHVzdHkuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcblxuICAgIHJldHVybiBkdXN0eTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZURpcHBlcigpIHtcbiAgICB2YXIgZGlwcGVyID0gbmV3IENoYXJhY3RlcignRGlwcGVyJyk7XG5cbiAgICB2YXIgZGlwcGVySWRsZVN0YXRlID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldERpcHBlcklkbGVUZXh0dXJlcygpKTtcblxuICAgIGRpcHBlcklkbGVTdGF0ZS5zY2FsZS54ID0gLTE7XG4gICAgZGlwcGVySWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogNTcxLzEyMDAsXG4gICAgICAgIHk6IDQxMC82MzhcbiAgICB9O1xuXG4gICAgZGlwcGVyLnNldElkbGVTdGF0ZShkaXBwZXJJZGxlU3RhdGUpO1xuXG4gICAgZGlwcGVyLndpbmRvd1ggPSAwLjc1O1xuICAgIGRpcHBlci53aW5kb3dZID0gLTE7XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuNDA7XG5cbiAgICBkaXBwZXIud2luZG93U2NhbGUgPSA4NjUvMTM2NjtcbiAgICBkaXBwZXIuYW5pbWF0aW9uU2NhbGVYID0gMC43O1xuICAgIGRpcHBlci5hbmltYXRpb25TY2FsZVkgPSAwLjc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICBibHVyRmlsdGVyLmJsdXIgPSAxMDtcblxuICAgIGRpcHBlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgSW4gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgdGltZWxpbmVEdXN0eUluID0gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpO1xuXG4gICAgdGltZWxpbmUuYWRkKHRpbWVsaW5lRHVzdHlJbi5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkucGxheSgpLCB0aW1lbGluZUR1c3R5SW4uZHVyYXRpb24oKSk7XG5cbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikucGxheSgpLCAwLjQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBvZ0F0dHJpYnV0ZXMgPSBfLnBpY2soZHVzdHksICd3aW5kb3dYJywgJ3dpbmRvd1NjYWxlJyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGR1c3R5LCBvZ0F0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuNTIsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxO1xuICAgIHZhciBlYXNpbmcgPSAnUXVhZC5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICByZXBlYXQ6IC0xXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAtMTUsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjA7XG4gICAgdmFyIHN3ZWVwU3RhcnRUaW1lID0gYW5pbWF0aW9uVGltZSAqIDAuMTE7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIG9nQXR0cmlidXRlcyA9IF8ucGljayhkaXBwZXIsICd3aW5kb3dYJywgJ3JvdGF0aW9uJywgJ3dpbmRvd1NjYWxlJywgJ2FuaW1hdGlvblNjYWxlWCcsICdhbmltYXRpb25TY2FsZVknKTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgICAgICBfLmV4dGVuZChkaXBwZXIsIG9nQXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMzMsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksIDApO1xuXG4gICAgLy9zd2VlcCByaWdodFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IDAuODYsXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgc3dlZXBTdGFydFRpbWUpO1xuXG4gICAgLy8gc2NhbGUgdXBcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMSxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYmx1cjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgT3V0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmVPdXQgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgICAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKS5wbGF5KCksIDApO1xuICAgICAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkucGxheSgpLCAwKTtcblxuICAgcmV0dXJuIHRpbWVsaW5lT3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuNCxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjQsXG4gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgIHdpbmRvd1g6IDEuMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZS8yLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjQ7XG4gICAgdmFyIGVhc2luZyA9ICdDaXJjLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGR1c3R5LmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLjMsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS4zLFxuICAgICAgICB3aW5kb3dZOiAtMC4zLFxuICAgICAgICB3aW5kb3dYOiAwLjYsXG4gICAgICAgIHJvdGF0aW9uOiAtMC4yXG4gICAgfSksIDApO1xuXG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzUsIHtcbiAgICAgICAgYmx1cjogMTAsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuLy8gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS4yLFxuLy8gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS4yLFxuLy8gICAgICAgIHdpbmRvd1k6IDAuMjQsXG4vLyAgICAgICAgd2luZG93WDogLTAuMyxcbi8vICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgIH0pKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZGlwcGVyKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZHVzdHkpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVsaW5lSW4ucGxheSgwKTtcbiAgICB9LFxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZU91dC5wbGF5KDApO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25JbkNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aW1lbGluZUluLnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGltZWxpbmVPdXQudmFycy5vbkNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuZnVuY3Rpb24gZ2V0SW50cm9UZXh0dXJlcygpIHtcbiAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwJywgMCwgMTIyKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIHZpZGVvLCB2aWRlb1RpbWVsaW5lO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgdmlkZW8gPSBpbml0aWFsaXplVmlkZW8oKTtcbiAgICB2aWRlb1RpbWVsaW5lID0gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW8oc2NlbmUpIHtcbiAgICB2YXIgaW50cm9WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRJbnRyb1RleHR1cmVzKCkpO1xuXG4gICAgaW50cm9WaWRlby53aW5kb3dYID0gMC41O1xuICAgIGludHJvVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcblxuICAgIGludHJvVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIGludHJvVmlkZW8ubG9vcCA9IGZhbHNlO1xuXG4gICAgaW50cm9WaWRlby5zY2FsZU1pbiA9IDE7XG4gICAgaW50cm9WaWRlby5zY2FsZU1heCA9IDI7XG4gICAgaW50cm9WaWRlby53aW5kb3dTY2FsZSA9IDAuNjtcblxuICAgIHJldHVybiBpbnRyb1ZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuXG4gICAgdmlkZW8uX3R3ZWVuRnJhbWUgPSAwO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbdmFsdWUgfCAwXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBnZXRWaWRlb0FuaW1hdGlvblRpbWVsaW5lKHZpZGVvKSB7XG4gICAgdmFyIGZwcyA9IDI0O1xuICAgIHZhciBudW1GcmFtZXMgPSB2aWRlby50ZXh0dXJlcy5sZW5ndGg7XG5cbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgdmFyIGVhc2luZyA9IG5ldyBTdGVwcGVkRWFzZShudW1GcmFtZXMpO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTGl0ZSh7XG4gICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2aWRlby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZpZGVvLnR3ZWVuRnJhbWUgPSAwO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHZpZGVvLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHZpZGVvKTtcbiAgICB9LFxuICAgIGdldFZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvO1xuICAgIH0sXG4gICAgcGxheVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS5wbGF5KDApO1xuICAgIH0sXG4gICAgb25Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmlkZW9UaW1lbGluZS52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbn07XG5cblxuXy5iaW5kQWxsLmFwcGx5KF8sIFtdLmNvbmNhdChhbmltYXRpb25Nb2R1bGUsIE9iamVjdC5rZXlzKGFuaW1hdGlvbk1vZHVsZSkpKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG52YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcblxuXG5cbnZhciBwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzID0gW1xuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBmYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0Um90YXRlKV0sXG4gICAgW18uYmluZChzdGFnZ2VySXRlbXMsIGZhZGVJbkZyb21SaWdodCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVRvcCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXRSb3RhdGUpXSxcbiAgICBbXy5iaW5kKHN0YWdnZXJJdGVtcywgYm91bmNlRmFkZUluRnJvbVRvcCksIF8uYmluZChzdGFnZ2VySXRlbXMsIHNuYXBPdXQpXVxuXTtcblxudmFyIGNhbm5lZEFuaW1hdGlvblBhaXJzID0gW1xuICAgIFtfLmJpbmQoc3RhZ2dlckl0ZW1zLCBib3VuY2VGYWRlSW5Gcm9tUmlnaHQpLCBfLmJpbmQoc3RhZ2dlckl0ZW1zLCBzbmFwT3V0KV1cbl07XG5cblxuXG5mdW5jdGlvbiBzdGFnZ2VySXRlbXMoJGl0ZW1zKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICB0d2VlbnM6IF8ubWFwKCRpdGVtcywgdGhpcyksXG4gICAgICAgIHN0YWdnZXI6IDAuMDdcbiAgICB9KTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKiogSW5kaXZpZHVhbCBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBmYWRlSW4oJGl0ZW0sIHByb3AsIGRpc3RhbmNlLCBlYXNpbmcpIHtcbiAgICB2YXIgZnJvbSA9IHtvcGFjaXR5OiAwfTtcbiAgICBmcm9tW3Byb3BdID0gZGlzdGFuY2U7XG5cbiAgICB2YXIgdG8gPSB7b3BhY2l0eTogMSwgZWFzZTogZWFzaW5nfTtcbiAgICB0b1twcm9wXSA9IDA7XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLmZyb21UbygkaXRlbSwgYW5pbWF0aW9uVGltZSwgZnJvbSwgdG8pO1xufVxuZnVuY3Rpb24gZmFkZUluTm9Nb3ZlbWVudCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgMCwgZWFzaW5nKTtcbn1cbmZ1bmN0aW9uIGZhZGVJbkZyb21SaWdodCgkaXRlbSkge1xuICAgIHJldHVybiBmYWRlSW4oJGl0ZW0sICd4JywgNzUsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBmYWRlSW5Gcm9tVG9wKCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3knLCAtNzUsIGVhc2luZyk7XG59XG5mdW5jdGlvbiBib3VuY2VGYWRlSW5Gcm9tUmlnaHQoJGl0ZW0pIHtcbiAgICByZXR1cm4gZmFkZUluKCRpdGVtLCAneCcsIDc1LCAnQmFjay5lYXNlT3V0Jyk7XG59XG5mdW5jdGlvbiBib3VuY2VGYWRlSW5Gcm9tVG9wKCRpdGVtKSB7XG4gICAgcmV0dXJuIGZhZGVJbigkaXRlbSwgJ3knLCAtNzUsICdCYWNrLmVhc2VPdXQnKTtcbn1cbmZ1bmN0aW9uIHJvdGF0ZUluTGVmdCgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUuZnJvbVRvKCRpdGVtLCBhbmltYXRpb25UaW1lLCB7cm90YXRpb25ZOiAtOTAsIHRyYW5zZm9ybU9yaWdpbjpcImxlZnQgNTAlIC0xMDBcIn0sIHtyb3RhdGlvblk6IDB9KTtcbn1cblxuZnVuY3Rpb24gc25hcE91dCgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAwLCBzY2FsZTogMC40LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlIDBcIiwgZWFzZTogJ0JhY2suZWFzZUluJ30pO1xufVxuZnVuY3Rpb24gc25hcE91dFJvdGF0ZSgkaXRlbSkge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oJGl0ZW0sIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAwLCBzY2FsZTogMC40LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlIDBcIiwgcm90YXRpb246IC00NSwgZWFzZTogJ0JhY2suZWFzZUluJ30pO1xufVxuXG5cblxuXG5cblxuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgZ2V0UmFuZG9tUGVyc29uYWxpdHlBbmltYXRpb25zOiBmdW5jdGlvbigkaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBfLnJhbmRvbShwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChwZXJzb25hbGl0eUFuaW1hdGlvblBhaXJzW2ldLCBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICAgIHJldHVybiBmbmMoJGl0ZW1zKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRSYW5kb21DYW5uZWRBbmltYXRpb25zOiBmdW5jdGlvbigkaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBfLnJhbmRvbShjYW5uZWRBbmltYXRpb25QYWlycy5sZW5ndGggLSAxKTtcblxuICAgICAgICByZXR1cm4gXy5tYXAoY2FubmVkQW5pbWF0aW9uUGFpcnNbaV0sIGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgICAgcmV0dXJuIGZuYygkaXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBwYXJhY2h1dGVycywgcGFyYWNodXRlcnNDb250YWluZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgcGFyYWNodXRlcnMgPSBfLnNodWZmbGUoW2dldEJsYWNrb3V0KCksIGdldERyaXAoKSwgZ2V0RHluYW1pdGUoKV0pO1xuXG4gICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSAwO1xuXG4gICAgICAgIHBhcmFjaHV0ZXIuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dYID0gMC41O1xuICAgICAgICBwYXJhY2h1dGVyLndpbmRvd1kgPSAtMTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEJsYWNrb3V0KCkge1xuICAgIHZhciBibGFja291dElkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvYmxhY2tvdXQucG5nXCIpO1xuICAgIGJsYWNrb3V0SWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjYvNjEsXG4gICAgICAgIHk6IDMzLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdCbGFja291dCcsIGJsYWNrb3V0SWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldERyaXAoKSB7XG4gICAgdmFyIGRyaXBJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2RyaXAucG5nXCIpO1xuICAgIGRyaXBJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAzNi82MSxcbiAgICAgICAgeTogMjYvOTRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBDaGFyYWN0ZXIoJ0RyaXAnLCBkcmlwSWRsZVN0YXRlKTtcbn1cbmZ1bmN0aW9uIGdldER5bmFtaXRlKCkge1xuICAgIHZhciBkeW5hbWl0ZUlkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCIpO1xuICAgIGR5bmFtaXRlSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMjcvNjEsXG4gICAgICAgIHk6IDMwLzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEeW5hbWl0ZScsIGR5bmFtaXRlSWRsZVN0YXRlKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAzNTtcblxuICAgIHZhciBkZXB0aCA9IE1hdGgucmFuZG9tKCkgKiA1O1xuICAgIHZhciB4ID0gMC4xICsgKE1hdGgucmFuZG9tKCkgKiAwLjgpO1xuICAgIHZhciBzY2FsZSA9IDEgLSBkZXB0aCAqIDAuMi81O1xuXG4gICAgcGxhY2VKdXN0T2Zmc2NyZWVuKHBhcmFjaHV0ZXIpO1xuICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IHg7XG5cbiAgICB2YXIgcm90YXRpb24gPSAwLjM7XG5cbiAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB3aW5kb3dZOiAxLFxuICAgICAgICBlYXNlOiAnU2luZS5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyLnZpc2liaWxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBhcmFjaHV0ZXIuc2NhbGUgPSB7eDogc2NhbGUsIHk6IHNjYWxlfTtcbiAgICBwYXJhY2h1dGVyLmZpbHRlcnNbMF0uYmx1ciA9IGRlcHRoICogMy81O1xuICAgIHBhcmFjaHV0ZXIucm90YXRpb24gPSByb3RhdGlvbjtcblxuICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKTtcbn1cbmZ1bmN0aW9uIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uKSB7XG4gICAgdmFyIHN3YXlUaW1lID0gMS4yO1xuICAgIHZhciBkZWMgPSAwLjAzO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiAtcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgfSk7XG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIHN3YXlUaW1lLCB7XG4gICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgZWFzZTogJ0N1YmljLmVhc2VJbk91dCcsXG4gICAgICAgIGRlbGF5OiBzd2F5VGltZSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihyb3RhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbiAtIGRlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgcGFyYWNodXRlcnNDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgXy5lYWNoKHBhcmFjaHV0ZXJzLCBfLmJpbmQocGFyYWNodXRlcnNDb250YWluZXIuYWRkQ2hpbGQsIHBhcmFjaHV0ZXJzQ29udGFpbmVyKSk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQocGFyYWNodXRlcnNDb250YWluZXIpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVOZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYocGFyYWNodXRlcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGFuaW1hdGVQYXJhY2h1dGVyKHBhcmFjaHV0ZXJzLnNoaWZ0KCkpO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhcmFjaHV0ZXJzQ29udGFpbmVyLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgdmFyIGhlaWdodCA9IGNoYXJhY3Rlci5zY2FsZS55ICogY2hhcmFjdGVyLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0O1xuXG4gICAgY2hhcmFjdGVyLndpbmRvd1kgPSAtKGhlaWdodC8yKS8kKHdpbmRvdykuaGVpZ2h0KCk7XG59OyIsIlxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYmFja2dyb3VuZCwgcmVzcG9uc2VDb250YWluZXI7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgYmFja2dyb3VuZCA9IGluaXRpYWxpemVCYWNrZ3JvdW5kKCk7XG5cbiAgICByZXNwb25zZUNvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICByZXNwb25zZUNvbnRhaW5lci52aXNpYmxlID0gZmFsc2U7XG5cbiAgICByZXNwb25zZUNvbnRhaW5lci5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJhY2tncm91bmQoKSB7XG4gICAgdmFyIGJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kdXN0eS5qcGdcIik7XG5cbiAgICBiZy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgLjUpO1xuICAgIGJnLndpbmRvd1NjYWxlID0gMTtcbiAgICBiZy5zY2FsZVR5cGUgPSAnY292ZXInO1xuXG4gICAgYmcud2luZG93WCA9IDAuNTtcbiAgICBiZy53aW5kb3dZID0gMC41O1xuXG4gICAgcmV0dXJuIGJnO1xufVxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBpbml0aWFsaXplKCk7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQocmVzcG9uc2VDb250YWluZXIpO1xuICAgIH0pLFxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNwb25zZUNvbnRhaW5lci52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblxudmFyIFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3F1ZXN0aW9uJyk7XG5cblxudmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogUXVlc3Rpb25cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uQ29sbGVjdGlvbjsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1F1ZXN0aW9uQ29sbGVjdGlvbicpO1xuXG4gICAgdmFyIGNoYXJhY3RlclNlbGVjdCA9IHJlcXVpcmUoJy4uL2RhdGEvY2hhcmFjdGVyU2VsZWN0Lmpzb24nKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9jYW5uZWRRdWVzdGlvbnMuanNvbicpO1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvcGVyc29uYWxpdHlRdWVzdGlvbnMuanNvbicpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tUGVyc29uYWxpdHlRdWVzdGlvbnMobnVtKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KF8uc2h1ZmZsZShwZXJzb25hbGl0eVF1ZXN0aW9uRGF0YS5xdWVzdGlvbnMpLCBudW0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbUNhbm5lZFF1ZXN0aW9ucyhudW1Jbkdyb3VwLCBudW0pIHtcbiAgICAgICAgdmFyIGNhbm5lZE9wdGlvbnMgPSBfLnNodWZmbGUoY2FubmVkUXVlc3Rpb25EYXRhLm9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBjYW5uZWRRdWVzdGlvbnMgPSBfLm1hcChfLnJhbmdlKG51bSksIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gXy5maXJzdChfLnJlc3QoY2FubmVkT3B0aW9ucywgaSAqIG51bUluR3JvdXApLCBudW1Jbkdyb3VwKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjbGFzczogY2FubmVkUXVlc3Rpb25EYXRhLmNsYXNzLFxuICAgICAgICAgICAgICAgIGNvcHk6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jb3B5LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdjYW5uZWQtcXVlc3Rpb24nICsgaSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjYW5uZWRRdWVzdGlvbnM7XG4gICAgfVxuXG5cblxuXG5cblxuICAgIHZhciBhbGxRdWVzdGlvbnMgPSBuZXcgUXVlc3Rpb25Db2xsZWN0aW9uKCk7XG5cblxuICAgIC8vc2h1ZmZsZSBxdWVzdGlvbnMgYW5kIHBpY2sgM1xuICAgIHZhciBwZXJzb25hbGl0eVF1ZXN0aW9ucyA9IGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKDMpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbnMgPSBnZXRSYW5kb21DYW5uZWRRdWVzdGlvbnMoMywgMyk7XG5cblxuXG4gICAgYWxsUXVlc3Rpb25zLmFkZChjaGFyYWN0ZXJTZWxlY3QpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQocGVyc29uYWxpdHlRdWVzdGlvbnMpO1xuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2FubmVkUXVlc3Rpb25zKTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhbGxRdWVzdGlvbnM7XG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInRvdGFsU2l6ZVwiOiAzNjU1MDgzNyxcblx0XCJhc3NldHNcIjoge1xuXHRcdFwiYXNzZXRzL2ltZy8xNTB4MTUwLmdpZlwiOiA1MzcsXG5cdFx0XCJhc3NldHMvaW1nL2JsYWNrb3V0LnBuZ1wiOiA2Njg2LFxuXHRcdFwiYXNzZXRzL2ltZy9idXR0b24ucG5nXCI6IDI3MDQ3LFxuXHRcdFwiYXNzZXRzL2ltZy9kaXBwZXIucG5nXCI6IDI1MjI1NCxcblx0XHRcImFzc2V0cy9pbWcvZHJpcC5wbmdcIjogOTI4OCxcblx0XHRcImFzc2V0cy9pbWcvZHluYW1pdGUucG5nXCI6IDY0OTMsXG5cdFx0XCJhc3NldHMvaW1nL2ZvcmVncm91bmRfdHJlZXMucG5nXCI6IDI3ODYyNCxcblx0XHRcImFzc2V0cy9pbWcvaGVhZGVyLnBuZ1wiOiAxNzk4NzMsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2JsYWRlX3Jhbmdlci5wbmdcIjogODM1NzAsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2NhYmJpZS5wbmdcIjogNzgyMTUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL2Nhbm5lZC1idG4ucG5nXCI6IDUyNjY2LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9kaXBwZXIucG5nXCI6IDkzNTk4LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9kdXN0eS5wbmdcIjogOTc3MzQsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3ByaW50ZXIucG5nXCI6IDE1NTAsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3NlbmQtYnRuLnBuZ1wiOiAzMDcxNSxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdGhlX3RlYW0ucG5nXCI6IDc0MzI2LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy92b2x1bWUucG5nXCI6IDMyMjAsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3dpbmRsaWZ0ZXIucG5nXCI6IDEwNTMyMyxcblx0XHRcImFzc2V0cy9pbWcvaW4tdGhlYXRlcnMucG5nXCI6IDQxMzAsXG5cdFx0XCJhc3NldHMvaW1nL2ludHJvLWJ0bS5wbmdcIjogMTc5MDYxLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby10b3AucG5nXCI6IDE3NjU1MSxcblx0XHRcImFzc2V0cy9pbWcvbG9nby5wbmdcIjogMjc2NzUsXG5cdFx0XCJhc3NldHMvaW1nL21pZGdyb3VuZC5wbmdcIjogMjAzNDIwLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9iZ19kdXN0eS5qcGdcIjogMTk3NjQyLFxuXHRcdFwiYXNzZXRzL2ltZy9yZXNwb25zZV9sZXR0ZXJfYmcuanBnXCI6IDc1NzEzLFxuXHRcdFwiYXNzZXRzL2ltZy9zaXRlX2JnLmpwZ1wiOiAxODQwNTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAyLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDMucG5nXCI6IDU1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNC5wbmdcIjogMTAwNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNS5wbmdcIjogMTM4NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNi5wbmdcIjogOTI5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA3LnBuZ1wiOiAxMTU3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA4LnBuZ1wiOiAxNDA4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA5LnBuZ1wiOiAxNTQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEwLnBuZ1wiOiAxNjM5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDExLnBuZ1wiOiAxOTA4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEyLnBuZ1wiOiAxOTg2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEzLnBuZ1wiOiAyMDIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE0LnBuZ1wiOiAyMDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE1LnBuZ1wiOiAyMTIxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE2LnBuZ1wiOiAyMjY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE3LnBuZ1wiOiAyNDUwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE4LnBuZ1wiOiAyNTY4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE5LnBuZ1wiOiAyNzI3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIwLnBuZ1wiOiAyODg4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIxLnBuZ1wiOiAzMDQ1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIyLnBuZ1wiOiAzMTgwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIzLnBuZ1wiOiAzMzI1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI0LnBuZ1wiOiAzNDg3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI1LnBuZ1wiOiAzNjAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI2LnBuZ1wiOiAzNzEyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI3LnBuZ1wiOiAzODIyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI4LnBuZ1wiOiAzOTI0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI5LnBuZ1wiOiAzOTk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMwLnBuZ1wiOiA0MDM1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMxLnBuZ1wiOiA0MDkxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMyLnBuZ1wiOiA0MTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMzLnBuZ1wiOiA0MTYyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM0LnBuZ1wiOiA0MjE3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM1LnBuZ1wiOiA0MTA4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM2LnBuZ1wiOiA0MTY3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM3LnBuZ1wiOiA0MjM2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM4LnBuZ1wiOiA0MjYzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM5LnBuZ1wiOiA0MzcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQwLnBuZ1wiOiA0NDM4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQxLnBuZ1wiOiA0NDk4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQyLnBuZ1wiOiA0NTM0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQzLnBuZ1wiOiA0NjM1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ0LnBuZ1wiOiA0NjQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ1LnBuZ1wiOiA0NzQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ2LnBuZ1wiOiA0NzgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ3LnBuZ1wiOiA0ODMyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ4LnBuZ1wiOiA0OTg2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ5LnBuZ1wiOiA0OTgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUwLnBuZ1wiOiA1MDQwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUxLnBuZ1wiOiA1MTMzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUyLnBuZ1wiOiA1MjAzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUzLnBuZ1wiOiA1MzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU0LnBuZ1wiOiA4Mjg2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU1LnBuZ1wiOiA4MDczLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU2LnBuZ1wiOiAxMzc5Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Ny5wbmdcIjogMjMxNzQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTgucG5nXCI6IDMwODUwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU5LnBuZ1wiOiAzNjEzMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2MC5wbmdcIjogMzgwOTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjEucG5nXCI6IDMzNDQ1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDYyLnBuZ1wiOiAyOTU3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2My5wbmdcIjogMzAzNzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjQucG5nXCI6IDI5NzA1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY1LnBuZ1wiOiAyOTg1NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2Ni5wbmdcIjogMjk3MDAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjcucG5nXCI6IDMwMjU0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY4LnBuZ1wiOiAyOTU1Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2OS5wbmdcIjogMjk2NjEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzAucG5nXCI6IDI5NzIwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDcxLnBuZ1wiOiAyOTgxNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3Mi5wbmdcIjogMjk4MTAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzMucG5nXCI6IDI5NzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc0LnBuZ1wiOiAyOTUwOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3NS5wbmdcIjogMjk3NjksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzYucG5nXCI6IDI5NjQxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc3LnBuZ1wiOiAyOTQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3OC5wbmdcIjogMjczOTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzkucG5nXCI6IDM3NjAyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgwLnBuZ1wiOiA1MDEzMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4MS5wbmdcIjogNTY0NjQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODIucG5nXCI6IDU2NDQ5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgzLnBuZ1wiOiA2MzEyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4NC5wbmdcIjogNTYzNDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODUucG5nXCI6IDMxNTg1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg2LnBuZ1wiOiAzNjE4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4Ny5wbmdcIjogMjQ3OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODgucG5nXCI6IDIzODY1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg5LnBuZ1wiOiAyNzkzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5MC5wbmdcIjogMzIwOTksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTEucG5nXCI6IDM2OTQ4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDkyLnBuZ1wiOiA0MTE4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5My5wbmdcIjogNDQ0MjMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTQucG5nXCI6IDQ4NDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk1LnBuZ1wiOiAzNTg3OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5Ni5wbmdcIjogMjgxMTUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTcucG5nXCI6IDI0NzIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk4LnBuZ1wiOiAyMjI1MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5OS5wbmdcIjogMjA2MzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDAucG5nXCI6IDIxMDEwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAxLnBuZ1wiOiAxNjM3MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwMi5wbmdcIjogMTgxOTMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDMucG5nXCI6IDE5ODkzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA0LnBuZ1wiOiAyMjQ3MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNS5wbmdcIjogMjQ1OTYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDYucG5nXCI6IDI1NTM0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA3LnBuZ1wiOiAyNzExOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwOC5wbmdcIjogMjYxMDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDkucG5nXCI6IDI5MTMxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEwLnBuZ1wiOiAzMzU1OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMS5wbmdcIjogMzY0NzYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTIucG5nXCI6IDQxMDE1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEzLnBuZ1wiOiA0NDY4OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNC5wbmdcIjogNDU5NjQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTUucG5nXCI6IDQ0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE2LnBuZ1wiOiA0NjQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNy5wbmdcIjogNjk3ODMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTgucG5nXCI6IDI2NTg3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE5LnBuZ1wiOiAzMDk1Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEyMC5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTIxLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDAucG5nXCI6IDY0MDcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAxLnBuZ1wiOiA2Mjk4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMi5wbmdcIjogNjU3NzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDMucG5nXCI6IDY2NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA0LnBuZ1wiOiA2NDA3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNS5wbmdcIjogNjI5ODMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDYucG5nXCI6IDY1NzczLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA3LnBuZ1wiOiA2NjY0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwOC5wbmdcIjogNjQwNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDkucG5nXCI6IDYyOTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDEwLnBuZ1wiOiA2NTc3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMS5wbmdcIjogNjY2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMC5wbmdcIjogMTI2NjIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDEucG5nXCI6IDEyNDI1Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDAyLnBuZ1wiOiAxMjQzMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMy5wbmdcIjogMTI2MDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDQucG5nXCI6IDEyNjYyMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA1LnBuZ1wiOiAxMjQyNTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwNi5wbmdcIjogMTI0MzAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDcucG5nXCI6IDEyNjAwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA4LnBuZ1wiOiAxMjY2MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwOS5wbmdcIjogMTI0MjUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMTAucG5nXCI6IDEyNDMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDExLnBuZ1wiOiAxMjYwMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMC5wbmdcIjogNTgxNjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMS5wbmdcIjogNTgwMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMi5wbmdcIjogNTc2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwMy5wbmdcIjogNTgxMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNC5wbmdcIjogNTgxNjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNS5wbmdcIjogNTgwMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNi5wbmdcIjogNTc2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwNy5wbmdcIjogNTgxMzEsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwOC5wbmdcIjogNTgxNjYsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAwOS5wbmdcIjogNTgwMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAxMC5wbmdcIjogNTc2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L3R3by9EdXN0eV9wbGFuZV9saWdodF8wMDAxMS5wbmdcIjogNTgxMzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDAucG5nXCI6IDIzMjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDEucG5nXCI6IDMyMDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDIucG5nXCI6IDEzOTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDMucG5nXCI6IDE1MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDQucG5nXCI6IDI3MjcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDUucG5nXCI6IDMxNDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDYucG5nXCI6IDM3NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDcucG5nXCI6IDQ0MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDgucG5nXCI6IDYwMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDkucG5nXCI6IDk0MTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTAucG5nXCI6IDExMTg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDExLnBuZ1wiOiAxNDM1Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMi5wbmdcIjogMTYzMjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTMucG5nXCI6IDE5NzI5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE0LnBuZ1wiOiAyMjA0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNS5wbmdcIjogMjUxMTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTYucG5nXCI6IDI2NTUxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE3LnBuZ1wiOiAyOTAxOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxOC5wbmdcIjogMzAyMDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTkucG5nXCI6IDMxMzAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIwLnBuZ1wiOiAzMTcxNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMS5wbmdcIjogMzIxMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjIucG5nXCI6IDMyODk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIzLnBuZ1wiOiAzMzIxMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNC5wbmdcIjogMzM3NDQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjUucG5nXCI6IDMzNjE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI2LnBuZ1wiOiAzMzQxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNy5wbmdcIjogMzM1OTAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjgucG5nXCI6IDMzNTE0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI5LnBuZ1wiOiAzMjU4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMC5wbmdcIjogMzIzMzUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzEucG5nXCI6IDMyMTQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMyLnBuZ1wiOiAzMTUzNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMy5wbmdcIjogMzA4NTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzQucG5nXCI6IDI5ODkxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM1LnBuZ1wiOiAyOTQyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNi5wbmdcIjogMjk0MTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzcucG5nXCI6IDI4MzgxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM4LnBuZ1wiOiAyODE0Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzOS5wbmdcIjogMjcyNjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDAucG5nXCI6IDI2NTY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQxLnBuZ1wiOiAyNjU2Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Mi5wbmdcIjogMjU4NzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDMucG5nXCI6IDI1MzU0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ0LnBuZ1wiOiAyNDU2NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NS5wbmdcIjogMjQyMDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDYucG5nXCI6IDI0MTQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ3LnBuZ1wiOiAyMzYxMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OC5wbmdcIjogMjM2MzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDkucG5nXCI6IDIzODA5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUwLnBuZ1wiOiAyMzE3MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MS5wbmdcIjogMjMyNjIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTIucG5nXCI6IDIzMjA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUzLnBuZ1wiOiAyMjc5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NC5wbmdcIjogMjMwNjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTUucG5nXCI6IDIzMzU1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU2LnBuZ1wiOiAyMzc3OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ny5wbmdcIjogMjQ3NDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTgucG5nXCI6IDI1ODc4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU5LnBuZ1wiOiAyNjUyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MC5wbmdcIjogMjc2NjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjEucG5nXCI6IDI4Njg4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYyLnBuZ1wiOiAyOTU4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2My5wbmdcIjogMzAzOTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjQucG5nXCI6IDMxMjk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY1LnBuZ1wiOiAzMjI0OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ni5wbmdcIjogMzM4OTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjcucG5nXCI6IDM1MzQ4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY4LnBuZ1wiOiAzNjIzNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OS5wbmdcIjogMzc1NjgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzAucG5nXCI6IDM5ODgwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcxLnBuZ1wiOiA0MTA5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Mi5wbmdcIjogNDIwMzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzMucG5nXCI6IDQyNDk1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc0LnBuZ1wiOiA0NDU1Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NS5wbmdcIjogNDU0NDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzYucG5nXCI6IDQ2NzQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc3LnBuZ1wiOiA0ODY5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3OC5wbmdcIjogNDk4NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzkucG5nXCI6IDUxNzE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgwLnBuZ1wiOiA1Mzg2Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MS5wbmdcIjogNTQ1MjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODIucG5nXCI6IDU2NDk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgzLnBuZ1wiOiA1NjI5Myxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4NC5wbmdcIjogNTg4MjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODUucG5nXCI6IDU5NTk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg2LnBuZ1wiOiA2MDYzNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ny5wbmdcIjogNjI4OTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODgucG5nXCI6IDYzOTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg5LnBuZ1wiOiA2NjEwNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5MC5wbmdcIjogNjYzNDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTEucG5nXCI6IDY5MjA3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkyLnBuZ1wiOiA2ODc2Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5My5wbmdcIjogNzA1ODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTQucG5nXCI6IDcwMjY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk1LnBuZ1wiOiA3MzMwMyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Ni5wbmdcIjogNzU5MDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTcucG5nXCI6IDc3NTM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk4LnBuZ1wiOiA4MTYyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OS5wbmdcIjogODIyNzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDAucG5nXCI6IDg1MDU2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAxLnBuZ1wiOiA4NzA2MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMi5wbmdcIjogODgzNDEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDMucG5nXCI6IDg4OTA0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA0LnBuZ1wiOiA5MzIwOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNS5wbmdcIjogOTk3NzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDYucG5nXCI6IDEwMjg2MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNy5wbmdcIjogMTA5ODQ1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA4LnBuZ1wiOiAxMTIxNjksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDkucG5nXCI6IDExNTkxNSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMC5wbmdcIjogMTE2OTAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTExLnBuZ1wiOiAxMjMzMjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTIucG5nXCI6IDEyNjM0Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMy5wbmdcIjogMTMzNzQ5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE0LnBuZ1wiOiAxMzg3NzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTUucG5nXCI6IDE0Njk0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNi5wbmdcIjogMTU0MzIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE3LnBuZ1wiOiAxNTk0NzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTgucG5nXCI6IDE2NjIxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOS5wbmdcIjogMTcxNjIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIwLnBuZ1wiOiAxNzgyNzEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjEucG5nXCI6IDE4NTg4Nyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMi5wbmdcIjogMTk3MjkxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIzLnBuZ1wiOiAyMDYxMjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjQucG5nXCI6IDIyNDY4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNS5wbmdcIjogMjM2NjM4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI2LnBuZ1wiOiAyNDI1OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjcucG5nXCI6IDI2MjE4Mixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOC5wbmdcIjogMjc0ODA2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI5LnBuZ1wiOiAyODU5NDAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzAucG5nXCI6IDMwNzQzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMS5wbmdcIjogMzIzMjcwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMyLnBuZ1wiOiAzNTA1NzMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzMucG5nXCI6IDM3NjExNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNC5wbmdcIjogNDA1NTc0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM1LnBuZ1wiOiA0Mzc2NTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzYucG5nXCI6IDQ3NjQ4OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNy5wbmdcIjogNDg0Mjg1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM4LnBuZ1wiOiA1MzI5NDYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzkucG5nXCI6IDU1NjEyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MC5wbmdcIjogNTk0NTQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQxLnBuZ1wiOiA2NDg0OTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDIucG5nXCI6IDcxMzc5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0My5wbmdcIjogNzMyOTI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ0LnBuZ1wiOiA3MDI5ODEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDUucG5nXCI6IDc1ODM4NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ni5wbmdcIjogNzQzNTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ3LnBuZ1wiOiA2ODQ5ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDgucG5nXCI6IDY3Mzk1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0OS5wbmdcIjogNjU1MTg2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUwLnBuZ1wiOiA2MTg2MzcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTEucG5nXCI6IDU5OTc0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1Mi5wbmdcIjogNTUzODkwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUzLnBuZ1wiOiA1MjU5OTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTQucG5nXCI6IDUxMjAyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1NS5wbmdcIjogMzU0OTA2XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJkdXN0eVwiOiBcImFzc2V0cy9hdWRpby9kdXN0eS5tcDNcIixcbiAgICBcImJsYWRlcmFuZ2VyXCI6IFwiYXNzZXRzL2F1ZGlvL2JsYWRlLm1wM1wiLFxuICAgIFwiY2FiYmllXCI6IFwiYXNzZXRzL2F1ZGlvL011c3RhbmdfMjAxMl9TdGFydC5tcDNcIixcbiAgICBcImRpcHBlclwiOiBcImFzc2V0cy9hdWRpby9kaXBwZXIubXAzXCIsXG4gICAgXCJ3aW5kbGlmdGVyXCI6IFwiYXNzZXRzL2F1ZGlvL3dpbmRsaWZ0ZXIubXAzXCIsXG4gICAgXCJ0ZWFtXCI6IFwiYXNzZXRzL2F1ZGlvL1llbGxvd19HZW5lcmljX1N0YXJ0Lm1wM1wiXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiY2xhc3NcIjogXCJjYW5uZWRcIixcbiAgICBcImNvcHlcIjogXCJOb3cgdGhhdCB3ZSBrbm93IG1vcmUgYWJvdXQgeW91LCBpdCdzIHlvdXIgdHVybiB0byBhc2sgZmlyZSByYW5nZXIgc29tZSBxdWVzdGlvbnNcIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgdGhpbmcgYWJvdXQgdGhlIFBpc3RvbiBQZWFrIEF0dGFjayBUZWFtP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZhdm9yaXRlVGhpbmdcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IHdhcyB5b3VyIGhhcmRlc3QgbWlzc2lvbj9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJoYXJkZXN0TWlzc2lvblwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldobyBhcmUgeW91ciBiZXN0IGZyaWVuZHMgb24gdGhlIFBQQVQ/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmVzdEZyaWVuZHNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaGF0IGlzIHlvdXIgam9iIGF0IFBpc3RvbiBQZWFrP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImpvYlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBkbyB5b3UgZmlnaHQgZm9yZXN0IGZpcmVzP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZpZ2h0RmlyZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG8geW91IHByZXZlbnQgZm9yZXN0IGZpcmVzP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInlvdVByZXZlbnRGaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBjYW4gSSBwcmV2ZW50IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJJUHJldmVudEZpcmVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRmlyZSBmaXJlIGZpcmUgZm9yZXN0IGZpcmUgZm9yZXN0P1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZpcmVGb3Jlc3RcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJMb3JlbSBJcHN1bSAxP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImxvcmVtaXBzdW0xXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTG9yZW0gSXBzdW0gMj9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJsb3JlbWlwc3VtMlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkxvcmVtIElwc3VtIDM/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwibG9yZW1pcHN1bTNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJMb3JlbSBJcHN1bSA0P1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImxvcmVtaXBzdW00XCJcbiAgICAgICAgfVxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJuYW1lXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY2xhc3NcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjb3B5XCI6IFwiV2hvIGRvIHlvdSB3YW50IHRvIHdyaXRlIHRvP1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkR1c3R5XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZHVzdHlcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJCbGFkZSBSYW5nZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJibGFkZXJhbmdlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkNhYmJpZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNhYmJpZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkRpcHBlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRpcHBlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldpbmRsaWZ0ZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ3aW5kbGlmdGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlIFRlYW1cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ0ZWFtXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgXCJyZXF1aXJlZFwiOiB0cnVlXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwicXVlc3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtZGlzbmV5LW1vdmllXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtZGlzbmV5LW1vdmllXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0IGlzIHlvdXIgZmF2b3JpdGUgRGlzbmV5IG1vdmllP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlRoZSBMaW9uIEtpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInRoZWxpb25raW5nXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUGhhbnRvbSBvZiB0aGUgTWVnYXBsZXhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInBoYW50b21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJHYW1lIG9mIFRocm9uZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImdhbWVvZnRocm9uZXNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIZXJjdWxlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaGVyY3VsZXNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCcmVha2luJyAyOiBFbGVjdHJpYyBCb29nYWxvb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYnJlYWtpblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk1lbWVudG9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm1lbWVudG9cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQncyB5b3VyIGZhdm9yaXRlIGNvbG9yP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicmVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmx1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmx1ZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk9yYW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwib3JhbmdlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiR3JlZW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImdyZWVuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiWWVsbG93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJ5ZWxsb3dcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQdXJwbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInB1cnBsZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwicXVlc3Rpb240XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwicXVlc3Rpb240XCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJMb3JlbSBJcHN1bT9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJMb3JlbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwibG9yZW1cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJcHN1bVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaXBzdW1cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJEb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZG9sb3JcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTaXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInNpdFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkFtZXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImFtZXRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDb25zZWN0ZXR1clwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiY29uc2VjdGV0dXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInF1ZXN0aW9uNVwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInF1ZXN0aW9uNVwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiTG9yZW0gSXBzdW0gMj9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJMb3JlbSAyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJsb3JlbTJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJcHN1bSAyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJpcHN1bTJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJEb2xvciAyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJkb2xvcjJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJTaXQgMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic2l0MlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkFtZXQgMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYW1ldDJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDb25zZWN0ZXR1ciAyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJjb25zZWN0ZXR1cjJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICBdXG59IiwiXG5cblxuXG4vLyBhZGRzIG91ciBjdXN0b20gbW9kaWZpY2F0aW9ucyB0byB0aGUgUElYSSBsaWJyYXJ5XG5yZXF1aXJlKCcuL3BpeGkvbGliTW9kaWZpY2F0aW9ucycpO1xuXG5cblxudmFyIE1haW5WaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9tYWluVmlldycpO1xudmFyIEFzc2V0TG9hZGluZ1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2Fzc2V0TG9hZGluZ1ZpZXcnKTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFwcCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBhcHAgPSB7fTtcblxuXG5cblxuXG4vLyBhZnRlciBhc3NldHMgbG9hZGVkICYganF1ZXJ5IGxvYWRlZFxuYXBwLnJlbmRlciA9IF8uYWZ0ZXIoMiwgZnVuY3Rpb24oKSB7XG4gICAgYXBwLm1haW5WaWV3ID0gbmV3IE1haW5WaWV3KCk7XG5cbiAgICBhcHAubWFpblZpZXcuc3RhcnQoKTtcbn0pO1xuXG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEFzc2V0IExvYWRpbmcgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyICRwYXNzd29yZFNjcmVlbiA9ICQoJyNwYXNzd29yZFNjcmVlbicpO1xuXG5pZihkb2N1bWVudC5VUkwuaW5kZXhPZignZGlzbmV5LXBsYW5lczItYWlybWFpbC1zdGFnaW5nLmF6dXJld2Vic2l0ZXMubmV0JykgIT09IC0xKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJ2Rpc25leVBsYW5lc1R3byc7XG5cbiAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2lucHV0W3R5cGU9cGFzc3dvcmRdJyk7XG5cblxuICAgICAgICAkcGFzc3dvcmRTY3JlZW4uZmluZCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKCRwYXNzd29yZElucHV0LnZhbCgpID09PSBwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICRwYXNzd29yZFNjcmVlbi5mYWRlT3V0KDUwKTtcblxuICAgICAgICAgICAgICAgIGFwcC5hc3NldExvYWRlciA9IG5ldyBBc3NldExvYWRpbmdWaWV3KHtvbkNvbXBsZXRlOiBhcHAucmVuZGVyfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSBlbHNlIHtcbiAgICBhcHAuYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkaW5nVmlldyh7b25Db21wbGV0ZTogYXBwLnJlbmRlcn0pO1xuXG4gICAgJHBhc3N3b3JkU2NyZWVuLnJlbW92ZSgpO1xufVxuXG5cblxuJChhcHAucmVuZGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4iLCJcblxuXG52YXIgUXVlc3Rpb24gPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIGNvcHk6ICcnLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgfVxufSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxuICAgIC8vIGRpc3BsYXlPYmplY3Qgc2hvdWxkIGJlIGFuIGluc3RhbmNlIG9mIFBJWEkuU3ByaXRlIG9yIFBJWEkuTW92aWVDbGlwXG4gICAgdmFyIENoYXJhY3RlciA9IGZ1bmN0aW9uKG5hbWUsIG1vdmllQ2xpcCkge1xuICAgICAgICBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTsgLy8gUGFyZW50IGNvbnN0cnVjdG9yXG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcblxuICAgICAgICBpZighXy5pc1VuZGVmaW5lZChtb3ZpZUNsaXApKSB7XG4gICAgICAgICAgICB0aGlzLnNldElkbGVTdGF0ZShtb3ZpZUNsaXApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5zZXRJZGxlU3RhdGUgPSBmdW5jdGlvbihwaXhpU3ByaXRlKSB7XG4gICAgICAgIHRoaXMuaWRsZSA9IHBpeGlTcHJpdGU7XG5cbiAgICAgICAgaWYocGl4aVNwcml0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICBwaXhpU3ByaXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgcGl4aVNwcml0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgIHBpeGlTcHJpdGUuZ290b0FuZFBsYXkoMCk7ICAvL3N0YXJ0IGNsaXBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocGl4aVNwcml0ZSk7ICAgLy9hZGQgdG8gZGlzcGxheSBvYmplY3QgY29udGFpbmVyXG4gICAgfTtcblxuICAgIC8vYWRkIG1vdmllIGNsaXAgdG8gcGxheSB3aGVuIGNoYXJhY3RlciBjaGFuZ2VzIHRvIHN0YXRlXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5hZGRTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgbW92aWVDbGlwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZXNbc3RhdGVdID0gbW92aWVDbGlwO1xuICAgICAgICB0aGlzLmFkZENoaWxkKG1vdmllQ2xpcCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBBUEkgZnVuY3Rpb24uIFdhaXRzIHVudGlsIGN1cnJlbnQgc3RhdGUgaXMgZmluaXNoZWQgYmVmb3JlIHN3aXRjaGluZyB0byBuZXh0IHN0YXRlLlxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuZ29Ub1N0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcblxuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKHRoaXMuc3RhdGVzW3N0YXRlXSkpIHtcbiAgICAgICAgICAgIHRocm93ICdFcnJvcjogQ2hhcmFjdGVyICcgKyB0aGlzLm5hbWUgKyAnIGRvZXMgbm90IGNvbnRhaW4gc3RhdGU6ICcgKyBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuaWRsZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUub25Db21wbGV0ZSA9IF8uYmluZCh0aGlzLnN3YXBTdGF0ZSwgdGhpcywgc3RhdGUpO1xuXG4gICAgICAgICAgICAvLyBhZnRlciBjdXJyZW50IGFuaW1hdGlvbiBmaW5pc2hlcyBnbyB0byB0aGlzIHN0YXRlIG5leHRcbiAgICAgICAgICAgIHRoaXMuaWRsZS5sb29wID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN3YXBTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgICAvL3N3aXRjaCBpbW1lZGlhdGVseSBpZiBjaGFyYWN0ZXIgaWRsZSBzdGF0ZSBpcyBhIHNpbmdsZSBzcHJpdGVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBjaGFuZ2VzIHN0YXRlIGltbWVkaWF0ZWx5XG4gICAgLy8gTk9URTogRnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5IGJ5IGNoYXJhY3Rlci5nb1RvU3RhdGUoKVxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuc3dhcFN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcblxuICAgICAgICB2YXIgaWRsZVN0YXRlID0gdGhpcy5pZGxlO1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLnN0YXRlc1tzdGF0ZV07XG5cbiAgICAgICAgbmV3U3RhdGUub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkgeyAgLy9zd2l0Y2ggYmFjayB0byBpZGxlIGFmdGVyIHJ1blxuICAgICAgICAgICAgaWYoaWRsZVN0YXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBuZXdTdGF0ZS5sb29wID0gZmFsc2U7XG4gICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBuZXdTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICB9O1xuXG4gICAgLy9hZGQgY2FsbGJhY2sgdG8gcnVuIG9uIGNoYXJhY3RlciB1cGRhdGVcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLm9uVXBkYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfTtcblxuICAgIC8vIGNhbGxlZCBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZSBieSB3aGF0ZXZlciBQaXhpIHNjZW5lIGNvbnRhaW5zIHRoaXMgY2hhcmFjdGVyXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrKCk7XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIGV4dGVuZHMgRGlzcGxheSBPYmplY3QgQ29udGFpbmVyXG4gICAgZXh0ZW5kKFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lciwgQ2hhcmFjdGVyKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2hhcmFjdGVyO1xufSkoKTsiLCJcbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBzdWIpIHtcbiAgICAvLyBBdm9pZCBpbnN0YW50aWF0aW5nIHRoZSBiYXNlIGNsYXNzIGp1c3QgdG8gc2V0dXAgaW5oZXJpdGFuY2VcbiAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2NyZWF0ZVxuICAgIC8vIGZvciBhIHBvbHlmaWxsXG4gICAgLy8gQWxzbywgZG8gYSByZWN1cnNpdmUgbWVyZ2Ugb2YgdHdvIHByb3RvdHlwZXMsIHNvIHdlIGRvbid0IG92ZXJ3cml0ZVxuICAgIC8vIHRoZSBleGlzdGluZyBwcm90b3R5cGUsIGJ1dCBzdGlsbCBtYWludGFpbiB0aGUgaW5oZXJpdGFuY2UgY2hhaW5cbiAgICAvLyBUaGFua3MgdG8gQGNjbm9rZXNcbiAgICB2YXIgb3JpZ1Byb3RvID0gc3ViLnByb3RvdHlwZTtcbiAgICBzdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3JpZ1Byb3RvKSAge1xuICAgICAgICBzdWIucHJvdG90eXBlW2tleV0gPSBvcmlnUHJvdG9ba2V5XTtcbiAgICB9XG5cbiAgICAvLyBSZW1lbWJlciB0aGUgY29uc3RydWN0b3IgcHJvcGVydHkgd2FzIHNldCB3cm9uZywgbGV0J3MgZml4IGl0XG4gICAgc3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgICAvLyBJbiBFQ01BU2NyaXB0NSsgKGFsbCBtb2Rlcm4gYnJvd3NlcnMpLCB5b3UgY2FuIG1ha2UgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5XG4gICAgLy8gbm9uLWVudW1lcmFibGUgaWYgeW91IGRlZmluZSBpdCBsaWtlIHRoaXMgaW5zdGVhZFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWIucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc3ViXG4gICAgfSk7XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDsiLCIoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKlxuICAgICAqIEN1c3RvbSBFZGl0cyBmb3IgdGhlIFBJWEkgTGlicmFyeVxuICAgICAqL1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBSZWxhdGl2ZSBQb3NpdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93WCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93WSA9IDA7XG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWCA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9ICh3aW5kb3dXaWR0aCAqIHRoaXMuX3dpbmRvd1gpICsgdGhpcy5fYnVtcFg7XG4gICAgfTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRQb3NpdGlvblkgPSBmdW5jdGlvbih3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gKHdpbmRvd0hlaWdodCAqIHRoaXMuX3dpbmRvd1kpICsgdGhpcy5fYnVtcFk7XG4gICAgfTtcblxuICAgIC8vIHdpbmRvd1ggYW5kIHdpbmRvd1kgYXJlIHByb3BlcnRpZXMgYWRkZWQgdG8gYWxsIFBpeGkgZGlzcGxheSBvYmplY3RzIHRoYXRcbiAgICAvLyBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIHBvc2l0aW9uLnggYW5kIHBvc2l0aW9uLnlcbiAgICAvLyB0aGVzZSBwcm9wZXJ0aWVzIHdpbGwgYmUgYSB2YWx1ZSBiZXR3ZWVuIDAgJiAxIGFuZCBwb3NpdGlvbiB0aGUgZGlzcGxheVxuICAgIC8vIG9iamVjdCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHdpbmRvdyB3aWR0aCAmIGhlaWdodCBpbnN0ZWFkIG9mIGEgZmxhdCBwaXhlbCB2YWx1ZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93WCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl93aW5kb3dYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCgkd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1k7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1kgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25ZKCR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9idW1wWSA9IDA7XG5cbiAgICAvLyBidW1wWCBhbmQgYnVtcFkgYXJlIHByb3BlcnRpZXMgb24gYWxsIGRpc3BsYXkgb2JqZWN0cyB1c2VkIGZvclxuICAgIC8vIHNoaWZ0aW5nIHRoZSBwb3NpdGlvbmluZyBieSBmbGF0IHBpeGVsIHZhbHVlcy4gVXNlZnVsIGZvciBzdHVmZlxuICAgIC8vIGxpa2UgaG92ZXIgYW5pbWF0aW9ucyB3aGlsZSBzdGlsbCBtb3ZpbmcgYXJvdW5kIGEgY2hhcmFjdGVyLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYnVtcFgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVtcFg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX2J1bXBYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9ICgkd2luZG93LndpZHRoKCkgKiB0aGlzLl93aW5kb3dYKSArIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gKCR3aW5kb3cuaGVpZ2h0KCkgKiB0aGlzLl93aW5kb3dZKSArIHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBTY2FsaW5nIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gd2luZG93U2NhbGUgY29ycmVzcG9uZHMgdG8gd2luZG93IHNpemVcbiAgICAvLyAgIGV4OiB3aW5kb3dTY2FsZSA9IDAuMjUgbWVhbnMgMS80IHNpemUgb2Ygd2luZG93XG4gICAgLy8gc2NhbGVNaW4gYW5kIHNjYWxlTWF4IGNvcnJlc3BvbmQgdG8gbmF0dXJhbCBzcHJpdGUgc2l6ZVxuICAgIC8vICAgZXg6IHNjYWxlTWluID0gMC41IG1lYW5zIHNwcml0ZSB3aWxsIG5vdCBzaHJpbmsgdG8gbW9yZSB0aGFuIGhhbGYgb2YgaXRzIG9yaWdpbmFsIHNpemUuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fd2luZG93U2NhbGUgPSAtMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNjYWxlTWluID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNjYWxlTWF4ID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlVHlwZSA9ICdjb250YWluJztcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zY2FsZUZuYyA9IE1hdGgubWluO1xuXG4gICAgLy8gV2luZG93U2NhbGU6IHZhbHVlIGJldHdlZW4gMCAmIDEsIG9yIC0xXG4gICAgLy8gVGhpcyBkZWZpbmVzIHdoYXQgJSBvZiB0aGUgd2luZG93IChoZWlnaHQgb3Igd2lkdGgsIHdoaWNoZXZlciBpcyBzbWFsbGVyKVxuICAgIC8vIHRoZSBvYmplY3Qgd2lsbCBiZSBzaXplZC4gRXhhbXBsZTogYSB3aW5kb3dTY2FsZSBvZiAwLjUgd2lsbCBzaXplIHRoZSBkaXNwbGF5T2JqZWN0XG4gICAgLy8gdG8gaGFsZiB0aGUgc2l6ZSBvZiB0aGUgd2luZG93LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93U2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93U2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1NjYWxlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFR3byBwb3NzaWJsZSB2YWx1ZXM6IGNvbnRhaW4gb3IgY292ZXIuIFVzZWQgd2l0aCB3aW5kb3dTY2FsZSB0byBkZWNpZGUgd2hldGhlciB0byB0YWtlIHRoZVxuICAgIC8vIHNtYWxsZXIgYm91bmQgKGNvbnRhaW4pIG9yIHRoZSBsYXJnZXIgYm91bmQgKGNvdmVyKSB3aGVuIGRlY2lkaW5nIGNvbnRlbnQgc2l6ZSByZWxhdGl2ZSB0byBzY3JlZW4uXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdzY2FsZVR5cGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVUeXBlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2FsZVR5cGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2NhbGVGbmMgPSAodmFsdWUgPT09ICdjb250YWluJykgPyBNYXRoLm1pbiA6IE1hdGgubWF4O1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0U2NhbGUgPSBmdW5jdGlvbih3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KSB7XG4gICAgICAgIHZhciBsb2NhbEJvdW5kcyA9IHRoaXMuZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLl93aW5kb3dTY2FsZSAqIHRoaXMuX3NjYWxlRm5jKHdpbmRvd0hlaWdodC9sb2NhbEJvdW5kcy5oZWlnaHQsIHdpbmRvd1dpZHRoL2xvY2FsQm91bmRzLndpZHRoKTtcblxuICAgICAgICAvL2tlZXAgc2NhbGUgd2l0aGluIG91ciBkZWZpbmVkIGJvdW5kc1xuICAgICAgICBzY2FsZSA9IE1hdGgubWF4KHRoaXMuc2NhbGVNaW4sIE1hdGgubWluKHNjYWxlLCB0aGlzLnNjYWxlTWF4KSk7XG5cblxuICAgICAgICB0aGlzLnNjYWxlLnggPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgdGhpcy5zY2FsZS55ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgfTtcblxuXG4gICAgLy8gVVNFIE9OTFkgSUYgV0lORE9XU0NBTEUgSVMgQUxTTyBTRVRcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVggPSAxO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWSA9IDE7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVZID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKCR3aW5kb3cud2lkdGgoKSwgJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIFdpbmRvdyBSZXNpemUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBmb3IgZWFjaCBkaXNwbGF5IG9iamVjdCBvbiB3aW5kb3cgcmVzaXplLFxuICAgIC8vIGFkanVzdGluZyB0aGUgcGl4ZWwgcG9zaXRpb24gdG8gbWlycm9yIHRoZSByZWxhdGl2ZSBwb3NpdGlvbnMgd2luZG93WCBhbmQgd2luZG93WVxuICAgIC8vIGFuZCBhZGp1c3Rpbmcgc2NhbGUgaWYgaXQncyBzZXRcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKHdpZHRoKTtcbiAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25ZKGhlaWdodCk7XG5cbiAgICAgICAgaWYodGhpcy5fd2luZG93U2NhbGUgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuLCBmdW5jdGlvbihkaXNwbGF5T2JqZWN0KSB7XG4gICAgICAgICAgICBkaXNwbGF5T2JqZWN0Ll9vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKiogU3ByaXRlc2hlZXQgVGV4dHVyZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbiAgICAvLyB1c2VkIHRvIGdldCBpbmRpdmlkdWFsIHRleHR1cmVzIG9mIHNwcml0ZXNoZWV0IGpzb24gZmlsZXNcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgY2FsbDogZ2V0RmlsZU5hbWVzKCdhbmltYXRpb25faWRsZV8nLCAxLCAxMDUpO1xuICAgIC8vIFJldHVybnM6IFsnYW5pbWF0aW9uX2lkbGVfMDAxLnBuZycsICdhbmltYXRpb25faWRsZV8wMDIucG5nJywgLi4uICwgJ2FuaW1hdGlvbl9pZGxlXzEwNC5wbmcnXVxuICAgIC8vXG4gICAgZnVuY3Rpb24gZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHZhciBudW1EaWdpdHMgPSAocmFuZ2VFbmQtMSkudG9TdHJpbmcoKS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UocmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBmdW5jdGlvbihudW0pIHtcblxuICAgICAgICAgICAgdmFyIG51bVplcm9zID0gbnVtRGlnaXRzIC0gbnVtLnRvU3RyaW5nKCkubGVuZ3RoOyAgIC8vZXh0cmEgY2hhcmFjdGVyc1xuICAgICAgICAgICAgdmFyIHplcm9zID0gbmV3IEFycmF5KG51bVplcm9zICsgMSkuam9pbignMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsZVByZWZpeCArIHplcm9zICsgbnVtICsgJy5wbmcnO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBQSVhJLmdldFRleHR1cmVzID0gZnVuY3Rpb24oZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCksIFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUpO1xuICAgIH1cblxuXG5cblxuXG5cblxuXG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG4gICAgdmFyIGludHJvVmlkZW9Nb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2ludHJvVmlkZW8nKTtcbiAgICB2YXIgYmFja2dyb3VuZE1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvYmFja2dyb3VuZCcpO1xuICAgIHZhciBibGFkZXdpcGVNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2JsYWRld2lwZScpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcbiAgICB2YXIgcGFyYWNodXRlcnNNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3BhcmFjaHV0ZXJzJyk7XG4gICAgdmFyIHJlc3BvbnNlTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9yZXNwb25zZScpO1xuICAgIHZhciBjaGFyYWN0ZXJNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZScpO1xuXG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplSGVhZGVyRm9vdGVyKHNjZW5lKSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvaGVhZGVyLnBuZycpO1xuXG4gICAgICAgIGhlYWRlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGhlYWRlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDApO1xuICAgICAgICBoZWFkZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgaGVhZGVyLndpbmRvd1kgPSAwO1xuXG4gICAgICAgIHZhciBmb290ZXIgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZm9vdGVyLnBuZycpO1xuXG4gICAgICAgIGZvb3Rlci53aW5kb3dTY2FsZSA9IDE7XG4gICAgICAgIGZvb3Rlci5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgICAgIGZvb3Rlci53aW5kb3dYID0gMC41O1xuICAgICAgICBmb290ZXIud2luZG93WSA9IDE7XG5cbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgc2NlbmUuYWRkQ2hpbGQoZm9vdGVyKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiogUHJpbWFyeSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBNYWluU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgU2NlbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmluaXRpYWxpemUoKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRCYWNrZ3JvdW5kVG9TY2VuZSh0aGlzKTtcbiAgICAgICAgcGFyYWNodXRlcnNNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5hZGRSZXN0VG9TY2VuZSh0aGlzKTtcblxuICAgICAgICByZXNwb25zZU1vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBibGFkZXdpcGVNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG5cbiAgICAgICAgaW5pdGlhbGl6ZUhlYWRlckZvb3Rlcih0aGlzKTtcblxuICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIHRoaXMuaW50cm9WaWRlbyA9IGludHJvVmlkZW9Nb2R1bGUuZ2V0VmlkZW8oKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICByZXNwb25zZU1vZHVsZS5zaG93KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVJblVzZXJDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmFuaW1hdGVJbigpO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlT3V0VXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBQYXJhbGxheCBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5zaGlmdEJhY2tncm91bmRMYXllcnMoeCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIH0sXG4gICAgICAgIF9vbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICBpZighXy5pc1VuZGVmaW5lZCh0aGlzLnZpZXcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5pbnRyb1ZpZGVvLnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSB0aGlzLmludHJvVmlkZW8uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudmlldy5vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0LCAoYm91bmRzLndpZHRoICogc2NhbGUueCksIChib3VuZHMuaGVpZ2h0ICogc2NhbGUueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG4gICAgLy8gRXh0ZW5kcyBTY2VuZSBDbGFzc1xuICAgIGV4dGVuZChTY2VuZSwgTWFpblNjZW5lKTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluU2NlbmU7XG59KSgpOyIsIlxuXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbnZhciBTY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDQiA9IGZ1bmN0aW9uKCl7fTtcblxuICAgIFBJWEkuU3RhZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblNjZW5lLnByb3RvdHlwZSA9IHtcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24odXBkYXRlQ0IpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDQiA9IHVwZGF0ZUNCO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDQigpO1xuICAgIH0sXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgfSxcbiAgICByZXN1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgaXNQYXVzZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXVzZWQ7XG4gICAgfVxufTtcblxuXG5leHRlbmQoUElYSS5TdGFnZSwgU2NlbmUpO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgU2NlbmVzTWFuYWdlciA9IHtcbiAgICAgICAgc2NlbmVzOiB7fSxcbiAgICAgICAgY3VycmVudFNjZW5lOiBudWxsLFxuICAgICAgICByZW5kZXJlcjogbnVsbCxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgJHBhcmVudERpdikge1xuXG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5yZW5kZXJlcikgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih3aWR0aCwgaGVpZ2h0LCBudWxsLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3LnNldEF0dHJpYnV0ZSgnaWQnLCAncGl4aS12aWV3Jyk7XG4gICAgICAgICAgICAkcGFyZW50RGl2LmFwcGVuZChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShTY2VuZXNNYW5hZ2VyLmxvb3ApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgbG9vcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShmdW5jdGlvbiAoKSB7IFNjZW5lc01hbmFnZXIubG9vcCgpIH0pO1xuXG4gICAgICAgICAgICBpZiAoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lIHx8IFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLmlzUGF1c2VkKCkpIHJldHVybjtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUudXBkYXRlKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlbmRlcihTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZVNjZW5lOiBmdW5jdGlvbihpZCwgU2NlbmVDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgU2NlbmVDb25zdHJ1Y3RvciA9IFNjZW5lQ29uc3RydWN0b3IgfHwgU2NlbmU7ICAgLy9kZWZhdWx0IHRvIFNjZW5lIGJhc2UgY2xhc3NcblxuICAgICAgICAgICAgdmFyIHNjZW5lID0gbmV3IFNjZW5lQ29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSA9IHNjZW5lO1xuXG4gICAgICAgICAgICByZXR1cm4gc2NlbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdvVG9TY2VuZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHtcbiAgICAgICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnBhdXNlKCk7XG5cbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSA9IFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXTtcblxuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgcmVzaXplIHRvIG1ha2Ugc3VyZSBhbGwgY2hpbGQgb2JqZWN0cyBpbiB0aGVcbiAgICAgICAgICAgICAgICAvLyBuZXcgc2NlbmUgYXJlIGNvcnJlY3RseSBwb3NpdGlvbmVkXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzdW1lIG5ldyBzY2VuZVxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnJlc3VtZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCJcblxuXG5cblxudmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxudmFyIHNvdW5kUGxheWVyID0ge1xuICAgIG11dGVkOiBmYWxzZSxcbiAgICB2b2x1bWU6IDAuNCxcbiAgICBzb3VuZHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXSA9IHRoaXMuc291bmRzW2ZpbGVQYXRoXSB8fCBuZXcgQXVkaW8oZmlsZVBhdGgpO1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5hZGQoZmlsZVBhdGgpO1xuXG4gICAgICAgIGlmKCF0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0udm9sdW1lID0gdGhpcy52b2x1bWU7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0ucGxheSgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheScsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXy5lYWNoKGF1ZGlvQXNzZXRzLCBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHNvdW5kUGxheWVyLmFkZChmaWxlUGF0aCk7XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc291bmRQbGF5ZXI7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm5hbWUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgdmFsdWU9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIGlkPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiAvPlxcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy50ZXh0KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnRleHQpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcblxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3B5KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcHkpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMSwgcHJvZ3JhbTEsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvYXNzZXRzLmpzb24nKTtcblxudmFyIGZpbGVOYW1lcyA9IE9iamVjdC5rZXlzKGFzc2V0RGF0YS5hc3NldHMpO1xudmFyIHRvdGFsRmlsZXMgPSBmaWxlTmFtZXMubGVuZ3RoO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy51cGRhdGUodGhpcy5sb2FkQ291bnQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBfLmJpbmQodmlldy5hc3NldHNMb2FkZWQsIHZpZXcpO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBWaWV3ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBBc3NldExvYWRpbmdWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnI2Fzc2V0TG9hZGVyJyxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJHRleHQgPSB0aGlzLiRlbC5maW5kKCc+IC50ZXh0Jyk7XG4gICAgICAgIHRoaXMuJHRleHQuaHRtbCgnMC4wMCUnKTtcblxuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IG9wdGlvbnMub25Db21wbGV0ZSB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgICAgc3RhcnRMb2FkZXIodGhpcyk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGxvYWRDb3VudCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwMDAgKiAodG90YWxGaWxlcy1sb2FkQ291bnQpL3RvdGFsRmlsZXMpLzEwMDtcblxuICAgICAgICB0aGlzLiR0ZXh0Lmh0bWwocGVyY2VudGFnZSArICclJyk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuXG4gICAgICAgIHRoaXMuJHRleHQuaGlkZSgpO1xuICAgICAgICB2YXIgJGVsID0gdGhpcy4kZWw7XG4gICAgICAgIFR3ZWVuTGl0ZS50bygkZWwsIDEuNCwge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRlbC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldExvYWRpbmdWaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleWRvd24gaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuJHBsYWNlaG9sZGVyID0gdGhpcy4kZWwuZmluZCgnZGl2LnBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlcklubmVyID0gdGhpcy4kcGxhY2Vob2xkZXIuZmluZCgnPiBkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnZGl2LnRpdGxlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICBfLmJpbmRBbGwodGhpcywgJ3N0YXJ0QW5pbWF0aW9uJywnc2hvdycsJ2hpZGUnLCdzZXRJbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0U2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuc2NlbmVzWydtYWluJ107XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIFJ1biBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI3BpeGktdmlldycpLnJlbW92ZUNsYXNzKCdmcm9udCcpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnN0YXJ0RW50ZXJOYW1lQW5pbWF0aW9uKCk7ICAgLy9hbmltYXRlIGluIGNoYXJhY3RlcnNcblxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjM7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLiR0aXRsZSwgYW5pbWF0aW9uVGltZSwge29wYWNpdHk6IDEsIHk6IDAsIGVhc2U6ICdCYWNrLmVhc2VPdXQnfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kbmFtZUlucHV0LCBhbmltYXRpb25UaW1lLCB7b3BhY2l0eTogMX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIGFuaW1hdGlvblRpbWUsIHtvcGFjaXR5OiAxLCB5OiAwLCBlYXNlOiAnQmFjay5lYXNlT3V0JywgZGVsYXk6IDAuMTV9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJlQW5pbWF0aW9uU2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiR0aXRsZSwge29wYWNpdHk6IDAsIHk6IC03NX0pO1xuICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRuYW1lSW5wdXQsIHtvcGFjaXR5OiAwfSk7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuJHBsYWNlaG9sZGVySW5uZXIsIHtvcGFjaXR5OiAwLCB5OiAtNTB9KTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogU2hvdy9IaWRlICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcblxuICAgICAgICAgICAgdGhpcy5wcmVBbmltYXRpb25TZXR1cCgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnN0YXJ0QW5pbWF0aW9uLCAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZHVzdHlEaXBwZXJNb2R1bGUub25BbmltYXRpb25PdXRDb21wbGV0ZSh0aGlzLnNldEluYWN0aXZlKTtcblxuICAgICAgICAgICAgLy9ydW4gaGlkZSBhbmltYXRpb25cbiAgICAgICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLmFuaW1hdGVPdXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuICAgICAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25OYW1lQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy4kbmFtZUlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICB0aGlzLiRwbGFjZWhvbGRlci50b2dnbGUodmFsID09PSAnJyk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogdmFsfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRlck5hbWVWaWV3O1xufSkoKTtcbiIsIlxuXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc291bmRQbGF5ZXIgPSByZXF1aXJlKCcuLi9zb3VuZFBsYXllcicpO1xuXG4gICAgdmFyIEZvb3RlclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2Zvb3RlcicsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEudm9sdW1lJzogJ29uVm9sdW1lVG9nZ2xlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5udW1Eb3RzID0gb3B0aW9ucy5udW1Eb3RzO1xuXG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Vm9sdW1lQW5pbWF0aW9uVGltZWxpbmVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb3VudGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocyA9IHRoaXMuJGVsLmZpbmQoJ2Eudm9sdW1lIHBhdGgnKTtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYuY291bnRlcicpO1xuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPbigpO1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPZmZBbmltYXRpb24gPSB0aGlzLmdldFRpbWVsaW5lVm9sdW1lT2ZmKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBudW1Eb3RzID0gdGhpcy5udW1Eb3RzO1xuXG4gICAgICAgICAgICB2YXIgJGRvdCA9IHRoaXMuJGRvdHMuZXEoMCk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDI7IGkgPD0gbnVtRG90czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRuZXdEb3QgPSAkZG90LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5maW5kKCc+IGRpdi5udW1iZXInKS5odG1sKGkpO1xuICAgICAgICAgICAgICAgICRuZXdEb3QuYXBwZW5kVG8odGhpcy4kY291bnRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMgPSB0aGlzLiRjb3VudGVyLmZpbmQoJz4gLmRvdCcpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gJGRvdDtcbiAgICAgICAgICAgICRkb3QuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiBWb2x1bWUgQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgdG9nZ2xlVm9sdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudm9sdW1lT24gPSAhdGhpcy52b2x1bWVPbjtcblxuICAgICAgICAgICAgaWYodGhpcy52b2x1bWVPbikge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT25BbmltYXRpb24ucGxheSgwKTtcbiAgICAgICAgICAgICAgICBzb3VuZFBsYXllci5vbigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9mZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtzdGFydE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlbmRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVhc2luZzogJ0JhY2suZWFzZU91dCcsIG9wYWNpdHk6IDF9O1xuXG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDApLCAwLjUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgxKSwgMC4yNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDIpLCAwLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgICAgICB9LFxuICAgICAgICBnZXRUaW1lbGluZVZvbHVtZU9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMSwwLDAsMSwwLDBdLCBlbmRNYXRyaXg6IFswLDAsMCwwLDIyLDMyXSwgZWFzaW5nOiAnQmFjay5lYXNlSW4nLCBvcGFjaXR5OiAwfTtcblxuICAgICAgICAgICAgLy9kZWZhdWx0IG9uXG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5hdHRyKCd0cmFuc2Zvcm0nLCAnbWF0cml4KDEsMCwwLDEsMCwwKScpO1xuICAgICAgICAgICAgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuY3NzKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgxKSwgMC4yNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDIpLCAwLjUsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZFN2Z1BhdGhBbmltYXRpb246IGZ1bmN0aW9uKHRpbWVsaW5lLCAkcGF0aCwgc3RhcnRUaW1lLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uU3BlZWQgPSAwLjI7XG5cbiAgICAgICAgICAgIHZhciBwYXRoTWF0cml4ID0gXy5jbG9uZShvcHRpb25zLnN0YXJ0TWF0cml4KTtcblxuICAgICAgICAgICAgdmFyIHR3ZWVuQXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgZWFzZTogb3B0aW9ucy5lYXNpbmcsXG4gICAgICAgICAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkcGF0aC5hdHRyKCd0cmFuc2Zvcm0nLCAnbWF0cml4KCcgKyBwYXRoTWF0cml4LmpvaW4oJywnKSArICcpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgXy5leHRlbmQodHdlZW5BdHRycywgb3B0aW9ucy5lbmRNYXRyaXgpO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKCRwYXRoLCBhbmltYXRpb25TcGVlZCwge29wYWNpdHk6IG9wdGlvbnMub3BhY2l0eX0pLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHBhdGhNYXRyaXgsIGFuaW1hdGlvblNwZWVkLCB0d2VlbkF0dHJzKSwgYW5pbWF0aW9uU3BlZWQgKiBzdGFydFRpbWUpO1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiogQ291bnRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzZXRDb3VudGVyOiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB0aGlzLiRkb3RzLmVxKGkpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdCA9IHRoaXMuJGRvdHMuZXEoaSk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGVDb3VudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXIuaGlkZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwub3V0ZXJIZWlnaHQoKSArIHRoaXMuJGNvdW50ZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIG9uVm9sdW1lVG9nZ2xlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlVm9sdW1lKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBGb290ZXJWaWV3O1xufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vcGl4aS9zY2VuZXNNYW5hZ2VyJyk7XG5cbiAgICB2YXIgaW50cm9WaWRlb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm9WaWRlbycpO1xuXG4gICAgdmFyIEludHJvVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjaW50cm8tdmlldycsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgJ2NsaWNrIGEuYmVnaW4nOiAnb25CZWdpbkNsaWNrJ1xuICAgICAgICB9LFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvblRpbWVsaW5lKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRTY2VuZSgpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luU2NyZWVuID0gdGhpcy4kZWwuZmluZCgnZGl2LmJlZ2luLXNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5MaW5lcyA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2Rpdi5saW5lJyk7XG4gICAgICAgICAgICB0aGlzLiRiZWdpbkJ0biA9IHRoaXMuJGJlZ2luU2NyZWVuLmZpbmQoJ2EuYmVnaW4nKTtcblxuICAgICAgICAgICAgdmFyICR2aWV3UG9ydHMgPSB0aGlzLiRlbC5maW5kKCdkaXYudmlld3BvcnQnKTtcblxuICAgICAgICAgICAgdGhpcy4kdmlld1BvcnRUb3AgPSAkdmlld1BvcnRzLmZpbHRlcignLnRvcCcpO1xuICAgICAgICAgICAgdGhpcy4kdmlld1BvcnRCb3R0b20gPSAkdmlld1BvcnRzLmZpbHRlcignLmJ0bScpO1xuXG4gICAgICAgICAgICB0aGlzLiR2ZXJ0aWNhbFNpZGVzID0gJHZpZXdQb3J0cy5maW5kKCcudmVydGljYWwnKTtcbiAgICAgICAgICAgIHRoaXMuJGhvcml6b250YWxTaWRlcyA9ICR2aWV3UG9ydHMuZmluZCgnLmhvcml6b250YWwnKTtcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmRzID0gJHZpZXdQb3J0cy5maW5kKCcuYmFja2dyb3VuZCcpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0QW5pbWF0aW9uVGltZWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUgPSB0aGlzLmdldFRpbWVsaW5lSGlkZSgpO1xuICAgICAgICAgICAgdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW4gPSB0aGlzLmdldFRpbWVsaW5lQmVnaW5TY3JlZW5JbigpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0U2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuc2NlbmVzWydtYWluJ107XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2V0Vmlldyh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93QmVnaW5TY3JlZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZUJlZ2luU2NyZWVuSW47XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoXy5iaW5kKHRpbWVsaW5lLnBsYXksIHRpbWVsaW5lKSwgMjAwKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGdldFRpbWVsaW5lQmVnaW5TY3JlZW5JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqIFN0YXRpYyBWYXJpYWJsZXMgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDAuNDtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSAnQmFjay5lYXNlT3V0JztcblxuICAgICAgICAgICAgdmFyIHR3ZWVucyA9IF8ubWFwKHRoaXMuJGJlZ2luTGluZXMsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGxpbmUsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHdlZW5zOiB0d2VlbnMsXG4gICAgICAgICAgICAgICAgc3RhZ2dlcjogMC4wOCxcbiAgICAgICAgICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLiRiZWdpbkJ0biwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuN1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYnRuSW5UaW1lID0gMC40O1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlWTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBzY2FsZVg6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0VsYXN0aWMuZWFzZU91dCdcbiAgICAgICAgICAgIH0pLCBidG5JblRpbWUgKyAoYW5pbWF0aW9uVGltZSAqIDAuMDUpKTtcblxuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqIFRpbWVsaW5lICoqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0aW9uRmluaXNoZWQsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVNjb3BlOiB0aGlzXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpblNjcmVlbiwgYW5pbWF0aW9uVGltZS80LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiR2aWV3UG9ydFRvcCwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHRvcDogJy01MCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiR2aWV3UG9ydEJvdHRvbSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIGJvdHRvbTogJy01MCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQW5pbWF0aW9uRmluaXNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRJbmFjdGl2ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2luYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnRzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZHMud2lkdGgodmlkZW9XaWR0aCAqIDEuMjc1IHwgMCk7XG4gICAgICAgICAgICB0aGlzLiRob3Jpem9udGFsU2lkZXMuaGVpZ2h0KCgod2luZG93SGVpZ2h0IC0gdmlkZW9IZWlnaHQpLzIgKyAxKSB8IDApOyAvL3JvdW5kIHVwXG4gICAgICAgICAgICB0aGlzLiR2ZXJ0aWNhbFNpZGVzLndpZHRoKCgod2luZG93V2lkdGggLSB2aWRlb1dpZHRoKS8yICsgMSkgfCAwKTsgLy9yb3VuZCB1cFxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcbiAgICAgICAgICAgICQoJyNwaXhpLXZpZXcnKS5hZGRDbGFzcygnZnJvbnQnKTtcblxuICAgICAgICAgICAgaW50cm9WaWRlb01vZHVsZS5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dCZWdpblNjcmVlbiwgdGhpcykpO1xuICAgICAgICAgICAgaW50cm9WaWRlb01vZHVsZS5wbGF5VmlkZW8oKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbnRyb1ZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IHJlcXVpcmUoJy4uL3BpeGkvbWFpblNjZW5lJyk7XG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDb2xsZWN0aW9ucyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zJyk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gVmlld3Mgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIEludHJvVmlldyA9IHJlcXVpcmUoJy4vaW50cm9WaWV3Jyk7XG4gICAgdmFyIEVudGVyTmFtZVZpZXcgPSByZXF1aXJlKCcuL2VudGVyTmFtZVZpZXcnKTtcbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IHJlcXVpcmUoJy4vc2VsZWN0Q2hhcmFjdGVyVmlldycpO1xuICAgIHZhciBSZXNwb25zZVZpZXcgPSByZXF1aXJlKCcuL3Jlc3BvbnNlVmlldycpO1xuICAgIHZhciBGb290ZXJWaWV3ID0gcmVxdWlyZSgnLi9mb290ZXJWaWV3Jyk7XG5cblxuXG4gICAgdmFyIE1haW5WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNjb250ZW50JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5uZXh0JzogJ29uTmV4dCcsXG4gICAgICAgICAgICAnY2xpY2sgYS5maW5pc2gtc2VuZCc6ICdvbkZpbmlzaCcsXG4gICAgICAgICAgICAnbW91c2Vtb3ZlJzogJ29uTW91c2VNb3ZlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXggPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcblxuICAgICAgICAgICAgLy9jcmVhdGUgY2FudmFzIGVsZW1lbnRcbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuaW5pdGlhbGl6ZSh0aGlzLiR3aW5kb3cud2lkdGgoKSwgdGhpcy4kd2luZG93LmhlaWdodCgpLCB0aGlzLiRlbCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLmNyZWF0ZVNjZW5lKCdtYWluJywgTWFpblNjZW5lKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0V2luZG93RXZlbnRzKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFdpbmRvd0V2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5pdCB3aW5kb3cgRXZlbnRzJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5vbigncmVzaXplJywgXy5iaW5kKHRoaXMucmVwb3NpdGlvblBhZ2VOYXYsIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW9yaWVudGF0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvcmllbnRhdGlvbicsIGV2ZW50LmJldGEsIGV2ZW50LmdhbW1hKTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW1vdGlvbicpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3Rpb24nLCBldmVudC5hY2NlbGVyYXRpb24ueCAqIDIsIGV2ZW50LmFjY2VsZXJhdGlvbi55ICogMik7XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3ogb3JpZW50YXRpb24nKTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiTW96T3JpZW50YXRpb25cIiwgZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veicsIG9yaWVudGF0aW9uLnggKiA1MCwgb3JpZW50YXRpb24ueSAqIDUwKTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SW50cm9WaWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSBuZXcgSW50cm9WaWV3KCk7XG5cbiAgICAgICAgICAgIGludHJvVmlldy5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dGaXJzdFBhZ2UsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcgPSBpbnRyb1ZpZXc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFBhZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyTW9kZWwgPSBfLmZpcnN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTW9kZWxzID0gXy5yZXN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuXG4gICAgICAgICAgICB2YXIgZW50ZXJOYW1lVmlldyA9IG5ldyBFbnRlck5hbWVWaWV3KCk7XG4gICAgICAgICAgICB2YXIgc2VsZWN0Q2hhclZpZXcgPSBuZXcgU2VsZWN0Q2hhcmFjdGVyVmlldyh7bW9kZWw6IGNoYXJNb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25WaWV3cyA9IF8ubWFwKHF1ZXN0aW9uTW9kZWxzLCBmdW5jdGlvbihxdWVzdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVzdGlvblZpZXcoe21vZGVsOiBxdWVzdGlvbk1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtlbnRlck5hbWVWaWV3LCBzZWxlY3RDaGFyVmlld10uY29uY2F0KHF1ZXN0aW9uVmlld3MpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYucGFnZXMtY3RuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHBhZ2VOYXYgPSB0aGlzLiRwYWdlc0NvbnRhaW5lci5maW5kKCdkaXYucGFnZS1uYXYnKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EubmV4dCcpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZCA9IHRoaXMuJHBhZ2VOYXYuZmluZCgnYS5maW5pc2gtc2VuZCcpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogQ2hhbmdlIFZpZXcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0ZpcnN0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzWzBdLnNob3coKTtcblxuICAgICAgICAgICAgdGhpcy4kbmV4dC5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kbmV4dCwgMC4zLCB7b3BhY2l0eTogMX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vaGlkZSBhY3RpdmUgcGFnZVxuICAgICAgICAgICAgdmFyIGFjdGl2ZVBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdih0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1BhZ2VBZnRlckhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9zaG93IG5leHQgcGFnZVxuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICBuZXh0UGFnZS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNldENvdW50ZXIodGhpcy5hY3RpdmVQYWdlSW5kZXgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gdGhpcy5wYWdlcy5sZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmlzaEJ0bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaG93RmluaXNoQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQW5kU2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5oaWRlQ291bnRlcigpO1xuXG4gICAgICAgICAgICB2YXIgcGFnZU1vZGVscyA9IF8ubWFwKHRoaXMucGFnZXMsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5tb2RlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2V0UmVzcG9uc2UocGFnZU1vZGVscyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUub25Vc2VyQ2hhcmFjdGVyT3V0KF8uYmluZCh0aGlzLnNjZW5lLnBsYXlXaXBlc2NyZWVuLCB0aGlzLnNjZW5lKSk7XG5cbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLm9uV2lwZXNjcmVlbkNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgbWUuJGJhY2tncm91bmRzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBtZS5yZXNwb25zZVZpZXcuc2hvdygpO1xuICAgICAgICAgICAgICAgIG1lLnNjZW5lLnNob3dSZXNwb25zZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vc2V0IGNhbnZhcyB0byBiZSBpbiBmcm9udCBvZiB0cmVlc1xuLy8gICAgICAgICAgICAkKCcjcGl4aS12aWV3JykuYWRkQ2xhc3MoJ21pZGRsZScpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFuaW1hdGVPdXRVc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcG9zaXRpb25QYWdlTmF2OiBmdW5jdGlvbihhbmltYXRlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlUGFnZSA9IHRoaXMucGFnZXNbdGhpcy5hY3RpdmVQYWdlSW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgcGl4ZWxQb3NpdGlvbiA9IChhY3RpdmVQYWdlLiRlbC5vZmZzZXQoKS50b3AgKyBhY3RpdmVQYWdlLiRlbC5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSB0aGlzLiR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIHZhciB0b3BGcmFjID0gTWF0aC5taW4ocGl4ZWxQb3NpdGlvbi93aW5kb3dIZWlnaHQsICh3aW5kb3dIZWlnaHQgLSB0aGlzLmZvb3Rlci5oZWlnaHQoKSAtIHRoaXMuJHBhZ2VOYXYub3V0ZXJIZWlnaHQoKSkvd2luZG93SGVpZ2h0KTtcblxuICAgICAgICAgICAgdmFyIHBlcmNUb3AgPSAxMDAgKiB0b3BGcmFjICsgJyUnO1xuXG4gICAgICAgICAgICBpZighIWFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcy4kcGFnZU5hdiwgMC4yLCB7dG9wOiBwZXJjVG9wLCBlYXNlOidRdWFkLmVhc2VJbk91dCd9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2LmNzcygndG9wJywgcGVyY1RvcCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGludHJvVmlldyA9IHRoaXMuaW50cm9WaWV3O1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGludHJvVmlldy5zdGFydCgpOyAvL3N0YXJ0IGludHJvXG5cbiAgICAgICAgICAgICAgICAvL3RyaWdnZXIgd2luZG93IHJlc2l6ZVxuICAgICAgICAgICAgICAgIHNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25OZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5maW5pc2hBbmRTZW5kKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VNb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzKGUucGFnZVgvdGhpcy4kd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluVmlldztcblxuXG5cbn0pKCk7IiwiXG5cbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMnKTtcbnZhciBpdGVtQW5pbWF0aW9uc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFnZUl0ZW1zJyk7XG5cbnZhciBRdWVzdGlvblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgLy8gVmFyaWFibGVzXG4gICAgY2xhc3NOYW1lOiAncXVlc3Rpb24gcGFnZScsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBpbnB1dFt0eXBlPXJhZGlvXSc6ICdvblJhZGlvQ2hhbmdlJ1xuICAgIH0sXG4gICAgLy8gRnVuY3Rpb25zXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIG9wdGlvbnMucGFyZW50LmFwcGVuZCh0aGlzLmVsKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuXG4gICAgICAgIHRoaXMuJG9wdGlvbnMgPSB0aGlzLiRlbC5maW5kKCdkaXYub3B0aW9uJyk7XG5cbiAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9ucyh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuY2xhc3MpO1xuICAgIH0sXG4gICAgaW5pdEFuaW1hdGlvbnM6IGZ1bmN0aW9uKHF1ZXN0aW9uVHlwZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB2YXIgYW5pbWF0aW9ucztcblxuICAgICAgICBpZihxdWVzdGlvblR5cGUgPT09ICdjYW5uZWQnKSB7XG4gICAgICAgICAgICBhbmltYXRpb25zID0gaXRlbUFuaW1hdGlvbnNNb2R1bGUuZ2V0UmFuZG9tQ2FubmVkQW5pbWF0aW9ucyh0aGlzLiRvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSBpdGVtQW5pbWF0aW9uc01vZHVsZS5nZXRSYW5kb21QZXJzb25hbGl0eUFuaW1hdGlvbnModGhpcy4kb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluID0gYW5pbWF0aW9uc1swXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25PdXQgPSBhbmltYXRpb25zWzFdO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uT3V0LnZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy5oaWRlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH0sXG4gICAgc2V0QW5pbWF0aW9uSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuZWwuaW5uZXJIVE1MID09PSAnJylcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25Jbi5wbGF5KCk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbk91dC5wbGF5KCk7XG4gICAgfSxcbiAgICBvbkhpZGVDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBvblJhZGlvQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KHt2YWx1ZTogZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgndmFsdWUnKX0pO1xuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjcmVzcG9uc2UnLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy90aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5jcmVhdGVTY2VuZSgncmVzcG9uc2UnLCBSZXNwb25zZVNjZW5lKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZXNwb25zZTogZnVuY3Rpb24obW9kZWxzKSB7XG5cbiAgICAgICAgICAgIHZhciBuYW1lTW9kZWwgPSBfLmZpcnN0KG1vZGVscyk7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aXRpb25lZFF1ZXN0aW9ucyA9IF8ucGFydGl0aW9uKF8ucmVzdChtb2RlbHMpLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbC5hdHRyaWJ1dGVzLmNsYXNzICE9PSAnY2FubmVkJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1swXTtcbiAgICAgICAgICAgIHZhciBjYW5uZWRNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1sxXTtcblxuXG5cblxuICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHRvIGFjdHVhbCBnZW5lcmF0ZWQgcmVzcG9uc2VcbiAgICAgICAgICAgIHZhciBodG1sID0gJ05hbWU6ICcgKyBuYW1lTW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxici8+JztcblxuICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24oc3RyLCBtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyBtb2RlbC5hdHRyaWJ1dGVzLm5hbWUgKyAnOiAnICsgbW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG4gICAgICAgICAgICB9LCAnJyk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxici8+JztcblxuICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKHN0ciwgbW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgbW9kZWwuYXR0cmlidXRlcy5uYW1lICsgJzogJyArIG1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgKyAnPGJyLz4nO1xuICAgICAgICAgICAgfSwgJycpO1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKGh0bWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuXG4gICAgICAgICAgICAvL3NjZW5lc01hbmFnZXIuZ29Ub1NjZW5lKCdyZXNwb25zZScpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG5cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zZVZpZXc7XG59KSgpOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgc291bmRQbGF5ZXIgPSByZXF1aXJlKCcuLi9zb3VuZFBsYXllcicpO1xuICAgIHZhciBhdWRpb0Fzc2V0cyA9IHJlcXVpcmUoJy4uL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xuXG4gICAgdmFyIFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3Jyk7XG5cblxuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gUXVlc3Rpb25WaWV3LmV4dGVuZCh7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZVBhdGggPSBhdWRpb0Fzc2V0c1tlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpXTtcblxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheShmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
