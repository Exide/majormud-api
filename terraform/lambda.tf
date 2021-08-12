// ----------------------------------------------------------------------------
//  api.majormud.io/
// ----------------------------------------------------------------------------

resource "aws_lambda_function" "get_index" {
  function_name = "majormud-api-get-index"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "../dist/get-index.zip"
  timeout = 60
  role = aws_iam_role.majormud_api_lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "get_index" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_index.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.get_index.http_method}/"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions
// ----------------------------------------------------------------------------

resource "aws_lambda_function" "get_versions" {
  function_name = "majormud-api-get-versions"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "../dist/get-versions.zip"
  timeout = 60
  role = aws_iam_role.majormud_api_lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "get_versions" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_versions.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.get_versions.http_method}${aws_api_gateway_resource.get_versions.path}"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions/:version
// ----------------------------------------------------------------------------

resource "aws_lambda_function" "get_version_by_name" {
  function_name = "majormud-api-get-version-by-name"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "../dist/get-version-by-name.zip"
  timeout = 60
  role = aws_iam_role.majormud_api_lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "get_version_by_name" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_version_by_name.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.get_version_by_name.http_method}${aws_api_gateway_resource.get_version_by_name.path}"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions/:version/items
// ----------------------------------------------------------------------------

resource "aws_lambda_function" "get_items" {
  function_name = "majormud-api-get-items"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "../dist/get-items.zip"
  timeout = 60
  role = aws_iam_role.majormud_api_lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "get_items" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_items.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.get_items.http_method}${aws_api_gateway_resource.get_items.path}"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions/:version/items/:id
// ----------------------------------------------------------------------------

resource "aws_lambda_function" "get_item_by_id" {
  function_name = "majormud-api-get-item-by-id"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "../dist/get-item-by-id.zip"
  timeout = 60
  role = aws_iam_role.majormud_api_lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "get_item_by_id" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_item_by_id.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.get_item_by_id.http_method}${aws_api_gateway_resource.get_item_by_id.path}"
}
