import { beforeAll, describe, test } from "bun:test";
import { getLoggedClient, test2Credentials, url } from "./test-utils";

beforeAll(async () => {
   await fetch(`http://${url}/test/conversation-messages`, { method: "POST" });
});

describe("conversation", () => {
   test("create-conversation", async () => {
      const client = await getLoggedClient();
      const secondClient = await getLoggedClient(test2Credentials);

      const channel = (await client.channels.getAll())[0];
      const secondChannel = (await client.channels.getAll())[1];

      await client.channels.createMessage(channel.id, { content: "HI!" });
      await secondClient.channels.createMessage(channel.id, { content: "Oh hi bro!" });
      await client.channels.createMessage(channel.id, { content: "Wanna break from the ads?" });
      await secondClient.channels.createMessage(channel.id, { content: "Hmmm yea sure!" });
      await client.channels.createMessage(channel.id, { content: "THEN LETS GO" });
      await secondClient.channels.createMessage(channel.id, { content: "omw" });

      await client.channels.createMessage(secondChannel.id, { content: "Emam zaman" });
      await secondClient.channels.createMessage(secondChannel.id, { content: "Janam?" });
      await client.channels.createMessage(secondChannel.id, { content: "Be darya raftam mahi nabood :(" });
      await secondClient.channels.createMessage(secondChannel.id, { content: "Namaze sobh ra khandei?" });
      await client.channels.createMessage(secondChannel.id, { content: "Na..." });
      await secondClient.channels.createMessage(secondChannel.id, { content: "goh khordi" });
   });
});
