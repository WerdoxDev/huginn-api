import { describe, expect, test } from "bun:test";
import { getLoggedClient, test2Credentials, test3Credentials } from "../test-utils";
import { Snowflake } from "@shared/types";

describe("channel-create-dm", () => {
   test("channel-create-single-dm-successful", async () => {
      const client = await getLoggedClient();
      const sideClient = await getLoggedClient(test2Credentials);

      const result = await client.channels.createDm({ recipientId: sideClient.user?._id });

      expect(result).toBeDefined();
      expect(result.recipients[0]._id).toBe(sideClient.user!._id);
   });

   test("channel-create-group-dm-successful", async () => {
      const client = await getLoggedClient();
      const side1Client = await getLoggedClient(test2Credentials);
      const side2Client = await getLoggedClient(test3Credentials);

      const users: Record<Snowflake, string> = {};

      users[side1Client.user!._id] = side1Client.user!.displayName;
      users[side2Client.user!._id] = side2Client.user!.displayName;

      const result = await client.channels.createDm({ users });

      expect(result).toBeDefined();
   });
});
