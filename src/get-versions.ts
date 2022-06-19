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
  const versions: MajorMUDVersion[] = result.Items === undefined ? [] : result.Items as unknown as MajorMUDVersion[];
  const links = {
    self: {
      href: `${requestedOrigin}/versions`
    },
    name: {
      href: `${requestedOrigin}/versions/:name`,
      description: 'Get available data for a specific version.'
    }
  };

  return OK({ links, versions });
}
