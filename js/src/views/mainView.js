
(function() {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~ Helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~
    var loader = require('../loader');
    var device = require('../device');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~ PIXI Scene ~~~~~~~~~~~~~~~~~~~~~~~~
    var MainScene = require('../pixi/mainScene');
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

    var isMobile = device.isMobile();

    if(!isMobile) {
        var introModule = require('../animations/intro');
    }


    // =================================================================== //
    /* ************************* Mainview Class ************************** */
    // =================================================================== //

    function getValues(views) {
        return _.map(views, function(view) {return view.model.attributes.value; });
    }

    var MainView = Backbone.View.extend({
        animating: false,
        pages: [],
        activePageIndex: 0,
        el: '#content',
        events: {
            'click a.next': 'onNext',
            'click a.finish-send': 'onFinish',
            'click a.skip': 'onSkip',
            'mousemove': 'onMouseMove'
        },

        onAssetProgress: function(percentageLoaded, timeElapsed) {
            introModule.updateLoader(percentageLoaded, timeElapsed);
        },
        onAssetsLoaded: function() {
            this.scene = scenesManager.createScene('main', MainScene);
            scenesManager.goToScene('main');

            scenesManager.onWindowResize();

            introModule.onComplete(this.introView.showBeginScreen.bind(this.introView));
            introModule.assetsLoaded();
        },

        // ==================================================================== //
        /* ************************ Initialization Stuff ********************** */
        // ==================================================================== //
        initialize: function() {
            if(!_.isUndefined(introModule))
                introModule.initialize();

            if(isMobile) {
                this.$el.addClass('mobile');
            }

            $('#assetLoader').remove();

            this.initJqueryVariables();

            if(!isMobile) {
                //create canvas element
                scenesManager.initialize(this.$window.width(), this.$window.height(), this.$el);
            }

            // create views
            this.initIntroView();
            this.initPages();

            this.footer = new FooterView({numDots: this.pages.length});
            this.responseView = new ResponseView();

            this.initWindowEvents();

            //setup options for first canned view
            this.cannedViews = _.filter(this.pages, function(page) {
                return page.model.attributes.class === 'canned';
            });

            this.hideContent();
        },

        initWindowEvents: function() {
            this.$window.on('resize', _.bind(this.repositionPageNav, this));

//            if (window.DeviceOrientationEvent) {
//                console.log('deviceorientation');
//
//                window.addEventListener("deviceorientation", function(event) {
//                    console.log('orientation', event.beta, event.gamma);
//                }, true);
//            } else if (window.DeviceMotionEvent) {
//                console.log('devicemotion');
//
//                window.addEventListener('devicemotion', function(event) {
//                    console.log('motion', event.acceleration.x * 2, event.acceleration.y * 2);
//                }, true);
//            } else {
//                console.log('moz orientation');
//
//                window.addEventListener("MozOrientation", function(orientation) {
//                    console.log('moz', orientation.x * 50, orientation.y * 50);
//                }, true);
//            }
        },

        initIntroView: function() {
            var introView = new IntroView();

            introView.setMainView(this);
            introView.onComplete(_.bind(this.showFirstPage, this));

            this.introView = introView;
        },

        initPages: function() {
            var charModel = _.first(allQuestions.models);
            var questionModels = _.rest(allQuestions.models);

            var enterNameView = new EnterNameView();
            var selectCharView = new SelectCharacterView({model: charModel, parent: this.$pagesContainer});

            var questionViews = _.map(questionModels, function(questionModel) {
                return new QuestionView({model: questionModel, parent: this.$pagesContainer});
            }, this);

            this.cannedViews = _.filter(questionViews, function(questionView) {
                return questionView.isCanned();
            });
            this.selectCharacterView = selectCharView;

            console.log(this.cannedViews);

            this.pages = [enterNameView, selectCharView].concat(questionViews);
        },
        initJqueryVariables: function() {
            this.$window = $(window);

            this.$pagesContainer = this.$el.find('div.pages-ctn');

            this.$pageNav = this.$pagesContainer.find('div.page-nav');
            this.$next = this.$pageNav.find('a.next');
            this.$finishSend = this.$pageNav.find('a.finish-send');

            this.$skip = this.$pageNav.find('a.skip');

            this.$header = $('#header');
        },

        // ==================================================================== //
        /* ******************** Canned Question View Stuff ******************** */
        // ==================================================================== //
        updateViewOptionsWithUnused: function(cannedView) {
            var usedOptions = _.compact(getValues(this.cannedViews));

            var options = allQuestions.getUnusedCannedOptions(3, usedOptions);

            cannedView.setOptions(options);
        },
        // ==================================================================== //
        /* *********************** Change View Functions ********************** */
        // ==================================================================== //
        showFirstPage: function() {
            this.pages[0].show();

            this.$pageNav.css('opacity', 0);
            this.$next.addClass('active');
            this.$skip.addClass('active');

            this.repositionPageNav(false);

            TweenLite.to(this.$pageNav, 0.3, {opacity: 1});
        },

        nextPage: function() {
            this.animating = true;
            //hide active page
            var activePage = this.pages[this.activePageIndex];
            var nextPage = this.pages[this.activePageIndex + 1];

            if(nextPage.isCanned()) {
                this.updateViewOptionsWithUnused(nextPage);

                if(!activePage.isCanned()) {
                    this.showSkip();
                }
            } else {
                this.hideSkip();
            }

            //active page is character select
            if(this.activePageIndex === 1) {
                this.updateCannedCopy();

                if(!isMobile) {
                    //animate in character
                    this.scene.animateInUserCharacter();
                }
            }

            activePage.onHideComplete(this.showPageAfterHide.bind(this));

            this.activePageIndex++;
            activePage.hide();
            this.repositionPageNav(true);

            this.footer.setCounter(this.activePageIndex);
        },
        showPageAfterHide: function() {
            var lastPage = this.pages[this.activePageIndex-1];
            if(lastPage.isCanned()) {
                lastPage.removeOptions();   //canned options are repeated and share the same ID
            }

            //show next page
            var nextPage = this.pages[this.activePageIndex];

            nextPage.onShowComplete(function() {
                this.animating = false;
            }.bind(this));
            nextPage.show();

            if(this.activePageIndex === this.pages.length-1) {
                this.showFinishBtn();
                this.hideSkip();
            }
        },
        showFinishBtn: function() {
            this.$next.hide();
            this.$finishSend.addClass('active');
        },

        finishAndSend: function() {
            this.$pagesContainer.hide();
            this.footer.hideCounter();

            var pageModels = _.map(this.pages, function(page) {
                return page.model;
            });
            this.responseView.setResponse(pageModels);

            if(!isMobile) {
                this.scene.onUserCharacterOut(_.bind(this.scene.playWipescreen, this.scene));

                var me = this;
                this.scene.onWipescreenComplete(function() {
                    me.responseView.show();
                    me.scene.showResponse();
                });

                this.scene.animateOutUserCharacter();
            } else {
                $('#mobile-backgrounds').hide();

                this.responseView.show();
            }
        },
        repositionPageNav: function(animate) {
            var activePage = this.pages[this.activePageIndex];

            var pixelPosition = (activePage.$el.offset().top + activePage.$el.outerHeight());

            var windowHeight = this.$window.height();

            var topFrac = Math.min(pixelPosition/windowHeight, (windowHeight - this.footer.height() - this.$pageNav.outerHeight())/windowHeight);

            var percTop = 100 * topFrac + '%';

            if(!!animate) {
                TweenLite.to(this.$pageNav, 0.2, {top: percTop, ease:'Quad.easeInOut'});
                return;
            }
            this.$pageNav.css('top', percTop);
        },


        hideSkip: function() {
            TweenLite.to(this.$skip, 0.2, {bottom: '100%', opacity: 0});
        },
        showSkip: function() {
            TweenLite.to(this.$skip, 0.2, {bottom: 0, opacity: 1});
        },

        showContent: function() {
            this.$pagesContainer.show();
            this.footer.show();
            this.$header.show();
        },
        hideContent: function() {
            this.$pagesContainer.hide();
            this.$header.hide();
            this.footer.hide();
        },
        updateCannedCopy: function() {
            var character = this.selectCharacterView.getSelectedCharacter();

            _.each(this.cannedViews, function(view) {
                view.setCharacter(character.text);
            });
        },
        // ==================================================================== //
        /* ************************* Render Functions ************************* */
        // ==================================================================== //
        start: function() {
            if(!device.isMobile()) {
                loader.start(this);
            } else {
                this.introView.showBeginScreen();
            }
        },

        // ==================================================================== //
        /* ************************* Event Listeners ************************** */
        // ==================================================================== //
        onNext: function(e) {
            e.preventDefault();

            if(this.animating
                || this.pages[this.activePageIndex].model.attributes.value === ''
                || this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        },
        onFinish: function(e) {
            e.preventDefault();

            if(this.animating) return;

            this.finishAndSend();
        },
        onMouseMove: function(e) {
            e.preventDefault();

            if(_.isUndefined(this.scene)) return;

            this.scene.shiftBackgroundLayers(e.pageX/this.$window.width());
        },
        onSkip: function(e) {
            e.preventDefault();

            if(this.animating || this.activePageIndex >= (this.pages.length - 1)) return;

            this.nextPage();
        }
    });









    module.exports = MainView;



})();