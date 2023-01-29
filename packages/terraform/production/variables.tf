variable "app_name" {
  default = "yugiohbot"
}

variable "ld_preload" {
  default = "/opt/lib/libz.so.1"
}

variable "openai_api_key" {}

variable "twitter_consumer_key" {}

variable "twitter_consumer_secret" {}

variable "twitter_access_token" {}

variable "twitter_access_secret" {}
