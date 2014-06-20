
(function() {
    "use strict";


    var scenesManager = require('../pixi/scenesManager');

    // ~~~~~~~~~~~~~~~~~~~~~~~~ Collections ~~~~~~~~~~~~~~~~~~~~~~~~
    var allQuestions = require('../collections/allQuestions');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Views ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var IntroView = require('./introView');
    var EnterNameView = require('./enterNameView');
    var QuestionView = require('./questionView');
    var SelectCharacterView = require('./selectCharacterView');


    var MainView = Backbone.View.extend({
        el: '#content',
        events: {
            'click a.next': 'onNext',
            'click a.volume': 'onVolumeToggle',
            'mousemove': 'onMouseMove'
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function() {
            this.pages = [];
            this.activePageIndex = 0;
            this.volumeOn = true;

            this.initJqueryVariables();

            //create canvas element
            scenesManager.initialize($(window).width(), $(window).height(), this.$el);

            this.initVolumeAnimationTimelines();

            // create views
//            this.initIntroView();
            this.initPages();

            this.initCounter();
        },

        initIntroView: function() {
            var introView = new IntroView({parent: this.$el});

            introView.onComplete(_.bind(this.showFirstPage, this));


            this.introView = introView;
        },

        initPages: function() {

            var charModel = _.first(allQuestions.models);
            var questionModels = _.rest(allQuestions.models);

            var enterNameView = new EnterNameView({parent: this.$pagesContainer});
            var selectCharView = new SelectCharacterView({model: charModel, parent: this.$pagesContainer});

            var questionViews = _.map(questionModels, function(questionModel) {
                return new QuestionView({model: questionModel, parent: this.$pagesContainer});
            }, this);


            this.pages = [enterNameView, selectCharView].concat(questionViews);
        },
        initJqueryVariables: function() {
            this.$window = $(window);

            this.$pagesContainer = this.$el.find('div.pages-ctn');

            this.$volumeSvgPaths = this.$el.find('a.volume path');

            var $backgrounds = this.$el.find('div.backgrounds div.background');
            this.$background = $backgrounds.filter('.back');
            this.$middleground = $backgrounds.filter('.middle');
            this.$foreground = $backgrounds.filter('.front');

            this.$counter = this.$el.find('div.page-nav div.counter');
        },
        initVolumeAnimationTimelines: function() {
            this.volumeOnAnimation = this.getTimelineVolumeOn();
            this.volumeOffAnimation = this.getTimelineVolumeOff();
        },
        initCounter: function() {
            var numItems = this.pages.length + 1;
        },

        // ==================================================================== //
        /* *********************** Change View Functions ********************** */
        // ==================================================================== //
        showFirstPage: function() {
            this.pages[0].show();
        },

        nextPage: function() {
            //hide active page
            var activePage = this.pages[this.activePageIndex];
            activePage.hide();

            //show next page
            this.activePageIndex++;
            var nextPage = this.pages[this.activePageIndex];
            nextPage.show();
        },

        // ==================================================================== //
        /* ******************* Volume Animation Functions ********************* */
        // ==================================================================== //
        toggleVolume: function() {
            this.volumeOn = !this.volumeOn;

            if(this.volumeOn) {
                this.volumeOnAnimation.play(0);
            } else {
                this.volumeOffAnimation.play(0);
            }
        },

        getTimelineVolumeOn: function() {
            var timeline = new TimelineMax({
                paused: true
            });

            var options = {startMatrix: [0,0,0,0,22,32], endMatrix: [1,0,0,1,0,0], easing: 'Back.easeOut', opacity: 1};

            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(0), 0.5, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(1), 0.25, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(2), 0, options);

            return timeline;
        },
        getTimelineVolumeOff: function() {
            var timeline = new TimelineMax({
                paused: true
            });

            var options = {startMatrix: [1,0,0,1,0,0], endMatrix: [0,0,0,0,22,32], easing: 'Back.easeIn', opacity: 0};

            //default on
            this.$volumeSvgPaths.attr('transform', 'matrix(1,0,0,1,0,0)');
            this.$volumeSvgPaths.css('opacity', 1);

            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(0), 0, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(1), 0.25, options);
            this.addSvgPathAnimation(timeline, this.$volumeSvgPaths.eq(2), 0.5, options);

            return timeline;
        },
        addSvgPathAnimation: function(timeline, $path, startTime, options) {
            var animationSpeed = 0.2;

            var pathMatrix = _.clone(options.startMatrix);

            var tweenAttrs = {
                ease: options.easing,
                onUpdate: function() {
                    $path.attr('transform', 'matrix(' + pathMatrix.join(',') + ')');
                }
            };

            _.extend(tweenAttrs, options.endMatrix);

            timeline.add(TweenLite.to($path, animationSpeed, {opacity: options.opacity}), animationSpeed * startTime);
            timeline.add(TweenLite.to(pathMatrix, animationSpeed, tweenAttrs), animationSpeed * startTime);
        },

        // ==================================================================== //
        /* ************************* Render Functions ************************* */
        // ==================================================================== //
        start: function() {
            var introView = this.introView;

//            setTimeout(function() {
//                introView.start(); //start intro
//            }, 200);
            this.showFirstPage();
        },
        // ==================================================================== //
        /* **************************** Counter Stuff ************************* */
        // ==================================================================== //


        // ==================================================================== //
        /* *************************** Parallax Stuff ************************* */
        // ==================================================================== //
        shiftBackgroundLayers: function(x, y) {

            var backgroundRatio = 1;
            var middlegroundRatio = 1.8;
            var foregroundRatio = 2.5;

            var backgroundLeft = -(x - 0.5) * backgroundRatio + '%';
            var middlegroundLeft = -(x - 0.5) * middlegroundRatio + '%';
            var foregroundLeft = -(x - 0.5) * foregroundRatio + '%';

            this.$background.css('left', backgroundLeft);
            this.$middleground.css('left', middlegroundLeft);
            this.$foreground.css('left', foregroundLeft);
        },

        // ==================================================================== //
        /* ************************* Event Listeners ************************** */
        // ==================================================================== //
        onNext: function(e) {
            e.preventDefault();

            if(this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        },
        onVolumeToggle: function(e) {
            e.preventDefault();

            this.toggleVolume();
        },
        onMouseMove: function(e) {
            e.preventDefault();

            this.shiftBackgroundLayers(e.pageX/this.$window.width(), e.pageY/this.$window.height());
        }
    });






    module.exports = MainView;



})();