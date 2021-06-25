resource "aws_s3_bucket" "majormud-api" {
  bucket = "majormud-api"
  acl    = "private"
}
