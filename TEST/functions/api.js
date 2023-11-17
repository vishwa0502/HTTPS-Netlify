// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const serverless =require('serverless-http');
// const path = require('path');

// const app = express();
// const router = express.Router();

// // Middleware to parse incoming request bodies
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const filePath = path.join(__dirname,'database.json');
// const currentFilePath = path.resolve(__filename);

// // Print the file path
// console.log('Current File Path:', currentFilePath);
// console.log(' File Path:', filePath);
// // Route for handling GET requests
// router.get('/', (req, res) => {
//   console.log("starting to read get file");
//   fs.readFile(filePath, 'utf8', (err, data) => {
//   // fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {  
//     if (err) {
//       console.error('Error reading db.json:', err);
//       console.log('Error reading db.json:', err);
//       res.status(500).send('Error reading data in db.json');
//     } else {
//       res.json(JSON.parse(data));
//     }
//   });
//   console.log("get file done");
// });

// // Route for handling POST requests
// router.post('/', (req, res) => {
//   const data = req.body;
//   console.log('Received POST request:', data);

//   // Read existing data from db.json
//   fs.readFile(filePath, 'utf8', (err, existingData) => {
//     if (err) {
//       console.error('Error reading db.json:', err);
//       res.status(500).send('Error reading data');
//     } else {
//       let jsonData = [];
//       if (existingData) {
//         jsonData = JSON.parse(existingData);
//       }

//       // Make sure jsonData is an array
//       if (!Array.isArray(jsonData)) {
//         jsonData = [];
//       }

//       // Add new data to existing data
//       jsonData.push(data);

//       // Write updated data to db.json
//       fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
//         if (err) {
//           console.error('Error writing to db.json:', err);
//           res.status(500).send('Error writing data');
//         } else {
//           res.send('POST request received and data stored');
//         }
//       });
//     }
//   });
// });

// // // Start the server
// // const port = 8000;
// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });
// app.use('/', router);
// module.exports.handler = serverless(app);

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const serverless = require('serverless-http');
const path = require('path');

const app = express();
const router = express.Router();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'database.json');
const currentFilePath = path.resolve(__filename);

// Print the file path
console.log('Current File Path:', currentFilePath);
console.log('File Path:', filePath);

// Route for handling GET requests
router.get('/', (req, res) => {
  console.log('Starting to read get file');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database.json:', err);
      res.status(500).send('Error reading data from database.json');
    } else {
      res.json(JSON.parse(data));
    }
  });
  console.log('Get file done');
});

// Route for handling POST requests
router.post('/', (req, res) => {
  const data = req.body;
  console.log('Received POST request:', data);

  // Read existing data from database.json
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  fs.readFile(filePath, 'utf8', (err, existingData) => {
    if (err) {
      console.error('Error reading database.json:', err);
      res.status(500).send('Error reading data from database.json');
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

      // Write updated data to database.json
      fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
        if (err) {
          console.error('Error writing to database.json:', err);
          res.status(500).send('Error writing data to database.json');
        } else {
          res.send('POST request received and data stored');
        }
      });
    }
  });
});

app.use('/', router);
module.exports.handler = serverless(app);