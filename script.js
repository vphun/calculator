let currentDisplay = "0";
let currentOperation;
let lastDisplay;
let lastOperation;
let tempDisplay;
let tempOperation;

const displayDiv = document.querySelector(".display");

const operations = {
    "%" : x => x/100,
    "+/-" : x => -x,
    "+" : (x, y) => +x + +y,
    "-" : (x, y) => x - y,
    "*" : (x, y) => x * y,
    "/" : (x, y) => x / y,
};

const digits = document.querySelectorAll(".digits");
digits.forEach(digit=>digit.addEventListener("click", e => {
    console.log(e.target.value);
    appendDigit(e.target.value);
}));

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", e => {
    console.log(e.target.value);
    clearMemory();
});

const unaryOps = document.querySelectorAll(".unary");
unaryOps.forEach(operation=>operation.addEventListener("click", e => {
    console.log(e.target.value);
    currentDisplay = operations[e.target.value](currentDisplay);
    updateDisplay();
}));

const binaryOps = document.querySelectorAll(".binary");
binaryOps.forEach(operation=>operation.addEventListener("click", e =>{
    lastOperation = currentOperation;
    currentOperation = e.target.value;
    if (lastOperation) handlePEMDAS();
    lastDisplay = currentDisplay;
    currentDisplay = "";

}));

const equals = document.querySelector("#equals");
equals.addEventListener("click", e => {
    console.log(e.target.value);
    if (currentOperation) {
        currentDisplay = operations[currentOperation](lastDisplay, currentDisplay);
        if (tempDisplay) {
            includeTemp();
        }
        updateDisplay();
        lastDisplay = currentDisplay;
        // TODO: if digit is pressed after equal, then restart currDisplay; else, if operation is pressed after equal, then keep currDisplay same
        currentOperation = "";
    }
});

function storeDisplay(value) {
    lastDisplay = value;
    currentDisplay = "";
}
function appendDigit(digit) {
    if (currentDisplay.length < 9) {
        if (digit == "." && currentDisplay.includes(".")) {
            return;
        }
        else if (currentDisplay == "0") {
            currentDisplay = "";
        }
        currentDisplay += digit;

        updateDisplay();
    }
}

function handlePEMDAS() {
    if ((currentOperation == "*" || currentOperation == "-") && (lastOperation == "+" || lastOperation == "-")) {
        tempDisplay = lastDisplay;
        tempOperation = lastOperation;
        console.log("saving tempdisplay: " + tempDisplay);
        console.log("saving temp operation: " + tempOperation);
    }
    else {
        currentDisplay = operations[lastOperation](lastDisplay, currentDisplay);
        if (tempDisplay && (currentOperation == "+" || currentOperation == "-")) {
            includeTemp();
        }
        updateDisplay();
    }
}

function includeTemp() {
    currentDisplay = operations[tempOperation](tempDisplay, currentDisplay);
    tempDisplay = "";
    tempOperation = "";
}

function updateDisplay() {
    displayDiv.textContent = currentDisplay;
}

function clearMemory() {
    currentDisplay = "0";
    lastDisplay = "";
    lastOperation = "";
    currentOperation = "";
    updateDisplay();
}

// TODO: function to clear memory vs clear screen
function clearScreen() {
    currentDisplay = "0";
    updateDisplay();
}