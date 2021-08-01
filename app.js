document.body.addEventListener("mousedown", (event) => event.preventDefault());

const style = getComputedStyle(document.body);
const boardSize = style.getPropertyValue('--board-size');
const statusMsg = document.getElementsByClassName("status-msg")[0];
const resetBtn = document.getElementsByClassName("reset-btn")[0];
const warningMsg = document.getElementsByClassName("warning")[0];
const board = document.getElementsByClassName("board")[0];
const jsBoardAbstracted = [];
const jsBoardElements = [];

const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;
const EMPTY_SRC = "empty.gif";
const BLACK_SRC = "black.gif";
const WHITE_SRC = "white.gif";
const MSG_BLACKTURN = "Black's turn";
const MSG_WHITETURN = "White's turn";
const MSG_BLACKWIN = "Black wins!";
const MSG_WHITEWIN = "White wins!";
const MSG_DRAW = "Draw!";
const MSG_DEFAULT = MSG_BLACKTURN;
const STATUS_BLACKTURN = 1;
const STATUS_WHITETURN = -1;
const STATUS_BLACKWIN = 2;
const STATUS_WHITEWIN = -2;
const STATUS_DRAW = 0;
const STATUS_DEFAULT = STATUS_BLACKTURN;
const WARNING_ANIMATED = "warning-animated"
const WARNING_TIME = 2300;
const WARNING_NOTEMPTY = "You must place on an empty slot!";
const WARNING_GAMEOVER = "The game is over! Click on <Reset> to restart";

let status = STATUS_DEFAULT;
let warningAnimating = false;
let numEmptySlots = boardSize * boardSize;

init();

function init() {
    for (let i = 0; i < boardSize; i++) {
        const row = document.createElement("div");
        row.classList.add("board-row");
        board.appendChild(row);
        jsBoardAbstracted.push([]);
        jsBoardElements.push([]);
        for (let j = 0; j < boardSize; j++) {
            const col = document.createElement("span");
            col.classList.add("board-col");
            const img = document.createElement("img");
            img.classList.add("board-slot");
            col.appendChild(img);
            row.appendChild(col);
            jsBoardAbstracted[i].push(EMPTY);
            jsBoardElements[i].push(img);
            img.addEventListener("click", () => place(i, j));
        }
    }
    resetBtn.addEventListener("click", () => reset());
    reset();
}

function place(i, j) {
    if (status != STATUS_BLACKTURN && status != STATUS_WHITETURN) {
        showWarning(WARNING_GAMEOVER);
        return;
    } else if (jsBoardAbstracted[i][j] != EMPTY) {
        showWarning(WARNING_NOTEMPTY);
        return;
    } else if (status == STATUS_BLACKTURN) {
        jsBoardAbstracted[i][j] = BLACK;
        jsBoardElements[i][j].src = BLACK_SRC;
    } else {
        jsBoardAbstracted[i][j] = WHITE;
        jsBoardElements[i][j].src = WHITE_SRC;
    }
    numEmptySlots -= 1;
    updateStatus(i, j);
}

function reset() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            status = STATUS_DEFAULT;
            statusMsg.innerText = MSG_DEFAULT;
            jsBoardAbstracted[i][j] = EMPTY;
            jsBoardElements[i][j].src = EMPTY_SRC;
            numEmptySlots = boardSize * boardSize;
        }
    }
}

function showWarning(msg) {
    if (!warningAnimating) {
        warningAnimating = true;
        warningMsg.innerText = msg;
        warningMsg.classList.add(WARNING_ANIMATED);
        setTimeout(() => {
            warningMsg.classList.remove(WARNING_ANIMATED);
            warningAnimating = false;
        }, WARNING_TIME);
    }
}

function updateStatus(i, j) {
    if (isWin(i, j)) {
        status = (status == STATUS_BLACKTURN) ? STATUS_BLACKWIN : STATUS_WHITEWIN;
        statusMsg.innerText = (status == STATUS_BLACKWIN) ? MSG_BLACKWIN : MSG_WHITEWIN;
    } else if (numEmptySlots == 0) {
        status = STATUS_DRAW;
        statusMsg.innerText = MSG_DRAW;
    }
    else if (status == STATUS_BLACKTURN) {
        status = STATUS_WHITETURN;
        statusMsg.innerText = MSG_WHITETURN;
    } else {
        status = STATUS_BLACKTURN;
        statusMsg.innerText = MSG_BLACKTURN;
    }
}

function isWin(i, j) {
    const color = jsBoardAbstracted[i][j];
    const cntNW = cntConsecutive(color, i - 1, j - 1, -1, -1, 0) +
                  cntConsecutive(color, i + 1, j + 1, 1, 1, 0) + 1;
    const cntN  = cntConsecutive(color, i + 1, j, 1, 0, 0) +
                  cntConsecutive(color, i - 1, j, -1, 0, 0) + 1;   
    const cntNE = cntConsecutive(color, i + 1, j - 1, 1, -1, 0) +
                  cntConsecutive(color, i - 1, j + 1, -1, 1, 0) + 1;   
    const cntE  = cntConsecutive(color, i, j - 1, 0, -1, 0) +
                  cntConsecutive(color, i, j + 1, 0, 1, 0) + 1;
    if (cntNW == 5 || cntN == 5 || cntNE == 5 || cntE == 5)
        return true;
    else
        return false;
}

function cntConsecutive(color, i, j, dir_i, dir_j, cnt) {
    if (i < 0 || j < 0 || 
        i >= boardSize || j >= boardSize || 
        jsBoardAbstracted[i][j] != color || cnt > 4)
        return cnt;
    else
        return cntConsecutive(color, i + dir_i, j + dir_j, dir_i, dir_j, cnt + 1);
}
