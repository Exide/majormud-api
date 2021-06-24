import { APIGatewayProxyResult } from 'aws-lambda';
import { MajorMUDObject } from './majormud';

function buildResponse(statusCode: number, body: string | object): APIGatewayProxyResult {
  const headers: { [header: string]: string } = {};

  if (typeof body === 'object') {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  console.info(`returning: ${statusCode} ${body}`);
  return { statusCode, body, headers };
}

export function OK(body: string | MajorMUDObject | MajorMUDObject[] = 'OK') {
  return buildResponse(200, body);
}

export function BadRequest(body = 'Bad Request') {
  return buildResponse(400, body);
}

export function NotFound(body = 'Not Found') {
  return buildResponse(404, body);
}

export function InternalServerError(body = 'Internal Server Error') {
  return buildResponse(500, body);
}
