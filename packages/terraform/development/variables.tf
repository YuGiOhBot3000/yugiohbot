variable "app_name" {
  default = "yugiohbot-dev"
}

variable "ld_preload" {
  default = "/opt/lib/libz.so.1"
}


variable "layer_arn" {
  default = "arn:aws:serverlessrepo:us-east-1:990551184979:applications/lambda-layer-canvas-nodejs"
}
