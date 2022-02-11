resource "aws_ssm_parameter" "facebook_token" {
  name        = "/production/facebook-token"
  description = "Facebook page token"
  type        = "SecureString"
  value       = var.facebook_token
}
