

var NameView = (function() {
    "use strict";


    var template = require('../templates/name.hbs');
    var scenesManager = require('../pixi/scenesManager');


    function getFileNames(fileStart, numDigits, ext) {

        return _.map(_.range(15), function(num) {
//            var numZeros = numDigits - num.toString().length;
//            var zeros = new Array(numZeros + 1).join('0');
//
//            return fileStart + zeros + num + '.' + ext;
            return num;
        });

    }


    function getTextures() {

        return _.map(getFileNames('Comp 2_', 5, 'png'), function(fileName) {
            return PIXI.Texture.fromFrame(fileName);
        });

    }











    return Backbone.View.extend({
        className: 'name page',
        template: template,

        initialize: function (options) {


            options.parent.append(this.render().el);


            console.log(PIXI.TextureCache);

            this.initScene();

        },
        initScene: function () {
            this.scene = scenesManager.createScene('enter-name');

            var textures = getTextures();

            var dustyNoBlink = new PIXI.MovieClip(textures);

            dustyNoBlink.position.x = 800;
            dustyNoBlink.position.y = 800;

            dustyNoBlink.anchor.x = 0.5;
            dustyNoBlink.anchor.y = 0.5;

            dustyNoBlink.gotoAndStop(0);

            this.scene.addChild(dustyNoBlink);

            this.scene.onUpdate(function() {
                if(!dustyNoBlink.playing) {
                    dustyNoBlink.play();
                }
            });
        },

        // ============================================================ //
        /* ******************** Render Functions ********************** */
        // ============================================================ //
        render: function () {
            if (this.el.innerHTML === '')
                this.el.innerHTML = this.template();

            return this;
        },
        show: function () {

            this.$el.addClass('active');

            scenesManager.goToScene('enter-name');
        },
        hide: function () {

        }
    });
})();


module.exports = NameView;
