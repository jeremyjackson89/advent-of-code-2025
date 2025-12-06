import { parseToLines } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;
const INPUT = parseToLines(FILE_PATH);

function getGrandTotal() {
    const problems = INPUT.map((line) => line.match(/[+*]|\d+/g));

    let grandTotal = 0;

    let maxRow = problems.length - 1;
    let maxCol = problems[0].length;

    let col = 0;
    let row = maxRow - 1;
    let result = 0;
    let operator = problems[maxRow][col];
    let currentNum;
    while (col < maxCol) {
        currentNum = parseInt(problems[row][col]);
        result = result < 1 ? currentNum : (operator === "+" ? result + currentNum : result * currentNum);
        row--;
        if (row < 0) {
            grandTotal += result;
            result = 0;
            row = maxRow - 1;
            col++;
            operator = problems[maxRow][col];
        }
    }

    return grandTotal;
}

function getGrandTotalCorrectly() {
    const emptyCols = [];
    const operators = [];
    const operatorLine = INPUT[INPUT.length - 1];
    for (let i = 0; i < operatorLine.length; i++) {
        if (operatorLine[i] === "*" || operatorLine[i] === "+") {
            operators.push(operatorLine[i]);
            if (i > 0) {
                emptyCols.push(i - 1);
            }
        }
    }

    let grandTotal = 0;

    let row = 0;
    let maxRow = INPUT.length - 1;

    let col = INPUT[0].length - 1;
    let opIndex = operators.length - 1;
    let operator = operators[opIndex];
    let result = 0;
    let currentNum;
    let currentNumStr = "";
    while (col > -1) {
        if (INPUT[row][col] != " ") {
            currentNumStr += INPUT[row][col];
        }
        row++;
        if (row === maxRow) {
            currentNum = parseInt(currentNumStr);
            result = result < 1 ? currentNum : (operator === "+" ? result + currentNum : result * currentNum);
            row = 0;
            col--;
            if (emptyCols.indexOf(col) >= 0) {
                grandTotal += result;
                col--;
                result = 0;
                operator = operators[--opIndex];
            }
            currentNumStr = "";
        }
    }
    return grandTotal + result;
}

console.time("p1 time");
console.log("part 1:", getGrandTotal());
console.timeEnd("p1 time");

console.time("p2 time");
console.log("part 2:", getGrandTotalCorrectly());
console.timeEnd("p2 time");
