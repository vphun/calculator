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
    "=" : (x, y) => y,
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
binaryOps.forEach(operation=>operation.addEventListener("click", e => {
    clickOperator(e.target.value);
}));

document.addEventListener("keydown", e => {
    console.log(e.keyCode);
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 190) {
        appendDigit(e.key);
    }
    else if (e.key in operations) {
        storeDisplay(e.key);
    }
    else if (e.keyCode == "8") {
        deleteDigit();
    }
})

const equals = document.querySelector("#equals");
equals.addEventListener("click", e => {
    console.log(e.target.value);
    console.log(currentOperation);
    console.log(lastDisplay);
    console.log(currentDisplay);
    if (currentOperation) {
        
        compute(currentOperation, lastDisplay, currentDisplay);
        console.log("after current: " + currentDisplay);
        console.log("after last: " + lastDisplay);
        // TODO: if digit is pressed after equal, then restart currDisplay; else, if operation is pressed after equal, then keep currDisplay same
        // currentOperation = "";
        // lastOperation = "";
        // currentDisplay = "";
    }
});

function storeDisplay() {
    lastDisplay = currentDisplay;
    currentDisplay = "";
}

function storeOperator(operation) {
    lastOperation = currentOperation;
    currentOperation = operation;
}

function clickOperator(operation) {
    storeOperator(operation);
    if (lastOperation) handlePEMDAS();
    storeDisplay();
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

function deleteDigit(digit) {
    if (currentDisplay.length > 0) {
        currentDisplay = currentDisplay.slice(0, -1);
        if (currentDisplay.length == 0) {
            currentDisplay = "0";
        }
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

function compute(operation, x, y) {
    currentDisplay = operations[operation](x, y);
    if (tempDisplay) {
        includeTemp();
    }
    updateDisplay();
    lastDisplay = "";
    currentOperation = "";
    lastOperation = "";
}


function pressedEqual() {

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