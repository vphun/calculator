// VAR declarations
let currentDisplay = "0";
let currentNumber = "";
let operatorStack = [];
let outputQueue = [];
let answerStack = [];

// JS listeners and selectors
const displayDiv = document.querySelector(".display");

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

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", e => {
    console.log(e.target.value);
    if (e.target.value == "=") {
        equals();
    }
    else if (e.target.value == "clear") {
        clearMemory();
        updateDisplay();
    }
    else if (e.target.value == "del") {
        del();
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
    if (answerStack.length == 1) {
        answerStack.pop();
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



function appendOperator(value) {
    if (answerStack.length == 1) {
        currentNumber = answerStack[0];
        answerStack.pop();
    }
    
    if (currentDisplay.length > 1 && '+-*/'.includes(currentDisplay.charAt(currentDisplay.length - 2))) {
        return;
    }
    if (currentDisplay == "0") {
        currentNumber = "0";
    }
    if (currentNumber != "") {
        // outputQueue.push(currentNumber);
        currentNumber = "";}
    // while (operatorStack.length > 0 && precedence[operatorStack[operatorStack.length - 1]] > precedence[value]) {
    //     let op = operatorStack.pop();
    //     outputQueue.push(op); 
    // }
    if (value == "%") {
        currentDisplay += `%`;
    }
    else{currentDisplay += ` ${value} `;}

}

function updateDisplay() {
    displayDiv.textContent = currentDisplay;
}

function equals() {
    let currentDisplayArray = [""];
    for (let i = 0; i < currentDisplay.length; i++) {
        if (currentDisplay[i] != " "){
            if ('+-/*%'.includes(currentDisplay[i])) {
                currentDisplayArray.push(currentDisplay[i]);
                if ('+-/*'.includes(currentDisplay[i])) {
                currentDisplayArray.push("");}
            }
            else {
                currentDisplayArray[currentDisplayArray.length - 1] += currentDisplay[i];
            }
        }
        console.log(currentDisplayArray);
    }
    if (currentDisplayArray[currentDisplayArray.length - 1] == "") {
        currentDisplayArray.pop();
    }
    console.log(currentDisplayArray);

    for (let i = 0; i < currentDisplayArray.length; i++) {
        if (!'+-/*%'.includes(currentDisplayArray[i])) {
            outputQueue.push(currentDisplayArray[i]);

        }
        else {
            while (operatorStack.length > 0 && precedence[operatorStack[operatorStack.length - 1]] >= precedence[currentDisplayArray[i]]) {
                let op = operatorStack.pop();
                outputQueue.push(op); 
            }
                
        operatorStack.push(currentDisplayArray[i]);
        }
    }



    // if (currentNumber != "") {
    // outputQueue.push(currentNumber);
    // currentNumber = "";}
    while (operatorStack.length > 0) {
        let op = operatorStack.pop();
        outputQueue.push(op);
    }
    while (outputQueue.length > 0) {
        if (!'+-/*%'.includes(outputQueue[0])) {
            answerStack.push(outputQueue.shift());
            console.log("outpuequeue: " + outputQueue);
            console.log("answerStack: " + answerStack);
        }
        else if ('+-/*%'.includes(outputQueue[0])) {
            if ('+-/*'.includes(outputQueue[0])) {
            let y = answerStack.pop();
            let x = answerStack.pop();
            console.log("outputQueue[0]: " + outputQueue[0]);
            answerStack.push(operations[outputQueue[0]](x, y));
            }
            else {
                let x = answerStack.pop();
                console.log("outputQueue[0]: " + outputQueue[0]);
                answerStack.push(operations[outputQueue[0]](x));
                if (outputQueue[1] == "+" || outputQueue[1] == "-") {
                    console.log("doing percent special")
                    outputQueue.shift();
                    let y = operations[outputQueue[0]](1, answerStack.pop());
                    let x = answerStack.pop();
                    answerStack.push(operations["*"](x, y));
                }

            }
            outputQueue.shift();
            console.log("outpuequeue: " + outputQueue);
            console.log("answerStack: " + answerStack); 
        }

    }
    console.log(answerStack);
    currentDisplay = answerStack[0];
    updateDisplay();
}

function clearMemory() {
    currentDisplay = "0";
    currentNumber = "";
    operatorStack = [];
    outputQueue = [];
    answerStack = [];
}

function del() {
    if (currentDisplay.length > 0) {
        if(!"+-/*% ".includes(currentDisplay[currentDisplay.length - 1])) {
            currentNumber = currentNumber.slice(0, -1);
            currentDisplay = currentDisplay.slice(0, -1);
        }
        else if(currentDisplay[currentDisplay.length - 1] == "%") {
            currentDisplay = currentDisplay.slice(0, -1);
        }
        else if (currentDisplay[currentDisplay.length - 1] == " ") {
        currentDisplay = currentDisplay.slice(0, -3);
}

        if (currentDisplay.length == 0) {
            currentDisplay = "0";
        }
        updateDisplay();
    }

}