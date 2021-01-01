const LOCAL_ENDPOINT = 'http://docker.for.mac.localhost:8000';
const REGION = process.env.AWS_REGION;
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
    endpoint: LOCAL_ENDPOINT,
    region: REGION,
  });
} else {
  dbClient = new DynamoDBClient(REGION);
}

exports.childItemStreamAggregateToSummary = async (event, context) => {
  // extract data from stream
  const record = event.Records[0];
  const {
    eventName,
    dynamodb: { NewImage, OldImage },
  } = record;

  // UPDATE TREE
  // get current tree content
  const getTreeItemParams = {
    TableName: 'Summary',
    Key: { use: { S: 'tree' } },
  };
  const { Item: treeItem } = await dbClient.send(
    new GetItemCommand(getTreeItemParams)
  );
  const {
    content: { children: prevTreeChildren },
  } = unmarshall(treeItem);

  let newTreeChildren = null;
  // create and update use NewImage
  if (eventName === 'INSERT' || eventName === 'MODIFY') {
    const updatedChild = unmarshall(NewImage);
    console.log('stream record unpacked', JSON.stringify(updatedChild));
    const { donated, date, id, gender, age } = updatedChild;
    const newChild = { donated, id, gender, age, date: date ? date : 0 };
    // modify tree content
    eventName === 'INSERT' &&
      (newTreeChildren = [...prevTreeChildren, newChild]);
    if (eventName === 'MODIFY') {
      const targetIndex = prevTreeChildren.findIndex(child => child.id === id);
      newTreeChildren = [
        ...prevTreeChildren.slice(0, targetIndex),
        newChild,
        ...prevTreeChildren.slice(targetIndex + 1),
      ];
    }
  }
  // delete uses OldImage
  if (eventName === 'REMOVE') {
    // modify tree content
    newTreeChildren = prevTreeChildren.filter(
      child => child.id !== OldImage.id.S
    );
  }
  const updated = Date.now();
  const newTreeContent = { updated, children: newTreeChildren };
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

  // UPDATE CHILDREN SUMMARY
  // get current children summary
  const getChildrenSummaryParams = {
    TableName: 'Summary',
    Key: { use: { S: 'children' } },
  };
  const { Item: childrenItem } = await dbClient.send(
    new GetItemCommand(getChildrenSummaryParams)
  );
  const { content: childrenSummary } = unmarshall(childrenItem);
  // create and update use NewImage
  if (eventName === 'INSERT' || eventName === 'MODIFY') {
    const updatedChild = unmarshall(NewImage);
    const { donated, id, name, donorName, donationId } = updatedChild;
    const newChild = {
      donated,
      id,
      name,
      donorName: donorName || '',
      donationId: donationId || '',
    };
    // add or update child
    childrenSummary[id] = newChild;
    if (eventName === 'INSERT') {
      childrenSummary.ids.push(id);
    }
  }
  // delete uses OldImage
  if (eventName === 'REMOVE') {
    // delete child
    const oldId = OldImage.id.S;
    childrenSummary.ids = childrenSummary.ids.filter(
      childId => childId !== oldId
    );
    delete childrenSummary[oldId];
  }

  // compose update request
  const updateChildrenSummaryParams = {
    TableName: 'Summary',
    Key: { use: { S: 'children' } },
    UpdateExpression: 'SET content = :content',
    ExpressionAttributeValues: marshall({
      ':content': childrenSummary,
    }),
  };
  await dbClient.send(new UpdateItemCommand(updateChildrenSummaryParams));
};
