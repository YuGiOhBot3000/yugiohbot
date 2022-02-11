variable "app_name" {
  default = "yugiohbot"
}

variable "openai_api_key" {}

variable "facebook_token" {}

variable "ld_preload" {
  default = "/var/task/lib/libz.so.1"
}
