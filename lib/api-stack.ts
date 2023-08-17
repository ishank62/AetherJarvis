import { Duration, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from "constructs";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 👇 get access to the secret object
    const openAIApiKeySecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'openai-api-key',
      'OpenAIApiKey',
    );

    const apiFunction = new lambda.Function(this, "apiHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("simple-ssr/api"),
      memorySize: 128,
      timeout: Duration.seconds(5),
      handler: "index.handler",
      environment: {
        OPENAI_API_KEY: openAIApiKeySecret.secretValue.toString(),
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
