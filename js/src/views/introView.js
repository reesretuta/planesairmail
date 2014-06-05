
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
    },
    initJqueryVariables: function() {
        "use strict";

        var $borders = this.$el.find('div.border');

        this.$leftBorder = $borders.filter('.left');
        this.$rightBorder = $borders.filter('.right');
        this.$topBorder = $borders.filter('.top');
        this.$bottomBorder = $borders.filter('.bottom');
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

        /********************* Static Variables *****************/
        var animationTime = 1.6;
        var easing = 'Cubic.easeInOut';

        /************************ Timeline **********************/
        var timeline = new TimelineMax({
            paused: true,
            onComplete: this.setInactive,
            onCompleteScope: this
        });

        timeline.add(this.preAnimation.bind(this), 0);

        timeline.add(TweenLite.to(this.$leftBorder, animationTime, {
            width: 0,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(this.$rightBorder, animationTime, {
            width: 0,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(this.$topBorder, animationTime, {
            height: 0,
            ease: easing
        }), 0);
        timeline.add(TweenLite.to(this.$bottomBorder, animationTime, {
            height: 0,
            ease: easing
        }), 0);

        this.timelineHide = timeline;
    },
    preAnimation: function() {
        "use strict";

        this.$leftBorder.css({
            width: this.$leftBorder.width(),
            paddingRight: 0
        });
        this.$rightBorder.css({
            width: this.$rightBorder.width(),
            paddingLeft: 0
        });

        this.$topBorder.css({
            height: this.$topBorder.height(),
            paddingBottom: 0
        });

        this.$bottomBorder.css({
            height: this.$bottomBorder.height(),
            paddingTop: 0
        });
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