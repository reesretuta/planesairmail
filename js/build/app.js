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
},{"../pixi/character":18,"./placeJustOffscreen":7}],4:[function(require,module,exports){


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

function getDustyBlinkTextures() {
    return PIXI.getTextures('dusty_blink_', 1, 17);
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

//    var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
    var dustyIdleAnimation = PIXI.Sprite.fromImage('assets/img/dusty2.png');
//    var dustyBlinkAnimation = new PIXI.MovieClip(getDustyBlinkTextures());

    dustyIdleAnimation.anchor = {x: 650/1200, y: 340/638};
//    dustyBlinkAnimation.anchor = {x: 0.5, y: 0.5};

    dusty.setIdleState(dustyIdleAnimation);
//    dusty.addState('blink', dustyBlinkAnimation);

//    dusty.windowScale = 900/1366;
    dusty.windowScale = 700/1366;
    dusty.windowX = 0.15;
    dusty.windowY = -1;

    var blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 0;

    dusty.filters = [blurFilter];

    return dusty;
}

function initializeDipper() {
    var dipper = new Character('Dipper');

    var dipperIdleState = PIXI.Sprite.fromImage("assets/img/dipper.png");

    dipperIdleState.anchor = {
        x: 440/865,
        y: 310/433
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
        windowY: 0.32,
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

//    timeline.add(TweenLite.to(dusty, animationTime, {
//        animationScaleX: 1.3,
//        animationScaleY: 1.3,
//        windowY: -0.3,
//        windowX: 0.6,
//        rotation: -0.2
//    }), 0);
//
//    timeline.add(TweenLite.to(blurFilter, animationTime/5, {
//        blur: 10,
//        ease: easing
//    }), 0);

    timeline.add(TweenLite.to(dusty, animationTime, {
        animationScaleX: 1.2,
        animationScaleY: 1.2,
        windowY: 0.24,
        windowX: -0.3,
        ease: easing
    }));

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
},{"../pixi/character":18,"./placeJustOffscreen":7}],5:[function(require,module,exports){




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
},{"../pixi/character":18,"./placeJustOffscreen":7}],7:[function(require,module,exports){

module.exports = function(character) {
    var height = character.scale.y * character.getLocalBounds().height;

    character.windowY = -(height/2)/$(window).height();
};
},{}],8:[function(require,module,exports){




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
},{"../pixi/character":18}],9:[function(require,module,exports){



var Question = require('../models/question');


var QuestionCollection = Backbone.Collection.extend({
    model: Question
});




module.exports = QuestionCollection;
},{"../models/question":17}],10:[function(require,module,exports){




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

},{"../data/cannedQuestions.json":13,"../data/characterSelect.json":14,"../data/personalityQuestions.json":15,"./QuestionCollection":9}],11:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){




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

app.assetLoader = new AssetLoadingView({onComplete: app.render});


$(app.render);


//TODO: Delete!!
//$(function() {
//    "use strict";
//
//    var password = 'disneyPlanesTwo';
//    var $passwordScreen = $('#passwordScreen');
//
//    var $passwordInput = $passwordScreen.find('input[type=password]');
//
//
//    $passwordScreen.find('form').submit(function(e) {
//        e.preventDefault();
//
//        if($passwordInput.val() === password) {
//            $passwordScreen.fadeOut(50);
//
//            app.assetLoader = new AssetLoadingView({onComplete: app.render});
//        }
//    });
//});


module.exports = app;




},{"./pixi/libModifications":21,"./views/assetLoadingView":27,"./views/mainView":31}],17:[function(require,module,exports){



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
},{}],18:[function(require,module,exports){

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
},{"./extend":19}],19:[function(require,module,exports){

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
},{}],20:[function(require,module,exports){


(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');

    var introVideoModule = require('../animations/introVideo');

    // ============================================================ //
    /* **************** Intro Pixi Animation Class **************** */
    // ============================================================ //

    var IntroScene = function() {
        Scene.apply(this, arguments); //parent constructor

        initializeMask(this);

        introVideoModule.initialize(this);
        this.introVideo = introVideoModule.getVideo();
    };

    // ============================================================ //
    /* ****************** Public API Functions ******************** */
    // ============================================================ //

    IntroScene.prototype.open = function() {
        //this.timelineOpen.play();
    };

    //set on complete function for animation timeline
    IntroScene.prototype.onComplete = function(callback) {
        introVideoModule.onComplete(callback);
    };


    IntroScene.prototype.setView = function(view) {
        this.view = view;
    };

    IntroScene.prototype._onWindowResize = function(width, height) {
        Scene.prototype._onWindowResize.call(this, width, height);

        if(!_.isUndefined(this.view)) {
            var scale = this.introVideo.scale;
            var bounds = this.introVideo.getLocalBounds();

            this.view.onWindowResize(width, height, (bounds.width * scale.x), (bounds.height * scale.y));
        }
    };


    // ============================================================ //
    /* ********************** Initialization ********************** */
    // ============================================================ //


    function initializeMask(scene) {

    }

    function initializeBackgroundColor(scene) {

    }



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //


    // Extends Scene Class
    extend(Scene, IntroScene);

    module.exports = IntroScene;


})();




},{"../animations/introVideo":5,"./extend":19,"./scene":23}],21:[function(require,module,exports){
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
},{"../animations/background":1,"../animations/bladewipe":2,"../animations/characterModule":3,"../animations/dustyDipper":4,"../animations/introVideo":5,"../animations/parachuters":6,"../animations/response":8,"./extend":19,"./scene":23}],23:[function(require,module,exports){



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
},{"./extend":19}],24:[function(require,module,exports){

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

            this.scene.startEnterNameAnimation();
        },

        // ============================================================ //
        /* ************************ Show/Hide ************************* */
        // ============================================================ //
        show: function () {
            this.$el.addClass('active');

            scenesManager.goToScene('main');

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
            this.model.set({value: this.$nameInput.val()});
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
    var IntroScene = require('../pixi/introScene');

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
                },
                onStartScope: this
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
},{"../animations/introVideo":5,"../pixi/introScene":20,"../pixi/scenesManager":24}],31:[function(require,module,exports){

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

            var $backgrounds = this.$el.find('> div.background');
            this.$backgrounds = $backgrounds;
            this.$background = $backgrounds.filter('.back');
            this.$middleground = $backgrounds.filter('.middle');
            this.$foreground = $backgrounds.filter('.front');

            this.$pageNav = this.$pagesContainer.find('div.page-nav');
            this.$next = this.$pageNav.find('a.next');
            this.$finishSend = this.$pageNav.find('a.finish-send');
        },


        // ==================================================================== //
        /* *********************** Change View Functions ********************** */
        // ==================================================================== //
        showFirstPage: function() {
            this.pages[0].show();

            this.$next.addClass('active');
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
                me.$backgrounds.hide();
                me.responseView.show();
                me.scene.showResponse();
            });

            //set canvas to be in front of trees
            $('#pixi-view').addClass('middle');

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
    },
    hide: function() {
        this.$el.removeClass('active');

        if(_.isFunction(this.hideCallback)) {
            this.hideCallback();
        }
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
},{"../templates/question.hbs":26}],33:[function(require,module,exports){




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
},{"../data/audioAssets.json":12,"../soundPlayer":25,"./questionView":32}],35:[function(require,module,exports){
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

},{"handlebars/runtime":41}]},{},[16])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2JhY2tncm91bmQuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2FuaW1hdGlvbnMvYmxhZGV3aXBlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL2NoYXJhY3Rlck1vZHVsZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9kdXN0eURpcHBlci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9pbnRyb1ZpZGVvLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3BhcmFjaHV0ZXJzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9hbmltYXRpb25zL3BsYWNlSnVzdE9mZnNjcmVlbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvYW5pbWF0aW9ucy9yZXNwb25zZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvY29sbGVjdGlvbnMvUXVlc3Rpb25Db2xsZWN0aW9uLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9hbGxRdWVzdGlvbnMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvYXNzZXRzLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2RhdGEvYXVkaW9Bc3NldHMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9jYW5uZWRRdWVzdGlvbnMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9jaGFyYWN0ZXJTZWxlY3QuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9wZXJzb25hbGl0eVF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9mYWtlXzUwNTE5ODk2LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9tb2RlbHMvcXVlc3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvY2hhcmFjdGVyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2V4dGVuZC5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9pbnRyb1NjZW5lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2xpYk1vZGlmaWNhdGlvbnMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvbWFpblNjZW5lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL3NjZW5lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL3NjZW5lc01hbmFnZXIuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3NvdW5kUGxheWVyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb24uaGJzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9hc3NldExvYWRpbmdWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9lbnRlck5hbWVWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9mb290ZXJWaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9pbnRyb1ZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL21haW5WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9xdWVzdGlvblZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3Jlc3BvbnNlVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3Mvc2VsZWN0Q2hhcmFjdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9iYXNlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvZXhjZXB0aW9uLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvdXRpbHMuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgYmFja2dyb3VuZCwgbWlkZGxlZ3JvdW5kLCBmb3JlZ3JvdW5kO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgYmFja2dyb3VuZCA9IGluaXRCYWNrZ3JvdW5kKCk7XG4gICAgbWlkZGxlZ3JvdW5kID0gaW5pdE1pZGRsZWdyb3VuZCgpO1xuICAgIGZvcmVncm91bmQgPSBpbml0Rm9yZWdyb3VuZCgpO1xuXG4gICAgY29uc29sZS5sb2coJ3dpbmRvdyB3aWR0aCcsICQod2luZG93KS53aWR0aCgpKTtcbn1cbmZ1bmN0aW9uIHNldEF0dHJzKHNwcml0ZSkge1xuICAgIHNwcml0ZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCguNSwgMSk7XG4gICAgc3ByaXRlLndpbmRvd1ggPSAwLjU7XG4gICAgc3ByaXRlLndpbmRvd1kgPSAxO1xuXG4gICAgc3ByaXRlLnNjYWxlVHlwZSA9ICdjb3Zlcic7XG4gICAgc3ByaXRlLndpbmRvd1NjYWxlID0gMS4wNjtcbn1cbmZ1bmN0aW9uIGluaXRCYWNrZ3JvdW5kKCkge1xuICAgIHZhciBiYWNrZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL3NpdGVfYmcuanBnJyk7XG5cbiAgICBzZXRBdHRycyhiYWNrZ3JvdW5kKTtcblxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xufVxuZnVuY3Rpb24gaW5pdE1pZGRsZWdyb3VuZCgpIHtcbiAgICB2YXIgbWlkZGxlZ3JvdW5kID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKCdhc3NldHMvaW1nL21pZGdyb3VuZC5wbmcnKTtcbiAgICBzZXRBdHRycyhtaWRkbGVncm91bmQpO1xuICAgIHJldHVybiBtaWRkbGVncm91bmQ7XG59XG5mdW5jdGlvbiBpbml0Rm9yZWdyb3VuZCgpIHtcbiAgICB2YXIgZm9yZWdyb3VuZCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZycpO1xuICAgIHNldEF0dHJzKGZvcmVncm91bmQpO1xuICAgIHJldHVybiBmb3JlZ3JvdW5kO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0pLFxuICAgIGFkZEJhY2tncm91bmRUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbiAgICB9LFxuICAgIGFkZFJlc3RUb1NjZW5lOiBmdW5jdGlvbihzY2VuZSkge1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChtaWRkbGVncm91bmQpO1xuICAgICAgICBzY2VuZS5hZGRDaGlsZChmb3JlZ3JvdW5kKTtcbiAgICB9LFxuICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICB2YXIgYmFja2dyb3VuZFJhdGlvID0gMC43NTtcbiAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFJhdGlvID0gMS41O1xuICAgICAgICB2YXIgZm9yZWdyb3VuZFJhdGlvID0gMztcblxuICAgICAgICB2YXIgYmFja2dyb3VuZFggPSAwLjUgLSAoeCAtIDAuNSkgKiBiYWNrZ3JvdW5kUmF0aW8vNTA7XG4gICAgICAgIHZhciBtaWRkbGVncm91bmRYID0gMC41IC0gKHggLS41KSAqIG1pZGRsZWdyb3VuZFJhdGlvLzUwO1xuICAgICAgICB2YXIgZm9yZWdyb3VuZFggPSAwLjUgLSAoeCAtLjUpICogZm9yZWdyb3VuZFJhdGlvLzUwO1xuXG4gICAgICAgIGJhY2tncm91bmQud2luZG93WCA9IGJhY2tncm91bmRYO1xuICAgICAgICBtaWRkbGVncm91bmQud2luZG93WCA9IG1pZGRsZWdyb3VuZFg7XG4gICAgICAgIGZvcmVncm91bmQud2luZG93WCA9IGZvcmVncm91bmRYO1xuICAgIH1cblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB3aXBlc2NyZWVuVmlkZW8sIHZpZGVvVGltZWxpbmU7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICB3aXBlc2NyZWVuVmlkZW8gPSBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpO1xuICAgIHZpZGVvVGltZWxpbmUgPSBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh3aXBlc2NyZWVuVmlkZW8pO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbigpIHtcbiAgICB2YXIgdGV4dHVyZXMgPSBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODYnLCA0MDAsIDU1Nik7XG5cbiAgICB2YXIgd2lwZXNjcmVlblZpZGVvID0gbmV3IFBJWEkuTW92aWVDbGlwKHRleHR1cmVzKTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WSA9IDAuNTtcbiAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93U2NhbGUgPSAxO1xuICAgIHdpcGVzY3JlZW5WaWRlby5zY2FsZVR5cGUgPSAnY292ZXInO1xuXG4gICAgd2lwZXNjcmVlblZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIHdpcGVzY3JlZW5WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICByZXR1cm4gd2lwZXNjcmVlblZpZGVvO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh2aWRlbykge1xuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbmZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUodmlkZW8pIHtcbiAgICB2YXIgZnBzID0gMjQ7XG4gICAgdmFyIG51bUZyYW1lcyA9IHZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgIHZhciBhbmltYXRpb25UaW1lID0gbnVtRnJhbWVzL2ZwcztcbiAgICB2YXIgZWFzaW5nID0gbmV3IFN0ZXBwZWRFYXNlKG51bUZyYW1lcyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdmlkZW8udHdlZW5GcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8odmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcblxuICAgIHRpbWVsaW5lLmFkZExhYmVsKCdjYWxsYmFjaycsIHRpbWVsaW5lLmR1cmF0aW9uKCkpO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgMC4yLCB7XG4gICAgICAgIGFscGhhOiAwXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbnZhciBhbmltYXRpb25Nb2R1bGUgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHdpcGVzY3JlZW5WaWRlbyk7XG4gICAgfSxcbiAgICBwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLnBsYXkoMCk7XG4gICAgfSxcbiAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgb25WaWRlb0NvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2aWRlb1RpbWVsaW5lLmFkZChjYWxsYmFjaywgJ2NhbGxiYWNrJyk7XG4gICAgfVxufTtcblxuXG5cblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXG5cblxuXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKCcuLi9waXhpL2NoYXJhY3RlcicpO1xudmFyIHBsYWNlSnVzdE9mZnNjcmVlbiA9IHJlcXVpcmUoJy4vcGxhY2VKdXN0T2Zmc2NyZWVuJyk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiBIZWxwZXIgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGdldER1c3R5SWRsZVRleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAnLCAwLCAxMik7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciBjaGFyLCBhbGxDaGFyYWN0ZXJzLCBkaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGFsbENoYXJhY3RlcnMgPSB7XG4gICAgICAgIGR1c3R5OiBpbml0RHVzdHkoKSxcbiAgICAgICAgYmxhZGVyYW5nZXI6IGluaXRCbGFkZSgpLFxuICAgICAgICBjYWJiaWU6IGluaXRDYWJiaWUoKSxcbiAgICAgICAgZGlwcGVyOiBpbml0RGlwcGVyKCksXG4gICAgICAgIHdpbmRsaWZ0ZXI6IGluaXRXaW5kbGlmdGVyKClcbiAgICB9O1xuXG4gICAgY2hhciA9IGFsbENoYXJhY3RlcnMuZHVzdHk7XG5cbiAgICBkaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gICAgXy5lYWNoKGFsbENoYXJhY3RlcnMsIGZ1bmN0aW9uKGNoKSB7XG4gICAgICAgIGRpc3BsYXlPYmplY3RDb250YWluZXIuYWRkQ2hpbGQoY2gpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0RHVzdHkoKSB7XG4gICAgdmFyIGR1c3R5ID0gbmV3IENoYXJhY3RlcignRHVzdHknKTtcblxuICAgIHZhciBkdXN0eUlkbGVBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSk7XG4gICAgZHVzdHlJZGxlQW5pbWF0aW9uLmFuY2hvciA9IHt4OiAwLjUsIHk6IDQwNS85ODN9O1xuICAgIGR1c3R5LnNldElkbGVTdGF0ZShkdXN0eUlkbGVBbmltYXRpb24pO1xuXG4gICAgZHVzdHkud2luZG93U2NhbGUgPSA4NTAvMTM2NjtcbiAgICBkdXN0eS53aW5kb3dYID0gMC4yNTtcbiAgICBkdXN0eS53aW5kb3dZID0gLTE7XG5cbiAgICByZXR1cm4gZHVzdHk7XG59XG5mdW5jdGlvbiBpbml0QmxhZGUoKSB7XG4gICAgdmFyIGJsYWRlID0gbmV3IENoYXJhY3RlcignQmxhZGUnKTtcblxuICAgIHJldHVybiBibGFkZTtcbn1cbmZ1bmN0aW9uIGluaXRDYWJiaWUoKSB7XG4gICAgdmFyIGNhYmJpZSA9IG5ldyBDaGFyYWN0ZXIoJ0NhYmJpZScpO1xuXG4gICAgcmV0dXJuIGNhYmJpZTtcbn1cbmZ1bmN0aW9uIGluaXREaXBwZXIoKSB7XG4gICAgdmFyIGRpcHBlciA9IG5ldyBDaGFyYWN0ZXIoJ0RpcHBlcicpO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cbmZ1bmN0aW9uIGluaXRXaW5kbGlmdGVyKCkge1xuICAgIHZhciB3aW5kbGlmdGVyID0gbmV3IENoYXJhY3RlcignV2luZGxpZnRlcicpO1xuXG4gICAgcmV0dXJuIHdpbmRsaWZ0ZXI7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gYW5pbWF0ZUluKCkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS44O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihjaGFyKTtcbiAgICBjaGFyLndpbmRvd1ggPSAwLjY7XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGNoYXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMC4zLFxuICAgICAgICB3aW5kb3dYOiAwLjI1LFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KTtcbn1cblxudmFyIG9uQW5pbWF0aW9uT3V0Q2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbmZ1bmN0aW9uIGFuaW1hdGVPdXQoKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjg7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhjaGFyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMjUsXG4gICAgICAgIHdpbmRvd1g6IC0wLjQsXG4gICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgb25Db21wbGV0ZTogb25BbmltYXRpb25PdXRDYWxsYmFja1xuICAgIH0pO1xufVxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuICAgIH0pLFxuICAgIGFuaW1hdGVJbjogYW5pbWF0ZUluLFxuICAgIGFuaW1hdGVPdXQ6IGFuaW1hdGVPdXQsXG4gICAgb25BbmltYXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgb25BbmltYXRpb25PdXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgc2V0Q2hhcmFjdGVyOiBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICAgICAgY2hhciA9IGFsbENoYXJhY3RlcnNbY2hhcmFjdGVyXTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgZHVzdHksIGRpcHBlciwgdGltZWxpbmVJbiwgdGltZWxpbmVPdXQ7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqIEhlbHBlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2V0RHVzdHlJZGxlVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvdHdvL0R1c3R5X3BsYW5lX2xpZ2h0XzAwMCcsIDAsIDEyKTtcbn1cblxuZnVuY3Rpb24gZ2V0RHVzdHlCbGlua1RleHR1cmVzKCkge1xuICAgIHJldHVybiBQSVhJLmdldFRleHR1cmVzKCdkdXN0eV9ibGlua18nLCAxLCAxNyk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgZHVzdHkgPSBpbml0aWFsaXplRHVzdHkoKTtcbiAgICBkaXBwZXIgPSBpbml0aWFsaXplRGlwcGVyKCk7XG5cbiAgICB0aW1lbGluZUluID0gZ2VuZXJhdGVBbmltYXRpb25JblRpbWVsaW5lKCk7XG4gICAgdGltZWxpbmVPdXQgPSBnZW5lcmF0ZUFuaW1hdGlvbk91dFRpbWVsaW5lKCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEdXN0eSgpIHtcbiAgICB2YXIgZHVzdHkgPSBuZXcgQ2hhcmFjdGVyKCdEdXN0eScpO1xuXG4vLyAgICB2YXIgZHVzdHlJZGxlQW5pbWF0aW9uID0gbmV3IFBJWEkuTW92aWVDbGlwKGdldER1c3R5SWRsZVRleHR1cmVzKCkpO1xuICAgIHZhciBkdXN0eUlkbGVBbmltYXRpb24gPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJ2Fzc2V0cy9pbWcvZHVzdHkyLnBuZycpO1xuLy8gICAgdmFyIGR1c3R5QmxpbmtBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlCbGlua1RleHR1cmVzKCkpO1xuXG4gICAgZHVzdHlJZGxlQW5pbWF0aW9uLmFuY2hvciA9IHt4OiA2NTAvMTIwMCwgeTogMzQwLzYzOH07XG4vLyAgICBkdXN0eUJsaW5rQW5pbWF0aW9uLmFuY2hvciA9IHt4OiAwLjUsIHk6IDAuNX07XG5cbiAgICBkdXN0eS5zZXRJZGxlU3RhdGUoZHVzdHlJZGxlQW5pbWF0aW9uKTtcbi8vICAgIGR1c3R5LmFkZFN0YXRlKCdibGluaycsIGR1c3R5QmxpbmtBbmltYXRpb24pO1xuXG4vLyAgICBkdXN0eS53aW5kb3dTY2FsZSA9IDkwMC8xMzY2O1xuICAgIGR1c3R5LndpbmRvd1NjYWxlID0gNzAwLzEzNjY7XG4gICAgZHVzdHkud2luZG93WCA9IDAuMTU7XG4gICAgZHVzdHkud2luZG93WSA9IC0xO1xuXG4gICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgIGR1c3R5LmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG5cbiAgICByZXR1cm4gZHVzdHk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEaXBwZXIoKSB7XG4gICAgdmFyIGRpcHBlciA9IG5ldyBDaGFyYWN0ZXIoJ0RpcHBlcicpO1xuXG4gICAgdmFyIGRpcHBlcklkbGVTdGF0ZSA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvZGlwcGVyLnBuZ1wiKTtcblxuICAgIGRpcHBlcklkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDQ0MC84NjUsXG4gICAgICAgIHk6IDMxMC80MzNcbiAgICB9O1xuXG4gICAgZGlwcGVyLnNldElkbGVTdGF0ZShkaXBwZXJJZGxlU3RhdGUpO1xuXG4gICAgZGlwcGVyLndpbmRvd1ggPSAwLjc1O1xuICAgIGRpcHBlci53aW5kb3dZID0gLTE7XG4gICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuNDA7XG5cbiAgICBkaXBwZXIud2luZG93U2NhbGUgPSA4NjUvMTM2NjtcbiAgICBkaXBwZXIuYW5pbWF0aW9uU2NhbGVYID0gMC43O1xuICAgIGRpcHBlci5hbmltYXRpb25TY2FsZVkgPSAwLjc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICBibHVyRmlsdGVyLmJsdXIgPSAxMDtcblxuICAgIGRpcHBlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgcmV0dXJuIGRpcHBlcjtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgSW4gKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkluVGltZWxpbmUoKSB7XG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgdGltZWxpbmVEdXN0eUluID0gZ2VuZXJhdGVUaW1lbGluZUR1c3R5SW4oZHVzdHkpO1xuXG4gICAgdGltZWxpbmUuYWRkKHRpbWVsaW5lRHVzdHlJbi5wbGF5KCksIDApO1xuICAgIHRpbWVsaW5lLmFkZChnZW5lcmF0ZVRpbWVsaW5lRHVzdHlIb3ZlcihkdXN0eSkucGxheSgpLCB0aW1lbGluZUR1c3R5SW4uZHVyYXRpb24oKSk7XG5cbiAgICB0aW1lbGluZS5hZGQoZ2VuZXJhdGVUaW1lbGluZURpcHBlckluKGRpcHBlcikucGxheSgpLCAwLjQpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRHVzdHlJbihkdXN0eSkge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgIHZhciBlYXNpbmcgPSAnQ3ViaWMuZWFzZUluT3V0JztcblxuICAgIHZhciBvZ0F0dHJpYnV0ZXMgPSBfLnBpY2soZHVzdHksICd3aW5kb3dYJywgJ3dpbmRvd1NjYWxlJyk7XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGR1c3R5KTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGR1c3R5LCBvZ0F0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuNTIsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pLCAwKTtcblxuICAgIHJldHVybiB0aW1lbGluZTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmVEdXN0eUhvdmVyKGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxO1xuICAgIHZhciBlYXNpbmcgPSAnUXVhZC5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICByZXBlYXQ6IC0xXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAtMTUsXG4gICAgICAgIGVhc2U6IGVhc2luZ1xuICAgIH0pKTtcbiAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIGJ1bXBZOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lRGlwcGVySW4oZGlwcGVyKSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjA7XG4gICAgdmFyIHN3ZWVwU3RhcnRUaW1lID0gYW5pbWF0aW9uVGltZSAqIDAuMTE7XG4gICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgdmFyIG9nQXR0cmlidXRlcyA9IF8ucGljayhkaXBwZXIsICd3aW5kb3dYJywgJ3JvdGF0aW9uJywgJ3dpbmRvd1NjYWxlJywgJ2FuaW1hdGlvblNjYWxlWCcsICdhbmltYXRpb25TY2FsZVknKTtcblxuICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGxhY2VKdXN0T2Zmc2NyZWVuKGRpcHBlcik7XG4gICAgICAgICAgICBfLmV4dGVuZChkaXBwZXIsIG9nQXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1k6IDAuMzIsXG4gICAgICAgIGVhc2U6ICdCYWNrLmVhc2VPdXQnXG4gICAgfSksIDApO1xuXG4gICAgLy9zd2VlcCByaWdodFxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgIHdpbmRvd1g6IDAuODYsXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgc3dlZXBTdGFydFRpbWUpO1xuXG4gICAgLy8gc2NhbGUgdXBcbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSArIHN3ZWVwU3RhcnRUaW1lLCB7XG4gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMSxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG4gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgYmx1cjogMCxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGUgT3V0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25PdXRUaW1lbGluZSgpIHtcbiAgICB2YXIgdGltZWxpbmVPdXQgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgICAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKS5wbGF5KCksIDApO1xuICAgICAgICB0aW1lbGluZU91dC5hZGQoZ2VuZXJhdGVBbmltYXRpb25EdXN0eU91dChkdXN0eSkucGxheSgpLCAwKTtcblxuICAgcmV0dXJuIHRpbWVsaW5lT3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkRpcHBlck91dChkaXBwZXIpIHtcbiAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuNjtcbiAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGRpcHBlci5maWx0ZXJzWzBdO1xuXG4gICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuNCxcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLjQsXG4gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4gICAgICAgIHdpbmRvd1g6IDEuMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSksIDApO1xuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZS8yLCB7XG4gICAgICAgIGJsdXI6IDEwLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSwgMCk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KSB7XG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjQ7XG4gICAgdmFyIGVhc2luZyA9ICdDaXJjLmVhc2VJbk91dCc7XG5cbiAgICB2YXIgYmx1ckZpbHRlciA9IGR1c3R5LmZpbHRlcnNbMF07XG5cbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICB9KTtcblxuLy8gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuLy8gICAgICAgIGFuaW1hdGlvblNjYWxlWDogMS4zLFxuLy8gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS4zLFxuLy8gICAgICAgIHdpbmRvd1k6IC0wLjMsXG4vLyAgICAgICAgd2luZG93WDogMC42LFxuLy8gICAgICAgIHJvdGF0aW9uOiAtMC4yXG4vLyAgICB9KSwgMCk7XG4vL1xuLy8gICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lLzUsIHtcbi8vICAgICAgICBibHVyOiAxMCxcbi8vICAgICAgICBlYXNlOiBlYXNpbmdcbi8vICAgIH0pLCAwKTtcblxuICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZHVzdHksIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLjIsXG4gICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS4yLFxuICAgICAgICB3aW5kb3dZOiAwLjI0LFxuICAgICAgICB3aW5kb3dYOiAtMC4zLFxuICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gdGltZWxpbmU7XG59XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGRpcHBlcik7XG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGR1c3R5KTtcbiAgICB9KSxcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lbGluZUluLnBsYXkoMCk7XG4gICAgfSxcbiAgICBhbmltYXRlT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZWxpbmVPdXQucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uSW5Db21wbGV0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGltZWxpbmVJbi52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9LFxuICAgIG9uQW5pbWF0aW9uT3V0Q29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRpbWVsaW5lT3V0LnZhcnMub25Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbk1vZHVsZTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbmZ1bmN0aW9uIGdldEludHJvVGV4dHVyZXMoKSB7XG4gICAgcmV0dXJuIFBJWEkuZ2V0VGV4dHVyZXMoJ2Fzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMCcsIDAsIDEyMik7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbnZhciB2aWRlbywgdmlkZW9UaW1lbGluZTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHZpZGVvID0gaW5pdGlhbGl6ZVZpZGVvKCk7XG4gICAgdmlkZW9UaW1lbGluZSA9IGluaXRpYWxpemVWaWRlb1RpbWVsaW5lKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvKHNjZW5lKSB7XG4gICAgdmFyIGludHJvVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0SW50cm9UZXh0dXJlcygpKTtcblxuICAgIGludHJvVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICBpbnRyb1ZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgaW50cm9WaWRlby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XG5cbiAgICBpbnRyb1ZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICBpbnRyb1ZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgIGludHJvVmlkZW8uc2NhbGVNaW4gPSAxO1xuICAgIGludHJvVmlkZW8uc2NhbGVNYXggPSAyO1xuICAgIGludHJvVmlkZW8ud2luZG93U2NhbGUgPSAwLjY7XG5cbiAgICByZXR1cm4gaW50cm9WaWRlbztcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodmlkZW8pIHtcblxuICAgIHZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2aWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHdlZW5GcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHdlZW5GcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbyk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZSh2aWRlbykge1xuICAgIHZhciBmcHMgPSAyNDtcbiAgICB2YXIgbnVtRnJhbWVzID0gdmlkZW8udGV4dHVyZXMubGVuZ3RoO1xuXG4gICAgdmFyIGFuaW1hdGlvblRpbWUgPSBudW1GcmFtZXMvZnBzO1xuICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZUxpdGUoe1xuICAgICAgICBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB2aWRlby50d2VlbkZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUuYXBwZW5kKFR3ZWVuTGl0ZS50byh2aWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICB0d2VlbkZyYW1lOiBudW1GcmFtZXMtMSxcbiAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRpbWVsaW5lO1xufVxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG52YXIgYW5pbWF0aW9uTW9kdWxlID0ge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICAgIGluaXRpYWxpemUoKTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZCh2aWRlbyk7XG4gICAgfSxcbiAgICBnZXRWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2aWRlbztcbiAgICB9LFxuICAgIHBsYXlWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUucGxheSgwKTtcbiAgICB9LFxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHZpZGVvVGltZWxpbmUudmFycy5vbkNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG59O1xuXG5cbl8uYmluZEFsbC5hcHBseShfLCBbXS5jb25jYXQoYW5pbWF0aW9uTW9kdWxlLCBPYmplY3Qua2V5cyhhbmltYXRpb25Nb2R1bGUpKSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlxuXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcbnZhciBwbGFjZUp1c3RPZmZzY3JlZW4gPSByZXF1aXJlKCcuL3BsYWNlSnVzdE9mZnNjcmVlbicpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG52YXIgcGFyYWNodXRlcnMsIHBhcmFjaHV0ZXJzQ29udGFpbmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHBhcmFjaHV0ZXJzID0gXy5zaHVmZmxlKFtnZXRCbGFja291dCgpLCBnZXREcmlwKCksIGdldER5bmFtaXRlKCldKTtcblxuICAgIF8uZWFjaChwYXJhY2h1dGVycywgZnVuY3Rpb24ocGFyYWNodXRlcikge1xuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXIoKTtcbiAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgICAgICBwYXJhY2h1dGVyLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IDAuNTtcbiAgICAgICAgcGFyYWNodXRlci53aW5kb3dZID0gLTE7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRCbGFja291dCgpIHtcbiAgICB2YXIgYmxhY2tvdXRJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2JsYWNrb3V0LnBuZ1wiKTtcbiAgICBibGFja291dElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDI2LzYxLFxuICAgICAgICB5OiAzMy85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignQmxhY2tvdXQnLCBibGFja291dElkbGVTdGF0ZSk7XG59XG5mdW5jdGlvbiBnZXREcmlwKCkge1xuICAgIHZhciBkcmlwSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9kcmlwLnBuZ1wiKTtcbiAgICBkcmlwSWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgeDogMzYvNjEsXG4gICAgICAgIHk6IDI2Lzk0XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQ2hhcmFjdGVyKCdEcmlwJywgZHJpcElkbGVTdGF0ZSk7XG59XG5mdW5jdGlvbiBnZXREeW5hbWl0ZSgpIHtcbiAgICB2YXIgZHluYW1pdGVJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiKTtcbiAgICBkeW5hbWl0ZUlkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgIHg6IDI3LzYxLFxuICAgICAgICB5OiAzMC85NFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IENoYXJhY3RlcignRHluYW1pdGUnLCBkeW5hbWl0ZUlkbGVTdGF0ZSk7XG59XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuZnVuY3Rpb24gYW5pbWF0ZVBhcmFjaHV0ZXIocGFyYWNodXRlcikge1xuICAgIHZhciBhbmltYXRpb25UaW1lID0gMzU7XG5cbiAgICB2YXIgZGVwdGggPSBNYXRoLnJhbmRvbSgpICogNTtcbiAgICB2YXIgeCA9IDAuMSArIChNYXRoLnJhbmRvbSgpICogMC44KTtcbiAgICB2YXIgc2NhbGUgPSAxIC0gZGVwdGggKiAwLjIvNTtcblxuICAgIHBsYWNlSnVzdE9mZnNjcmVlbihwYXJhY2h1dGVyKTtcbiAgICBwYXJhY2h1dGVyLndpbmRvd1ggPSB4O1xuXG4gICAgdmFyIHJvdGF0aW9uID0gMC4zO1xuXG4gICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgd2luZG93WTogMSxcbiAgICAgICAgZWFzZTogJ1NpbmUuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcGFyYWNodXRlci52aXNpYmlsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXJhY2h1dGVyLnNjYWxlID0ge3g6IHNjYWxlLCB5OiBzY2FsZX07XG4gICAgcGFyYWNodXRlci5maWx0ZXJzWzBdLmJsdXIgPSBkZXB0aCAqIDMvNTtcbiAgICBwYXJhY2h1dGVyLnJvdGF0aW9uID0gcm90YXRpb247XG5cbiAgICBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbik7XG59XG5mdW5jdGlvbiBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbikge1xuICAgIHZhciBzd2F5VGltZSA9IDEuMjtcbiAgICB2YXIgZGVjID0gMC4wMztcblxuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICByb3RhdGlvbjogLXJvdGF0aW9uLFxuICAgICAgICBlYXNlOiAnQ3ViaWMuZWFzZUluT3V0J1xuICAgIH0pO1xuICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICBkZWxheTogc3dheVRpbWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYocm90YXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24gLSBkZWMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHBhcmFjaHV0ZXJzQ29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gICAgICAgIF8uZWFjaChwYXJhY2h1dGVycywgXy5iaW5kKHBhcmFjaHV0ZXJzQ29udGFpbmVyLmFkZENoaWxkLCBwYXJhY2h1dGVyc0NvbnRhaW5lcikpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHBhcmFjaHV0ZXJzQ29udGFpbmVyKTtcbiAgICB9KSxcbiAgICBhbmltYXRlTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHBhcmFjaHV0ZXJzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBhbmltYXRlUGFyYWNodXRlcihwYXJhY2h1dGVycy5zaGlmdCgpKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYXJhY2h1dGVyc0NvbnRhaW5lci52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxufTtcblxuXG5fLmJpbmRBbGwuYXBwbHkoXywgW10uY29uY2F0KGFuaW1hdGlvbk1vZHVsZSwgT2JqZWN0LmtleXMoYW5pbWF0aW9uTW9kdWxlKSkpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhbmltYXRpb25Nb2R1bGU7IiwiXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIHZhciBoZWlnaHQgPSBjaGFyYWN0ZXIuc2NhbGUueSAqIGNoYXJhY3Rlci5nZXRMb2NhbEJvdW5kcygpLmhlaWdodDtcblxuICAgIGNoYXJhY3Rlci53aW5kb3dZID0gLShoZWlnaHQvMikvJCh3aW5kb3cpLmhlaWdodCgpO1xufTsiLCJcblxuXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi4vcGl4aS9jaGFyYWN0ZXInKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBWYXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xudmFyIGJhY2tncm91bmQsIHJlc3BvbnNlQ29udGFpbmVyO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGJhY2tncm91bmQgPSBpbml0aWFsaXplQmFja2dyb3VuZCgpO1xuXG4gICAgcmVzcG9uc2VDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgcmVzcG9uc2VDb250YWluZXIudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgcmVzcG9uc2VDb250YWluZXIuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVCYWNrZ3JvdW5kKCkge1xuICAgIHZhciBiZyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfZHVzdHkuanBnXCIpO1xuXG4gICAgYmcuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoLjUsIC41KTtcbiAgICBiZy53aW5kb3dTY2FsZSA9IDE7XG4gICAgYmcuc2NhbGVUeXBlID0gJ2NvdmVyJztcblxuICAgIGJnLndpbmRvd1ggPSAwLjU7XG4gICAgYmcud2luZG93WSA9IDAuNTtcblxuICAgIHJldHVybiBiZztcbn1cblxuXG5cblxuXG5cblxudmFyIGFuaW1hdGlvbk1vZHVsZSA9IHtcbiAgICBpbml0aWFsaXplOiBfLm9uY2UoZnVuY3Rpb24oc2NlbmUpIHtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKHJlc3BvbnNlQ29udGFpbmVyKTtcbiAgICB9KSxcbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzcG9uc2VDb250YWluZXIudmlzaWJsZSA9IHRydWU7XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uTW9kdWxlOyIsIlxuXG5cbnZhciBRdWVzdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9xdWVzdGlvbicpO1xuXG5cbnZhciBRdWVzdGlvbkNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IFF1ZXN0aW9uXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbGxlY3Rpb247IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gcmVxdWlyZSgnLi9RdWVzdGlvbkNvbGxlY3Rpb24nKTtcblxuICAgIHZhciBjaGFyYWN0ZXJTZWxlY3QgPSByZXF1aXJlKCcuLi9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uJyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvY2FubmVkUXVlc3Rpb25zLmpzb24nKTtcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24nKTtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbVBlcnNvbmFsaXR5UXVlc3Rpb25zKG51bSkge1xuICAgICAgICByZXR1cm4gXy5maXJzdChfLnNodWZmbGUocGVyc29uYWxpdHlRdWVzdGlvbkRhdGEucXVlc3Rpb25zKSwgbnVtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21DYW5uZWRRdWVzdGlvbnMobnVtSW5Hcm91cCwgbnVtKSB7XG4gICAgICAgIHZhciBjYW5uZWRPcHRpb25zID0gXy5zaHVmZmxlKGNhbm5lZFF1ZXN0aW9uRGF0YS5vcHRpb25zKTtcblxuICAgICAgICB2YXIgY2FubmVkUXVlc3Rpb25zID0gXy5tYXAoXy5yYW5nZShudW0pLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZmlyc3QoXy5yZXN0KGNhbm5lZE9wdGlvbnMsIGkgKiBudW1Jbkdyb3VwKSwgbnVtSW5Hcm91cCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IGNhbm5lZFF1ZXN0aW9uRGF0YS5jbGFzcyxcbiAgICAgICAgICAgICAgICBjb3B5OiBjYW5uZWRRdWVzdGlvbkRhdGEuY29weSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2FubmVkLXF1ZXN0aW9uJyArIGksXG4gICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY2FubmVkUXVlc3Rpb25zO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9uQ29sbGVjdGlvbigpO1xuXG5cbiAgICAvL3NodWZmbGUgcXVlc3Rpb25zIGFuZCBwaWNrIDNcbiAgICB2YXIgcGVyc29uYWxpdHlRdWVzdGlvbnMgPSBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucygzKTtcbiAgICB2YXIgY2FubmVkUXVlc3Rpb25zID0gZ2V0UmFuZG9tQ2FubmVkUXVlc3Rpb25zKDMsIDMpO1xuXG5cblxuICAgIGFsbFF1ZXN0aW9ucy5hZGQoY2hhcmFjdGVyU2VsZWN0KTtcbiAgICBhbGxRdWVzdGlvbnMuYWRkKHBlcnNvbmFsaXR5UXVlc3Rpb25zKTtcbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNhbm5lZFF1ZXN0aW9ucyk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gYWxsUXVlc3Rpb25zO1xufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ0b3RhbFNpemVcIjogMzY1NTA4MzcsXG5cdFwiYXNzZXRzXCI6IHtcblx0XHRcImFzc2V0cy9pbWcvMTUweDE1MC5naWZcIjogNTM3LFxuXHRcdFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIjogNjY4Nixcblx0XHRcImFzc2V0cy9pbWcvYnV0dG9uLnBuZ1wiOiAyNzA0Nyxcblx0XHRcImFzc2V0cy9pbWcvZGlwcGVyLnBuZ1wiOiAyNTIyNTQsXG5cdFx0XCJhc3NldHMvaW1nL2RyaXAucG5nXCI6IDkyODgsXG5cdFx0XCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiOiA2NDkzLFxuXHRcdFwiYXNzZXRzL2ltZy9mb3JlZ3JvdW5kX3RyZWVzLnBuZ1wiOiAyNzg2MjQsXG5cdFx0XCJhc3NldHMvaW1nL2hlYWRlci5wbmdcIjogMTc5ODczLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9ibGFkZV9yYW5nZXIucG5nXCI6IDgzNTcwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYWJiaWUucG5nXCI6IDc4MjE1LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9jYW5uZWQtYnRuLnBuZ1wiOiA1MjY2Nixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZGlwcGVyLnBuZ1wiOiA5MzU5OCxcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvZHVzdHkucG5nXCI6IDk3NzM0LFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9wcmludGVyLnBuZ1wiOiAxNTUwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy9zZW5kLWJ0bi5wbmdcIjogMzA3MTUsXG5cdFx0XCJhc3NldHMvaW1nL2ljb25zL3RoZV90ZWFtLnBuZ1wiOiA3NDMyNixcblx0XHRcImFzc2V0cy9pbWcvaWNvbnMvdm9sdW1lLnBuZ1wiOiAzMjIwLFxuXHRcdFwiYXNzZXRzL2ltZy9pY29ucy93aW5kbGlmdGVyLnBuZ1wiOiAxMDUzMjMsXG5cdFx0XCJhc3NldHMvaW1nL2luLXRoZWF0ZXJzLnBuZ1wiOiA0MTMwLFxuXHRcdFwiYXNzZXRzL2ltZy9pbnRyby1idG0ucG5nXCI6IDE3OTA2MSxcblx0XHRcImFzc2V0cy9pbWcvaW50cm8tdG9wLnBuZ1wiOiAxNzY1NTEsXG5cdFx0XCJhc3NldHMvaW1nL2xvZ28ucG5nXCI6IDI3Njc1LFxuXHRcdFwiYXNzZXRzL2ltZy9taWRncm91bmQucG5nXCI6IDIwMzQyMCxcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfYmdfZHVzdHkuanBnXCI6IDE5NzY0Mixcblx0XHRcImFzc2V0cy9pbWcvcmVzcG9uc2VfbGV0dGVyX2JnLmpwZ1wiOiA3NTcxMyxcblx0XHRcImFzc2V0cy9pbWcvc2l0ZV9iZy5qcGdcIjogMTg0MDUyLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAwLnBuZ1wiOiAxNDcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDEucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMi5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAzLnBuZ1wiOiA1NTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDQucG5nXCI6IDEwMDYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDUucG5nXCI6IDEzODQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDYucG5nXCI6IDkyOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNy5wbmdcIjogMTE1Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOC5wbmdcIjogMTQwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOS5wbmdcIjogMTU0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMC5wbmdcIjogMTYzOSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMS5wbmdcIjogMTkwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMi5wbmdcIjogMTk4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMy5wbmdcIjogMjAyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNC5wbmdcIjogMjA3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNS5wbmdcIjogMjEyMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNi5wbmdcIjogMjI2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNy5wbmdcIjogMjQ1MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOC5wbmdcIjogMjU2OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOS5wbmdcIjogMjcyNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMC5wbmdcIjogMjg4OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMS5wbmdcIjogMzA0NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMi5wbmdcIjogMzE4MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMy5wbmdcIjogMzMyNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNC5wbmdcIjogMzQ4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNS5wbmdcIjogMzYwMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNi5wbmdcIjogMzcxMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNy5wbmdcIjogMzgyMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyOC5wbmdcIjogMzkyNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyOS5wbmdcIjogMzk5OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMC5wbmdcIjogNDAzNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMS5wbmdcIjogNDA5MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMi5wbmdcIjogNDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMy5wbmdcIjogNDE2Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNC5wbmdcIjogNDIxNyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNS5wbmdcIjogNDEwOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNi5wbmdcIjogNDE2Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNy5wbmdcIjogNDIzNixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOC5wbmdcIjogNDI2Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOS5wbmdcIjogNDM3MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0MC5wbmdcIjogNDQzOCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0MS5wbmdcIjogNDQ5OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Mi5wbmdcIjogNDUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0My5wbmdcIjogNDYzNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NC5wbmdcIjogNDY0Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NS5wbmdcIjogNDc0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Ni5wbmdcIjogNDc4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Ny5wbmdcIjogNDgzMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OC5wbmdcIjogNDk4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OS5wbmdcIjogNDk4Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MC5wbmdcIjogNTA0MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MS5wbmdcIjogNTEzMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Mi5wbmdcIjogNTIwMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1My5wbmdcIjogNTM2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NC5wbmdcIjogODI4Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NS5wbmdcIjogODA3Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Ni5wbmdcIjogMTM3OTcsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTcucG5nXCI6IDIzMTc0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU4LnBuZ1wiOiAzMDg1MCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1OS5wbmdcIjogMzYxMzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjAucG5nXCI6IDM4MDk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDYxLnBuZ1wiOiAzMzQ0NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2Mi5wbmdcIjogMjk1NzMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjMucG5nXCI6IDMwMzcwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY0LnBuZ1wiOiAyOTcwNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2NS5wbmdcIjogMjk4NTUsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjYucG5nXCI6IDI5NzAwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY3LnBuZ1wiOiAzMDI1NCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2OC5wbmdcIjogMjk1NTYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjkucG5nXCI6IDI5NjYxLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDcwLnBuZ1wiOiAyOTcyMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3MS5wbmdcIjogMjk4MTQsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzIucG5nXCI6IDI5ODEwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDczLnBuZ1wiOiAyOTc2OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3NC5wbmdcIjogMjk1MDksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzUucG5nXCI6IDI5NzY5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc2LnBuZ1wiOiAyOTY0MSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3Ny5wbmdcIjogMjk0OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzgucG5nXCI6IDI3Mzk0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc5LnBuZ1wiOiAzNzYwMixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4MC5wbmdcIjogNTAxMzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODEucG5nXCI6IDU2NDY0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgyLnBuZ1wiOiA1NjQ0OSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4My5wbmdcIjogNjMxMjksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODQucG5nXCI6IDU2MzQ2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg1LnBuZ1wiOiAzMTU4NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4Ni5wbmdcIjogMzYxODYsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODcucG5nXCI6IDI0Nzk4LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg4LnBuZ1wiOiAyMzg2NSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4OS5wbmdcIjogMjc5MzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTAucG5nXCI6IDMyMDk5LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDkxLnBuZ1wiOiAzNjk0OCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5Mi5wbmdcIjogNDExODMsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTMucG5nXCI6IDQ0NDIzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk0LnBuZ1wiOiA0ODQ3Nixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5NS5wbmdcIjogMzU4NzksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTYucG5nXCI6IDI4MTE1LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk3LnBuZ1wiOiAyNDcyMyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5OC5wbmdcIjogMjIyNTEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTkucG5nXCI6IDIwNjMwLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAwLnBuZ1wiOiAyMTAxMCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwMS5wbmdcIjogMTYzNzAsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDIucG5nXCI6IDE4MTkzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAzLnBuZ1wiOiAxOTg5Myxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNC5wbmdcIjogMjI0NzEsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDUucG5nXCI6IDI0NTk2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA2LnBuZ1wiOiAyNTUzNCxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNy5wbmdcIjogMjcxMTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDgucG5nXCI6IDI2MTA3LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA5LnBuZ1wiOiAyOTEzMSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMC5wbmdcIjogMzM1NTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTEucG5nXCI6IDM2NDc2LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEyLnBuZ1wiOiA0MTAxNSxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMy5wbmdcIjogNDQ2ODksXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTQucG5nXCI6IDQ1OTY0LFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE1LnBuZ1wiOiA0NDA1Mixcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNi5wbmdcIjogNDY0OTgsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTcucG5nXCI6IDY5NzgzLFxuXHRcdFwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE4LnBuZ1wiOiAyNjU4Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExOS5wbmdcIjogMzA5NTIsXG5cdFx0XCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMjAucG5nXCI6IDE0Nyxcblx0XHRcImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEyMS5wbmdcIjogMTQ3LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAwLnBuZ1wiOiA2NDA3MCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwMS5wbmdcIjogNjI5ODMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDIucG5nXCI6IDY1NzczLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDAzLnBuZ1wiOiA2NjY0NCxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNC5wbmdcIjogNjQwNzAsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDUucG5nXCI6IDYyOTgzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA2LnBuZ1wiOiA2NTc3Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAwNy5wbmdcIjogNjY2NDQsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMDgucG5nXCI6IDY0MDcwLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kaXBwZXIvRGlwcGVyXzAwMDA5LnBuZ1wiOiA2Mjk4Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZGlwcGVyL0RpcHBlcl8wMDAxMC5wbmdcIjogNjU3NzMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2RpcHBlci9EaXBwZXJfMDAwMTEucG5nXCI6IDY2NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDAucG5nXCI6IDEyNjYyMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDAxLnBuZ1wiOiAxMjQyNTMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwMi5wbmdcIjogMTI0MzAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDMucG5nXCI6IDEyNjAwNSxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA0LnBuZ1wiOiAxMjY2MjMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwNS5wbmdcIjogMTI0MjUzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDYucG5nXCI6IDEyNDMwMyxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDA3LnBuZ1wiOiAxMjYwMDUsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAwOC5wbmdcIjogMTI2NjIzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS9vbmUvRHVzdHlfcGxhbmVfMDAwMDkucG5nXCI6IDEyNDI1Myxcblx0XHRcImFzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHkvb25lL0R1c3R5X3BsYW5lXzAwMDEwLnBuZ1wiOiAxMjQzMDMsXG5cdFx0XCJhc3NldHMvc3ByaXRlc2hlZXRzL2R1c3R5L29uZS9EdXN0eV9wbGFuZV8wMDAxMS5wbmdcIjogMTI2MDA1LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDAucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDEucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDIucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDMucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDQucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDUucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDYucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDcucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDgucG5nXCI6IDU4MTY2LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMDkucG5nXCI6IDU4MDAzLFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMTAucG5nXCI6IDU3NjQ0LFxuXHRcdFwiYXNzZXRzL3Nwcml0ZXNoZWV0cy9kdXN0eS90d28vRHVzdHlfcGxhbmVfbGlnaHRfMDAwMTEucG5nXCI6IDU4MTMxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAwLnBuZ1wiOiAyMzIyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAxLnBuZ1wiOiAzMjAwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAyLnBuZ1wiOiAxMzkzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAzLnBuZ1wiOiAxNTI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA0LnBuZ1wiOiAyNzI3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA1LnBuZ1wiOiAzMTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA2LnBuZ1wiOiAzNzYzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA3LnBuZ1wiOiA0NDI2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA4LnBuZ1wiOiA2MDAzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA5LnBuZ1wiOiA5NDEyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEwLnBuZ1wiOiAxMTE4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMS5wbmdcIjogMTQzNTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTIucG5nXCI6IDE2MzIzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDEzLnBuZ1wiOiAxOTcyOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNC5wbmdcIjogMjIwNDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTUucG5nXCI6IDI1MTExLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE2LnBuZ1wiOiAyNjU1MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNy5wbmdcIjogMjkwMTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTgucG5nXCI6IDMwMjAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE5LnBuZ1wiOiAzMTMwMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMC5wbmdcIjogMzE3MTcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjEucG5nXCI6IDMyMTAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIyLnBuZ1wiOiAzMjg5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMy5wbmdcIjogMzMyMTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjQucG5nXCI6IDMzNzQ0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI1LnBuZ1wiOiAzMzYxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNi5wbmdcIjogMzM0MTQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjcucG5nXCI6IDMzNTkwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI4LnBuZ1wiOiAzMzUxNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyOS5wbmdcIjogMzI1ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzAucG5nXCI6IDMyMzM1LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMxLnBuZ1wiOiAzMjE0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMi5wbmdcIjogMzE1MzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzMucG5nXCI6IDMwODU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM0LnBuZ1wiOiAyOTg5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNS5wbmdcIjogMjk0MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzYucG5nXCI6IDI5NDE4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM3LnBuZ1wiOiAyODM4MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzOC5wbmdcIjogMjgxNDIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzkucG5nXCI6IDI3MjY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQwLnBuZ1wiOiAyNjU2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MS5wbmdcIjogMjY1NjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDIucG5nXCI6IDI1ODcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQzLnBuZ1wiOiAyNTM1NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0NC5wbmdcIjogMjQ1NjQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDUucG5nXCI6IDI0MjAxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ2LnBuZ1wiOiAyNDE0Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ny5wbmdcIjogMjM2MTIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDgucG5nXCI6IDIzNjM5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ5LnBuZ1wiOiAyMzgwOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1MC5wbmdcIjogMjMxNzAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTEucG5nXCI6IDIzMjYyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUyLnBuZ1wiOiAyMzIwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1My5wbmdcIjogMjI3OTEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTQucG5nXCI6IDIzMDY0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU1LnBuZ1wiOiAyMzM1NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Ni5wbmdcIjogMjM3NzksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTcucG5nXCI6IDI0NzQzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU4LnBuZ1wiOiAyNTg3OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OS5wbmdcIjogMjY1MjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjAucG5nXCI6IDI3NjY2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYxLnBuZ1wiOiAyODY4OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Mi5wbmdcIjogMjk1ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjMucG5nXCI6IDMwMzk0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY0LnBuZ1wiOiAzMTI5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NS5wbmdcIjogMzIyNDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjYucG5nXCI6IDMzODk3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY3LnBuZ1wiOiAzNTM0OCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2OC5wbmdcIjogMzYyMzYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjkucG5nXCI6IDM3NTY4LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcwLnBuZ1wiOiAzOTg4MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MS5wbmdcIjogNDEwOTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzIucG5nXCI6IDQyMDM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDczLnBuZ1wiOiA0MjQ5NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3NC5wbmdcIjogNDQ1NTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzUucG5nXCI6IDQ1NDQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc2LnBuZ1wiOiA0Njc0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ny5wbmdcIjogNDg2OTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzgucG5nXCI6IDQ5ODczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc5LnBuZ1wiOiA1MTcxOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4MC5wbmdcIjogNTM4NjMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODEucG5nXCI6IDU0NTIwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgyLnBuZ1wiOiA1NjQ5Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4My5wbmdcIjogNTYyOTMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODQucG5nXCI6IDU4ODI0LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg1LnBuZ1wiOiA1OTU5NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Ni5wbmdcIjogNjA2MzQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODcucG5nXCI6IDYyODkzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg4LnBuZ1wiOiA2Mzk5OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OS5wbmdcIjogNjYxMDUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTAucG5nXCI6IDY2MzQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkxLnBuZ1wiOiA2OTIwNyxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Mi5wbmdcIjogNjg3NjcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTMucG5nXCI6IDcwNTgyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk0LnBuZ1wiOiA3MDI2OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NS5wbmdcIjogNzMzMDMsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTYucG5nXCI6IDc1OTAyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk3LnBuZ1wiOiA3NzUzOSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5OC5wbmdcIjogODE2MjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTkucG5nXCI6IDgyMjc3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAwLnBuZ1wiOiA4NTA1Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMS5wbmdcIjogODcwNjAsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDIucG5nXCI6IDg4MzQxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAzLnBuZ1wiOiA4ODkwNCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNC5wbmdcIjogOTMyMDgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDUucG5nXCI6IDk5Nzc3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA2LnBuZ1wiOiAxMDI4NjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDcucG5nXCI6IDEwOTg0NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOC5wbmdcIjogMTEyMTY5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA5LnBuZ1wiOiAxMTU5MTUsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTAucG5nXCI6IDExNjkwMixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMS5wbmdcIjogMTIzMzIxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEyLnBuZ1wiOiAxMjYzNDcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTMucG5nXCI6IDEzMzc0OSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNC5wbmdcIjogMTM4NzcwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE1LnBuZ1wiOiAxNDY5NDksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTYucG5nXCI6IDE1NDMyMCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNy5wbmdcIjogMTU5NDc5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE4LnBuZ1wiOiAxNjYyMTgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTkucG5nXCI6IDE3MTYyMSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMC5wbmdcIjogMTc4MjcxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIxLnBuZ1wiOiAxODU4ODcsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjIucG5nXCI6IDE5NzI5MSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMy5wbmdcIjogMjA2MTIzLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI0LnBuZ1wiOiAyMjQ2ODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjUucG5nXCI6IDIzNjYzOCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNi5wbmdcIjogMjQyNTk5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI3LnBuZ1wiOiAyNjIxODIsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjgucG5nXCI6IDI3NDgwNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyOS5wbmdcIjogMjg1OTQwLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMwLnBuZ1wiOiAzMDc0MzgsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzEucG5nXCI6IDMyMzI3MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMi5wbmdcIjogMzUwNTczLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMzLnBuZ1wiOiAzNzYxMTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzQucG5nXCI6IDQwNTU3NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNS5wbmdcIjogNDM3NjU3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM2LnBuZ1wiOiA0NzY0ODksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzcucG5nXCI6IDQ4NDI4NSxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOC5wbmdcIjogNTMyOTQ2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM5LnBuZ1wiOiA1NTYxMjYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDAucG5nXCI6IDU5NDU0NCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0MS5wbmdcIjogNjQ4NDkyLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQyLnBuZ1wiOiA3MTM3OTksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDMucG5nXCI6IDczMjkyNixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NC5wbmdcIjogNzAyOTgxLFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ1LnBuZ1wiOiA3NTgzODQsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDYucG5nXCI6IDc0MzU0MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Ny5wbmdcIjogNjg0OTg5LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ4LnBuZ1wiOiA2NzM5NTYsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDkucG5nXCI6IDY1NTE4Nixcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MC5wbmdcIjogNjE4NjM3LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUxLnBuZ1wiOiA1OTk3NDksXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTIucG5nXCI6IDU1Mzg5MCxcblx0XHRcImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1My5wbmdcIjogNTI1OTk2LFxuXHRcdFwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU0LnBuZ1wiOiA1MTIwMjEsXG5cdFx0XCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTUucG5nXCI6IDM1NDkwNlxuXHR9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiZHVzdHlcIjogXCJhc3NldHMvYXVkaW8vZHVzdHkubXAzXCIsXG4gICAgXCJibGFkZXJhbmdlclwiOiBcImFzc2V0cy9hdWRpby9ibGFkZS5tcDNcIixcbiAgICBcImNhYmJpZVwiOiBcImFzc2V0cy9hdWRpby9NdXN0YW5nXzIwMTJfU3RhcnQubXAzXCIsXG4gICAgXCJkaXBwZXJcIjogXCJhc3NldHMvYXVkaW8vZGlwcGVyLm1wM1wiLFxuICAgIFwid2luZGxpZnRlclwiOiBcImFzc2V0cy9hdWRpby93aW5kbGlmdGVyLm1wM1wiLFxuICAgIFwidGVhbVwiOiBcImFzc2V0cy9hdWRpby9ZZWxsb3dfR2VuZXJpY19TdGFydC5tcDNcIlxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImNsYXNzXCI6IFwiY2FubmVkXCIsXG4gICAgXCJjb3B5XCI6IFwiTm93IHRoYXQgd2Uga25vdyBtb3JlIGFib3V0IHlvdSwgaXQncyB5b3VyIHR1cm4gdG8gYXNrIGZpcmUgcmFuZ2VyIHNvbWUgcXVlc3Rpb25zXCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIHRoaW5nIGFib3V0IHRoZSBQaXN0b24gUGVhayBBdHRhY2sgVGVhbT9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmYXZvcml0ZVRoaW5nXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCB3YXMgeW91ciBoYXJkZXN0IG1pc3Npb24/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiaGFyZGVzdE1pc3Npb25cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaG8gYXJlIHlvdXIgYmVzdCBmcmllbmRzIG9uIHRoZSBQUEFUP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJlc3RGcmllbmRzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hhdCBpcyB5b3VyIGpvYiBhdCBQaXN0b24gUGVhaz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJqb2JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgZG8geW91IGZpZ2h0IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmaWdodEZpcmVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGRvIHlvdSBwcmV2ZW50IGZvcmVzdCBmaXJlcz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJ5b3VQcmV2ZW50RmlyZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIb3cgY2FuIEkgcHJldmVudCBmb3Jlc3QgZmlyZXM/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiSVByZXZlbnRGaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkZpcmUgZmlyZSBmaXJlIGZvcmVzdCBmaXJlIGZvcmVzdD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJmaXJlRm9yZXN0XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTG9yZW0gSXBzdW0gMT9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJsb3JlbWlwc3VtMVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkxvcmVtIElwc3VtIDI/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwibG9yZW1pcHN1bTJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJMb3JlbSBJcHN1bSAzP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImxvcmVtaXBzdW0zXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTG9yZW0gSXBzdW0gND9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJsb3JlbWlwc3VtNFwiXG4gICAgICAgIH1cbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwibmFtZVwiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNsYXNzXCI6IFwiY2hhcmFjdGVyLXNlbGVjdFwiLFxuICAgIFwiY29weVwiOiBcIldobyBkbyB5b3Ugd2FudCB0byB3cml0ZSB0bz9cIixcbiAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEdXN0eVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImR1c3R5XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmxhZGUgUmFuZ2VyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiYmxhZGVyYW5nZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJDYWJiaWVcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJjYWJiaWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJEaXBwZXJcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkaXBwZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJXaW5kbGlmdGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwid2luZGxpZnRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlRoZSBUZWFtXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwidGVhbVwiXG4gICAgICAgIH1cbiAgICBdLFxuICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcInF1ZXN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImZhdm9yaXRlLWRpc25leS1tb3ZpZVwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLWRpc25leS1tb3ZpZVwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCBpcyB5b3VyIGZhdm9yaXRlIERpc25leSBtb3ZpZT9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJUaGUgTGlvbiBLaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJ0aGVsaW9ua2luZ1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlBoYW50b20gb2YgdGhlIE1lZ2FwbGV4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwaGFudG9tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiR2FtZSBvZiBUaHJvbmVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJnYW1lb2Z0aHJvbmVzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSGVyY3VsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImhlcmN1bGVzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQnJlYWtpbicgMjogRWxlY3RyaWMgQm9vZ2Fsb29cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJyZWFraW5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJNZW1lbnRvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJtZW1lbnRvXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZhdm9yaXRlLWNvbG9yXCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJXaGF0J3MgeW91ciBmYXZvcml0ZSBjb2xvcj9cIixcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJSZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInJlZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsdWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsdWVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJPcmFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm9yYW5nZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkdyZWVuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJncmVlblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlllbGxvd1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwieWVsbG93XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHVycGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJwdXJwbGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInF1ZXN0aW9uNFwiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInF1ZXN0aW9uNFwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiTG9yZW0gSXBzdW0/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTG9yZW1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImxvcmVtXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSXBzdW1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImlwc3VtXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRG9sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRvbG9yXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU2l0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzaXRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJBbWV0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJhbWV0XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ29uc2VjdGV0dXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNvbnNlY3RldHVyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJxdWVzdGlvbjVcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJxdWVzdGlvbjVcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIkxvcmVtIElwc3VtIDI/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTG9yZW0gMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwibG9yZW0yXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSXBzdW0gMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiaXBzdW0yXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRG9sb3IgMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZG9sb3IyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU2l0IDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInNpdDJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJBbWV0IDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImFtZXQyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ29uc2VjdGV0dXIgMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiY29uc2VjdGV0dXIyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgICAgICB9XG4gICAgXVxufSIsIlxuXG5cblxuLy8gYWRkcyBvdXIgY3VzdG9tIG1vZGlmaWNhdGlvbnMgdG8gdGhlIFBJWEkgbGlicmFyeVxucmVxdWlyZSgnLi9waXhpL2xpYk1vZGlmaWNhdGlvbnMnKTtcblxuXG5cbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFpblZpZXcnKTtcbnZhciBBc3NldExvYWRpbmdWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9hc3NldExvYWRpbmdWaWV3Jyk7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBcHAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYXBwID0ge307XG5cblxuXG5cblxuLy8gYWZ0ZXIgYXNzZXRzIGxvYWRlZCAmIGpxdWVyeSBsb2FkZWRcbmFwcC5yZW5kZXIgPSBfLmFmdGVyKDIsIGZ1bmN0aW9uKCkge1xuICAgIGFwcC5tYWluVmlldyA9IG5ldyBNYWluVmlldygpO1xuXG4gICAgYXBwLm1haW5WaWV3LnN0YXJ0KCk7XG59KTtcblxuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBBc3NldCBMb2FkaW5nICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmFwcC5hc3NldExvYWRlciA9IG5ldyBBc3NldExvYWRpbmdWaWV3KHtvbkNvbXBsZXRlOiBhcHAucmVuZGVyfSk7XG5cblxuJChhcHAucmVuZGVyKTtcblxuXG4vL1RPRE86IERlbGV0ZSEhXG4vLyQoZnVuY3Rpb24oKSB7XG4vLyAgICBcInVzZSBzdHJpY3RcIjtcbi8vXG4vLyAgICB2YXIgcGFzc3dvcmQgPSAnZGlzbmV5UGxhbmVzVHdvJztcbi8vICAgIHZhciAkcGFzc3dvcmRTY3JlZW4gPSAkKCcjcGFzc3dvcmRTY3JlZW4nKTtcbi8vXG4vLyAgICB2YXIgJHBhc3N3b3JkSW5wdXQgPSAkcGFzc3dvcmRTY3JlZW4uZmluZCgnaW5wdXRbdHlwZT1wYXNzd29yZF0nKTtcbi8vXG4vL1xuLy8gICAgJHBhc3N3b3JkU2NyZWVuLmZpbmQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuLy8gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vXG4vLyAgICAgICAgaWYoJHBhc3N3b3JkSW5wdXQudmFsKCkgPT09IHBhc3N3b3JkKSB7XG4vLyAgICAgICAgICAgICRwYXNzd29yZFNjcmVlbi5mYWRlT3V0KDUwKTtcbi8vXG4vLyAgICAgICAgICAgIGFwcC5hc3NldExvYWRlciA9IG5ldyBBc3NldExvYWRpbmdWaWV3KHtvbkNvbXBsZXRlOiBhcHAucmVuZGVyfSk7XG4vLyAgICAgICAgfVxuLy8gICAgfSk7XG4vL30pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gYXBwO1xuXG5cblxuIiwiXG5cblxudmFyIFF1ZXN0aW9uID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjb3B5OiAnJyxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgIH1cbn0pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbjsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbiAgICAvLyBkaXNwbGF5T2JqZWN0IHNob3VsZCBiZSBhbiBpbnN0YW5jZSBvZiBQSVhJLlNwcml0ZSBvciBQSVhJLk1vdmllQ2xpcFxuICAgIHZhciBDaGFyYWN0ZXIgPSBmdW5jdGlvbihuYW1lLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7IC8vIFBhcmVudCBjb25zdHJ1Y3RvclxuXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaWRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgICAgaWYoIV8uaXNVbmRlZmluZWQobW92aWVDbGlwKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRJZGxlU3RhdGUobW92aWVDbGlwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuc2V0SWRsZVN0YXRlID0gZnVuY3Rpb24ocGl4aVNwcml0ZSkge1xuICAgICAgICB0aGlzLmlkbGUgPSBwaXhpU3ByaXRlO1xuXG4gICAgICAgIGlmKHBpeGlTcHJpdGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgcGl4aVNwcml0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHBpeGlTcHJpdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICBwaXhpU3ByaXRlLmdvdG9BbmRQbGF5KDApOyAgLy9zdGFydCBjbGlwXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZENoaWxkKHBpeGlTcHJpdGUpOyAgIC8vYWRkIHRvIGRpc3BsYXkgb2JqZWN0IGNvbnRhaW5lclxuICAgIH07XG5cbiAgICAvL2FkZCBtb3ZpZSBjbGlwIHRvIHBsYXkgd2hlbiBjaGFyYWN0ZXIgY2hhbmdlcyB0byBzdGF0ZVxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuYWRkU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSwgbW92aWVDbGlwKSB7XG4gICAgICAgIG1vdmllQ2xpcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGVzW3N0YXRlXSA9IG1vdmllQ2xpcDtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChtb3ZpZUNsaXApO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgQVBJIGZ1bmN0aW9uLiBXYWl0cyB1bnRpbCBjdXJyZW50IHN0YXRlIGlzIGZpbmlzaGVkIGJlZm9yZSBzd2l0Y2hpbmcgdG8gbmV4dCBzdGF0ZS5cbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLmdvVG9TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG5cbiAgICAgICAgaWYoXy5pc1VuZGVmaW5lZCh0aGlzLnN0YXRlc1tzdGF0ZV0pKSB7XG4gICAgICAgICAgICB0aHJvdyAnRXJyb3I6IENoYXJhY3RlciAnICsgdGhpcy5uYW1lICsgJyBkb2VzIG5vdCBjb250YWluIHN0YXRlOiAnICsgc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmlkbGUgaW5zdGFuY2VvZiBQSVhJLk1vdmllQ2xpcCkge1xuICAgICAgICAgICAgdGhpcy5pZGxlLm9uQ29tcGxldGUgPSBfLmJpbmQodGhpcy5zd2FwU3RhdGUsIHRoaXMsIHN0YXRlKTtcblxuICAgICAgICAgICAgLy8gYWZ0ZXIgY3VycmVudCBhbmltYXRpb24gZmluaXNoZXMgZ28gdG8gdGhpcyBzdGF0ZSBuZXh0XG4gICAgICAgICAgICB0aGlzLmlkbGUubG9vcCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zd2FwU3RhdGUoc3RhdGUpO1xuICAgICAgICAgICAgLy9zd2l0Y2ggaW1tZWRpYXRlbHkgaWYgY2hhcmFjdGVyIGlkbGUgc3RhdGUgaXMgYSBzaW5nbGUgc3ByaXRlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gY2hhbmdlcyBzdGF0ZSBpbW1lZGlhdGVseVxuICAgIC8vIE5PVEU6IEZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlIHVzZWQgaW50ZXJuYWxseSBieSBjaGFyYWN0ZXIuZ29Ub1N0YXRlKClcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLnN3YXBTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG5cbiAgICAgICAgdmFyIGlkbGVTdGF0ZSA9IHRoaXMuaWRsZTtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gdGhpcy5zdGF0ZXNbc3RhdGVdO1xuXG4gICAgICAgIG5ld1N0YXRlLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHsgIC8vc3dpdGNoIGJhY2sgdG8gaWRsZSBhZnRlciBydW5cbiAgICAgICAgICAgIGlmKGlkbGVTdGF0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV3U3RhdGUudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlkbGVTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgbmV3U3RhdGUubG9vcCA9IGZhbHNlO1xuICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgbmV3U3RhdGUuZ290b0FuZFBsYXkoMCk7XG4gICAgfTtcblxuICAgIC8vYWRkIGNhbGxiYWNrIHRvIHJ1biBvbiBjaGFyYWN0ZXIgdXBkYXRlXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5vblVwZGF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH07XG5cbiAgICAvLyBjYWxsZWQgb24gZWFjaCBhbmltYXRpb24gZnJhbWUgYnkgd2hhdGV2ZXIgUGl4aSBzY2VuZSBjb250YWlucyB0aGlzIGNoYXJhY3RlclxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub25VcGRhdGVDYWxsYmFjaygpO1xuICAgIH07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBleHRlbmRzIERpc3BsYXkgT2JqZWN0IENvbnRhaW5lclxuICAgIGV4dGVuZChQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIsIENoYXJhY3Rlcik7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENoYXJhY3Rlcjtcbn0pKCk7IiwiXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgc3ViKSB7XG4gICAgLy8gQXZvaWQgaW5zdGFudGlhdGluZyB0aGUgYmFzZSBjbGFzcyBqdXN0IHRvIHNldHVwIGluaGVyaXRhbmNlXG4gICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9jcmVhdGVcbiAgICAvLyBmb3IgYSBwb2x5ZmlsbFxuICAgIC8vIEFsc28sIGRvIGEgcmVjdXJzaXZlIG1lcmdlIG9mIHR3byBwcm90b3R5cGVzLCBzbyB3ZSBkb24ndCBvdmVyd3JpdGVcbiAgICAvLyB0aGUgZXhpc3RpbmcgcHJvdG90eXBlLCBidXQgc3RpbGwgbWFpbnRhaW4gdGhlIGluaGVyaXRhbmNlIGNoYWluXG4gICAgLy8gVGhhbmtzIHRvIEBjY25va2VzXG4gICAgdmFyIG9yaWdQcm90byA9IHN1Yi5wcm90b3R5cGU7XG4gICAgc3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoYmFzZS5wcm90b3R5cGUpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9yaWdQcm90bykgIHtcbiAgICAgICAgc3ViLnByb3RvdHlwZVtrZXldID0gb3JpZ1Byb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8gUmVtZW1iZXIgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHdhcyBzZXQgd3JvbmcsIGxldCdzIGZpeCBpdFxuICAgIHN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWI7XG4gICAgLy8gSW4gRUNNQVNjcmlwdDUrIChhbGwgbW9kZXJuIGJyb3dzZXJzKSwgeW91IGNhbiBtYWtlIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eVxuICAgIC8vIG5vbi1lbnVtZXJhYmxlIGlmIHlvdSBkZWZpbmUgaXQgbGlrZSB0aGlzIGluc3RlYWRcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3ViLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHN1YlxuICAgIH0pO1xufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7IiwiXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciBpbnRyb1ZpZGVvTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9pbnRyb1ZpZGVvJyk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqIEludHJvIFBpeGkgQW5pbWF0aW9uIENsYXNzICoqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBJbnRyb1NjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFNjZW5lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vcGFyZW50IGNvbnN0cnVjdG9yXG5cbiAgICAgICAgaW5pdGlhbGl6ZU1hc2sodGhpcyk7XG5cbiAgICAgICAgaW50cm9WaWRlb01vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICB0aGlzLmludHJvVmlkZW8gPSBpbnRyb1ZpZGVvTW9kdWxlLmdldFZpZGVvKCk7XG4gICAgfTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgSW50cm9TY2VuZS5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3RoaXMudGltZWxpbmVPcGVuLnBsYXkoKTtcbiAgICB9O1xuXG4gICAgLy9zZXQgb24gY29tcGxldGUgZnVuY3Rpb24gZm9yIGFuaW1hdGlvbiB0aW1lbGluZVxuICAgIEludHJvU2NlbmUucHJvdG90eXBlLm9uQ29tcGxldGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLm9uQ29tcGxldGUoY2FsbGJhY2spO1xuICAgIH07XG5cblxuICAgIEludHJvU2NlbmUucHJvdG90eXBlLnNldFZpZXcgPSBmdW5jdGlvbih2aWV3KSB7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgfTtcblxuICAgIEludHJvU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMudmlldykpIHtcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IHRoaXMuaW50cm9WaWRlby5zY2FsZTtcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSB0aGlzLmludHJvVmlkZW8uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICAgICAgdGhpcy52aWV3Lm9uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQsIChib3VuZHMud2lkdGggKiBzY2FsZS54KSwgKGJvdW5kcy5oZWlnaHQgKiBzY2FsZS55KSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZU1hc2soc2NlbmUpIHtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVCYWNrZ3JvdW5kQ29sb3Ioc2NlbmUpIHtcblxuICAgIH1cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gRXh0ZW5kcyBTY2VuZSBDbGFzc1xuICAgIGV4dGVuZChTY2VuZSwgSW50cm9TY2VuZSk7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludHJvU2NlbmU7XG5cblxufSkoKTtcblxuXG5cbiIsIihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qXG4gICAgICogQ3VzdG9tIEVkaXRzIGZvciB0aGUgUElYSSBMaWJyYXJ5XG4gICAgICovXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIFJlbGF0aXZlIFBvc2l0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dZID0gMDtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25YID0gZnVuY3Rpb24od2luZG93V2lkdGgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKHdpbmRvd1dpZHRoICogdGhpcy5fd2luZG93WCkgKyB0aGlzLl9idW1wWDtcbiAgICB9O1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWSA9IGZ1bmN0aW9uKHdpbmRvd0hlaWdodCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAod2luZG93SGVpZ2h0ICogdGhpcy5fd2luZG93WSkgKyB0aGlzLl9idW1wWTtcbiAgICB9O1xuXG4gICAgLy8gd2luZG93WCBhbmQgd2luZG93WSBhcmUgcHJvcGVydGllcyBhZGRlZCB0byBhbGwgUGl4aSBkaXNwbGF5IG9iamVjdHMgdGhhdFxuICAgIC8vIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgcG9zaXRpb24ueCBhbmQgcG9zaXRpb24ueVxuICAgIC8vIHRoZXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhIHZhbHVlIGJldHdlZW4gMCAmIDEgYW5kIHBvc2l0aW9uIHRoZSBkaXNwbGF5XG4gICAgLy8gb2JqZWN0IGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2luZG93IHdpZHRoICYgaGVpZ2h0IGluc3RlYWQgb2YgYSBmbGF0IHBpeGVsIHZhbHVlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1g7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1ggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKCR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1knLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBZID0gMDtcblxuICAgIC8vIGJ1bXBYIGFuZCBidW1wWSBhcmUgcHJvcGVydGllcyBvbiBhbGwgZGlzcGxheSBvYmplY3RzIHVzZWQgZm9yXG4gICAgLy8gc2hpZnRpbmcgdGhlIHBvc2l0aW9uaW5nIGJ5IGZsYXQgcGl4ZWwgdmFsdWVzLiBVc2VmdWwgZm9yIHN0dWZmXG4gICAgLy8gbGlrZSBob3ZlciBhbmltYXRpb25zIHdoaWxlIHN0aWxsIG1vdmluZyBhcm91bmQgYSBjaGFyYWN0ZXIuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKCR3aW5kb3cud2lkdGgoKSAqIHRoaXMuX3dpbmRvd1gpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAoJHdpbmRvdy5oZWlnaHQoKSAqIHRoaXMuX3dpbmRvd1kpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFNjYWxpbmcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbiAgICAvLyB3aW5kb3dTY2FsZSBjb3JyZXNwb25kcyB0byB3aW5kb3cgc2l6ZVxuICAgIC8vICAgZXg6IHdpbmRvd1NjYWxlID0gMC4yNSBtZWFucyAxLzQgc2l6ZSBvZiB3aW5kb3dcbiAgICAvLyBzY2FsZU1pbiBhbmQgc2NhbGVNYXggY29ycmVzcG9uZCB0byBuYXR1cmFsIHNwcml0ZSBzaXplXG4gICAgLy8gICBleDogc2NhbGVNaW4gPSAwLjUgbWVhbnMgc3ByaXRlIHdpbGwgbm90IHNocmluayB0byBtb3JlIHRoYW4gaGFsZiBvZiBpdHMgb3JpZ2luYWwgc2l6ZS5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dTY2FsZSA9IC0xO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNaW4gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNYXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2NhbGVUeXBlID0gJ2NvbnRhaW4nO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NjYWxlRm5jID0gTWF0aC5taW47XG5cbiAgICAvLyBXaW5kb3dTY2FsZTogdmFsdWUgYmV0d2VlbiAwICYgMSwgb3IgLTFcbiAgICAvLyBUaGlzIGRlZmluZXMgd2hhdCAlIG9mIHRoZSB3aW5kb3cgKGhlaWdodCBvciB3aWR0aCwgd2hpY2hldmVyIGlzIHNtYWxsZXIpXG4gICAgLy8gdGhlIG9iamVjdCB3aWxsIGJlIHNpemVkLiBFeGFtcGxlOiBhIHdpbmRvd1NjYWxlIG9mIDAuNSB3aWxsIHNpemUgdGhlIGRpc3BsYXlPYmplY3RcbiAgICAvLyB0byBoYWxmIHRoZSBzaXplIG9mIHRoZSB3aW5kb3cuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dTY2FsZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aW5kb3dTY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fd2luZG93U2NhbGUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVHdvIHBvc3NpYmxlIHZhbHVlczogY29udGFpbiBvciBjb3Zlci4gVXNlZCB3aXRoIHdpbmRvd1NjYWxlIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHRha2UgdGhlXG4gICAgLy8gc21hbGxlciBib3VuZCAoY29udGFpbikgb3IgdGhlIGxhcmdlciBib3VuZCAoY292ZXIpIHdoZW4gZGVjaWRpbmcgY29udGVudCBzaXplIHJlbGF0aXZlIHRvIHNjcmVlbi5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3NjYWxlVHlwZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVR5cGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlVHlwZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zY2FsZUZuYyA9ICh2YWx1ZSA9PT0gJ2NvbnRhaW4nKSA/IE1hdGgubWluIDogTWF0aC5tYXg7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9zZXRTY2FsZSA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpIHtcbiAgICAgICAgdmFyIGxvY2FsQm91bmRzID0gdGhpcy5nZXRMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuX3dpbmRvd1NjYWxlICogdGhpcy5fc2NhbGVGbmMod2luZG93SGVpZ2h0L2xvY2FsQm91bmRzLmhlaWdodCwgd2luZG93V2lkdGgvbG9jYWxCb3VuZHMud2lkdGgpO1xuXG4gICAgICAgIC8va2VlcCBzY2FsZSB3aXRoaW4gb3VyIGRlZmluZWQgYm91bmRzXG4gICAgICAgIHNjYWxlID0gTWF0aC5tYXgodGhpcy5zY2FsZU1pbiwgTWF0aC5taW4oc2NhbGUsIHRoaXMuc2NhbGVNYXgpKTtcblxuXG4gICAgICAgIHRoaXMuc2NhbGUueCA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVYO1xuICAgICAgICB0aGlzLnNjYWxlLnkgPSBzY2FsZSAqIHRoaXMuX2FuaW1hdGlvblNjYWxlWTtcbiAgICB9O1xuXG5cbiAgICAvLyBVU0UgT05MWSBJRiBXSU5ET1dTQ0FMRSBJUyBBTFNPIFNFVFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2FuaW1hdGlvblNjYWxlWCA9IDE7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVZID0gMTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSgkd2luZG93LndpZHRoKCksICR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdhbmltYXRpb25TY2FsZVknLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TY2FsZVkgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUoJHdpbmRvdy53aWR0aCgpLCAkd2luZG93LmhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKiogV2luZG93IFJlc2l6ZSBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIGZvciBlYWNoIGRpc3BsYXkgb2JqZWN0IG9uIHdpbmRvdyByZXNpemUsXG4gICAgLy8gYWRqdXN0aW5nIHRoZSBwaXhlbCBwb3NpdGlvbiB0byBtaXJyb3IgdGhlIHJlbGF0aXZlIHBvc2l0aW9ucyB3aW5kb3dYIGFuZCB3aW5kb3dZXG4gICAgLy8gYW5kIGFkanVzdGluZyBzY2FsZSBpZiBpdCdzIHNldFxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX29uV2luZG93UmVzaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblgod2lkdGgpO1xuICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkoaGVpZ2h0KTtcblxuICAgICAgICBpZih0aGlzLl93aW5kb3dTY2FsZSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmN0aW9uKGRpc3BsYXlPYmplY3QpIHtcbiAgICAgICAgICAgIGRpc3BsYXlPYmplY3QuX29uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKiBTcHJpdGVzaGVldCBUZXh0dXJlIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuICAgIC8vIHVzZWQgdG8gZ2V0IGluZGl2aWR1YWwgdGV4dHVyZXMgb2Ygc3ByaXRlc2hlZXQganNvbiBmaWxlc1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSBjYWxsOiBnZXRGaWxlTmFtZXMoJ2FuaW1hdGlvbl9pZGxlXycsIDEsIDEwNSk7XG4gICAgLy8gUmV0dXJuczogWydhbmltYXRpb25faWRsZV8wMDEucG5nJywgJ2FuaW1hdGlvbl9pZGxlXzAwMi5wbmcnLCAuLi4gLCAnYW5pbWF0aW9uX2lkbGVfMTA0LnBuZyddXG4gICAgLy9cbiAgICBmdW5jdGlvbiBnZXRGaWxlTmFtZXMoZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpIHtcbiAgICAgICAgdmFyIG51bURpZ2l0cyA9IChyYW5nZUVuZC0xKS50b1N0cmluZygpLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gXy5tYXAoXy5yYW5nZShyYW5nZVN0YXJ0LCByYW5nZUVuZCksIGZ1bmN0aW9uKG51bSkge1xuXG4gICAgICAgICAgICB2YXIgbnVtWmVyb3MgPSBudW1EaWdpdHMgLSBudW0udG9TdHJpbmcoKS5sZW5ndGg7ICAgLy9leHRyYSBjaGFyYWN0ZXJzXG4gICAgICAgICAgICB2YXIgemVyb3MgPSBuZXcgQXJyYXkobnVtWmVyb3MgKyAxKS5qb2luKCcwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlUHJlZml4ICsgemVyb3MgKyBudW0gKyAnLnBuZyc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFBJWEkuZ2V0VGV4dHVyZXMgPSBmdW5jdGlvbihmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICByZXR1cm4gXy5tYXAoZ2V0RmlsZU5hbWVzKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgUElYSS5UZXh0dXJlLmZyb21GcmFtZSk7XG4gICAgfVxuXG5cblxuXG5cblxuXG5cbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcbiAgICB2YXIgU2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJyk7XG5cbiAgICB2YXIgaW50cm9WaWRlb01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvaW50cm9WaWRlbycpO1xuICAgIHZhciBiYWNrZ3JvdW5kTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9iYWNrZ3JvdW5kJyk7XG4gICAgdmFyIGJsYWRld2lwZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvYmxhZGV3aXBlJyk7XG4gICAgdmFyIGR1c3R5RGlwcGVyTW9kdWxlID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9kdXN0eURpcHBlcicpO1xuICAgIHZhciBwYXJhY2h1dGVyc01vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvcGFyYWNodXRlcnMnKTtcbiAgICB2YXIgcmVzcG9uc2VNb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL3Jlc3BvbnNlJyk7XG4gICAgdmFyIGNoYXJhY3Rlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvY2hhcmFjdGVyTW9kdWxlJyk7XG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKiBQcmltYXJ5IFBpeGkgQW5pbWF0aW9uIENsYXNzICoqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3BhcmVudCBjb25zdHJ1Y3RvclxuICAgICAgICBTY2VuZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGJhY2tncm91bmRNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZEJhY2tncm91bmRUb1NjZW5lKHRoaXMpO1xuICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBiYWNrZ3JvdW5kTW9kdWxlLmFkZFJlc3RUb1NjZW5lKHRoaXMpO1xuXG4gICAgICAgIHJlc3BvbnNlTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIGJsYWRld2lwZU1vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgICAgICBpbnRyb1ZpZGVvTW9kdWxlLmluaXRpYWxpemUodGhpcyk7XG4gICAgICAgIHRoaXMuaW50cm9WaWRlbyA9IGludHJvVmlkZW9Nb2R1bGUuZ2V0VmlkZW8oKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBNYWluU2NlbmUucHJvdG90eXBlID0ge1xuICAgICAgICBwbGF5V2lwZXNjcmVlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUucGxheVZpZGVvKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2lwZXNjcmVlbkNvbXBsZXRlOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBibGFkZXdpcGVNb2R1bGUub25WaWRlb0NvbXBsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Vc2VyQ2hhcmFjdGVyT3V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUoY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmxhZGV3aXBlTW9kdWxlLmhpZGVWaWRlbygpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydEVudGVyTmFtZUFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlSW4oKTtcblxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDIwMDA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJhY2h1dGVyc01vZHVsZS5hbmltYXRlTmV4dCwgc3RhcnRUaW1lICsgNjAwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcmFjaHV0ZXJzTW9kdWxlLmFuaW1hdGVOZXh0LCBzdGFydFRpbWUgKyAxNTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYXJhY2h1dGVyc01vZHVsZS5oaWRlKCk7XG4gICAgICAgICAgICByZXNwb25zZU1vZHVsZS5zaG93KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVJblVzZXJDaGFyYWN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyTW9kdWxlLmFuaW1hdGVJbigpO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlT3V0VXNlckNoYXJhY3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJNb2R1bGUuYW5pbWF0ZU91dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBQYXJhbGxheCBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNoaWZ0QmFja2dyb3VuZExheWVyczogZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZE1vZHVsZS5zaGlmdEJhY2tncm91bmRMYXllcnMoeCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZpZXc6IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIH0sXG4gICAgICAgIF9vbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICBpZighXy5pc1VuZGVmaW5lZCh0aGlzLnZpZXcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5pbnRyb1ZpZGVvLnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSB0aGlzLmludHJvVmlkZW8uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudmlldy5vbldpbmRvd1Jlc2l6ZSh3aWR0aCwgaGVpZ2h0LCAoYm91bmRzLndpZHRoICogc2NhbGUueCksIChib3VuZHMuaGVpZ2h0ICogc2NhbGUueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG4gICAgLy8gRXh0ZW5kcyBTY2VuZSBDbGFzc1xuICAgIGV4dGVuZChTY2VuZSwgTWFpblNjZW5lKTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluU2NlbmU7XG59KSgpOyIsIlxuXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5cbnZhciBTY2VuZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDQiA9IGZ1bmN0aW9uKCl7fTtcblxuICAgIFBJWEkuU3RhZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblNjZW5lLnByb3RvdHlwZSA9IHtcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24odXBkYXRlQ0IpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDQiA9IHVwZGF0ZUNCO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDQigpO1xuICAgIH0sXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgfSxcbiAgICByZXN1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgaXNQYXVzZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXVzZWQ7XG4gICAgfVxufTtcblxuXG5leHRlbmQoUElYSS5TdGFnZSwgU2NlbmUpO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgU2NlbmVzTWFuYWdlciA9IHtcbiAgICAgICAgc2NlbmVzOiB7fSxcbiAgICAgICAgY3VycmVudFNjZW5lOiBudWxsLFxuICAgICAgICByZW5kZXJlcjogbnVsbCxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgJHBhcmVudERpdikge1xuXG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5yZW5kZXJlcikgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih3aWR0aCwgaGVpZ2h0LCBudWxsLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3LnNldEF0dHJpYnV0ZSgnaWQnLCAncGl4aS12aWV3Jyk7XG4gICAgICAgICAgICAkcGFyZW50RGl2LmFwcGVuZChTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnZpZXcpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShTY2VuZXNNYW5hZ2VyLmxvb3ApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgbG9vcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShmdW5jdGlvbiAoKSB7IFNjZW5lc01hbmFnZXIubG9vcCgpIH0pO1xuXG4gICAgICAgICAgICBpZiAoIVNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lIHx8IFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLmlzUGF1c2VkKCkpIHJldHVybjtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUudXBkYXRlKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlbmRlcihTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZVNjZW5lOiBmdW5jdGlvbihpZCwgU2NlbmVDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgU2NlbmVDb25zdHJ1Y3RvciA9IFNjZW5lQ29uc3RydWN0b3IgfHwgU2NlbmU7ICAgLy9kZWZhdWx0IHRvIFNjZW5lIGJhc2UgY2xhc3NcblxuICAgICAgICAgICAgdmFyIHNjZW5lID0gbmV3IFNjZW5lQ29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXSA9IHNjZW5lO1xuXG4gICAgICAgICAgICByZXR1cm4gc2NlbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdvVG9TY2VuZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHtcbiAgICAgICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnBhdXNlKCk7XG5cbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSA9IFNjZW5lc01hbmFnZXIuc2NlbmVzW2lkXTtcblxuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgcmVzaXplIHRvIG1ha2Ugc3VyZSBhbGwgY2hpbGQgb2JqZWN0cyBpbiB0aGVcbiAgICAgICAgICAgICAgICAvLyBuZXcgc2NlbmUgYXJlIGNvcnJlY3RseSBwb3NpdGlvbmVkXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzdW1lIG5ldyBzY2VuZVxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnJlc3VtZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG5cbiAgICAkd2luZG93Lm9uKCdyZXNpemUnLCBTY2VuZXNNYW5hZ2VyLm9uV2luZG93UmVzaXplKTtcblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xufSkoKTsiLCJcblxuXG5cblxudmFyIGF1ZGlvQXNzZXRzID0gcmVxdWlyZSgnLi9kYXRhL2F1ZGlvQXNzZXRzLmpzb24nKTtcblxudmFyIHNvdW5kUGxheWVyID0ge1xuICAgIG11dGVkOiBmYWxzZSxcbiAgICB2b2x1bWU6IDAuNCxcbiAgICBzb3VuZHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuc291bmRzW2ZpbGVQYXRoXSA9IHRoaXMuc291bmRzW2ZpbGVQYXRoXSB8fCBuZXcgQXVkaW8oZmlsZVBhdGgpO1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5hZGQoZmlsZVBhdGgpO1xuXG4gICAgICAgIGlmKCF0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0udm9sdW1lID0gdGhpcy52b2x1bWU7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0ucGxheSgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheScsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXy5lYWNoKGF1ZGlvQXNzZXRzLCBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHNvdW5kUGxheWVyLmFkZChmaWxlUGF0aCk7XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc291bmRQbGF5ZXI7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm5hbWUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgdmFsdWU9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIGlkPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiAvPlxcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy50ZXh0KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnRleHQpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcblxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3B5KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcHkpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMSwgcHJvZ3JhbTEsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGFzc2V0RGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvYXNzZXRzLmpzb24nKTtcblxudmFyIGZpbGVOYW1lcyA9IE9iamVjdC5rZXlzKGFzc2V0RGF0YS5hc3NldHMpO1xudmFyIHRvdGFsRmlsZXMgPSBmaWxlTmFtZXMubGVuZ3RoO1xuXG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIExvYWRlciAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihmaWxlTmFtZXMpO1xuXG5mdW5jdGlvbiBzdGFydExvYWRlcih2aWV3KSB7XG4gICAgbG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmlldy51cGRhdGUodGhpcy5sb2FkQ291bnQpO1xuICAgIH07XG4gICAgbG9hZGVyLm9uQ29tcGxldGUgPSBfLmJpbmQodmlldy5hc3NldHNMb2FkZWQsIHZpZXcpO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiBWaWV3ICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbnZhciBBc3NldExvYWRpbmdWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnI2Fzc2V0TG9hZGVyJyxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJHRleHQgPSB0aGlzLiRlbC5maW5kKCc+IC50ZXh0Jyk7XG4gICAgICAgIHRoaXMuJHRleHQuaHRtbCgnMC4wMCUnKTtcblxuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IG9wdGlvbnMub25Db21wbGV0ZSB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgICAgc3RhcnRMb2FkZXIodGhpcyk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGxvYWRDb3VudCkge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwMDAgKiAodG90YWxGaWxlcy1sb2FkQ291bnQpL3RvdGFsRmlsZXMpLzEwMDtcblxuICAgICAgICB0aGlzLiR0ZXh0Lmh0bWwocGVyY2VudGFnZSArICclJyk7XG4gICAgfSxcbiAgICBhc3NldHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuXG4gICAgICAgIHRoaXMuJHRleHQuaGlkZSgpO1xuICAgICAgICB2YXIgJGVsID0gdGhpcy4kZWw7XG4gICAgICAgIFR3ZWVuTGl0ZS50bygkZWwsIDEuNCwge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRlbC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldExvYWRpbmdWaWV3OyIsIlxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuICAgIHZhciBkdXN0eURpcHBlck1vZHVsZSA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvZHVzdHlEaXBwZXInKTtcblxuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2Rpdi5uYW1lLnBhZ2UnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjaGFuZ2UgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnLFxuICAgICAgICAgICAgJ2tleXVwIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdwYXN0ZSBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiogSW5pdGlhbGl6YXRpb24gKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICAgIF8uYmluZEFsbCh0aGlzLCAnc3RhcnRBbmltYXRpb24nLCdzaG93JywnaGlkZScsJ3NldEluYWN0aXZlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRTY2VuZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5zY2VuZXNbJ21haW4nXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKiogUnVuIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzdGFydEFuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjcGl4aS12aWV3JykucmVtb3ZlQ2xhc3MoJ2Zyb250Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc3RhcnRFbnRlck5hbWVBbmltYXRpb24oKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIFNob3cvSGlkZSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuZ29Ub1NjZW5lKCdtYWluJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zdGFydEFuaW1hdGlvbiwgMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGR1c3R5RGlwcGVyTW9kdWxlLm9uQW5pbWF0aW9uT3V0Q29tcGxldGUodGhpcy5zZXRJbmFjdGl2ZSk7XG5cbiAgICAgICAgICAgIC8vcnVuIGhpZGUgYW5pbWF0aW9uXG4gICAgICAgICAgICBkdXN0eURpcHBlck1vZHVsZS5hbmltYXRlT3V0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEluYWN0aXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uTmFtZUNoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB0aGlzLiRuYW1lSW5wdXQudmFsKCl9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVZpZXc7XG59KSgpO1xuIiwiXG5cblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzb3VuZFBsYXllciA9IHJlcXVpcmUoJy4uL3NvdW5kUGxheWVyJyk7XG5cbiAgICB2YXIgRm9vdGVyVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS52b2x1bWUnOiAnb25Wb2x1bWVUb2dnbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm51bURvdHMgPSBvcHRpb25zLm51bURvdHM7XG5cblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENvdW50ZXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzID0gdGhpcy4kZWwuZmluZCgnYS52b2x1bWUgcGF0aCcpO1xuICAgICAgICAgICAgdGhpcy4kY291bnRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5jb3VudGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRkb3RzID0gdGhpcy4kY291bnRlci5maW5kKCc+IC5kb3QnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFZvbHVtZUFuaW1hdGlvblRpbWVsaW5lczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uQW5pbWF0aW9uID0gdGhpcy5nZXRUaW1lbGluZVZvbHVtZU9uKCk7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPZmYoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdENvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG51bURvdHMgPSB0aGlzLm51bURvdHM7XG5cbiAgICAgICAgICAgIHZhciAkZG90ID0gdGhpcy4kZG90cy5lcSgwKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMjsgaSA8PSBudW1Eb3RzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgJG5ld0RvdCA9ICRkb3QuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAkbmV3RG90LmZpbmQoJz4gZGl2Lm51bWJlcicpLmh0bWwoaSk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5hcHBlbmRUbyh0aGlzLiRjb3VudGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QgPSAkZG90O1xuICAgICAgICAgICAgJGRvdC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqIFZvbHVtZSBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICB0b2dnbGVWb2x1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9ICF0aGlzLnZvbHVtZU9uO1xuXG4gICAgICAgICAgICBpZih0aGlzLnZvbHVtZU9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICAgICAgc291bmRQbGF5ZXIub2ZmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVuZE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZWFzaW5nOiAnQmFjay5lYXNlT3V0Jywgb3BhY2l0eTogMX07XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAuNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVuZE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlYXNpbmc6ICdCYWNrLmVhc2VJbicsIG9wYWNpdHk6IDB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgb25cbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoMSwwLDAsMSwwLDApJyk7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5jc3MoJ29wYWNpdHknLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAuNSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkU3ZnUGF0aEFuaW1hdGlvbjogZnVuY3Rpb24odGltZWxpbmUsICRwYXRoLCBzdGFydFRpbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBhbmltYXRpb25TcGVlZCA9IDAuMjtcblxuICAgICAgICAgICAgdmFyIHBhdGhNYXRyaXggPSBfLmNsb25lKG9wdGlvbnMuc3RhcnRNYXRyaXgpO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5BdHRycyA9IHtcbiAgICAgICAgICAgICAgICBlYXNlOiBvcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXRoLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoJyArIHBhdGhNYXRyaXguam9pbignLCcpICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0d2VlbkF0dHJzLCBvcHRpb25zLmVuZE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oJHBhdGgsIGFuaW1hdGlvblNwZWVkLCB7b3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5fSksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8ocGF0aE1hdHJpeCwgYW5pbWF0aW9uU3BlZWQsIHR3ZWVuQXR0cnMpLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBDb3VudGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNldENvdW50ZXI6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMuZXEoaSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gdGhpcy4kZG90cy5lcShpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kY291bnRlci5oaWRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5vdXRlckhlaWdodCgpICsgdGhpcy4kY291bnRlci5vdXRlckhlaWdodCgpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25Wb2x1bWVUb2dnbGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy50b2dnbGVWb2x1bWUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEZvb3RlclZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcbiAgICB2YXIgSW50cm9TY2VuZSA9IHJlcXVpcmUoJy4uL3BpeGkvaW50cm9TY2VuZScpO1xuXG4gICAgdmFyIGludHJvVmlkZW9Nb2R1bGUgPSByZXF1aXJlKCcuLi9hbmltYXRpb25zL2ludHJvVmlkZW8nKTtcblxuICAgIHZhciBJbnRyb1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2ludHJvLXZpZXcnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLmJlZ2luJzogJ29uQmVnaW5DbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb25UaW1lbGluZSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2NlbmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRiZWdpblNjcmVlbiA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5iZWdpbi1zY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luTGluZXMgPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdkaXYubGluZScpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4gPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdhLmJlZ2luJyk7XG5cbiAgICAgICAgICAgIHZhciAkdmlld1BvcnRzID0gdGhpcy4kZWwuZmluZCgnZGl2LnZpZXdwb3J0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHZpZXdQb3J0VG9wID0gJHZpZXdQb3J0cy5maWx0ZXIoJy50b3AnKTtcbiAgICAgICAgICAgIHRoaXMuJHZpZXdQb3J0Qm90dG9tID0gJHZpZXdQb3J0cy5maWx0ZXIoJy5idG0nKTtcblxuICAgICAgICAgICAgdGhpcy4kdmVydGljYWxTaWRlcyA9ICR2aWV3UG9ydHMuZmluZCgnLnZlcnRpY2FsJyk7XG4gICAgICAgICAgICB0aGlzLiRob3Jpem9udGFsU2lkZXMgPSAkdmlld1BvcnRzLmZpbmQoJy5ob3Jpem9udGFsJyk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kcyA9ICR2aWV3UG9ydHMuZmluZCgnLmJhY2tncm91bmQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEFuaW1hdGlvblRpbWVsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudGltZWxpbmVIaWRlID0gdGhpcy5nZXRUaW1lbGluZUhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluID0gdGhpcy5nZXRUaW1lbGluZUJlZ2luU2NyZWVuSW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFNjZW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLnNjZW5lc1snbWFpbiddO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNldFZpZXcodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0JlZ2luU2NyZWVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KF8uYmluZCh0aW1lbGluZS5wbGF5LCB0aW1lbGluZSksIDIwMCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBnZXRUaW1lbGluZUJlZ2luU2NyZWVuSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0JhY2suZWFzZU91dCc7XG5cbiAgICAgICAgICAgIHZhciB0d2VlbnMgPSBfLm1hcCh0aGlzLiRiZWdpbkxpbmVzLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhsaW5lLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHR3ZWVuczogdHdlZW5zLFxuICAgICAgICAgICAgICAgIHN0YWdnZXI6IDAuMDgsXG4gICAgICAgICAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kYmVnaW5CdG4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvblN0YXJ0U2NvcGU6IHRoaXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYnRuSW5UaW1lID0gMC40O1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlWTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luQnRuLCAwLjYsIHtcbiAgICAgICAgICAgICAgICBzY2FsZVg6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogJ0VsYXN0aWMuZWFzZU91dCdcbiAgICAgICAgICAgIH0pLCBidG5JblRpbWUgKyAoYW5pbWF0aW9uVGltZSAqIDAuMDUpKTtcblxuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKiogU3RhdGljIFZhcmlhYmxlcyAqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqIFRpbWVsaW5lICoqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0aW9uRmluaXNoZWQsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVNjb3BlOiB0aGlzXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiRiZWdpblNjcmVlbiwgYW5pbWF0aW9uVGltZS80LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgICAgIH0pLCAwKTtcblxuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiR2aWV3UG9ydFRvcCwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIHRvcDogJy01MCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byh0aGlzLiR2aWV3UG9ydEJvdHRvbSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgICAgIGJvdHRvbTogJy01MCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQW5pbWF0aW9uRmluaXNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRJbmFjdGl2ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2luYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogRXZlbnRzICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgICAgICBvbkJlZ2luQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbih3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZHMud2lkdGgodmlkZW9XaWR0aCAqIDEuMjc1IHwgMCk7XG4gICAgICAgICAgICB0aGlzLiRob3Jpem9udGFsU2lkZXMuaGVpZ2h0KCgod2luZG93SGVpZ2h0IC0gdmlkZW9IZWlnaHQpLzIgKyAxKSB8IDApOyAvL3JvdW5kIHVwXG4gICAgICAgICAgICB0aGlzLiR2ZXJ0aWNhbFNpZGVzLndpZHRoKCgod2luZG93V2lkdGggLSB2aWRlb1dpZHRoKS8yICsgMSkgfCAwKTsgLy9yb3VuZCB1cFxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIFB1YmxpYyBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcblxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKTtcbiAgICAgICAgICAgICQoJyNwaXhpLXZpZXcnKS5hZGRDbGFzcygnZnJvbnQnKTtcblxuICAgICAgICAgICAgaW50cm9WaWRlb01vZHVsZS5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dCZWdpblNjcmVlbiwgdGhpcykpO1xuICAgICAgICAgICAgaW50cm9WaWRlb01vZHVsZS5wbGF5VmlkZW8oKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZS5wbGF5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbnRyb1ZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIE1haW5TY2VuZSA9IHJlcXVpcmUoJy4uL3BpeGkvbWFpblNjZW5lJyk7XG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcblxuICAgIC8vIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiBDb2xsZWN0aW9ucyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICB2YXIgYWxsUXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvYWxsUXVlc3Rpb25zJyk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gVmlld3Mgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIEludHJvVmlldyA9IHJlcXVpcmUoJy4vaW50cm9WaWV3Jyk7XG4gICAgdmFyIEVudGVyTmFtZVZpZXcgPSByZXF1aXJlKCcuL2VudGVyTmFtZVZpZXcnKTtcbiAgICB2YXIgUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9xdWVzdGlvblZpZXcnKTtcbiAgICB2YXIgU2VsZWN0Q2hhcmFjdGVyVmlldyA9IHJlcXVpcmUoJy4vc2VsZWN0Q2hhcmFjdGVyVmlldycpO1xuICAgIHZhciBSZXNwb25zZVZpZXcgPSByZXF1aXJlKCcuL3Jlc3BvbnNlVmlldycpO1xuICAgIHZhciBGb290ZXJWaWV3ID0gcmVxdWlyZSgnLi9mb290ZXJWaWV3Jyk7XG5cblxuXG4gICAgdmFyIE1haW5WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNjb250ZW50JyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS5uZXh0JzogJ29uTmV4dCcsXG4gICAgICAgICAgICAnY2xpY2sgYS5maW5pc2gtc2VuZCc6ICdvbkZpbmlzaCcsXG4gICAgICAgICAgICAnbW91c2Vtb3ZlJzogJ29uTW91c2VNb3ZlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXggPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRKcXVlcnlWYXJpYWJsZXMoKTtcblxuICAgICAgICAgICAgLy9jcmVhdGUgY2FudmFzIGVsZW1lbnRcbiAgICAgICAgICAgIHNjZW5lc01hbmFnZXIuaW5pdGlhbGl6ZSh0aGlzLiR3aW5kb3cud2lkdGgoKSwgdGhpcy4kd2luZG93LmhlaWdodCgpLCB0aGlzLiRlbCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLmNyZWF0ZVNjZW5lKCdtYWluJywgTWFpblNjZW5lKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0V2luZG93RXZlbnRzKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFdpbmRvd0V2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5pdCB3aW5kb3cgRXZlbnRzJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5vbigncmVzaXplJywgXy5iaW5kKHRoaXMucmVwb3NpdGlvblBhZ2VOYXYsIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW9yaWVudGF0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvcmllbnRhdGlvbicsIGV2ZW50LmJldGEsIGV2ZW50LmdhbW1hKTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldmljZW1vdGlvbicpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3Rpb24nLCBldmVudC5hY2NlbGVyYXRpb24ueCAqIDIsIGV2ZW50LmFjY2VsZXJhdGlvbi55ICogMik7XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3ogb3JpZW50YXRpb24nKTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiTW96T3JpZW50YXRpb25cIiwgZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21veicsIG9yaWVudGF0aW9uLnggKiA1MCwgb3JpZW50YXRpb24ueSAqIDUwKTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SW50cm9WaWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSBuZXcgSW50cm9WaWV3KCk7XG5cbiAgICAgICAgICAgIGludHJvVmlldy5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dGaXJzdFBhZ2UsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcgPSBpbnRyb1ZpZXc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFBhZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyTW9kZWwgPSBfLmZpcnN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTW9kZWxzID0gXy5yZXN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuXG4gICAgICAgICAgICB2YXIgZW50ZXJOYW1lVmlldyA9IG5ldyBFbnRlck5hbWVWaWV3KCk7XG4gICAgICAgICAgICB2YXIgc2VsZWN0Q2hhclZpZXcgPSBuZXcgU2VsZWN0Q2hhcmFjdGVyVmlldyh7bW9kZWw6IGNoYXJNb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25WaWV3cyA9IF8ubWFwKHF1ZXN0aW9uTW9kZWxzLCBmdW5jdGlvbihxdWVzdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVzdGlvblZpZXcoe21vZGVsOiBxdWVzdGlvbk1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtlbnRlck5hbWVWaWV3LCBzZWxlY3RDaGFyVmlld10uY29uY2F0KHF1ZXN0aW9uVmlld3MpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYucGFnZXMtY3RuJyk7XG5cbiAgICAgICAgICAgIHZhciAkYmFja2dyb3VuZHMgPSB0aGlzLiRlbC5maW5kKCc+IGRpdi5iYWNrZ3JvdW5kJyk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kcyA9ICRiYWNrZ3JvdW5kcztcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZHMuZmlsdGVyKCcuYmFjaycpO1xuICAgICAgICAgICAgdGhpcy4kbWlkZGxlZ3JvdW5kID0gJGJhY2tncm91bmRzLmZpbHRlcignLm1pZGRsZScpO1xuICAgICAgICAgICAgdGhpcy4kZm9yZWdyb3VuZCA9ICRiYWNrZ3JvdW5kcy5maWx0ZXIoJy5mcm9udCcpO1xuXG4gICAgICAgICAgICB0aGlzLiRwYWdlTmF2ID0gdGhpcy4kcGFnZXNDb250YWluZXIuZmluZCgnZGl2LnBhZ2UtbmF2Jyk7XG4gICAgICAgICAgICB0aGlzLiRuZXh0ID0gdGhpcy4kcGFnZU5hdi5maW5kKCdhLm5leHQnKTtcbiAgICAgICAgICAgIHRoaXMuJGZpbmlzaFNlbmQgPSB0aGlzLiRwYWdlTmF2LmZpbmQoJ2EuZmluaXNoLXNlbmQnKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIENoYW5nZSBWaWV3IEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNob3dGaXJzdFBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlc1swXS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vaGlkZSBhY3RpdmUgcGFnZVxuICAgICAgICAgICAgdmFyIGFjdGl2ZVBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGUgaW4gY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hbmltYXRlSW5Vc2VyQ2hhcmFjdGVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUGFnZU5hdih0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1BhZ2VBZnRlckhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9zaG93IG5leHQgcGFnZVxuICAgICAgICAgICAgdmFyIG5leHRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG4gICAgICAgICAgICBuZXh0UGFnZS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLnNldENvdW50ZXIodGhpcy5hY3RpdmVQYWdlSW5kZXgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9PT0gdGhpcy5wYWdlcy5sZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZpbmlzaEJ0bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaG93RmluaXNoQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHQuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQW5kU2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdlc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmZvb3Rlci5oaWRlQ291bnRlcigpO1xuXG4gICAgICAgICAgICB2YXIgcGFnZU1vZGVscyA9IF8ubWFwKHRoaXMucGFnZXMsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5tb2RlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2V0UmVzcG9uc2UocGFnZU1vZGVscyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUub25Vc2VyQ2hhcmFjdGVyT3V0KF8uYmluZCh0aGlzLnNjZW5lLnBsYXlXaXBlc2NyZWVuLCB0aGlzLnNjZW5lKSk7XG5cbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLm9uV2lwZXNjcmVlbkNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1lLiRiYWNrZ3JvdW5kcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgbWUucmVzcG9uc2VWaWV3LnNob3coKTtcbiAgICAgICAgICAgICAgICBtZS5zY2VuZS5zaG93UmVzcG9uc2UoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3NldCBjYW52YXMgdG8gYmUgaW4gZnJvbnQgb2YgdHJlZXNcbiAgICAgICAgICAgICQoJyNwaXhpLXZpZXcnKS5hZGRDbGFzcygnbWlkZGxlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYW5pbWF0ZU91dFVzZXJDaGFyYWN0ZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVwb3NpdGlvblBhZ2VOYXY6IGZ1bmN0aW9uKGFuaW1hdGUpIHtcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG5cbiAgICAgICAgICAgIHZhciBwaXhlbFBvc2l0aW9uID0gKGFjdGl2ZVBhZ2UuJGVsLm9mZnNldCgpLnRvcCArIGFjdGl2ZVBhZ2UuJGVsLmhlaWdodCgpKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IHRoaXMuJHdpbmRvdy5oZWlnaHQoKTtcblxuXG4gICAgICAgICAgICB2YXIgdG9wRnJhYyA9IE1hdGgubWluKHBpeGVsUG9zaXRpb24vd2luZG93SGVpZ2h0LCAod2luZG93SGVpZ2h0IC0gdGhpcy5mb290ZXIuaGVpZ2h0KCkgLSB0aGlzLiRwYWdlTmF2Lm91dGVySGVpZ2h0KCkpL3dpbmRvd0hlaWdodCk7XG5cbiAgICAgICAgICAgIHZhciBwZXJjVG9wID0gMTAwICogdG9wRnJhYyArICclJztcblxuICAgICAgICAgICAgaWYoISFhbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuJHBhZ2VOYXYsIDAuMiwge3RvcDogcGVyY1RvcCwgZWFzZTonUXVhZC5lYXNlSW5PdXQnfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kcGFnZU5hdi5jc3MoJ3RvcCcsIHBlcmNUb3ApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSB0aGlzLmludHJvVmlldztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpbnRyb1ZpZXcuc3RhcnQoKTsgLy9zdGFydCBpbnRyb1xuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvbk5leHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmVQYWdlSW5kZXggPj0gKHRoaXMucGFnZXMubGVuZ3RoIC0gMSkpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkZpbmlzaDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLmZpbmlzaEFuZFNlbmQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Nb3VzZU1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaGlmdEJhY2tncm91bmRMYXllcnMoZS5wYWdlWC90aGlzLiR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haW5WaWV3O1xuXG5cblxufSkoKTsiLCJcblxudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3F1ZXN0aW9uLmhicycpO1xuXG52YXIgUXVlc3Rpb25WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIC8vIFZhcmlhYmxlc1xuICAgIGNsYXNzTmFtZTogJ3F1ZXN0aW9uIHBhZ2UnLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgaW5wdXRbdHlwZT1yYWRpb10nOiAnb25SYWRpb0NoYW5nZSdcbiAgICB9LFxuICAgIC8vIEZ1bmN0aW9uc1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcblxuICAgICAgICBvcHRpb25zLnBhcmVudC5hcHBlbmQodGhpcy5lbCk7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3ModGhpcy5tb2RlbC5hdHRyaWJ1dGVzLmNsYXNzKTtcbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5lbC5pbm5lckhUTUwgPT09ICcnKVxuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMuaGlkZUNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgb25SYWRpb0NoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7dmFsdWU6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyl9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJcblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuXG4gICAgdmFyIFJlc3BvbnNlVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjcmVzcG9uc2UnLFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy90aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5jcmVhdGVTY2VuZSgncmVzcG9uc2UnLCBSZXNwb25zZVNjZW5lKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZXNwb25zZTogZnVuY3Rpb24obW9kZWxzKSB7XG5cbiAgICAgICAgICAgIHZhciBuYW1lTW9kZWwgPSBfLmZpcnN0KG1vZGVscyk7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aXRpb25lZFF1ZXN0aW9ucyA9IF8ucGFydGl0aW9uKF8ucmVzdChtb2RlbHMpLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbC5hdHRyaWJ1dGVzLmNsYXNzICE9PSAnY2FubmVkJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1swXTtcbiAgICAgICAgICAgIHZhciBjYW5uZWRNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1sxXTtcblxuXG5cblxuICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHRvIGFjdHVhbCBnZW5lcmF0ZWQgcmVzcG9uc2VcbiAgICAgICAgICAgIHZhciBodG1sID0gJ05hbWU6ICcgKyBuYW1lTW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxici8+JztcblxuICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24oc3RyLCBtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyBtb2RlbC5hdHRyaWJ1dGVzLm5hbWUgKyAnOiAnICsgbW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG4gICAgICAgICAgICB9LCAnJyk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxici8+JztcblxuICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKHN0ciwgbW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgbW9kZWwuYXR0cmlidXRlcy5uYW1lICsgJzogJyArIG1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgKyAnPGJyLz4nO1xuICAgICAgICAgICAgfSwgJycpO1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKGh0bWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuXG4gICAgICAgICAgICAvL3NjZW5lc01hbmFnZXIuZ29Ub1NjZW5lKCdyZXNwb25zZScpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG5cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zZVZpZXc7XG59KSgpOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgc291bmRQbGF5ZXIgPSByZXF1aXJlKCcuLi9zb3VuZFBsYXllcicpO1xuICAgIHZhciBhdWRpb0Fzc2V0cyA9IHJlcXVpcmUoJy4uL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xuXG4gICAgdmFyIFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3Jyk7XG5cblxuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gUXVlc3Rpb25WaWV3LmV4dGVuZCh7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZVBhdGggPSBhdWRpb0Fzc2V0c1tlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpXTtcblxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheShmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
