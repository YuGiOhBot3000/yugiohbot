variable "app_name" {
  default = "yugiohbot"
}

variable "ld_preload" {
  default = "/opt/lib/libz.so.1"
}

variable "layer_arn" {
  default = "arn:aws:serverlessrepo:us-east-1:990551184979:applications/lambda-layer-canvas-nodejs"
}

variable "openai_api_key" {}

variable "twitter_consumer_key" {}

variable "twitter_consumer_secret" {}

variable "twitter_access_token" {}

variable "twitter_access_secret" {}
