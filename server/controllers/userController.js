const mysql = require("mysql");

// Connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);

    // User the connection
    connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        let removeUser = req.query.removed;
        res.render("home", { rows, removeUser });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};

// Find user by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);
    let searchTerm = req.body.search;
    // User the connection
    connection.query("SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?", ["%" + searchTerm + "%", "%" + searchTerm + "%"], (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        res.render("home", { rows });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);
    let searchTerm = req.body.search;
    // User the connection
    connection.query("INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?", [first_name, last_name, email, phone, comments], (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        res.render("add-user", { alert: "User added successfully." });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};

// Edit user
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);
    // User the connection
    connection.query("SELECT * FROM user WHERE id_user = ?", [req.params.id], (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        res.render("edit-user", { rows });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};

// Update user
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);
    // User the connection
    connection.query("UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id_user = ?",[first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        pool.getConnection((err, connection) => {
          if (err) throw err; // not connected!
          console.log("Connected as ID " + connection.threadId);
          // User the connection
          connection.query("SELECT * FROM user WHERE id_user = ?", [req.params.id], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
              res.render("edit-user", { rows, alert: `${first_name} has been updated.` });
            } else {
              console.log(err);
            }
            console.log("The data from user table: \n", rows);
          });
        });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};

// Delete user
exports.delete = (req, res) => {
  // pool.getConnection((err, connection) => {
  //   if (err) throw err; // not connected!
  //   console.log("Connected as ID " + connection.threadId);
  //   // User the connection
  //   connection.query("DELETE FROM user WHERE id_user = ?", [req.params.id], (err, rows) => {
  //     // When done with the connection, release it
  //     connection.release();
  //     if (!err) {
  //       res.redirect('/');
  //     } else {
  //       console.log(err);
  //     }
  //     console.log("The data from user table: \n", rows);
  //   });
  // });


  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);
    // User the connection
    connection.query("DELETE FROM user WHERE id_user = ?", [req.params.id], (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        let removeUser = encodeURIComponent('User successfully removed.');
        res.redirect('/?removed=' + removeUser);
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};

//View Users
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);

    // User the connection
    connection.query('SELECT * FROM user WHERE id_user = ?', [req.params.id], (err, rows) => {
      // When done with the connection, release it
      connection.release();
      if (!err) {
        res.render("view-user", { rows });
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    });
  });
};
