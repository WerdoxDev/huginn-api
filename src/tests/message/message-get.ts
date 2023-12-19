import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("message-get", () => {
   test("message-get-invalid-id", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[0];

      expect(() => client.channels.getMessage(channel.id, "invalid")).toThrow("Unknown Message");
   });
   test(
      "message-get-channel-messages-successful",
      async () => {
         const client = await getLoggedClient();

         const channel = (await client.channels.getAll())[0];

         for (let i = 0; i < 55; i++) {
            await client.channels.createMessage(channel.id, { content: "test" + i });
         }

         const messages = await client.channels.getMessages(channel.id);

         expect(messages).toBeDefined();
         expect(messages).toBeArray();
         expect(messages).toHaveLength(50);
      },
      { timeout: 0 }
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
      { timeout: 0 }
   );
});
