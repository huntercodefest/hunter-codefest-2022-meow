let currentCondition: MergeCondition;
let grid: Grid;
let score: number;
let ongoing: boolean;

let touchX: number;
let touchY: number;

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

    //scoreboard stuff
    if (!localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", score.toString());
    }
}

function startGame(): void {
    score = 0;
    ongoing = true;
    grid.dropRandomNumber();
}

/**
 * Ends the current game, and starts a new one
 */
function reset(): void {
    if (confirm("Are you sure you want to start a new game?")) {
        console.log("user consented to restart");
    }
}

/**
 * Handles keypresses
 * @param {KeyboardEvent} e Details on the keypress
 */
function keyHandler(e: KeyboardEvent): void {
    if (e.key == "ArrowDown") {
        console.log("down key pressed");
    } else if (e.key == "ArrowLeft") {
        console.log("left key pressed");
    } else if (e.key == "ArrowRight") {
        console.log("right key pressed");
    }
}

/**
 * Handles swipes
 * @param {TouchEvent} e Details on the touch
 */
function swipeHandler(e: TouchEvent): void {
    if (e.type == "touchstart") {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    } else if (e.type == "touchend") {
        let xDiff = e.changedTouches[0].clientX - touchX;
        let yDiff = e.changedTouches[0].clientY - touchY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) { //horizontal swipe
            if (xDiff > 0) {
                console.log("swiped right");
            } else {
                console.log("swiped left");
            }
        } else {
            if (yDiff > 0) {
                console.log("swiped down");
            }
        }
    }
}