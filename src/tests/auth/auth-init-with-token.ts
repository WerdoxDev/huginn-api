import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";
import { HuginnClient } from "../..";

describe("auth-init-with-token", () => {
   test("auth-init-with-token-successful", async () => {
      const client = await getLoggedClient();

      const accessToken = client.tokenHandler.token;

      const newClient = new HuginnClient();
      await newClient.initializeWithToken({ token: accessToken });

      expect(newClient.user).toBeDefined();
   });

   test("auth-init-with-refresh-token-successful", async () => {
      const client = await getLoggedClient();

      const refreshToken = client.tokenHandler.refreshToken;

      const newClient = new HuginnClient();
      await newClient.initializeWithToken({ refreshToken: refreshToken });

      expect(newClient.user).toBeDefined();
   });
});
