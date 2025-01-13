console.log("this is too practice arrays in JS");

function plate(n1, n2) {
    return n1 + n2
}
let arr = [1,2,3,4,5,6,7,8,9,10];
const studentIds = [1,2,3,4,5,6,7];
const studentNames = ["A", "B", "C", "D", "E", "F", "G"];

const students = new Map();
//students.set(1, "A");


console.log(arr);
console.log("b4 push",studentIds);
studentIds.push(7);
console.log("after push",studentIds);

//gets result from plate function and alters the resulting index
studentIds.push(plate(2,5));
console.log("after push",studentIds);

//studentIds.splice(studentIds, 1);
//console.log("after splice 1",studentIds);

for (let i = 0; i < studentIds.length; i++) {
    students.set(studentIds[i], studentNames[i]);

    
}

console.log(students);