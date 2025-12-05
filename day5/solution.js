import { parseToLines } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;
const INPUT = parseToLines(FILE_PATH, "\n\n");

const FRESH_RANGES = INPUT[0].split("\n").map((line) => line.split("-").map(Number));
const AVAILABLE_IDS = INPUT[1].split("\n").map(Number);

function getAvailableFreshCount() {
    let totalFresh = 0;

    let rangeIndex = 0;
    let maxRangeIndex = FRESH_RANGES.length;

    let availableIndex = 0;
    let maxAvailableIndex = AVAILABLE_IDS.length;

    let range;
    let isFresh;
    let availableID = AVAILABLE_IDS[0];
    while (availableIndex < maxAvailableIndex) {
        range = FRESH_RANGES[rangeIndex];
        isFresh = availableID >= range[0] && availableID <= range[1];
        totalFresh += isFresh ? 1 : 0;

        rangeIndex++;
        if (rangeIndex == maxRangeIndex || isFresh) {
            rangeIndex = 0;
            availableIndex++;
            availableID = AVAILABLE_IDS[availableIndex];
        }
    }

    return totalFresh;
}

function getFreshIdCount() {
    FRESH_RANGES.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const mergedRanges = [FRESH_RANGES[0]];
    
    let i = 1;
    let previousRange = FRESH_RANGES[0];
    while (i < FRESH_RANGES.length) {
        if (FRESH_RANGES[i][0] > previousRange[1]) {
            previousRange = FRESH_RANGES[i];
            mergedRanges.push(previousRange);
        } else if (FRESH_RANGES[i][1] > previousRange[1]) {
            previousRange[1] = FRESH_RANGES[i][1];
        }
        i++;
    }

    return mergedRanges.reduce((acc, val) => acc + 1 + val[1] - val[0], 0);
}

console.time("p1 time");
console.log("part 1:", getAvailableFreshCount());
console.timeEnd("p1 time");

console.time("p2 time");
console.log("part 2:", getFreshIdCount());
console.timeEnd("p2 time");
