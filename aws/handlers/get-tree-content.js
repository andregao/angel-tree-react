const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const REGION = 'us-east-1';
const ENDPOINT = 'http://Andre-Macbook.local:8000';
let dbClient;
if (process.env.AWS_SAM_LOCAL) {
  console.log('sam local detected');
  dbClient = new DynamoDBClient({
    endpoint: ENDPOINT,
    region: REGION,
  });
} else {
  dbClient = new DynamoDBClient(REGION);
}

exports.getTreeContentHandler = async event => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getTreeContent only accept GET method, you tried: ${event.httpMethod}`
    );
  }

  console.info('received:', event);
  const params = {
    TableName: 'Summary',
    Key: { Use: { S: 'tree' } },
  };

  const { Item } = await dbClient.send(new GetItemCommand(params));
  const item = unmarshall(Item);

  const response = {
    statusCode: 200,
    body: JSON.stringify(item),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
