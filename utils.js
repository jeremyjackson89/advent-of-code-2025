import fs from "node:fs";

export function parseInput(path) {
    return fs.readFileSync(path, "utf8");
}

export function parseToLines(path, separator = "\n") {
    return parseInput(path).split(separator);
}

export function parseToGrid(path, separator = "\n", lineSeparator = "") {
    return parseToLines(path, separator).map((line) => line.split(lineSeparator));
}

export function parseToNumberGrid(path, separator = "\n", lineSeparator = "") {
    return parseToLines(path, separator).map((line) => line.split(lineSeparator).map(Number));
}
