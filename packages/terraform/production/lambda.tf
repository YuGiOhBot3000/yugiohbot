module "generate_title_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-title"
  runtime              = "nodejs14.x"
  lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
  lambda_iam_role_name = aws_iam_role.lambda_role.name
}

module "generate_text_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-text"
  runtime              = "nodejs14.x"
  timeout              = 20
  lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
  lambda_iam_role_name = aws_iam_role.lambda_role.name
  environment_variables = {
    OPENAI_API_KEY = var.openai_api_key
  }
}

module "randomise_card_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "randomise-card"
  runtime              = "nodejs14.x"
  memory_size          = 256
  timeout              = 10
  layers               = [aws_lambda_layer_version.node_canvas_layer.arn]
  lambda_iam_role_arn  = aws_iam_role.card_randomiser_role.arn
  lambda_iam_role_name = aws_iam_role.card_randomiser_role.name
  environment_variables = {
    S3_BUCKET  = aws_s3_bucket.card_image_bucket.bucket
    LD_PRELOAD = var.ld_preload
  }
}

module "generate_card_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-card"
  runtime              = "nodejs14.x"
  memory_size          = 512
  timeout              = 10
  layers               = [aws_lambda_layer_version.node_canvas_layer.arn]
  lambda_iam_role_arn  = aws_iam_role.card_generator_role.arn
  lambda_iam_role_name = aws_iam_role.card_generator_role.name
  environment_variables = {
    S3_BUCKET  = aws_s3_bucket.card_bucket.bucket
    LD_PRELOAD = var.ld_preload
  }
}

module "upload_card_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "upload-card"
  runtime              = "nodejs14.x"
  timeout              = 30
  lambda_iam_role_arn  = aws_iam_role.upload_card_role.arn
  lambda_iam_role_name = aws_iam_role.upload_card_role.name
  environment_variables = {
    S3_BUCKET = aws_s3_bucket.card_bucket.bucket
    SSM_NAME  = aws_ssm_parameter.facebook_token.name
  }
}

module "booster_pack_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "booster-pack"
  runtime              = "nodejs14.x"
  timeout              = 60
  lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
  lambda_iam_role_name = aws_iam_role.lambda_role.name
  environment_variables = {
    FACEBOOK_ALBUM_ID = var.facebook_album_id
    SSM_NAME          = aws_ssm_parameter.facebook_token.name
  }
}

module "signed_url_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "signed-url"
  runtime              = "nodejs14.x"
  lambda_iam_role_arn  = aws_iam_role.signed_url_role.arn
  lambda_iam_role_name = aws_iam_role.signed_url_role.name
  environment_variables = {
    S3_BUCKET = aws_s3_bucket.public_submission_bucket.bucket
  }
}

resource "aws_lambda_function_url" "signed_url" {
  function_name      = module.signed_url_lambda.lambda_function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["*"]
    allow_methods = ["POST"]
    allow_headers = ["*"]
    max_age       = 300
  }
}

module "moderate_image_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "moderate-image"
  runtime              = "nodejs14.x"
  lambda_iam_role_arn  = aws_iam_role.moderate_image_role.arn
  lambda_iam_role_name = aws_iam_role.moderate_image_role.name
  environment_variables = {
    S3_PRIVATE_BUCKET = aws_s3_bucket.private_submission_bucket.bucket
  }
}

resource "aws_lambda_layer_version" "node_canvas_layer" {
  filename         = "../../../layer.zip"
  source_code_hash = filebase64sha256("../../../layer.zip")
  layer_name       = "${var.app_name}-node-canvas"

  compatible_runtimes = ["nodejs14.x"]
}
