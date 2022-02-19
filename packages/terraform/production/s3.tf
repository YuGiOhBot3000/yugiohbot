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
  bucket        = "${var.app_name}-public-submissions"
  acl           = "private"
  force_destroy = true

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
