export async function handler(event, context) {
    console.log(JSON.stringify(event))
    return {statusCode: 200, body: 'hello world'}
}
