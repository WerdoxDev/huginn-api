import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("user-get-by-id", () => {
   test("user-get-by-id-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.get("")).toThrow("404");
   });
   test("user-get-by-id-successful", async () => {
      const client = await getLoggedClient();

      const result = await client.users.get(client.user?._id || "");

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty("email");
   });
});
