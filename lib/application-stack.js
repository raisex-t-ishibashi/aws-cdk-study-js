const {Stack, Duration, RemovalPolicy} = require('aws-cdk-lib')
const dynamodb = require('aws-cdk-lib/aws-dynamodb')
const lambda = require('aws-cdk-lib/aws-lambda')
const iam = require('aws-cdk-lib/aws-iam')
const {ServicePrincipal} = require("aws-cdk-lib/aws-iam");

class ApplicationStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const lambdaToDynamoDBAccessRole = new iam.Role(this, 'LambdaToDynamoDBAccessRole', {
            roleName: 'LambdaToDynamoDBAccessRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
            ]
        })

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
            removalPolicy: RemovalPolicy.DESTROY,
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

        new lambda.Function(this, 'function1', {
            functionName: 'TestFunction',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            role: lambdaToDynamoDBAccessRole
        })
        new lambda.Function(this, 'function2', {
            functionName: 'TestFunction2',
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda'),
            memorySize: 1024,
            timeout: Duration.seconds(60),
            role: lambdaToDynamoDBAccessRole
        })
    }
}

module.exports = { ApplicationStack }