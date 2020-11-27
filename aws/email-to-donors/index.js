const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const REGION = 'us-east-1';
const dbClient = new DynamoDBClient(REGION);
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_API_KEY);

exports.donationStreamEmailDonors = (event, context, callback) => {
  event.Records.forEach(record => {
    if (record.eventName === 'INSERT') {
      // get child details
      const { NewImage } = record.dynamodb;
      const childId = NewImage.childId.S;
      getChild(childId)
        .then(childDetails => {
          // compose email message for donor
          const { gender, age, wishes, sizes } = childDetails;
          const sex = gender === 'male' ? 'boy' : 'girl';
          const wishesString = wishes.join(', ');
          const sizesString = sizes.join(', ');
          const donorName = NewImage.name.S;
          const donationId = NewImage.id.S;
          const email = NewImage.email.S;

          const msg = {
            to: email,
            from: { email: process.env.SG_SENDER, name: 'Angel Tree' },
            templateId: process.env.SG_TEMPLATE_ID,
            dynamicTemplateData: {
              donorName,
              donationId,
              childId,
              age,
              sex,
              wishesString,
              sizesString,
            },
          };
          return sgMail.send(msg);
        })
        .then(response => {
          console.log('response from sendgrid', JSON.stringify(response));
          callback(null, 'processing complete');
        });
    } else {
      console.log('record is not a INSERT event');
    }
  });
};

async function getChild(id) {
  const getItemParams = {
    TableName: 'Child',
    Key: { id: { S: id } },
    ProjectionExpression: 'sizes,wishes,gender,age',
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
