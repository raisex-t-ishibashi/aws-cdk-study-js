const {Construct} = require('constructs')
const {aws_apigateway} = require("aws-cdk-lib");

class CdkExampleApi3 extends Construct {
    api = null

    constructor(scope, id) {
        super(scope, id);

        this.api = new aws_apigateway.RestApi(this, 'CdkExampleApi3', {
            restApiName: 'CdkExampleApi3'
        })

        const items = this.api.root.addResource('items')
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

module.exports = {
    CdkExampleApi3
}