class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        //load all images
        this.load.image('playerImg', './assets/player.png')
        this.load.image('background', './assets/background.png')
        this.load.image('background1', './assets/background1.png')
        this.load.image('background2', './assets/background2.png')
        this.load.image('background3', './assets/background3.png')
        this.load.image('astroid1', './assets/astroid1.png')
        this.load.image('star1', './assets/shootingStar.png')
        this.load.image('star2', './assets/shootingStar2.png')
        this.load.image('star3', './assets/shootingStar3.png')
        
        //load all spritesheets
        this.load.spritesheet('healthBar', './assets/healthBar.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        //load all audio
        this.load.audio('playMusic', './assets/audio/Surf Rock Light Loop.wav')
        this.load.audio('flipsfx', './assets/audio/flip.wav')
        this.load.audio('astroidHit', './assets/audio/astroidHit.wav')
        this.load.audio('starAsfx', './assets/audio/starA.wav')
        this.load.audio('starBsfx', './assets/audio/starB.wav')
        this.load.audio('starCsfx', './assets/audio/starC.wav')

        //keyboard
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
        this.add.text(100, 50, 'Welcome to Gravity Flip');
        this.add.text(100, 150, `press space to flip gravity`);
        this.add.text(100, 200, 'collect stars and survive to get points');
        this.add.text(100, 250, 'pink = 5, blue = 10, yellow = 20 and a extra life');
        this.add.text(100, 300, 'avoid astroids')
        this.add.text(100, 350, 'press space to start');
    }


    update() {
        if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.scene.start('playScene')
        }
    }
}