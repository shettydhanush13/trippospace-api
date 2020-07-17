const express = require('express');
const router = express.Router();


var AWS = require('aws-sdk');
AWS.config.update({ 
    region: 'us-west-2', 
    accessKeyId: 'AKIA24IHNYBA4XWTVTFV', 
    secretAccessKey: "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" 
})
var iam = new AWS.IAM({apiVersion: '2010-05-08'});

// const AWS = require('aws-sdk');
// AWS.config.update({ 
//     region: 'us-west-2', 
//     accessKeyId: 'AKIAYTSD6F4Z3JZZ76UQ', 
//     secretAccessKey: "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" 
// })
// s3 = new AWS.S3({ apiVersion: '2006-03-01' });


const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');

const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: "trippospace",
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
};

router.route('/listIamUser')
    .post((request, response) => {
        iam.listUsers(request.body, function(err, data) {
            if (err) response.send(err); // an error occurred
            else     response.send(data);           // successful response
        });
    })

router.route('/getIamUser')
    .post((request, response) => {
        iam.getUser(request.body, function(err, data) {
            if (err) response.send(err); // an error occurred
            else     response.send(data);           // successful response
        });
    })

router.route('/createIamUser')
    .post((request, response) => {
        iam.createUser(request.body, function(err, data) {
            if (err) response.send(err); // an error occurred
            else     response.send(data);           // successful response
          });
    })

router.route('/updateIamUser')
    .post((request, response) => {
        iam.updateUser(request.body, function(err, data) {
            if (err) response.send(err); // an error occurred
            else     response.send(data);           // successful response
          });
    })

router.route('/deleteIamUser')
    .post((request, response) => {
        iam.deleteUser(request.body, function(err, data) {
            if (err) response.send(err); // an error occurred
            else     response.send(data); // successful response
          });
    })

router.route('/')
    //to upload an image to s3
    .post((request, response) => {
        const form = new multiparty.Form();
        form.parse(request, async (error, fields, files) => {
            if (error) throw new Error(error);
            try {
                const path = files.file[0].path;
                const buffer = fs.readFileSync(path);
                const type = fileType(buffer);
                const timestamp = Date.now().toString();
                const fileName = `place/${timestamp}-trpspc`;
                const data = await uploadFile(buffer, fileName, type);
                return response.status(200).send(data);
            } catch (error) {
                return response.status(400).send(error);
            }
        });
    })

module.exports = router