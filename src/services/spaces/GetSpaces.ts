import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { env } from "process";
import { v4 } from "uuid";

export default async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters;
  if (!!params) {
    if ("id" in params) {
      const spaceId = params["id"];
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: env.tableName,
          Key: {
            id: {
              S: spaceId,
            },
          },
        })
      );
      if (getItemResponse.Item) {
        const unMarshalledResponse = unmarshall(getItemResponse.Item);
        return { body: JSON.stringify(unMarshalledResponse), statusCode: 201 };
      } else {
        return {
          statusCode: 404,
          body: "Not found",
        };
      }
    } else {
      return {
        statusCode: 400,
        body: "Bad request",
      };
    }
  }

  const result = await ddbClient.send(
    new ScanCommand({
      TableName: env.tableName,
    })
  );

  const unmarshalledItems = result.Items?.map((item) => unmarshall(item));

  return { body: JSON.stringify(unmarshalledItems), statusCode: 201 };
}
