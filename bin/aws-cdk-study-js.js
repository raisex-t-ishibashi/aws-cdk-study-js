#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { AwsCdkStudyJsStack } = require('../lib/aws-cdk-study-js-stack');
const { ApplicationStack } = require('../lib/application-stack');

const app = new cdk.App();
new ApplicationStack(app, 'ApplicationStack', {})
