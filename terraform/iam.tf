//
//  Lambda role shared by all API Lambdas
//

resource "aws_iam_role" "lambda" {
  name = "majormud-api-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda_execution" {
  role = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaExecute"
}

//
//  MajorMUD data (stored in DynamoDB) full access
//

resource "aws_iam_policy" "majormud_data_full_access" {
  name = "majormud-data-full-access"
  description = "Grants read/write access to the MajorMUD tables stored in DynamoDB."
  policy = data.aws_iam_policy_document.majormud_data_full_access.json
}

data "aws_iam_policy_document" "majormud_data_full_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:DescribeTable",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem"
    ]
    resources = [
      "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/majormud-*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:Scan",
      "dynamodb:Query"
    ]
    resources = [
      "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/majormud-*/index/*"
    ]
  }
}

resource "aws_iam_role_policy_attachment" "majormud_data_full_access" {
  role = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.majormud_data_full_access.arn
}

//
//  API Gateway to S3 integration role
//

resource "aws_iam_role" "api_gateway_s3_integration" {
  name = "majormud-api-s3"
  assume_role_policy = data.aws_iam_policy_document.api_gateway_s3_integration.json
}

data "aws_iam_policy_document" "api_gateway_s3_integration" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
  }
}

//
//  Static files access policy
//

resource "aws_iam_policy" "majormud_api_static_read_access" {
  policy = "majormud-api-static-read-access"
}

data "aws_iam_policy_document" "majormud_api_static" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "arn:aws:s3:::majormud-api/*"
    ]
  }
}

resource "aws_iam_role_policy_attachment" "majormud_api_static" {
  role = aws_iam_role.api_gateway_s3_integration.name
  policy_arn = aws_iam_policy.majormud_api_static_read_access.arn
}
