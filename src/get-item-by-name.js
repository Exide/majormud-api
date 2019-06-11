const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();

exports.handler = async (event) => {
  const version = event.pathParameters.version;
  const itemName = decodeURI(event.pathParameters.item_name);

  const item = await lookupByName(itemName, version);
  if (!item) return { statusCode: 404 };

  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(item)
  };
};

async function lookupByName(name, version) {
  const parameters = {
    TableName: "majormud-items",
    Key: {
      version: { S: version },
      name: { S: name }
    }
  };
  return dynamodb.getItem(parameters).promise();
}
