const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//method1
//const divisableByThree = numbers.filter(number => {
    //console.log(number)
    //if (number % 3 === 0)
     //   return true
    //else    
    //    return false
//})
//console.log('divisablke by 3', divisableByThree)


//metyhod 2
//find diviable by 3
const divisibleBy3 = numbers.filter(numFromMyArray => numFromMyArray % 3 === 0)
console.log(divisibleBy3);

//best method
const divisableByThree = numbers.filter(number => number % 3 === 0)
console.log('divisable by 3', divisableByThree)


const sumOfNumbers = numbers.reduce((total, numFromMyArray) => {
    return total + numFromMyArray
})
console.log(sumOfNumbers);

//long method
const sumOfNumbers1 = numbers.reduce(function (accumulator, number) {
    console.log(accumulator, number)
    return accumulator + number
})
console.log(sumOfNumbers1);

//short method
const sumOfNumbers2 = numbers.reduce((accumulator, number) => accumulator + number)
console.log(sumOfNumbers2);