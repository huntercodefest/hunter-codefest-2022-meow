let currentCondition: MergeCondition; //Testing
let grid: Grid;
let score: number;
let ongoing: boolean;
let paused: boolean;
let currentTimeout: Timeout;

let touchX: number;
let touchY: number;

let pausedByButton = false;

/**
 * Sets up the page
 */
function initializeGame(): void {
    //set up the grid
    grid = new Grid(8, 8, <HTMLDivElement>(document.getElementById("grid")));
    startGame();

    //touch event
    window.addEventListener("touchstart", swipeHandler);
    window.addEventListener("touchend", swipeHandler);

    //autopause
    window.addEventListener("blur", function () { togglePause(false); });
    window.addEventListener("focus", function () { togglePause(false); });

    //scoreboard stuff
    if (!localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", score.toString());
    }
    displayScore(score, parseInt(<string>localStorage.getItem("highscore")));
}

function startGame(): void {
    score = 0;
    ongoing = true;
    paused = false;
    (<HTMLButtonElement>document.getElementById("pause")).innerText = "Pause";
    changeCondition();
    configureDropInterval();
}

/**
 * Ends the current game, and starts a new one
 */
function reset(): void {
    if (confirm("Are you sure you want to start a new game?")) {
        console.log("user consented to restart");

        currentTimeout.clear();
        grid.clear();
        score = 0;
        gameOver();
        startGame();
    }
}

/**
 * Handles keypresses
 * @param {KeyboardEvent} e Details on the keypress
 */
function keyHandler(e: KeyboardEvent): void {
    if (ongoing && !paused) {
        if (e.key == "ArrowDown") {
            console.log("down key pressed");
            grid.mergeTilesDown(currentCondition);
        } else if (e.key == "ArrowLeft") {
            console.log("left key pressed");
            grid.mergeTilesLeft(currentCondition);
        } else if (e.key == "ArrowRight") {
            console.log("right key pressed");
            grid.mergeTilesRight(currentCondition);
        }
    }
}

/**
 * Handles swipes
 * 
 * inspiration: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
 * @param {TouchEvent} e Details on the touch
 */
function swipeHandler(e: TouchEvent): void {
    if (ongoing && !paused) {
        if (e.type == "touchstart") {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
        } else if (e.type == "touchend") {
            let xDiff = e.changedTouches[0].clientX - touchX;
            let yDiff = e.changedTouches[0].clientY - touchY;

            if (Math.abs(xDiff) > Math.abs(yDiff)) { //horizontal swipe
                if (xDiff > 0) {
                    console.log("swiped right");
                    grid.mergeTilesRight(currentCondition);
                } else {
                    console.log("swiped left");
                    grid.mergeTilesLeft(currentCondition);
                }
            } else {
                if (yDiff > 0) {
                    console.log("swiped down");
                    grid.mergeTilesDown(currentCondition);
                }
            }
        }
    }
}

/**
 * Changes the current merge condition
 */
function changeCondition(): void {
    currentCondition = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];

    printOnMessageBoard(currentCondition.toString());
}

/**
 * Prints a message on the message board
 * @param {string} message The message to print
 */
function printOnMessageBoard(message: string): void {
    (<HTMLDivElement>document.getElementById("condition")).innerText = message;
}

/**
 * Displays scores on the scoreboard
 * @param {number} current The current score
 * @param {number} highscore The high score
 */
function displayScore(current: number, highscore: number): void {
    (<HTMLSpanElement>document.getElementById("score")).innerText = current.toString();
    (<HTMLSpanElement>document.getElementById("highscore")).innerText = highscore.toString();
}

function configureDropInterval(): void {
    var delay = grid.dropRandomNumber(); //The first Tile dropped should not have a cooldown
    if (delay === false) gameOver();
    dropInterval(<number>delay);
}

function dropInterval(delay: number | boolean): void {
    currentTimeout = new Timeout(() => {
        delay = grid.dropRandomNumber();
        changeCondition();
        if (delay === false) {
            gameOver();
        }
        else {
            dropInterval(delay);
        }
    }, <number>delay);
}

function gameOver(): void {
    ongoing = false;
    printOnMessageBoard("Game over");
    if (score > parseInt(<string>localStorage.getItem("highscore"))) {
        localStorage.setItem("highscore", score.toString());
    }
    displayScore(score, parseInt(<string>localStorage.getItem("highscore")));
}

/**
 * Opens instructions.html in a new tab
 */
function openInstructions() {
    open("instructions.html", "_blank");
}

/**
 * Toggles the pause state of the game
 * 
 * @param {boolean} userPaused  True if the pause was manually requested by user
 */
function togglePause(userPaused: boolean): void {
    if (ongoing) {
        if (paused) { //resume
            if (userPaused && pausedByButton || !pausedByButton) { //manual pause require manual unpause
                paused = false;
                printOnMessageBoard(currentCondition.toString());
                (<HTMLButtonElement>document.getElementById("pause")).innerText = "Pause";
                currentTimeout.resume();
                grid.resumeDrop();
            }
        } else { //pause
            pausedByButton = userPaused;
            paused = true;
            printOnMessageBoard("Paused");
            (<HTMLButtonElement>document.getElementById("pause")).innerText = "Resume";
            currentTimeout.pause();
            grid.pauseDrop();
        }
    }
}