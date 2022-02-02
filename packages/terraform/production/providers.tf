provider "aws" {
  region  = "eu-central-1"
  profile = "yugiohbot"
}

terraform {
  backend "s3" {
    bucket = "yugiohbot-tf-state"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}
