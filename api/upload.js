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
        form.parse(request, async (error, fields, files) => {
            if (error) {
                console.log("s3 error 1 : ",JSON.stringify(error))
                throw new Error(error)
            }
            try {
                const path = files.file[0].path;
                const buffer = fs.readFileSync(path);
                const type = fileType(buffer);
                const timestamp = Date.now().toString();
                const fileName = `place/${timestamp}-trpspc`;
                console.log("s3 error path : ",path)
                console.log("s3 error type : ",type)
                console.log("s3 error timestamp : ",timestamp)
                console.log("s3 error fileName : ",fileName)
                console.log("s3 error buffer : ",buffer)
                const data = await uploadFile(buffer, fileName, type);
                console.log("s3 error data : ",data)
                return response.status(200).send(data);
            } catch (error2) {
                console.log("s3 error : ",JSON.stringify(error2))
                return response.status(400).send(error2);
            }
        });
    })

module.exports = router