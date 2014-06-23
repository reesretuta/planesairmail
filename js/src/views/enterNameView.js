

(function() {
    "use strict";

    var scenesManager = require('../pixi/scenesManager');
    var EnterNameScene = require('../pixi/enterNameScene');

    var EnterNameView = Backbone.View.extend({
        el: 'div.name.page',
        events: {
            'change input.name': 'onNameChange',
            'keyup input.name': 'onNameChange',
            'paste input.name': 'onNameChange'
        },
        // ============================================================ //
        /* ********************** Initialization ********************** */
        // ============================================================ //
        initialize: function (options) {

            this.initScene();

            this.model = new Backbone.Model({value: ''});

            this.$nameInput = this.$el.find('input[type=text].name');
        },
        initScene: function() {
            this.scene = scenesManager.createScene('enterName', EnterNameScene);

        },

        // ============================================================ //
        /* ***************** Run Animation Functions ****************** */
        // ============================================================ //
        startAnimation: function() {
            $('#pixi-view').removeClass('front');

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
            this.scene.onHideComplete(_.bind(this.setInactive, this));

            //run hide animation
            this.scene.hide();
        },
        setInactive: function() {
            this.$el.removeClass('active');

            if(_.isFunction(this.hideCallback)) {
                this.hideCallback();
            }
        },
        onHideComplete: function(callback) {
            this.hideCallback = callback;
        },

        onNameChange: function(e) {
            this.model.set({value: this.$nameInput.val()});
        }
    });





    module.exports = EnterNameView;
})();
