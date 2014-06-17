

(function() {
    "use strict";


    var template = require('../templates/name.hbs');
    var scenesManager = require('../pixi/scenesManager');
    var EnterNameScene = require('../pixi/enterNameScene');










    var EnterNameView = Backbone.View.extend({
        className: 'name page',
        template: template,

        // ============================================================ //
        /* ********************** Initialization ********************** */
        // ============================================================ //
        initialize: function (options) {


            //render and append to parent
            options.parent.append(this.render().el);

            this.initScene();
        },
        initScene: function () {
            this.scene = scenesManager.createScene('enterName', EnterNameScene);

        },
        render: function () {
            if (this.el.innerHTML === '')
                this.el.innerHTML = this.template();

            return this;
        },

        // ============================================================ //
        /* ******************* Animation Functions ******************** */
        // ============================================================ //
        startAnimation: function() {
            //this.scene.onUpdate(_.bind(this.onAnimationFrame, this));
        },
        onAnimationFrame: function() {
            //console.log(this);
        },



        // ============================================================ //
        /* ************************ Show/Hide ************************* */
        // ============================================================ //
        show: function () {
            this.$el.addClass('active');

            scenesManager.goToScene('enterName');

            this.startAnimation();
        },
        hide: function () {

        }
    });





    module.exports = EnterNameView;
})();
