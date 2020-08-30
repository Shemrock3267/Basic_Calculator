(function createMarkup() {
  const calculator = document.createElement('div');
  calculator.classList = 'calculator';
  document.body.appendChild(calculator);

  const calculatorScreen = document.createElement('input');
  calculatorScreen.classList = 'calculator-screen';
  calculatorScreen.type = 'text';
  calculatorScreen.value = '0';
  calculatorScreen.disabled = true;
  calculator.appendChild(calculatorScreen);

  const calculatorKeysContainer = document.createElement('div');
  calculatorKeysContainer.classList = 'calculator-keys';
  calculator.appendChild(calculatorKeysContainer);

  const operatorsTextArray = ['+', '-', '×', '÷'];
  const operatorsValuesArray = ['+', '-', '*', '/'];
  for (let i = 0; i < operatorsValuesArray.length; i++) {
    const calculatorOperators = document.createElement('button');
    calculatorOperators.classList = 'operator';
    calculatorOperators.value = operatorsValuesArray[i];
    calculatorOperators.innerText = operatorsTextArray[i];
    calculatorKeysContainer.appendChild(calculatorOperators);
  }

  const calculatorButtonArray = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  for (let i = 0; i < calculatorButtonArray.length; i++) {
    const calculatorButton = document.createElement('button');
    calculatorButton.value = calculatorButtonArray[i];
    calculatorButton.innerText = calculatorButtonArray[i];
    calculatorKeysContainer.appendChild(calculatorButton);
  }

  const decimalPoint = document.createElement('button');
  decimalPoint.classList = 'decimal';
  decimalPoint.value = '.';
  decimalPoint.innerText = '.'
  calculatorKeysContainer.appendChild(decimalPoint);

  const clearButton = document.createElement('button');
  clearButton.classList = 'all-clear';
  clearButton.value = 'all-clear';
  clearButton.innerText = 'AC';
  calculatorKeysContainer.appendChild(clearButton);

  const equalSign = document.createElement('button');
  equalSign.classList = 'equal-sign operator';
  equalSign.value = '=';
  equalSign.innerText = '=';
  calculatorKeysContainer.appendChild(equalSign);

  const historyContainer = document.createElement('div');
  historyContainer.classList = 'history-container';
  calculator.appendChild(historyContainer);

  const historyHeading = document.createElement('h1');
  historyHeading.innerText = 'History Log';
  historyContainer.appendChild(historyHeading);

  const historyLog = document.createElement('div');
  historyLog.classList = 'history-log';
  historyContainer.appendChild(historyLog);
})();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', event => {
  const { target } = event;
  const { value } = target;

  if (!target.matches('button')) {
    return;
  }

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value);
      break;
    case '.':
      inputDecimal(value);
      break;
    case 'all-clear':
      resetCalculator();
      break;
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }
  updateDisplay();
});



const calculator = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false
}

function inputDigit(digit) { 
  const { displayValue, waitingForSecondOperand} = calculator;

  if (waitingForSecondOperand) { 
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }

  console.log(calculator);
}

function inputDecimal(dot) { 
  if (calculator.waitingForSecondOperand === true) { 
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) { 
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) { 
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) { 
    calculator.operator = nextOperator;
    console.log(calculator);
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) { 
    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = parseFloat(result.toFixed(5));
    calculator.firstOperand = inputValue;
  }
  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
  // updateLog(calculator);
  console.log(calculator)
}

function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') {
    return firstOperand + secondOperand;
  } else if (operator === '-') {
    return firstOperand - secondOperand;
  } else if (operator === '*') {
    return firstOperand * secondOperand;
  } else if (operator === '/') {
    return firstOperand / secondOperand;
  }
  return secondOperand;
}

function resetCalculator() { 
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.waitingForSecondOperand = false;
  console.log(calculator);
}

function updateDisplay() { 
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

// function updateLog(obj) {
//   const logItem = document.createElement('div');
//   logItem.classList = 'history-log__item';
//   logItem.innerText = `${obj.firstOperand} ${obj.operator} ${obj.secondOperand} = ${obj.displayValue}`;
//   document.querySelector('.history-log').appendChild(logItem);
// }

updateDisplay();
