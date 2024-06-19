import { beforeAll, describe, expect, test } from "bun:test";
import { getLoggedClient, url } from "../test-utils";

beforeAll(async () => {
   await fetch(`http://${url}/test/test-messages`, { method: "POST" });
});

describe("message-create", () => {
   test("message-create-successful", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[0];
      const result = await client.channels.createMessage(channel.id, { content: "test" });

      expect(result).toBeDefined();
   });
   test(
      "message-create-55-successful",
      async () => {
         const client = await getLoggedClient();

         const channel = (await client.channels.getAll())[0];

         const promise = new Promise(async (resolve) => {
            for (let i = 0; i < 55; i++) {
               await client.channels.createMessage(channel.id, { content: "test" + (i + 1) });
            }

            resolve(true);
         });

         expect(() => promise).not.toThrow();
      },
      { timeout: 15000 }
   );
   test("message-create-10-another-channel-successful", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[1];

      const promise = new Promise(async (resolve) => {
         for (let i = 0; i < 10; i++) {
            await client.channels.createMessage(channel.id, { content: "test" + (i + 1) });
         }

         resolve(true);
      });

      expect(() => promise).not.toThrow();
   });
   test("message-create-invalid-channel-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createMessage("invalid", { content: "test" })).toThrow("Invalid Form Body");
   });
   test("message-create-unknown-channel-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.channels.createMessage("000000000000000000", { content: "test" })).toThrow("Unknown Channel");
   });
   test("message-create-invalid-content", async () => {
      const client = await getLoggedClient();

      const channel = (await client.channels.getAll())[0];
      expect(() => client.channels.createMessage(channel.id, { content: "" })).toThrow();
   });
});
