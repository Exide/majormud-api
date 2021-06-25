// api.majormud.io/index.html

resource "aws_api_gateway_method" "index" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "index" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = aws_api_gateway_method.index.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "index" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = aws_api_gateway_method.index.http_method
  type = "AWS"
  integration_http_method = "GET"
  uri = "arn:aws:apigateway:us-west-2:s3:path/majormud-api/index.html"
}

resource "aws_api_gateway_integration_response" "index" {
  depends_on = [ aws_api_gateway_integration.index ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = aws_api_gateway_method.index.http_method
  status_code = aws_api_gateway_method_response.index.status_code
}

resource "aws_api_gateway_deployment" "index" {
  depends_on = [ aws_api_gateway_integration.index ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}
