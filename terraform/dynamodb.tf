resource "aws_dynamodb_table" "versions" {
  name = "majormud-versions"
  hash_key = "name"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "name"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "races" {
  name = "majormud-races"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "classes" {
  name = "majormud-classes"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "rooms" {
  name = "majormud-rooms"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "npcs" {
  name = "majormud-npcs"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "items" {
  name = "majormud-items"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "version"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  global_secondary_index {
    name = "name"
    hash_key = "name"
    range_key = "version"
    projection_type = "ALL"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "spells" {
  name = "majormud-spells"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}

resource "aws_dynamodb_table" "shops" {
  name = "majormud-shops"
  hash_key = "id"
  range_key = "version"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
  }
}
