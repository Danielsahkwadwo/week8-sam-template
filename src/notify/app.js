const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.lambdaHandler = async (event, context) => {
    try {
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        
        const message = `New file uploaded to S3:
        Bucket: ${bucket}
        File: ${key}
        Time: ${event.Records[0].eventTime}`;
        
        const params = {
            Message: message,
            Subject: `New S3 Upload Notification (${process.env.Environment})`,
            TopicArn: process.env.SNS_TOPIC_ARN
        };
        
        await sns.publish(params).promise();
        console.log('Notification sent successfully');
        
        return { status: 'Message sent' };
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};