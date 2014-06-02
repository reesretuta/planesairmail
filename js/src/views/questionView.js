

var template = require('../templates/question.hbs');

var QuestionView = Backbone.View.extend({
    // Variables
    className: 'question page',
    template: template,

    // Functions
    initialize: function(options) {

    },

    // ============================================================ //
    /* ******************** Render Functions ********************** */
    // ============================================================ //
    render: function() {
        if(this.el.innerHTML === '')
            this.el.innerHTML = this.template(this.model.attributes);

        return this;
    },


    // ============================================================ //
    /* ***************** Animation Functions ********************** */
    // ============================================================ //
    show: function() {
        "use strict";

        this.$el.addClass('active');
    },
    hide: function() {
        "use strict";

        this.$el.removeClass('active');
    }
});


module.exports = QuestionView;