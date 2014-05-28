
var MainView = Backbone.View.extend({
    el: '#content',
    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.html("Hello World");
    }
});


module.exports = MainView;