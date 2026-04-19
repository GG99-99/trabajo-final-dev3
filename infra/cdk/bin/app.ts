#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { ObsidianStack } from '../lib/obsidian-stack'

const app = new cdk.App()

new ObsidianStack(app, 'ObsidianArchiveStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region:  process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
  description: 'Obsidian Archive — S3 bucket for tattoo images',
})
