const aws = require('aws-sdk');
const dbClient = new aws.DynamoDB.DocumentClient();
const Response = require('./response');

exports.handler = async (event) => {
  if (isInvalidInput(event)) {
    return Response.BadRequest();
  }

  const version = decodeURI(event.pathParameters.version);
  const name = decodeURI(event.pathParameters.name);
  const items = await getItemsByName(name, version);

  if (items.length < 1) {
    return Response.NotFound();
  } else {
    return Response.OK(items);
  }

};

async function getItemsByName(name, version) {
  const parameters = {
    TableName: 'majormud-items',
    IndexName: 'name',
    KeyConditionExpression: '#name = :name and #version = :version',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#version': 'version'
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':version': version
    }
  };
  const { Items } = await dbClient.query(parameters).promise();
  return Items;
}

function isInvalidInput(event) {
  const noInput = !event;
  const emptyInput= !event.pathParameters;
  const noVersion = !event.pathParameters.version;
  const noName = !event.pathParameters.name;
  return noInput || emptyInput || noVersion || noName;
}
