resource "aws_s3_bucket" "card_bucket" {
  bucket = "${var.app_name}-cards"
}

resource "aws_s3_bucket_acl" "card_bucket_acl" {
  bucket = aws_s3_bucket.card_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_lifecycle_configuration" "card_bucket_lifecycle" {
  bucket = aws_s3_bucket.card_bucket.bucket

  rule {
    id = "${var.app_name}-${aws_s3_bucket.card_bucket.bucket}-lifecycle"

    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket" "card_image_bucket" {
  bucket = "${var.app_name}-images"
}

resource "aws_s3_bucket_acl" "card_image_bucket_acl" {
  bucket = aws_s3_bucket.card_image_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_lifecycle_configuration" "card_image_bucket_lifecycle" {
  bucket = aws_s3_bucket.card_image_bucket.bucket

  rule {
    id = "${var.app_name}-${aws_s3_bucket.card_image_bucket.bucket}-lifecycle"

    status = "Enabled"

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
