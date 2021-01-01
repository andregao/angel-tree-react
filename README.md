<h1 style="text-align: center">
  Angel Tree in React and AWS Serverless
</h1>

This project was originally created to help facilitate the 2020 Christmas donation drive
of [Mater Academy Bonanza](https://www.materbonanza.org/) charter school for kids in local communities. It helped over
100 kids matched with their donors and delivered hundreds of gifts to their homes during the 2020 holiday season.

### How it works

- The virtual tree starts with hanging angel cards where each card represents a child in need. Visitors can hover over
  the cards to view the age and gender of each child, press "info" to see their wish list and sizes, or press "donate"
  to fill out a donation commitment form providing their contact information
- When a donation is submitted
  - the child is marked as donated and their card changes into an ornament
  - the donor will receive an email with the child's information and donation instructions
  - administrators of the site will receive an email with the donor and the child's information
- The admin dashboard uses a passphrase (bearer token in request header) to authenticate access. An admin can:
  - add, edit and remove children
  - edit and remove donations
  - filter children and donations by name, sort by their attributes
  - mark a donation as received
- Notes:
  - names of children will never be seen by a visitor or donor
  - a child cannot be edited if there's a donation associated with them, remove the corresponding donation before
    editing the child

### Main Dependencies

- Frontend: React, Styled Components, Material-UI
- Backend:
  - AWS SAM (CloudFormation), DynamoDB, API Gateway, Lambda, SNS
  - Hosting provider of choice (instructions included Firebase and Netlify)
  - SendGrid (confirmation emails)
- Development: Docker Desktop (runs REST endpoints and DynamoDB locally)

## Deployment Instructions

All cloud resources and typical consumptions are free tier eligible.

### Prerequisites

- Install [Node.js](https://nodejs.org/en/)
- Get an Amazon [AWS account](https://aws.amazon.com)
- Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
  , [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) AWS CLI by
  [creating access keys](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds)
  in IAM and providing an AWS [region code](https://docs.aws.amazon.com/general/latest/gr/rande.html#regional-endpoints)
  for the backend
- Get a Google [Firebase](https://firebase.google.com) or [Netlify](https://www.netlify.com) account for static hosting
  and CDN
- If using Firebase:
  - Install [Firebase Tools CLI](https://firebase.google.com/docs/cli)
  - [Configure](https://firebase.google.com/docs/cli#sign-in-test-cli) firebase-tools
- Get a [SendGrid](https://sendgrid.com) account
- (Optional) Install [Docker Desktop](https://www.docker.com/products/docker-desktop) for local development

Clone this repository to a local folder, open a terminal window, change directory to that folder

### Database - DynamoDB

Change directory to _dynamodb-tables_ folder, deploy the tables needed and fill in sample data by running:

> npm run init

_You can leave things at default values but be sure to enter the same AWS
[region code](https://docs.aws.amazon.com/general/latest/gr/rande.html#regional-endpoints)
used in earlier AWS CLI configuration when prompted_

### Data Stream Processors - Lambda Functions

- Change directory to each of these folders: _aggregate-children_, _aggregate-donations_, _aggregate-waitlist_, and run:

  > npm run init

  _Again you can leave things at default just make sure region code matches all previous entries_

- Change directory to _email-to-admins_ folder and run:

  > npm run init

  It will ask for a _FirstSubscriber_ email to add to the admin email list. People on this list will receive an email
  notification whenever someone submits a donation. Enter a valid email address here, and they will receive a
  verification email to confirm the subscription. More emails can be added to the list by going
  to [AWS SNS console](https://console.aws.amazon.com/sns/v3/home#/topics), selecting this topic, and clicking the "
  Create subscription" button. Select "Email" as Protocol and enter an email address in the "Endpoint" field

### Donor Confirmation Emails - SendGrid

- Change directory to _email-to-donors_ folder and open _sendgrid-template.txt_ file
- Go to [SendGrid](https://mc.sendgrid.com/dynamic-templates) and create a dynamic template following the example format
- Note the Template ID, go to [API Keys Settings](https://app.sendgrid.com/settings/api_keys), create and copy the API
  key
- Open _env-init.txt_ file inside "init" folder
  - Replace the template ID and API key with yours
  - Replace sender email and name
- Make sure you're back in _email-to-donors_ folder and run:
  > npm run init

### REST Endpoints - API resources

- Change directory to _rest_ folder
- Open _env-init.txt_ file inside "init" folder and update the admin pass phrase
- Make sure you're back in _rest_ folder and run:
  > npm run init
- Take note of API endpoint URL output at the end of deployment

### Web Client - React App

- Change directory into the root of the folder
- Open /src/services/config.js file
  - Update ENDPOINT value with output URL from previous step
  - Customize site banner, donation instructions and deadline
- Customize site title by editing /public/index.html file on line 9 and 28
- install dependencies and build the application for deployment by running:
  > npm install && npm run build

### Hosting - Firebase or Netlify
- If using Firebase, initialize its configuration by running:
  > firebase init
  - Select Hosting service and create a new project
  - Be sure to type "build" for the public directory and configure this as a single-page app
  - After the initialization, deploy the site by running:
    > firebase deploy
  - Take note of the hosted URL
- If using Netlify
  - Login on [netlify.com](https://app.netlify.com)
  - Go to "sites" tab and drag the "build" folder into the new site drop area
  - Take note of the hosted URL
- Go to the hosted URL and check out your new site!

## Local Development Notes

Coming soon

Any question feel free to message me
