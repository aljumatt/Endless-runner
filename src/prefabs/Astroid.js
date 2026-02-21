class Astroid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed, in_points, color) {

        
        //setup
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        this.x += this.width
        this.setDepth(2)
        this.particle = scene.add.particles(0, 0, texture, {
            speed: 30,
            scale: { start: 0.9, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: color,
            lifespan: 200,
            blendMode: 'ADD',
            follow: this
        })
        this.particle.setDepth(1)

        //make sure on screen
        if (this.y < height/2) {
            this.y += this.height/2
        } else {
            this.y -= this.height/2
        }

        //physics
        scene.physics.add.existing(this)
        this.body.setCircle(this.width / 2)
        this.body.setVelocityX(-speed * scene.game_speed)
        this.body.setAllowGravity(false)
        this.body.setBounce(0.8)
        this.points = in_points

        //random spin
        this.body.setAngularVelocity(Phaser.Math.RND.pick([1, -1]) * 100 * scene.game_speed)
    }

    update(time, delta) {
        //remove when hit end
        if (this.x < -this.width || this.x > this.width + width || this.y > height + this.height || this.y < 0 - this.height) {
            this.particle.destroy()
            this.destroy()
        }
    }
}