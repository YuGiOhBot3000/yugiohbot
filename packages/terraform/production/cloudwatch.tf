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
