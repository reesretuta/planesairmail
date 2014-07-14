

function openInNewTab(url) {
    var win = window.open(url, '_blank');
}


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
        var newTab = (2 === e.which || e.metaKey || e.ctrlKey);

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
        var newTab = (2 === e.which || e.metaKey || e.ctrlKey);

        ga('send', 'event', 'View Trailer', 'click', ipAddress, {
            hitCallback: function() {

                document.location = url;
            }
        });
    }



});




module.exports = HeaderView;