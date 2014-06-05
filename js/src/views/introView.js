
var scenesManager = require('../pixi/scenesManager');
var template = require('../templates/intro.hbs');

var IntroView = Backbone.View.extend({
    id: 'intro-view',
    template: template,

    // ============================================================ //
    /* ****************** Initialization Stuff ******************** */
    // ============================================================ //
    initialize: function() {
        "use strict";

        this.render();

        this.initJqueryVariables();
        this.initAnimationTimelineHide();

        this.scene = scenesManager.createScene('intro');
    },
    initJqueryVariables: function() {
        "use strict";

        var $viewPorts = this.$el.find('div.viewport');

        this.$viewPortTop = $viewPorts.filter('.top');
        this.$viewPortBottom = $viewPorts.filter('.bottom');
    },

    // ============================================================ //
    /* ******************** Render Functions ********************** */
    // ============================================================ //
    render: function() {
        "use strict";

        if(this.el.innerHTML === '')
            this.el.innerHTML = this.template();

        return this;
    },

    // ============================================================ //
    /* ***************** Animation Functions ********************** */
    // ============================================================ //
    initAnimationTimelineHide: function() {
        "use strict";

        /****************** Static Variables **************/
        var animationTime = 1.6;
        var easing = 'Cubic.easeInOut';

        /********************* Timeline *******************/
        var timeline = new TimelineMax({
            paused: true,
            onComplete: this.setInactive,
            onCompleteScope: this
        });

        timeline.add(this.preAnimation.bind(this), 0);

        timeline.add(TweenLite.to(this.$viewPortTop, animationTime, {
            height: 0,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(this.$viewPortBottom, animationTime, {
            height: 0,
            ease: easing
        }), 0);

        this.timelineHide = timeline;
    },
    preAnimation: function() {
        "use strict";

    },
    setActive: function() {
        "use strict";

        this.$el.removeClass('inactive');
    },
    setInactive: function() {
        "use strict";

        this.$el.addClass('inactive');
    },

    // ============================================================ //
    /* *********************** Public API ************************* */
    // ============================================================ //
    show: function() {
        "use strict";

        this.setActive();
    },
    hide: function() {
        "use strict";

        this.timelineHide.play();
    }

});


module.exports = IntroView;