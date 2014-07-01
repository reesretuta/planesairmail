



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

            this.$background.addClass(characterModel.attributes.value);

            var answeredQuestions = _.filter(_.rest(models, 2), function(model) {return model.attributes.value !== ''});

            var partitionedQuestions = _.partition(answeredQuestions, function(model) {
                return model.attributes.class !== 'canned';
            });

            var personalityModels = partitionedQuestions[0];
            var cannedModels = partitionedQuestions[1];


            var character = characterModel.attributes.value;
            var response = "";

            var personalityResponses = _.map(personalityModels, function(model)  {
                return responseMap[character][model.attributes.name].replace('%template%', model.attributes.text);
            });

            var cannedResponses = _.map(cannedModels, function(model) {
                return responseMap[character][model.attributes.value];
            });

            response += ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ');


            this.$el.find('#card-header span, #card-sincerely span').html(nameModel.attributes.value);
            this.$el.find('#card-body').html(response);
            this.$el.find('#card-from').html(character);

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