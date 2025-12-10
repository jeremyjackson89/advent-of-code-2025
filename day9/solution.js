import { parseToNumberGrid } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;

const RED_TILES = parseToNumberGrid(FILE_PATH, "\n", ",");

function getRectangleArea(vec1, vec2) {
    return (Math.abs(vec1[0] - vec2[0]) + 1) * (Math.abs(vec1[1] - vec2[1]) + 1);
}

function getLargestAreaRectangle() {
    let largestArea = 0;
    let i = 0;
    let j = 1;
    let end = RED_TILES.length - 1;
    let currentTile = RED_TILES[i];
    let area;
    while (i < end) {
        if ((area = getRectangleArea(currentTile, RED_TILES[j])) > largestArea) {
            largestArea = area;
        }
        if (++j > end) {
            currentTile = RED_TILES[++i];
            j = i + 1;
        }
    }
    return largestArea;
}

function isPointOnBoundary(point, polygonPoint1, polygonPoint2) {
    const [pointX, pointY] = point;
    const [polygonX1, polygonY1] = polygonPoint1;
    const [polygonX2, polygonY2] = polygonPoint2;

    // collinear?
    const crossProduct = (pointX - polygonX1) * (polygonY2 - polygonY1) - (pointY - polygonY1) * (polygonX2 - polygonX2);
    if (Math.abs(crossProduct) > Number.EPSILON) {
        return false;
    }

    const minX = Math.min(polygonX1, polygonX2);
    const maxX = Math.max(polygonX1, polygonX2);
    const minY = Math.min(polygonY1, polygonY2);
    const maxY = Math.max(polygonY1, polygonY2);
    return (pointX >= minX && pointX <= maxX) && (pointY >= minY && pointY <= maxY);
}

function isPointInPolygon(point) {
    const [pointX, pointY] = point;
    const totalVertices = RED_TILES.length;

    let isInside = false
    let polygonX1, polygonY1;
    let polygonX2, polygonY2;
    let doesIntersect;

    for (let i = 0; i < totalVertices; i++) {
        [polygonX1, polygonY1] = RED_TILES[i];
        [polygonX2, polygonY2] = RED_TILES[(i + 1) % totalVertices];

        if (isPointOnBoundary(point, [polygonX1, polygonY1], [polygonX2, polygonY2])) {
            return true;
        }

        if (Math.abs(polygonY2 - polygonY1) < Number.EPSILON) {
            continue;
        }

        doesIntersect = (pointX < ((polygonX2 - polygonX1) * (pointY - polygonY1)) / (polygonY2 - polygonY1) + polygonX1);

        if (doesIntersect) {
            isInside = !isInside;
        }
    }

    return isInside;
}

function isSamePoint(vec1, vec2) {
    return vec1[0] === vec2[0] && vec1[1] === vec2[1];
}

function isOnSegment(pointA, pointB, pointC) {
    if (isSamePoint(pointB, pointA) || isSamePoint(pointB, pointC)) {
        return false;
    }

    return (
        pointB[0] <= Math.max(pointA[0], pointC[0]) &&
        pointB[0] >= Math.min(pointA[0], pointC[0]) &&
        pointB[1] <= Math.max(pointA[1], pointC[1]) &&
        pointB[1] >= Math.min(pointA[1], pointC[1])
    );
}

// 0 => collinear, 1 => clockwise, 2 => counterclockwise
function getOrientation (pointA, pointB, pointC) {
    const crossProduct = (pointB[1] - pointA[1]) * (pointC[0] - pointB[0]) - (pointB[0] - pointA[0]) * (pointC[1] - pointB[1]);
    return crossProduct === 0 ? 0 : (crossProduct > 0 ? 1 : 2);
}

function doesShareVertex(pointsLine1, pointsLine2) {
    const [lineStartA, lineEndA] = pointsLine1;
    const [lineStartB, lineEndB] = pointsLine2;

    return (
        isSamePoint(lineStartA, lineStartB) ||
        isSamePoint(lineStartA, lineEndB) ||
        isSamePoint(lineEndA, lineStartB) ||
        isSamePoint(lineEndA,lineEndB)
    );
}

function doLinesIntersect(pointsLine1, pointsLine2) {
    const [lineStartA, lineEndA] = pointsLine1;
    const [lineStartB, lineEndB] = pointsLine2;

    const orientation1 = getOrientation(lineStartA, lineEndA, lineStartB);
    const orientation2 = getOrientation(lineStartA, lineEndA, lineEndB);
    const orientation3 = getOrientation(lineStartB, lineEndB, lineStartA);
    const orientation4 = getOrientation(lineStartB, lineEndB, lineEndA);

    // lines intersect
    if (
        orientation1 != 0 && orientation2 != 0 &&
        orientation3 != 0 && orientation4 != 0 &&
        orientation1 != orientation2 &&
        orientation3 != orientation4 &&
        !doesShareVertex(pointsLine1, pointsLine2)
    ) {
        return true;
    }

    return false;
}

function hasAllLinesInPolygon(topLeft, topRight, bottomLeft, bottomRight) {
    const rectLinesPoints = [
        [topLeft, topRight],
        [topRight, bottomRight],
        [bottomRight, bottomLeft],
        [bottomLeft, topLeft]
    ];

    const totalVertices = RED_TILES.length;
    let i = 0;
    let rectLineIndex = 0;
    let currentLinePoints = [RED_TILES[i], RED_TILES[(i + 1) % totalVertices]];
    while (i < totalVertices) {
        if (doLinesIntersect(rectLinesPoints[rectLineIndex], currentLinePoints)) {
            return false;
        }
        if (++rectLineIndex === rectLinesPoints.length) {
            rectLineIndex = 0;
            currentLinePoints = [RED_TILES[++i], RED_TILES[(i + 1) % totalVertices]];
        }
    }
    return true;
}

function isRectInPolygon(tile1, tile2) {
    const topLeft = [Math.min(tile1[0], tile2[0]), Math.min(tile1[1], tile2[1])];
    const topRight = [Math.max(tile1[0], tile2[0]), Math.max(tile1[1], tile2[1])];
    const bottomLeft = [Math.min(tile1[0], tile2[0]), Math.max(tile1[1], tile2[1])];
    const bottomRight = [Math.max(tile1[0], tile2[0]), Math.min(tile1[1], tile2[1])];

    return (
        isPointInPolygon(topLeft) &&
        isPointInPolygon(topRight) &&
        isPointInPolygon(bottomRight) &&
        isPointInPolygon(bottomLeft) &&
        hasAllLinesInPolygon(topLeft, topRight, bottomLeft, bottomRight)
    );
}

function getLargestAreaRectangleRG() {
    let largestArea = 0;
    let i = 0;
    let j = 1;
    let end = RED_TILES.length - 1;
    let currentTile = RED_TILES[i];
    let area;
    while (i < end) {
        if (isRectInPolygon(currentTile, RED_TILES[j])) {
            area = getRectangleArea(currentTile, RED_TILES[j]);
            if (area > largestArea) {
                largestArea = area;
            }
        }
        if (++j > end) {
            currentTile = RED_TILES[++i];
            j = i + 1;
        }
    }
    return largestArea;
}

// console.time("p1 time");
// console.log("part 1:", getLargestAreaRectangle());
// console.timeEnd("p1 time");

console.time("p2 time");
console.log("part 2:", getLargestAreaRectangleRG());
console.timeEnd("p2 time");