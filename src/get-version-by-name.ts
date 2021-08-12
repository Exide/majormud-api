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
  const version = await getVersionByName(name);
  const requestedOrigin = getRequestedOrigin(event);

  if (version) {
    const _links = {
      self: {
        href: `${requestedOrigin}/versions/${name}`
      },
      items: {
        href: `${requestedOrigin}/versions/${name}/items`,
        description: 'List all available items for this version.'
      }
    };
    return OK({ _links, version });
  } else {
    const _links = {
      self: {
        href: `${requestedOrigin}/versions/${name}`
      }
    };
    const error = `No version found matching the name: ${name}`;
    return NotFound({ _links, error });
  }
}

async function getVersionByName(name: string): Promise<MajorMUDVersion | undefined> {
  const parameters = {
    TableName: 'majormud-versions',
    Key: {
      name: name
    }
  };

  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.get(parameters).promise();
  if (result.Item === undefined) return;

  return result.Item as unknown as MajorMUDVersion;
}
