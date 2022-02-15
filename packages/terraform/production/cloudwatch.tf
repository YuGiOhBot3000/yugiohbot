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

resource "aws_cloudwatch_event_rule" "every_week" {
  name                = "booster-pack-every-week"
  description         = "Fires once a week"
  schedule_expression = "cron(23 0 ? * SAT *)"
}

resource "aws_cloudwatch_event_target" "run_booster_pack_every_week" {
  rule     = aws_cloudwatch_event_rule.every_week.name
  arn      = module.booster_pack_lambda.lambda_arn
  role_arn = aws_iam_role.invoke_sfn_role.arn
}
