import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "eu-central-1";
process.env.tableName = "SpaceStack-06ddc217b23b";

handler(
  {
    httpMethod: "GET",
    queryStringParameters: { id: "b3668847-4cbc-44ee-bf81-57bf3703bc9f" },
  } as any,
  {} as any
);
