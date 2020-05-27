function buildResponse(statusCode, body, headers) {
  const bodyIsJSONable = typeof body === 'object';
  const contentTypeDoesntExist = headers['Content-Type'] === undefined;

  if (bodyIsJSONable && contentTypeDoesntExist) {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  return { statusCode, body, headers };
}

exports.OK = function(body = 'OK', headers = {}) {
  return buildResponse(200, body, headers);
}

exports.BadRequest = function(body = 'Bad Request', headers = {}) {
  return buildResponse(400, body, headers);
}

exports.NotFound = function(body = 'Not Found', headers = {}) {
  return buildResponse(404, body, headers);
}
