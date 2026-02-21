//Alekzander Matthews, Gravity Flip, 6 hrs
/*
[X]Use multiple Scene classes (dictated by your game's style) (1)
[X]Properly transition between Scenes and allow the player to restart w/out having to reload the page (1)
[X]Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1)
[X]Have some form of player input/control appropriate to your game design (1)
[X]Include one or more animated characters that use a texture atlas/sprite sheet* (1) [the health bar]
[X]Simulate scrolling with a tileSprite (or equivalent means) (1)
[X]Implement proper collision detection (via Arcade Physics or a custom routine) (1)
[X]Have looping background music* (1)
[X]Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1)
[X]Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1)
[X]Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
[X]Be theoretically endless (1)
[X]Be playable for at least 15 seconds for a new player of low to moderate skill (1)
[X]Run without significant crashes or errors (1)
[X]Include in-game credits for all roles, assets, music, etc. (1)

*/













//create game object
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: false,
        roundPixels: false
    },
    width: 640,
    height: 480,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [Menu, Play, Lost]
}

let game = new Phaser.Game(config)

let { width, height } = game.config

let uiHeight = height / 10

