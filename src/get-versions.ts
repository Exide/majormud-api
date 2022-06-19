import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { OK } from './helpers/response';
import { MajorMUDVersion } from './helpers/majormud';
import { getRequestedOrigin } from './helpers/request';

// Handles requests to /versions

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const requestedOrigin = getRequestedOrigin(event);
  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.scan({ TableName: 'majormud-versions' }).promise();
  const versions: MajorMUDVersion[] = (result.Items === undefined ? [] : result.Items as unknown as MajorMUDVersion[])
    .map(version => ({
      uri: `${requestedOrigin}/versions/${version.name}`,
      name: version.name,
      author: version.author,
      created_at: version.created_at,
      updated_at: version.updated_at
    }))
  const links = {
    self: {
      href: `${requestedOrigin}${event.path}`
    }
  };

  return OK({ links, versions });
}
