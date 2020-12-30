const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');

const AWS = require('aws-sdk');
AWS.config.update({ 
    region: 'us-west-2', 
    accessKeyId: 'AKIAYTSD6F4Z3JZZ76UQ', 
    secretAccessKey: "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" 
})
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: "trippospace",
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    console.log("params : ",params)
    return s3.upload(params).promise();
};

router.route('/')
    //to upload an image to s3
    .post((request, response) => {
        const form = new multiparty.Form();
        console.log("form  : ",form)
        form.parse(request, async (error, fields, files) => {
            try {
                const path = files.file[0].path;
                console.log("s3 error path : ",path)
                const buffer = fs.readFileSync(path);
                console.log("s3 error buffer : ",buffer)
                const type = fileType(buffer);
                console.log("s3 error type : ",type)
                const timestamp = Date.now().toString();
                console.log("s3 error timestamp : ",timestamp)
                const fileName = `place/${timestamp}-trpspc`;
                console.log("s3 error fileName : ",fileName)
                const data = await uploadFile(buffer, fileName, type);
                console.log("s3 error data : ",data)
                return response.status(200).send(data);
            } catch (error2) {
                console.log("s3 error 2 : ",JSON.stringify(error2))
                return response.status(400).send(error2);
            }
        });
    })

module.exports = router