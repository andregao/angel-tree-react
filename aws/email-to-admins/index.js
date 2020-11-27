const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const REGION = 'us-east-1';
const TABLE_STREAM_TOPIC_ARN = 'arn:aws:sns:us-east-1:486040421677:Donations';
const sns = new SNSClient(REGION);
const dbClient = new DynamoDBClient(REGION);

exports.processDonationStreamHandler = (event, context, callback) => {
  event.Records.forEach(record => {
    if (record.eventName === 'INSERT') {
      // get child details
      const { NewImage } = record.dynamodb;
      const childId = NewImage.childId.S;
      getChild(childId)
        .then(childDetails => {
          // compose email message for admins
          const { name: childName, wishes, sizes } = childDetails;
          const donorName = NewImage.name.S;
          const donationId = NewImage.id.S;
          const email = NewImage.email.S;
          const phone = NewImage.phone.S;
          const params = {
            Subject: `New donation from ${donorName} to ${childName}`,
            Message: `${donorName} just made a commitment to donate to ${childName} for the following items:

    Wishes: ${JSON.stringify(wishes)}
    Sizes: ${JSON.stringify(sizes)}

Donor Contact:

    Email: ${email}
    Phone: ${phone}

__________________
Donation ID: ${donationId}
Child ID: ${childId}`,
            TopicArn: TABLE_STREAM_TOPIC_ARN,
          };
          return publish(params);
        })
        .then(() => callback(null, 'processing complete'));
    } else {
      console.log('record is not a INSERT event');
    }
  });
};

async function getChild(id) {
  const getItemParams = {
    TableName: 'Child',
    Key: { id: { S: id } },
    ProjectionExpression: '#n,wishes,sizes',
    ExpressionAttributeNames: {
      '#n': 'name',
    },
  };
  let childDetails = null;
  try {
    const { Item } = await dbClient.send(new GetItemCommand(getItemParams));
    childDetails = unmarshall(Item);
  } catch (e) {
    console.error(e);
  }
  return childDetails;
}

async function publish(params) {
  try {
    const data = await sns.send(new PublishCommand(params));
    console.log(
      `MessageID ${data.MessageId}: ${params.Message} sent to the topic ${params.TopicArn}`
    );
  } catch (err) {
    console.error(err, err.stack);
  }
}
