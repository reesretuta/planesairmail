



(function() {
    "use strict";


    var scenesManager = require('../pixi/scenesManager');
    var QuestionView = require('./questionView');



    var SelectCharacterView = QuestionView.extend({

        initialize: function(options) {
            //parent constructor
            QuestionView.prototype.initialize.call(this, options);
        },

        onRadioChange: function(e) {
            QuestionView.prototype.onRadioChange.call(this, e);
        }
    });



















    module.exports = SelectCharacterView;
})();