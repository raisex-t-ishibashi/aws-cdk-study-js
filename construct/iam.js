const {ServicePrincipal, Role, ManagedPolicy} = require("aws-cdk-lib/aws-iam");
const {Construct} = require('constructs')

class LambdaToDynamoDbAccessRole2 extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);
        this.role = new Role(this, 'LambdaToDynamoDBAccessRole2', {
            roleName: 'LambdaToDynamoDBAccessRole2',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
            ]
        })
    }
}

module.exports = {
    LambdaToDynamoDbAccessRole2
}