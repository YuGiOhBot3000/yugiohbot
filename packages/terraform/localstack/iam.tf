data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "card_generator_role" {
  name = "card_generator_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy" "access_s3" {
  name        = "${var.app_name}-access-s3"
  description = "Access required commands on specific S3 buckets"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:GetObjectAcl",
          "s3:DeleteObject",
          "s3:PutObject",
          "s3:PubObjectAcl"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.card_bucket.arn}",
          "${aws_s3_bucket.card_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "s3_attach" {
  name = "${var.app_name}-s3-attachment"
  roles = [
    aws_iam_role.card_generator_role.name,
  ]
  policy_arn = aws_iam_policy.access_s3.arn
}
