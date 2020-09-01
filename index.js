(function createMarkup() {
  const container = document.createElement('div');
  container.classList = 'container';
  document.body.appendChild(container);

  const calculator = document.createElement('div');
  calculator.classList = 'calculator';
  container.appendChild(calculator);

  const displayScreen = document.createElement('div');
  displayScreen.classList = 'calculator__display';
  displayScreen.innerText = '0';
  calculator.appendChild(displayScreen);

  const calculatorKeys = document.createElement('div');
  calculatorKeys.classList = 'calculator__keys';
  calculator.appendChild(calculatorKeys);

  const operatorsTextArray = ['+', '-', '×', '÷'];
  const operatorsDataArray = ['add', 'subtract', 'multiply', 'divide'];
  for (let i = 0; i < operatorsDataArray.length; i++) {
    const calculatorOperators = document.createElement('button');
    calculatorOperators.classList = 'key--operator';
    calculatorOperators.dataset.action = operatorsDataArray[i];
    calculatorOperators.innerText = operatorsTextArray[i];
    calculatorKeys.appendChild(calculatorOperators);
  }

  const calculatorButtonArray = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  for (let i = 0; i < calculatorButtonArray.length; i++) {
    const calculatorButton = document.createElement('button');
    calculatorButton.value = calculatorButtonArray[i];
    calculatorButton.innerText = calculatorButtonArray[i];
    calculatorKeys.appendChild(calculatorButton);
  }

  const decimalPoint = document.createElement('button');
  decimalPoint.dataset.action = 'decimal';
  decimalPoint.innerText = '.'
  calculatorKeys.appendChild(decimalPoint);

  const clearButton = document.createElement('button');
  clearButton.dataset.action = 'clear';
  clearButton.innerText = 'AC';
  calculatorKeys.appendChild(clearButton);

  const equalSign = document.createElement('button');
  equalSign.classList = 'key--equal';
  equalSign.dataset.action = 'calculate';
  equalSign.innerText = '=';
  calculatorKeys.appendChild(equalSign);

  const historyContainer = document.createElement('div');
  historyContainer.classList = 'history-container';
  container.appendChild(historyContainer);

  const historyHeading = document.createElement('h1');
  historyHeading.innerText = 'Action log';
  historyContainer.appendChild(historyHeading);

  const historyLog = document.createElement('ul');
  historyLog.classList = 'history-log';
  historyContainer.appendChild(historyLog);
})();

const historyLog = [];

function addToLog(firstOperand, operator, secondOperand, result) {
  switch (operator) {
    case 'add':
      operator = '+';
      break;
    case 'subtract':
      operator = '-';
      break;
    case 'multiply':
      operator = 'x';
      break;
    case 'divide':
      operator = '/';
      break;
  }
  return historyLog.push(`${firstOperand} ${operator} ${secondOperand} = ${result}`);
}

const calculate = (firstOperand, operator, secondOperand) => {
  let result = ''
  if (operator === 'add') {
    result = parseFloat(firstOperand) + parseFloat(secondOperand);
  } else if (operator === 'subtract') {
    result = parseFloat(firstOperand) - parseFloat(secondOperand);
  } else if (operator === 'multiply') {
    result = parseFloat(firstOperand) * parseFloat(secondOperand);
  } else if (operator === 'divide') {
    result = parseFloat(firstOperand) / parseFloat(secondOperand);
  }

  if (result % 1 != 0) {
    const num = Number(result).toFixed(5);
    result = num;
  }

  return result
}

function updateLog(arr) {
  const logItem = document.createElement('li');
  logItem.classList = 'history-log__item';
  logItem.innerText = arr.map(item => item);
  document.querySelector('.history-log').appendChild(logItem);
}

function clearArray(arr) {
  arr.length = 0;
}

const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target
    const action = key.dataset.action
    const keyContent = key.innerText
    const displayedNum = display.innerText
    const previousKeyType = calculator.dataset.previousKeyType

    Array.from(key.parentNode.children)
      .forEach(k => k.classList.remove('is-depressed'))

    if (!action) {
      if (
        displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
      ) {
        display.innerText = keyContent
      } else {
        display.innerText = displayedNum + keyContent
      }
      calculator.dataset.previousKeyType = 'number'
    }

    if (action === 'decimal') {
      if (!displayedNum.includes('.')) {
        display.innerText = displayedNum + '.'
      } else if (
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
      ) {
        display.innerText = '0.'
      }

      calculator.dataset.previousKeyType = 'decimal'
    }

    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) {
      const firstValue = calculator.dataset.firstValue
      const operator = calculator.dataset.operator
      const secondValue = displayedNum

      if (
        firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
      ) {
        const calcValue = calculate(firstValue, operator, secondValue)
        display.innerText = calcValue
        calculator.dataset.firstValue = calcValue
      } else {
        calculator.dataset.firstValue = displayedNum
      }

      key.classList.add('is-depressed')
      calculator.dataset.previousKeyType = 'operator'
      calculator.dataset.operator = action
    }

    if (action === 'clear') {
      if (key.innerText === 'AC') {
        calculator.dataset.firstValue = ''
        calculator.dataset.modValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.previousKeyType = ''
      } else {
        key.innerText = 'AC'
      }

      display.innerText = 0
      calculator.dataset.previousKeyType = 'clear'
    }

    if (action !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]')
      clearButton.innerText = 'CE'
    }

    if (action === 'calculate') {
      let firstValue = calculator.dataset.firstValue
      const operator = calculator.dataset.operator
      let secondValue = displayedNum

      if (firstValue) {
        if (previousKeyType === 'calculate') {
          firstValue = displayedNum
          secondValue = calculator.dataset.modValue
        }

        display.innerText = calculate(firstValue, operator, secondValue)
      }

      calculator.dataset.modValue = secondValue
      calculator.dataset.previousKeyType = 'calculate'
      const result = document.querySelector('.calculator__display').innerHTML;
      addToLog(firstValue, operator, secondValue, result);
      updateLog(historyLog);
      clearArray(historyLog);
    }
  }
})