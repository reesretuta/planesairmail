
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
    var ResponseView = require('./responseView');
    var FooterView = require('./footerView');


    var MainView = Backbone.View.extend({
        el: '#content',
        events: {
            'click a.next': 'onNext',
            'click a.finish-send': 'onFinish',
            'mousemove': 'onMouseMove'
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function() {
            this.pages = [];
            this.activePageIndex = 0;

            this.initJqueryVariables();

            //create canvas element
            scenesManager.initialize($(window).width(), $(window).height(), this.$el);

            // create views
//            this.initIntroView();
            this.initPages();

            this.footer = new FooterView({numDots: this.pages.length});
            this.responseView = new ResponseView();
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

            var $backgrounds = this.$el.find('div.backgrounds div.background');
            this.$backgroundCtr = $backgrounds;
            this.$background = $backgrounds.filter('.back');
            this.$middleground = $backgrounds.filter('.middle');
            this.$foreground = $backgrounds.filter('.front');

            this.$next = this.$pagesContainer.find('div.page-nav a.next');
            this.$finishSend = this.$pagesContainer.find('div.page-nav a.finish-send');
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

            this.activePageIndex++;

            //show next page
            var nextPage = this.pages[this.activePageIndex];
            nextPage.show();

            this.footer.setCounter(this.activePageIndex);

            if(this.activePageIndex === this.pages.length-1) {
                this.showFinishBtn();
            }
        },
        showFinishBtn: function() {
            this.$next.hide();
            this.$finishSend.addClass('active');
        },

        finishAndSend: function() {
            this.footer.hideCounter();

            this.$backgroundCtr.hide();
            this.$pagesContainer.hide();

            var pageModels = _.map(this.pages, function(page) {
                return page.model;
            });

            this.responseView.setResponse(pageModels);

            this.responseView.show();
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
        /* *************************** Parallax Stuff ************************* */
        // ==================================================================== //
        shiftBackgroundLayers: function(x, y) {

            var backgroundRatio = 0.75;
            var middlegroundRatio = 1.5;
            var foregroundRatio = 3;

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
        onFinish: function(e) {
            e.preventDefault();

            this.finishAndSend();
        },
        onMouseMove: function(e) {
            e.preventDefault();

            this.shiftBackgroundLayers(e.pageX/this.$window.width(), e.pageY/this.$window.height());
        }
    });






    module.exports = MainView;



})();