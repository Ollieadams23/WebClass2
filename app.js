const express = require('express');
const app = express();
const bodyParser = require('body-parser');//for cron to delete old events
const multer = require('multer');//to upload files

//to upload files for events
const storageEvents = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/events');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storageEvents });

//old code for uploading files, uses random file name
/*const uploadResult = multer({ 
  dest: 'public/results' });//to upload files
*/
//uploads results file preserving filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/results');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  const uploadResult = multer({ storage: storage });


const nodemailer = require("nodemailer");
//const util = require('util');//to convert rowpacketdata to array

const session = require('express-session');
const conn = require('./dbConfig');
app.set('view engine','ejs');
// Import required modules
//start setup password reset
//const ejs = require('ejs');

app.use(bodyParser.json());//cron


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use('/public', express.static('public'));
app.use(express.static('/public/images'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global variables
app.use((req, res, next) => {
    app.locals.loggedIn = req.session.loggedIn;
    next();
  });


// Cron job to check and delete old tables daily at 2:00 AM
const cron = require('node-cron');
cron.schedule('* 2 * * *', () => {
  const now = new Date();
  conn.query("SHOW TABLES LIKE 'event_%'", (err, results) => {
    if (err) throw err;
    console.log("cron", results);
    results.forEach(row => {
      const tableName = row[`Tables_in_your_webclass2db`];
      if (/^event_/.test(tableName)) {
        // Get the date from the table name
        const dateStr = tableName.split('_')[2];
        console.log("dateStr", dateStr);
        const scheduledDate = new Date(dateStr);
        console.log("scheduledDate", scheduledDate);
        if (scheduledDate < now) {
          db.query(`DROP TABLE ${tableName}`, (err, result) => {
            if (err) throw err;
            console.log(`Deleted table: ${tableName}`);
          });
        }
      }
    });
  });
});


//const mysql = require('mysql');

//function gets event that the current user is registered in
//but exclused any tables that dont have a memberid column
//because an arror will occur if sql tries to search for memberid in a 
//table where it does not exist
function getTablesWithEventAndMemberid(conn, req, callback) {
  /**
   * Returns a list of tables that have 'event' in the name and also have a row with the given memberid.
   *
   * @param {mysql.Connection} conn - MySQL connection object
   * @param {object} req - Express request object
   * @param {function} callback - Callback function to handle the result
   */
  const memberid = req.session.userData[0].memberid;
  console.log('line 75', memberid);
  conn.query("SHOW TABLES FROM webclass2db LIKE '%event%'", (err, rows) => {
    if (err) {
      callback(err, null);
      console.log(rows);
    } else {
      const events = rows.map(row => row['Tables_in_webclass2db (%event%)']);
      console.log('line 80', rows);
      const results = [];
      let pending = events.length;
      events.forEach(event => {
        conn.query(`SHOW COLUMNS FROM webclass2db.${event} LIKE 'memberid'`, (err, rows) => {
          if (err) {
            callback(err, null);
          } else if (rows.length > 0) {
            conn.query(`SELECT 1 FROM webclass2db.${event} WHERE memberid = ?`, memberid, (err, rows) => {
              if (err) {
                callback(err, null);
              } else {
                if (rows.length > 0) results.push(event);
                if (!--pending) callback(null, results);
              }
            });
          } else {
            if (!--pending) callback(null, results);
          }
        });
      });
    }
  });
}


//define functions
  const fs = require('fs');
const path = require('path');

/**
 * Retrieves the list of file names from the 'public/events' directory.
 * 
 * @returns {string[]} An array of file names present in the 'public/events' directory.
 */


function getFiles() {
  const directoryPath = path.join(__dirname, 'public/events');
  const files = fs.readdirSync(directoryPath);
  //console.log('getfiles', files);
  return files;
}


//gets race results files
function getResults() {
  const directoryPath = path.join(__dirname, 'public/results');
  const files = fs.readdirSync(directoryPath);
  return files;
}
// will try combine these previous two functions by specify a parameter for the directory path


/**
 * Deletes the specified file from the 'public/events' directory.
 * 
 * @param {string} fileName The name of the file to be deleted.
 */
function deleteFile(fileName) {
  const filePath = path.join(__dirname, 'public/events', fileName);
  fs.unlinkSync(filePath);
  console.log(`File ${fileName} deleted successfully`);
}

function deleteResult(fileName) {
  const filePath = path.join(__dirname, 'public/results', fileName);
  fs.unlinkSync(filePath);
  console.log(`File ${fileName} deleted successfully`);
}


//function to get duplicate results from database
function getDuplicates(req, results, callback) {
      conn.query('SELECT lastname, raceclass, racenumber FROM members WHERE (raceclass, racenumber) IN (SELECT raceclass, racenumber FROM members GROUP BY raceclass, racenumber HAVING COUNT(*) > 1)',
      function(error, duplicateResults, fields) {
      if (error) throw error;
      req.session.duplicates = duplicateResults;
      console.log('getresultsfunction', req.session.duplicates);
    req.session.save(); 
    callback(); 
    })
}


  //test db links
//conn.query('SELECT * FROM members', function(err, results) {
 //   if (err) throw err;
 //   console.log(results);
//});


  //define routes


  //send email from contacts page
  app.post('/send-email', (req, res) => {
    const {message} = req.body;
    console.log(`Received message: ${message}`);


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVER,
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_ACCOUNT,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

const emailMessage = req.body.message;

  const mailOptions = {
    from: process.env.EMAIL_SERVER_ACCOUNT,
    to: process.env.EMAIL_SERVER_ACCOUNT,
    subject: "message from SDBR Web App",
    text: emailMessage,
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
});

//end of email code

  app.get('/contact', function (req, res){
    res.render("contact");
  });


  app.get('/', function (req, res){
    res.render("home");
  });

  app.get('/userman', function (req, res){
    conn.query("SELECT * FROM members", function (err, result) {
      if (err) throw err;
      //console.log(result);
    res.render('userman', { userData: req.session.userData, members: result});
    });
 });


 app.get('/membershipman', function (req, res){
  conn.query("SELECT * FROM members", function (err, result) {
    if (err) throw err;
    //console.log(result);
  res.render('membershipman', { userData: req.session.userData, members: result, membersforbarchart: result});
  });
});


 //event management
 app.get('/eventman', function (req, res){
  const files = getFiles();
  conn.query("SELECT * FROM events", function (err, result) {
    if (err) throw err;
    console.log('eventman',result);
    console.log('getfiles', files)
  res.render('eventman', { files: files, events: result});
 })
  });

  function eventList(req, res, callback) {
    conn.query("SELECT * FROM events", function (err, results) {
      if (err) throw err;
      req.session.events = results;
      req.session.save();
      console.log('eventlist', req.session);
      callback();

    
    });
  }


 //upload event
 app.post('/upload', upload.single('file'), (req, res) => {
  // Save the file to the uploads directory
  console.log('file uploaded');
  res.status(200).json({ message: 'File uploaded successfully' });
});

 //upload results
 app.post('/uploadResult', uploadResult.single('file'), (req, res) => {
  console.log('file uploaded');
  res.status(200).json({ message: 'File uploaded successfully' });
});



//delete event 
app.post('/delete-file/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  deleteFile(fileName);
  console.log('file deleted');
});

//delete result
app.post('/delete-result/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  deleteResult(fileName);
  console.log('file deleted');
});

 
 app.get('/register', function (req, res){
    res.render("register");
 });

 app.get('/events', function (req, res) {
    // uses the getfiles function
    const files = getFiles();
    res.render('events', { files: files });
});
 
app.get('/resultsman', function (req, res) {
  // uses the getResults function for the results management page
  const files = getResults();
  res.render('resultsman', { files: files });
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
                //console.log('/auth ln 187', results);
                //  turned this code into a function to call instead and called from profile endpoint so that 
                //when a user is updated because of a duplicate when you go back to profiule page it will re query DB
                if (results[0].role === 'admin') {
                  //conn.query('SELECT lastname, raceclass, racenumber FROM members WHERE (raceclass, racenumber) IN (SELECT raceclass, racenumber FROM members GROUP BY raceclass, racenumber HAVING COUNT(*) > 1)',
                      //function(error, duplicateResults, fields) {
                      //if (error) throw error;
                      getDuplicates(req, results, function() {});
                      //req.session.duplicates = duplicateResults;
                      //req.session.duplicates = duplicateResults.map(row => row.toJSON());
                      //req.session.duplicates = duplicateResults.map(row => JSON.parse(JSON.stringify(row)));
                      //req.session.duplicates = duplicateResults.map(row => Object.values(row));
                      //req.session.duplicates = duplicateResults.map(row => util.inspect(row, { depth: null }));
                      //req.session.duplicates = duplicateResults.map(row => Object.assign({}, row));
                      console.log('duplicateResults', req.session.duplicates);
                    req.session.save();  
                    }   
        

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
    console.log ('loggedin app.js line 398?', loggedIn)
 


 
 app.get('/profile', function (req, res, next) {
  //the next line is only for the console.log which isnt actually needed
  //the other requests for the data access it directly
  const results = req.session.userData;
  const events = req.session.events;

  //console.log('sessiondata1', req.session);//displays all session data
    if (req.session.loggedIn === true) {
        //console.log('app.get /profile')
        //console.log('loggedin?', req.session.loggedIn)
        //console.log('sessiondata2', req.session);
        getTablesWithEventAndMemberid(conn, req, function(err, filteredEvents) {
          if (err) {
            console.error(err);
          } else {
            req.session.filteredEvents = filteredEvents;
            req.session.save();
          }
        });

        eventList(req, results, function() {
          
        });

         if 
          (req.session.userData[0].role === 'admin')//if is spelt "Admin" it doesnt work, doesnt error either as === in code
          //{getDuplicates(req, results, function() {
            res.render('profileadmin', { userData: req.session.userData, loggedIn: req.session.loggedIn, duplicates: req.session.duplicates, filteredEvents: req.session.filteredEvents, events: req.session.events });
          //});
          //} 
          else if 
          (req.session.userData[0].role === 'member')
          
            res.render('profile', { userData: req.session.userData, loggedIn: req.session.loggedIn, events: req.session.events, filteredEvents: req.session.filteredEvents });
        
      
        else {
          res.render('fail');
          console.log('fail');
    };
  }});

app.get('/results', function(req, res){
  const files = getResults();
  res.render('results', { files: files });
});


 app.get('/rules', function(req, res){
    res.sendFile(__dirname + '/public/Constitution2023.pdf');
 });

 app.get('/bikeclasses', function(req, res){
  res.sendFile(__dirname + '/public/bikeclasses.pdf');
});

app.get('/trackinfo', function(req, res){
  res.render("trackinfo");
});

 //registration
 app.post('/register', function(req, res, next) {
    
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthDate = req.body.birthDate;
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
            var sql1 = 'INSERT INTO members (email, firstname, lastname, birthDate, password, raceclass, biketype, racenumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            //var sql2 = 'INSERT INTO class (raceclass, biketype, racenumber) VALUES (?, ?, ?)';

            conn.query(sql1, [email, firstname, lastname, birthDate, password, raceclass, biketype, racenumber], function(err, result) {
                if (err) throw err;
                console.log('member record inserted');
            //});
            //conn.query(sql2, [raceclass, biketype, racenumber], function(err, result) {
                //if (err) throw err;
                //console.log('class record inserted');
                res.render('login');
            });
        }
    });
});

//delete user

app.post('/deleteUser', (req, res) => {
  const memberid = req.body.memberid;
  // delete user from database
  console.log('deleting user with id:', memberid);
  conn.query('DELETE FROM members WHERE memberid = ?', [memberid], (err, results) => {
    if (err) {
      console.error('error deleting user:', err);
      res.status(500).send({ message: 'Error deleting user' });
    } else {
      //res.send({ message: 'User deleted successfully' }); //cant have 2 x res
      res.redirect('userman');
    }
  });
});



//update user
app.post('/updateUser', function(req, res, next) {
  var memberid = req.body.memberid;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var birthDate = req.body.birthDate;
  var raceclass = req.body.raceclass;
  var role = req.body.role;
  var membership = req.body.membership;
  var biketype = req.body.biketype;
  var racenumber = req.body.racenumber;
  console.log('userID', memberid, firstname, lastname, email, birthDate, raceclass, role, membership, biketype, racenumber);
  var sql = 'UPDATE members SET firstname = ?, lastname = ?, email = ?, birthDate = ?, raceclass = ?, role = ?, membership = ?, biketype = ?, racenumber = ? WHERE memberid = ?';
  conn.query(sql, [firstname, lastname, email, birthDate, raceclass, role, membership, biketype, racenumber, memberid], function(err, result) {
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

/*
//event-create old version of code, the new one creates a table instead of a record
app.post('/eventcreate', (req, res) => {
    const eventName = req.body['event-name'];
    const eventDate = req.body['event-date'];
    console.log('event-create', eventName, eventDate);
    conn.query(`CREATE TABLE ${eventName} (id INT NOT NULL)`, function (err, result) {
        if (err) {
            if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                return res.status(400).send('Error: Table already exists');
            }
            throw err;
        }
        console.log('table created');
        res.redirect('/eventman');
    });
});*/


// Route to create an event table
app.post('/eventcreate', (req, res) => {
  const eventName = req.body['event-name'];
  const eventDate = req.body['event-date'];

  // Debug log to check if the date is received correctly
  console.log('Received event date:', eventDate);

  if (!eventDate || isNaN(new Date(eventDate))) {
    return res.status(400).send({ message: 'Invalid date format. Please provide a valid ISO date string.' });
  }


  //const scheduledDate = new Date(eventDate).toISOString().split('T')[0];
  //const tableName = `event_${eventName}_${scheduledDate}`;

  
  const scheduledDate = new Date(eventDate);
  const tableName = `event_${eventName}_${scheduledDate.toISOString().replace(/[-:.]/g, '')}`;

  const sql = `
    CREATE TABLE ${tableName} (
      memberid INT PRIMARY KEY,
      firstName VARCHAR(255),
      lastName VARCHAR(255),
      membership VARCHAR(255),
      biketype VARCHAR(10),
      racenumber INT(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  conn.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`Created table: ${tableName}`);
    
  });
  //insert event record into event table which is just a list
  const sql1 = `INSERT INTO events (eventDate, eventName) VALUES (?,?)`;
  conn.query(sql1, [eventDate, eventName], function (err, result) {
    if (err) throw err;
    console.log('event record inserted');
    res.redirect('/eventman');
  });
});


//eventsignup
app.post('/eventsignup', (req, res) => {
  const eventName = req.body.eventName;
  const memberid = req.session.userData[0].memberid;//userdata is an object not an array so need[0]
  //console.log('eventsignup', req.session.userData.memberid);
  console.log('eventsignup', eventName, memberid);
  

  // Query to retrieve table names that start with the event name
  const sql = "SHOW TABLES LIKE ?";
  const pattern = `event_${eventName}%`;

  conn.query(sql, [pattern], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(404).send({ message: 'No matching tables found' });
      return;
    }
    console.log('results', results);
    const tableName = results[0][Object.keys(results[0])[0]];
    console.log('tableName', tableName);

    // Insert record into the table
    const sql1 = `INSERT INTO ${tableName} (memberid, firstName, lastName, membership, biketype, racenumber) VALUES (?, ?, ?, ?, ?, ?)`;
    conn.query(sql1, [memberid, req.session.userData[0].firstname, req.session.userData[0].lastname, req.session.userData[0].membership, req.session.userData[0].biketype, req.session.userData[0].racenumber], (err, result) => {
      if (err) throw err;
      console.log('record inserted');
      res.redirect('/profile');
    });
  });
});

 //start server
app.listen(3000);
console.log('Node app is running on port 3000');

