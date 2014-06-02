



var MainView = require('./views/mainView');



// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};


app.MainView = new MainView();



app.render = function() {
    "use strict";

    this.MainView.render();
};


module.exports = app;


