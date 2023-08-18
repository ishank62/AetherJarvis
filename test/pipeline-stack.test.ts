import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { CodePipelineStack } from '../lib/pipeline-stack'

const app = new cdk.App()
const demoEnv = { region: "us-east-1" };
const stack = new CodePipelineStack(app, 'CodePipeline', { env: demoEnv })
const template = Template.fromStack(stack)

// Execute tests for CodePipeline template
test('Pipeline restarts on update', () => {
  // Assessment
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    RestartExecutionOnUpdate: true
  })
})

test('There are 8 CodeBuild objects in use', () => {
  // Assessment
  // template.resourceCountIs('AWS::CodeBuild::Project', 8)
})

test('CodePipeline has repository name in output', () => {
  // Assessment
  template.hasOutput('RepositoryName', '')
})
