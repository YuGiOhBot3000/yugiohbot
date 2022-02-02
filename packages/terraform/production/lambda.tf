module "generate_title_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-title"
  runtime              = "nodejs14.x"
  lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
  lambda_iam_role_name = aws_iam_role.lambda_role.name
}
