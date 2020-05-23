const express = require('express');
const router = express.Router();
// const sharp = require('sharp');

const AWS = require('aws-sdk');
AWS.config.update({ 
    region: 'us-west-2', 
    accessKeyId: 'AKIAYTSD6F4Z3JZZ76UQ', 
    secretAccessKey: "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" 
})
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

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
                const fileName = `CompressionTest/${timestamp}-lg`;
                // sharp(buffer)            
                // .resize(200)            
                // .toBuffer()            
                // .then( newBuffer => {
                    const data = await uploadFile(newBuffer, fileName, type);
                    return response.status(200).send(data); 
                // })
            } catch (error) {
                return response.status(400).send(error);
            }
        });
    })

module.exports = router