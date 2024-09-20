import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly spacesLambdaIntegration;
  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    const spacesLamda = new NodejsFunction(this, "spacesLamda", {
      runtime: Runtime.NODEJS_LATEST,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "spaces", "handler.ts"),
      environment: {
        tableName: props.spacesTable.tableName,
      },
    });

    spacesLamda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:PutItem"],
        resources: [props.spacesTable.tableArn], //bad practice
      })
    );

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLamda);
  }
}
