


var Question = require('../models/question');


var QuestionList = Backbone.Collection.extend({
    model: Question
});




module.exports = QuestionList;