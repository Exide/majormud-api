import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getRequestedOrigin } from './helpers/request';
import { OK } from './helpers/response';
import { MajorMUDVersion } from './helpers/majormud';

// Handles requests to /versions

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const versions = await getVersions();
  const requestedOrigin = getRequestedOrigin(event);
  const _links = {
    self: {
      href: `${requestedOrigin}/versions`
    },
    name: {
      href: `${requestedOrigin}/versions/:name`,
      description: 'Get available data for a specific version.'
    }
  }

  return OK({ _links, versions });
}

async function getVersions(): Promise<MajorMUDVersion[]> {
  const parameters = {
    TableName: 'majormud-versions'
  };

  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.scan(parameters).promise();
  if (result.Items === undefined) return [];

  return result.Items.map(i => i as unknown as MajorMUDVersion);
}
