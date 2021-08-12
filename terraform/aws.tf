provider "aws" {
  version = "~> 3.0"
  region  = "us-west-2"
}

terraform {
  backend "s3" {
    region = "us-west-2"
    bucket = "majormud-api"
    key = "terraform"
    dynamodb_table = "majormud-api-terraform-lock"
  }
}

data "aws_caller_identity" "current" {}

// todo: save state to s3 and the lock to dynamodb
// todo: link existing infrastructure to state
// todo: resolve updates in terraform that haven't been synchronized
// todo: build new infrastructure that only exists in terraform currently (index-api.tf)
// todo: add existing infrastructure that doesnt exist in terraform currently (Route53)
