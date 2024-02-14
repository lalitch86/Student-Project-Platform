
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(express.static('public'));
const port = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'project',
});

// Connect to MySQL
connection.connect();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// API endpoint to get all projects
app.get('/api/projects', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
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



// Fetch all colleges
app.get('/colleges', (req, res) => {
  connection.query('SELECT * FROM college', (err, results) => {
      if (err) {
          console.error('Error fetching colleges:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

// Fetch all universities
app.get('/universities', (req, res) => {
  connection.query('SELECT DISTINCT university_name FROM college; ', (err, results) => {
      if (err) {
          console.error('Error fetching universities:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});


app.get('/categories', (req, res) => {
  const query = 'SELECT DISTINCT category FROM miniproject;';
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching categories:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      const categories = results.map(result => result.category);
      res.json(categories);
  });
});





// Get records by category
app.get('/api/record', (req, res) => {
  const query = req.query.query;
  connection.query('SELECT * FROM projects WHERE category LIKE ?', [`%${query}%`], (error, results) => {
    if (error) {
      console.error('Error searching projects from MySQL:', error);
      res.status(500).json({ error: 'Failed to search projects' });
      return;
    }
    res.json(results);
  });
});

// Route to fetch university details
app.get('/university-details', (req, res) => {
  const universityId = req.query.id; // Assuming you pass university id in query parameter
  const query = 'SELECT * FROM university  WHERE university_id = ?';
  connection.query(query, [universityId], (err, results) => {
      if (err) {
          console.error('Error fetching university details:', err);
          res.status(500).send('Internal Server Error');
      } else {
          if (results.length > 0) {
              const universityDetails = results[0];
              res.json(universityDetails);
          } else {
              res.status(404).send('University not found');
          }
      }
  });
});

// Route to fetch college details
app.get('/college-details', (req, res) => {
  const collegeId = req.query.id; // Assuming you pass college id in query parameter
  const query = 'SELECT * FROM college WHERE college_id = ?';
  connection.query(query, [collegeId], (err, results) => {
      if (err) {
          console.error('Error fetching college details:', err);
          res.status(500).send('Internal Server Error');
      } else {
          if (results.length > 0) {
              const collegeDetails = results[0];
              res.json(collegeDetails);
          } else {
              res.status(404).send('College not found');
          }
      }
  });
});




app.post('/submit_registration', (req, res) => {
  const { collegeName, address, contactDetails, universityId } = req.body;

  const sql = 'INSERT INTO request (college_name, address, contact_details,  university_name) VALUES (?, ?, ?, ?)';
  const values = [collegeName, address, contactDetails, universityId];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error occurred while processing your request.');
      } else {
          console.log('Registration successful!');
          res.send('Registration successful!');
      }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

