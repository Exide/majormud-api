import { APIGatewayProxyEvent } from 'aws-lambda';

export function getRequestedOrigin(event: APIGatewayProxyEvent): string {
  const protocol = 'https';
  const authority = event.requestContext.domainName;
  const url = new URL(`${protocol}://${authority}`);
  return url.origin;
}
