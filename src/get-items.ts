import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getRequestedOrigin } from './helpers/request';
import { OK } from './helpers/response';
import { MajorMUDItem } from './helpers/majormud';

// Handles requests to
//    /versions/:version/items
//    /versions/:version/items?name=:keyword

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.debug('path parameters:', event.pathParameters);

  // if any of these errors are thrown then check the API Gateway configuration
  if (event.pathParameters == null) throw new Error('Called without any path parameters');
  if (event.pathParameters.version == null) throw new Error('Called without a "version" path parameter');

  const version = decodeURI(event.pathParameters.version);

  let nameKeyword;
  if (event.queryStringParameters !== null && event.queryStringParameters.name !== null) {
    nameKeyword = decodeURI(event.queryStringParameters.name);
  }

  const requestedOrigin = getRequestedOrigin(event);

  const requiredAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeNameMap = { '#version': 'version' };
  const requiredAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap = { ':version': version };
  let optionalAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeNameMap = {};
  let optionalAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap = {};
  let filterExpression: string = '#version = :version';

  if (nameKeyword) {
    filterExpression += ' and contains(#name, :keyword)';
    optionalAttributeNames['#name'] = 'name';
    optionalAttributeValues[':keyword'] = nameKeyword;
  }

  let parameters: DynamoDB.DocumentClient.ScanInput = {
    TableName: 'majormud-items',
    FilterExpression: filterExpression,
    ExpressionAttributeNames: { ...requiredAttributeNames, ...optionalAttributeNames },
    ExpressionAttributeValues: { ...requiredAttributeValues, ...optionalAttributeValues }
  };
  console.debug('scan parameters:', parameters);

  const dbClient = new DynamoDB.DocumentClient();
  const result = await dbClient.scan(parameters).promise();
  const results = result.Items === undefined ? [] : result.Items;
  const items: MajorMUDItem[] = (results as unknown as MajorMUDItem[])
    .map(item => ({
      uri: `${requestedOrigin}/versions/${version}/items/${item.id}`,
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      weight: item.weight,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

  const links = {
    self: {
      href: `${requestedOrigin}${event.path}${nameKeyword ? '?name='+nameKeyword : ''}`
    },
    search: {
      by_name: `${requestedOrigin}/versions/${version}/items?name={KEYWORD}`
    }
  }

  return OK({ links, items });
}
