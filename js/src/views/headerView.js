




var HeaderView = Backbone.View.extend({
    el: '#header',
    events: {
        'click a.showtimes': 'onShowtimesClick',
        'click a.trailer': 'onTrailerClick'
    },
    initialize: function() {
        "use strict";

    },

    onShowtimesClick: function(e) {
        "use strict";
        e.preventDefault();

        var url = e.currentTarget.getAttribute('href');

        ga('send', 'event', 'Find Showtimes', 'click', ipAddress, {
            hitCallback: function() {
                document.location = url;
            }
        });

    },
    onTrailerClick: function(e) {
        "use strict";
        e.preventDefault();

        var url = e.currentTarget.getAttribute('href');

        ga('send', 'event', 'View Trailer', 'click', ipAddress, {
            hitCallback: function() {
                document.location = url;
            }
        });
    }



});




module.exports = HeaderView;