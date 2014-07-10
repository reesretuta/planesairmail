



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

        getSelectedCharacter: function() {
            return this.model.get('text');
        },
        onRadioChange: function(e) {
            e.preventDefault();
            QuestionView.prototype.onRadioChange.call(this, e);

            var $input = $(e.currentTarget).siblings('input');

            var char = $input.attr('id');

            createjs.Sound.play(characterAudioIds[char]);

            characterModule.setCharacter(char);
        }
    });











    module.exports = SelectCharacterView;
})();