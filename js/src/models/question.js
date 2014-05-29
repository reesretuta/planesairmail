


var Question = Backbone.Model.extend({
    defaults: {
        name: '',
        copy: '',
        options: [],
        required: false
    }
});



module.exports = Question;