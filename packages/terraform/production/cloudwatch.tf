resource "aws_cloudwatch_event_rule" "every_day" {
  name                = "every-day"
  description         = "Fires every day"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "run_bot_every_day" {
  rule     = aws_cloudwatch_event_rule.every_day.name
  arn      = aws_sfn_state_machine.state_machine.arn
  role_arn = aws_iam_role.invoke_sfn_role.arn
}
