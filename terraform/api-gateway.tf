resource "aws_api_gateway_rest_api" "majormud_api" {
  name = "MajorMUD API"
  description = "An HTTP REST interface for accessing versioned MajorMUD information."
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "v" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  path_part = "v"
}

resource "aws_api_gateway_resource" "version" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.v.id
  path_part = "{version}"
}
