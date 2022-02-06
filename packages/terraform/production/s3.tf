resource "aws_s3_bucket" "card_bucket" {
  bucket = "${var.app_name}-cards"
  acl    = "private"
}
