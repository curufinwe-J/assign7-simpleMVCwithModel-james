// Simulated database

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'assignDBuser',
  password: 'assignDBpass',
  database: 'assignDB',
  waitForConnections: true,
  connectionLimit: 10
});

function getUsers(callback) {
  const queryText = 'SELECT userID AS id, fname, lname, username FROM users';

  pool.query(queryText, function (err, results) {
    if (err) {
      console.error('Error fetching users:', err);
      return callback([]); 
    }
    
    callback(results);
  });
}

function addUser(user, callback) {
  const queryText = 'INSERT INTO users (fname, lname, username, passwd) VALUES (?, ?, ?, ?)';
  const temporaryPassword = user.passwd || 'TemporaryPassword123!';
  const values = [user.fname, user.lname, user.username, temporaryPassword];

  pool.query(queryText, values, function (err, result) {
    if (err) {
      console.error('Error adding user:', err);
      return callback(null);
    }

    user.id = result.insertId;
    
    delete user.passwd; 

    callback(user);
  });
}

module.exports = { getUsers, addUser };