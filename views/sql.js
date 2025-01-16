const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'your_username',
  password : 'your_password',
  database : 'your_database'
});

// Function to view fields in a table
function viewFields(table_name, callback) {
  connection.query(`DESCRIBE ${table_name}`, function (error, results, fields) {
    if (error) throw error;
    callback(results);
  });
}

// Function to delete a field from a table
function deleteField(table_name, field_name, callback) {
  connection.query(`ALTER TABLE ${table_name} DROP COLUMN ${field_name}`, function (error, results, fields) {
    if (error) throw error;
    callback(results);
  });
}

// Function to add a field to a table
function addField(table_name, field_name, data_type, callback) {
  connection.query(`ALTER TABLE ${table_name} ADD ${field_name} ${data_type}`, function (error, results, fields) {
    if (error) throw error;
    callback(results);
  });
}

// Function to alter a value in a table
function alterValue(table_name, field_name, new_value, condition, callback) {
  connection.query(`UPDATE ${table_name} SET ${field_name} = '${new_value}' WHERE ${condition}`, function (error, results, fields) {
    if (error) throw error;
    callback(results);
  });
}

// Example usage:
const table_name = 'my_table';
viewFields(table_name, function(results) {
  console.log(results);
  deleteField(table_name, 'old_field', function(results) {
    console.log(results);
    addField(table_name, 'new_field', 'VARCHAR(255)', function(results) {
      console.log(results);
      alterValue(table_name, 'name', 'John Doe', 'id = 1', function(results) {
        console.log(results);
      });
    });
  });
});

// Close the connection
connection.end();