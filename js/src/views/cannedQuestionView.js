


var itemAnimationsModule = require('../animations/pageItems');

var device = require('../device');
var isMobile = device.isMobile();


var QuestionView = require('./questionView');


var CannedQuestionView = QuestionView.extend({
    getAnimations: function() {
        "use strict";

        return itemAnimationsModule.getRandomCannedAnimations(this.$options);
    },
    isCanned: function() {
        "use strict";

        return true;
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

        if(!isMobile)
            this.initAnimations();
    },

    setCharacter: function(character) {
        "use strict";

        var copy = this.model.get('copy').replace('%character%', character);

        this.model.set('copy', copy);
        this.$copy.html(copy);
    }


});





module.exports = CannedQuestionView;