import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {  Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration;
  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    const helloLamda = new NodejsFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_LATEST,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "hello.ts"),
      environment: {
        tableName: props.spacesTable.tableName,
      },
    });

    helloLamda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:ListAllMyBuckets", "s3:ListBucket"],
        resources: ["*"], //bad practice
      })
    );

    this.helloLambdaIntegration = new LambdaIntegration(helloLamda);
  }
}
