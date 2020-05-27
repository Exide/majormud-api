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

resource "aws_iam_policy" "majormud_data_access" {
  name = "majormud-data-access"
  description = "Grants read/write access to the MajorMUD tables stored in DynamoDB."
  policy = data.aws_iam_policy_document.majormud_data_access.json
}

data "aws_iam_policy_document" "majormud_data_access" {
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

resource "aws_iam_role_policy_attachment" "majormud_data" {
  role = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.majormud_data_access.arn
}
