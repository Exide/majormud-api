variable "aws_region" {
  default = "us-west-2"
}

provider "aws" {
  version = "~> 2.0"
  region  = var.aws_region
}

data "aws_caller_identity" "current" {}

// todo: save state to s3 and the lock to dynamodb
// todo: link existing infrastructure to state
// todo: resolve updates in terraform that haven't been synchronized
// todo: build new infrastructure that only exists in terraform currently (index-api.tf)
// todo: add existing infrastructure that doesnt exist in terraform currently (Route53)
