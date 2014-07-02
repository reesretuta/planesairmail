

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
    loader.onComplete = function() {

        TweenLite.to(this.$bar, 0.4, {
            width: '100%',
            ease: 'Linear.easeNone',
            onComplete: function() {
                view.assetsLoaded();
            }
        });
    };

    loader.load();
}


// ============================================================ //
/* *************************** View *************************** */
// ============================================================ //

var count = 0;
var AssetLoadingView = Backbone.View.extend({
    el: '#assetLoader',
    initialize: function(options) {
        this.$bar = this.$el.find('> .bar');
        this.$text = this.$bar.find('.text');
        this.$text.html('0.00%');

        this.onCompleteCallback = options.onComplete || function(){};

        startLoader(this);
    },
    update: function(loadCount) {
        var percentage = Math.round(10000 * (totalFiles-loadCount)/totalFiles)/100;

        TweenLite.to(this.$bar, 0.5, {
            width: percentage + '%',
            ease: 'Linear.easeNone'
        });

        this.$text.html(percentage + '%');
    },
    assetsLoaded: function() {
        this.onCompleteCallback();

        this.$bar.hide();
        var $el = this.$el;
        TweenLite.to($el, 1.2, {
            opacity: 0,
            onComplete: function() {
                $el.hide();
            }
        });
    }
});






module.exports = AssetLoadingView;