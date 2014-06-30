



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