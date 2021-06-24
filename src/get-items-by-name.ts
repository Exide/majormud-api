import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { OK, BadRequest, NotFound } from './response';
import { MajorMUDItem } from './majormud';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.pathParameters === null) return BadRequest();

  const noVersion = event.pathParameters.version === undefined;
  const noName = event.pathParameters.name === undefined;
  if (noVersion || noName) return BadRequest();

  const version = decodeURI(event.pathParameters.version);
  const name = decodeURI(event.pathParameters.name);
  const items = await getItemsByName(name, version);

  if (items.length < 1) {
    return NotFound();
  } else {
    return OK(items);
  }
}

async function getItemsByName(name: string, version: string): Promise<MajorMUDItem[]> {
  const parameters = {
    TableName: 'majormud-items',
    IndexName: 'name',
    FilterExpression: 'contains(#name, :name) and #version = :version',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#version': 'version'
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':version': version
    }
  };

  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.scan(parameters).promise();
  if (result.Items === undefined) return [];

  return result.Items.map(i => i as unknown as MajorMUDItem);
}
