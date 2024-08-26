const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

let isPaused = false;

class Ball {
    constructor() {
        this.positionx = canvas.width / 2;
        this.positiony = canvas.height / 2;
        this.speedx = random([-3, -2.5, 2.5, 3]);  
        this.speedy = random([-3, -2.5, 2.5, 3]); 
        this.size = 20;
        this.player1Score = 0; 
        this.player2Score = 0; 
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.positionx, this.positiony, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.positionx += this.speedx;
        this.positiony += this.speedy;
    }

    checkWalls() {
        if (this.positiony - this.size / 2 <= 0 || this.positiony + this.size / 2 >= canvas.height) {
            this.speedy *= -1;
        }

        if (this.positionx - this.size / 2 <= 0) {
            this.player2Score++;
            this.reset();
        } else if (this.positionx + this.size / 2 >= canvas.width) {
            this.player1Score++;
            this.reset();
        }
    }

    reset() {
        this.positionx = canvas.width / 2;
        this.positiony = canvas.height / 2;
        this.speedx = random([-3, -2.5, 2.5, 3]);  
        this.speedy = random([-3, -2.5, 2.5, 3]);  
    }

    checkCollision(player) {
        if (
            this.positionx - this.size / 2 <= player.positionx + player.large &&
            this.positionx + this.size / 2 >= player.positionx &&
            this.positiony + this.size / 2 >= player.positiony &&
            this.positiony - this.size / 2 <= player.positiony + player.alt
        ) {
            this.speedx *= -1;
        }
    }

    displayScore() {
        ctx.fillStyle = "#fff";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.player1Score, canvas.width / 4, 50);
        ctx.fillText(this.player2Score, (3 * canvas.width) / 4, 50);
    }
}

class Player {
    constructor(typeP) {
        this.id = typeP;
        this.alt = 60;
        this.large = 20;
        this.speedy = 5; // Velocidade do jogador

        if (this.id == 1) {
            this.positionx = 0;
            this.positiony = canvas.height / 2 - this.alt / 2;
        } else if (this.id == 2) {
            this.positionx = canvas.width - this.large;
            this.positiony = canvas.height / 2 - this.alt / 2;
        }
    }

    move(direction) {
        if (direction === "up" && this.positiony > 0) {
            this.positiony -= this.speedy;
        } else if (direction === "down" && this.positiony + this.alt < canvas.height) {
            this.positiony += this.speedy;
        }
    }

    moveAutomatically(ball) {
        if (ball.positiony < this.positiony + this.alt / 2 && this.positiony > 0) {
            this.positiony -= this.speedy;
        } else if (ball.positiony > this.positiony + this.alt / 2 && this.positiony + this.alt < canvas.height) {
            this.positiony += this.speedy;
        }
    }

    draw() {
        ctx.fillStyle = this.id == 1 ? "#0000FF" : "#fff"; // Azul para o player 1, branco para o player 2
        ctx.fillRect(this.positionx, this.positiony, this.large, this.alt);
    }
}

let ball1 = new Ball();
let player1 = new Player(1);
let player2 = new Player(2);

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball1.draw();
    ball1.move();
    ball1.checkWalls();
    ball1.checkCollision(player1);
    ball1.checkCollision(player2);
    ball1.displayScore();

    player1.draw();
    player2.draw();

    if (keyIsDown(38)) { 
        player1.move("up");
    }
    if (keyIsDown(40)) { 
        player1.move("down");
    }


    player2.moveAutomatically(ball1);
}

function keyIsDown(key) {
    return keys[key];
}

let keys = {};
window.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

let interval;

function gameLoop() {
    if (!isPaused) {
        drawGame();
    }
}

interval = setInterval(gameLoop, 1000 / 60); //FPS
document.getElementById("pauseButton").addEventListener("click", function () {
    isPaused = !isPaused;
    this.textContent = isPaused ? "Resume" : "Pause";
});
