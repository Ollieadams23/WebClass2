



function C(con) {
    console.log(con);
}

function addd(a, b) {
    total = a+b
    return total;
}

a=2;
let c=5

C("a is " + a);

a=3
C("a is " + a);

{
    let a=55
    C("a is " + a);
    addd(a, c)
    d=a+c
    C("total " + d)
   
}

{
    addd(10,15)
    C("total " + total)
}

{
    d=a+c
    C("total " + d)
}