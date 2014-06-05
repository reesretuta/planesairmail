
var scenesManager = require('../pixi/scenesManager');
// ~~~~~~~~~~~~~~~~~~~~~~~~ Collections ~~~~~~~~~~~~~~~~~~~~~~~~
var allQuestions = require('../collections/allQuestions');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Views ~~~~~~~~~~~~~~~~~~~~~~~~~~~
var IntroView = require('./introView');
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
        scenesManager.create(760, 430, this.$el);

        // create views
        this.introView = new IntroView();
        this.initPages();
    },

    initPages: function() {
        "use strict";

        _.forEach(allQuestions.models, function(questionModel) {
            var view = new QuestionView({model: questionModel});

            this.pages.push(view);
        }, this);

    },
    initJqueryVariables: function() {
        "use strict";

        this.$pagesContainer = this.$el.find('div.pages-ctn');
    },

    // ==================================================================== //
    /* ************************* Render Functions ************************* */
    // ==================================================================== //
    render: function() {
        this.$el.prepend(this.introView.render().el);

        this.addPagesToDom();


        //this.pages[this.activePageIndex].show();

//        var self = this;
//        setTimeout(function() {
//            "use strict";
//            self.introView.hide();
//
//        }, 2000);
    },
    addPagesToDom: function() {
        "use strict";

        _.forEach(this.pages, function(view) {
            this.$pagesContainer.append(view.render().el);
        }, this);
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