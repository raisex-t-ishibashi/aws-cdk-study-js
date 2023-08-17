const {Stack, Duration, RemovalPolicy, aws_apigateway, aws_lambda_destinations} = require('aws-cdk-lib')
const lambda = require('aws-cdk-lib/aws-lambda')
const lambda_nodejs = require('aws-cdk-lib/aws-lambda-nodejs')
const {LambdaFunction1, LambdaFunction2, LambdaFunction3} = require('../construct/lambda-functions')
const {LambdaToDynamoDBAccessRole, LambdaPublisherRole} = require("../construct/iam");
const {CdkExampleApi3, CdkExampleApi2} = require("../construct/api-gateway");
const {L2LOnSuccessTopic1} = require('../construct/sns')
const {MyQueue} = require('../construct/sqs')
const {SqsEventSource} = require("aws-cdk-lib/aws-lambda-event-sources");
const {SqsSubscription} = require("aws-cdk-lib/aws-sns-subscriptions");
const {DynamodbTables} = require("../construct/dynamodb");
const logs = require('aws-cdk-lib/aws-logs')

/**
 * サーバレスアプリケーションスタックサンプル
 * ・API Gateway + Lambda + DynamoDB
 * ・Lambda + SNS + SQS
 */
class ApplicationStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        /*********************************
         * API Gateway + Lambda + DynamoDB
         *********************************/
        // Lambda -> DynamoDBアクセスののIAMロール
        const lambdaToDynamoDBAccessRole = new LambdaToDynamoDBAccessRole(this, 'LambdaToDynamoDBAccessRole').role

        // DynamoDB
        new DynamodbTables(this, 'DynamodbTables')

        // Lambda Function
        const function1 = new lambda.Function(this, 'TestFunction1', {
            // functionName: 'TestFunction1',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/test-function1'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            role: lambdaToDynamoDBAccessRole,
        })
        const function2 = new lambda_nodejs.NodejsFunction(this, 'TestFunction2', {
            entry: 'lambda/test-function2/index.js',
            handler: 'handler',
            // functionName: 'TestFunction2',
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            role: lambdaToDynamoDBAccessRole,
        })
        const function3 = new lambda.Function(this, 'TestFunction3', {
            // functionName: 'TestFunction3',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/test-function3'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            role: lambdaToDynamoDBAccessRole,
        })

        // Lambda統合のAPI Gateway
        const lambdaRestApi = new aws_apigateway.LambdaRestApi(this, 'cdk_example_api', {
            restApiName: 'cdk_example_api',
            handler: function1,
            proxy: false
        })
        const resource1 = lambdaRestApi.root.addResource('hello-function1')
        // GET /hello-funciton1
        resource1.addMethod('GET', new aws_apigateway.LambdaIntegration(function1))

        const resource2 = lambdaRestApi.root.addResource('hello-function2')
        // POST /hello-funciton2
        resource2.addMethod('POST', new aws_apigateway.LambdaIntegration(function2))
        // POST /hello-funciton2/path
        const childResource2 = resource2.addResource('path')
        childResource2.addMethod('POST', new aws_apigateway.LambdaIntegration(function3))

        // 普通のRestAPI
        new CdkExampleApi2(this, 'CdkExampleApi2')
        new CdkExampleApi3(this, 'CdkExampleApi3')

        /*********************************
         * Lambda + SNS + SQS
         *********************************/
        // SNS, SQS
        // const myQueue = new MyQueue(this, 'MyQueue1')
        // const l2LOnSuccessTopic1 = new L2LOnSuccessTopic1(this, 'L2LOnSuccessTopic1')
        // l2LOnSuccessTopic1.topic.addSubscription(new SqsSubscription(myQueue.queue))
        //
        // // Lambda
        // const lambdaPublisherRole = new LambdaPublisherRole(this, 'LambdaPublisherRole').role
        //
        //
        // const func1 = new LambdaFunction1(this, 'LambdaFunction1')
        // const func2 = new LambdaFunction2(this, 'LambdaFunction2')
        // const func3 = new LambdaFunction3(this, 'LambdaFunction3')
        // func1.func.role = lambdaPublisherRole
        // func2.func.role = lambdaPublisherRole
        // func3.func.role = lambdaPublisherRole
        //
        // // Lambdaのトリガーと送信先
        // func3.func.onSuccess = new aws_lambda_destinations.SnsDestination(l2LOnSuccessTopic1.topic)
        // func1.func.addEventSource(new SqsEventSource(myQueue.queue))
    }
}

module.exports = {ApplicationStack}