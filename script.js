// VAR declarations
let currentDisplay = "0";
let currentNumber = "";
let operatorStack = [];
let outputQueue = [];
let answer = [];
// JS listeners and selectors
const displayDiv = document.querySelector(".display");

const operations = {
    "%" : x => x/100,
    "+/-" : x => -x,
    "+" : (x, y) => +x + +y,
    "-" : (x, y) => x - y,
    "*" : (x, y) => x * y,
    "/" : (x, y) => x / y,
};

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", e => {
    console.log(e.target.value);
    if (e.target.value == "=") {
        equals();
    }
    else if (e.target.value == "clear") {
        return;
    }
    else {
        appendDisplay(e.target.value);
    }
}))

function appendDisplay(value) {
    if ('0123456789.'.includes(value)) {
        appendToCurrNumber(value);
    }
    else {
        appendOperator(value);
    }
    updateDisplay();
}

function appendToCurrNumber(value) {
    if (answer.length == 1) {
        answer.pop();
        currentDisplay = "";
    }

    if (currentDisplay.charAt(currentDisplay.length - 2) == '%') {
        appendOperator('*');
    }

    if (currentDisplay == "0" && '0123456789.'.includes(value)) {
        currentDisplay = "";
    }
    if (value == "." && currentNumber.includes('.')) {
        return;
    }
    currentNumber += value;
    currentDisplay += value;
}

const precedence = {
    "%" : 4,
    "*" : 3,
    "/" : 3,
    "+" : 2,
    "-" : 2,
};

function appendOperator(value) {
    if (answer.length == 1) {
        currentNumber = answer[0];
        answer.pop();
    }
    if (currentDisplay.length > 1 && '+-*/'.includes(currentDisplay.charAt(currentDisplay.length - 2))) {
        return;
    }
    if (currentDisplay == "0") {
        currentNumber = "0";
    }
    outputQueue.push(currentNumber);
    currentNumber = "";
    // if (value == "+" || value == "-") {
    //     while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] == "/" || operatorStack[operatorStack.length - 1] == "*") {
    //         let op = operatorStack.pop();
    //         outputQueue.push(op);
    //     }
    // }
    while (operatorStack.length > 0 && precedence[operatorStack[operatorStack.length - 1]] > precedence[value]) {
        let op = operatorStack.pop();
        outputQueue.push(op); 
    }
    if (value == "%") {
        currentDisplay += `% `;
    }
    else{currentDisplay += ` ${value} `;}
    
    operatorStack.push(value);
}

function updateDisplay() {
    displayDiv.textContent = currentDisplay;
}

function equals() {
    if (currentNumber != "") {
    outputQueue.push(currentNumber);
    currentNumber = "";}
    while (operatorStack.length > 0) {
        let op = operatorStack.pop();
        outputQueue.push(op);
    }
    while (outputQueue.length > 0) {
        if (!'+-/*%'.includes(outputQueue[0])) {
            answer.push(outputQueue.shift());
            console.log("outpuequeue: " + outputQueue);
            console.log("answer: " + answer);
        }
        // else if ('%'.includes(outputQueue[0])) {

        //     outputQueue.shift();
        //     console.log("outpuequeue: " + outputQueue);
        //     console.log("answer: " + answer); 
        // }
        else if ('+-/*%'.includes(outputQueue[0])) {
            if ('+-/*'.includes(outputQueue[0])) {
            let y = answer.pop();
            let x = answer.pop();
            console.log("outputQueue[0]: " + outputQueue[0]);
            answer.push(operations[outputQueue[0]](x, y));
            }
            else {
                let x = answer.pop();
                console.log("outputQueue[0]: " + outputQueue[0]);
                answer.push(operations[outputQueue[0]](x));

            }
            outputQueue.shift();
            console.log("outpuequeue: " + outputQueue);
            console.log("answer: " + answer); 
        }

    }
    console.log(answer);
    currentDisplay = answer[0];
    updateDisplay();
}