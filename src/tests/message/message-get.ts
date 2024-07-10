import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("message-get", () => {
   test("message-get-invalid", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[0];

      expect(() => client.channels.getMessage(channel.id, "invalid")).toThrow("Invalid Form Body"); // Invalid id
      expect(() => client.channels.getMessage(channel.id, "000000000000000000")).toThrow("Unknown Message"); // Unknown id
   });
   test(
      "message-get-channel-messages-successful",
      async () => {
         const client = await getLoggedClient();

         const channel = (await client.channels.getAll())[0];

         const messages = await client.channels.getMessages(channel.id);

         expect(messages).toBeDefined();
         expect(messages).toBeArray();
         expect(messages).toHaveLength(50);
      },
      { timeout: 10000 }
   );
   test(
      "message-get-channel-messages-with-limit",
      async () => {
         const client = await getLoggedClient();

         const channel = (await client.channels.getAll())[0];

         const limit = 20;
         const messages = await client.channels.getMessages(channel.id, limit);

         expect(messages).toBeDefined();
         expect(messages).toBeArray();
         expect(messages).toHaveLength(20);
      },
      { timeout: 10000 }
   );
});
