const express = require('express');
const router = express.Router();

const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

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
                // const data = await uploadFile(buffer, fileName, type);

                // async () => {
                    const files = await imagemin([path], {
                        destination: 'build/images',
                        plugins: [
                            // imageminJpegtran(),
                            imageminPngquant({
                                quality: [0.6, 0.8]
                            })
                        ]
                    });
                 
                    console.log(files);
                    //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
                // }

                return response.status(200).send(files);
            } catch (error) {
                return response.status(400).send(error);
            }
        });
    })

module.exports = router