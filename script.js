let currentDisplay = "0";
let currentOperation;
let lastDisplay;
let lastOperation;
let tempDisplay;
let tempOperation;

const displayDiv = document.querySelector(".display");

const operations = {
    "%" : percentToDecimal,
    "+/-" : switchSign,
    "+" : add,
    "-" : subtract,
    "*" : multiply,
    "/" : divide,
};

const digits = document.querySelectorAll(".digits button");
digits.forEach(digit=>digit.addEventListener("click", e => {
    console.log(e.target.value);
    if (currentDisplay == "0") {
        currentDisplay = "";
    }
    currentDisplay += e.target.value;
    updateDisplay();
}));

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", e => {
    console.log(e.target.value);
    clearScreen();
})

const unaryOps = document.querySelectorAll(".unary button");
unaryOps.forEach(operation=>operation.addEventListener("click", e => {
    console.log(e.target.value);
    currentDisplay = operations[e.target.value](currentDisplay);
    updateDisplay();
}));

const binaryOps = document.querySelectorAll(".binary button");
binaryOps.forEach(operation=>operation.addEventListener("click", e =>{
    lastOperation = currentOperation;
    currentOperation = e.target.value;
    console.log(currentOperation);
    console.log("lastDisplay before if" + lastDisplay);
    if (lastOperation) {
        console.log("lastDisplay in if" + lastDisplay);
        if (currentOperation == lastOperation) {
            currentDisplay = operations[currentOperation](lastDisplay, currentDisplay);
            updateDisplay();
        }
        else {
            if (currentOperation == "+" || currentOperation == "-") {
                currentDisplay = operations[lastOperation](lastDisplay, currentDisplay);
                if (tempDisplay) {
                    console.log("temp!" + tempDisplay + tempOperation);
                    currentDisplay = operations[tempOperation](tempDisplay, currentDisplay);
                    tempDisplay = "";
                    tempOperation = "";
                }
                updateDisplay();
            }
            else {
                tempDisplay = lastDisplay;
                tempOperation = lastOperation;
                console.log("saving tempdisplay" + tempDisplay);
                console.log("saving temp operation" + tempOperation);
            }

        }
    }
    lastDisplay = currentDisplay;
    currentDisplay = "";

}));

const equals = document.querySelector("#equals");
equals.addEventListener("click", e => {
    console.log(e.target.value);
    currentDisplay = operations[currentOperation](lastDisplay, currentDisplay);
    if (tempDisplay) {
        console.log("temp!" + tempDisplay + tempOperation);
        currentDisplay = operations[tempOperation](tempDisplay, currentDisplay);
        tempDisplay = "";
        tempOperation = "";
    }
    updateDisplay();
})

function updateDisplay() {
    
    displayDiv.textContent = currentDisplay;
}

function clearScreen() {
    currentDisplay = "0";
    lastDisplay = "";
    lastOperation = "";
    currentOperation = "";
    updateDisplay();
}

function add(x, y) {
    return +x + +y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

function switchSign(x) {
    return -x;
}

function percentToDecimal(x) {
    return x/100;
}

function unaryOperate(op, x) {
    return op(x);
}

function binaryOperate(op, x, y) {
    return op(x, y);
}