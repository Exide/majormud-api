import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getRequestedOrigin } from './helpers/request';
import { OK, NotFound } from './helpers/response';
import { MajorMUDVersion } from './helpers/majormud';

// Handles requests to /versions/:version

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.debug('path parameters:', event.pathParameters);

  // if any of these errors are thrown then check the API Gateway configuration
  if (event.pathParameters == null) throw new Error('Called without any path parameters');
  if (event.pathParameters.version == null) throw new Error('Called without a "version" path parameter');

  const name = decodeURI(event.pathParameters.version);
  const requestedOrigin = getRequestedOrigin(event);

  const dbClient = new DynamoDB.DocumentClient();
  const parameters = {
    TableName: 'majormud-versions',
    Key: { name }
  };
  const result = await dbClient.get(parameters).promise();
  const version: MajorMUDVersion = result.Item as unknown as MajorMUDVersion;
  const links = {
    self: {
      href: `${requestedOrigin}/versions/${name}`
    },
    items: {
      href: `${requestedOrigin}/versions/${name}/items`,
      description: 'List all available items for this version.'
    }
  }

  if (version) {
    return OK({ links, version });
  } else {
    return NotFound(`No version found matching the name: ${name}`);
  }
}
