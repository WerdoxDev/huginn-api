import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("channel-get", () => {
   test("channel-get-all-successful", async () => {
      const client = await getLoggedClient();

      const channels = await client.channels.getAll();

      expect(channels).toBeDefined();
      expect(channels.length).toBeGreaterThan(0);
   });
   test("channel-get-by-id-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.get("invalid")).toThrow("Invalid Form Body");
   });
   test("channel-get-by-id-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.get("000000000000000000")).toThrow("Unknown Channel");
   });
   test("channel-get-by-id-successful", async () => {
      const client = await getLoggedClient();

      const channels = await client.channels.getAll();

      const channel = await client.channels.get(channels[0].id);
      expect(channel).toBeDefined();
   });
});
