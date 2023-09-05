const tablero = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controles = document.querySelectorAll(".controls i");

let finJuego = false;
let foodX
let foodY;
let snakeX = 5;
let snakeY = 5;
let velocidadX = 0;
let velocidadY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtener el puntaje maximo
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Actualzar la posicion de la comida
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 40) + 1;
    foodY = Math.floor(Math.random() * 40) + 1;
}

const handleGameOver = () => {
    sonido.play();
    clearInterval(setIntervalId);
    alert("Juego finalado , presiona OK para volver a jugar...");
    location.reload();
}

// Cambiar la direccion 
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocidadY != 1) {
        velocidadX = 0;
        velocidadY = -1;
    } else if (e.key === "ArrowDown" && velocidadY != -1) {
        velocidadX = 0;
        velocidadY = 1;
    } else if (e.key === "ArrowLeft" && velocidadX != 1) {
        velocidadX = -1;
        velocidadY = 0;
    } else if (e.key === "ArrowRight" && velocidadX != -1) {
        velocidadX = 1;
        velocidadY = 0;
    }
}

// Cambiar la dirfeccion al hacer click
controles.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (finJuego) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Cuando come la comida
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        sonidoEat.play();
        snakeBody.push([foodY, foodX]); //agrega la comida al array del body 
        score++;
        highScore = score >= highScore ? score : highScore; // chequeo el maximo score

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Actualiza la serpiente
    snakeX += velocidadX;
    snakeY += velocidadY;

    // Agranda el cuerpo de la serpiente
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // Chekeamossi la serpiente golpea la pared
    if (snakeX <= 0 || snakeX > 40 || snakeY <= 0 || snakeY > 40) {
        return finJuego = true;
    }

    // agrega un div por cada parte de la longitud del cuerpo
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Check snake head golpea el cuerpo
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            finJuego = true;
        }
    }
    tablero.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);


const cargarSonido = function (fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto 
    document.body.appendChild(sonido);
    return sonido;
};

const sonido = cargarSonido("sounds/impact.mp3");
const sonidoEat = cargarSonido("sounds/eat.mp3");

