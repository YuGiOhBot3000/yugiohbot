resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.function_name}-lambda-logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "${aws_cloudwatch_log_group.lambda_log_group.arn}:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}


data "aws_iam_policy" "aws_xray_write_only_access" {
  arn = "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = var.lambda_iam_role_name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "aws_xray_write_only_access" {
  role       = var.lambda_iam_role_name
  policy_arn = data.aws_iam_policy.aws_xray_write_only_access.arn
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.function.function_name}"
  retention_in_days = 14
}

data "archive_file" "lambda_zip" {
  type             = "zip"
  source_dir       = "${path.module}/../../${var.function_name}/dist/"
  output_file_mode = "0666"
  output_path      = "${path.module}/files/${var.function_name}.zip"
}

resource "aws_lambda_function" "function" {
  filename      = data.archive_file.lambda_zip.output_path
  function_name = "${var.app_name}-${var.function_name}"
  role          = var.lambda_iam_role_arn
  handler       = "index.handler"

  source_code_hash = filebase64sha256(data.archive_file.lambda_zip.output_path)

  runtime     = var.runtime
  timeout     = var.timeout
  memory_size = var.memory_size

  environment {
    variables = var.environment_variables
  }

  tracing_config {
    mode = "Active"
  }
}
