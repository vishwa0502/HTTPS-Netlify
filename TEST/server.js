const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route for handling GET requests
app.get('/', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Error reading data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Route for handling POST requests
app.post('/', (req, res) => {
  const data = req.body;
  console.log('Received POST request:', data);

  // Read existing data from db.json
  fs.readFile('db.json', 'utf8', (err, existingData) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Error reading data');
    } else {
      let jsonData = [];
      if (existingData) {
        jsonData = JSON.parse(existingData);
      }

      // Make sure jsonData is an array
      if (!Array.isArray(jsonData)) {
        jsonData = [];
      }

      // Add new data to existing data
      jsonData.push(data);

      // Write updated data to db.json
      fs.writeFile('db.json', JSON.stringify(jsonData), (err) => {
        if (err) {
          console.error('Error writing to db.json:', err);
          res.status(500).send('Error writing data');
        } else {
          res.send('POST request received and data stored');
        }
      });
    }
  });
});

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
