import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "./test-utils";

describe("auth-token", () => {
   test("auth-refresh-token", async () => {
      const client = await getLoggedClient();

      expect(client.tokenHandler.getToken()).toBeDefined();
   });
});
