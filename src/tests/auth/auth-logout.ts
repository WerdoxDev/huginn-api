import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("auth-logout", () => {
   test("auth-logout-success", async () => {
      const client = await getLoggedClient();

      const token = client.tokenHandler.token;

      await client.auth.logout();

      expect(() => client.initializeWithToken({ token })).toThrow();
   });
});
