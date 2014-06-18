


// adds our custom modifications to the PIXI library
require('./pixi/libModifications');


var MainView = require('./views/mainView');



// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};


// after assets loaded & jquery loaded
app.render = _.after(2, function() {
    "use strict";


    app.MainView = new MainView();


    app.MainView.render();
});






// =================================================================== //
/* ************************** Asset Loading ************************** */
// =================================================================== //


// create an array of assets to load
var assetsToLoader = ['./assets/spritesheets/dusty_idle.json', './assets/spritesheets/dusty_blink.json'];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = app.render;

//begin load
loader.load();















module.exports = app;


