const {Construct} = require('constructs')
const sns = require('aws-cdk-lib/aws-sns')
const {SqsSubscription, EmailSubscription} = require('aws-cdk-lib/aws-sns-subscriptions')
const ssm = require('aws-cdk-lib/aws-ssm')
const {MyQueue} = require('./sqs')
const {SubscriptionFilter} = require("aws-cdk-lib/aws-sns");

class L2LOnSuccessTopic1 extends Construct {
    topic = null
    constructor(scope, id) {
        super(scope, id);

        const email = ssm.StringParameter.valueFromLookup(this, 'test-email')

        const topic = new sns.Topic(this, 'L2LOnSuccessTopic1', {
            displayName: 'L2LOnSuccessTopic1 Display name',
            topicName: 'L2LOnSuccessTopic1'
        })
        topic.addSubscription(new EmailSubscription(email, {
            filterPolicy: {
                alertType: SubscriptionFilter.stringFilter({allowlist: ['error', 'warn']})
            }
        }))
        this.topic = topic
    }
}

module.exports = {
    L2LOnSuccessTopic1
}