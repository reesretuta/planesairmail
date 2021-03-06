


var template = require('../templates/question.hbs');
var itemAnimationsModule = require('../animations/pageItems');

var device = require('../device');
var isMobile = device.isMobile();

var QuestionView = Backbone.View.extend({
    // Variables
    showCallback: function(){},
    hideCallback: function(){},
    className: 'question page',
    template: template,

    events: {
        'click label': 'onRadioChange',
        'touchend label': 'onRadioChange'
    },
    // Functions
    initialize: function(options) {
        this.render();

        options.parent.append(this.el);

        this.$el.addClass(this.model.attributes.class);

        this.$copy = this.$el.find('div.copy');
        this.$options = this.$el.find('div.option');
        this.$inputs = this.$el.find('input[type=radio]');

        if(this.$options.length !== 0 && !isMobile)
            this.initAnimations();
    },
    getAnimations: function() {
        "use strict";

        return itemAnimationsModule.getRandomPersonalityAnimations(this.$options);
    },
    initAnimations: function() {
        "use strict";

        var animations = this.getAnimations();

        this.animationIn = animations[0];
        this.animationOut = animations[1];

        this.animationIn.vars.onComplete = function() {
            this.showCallback();
        }.bind(this);

        this.animationOut.vars.onComplete = function() {
            this.$el.removeClass('active');

            this.hideCallback();
        }.bind(this);
    },

    isCanned: function() {
        return false;
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

        if(!isMobile) {
            this.animationIn.play();
        } else {
            this.showCallback();
        }
    },
    hide: function() {
        if(!isMobile) {
            this.animationOut.play();
        } else {
            this.$el.removeClass('active');

            this.hideCallback();
        }

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
        e.preventDefault();

        var $activeInput = this.$inputs.filter('[checked]');
        var $input = $(e.currentTarget).siblings('input');

        if($activeInput !== $input) {
            $activeInput.prop('checked', false);
            $input.prop('checked', true);
        }

        var text = $input.siblings('div.text').html();

        this.model.set({value: $input.attr('value'), text: text});
    }
});


module.exports = QuestionView;