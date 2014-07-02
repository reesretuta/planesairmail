

var template = require('../templates/question.hbs');
var itemAnimationsModule = require('../animations/pageItems');

var QuestionView = Backbone.View.extend({
    // Variables
    className: 'question page',
    template: template,

    events: {
        'click input[type=radio]': 'onRadioChange'
    },
    // Functions
    initialize: function(options) {
        this.render();

        options.parent.append(this.el);

        this.$el.addClass(this.model.attributes.class);

        this.$options = this.$el.find('div.option');

        if(this.$options.length !== 0)
            this.initAnimations();
    },
    initAnimations: function() {
        "use strict";

        var animations;

        if(this.isCanned()) {
            animations = itemAnimationsModule.getRandomCannedAnimations(this.$options);
        } else {
            animations = itemAnimationsModule.getRandomPersonalityAnimations(this.$options);
        }

        this.animationIn = animations[0];
        this.animationOut = animations[1];

        this.animationIn.vars.onComplete = function() {
            if(_.isFunction(this.showCallback)) {
                this.showCallback();
            }
        }.bind(this);

        this.animationOut.vars.onComplete = function() {
            this.$el.removeClass('active');

            if(_.isFunction(this.hideCallback)) {
                this.hideCallback();
            }
        }.bind(this);
    },
    setAnimationIn: function() {
        "use strict";


    },


    removeOptions: function() {
        "use strict";

        this.$options.remove();
    },
    setOptions: function(options) {
        "use strict";

        this.model.set('options', options);

        //reinitialize
        this.el.innerHTML = this.template(this.model.attributes);

        this.$options = this.$el.find('div.option');
        this.initAnimations();
    },
    isCanned: function() {
        "use strict";
        return this.model.attributes.class === 'canned';
    },

    // ============================================================ //
    /* ******************** Render Functions ********************** */
    // ============================================================ //
    render: function() {
        if(this.el.innerHTML === '')
            this.el.innerHTML = this.template(this.model.attributes);

        return this;
    },


    // ============================================================ //
    /* ***************** Animation Functions ********************** */
    // ============================================================ //
    show: function() {
        this.$el.addClass('active');

        this.animationIn.play();
    },
    hide: function() {
        this.animationOut.play();
    },
    onHideComplete: function(callback) {
        this.hideCallback = callback;
    },
    onShowComplete: function(callback) {
        this.showCallback = callback;
    },


    // ============================================================ //
    /* ********************* Event Listeners ********************** */
    // ============================================================ //
    onRadioChange: function(e) {
        "use strict";

        var text = $(e.currentTarget).siblings('div.text').html();

        this.model.set({value: e.currentTarget.getAttribute('value'), text: text});
    }
});


module.exports = QuestionView;