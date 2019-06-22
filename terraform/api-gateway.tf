resource "aws_api_gateway_rest_api" "majormud_api" {
  name = "MajorMUD API"
  description = "An HTTP REST interface for accessing versioned MajorMUD information."
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}
