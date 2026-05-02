const board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let blocks = [];
let snake = [{ x:5, y:5},{x:4, y:5},{x:3, y:5}];
let direction = 'down';

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
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
}

//Game loop
let interval = setInterval(() => {
    let head = null;
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
        alert("Game Over.");
        clearInterval(interval);
        return;

    }

    //clear old snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });

    //Move snake
    snake.unshift(head);
    snake.pop();

    render();
},500)

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