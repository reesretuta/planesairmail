(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){



var Question = require('../models/question');


var QuestionCollection = Backbone.Collection.extend({
    model: Question
});




module.exports = QuestionCollection;
},{"../models/question":9}],2:[function(require,module,exports){




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

},{"../data/cannedQuestions.json":5,"../data/characterSelect.json":6,"../data/personalityQuestions.json":7,"./QuestionCollection":1}],3:[function(require,module,exports){
module.exports=[
"assets/introVideo/PLANES2_760x428_00000.png",
"assets/introVideo/PLANES2_760x428_00001.png",
"assets/introVideo/PLANES2_760x428_00002.png",
"assets/introVideo/PLANES2_760x428_00003.png",
"assets/introVideo/PLANES2_760x428_00004.png",
"assets/introVideo/PLANES2_760x428_00005.png",
"assets/introVideo/PLANES2_760x428_00006.png",
"assets/introVideo/PLANES2_760x428_00007.png",
"assets/introVideo/PLANES2_760x428_00008.png",
"assets/introVideo/PLANES2_760x428_00009.png",
"assets/introVideo/PLANES2_760x428_00010.png",
"assets/introVideo/PLANES2_760x428_00011.png",
"assets/introVideo/PLANES2_760x428_00012.png",
"assets/introVideo/PLANES2_760x428_00013.png",
"assets/introVideo/PLANES2_760x428_00014.png",
"assets/introVideo/PLANES2_760x428_00015.png",
"assets/introVideo/PLANES2_760x428_00016.png",
"assets/introVideo/PLANES2_760x428_00017.png",
"assets/introVideo/PLANES2_760x428_00018.png",
"assets/introVideo/PLANES2_760x428_00019.png",
"assets/introVideo/PLANES2_760x428_00020.png",
"assets/introVideo/PLANES2_760x428_00021.png",
"assets/introVideo/PLANES2_760x428_00022.png",
"assets/introVideo/PLANES2_760x428_00023.png",
"assets/introVideo/PLANES2_760x428_00024.png",
"assets/introVideo/PLANES2_760x428_00025.png",
"assets/introVideo/PLANES2_760x428_00026.png",
"assets/introVideo/PLANES2_760x428_00027.png",
"assets/introVideo/PLANES2_760x428_00028.png",
"assets/introVideo/PLANES2_760x428_00029.png",
"assets/introVideo/PLANES2_760x428_00030.png",
"assets/introVideo/PLANES2_760x428_00031.png",
"assets/introVideo/PLANES2_760x428_00032.png",
"assets/introVideo/PLANES2_760x428_00033.png",
"assets/introVideo/PLANES2_760x428_00034.png",
"assets/introVideo/PLANES2_760x428_00035.png",
"assets/introVideo/PLANES2_760x428_00036.png",
"assets/introVideo/PLANES2_760x428_00037.png",
"assets/introVideo/PLANES2_760x428_00038.png",
"assets/introVideo/PLANES2_760x428_00039.png",
"assets/introVideo/PLANES2_760x428_00040.png",
"assets/introVideo/PLANES2_760x428_00041.png",
"assets/introVideo/PLANES2_760x428_00042.png",
"assets/introVideo/PLANES2_760x428_00043.png",
"assets/introVideo/PLANES2_760x428_00044.png",
"assets/introVideo/PLANES2_760x428_00045.png",
"assets/introVideo/PLANES2_760x428_00046.png",
"assets/introVideo/PLANES2_760x428_00047.png",
"assets/introVideo/PLANES2_760x428_00048.png",
"assets/introVideo/PLANES2_760x428_00049.png",
"assets/introVideo/PLANES2_760x428_00050.png",
"assets/introVideo/PLANES2_760x428_00051.png",
"assets/introVideo/PLANES2_760x428_00052.png",
"assets/introVideo/PLANES2_760x428_00053.png",
"assets/introVideo/PLANES2_760x428_00054.png",
"assets/introVideo/PLANES2_760x428_00055.png",
"assets/introVideo/PLANES2_760x428_00056.png",
"assets/introVideo/PLANES2_760x428_00057.png",
"assets/introVideo/PLANES2_760x428_00058.png",
"assets/introVideo/PLANES2_760x428_00059.png",
"assets/introVideo/PLANES2_760x428_00060.png",
"assets/introVideo/PLANES2_760x428_00061.png",
"assets/introVideo/PLANES2_760x428_00062.png",
"assets/introVideo/PLANES2_760x428_00063.png",
"assets/introVideo/PLANES2_760x428_00064.png",
"assets/introVideo/PLANES2_760x428_00065.png",
"assets/introVideo/PLANES2_760x428_00066.png",
"assets/introVideo/PLANES2_760x428_00067.png",
"assets/introVideo/PLANES2_760x428_00068.png",
"assets/introVideo/PLANES2_760x428_00069.png",
"assets/introVideo/PLANES2_760x428_00070.png",
"assets/introVideo/PLANES2_760x428_00071.png",
"assets/introVideo/PLANES2_760x428_00072.png",
"assets/introVideo/PLANES2_760x428_00073.png",
"assets/introVideo/PLANES2_760x428_00074.png",
"assets/introVideo/PLANES2_760x428_00075.png",
"assets/introVideo/PLANES2_760x428_00076.png",
"assets/introVideo/PLANES2_760x428_00077.png",
"assets/introVideo/PLANES2_760x428_00078.png",
"assets/introVideo/PLANES2_760x428_00079.png",
"assets/introVideo/PLANES2_760x428_00080.png",
"assets/introVideo/PLANES2_760x428_00081.png",
"assets/introVideo/PLANES2_760x428_00082.png",
"assets/introVideo/PLANES2_760x428_00083.png",
"assets/introVideo/PLANES2_760x428_00084.png",
"assets/introVideo/PLANES2_760x428_00085.png",
"assets/introVideo/PLANES2_760x428_00086.png",
"assets/introVideo/PLANES2_760x428_00087.png",
"assets/introVideo/PLANES2_760x428_00088.png",
"assets/introVideo/PLANES2_760x428_00089.png",
"assets/introVideo/PLANES2_760x428_00090.png",
"assets/introVideo/PLANES2_760x428_00091.png",
"assets/introVideo/PLANES2_760x428_00092.png",
"assets/introVideo/PLANES2_760x428_00093.png",
"assets/introVideo/PLANES2_760x428_00094.png",
"assets/introVideo/PLANES2_760x428_00095.png",
"assets/introVideo/PLANES2_760x428_00096.png",
"assets/introVideo/PLANES2_760x428_00097.png",
"assets/introVideo/PLANES2_760x428_00098.png",
"assets/introVideo/PLANES2_760x428_00099.png",
"assets/introVideo/PLANES2_760x428_00100.png",
"assets/introVideo/PLANES2_760x428_00101.png",
"assets/introVideo/PLANES2_760x428_00102.png",
"assets/introVideo/PLANES2_760x428_00103.png",
"assets/introVideo/PLANES2_760x428_00104.png",
"assets/introVideo/PLANES2_760x428_00105.png",
"assets/introVideo/PLANES2_760x428_00106.png",
"assets/introVideo/PLANES2_760x428_00107.png",
"assets/introVideo/PLANES2_760x428_00108.png",
"assets/introVideo/PLANES2_760x428_00109.png",
"assets/introVideo/PLANES2_760x428_00110.png",
"assets/introVideo/PLANES2_760x428_00111.png",
"assets/introVideo/PLANES2_760x428_00112.png",
"assets/introVideo/PLANES2_760x428_00113.png",
"assets/introVideo/PLANES2_760x428_00114.png",
"assets/introVideo/PLANES2_760x428_00115.png",
"assets/introVideo/PLANES2_760x428_00116.png",
"assets/introVideo/PLANES2_760x428_00117.png",
"assets/introVideo/PLANES2_760x428_00118.png",
"assets/introVideo/PLANES2_760x428_00119.png",
"assets/introVideo/PLANES2_760x428_00120.png",
"assets/introVideo/PLANES2_760x428_00121.png",
"assets/wipescreen/Blade_wpscrn_86400.png",
"assets/wipescreen/Blade_wpscrn_86401.png",
"assets/wipescreen/Blade_wpscrn_86402.png",
"assets/wipescreen/Blade_wpscrn_86403.png",
"assets/wipescreen/Blade_wpscrn_86404.png",
"assets/wipescreen/Blade_wpscrn_86405.png",
"assets/wipescreen/Blade_wpscrn_86406.png",
"assets/wipescreen/Blade_wpscrn_86407.png",
"assets/wipescreen/Blade_wpscrn_86408.png",
"assets/wipescreen/Blade_wpscrn_86409.png",
"assets/wipescreen/Blade_wpscrn_86410.png",
"assets/wipescreen/Blade_wpscrn_86411.png",
"assets/wipescreen/Blade_wpscrn_86412.png",
"assets/wipescreen/Blade_wpscrn_86413.png",
"assets/wipescreen/Blade_wpscrn_86414.png",
"assets/wipescreen/Blade_wpscrn_86415.png",
"assets/wipescreen/Blade_wpscrn_86416.png",
"assets/wipescreen/Blade_wpscrn_86417.png",
"assets/wipescreen/Blade_wpscrn_86418.png",
"assets/wipescreen/Blade_wpscrn_86419.png",
"assets/wipescreen/Blade_wpscrn_86420.png",
"assets/wipescreen/Blade_wpscrn_86421.png",
"assets/wipescreen/Blade_wpscrn_86422.png",
"assets/wipescreen/Blade_wpscrn_86423.png",
"assets/wipescreen/Blade_wpscrn_86424.png",
"assets/wipescreen/Blade_wpscrn_86425.png",
"assets/wipescreen/Blade_wpscrn_86426.png",
"assets/wipescreen/Blade_wpscrn_86427.png",
"assets/wipescreen/Blade_wpscrn_86428.png",
"assets/wipescreen/Blade_wpscrn_86429.png",
"assets/wipescreen/Blade_wpscrn_86430.png",
"assets/wipescreen/Blade_wpscrn_86431.png",
"assets/wipescreen/Blade_wpscrn_86432.png",
"assets/wipescreen/Blade_wpscrn_86433.png",
"assets/wipescreen/Blade_wpscrn_86434.png",
"assets/wipescreen/Blade_wpscrn_86435.png",
"assets/wipescreen/Blade_wpscrn_86436.png",
"assets/wipescreen/Blade_wpscrn_86437.png",
"assets/wipescreen/Blade_wpscrn_86438.png",
"assets/wipescreen/Blade_wpscrn_86439.png",
"assets/wipescreen/Blade_wpscrn_86440.png",
"assets/wipescreen/Blade_wpscrn_86441.png",
"assets/wipescreen/Blade_wpscrn_86442.png",
"assets/wipescreen/Blade_wpscrn_86443.png",
"assets/wipescreen/Blade_wpscrn_86444.png",
"assets/wipescreen/Blade_wpscrn_86445.png",
"assets/wipescreen/Blade_wpscrn_86446.png",
"assets/wipescreen/Blade_wpscrn_86447.png",
"assets/wipescreen/Blade_wpscrn_86448.png",
"assets/wipescreen/Blade_wpscrn_86449.png",
"assets/wipescreen/Blade_wpscrn_86450.png",
"assets/wipescreen/Blade_wpscrn_86451.png",
"assets/wipescreen/Blade_wpscrn_86452.png",
"assets/wipescreen/Blade_wpscrn_86453.png",
"assets/wipescreen/Blade_wpscrn_86454.png",
"assets/wipescreen/Blade_wpscrn_86455.png",
"assets/wipescreen/Blade_wpscrn_86456.png",
"assets/wipescreen/Blade_wpscrn_86457.png",
"assets/wipescreen/Blade_wpscrn_86458.png",
"assets/wipescreen/Blade_wpscrn_86459.png",
"assets/wipescreen/Blade_wpscrn_86460.png",
"assets/wipescreen/Blade_wpscrn_86461.png",
"assets/wipescreen/Blade_wpscrn_86462.png",
"assets/wipescreen/Blade_wpscrn_86463.png",
"assets/wipescreen/Blade_wpscrn_86464.png",
"assets/wipescreen/Blade_wpscrn_86465.png",
"assets/wipescreen/Blade_wpscrn_86466.png",
"assets/wipescreen/Blade_wpscrn_86467.png",
"assets/wipescreen/Blade_wpscrn_86468.png",
"assets/wipescreen/Blade_wpscrn_86469.png",
"assets/wipescreen/Blade_wpscrn_86470.png",
"assets/wipescreen/Blade_wpscrn_86471.png",
"assets/wipescreen/Blade_wpscrn_86472.png",
"assets/wipescreen/Blade_wpscrn_86473.png",
"assets/wipescreen/Blade_wpscrn_86474.png",
"assets/wipescreen/Blade_wpscrn_86475.png",
"assets/wipescreen/Blade_wpscrn_86476.png",
"assets/wipescreen/Blade_wpscrn_86477.png",
"assets/wipescreen/Blade_wpscrn_86478.png",
"assets/wipescreen/Blade_wpscrn_86479.png",
"assets/wipescreen/Blade_wpscrn_86480.png",
"assets/wipescreen/Blade_wpscrn_86481.png",
"assets/wipescreen/Blade_wpscrn_86482.png",
"assets/wipescreen/Blade_wpscrn_86483.png",
"assets/wipescreen/Blade_wpscrn_86484.png",
"assets/wipescreen/Blade_wpscrn_86485.png",
"assets/wipescreen/Blade_wpscrn_86486.png",
"assets/wipescreen/Blade_wpscrn_86487.png",
"assets/wipescreen/Blade_wpscrn_86488.png",
"assets/wipescreen/Blade_wpscrn_86489.png",
"assets/wipescreen/Blade_wpscrn_86490.png",
"assets/wipescreen/Blade_wpscrn_86491.png",
"assets/wipescreen/Blade_wpscrn_86492.png",
"assets/wipescreen/Blade_wpscrn_86493.png",
"assets/wipescreen/Blade_wpscrn_86494.png",
"assets/wipescreen/Blade_wpscrn_86495.png",
"assets/wipescreen/Blade_wpscrn_86496.png",
"assets/wipescreen/Blade_wpscrn_86497.png",
"assets/wipescreen/Blade_wpscrn_86498.png",
"assets/wipescreen/Blade_wpscrn_86499.png",
"assets/wipescreen/Blade_wpscrn_86500.png",
"assets/wipescreen/Blade_wpscrn_86501.png",
"assets/wipescreen/Blade_wpscrn_86502.png",
"assets/wipescreen/Blade_wpscrn_86503.png",
"assets/wipescreen/Blade_wpscrn_86504.png",
"assets/wipescreen/Blade_wpscrn_86505.png",
"assets/wipescreen/Blade_wpscrn_86506.png",
"assets/wipescreen/Blade_wpscrn_86507.png",
"assets/wipescreen/Blade_wpscrn_86508.png",
"assets/wipescreen/Blade_wpscrn_86509.png",
"assets/wipescreen/Blade_wpscrn_86510.png",
"assets/wipescreen/Blade_wpscrn_86511.png",
"assets/wipescreen/Blade_wpscrn_86512.png",
"assets/wipescreen/Blade_wpscrn_86513.png",
"assets/wipescreen/Blade_wpscrn_86514.png",
"assets/wipescreen/Blade_wpscrn_86515.png",
"assets/wipescreen/Blade_wpscrn_86516.png",
"assets/wipescreen/Blade_wpscrn_86517.png",
"assets/wipescreen/Blade_wpscrn_86518.png",
"assets/wipescreen/Blade_wpscrn_86519.png",
"assets/wipescreen/Blade_wpscrn_86520.png",
"assets/wipescreen/Blade_wpscrn_86521.png",
"assets/wipescreen/Blade_wpscrn_86522.png",
"assets/wipescreen/Blade_wpscrn_86523.png",
"assets/wipescreen/Blade_wpscrn_86524.png",
"assets/wipescreen/Blade_wpscrn_86525.png",
"assets/wipescreen/Blade_wpscrn_86526.png",
"assets/wipescreen/Blade_wpscrn_86527.png",
"assets/wipescreen/Blade_wpscrn_86528.png",
"assets/wipescreen/Blade_wpscrn_86529.png",
"assets/wipescreen/Blade_wpscrn_86530.png",
"assets/wipescreen/Blade_wpscrn_86531.png",
"assets/wipescreen/Blade_wpscrn_86532.png",
"assets/wipescreen/Blade_wpscrn_86533.png",
"assets/wipescreen/Blade_wpscrn_86534.png",
"assets/wipescreen/Blade_wpscrn_86535.png",
"assets/wipescreen/Blade_wpscrn_86536.png",
"assets/wipescreen/Blade_wpscrn_86537.png",
"assets/wipescreen/Blade_wpscrn_86538.png",
"assets/wipescreen/Blade_wpscrn_86539.png",
"assets/wipescreen/Blade_wpscrn_86540.png",
"assets/wipescreen/Blade_wpscrn_86541.png",
"assets/wipescreen/Blade_wpscrn_86542.png",
"assets/wipescreen/Blade_wpscrn_86543.png",
"assets/wipescreen/Blade_wpscrn_86544.png",
"assets/wipescreen/Blade_wpscrn_86545.png",
"assets/wipescreen/Blade_wpscrn_86546.png",
"assets/wipescreen/Blade_wpscrn_86547.png",
"assets/wipescreen/Blade_wpscrn_86548.png",
"assets/wipescreen/Blade_wpscrn_86549.png",
"assets/wipescreen/Blade_wpscrn_86550.png",
"assets/wipescreen/Blade_wpscrn_86551.png",
"assets/wipescreen/Blade_wpscrn_86552.png",
"assets/wipescreen/Blade_wpscrn_86553.png",
"assets/wipescreen/Blade_wpscrn_86554.png",
"assets/wipescreen/Blade_wpscrn_86555.png"]
},{}],4:[function(require,module,exports){
module.exports={
    "dusty": "assets/audio/Black_generic_Start.mp3",
    "bladeranger": "assets/audio/Gold_Generic_Start.mp3",
    "cabbie": "assets/audio/Mustang_2012_Start.mp3",
    "dipper": "assets/audio/ShelbyGT500_2013_Start.mp3",
    "windlifter": "assets/audio/ShelbyGT500_Launch_Start.mp3",
    "team": "assets/audio/Yellow_Generic_Start.mp3"
}
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){




// adds our custom modifications to the PIXI library
require('./pixi/libModifications');



var MainView = require('./views/mainView');


// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};






// after assets loaded & jquery loaded
app.render = _.after(2, function() {
    "use strict";

    app.mainView = new MainView();

    app.mainView.start();
});




// =================================================================== //
/* ************************** Asset Loading ************************** */
// =================================================================== //

var introVideoAssets = require('./data/assets.json');

// create an array of assets to load
var assetsToLoader = ['assets/spritesheets/dusty_idle.json', 'assets/spritesheets/dusty_blink.json'].concat(introVideoAssets);

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = app.render;

//begin load
loader.load();


















$(app.render);


module.exports = app;




},{"./data/assets.json":3,"./pixi/libModifications":14,"./views/mainView":22}],9:[function(require,module,exports){



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
},{}],10:[function(require,module,exports){

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
},{"./extend":12}],11:[function(require,module,exports){

(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');
    var Character = require('./character');

    // ============================================================ //
    /* ******************** Helper Functions ********************** */
    // ============================================================ //
    function getDustyIdleTextures() {
        return PIXI.getTextures('dusty_idle_', 1, 11);
    }

    function getDustyBlinkTextures() {
        return PIXI.getTextures('dusty_blink_', 1, 17);
    }

    // ============================================================ //
    /* ************* Enter Name Pixi Animation Class ************** */
    // ============================================================ //

    var EnterNameScene = function() {
        //parent constructor
        Scene.apply(this, arguments);

        this.characters = {};

        this.initializeCharacters();
        this.initializeAnimationTimeline();

        generateBladeWipeAnimation(this);
        initializeVideoTimeline(this);
    };

    // ============================================================ //
    /* ********************* Initialization *********************** */
    // ============================================================ //

    EnterNameScene.prototype.initializeCharacters = function() {
        initParachuters(this);
        initDusty(this);
        initDipper(this);
    };

    function initDusty(scene) {

        var dusty = new Character('Dusty');

        var dustyIdleAnimation = new PIXI.MovieClip(getDustyIdleTextures());
        var dustyBlinkAnimation = new PIXI.MovieClip(getDustyBlinkTextures());

        dustyIdleAnimation.anchor = {x: 0.5, y: 0.5};
        dustyBlinkAnimation.anchor = {x: 0.5, y: 0.5};

        dusty.setIdleState(dustyIdleAnimation);
        dusty.addState('blink', dustyBlinkAnimation);

        dusty.windowScale = 600/1366;
        dusty.windowX = 0.15;
        dusty.windowY = -1;

        // add to stage
        scene.addChild(dusty);
        scene.characters.dusty = dusty;
    }

    function initDipper(scene) {
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

        scene.addChild(dipper);
        scene.characters.dipper = dipper;
    }

    function initParachuters(scene) {
        var parachuters = [getBlackout(), getDrip(), getDynamite()];

        _.each(parachuters, function(parachuter) {
            var blurFilter = new PIXI.BlurFilter();
            blurFilter.blur = 0;

            parachuter.filters = [blurFilter];
            parachuter.windowX = 0.5;
            parachuter.windowY = -1;

            scene.addChild(parachuter);
        });
        scene.characters.parachuters = parachuters;
    }
    function getBlackout() {
        var blackoutIdleState = PIXI.Sprite.fromImage("assets/img/blackout.png");
        blackoutIdleState.anchor = {
            x: 26/61,
            y: 33/94
        };

        var blackout = new Character('Blackout', blackoutIdleState);

        return blackout;
    }
    function getDrip() {
        var dripIdleState = PIXI.Sprite.fromImage("assets/img/drip.png");
        dripIdleState.anchor = {
            x: 36/61,
            y: 26/94
        };

        var drip = new Character('Drip', dripIdleState);

        return drip;
    }
    function getDynamite() {
        var dynamiteIdleState = PIXI.Sprite.fromImage("assets/img/dynamite.png");
        dynamiteIdleState.anchor = {
            x: 27/61,
            y: 30/94
        };

        var dynamite = new Character('Dynamite', dynamiteIdleState);
        return dynamite;
    }


    function generateBladeWipeAnimation(scene) {
        var textures = PIXI.getTextures('assets/wipescreen/Blade_wpscrn_86', 400, 556);

        console.log(textures);

        var wipescreenVideo = new PIXI.MovieClip(textures);
        wipescreenVideo.windowX = 0.5;
        wipescreenVideo.windowY = 0.5;
        wipescreenVideo.windowScale = 1;

        wipescreenVideo.anchor = new PIXI.Point(0.5, 0.5);
        wipescreenVideo.visible = false;
        wipescreenVideo.loop = false;

        scene.addChild(wipescreenVideo);
        scene.wipescreenVideo = wipescreenVideo;
    }

    function initializeVideoTimeline(scene) {
        scene.wipescreenVideo._tweenFrame = 0;

        Object.defineProperty(scene.wipescreenVideo, 'tweenFrame', {
            get: function() {
                return this._tweenFrame;
            },
            set: function(value) {
                this._tweenFrame = value;
                this.currentFrame = value;
                this.setTexture(this.textures[value | 0]);
            }
        });

        scene.timelineVideo = getVideoAnimationTimeline(scene);
    }
    function getVideoAnimationTimeline(scene) {
        var fps = 24;
        var numFrames = scene.wipescreenVideo.textures.length;

        var animationTime = numFrames/fps;
        var easing = new SteppedEase(numFrames);

        var timeline = new TimelineLite({
            paused: true
        });

        timeline.append(TweenLite.to(scene.wipescreenVideo, animationTime, {
            tweenFrame: numFrames-1,
            ease: easing
        }));


        return timeline;
    }

    EnterNameScene.prototype.playWipescreen = function() {
        this.wipescreenVideo.visible = true;
        this.timelineVideo.play();
    };
    EnterNameScene.prototype.onWipescreenComplete = function(callback) {
        this.timelineVideo.vars.onComplete = callback;
    };
    EnterNameScene.prototype.hideVideo = function() {
        this.wipescreenVideo.visible = false;
    };
    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //
    EnterNameScene.prototype.initializeAnimationTimeline = function() {
        var timeline = new TimelineMax({
            paused: true
        });


        timeline.add(this.getAnimationDustyIn().play(), 0);
        timeline.add(this.getAnimationDustyHover().play(), 0);

        timeline.add(this.getAnimationDipperIn().play(), 0.4);

        this.timelineIn = timeline;

        var timelineOut = new TimelineMax({
            paused: true
        });

        timelineOut.add(generateAnimationDipperOut(this.characters.dipper).play(), 0);
        timelineOut.add(generateAnimationDustyOut(this.characters.dusty).play(), 0);

        this.timelineOut = timelineOut;
    };

    EnterNameScene.prototype.startAnimation = function() {
        this.timelineIn.play();

//        var dusty = this.characters.dusty;
//        setTimeout(function() {
//            dusty.goToState('blink');
//        }, 5000);


        var parachuters = _.shuffle(this.characters.parachuters);

        console.log(parachuters);

        var startTime = 2000;
        setTimeout(_.bind(this.animateParachuter, this, parachuters[0]), startTime);
        setTimeout(_.bind(this.animateParachuter, this, parachuters[1]), startTime + 6000);
        setTimeout(_.bind(this.animateParachuter, this, parachuters[2]), startTime + 15000);
    };


    EnterNameScene.prototype.animateParachuter = function(parachuter) {
        var animationTime = 35;

        var depth = Math.random() * 5;
        var x = 0.1 + (Math.random() * 0.8);
        var scale = 1 - depth * 0.2/5;

        placeJustOffscreen(parachuter);
        parachuter.windowX = x;

        var rotation = 0.3;


        TweenLite.to(parachuter, animationTime, {
            windowY: 1,
            ease: 'Sine.easeOut'
        });

        parachuter.scale = {x: scale, y: scale};
        parachuter.filters[0].blur = depth;
        parachuter.rotation = rotation;
        swayParachuter(parachuter, rotation);
    };

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



    EnterNameScene.prototype.hide = function() {
        this.timelineOut.play();
    };

    EnterNameScene.prototype.onHideComplete = function(callback) {
        this.timelineOut.vars.onComplete = callback;
    };


    // called on each animation frame
    EnterNameScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);
    };


    // ============================================================ //
    /* ****************** Individual Animations ******************* */
    // ============================================================ //
    EnterNameScene.prototype.getAnimationDustyIn = function() {
        var animationTime = 1.8;
        var easing = 'Cubic.easeInOut';
        var dusty = this.characters.dusty;

        var timeline = new TimelineMax({
            paused: true,
            onStart: _.bind(placeJustOffscreen, null, dusty)
        });

        timeline.add(TweenLite.to(dusty, animationTime, {
            windowY: 0.5,
            ease: easing
        }), 0);

        return timeline;
    };

    EnterNameScene.prototype.getAnimationDustyHover = function() {
        var animationTime = 1;
        var easing = 'Quad.easeInOut';

        var timeline = new TimelineMax({
            paused: true,
            repeat: -1
        });

        timeline.append(TweenLite.to(this.characters.dusty, animationTime, {
            bumpY: -15,
            ease: easing
        }));
        timeline.append(TweenLite.to(this.characters.dusty, animationTime, {
            bumpY: 0,
            ease: easing
        }));

        return timeline;
    };

    EnterNameScene.prototype.getAnimationDipperIn = function() {
        var animationTime = 2.0;
        var sweepStartTime = animationTime * 0.11;
        var easing = 'Cubic.easeInOut';

        var dipper = this.characters.dipper;
        var blurFilter = dipper.filters[0];

        var timeline = new TimelineMax({
            paused: true,
            onStart: _.bind(placeJustOffscreen, null, dipper)
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
    };

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
        var animationTime = 1.6;
        var easing = 'Cubic.easeInOut';

        var timeline = new TimelineMax({
            paused: true
        });

        timeline.add(TweenLite.to(dusty, animationTime, {
            animationScaleX: 1.2,
            animationScaleY: 1.2,
            windowY: 0.24,
            windowX: -0.3,
            ease: easing
        }));

        return timeline;
    }






    function placeJustOffscreen(character) {
        var height = character.scale.y * character.getLocalBounds().height;

        character.windowY = -(height/2)/character._$window.height();
    }







    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //



    // Extends Scene Class
    extend(Scene, EnterNameScene);


    module.exports = EnterNameScene;
})();
},{"./character":10,"./extend":12,"./scene":15}],12:[function(require,module,exports){

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
},{}],13:[function(require,module,exports){


(function() {
    "use strict";

    var extend = require('./extend');
    var Scene = require('./scene');


    function getIntroTextures() {
        return PIXI.getTextures('assets/introVideo/PLANES2_760x428_00', 0, 122);
    }

    // ============================================================ //
    /* **************** Intro Pixi Animation Class **************** */
    // ============================================================ //

    var IntroScene = function() {
        Scene.apply(this, arguments); //parent constructor

        initializeVideo(this);
        initializeMask(this);
        initializeVideoTimeline(this);
    };

    // ============================================================ //
    /* ****************** Public API Functions ******************** */
    // ============================================================ //

    IntroScene.prototype.startAnimation = function() {
        this.introVideo.visible = true;

        this.timelineVideo.play();
    };

    IntroScene.prototype.open = function() {
        //this.timelineOpen.play();
    };


    // called on each animation frame
    IntroScene.prototype.update = function() {
        // call parent function
        Scene.prototype.update.call(this);
    };

    //set on complete function for animation timeline
    IntroScene.prototype.onComplete = function(callback) {
        this.timelineVideo.vars.onComplete = callback;
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

        scene.addChild(introVideo);
        scene.introVideo = introVideo;
    }

    function initializeMask(scene) {

    }

    function initializeBackgroundColor(scene) {

    }

    function initializeVideoTimeline(scene) {

        scene.introVideo._tweenFrame = 0;

        Object.defineProperty(scene.introVideo, 'tweenFrame', {
            get: function() {
                return this._tweenFrame;
            },
            set: function(value) {
                this._tweenFrame = value;
                this.currentFrame = value;
                this.setTexture(this.textures[value | 0]);
            }
        });

        scene.timelineVideo = getVideoAnimationTimeline(scene);
    }

    // ============================================================ //
    /* ******************* Animation Functions ******************** */
    // ============================================================ //

    function getVideoAnimationTimeline(scene) {
        var fps = 24;
        var numFrames = scene.introVideo.textures.length;

        var animationTime = numFrames/fps;
        var easing = new SteppedEase(numFrames);

        var timeline = new TimelineLite({
            paused: true
        });

        timeline.append(TweenLite.to(scene.introVideo, animationTime, {
            tweenFrame: numFrames-1,
            ease: easing
        }));


        return timeline;
    }



    // ============================================================ //
    /* ******************* Extend and Export ********************** */
    // ============================================================ //


    // Extends Scene Class
    extend(Scene, IntroScene);

    module.exports = IntroScene;


})();




},{"./extend":12,"./scene":15}],14:[function(require,module,exports){
(function() {
    "use strict";

    /*
     * Custom Edits for the PIXI Library
     */


    // =================================================================== //
    /* ******************* Relative Position Functions ******************* */
    // =================================================================== //

    PIXI.DisplayObject.prototype._$window = $(window);

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

            this._setPositionX(this._$window.width());
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'windowY', {
        get: function() {
            return this._windowY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._windowY = value;

            this._setPositionY(this._$window.height());
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

            this.position.x = (this._$window.width() * this._windowX) + value;
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'bumpY', {
        get: function() {
            return this._bumpY;
        },
        set: function(value) {  // Value should be between 0 and 1
            this._bumpY = value;

            this.position.y = (this._$window.height() * this._windowY) + value;
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

            this._setScale(this._$window.width(), this._$window.height());
        }
    });

    PIXI.DisplayObject.prototype._setScale = function(windowWidth, windowHeight) {
        var localBounds = this.getLocalBounds();

        var scale = this._windowScale * Math.min(windowHeight/localBounds.height, windowWidth/localBounds.width);

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

            this._setScale(this._$window.width(), this._$window.height());
        }
    });
    Object.defineProperty(PIXI.DisplayObject.prototype, 'animationScaleY', {
        get: function() {
            return this._animationScaleY;
        },
        set: function(value) {
            this._animationScaleY = value;

            this._setScale(this._$window.width(), this._$window.height());
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
},{}],15:[function(require,module,exports){



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
},{"./extend":12}],16:[function(require,module,exports){

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
},{"./scene":15}],17:[function(require,module,exports){





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
},{"./data/audioAssets.json":4}],18:[function(require,module,exports){
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

},{"hbsfy/runtime":33}],19:[function(require,module,exports){


(function() {
    "use strict";

    var scenesManager = require('../pixi/scenesManager');
    var EnterNameScene = require('../pixi/enterNameScene');

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
        },
        initScene: function() {
            this.scene = scenesManager.scenes['enterName'];
        },

        // ============================================================ //
        /* ***************** Run Animation Functions ****************** */
        // ============================================================ //
        startAnimation: function() {
            $('#pixi-view').removeClass('front');

            this.scene.startAnimation();
        },

        // ============================================================ //
        /* ************************ Show/Hide ************************* */
        // ============================================================ //
        show: function () {
            this.$el.addClass('active');

            scenesManager.goToScene('enterName');


            setTimeout(_.bind(this.startAnimation, this), 0);
        },
        hide: function () {
            this.scene.onHideComplete(_.bind(this.setInactive, this));

            //run hide animation
            this.scene.hide();
        },
        setInactive: function() {
            this.$el.removeClass('active');

            if(_.isFunction(this.hideCallback)) {
                this.hideCallback();
            }
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

},{"../pixi/enterNameScene":11,"../pixi/scenesManager":16}],20:[function(require,module,exports){





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
},{"../soundPlayer":17}],21:[function(require,module,exports){

(function() {
    "use strict";

    var scenesManager = require('../pixi/scenesManager');
    var IntroScene = require('../pixi/introScene');


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
            this.scene = scenesManager.createScene('intro', IntroScene);

            this.scene.onComplete(_.bind(this.showBeginScreen, this));

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

            scenesManager.goToScene('intro');

            this.scene.startAnimation();

            $('#pixi-view').addClass('front');
        },
        hide: function() {
            this.timelineHide.play();
            this.scene.open();
        },
        onComplete: function(callback) {
            this.onCompleteCallback = callback;
        }

    });








    module.exports = IntroView;
})();
},{"../pixi/introScene":13,"../pixi/scenesManager":16}],22:[function(require,module,exports){

(function() {
    "use strict";

    var EnterNameScene = require('../pixi/enterNameScene');
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
            scenesManager.initialize($(window).width(), $(window).height(), this.$el);

            this.scene = scenesManager.createScene('enterName', EnterNameScene);

            // create views
            this.initIntroView();
            this.initPages();

            this.footer = new FooterView({numDots: this.pages.length});
            this.responseView = new ResponseView();
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

            this.$next = this.$pagesContainer.find('div.page-nav a.next');
            this.$finishSend = this.$pagesContainer.find('div.page-nav a.finish-send');
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

            activePage.onHideComplete(_.bind(this.showPageAfterHide, this));

            this.activePageIndex++;
            activePage.hide();
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

            var me = this;
            this.scene.onWipescreenComplete(function() {
                me.$backgrounds.hide();
                me.responseView.show();
                me.scene.hideVideo();
            });

            $('#pixi-view').addClass('middle');
            //run bladewipe animation
            this.scene.playWipescreen();



//            this.$backgrounds.hide();
//
//
//
//            this.responseView.show();
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
        /* *************************** Parallax Stuff ************************* */
        // ==================================================================== //
        shiftBackgroundLayers: function(x) {
            var backgroundRatio = 0.75;
            var middlegroundRatio = 1.5;
            var foregroundRatio = 3;

            var backgroundLeft = -(x - 0.5) * backgroundRatio + '%';
            var middlegroundLeft = -(x - 0.5) * middlegroundRatio + '%';
            var foregroundLeft = -(x - 0.5) * foregroundRatio + '%';

            this.$background.css('left', backgroundLeft);
            this.$middleground.css('left', middlegroundLeft);
            this.$foreground.css('left', foregroundLeft);
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

            this.shiftBackgroundLayers(e.pageX/this.$window.width());
        }
    });






    module.exports = MainView;



})();
},{"../collections/allQuestions":2,"../pixi/enterNameScene":11,"../pixi/scenesManager":16,"./enterNameView":19,"./footerView":20,"./introView":21,"./questionView":23,"./responseView":24,"./selectCharacterView":25}],23:[function(require,module,exports){


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
},{"../templates/question.hbs":18}],24:[function(require,module,exports){




(function() {
    "use strict";




    var ResponseView = Backbone.View.extend({
        el: '#response',

        initialize: function() {

        },

        setResponse: function(models) {
            // TODO

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
        },
        hide: function() {

        }


    });













    module.exports = ResponseView;
})();
},{}],25:[function(require,module,exports){




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
},{"../data/audioAssets.json":4,"../soundPlayer":17,"./questionView":23}],26:[function(require,module,exports){
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
},{"./handlebars/base":27,"./handlebars/exception":28,"./handlebars/runtime":29,"./handlebars/safe-string":30,"./handlebars/utils":31}],27:[function(require,module,exports){
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
},{"./exception":28,"./utils":31}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{"./base":27,"./exception":28,"./utils":31}],30:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],31:[function(require,module,exports){
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
},{"./safe-string":30}],32:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":26}],33:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":32}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9jb2xsZWN0aW9ucy9RdWVzdGlvbkNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hc3NldHMuanNvbiIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvZGF0YS9hdWRpb0Fzc2V0cy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL2NoYXJhY3RlclNlbGVjdC5qc29uIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9kYXRhL3BlcnNvbmFsaXR5UXVlc3Rpb25zLmpzb24iLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL2Zha2VfZjk4N2Q2YTcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL21vZGVscy9xdWVzdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9jaGFyYWN0ZXIuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvZW50ZXJOYW1lU2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvZXh0ZW5kLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9waXhpL2ludHJvU2NlbmUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3BpeGkvbGliTW9kaWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvcGl4aS9zY2VuZXNNYW5hZ2VyLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy9zb3VuZFBsYXllci5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uLmhicyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZW50ZXJOYW1lVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvZm9vdGVyVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvaW50cm9WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9tYWluVmlldy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9qcy9zcmMvdmlld3MvcXVlc3Rpb25WaWV3LmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL2pzL3NyYy92aWV3cy9yZXNwb25zZVZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvanMvc3JjL3ZpZXdzL3NlbGVjdENoYXJhY3RlclZpZXcuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvYmFzZS5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9zYWZlLXN0cmluZy5qcyIsIi9Vc2Vycy9hbWNjb3JtaWNrL1BocHN0b3JtUHJvamVjdHMvYWlybWFpbC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2FtY2Nvcm1pY2svUGhwc3Rvcm1Qcm9qZWN0cy9haXJtYWlsL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvYW1jY29ybWljay9QaHBzdG9ybVByb2plY3RzL2Fpcm1haWwvbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxuXG52YXIgUXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc3Rpb24nKTtcblxuXG52YXIgUXVlc3Rpb25Db2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBRdWVzdGlvblxufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db2xsZWN0aW9uOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFF1ZXN0aW9uQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUXVlc3Rpb25Db2xsZWN0aW9uJyk7XG5cbiAgICB2YXIgY2hhcmFjdGVyU2VsZWN0ID0gcmVxdWlyZSgnLi4vZGF0YS9jaGFyYWN0ZXJTZWxlY3QuanNvbicpO1xuICAgIHZhciBjYW5uZWRRdWVzdGlvbkRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2Nhbm5lZFF1ZXN0aW9ucy5qc29uJyk7XG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9wZXJzb25hbGl0eVF1ZXN0aW9ucy5qc29uJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21QZXJzb25hbGl0eVF1ZXN0aW9ucyhudW0pIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoXy5zaHVmZmxlKHBlcnNvbmFsaXR5UXVlc3Rpb25EYXRhLnF1ZXN0aW9ucyksIG51bSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tQ2FubmVkUXVlc3Rpb25zKG51bUluR3JvdXAsIG51bSkge1xuICAgICAgICB2YXIgY2FubmVkT3B0aW9ucyA9IF8uc2h1ZmZsZShjYW5uZWRRdWVzdGlvbkRhdGEub3B0aW9ucyk7XG5cbiAgICAgICAgdmFyIGNhbm5lZFF1ZXN0aW9ucyA9IF8ubWFwKF8ucmFuZ2UobnVtKSwgZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBfLmZpcnN0KF8ucmVzdChjYW5uZWRPcHRpb25zLCBpICogbnVtSW5Hcm91cCksIG51bUluR3JvdXApO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBjYW5uZWRRdWVzdGlvbkRhdGEuY2xhc3MsXG4gICAgICAgICAgICAgICAgY29weTogY2FubmVkUXVlc3Rpb25EYXRhLmNvcHksXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Nhbm5lZC1xdWVzdGlvbicgKyBpLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNhbm5lZFF1ZXN0aW9ucztcbiAgICB9XG5cblxuXG5cblxuXG4gICAgdmFyIGFsbFF1ZXN0aW9ucyA9IG5ldyBRdWVzdGlvbkNvbGxlY3Rpb24oKTtcblxuXG4gICAgLy9zaHVmZmxlIHF1ZXN0aW9ucyBhbmQgcGljayAzXG4gICAgdmFyIHBlcnNvbmFsaXR5UXVlc3Rpb25zID0gZ2V0UmFuZG9tUGVyc29uYWxpdHlRdWVzdGlvbnMoMyk7XG4gICAgdmFyIGNhbm5lZFF1ZXN0aW9ucyA9IGdldFJhbmRvbUNhbm5lZFF1ZXN0aW9ucygzLCAzKTtcblxuXG5cbiAgICBhbGxRdWVzdGlvbnMuYWRkKGNoYXJhY3RlclNlbGVjdCk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChwZXJzb25hbGl0eVF1ZXN0aW9ucyk7XG4gICAgYWxsUXVlc3Rpb25zLmFkZChjYW5uZWRRdWVzdGlvbnMpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFsbFF1ZXN0aW9ucztcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDAxLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDIucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwMy5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA0LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDUucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwNi5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDA3LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMDgucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAwOS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEwLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMTEucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxMi5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDEzLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMTQucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxNS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE2LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMTcucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAxOC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDE5LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMjAucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyMS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDIyLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMjMucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI1LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMjYucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAyNy5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDI4LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMjkucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDMxLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMzIucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzMy5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM0LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMzUucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzNi5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDM3LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwMzgucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDAzOS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQwLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNDEucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0Mi5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQzLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNDQucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0NS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ2LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNDcucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA0OC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDQ5LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTAucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1MS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDUyLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTMucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1NC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU1LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTYucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA1Ny5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDU4LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNTkucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2MC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDYxLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjIucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2My5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY0LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjUucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2Ni5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDY3LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNjgucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA2OS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDcwLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzEucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3Mi5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDczLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzQucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3NS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc2LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwNzcucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA3OC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDc5LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODAucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4MS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDgyLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODMucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4NC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg1LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODYucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA4Ny5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDg4LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwODkucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5MC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDkxLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTIucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5My5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk0LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTUucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5Ni5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMDk3LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAwOTgucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDA5OS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAwLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDEucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwMi5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTAzLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDQucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwNS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA2LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMDcucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEwOC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTA5LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTAucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExMS5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTEyLnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTMucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE1LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTYucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDExNy5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTE4LnBuZ1wiLFxuXCJhc3NldHMvaW50cm9WaWRlby9QTEFORVMyXzc2MHg0MjhfMDAxMTkucG5nXCIsXG5cImFzc2V0cy9pbnRyb1ZpZGVvL1BMQU5FUzJfNzYweDQyOF8wMDEyMC5wbmdcIixcblwiYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwMTIxLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDAucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwMS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDAyLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDMucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA1LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDYucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQwNy5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDA4LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MDkucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDExLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTIucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxMy5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE0LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTUucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxNi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDE3LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MTgucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQxOS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIwLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjEucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyMi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDIzLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjQucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyNS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI2LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MjcucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQyOC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDI5LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzAucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzMS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDMyLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzMucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM1LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzYucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQzNy5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDM4LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0MzkucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0MC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQxLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDIucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0My5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ0LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDUucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0Ni5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDQ3LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NDgucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ0OS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUwLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTEucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1Mi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDUzLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTQucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1NS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU2LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NTcucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ1OC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDU5LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjAucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2MS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDYyLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjMucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2NC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY1LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjYucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ2Ny5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDY4LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NjkucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3MC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDcxLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzIucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3My5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc0LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzUucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3Ni5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDc3LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0NzgucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ3OS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgwLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODEucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4Mi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDgzLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODQucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4NS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg2LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0ODcucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ4OC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDg5LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTAucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5MS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDkyLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTMucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5NC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk1LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTYucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjQ5Ny5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NDk4LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY0OTkucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTAxLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDIucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwMy5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA0LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDUucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwNi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTA3LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MDgucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUwOS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEwLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTEucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxMi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTEzLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTQucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxNS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE2LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MTcucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUxOC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTE5LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjAucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyMS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTIyLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjMucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI1LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjYucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUyNy5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTI4LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MjkucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTMxLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzIucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzMy5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM0LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzUucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzNi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTM3LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1MzgucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjUzOS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQwLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDEucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0Mi5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQzLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDQucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0NS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ2LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NDcucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU0OC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTQ5LnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTAucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1MS5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTUyLnBuZ1wiLFxuXCJhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODY1NTMucG5nXCIsXG5cImFzc2V0cy93aXBlc2NyZWVuL0JsYWRlX3dwc2Nybl84NjU1NC5wbmdcIixcblwiYXNzZXRzL3dpcGVzY3JlZW4vQmxhZGVfd3BzY3JuXzg2NTU1LnBuZ1wiXSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImR1c3R5XCI6IFwiYXNzZXRzL2F1ZGlvL0JsYWNrX2dlbmVyaWNfU3RhcnQubXAzXCIsXG4gICAgXCJibGFkZXJhbmdlclwiOiBcImFzc2V0cy9hdWRpby9Hb2xkX0dlbmVyaWNfU3RhcnQubXAzXCIsXG4gICAgXCJjYWJiaWVcIjogXCJhc3NldHMvYXVkaW8vTXVzdGFuZ18yMDEyX1N0YXJ0Lm1wM1wiLFxuICAgIFwiZGlwcGVyXCI6IFwiYXNzZXRzL2F1ZGlvL1NoZWxieUdUNTAwXzIwMTNfU3RhcnQubXAzXCIsXG4gICAgXCJ3aW5kbGlmdGVyXCI6IFwiYXNzZXRzL2F1ZGlvL1NoZWxieUdUNTAwX0xhdW5jaF9TdGFydC5tcDNcIixcbiAgICBcInRlYW1cIjogXCJhc3NldHMvYXVkaW8vWWVsbG93X0dlbmVyaWNfU3RhcnQubXAzXCJcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJjbGFzc1wiOiBcImNhbm5lZFwiLFxuICAgIFwiY29weVwiOiBcIk5vdyB0aGF0IHdlIGtub3cgbW9yZSBhYm91dCB5b3UsIGl0J3MgeW91ciB0dXJuIHRvIGFzayBmaXJlIHJhbmdlciBzb21lIHF1ZXN0aW9uc1wiLFxuICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSB0aGluZyBhYm91dCB0aGUgUGlzdG9uIFBlYWsgQXR0YWNrIFRlYW0/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmF2b3JpdGVUaGluZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgd2FzIHlvdXIgaGFyZGVzdCBtaXNzaW9uP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImhhcmRlc3RNaXNzaW9uXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2hvIGFyZSB5b3VyIGJlc3QgZnJpZW5kcyBvbiB0aGUgUFBBVD9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJiZXN0RnJpZW5kc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgaXMgeW91ciBqb2IgYXQgUGlzdG9uIFBlYWs/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiam9iXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGRvIHlvdSBmaWdodCBmb3Jlc3QgZmlyZXM/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmlnaHRGaXJlc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhvdyBkbyB5b3UgcHJldmVudCBmb3Jlc3QgZmlyZXM/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwieW91UHJldmVudEZpcmVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSG93IGNhbiBJIHByZXZlbnQgZm9yZXN0IGZpcmVzP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIklQcmV2ZW50RmlyZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJGaXJlIGZpcmUgZmlyZSBmb3Jlc3QgZmlyZSBmb3Jlc3Q/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZmlyZUZvcmVzdFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkxvcmVtIElwc3VtIDE/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwibG9yZW1pcHN1bTFcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJMb3JlbSBJcHN1bSAyP1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImxvcmVtaXBzdW0yXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTG9yZW0gSXBzdW0gMz9cIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJsb3JlbWlwc3VtM1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkxvcmVtIElwc3VtIDQ/XCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwibG9yZW1pcHN1bTRcIlxuICAgICAgICB9XG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcIm5hbWVcIjogXCJjaGFyYWN0ZXItc2VsZWN0XCIsXG4gICAgXCJjbGFzc1wiOiBcImNoYXJhY3Rlci1zZWxlY3RcIixcbiAgICBcImNvcHlcIjogXCJXaG8gZG8geW91IHdhbnQgdG8gd3JpdGUgdG8/XCIsXG4gICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRHVzdHlcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkdXN0eVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsYWRlIFJhbmdlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsYWRlcmFuZ2VyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2FiYmllXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiY2FiYmllXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRGlwcGVyXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZGlwcGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiV2luZGxpZnRlclwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIndpbmRsaWZ0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJUaGUgVGVhbVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInRlYW1cIlxuICAgICAgICB9XG4gICAgXSxcbiAgICBcInJlcXVpcmVkXCI6IHRydWVcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJmYXZvcml0ZS1kaXNuZXktbW92aWVcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1kaXNuZXktbW92aWVcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIldoYXQgaXMgeW91ciBmYXZvcml0ZSBEaXNuZXkgbW92aWU/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlIExpb24gS2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwidGhlbGlvbmtpbmdcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQaGFudG9tIG9mIHRoZSBNZWdhcGxleFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicGhhbnRvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkdhbWUgb2YgVGhyb25lc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZ2FtZW9mdGhyb25lc1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkhlcmN1bGVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJoZXJjdWxlc1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJyZWFraW4nIDI6IEVsZWN0cmljIEJvb2dhbG9vXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJicmVha2luXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTWVtZW50b1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwibWVtZW50b1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmF2b3JpdGUtY29sb3JcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmYXZvcml0ZS1jb2xvclwiLFxuICAgICAgICAgICAgXCJjb3B5XCI6IFwiV2hhdCdzIHlvdXIgZmF2b3JpdGUgY29sb3I/XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJyZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJCbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJibHVlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3JhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJvcmFuZ2VcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJHcmVlblwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJZZWxsb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInllbGxvd1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlB1cnBsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwicHVycGxlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJxdWVzdGlvbjRcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJxdWVzdGlvbjRcIixcbiAgICAgICAgICAgIFwiY29weVwiOiBcIkxvcmVtIElwc3VtP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkxvcmVtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJsb3JlbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIklwc3VtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJpcHN1bVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkRvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJkb2xvclwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNpdFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwic2l0XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQW1ldFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYW1ldFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNvbnNlY3RldHVyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJjb25zZWN0ZXR1clwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwicXVlc3Rpb241XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwicXVlc3Rpb241XCIsXG4gICAgICAgICAgICBcImNvcHlcIjogXCJMb3JlbSBJcHN1bSAyP1wiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkxvcmVtIDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImxvcmVtMlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIklwc3VtIDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImlwc3VtMlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkRvbG9yIDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRvbG9yMlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNpdCAyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJzaXQyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQW1ldCAyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJhbWV0MlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNvbnNlY3RldHVyIDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNvbnNlY3RldHVyMlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfVxuICAgIF1cbn0iLCJcblxuXG5cbi8vIGFkZHMgb3VyIGN1c3RvbSBtb2RpZmljYXRpb25zIHRvIHRoZSBQSVhJIGxpYnJhcnlcbnJlcXVpcmUoJy4vcGl4aS9saWJNb2RpZmljYXRpb25zJyk7XG5cblxuXG52YXIgTWFpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL21haW5WaWV3Jyk7XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBcHAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG52YXIgYXBwID0ge307XG5cblxuXG5cblxuXG4vLyBhZnRlciBhc3NldHMgbG9hZGVkICYganF1ZXJ5IGxvYWRlZFxuYXBwLnJlbmRlciA9IF8uYWZ0ZXIoMiwgZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhcHAubWFpblZpZXcgPSBuZXcgTWFpblZpZXcoKTtcblxuICAgIGFwcC5tYWluVmlldy5zdGFydCgpO1xufSk7XG5cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEFzc2V0IExvYWRpbmcgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxudmFyIGludHJvVmlkZW9Bc3NldHMgPSByZXF1aXJlKCcuL2RhdGEvYXNzZXRzLmpzb24nKTtcblxuLy8gY3JlYXRlIGFuIGFycmF5IG9mIGFzc2V0cyB0byBsb2FkXG52YXIgYXNzZXRzVG9Mb2FkZXIgPSBbJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHlfaWRsZS5qc29uJywgJ2Fzc2V0cy9zcHJpdGVzaGVldHMvZHVzdHlfYmxpbmsuanNvbiddLmNvbmNhdChpbnRyb1ZpZGVvQXNzZXRzKTtcblxuLy8gY3JlYXRlIGEgbmV3IGxvYWRlclxudmFyIGxvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKGFzc2V0c1RvTG9hZGVyKTtcblxuLy8gdXNlIGNhbGxiYWNrXG5sb2FkZXIub25Db21wbGV0ZSA9IGFwcC5yZW5kZXI7XG5cbi8vYmVnaW4gbG9hZFxubG9hZGVyLmxvYWQoKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiQoYXBwLnJlbmRlcik7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4iLCJcblxuXG52YXIgUXVlc3Rpb24gPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIGNvcHk6ICcnLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgfVxufSk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cblxuICAgIC8vIGRpc3BsYXlPYmplY3Qgc2hvdWxkIGJlIGFuIGluc3RhbmNlIG9mIFBJWEkuU3ByaXRlIG9yIFBJWEkuTW92aWVDbGlwXG4gICAgdmFyIENoYXJhY3RlciA9IGZ1bmN0aW9uKG5hbWUsIG1vdmllQ2xpcCkge1xuICAgICAgICBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTsgLy8gUGFyZW50IGNvbnN0cnVjdG9yXG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcblxuICAgICAgICBpZighXy5pc1VuZGVmaW5lZChtb3ZpZUNsaXApKSB7XG4gICAgICAgICAgICB0aGlzLnNldElkbGVTdGF0ZShtb3ZpZUNsaXApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5zZXRJZGxlU3RhdGUgPSBmdW5jdGlvbihwaXhpU3ByaXRlKSB7XG4gICAgICAgIHRoaXMuaWRsZSA9IHBpeGlTcHJpdGU7XG5cbiAgICAgICAgaWYocGl4aVNwcml0ZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICBwaXhpU3ByaXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgcGl4aVNwcml0ZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgIHBpeGlTcHJpdGUuZ290b0FuZFBsYXkoMCk7ICAvL3N0YXJ0IGNsaXBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocGl4aVNwcml0ZSk7ICAgLy9hZGQgdG8gZGlzcGxheSBvYmplY3QgY29udGFpbmVyXG4gICAgfTtcblxuICAgIC8vYWRkIG1vdmllIGNsaXAgdG8gcGxheSB3aGVuIGNoYXJhY3RlciBjaGFuZ2VzIHRvIHN0YXRlXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS5hZGRTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlLCBtb3ZpZUNsaXApIHtcbiAgICAgICAgbW92aWVDbGlwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZXNbc3RhdGVdID0gbW92aWVDbGlwO1xuICAgICAgICB0aGlzLmFkZENoaWxkKG1vdmllQ2xpcCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBBUEkgZnVuY3Rpb24uIFdhaXRzIHVudGlsIGN1cnJlbnQgc3RhdGUgaXMgZmluaXNoZWQgYmVmb3JlIHN3aXRjaGluZyB0byBuZXh0IHN0YXRlLlxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuZ29Ub1N0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcblxuICAgICAgICBpZihfLmlzVW5kZWZpbmVkKHRoaXMuc3RhdGVzW3N0YXRlXSkpIHtcbiAgICAgICAgICAgIHRocm93ICdFcnJvcjogQ2hhcmFjdGVyICcgKyB0aGlzLm5hbWUgKyAnIGRvZXMgbm90IGNvbnRhaW4gc3RhdGU6ICcgKyBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuaWRsZSBpbnN0YW5jZW9mIFBJWEkuTW92aWVDbGlwKSB7XG4gICAgICAgICAgICB0aGlzLmlkbGUub25Db21wbGV0ZSA9IF8uYmluZCh0aGlzLnN3YXBTdGF0ZSwgdGhpcywgc3RhdGUpO1xuXG4gICAgICAgICAgICAvLyBhZnRlciBjdXJyZW50IGFuaW1hdGlvbiBmaW5pc2hlcyBnbyB0byB0aGlzIHN0YXRlIG5leHRcbiAgICAgICAgICAgIHRoaXMuaWRsZS5sb29wID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN3YXBTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgICAvL3N3aXRjaCBpbW1lZGlhdGVseSBpZiBjaGFyYWN0ZXIgaWRsZSBzdGF0ZSBpcyBhIHNpbmdsZSBzcHJpdGVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBjaGFuZ2VzIHN0YXRlIGltbWVkaWF0ZWx5XG4gICAgLy8gTk9URTogRnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5IGJ5IGNoYXJhY3Rlci5nb1RvU3RhdGUoKVxuICAgIENoYXJhY3Rlci5wcm90b3R5cGUuc3dhcFN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcblxuICAgICAgICB2YXIgaWRsZVN0YXRlID0gdGhpcy5pZGxlO1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLnN0YXRlc1tzdGF0ZV07XG5cbiAgICAgICAgbmV3U3RhdGUub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkgeyAgLy9zd2l0Y2ggYmFjayB0byBpZGxlIGFmdGVyIHJ1blxuICAgICAgICAgICAgaWYoaWRsZVN0YXRlIGluc3RhbmNlb2YgUElYSS5Nb3ZpZUNsaXApIHtcbiAgICAgICAgICAgICAgICBpZGxlU3RhdGUubG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlLmdvdG9BbmRQbGF5KDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdTdGF0ZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZGxlU3RhdGUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWRsZVN0YXRlLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBuZXdTdGF0ZS5sb29wID0gZmFsc2U7XG4gICAgICAgIG5ld1N0YXRlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBuZXdTdGF0ZS5nb3RvQW5kUGxheSgwKTtcbiAgICB9O1xuXG4gICAgLy9hZGQgY2FsbGJhY2sgdG8gcnVuIG9uIGNoYXJhY3RlciB1cGRhdGVcbiAgICBDaGFyYWN0ZXIucHJvdG90eXBlLm9uVXBkYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfTtcblxuICAgIC8vIGNhbGxlZCBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZSBieSB3aGF0ZXZlciBQaXhpIHNjZW5lIGNvbnRhaW5zIHRoaXMgY2hhcmFjdGVyXG4gICAgQ2hhcmFjdGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNhbGxiYWNrKCk7XG4gICAgfTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqIEV4dGVuZCBhbmQgRXhwb3J0ICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIC8vIGV4dGVuZHMgRGlzcGxheSBPYmplY3QgQ29udGFpbmVyXG4gICAgZXh0ZW5kKFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lciwgQ2hhcmFjdGVyKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2hhcmFjdGVyO1xufSkoKTsiLCJcbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcbiAgICB2YXIgQ2hhcmFjdGVyID0gcmVxdWlyZSgnLi9jaGFyYWN0ZXInKTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqIEhlbHBlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIGZ1bmN0aW9uIGdldER1c3R5SWRsZVRleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnZHVzdHlfaWRsZV8nLCAxLCAxMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RHVzdHlCbGlua1RleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnZHVzdHlfYmxpbmtfJywgMSwgMTcpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKiogRW50ZXIgTmFtZSBQaXhpIEFuaW1hdGlvbiBDbGFzcyAqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgdmFyIEVudGVyTmFtZVNjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vcGFyZW50IGNvbnN0cnVjdG9yXG4gICAgICAgIFNjZW5lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0ge307XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhcmFjdGVycygpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVBbmltYXRpb25UaW1lbGluZSgpO1xuXG4gICAgICAgIGdlbmVyYXRlQmxhZGVXaXBlQW5pbWF0aW9uKHRoaXMpO1xuICAgICAgICBpbml0aWFsaXplVmlkZW9UaW1lbGluZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICBFbnRlck5hbWVTY2VuZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUNoYXJhY3RlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdFBhcmFjaHV0ZXJzKHRoaXMpO1xuICAgICAgICBpbml0RHVzdHkodGhpcyk7XG4gICAgICAgIGluaXREaXBwZXIodGhpcyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXREdXN0eShzY2VuZSkge1xuXG4gICAgICAgIHZhciBkdXN0eSA9IG5ldyBDaGFyYWN0ZXIoJ0R1c3R5Jyk7XG5cbiAgICAgICAgdmFyIGR1c3R5SWRsZUFuaW1hdGlvbiA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXREdXN0eUlkbGVUZXh0dXJlcygpKTtcbiAgICAgICAgdmFyIGR1c3R5QmxpbmtBbmltYXRpb24gPSBuZXcgUElYSS5Nb3ZpZUNsaXAoZ2V0RHVzdHlCbGlua1RleHR1cmVzKCkpO1xuXG4gICAgICAgIGR1c3R5SWRsZUFuaW1hdGlvbi5hbmNob3IgPSB7eDogMC41LCB5OiAwLjV9O1xuICAgICAgICBkdXN0eUJsaW5rQW5pbWF0aW9uLmFuY2hvciA9IHt4OiAwLjUsIHk6IDAuNX07XG5cbiAgICAgICAgZHVzdHkuc2V0SWRsZVN0YXRlKGR1c3R5SWRsZUFuaW1hdGlvbik7XG4gICAgICAgIGR1c3R5LmFkZFN0YXRlKCdibGluaycsIGR1c3R5QmxpbmtBbmltYXRpb24pO1xuXG4gICAgICAgIGR1c3R5LndpbmRvd1NjYWxlID0gNjAwLzEzNjY7XG4gICAgICAgIGR1c3R5LndpbmRvd1ggPSAwLjE1O1xuICAgICAgICBkdXN0eS53aW5kb3dZID0gLTE7XG5cbiAgICAgICAgLy8gYWRkIHRvIHN0YWdlXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGR1c3R5KTtcbiAgICAgICAgc2NlbmUuY2hhcmFjdGVycy5kdXN0eSA9IGR1c3R5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXREaXBwZXIoc2NlbmUpIHtcbiAgICAgICAgdmFyIGRpcHBlciA9IG5ldyBDaGFyYWN0ZXIoJ0RpcHBlcicpO1xuXG4gICAgICAgIHZhciBkaXBwZXJJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2RpcHBlci5wbmdcIik7XG5cbiAgICAgICAgZGlwcGVySWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgICAgIHg6IDQ0MC84NjUsXG4gICAgICAgICAgICB5OiAzMTAvNDMzXG4gICAgICAgIH07XG5cbiAgICAgICAgZGlwcGVyLnNldElkbGVTdGF0ZShkaXBwZXJJZGxlU3RhdGUpO1xuXG4gICAgICAgIGRpcHBlci53aW5kb3dYID0gMC43NTtcbiAgICAgICAgZGlwcGVyLndpbmRvd1kgPSAtMTtcbiAgICAgICAgZGlwcGVyLnJvdGF0aW9uID0gLTAuNDA7XG5cbiAgICAgICAgZGlwcGVyLndpbmRvd1NjYWxlID0gODY1LzEzNjY7XG4gICAgICAgIGRpcHBlci5hbmltYXRpb25TY2FsZVggPSAwLjc7XG4gICAgICAgIGRpcHBlci5hbmltYXRpb25TY2FsZVkgPSAwLjc7XG5cbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IDEwO1xuXG4gICAgICAgIGRpcHBlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGRpcHBlcik7XG4gICAgICAgIHNjZW5lLmNoYXJhY3RlcnMuZGlwcGVyID0gZGlwcGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRQYXJhY2h1dGVycyhzY2VuZSkge1xuICAgICAgICB2YXIgcGFyYWNodXRlcnMgPSBbZ2V0QmxhY2tvdXQoKSwgZ2V0RHJpcCgpLCBnZXREeW5hbWl0ZSgpXTtcblxuICAgICAgICBfLmVhY2gocGFyYWNodXRlcnMsIGZ1bmN0aW9uKHBhcmFjaHV0ZXIpIHtcbiAgICAgICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlcigpO1xuICAgICAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gMDtcblxuICAgICAgICAgICAgcGFyYWNodXRlci5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuICAgICAgICAgICAgcGFyYWNodXRlci53aW5kb3dYID0gMC41O1xuICAgICAgICAgICAgcGFyYWNodXRlci53aW5kb3dZID0gLTE7XG5cbiAgICAgICAgICAgIHNjZW5lLmFkZENoaWxkKHBhcmFjaHV0ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2NlbmUuY2hhcmFjdGVycy5wYXJhY2h1dGVycyA9IHBhcmFjaHV0ZXJzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRCbGFja291dCgpIHtcbiAgICAgICAgdmFyIGJsYWNrb3V0SWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9ibGFja291dC5wbmdcIik7XG4gICAgICAgIGJsYWNrb3V0SWRsZVN0YXRlLmFuY2hvciA9IHtcbiAgICAgICAgICAgIHg6IDI2LzYxLFxuICAgICAgICAgICAgeTogMzMvOTRcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYmxhY2tvdXQgPSBuZXcgQ2hhcmFjdGVyKCdCbGFja291dCcsIGJsYWNrb3V0SWRsZVN0YXRlKTtcblxuICAgICAgICByZXR1cm4gYmxhY2tvdXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldERyaXAoKSB7XG4gICAgICAgIHZhciBkcmlwSWRsZVN0YXRlID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKFwiYXNzZXRzL2ltZy9kcmlwLnBuZ1wiKTtcbiAgICAgICAgZHJpcElkbGVTdGF0ZS5hbmNob3IgPSB7XG4gICAgICAgICAgICB4OiAzNi82MSxcbiAgICAgICAgICAgIHk6IDI2Lzk0XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGRyaXAgPSBuZXcgQ2hhcmFjdGVyKCdEcmlwJywgZHJpcElkbGVTdGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIGRyaXA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldER5bmFtaXRlKCkge1xuICAgICAgICB2YXIgZHluYW1pdGVJZGxlU3RhdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJhc3NldHMvaW1nL2R5bmFtaXRlLnBuZ1wiKTtcbiAgICAgICAgZHluYW1pdGVJZGxlU3RhdGUuYW5jaG9yID0ge1xuICAgICAgICAgICAgeDogMjcvNjEsXG4gICAgICAgICAgICB5OiAzMC85NFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBkeW5hbWl0ZSA9IG5ldyBDaGFyYWN0ZXIoJ0R5bmFtaXRlJywgZHluYW1pdGVJZGxlU3RhdGUpO1xuICAgICAgICByZXR1cm4gZHluYW1pdGU7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUJsYWRlV2lwZUFuaW1hdGlvbihzY2VuZSkge1xuICAgICAgICB2YXIgdGV4dHVyZXMgPSBQSVhJLmdldFRleHR1cmVzKCdhc3NldHMvd2lwZXNjcmVlbi9CbGFkZV93cHNjcm5fODYnLCA0MDAsIDU1Nik7XG5cbiAgICAgICAgY29uc29sZS5sb2codGV4dHVyZXMpO1xuXG4gICAgICAgIHZhciB3aXBlc2NyZWVuVmlkZW8gPSBuZXcgUElYSS5Nb3ZpZUNsaXAodGV4dHVyZXMpO1xuICAgICAgICB3aXBlc2NyZWVuVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICAgICAgd2lwZXNjcmVlblZpZGVvLndpbmRvd1kgPSAwLjU7XG4gICAgICAgIHdpcGVzY3JlZW5WaWRlby53aW5kb3dTY2FsZSA9IDE7XG5cbiAgICAgICAgd2lwZXNjcmVlblZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICAgICAgd2lwZXNjcmVlblZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgd2lwZXNjcmVlblZpZGVvLmxvb3AgPSBmYWxzZTtcblxuICAgICAgICBzY2VuZS5hZGRDaGlsZCh3aXBlc2NyZWVuVmlkZW8pO1xuICAgICAgICBzY2VuZS53aXBlc2NyZWVuVmlkZW8gPSB3aXBlc2NyZWVuVmlkZW87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUoc2NlbmUpIHtcbiAgICAgICAgc2NlbmUud2lwZXNjcmVlblZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2NlbmUud2lwZXNjcmVlblZpZGVvLCAndHdlZW5GcmFtZScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R3ZWVuRnJhbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3R3ZWVuRnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW3ZhbHVlIHwgMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzY2VuZS50aW1lbGluZVZpZGVvID0gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZShzY2VuZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUoc2NlbmUpIHtcbiAgICAgICAgdmFyIGZwcyA9IDI0O1xuICAgICAgICB2YXIgbnVtRnJhbWVzID0gc2NlbmUud2lwZXNjcmVlblZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHNjZW5lLndpcGVzY3JlZW5WaWRlbywgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgdHdlZW5GcmFtZTogbnVtRnJhbWVzLTEsXG4gICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgfSkpO1xuXG5cbiAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgIH1cblxuICAgIEVudGVyTmFtZVNjZW5lLnByb3RvdHlwZS5wbGF5V2lwZXNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLndpcGVzY3JlZW5WaWRlby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50aW1lbGluZVZpZGVvLnBsYXkoKTtcbiAgICB9O1xuICAgIEVudGVyTmFtZVNjZW5lLnByb3RvdHlwZS5vbldpcGVzY3JlZW5Db21wbGV0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMudGltZWxpbmVWaWRlby52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9O1xuICAgIEVudGVyTmFtZVNjZW5lLnByb3RvdHlwZS5oaWRlVmlkZW8gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy53aXBlc2NyZWVuVmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuICAgIH07XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgRW50ZXJOYW1lU2NlbmUucHJvdG90eXBlLmluaXRpYWxpemVBbmltYXRpb25UaW1lbGluZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdGltZWxpbmUuYWRkKHRoaXMuZ2V0QW5pbWF0aW9uRHVzdHlJbigpLnBsYXkoKSwgMCk7XG4gICAgICAgIHRpbWVsaW5lLmFkZCh0aGlzLmdldEFuaW1hdGlvbkR1c3R5SG92ZXIoKS5wbGF5KCksIDApO1xuXG4gICAgICAgIHRpbWVsaW5lLmFkZCh0aGlzLmdldEFuaW1hdGlvbkRpcHBlckluKCkucGxheSgpLCAwLjQpO1xuXG4gICAgICAgIHRoaXMudGltZWxpbmVJbiA9IHRpbWVsaW5lO1xuXG4gICAgICAgIHZhciB0aW1lbGluZU91dCA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGltZWxpbmVPdXQuYWRkKGdlbmVyYXRlQW5pbWF0aW9uRGlwcGVyT3V0KHRoaXMuY2hhcmFjdGVycy5kaXBwZXIpLnBsYXkoKSwgMCk7XG4gICAgICAgIHRpbWVsaW5lT3V0LmFkZChnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KHRoaXMuY2hhcmFjdGVycy5kdXN0eSkucGxheSgpLCAwKTtcblxuICAgICAgICB0aGlzLnRpbWVsaW5lT3V0ID0gdGltZWxpbmVPdXQ7XG4gICAgfTtcblxuICAgIEVudGVyTmFtZVNjZW5lLnByb3RvdHlwZS5zdGFydEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRpbWVsaW5lSW4ucGxheSgpO1xuXG4vLyAgICAgICAgdmFyIGR1c3R5ID0gdGhpcy5jaGFyYWN0ZXJzLmR1c3R5O1xuLy8gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgIGR1c3R5LmdvVG9TdGF0ZSgnYmxpbmsnKTtcbi8vICAgICAgICB9LCA1MDAwKTtcblxuXG4gICAgICAgIHZhciBwYXJhY2h1dGVycyA9IF8uc2h1ZmZsZSh0aGlzLmNoYXJhY3RlcnMucGFyYWNodXRlcnMpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHBhcmFjaHV0ZXJzKTtcblxuICAgICAgICB2YXIgc3RhcnRUaW1lID0gMjAwMDtcbiAgICAgICAgc2V0VGltZW91dChfLmJpbmQodGhpcy5hbmltYXRlUGFyYWNodXRlciwgdGhpcywgcGFyYWNodXRlcnNbMF0pLCBzdGFydFRpbWUpO1xuICAgICAgICBzZXRUaW1lb3V0KF8uYmluZCh0aGlzLmFuaW1hdGVQYXJhY2h1dGVyLCB0aGlzLCBwYXJhY2h1dGVyc1sxXSksIHN0YXJ0VGltZSArIDYwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KF8uYmluZCh0aGlzLmFuaW1hdGVQYXJhY2h1dGVyLCB0aGlzLCBwYXJhY2h1dGVyc1syXSksIHN0YXJ0VGltZSArIDE1MDAwKTtcbiAgICB9O1xuXG5cbiAgICBFbnRlck5hbWVTY2VuZS5wcm90b3R5cGUuYW5pbWF0ZVBhcmFjaHV0ZXIgPSBmdW5jdGlvbihwYXJhY2h1dGVyKSB7XG4gICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMzU7XG5cbiAgICAgICAgdmFyIGRlcHRoID0gTWF0aC5yYW5kb20oKSAqIDU7XG4gICAgICAgIHZhciB4ID0gMC4xICsgKE1hdGgucmFuZG9tKCkgKiAwLjgpO1xuICAgICAgICB2YXIgc2NhbGUgPSAxIC0gZGVwdGggKiAwLjIvNTtcblxuICAgICAgICBwbGFjZUp1c3RPZmZzY3JlZW4ocGFyYWNodXRlcik7XG4gICAgICAgIHBhcmFjaHV0ZXIud2luZG93WCA9IHg7XG5cbiAgICAgICAgdmFyIHJvdGF0aW9uID0gMC4zO1xuXG5cbiAgICAgICAgVHdlZW5MaXRlLnRvKHBhcmFjaHV0ZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgIHdpbmRvd1k6IDEsXG4gICAgICAgICAgICBlYXNlOiAnU2luZS5lYXNlT3V0J1xuICAgICAgICB9KTtcblxuICAgICAgICBwYXJhY2h1dGVyLnNjYWxlID0ge3g6IHNjYWxlLCB5OiBzY2FsZX07XG4gICAgICAgIHBhcmFjaHV0ZXIuZmlsdGVyc1swXS5ibHVyID0gZGVwdGg7XG4gICAgICAgIHBhcmFjaHV0ZXIucm90YXRpb24gPSByb3RhdGlvbjtcbiAgICAgICAgc3dheVBhcmFjaHV0ZXIocGFyYWNodXRlciwgcm90YXRpb24pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzd2F5UGFyYWNodXRlcihwYXJhY2h1dGVyLCByb3RhdGlvbikge1xuICAgICAgICB2YXIgc3dheVRpbWUgPSAxLjI7XG4gICAgICAgIHZhciBkZWMgPSAwLjAzO1xuXG4gICAgICAgIFR3ZWVuTGl0ZS50byhwYXJhY2h1dGVyLCBzd2F5VGltZSwge1xuICAgICAgICAgICAgcm90YXRpb246IC1yb3RhdGlvbixcbiAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnXG4gICAgICAgIH0pO1xuICAgICAgICBUd2VlbkxpdGUudG8ocGFyYWNodXRlciwgc3dheVRpbWUsIHtcbiAgICAgICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgICAgIGVhc2U6ICdDdWJpYy5lYXNlSW5PdXQnLFxuICAgICAgICAgICAgZGVsYXk6IHN3YXlUaW1lLFxuICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYocm90YXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3YXlQYXJhY2h1dGVyKHBhcmFjaHV0ZXIsIHJvdGF0aW9uIC0gZGVjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICBFbnRlck5hbWVTY2VuZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRpbWVsaW5lT3V0LnBsYXkoKTtcbiAgICB9O1xuXG4gICAgRW50ZXJOYW1lU2NlbmUucHJvdG90eXBlLm9uSGlkZUNvbXBsZXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy50aW1lbGluZU91dC52YXJzLm9uQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9O1xuXG5cbiAgICAvLyBjYWxsZWQgb24gZWFjaCBhbmltYXRpb24gZnJhbWVcbiAgICBFbnRlck5hbWVTY2VuZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNhbGwgcGFyZW50IGZ1bmN0aW9uXG4gICAgICAgIFNjZW5lLnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKiogSW5kaXZpZHVhbCBBbmltYXRpb25zICoqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICBFbnRlck5hbWVTY2VuZS5wcm90b3R5cGUuZ2V0QW5pbWF0aW9uRHVzdHlJbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IDEuODtcbiAgICAgICAgdmFyIGVhc2luZyA9ICdDdWJpYy5lYXNlSW5PdXQnO1xuICAgICAgICB2YXIgZHVzdHkgPSB0aGlzLmNoYXJhY3RlcnMuZHVzdHk7XG5cbiAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgIG9uU3RhcnQ6IF8uYmluZChwbGFjZUp1c3RPZmZzY3JlZW4sIG51bGwsIGR1c3R5KVxuICAgICAgICB9KTtcblxuICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICB3aW5kb3dZOiAwLjUsXG4gICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgfSksIDApO1xuXG4gICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICB9O1xuXG4gICAgRW50ZXJOYW1lU2NlbmUucHJvdG90eXBlLmdldEFuaW1hdGlvbkR1c3R5SG92ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxO1xuICAgICAgICB2YXIgZWFzaW5nID0gJ1F1YWQuZWFzZUluT3V0JztcblxuICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgcmVwZWF0OiAtMVxuICAgICAgICB9KTtcblxuICAgICAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHRoaXMuY2hhcmFjdGVycy5kdXN0eSwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgYnVtcFk6IC0xNSxcbiAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICB9KSk7XG4gICAgICAgIHRpbWVsaW5lLmFwcGVuZChUd2VlbkxpdGUudG8odGhpcy5jaGFyYWN0ZXJzLmR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICBidW1wWTogMCxcbiAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgIH07XG5cbiAgICBFbnRlck5hbWVTY2VuZS5wcm90b3R5cGUuZ2V0QW5pbWF0aW9uRGlwcGVySW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAyLjA7XG4gICAgICAgIHZhciBzd2VlcFN0YXJ0VGltZSA9IGFuaW1hdGlvblRpbWUgKiAwLjExO1xuICAgICAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICAgICAgdmFyIGRpcHBlciA9IHRoaXMuY2hhcmFjdGVycy5kaXBwZXI7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gZGlwcGVyLmZpbHRlcnNbMF07XG5cbiAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgIG9uU3RhcnQ6IF8uYmluZChwbGFjZUp1c3RPZmZzY3JlZW4sIG51bGwsIGRpcHBlcilcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgIHdpbmRvd1k6IDAuMzIsXG4gICAgICAgICAgICBlYXNlOiAnQmFjay5lYXNlT3V0J1xuICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgLy9zd2VlcCByaWdodFxuICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGRpcHBlciwgYW5pbWF0aW9uVGltZSwge1xuICAgICAgICAgICAgd2luZG93WDogMC44NixcbiAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgIH0pLCBzd2VlcFN0YXJ0VGltZSk7XG5cbiAgICAgICAgLy8gc2NhbGUgdXBcbiAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhkaXBwZXIsIGFuaW1hdGlvblRpbWUgKyBzd2VlcFN0YXJ0VGltZSwge1xuICAgICAgICAgICAgYW5pbWF0aW9uU2NhbGVYOiAxLFxuICAgICAgICAgICAgYW5pbWF0aW9uU2NhbGVZOiAxLFxuICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgIH0pLCAwKTtcbiAgICAgICAgdGltZWxpbmUuYWRkKFR3ZWVuTGl0ZS50byhibHVyRmlsdGVyLCBhbmltYXRpb25UaW1lICsgc3dlZXBTdGFydFRpbWUsIHtcbiAgICAgICAgICAgIGJsdXI6IDAsXG4gICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgfSksIDApO1xuXG4gICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVBbmltYXRpb25EaXBwZXJPdXQoZGlwcGVyKSB7XG4gICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgICAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBkaXBwZXIuZmlsdGVyc1swXTtcblxuICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oZGlwcGVyLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuNCxcbiAgICAgICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS40LFxuICAgICAgICAgICAgd2luZG93WTogLTAuMyxcbiAgICAgICAgICAgIHdpbmRvd1g6IDEuMSxcbiAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICB9KSwgMCk7XG4gICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oYmx1ckZpbHRlciwgYW5pbWF0aW9uVGltZS8yLCB7XG4gICAgICAgICAgICBibHVyOiAxMCxcbiAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgcmV0dXJuIHRpbWVsaW5lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUFuaW1hdGlvbkR1c3R5T3V0KGR1c3R5KSB7XG4gICAgICAgIHZhciBhbmltYXRpb25UaW1lID0gMS42O1xuICAgICAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICAgICAgdmFyIHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKGR1c3R5LCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICBhbmltYXRpb25TY2FsZVg6IDEuMixcbiAgICAgICAgICAgIGFuaW1hdGlvblNjYWxlWTogMS4yLFxuICAgICAgICAgICAgd2luZG93WTogMC4yNCxcbiAgICAgICAgICAgIHdpbmRvd1g6IC0wLjMsXG4gICAgICAgICAgICBlYXNlOiBlYXNpbmdcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgZnVuY3Rpb24gcGxhY2VKdXN0T2Zmc2NyZWVuKGNoYXJhY3Rlcikge1xuICAgICAgICB2YXIgaGVpZ2h0ID0gY2hhcmFjdGVyLnNjYWxlLnkgKiBjaGFyYWN0ZXIuZ2V0TG9jYWxCb3VuZHMoKS5oZWlnaHQ7XG5cbiAgICAgICAgY2hhcmFjdGVyLndpbmRvd1kgPSAtKGhlaWdodC8yKS9jaGFyYWN0ZXIuXyR3aW5kb3cuaGVpZ2h0KCk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuXG4gICAgLy8gRXh0ZW5kcyBTY2VuZSBDbGFzc1xuICAgIGV4dGVuZChTY2VuZSwgRW50ZXJOYW1lU2NlbmUpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVNjZW5lO1xufSkoKTsiLCJcbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBzdWIpIHtcbiAgICAvLyBBdm9pZCBpbnN0YW50aWF0aW5nIHRoZSBiYXNlIGNsYXNzIGp1c3QgdG8gc2V0dXAgaW5oZXJpdGFuY2VcbiAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2NyZWF0ZVxuICAgIC8vIGZvciBhIHBvbHlmaWxsXG4gICAgLy8gQWxzbywgZG8gYSByZWN1cnNpdmUgbWVyZ2Ugb2YgdHdvIHByb3RvdHlwZXMsIHNvIHdlIGRvbid0IG92ZXJ3cml0ZVxuICAgIC8vIHRoZSBleGlzdGluZyBwcm90b3R5cGUsIGJ1dCBzdGlsbCBtYWludGFpbiB0aGUgaW5oZXJpdGFuY2UgY2hhaW5cbiAgICAvLyBUaGFua3MgdG8gQGNjbm9rZXNcbiAgICB2YXIgb3JpZ1Byb3RvID0gc3ViLnByb3RvdHlwZTtcbiAgICBzdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3JpZ1Byb3RvKSAge1xuICAgICAgICBzdWIucHJvdG90eXBlW2tleV0gPSBvcmlnUHJvdG9ba2V5XTtcbiAgICB9XG5cbiAgICAvLyBSZW1lbWJlciB0aGUgY29uc3RydWN0b3IgcHJvcGVydHkgd2FzIHNldCB3cm9uZywgbGV0J3MgZml4IGl0XG4gICAgc3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgICAvLyBJbiBFQ01BU2NyaXB0NSsgKGFsbCBtb2Rlcm4gYnJvd3NlcnMpLCB5b3UgY2FuIG1ha2UgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5XG4gICAgLy8gbm9uLWVudW1lcmFibGUgaWYgeW91IGRlZmluZSBpdCBsaWtlIHRoaXMgaW5zdGVhZFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWIucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc3ViXG4gICAgfSk7XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDsiLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG4gICAgdmFyIFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZScpO1xuXG5cbiAgICBmdW5jdGlvbiBnZXRJbnRyb1RleHR1cmVzKCkge1xuICAgICAgICByZXR1cm4gUElYSS5nZXRUZXh0dXJlcygnYXNzZXRzL2ludHJvVmlkZW8vUExBTkVTMl83NjB4NDI4XzAwJywgMCwgMTIyKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqIEludHJvIFBpeGkgQW5pbWF0aW9uIENsYXNzICoqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIHZhciBJbnRyb1NjZW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFNjZW5lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vcGFyZW50IGNvbnN0cnVjdG9yXG5cbiAgICAgICAgaW5pdGlhbGl6ZVZpZGVvKHRoaXMpO1xuICAgICAgICBpbml0aWFsaXplTWFzayh0aGlzKTtcbiAgICAgICAgaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUodGhpcyk7XG4gICAgfTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiBQdWJsaWMgQVBJIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgSW50cm9TY2VuZS5wcm90b3R5cGUuc3RhcnRBbmltYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbnRyb1ZpZGVvLnZpc2libGUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMudGltZWxpbmVWaWRlby5wbGF5KCk7XG4gICAgfTtcblxuICAgIEludHJvU2NlbmUucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy90aGlzLnRpbWVsaW5lT3Blbi5wbGF5KCk7XG4gICAgfTtcblxuXG4gICAgLy8gY2FsbGVkIG9uIGVhY2ggYW5pbWF0aW9uIGZyYW1lXG4gICAgSW50cm9TY2VuZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNhbGwgcGFyZW50IGZ1bmN0aW9uXG4gICAgICAgIFNjZW5lLnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG4gICAgLy9zZXQgb24gY29tcGxldGUgZnVuY3Rpb24gZm9yIGFuaW1hdGlvbiB0aW1lbGluZVxuICAgIEludHJvU2NlbmUucHJvdG90eXBlLm9uQ29tcGxldGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnRpbWVsaW5lVmlkZW8udmFycy5vbkNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfTtcblxuXG4gICAgSW50cm9TY2VuZS5wcm90b3R5cGUuc2V0VmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB9O1xuICAgIEludHJvU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgU2NlbmUucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKHRoaXMudmlldykpIHtcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IHRoaXMuaW50cm9WaWRlby5zY2FsZTtcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSB0aGlzLmludHJvVmlkZW8uZ2V0TG9jYWxCb3VuZHMoKTtcblxuICAgICAgICAgICAgdGhpcy52aWV3Lm9uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQsIChib3VuZHMud2lkdGggKiBzY2FsZS54KSwgKGJvdW5kcy5oZWlnaHQgKiBzY2FsZS55KSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVWaWRlbyhzY2VuZSkge1xuICAgICAgICB2YXIgaW50cm9WaWRlbyA9IG5ldyBQSVhJLk1vdmllQ2xpcChnZXRJbnRyb1RleHR1cmVzKCkpO1xuXG4gICAgICAgIGludHJvVmlkZW8ud2luZG93WCA9IDAuNTtcbiAgICAgICAgaW50cm9WaWRlby53aW5kb3dZID0gMC41O1xuICAgICAgICBpbnRyb1ZpZGVvLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcblxuICAgICAgICBpbnRyb1ZpZGVvLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgaW50cm9WaWRlby5sb29wID0gZmFsc2U7XG5cbiAgICAgICAgaW50cm9WaWRlby5zY2FsZU1pbiA9IDE7XG4gICAgICAgIGludHJvVmlkZW8uc2NhbGVNYXggPSAyO1xuICAgICAgICBpbnRyb1ZpZGVvLndpbmRvd1NjYWxlID0gMC42O1xuXG4gICAgICAgIHNjZW5lLmFkZENoaWxkKGludHJvVmlkZW8pO1xuICAgICAgICBzY2VuZS5pbnRyb1ZpZGVvID0gaW50cm9WaWRlbztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplTWFzayhzY2VuZSkge1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUJhY2tncm91bmRDb2xvcihzY2VuZSkge1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVZpZGVvVGltZWxpbmUoc2NlbmUpIHtcblxuICAgICAgICBzY2VuZS5pbnRyb1ZpZGVvLl90d2VlbkZyYW1lID0gMDtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2NlbmUuaW50cm9WaWRlbywgJ3R3ZWVuRnJhbWUnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90d2VlbkZyYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlbkZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1t2YWx1ZSB8IDBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NlbmUudGltZWxpbmVWaWRlbyA9IGdldFZpZGVvQW5pbWF0aW9uVGltZWxpbmUoc2NlbmUpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgZnVuY3Rpb24gZ2V0VmlkZW9BbmltYXRpb25UaW1lbGluZShzY2VuZSkge1xuICAgICAgICB2YXIgZnBzID0gMjQ7XG4gICAgICAgIHZhciBudW1GcmFtZXMgPSBzY2VuZS5pbnRyb1ZpZGVvLnRleHR1cmVzLmxlbmd0aDtcblxuICAgICAgICB2YXIgYW5pbWF0aW9uVGltZSA9IG51bUZyYW1lcy9mcHM7XG4gICAgICAgIHZhciBlYXNpbmcgPSBuZXcgU3RlcHBlZEVhc2UobnVtRnJhbWVzKTtcblxuICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVMaXRlKHtcbiAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aW1lbGluZS5hcHBlbmQoVHdlZW5MaXRlLnRvKHNjZW5lLmludHJvVmlkZW8sIGFuaW1hdGlvblRpbWUsIHtcbiAgICAgICAgICAgIHR3ZWVuRnJhbWU6IG51bUZyYW1lcy0xLFxuICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgIH0pKTtcblxuXG4gICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICB9XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBFeHRlbmQgYW5kIEV4cG9ydCAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuICAgIC8vIEV4dGVuZHMgU2NlbmUgQ2xhc3NcbiAgICBleHRlbmQoU2NlbmUsIEludHJvU2NlbmUpO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbnRyb1NjZW5lO1xuXG5cbn0pKCk7XG5cblxuXG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKlxuICAgICAqIEN1c3RvbSBFZGl0cyBmb3IgdGhlIFBJWEkgTGlicmFyeVxuICAgICAqL1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgLyogKioqKioqKioqKioqKioqKioqKiBSZWxhdGl2ZSBQb3NpdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuXyR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dYID0gMDtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dZID0gMDtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fc2V0UG9zaXRpb25YID0gZnVuY3Rpb24od2luZG93V2lkdGgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKHdpbmRvd1dpZHRoICogdGhpcy5fd2luZG93WCkgKyB0aGlzLl9idW1wWDtcbiAgICB9O1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFBvc2l0aW9uWSA9IGZ1bmN0aW9uKHdpbmRvd0hlaWdodCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAod2luZG93SGVpZ2h0ICogdGhpcy5fd2luZG93WSkgKyB0aGlzLl9idW1wWTtcbiAgICB9O1xuXG4gICAgLy8gd2luZG93WCBhbmQgd2luZG93WSBhcmUgcHJvcGVydGllcyBhZGRlZCB0byBhbGwgUGl4aSBkaXNwbGF5IG9iamVjdHMgdGhhdFxuICAgIC8vIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgcG9zaXRpb24ueCBhbmQgcG9zaXRpb24ueVxuICAgIC8vIHRoZXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhIHZhbHVlIGJldHdlZW4gMCAmIDEgYW5kIHBvc2l0aW9uIHRoZSBkaXNwbGF5XG4gICAgLy8gb2JqZWN0IGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2luZG93IHdpZHRoICYgaGVpZ2h0IGluc3RlYWQgb2YgYSBmbGF0IHBpeGVsIHZhbHVlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd3aW5kb3dYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd1g7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgIC8vIFZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1ggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb25YKHRoaXMuXyR3aW5kb3cud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3dpbmRvd1knLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93WTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fd2luZG93WSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvblkodGhpcy5fJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYnVtcFggPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2J1bXBZID0gMDtcblxuICAgIC8vIGJ1bXBYIGFuZCBidW1wWSBhcmUgcHJvcGVydGllcyBvbiBhbGwgZGlzcGxheSBvYmplY3RzIHVzZWQgZm9yXG4gICAgLy8gc2hpZnRpbmcgdGhlIHBvc2l0aW9uaW5nIGJ5IGZsYXQgcGl4ZWwgdmFsdWVzLiBVc2VmdWwgZm9yIHN0dWZmXG4gICAgLy8gbGlrZSBob3ZlciBhbmltYXRpb25zIHdoaWxlIHN0aWxsIG1vdmluZyBhcm91bmQgYSBjaGFyYWN0ZXIuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICdidW1wWCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idW1wWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyAgLy8gVmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgICAgICAgICAgdGhpcy5fYnVtcFggPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gKHRoaXMuXyR3aW5kb3cud2lkdGgoKSAqIHRoaXMuX3dpbmRvd1gpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2J1bXBZJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1bXBZO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7ICAvLyBWYWx1ZSBzaG91bGQgYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgICAgICAgICB0aGlzLl9idW1wWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSAodGhpcy5fJHdpbmRvdy5oZWlnaHQoKSAqIHRoaXMuX3dpbmRvd1kpICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIFNjYWxpbmcgRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5cbiAgICAvLyB3aW5kb3dTY2FsZSBjb3JyZXNwb25kcyB0byB3aW5kb3cgc2l6ZVxuICAgIC8vICAgZXg6IHdpbmRvd1NjYWxlID0gMC4yNSBtZWFucyAxLzQgc2l6ZSBvZiB3aW5kb3dcbiAgICAvLyBzY2FsZU1pbiBhbmQgc2NhbGVNYXggY29ycmVzcG9uZCB0byBuYXR1cmFsIHNwcml0ZSBzaXplXG4gICAgLy8gICBleDogc2NhbGVNaW4gPSAwLjUgbWVhbnMgc3ByaXRlIHdpbGwgbm90IHNocmluayB0byBtb3JlIHRoYW4gaGFsZiBvZiBpdHMgb3JpZ2luYWwgc2l6ZS5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl93aW5kb3dTY2FsZSA9IC0xO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNaW4gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2NhbGVNYXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgLy8gV2luZG93U2NhbGU6IHZhbHVlIGJldHdlZW4gMCAmIDEsIG9yIC0xXG4gICAgLy8gVGhpcyBkZWZpbmVzIHdoYXQgJSBvZiB0aGUgd2luZG93IChoZWlnaHQgb3Igd2lkdGgsIHdoaWNoZXZlciBpcyBzbWFsbGVyKVxuICAgIC8vIHRoZSBvYmplY3Qgd2lsbCBiZSBzaXplZC4gRXhhbXBsZTogYSB3aW5kb3dTY2FsZSBvZiAwLjUgd2lsbCBzaXplIHRoZSBkaXNwbGF5T2JqZWN0XG4gICAgLy8gdG8gaGFsZiB0aGUgc2l6ZSBvZiB0aGUgd2luZG93LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnd2luZG93U2NhbGUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93U2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvd1NjYWxlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKHRoaXMuXyR3aW5kb3cud2lkdGgoKSwgdGhpcy5fJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3NldFNjYWxlID0gZnVuY3Rpb24od2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCkge1xuICAgICAgICB2YXIgbG9jYWxCb3VuZHMgPSB0aGlzLmdldExvY2FsQm91bmRzKCk7XG5cbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5fd2luZG93U2NhbGUgKiBNYXRoLm1pbih3aW5kb3dIZWlnaHQvbG9jYWxCb3VuZHMuaGVpZ2h0LCB3aW5kb3dXaWR0aC9sb2NhbEJvdW5kcy53aWR0aCk7XG5cbiAgICAgICAgLy9rZWVwIHNjYWxlIHdpdGhpbiBvdXIgZGVmaW5lZCBib3VuZHNcbiAgICAgICAgc2NhbGUgPSBNYXRoLm1heCh0aGlzLnNjYWxlTWluLCBNYXRoLm1pbihzY2FsZSwgdGhpcy5zY2FsZU1heCkpO1xuXG5cbiAgICAgICAgdGhpcy5zY2FsZS54ID0gc2NhbGUgKiB0aGlzLl9hbmltYXRpb25TY2FsZVg7XG4gICAgICAgIHRoaXMuc2NhbGUueSA9IHNjYWxlICogdGhpcy5fYW5pbWF0aW9uU2NhbGVZO1xuICAgIH07XG5cblxuICAgIC8vIFVTRSBPTkxZIElGIFdJTkRPV1NDQUxFIElTIEFMU08gU0VUXG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fYW5pbWF0aW9uU2NhbGVYID0gMTtcbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9hbmltYXRpb25TY2FsZVkgPSAxO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLCAnYW5pbWF0aW9uU2NhbGVYJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNjYWxlWDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2NhbGVYID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNjYWxlKHRoaXMuXyR3aW5kb3cud2lkdGgoKSwgdGhpcy5fJHdpbmRvdy5oZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ2FuaW1hdGlvblNjYWxlWScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TY2FsZVk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblNjYWxlWSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTY2FsZSh0aGlzLl8kd2luZG93LndpZHRoKCksIHRoaXMuXyR3aW5kb3cuaGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBXaW5kb3cgUmVzaXplIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQgZm9yIGVhY2ggZGlzcGxheSBvYmplY3Qgb24gd2luZG93IHJlc2l6ZSxcbiAgICAvLyBhZGp1c3RpbmcgdGhlIHBpeGVsIHBvc2l0aW9uIHRvIG1pcnJvciB0aGUgcmVsYXRpdmUgcG9zaXRpb25zIHdpbmRvd1ggYW5kIHdpbmRvd1lcbiAgICAvLyBhbmQgYWRqdXN0aW5nIHNjYWxlIGlmIGl0J3Mgc2V0XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWCh3aWR0aCk7XG4gICAgICAgIHRoaXMuX3NldFBvc2l0aW9uWShoZWlnaHQpO1xuXG4gICAgICAgIGlmKHRoaXMuX3dpbmRvd1NjYWxlICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U2NhbGUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiwgZnVuY3Rpb24oZGlzcGxheU9iamVjdCkge1xuICAgICAgICAgICAgZGlzcGxheU9iamVjdC5fb25XaW5kb3dSZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqIFNwcml0ZXNoZWV0IFRleHR1cmUgRnVuY3Rpb25zICoqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4gICAgLy8gdXNlZCB0byBnZXQgaW5kaXZpZHVhbCB0ZXh0dXJlcyBvZiBzcHJpdGVzaGVldCBqc29uIGZpbGVzXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIGNhbGw6IGdldEZpbGVOYW1lcygnYW5pbWF0aW9uX2lkbGVfJywgMSwgMTA1KTtcbiAgICAvLyBSZXR1cm5zOiBbJ2FuaW1hdGlvbl9pZGxlXzAwMS5wbmcnLCAnYW5pbWF0aW9uX2lkbGVfMDAyLnBuZycsIC4uLiAsICdhbmltYXRpb25faWRsZV8xMDQucG5nJ11cbiAgICAvL1xuICAgIGZ1bmN0aW9uIGdldEZpbGVOYW1lcyhmaWxlUHJlZml4LCByYW5nZVN0YXJ0LCByYW5nZUVuZCkge1xuICAgICAgICB2YXIgbnVtRGlnaXRzID0gKHJhbmdlRW5kLTEpLnRvU3RyaW5nKCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKSwgZnVuY3Rpb24obnVtKSB7XG5cbiAgICAgICAgICAgIHZhciBudW1aZXJvcyA9IG51bURpZ2l0cyAtIG51bS50b1N0cmluZygpLmxlbmd0aDsgICAvL2V4dHJhIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIHZhciB6ZXJvcyA9IG5ldyBBcnJheShudW1aZXJvcyArIDEpLmpvaW4oJzAnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQcmVmaXggKyB6ZXJvcyArIG51bSArICcucG5nJztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgUElYSS5nZXRUZXh0dXJlcyA9IGZ1bmN0aW9uKGZpbGVQcmVmaXgsIHJhbmdlU3RhcnQsIHJhbmdlRW5kKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChnZXRGaWxlTmFtZXMoZmlsZVByZWZpeCwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQpLCBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKTtcbiAgICB9XG5cblxuXG5cblxuXG5cblxufSkoKTsiLCJcblxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxuXG52YXIgU2NlbmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ0IgPSBmdW5jdGlvbigpe307XG5cbiAgICBQSVhJLlN0YWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5TY2VuZS5wcm90b3R5cGUgPSB7XG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZUNCKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IgPSB1cGRhdGVDQjtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ0IoKTtcbiAgICB9LFxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVzdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIGlzUGF1c2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGF1c2VkO1xuICAgIH1cbn07XG5cblxuZXh0ZW5kKFBJWEkuU3RhZ2UsIFNjZW5lKTtcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICAgIHZhciBTY2VuZSA9IHJlcXVpcmUoJy4vc2NlbmUnKTtcblxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgdmFyIFNjZW5lc01hbmFnZXIgPSB7XG4gICAgICAgIHNjZW5lczoge30sXG4gICAgICAgIGN1cnJlbnRTY2VuZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZXI6IG51bGwsXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsICRwYXJlbnREaXYpIHtcblxuICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIucmVuZGVyZXIpIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2lkdGgsIGhlaWdodCwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIucmVuZGVyZXIudmlldy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3BpeGktdmlldycpO1xuICAgICAgICAgICAgJHBhcmVudERpdi5hcHBlbmQoU2NlbmVzTWFuYWdlci5yZW5kZXJlci52aWV3KTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoU2NlbmVzTWFuYWdlci5sb29wKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGxvb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoZnVuY3Rpb24gKCkgeyBTY2VuZXNNYW5hZ2VyLmxvb3AoKSB9KTtcblxuICAgICAgICAgICAgaWYgKCFTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZSB8fCBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpKSByZXR1cm47XG5cbiAgICAgICAgICAgIFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lLnVwZGF0ZSgpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci5yZW5kZXIoU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVTY2VuZTogZnVuY3Rpb24oaWQsIFNjZW5lQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGlmIChTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0pIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIFNjZW5lQ29uc3RydWN0b3IgPSBTY2VuZUNvbnN0cnVjdG9yIHx8IFNjZW5lOyAgIC8vZGVmYXVsdCB0byBTY2VuZSBiYXNlIGNsYXNzXG5cbiAgICAgICAgICAgIHZhciBzY2VuZSA9IG5ldyBTY2VuZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF0gPSBzY2VuZTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9LFxuICAgICAgICBnb1RvU2NlbmU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBpZiAoU2NlbmVzTWFuYWdlci5zY2VuZXNbaWRdKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNjZW5lc01hbmFnZXIuY3VycmVudFNjZW5lKSBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5wYXVzZSgpO1xuXG4gICAgICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUgPSBTY2VuZXNNYW5hZ2VyLnNjZW5lc1tpZF07XG5cbiAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHJlc2l6ZSB0byBtYWtlIHN1cmUgYWxsIGNoaWxkIG9iamVjdHMgaW4gdGhlXG4gICAgICAgICAgICAgICAgLy8gbmV3IHNjZW5lIGFyZSBjb3JyZWN0bHkgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIFNjZW5lc01hbmFnZXIub25XaW5kb3dSZXNpemUoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlc3VtZSBuZXcgc2NlbmVcbiAgICAgICAgICAgICAgICBTY2VuZXNNYW5hZ2VyLmN1cnJlbnRTY2VuZS5yZXN1bWUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSAkd2luZG93LndpZHRoKCk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5jdXJyZW50U2NlbmUuX29uV2luZG93UmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgU2NlbmVzTWFuYWdlci5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuXG4gICAgJHdpbmRvdy5vbigncmVzaXplJywgU2NlbmVzTWFuYWdlci5vbldpbmRvd1Jlc2l6ZSk7XG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gU2NlbmVzTWFuYWdlcjtcbn0pKCk7IiwiXG5cblxuXG5cbnZhciBhdWRpb0Fzc2V0cyA9IHJlcXVpcmUoJy4vZGF0YS9hdWRpb0Fzc2V0cy5qc29uJyk7XG5cbnZhciBzb3VuZFBsYXllciA9IHtcbiAgICBtdXRlZDogZmFsc2UsXG4gICAgdm9sdW1lOiAwLjQsXG4gICAgc291bmRzOiB7fSxcbiAgICBvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgICAgICB0aGlzLnNvdW5kc1tmaWxlUGF0aF0gPSB0aGlzLnNvdW5kc1tmaWxlUGF0aF0gfHwgbmV3IEF1ZGlvKGZpbGVQYXRoKTtcbiAgICB9LFxuICAgIHBsYXk6IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuYWRkKGZpbGVQYXRoKTtcblxuICAgICAgICBpZighdGhpcy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZHNbZmlsZVBhdGhdLnZvbHVtZSA9IHRoaXMudm9sdW1lO1xuICAgICAgICAgICAgdGhpcy5zb3VuZHNbZmlsZVBhdGhdLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXy5lYWNoKGF1ZGlvQXNzZXRzLCBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHNvdW5kUGxheWVyLmFkZChmaWxlUGF0aCk7XG59KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc291bmRQbGF5ZXI7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmdWxsLXJlbGF0aXZlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm5hbWUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgdmFsdWU9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52YWx1ZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC52YWx1ZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiIGlkPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiAvPlxcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudmFsdWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmFsdWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiZnVsbC1yZWxhdGl2ZVxcXCI+PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy50ZXh0KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnRleHQpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1zaGFkb3dcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcblxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBjbGFzcz1cXFwiY29weVxcXCI+XFxuICAgIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3B5KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcHkpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3B0aW9ucyBjbGVhcmZpeFxcXCI+XFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMSwgcHJvZ3JhbTEsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuLi9waXhpL3NjZW5lc01hbmFnZXInKTtcbiAgICB2YXIgRW50ZXJOYW1lU2NlbmUgPSByZXF1aXJlKCcuLi9waXhpL2VudGVyTmFtZVNjZW5lJyk7XG5cbiAgICB2YXIgRW50ZXJOYW1lVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdkaXYubmFtZS5wYWdlJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2hhbmdlIGlucHV0Lm5hbWUnOiAnb25OYW1lQ2hhbmdlJyxcbiAgICAgICAgICAgICdrZXl1cCBpbnB1dC5uYW1lJzogJ29uTmFtZUNoYW5nZScsXG4gICAgICAgICAgICAncGFzdGUgaW5wdXQubmFtZSc6ICdvbk5hbWVDaGFuZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdFNjZW5lKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBuZXcgQmFja2JvbmUuTW9kZWwoe3ZhbHVlOiAnJ30pO1xuXG4gICAgICAgICAgICB0aGlzLiRuYW1lSW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dFt0eXBlPXRleHRdLm5hbWUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFNjZW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZXNNYW5hZ2VyLnNjZW5lc1snZW50ZXJOYW1lJ107XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIFJ1biBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI3BpeGktdmlldycpLnJlbW92ZUNsYXNzKCdmcm9udCcpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBTaG93L0hpZGUgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLmdvVG9TY2VuZSgnZW50ZXJOYW1lJyk7XG5cblxuICAgICAgICAgICAgc2V0VGltZW91dChfLmJpbmQodGhpcy5zdGFydEFuaW1hdGlvbiwgdGhpcyksIDApO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLm9uSGlkZUNvbXBsZXRlKF8uYmluZCh0aGlzLnNldEluYWN0aXZlLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIC8vcnVuIGhpZGUgYW5pbWF0aW9uXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy5oaWRlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25IaWRlQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uTmFtZUNoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiB0aGlzLiRuYW1lSW5wdXQudmFsKCl9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGVyTmFtZVZpZXc7XG59KSgpO1xuIiwiXG5cblxuXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzb3VuZFBsYXllciA9IHJlcXVpcmUoJy4uL3NvdW5kUGxheWVyJyk7XG5cbiAgICB2YXIgRm9vdGVyVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgYS52b2x1bWUnOiAnb25Wb2x1bWVUb2dnbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm51bURvdHMgPSBvcHRpb25zLm51bURvdHM7XG5cblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRWb2x1bWVBbmltYXRpb25UaW1lbGluZXMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENvdW50ZXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzID0gdGhpcy4kZWwuZmluZCgnYS52b2x1bWUgcGF0aCcpO1xuICAgICAgICAgICAgdGhpcy4kY291bnRlciA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5jb3VudGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRkb3RzID0gdGhpcy4kY291bnRlci5maW5kKCc+IC5kb3QnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFZvbHVtZUFuaW1hdGlvblRpbWVsaW5lczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9uQW5pbWF0aW9uID0gdGhpcy5nZXRUaW1lbGluZVZvbHVtZU9uKCk7XG4gICAgICAgICAgICB0aGlzLnZvbHVtZU9mZkFuaW1hdGlvbiA9IHRoaXMuZ2V0VGltZWxpbmVWb2x1bWVPZmYoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdENvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG51bURvdHMgPSB0aGlzLm51bURvdHM7XG5cbiAgICAgICAgICAgIHZhciAkZG90ID0gdGhpcy4kZG90cy5lcSgwKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMjsgaSA8PSBudW1Eb3RzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgJG5ld0RvdCA9ICRkb3QuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAkbmV3RG90LmZpbmQoJz4gZGl2Lm51bWJlcicpLmh0bWwoaSk7XG4gICAgICAgICAgICAgICAgJG5ld0RvdC5hcHBlbmRUbyh0aGlzLiRjb3VudGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kZG90cyA9IHRoaXMuJGNvdW50ZXIuZmluZCgnPiAuZG90Jyk7XG4gICAgICAgICAgICB0aGlzLiRhY3RpdmVEb3QgPSAkZG90O1xuICAgICAgICAgICAgJGRvdC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqIFZvbHVtZSBBbmltYXRpb24gRnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICB0b2dnbGVWb2x1bWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52b2x1bWVPbiA9ICF0aGlzLnZvbHVtZU9uO1xuXG4gICAgICAgICAgICBpZih0aGlzLnZvbHVtZU9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52b2x1bWVPbkFuaW1hdGlvbi5wbGF5KDApO1xuICAgICAgICAgICAgICAgIHNvdW5kUGxheWVyLm9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudm9sdW1lT2ZmQW5pbWF0aW9uLnBsYXkoMCk7XG4gICAgICAgICAgICAgICAgc291bmRQbGF5ZXIub2ZmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VGltZWxpbmVWb2x1bWVPbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge3N0YXJ0TWF0cml4OiBbMCwwLDAsMCwyMiwzMl0sIGVuZE1hdHJpeDogWzEsMCwwLDEsMCwwXSwgZWFzaW5nOiAnQmFjay5lYXNlT3V0Jywgb3BhY2l0eTogMX07XG5cbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMCksIDAuNSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGltZWxpbmU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWVsaW5lVm9sdW1lT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7c3RhcnRNYXRyaXg6IFsxLDAsMCwxLDAsMF0sIGVuZE1hdHJpeDogWzAsMCwwLDAsMjIsMzJdLCBlYXNpbmc6ICdCYWNrLmVhc2VJbicsIG9wYWNpdHk6IDB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgb25cbiAgICAgICAgICAgIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoMSwwLDAsMSwwLDApJyk7XG4gICAgICAgICAgICB0aGlzLiR2b2x1bWVTdmdQYXRocy5jc3MoJ29wYWNpdHknLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5hZGRTdmdQYXRoQW5pbWF0aW9uKHRpbWVsaW5lLCB0aGlzLiR2b2x1bWVTdmdQYXRocy5lcSgwKSwgMCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmFkZFN2Z1BhdGhBbmltYXRpb24odGltZWxpbmUsIHRoaXMuJHZvbHVtZVN2Z1BhdGhzLmVxKDEpLCAwLjI1LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ZnUGF0aEFuaW1hdGlvbih0aW1lbGluZSwgdGhpcy4kdm9sdW1lU3ZnUGF0aHMuZXEoMiksIDAuNSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkU3ZnUGF0aEFuaW1hdGlvbjogZnVuY3Rpb24odGltZWxpbmUsICRwYXRoLCBzdGFydFRpbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBhbmltYXRpb25TcGVlZCA9IDAuMjtcblxuICAgICAgICAgICAgdmFyIHBhdGhNYXRyaXggPSBfLmNsb25lKG9wdGlvbnMuc3RhcnRNYXRyaXgpO1xuXG4gICAgICAgICAgICB2YXIgdHdlZW5BdHRycyA9IHtcbiAgICAgICAgICAgICAgICBlYXNlOiBvcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXRoLmF0dHIoJ3RyYW5zZm9ybScsICdtYXRyaXgoJyArIHBhdGhNYXRyaXguam9pbignLCcpICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0d2VlbkF0dHJzLCBvcHRpb25zLmVuZE1hdHJpeCk7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8oJHBhdGgsIGFuaW1hdGlvblNwZWVkLCB7b3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5fSksIGFuaW1hdGlvblNwZWVkICogc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8ocGF0aE1hdHJpeCwgYW5pbWF0aW9uU3BlZWQsIHR3ZWVuQXR0cnMpLCBhbmltYXRpb25TcGVlZCAqIHN0YXJ0VGltZSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBDb3VudGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHNldENvdW50ZXI6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGl2ZURvdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvdHMuZXEoaSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy4kYWN0aXZlRG90ID0gdGhpcy4kZG90cy5lcShpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kY291bnRlci5oaWRlKCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBvblZvbHVtZVRvZ2dsZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVZvbHVtZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gRm9vdGVyVmlldztcbn0pKCk7IiwiXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgc2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3BpeGkvc2NlbmVzTWFuYWdlcicpO1xuICAgIHZhciBJbnRyb1NjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9pbnRyb1NjZW5lJyk7XG5cblxuICAgIHZhciBJbnRyb1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2ludHJvLXZpZXcnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLmJlZ2luJzogJ29uQmVnaW5DbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiBJbml0aWFsaXphdGlvbiBTdHVmZiAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgICAgdGhpcy5pbml0SnF1ZXJ5VmFyaWFibGVzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb25UaW1lbGluZSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2NlbmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdEpxdWVyeVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRiZWdpblNjcmVlbiA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi5iZWdpbi1zY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuJGJlZ2luTGluZXMgPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdkaXYubGluZScpO1xuICAgICAgICAgICAgdGhpcy4kYmVnaW5CdG4gPSB0aGlzLiRiZWdpblNjcmVlbi5maW5kKCdhLmJlZ2luJyk7XG5cblxuXG4gICAgICAgICAgICB2YXIgJHZpZXdQb3J0cyA9IHRoaXMuJGVsLmZpbmQoJ2Rpdi52aWV3cG9ydCcpO1xuXG4gICAgICAgICAgICB0aGlzLiR2aWV3UG9ydFRvcCA9ICR2aWV3UG9ydHMuZmlsdGVyKCcudG9wJyk7XG4gICAgICAgICAgICB0aGlzLiR2aWV3UG9ydEJvdHRvbSA9ICR2aWV3UG9ydHMuZmlsdGVyKCcuYnRtJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHZlcnRpY2FsU2lkZXMgPSAkdmlld1BvcnRzLmZpbmQoJy52ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgdGhpcy4kaG9yaXpvbnRhbFNpZGVzID0gJHZpZXdQb3J0cy5maW5kKCcuaG9yaXpvbnRhbCcpO1xuICAgICAgICAgICAgdGhpcy4kYmFja2dyb3VuZHMgPSAkdmlld1BvcnRzLmZpbmQoJy5iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRBbmltYXRpb25UaW1lbGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lSGlkZSA9IHRoaXMuZ2V0VGltZWxpbmVIaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnRpbWVsaW5lQmVnaW5TY3JlZW5JbiA9IHRoaXMuZ2V0VGltZWxpbmVCZWdpblNjcmVlbkluKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRTY2VuZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmVzTWFuYWdlci5jcmVhdGVTY2VuZSgnaW50cm8nLCBJbnRyb1NjZW5lKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dCZWdpblNjcmVlbiwgdGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNldFZpZXcodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgc2hvd0JlZ2luU2NyZWVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmVCZWdpblNjcmVlbkluO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KF8uYmluZCh0aW1lbGluZS5wbGF5LCB0aW1lbGluZSksIDIwMCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKiogQW5pbWF0aW9uIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBnZXRUaW1lbGluZUJlZ2luU2NyZWVuSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAwLjQ7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0JhY2suZWFzZU91dCc7XG5cbiAgICAgICAgICAgIHZhciB0d2VlbnMgPSBfLm1hcCh0aGlzLiRiZWdpbkxpbmVzLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3ZWVuTGl0ZS50byhsaW5lLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHR3ZWVuczogdHdlZW5zLFxuICAgICAgICAgICAgICAgIHN0YWdnZXI6IDAuMDgsXG4gICAgICAgICAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy4kYmVnaW5CdG4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvblN0YXJ0U2NvcGU6IHRoaXNcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIHZhciBidG5JblRpbWUgPSAwLjQ7XG5cbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6ICdFbGFzdGljLmVhc2VPdXQnXG4gICAgICAgICAgICB9KSwgYnRuSW5UaW1lKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLmFkZChUd2VlbkxpdGUudG8odGhpcy4kYmVnaW5CdG4sIDAuNiwge1xuICAgICAgICAgICAgICAgIHNjYWxlWDogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiAnRWxhc3RpYy5lYXNlT3V0J1xuICAgICAgICAgICAgfSksIGJ0bkluVGltZSArIChhbmltYXRpb25UaW1lICogMC4wNSkpO1xuXG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRUaW1lbGluZUhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKiBTdGF0aWMgVmFyaWFibGVzICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblRpbWUgPSAxLjY7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gJ0N1YmljLmVhc2VJbk91dCc7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKiogVGltZWxpbmUgKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgIHZhciB0aW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRpb25GaW5pc2hlZCxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlU2NvcGU6IHRoaXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJGJlZ2luU2NyZWVuLCBhbmltYXRpb25UaW1lLzQsIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIGVhc2U6IGVhc2luZ1xuICAgICAgICAgICAgfSksIDApO1xuXG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJHZpZXdQb3J0VG9wLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnLTUwJScsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG4gICAgICAgICAgICB0aW1lbGluZS5hZGQoVHdlZW5MaXRlLnRvKHRoaXMuJHZpZXdQb3J0Qm90dG9tLCBhbmltYXRpb25UaW1lLCB7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAnLTUwJScsXG4gICAgICAgICAgICAgICAgZWFzZTogZWFzaW5nXG4gICAgICAgICAgICB9KSwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lbGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25BbmltYXRpb25GaW5pc2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNldEluYWN0aXZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QWN0aXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdpbmFjdGl2ZScpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRJbmFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaW5hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG4gICAgICAgIG9uQmVnaW5DbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kcy53aWR0aCh2aWRlb1dpZHRoICogMS4yNzUgfCAwKTtcbiAgICAgICAgICAgIHRoaXMuJGhvcml6b250YWxTaWRlcy5oZWlnaHQoKCh3aW5kb3dIZWlnaHQgLSB2aWRlb0hlaWdodCkvMiArIDEpIHwgMCk7IC8vcm91bmQgdXBcbiAgICAgICAgICAgIHRoaXMuJHZlcnRpY2FsU2lkZXMud2lkdGgoKCh3aW5kb3dXaWR0aCAtIHZpZGVvV2lkdGgpLzIgKyAxKSB8IDApOyAvL3JvdW5kIHVwXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogUHVibGljIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZSgpO1xuXG4gICAgICAgICAgICBzY2VuZXNNYW5hZ2VyLmdvVG9TY2VuZSgnaW50cm8nKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zdGFydEFuaW1hdGlvbigpO1xuXG4gICAgICAgICAgICAkKCcjcGl4aS12aWV3JykuYWRkQ2xhc3MoJ2Zyb250Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy50aW1lbGluZUhpZGUucGxheSgpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5vcGVuKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbnRyb1ZpZXc7XG59KSgpOyIsIlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEVudGVyTmFtZVNjZW5lID0gcmVxdWlyZSgnLi4vcGl4aS9lbnRlck5hbWVTY2VuZScpO1xuICAgIHZhciBzY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vcGl4aS9zY2VuZXNNYW5hZ2VyJyk7XG5cbiAgICAvLyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gQ29sbGVjdGlvbnMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgdmFyIGFsbFF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL2FsbFF1ZXN0aW9ucycpO1xuXG4gICAgLy8gfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+IFZpZXdzIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIHZhciBJbnRyb1ZpZXcgPSByZXF1aXJlKCcuL2ludHJvVmlldycpO1xuICAgIHZhciBFbnRlck5hbWVWaWV3ID0gcmVxdWlyZSgnLi9lbnRlck5hbWVWaWV3Jyk7XG4gICAgdmFyIFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3Jyk7XG4gICAgdmFyIFNlbGVjdENoYXJhY3RlclZpZXcgPSByZXF1aXJlKCcuL3NlbGVjdENoYXJhY3RlclZpZXcnKTtcbiAgICB2YXIgUmVzcG9uc2VWaWV3ID0gcmVxdWlyZSgnLi9yZXNwb25zZVZpZXcnKTtcbiAgICB2YXIgRm9vdGVyVmlldyA9IHJlcXVpcmUoJy4vZm9vdGVyVmlldycpO1xuXG5cbiAgICB2YXIgTWFpblZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnI2NvbnRlbnQnLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayBhLm5leHQnOiAnb25OZXh0JyxcbiAgICAgICAgICAgICdjbGljayBhLmZpbmlzaC1zZW5kJzogJ29uRmluaXNoJyxcbiAgICAgICAgICAgICdtb3VzZW1vdmUnOiAnb25Nb3VzZU1vdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEluaXRpYWxpemF0aW9uIFN0dWZmICoqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gW107XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVBhZ2VJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEpxdWVyeVZhcmlhYmxlcygpO1xuXG4gICAgICAgICAgICAvL2NyZWF0ZSBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgc2NlbmVzTWFuYWdlci5pbml0aWFsaXplKCQod2luZG93KS53aWR0aCgpLCAkKHdpbmRvdykuaGVpZ2h0KCksIHRoaXMuJGVsKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lc01hbmFnZXIuY3JlYXRlU2NlbmUoJ2VudGVyTmFtZScsIEVudGVyTmFtZVNjZW5lKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHZpZXdzXG4gICAgICAgICAgICB0aGlzLmluaXRJbnRyb1ZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBhZ2VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlclZpZXcoe251bURvdHM6IHRoaXMucGFnZXMubGVuZ3RofSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldyA9IG5ldyBSZXNwb25zZVZpZXcoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0SW50cm9WaWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSBuZXcgSW50cm9WaWV3KCk7XG5cbiAgICAgICAgICAgIGludHJvVmlldy5vbkNvbXBsZXRlKF8uYmluZCh0aGlzLnNob3dGaXJzdFBhZ2UsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5pbnRyb1ZpZXcgPSBpbnRyb1ZpZXc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFBhZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGFyTW9kZWwgPSBfLmZpcnN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTW9kZWxzID0gXy5yZXN0KGFsbFF1ZXN0aW9ucy5tb2RlbHMpO1xuXG4gICAgICAgICAgICB2YXIgZW50ZXJOYW1lVmlldyA9IG5ldyBFbnRlck5hbWVWaWV3KCk7XG4gICAgICAgICAgICB2YXIgc2VsZWN0Q2hhclZpZXcgPSBuZXcgU2VsZWN0Q2hhcmFjdGVyVmlldyh7bW9kZWw6IGNoYXJNb2RlbCwgcGFyZW50OiB0aGlzLiRwYWdlc0NvbnRhaW5lcn0pO1xuXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25WaWV3cyA9IF8ubWFwKHF1ZXN0aW9uTW9kZWxzLCBmdW5jdGlvbihxdWVzdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVzdGlvblZpZXcoe21vZGVsOiBxdWVzdGlvbk1vZGVsLCBwYXJlbnQ6IHRoaXMuJHBhZ2VzQ29udGFpbmVyfSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IFtlbnRlck5hbWVWaWV3LCBzZWxlY3RDaGFyVmlld10uY29uY2F0KHF1ZXN0aW9uVmlld3MpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0SnF1ZXJ5VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICAgICAgdGhpcy4kcGFnZXNDb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCdkaXYucGFnZXMtY3RuJyk7XG5cbiAgICAgICAgICAgIHZhciAkYmFja2dyb3VuZHMgPSB0aGlzLiRlbC5maW5kKCc+IGRpdi5iYWNrZ3JvdW5kJyk7XG4gICAgICAgICAgICB0aGlzLiRiYWNrZ3JvdW5kcyA9ICRiYWNrZ3JvdW5kcztcbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZHMuZmlsdGVyKCcuYmFjaycpO1xuICAgICAgICAgICAgdGhpcy4kbWlkZGxlZ3JvdW5kID0gJGJhY2tncm91bmRzLmZpbHRlcignLm1pZGRsZScpO1xuICAgICAgICAgICAgdGhpcy4kZm9yZWdyb3VuZCA9ICRiYWNrZ3JvdW5kcy5maWx0ZXIoJy5mcm9udCcpO1xuXG4gICAgICAgICAgICB0aGlzLiRuZXh0ID0gdGhpcy4kcGFnZXNDb250YWluZXIuZmluZCgnZGl2LnBhZ2UtbmF2IGEubmV4dCcpO1xuICAgICAgICAgICAgdGhpcy4kZmluaXNoU2VuZCA9IHRoaXMuJHBhZ2VzQ29udGFpbmVyLmZpbmQoJ2Rpdi5wYWdlLW5hdiBhLmZpbmlzaC1zZW5kJyk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKiBDaGFuZ2UgVmlldyBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaG93Rmlyc3RQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZXNbMF0uc2hvdygpO1xuXG4gICAgICAgICAgICB0aGlzLiRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2hpZGUgYWN0aXZlIHBhZ2VcbiAgICAgICAgICAgIHZhciBhY3RpdmVQYWdlID0gdGhpcy5wYWdlc1t0aGlzLmFjdGl2ZVBhZ2VJbmRleF07XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhZ2Uub25IaWRlQ29tcGxldGUoXy5iaW5kKHRoaXMuc2hvd1BhZ2VBZnRlckhpZGUsIHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlSW5kZXgrKztcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzaG93UGFnZUFmdGVySGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL3Nob3cgbmV4dCBwYWdlXG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuYWN0aXZlUGFnZUluZGV4XTtcbiAgICAgICAgICAgIG5leHRQYWdlLnNob3coKTtcblxuICAgICAgICAgICAgdGhpcy5mb290ZXIuc2V0Q291bnRlcih0aGlzLmFjdGl2ZVBhZ2VJbmRleCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID09PSB0aGlzLnBhZ2VzLmxlbmd0aC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RmluaXNoQnRuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dGaW5pc2hCdG46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kbmV4dC5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRmaW5pc2hTZW5kLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hBbmRTZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhZ2VzQ29udGFpbmVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyLmhpZGVDb3VudGVyKCk7XG5cbiAgICAgICAgICAgIHZhciBwYWdlTW9kZWxzID0gXy5tYXAodGhpcy5wYWdlcywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLm1vZGVsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlVmlldy5zZXRSZXNwb25zZShwYWdlTW9kZWxzKTtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuc2NlbmUub25XaXBlc2NyZWVuQ29tcGxldGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbWUuJGJhY2tncm91bmRzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBtZS5yZXNwb25zZVZpZXcuc2hvdygpO1xuICAgICAgICAgICAgICAgIG1lLnNjZW5lLmhpZGVWaWRlbygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNwaXhpLXZpZXcnKS5hZGRDbGFzcygnbWlkZGxlJyk7XG4gICAgICAgICAgICAvL3J1biBibGFkZXdpcGUgYW5pbWF0aW9uXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnBsYXlXaXBlc2NyZWVuKCk7XG5cblxuXG4vLyAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmRzLmhpZGUoKTtcbi8vXG4vL1xuLy9cbi8vICAgICAgICAgICAgdGhpcy5yZXNwb25zZVZpZXcuc2hvdygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiogUmVuZGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnRyb1ZpZXcgPSB0aGlzLmludHJvVmlldztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpbnRyb1ZpZXcuc3RhcnQoKTsgLy9zdGFydCBpbnRyb1xuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiogUGFyYWxsYXggU3R1ZmYgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgICAgICBzaGlmdEJhY2tncm91bmRMYXllcnM6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kUmF0aW8gPSAwLjc1O1xuICAgICAgICAgICAgdmFyIG1pZGRsZWdyb3VuZFJhdGlvID0gMS41O1xuICAgICAgICAgICAgdmFyIGZvcmVncm91bmRSYXRpbyA9IDM7XG5cbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kTGVmdCA9IC0oeCAtIDAuNSkgKiBiYWNrZ3JvdW5kUmF0aW8gKyAnJSc7XG4gICAgICAgICAgICB2YXIgbWlkZGxlZ3JvdW5kTGVmdCA9IC0oeCAtIDAuNSkgKiBtaWRkbGVncm91bmRSYXRpbyArICclJztcbiAgICAgICAgICAgIHZhciBmb3JlZ3JvdW5kTGVmdCA9IC0oeCAtIDAuNSkgKiBmb3JlZ3JvdW5kUmF0aW8gKyAnJSc7XG5cbiAgICAgICAgICAgIHRoaXMuJGJhY2tncm91bmQuY3NzKCdsZWZ0JywgYmFja2dyb3VuZExlZnQpO1xuICAgICAgICAgICAgdGhpcy4kbWlkZGxlZ3JvdW5kLmNzcygnbGVmdCcsIG1pZGRsZWdyb3VuZExlZnQpO1xuICAgICAgICAgICAgdGhpcy4kZm9yZWdyb3VuZC5jc3MoJ2xlZnQnLCBmb3JlZ3JvdW5kTGVmdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbiAgICAgICAgb25OZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZlUGFnZUluZGV4ID49ICh0aGlzLnBhZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25GaW5pc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5maW5pc2hBbmRTZW5kKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VNb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2hpZnRCYWNrZ3JvdW5kTGF5ZXJzKGUucGFnZVgvdGhpcy4kd2luZG93LndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWluVmlldztcblxuXG5cbn0pKCk7IiwiXG5cbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9xdWVzdGlvbi5oYnMnKTtcblxudmFyIFF1ZXN0aW9uVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAvLyBWYXJpYWJsZXNcbiAgICBjbGFzc05hbWU6ICdxdWVzdGlvbiBwYWdlJyxcbiAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIGlucHV0W3R5cGU9cmFkaW9dJzogJ29uUmFkaW9DaGFuZ2UnXG4gICAgfSxcbiAgICAvLyBGdW5jdGlvbnNcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAgICAgb3B0aW9ucy5wYXJlbnQuYXBwZW5kKHRoaXMuZWwpO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKHRoaXMubW9kZWwuYXR0cmlidXRlcy5jbGFzcyk7XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqIFJlbmRlciBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuZWwuaW5uZXJIVE1MID09PSAnJylcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqIEFuaW1hdGlvbiBGdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLmhpZGVDYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uSGlkZUNvbXBsZXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmhpZGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0sXG5cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoe3ZhbHVlOiBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpfSk7XG4gICAgfVxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvblZpZXc7IiwiXG5cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuXG5cbiAgICB2YXIgUmVzcG9uc2VWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJyNyZXNwb25zZScsXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZXNwb25zZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICAgICAgICAvLyBUT0RPXG5cbiAgICAgICAgICAgIHZhciBuYW1lTW9kZWwgPSBfLmZpcnN0KG1vZGVscyk7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aXRpb25lZFF1ZXN0aW9ucyA9IF8ucGFydGl0aW9uKF8ucmVzdChtb2RlbHMpLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbC5hdHRyaWJ1dGVzLmNsYXNzICE9PSAnY2FubmVkJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcGVyc29uYWxpdHlNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1swXTtcbiAgICAgICAgICAgIHZhciBjYW5uZWRNb2RlbHMgPSBwYXJ0aXRpb25lZFF1ZXN0aW9uc1sxXTtcblxuXG5cblxuICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHRvIGFjdHVhbCBnZW5lcmF0ZWQgcmVzcG9uc2VcbiAgICAgICAgICAgIHZhciBodG1sID0gJ05hbWU6ICcgKyBuYW1lTW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxici8+JztcblxuICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShwZXJzb25hbGl0eU1vZGVscywgZnVuY3Rpb24oc3RyLCBtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyBtb2RlbC5hdHRyaWJ1dGVzLm5hbWUgKyAnOiAnICsgbW9kZWwuYXR0cmlidXRlcy52YWx1ZSArICc8YnIvPic7XG4gICAgICAgICAgICB9LCAnJyk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxici8+JztcblxuICAgICAgICAgICAgaHRtbCArPSBfLnJlZHVjZShjYW5uZWRNb2RlbHMsIGZ1bmN0aW9uKHN0ciwgbW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgbW9kZWwuYXR0cmlidXRlcy5uYW1lICsgJzogJyArIG1vZGVsLmF0dHJpYnV0ZXMudmFsdWUgKyAnPGJyLz4nO1xuICAgICAgICAgICAgfSwgJycpO1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKGh0bWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG5cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zZVZpZXc7XG59KSgpOyIsIlxuXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICB2YXIgc291bmRQbGF5ZXIgPSByZXF1aXJlKCcuLi9zb3VuZFBsYXllcicpO1xuICAgIHZhciBhdWRpb0Fzc2V0cyA9IHJlcXVpcmUoJy4uL2RhdGEvYXVkaW9Bc3NldHMuanNvbicpO1xuXG4gICAgdmFyIFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3Jyk7XG5cblxuICAgIHZhciBTZWxlY3RDaGFyYWN0ZXJWaWV3ID0gUXVlc3Rpb25WaWV3LmV4dGVuZCh7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgLy9wYXJlbnQgY29uc3RydWN0b3JcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmFkaW9DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUub25SYWRpb0NoYW5nZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgICAgICB2YXIgZmlsZVBhdGggPSBhdWRpb0Fzc2V0c1tlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpXTtcblxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheShmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RDaGFyYWN0ZXJWaWV3O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
