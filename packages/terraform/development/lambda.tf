module "generate_title_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-title"
  runtime              = "nodejs18.x"
  lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
  lambda_iam_role_name = aws_iam_role.lambda_role.name
}

module "generate_text_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-text"
  runtime              = "nodejs18.x"
  timeout              = 20
  lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
  lambda_iam_role_name = aws_iam_role.lambda_role.name
}

module "randomise_card_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "randomise-card"
  runtime              = "nodejs18.x"
  memory_size          = 256
  timeout              = 30
  layers               = [var.layer_arn]
  lambda_iam_role_arn  = aws_iam_role.card_randomiser_role.arn
  lambda_iam_role_name = aws_iam_role.card_randomiser_role.name
  environment_variables = {
    CARD_IMAGE_BUCKET = aws_s3_bucket.card_image_bucket.bucket
    LD_PRELOAD        = var.ld_preload
  }
}

module "generate_card_lambda" {
  source = "../lambda"

  app_name             = var.app_name
  function_name        = "generate-card"
  runtime              = "nodejs18.x"
  memory_size          = 512
  timeout              = 10
  layers               = [var.layer_arn]
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
  runtime              = "nodejs18.x"
  timeout              = 30
  lambda_iam_role_arn  = aws_iam_role.upload_card_role.arn
  lambda_iam_role_name = aws_iam_role.upload_card_role.name
  environment_variables = {
    S3_BUCKET = aws_s3_bucket.card_bucket.bucket
  }
}

# Leaving this for now, as it's not ready yet
# module "booster_pack_lambda" {
#   source = "../lambda"

#   app_name             = var.app_name
#   function_name        = "booster-pack"
#   runtime              = "nodejs18.x"
#   timeout              = 60
#   lambda_iam_role_arn  = aws_iam_role.lambda_role.arn
#   lambda_iam_role_name = aws_iam_role.lambda_role.name
#   environment_variables = {
#     FACEBOOK_ALBUM_ID = var.facebook_album_id
#     SSM_NAME          = aws_ssm_parameter.facebook_token.name
#   }
# }
