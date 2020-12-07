const DYNAMODB_ENDPOINT = 'http://docker.for.mac.localhost:8000';
const REGION = 'us-west-1';
const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  TransactWriteItemsCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
require('dotenv').config();

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

exports.getChildrenSummaryHandler = async event => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getChildrenSummary only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info('received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  // compose getItem request
  const params = {
    TableName: 'Summary',
    Key: { use: { S: 'children' } },
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
    handleCRUDError(err);
    return {
      statusCode: 500,
    };
  }
};

exports.getDonationsSummaryHandler = async event => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getDonationsSummary only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info('received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  // compose getItem request
  const params = {
    TableName: 'Summary',
    Key: { use: { S: 'donations' } },
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
    handleCRUDError(err);
    return {
      statusCode: 500,
    };
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
      body: JSON.stringify({ result: 'Donation Submitted' }),
    };
  } catch (err) {
    const errorResponse = handleTransactWriteItemsError(err);
    return { ...errorResponse, headers: { ...corsHeaders } };
  }
};

exports.postChildHandler = async event => {
  if (event.httpMethod !== 'POST') {
    throw new Error(
      `postChild only accept POST method, you tried: ${event.httpMethod}`
    );
  }
  console.info('postChild received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  // organize data
  const data = JSON.parse(event.body);
  const { name, wishes, sizes, age, gender } = data;
  const timestamp = Date.now();
  const id = timestamp.toString().slice(-9) + Math.floor(Math.random() * 100);
  const childDetails = {
    id,
    name,
    wishes,
    sizes,
    age,
    gender,
    donated: false,
  };
  // compose put item request
  const params = {
    TableName: 'Child',
    Item: marshall(childDetails),
    ConditionExpression: `attribute_not_exists(id)`,
  };
  try {
    await dbClient.send(new PutItemCommand(params));
    console.log('putItem success, childId:', id);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify(childDetails),
    };
  } catch (err) {
    handleCRUDError(err);
    return {
      statusCode: 500,
    };
  }
};

exports.putChildHandler = async event => {
  if (event.httpMethod !== 'PUT') {
    throw new Error(
      `putChild only accept PUT method, you tried: ${event.httpMethod}`
    );
  }
  console.info('putChild received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  // organize data
  const id = event.pathParameters.id;
  const data = JSON.parse(event.body);
  const { name, wishes, sizes, age, gender } = data;
  // compose updateItem request
  const params = {
    TableName: 'Child',
    Key: { id: { S: id } },
    ConditionExpression: 'donated = :false',
    UpdateExpression:
      'SET #n = :name, ' +
      'wishes = :wishes, ' +
      '#s = :s, ' +
      'age = :age, ' +
      'gender = :gender',
    ExpressionAttributeNames: {
      '#n': 'name',
      '#s': 'sizes',
    },
    ExpressionAttributeValues: marshall({
      ':false': false,
      ':name': name,
      ':wishes': wishes,
      ':s': sizes,
      ':age': age,
      ':gender': gender,
    }),
  };
  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('updateItem success, childId:', id);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
    };
  } catch (err) {
    handleCRUDError(err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders },
    };
  }
};
exports.deleteChildHandler = async event => {
  console.info('deleteChild received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }

  // organize data
  const id = event.pathParameters.id;
  // compose delete request
  const params = {
    TableName: 'Child',
    Key: {
      id: { S: id },
    },
  };
  try {
    await dbClient.send(new DeleteItemCommand(params));
    console.log('deleteItem success, childId:', id);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
    };
  } catch (err) {
    handleCRUDError(err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders },
    };
  }
};
exports.putDonationHandler = async event => {
  if (event.httpMethod !== 'PUT') {
    throw new Error(
      `putDonation only accept PUT method, you tried: ${event.httpMethod}`
    );
  }
  console.info('putDonation received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  // organize data
  const id = event.pathParameters.id;
  const data = JSON.parse(event.body);
  const { name, phone, email, received } = data;
  let receiveDate = 0;
  received && (receiveDate = Date.now());
  // compose updateItem request
  const params = {
    TableName: 'Donation',
    Key: { id: { S: id } },
    UpdateExpression:
      'SET #n = :name, ' +
      'phone = :phone, ' +
      'email = :email, ' +
      'received = :received, ' +
      '#rd = :receiveDate',
    ExpressionAttributeNames: {
      '#n': 'name',
      '#rd': 'receiveDate',
    },
    ExpressionAttributeValues: marshall({
      ':name': name,
      ':phone': phone,
      ':email': email,
      ':received': received || false,
      ':receiveDate': receiveDate,
    }),
  };
  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('updateItem success, donation:', id);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify({ receiveDate }),
    };
  } catch (err) {
    handleCRUDError(err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders },
    };
  }
};
exports.deleteDonationHandler = async event => {
  console.info('deleteDonation received:', event);
  // authorization
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.startsWith('Bearer ')
  ) {
    console.log('secret missing');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }
  const secretWord = event.headers.Authorization.split('Bearer ')[1];
  if (secretWord !== process.env.SECRECT_WORD) {
    console.log('secret incorrect');
    return {
      statusCode: 403,
      headers: { ...corsHeaders },
    };
  }

  const donationId = event.pathParameters.id;
  // get child id from donation item
  const getParams = {
    TableName: 'Donation',
    Key: { id: { S: donationId } },
    ProjectionExpression: 'childId',
  };
  const { Item } = await dbClient.send(new GetItemCommand(getParams));
  const childId = Item.childId.S;
  // compose transaction request
  const transactParams = {
    TransactItems: [
      {
        Update: {
          TableName: 'Child',
          Key: { id: { S: childId } },
          ConditionExpression: 'donated=:true',
          UpdateExpression:
            'SET donated=:false REMOVE donationId, #date, donorName',
          ExpressionAttributeValues: marshall({
            ':true': true,
            ':false': false,
          }),
          ExpressionAttributeNames: {
            '#date': 'date',
          },
        },
      },
      {
        Delete: {
          TableName: 'Donation',
          Key: {
            id: { S: donationId },
          },
        },
      },
    ],
  };
  try {
    const transactionResponse = await dbClient.send(
      new TransactWriteItemsCommand(transactParams)
    );
    console.log('transaction response from DynamoDB', transactionResponse);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
    };
  } catch (err) {
    handleCRUDError(err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders },
    };
  }
};

exports.postWaitlistHandler = async event => {
  if (event.httpMethod !== 'POST') {
    throw new Error(
      `postWaitlist only accept POST method, you tried: ${event.httpMethod}`
    );
  }
  console.info('postChild received:', event);
  const data = JSON.parse(event.body);
  const { name, email, phone } = data;
  const date = Date.now();
  const id = date.toString().slice(-9) + Math.floor(Math.random() * 100);
  const waitlistDetails = {
    id,
    name,
    email,
    phone,
    date,
  };
  // compose put item request
  const params = {
    TableName: 'Waitlist',
    Item: marshall(waitlistDetails),
    ConditionExpression: `attribute_not_exists(id)`,
  };
  try {
    await dbClient.send(new PutItemCommand(params));
    console.log('postWaitlist success, ID:', id);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify(waitlistDetails),
    };
  } catch (err) {
    handleCRUDError(err);
    return {
      statusCode: 500,
    };
  }
};
// error handling templates from AWS, made meaningful in a few cases to client
const internal = { statusCode: 500 };

function handleCRUDError(err) {
  if (!err) {
    console.error('Encountered error object was empty');
    return;
  }
  if (!err.code && !err.name) {
    console.error(
      `An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(
        err
      )}`
    );
    return;
  }
  switch (err.code || err.name) {
    case 'ConditionalCheckFailedException':
      console.error(
        `Condition check specified in the operation failed, review and update the condition check before retrying. Error: ${err.message}`
      );
      return;
    case 'TransactionConflictException':
      console.error(`Operation was rejected because there is an ongoing transaction for the item, generally safe to retry ' +
       'with exponential back-off. Error: ${err.message}`);
      return;
    case 'ItemCollectionSizeLimitExceededException':
      console.error(
        `An item collection is too large, you're using Local Secondary Index and exceeded size limit of` +
          `items per partition key. Consider using Global Secondary Index instead. Error: ${err.message}`
      );
      return;
    default:
      break;
  }
  handleCommonErrors(err);
}
function handleTransactWriteItemsError(err) {
  if (!err) {
    console.error('Encountered error object was empty');
    return internal;
  }
  if (!err.code && !err.name) {
    console.error(
      `An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(
        err
      )}`
    );
    return internal;
  }
  switch (err.code || err.name) {
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
  }
  handleCommonErrors(err);
}

function handleCommonErrors(err) {
  switch (err.code || err.name) {
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
