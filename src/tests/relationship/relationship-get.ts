import { describe, expect, test } from "bun:test";
import { getLoggedClient, test2Credentials } from "../test-utils";

describe("relationship-get", () => {
   test("relationship-get-by-id-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.getRelationship("invalid")).toThrow("Invalid Form Body"); // Invalid id
      expect(() => client.users.getRelationship("000000000000000000")).toThrow("Unknown Relationship"); // Unknown id
   });
   test("relationships-get-all-user", async () => {
      const client = await getLoggedClient();

      const relationships = await client.users.getRelationships();

      expect(relationships).toBeDefined();
      expect(relationships.length).toBeGreaterThan(0);
   });
   test("relationship-get-by-id-successful", async () => {
      const client = await getLoggedClient();
      const client2 = await getLoggedClient(test2Credentials);

      const relationship = await client.users.getRelationship(client2.user!.id);
      expect(relationship).toBeDefined();
   });
});
