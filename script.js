let currentDisplay = "";

const digits = document.querySelectorAll(".digits button");
digits.forEach(digit=>digit.addEventListener("click", e => {
    console.log(e.target.value);
    currentDisplay += e.target.value;
    updateDisplay(currentDisplay);
}));

const operations = document.querySelectorAll(".operations button");
operations.forEach(operation=>operation.addEventListener("click", e =>{
    console.log(e.target.value);


}));

function updateDisplay(display) {
    const displayDiv = document.querySelector(".display");
    displayDiv.textContent = display;
}

function clearScreen() {
    displayDiv.textContent = "0";
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
function operate(operator, x, y) {
    return operator(x, y);
}