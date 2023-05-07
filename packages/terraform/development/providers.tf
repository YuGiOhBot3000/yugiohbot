provider "aws" {
  region = "eu-central-1"
}

terraform {
  backend "s3" {
    bucket = "yugiohbot-tf-state"
    region = "eu-central-1"
  }
}
