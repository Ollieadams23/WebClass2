const express = require('express');
const app = express();
const session = require('express-session');
const conn = require('./dbConfig');
app.set('view engine','ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,S
    resave: true,
    saveUninitialized: true
}))
app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up middleware and global variables
app.use((req, res, next) => {
    app.locals.loggedIn = req.session.loggedIn;
    next();
  });


  //define routes
  app.get('/', function (req, res){
    res.render("home");
  });

 
 app.get('/register', function (req, res){
    res.render("register");
 });

 app.get('/login', function(req, res) {
    res.render('login.ejs');
 });



 app.post('/auth', function(req, res){
    let name = req.body.username;
    let password = req.body.password;
    if (name && password) {
        conn.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, password],
        function(error, results, fields) {
            if (error) throw error;
            if(results.length > 0) {
                req.session.loggedIn = true;
                req.session.username = name;
                res.redirect('/profile');
            }else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();

    
        })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
 });

 // Users can access this if they are logged in
 let loggedIn = false;
    console.log ('loggedin?', loggedIn)
 


 
 app.get('/profile', function (req, res, next) {
    if (req.session.loggedIn === true) {
        console.log('loggedin?', req.session.loggedIn)
        res.render('profile', { username: req.session.username });
        
    }
    else {
        res.render('fail');
    }

 });

// User can on se this page if they are logged in
app.get('/addMPs', function (req, res, next) {
    if (req.session.loggedIn) {
        res.render('addMPs');
    }
    else {
        res.send('please login to view this page!');
    }
})
app.get('/results', function(req, res){
    res.render("results");
 });

 app.get('/rules', function(req, res){
    res.render("rules");
 });

 //registration
 app.post('/register', function(req, res, next) {
    var racenum = req.body.racenum;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var raceclass = req.body.raceclass;
    var sql = 'INSERT INTO members (email, firstname, lastname, age, raceclass) VALUES (?, ?, ?, ?, ?)';
    conn.query(sql, [racenum, firstname, lastname, age, raceclass], function(err, result) {
        if (err) throw err;
        console.log('record inserted');
        res.render('register');
    });
});

app.post('/addMPs', function(req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
    var party = req.body.party;
    var sql = 'INSERT INTO mps (id, name, party) VALUES (?, ?, ?)';
    conn.query(sql, [id, name, party], function(err, result) {
        if (err) throw err;
        console.log('record inserted');
        res.render('addMPs');
    });
});

 app.get('/listmembers', function (req, res){
    conn.query("SELECT * FROM members", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('listmembers', { title: 'Members', membersData: result});
    });
 });

 app.get('/logout', (req,res) => {
    req.session.destroy();
    console.log('session killed')
    console.log('loggedin?', loggedIn)
    res.redirect('/');
 });


 //start server
app.listen(3000);
console.log('Node app is running on port 3000');



