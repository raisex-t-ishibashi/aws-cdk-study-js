const {Stack, Duration, RemovalPolicy, aws_apigateway} = require('aws-cdk-lib')
const dynamodb = require('aws-cdk-lib/aws-dynamodb')
const lambda = require('aws-cdk-lib/aws-lambda')
const lambda_nodejs = require('aws-cdk-lib/aws-lambda-nodejs')
const iam = require('aws-cdk-lib/aws-iam')
const {ServicePrincipal} = require("aws-cdk-lib/aws-iam");

class ApplicationStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        // LambdaのIAMロール
        const lambdaToDynamoDBAccessRole = new iam.Role(this, 'LambdaToDynamoDBAccessRole', {
            roleName: 'LambdaToDynamoDBAccessRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
            ]
        })

        // DynamoDB
        const table_test_data = new dynamodb.Table(this, 'test_data', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'type',
                type: dynamodb.AttributeType.STRING
            },
            tableName: 'test_data',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除される
            deletionProtection: true
        })
        table_test_data.addGlobalSecondaryIndex({
            indexName: 'gsi-group',
            partitionKey: {name: 'group', type: dynamodb.AttributeType.STRING},
            projectionType: dynamodb.ProjectionType.ALL
        })
        table_test_data.addGlobalSecondaryIndex({
            indexName: 'gsi-club',
            partitionKey: {name: 'club', type: dynamodb.AttributeType.STRING},
            sortKey: {name: 'member', type: dynamodb.AttributeType.STRING},
            projectionType: dynamodb.ProjectionType.ALL
        })

        // Lambda Function
        const function1 = new lambda.Function(this, 'function1', {
            functionName: 'TestFunction',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            role: lambdaToDynamoDBAccessRole
        })
        const function2 = new lambda_nodejs.NodejsFunction(this, 'function2', {
            entry: 'lambda/index.js',
            handler: 'handler',
            functionName: 'TestFunction2',
            memorySize: 1024,
            timeout: Duration.seconds(60),
            role: lambdaToDynamoDBAccessRole
        })
        const function3 = new lambda.Function(this, 'function3', {
            functionName: 'TestFunction3',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            role: lambdaToDynamoDBAccessRole
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
        const restApi = new aws_apigateway.RestApi(this, 'cdk_example_api2', {
            restApiName: 'cdk_example_api2'
        })
        const items = restApi.root.addResource('items')
        /*
         * GET /items
         * POST /items
         */
        items.addMethod('GET')
        items.addMethod('POST')

        const item = items.addResource('{id}')
        /*
         * GET /items/{id}
         * PATCH /items/{id}
         * DELETE /items/{id}
         */
        item.addMethod('GET')
        item.addMethod('PATCH')
        item.addMethod('DELETE')
    }
}

module.exports = { ApplicationStack }