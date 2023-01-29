resource "aws_cloudwatch_event_rule" "every_hour" {
  name                = "every-hour"
  description         = "Fires every hour"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "run_bot_every_hour" {
  rule     = aws_cloudwatch_event_rule.every_hour.name
  arn      = aws_sfn_state_machine.state_machine.arn
  role_arn = aws_iam_role.invoke_sfn_role.arn
}

# resource "aws_cloudwatch_event_rule" "every_week" {
#   name                = "booster-pack-every-week"
#   description         = "Fires once a week"
#   schedule_expression = "cron(23 0 ? * SAT *)"
# }

# resource "aws_cloudwatch_event_target" "run_booster_pack_every_week" {
#   rule      = aws_cloudwatch_event_rule.every_week.name
#   target_id = "lambda"
#   arn       = module.booster_pack_lambda.lambda_arn
# }

# resource "aws_lambda_permission" "allow_cloudwatch_to_call_booster_pack" {
#   statement_id  = "AllowBoosterPackExecutionFromCloudWatch"
#   action        = "lambda:InvokeFunction"
#   function_name = module.booster_pack_lambda.lambda_function_name
#   principal     = "events.amazonaws.com"
#   source_arn    = aws_cloudwatch_event_rule.every_week.arn
# }
