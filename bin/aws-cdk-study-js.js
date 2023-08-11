#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { AwsCdkStudyJsStack } = require('../lib/aws-cdk-study-js-stack');
const { ApplicationStack } = require('../lib/application-stack');

const envTokyo = {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
}

const app = new cdk.App();
const applicationStack = new ApplicationStack(app, 'ApplicationStack', envTokyo)

// 一括でタグ付け
cdk.Tags.of(app).add('workshop', 'aws-cdk-study')
cdk.Tags.of(applicationStack).add('workshop', 'aws-cdk-study')
cdk.Tags.of(applicationStack).add('env', 'sandbox')
