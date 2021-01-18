const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const { config } = require("../config")

const AWS = require('aws-sdk');
AWS.config.update(config.s3config)
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: "trippospace",
        ContentEncoding: 'base64',
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
};

router.route('/')
    //to upload an image to s3
    .post(async (request, response) => {
        try {
          buffer = Buffer.from(request.body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')
          const type = fileType(buffer);
          const timestamp = Date.now().toString();
          const fileName = `place/${timestamp}-trpspc`;
          const data = await uploadFile(buffer, fileName, type);
          return response.status(200).send(data);
        } catch (error) {
           return response.status(400).send(error);
        }
    })

module.exports = router