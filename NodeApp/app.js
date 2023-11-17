const fs = require('fs');
const express = require('express');
const { urlencoded } = require('express');
const app = express();
const multer = require('multer');
const e = require('express');
const https = require('https');
const path = require('path')

const directory_path = path.join(__dirname)

const key = fs.readFileSync("./private.key")
const cert = fs.readFileSync("./certificate.crt")

// const key = fs.readFileSync('D:/Node_workspace/Simulation_server/myExpressApp/certificates/server.decrypted.key');
// const cert = fs.readFileSync('D:/Node_workspace/Simulation_server/myExpressApp/certificates/server.cert');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, file.originalname);
    }

})

const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: true }));
app.use(express.static(directory_path))



app.post('/', upload.any(), (req, res) => {
    // var data = req.body.data;
    // console.log(file);
    console.log("post method called");
    res.status(200).json({
        message: "Data received successfully"
    });
});

var server = https.createServer({ key, cert }, app)

server.listen(8443)