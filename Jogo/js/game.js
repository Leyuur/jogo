const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = window.innerWidth
const canvasHeight = window.innerHeight

canvas.width = canvasWidth
canvas.height = canvasHeight

const desiredFPS = 120; // The desired frames per second
const frameTime = 1000 / desiredFPS; // The time per frame in milliseconds

let prevTime = performance.now();
let lag = 0;

function animate() {
    const currentTime = performance.now();
    const elapsed = currentTime - prevTime;
    prevTime = currentTime;
    lag += elapsed;

    handleControls();

    while (lag >= frameTime) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        background.update();
        player.update();   
        npc.update();
        platform.draw()

        lag -= frameTime;
    }

    window.requestAnimationFrame(animate);
}

animate(); 
