const { DYNAMODB_ENDPOINT, REGION } = require('../env');
const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  TransactWriteItemsCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

// v2 sdk
// const AWS = require('aws-sdk');
// const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET',
};

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
        ...corsHeaders,
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
    ProjectionExpression: 'id,sizes,wishes,donated,#date,gender,age',
    ExpressionAttributeNames: {
      '#date': 'date',
    },
  };
  const { Item } = await dbClient.send(new GetItemCommand(params));
  const item = unmarshall(Item);

  const response = {
    statusCode: 200,
    headers: {
      ...corsHeaders,
    },
    body: JSON.stringify(item),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};

exports.postDonationHandler = async event => {
  // request
  if (event.httpMethod !== 'POST') {
    throw new Error(
      `postDonation only accept POST method, you tried: ${event.httpMethod}`
    );
  }
  console.info('received:', event);
  const childId = event.pathParameters.id;
  const donationDetails = JSON.parse(event.body);
  donationDetails.childId = childId;

  // transaction
  const timestamp = Date.now();
  const donationId =
    timestamp.toString().slice(-9) + Math.floor(Math.random() * 100);
  donationDetails.date = timestamp;
  donationDetails.id = donationId;
  console.log(donationDetails);
  const transactParams = {
    TransactItems: [
      {
        Update: {
          TableName: 'Child',
          Key: { id: { S: childId } },
          ConditionExpression: 'donated = :false',
          UpdateExpression:
            'SET donated = :true, ' +
            'donationId = :donationId, ' +
            '#date = :date, ' +
            'donorName = :donorName',
          ExpressionAttributeValues: marshall({
            ':true': true,
            ':false': false,
            ':date': timestamp,
            ':donationId': donationId,
            ':donorName': donationDetails.name,
          }),
          ExpressionAttributeNames: {
            '#date': 'date',
          },
        },
      },
      { Put: { TableName: 'Donation', Item: marshall(donationDetails) } },
    ],
  };
  try {
    const transactionResponse = await dbClient.send(
      new TransactWriteItemsCommand(transactParams)
    );
    console.log('transaction response from DynamoDB', transactionResponse);
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
      },
      body: 'Donation Submitted',
    };
  } catch (err) {
    const errorResponse = handleTransactWriteItemsError(err);
    return { ...errorResponse, headers: { ...corsHeaders } };
  }
};

// error handling template from AWS, made meaningful in a few cases to client
const internal = { statusCode: 500 };
function handleTransactWriteItemsError(err) {
  if (!err) {
    console.error('Encountered error object was empty');
    return internal;
  }
  if (!err.code) {
    console.error(
      `An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(
        err
      )}`
    );
    return internal;
  }
  switch (err.code) {
    case 'TransactionCanceledException':
      // used in react client
      console.error(
        `Transaction Cancelled, implies a client issue, fix before retrying. Error: ${err.message}`
      );
      return { statusCode: 403, body: 'already donated' };
    case 'TransactionInProgressException':
      console.error(`The transaction with the given request token is already in progress,' +
        ' consider changing retry strategy for this type of error. Error: ${err.message}`);
      return internal;
    case 'IdempotentParameterMismatchException':
      console.error(`Request rejected because it was retried with a different payload but with a request token that was already used, ' +
        'change request token for this payload to be accepted. Error: ${err.message}`);
      return internal;
    default:
      break;
    // Common DynamoDB API errors are handled below
  }
  handleCommonErrors(err);
}

function handleCommonErrors(err) {
  switch (err.code) {
    case 'InternalServerError':
      console.error(
        `Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`
      );
      return internal;
    case 'ProvisionedThroughputExceededException':
      console.error(
        `Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.` +
          `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`
      );
      return internal;
    case 'ResourceNotFoundException':
      console.error(
        `One of the tables was not found, verify table exists before retrying. Error: ${err.message}`
      );
      return internal;
    case 'ServiceUnavailable':
      console.error(
        `Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`
      );
      return internal;
    case 'ThrottlingException':
      console.error(
        `Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`
      );
      return internal;
    case 'UnrecognizedClientException':
      console.error(
        `The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.` +
          `Error: ${err.message}`
      );
      return internal;
    case 'ValidationException':
      console.error(
        `The input fails to satisfy the constraints specified by DynamoDB, ` +
          `fix input before retrying. Error: ${err.message}`
      );
      return internal;
    case 'RequestLimitExceeded':
      console.error(
        `Throughput exceeds the current throughput limit for your account, ` +
          `increase account level throughput before retrying. Error: ${err.message}`
      );
      return internal;
    default:
      console.error(
        `An exception occurred, investigate and configure retry strategy. Error: ${err.message}`
      );
      return internal;
  }
}
