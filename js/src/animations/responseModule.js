
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