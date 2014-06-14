
var NameView = (function() {
    "use strict";


    var template = require('../templates/name.hbs');




    return Backbone.View.extend({
        className: 'name page',
        template: template,

        initialize: function(options) {

            this.render();

            options.parent.append(this.el);
        },

        // ============================================================ //
        /* ******************** Render Functions ********************** */
        // ============================================================ //
        render: function () {
            if (this.el.innerHTML === '')
                this.el.innerHTML = this.template();

            return this;
        },
        show: function() {

            console.log('show');
            console.log(this.$el);

            this.$el.addClass('active');
        },
        hide: function() {

        }
    });











})();

module.exports = NameView;