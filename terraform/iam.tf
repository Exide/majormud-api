resource "aws_iam_role" "lambda" {
  name = "majormud-api-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_execution" {
  role = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaExecute"
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
