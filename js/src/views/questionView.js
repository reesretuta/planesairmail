
var PageView = require('./pageView');

var template = require('../templates/question.hbs');

var QuestionView = PageView.extend({
    // Variables
    className: 'question',
    template: template,

    // Functions
    initialize: function(options) {
        this.model = options.model;

        console.log(this.el.getAttribute('options'));
    },
    render: function() {
        if(this.el.innerHTML === '')
            this.el.innerHTML = this.template(this.model.attributes);

        return this;
    }
});


module.exports = QuestionView;