const { DYNAMODB_ENDPOINT, REGION } = require('../env');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

let dbClient;
if (process.env.AWS_SAM_LOCAL) {
  console.log('sam local detected');
  dbClient = new DynamoDBClient({
    endpoint: DYNAMODB_ENDPOINT,
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
    Key: { use: { S: 'tree' } },
  };
  try {
    const { Item } = await dbClient.send(new GetItemCommand(params));
    const item = unmarshall(Item);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
      },
      body: JSON.stringify(item),
    };

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
  } catch (err) {
    console.log('caught error', err);
    return { statusCode: 500 };
  }
};

exports.getChildInfoByIdHandler = async event => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getChildInfoById only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info('received:', event);

  const id = event.pathParameters.id;
  const params = {
    TableName: 'Child',
    Key: { id: { S: id } },
    ProjectionExpression: 'id,sizes,wishes,claimed,#date',
    // apparently 'date' is a dynamoDB 'reserved word'
    ExpressionAttributeNames: {
      '#date': 'date',
    },
  };
  const { Item } = await dbClient.send(new GetItemCommand(params));
  const item = unmarshall(Item);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET',
    },
    body: JSON.stringify(item),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
