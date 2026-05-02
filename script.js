const board = document.querySelector(".board");
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart-game")
const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 30;
const blockWidth = 30;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;
highScoreElement.textContent= highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let blocks = [];
let snake = [{ x:5, y:5}];
let direction = 'down';
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

//create grid
for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

//Render snake
function render(){
    
    let head = null;
    
    blocks[`${food.x}-${food.y}`].classList.add('food');

    if(direction === 'left'){
        head = {x:snake[0].x, y:snake[0].y-1};
    }
    else if(direction === 'right'){
        head = {x:snake[0].x, y:snake[0].y+1};
    }
    else if(direction === 'up'){
        head = {x:snake[0].x-1, y:snake[0].y};
    }
    else if(direction === 'down'){
        head = {x:snake[0].x+1, y:snake[0].y};
    }

    //Boundary check
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(interval);
        modal.style.display="flex";
        startGameModal.style.display="none";
        gameOverModal.style.display="flex";
        return;

    }

    // Self collision check
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(interval);
        clearInterval(timerIntervalId);

        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    //Food consume
    let ateFoot = false;
    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
        score++;
        scoreElement.textContent = `${score}`;

        if(score > highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore.toString());
        }
        ateFoot = true;
    }

    //clear old snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });

    //Move snake
    snake.unshift(head);
    if(!ateFoot){
        snake.pop();
    }
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
}

//Game start
startButton.addEventListener('click',()=>{
    modal.style.display="none";
    interval = setInterval(()=>{
        render();
    },300);
    timerIntervalId = setInterval(()=>{
        let [min,sec]= time.split(":").map(Number);
        if(sec==59){
            min++;
            sec=0;
        }else{
            sec++;
        }

        time = `${min}:${sec}`;
        timeElement.textContent=time;
    },1000);
})

restartButton.addEventListener('click',restartGame);

//Restart Game
function restartGame(){
    clearInterval(interval);
    score = 0;
    time = `00:00`;

    scoreElement.textContent=score;
    timeElement.textContent=time;
    highScoreElement.textContent=highScore;

    blocks[`${food.x}-${food.y}`].classList.remove('food');
     snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
    modal.style.display="none";
    snake = [{ x:5, y:5}];
    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
    interval = setInterval(()=>render(),300);
}

//Game Controls
addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
    else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    }
    else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
    else if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    }
});