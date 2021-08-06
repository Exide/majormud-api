resource "aws_lambda_function" "index" {
  function_name = "index"
  runtime = "nodejs14.x"
  handler = "index.handler"
  filename = "lambda.zip"
  timeout = 60
  role = aws_iam_role.lambda.arn
  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_lambda_permission" "index" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.index.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.majormud_api.execution_arn}/*/${aws_api_gateway_method.index.http_method}"
}
