resource "aws_iam_role" "iam_for_sfn" {
  name = "${var.app_name}-sfn-iam"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "InvokeLambdas"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "lambda:InvokeFunction"
          ]
          Effect = "Allow"
          Resource = [
            "${module.generate_title_lambda.lambda_arn}"
          ]
        },
      ]
    })
  }
}

data "template_file" "definition" {
  template = file("${path.module}/../state_machine.asl.json")
  vars = {
    generateTitleArn = module.generate_title_lambda.lambda_arn
  }
}

resource "aws_sfn_state_machine" "state_machine" {
  name     = "${var.app_name}-workflow"
  role_arn = aws_iam_role.iam_for_sfn.arn

  definition = data.template_file.definition.rendered
}
