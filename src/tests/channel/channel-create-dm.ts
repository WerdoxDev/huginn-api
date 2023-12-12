import { beforeAll, describe, expect, test } from "bun:test";
import { getLoggedClient, test2Credentials, test3Credentials } from "../test-utils";
import { Snowflake } from "@shared/types";

beforeAll(async () => {
   fetch("http://localhost:3000/test/test-channels", { method: "POST" });
});

describe("channel-create-dm", () => {
   test("channel-create-dm-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({})).toThrow("Invalid Form Body");
   });
   test("channel-create-single-dm-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ recipientId: "invalid" })).toThrow("Unknown User");
   });
   test("channel-create-group-dm-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ users: {} })).toThrow("Invalid Form Body");
      expect(() => client.channels.createDm({ users: { invalid: 123 } } as object)).toThrow("Invalid Form Body");
   });
   test("channel-create-group-dm-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ users: { invalid: "" } })).toThrow("Unknown User");
   });
   test("channel-create-single-dm-successful", async () => {
      const client = await getLoggedClient();
      const secondClient = await getLoggedClient(test2Credentials);

      const result = await client.channels.createDm({ recipientId: secondClient.user?._id });

      expect(result).toBeDefined();
      expect(result.recipients[0]._id).toBe(client.user!._id);
      expect(result.recipients[1]._id).toBe(secondClient.user!._id);
   });
   test("channel-create-group-dm-successful", async () => {
      const client = await getLoggedClient();
      const secondClient = await getLoggedClient(test2Credentials);
      const thirdClient = await getLoggedClient(test3Credentials);

      const users: Record<Snowflake, string> = {};

      users[secondClient.user!._id] = secondClient.user!.displayName;
      users[thirdClient.user!._id] = thirdClient.user!.displayName;

      const result = await client.channels.createDm({ users });

      expect(result).toBeDefined();
      expect(result.recipients[0]._id).toBe(client.user!._id);
      expect(result.recipients[1]._id).toBe(secondClient.user!._id);
      expect(result.recipients[2]._id).toBe(thirdClient.user!._id);
   });
});
