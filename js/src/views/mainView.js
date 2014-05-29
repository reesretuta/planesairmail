
var allQuestions = require('../collections/allQuestions');

var QuestionView = require('./questionView');


function generateQuestionViews() {
    var views = [];

    _.forEach(allQuestions.models, function(questionModel) {
        "use strict";

        var view = new QuestionView({model: questionModel});

        views.push(view);
    });


    return views;
}



var MainView = Backbone.View.extend({
    el: '#content',
    initialize: function() {
        this.questionViews = generateQuestionViews();

        this.render();
    },
    render: function() {

        _.forEach(this.questionViews, function(view) {
            "use strict";

            this.$el.append(view.render().el);
        }, this);
    }
});


module.exports = MainView;