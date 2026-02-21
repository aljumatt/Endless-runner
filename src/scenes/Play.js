class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    init() {
        //vars
        this.acceleration = 1000 
        this.max_speed = 300
        this.dir = -1
        this.vel = 0
        this.scroll_speeds = [0.18, 0.2, 0.22, 0.24]
        this.game_speed = 1  
        this.score = 0
        this.timeNextAstroid = 0
        this.timeNextStarA = Phaser.Math.Between(2, 5) * 1000
        this.timeNextStarB = Phaser.Math.Between(4, 8) * 1000
        this.timeNextStarShower = Phaser.Math.Between(20, 80) * 1000
        this.health = 3
    }

    create() {

        //play music
        this.playingMusic = this.sound.add('playMusic')
        this.playingMusic.play({
            loop: true,
            volume: 1.0
        })

        //setup background
        this.backgrounds = [this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0), this.add.tileSprite(0, 0, 640, 480, 'background1').setOrigin(0, 0), this.add.tileSprite(0, 0, 640, 480, 'background2').setOrigin(0, 0), this.add.tileSprite(0, 0, 640, 480, 'background3').setOrigin(0, 0)] 

        //add blur to fathest background
        this.backgrounds[0].preFX.addBlur()

        //add bloom to backgrounds
        for (let i = 1; i < this.backgrounds.length; i++) {
            this.backgrounds[i].postFX.addBloom()
        }

        //setup top ui bar
        this.add.rectangle(0, 0, width, uiHeight, 0x173075).setOrigin(0, 0).setDepth(10)
        this.add.rectangle(0, 0, width, uiHeight - uiHeight/10, 0x0a1533).setOrigin(0, 0).setDepth(10)

        //setup health bar
        this.healthBar = [this.add.sprite(width - width/10, uiHeight/2, 'healthBar', 0).setDepth(11), this.add.sprite(width - width/10 - width/15, uiHeight/2, 'healthBar', 0).setDepth(11), this.add.sprite(width - width/10 - width/15 - width/15 , uiHeight/2, 'healthBar', 0).setDepth(11)]
        this.updateHelth()

        //make them swing
        this.tweens.add({
            targets: this.healthBar,
            angle: { from: -15, to: 15 },
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });


        //setup score
        this.score_text = this.add.text(width/20, uiHeight/2, 'score: 0').setDepth(11)
        this.score_text.y -= this.score_text.height
        this.score_text.setFontSize(uiHeight/2)

        //setup player character
        this.player = this.physics.add.sprite(width / 5 , height / 2, 'playerImg')
        this.physics.world.setBounds(0, uiHeight, width, height - uiHeight )
        this.player.body.setCollideWorldBounds(true)
        this.player.body.setBounce(2)
        this.player.body.setMaxVelocity(0, this.max_speed)
        this.player.body.setAccelerationY(this.dir * this.acceleration)
        this.player.body.setImmovable(true) 
        this.player.postFX.addBloom();

        //setup input
        this.cursors = this.input.keyboard.createCursorKeys();

          
        //setup astriods
        this.asteroidGroup = this.add.group({
            runChildUpdate: true
        })
        // Setup collision with player
        this.physics.add.collider(this.player, this.asteroidGroup, (player, rock) => {
            this.updateHelth(-1)
            rock.particle.destroy()
            rock.destroy()
            this.sound.play('astroidHit', {
                    volume: 0.5,
                    detune: Phaser.Math.Between(-500, 500)
            })
        })
        //setup colision with other astroids
        this.physics.add.collider(this.asteroidGroup, this.asteroidGroup)


        //setup stars
        this.starGroup = this.add.group({
            runChildUpdate: true
        })
        // Setup collision with player
        this.physics.add.collider(this.player, this.starGroup, (player, star) => {
            this.score += star.points * 1000
            //health star
            if (star.points == 20) {
                this.updateHelth(1)
                this.sound.play('starCsfx', {
                    volume: 0.5,
                    detune: Phaser.Math.Between(-500, 500)
                })
            } else {
                this.sound.play('starBsfx', {
                    volume: 0.5,
                    detune: Phaser.Math.Between(-500, 500)
                })
            }
            star.particle.destroy()
            star.destroy()
        })
        //setup collision with astroid
        this.physics.add.collider(this.starGroup, this.asteroidGroup)
    }

    update(time, delta) {

        //update timer
        this.score += delta
        this.score_text.setText('Score: ' + Math.floor(this.score / 1000))

        //move backgrounds
        this.backgrounds.forEach((bg, index) => {
            bg.tilePositionX += this.scroll_speeds[index] * delta * this.game_speed
        })

        //input flip
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.dir *= -1
            this.player.flipY = !this.player.flipY
            this.player.body.setAccelerationY(this.dir * this.acceleration)
            this.sound.play('flipsfx', {
                volume: 0.5,
                detune: Phaser.Math.Between(-500, 500)
            })
        }

        //spawn astorids
        if (time >= this.timeNextAstroid) {
            this.timeNextAstroid = time + (1000 / (this.game_speed * 0.9)) + Phaser.Math.Between(0, 0.1)
            this.spawnAstroid(Phaser.Math.Between(0, height - uiHeight) + uiHeight)

            // chance of spawning second
            if (Phaser.Math.Between(0, 100) < 5) {
                this.time.delayedCall(Phaser.Math.Between(0, 250), () => {
                    this.spawnAstroid(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
                })
            }
        }
        
        //spawn stars
        //more points star
        if (time >= this.timeNextStarA) {
            this.timeNextStarA = time + ((8000 / (1 + this.game_speed * 0.1))) + Phaser.Math.Between(0, 0.1)
            this.spawnStarA(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
        }
        if (time >= this.timeNextStarB) {
            this.timeNextStarB = time + ((2600 / (1 + this.game_speed * 0.1))) + Phaser.Math.Between(0, 0.1)
            this.spawnStarB(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
        }

        //star shower
        if (time >= this.timeNextStarShower) {
            for (let i = 0; i < Phaser.Math.Between(2, Math.ceil(this.score / 25000) + 2); i++) {
                this.time.delayedCall(Phaser.Math.Between(0, 500), () => {
                    //spawn rand star
                    let starOdds = ['a', 'b', 'b', 'c', 'c']
                    let r = Phaser.Math.RND.pick(starOdds)
                    if ('a' == r) {
                        this.spawnStarA(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
                    }
                    if ('B' == r) {
                        this.spawnStarB(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
                    }
                    if ('c' == r) {
                        this.spawnStarC(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
                    }
                })
            }
            this.timeNextStarShower = time + Phaser.Math.Between(0, 120) * 1000
            this.spawnStarB(Phaser.Math.Between(0, height - uiHeight) + uiHeight)
        }

        //scale dificult
        this.game_speed = 1 + 0.000005 * this.score
    }

    spawnAstroid(y) {
        //spawn
        let rock = new Astroid(this, width, y, 'astroid1', 0, 200, 0, 0x2f353b)
        this.asteroidGroup.add(rock)
    }

    spawnStarA(y) {
        //spawn
        let star = new Astroid(this, width, y, 'star1', 0, 500, 10, 0xb9e5de);
        star.body.setImmovable(true)
        star.postFX.addGlow(0xb9e5de, 2, 0, false)
        this.starGroup.add(star)
    }

    spawnStarB(y) {
        //spawn
        let star = new Astroid(this, width, y, 'star2', 0, 400, 5, 0xe5b9de);
        star.body.setImmovable(true)
        star.postFX.addGlow(0xe5b9de, 2, 0, false)
        this.starGroup.add(star)
    }

    spawnStarC(y) {
        //spawn
        let star = new Astroid(this, width, y, 'star3', 0, 300, 20, 0xdcdc7c);
        star.body.setImmovable(true)
        star.postFX.addGlow(0xdcdc7c, 2, 0, false)
        this.starGroup.add(star)
    }


    updateHelth(amount = 0) {
        this.health += amount
        for (let i = 0; i < this.healthBar.length; i++) {
            if (i <= this.health-1) {
                this.healthBar[i].setFrame(1)
            } else {
                this.healthBar[i].setFrame(0)
            }
        }

        if (this.health > 3) {
            this.health = 3
        }
        if (this.health <= 0) {
            this.gameOver()
        } 
    }

    gameOver() {
        this.playingMusic.stop()
        this.sound.stopAll()
        this.scene.start('lostScene', {score: Math.floor(this.score / 1000)});
    }
}