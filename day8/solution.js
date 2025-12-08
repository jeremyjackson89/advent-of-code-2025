import { parseToNumberGrid } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;

const BOXES = parseToNumberGrid(FILE_PATH, "\n", ",");

function getDistance(box1, box2) {
    return Math.sqrt(
        (box1[0] - box2[0]) * (box1[0] - box2[0]) +
        (box1[1] - box2[1]) * (box1[1] - box2[1]) +
        (box1[2] - box2[2]) * (box1[2] - box2[2])
    );
}

function getProductFromCircuitSizes() {
    const maxShortestConnections = IS_TEST ? 10 : 1000;
    const maxCircuitsToCheck = 3;

    const shortestDistances = [];
    const shortestConnections = {};
    const totalBoxes = BOXES.length;

    let i = 0;
    let j = 1;
    let maxDistance, distance;
    while (i < totalBoxes - 1) {
        distance = getDistance(BOXES[i], BOXES[j]);
        if (shortestDistances.length < maxShortestConnections) {
            shortestDistances.push(distance);
            shortestConnections[distance] = [i, j];
        } else {
            maxDistance = Math.max(...shortestDistances);
            if (distance < maxDistance) {
                shortestDistances.splice(shortestDistances.indexOf(maxDistance), 1);
                delete shortestConnections[maxDistance];
                shortestDistances.push(distance);
                shortestConnections[distance] = [i, j];
            }
        }
        if (++j === totalBoxes) {
            ++i;
            j = i + 1;
        }
    }

    // sort the distances
    shortestDistances.sort((a, b) => a - b);
    // connect the closest boxes and track which boxes are connected to which
    const circuits = [shortestConnections[shortestDistances[0]]];

    let distanceIndex = 1;
    let circuitIndex = 0;
    let [box1, box2] = shortestConnections[shortestDistances[1]];
    let mergedAt = -1;

    while (distanceIndex < shortestDistances.length) {
        // check for existing circuits with either box and merge them
        if (circuits[circuitIndex].indexOf(box1) >= 0 || circuits[circuitIndex].indexOf(box2) >= 0) {
            if (mergedAt >= 0 && circuitIndex != mergedAt) {
                circuits[mergedAt] = circuits[mergedAt].concat(circuits[circuitIndex]);
                circuits.splice(circuitIndex, 1);
            } else {
                circuits[circuitIndex].indexOf(box1) >= 0 ? circuits[circuitIndex].push(box2) : circuits[circuitIndex].push(box1);
                mergedAt = circuitIndex;
            }
            circuits[mergedAt] = [...new Set(circuits[mergedAt])];
        }

        if (++circuitIndex >= circuits.length) {
            if (mergedAt < 0) {
                circuits.push([box1, box2]);
            }
            circuitIndex = 0;
            mergedAt = -1;
            if (++distanceIndex < shortestDistances.length) {
                [box1, box2] = shortestConnections[shortestDistances[distanceIndex]];
            }
        }
    }

    const circuitSizes = circuits.map((circuit) => circuit.length).sort((a, b) => b - a);

    let productOfLargectCircuits = 1;
    for (i = 0; i < maxCircuitsToCheck; i++) {
        productOfLargectCircuits *= circuitSizes[i];
    }
    return productOfLargectCircuits;
}

function getProductFromFinalDistanceX() {
    const shortestDistances = [];
    const shortestConnections = {};
    const totalBoxes = BOXES.length;

    let i = 0;
    let j = 1;
    let distance;
    while (i < totalBoxes - 1) {
        distance = getDistance(BOXES[i], BOXES[j]);
        shortestDistances.push(distance);
        shortestConnections[distance] = [i, j];
        if (++j === totalBoxes) {
            ++i;
            j = i + 1;
        }
    }

    // sort the distances
    shortestDistances.sort((a, b) => a - b);
    // connect the closest boxes and track which boxes are connected to which
    const circuits = [shortestConnections[shortestDistances[0]]];

    let distanceIndex = 1;
    let circuitIndex = 0;
    let [box1, box2] = shortestConnections[shortestDistances[1]];
    let mergedAt = -1;

    while (circuits[0].length !== BOXES.length) {
        // check for existing circuits with either box and merge them
        if (circuits[circuitIndex].indexOf(box1) >= 0 || circuits[circuitIndex].indexOf(box2) >= 0) {
            if (mergedAt >= 0 && circuitIndex != mergedAt) {
                circuits[mergedAt] = circuits[mergedAt].concat(circuits[circuitIndex]);
                circuits.splice(circuitIndex, 1);
            } else {
                circuits[circuitIndex].indexOf(box1) >= 0 ? circuits[circuitIndex].push(box2) : circuits[circuitIndex].push(box1);
                mergedAt = circuitIndex;
            }
            circuits[mergedAt] = [...new Set(circuits[mergedAt])];
        }

        if (++circuitIndex >= circuits.length) {
            if (mergedAt < 0) {
                circuits.push([box1, box2]);
            }
            circuitIndex = 0;
            mergedAt = -1;
            if (++distanceIndex < shortestDistances.length && circuits[0].length !== BOXES.length) {
                [box1, box2] = shortestConnections[shortestDistances[distanceIndex]];
            }
        }
    }

    return BOXES[box1][0] * BOXES[box2][0];
}

// console.time("p1 time");
// console.log("part 1:", getProductFromCircuitSizes());
// console.timeEnd("p1 time");

console.time("p2 time");
console.log("part 2:", getProductFromFinalDistanceX());
console.timeEnd("p2 time");