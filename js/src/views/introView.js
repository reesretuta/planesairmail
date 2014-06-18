
(function() {
    "use strict";

    var template = require('../templates/intro.hbs');
    var scenesManager = require('../pixi/scenesManager');
    var IntroScene = require('../pixi/introScene');


    var IntroView = Backbone.View.extend({
        id: 'intro-view',
        template: template,

        // ============================================================ //
        /* ****************** Initialization Stuff ******************** */
        // ============================================================ //
        initialize: function(options) {

            options.parent.append(this.render().el);

            this.onCompleteCallback = function(){};

            this.initJqueryVariables();
            this.initAnimationTimeline();
            this.initScene();
        },
        initJqueryVariables: function() {

            var $viewPorts = this.$el.find('div.viewport');

            this.$viewPortTop = $viewPorts.filter('.top');
            this.$viewPortBottom = $viewPorts.filter('.bottom');
        },
        initAnimationTimeline: function() {
            this.timeline = this.getTimelineHide();
        },
        initScene: function() {
            this.scene = scenesManager.createScene('intro', IntroScene);

            this.scene.onComplete(_.bind(this.hide, this));
        },

        // ============================================================ //
        /* ******************** Render Functions ********************** */
        // ============================================================ //
        render: function() {
            if(this.el.innerHTML === '')
                this.el.innerHTML = this.template();

            return this;
        },

        // ============================================================ //
        /* ***************** Animation Functions ********************** */
        // ============================================================ //

        getTimelineHide: function() {
            /****************** Static Variables **************/
            var animationTime = 1.6;
            var easing = 'Cubic.easeInOut';

            /********************* Timeline *******************/
            var timeline = new TimelineMax({
                paused: true,
                onComplete: this.onAnimationFinished,
                onCompleteScope: this
            });

            timeline.add(TweenLite.to(this.$viewPortTop, animationTime, {
                height: 0,
                ease: easing
            }), 0);
            timeline.add(TweenLite.to(this.$viewPortBottom, animationTime, {
                height: 0,
                ease: easing
            }), 0);

            return timeline;
        },
        onAnimationFinished: function() {
            this.setInactive();

            this.onCompleteCallback();
        },

        setActive: function() {
            this.$el.removeClass('inactive');
        },
        setInactive: function() {
            this.$el.addClass('inactive');
        },

        // ============================================================ //
        /* *********************** Public API ************************* */
        // ============================================================ //
        start: function() {
            this.setActive();

            scenesManager.goToScene('intro');

            this.scene.startAnimation();
        },
        hide: function() {
            this.timeline.play();
        },
        onComplete: function(callback) {
            this.onCompleteCallback = callback;
        }
    });








    module.exports = IntroView;
})();