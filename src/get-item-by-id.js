const aws = require('aws-sdk');
const dbClient = new aws.DynamoDB.DocumentClient();
const Response = require('./response');

exports.handler = async (event) => {
  if (isInvalidInput(event)) {
    return Response.BadRequest();
  }

  const version = decodeURI(event.pathParameters.version);
  const id = parseInt(decodeURI(event.pathParameters.id));
  const item = await getItemById(id, version);

  if (!item) {
    return Response.NotFound();
  } else {
    return Response.OK(item);
  }

};

async function getItemById(id, version) {
  const parameters = {
    TableName: 'majormud-items',
    Key: {
      id: id,
      version: version
    }
  };
  const response = await dbClient.get(parameters).promise();
  return response.Item;
}

function isInvalidInput(event) {
  const noInput = !event;
  const emptyInput= !event.pathParameters;
  const noVersion = !event.pathParameters.version;
  const noID = !event.pathParameters.id;
  return noInput || emptyInput || noVersion || noID;
}
