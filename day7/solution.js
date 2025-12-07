import { parseToLines } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;

const LINES = parseToLines(FILE_PATH);
const SPLITTER = "^";

function getBeamSplitCount() {
    let splits = 0;

    const startPosition = [0, LINES[0].indexOf("S")];

    const maxY = LINES.length;
    const maxX = LINES[0].length;
    const pathsX = [startPosition[1]];

    let x = 0;
    let y = 1;
    while (y < maxY) {
        if (!LINES[y].includes(SPLITTER)) {
            ++y;
            continue;
        }
        if (LINES[y][x] === SPLITTER && pathsX.includes(x)) {
            splits++;
            pathsX.splice(pathsX.indexOf(x), 1);
            if (!pathsX.includes(x - 1)) {
                pathsX.push(x - 1);
            }
            if (!pathsX.includes(x + 1)) {
                pathsX.push(x + 1);
            }
        }
        if (++x === maxX) {
            x = 0;
            ++y;
        }
    }

    return splits;
}

function getTimelineCount() {
    let splits = 0;
    let timelines = 0;

    const maxY = LINES.length;
    const maxX = LINES[0].length;
    const pathsX = {};
    pathsX[LINES[0].indexOf("S")] = 1;

    let x = 0;
    let y = 1;
    let pathBeams;
    while (y < maxY) {
        if (!LINES[y].includes(SPLITTER)) {
            ++y;
            continue;
        }
        if (LINES[y][x] === SPLITTER && pathsX[x]) {
            splits++;
            pathBeams = pathsX[x];
            delete pathsX[x];
            pathsX[x+1] = pathsX[x+1] ? pathsX[x+1] + pathBeams : pathBeams;
            pathsX[x-1] = pathsX[x-1] ? pathsX[x-1] + pathBeams : pathBeams;
        }
        if (++x === maxX) {
            x = 0;
            ++y;
        }
    }

    Object.keys(pathsX).forEach(k => timelines += pathsX[k]);

    return timelines;
}

// console.time("p1 time");
// console.log("part 1:", getBeamSplitCount());
// console.timeEnd("p1 time");

console.time("p2 time");
console.log("part 2:", getTimelineCount());
console.timeEnd("p2 time");
