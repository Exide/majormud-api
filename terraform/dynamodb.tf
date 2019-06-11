resource "aws_dynamodb_table" "races" {
  name = "majormud-races"
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
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

resource "aws_dynamodb_table" "classes" {
  name = "majormud-classes"
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
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

resource "aws_dynamodb_table" "rooms" {
  name = "majormud-rooms"
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
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
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
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

resource "aws_dynamodb_table" "items" {
  name = "majormud-items"
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
    type = "S"
  }

  attribute {
    name = "version"
    type = "S"
  }

  tags = {
    topic = "MajorMUD"
    version = "1.11p"
  }
}

resource "aws_dynamodb_table" "spells" {
  name = "majormud-spells"
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
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

resource "aws_dynamodb_table" "shops" {
  name = "majormud-shops"
  hash_key = "hash"
  range_key = "version"

  write_capacity = 25
  read_capacity = 25

  attribute {
    name = "hash"
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
