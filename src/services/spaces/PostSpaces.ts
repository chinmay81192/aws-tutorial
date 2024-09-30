import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { env } from "process";
import { v4 } from "uuid";

export default async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

  const item = JSON.parse(event.body);

  const result = await ddbDocClient.send(
    new PutItemCommand({
      Item: item,
      TableName: env.tableName,
    })
  );

  console.log(result);
  return { body: JSON.stringify({ id: randomId }), statusCode: 201 };
}
