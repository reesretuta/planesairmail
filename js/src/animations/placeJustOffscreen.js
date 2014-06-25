
module.exports = function(character) {
    var height = character.scale.y * character.getLocalBounds().height;

    character.windowY = -(height/2)/$(window).height();
};