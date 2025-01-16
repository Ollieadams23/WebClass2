
//listing users
//const mysql = require('mysql');

//const db = mysql.createConnection({
 // host: 'your_host',
  //user: 'your_username',
  //password: 'your_password',
  //database: 'webclass2db'
//});

connection.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

const query = 'SELECT * FROM members';
connection.query(query, (err, results) => {
  if (err) {
    console.error('error running query:', err);
    return;
  }
  console.log('users:', results);
  // render the results in your EJS template
  res.render('users', { users: results });
});


//del user
//const mysql = require('mysql');

//const db = mysql.createConnection({
 // host: 'your_host',
 // user: 'your_username',
 // password: 'your_password',
 // database: 'webclass2db'
//});

const memberId = req.params.memberId; // assuming you're passing the memberId as a route parameter
const query = 'DELETE FROM members WHERE memberid = ?';
connection.query(query, [memberId], (err, results) => {
  if (err) {
    console.error('error running query:', err);
    return;
  }
  console.log('user deleted:', results);
  // redirect to the users page or render a success message
  res.redirect('/users');
});

//mod user
//const mysql = require('mysql');

//const db = mysql.createConnection({
//  host: 'your_host',
//  user: 'your_username',
//  password: 'your_password',
//  database: 'webclass2db'
//});

const memberId = req.params.memberId; // assuming you're passing the memberId as a route parameter
const updates = {
  firstname: req.body.firstname,
  lastname: req.body.lastname,
  email: req.body.email,
  age: req.body.age,
  raceclass: req.body.raceclass,
  password: req.body.password,
  role: req.body.role,
  membership: req.body.membership
};

const query = 'UPDATE members SET ? WHERE memberid = ?';
connection.query(query, [updates, memberId], (err, results) => {
  if (err) {
    console.error('error running query:', err);
    return;
  }
  console.log('user updated:', results);
  // redirect to the users page or render a success message
  res.redirect('/users');
});