import { parseToGrid } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;

const ROLL = "@";
const EMPTY = ".";

let ROLL_GRID = parseToGrid(FILE_PATH);

function hasRoll(row, col) {
    return ROLL_GRID[row][col] === ROLL;
}

function getAdjacentCount(row, col, maxRow, maxCol) {
    let adjacentRolls = 0;
    // top
    if (row > 0) {
        if (hasRoll(row - 1, col)) {
            adjacentRolls++;
        }
        // top left
        if (col > 0 && hasRoll(row - 1, col - 1)) {
            adjacentRolls++;
        }
        // top right
        if (col < maxCol && hasRoll(row - 1, col + 1)) {
            adjacentRolls++;
        }
    }
    // left
    if (col > 0 && hasRoll(row, col - 1)) {
        adjacentRolls++;
    }
    // right
    if (col < maxCol && hasRoll(row, col + 1)) {
        adjacentRolls++;
    }
    // bottom
    if (row < maxRow) {
        if (hasRoll(row + 1, col)) {
            adjacentRolls++;
        }
        // bottom left
        if (col > 0 && hasRoll(row + 1, col - 1)) {
            adjacentRolls++;
        }
        // bottom right
        if (col < maxCol && hasRoll(row + 1, col + 1)) {
            adjacentRolls++;
        }
    }
    return adjacentRolls;
}

function getAccessibleRolls() {
    const maxAdjacentRolls = 3;
    const maxRow = ROLL_GRID.length - 1;
    const maxCol = ROLL_GRID[0].length - 1;

    let row = 0;
    let col = 0;
    let accessibleRolls = 0;
    let rollsToRemove = [];
    while (row <= maxRow) {
        if (hasRoll(row, col) && getAdjacentCount(row, col, maxRow, maxCol) <= maxAdjacentRolls) {
            accessibleRolls++;
            rollsToRemove.push([row, col]);
        }
        col++;
        if (col > maxCol) {
            col = 0;
            row++;
        }
    }

    for (const [r, c] of rollsToRemove) {
        ROLL_GRID[r][c] = EMPTY;
    }

    return accessibleRolls;
}

function getTotalRemovable() {
    let totalRemovableRolls = 0;
    let canRemove = true;
    let accessibleRolls;
    while (canRemove) {
        accessibleRolls = getAccessibleRolls();
        canRemove = accessibleRolls > 0;
        totalRemovableRolls += accessibleRolls;
    }
    return totalRemovableRolls;
}

// console.log("part 1:", getAccessibleRolls());
console.log("part 2:", getTotalRemovable());
