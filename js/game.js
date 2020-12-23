                            /*  ***          ***
                                THE TETRIES GAME
                                ****************
                            */

// get the "canvas" element
const canva = document.querySelector("#canva");

// Set context of the "canvas" element
const ctx = canva.getContext("2d");

const endGame = document.querySelector("#game-over");
const playAgain = document.querySelector("#play");
let gameOver = false;

// sounds
const fullRow = new Audio();
fullRow.src = "sounds/fullrow.wav";

// Declaring the "score" variable
let score = 0;

// Declaring the number of rows & columns
const ROW = 20;
const COL = COLUMN = 10;

// Declaring the square size
const SQ = SQUARESIZE = 25;

const VACANT = "white"; // Endicating that the square is empty

// Making the board
let board = [];
function makeBoard(){
    for(let r = 0; r < ROW; r++){
        board[r] = [];
        for(let c = 0; c < COL; c++){
            board[r][c] = VACANT;
        }
    }
}
makeBoard();

// Function that draws a square
function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
    ctx.strokeStyle = "skyblue";
    ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}

// Drawing the board
function drawBoard(){
    for(let r = 0; r < ROW; r++){
        for(let c = 0; c < COL; c++){
           drawSquare(c, r, board[r][c]);
        }
    }
}
drawBoard();

// Geting the pieces and there colors
const PIECES = [
    [Z, "blue"],
    [S, "yellow"],
    [T, "orange"],
    [L, "green"], 
    [I, "gold"],
    [J, "crimson"],
    [O, "gray"]
];

// The Piece class
class Piece{
    constructor(tetromino, color){
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];

        // default coordinates of the piece
        this.x = 3;
        this.y = -2;
    }

    // draw the piece
    drawPiece(){
        for(let r = 0; r < this.activeTetromino.length; r++){
            for(let c = 0; c < this.activeTetromino.length; c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, this.color);
                }
            }
        }
    }

    // undraw the piece
    undrawPiece(){
        for(let r = 0; r < this.activeTetromino.length; r++){
            for(let c = 0; c < this.activeTetromino.length; c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, VACANT);
                }
            }
        }
    }
    // move the piece to the bottom
    moveDown(){
        if(!this.collision(0, 1, this.activeTetromino)){
            this.undrawPiece();
            this.y++;
            this.drawPiece();  
        }else{
            this.lockPiece();
            p = randomPiece();
        }
    }

    // Lock the piece
    lockPiece(){
        for(let r = 0; r < this.activeTetromino.length; r++){
            for(let c = 0; c < this.activeTetromino.length; c++){
                 if(!this.activeTetromino[r][c]){
                    continue;
                }
                if(this.y + r < 0){
                    endGame.style.opacity = 0.8;
                    gameOver = true;
                    break;
                }
                board[this.y + r][this.x + c] = this.color;
            }
        }
        // remove full rows
        for(let r = 0; r < ROW; r++){
            let isRowFull = true;
            for(let c = 0; c < COL; c++){
                isRowFull = isRowFull && (board[r][c] !== VACANT);
            }
            if(isRowFull){
                fullRow.play();
                for(let y = r; y > 1; y--){
                    for(let c = 0; c < COL; c++){
                        board[y][c] = board[y-1][c];
                    }
                }
                for(let c = 0; c < COL; c++){
                        board[0][c] = VACANT;
                }

                //increment the score
                score += 5;
                document.querySelector("#score span").textContent = score;
            }
        }
        drawBoard();
    }
    // move the piece to the right
    moveRight(){
        if(!this.collision(1, 0, this.activeTetromino)){
            this.undrawPiece();
            this.x++;
            this.drawPiece();  
        }
    }

    // move the piece to the left
    moveLeft(){
        if(!this.collision(-1, 0, this.activeTetromino)){
            this.undrawPiece();
            this.x--;
            this.drawPiece();  
        }
    }
    // rotate the piece
    rotate(){
        let nextPatern = this.tetromino[(this.tetrominoN+1)%this.tetromino.length];
        let kick = 0;
        if(this.collision(0, 0, nextPatern)){
            if(this.x > COL/2){
                kick = -1;
            }else{
                kick = 1;
            }
        }  
        if(!this.collision(kick, 0, nextPatern)){
            this.undrawPiece();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN+1)%this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.drawPiece();
        }
    }

    // collision detection
    collision(x, y, piece){
         for(let r = 0; r < piece.length; r++){
            for(let c = 0; c < piece.length; c++){
                // if the square is empty we skip it
                if(!piece[r][c]){
                    continue;
                }

                // the coordinates of the next square 
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if(newX >= COL || newX < 0 || newY >= ROW){
                    return true;
                }
                if(newY < 0){
                    continue;
                }

                // if there is already a locked piece
                if(board[newY][newX] !== VACANT){
                    return true;
                }
            }
        }
        return false;
    }

}

// Generating random piece
function randomPiece(){
    let randomPiece  = Math.floor(Math.random()*PIECES.length);
    return new Piece(PIECES[randomPiece][0], PIECES[randomPiece][1]);
}

let p = randomPiece();

// Controling the piece 
document.addEventListener("keydown", movePiece);
function movePiece(e){
    let key = e.keyCode;
    if(key === 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(key === 38){
        p.rotate();
        dropStart = Date.now();
    }else if(key === 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(key === 40){
        p.moveDown();
    }
}


let dropStart = Date.now();
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        dropStart = now;
        p.moveDown();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}
drop();

playAgain.addEventListener("click", ()=>{
    location.reload();
});

