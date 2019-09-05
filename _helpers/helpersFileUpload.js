const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/env');

aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: 'us-east-1'
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: config.AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.originalname});
            cb(null, Object.assign({}, req.body));
        },
        key: function (req, file, cb) {
            cb(null, "adnetwork/"+Date.now()+"/" + file.originalname); //use
        }
    })
});

module.exports = upload;