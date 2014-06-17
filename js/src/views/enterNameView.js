

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
            this.initAnimationTimeline();
        },
        initScene: function () {
            this.scene = scenesManager.createScene('enterName', EnterNameScene);

        },
        initAnimationTimeline: function() {
            this.timeline = this.getAnimationDustyIn();
        },
        render: function () {
            if (this.el.innerHTML === '')
                this.el.innerHTML = this.template();

            return this;
        },

        // ============================================================ //
        /* ***************** Run Animation Functions ****************** */
        // ============================================================ //
        startAnimation: function() {
            //this.scene.onUpdate(_.bind(this.onAnimationFrame, this));

            this.timeline.play();
        },
        onAnimationFrame: function() {
            //on pixi update
            //console.log(this);
        },

        // ============================================================ //
        /* ******************* Animation Timelines ******************** */
        // ============================================================ //
        getAnimationDustyIn: function() {
            var animationTime = 0.6;
            var position = {x: 0.75, y: 0};

            var timeline = new TimelineMax({
                paused: true
            });

            timeline.add(TweenLite.to(position, animationTime, {
                y: 0.5,
                ease: 'Cubic.easeInOut',
                onUpdate: this.scene.updateDustyPosition,
                onUpdateScope: this.scene,
                onUpdateParams: [position]
            }), 0);

            return timeline;
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

        }
    });





    module.exports = EnterNameView;
})();
