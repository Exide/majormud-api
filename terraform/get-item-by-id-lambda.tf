resource "aws_lambda_function" "get_item_by_id" {
  function_name = "get-item-by-id"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "lambda.zip"
  timeout = 60
  role = aws_iam_role.lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "get_item_by_id" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_item_by_id.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.get_item_by_id.http_method}${aws_api_gateway_resource.id.path}"
}
