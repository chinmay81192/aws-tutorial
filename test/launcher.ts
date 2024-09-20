import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "eu-central-1";
process.env.tableName = "SpaceStack-06ddc217b23b";

handler(
  { httpMethod: "POST", body: JSON.stringify({ location: "London" }) } as any,
  {} as any
);
