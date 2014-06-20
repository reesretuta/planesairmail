



(function() {
    "use strict";




    var ResponseView = Backbone.View.extend({
        el: '#response',

        initialize: function() {

        },

        setResponse: function(models) {
            // TODO

            var nameModel = _.first(models);
            var questionModels = _.rest(models);


            // TODO: Change to actual generated response
            var html = 'Name: ' + nameModel.attributes.value + '<br/>';

            html += _.reduce(questionModels, function(prev, model) {
                return prev + model.attributes.name + ': ' + model.attributes.value + '<br/>';
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