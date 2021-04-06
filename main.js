const WIDTH = 20;
const HEIGTH = 20;
const SEPARATOR = ",";

const START_SNAKE_LENGTH = 5;
const START_SPEED = 100;

const HEAD_DIRECTION_LEFT = "LEFT"
const HEAD_DIRECTION_TOP = "TOP"
const HEAD_DIRECTION_RIGHT = "RIGHT"
const HEAD_DIRECTION_DOWN = "DOWN"

let snakeLength = START_SNAKE_LENGTH;
let speed = START_SPEED;

let headDirection = HEAD_DIRECTION_RIGHT;
let checkboxes = [];

let score = document.getElementById("pScore");
let modal = document.getElementById("modal");
let modalClose = document.getElementById("close");

let timer = setInterval(moveSnake, speed);

modalClose.onclick = function() {
    modal.style.display = "none";
    restartGame();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        restartGame()
    }
}

snake = {
    body: []
};

cookies = {
    x: 0,
    y: 0
};

function SnakeBody(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function createPlane() {
    for (var i = 0; i < WIDTH; i++) {
        checkboxes[i] = [];
        for (var j = 0; j < HEIGTH; j++) {
            checkbox = createCheckbox(i + SEPARATOR + j);
            checkboxes[i][j] = checkbox;
            plane = document.getElementById("plane");
            plane.appendChild(checkbox);
        }
    }
}

function createCheckbox(id) {
    checkbox = document.createElement('input');
    checkbox.id = id;
    checkbox.type="checkbox";
    return checkbox;
}

function createSnake() {
    x = getRandomNumber(0, WIDTH);
    y = getRandomNumber(snakeLength, HEIGTH);
    
    snake.body = [];
    
    for (var i = 0; i < snakeLength; i++) {
        snake.body[i] = new SnakeBody(x, y - i);
    }
}

function createCheckboxId(i, j) {
    return i + SEPARATOR + j;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function switchCheckbox(id, check, color) {
    checkbox = document.getElementById(id);
    checkbox.checked = check;
    checkbox.style.background = color;
}

//##############################################  move #################################################################################################
function updateSnake() {
    clearPlane();
    for (var i = 0; i < snake.body.length; i++) {
        id = createCheckboxId(snake.body[i].x, snake.body[i].y);
        switchCheckbox(id, true, "#f01ddf");
    }
    showCookies();
}

function clearPlane() {
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGTH; j++) {
            id = createCheckboxId(i, j);
            switchCheckbox(id, false, "#c6c6c6");
        }
    }
}

function showCookies() {
    id = createCheckboxId(cookies.x, cookies.y);
    switchCheckbox(id, true, "#00ff00");
}

//############################################## control #################################################################################################
function onEventListener(e) {
    switch (e.keyCode) {
        case 65:
        case 37:
            clickLeft();
            break;
        case 87:
        case 38:
            clickTop();
            break;
        case 68:
        case 39:
            clickRight();
            break;
        case 83:
        case 40:
            clickDown();
            break;
    }

}

function clickLeft() {
    headDirection = HEAD_DIRECTION_LEFT;
}

function clickTop() {
    headDirection = HEAD_DIRECTION_TOP;
}

function clickRight() {
    headDirection = HEAD_DIRECTION_RIGHT;
}

function clickDown() {
    headDirection = HEAD_DIRECTION_DOWN;
}

function moveSnake() {
    switch (headDirection) {
        case HEAD_DIRECTION_LEFT:
            x = snake.body[0].x;
            y = snake.body[0].y-1;
            if (snake.body[0].y === 0) {
                y = WIDTH - 1;
            }
            changeDirection(x, y);
            break;
        case HEAD_DIRECTION_TOP:
            x = snake.body[0].x - 1;
            if (snake.body[0].x === 0) {
                x = WIDTH - 1;
            }
            y = snake.body[0].y;
            changeDirection(x, y);
            break;
        case HEAD_DIRECTION_RIGHT:
            x = snake.body[0].x;
            y = snake.body[0].y+1;
            if (snake.body[0].y === WIDTH - 1) {
                y = 0;
            }
            changeDirection(x, y);
            break;
        case HEAD_DIRECTION_DOWN:
            x = snake.body[0].x + 1;
            if (snake.body[0].x === WIDTH - 1) {
                x = 0;
            }
            y = snake.body[0].y;
            changeDirection(x, y);
            break;
            
    }
}

function changeDirection(x, y) {
    tempX = snake.body[0].x;
    tempY = snake.body[0].y;
    
    snake.body[0].x = x;
    snake.body[0].y = y;
    
    for (var i = 1; i < snake.body.length; i++) {
        tx = snake.body[i].x;
        ty = snake.body[i].y;
        
        snake.body[i].x = tempX;
        snake.body[i].y = tempY;
        
        tempX = tx;
        tempY = ty;
    }
    
    updateSnake();
    checkContactWithBody();
    checkContactWithCookies();
}

function checkContactWithBody() {
    headX = snake.body[0].x;
    headY = snake.body[0].y;
    for (var i = 1; i < snakeLength; i++) {
        if (snake.body[i].x === headX && snake.body[i].y === headY) {
            stopGame();
        }
    }
}

function stopGame() {
    clearInterval(timer);
    showModal();
}

function showModal() {
    modal.style.display = "block";
}

function checkContactWithCookies() {
    if (snake.body[0].x === cookies.x 
        && snake.body[0].y === cookies.y) {
        addBody();
        updateScore();
        createRandomCookies();
    }
}

function addBody() {
    snake.body[snakeLength] = new SnakeBody(snake.body[snakeLength - 1].x, snake.body[snakeLength - 1].x);
    snakeLength++;
}

function updateScore() {
    score.innerHTML = "&#128013; Length: " + snakeLength;
}

function createRandomCookies() {
    cookies.x = getRandomNumber(0, WIDTH);
    cookies.y = getRandomNumber(0, HEIGTH);
}

function restartGame() {
    snakeLength = START_SNAKE_LENGTH;
    updateScore();
    clearPlane();
    createRandomCookies();
    headDirection = HEAD_DIRECTION_RIGHT;
    createSnake();
    updateSnake();
    timer = setInterval(moveSnake, speed);
    
}


addEventListener("keydown", onEventListener);

createRandomCookies();
createPlane();
createSnake();
updateSnake();

