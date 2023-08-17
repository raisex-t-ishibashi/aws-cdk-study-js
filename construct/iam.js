const {ServicePrincipal, Role, PolicyStatement} = require("aws-cdk-lib/aws-iam");
const {Construct} = require('constructs')
const iam = require("aws-cdk-lib/aws-iam");

class LambdaToDynamoDBAccessRole extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);

        const role = new iam.Role(this, 'LambdaToDynamoDBAccessRole', {
            roleName: 'LambdaToDynamoDBAccessRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
            ]
        })
        this.role = role
    }
}

class LambdaPublisherRole extends Construct {
    role = null

    constructor(scope, id) {
        super(scope, id);

        const policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "VisualEditor0",
                    "Effect": "Allow",
                    "Action": [
                        "events:PutEvents",
                        "sns:Publish",
                        "sqs:SendMessage"
                    ],
                    "Resource": [
                        "arn:aws:sqs:ap-northeast-1:717366958267:*",
                        "arn:aws:sns:ap-northeast-1:717366958267:*",
                        "arn:aws:events:ap-northeast-1:717366958267:event-bus/*"
                    ]
                }
            ]
        }

        const role = new Role(this, 'LambdaPublisherRole', {
            roleName: 'LambdaPublisherRole',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        })
        role.addToPolicy(PolicyStatement.fromJson(policy))
        this.role = role
    }
}

module.exports = {
    LambdaToDynamoDBAccessRole,
    // LambdaPublisherRole
}