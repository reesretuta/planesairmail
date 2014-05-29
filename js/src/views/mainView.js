
var QuestionList = require('../collections/questionList');

var cannedQuestionData = require('../data/cannedQuestions.json');
var personalityQuestionData = require('../data/personalityQuestions.json');

var QuestionView = require('./questionView');

function getAllQuestions() {
    "use strict";

    var allQuestions = new QuestionList();

    allQuestions.add(personalityQuestionData.questions);
    allQuestions.add(cannedQuestionData.questions);

    return allQuestions
}

function generateQuestionViews() {
    var views = [];

    var allQuestions = getAllQuestions();

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