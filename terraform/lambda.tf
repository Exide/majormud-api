resource "aws_lambda_function" "get_item_by_name" {
  function_name = "get-item-by-name"
  runtime = "nodejs8.10"
  handler = "index.handler"
  filename = "lambda.zip"
  timeout = 60
  role = aws_iam_role.lambda.arn
  tags = { MajorMUD_API = "" }
}

resource "aws_lambda_permission" "get_item_by_name" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_item_by_name.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.majormud_api.id}/*/${aws_api_gateway_method.get_item_by_name.http_method}${aws_api_gateway_resource.item_name.path}"
}
