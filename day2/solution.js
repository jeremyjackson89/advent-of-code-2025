import { parseToGrid } from "../utils.js";

function getProductRanges() {
    const useTest = process.argv[2] && process.argv[2] == "test";
    return parseToGrid(process.cwd() + `/day2/input${ useTest ? "Test" : "" }.txt`, ",", "-");
}

function isMadeOfTwoSequences(digitString) {
    if (digitString.length % 2 !== 0) {
        return false;
    }
    const halfSize = digitString.length / 2;
    return digitString.substring(0, halfSize) === digitString.substring(halfSize);
}

function isMadeOfMultipleSequences(digitString) {
    const length = digitString.length;
    const halfSize = Math.floor(length / 2);

    let isMadeOfRepeats = false;
    let substring = "";
    let buildString;

    let i = 0;
    while (i < halfSize && !isMadeOfRepeats) {
        substring += digitString[i];
        buildString = "";
        while (buildString.length < length) {
            buildString += substring;
        }
        isMadeOfRepeats = buildString === digitString;
        i++;
    }
    return isMadeOfRepeats;
}

function isRepeatedSequence(digitString, checkForMultiple = false) {
    return checkForMultiple ? isMadeOfMultipleSequences(digitString) : isMadeOfTwoSequences(digitString);
}

function getSumOfInvalidIDs (checkForMultiple = false) {
    const productRanges = getProductRanges();
    const invalidIDs = [];

    for (const range of productRanges) {
        let i = parseInt(range[0]);
        let max = parseInt(range[1]);

        while (i <= max) {
            if (isRepeatedSequence(i.toString(), checkForMultiple)) {
                invalidIDs.push(i);
            }
            i++;
        }
    }

    return invalidIDs.reduce((acc, val) => acc + val, 0);
}

console.log("part 1:", getSumOfInvalidIDs());
console.log("part 2:", getSumOfInvalidIDs(true));