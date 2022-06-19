import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getRequestedOrigin } from './helpers/request';
import { OK } from './helpers/response';

// Handles requests to /

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const requestedOrigin = getRequestedOrigin(event);
  const links = {
    self: {
      href: `${requestedOrigin}${event.path}`
    },
    versions: {
      href: `${requestedOrigin}/versions`,
      description: 'Lists all available versions of MajorMUD data.'
    }
  }

  return OK({ links });
}
