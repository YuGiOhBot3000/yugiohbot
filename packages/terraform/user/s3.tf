resource "aws_s3_bucket" "backend" {
  bucket = "yugiohbot-tf-state"
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.backend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_acl" "acl" {
  bucket = aws_s3_bucket.backend.id
  acl    = "private"
}
