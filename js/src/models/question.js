


var Question = Backbone.Model.extend({
    defaults: {
        copy: '',
        choices: [],
        required: false
    }
});



module.exports = Question;