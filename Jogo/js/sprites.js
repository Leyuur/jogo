
const gravity = 0.2

const backgroundSpritePath = ""
const defaultObjectSpritePath = "../assets/objects/square.svg"

class Sprite {
    constructor({ position, velocity, source, scale, offset, sprites }) {
        this.position = position
        this.velocity = velocity
        this.scale = scale || 1
        this.image = new Image() 
        this.image.src = source || defaultObjectSpritePath
        this.width = window.innerWidth
        this.height = window.innerHeight

        this.offset = offset || {
            x: 0,
            y: 0
        }

        this.sprites = sprites || {
            idle: {
                src: this.image.src,
                totalSpriteFrames: 1,
                framesPerSpriteFrame: 1
            }
        }

        this.currentSprite = this.sprites.idle

        this.currentSpriteFrame = 0
        this.elapsedTime = 0
        this.totalSpriteFrames = this.sprites.idle.totalSpriteFrames
        this.framesPerSpriteFrame = this.sprites.idle.framesPerSpriteFrame
    }

    setSprite(sprite) {
        this.currentSprite = this.sprites[sprite]

        if (!this.currentSprite) {
            this.currentSprite = this.sprites.idle
        }
    }

    loadSprite() {
        let previousSprite = this.image.src

        this.image = new Image()
        this.image.src = this.currentSprite.src
        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        this.totalSpriteFrames = this.currentSprite.totalSpriteFrames
        this.framesPerSpriteFrame = this.currentSprite.framesPerSpriteFrame

        let newSprite = this.image.src

        if (previousSprite !== newSprite) {
            // Corrects the sprite's position when switching sprites
            console.log("Detected sprite change: ", previousSprite.split("/").pop(), " -> ", newSprite.split("/").pop())
            
            let previousSpriteImage = new Image()
            previousSpriteImage.src = previousSprite

            // Corrects the sprite's position:
            this.position.y += (previousSpriteImage.height - this.image.height) * this.scale
        }
    }

    draw() {        
        ctx.imageSmoothingEnabled = false;

        // Determine the x-scale based on the facing direction
        const xScale = this.facing === "left" ? -1 : 1;
        ctx.save();
        ctx.translate(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.scale(xScale, 1); // Flip the image horizontally if facing left

        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * this.image.width / this.totalSpriteFrames,
            0,
            this.image.width / this.totalSpriteFrames,
            this.image.height,
            0,
            0,
            this.width / this.totalSpriteFrames * xScale, // Adjust the width with x-scale
            this.height
        );
        ctx.restore();
        

        // if(this.isAttacking || this.isSpecialAttacking){
        //     ctx.fillStyle = 0    
        //     ctx.fillRect(
        //         this.attackBox.position.x, 
        //         this.attackBox.position.y, 
        //         this.attackBox.width, 
        //         this.attackBox.height 
        //         )
                  
        // }
        // if(this.isBlueAttacking){
        //     ctx.fillStyle = 0
        //     ctx.fillRect(
        //         this.attackBox.position.x,
        //         this.attackBox.position.y - 175, 
        //         this.attackBox.width, 
        //         this.attackBox.height 
        //         )
        // }
        
    }

    animate() {
        this.elapsedTime += 1

        if (this.elapsedTime >= this.framesPerSpriteFrame) {
            this.currentSpriteFrame += 1

            if (this.currentSpriteFrame >= this.totalSpriteFrames) {
                this.currentSpriteFrame = 0
            }

            this.elapsedTime = 0
        }
        if( 
            player.attackBox.position.x >= npc.attackBox.position.x - 5 && 
            player.attackBox.position.x <= npc.attackBox.position.x + 50 && player.isBlueAttacking||

            player.attackBox.position.x >= npc.attackBox.position.x - 5 && 
            player.attackBox.position.x <= npc.attackBox.position.x + 50 && player.isAttacking||

            player.attackBox.position.x >= npc.attackBox.position.x - 5 && 
            player.attackBox.position.x <= npc.attackBox.position.x + 50 && player.isSpecialAttacking||

            player.attackBox.position.x + player.attackBox.width >= npc.attackBox.position.x && 
            player.attackBox.position.x <= npc.position.x + 80 && player.isAttacking ||

            player.attackBox.position.x + player.attackBox.width >= npc.attackBox.position.x && 
            player.attackBox.position.x <= npc.position.x + 80 && player.isBlueAttacking ||

            player.attackBox.position.x + player.attackBox.width >= npc.attackBox.position.x && 
            player.attackBox.position.x <= npc.position.x + 80 && player.isSpecialAttacking
            ){
                console.log("Acertou!")
        }
        
        // Metodo de colisão do player com a plataforma 
        if (
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width &&
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y
        ) {
            player.velocity.y = 0;
            player.onGround = true;
            player.position.y = platform.position.y - player.height;
        }
        
    }
        
    

    update() {
        this.draw()
        this.animate()
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        sprites,
        scale
    }) {

        super({
            position,
            velocity,
            scale,
            sprites
        })

        this.velocity = {
            x: 0,
            y: 0
        }
        this.attackBox =  {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 105,
            height: 50
        }
        
        this.width = 60
        this.height = 150

        this.isBlueAttacking
        this.BlueAttackCooldown = 700
        this.onBlueAttackCooldown

        this.isSpecialAttacking
        this.specialAttackCooldown = 500
        this.onSpecialAttackCooldown
        
        this.isAttacking
        this.attackCooldown = 400
        this.onAttackCooldown

        this.lastKeyPressed
        this.onGround
    }

    gravity() {
        if (this.position.y + this.height >= canvas.height ) {
            this.onGround = true
        } else {
            this.onGround = false
        }

        if (this.position.y + this.height > canvas.height ) {
            this.position.y = canvas.height - this.height 
            this.velocity.y = 0
        } else {
            if (!this.onGround) this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.attackBox.position.x = this.position.x + 100 
        this.attackBox.position.y = this.position.y + 120
        if (player.facing === "left"){
            player.attackBox.position.x = player.position.x + 20
        }
    }
        
    update() {
        this.gravity()
        this.loadSprite()
        this.draw()
        this.animate()
        
    }

    attack() {
        if (this.onAttackCooldown) return

        this.isAttacking = true
        this.onAttackCooldown = true

        setTimeout(() => {
            this.isAttacking = false
        }, 400)

        setTimeout(() => {
            this.onAttackCooldown = false
        }, this.attackCooldown)

    }
    specialAttack() {
        if (this.onSpecialAttackCooldown) return
    
        this.isSpecialAttacking = true
        this.onSpecialAttackCooldown = true
    
        setTimeout(() => {
            this.isSpecialAttacking = false
        }, 400)
    
        setTimeout(() => {
            this.onSpecialAttackCooldown = false
        }, this.specialAttackCooldown)
    }
    blueAttack() {
        if (this.onBlueAttackCooldown) return
    
        this.isBlueAttacking = true
        this.onBlueAttackCooldown = true
    
        player.setSprite("blue")
    
        setTimeout(() => {
            this.isBlueAttacking = false
        }, 400)
    
        setTimeout(() => {
            this.onBlueAttackCooldown = false
        }, this.BlueAttackCooldown)
    }
    

}
class Platform{
    constructor(){
        this.position = {
            x: 200,
            y: 870 
        }
        this.width = 200
        this.height = 30
    }

    draw(){
        ctx.fillStyle = "blue"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
const platform = new Platform()

const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }, 

    scale: 2,
    sprites: {
        idle: {
            src: "../assets/player/idle.png",
            totalSpriteFrames: 6,
            framesPerSpriteFrame: 8
        },
        running: {
            src: "../assets/player/Run.png",
            totalSpriteFrames: 8,
            framesPerSpriteFrame: 8
        },
        jumping: {
            src: "../assets/player/Jump.png",
            totalSpriteFrames: 10,
            framesPerSpriteFrame: 18
        },
        attacking : {
            src: "../assets/player/attacking.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 9
        },
        slash: {
            src: "../assets/player/slash.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 9
            
        },
        blue: {
            src: "../assets/player/blue.png",
            totalSpriteFrames: 5,
            framesPerSpriteFrame: 10
        }
    }
})

const npc = new Fighter({
    position: {
        x: 500,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }, 
    scale: 2,
    sprites: {
        idle: {
            src: "../assets/player/idle2.png",
            totalSpriteFrames: 5,
            framesPerSpriteFrame: 9
        },
        
    }
    
})

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    source: backgroundSpritePath
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false,
        hold: false
    },
    x: {
        pressed: false,
        hold: false
    },
    space: {
        pressed: false,
        hold: false
    },
    c: {
        pressed: false,
        hold: false
    },

}

window.addEventListener("keydown", e => {
    let key = e.key

    switch(key) {
        case "ArrowLeft":
        case "a":
            keys.a.pressed = true
            player.lastKeyPressed = key
            break
        case "ArrowRight":
        case "d":
            keys.d.pressed = true
            player.lastKeyPressed = key
            break
        case "ArrowUp":
        case "w":
            keys.w.pressed = true
            break
        case "x":
            keys.x.pressed = true
            break
        case " ":
            keys.space.pressed = true
            break
        case "c":
            keys.c.pressed = true
            break
    }
})

window.addEventListener("keyup", e => {
    let key = e.key

    switch(key) {
        case "ArrowLeft":
        case "a":
            keys.a.pressed = false
            break
        case "ArrowRight":
        case "d":
            keys.d.pressed = false
            break
        case "ArrowUp":
        case "w":
            keys.w.pressed = false
            keys.w.hold = false
            break
        case "x":
            keys.x.pressed = false
            keys.x.hold = false
            break
        case " ":
            keys.space.pressed = false
            keys.space.hold = false
            break
        case "c":
            keys.c.pressed = false
            keys.c.hold = false
            break 
    }
})

function handleControls() {
    if (!player.setSprite("running") && !keys.d.pressed && !keys.a.pressed){player.setSprite("idle")}
    npc.setSprite("idle2")

    if (!player.onGround) player.setSprite("jumping")
    if (player.isAttacking) {player.setSprite("attacking")}
    if (player.isSpecialAttacking) {player.setSprite("slash")}
    if (player.isBlueAttacking) {player.setSprite("blue")}

    movement()
    attacks()

    function movement() {
        player.velocity.x = 0
        if (player.isAttacking) return
        if (player.isSpecialAttacking) return
        if (player.isBlueAttacking) return

        if (keys.a.pressed && player.position.x >= 100 && ["a", "ArrowLeft"].includes(player.lastKeyPressed)) {
            player.velocity.x = -1.2 * 3.4
            player.facing = "left"

            if (!player.onGround) return

            player.setSprite("running")
        }
        if(keys.a.pressed && player.position.x == 100 && ["a", "ArrowRight"].includes(player.lastKeyPressed)){
            player.velocity.x = 0
            player.facing = "left"

            if (!player.onGround) return

            player.setSprite("running")
        }

        if (keys.d.pressed && player.position.x <= 400 && ["d", "ArrowRight"].includes(player.lastKeyPressed)) {

            player.velocity.x = 1.2 * 3.4
            player.facing = "right"

            if (!player.onGround) return

            player.setSprite("running")
            
        }
        if(keys.d.pressed && player.position.x == 400 && ["d", "ArrowRight"].includes(player.lastKeyPressed)){
            player.velocity.x = 0
            player.facing = "right"

            if (!player.onGround) return

            player.setSprite("running")
        }

        if (keys.w.pressed && !keys.w.hold) {
            if (!player.onGround) return
            player.velocity.y -= 10
            keys.w.hold = true
            player.setSprite("jumping")
        }
    }
    function attacks() {
        if (keys.space.pressed && !keys.space.hold) {
            player.attack()
            keys.space.hold = true
        } 
        if (keys.x.pressed && !keys.x.hold) {
            player.specialAttack()
            keys.x.hold = true
        } 
        if (keys.c.pressed && !keys.c.hold) {
            player.blueAttack()
            keys.c.hold = true
        } 
    }
}
