# Terraform

This package contains Terraform configuration files for Localstack and Production deployments, as well as the config to create a Terraform Deployment User

## Localstack

This configuration is for deployment to Localstack. It is already configured to not query production AWS.

## Production

This configuration is for deployment to production AWS.

## Lambda

This module is a utility module for deploying Lambda Functions to both production and localstack. It will create a Lambda, Cloudwatch Log Group and the appropriate IAM Roles.

## User

This configuration is for creating an IAM User with the permissions necessary to deploy the Production configuration. TFState files generated from running this configuration should _not_ be committed to any repository, as the `aws_iam_access_key` should be treated as a secret. It is used in CI to deploy production as part of the CD deployment workflow.

## `state_machine.asl.json`

This is the defintion of the AWS Step Functions State Machine. It can be linted with `npm run lint -w terraform`, though developers may find it easier to install the [AWS Toolkit](https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.aws-toolkit-vscode) VSCode extension for live feedback when editing this file.
