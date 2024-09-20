import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import postSpaces from "./PostSpaces";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  let body: string = "";

  try {
    if (event.httpMethod === "GET") {
      body = "GET Request";
    } else if (event.httpMethod === "POST") {
      const response = await postSpaces(event, ddbClient);
      return response;
    } else {
      body = "Other Request";
    }
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify(e) };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(body),
  };

  return response;
}

export { handler };
