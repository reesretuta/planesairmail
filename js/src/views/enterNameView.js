

(function() {
    "use strict";


    var template = require('../templates/name.hbs');
    var scenesManager = require('../pixi/scenesManager');
    var EnterNameScene = require('../pixi/enterNameScene');





    var EnterNameView = Backbone.View.extend({
        className: 'name page',
        template: template,
        events: {
            'change input.name': 'onNameChange',
            'keyup input.name': 'onNameChange',
            'paste input.name': 'onNameChange'
        },
        // ============================================================ //
        /* ********************** Initialization ********************** */
        // ============================================================ //
        initialize: function (options) {

            //render and append to parent
            options.parent.append(this.render().el);

            this.initScene();

            this.model = new Backbone.Model({value: ''});

            this.$nameInput = this.$el.find('input[type=text].name');
        },
        initScene: function() {
            this.scene = scenesManager.createScene('enterName', EnterNameScene);

        },
        render: function() {
            if (this.el.innerHTML === '')
                this.el.innerHTML = this.template();

            return this;
        },

        // ============================================================ //
        /* ***************** Run Animation Functions ****************** */
        // ============================================================ //
        startAnimation: function() {

            this.scene.startAnimation();
        },

        // ============================================================ //
        /* ************************ Show/Hide ************************* */
        // ============================================================ //
        show: function () {
            this.$el.addClass('active');

            scenesManager.goToScene('enterName');



            setTimeout(_.bind(this.startAnimation, this), 1000);
        },
        hide: function () {
            this.$el.removeClass('active');
        },



        onNameChange: function(e) {
            this.model.set({value: this.$nameInput.val()});
        }
    });





    module.exports = EnterNameView;
})();
