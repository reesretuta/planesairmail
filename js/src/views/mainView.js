
var scenesManager = require('../pixi/scenesManager');
// ~~~~~~~~~~~~~~~~~~~~~~~~ Collections ~~~~~~~~~~~~~~~~~~~~~~~~
var allQuestions = require('../collections/allQuestions');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Views ~~~~~~~~~~~~~~~~~~~~~~~~~~~
var IntroView = require('./introView');
var NameView = require('./nameView');
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
        //scenesManager.create($(window).width(), $(window).height(), this.$el);

        // create views
        this.introView = new IntroView({parent: this.$el});
        this.initPages();
    },

    initPages: function() {
        "use strict";

        this.pages.push(new NameView({parent: this.$pagesContainer}));

        this.pages = this.pages.concat(_.map(allQuestions.models, function(questionModel) {
            return new QuestionView({model: questionModel, parent: this.$pagesContainer});
        }, this));
    },
    initJqueryVariables: function() {
        "use strict";

        this.$pagesContainer = this.$el.find('div.pages-ctn');
    },

    // ==================================================================== //
    /* ************************* Render Functions ************************* */
    // ==================================================================== //
    render: function() {
//
//        this.addPagesToDom();

        this.pages[this.activePageIndex].show();



        var self = this;
        setTimeout(function() {
            "use strict";

            self.introView.hide();

        }, 200);
    },
    addPagesToDom: function() {
        "use strict";
        var elements = _.map(this.pages, function(view) {
            return view.render().el;
        });


        this.$pagesContainer[0].innerHTML = _.reduce(elements, function(html, el) {
            return html + el.outerHTML;
        }, '');


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