const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // Add this line
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const port = 3001;

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'project'
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true })); // Add this line

// Serve static files
app.use(express.static('public'));

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM admins WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error');
        }
        if (results.length > 0) {
            // Successful login
            req.session.loggedin = true;
            res.status(200).send('Success');
        } else {
            // Invalid credentials
            res.status(401).send('Invalid username or password');
        }
    });
});
app.post('/loginn', (req, res) => {
  const { username, password } = req.body;

  // Query the database to authenticate the user and get college name
  connection.query('SELECT college.name FROM college_login JOIN college ON college_login.college_id = college.college_id WHERE username = ? AND password = ?', [username, password], (error, results) => {
      if (error) {
          console.error('Error:', error);
          res.status(500).json({ success: false, message: 'Internal server error' });
      } else if (results.length === 0) {
          res.json({ success: false, message: 'Invalid username or password' });
      } else {
          const collegeName = results[0].name;
          res.json({ success: true, collegeName });
      }
  });
});
// Endpoint to fetch projects by college name
app.get('/projects', (req, res) => {
  const collegeName = req.query.collegeName; // assuming the college name is passed as a query parameter

  // Query MySQL database
  const query = `SELECT * FROM miniproject WHERE college = ?`;
  connection.query(query, [collegeName], (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      res.status(500).json({ error: 'Error fetching projects' });
      return;
    }
    res.json(results); // Send project data as JSON response
  });
});

app.get('/collegedashboard', (req, res) => {
  if (req.session.loggedin) {
    //res.send('Welcome to the dashboard!');
    res.redirect('/collegedashboard.html')
} else {
    res.redirect('/loginn');
}
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {

        res.redirect('/dashboard.html')
    } else {
        res.redirect('/login');
    }
});



app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/index'); // Redirect to index.html page
        }
    });
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); 



  ///
  // Set up storage for uploaded files
  const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({ storage: storage });

app.post('/upload', upload.single('excelFile'), (req, res) => {
    try {
        // Parse uploaded Excel file
        const workbook = xlsx.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Insert data into miniproject table
        insertDataIntoMiniprojectTable(data);

        // Send response indicating success
        res.status(200).send('Data uploaded and inserted successfully');
    } catch (error) {
        console.error('Error uploading and inserting data:', error);
        res.status(500).send('Internal Server Error');
    }
});   

function insertDataIntoMiniprojectTable(data) {
    // Convert data to array of arrays for bulk insert
    const values = data.map(row => {
        // Handle null values or empty strings
        const title =row.title;
        const category =row.category;
        const technologies_used =row.technologies_used;
        const short_description =row.short_description;
        const description =row.description;
        const futurescope =row.futurescope;
        const youtube_link =row.youtube_link;
        const github_link =row.github_link;
        const college =row.college;
        const universecity =row.universecity;
        const student_names =row.student_names;
        const student_rollno =row.student_rollno;
        const classname =row.classname;
        const sem =row.sem;
        const year =row.year;
        
        // Add other column values with similar handling for null values
        
        return [
            title,
            category,
            technologies_used,
            short_description,
            description,
            futurescope,
            youtube_link,
            github_link,
            college,
            universecity,
            student_names,
            student_rollno,
            classname,
            sem,
            year
        ];
    });

    // Insert data into miniproject table
    const sql = 'INSERT INTO miniproject ( title, category, technologies_used, short_description,description, futurescope, youtube_link, github_link,college,universecity, student_names, student_rollno, classname, sem, year) VALUES ?';
    connection.query(sql, [values], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
        } else {
            console.log('Data inserted successfully:', results);
        }
    });
}



app.delete('/miniprojects/:id', (req, res) => {
    const projectId = req.params.id;
  
    const sql = 'DELETE FROM miniproject WHERE mp_id = ?';
    connection.query(sql, [projectId], (err, result) => {
      if (err) {
        console.error('Error deleting mini project: ' + err.stack);
        res.status(500).send('Error deleting mini project');
        return;
      }
      console.log('Deleted mini project with ID: ' + projectId);
      res.send('Mini project deleted successfully');
    });
  });

// Define API endpoint for searching projects
// API endpoint to get all projects
app.get('/api/projects', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 2;
    const offset = (page - 1) * perPage;
  
    const query = 'SELECT * FROM miniproject ORDER BY mp_id DESC LIMIT ?, ?';
    connection.query(query, [offset, perPage], (error, results) => {
      if (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });
  
  //api to get induviau project
  
  app.get('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const query = 'SELECT * FROM miniproject WHERE mp_id = ?';
  
    connection.query(query, [projectId], (error, results) => {
      if (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'Project not found' });
        } else {
          const projectDetails = results[0];
          res.json(projectDetails);
        }
      }
    });
  });
  
  
  
  
  
  
  
  // Define API endpoint for searching projects
  app.get('/api/search', (req, res) => {
    const searchQuery = req.query.query;
  
    if (!searchQuery) {
      return res.status(400).json({ error: 'Missing search query' });
    }
  
    const query = `
      SELECT * FROM miniproject
      WHERE 
        title LIKE ? OR
        category LIKE ? OR
        technologies_used LIKE ? OR
        description LIKE ? OR
        futurescope LIKE ? OR
        student_names LIKE ? OR
        college LIKE ? OR
        universecity LIKE ?
    `;
  
    const queryParams = Array(8).fill(`%${searchQuery}%`);
  
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error('Error searching projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });
  // ... (other endpoints)
  
 // Route to fetch all colleges
app.get('/colleges', (req, res) => {
  const query = 'SELECT * FROM college';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching colleges: ' + error.stack);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(results);
  });
});

// Route to add a new college
app.post('/colleges', (req, res) => {
  const { collegeName, address, contactDetails } = req.body;
  const query = 'INSERT INTO college (name, address, contact_details) VALUES (?, ?, ?)';
  connection.query(query, [collegeName, address, contactDetails], (error, results) => {
      if (error) {
          console.error('Error adding college: ' + error.stack);
          res.status(500).json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});
 
  // Route to delete a college by its ID
app.delete('/colleges/:id', (req, res) => {
  const collegeId = req.params.id;
  const query = 'DELETE FROM college WHERE college_id = ?';
  connection.query(query, [collegeId], (error, results) => {
      if (error) {
          console.error('Error deleting college: ' + error.stack);
          res.status(500).json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});
  
// Route to add a new university
app.post('/universities', (req, res) => {
  const { universityName, address, contactDetails } = req.body;
  const query = 'INSERT INTO university (name, address, contact_details,university_name) VALUES (?, ?, ?,?)';
  connection.query(query, [universityName, address, contactDetails], (error, results) => {
      if (error) {
          console.error('Error adding university: ' + error.stack);
          res.status(500).json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});

// Route to delete a university by its ID

// Route to fetch all universities
app.get('/universities', (req, res) => {
  const query = 'SELECT * FROM university';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching universities: ' + error.stack);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(results);
  });
});
app.delete('/universities/:id', (req, res) => {
  const universityId = req.params.id;
  const query = 'DELETE FROM university WHERE university_id = ?';
  connection.query(query, [universityId], (error, results) => {
      if (error) {
          console.error('Error deleting university: ' + error.stack);
          res.status(500).json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});
// Route to fetch all admins
app.get('/admins', (req, res) => {
  const query = 'SELECT * FROM college_login';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching admins: ' + error.stack);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(results);
  });
});

// Route to add a new admin
app.post('/admins', (req, res) => {
  const { cid,username, password } = req.body;
  const query = 'INSERT INTO college_login (college_id,username, password) VALUES (?, ?, ?)';
  connection.query(query, [cid,username, password], (error, results) => {
      if (error) {
          console.error('Error adding admin: ' + error.stack);
          res.status(500).json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});

// Route to delete an admin by its ID
app.delete('/admins/:id', (req, res) => {
  const adminId = req.params.id;
  const query = 'DELETE FROM college_login WHERE id = ?';
  connection.query(query, [adminId], (error, results) => {
      if (error) {
          console.error('Error deleting admin: ' + error.stack);
          res.status(500).json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});


// Route to view requests
app.get('/requests', (req, res) => {
  const sql = 'SELECT * FROM request';
  connection.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching requests:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json(results);
  });
});

// Route to accept a request
app.post('/requests/accept/:id', (req, res) => {
  const requestId = req.params.id;
  const sql = 'DELETE FROM Request WHERE id = ?';
  connection.query(sql, [requestId], (err, result) => {
      if (err) {
          console.error('Error accepting request:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json({ message: 'Request accepted successfully' });
  });
});

// Route to delete a request
app.delete('/requests/:id', (req, res) => {
  const requestId = req.params.id;
  const sql = 'DELETE FROM request WHERE id = ?';
  connection.query(sql, [requestId], (err, result) => {
      if (err) {
          console.error('Error deleting request:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json({ message: 'Request deleted successfully' });
  });
});

// Route to accept a request and add admin credentials
app.post('/requests/accept/:id', (req, res) => {
  const requestId = req.params.id;
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
  }
  // Add the provided username and password to the admins table
  const sql = 'INSERT INTO admins (username, password) VALUES (?, ?)';
  connection.query(sql, [username, password], (err, result) => {
      if (err) {
          console.error('Error adding admin credentials:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Update the request status to accepted
      const updateSql = 'DELETE FROM Request WHERE id = ?';
      connection.query(updateSql, [requestId], (err, result) => {
          if (err) {
              console.error('Error accepting request:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json({ message: 'Request accepted successfully' });
      });
  });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
