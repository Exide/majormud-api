resource "aws_api_gateway_rest_api" "majormud_api" {
  name = "MajorMUD API"
  description = "An HTTP REST interface for accessing versioned MajorMUD information."
}

resource "aws_api_gateway_resource" "version" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  path_part = "v"
}

resource "aws_api_gateway_resource" "version_value" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.version.id
  path_part = "{version}"
}

resource "aws_api_gateway_resource" "items" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.version_value.id
  path_part = "items"
}

resource "aws_api_gateway_resource" "item_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.items.id
  path_part = "{item_name}"
}

resource "aws_api_gateway_method" "get_item_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.item_name.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_item_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.item_name.id
  http_method = aws_api_gateway_method.get_item_by_name.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_item_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.item_name.id
  http_method = aws_api_gateway_method.get_item_by_name.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.get_item_by_name.arn}/invocations"
}

resource "aws_api_gateway_integration_response" "get_item_by_name" {
  depends_on = ["aws_api_gateway_integration.get_item_by_name"]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.item_name.id
  http_method = aws_api_gateway_method.get_item_by_name.http_method
  status_code = aws_api_gateway_method_response.get_item_by_name.status_code
}

resource "aws_api_gateway_deployment" "production" {
  depends_on = ["aws_api_gateway_integration.get_item_by_name"]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}
