



(function() {
    "use strict";


    var responseMap = require('../data/responseMap.json');
    var cannedQuestionData = require('../data/cannedQuestions.json');
    var personalityQuestionData = require('../data/personalityQuestions.json');

    var responseModule = require('../animations/responseModule');

    var device = require('../device');
    var isMobile = device.isMobile();

    // ============================================================ //
    /* *********** Setup Canned/Personality Orders **************** */
    // ============================================================ //
    function getOrder(options, property) {
        return _.chain(options)
            .pluck(property)
            .object(_.range(options.length))
            .value();
    }

    function getCorrectPersonalityModel(model, personalityModels) {
        var val = model.get('value');

        var personalityModel = _.filter(personalityModels, function(mod) {
            return val === mod.get('name');
        })[0];

        return personalityModel;
    }


    var cannedOrder = getOrder(cannedQuestionData.options, 'value');
    var personalityOrder = getOrder(personalityQuestionData.questions, 'name');



    // ============================================================ //
    /* ******************** Response View ************************* */
    // ============================================================ //

    function isAnswered(model) {
        return model.get('value') !== '';
    }
    
    function isTrueCanned(value) {
      return _.isUndefined(personalityOrder[value]);
    }

    function lastCharIsPunctuation(str) {
        var c = str.charAt(str.length-1);

        return c === '.' || c === ',' || c === '!';
    }

    var ResponseView = Backbone.View.extend({
        character: '',
        el: '#response',
        events: {
            'click a#printversion': 'print',
            'click #sendmore': 'onSendMore'
        },

        initialize: function() {
            this.$background = $('#response-bg');
            this.$signature = $('#card-from');
        },

        getUsername: function(nameModel) {

            return nameModel.get('value') || 'Friend';
        },

        getCannedResponses: function(cannedValues, character) {

            var response = _.chain(cannedValues)
                .sortBy(function(value) { return cannedOrder[value]; })    // sort based on cannedOrder object above
                .map(function(value) { return responseMap[character][value]; }) // grab responses for each question
                .value();       // exit chain

            return response;
        },

        getPersonalityResponses: function(personalityCannedModels, personalityModels, character) {

            var response = _.chain(personalityCannedModels)
                .sortBy(function(model) { return personalityOrder[model.get('value')]; })    // sort based on personalityOrder object above
                .map(function(model) {                                                      // grab responses for each question
                    var personalityModel = getCorrectPersonalityModel(model, personalityModels);

                    var template;
                    if(personalityModel.get('value') === 'frenchfries' || personalityModel.get('value') === 'chickennuggets') {
                        template = responseMap[character][model.get('value') + '-plural'];
                    } else {
                        template = responseMap[character][model.get('value')];
                    }

                    return template.replace('%template%', personalityModel.get('text'));
                })
                .value();       // exit chain

            return response;
        },


        setResponse: function(models) {
            var nameModel = models[0];
            var characterModel = models[1];
            var questionModels = _.rest(models, 2);

            var userName = this.getUsername(nameModel);
            var character = characterModel.get('value');
            this.character = character;


            var answeredQuestions = _.filter(questionModels, isAnswered);
            
            var cannedModels = _.filter(answeredQuestions, function(model) { return model.get('class') === 'canned'; });
            var personalityModels = _.filter(answeredQuestions, function(model) { return model.get('class') !== 'canned'; });


            var trueCannedValues;
            if(cannedModels.length === 0) {
              trueCannedValues = _.chain(cannedQuestionData.options)
                  .pluck('value')
                  .filter(isTrueCanned)
                  .value();
            } else {
              trueCannedValues = _.chain(cannedModels)
                  .map(function(model) { return model.get('value'); })
                  .filter(isTrueCanned)
                  .value();
            }


            var personalityCannedModels = _.filter(cannedModels, function(model) {return !isTrueCanned(model.get('value')); });

            
            var cannedResponses = this.getCannedResponses(trueCannedValues, character);
            var personalityResponses = this.getPersonalityResponses(personalityCannedModels, personalityModels, character);


            this.$background.addClass(character);
            this.$signature.addClass(character);



            var greeting = responseMap[character]['greeting'].replace('%template%', userName);
            var body1 = responseMap[character]['body1'];
            var body2 = responseMap[character]['body2'].replace('%template%', userName);
            var sincerely = responseMap[character].sincerely;

            if(!lastCharIsPunctuation(sincerely)) {
                sincerely += ',';
            }


            var response = body1 + ' ' + cannedResponses.join(' ') + ' ' + personalityResponses.join(' ') + ' ' + body2;


            $('#card-greeting').html(greeting);
            $('#card-body').html(response);
            $('#card-sincerely').html(sincerely);
//            $('#card-from').html(character);
        },

        show: function() {
            this.$el.show();
            this.$background.show();


            if(!isMobile) {
                setTimeout(function() {
                    responseModule.animateIn(this.character);
                }.bind(this), 400);
            } else {
                var $letterBgCtr = $('#letterbg-ctr');
                var $cardWrap = $('#card-wrap');

                var height = $cardWrap.outerHeight();

                $letterBgCtr.height(height);
                $letterBgCtr.addClass('active');

                this.setMobileContentHeight();

                this.showMobileCharacters();
            }
        },

        setMobileContentHeight: function() {
            var $sendMore = $('#sendmore');
            var $footer = $('#footer');
            var $content = $('#content');

            var offsetTop = $sendMore.offset().top;
            var height = $sendMore.height();
            var footerHeight = $footer.height();

            $content.css('min-height', offsetTop*1.04 + height + footerHeight);
        },

        showMobileCharacters: function() {
            var $mobileCtr = $('#mobile-characters');

            var $activeCharacters = $mobileCtr.find('div.character.active');

            if(this.character === 'team') {
                $activeCharacters.filter('.dusty3').removeClass('active team response');

                $mobileCtr.find('div.character.dusty2').addClass('active team response front');
            } else if (this.character === 'dusty') {
                $activeCharacters.removeClass('active team response');

                $mobileCtr.find('div.character.dusty2').addClass('active response front');
            } else {
                $activeCharacters.addClass('front');
            }

            $activeCharacters.addClass('response');
        },

        hide: function() {

        },
        
        print: function(e) {
            e.preventDefault();
            // window.print();

            var g = $('#card-greeting').html();
            var b = $('#card-body').html();
            var s = $('#card-sincerely').html();
//            var f = $('#card-from').html();
            window.open(window.location.href + 'print.php' + '?char=' + this.character + '&greeting='+ g + '&body=' + b + '&sincerely=' + s + '&from=' + this.character);
            
        },
        onSendMore: function(e) {
            e.preventDefault();

            var url = e.currentTarget.getAttribute('href');
            var newTab = (2 === e.which || e.metaKey || e.ctrlKey);

            ga('send', 'event', 'More airmail', 'click', ipAddress, {
                hitCallback: function() {
                    document.location = url;
                }
            });
        }
    });













    module.exports = ResponseView;
})();