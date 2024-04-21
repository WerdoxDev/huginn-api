import { describe, expect, test, beforeAll } from "bun:test";
import { getLoggedClient, url } from "../test-utils";

beforeAll(async () => {
   fetch(`http://${url}/test/test-relationships`, { method: "POST" });
});

describe("relationship-create", () => {
   test("relationship-create-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.createRelationship({} as { username: string })).toThrow("Invalid Form Body");
   });
   test("relationship-create-empty-username", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.createRelationship({ username: "" })).toThrow("Invalid Form Body");
   });
   test("relationship-create-self-request", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.createRelationship({ username: "test" })).toThrow();
   });
   test("relationship-create-successful", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.createRelationship({ username: "test2" })).not.toThrow();
   });
});
