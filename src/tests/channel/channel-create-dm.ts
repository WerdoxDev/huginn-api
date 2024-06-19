import { beforeAll, describe, expect, test } from "bun:test";
import { getLoggedClient, test2Credentials, test3Credentials, url } from "../test-utils";
import { Snowflake } from "@shared/snowflake";
import { APIChannelUser } from "@shared/api-types";

beforeAll(async () => {
   fetch(`http://${url}/test/test-channels`, { method: "POST" });
});

describe("channel-create-dm", () => {
   test("channel-create-dm-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({})).toThrow("Invalid Form Body");
   });
   test("channel-create-single-dm-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ recipientId: "invalid" })).toThrow("Invalid Form Body");
   });
   test("channel-create-single-dm-unknown-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ recipientId: "000000000000000000" })).toThrow("Unknown User");
   });
   test("channel-create-group-dm-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ users: {} })).toThrow("Invalid Form Body");
      expect(() => client.channels.createDm({ users: { invalid: 123 } } as object)).toThrow("Invalid Form Body");
   });
   test("channel-create-group-dm-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ users: { invalid: "" } })).toThrow("Invalid Form Body");
   });
   test("channel-create-group-dm-unknown-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createDm({ users: { invalid: "000000000000000000" } })).toThrow(
         /\b(Invalid Form Body|Unknown User)\b/
      );
   });
   test("channel-create-single-dm-successful", async () => {
      const client = await getLoggedClient();
      const secondClient = await getLoggedClient(test2Credentials);

      const result = await client.channels.createDm({ recipientId: secondClient.user?.id });

      expect(result).toBeDefined();
      expect(containsId(result.recipients, client.user!.id)).toBe(true);
      expect(containsId(result.recipients, secondClient.user!.id)).toBe(true);
      // expect(result.recipients[0].id).toBe(client.user!.id);
      // expect(result.recipients[1].id).toBe(secondClient.user!.id);
   });
   test("channel-create-group-dm-successful", async () => {
      const client = await getLoggedClient();
      const secondClient = await getLoggedClient(test2Credentials);
      const thirdClient = await getLoggedClient(test3Credentials);

      const users: Record<Snowflake, string> = {};

      users[secondClient.user!.id] = secondClient.user!.displayName;
      users[thirdClient.user!.id] = thirdClient.user!.displayName;

      const result = await client.channels.createDm({ users });

      expect(result).toBeDefined();
      expect(containsId(result.recipients, client.user!.id)).toBe(true);
      expect(containsId(result.recipients, secondClient.user!.id)).toBe(true);
      expect(containsId(result.recipients, thirdClient.user!.id)).toBe(true);
      // expect(result.recipients[0].id).toBe(client.user!.id);
      // expect(result.recipients[1].id).toBe(secondClient.user!.id);
      // expect(result.recipients[2].id).toBe(thirdClient.user!.id);
   });
});

function containsId(recipients: APIChannelUser[], id: Snowflake) {
   return recipients.some((x) => x.id === id);
}
