import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getRequestedOrigin } from './helpers/request';
import { OK, NotFound } from './helpers/response';
import { MajorMUDItem } from './helpers/majormud';

// Handles requests to /versions/:version/items/:id

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.debug('path parameters:', event.pathParameters);

  // if any of these errors are thrown then check the API Gateway configuration
  if (event.pathParameters == null) throw new Error('Called without any path parameters');
  if (event.pathParameters.version == null) throw new Error('Called without a "version" path parameter');
  if (event.pathParameters.id == null) throw new Error('Called without an "id" path parameter');

  const version = decodeURI(event.pathParameters.version);
  const id = parseInt(decodeURI(event.pathParameters.id));
  const requestedOrigin = getRequestedOrigin(event);

  const dbClient = new DynamoDB.DocumentClient();
  const parameters = {
    TableName: 'majormud-items',
    Key: {
      id: id,
      version: version
    }
  };
  const result = await dbClient.get(parameters).promise();
  const item: MajorMUDItem = result.Item as unknown as MajorMUDItem;
  const links = {
    self: {
      href: `${requestedOrigin}${event.path}`
    }
  };

  if (item) {
    return OK({ links, item });
  } else {
    return NotFound(`No item found in version ${version} matching the ID: ${id}`);
  }
}
