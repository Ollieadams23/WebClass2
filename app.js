const express = require('express');
const app = express();
const session = require('express-session');
const conn = require('./dbConfig');
app.set('view engine','ejs');

// Import required modules
//start setup password reset
const nodemailer = require('nodemailer');
const ejs = require('ejs');




app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use('/public', express.static('public'));
app.use(express.static('/public/images'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up middleware and global variables
app.use((req, res, next) => {
    app.locals.loggedIn = req.session.loggedIn;
    next();
  });


  //define functions
  const fs = require('fs');
const path = require('path');

function getFiles() {
  const directoryPath = path.join(__dirname, 'public/events');
  const files = fs.readdirSync(directoryPath);
  return files;
}


  //test db links
//conn.query('SELECT * FROM members', function(err, results) {
 //   if (err) throw err;
 //   console.log(results);
//});


  //define routes
// Set up email transport using Nodemailer
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_SERVER_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD
  }
  
});

// Define password reset email template
const passwordResetTemplate = (user, resetLink) => {
  return ejs.render(`
    <h1>Password Reset Request</h1>
    <p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
  `, { user, resetLink });
};

// Define route for sending password reset email
app.post('/resetPass', (req, res) => {
  const email = req.body.email;
  const user = { email }; // retrieve user from database using email
  const resetLink = 'localhost:3000/resetpassword'; // generate password reset link
  const html = passwordResetTemplate(user, resetLink);

  // Send email using nodemailer
  transport.sendMail({
    from: 'your-email@example.com',
    to: email,
    subject: 'Password Reset Request',
    html
  }, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error sending email');
    } else {
      res.send('Password reset email sent successfully');
    }
  })
})

const router = express.Router();
router.post('/resetPass', (req, res) => {
  const { email } = req.body;
  const user = { email }; // retrieve user from database using email
  const resetLink = 'localhost:3000/resetpassword'; // generate password reset link
  const html = passwordResetTemplate(user, resetLink);


  // Send email using Nodemailer
  transport.sendMail({
    from: 'your-email@example.com',
    to: email,
    subject: 'Password Reset Request',
    html
  }, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error sending email');
    } else {
      res.send('Password reset email sent successfully');
    }
  });
});

// Export router
module.exports = router;
//end setup password reset


  app.get('/', function (req, res){
    res.render("home");
  });

  app.get('/userman', function (req, res){
    conn.query("SELECT * FROM members", function (err, result) {
      if (err) throw err;
      console.log(result);
    res.render('userman', { userData: req.session.userData, members: result});
    });
 });

 

 
 app.get('/register', function (req, res){
    res.render("register");
 });

 app.get('/events', function (req, res) {
    // Assuming you have a function to get the files
    const files = getFiles();
    res.render('events', { files: files });
});
 


 app.get('/login', function(req, res) {
    res.render('login.ejs');
 });

 



 app.post('/auth', function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        conn.query('SELECT * FROM members WHERE email = ? AND password = ?', [email, password],
        function(error, results, fields) {
            if (error) throw error;
            if(results.length > 0) {
                req.session.loggedIn = true;
                //req.session.username = results.email;
                //req.session.role = results.role;
                req.session.userData = results;//if i put [0] after results it doesnt work if i have it there i need to remove it from the calls in profile.ejs

                console.log('ln 160', results);
                
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
    console.log ('loggedin app.js line 179?', loggedIn)
 


 
 app.get('/profile', function (req, res, next) {
  //the next line is only for the console.log which isnt actually needed
  //the other requests for the data access it directly
  const results = req.session.userData;
  console.log('userData', results);
    if (req.session.loggedIn === true) {
        console.log('loggedIn?app 189', req.session.loggedIn)
        if 
          (req.session.userData[0].role === 'admin')//if is spelt "Admin" it doesnt work, doesnt error either
          res.render('profileAdmin', { userData: req.session.userData, loggedIn: req.session.loggedIn });
        } else if
          (req.session.role === 'member'){
          res.render('profile', { userData: req.session.userData, loggedIn: req.session.loggedIn });
        }
    else {
        res.render('fail');
        console.log('fail');
    }

 });

// User can only see this page if they are logged in
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

 app.get('/buymembership', function(req, res){
  res.render("buymembership");
});

 app.get('/rules', function(req, res){
    res.sendFile(__dirname + '/public/Constitution2023.pdf');
 });

 app.get('/bikeclasses', function(req, res){
  res.sendFile(__dirname + '/public/bikeclasses.pdf');
});



 //registration
 app.post('/register', function(req, res, next) {
    
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var password = req.body.password;
    var raceclass = req.body.raceclass;
    var biketype = req.body.biketype;
    var racenumber = req.body.racenumber;
    var sql = 'SELECT * FROM members WHERE email = ?';
    conn.query(sql, [email], function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.render('register', {error: 'Email already in use'});
        } else {
            var sql1 = 'INSERT INTO members (email, firstname, lastname, age, password, raceclass) VALUES (?, ?, ?, ?, ?, ?)';
            var sql2 = 'INSERT INTO class (raceclass, biketype, racenumber) VALUES (?, ?, ?)';

            conn.query(sql1, [email, firstname, lastname, age, password, raceclass], function(err, result) {
                if (err) throw err;
                console.log('member record inserted');
            });
            conn.query(sql2, [raceclass, biketype, racenumber], function(err, result) {
                if (err) throw err;
                console.log('class record inserted');
                res.render('register');
            });
        }
    });
});

//delete user
app.post('/deleteUser', function(req, res, next) {
  var id = user.memberid;
  var sql = 'DELETE FROM members WHERE id = ?';
  conn.query(sql, [memberid], function(err, result) {
      if (err) throw err;
      console.log('record deleted');
      res.redirect('/userman');
  });
});

//update user
app.post('/updateUser', function(req, res, next) {
  var memberid = req.body.memberid;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var age = req.body.age;
  var raceclass = req.body.raceclass;
  var role = req.body.role;
  var membership = req.body.membership;
  console.log('userID', memberid, firstname, lastname, email, age, raceclass, role, membership);
  var sql = 'UPDATE members SET firstname = ?, lastname = ?, email = ?, age = ?, raceclass = ?, role = ?, membership = ? WHERE memberid = ?';
  conn.query(sql, [firstname, lastname, email, age, raceclass, role, membership, memberid], function(err, result) {
      if (err) throw err;
      console.log('record updated');
      res.redirect('/userman');
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
    console.log('loggedin app logout 154?', loggedIn)
    res.redirect('/');
 });


 //start server
app.listen(3000);
console.log('Node app is running on port 3000');



