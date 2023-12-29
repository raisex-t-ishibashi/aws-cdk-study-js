const {Construct} = require('constructs')
const lambda = require('aws-cdk-lib/aws-lambda')
const lambda_nodejs = require('aws-cdk-lib/aws-lambda-nodejs')
const {Duration} = require('aws-cdk-lib')
const logs = require("aws-cdk-lib/aws-logs");

class LambdaFunction1 extends Construct {
    func = null

    constructor(scope, id, props) {
        super(scope, id);

        // Lambda Function
        this.func = new lambda.Function(this, 'LambdaFunction1', {
            functionName: 'LambdaFunction1',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/lambda-function1'),
            memorySize: 1024,
            timeout: Duration.seconds(30),
            logRetention: logs.RetentionDays.THREE_DAYS,
            role: props.role
        })
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
        })
    }
}

class LambdaFunction3 extends Construct {
    func = null

    constructor(scope, id, props) {
        super(scope, id);

        this.func = new lambda.Function(this, 'LambdaFunction3', {
            functionName: 'LambdaFunction3',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/lambda-function3'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            role: props.role,
            environment: {
                SNS_TOPIC_ARN_PARAM_NAME: props.SNS_TOPIC_ARN_PARAM_NAME,
            },
        })
    }
}

module.exports = {
    LambdaFunction1,
    LambdaFunction2,
    LambdaFunction3
}