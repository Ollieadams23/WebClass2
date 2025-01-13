
function addTwoNumbers(num1, num2, ) {
    return num1 + num2
}

console.log(addTwoNumbers(1, 2));

function subtract(from, subtractee) {
    return from - subtractee;
}

console.log(subtract(15, 5));
console.log(subtract(addTwoNumbers(10, 5), 2));

function doMath(num1, num2, operation) {
    return operation(num1, num2);
}

console.log(doMath(10, 5, addTwoNumbers));

console.log(doMath(10, 5, subtract));

console.log(doMath(10, 5, function(num1, num2){
    console.log(num1, num2);
    return (num1 +"  "+ num2);
}))