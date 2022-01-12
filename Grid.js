"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Grid_numRow, _Grid_numCol, _Grid_grid, _Grid_coolDown;
class Grid {
    /**
     * Constructs a Grid with the given dimensions, and render it on the display
     * @constructor
     *
     * @param {number} row  The number of rows for this Grid
     * @param {number} column  The number of columns for this Grid
     * @param {HTMLDivElement} element  The HTML div element to render this Grid on
     */
    constructor(row, column, element) {
        //Number of rows in a Grid object
        _Grid_numRow.set(this, void 0);
        //Number of columns in a Grid object
        _Grid_numCol.set(this, void 0);
        //2D Tile array representing the Grid object
        _Grid_grid.set(this, void 0);
        //Test
        _Grid_coolDown.set(this, void 0);
        __classPrivateFieldSet(this, _Grid_numRow, row, "f");
        __classPrivateFieldSet(this, _Grid_numCol, column, "f");
        __classPrivateFieldSet(this, _Grid_grid, [], "f");
        __classPrivateFieldSet(this, _Grid_coolDown, 3, "f");
        this.makeGrid(__classPrivateFieldGet(this, _Grid_numRow, "f"), __classPrivateFieldGet(this, _Grid_numCol, "f"), element);
        console.log(__classPrivateFieldGet(this, _Grid_grid, "f"));
    }
    //Initializes the 2D Grid object by creating (row * col) Tile objects
    makeGrid(row, col, element) {
        for (let r = 0; r < row; r++) {
            let rowOfTiles = [];
            for (let c = 0; c < col; c++) {
                rowOfTiles.push(new Tile(element));
            }
            __classPrivateFieldGet(this, _Grid_grid, "f").push(rowOfTiles);
            element.appendChild(document.createElement("br"));
        }
    }
    /**
     * Updates the display to reflect the current state of its Tiles
     */
    display() {
        for (let row of __classPrivateFieldGet(this, _Grid_grid, "f")) {
            for (let tile of row) {
                tile.display();
            }
        }
    }
    //Checks if the current Tile can be moved down
    moveTileDown(tileRow, tileCol) {
        var grid = __classPrivateFieldGet(this, _Grid_grid, "f");
        var validLocation = this.isValidLocation(tileRow + 1, tileCol);
        if (!validLocation)
            return false;
        var empty = grid[tileRow + 1][tileCol].isEmpty();
        // console.log("the next tile is a valid location: " + validLocation);
        // console.log("the next tile is empty: " + empty);
        console.log("moving tile down");
        if (!empty)
            return false; //Checks if Tile[row+1][col] is out of bounds or empty
        else {
            console.log('preparing to swap tiles');
            grid[tileRow + 1][tileCol].swap(grid[tileRow][tileCol]); //Swaps the current [row][col] with [row+1][col]
            return true;
        }
    }
    //Checks if the current Tile can be merged right
    mergeTileRight(tileRow, tileCol) {
        return false;
    }
    mergeTilesDown(condition) { return 0; }
    mergeTilesLeft(condition) { return 0; }
    mergeTilesRight(condition) { return 0; }
    dropRandomNumber() {
        var grid = __classPrivateFieldGet(this, _Grid_grid, "f");
        var randomColumn = Math.floor((Math.random() * __classPrivateFieldGet(this, _Grid_numCol, "f"))); //Generates a number in interval [0,this.#numCol-1]
        if ((!grid[0][randomColumn].isEmpty()))
            return false; //If the first row of the chosen column is not empty, the player loses
        else {
            let randomNumber = Math.floor((Math.random() * 3) + 1); //Generates number in interval [1,3]
            let randomColor = Tile.getAvailableColors()[Math.floor((Math.random() * Tile.getAvailableColors().length))]; //Generates a number in interval [0,Tile.availableColors().length-1]
            console.log(randomColumn, randomColor, randomNumber);
            //Update the first Tile object in row 1 to the randomly generated Tile properties
            grid[0][randomColumn].setColor(randomColor);
            grid[0][randomColumn].setNumber(randomNumber);
            grid[0][randomColumn].setShape("square");
            grid[0][randomColumn].display();
            //Begin to drop the Tile object starting at the next row 
            let currRow = 0;
            let currCol = randomColumn;
            let dropInterval = setInterval(() => {
                console.log("testing drop interval with row: " + currRow);
                if ((!this.moveTileDown(currRow, currCol))) {
                    console.log("interval is cleared");
                    setTimeout(() => this.dropRandomNumber(), 3000);
                    clearInterval(dropInterval);
                }
                else {
                    this.moveTileDown(currRow, currCol);
                    this.display();
                    currRow++;
                }
            }, 1000);
            return true;
        }
    }
    //Checks if a Tile object’s row/col values are out of bounds
    isValidLocation(tileRow, tileCol) {
        return ((tileRow >= 0 && tileRow <= __classPrivateFieldGet(this, _Grid_numRow, "f") - 1) && (tileCol >= 0 && tileCol <= __classPrivateFieldGet(this, _Grid_numCol, "f") - 1));
    }
    //Empties (sets to default values) each Tile object
    clear() {
        var grid = __classPrivateFieldGet(this, _Grid_grid, "f");
        grid.forEach(function (row) {
            row.forEach(function (tile) {
                tile.empty();
            });
        });
        this.display();
    }
}
_Grid_numRow = new WeakMap(), _Grid_numCol = new WeakMap(), _Grid_grid = new WeakMap(), _Grid_coolDown = new WeakMap();
/*
When the game begins, drop a tile and when it touches the floor,
let the cooldown begin. After the cooldown, keep dropping tile.
*/
//# sourceMappingURL=Grid.js.map