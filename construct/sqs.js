const {Construct} = require('constructs')
const sqs = require('aws-cdk-lib/aws-sqs')
const {Duration} = require("aws-cdk-lib");


class MyQueue extends Construct {
    queue = null
    constructor(scope, id) {
        super(scope, id);
        // const dlq = new sqs.Queue(this, 'MyDeadLetterQueue1', {
        //     queueName: 'MyDeadLetterQueue1'
        // })

        this.queue = new sqs.Queue(this, 'MyQueue1', {
            queueName: 'MyQueue1',
            visibilityTimeout: Duration.seconds(30),
            // deadLetterQueue: {
            //     queue: dlq,
            //     maxReceiveCount: 3
            // }
        })
    }
}

class MyDlq extends Construct {
    queue = null
    constructor(scope, id) {
        super(scope, id);

        this.queue = new sqs.Queue(this, 'MyDlq', {
            queueName: 'MyDlq'
        })
    }
}

module.exports = {
    MyQueue
}