resource "aws_s3_bucket" "backend" {
  bucket = "yugiohbot-tf-state"
  acl    = "private"

  versioning {
    enabled = true
  }
}
