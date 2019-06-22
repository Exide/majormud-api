// api.majormud.io/v/1.11p/items/:search

resource "aws_api_gateway_resource" "items" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.version.id
  path_part = "items"
}

resource "aws_api_gateway_resource" "name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.items.id
  path_part = "{name}"
}

resource "aws_api_gateway_method" "get_items_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.name.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_items_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.name.id
  http_method = aws_api_gateway_method.get_items_by_name.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_items_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.name.id
  http_method = aws_api_gateway_method.get_items_by_name.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.get_items_by_name.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_items_by_name" {
  depends_on = ["aws_api_gateway_integration.get_items_by_name"]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.name.id
  http_method = aws_api_gateway_method.get_items_by_name.http_method
  status_code = aws_api_gateway_method_response.get_items_by_name.status_code
}

resource "aws_api_gateway_deployment" "get_items_by_name" {
  depends_on = ["aws_api_gateway_integration.get_items_by_name"]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}
