
var PageView = require('./pageView');

var template = require('../templates/question.hbs');

var QuestionView = PageView.extend({
    // Variables
    className: 'question',
    template: template,

    // Functions
    initialize: function(options) {

    },
    render: function() {
        if(this.el.innerHTML === '')
            this.el.innerHTML = this.template(this.model.attributes);

        return this;
    }
});


module.exports = QuestionView;