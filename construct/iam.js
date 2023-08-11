const {ServicePrincipal, Role, ManagedPolicy} = require("aws-cdk-lib/aws-iam");
const {Construct} = require('constructs')

class LambdaPublisherRole extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);
        this.role = new Role(this, 'LambdaToDynamoDBAccessRole2', {
            roleName: 'LambdaToDynamoDBAccessRole2',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                // TODO ポリシー変更
                // ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                // ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaSQSQueueExecutionRole')
            ]
        })
    }
}

module.exports = {
    LambdaToDynamoDbAccessRole2: LambdaPublisherRole
}