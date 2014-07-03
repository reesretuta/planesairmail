
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