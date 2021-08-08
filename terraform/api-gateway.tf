resource "aws_api_gateway_rest_api" "majormud_api" {
  name = "MajorMUD API"
  description = "An HTTP REST interface for accessing versioned MajorMUD information."
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

// ----------------------------------------------------------------------------
//  api.majormud.io/
// ----------------------------------------------------------------------------

resource "aws_api_gateway_method" "get_index" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_index" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = aws_api_gateway_method.get_index.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_index" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = aws_api_gateway_method.get_index.http_method
  type = "AWS_PROXY"
  integration_http_method = "POST"
  uri = aws_lambda_function.get_index.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_index" {
  depends_on = [ aws_api_gateway_integration.get_index ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  http_method = aws_api_gateway_method.get_index.http_method
  status_code = aws_api_gateway_method_response.get_index.status_code
}

resource "aws_api_gateway_deployment" "get_index" {
  depends_on = [ aws_api_gateway_integration.get_index ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions
// ----------------------------------------------------------------------------

resource "aws_api_gateway_resource" "get_versions" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_rest_api.majormud_api.root_resource_id
  path_part = "versions"
}

resource "aws_api_gateway_method" "get_versions" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_versions.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_versions" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_versions.id
  http_method = aws_api_gateway_method.get_versions.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_versions" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_versions.id
  http_method = aws_api_gateway_method.get_versions.http_method
  type = "AWS_PROXY"
  integration_http_method = "POST"
  uri = aws_lambda_function.get_versions.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_versions" {
  depends_on = [ aws_api_gateway_integration.get_versions ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_versions.id
  http_method = aws_api_gateway_method.get_versions.http_method
  status_code = aws_api_gateway_method_response.get_versions.status_code
}

resource "aws_api_gateway_deployment" "get_versions" {
  depends_on = [ aws_api_gateway_integration.get_versions ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions/:version
// ----------------------------------------------------------------------------

resource "aws_api_gateway_resource" "get_version_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.get_versions.id
  path_part = "{version}"
}

resource "aws_api_gateway_method" "get_version_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_version_by_name.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_version_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_version_by_name.id
  http_method = aws_api_gateway_method.get_version_by_name.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_version_by_name" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_version_by_name.id
  http_method = aws_api_gateway_method.get_version_by_name.http_method
  type = "AWS_PROXY"
  integration_http_method = "POST"
  uri = aws_lambda_function.get_version_by_name.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_version_by_name" {
  depends_on = [ aws_api_gateway_integration.get_version_by_name ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_version_by_name.id
  http_method = aws_api_gateway_method.get_version_by_name.http_method
  status_code = aws_api_gateway_method_response.get_version_by_name.status_code
}

resource "aws_api_gateway_deployment" "get_version_by_name" {
  depends_on = [ aws_api_gateway_integration.get_version_by_name ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions/:version/items
// ----------------------------------------------------------------------------

resource "aws_api_gateway_resource" "get_items" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.get_version_by_name.id
  path_part = "items"
}

resource "aws_api_gateway_method" "get_items" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_items.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_items" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_items.id
  http_method = aws_api_gateway_method.get_items.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_items" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_items.id
  http_method = aws_api_gateway_method.get_items.http_method
  type = "AWS_PROXY"
  integration_http_method = "POST"
  uri = aws_lambda_function.get_items.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_items" {
  depends_on = [ aws_api_gateway_integration.get_items ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_items.id
  http_method = aws_api_gateway_method.get_items.http_method
  status_code = aws_api_gateway_method_response.get_items.status_code
}

resource "aws_api_gateway_deployment" "get_items" {
  depends_on = [ aws_api_gateway_integration.get_items ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}

// ----------------------------------------------------------------------------
//  api.majormud.io/versions/:version/items/:id
// ----------------------------------------------------------------------------

resource "aws_api_gateway_resource" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  parent_id = aws_api_gateway_resource.get_items.id
  path_part = "{id}"
}

resource "aws_api_gateway_method" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_item_by_id.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_item_by_id.id
  http_method = aws_api_gateway_method.get_item_by_id.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration" "get_item_by_id" {
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_item_by_id.id
  http_method = aws_api_gateway_method.get_item_by_id.http_method
  type = "AWS_PROXY"
  integration_http_method = "POST"
  uri = aws_lambda_function.get_item_by_id.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_item_by_id" {
  depends_on = [ aws_api_gateway_integration.get_item_by_id ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  resource_id = aws_api_gateway_resource.get_item_by_id.id
  http_method = aws_api_gateway_method.get_item_by_id.http_method
  status_code = aws_api_gateway_method_response.get_item_by_id.status_code
}

resource "aws_api_gateway_deployment" "get_item_by_id" {
  depends_on = [ aws_api_gateway_integration.get_item_by_id ]
  rest_api_id = aws_api_gateway_rest_api.majormud_api.id
  stage_name = "production"
}
