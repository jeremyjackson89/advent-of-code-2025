import fs from "node:fs";

export function parseInput(path) {
    return fs.readFileSync(path, "utf8");
}

export function parseToLines(path) {
    return parseInput(path).split("\n");
}

export function parseToGrid(path) {
    return parseToLines(path).map((line) => line.split(""));
}
