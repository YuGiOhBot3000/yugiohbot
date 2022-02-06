resource "aws_iam_user" "terraform" {
  name = "yugiohbot-terraform"
}

resource "aws_iam_access_key" "key" {
  user = aws_iam_user.terraform.name
}

data "aws_iam_group" "deployer" {
  group_name = "deployer"
}

resource "aws_iam_group_membership" "deployers" {
  name = "deployer-group-membership"

  users = [
    aws_iam_user.terraform.name
  ]

  group = data.aws_iam_group.deployer.group_name
}

resource "aws_iam_user_policy" "s3backend" {
  name = "TerraformBackendAccess"
  user = aws_iam_user.terraform.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:ListBucket",
        ]
        Effect   = "Allow"
        Resource = "${aws_s3_bucket.backend.arn}"
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Effect   = "Allow"
        Resource = "${aws_s3_bucket.backend.arn}/terraform.tfstate"
      },
    ]
  })
}

resource "aws_iam_group_policy" "s3" {
  name  = "DeployS3Bucket"
  group = data.aws_iam_group.deployer.group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:DeleteBucketPolicy",
          "s3:Get*",
          "s3:ListBucket",
          "s3:PutBucketAcl",
          "s3:PutBucketPolicy",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_group_policy" "lambda" {
  name  = "DeployLambda"
  group = data.aws_iam_group.deployer.group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ReadOnlyPermissions"
        Effect = "Allow"
        Action = [
          "lambda:GetAccountSettings",
          "lambda:GetEventSourceMapping",
          "lambda:GetFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:GetFunctionConcurrency",
          "lambda:ListEventSourceMappings",
          "lambda:ListFunctions",
          "lambda:ListTags",
          "iam:ListRoles"
        ]
        Resource = "*"
      },
      {
        Sid    = "DevelopFunctions"
        Effect = "Allow"
        NotAction = [
          "lambda:PutFunctionConcurrency"
        ]
        Resource = "arn:aws:lambda:*:*:function:yugiohbot-*"
      },
      {
        Sid    = "DevelopEventSourceMappings"
        Effect = "Allow"
        Action = [
          "lambda:DeleteEventSourceMapping",
          "lambda:UpdateEventSourceMapping",
          "lambda:CreateEventSourceMapping"
        ]
        Resource = "*"
        Condition = {
          StringLike = {
            "lambda:FunctionArn" = "arn:aws:lambda:*:*:function:yugiohbot-*"
          }
        }
      },
      {
        Sid    = "PassExecutionRole"
        Effect = "Allow"
        Action = [
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:PassRole",
          "iam:SimulatePrincipalPolicy"
        ]
        Resource = "*"
      },
      {
        Sid    = "ViewLogs"
        Effect = "Allow"
        Action = [
          "logs:*"
        ]
        Resource = "arn:aws:logs:*:*:log-group:/aws/lambda/yugiohbot-*"
      },
    ]
  })
}

resource "aws_iam_group_policy" "cloudwatch" {
  name  = "CreateCloudwatchLogGroups"
  group = data.aws_iam_group.deployer.group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:DeleteLogGroup",
          "logs:DescribeLogGroups",
          "logs:ListTagsLogGroup",
          "logs:PutRetentionPolicy"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_group_policy" "iam" {
  name  = "ManageIAMRoles"
  group = data.aws_iam_group.deployer.group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "iam:AttachRolePolicy",
          "iam:CreatePolicy",
          "iam:CreatePolicyVersion",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",
          "iam:DeleteRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:ListEntitiesForPolicy",
          "iam:ListInstanceProfilesForRole",
          "iam:ListPolicies",
          "iam:ListPolicyVersions"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_group_policy" "stepfunctions" {
  name  = "DeployStepFunctions"
  group = data.aws_iam_group.deployer.group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "ManageStates"
        Action = [
          "states:CreateStateMachine",
          "states:DeleteStateMachine",
          "states:DescribeStateMachine",
          "states:ListTagsForResource",
          "states:UpdateStateMachine"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:states:*:*:*"
      },
      {
        Sid = "ManageRoles"
        Action = [
          "iam:PassRole"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:iam:::role/*"
      }
    ]
  })
}

resource "aws_iam_group_policy" "events" {
  name  = "ManageCloudwatchEvents"
  group = data.aws_iam_group.deployer.group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "ManageEvents"
        Action = [
          "events:DeleteRule",
          "events:DescribeRule",
          "events:ListTagsForResource",
          "events:ListTargetsByRule",
          "events:PutRule",
          "events:PutTargets",
          "events:RemoveTargets"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:events:*:*:*"
      }
    ]
  })
}
