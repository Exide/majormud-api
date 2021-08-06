import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OK, InternalServerError } from './response';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const response = {
      '_links': {
        'self': {
          'href': 'https://api.majormud.io'
        },
        'versions': {
          'href': 'https://api.majormud.io/v'
        }
      }
    }
    return OK(response);
  } catch (error) {
    console.error(error);
    return InternalServerError();
  }
}
