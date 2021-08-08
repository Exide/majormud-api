import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getRequestedOrigin } from './helpers/request';
import { OK } from './helpers/response';
import { MajorMUDItem } from './helpers/majormud';

// Handles requests to
//    /versions/:version/items
//    /versions/:version/items?name=:keyword

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.debug('path parameters:', event.pathParameters);

  // if any of these errors are thrown then check the API Gateway configuration
  if (event.pathParameters == null) throw new Error('Called without any path parameters');
  if (event.pathParameters['version'] == null) throw new Error('Called without a "version" path parameter');

  const version = decodeURI(event.pathParameters.version);

  let nameKeyword;
  if (event.queryStringParameters !== null && event.queryStringParameters.name !== null) {
    nameKeyword = decodeURI(event.queryStringParameters.name);
  }

  const items = await getItems(version, nameKeyword);

  const requestedOrigin = getRequestedOrigin(event);
  const _links = {
    self: {
      href: `${requestedOrigin}/versions/${version}/items`
    },
    id: {
      href: `${requestedOrigin}/versions/${version}/items/:id`,
      description: 'Return a specific item by ID.'
    },
    name: {
      href: `${requestedOrigin}/versions/${version}/items?name=keyword`,
      description: 'List all items that contain the keyword in the name.'
    }
  }

  if (nameKeyword) {
    _links['self']['href'] += `?name=${nameKeyword}`;
  }

  return OK({ _links, items });
}

async function getItems(version: string, nameKeyword?: string): Promise<MajorMUDItem[]> {
  let parameters: DynamoDB.DocumentClient.ScanInput = {
    TableName: 'majormud-items',
    FilterExpression: '#version = :version',
    ExpressionAttributeNames: {
      '#version': 'version'
    },
    ExpressionAttributeValues: {
      ':version': version
    }
  };

  if (nameKeyword) {
    parameters['FilterExpression'] += ' and contains(#name, :keyword)';
    parameters['ExpressionAttributeNames'] = {}; // hack to make the compiler stop complaining; its defined directly above
    parameters['ExpressionAttributeNames']['#name'] = 'name';
    parameters['ExpressionAttributeValues'] = {}; // hack to make the compiler stop complaining; its defined directly above
    parameters['ExpressionAttributeValues'][':keyword'] = nameKeyword;
  }

  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.scan(parameters).promise();
  if (result.Items === undefined) return [];

  return result.Items.map(i => i as unknown as MajorMUDItem);
}
