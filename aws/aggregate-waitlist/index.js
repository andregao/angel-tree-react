const DYNAMODB_ENDPOINT = 'http://docker.for.mac.localhost:8000';
const REGION = 'us-west-1';
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
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

exports.waitlistItemStreamAggregateToSummary = async (event, context) => {
  // extract data from stream
  const record = event.Records[0];
  const {
    eventName,
    dynamodb: { NewImage, OldImage },
  } = record;

  // get current donations summary
  const getSummaryParams = {
    TableName: 'Summary',
    Key: { use: { S: 'waitlist' } },
  };
  const { Item: waitlistItem } = await dbClient.send(
    new GetItemCommand(getSummaryParams)
  );
  const { content: waitlistSummary } = unmarshall(waitlistItem);
  // create and update use NewImage
  if (eventName === 'INSERT' || eventName === 'MODIFY') {
    const updatedCandidate = unmarshall(NewImage);
    const { id } = updatedCandidate;

    // add or update child
    waitlistSummary[id] = updatedCandidate;
    if (eventName === 'INSERT') {
      waitlistSummary.ids.push(id);
    }
  }
  // delete uses OldImage
  if (eventName === 'REMOVE') {
    // delete donation
    const oldId = OldImage.id.S;
    waitlistSummary.ids = waitlistSummary.ids.filter(
      donationId => donationId !== oldId
    );
    delete waitlistSummary[oldId];
  }

  // compose update request
  const updateSummaryParams = {
    TableName: 'Summary',
    Key: { use: { S: 'waitlist' } },
    UpdateExpression: 'SET content = :content',
    ExpressionAttributeValues: marshall({
      ':content': waitlistSummary,
    }),
  };
  await dbClient.send(new UpdateItemCommand(updateSummaryParams));
};
