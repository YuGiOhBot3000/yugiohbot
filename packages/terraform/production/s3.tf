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

resource "aws_s3_bucket" "public_submission_bucket" {
  bucket        = "${var.app_name}-public-submissions"
  force_destroy = true
}

resource "aws_s3_bucket_acl" "public_submission_bucket_acl" {
  bucket = aws_s3_bucket.public_submission_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_lifecycle_configuration" "public_submission_bucket_lifecycle" {
  bucket = aws_s3_bucket.public_submission_bucket.bucket

  rule {
    id = "${var.app_name}-${aws_s3_bucket.public_submission_bucket.bucket}-lifecycle"

    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "public_cors" {
  bucket = aws_s3_bucket.public_submission_bucket.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket" "private_submission_bucket" {
  bucket = "${var.app_name}-private-submissions"
}

resource "aws_s3_bucket_acl" "private_submission_bucket_acl" {
  bucket = aws_s3_bucket.private_submission_bucket.id
  acl    = "private"
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.moderate_image_lambda.lambda_function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.public_submission_bucket.arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.public_submission_bucket.id

  lambda_function {
    lambda_function_arn = module.moderate_image_lambda.lambda_arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}
