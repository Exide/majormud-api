const aws = require('aws-sdk');
const dbClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  if (isInvalidInput(event)) {
    return { statusCode: 400 };
  }

  const version = event.pathParameters.version;
  const itemName = decodeURI(event.pathParameters.item_name);
  const items = await getItemsByName(itemName, version);

  if (items.length < 1) {
    return { statusCode: 404 };
  } else {
    return {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(items)
    }
  }

};

async function getItemsByName(name, version) {
  const parameters = {
    TableName: 'majormud-items',
    IndexName: 'name',
    KeyConditionExpression: '#n = :n and #v = :v',
    ExpressionAttributeNames: {
      '#n': 'name',
      '#v': 'version'
    },
    ExpressionAttributeValues: {
      ':n': name,
      ':v': version
    }
  };
  const { Items } = await dbClient.query(parameters).promise();
  return Items;
}

function isInvalidInput(event) {
  const noInput = !event;
  const emptyInput= !event.pathParameters;
  const noVersion = !event.pathParameters.version;
  const noItemName = !event.pathParameters.item_name;
  return noInput || emptyInput || noVersion || noItemName;
}
