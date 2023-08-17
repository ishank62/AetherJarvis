import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { SsrStack } from "../lib/srr-stack";
import { CodePipelineStack } from '../lib/pipeline-stack'

const demoEnv = { region: "us-east-1" };
const app = new App();

new ApiStack(app, "SSRApiStack", { env: demoEnv });
new SsrStack(app, "SSRAppStack", { env: demoEnv });
new CodePipelineStack(app, 'CodePipeline', { env: demoEnv });

// app.synth();