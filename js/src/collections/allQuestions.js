

var QuestionCollection = require('./QuestionCollection');

var cannedQuestionData = require('../data/cannedQuestions.json');
var personalityQuestionData = require('../data/personalityQuestions.json');






var allQuestions = new QuestionCollection();

allQuestions.add(personalityQuestionData.questions);
allQuestions.add(cannedQuestionData.questions);




module.exports = allQuestions;