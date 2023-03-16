const diff = document.querySelector('#diff');

const gameboard = (function(){
    var gameArray = ['_','_','_','_','_','_','_','_','_'];
    var availMoves = [0,1,2,3,4,5,6,7,8];
    var playerX = null;
    var playerO = null;
    var whichTurn = true;
    var gameOn = false;
    var checkIfMoves = () => {
        if (availMoves.length > 0) return true;
        else return false;
    }
    var checkWinners = () => {
        if (gameArray[0] === 'X' && gameArray[3] === 'X' && gameArray[6] === 'X') return 'X';
        else if (gameArray[0] === 'O' && gameArray[3] === 'O' && gameArray[6] === 'O') return 'O';
        else if (gameArray[0] === 'X' && gameArray[1] === 'X' && gameArray[2] === 'X') return 'X';
        else if (gameArray[0] === 'O' && gameArray[1] === 'O' && gameArray[2] === 'O') return 'O';     
        else if (gameArray[0] === 'X' && gameArray[4] === 'X' && gameArray[8] === 'X') return 'X';
        else if (gameArray[0] === 'O' && gameArray[4] === 'O' && gameArray[8] === 'O') return 'O';   
        else if (gameArray[1] === 'X' && gameArray[4] === 'X' && gameArray[7] === 'X') return 'X';
        else if (gameArray[1] === 'O' && gameArray[4] === 'O' && gameArray[7] === 'O') return 'O';   
        else if (gameArray[2] === 'X' && gameArray[5] === 'X' && gameArray[8] === 'X') return 'X';
        else if (gameArray[2] === 'O' && gameArray[5] === 'O' && gameArray[8] === 'O') return 'O'; 
        else if (gameArray[3] === 'X' && gameArray[4] === 'X' && gameArray[5] === 'X') return 'X';
        else if (gameArray[3] === 'O' && gameArray[4] === 'O' && gameArray[5] === 'O') return 'O';
        else if (gameArray[2] === 'X' && gameArray[4] === 'X' && gameArray[6] === 'X') return 'X';
        else if (gameArray[2] === 'O' && gameArray[4] === 'O' && gameArray[6] === 'O') return 'O';
        else if (gameArray[6] === 'X' && gameArray[7] === 'X' && gameArray[8] === 'X') return 'X';
        else if (gameArray[6] === 'O' && gameArray[7] === 'O' && gameArray[8] === 'O') return 'O';
        else return 'N';
    }
    var makeMove = (ind) => {
        if (whichTurn){
            var movePos = playerX.move(ind);
            var moveSign = 'X';
        } else {
            var movePos = playerO.move(ind);
            var moveSign = 'O';
        }
        gameArray[movePos] = moveSign;
        availMoves.splice(availMoves.indexOf(movePos),1);
        squares[movePos].childNodes[1].src = `./${moveSign}.png`;
    }
    var gameOverTie = () => {
        announce.textContent = "Game ends in a tie";
    }
    var gameOverWin = (sign) => {
        announce.textContent = `${sign} wins the game!`;
    }
    var clearBoard = () => {
        squares.forEach(square => square.childNodes[1].src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
        announce.textContent = "";
    }
    var reset = () => {
        if ((playerX.comp && !playerO.comp) || (playerO.comp && !playerX.comp)){
            squares.forEach(square => square.removeEventListener('click', mymoves));
        } else if (!playerX.comp && !playerO.comp){
            squares.forEach(square => square.removeEventListener('click', twoplaymoves));
        }
        for (let i = 0; i < 9; i++) {
            gameArray[i] = '_';
        }
        availMoves.length = 0;
        for (let i = 0; i < 9; i++) {
            availMoves[i] = i;
        }
        playerX = null;
        playerO = null;
        whichTurn = true;
        gameboard.gameOn = false;
    }
    var startGame = (playO, playX) => {
        playerO = playO;
        playerX = playX;
        gameboard.gameOn = true;
        if (playerO.comp && playerX.comp){
            var going = true;
            while (going){
                makeMove(0);
                whichTurn = !whichTurn;
                if (checkWinners() !== 'N') {
                    gameOverWin(checkWinners());
                    going = false;
                    reset();
                } else if (!checkIfMoves()) {
                    gameOverTie();
                    going = false;
                    reset();
                }   
            }
        } else if (playerX.comp){
            makeMove(0);
            whichTurn = !whichTurn
            squares.forEach(square => square.addEventListener('click', mymoves));                
        } else if (playerO.comp){
            squares.forEach(square => square.addEventListener('click', mymoves));
        } else{
            squares.forEach(square => square.addEventListener('click', twoplaymoves))
        }
    }
    var twoplaymoves = (e) =>{
        if (availMoves.includes(parseInt(e.currentTarget.classList[1])-1)){
            makeMove(parseInt(e.currentTarget.classList[1])-1);
            whichTurn = !whichTurn;
            if (checkWinners() !== 'N') {
                gameOverWin(checkWinners());
                reset();
            } else if (!checkIfMoves()) {
                gameOverTie();
                reset();
            }            
        }
    }
    var mymoves = (e) => {
        if (availMoves.includes(parseInt(e.currentTarget.classList[1])-1)){
            makeMove(parseInt(e.currentTarget.classList[1])-1);
            whichTurn = !whichTurn;
            if (checkWinners() !== 'N') {
                gameOverWin(checkWinners());
                reset();
            } else if (!checkIfMoves()) {
                gameOverTie();
                reset();
            } else{
                makeMove(0);
                whichTurn = !whichTurn;
                if (checkWinners() !== 'N') {
                    gameOverWin(checkWinners());
                    reset();
                } else if (!checkIfMoves()) {
                    gameOverTie();
                    reset();
                } 
            }
        }
    }

    return {gameArray, availMoves, playerX, playerO, whichTurn, gameOn, checkIfMoves, checkWinners, makeMove, gameOverTie, gameOverWin, reset, startGame, clearBoard}
    
})();

function createPlayer(sign, comp, diffic){
    return {
        sign: sign,
        comp: comp,
        diffic: diffic,
        medium: false,
        move: (index) => {
            if (comp){
                if (diffic === 'easy') return gameboard.availMoves[Math.floor(Math.random() * gameboard.availMoves.length)];
                else if (diffic == 'hard'){
                    var pot_move = bestmove(sign);
                    if (gameboard.availMoves.includes(pot_move)){
                        return pot_move;
                    } else{
                        return gameboard.availMoves[Math.floor(Math.random() * gameboard.availMoves.length)];
                    }
                } else {
                    var rand = Math.random()*5
                    if(rand < 1) return gameboard.availMoves[Math.floor(Math.random() * gameboard.availMoves.length)];
                    else{
                        var pot_move = bestmove(sign);
                        if (gameboard.availMoves.includes(pot_move)){
                            return pot_move;
                        } else{
                            return gameboard.availMoves[Math.floor(Math.random() * gameboard.availMoves.length)];
                        }
                    }
                }
            } else {
                return index;
            }
        }
    }
}

const userX = document.querySelector('.userX');
const compX = document.querySelector('.compX');
const userO = document.querySelector('.userO');
const compO = document.querySelector('.compO');

const squares = document.querySelectorAll('.area');
const announce = document.querySelector('.announce');
const start = document.querySelector('.start');
const reset = document.querySelector('.reset');

reset.addEventListener('click', () => {
    gameboard.clearBoard();
    if (gameboard.gameOn){
        gameboard.reset();
    }
});

start.addEventListener('click', () => {
    if (!gameboard.gameOn){
        gameboard.clearBoard();
        var difficulty = diff.value;
        if (userX.checked && userO.checked){
            gameboard.startGame(createPlayer('O', false, 0), createPlayer('X', false, 0));
        } else if (userX.checked){
            gameboard.startGame(createPlayer('O', true, difficulty), createPlayer('X', false, 0));
        } else if (userO.checked){
            gameboard.startGame(createPlayer('O', false, 0), createPlayer('X', true, difficulty));
        } else{
            gameboard.startGame(createPlayer('O', true, difficulty), createPlayer('X', true, difficulty));
        }
    }
});

function bestmove(passed_sign){
    var bestVal = passed_sign==='X' ? -1000 : 1000;
    var sign = passed_sign==='X' ? true : false;
    var bestMove = -1
    var copiedBoard = gameboard.gameArray.slice();
    var copiedAvail = gameboard.availMoves.slice();
    for (let i = 0; i < copiedAvail.length; i++){
        var move = copiedAvail[i];
        minmaxmove(sign, move, copiedAvail, copiedBoard);
        var moveVal = minmax(!sign, copiedAvail, copiedBoard);
        undominmaxmove(move, copiedAvail, copiedBoard);
        if ((sign && moveVal > bestVal) || (!sign && moveVal < bestVal)){
            bestVal = moveVal;
            bestMove = move;
        }
    }
    return bestMove;
}

function minmaxmove(moveSign, movePos, copiedAvail, copiedBoard){
    copiedBoard[movePos] = moveSign ? 'X' : 'O';
    copiedAvail.splice(copiedAvail.indexOf(movePos),1);
}

function undominmaxmove(movePos, copiedAvail, copiedBoard){
    copiedBoard[movePos] = '_';
    copiedAvail.push(movePos);
    copiedAvail.sort();
}

function minmax(sign, copiedAvail, copiedBoard){
    score = checkWinnersMM(copiedBoard);
    if (score === 'X') return 10;
    if (score === 'O') return -10;
    if (copiedAvail.length === 0) return 0;
    if (sign){
        var best = -1000;
        for (let i = 0; i < copiedAvail.length; i++){
            var move = copiedAvail[i];
            minmaxmove(sign, move, copiedAvail, copiedBoard);
            best = Math.max(best, minmax(!sign, copiedAvail, copiedBoard));
            undominmaxmove(move, copiedAvail, copiedBoard);
        }
        return best;
    } else{
        var best = 1000;
        for (let i = 0; i < copiedAvail.length; i++){
            var move = copiedAvail[i];
            minmaxmove(sign, move, copiedAvail, copiedBoard);
            best = Math.min(best, minmax(!sign, copiedAvail, copiedBoard));
            undominmaxmove(move, copiedAvail, copiedBoard);
        }
        return best;
    }
}

function checkWinnersMM(gameArray) {
        if (gameArray[0] === 'X' && gameArray[3] === 'X' && gameArray[6] === 'X') return 'X';
        else if (gameArray[0] === 'O' && gameArray[3] === 'O' && gameArray[6] === 'O') return 'O';
        else if (gameArray[0] === 'X' && gameArray[1] === 'X' && gameArray[2] === 'X') return 'X';
        else if (gameArray[0] === 'O' && gameArray[1] === 'O' && gameArray[2] === 'O') return 'O';     
        else if (gameArray[0] === 'X' && gameArray[4] === 'X' && gameArray[8] === 'X') return 'X';
        else if (gameArray[0] === 'O' && gameArray[4] === 'O' && gameArray[8] === 'O') return 'O';   
        else if (gameArray[1] === 'X' && gameArray[4] === 'X' && gameArray[7] === 'X') return 'X';
        else if (gameArray[1] === 'O' && gameArray[4] === 'O' && gameArray[7] === 'O') return 'O';   
        else if (gameArray[2] === 'X' && gameArray[5] === 'X' && gameArray[8] === 'X') return 'X';
        else if (gameArray[2] === 'O' && gameArray[5] === 'O' && gameArray[8] === 'O') return 'O'; 
        else if (gameArray[3] === 'X' && gameArray[4] === 'X' && gameArray[5] === 'X') return 'X';
        else if (gameArray[3] === 'O' && gameArray[4] === 'O' && gameArray[5] === 'O') return 'O';
        else if (gameArray[2] === 'X' && gameArray[4] === 'X' && gameArray[6] === 'X') return 'X';
        else if (gameArray[2] === 'O' && gameArray[4] === 'O' && gameArray[6] === 'O') return 'O';
        else if (gameArray[6] === 'X' && gameArray[7] === 'X' && gameArray[8] === 'X') return 'X';
        else if (gameArray[6] === 'O' && gameArray[7] === 'O' && gameArray[8] === 'O') return 'O';
        else return 'N';
    }