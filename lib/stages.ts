import { Stage, StageProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ApiStack } from './api-stack'

// Main deployment setup. Collection of the stacks and deployment sequence
export class Deployment extends Stage {
  constructor (scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props)
    // Deploy the Api stack in the Deployment stage
    const demoEnv = { region: "us-east-1" };

    new ApiStack(this, 'SSRApiStack', { env: demoEnv });
  }
}
