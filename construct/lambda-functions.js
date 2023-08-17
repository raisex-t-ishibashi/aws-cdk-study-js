const {LambdaToDynamoDbAccessRole2} = require('./iam')
const {L2LOnSuccessTopic1} = require('./sns')
const {Construct} = require('constructs')
const lambda = require('aws-cdk-lib/aws-lambda')
const lambda_nodejs = require('aws-cdk-lib/aws-lambda-nodejs')
const {Duration, aws_lambda_destinations} = require('aws-cdk-lib')
const {MyQueue} = require('./sqs')
const {SqsEventSource} = require("aws-cdk-lib/aws-lambda-event-sources");
const logs = require("aws-cdk-lib/aws-logs");

class LambdaFunction1 extends Construct {
    func = null

    constructor(scope, id) {
        super(scope, id);

        // Lambda Function
        this.func = new lambda.Function(this, 'LambdaFunction1', {
            functionName: 'LambdaFunction1',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/test-function1'),
            memorySize: 1024,
            timeout: Duration.seconds(30),
            logRetention: logs.RetentionDays.THREE_DAYS,
            // role: new LambdaToDynamoDbAccessRole2(this, 'LambdaToDynamoDbAccessRole2').role
        })
        // func.addEventSource(new SqsEventSource(new MyQueue(this, 'MyQueue').queue))
        // this.func = func
    }
}

class LambdaFunction2 extends Construct {
    func = null

    constructor(scope, id) {
        super(scope, id);

        this.func = new lambda_nodejs.NodejsFunction(this, 'LambdaFunction2', {
            entry: 'lambda/test-function2/index.js',
            handler: 'handler',
            functionName: 'LambdaFunction2',
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            // role: LambdaToDynamoDbAccessRole2.role
        })
    }
}

class LambdaFunction3 extends Construct {
    func = null

    constructor(scope, id) {
        super(scope, id);

        this.func = new lambda.Function(this, 'LambdaFunction3', {
            functionName: 'LambdaFunction3',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/test-function3'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            // onSuccess: new aws_lambda_destinations.SnsDestination(new L2LOnSuccessTopic1(this, 'L2LOnSuccessTopic1').topic)
            // role: LambdaToDynamoDbAccessRole2.role
        })
    }
}

module.exports = {
    LambdaFunction1,
    LambdaFunction2,
    LambdaFunction3
}