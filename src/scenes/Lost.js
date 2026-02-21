class Lost extends Phaser.Scene {
    constructor() {
        super('lostScene');
    }

    create(data) {
        // Setup the R key
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    
        //re add background
        this.backgrounds = [this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0), this.add.tileSprite(0, 0, 640, 480, 'background1').setOrigin(0, 0), this.add.tileSprite(0, 0, 640, 480, 'background2').setOrigin(0, 0), this.add.tileSprite(0, 0, 640, 480, 'background3').setOrigin(0, 0)] 
        //add blur to fathest background
        this.backgrounds[0].preFX.addBlur()
        //add bloom to backgrounds
        for (let i = 1; i < this.backgrounds.length; i++) {
            this.backgrounds[i].postFX.addBloom()
        }
        this.scroll_speeds = [0.18, 0.2, 0.22, 0.24]


        //loss text
        this.add.text(100, 100, 'GAME OVER', { fontSize: '48px' });
        this.add.text(100, 160, `Final Score: ${data.score}`);
        this.add.text(100, 250, 'Press R to Restart');
        this.add.text(50, 400, 'Music from https://timbeek.itch.io/royalty-free-music-pack-volume-2', { fontSize: '10px' });
        this.add.text(50, 450, 'all art created by me', { fontSize: '10px' });
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
            // This kills LoseScene and restarts PlayScene fresh
            this.scene.start('playScene')
        }

        //move backgrounds
        this.backgrounds.forEach((bg, index) => {
            bg.tilePositionX += this.scroll_speeds[index] * delta
        })
    }
}