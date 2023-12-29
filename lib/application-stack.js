const {Stack, Duration, RemovalPolicy, aws_apigateway, aws_lambda_destinations} = require('aws-cdk-lib')
const lambda = require('aws-cdk-lib/aws-lambda')
const lambda_nodejs = require('aws-cdk-lib/aws-lambda-nodejs')
const {LambdaFunction1, LambdaFunction2, LambdaFunction3} = require('../construct/lambda-functions')
const {LambdaToDynamoDBAccessRole, LambdaPublisherRole, StandardLambdaRole} = require("../construct/iam");
const {CdkExampleApi3, CdkExampleApi2} = require("../construct/api-gateway");
const {L2LOnSuccessTopic1} = require('../construct/sns')
const {MyQueue} = require('../construct/sqs')
const {SqsEventSource} = require("aws-cdk-lib/aws-lambda-event-sources");
const {SqsSubscription} = require("aws-cdk-lib/aws-sns-subscriptions");
const {DynamodbTables} = require("../construct/dynamodb");
const logs = require('aws-cdk-lib/aws-logs')
const ssm = require('aws-cdk-lib/aws-ssm')

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
            functionName: 'TestFunction1',
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
            functionName: 'TestFunction2',
            memorySize: 1024,
            timeout: Duration.seconds(60),
            logRetention: logs.RetentionDays.THREE_DAYS,
            role: lambdaToDynamoDBAccessRole,
        })
        const function3 = new lambda.Function(this, 'TestFunction3', {
            functionName: 'TestFunction3',
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
        const resource1 = lambdaRestApi.root.addResource('hello1')
        // GET /hello1
        resource1.addMethod('GET', new aws_apigateway.LambdaIntegration(function1))

        const resource2 = lambdaRestApi.root.addResource('hello2')
        // POST /hello2
        resource2.addMethod('POST', new aws_apigateway.LambdaIntegration(function2))
        // POST /hello2/path
        const childResource2 = resource2.addResource('path')
        childResource2.addMethod('POST', new aws_apigateway.LambdaIntegration(function3))

        // 普通のRestAPI
        new CdkExampleApi2(this, 'CdkExampleApi2')
        new CdkExampleApi3(this, 'CdkExampleApi3')

        /*********************************
         * Lambda + SNS + SQS
         *********************************/
        // IAM
        const publisherRole = new LambdaPublisherRole(this, 'LambdaPublisherRole')
        const standardRole = new StandardLambdaRole(this, 'StandardLambdaRole')

        // SNS, SQS
        const myQueue = new MyQueue(this, 'MyQueue1')
        const l2LOnSuccessTopic1 = new L2LOnSuccessTopic1(this, 'L2LOnSuccessTopic1')
        l2LOnSuccessTopic1.topic.addSubscription(new SqsSubscription(myQueue.queue))

        // SNSトピックのARNをSSMパラメータに保存
        const snsTopicArnParam = new ssm.StringParameter(this, 'SnsTopicArnParam', {
            parameterName: '/application/l2LOnSuccessTopic1',
            stringValue: l2LOnSuccessTopic1.topic.topicArn,
        });

        const func1 = new LambdaFunction1(this, 'LambdaFunction1', {role: standardRole.role})
        const func3 = new LambdaFunction3(this, 'LambdaFunction3', {
            role: publisherRole.role, env: {SNS_TOPIC_ARN_NAME: snsTopicArnParam.parameterName}
        })

        // Lambdaのトリガー
        func1.func.addEventSource(new SqsEventSource(myQueue.queue))
    }
}

module.exports = {ApplicationStack}