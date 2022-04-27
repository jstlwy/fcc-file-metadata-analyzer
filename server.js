require('dotenv').config();
const express = require('express');
const app = express();

// Enable cross-origin resource sharing
// so freeCodeCamp can test the app remotely
const cors = require('cors');
app.use(cors());

// multer: For handling files.
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

// fs: For deleting files from disk with fs.unlink()
const fs = require('fs');


// Declare location of static files (CSS, JavaScript, images)
app.use('/public', express.static(process.cwd() + '/public'));


// Set app's main page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// When the user POSTs a file to /api/fileanalyse,
// the app will send back JSON with information about the file:
// { name, type, size (in bytes) }
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  const returnJSON = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  };
  console.log('Received upload:');
  console.log(returnJSON);
  res.json(returnJSON);
  
  fs.unlink(req.file.path, (err) => {
    if (err) {
      throw err;
    } else {
      console.log(`${req.file.path} was deleted.`);
    }
  });
});


// Start the server and listen for requests
const port = ('PORT' in process.env) ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log(`The app is listening on port ${port}.`);
});
