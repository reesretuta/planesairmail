



var MainView = require('./views/mainView');



// =================================================================== //
/* ******************************* App ******************************* */
// =================================================================== //

var app = {};


app.render = _.after(2, function() {
    "use strict";

    console.log('render');

    app.MainView = new MainView();


    app.MainView.render();
});






// =================================================================== //
/* ************************** Asset Loading ************************** */
// =================================================================== //


// create an array of assets to load
var assetsToLoader = ['./assets/spritesheets/dusty.json'];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = app.render;

//begin load
loader.load();















module.exports = app;


