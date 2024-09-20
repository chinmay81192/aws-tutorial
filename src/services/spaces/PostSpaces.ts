import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
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

  const item = JSON.parse(event.body);

  const result = await ddbClient.send(
    new PutItemCommand({
      Item: {
        id: {
          S: randomId,
        },
        location: {
          S: item.location,
        },
      },
      TableName: env.tableName,
    })
  );

  console.log(result);
  return { body: JSON.stringify({ id: randomId }), statusCode: 201 };
}
