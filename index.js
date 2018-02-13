const config = require('./config');
const express = require('express');
const fileUpload = require('express-fileupload');
const moment = require('moment');
const app = express();
const bodyParser = require("body-parser");
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
const AWS = require('aws-sdk');
const fs = require('fs');
const format = require('format');

/**
 * AWS Configuration
 */
AWS.config.update(config.s3);

console.log(format('this is a %s', config.twilio.accountSid));

/**
 * Express Configuration
 */

app.use(express.static('public'));
app.use('/photos', express.static('photos'))
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

/**
 * Express Routes
 */

// GET / 
// Returns Homepage

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/public/index.html');
});

// GET /backdrops
// Returns a list of backdrops

app.get('/backdrops', function(req, res) {
    fs.readdir(process.cwd() + '/public/backdrops', function(err, items) {
        if (err) {
            console.log('Error reading backdrops');
        } else {
            res.send(JSON.stringify(items));
        }
    });
});

// POST /saveImage
// Saves posted image to /photos and returns the created filename

app.post('/saveImage', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let sampleFile = req.files['test.png'];

    var fileName = moment().format('YYYYMMDD_hhmmss_ms') + '.jpg';
    sampleFile.mv(process.cwd() + '/photos/' + fileName, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send(fileName);
    });
});

// POST /sendImage
// Send the selected images to a given phone number

app.post('/sendImage', function(req, res) {
    var toNumber = req.body.number.toString();
    var files = JSON.parse(req.body.selected);

    files.forEach(function(fileName) {

        try {
            readAndPostFile(fileName, toNumber)
        } catch (ex) {
            console.log(ex)
        }
    });
})



function readAndPostFile(fileName, toNumber) {
    if (toNumber == '') {
        throw 'Phone number not defined';
    }

    fs.readFile(process.cwd() + '/photos/' + fileName, function(err, data) {
        if (err) {
            throw err;
        }

        try {
            var base64data = new Buffer(data, 'binary');
            postFile(fileName, toNumber, base64data)
        } catch (ex) {
            throw ex
        }

    });
}

function postFile(fileName, toNumber, base64data) {
    var s3 = new AWS.S3();
    var mediaUrl = format('https://%s/%s/%s', config.s3_bucket.region, config.s3_bucket.name, fileName);

    s3.putObject({
        Key: fileName,
        Body: base64data,
        ACL: 'public-read',
        Bucket: config.s3_bucket.name
    }, function(resp) {
        //TODO: Add Error handling
        try {
            sendMMS(mediaUrl, toNumber);
        } catch (ex) {
            throw ex;
        }
    });
}

function sendMMS(mediaUrl, toNumber) {
    client.messages.create({
        mediaUrl: mediaUrl,
        to: '+1' + toNumber,
        from: config.twilio.from,
        body: config.twilio.defaultMessage
    }, function(err, message) {
        if (err) {
            throw err;
        }
    });
}

app.listen(config.express.port, '0.0.0.0', () => console.log('Example app listening on port ' + config.express.port + '!'))