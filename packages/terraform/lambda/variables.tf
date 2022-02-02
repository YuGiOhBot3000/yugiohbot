variable "app_name" {
  description = "Name of the app the functions sits under"
}

variable "function_name" {
  description = "Name of the package directory"
}

variable "runtime" {
  description = "Programmatic runtime to run the function"
}

variable "timeout" {
  type        = number
  description = "Timeout for function"
  default     = 3
}

variable "memory_size" {
  type        = number
  description = "Amount of MB the function can use"
  default     = 128
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables to pass to the function"
  default = {
    VERSION = 1
  }
}

variable "lambda_iam_role_arn" {
  description = "Lambda IAM role ARN"
}

variable "lambda_iam_role_name" {
  description = "Lambda IAM role name"
}
