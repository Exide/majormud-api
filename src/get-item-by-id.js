const aws = require('aws-sdk');
const dbClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  if (isInvalidInput(event)) {
    return { statusCode: 400 };
  }

  const version = decodeURI(event.pathParameters.version);
  const id = decodeURI(event.pathParameters.id);
  const item = await getItemById(id, version);

  if (!item) {
    return { statusCode: 404 };
  } else {
    return {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    }
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
  console.log(response);
  return response.Item;
}

function isInvalidInput(event) {
  const noInput = !event;
  const emptyInput= !event.pathParameters;
  const noVersion = !event.pathParameters.version;
  const noID = !event.pathParameters.id;
  return noInput || emptyInput || noVersion || noID;
}
