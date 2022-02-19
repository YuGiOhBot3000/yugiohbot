resource "aws_apigatewayv2_api" "submission_gateway" {
  name          = "${var.app_name}-gateway"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST"]
    allow_headers = ["*"]
    max_age       = 300
  }
}

resource "aws_cloudwatch_log_group" "submission_gateway" {
  name              = "/aws/api_gw/${aws_apigatewayv2_api.submission_gateway.name}"
  retention_in_days = 14
}

resource "aws_apigatewayv2_stage" "submission_stage" {
  api_id      = aws_apigatewayv2_api.submission_gateway.id
  name        = "prod"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.submission_gateway.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "submission_integration" {
  api_id = aws_apigatewayv2_api.submission_gateway.id

  integration_uri    = module.signed_url_lambda.lambda_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "submission_route" {
  api_id = aws_apigatewayv2_api.submission_gateway.id

  route_key = "POST /submission"
  target    = "integrations/${aws_apigatewayv2_integration.submission_integration.id}"
}

resource "aws_lambda_permission" "submission_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.signed_url_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.submission_gateway.execution_arn}/*/*"
}
