const {Construct} = require('constructs')
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const {RemovalPolicy} = require("aws-cdk-lib");


class DynamodbTables extends Construct {

    constructor(scope, id) {
        super(scope, id);

        this.test_data()
        this.example1()
        this.example2()
        this.example3()
    }

    test_data() {
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
            deletionProtection: false // trueにするとスタック削除が失敗する。
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
    }

    example1() {
        new dynamodb.Table(this, 'example1', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'type',
                type: dynamodb.AttributeType.STRING
            },
            tableName: 'example1',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除される
            deletionProtection: false // trueにするとスタック削除が失敗する。
        })
    }

    example2() {
        new dynamodb.Table(this, 'example2', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'type',
                type: dynamodb.AttributeType.STRING
            },
            tableName: 'example2',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除される
            deletionProtection: false // trueにするとスタック削除が失敗する。
        })
    }

    example3() {
        new dynamodb.Table(this, 'example3', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'type',
                type: dynamodb.AttributeType.STRING
            },
            tableName: 'example3',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除される
            deletionProtection: false // trueにするとスタック削除が失敗する。
        })
    }
}

module.exports = {
    DynamodbTables
}