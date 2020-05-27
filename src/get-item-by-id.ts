import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { OK, BadRequest, NotFound, InternalServerError } from './response';
import Item from './item';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (event.pathParameters === null) return BadRequest();

    const noVersion = event.pathParameters.version === undefined;
    const noID = event.pathParameters.id === undefined;
    if (noVersion || noID) return BadRequest();

    const version = decodeURI(event.pathParameters.version);
    const id = parseInt(decodeURI(event.pathParameters.id));
    const item = await getItemById(id, version);

    if (!item) {
      return NotFound();
    } else {
      return OK(item);
    }
  } catch (error) {
    console.error(error);
    return InternalServerError();
  }
}

async function getItemById(id: number, version: string): Promise<Item | undefined> {
  const parameters = {
    TableName: 'majormud-items',
    Key: {
      id: id,
      version: version
    }
  };

  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.get(parameters).promise();
  if (result.Item === undefined) return;

  return result.Item as unknown as Item;
}
