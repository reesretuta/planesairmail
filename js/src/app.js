



// adds our custom modifications to the PIXI library
require('./pixi/libModifications');



var MainView = require('./views/mainView');
var AssetLoadingView = require('./views/assetLoadingView');


// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};





// after assets loaded & jquery loaded
app.render = _.after(2, function() {
    app.mainView = new MainView();

    app.mainView.start();
});





// =================================================================== //
/* ************************** Asset Loading ************************** */
// =================================================================== //

app.assetLoader = new AssetLoadingView({onComplete: app.render});


$(app.render);


//TODO: Delete!!
//$(function() {
//    "use strict";
//
//    var password = 'disneyPlanesTwo';
//    var $passwordScreen = $('#passwordScreen');
//
//    var $passwordInput = $passwordScreen.find('input[type=password]');
//
//
//    $passwordScreen.find('form').submit(function(e) {
//        e.preventDefault();
//
//        if($passwordInput.val() === password) {
//            $passwordScreen.fadeOut(50);
//
//            app.assetLoader = new AssetLoadingView({onComplete: app.render});
//        }
//    });
//});


module.exports = app;



