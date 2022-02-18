resource "aws_s3_bucket" "card_bucket" {
  bucket = "${var.app_name}-cards"
  acl    = "private"

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket" "card_image_bucket" {
  bucket = "${var.app_name}-images"
  acl    = "public-read"

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_policy" "object_public_by_default" {
  bucket = aws_s3_bucket.card_image_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.card_image_bucket.arn}/*",
        ]
        Principal = "*"
      }
    ]
  })
}

resource "aws_s3_bucket" "public_submission_bucket" {
  bucket = "${var.app_name}-public-submissions"
  acl    = "private"

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket" "private_submission_bucket" {
  bucket = "${var.app_name}-private-submissions"
  acl    = "private"
}
