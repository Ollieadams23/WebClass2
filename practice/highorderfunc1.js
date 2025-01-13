function sayA() {
    console.log("A");

}

function sayB() {
    console.log("B");
    
}

function sais(say1) {
    say1();
}

sais(sayA)
sais(sayB)

sais(function () {
    console.log("on the fly");
})

function addTwoNums1 (num1, num2) {
    
    return num1 + num2
}

function addTwoNums2 (num1, num2) {
    
    return {
        num1, num2,
        sum: num1 + num2,
        
    }
}//method1
//defines variables first then uses them in output
let num1 = 10;
let num2 = 5;
let result = addTwoNums1 (num1, num2);
    console.log(num1, "+",num2,"=", result);


//method2
//defines variables but they are defined in the function and then
//called from console.log
let a=3;
let b=5;
console.log(addTwoNums2(a, b).num1, "+", addTwoNums2(a, b).num2,  "=", addTwoNums2(a, b).sum);

function addition(num1, num2) {
    return num1 + num2
}

function doMath(operation, n1, n2){
    return operation(n1, n2)
}

console.log(doMath(addition, 10, 5));

function square(num) {
    return num * num
}

console.log(doMath(square, 10));
