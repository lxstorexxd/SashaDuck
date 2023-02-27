const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");

const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'image/bird1.png';

const FLAPPY_SPEED = -4;
const BIRD_WIDTH = 50;
const BIRD_HEIGHT = 50;
const PIPE_WIDTH = 50;
const PIPE_GAP = 140;

let BIRD_X = 50;
let BIRD_Y = 50;
let BIRD_VELOCITY = 0;
let BIRD_ACCELERATION = 0.1;

let PIPE_X = 600;
let PIPE_Y = canvas.height - 200;

let scoreDiv = document.getElementById('score-out');
let score = 0;
let BestScore = 0;

let scored = false;


document.body.onkeyup = function(event) {
    if (event.code == "Space") {
        BIRD_VELOCITY = FLAPPY_SPEED;
    }
}

document.addEventListener("touchstart", function(event) {
    BIRD_VELOCITY = FLAPPY_SPEED;
})


document.getElementById("restart").addEventListener('click', function() {
    HideMenu();
    ResetGame();
    loop();
})

function increaseScore() {
    // update score
    if (BIRD_X > PIPE_X + PIPE_WIDTH &&
        (BIRD_Y < PIPE_Y + PIPE_GAP ||
            BIRD_Y + BIRD_HEIGHT > PIPE_Y + PIPE_GAP) && !scored) {
                score++;
                scoreDiv.innerHTML = score;
                scored = true;
        }
    if (BIRD_X < PIPE_X + PIPE_WIDTH) {
        scored = false;
    }
}

function CollisionCheck() {
    const birdbox = {
        x: BIRD_X,
        y: BIRD_Y,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }
    const topPipeBox = {
        x: PIPE_X,
        y: PIPE_Y - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: PIPE_Y
    }
    const bottomPipeBox = {
        x: PIPE_X,
        y: PIPE_Y + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - PIPE_Y - PIPE_GAP
    }

    if (birdbox.x + birdbox.width > topPipeBox.x &&
        birdbox.x < topPipeBox.x + topPipeBox.width &&
        birdbox.y < topPipeBox.y) {
            return true;
        }
    if (birdbox.x + birdbox.width > bottomPipeBox.x &&
        birdbox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdbox.y + birdbox.height > bottomPipeBox.y) {
            return true;
        }
    if (BIRD_Y < 0 || BIRD_Y + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}

function ShowMenu() {
    // Show end menu
    document.getElementById('menu').style.display = "block";
    gameContainer.classList.add("background-blur");
    document.getElementById("end-score").innerHTML = score;
    if (BestScore < score) {
        BestScore = score;
    }
    document.getElementById("high-score").innerHTML = BestScore;
}

function HideMenu() {
    // Hide end menu
    document.getElementById('menu').style.display = "none";
    gameContainer.classList.remove("background-blur");
}

function ResetGame() {
    // New game, new params
    BIRD_X = 50;
    BIRD_Y = 50;
    BIRD_VELOCITY = 0;
    BIRD_ACCELERATION - 0.1;

    PIPE_X = 600;
    PIPE_Y = canvas.height - 200;

    score = 0;
}

function EndGame() {
    ShowMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(flappyImg, BIRD_X, BIRD_Y, BIRD_WIDTH, BIRD_HEIGHT);

    var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgb(64,252,76)');
    gradient.addColorStop(1, 'rgb(0,196,108)');
    gradient.addColorStop(1, 'rgb(0,0,0)');
    ctx.fillStyle = gradient;

    ctx.fillRect(PIPE_X, -100, PIPE_WIDTH, PIPE_Y);
    ctx.fillRect(PIPE_X, PIPE_Y + PIPE_GAP, PIPE_WIDTH, canvas.height - PIPE_Y);

    if (CollisionCheck()) {
        EndGame();
        return;
    }

    PIPE_X -= 1.5;
    if (PIPE_X < -50) {
        PIPE_X = 600;
        PIPE_Y = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    BIRD_VELOCITY += BIRD_ACCELERATION;
    BIRD_Y += BIRD_VELOCITY;

    increaseScore();
    requestAnimationFrame(loop);
}

loop();
