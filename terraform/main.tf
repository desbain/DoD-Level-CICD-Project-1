terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }

  # Remote state — create the S3 bucket and DynamoDB table first:
  #   aws s3api create-bucket --bucket dod-tfstate-<account-id> --region us-east-2 --create-bucket-configuration LocationConstraint=us-east-2
  #   aws dynamodb create-table --table-name dod-tfstate-lock --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST --region us-east-2
  backend "s3" {
    bucket         = "dod-tfstate-450665609241"
    key            = "eks/terraform.tfstate"
    region         = "us-east-2"
    dynamodb_table = "dod-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = "DoD-DevSecOps"
      Environment = "production"
      ManagedBy   = "Terraform"
    }
  }
}
