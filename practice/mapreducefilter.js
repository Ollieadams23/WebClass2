const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


//const squareOfNumbers = numbers.map(numbers => numbers * numbers)

//const squareOfNumbers = numbers.map(function (numbers) {
 //   console.log("map is at  ", numbers)
  //  return numbers * numbers
//})
//console.log(squareOfNumbers);

//


//numbers.map(numFromMyArray) => {
//    console.log("map is at  ", numFromMyArray)
//    return 0
//}

//console.log(numbers);

//

const mySquares = numbers.map(numFromMyArray => numFromMyArray * numFromMyArray)
console.log(mySquares);

const myDoubles = numbers.map(numFromMyArray => numFromMyArray * 2)
console.log(myDoubles);
const cities = ['a', 'b', 'c', 'd', 'e']
console.log(cities.map(cityName => 'the '+cityName))

