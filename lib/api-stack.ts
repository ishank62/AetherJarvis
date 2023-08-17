import { Duration, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';
import { IAwsCdkCodepipelineStackProps } from './stack-config-types';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * IAM Role used by Codepipeline and assumed by related components.
     */
    // const role = new iam.Role(this, 'role', {
    //   roleName: props.role.name,
    //   description: props.role.description,
    //   assumedBy: new iam.CompositePrincipal(
    //     new iam.ServicePrincipal('cloudformation.amazonaws.com'),
    //     new iam.ServicePrincipal('codebuild.amazonaws.com'),
    //     new iam.ServicePrincipal('codepipeline.amazonaws.com'),
    //   ),
    // });
    // role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(props.role.managedPolicy));

    // 👇 get access to the secret object
    const openAIApiKeySecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'openai-api-key',
      'OpenAIApiKey',
    );
    // openAIApiKeySecret.grantRead(role);

    const apiFunction = new lambda.Function(this, "apiHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("simple-ssr/api"),
      memorySize: 128,
      timeout: Duration.seconds(180),
      handler: "index.handler",
      environment: {
        OPENAI_API_KEY: openAIApiKeySecret.secretValue.toString()
      }
    });

    const api = new apigw.LambdaRestApi(this, "apiEndpoint", {
      handler: apiFunction,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    new CfnOutput(this, "apiurl", { value: api.url });
  }
}
