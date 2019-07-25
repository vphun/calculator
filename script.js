// variable declarations
let currentDisplay = "0";
let currentNumber = "";
let answer;

const operations = {
    "%" : x => x/100,
    "+" : (x, y) => +x + +y,
    "-" : (x, y) => x - y,
    "*" : (x, y) => x * y,
    "/" : (x, y) => x / y,
};

const precedence = {
    "%" : 4,
    "*" : 3,
    "/" : 3,
    "+" : 2,
    "-" : 2,
};

const buttonMap = {
    "=" : equals,
    "clear" : clearMemory,
    "del" : del
};

// JS listeners and selectors
const displayDiv = document.querySelector(".display");
const equationDiv = document.querySelector(".equation");
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", e => {
    e.target.value in buttonMap ? buttonMap[e.target.value]() : appendDisplay(e.target.value);
    updateDisplay();
}));

// Functions
function updateDisplay() {
    displayDiv.textContent = currentDisplay;
}

function appendDisplay(value) {
    '0123456789.'.includes(value) ? appendDigit(value) : appendOperator(value);
    // updateDisplay();
}

function appendDigit(digit) {
    // if '=' key was hit previously
    if (answer) {
        equationDiv.textContent = `Ans = ${answer}`;
        clearMemory();
    }

    // start new input
    if (currentDisplay == "0") {
        currentDisplay = "";
    }

    // if a number key is hit after '%', then suggest multiplication
    if (currentDisplay[currentDisplay.length - 1] == '%') {
        appendOperator('*');
    }

    if (digit == ".") {
        // append 0 before decimal if no whole number specified
        if (currentNumber == "") {
            currentNumber = "0";
            currentDisplay += "0";
        }
        // check if current number already contains decimal
        else if (currentNumber.includes('.')) {
            return;
        }
    }

    currentNumber += digit;
    currentDisplay += digit;
}

function appendOperator(operator) {
    // if '=' key was hit previously
    if (answer) {
        equationDiv.textContent = `Ans = ${answer}`;
        answer = "";
    }
    
    // reset currentNumber
    currentNumber = "";

    // check if last input was also operation and change
    if (
        currentDisplay.length > 1
        && '+-*/'.includes(currentDisplay[currentDisplay.length - 2])
    ) {
        currentDisplay = currentDisplay.slice(0, -3);
    }

    operator == "%" ? currentDisplay += "%" : currentDisplay += ` ${operator} `;
}

function currStrToArr() {
    let currentDisplayArray = [""];
    for (let i = 0; i < currentDisplay.length; i++) {
        if (currentDisplay[i] != " "){
            if ('+-/*%'.includes(currentDisplay[i])) {  // operators
                currentDisplayArray.push(currentDisplay[i]);
                if ('+-/*'.includes(currentDisplay[i])) {  // no %
                    currentDisplayArray.push("");
                }
            }
            else {  // numbers
                currentDisplayArray[currentDisplayArray.length - 1] += currentDisplay[i];
            }
        }
    }
    return currentDisplayArray;
}

function infixToPostfix(infixArr) {
    let operatorStack = [];
    let outputQueue = [];

    for (let i = 0; i < infixArr.length; i++) {
        if (!'+-/*%'.includes(infixArr[i])) {  // numbers go directly to queue
            outputQueue.push(infixArr[i]);
        }
        else {  // operators
            // pop from operatorStack to outputQueue if top of stack is higher precedence
            while (
                operatorStack.length > 0
                && precedence[operatorStack[operatorStack.length - 1]]
                >= precedence[infixArr[i]]
            ) {
                outputQueue.push(operatorStack.pop()); 

                // prioritize  %+ and %-
                if (outputQueue[outputQueue.length - 1] == "%") {
                    if (
                        operatorStack[operatorStack.length - 1] == "+"
                        || operatorStack[operatorStack.length - 1] == "-"
                    ) {
                        outputQueue.push(operatorStack.pop());
                    }
                }
            }

            operatorStack.push(infixArr[i]);
        }
    }

    // pop rest of operatorStack to outputQueue
    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }
    return outputQueue;
}

function calculatePostfix(postfixArr) {
    let answerStack = [];

    while (postfixArr.length > 0) {
        if (!'+-/*%'.includes(postfixArr[0])) {  // numbers go to answerStack
            answerStack.push(postfixArr.shift());
        }
        else if ('+-/*%'.includes(postfixArr[0])) {  // operations
            if ('+-/*'.includes(postfixArr[0])) {  // binary operators (no %)
                let y = answerStack.pop();
                let x = answerStack.pop();
                answerStack.push(operations[postfixArr[0]](x, y));
            }
            else { // %
                let x = answerStack.pop();
                answerStack.push(operations[postfixArr[0]](x));

                // handle %+ and %-: x +/- y% = x * (1 +/- y/100)
                if (postfixArr[1] == "+" || postfixArr[1] == "-") {
                    postfixArr.shift();
                    let y = operations[postfixArr[0]](1, answerStack.pop());
                    let x = answerStack.pop();
                    answerStack.push(operations["*"](x, y));
                }

            }
            postfixArr.shift();
        }
    }
    return answerStack[0];
}

function equals() {
    let currentDisplayArray = currStrToArr();
    document.querySelector(".display");
    // do not evaluate if display ends with operator or if only one number
    if (
        currentDisplayArray.length == 1
        || '+-/*'.includes(currentDisplayArray[currentDisplayArray.length - 1])
    ) {
        return;
    }
    equationDiv.textContent = currentDisplay + " = ";

    let postfixQueue = infixToPostfix(currentDisplayArray);
    answer = calculatePostfix(postfixQueue);
    currentDisplay = answer;
    // updateDisplay();
}

function clearMemory() {
    currentDisplay = "0";
    currentNumber = "";
    answer = "";
    // updateDisplay();
}

function del() {
    // if '=' key was hit previously
    if (answer) {
        clearMemory();
    }
    
    else if (currentDisplay.length > 0) {
        if (!"+-/*% ".includes(currentDisplay[currentDisplay.length - 1])) {
            currentNumber = currentNumber.slice(0, -1);
            currentDisplay = currentDisplay.slice(0, -1);
        }
        else if (currentDisplay[currentDisplay.length - 1] == "%") {
            currentDisplay = currentDisplay.slice(0, -1);
        }
        else if (currentDisplay[currentDisplay.length - 1] == " ") {
            currentDisplay = currentDisplay.slice(0, -3);
        }

        if (currentDisplay.length == 0) {
            currentDisplay = "0";
        }
        // updateDisplay();
    }

}