import { parseToNumberGrid } from "../utils.js";

const IS_TEST = process.argv[2] && process.argv[2] == "test";
const DAY = process.env.npm_config_day;
const FILE_PATH = process.cwd() + `/day${ DAY }/input${ IS_TEST ? "Test" : "" }.txt`;

function getJoltage(batteriesNeeded) {
    const batteryBanks = parseToNumberGrid(FILE_PATH);

    let joltage = 0;

    let i, max, maxIndex, end;
    let currentBatteries;
    for (const batteryBank of batteryBanks) {
        max = 0;
        maxIndex = -1;
        currentBatteries = [];
        
        i = 0;
        end = batteryBank.length - (batteriesNeeded - 1);
        while (currentBatteries.length < batteriesNeeded) {
            if (batteryBank[i] > max) {
                max = batteryBank[i];
                maxIndex = i;
            }

            i++;

            if (i === end) {
                currentBatteries.push(max);
                if (currentBatteries.length < batteriesNeeded) {
                    i = maxIndex + 1;
                    max = 0;
                    end++;
                }
            }
        }

        joltage += parseInt(currentBatteries.reduce((acc, val) => acc + val, ""));
    }

    return joltage;
}

// console.log("part 1:", getJoltage(2));
console.log("part 2:", getJoltage(12));

