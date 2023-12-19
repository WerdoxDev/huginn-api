import { beforeAll, describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

beforeAll(async () => {
   await fetch("http://localhost:3000/test/test-messages", { method: "POST" });
});

describe("message-create", () => {
   test("message-create-successful", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[0];
      const result = await client.channels.createMessage(channel.id, { content: "test" });

      expect(result).toBeDefined();
   });
   test("message-create-invalid-channel-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createMessage("invalid", { content: "test" })).toThrow("Unknown Channel");
   });
   test("message-create-invalid-content", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[0];
      expect(() => client.channels.createMessage(channel.id, { content: "" })).toThrow();
   });
});
