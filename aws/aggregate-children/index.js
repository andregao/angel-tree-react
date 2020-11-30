const DYNAMODB_ENDPOINT = 'http://docker.for.mac.localhost:8000';
const REGION = 'us-east-1';
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

exports.childItemStreamAggregateToSummary = async (event, context) => {
  // get current tree content
  const getItemParams = {
    TableName: 'Summary',
    Key: { use: { S: 'tree' } },
  };
  const { Item } = await dbClient.send(new GetItemCommand(getItemParams));
  const {
    content: { children: prevChildren },
  } = unmarshall(Item);
  // extract data from stream
  const record = event.Records[0];
  const {
    eventName,
    dynamodb: { NewImage, OldImage },
  } = record;

  let newChildren = null;
  // create and update use NewImage
  if (eventName === 'INSERT' || eventName === 'MODIFY') {
    const updatedChild = unmarshall(NewImage);
    console.log('stream record unpacked', JSON.stringify(updatedChild));
    const { donated, id, gender, age } = updatedChild;
    const newChild = { donated, id, gender, age };
    // modify tree content
    eventName === 'INSERT' && (newChildren = [...prevChildren, newChild]);
    if (eventName === 'MODIFY') {
      const targetIndex = prevChildren.findIndex(child => child.id === id);
      newChildren = [
        ...prevChildren.slice(0, targetIndex),
        newChild,
        ...prevChildren.slice(targetIndex + 1, -1),
      ];
    }
  }
  // delete uses OldImage
  if (eventName === 'REMOVE') {
    // modify tree content
    newChildren = prevChildren.filter(child => child.id !== OldImage.id.S);
  }
  const updated = Date.now();
  const newTreeContent = { updated, children: newChildren };
  // update tree content
  const updateItemParams = {
    TableName: 'Summary',
    Key: { use: { S: 'tree' } },
    UpdateExpression: 'SET content = :content',
    ExpressionAttributeValues: marshall({
      ':content': newTreeContent,
    }),
  };
  await dbClient.send(new UpdateItemCommand(updateItemParams));
  console.log(`update tree success, event: ${eventName}`);
};
