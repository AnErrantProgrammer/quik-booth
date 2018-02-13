module.exports = {
    express: {
        port: 3000
    },
    twilio: {
        accountSid: process.env.TWILIO_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        authToken: process.env.TWILIO_AUTH_TOKEN || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        from: '+1XXXXXXXXXX',
        defaultMessage: 'Hello World!'
    },
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY || 'AKIAxxxxxxxxxxxxxxxx',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ||'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },
    s3_bucket: {
        region: 's3.us-east-2.amazonaws.com',
        name: 'photobooth'
    }
};