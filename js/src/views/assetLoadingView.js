

"use strict";


var assetData = require('../data/assets.json');

var fileNames = Object.keys(assetData.assets);
var totalFiles = fileNames.length;




// ============================================================ //
/* ************************** Loader ************************** */
// ============================================================ //

var loader = new PIXI.AssetLoader(fileNames);

function startLoader(view) {
    loader.onProgress = function() {
        view.update(this.loadCount);
    };
    loader.onComplete = _.bind(view.assetsLoaded, view);

    loader.load();
}


// ============================================================ //
/* *************************** View *************************** */
// ============================================================ //

var AssetLoadingView = Backbone.View.extend({
    el: '#assetLoader',
    initialize: function(options) {
        this.$text = this.$el.find('> .text');
        this.$text.html('0.00%');

        this.onCompleteCallback = options.onComplete || function(){};

        startLoader(this);
    },
    update: function(loadCount) {
        var percentage = Math.round(10000 * (totalFiles-loadCount)/totalFiles)/100;

        this.$text.html(percentage + '%');
    },
    assetsLoaded: function() {
        this.onCompleteCallback();

        this.$text.hide();
        var $el = this.$el;
        TweenLite.to($el, 1.4, {
            opacity: 0,
            onComplete: function() {
                $el.hide();
            }
        });
    }
});






module.exports = AssetLoadingView;