const calculator = {
    operands: {
        " - ": {
            priority: 1,
            type: "BinarryOperation"
        },
        " + ": {
            priority: 1,
            type: "BinarryOperation"
        },
        " / ": {
            priority: 2,
            type: "BinarryOperation"
        },
        " * ": {
            priority: 2,
            type: "BinarryOperation"
        },
        " ^ ": {
            priority: 3,
            type: "BinarryOperation"
        },
        "sin": {
            priority: 4,
            type: "BracketOperation"
        },
        "cos": {
            priority: 4,
            type: "BracketOperation"
        },
        "tg":{
            priority: 4,
            type: "BracketOperation"
        },
        "ctg": {
            priority: 4,
            type: "BracketOperation"
        },
        "sqrt": {
            priority: 4,
            type: "BracketOperation"
        }
    },
    operations: {
        " - ": ({first, second}) => first - second,
        " + ": ({first, second}) => first + second,

        " * ": ({first, second}) => first * second,
        " / ": ({first, second}) => first / second,

        " ^ ": ({first, second}) => first ** second,

        "sin": ({number}) => +Math.sin(number).toFixed(2),
        "cos": ({number}) => +Math.cos(number).toFixed(2),
        "tg": ({number}) => +Math.tan(number).toFixed(2),
        "ctg": ({number}) => +(1 / Math.tan(number)).toFixed(2),

        "sqrt": ({number}) => +Math.sqrt(number).toFixed(2),
    },

    hasOperands(expression) {
        for (let operand of Object.keys(this.operands)) {
            if (expression.includes(operand)) {
                return true;
            }
        }

        return false;
    },
    getOperand(expression) {
        let result = {
            priority: -1,
            position: -1,
            operand: "",
        }

        for (let operand of Object.keys(this.operands)) {
            if (expression.includes(operand)) {
                if (this.operands[operand].priority > result.priority || (
                    (this.operands[operand].priority === result.priority && (
                        expression.indexOf(operand) < result.position
                    ))
                    || result.position === -1
                )) {
                    result.priority = this.operands[operand].priority;
                    result.operand = operand;
                    result.position = expression.indexOf(operand);
                }
            }
        }

        return {
            operand: result.operand,
            position: result.position
        }
    },

    hasBrackets(expression) {
        return expression.includes("(") && expression.includes(")");
    },
    getBrackets(expression, offset = 0) {
        let result = {
            start: -1,
            end: -1
        }

        for (let i = offset; i < expression.length; i++) {
            if (expression[i] === "(") {
                result.start = i;
                break;
            }
        }

        for (let i = result.start; i < expression.length; i++) {
            if (expression[i] === ")") {
               if (this.checkBrackets(expression.slice(result.start, i + 1))) {
                   result.end = i + 1;
                   break;
               }
            }
        }

        return result;
    },
    checkBrackets(expression) {
        let bracketsAmount = 0;

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === "(") {
                bracketsAmount++;
            } else if (expression[i] === ")") {
                bracketsAmount--;
            }

            if (bracketsAmount < 0) {
                return false;
            }
        }

        return bracketsAmount === 0;
    },

    getLeftNumber(expression, position, offset = 0) {
        let currentPos = position - offset;
        let number = "";

        while (
            ((parseInt(expression[currentPos]) || parseInt(expression[currentPos]) === 0) ||
                expression[currentPos] === "." ||
                expression[currentPos] === "-") && currentPos !== -1
            ) {
            number += expression[currentPos];
            currentPos--;
        }

        return +(number.split("").reverse().join(""));
    },
    getRightNumber(expression, position, offset = 0) {
        let currentPos = position + offset
        let number = ""

        while (
            ((parseInt(expression[currentPos]) || parseInt(expression[currentPos]) === 0) ||
                expression[currentPos] === "." ||
                expression[currentPos] === "-") && currentPos !== expression.length
            ) {
            number += expression[currentPos]
            currentPos++
        }

        return +number
    },

    calc(operand, params) {
        return this.operations[operand](params);
    },

    replaceConstants(expression) {
        let curExprsn = expression;

        while (curExprsn.includes("PI")) {
            curExprsn = curExprsn.replace("PI", Math.PI);
        }

        return curExprsn;
    },

    calculate(expression) {
        expression = this.replaceConstants(expression);

        while (this.hasOperands(expression) || this.hasBrackets(expression)) {
            let {operand, position} = this.getOperand(expression);

            if (this.hasBrackets(expression) && this.operands[operand].type !== "BracketOperation") {
                let {start, end} = this.getBrackets(expression);
                let innerResult = this.calculate(expression.slice(start + 1, end - 1));

                expression = expression.replace(expression.slice(start, end), innerResult);

                continue;
            }

            let calculatingResult;
            let replacingValue;

            if (this.operands[operand].type === "BinarryOperation") {
                let firstNumber = this.getLeftNumber(expression, position + 1, 2);
                let secondNumber = this.getRightNumber(expression, position + 1, 2);

                calculatingResult = this.calc(operand, {
                    first: firstNumber,
                    second: secondNumber
                });

                replacingValue = `${firstNumber}${operand}${secondNumber}`;
            } else if (this.operands[operand].type === "BracketOperation") {
                let {start, end} = this.getBrackets(expression, position);
                let innerResult = this.calculate(expression.slice(start + 1, end - 1));

                calculatingResult = this.calc(operand, {
                    number: innerResult
                });

                replacingValue = `${operand}(${expression.slice(start + 1, end - 1)})`;
            }

            expression = expression.replace(replacingValue, calculatingResult);
        }

        return +(+expression).toFixed(2);
    }
}
