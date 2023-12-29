const {ServicePrincipal, Role, PolicyStatement} = require("aws-cdk-lib/aws-iam");
const {Construct} = require('constructs')
const iam = require("aws-cdk-lib/aws-iam");

class LambdaToDynamoDBAccessRole extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);

        this.role = new iam.Role(this, 'LambdaToDynamoDBAccessRole', {
            roleName: 'LambdaToDynamoDBAccessRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
            ]
        })
    }
}

class LambdaPublisherRole extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);

        const snsTopicPolicy = new iam.PolicyStatement({
            actions: ['sns:publish'],
            resources: ['*'],
        });

        const role = new Role(this, 'LambdaPublisherRole', {
            roleName: 'LambdaPublisherRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ]
        })
        role.addToPolicy(snsTopicPolicy)
        this.role = role
    }
}


class StandardLambdaRole extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);

        this.role = new Role(this, 'StandardLambdaRole', {
            roleName: 'StandardLambdaRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ]
        })
    }
}


module.exports = {
    LambdaToDynamoDBAccessRole,
    LambdaPublisherRole,
    StandardLambdaRole
}