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
  const item = await getItemById(version, id);
  const requestedOrigin = getRequestedOrigin(event);

  if (item) {
    const _links = {
      self: {
        href: `${requestedOrigin}/versions/${version}/items/${id}`
      }
    };
    return OK({ _links, item });
  } else {
    const _links = {
      self: {
        href: `${requestedOrigin}/versions/${version}/items/${id}`
      }
    };
    const error = `No item found in version ${version} matching the ID: ${id}`;
    return NotFound({ _links, error });
  }
}

async function getItemById(version: string, id: number): Promise<MajorMUDItem | undefined> {
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

  return result.Item as unknown as MajorMUDItem;
}
