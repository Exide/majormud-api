// api.majormud.io/v/1.11p/item/:id

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

resource "aws_api_gateway_resource" "item" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.version_value.id
  path_part = "item"
}

resource "aws_api_gateway_resource" "id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.item.id
  path_part = "{id}"
}

resource "aws_api_gateway_method" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.id.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.id.id
  http_method = aws_api_gateway_method.get_item_by_id.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.id.id
  http_method = aws_api_gateway_method.get_item_by_id.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.get_item_by_id.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_item_by_id" {
  depends_on = ["aws_api_gateway_integration.get_item_by_id"]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.id.id
  http_method = aws_api_gateway_method.get_item_by_id.http_method
  status_code = aws_api_gateway_method_response.get_item_by_id.status_code
}

resource "aws_api_gateway_deployment" "production" {
  depends_on = ["aws_api_gateway_integration.get_item_by_id"]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}
