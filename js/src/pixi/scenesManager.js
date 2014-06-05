
var Scene = require('./scene');

var ScenesManager = {
    scenes: {},
    currentScene: null,
    renderer: null,

    create: function(width, height, $parentDiv) {
        "use strict";
        if(ScenesManager.renderer) return this;

        ScenesManager.renderer = PIXI.autoDetectRenderer(width, height, null, true, true);

        ScenesManager.renderer.view.setAttribute('id', 'pixi-view');
        $parentDiv.append(ScenesManager.renderer.view);
        requestAnimFrame(ScenesManager.loop);

        return this;
    },
    loop: function() {
        "use strict";
        requestAnimFrame(function () { ScenesManager.loop() });

        if (!ScenesManager.currentScene || ScenesManager.currentScene.isPaused()) return;

        ScenesManager.currentScene.update();
        ScenesManager.renderer.render(ScenesManager.currentScene);
    },
    createScene: function(id) {
        "use strict";

        if (ScenesManager.scenes[id]) return undefined;

        var scene = new Scene();
        ScenesManager.scenes[id] = scene;

        return scene;
    },
    goToScene: function(id) {
        "use strict";
        if (ScenesManager.scenes[id]) {
            if (ScenesManager.currentScene) ScenesManager.currentScene.pause();

            ScenesManager.currentScene = ScenesManager.scenes[id];
            ScenesManager.currentScene.resume();
            return true;
        }
        return false;
    }

};







module.exports = ScenesManager;