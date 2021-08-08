import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getRequestedOrigin } from './helpers/request';
import { OK } from './helpers/response';

// Handles requests to /

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const requestedOrigin = getRequestedOrigin(event);
  const _links = {
    self: {
      href: requestedOrigin
    },
    versions: {
      href: `${requestedOrigin}/versions`,
      description: 'Lists all available versions of MajorMUD data.'
    }
  }

  return OK({ _links });
}
