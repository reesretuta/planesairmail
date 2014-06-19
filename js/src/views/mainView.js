
(function() {
    "use strict";


    var scenesManager = require('../pixi/scenesManager');
// ~~~~~~~~~~~~~~~~~~~~~~~~ Collections ~~~~~~~~~~~~~~~~~~~~~~~~
    var allQuestions = require('../collections/allQuestions');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Views ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var IntroView = require('./introView');
    var EnterNameView = require('./enterNameView');
    var QuestionView = require('./questionView');



    var MainView = Backbone.View.extend({
        el: '#content',
        events: {
            'click a.next': 'onNext'
        },
        initialize: function() {
            this.pages = [];
            this.activePageIndex = 0;

            this.initJqueryVariables();

            //create canvas element
            scenesManager.initialize($(window).width(), $(window).height(), this.$el);

            // create views
//            this.initIntroView();
            this.initPages();
        },

        initIntroView: function() {
            var introView = new IntroView({parent: this.$el});

            introView.onComplete(_.bind(this.showFirstPage, this));


            this.introView = introView;
        },

        initPages: function() {
            this.pages.push(new EnterNameView({parent: this.$pagesContainer}));

            this.pages = this.pages.concat(_.map(allQuestions.models, function(questionModel) {
                return new QuestionView({model: questionModel, parent: this.$pagesContainer});
            }, this));

        },
        initJqueryVariables: function() {
            this.$pagesContainer = this.$el.find('div.pages-ctn');
        },

        // ==================================================================== //
        /* *********************** Change View Functions ********************** */
        // ==================================================================== //
        showFirstPage: function() {
            this.pages[0].show();
        },
        nextPage: function() {

        },

        // ==================================================================== //
        /* ************************* Render Functions ************************* */
        // ==================================================================== //
        render: function() {
//            var introView = this.introView;
//
//            setTimeout(function() {
//                introView.start(); //start intro
//            }, 200);
            this.showFirstPage();
        },

        // ==================================================================== //
        /* ************************* Event Listeners ************************** */
        // ==================================================================== //
        onNext: function(e) {
            "use strict";
            e.preventDefault();

            if(this.activePageIndex >= (this.pages.length - 1)) return;

            //hide active page
            var activePage = this.pages[this.activePageIndex];
            activePage.hide();

            //show next page
            this.activePageIndex++;
            var nextPage = this.pages[this.activePageIndex];
            nextPage.show();
        }
    });






    module.exports = MainView;



})();