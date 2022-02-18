data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "assume_events_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "card_randomiser_role" {
  name = "card_randomiser_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "card_generator_role" {
  name = "card_generator_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "upload_card_role" {
  name = "upload_card_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "invoke_sfn_role" {
  name = "invoke_sfn_role"

  assume_role_policy = data.aws_iam_policy_document.assume_events_role.json
}

resource "aws_iam_role" "invoke_booster_role" {
  name = "invoke_booster_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "signed_url_role" {
  name = "signed_url_role"

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
          "${aws_s3_bucket.card_bucket.arn}/*",
          "${aws_s3_bucket.card_image_bucket.arn}",
          "${aws_s3_bucket.card_image_bucket.arn}/*",
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "sign_s3_uploads" {
  name        = "${var.app_name}-sign-s3-uploads"
  description = "Allow signed uploads to specific S3 buckets"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:PutObject"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.public_submission_bucket.arn}",
          "${aws_s3_bucket.public_submission_bucket.arn}/*",
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "read_ssm" {
  name        = "${var.app_name}-read-ssm"
  description = "Read secret values from SSM"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ssm:GetParameter"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_ssm_parameter.facebook_token.arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "invoke_sfn" {
  name        = "${var.app_name}-invoke-sfn"
  description = "Invoke Step Functions workflow"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "states:StartExecution"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_sfn_state_machine.state_machine.arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "invoke_booster_pack" {
  name        = "${var.app_name}-invoke-booster"
  description = "Invoke booster-pack lambda"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "lambda:InvokeFunction"
        ]
        Effect = "Allow"
        Resource = [
          "${module.booster_pack_lambda.lambda_arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "s3_attach" {
  name = "${var.app_name}-s3-attachment"
  roles = [
    aws_iam_role.card_randomiser_role.name,
    aws_iam_role.card_generator_role.name,
    aws_iam_role.upload_card_role.name,
  ]
  policy_arn = aws_iam_policy.access_s3.arn
}

resource "aws_iam_policy_attachment" "s3_upload_attach" {
  name = "${var.app_name}-s3-upload-attachment"
  roles = [
    aws_iam_role.signed_url_role.name,
  ]
  policy_arn = aws_iam_policy.sign_s3_uploads.arn
}

resource "aws_iam_policy_attachment" "ssm_attach" {
  name = "${var.app_name}-ssm-attachment"
  roles = [
    aws_iam_role.upload_card_role.name,
  ]
  policy_arn = aws_iam_policy.read_ssm.arn
}

resource "aws_iam_policy_attachment" "sfn_attach" {
  name = "${var.app_name}-sfn-attachment"
  roles = [
    aws_iam_role.invoke_sfn_role.name,
  ]
  policy_arn = aws_iam_policy.invoke_sfn.arn
}

resource "aws_iam_policy_attachment" "booster_attach" {
  name = "${var.app_name}-sfn-attachment"
  roles = [
    aws_iam_role.invoke_booster_role.name,
  ]
  policy_arn = aws_iam_policy.invoke_booster_pack.arn
}
