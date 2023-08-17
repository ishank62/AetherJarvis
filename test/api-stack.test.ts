import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { ApiStack } from '../lib/api-stack'

const app = new cdk.App()
const stack = new ApiStack(app, 'SSRApiStack')
const template = Template.fromStack(stack)

test('Event Bus has been created', () => {
  // Assessment
  template.hasResource('AWS::Lambda::Function', '')
})

test('ApiStack has output', () => {
  // Assessment
  template.hasOutput('apiurl', '')
})
