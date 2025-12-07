import { parseToLines } from "../utils.js";

const maxPositions = 100;

function getRotations() {
    const useTest = process.argv[2] && process.argv[2] == "test";
    return parseToLines(process.cwd() + `/day1/input${ useTest ? "Test" : "" }.txt`);
}

function part1() {
    const rotations = getRotations();
    let turns;
    let direction;
    let zeroCounter = 0;
    let dialPosition = 50;

    for (const rotation of rotations) {
        direction = rotation[0] == "L" ? -1 : 1;
        turns = parseInt(rotation.substring(1));
        dialPosition = (dialPosition + (direction * turns) + maxPositions) % maxPositions;
        zeroCounter += dialPosition == 0 ? 1 : 0;
    }

    return zeroCounter;
}

function part2() {
    const rotations = getRotations();

    let turns;
    let direction;
    let zeroCounter = 0;
    let dialPosition = 50;
    let fullRotations;
    let lastDialPosition;

    for (const rotation of rotations) {
        direction = rotation[0] == "L" ? -1 : 1;
        turns = parseInt(rotation.substring(1));

        lastDialPosition = dialPosition;
        fullRotations = Math.floor(turns / 100);

        dialPosition = dialPosition + (direction * (turns % maxPositions));

        if (dialPosition < 0 || dialPosition >= maxPositions) {
            dialPosition += (maxPositions * (dialPosition < 0 ? 1 : -1));
            zeroCounter += (lastDialPosition !== 0 && dialPosition !== 0) ? 1 : 0;
        }

        zeroCounter += (dialPosition == 0 ? 1 : 0) + fullRotations;
    }

    return zeroCounter;
}

// console.log(part1());
console.log(part2());