




var HeaderView = Backbone.View.extend({
    el: '#header',
    events: {
        'click a.showtimes': 'onShowtimesClick',
        'click a.trailer': 'onTrailerClick'
    },
    initialize: function() {
        "use strict";

    },

    onShowtimesClick: function() {
        "use strict";

        console.log('showtimes');
    },
    onTrailerClick: function() {
        "use strict";

        console.log('trailer');
    }



});




module.exports = HeaderView;