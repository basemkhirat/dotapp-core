const Config = require('dotapp/services/config');
const aws = require('aws-sdk');

aws.config.update(Config.get("services.aws"));

module.exports = aws;

