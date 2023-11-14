const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const platformImage = "./objects/platform.png";
const bigPlatformImage = "./objects/platform 2.png";
const backgroundImage = "./objects/background.png";
const hillsImage = "./objects/hills.png";
const hills2Image = "./objects/hills2.png";

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 0
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 70;
        this.height = 100;
    }

    draw() {
        c.fillStyle = 'blue'; // Altere para a cor desejada
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // gravity logic
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObjects {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
}

let platformImg = createImage(platformImage);
let backgroundImg = createImage(backgroundImage);
let hillsImg = createImage(hillsImage);
let hills2Img = createImage(hills2Image);
let bigPlatformImg = createImage(bigPlatformImage);

let player = new Player();

let platforms = [];
let genericObjects = [];
const keys = {
    right: { pressed: false },
    left: { pressed: false },
};
let scrollOffset = 0;

function init() {
    platformImg = createImage(platformImage);
    backgroundImg = createImage(backgroundImage);
    hillsImg = createImage(hillsImage);
    bigPlatformImg = createImage(bigPlatformImage);

    player = new Player();

    platforms = [
        new Platform({
            x: platformImg.width * 6 + 220,
            y: 470,
            image: platformImg
        }),
        new Platform({
            x: platformImg.width - 500,
            y: 470,
            image: platformImg
        }),
        new Platform({
            x: platformImg.width + 220,
            y: 470,
            image: platformImg
        }),
        new Platform({
            x: bigPlatformImg.width  * 3.4,
            y: 470,
            image: bigPlatformImg
        }),
        // ... outras plataformas ...
    ];

    genericObjects = [
        new GenericObjects({
            x: 0,
            y: 0,
            image: backgroundImg
        }),
        // ... outros objetos genéricos ...
    ];

    scrollOffset = 0;
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach(obj => {
        obj.draw();
    });

    platforms.forEach(platform => {
        platform.draw();
    });

    player.update();

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            });
            genericObjects.forEach(genericObject =>{
                genericObject.position.x -= player.speed * 0.66 
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += player.speed;
            });
            genericObjects.forEach(genericObject =>{
                genericObject.position.x += player.speed * 0.66 
            })
        }
    }

    // platform colision logic
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
        }
    });
    //win condition
    if (scrollOffset > platformImg.width * 5 + 300) {
        console.log('Você venceu!');
    }
    //lose condition
    if(player.position.y > canvas.height){
        init()
    }
}

init();
animate();

addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('esquerda');
            keys.left.pressed = true;
            break;
        case 83:
            console.log('baixo');
            break;
        case 68:
            console.log('direita');
            keys.right.pressed = true;
            break;
        case 87:
            console.log('cima');
            player.velocity.y = -25;
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('esquerda');
            keys.left.pressed = false;
            break;
        case 83:
            console.log('baixo');
            break;
        case 68:
            console.log('direita');
            keys.right.pressed = false;
            break;
        case 87:
            console.log('cima');
            break;
    }
});
