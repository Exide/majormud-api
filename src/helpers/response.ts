import { APIGatewayProxyResult } from 'aws-lambda';

function buildResponse(statusCode: number, body: string | object): APIGatewayProxyResult {
  const headers: { [header: string]: string } = {};

  if (typeof body === 'object') {
    body = JSON.stringify(body, null, 2);
    headers['Content-Type'] = 'application/json';
  }

  console.info(`returning: ${statusCode} ${body}`);
  return { statusCode, body, headers };
}

export function OK(body: string | object = 'OK') {
  return buildResponse(200, body);
}

export function BadRequest(body: string | object = 'Bad Request') {
  return buildResponse(400, body);
}

export function NotFound(body: string | object = 'Not Found') {
  return buildResponse(404, body);
}

export function InternalServerError(body: string | object = 'Internal Server Error') {
  return buildResponse(500, body);
}
