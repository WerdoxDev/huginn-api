import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("relationship-get", () => {
   test("relationships-get-all-user", async () => {
      const client = await getLoggedClient();

      const relationships = await client.users.getRelationships();

      expect(relationships).toBeDefined();
      expect(relationships.length).toBeGreaterThan(0);
   });
   test("relationship-get-by-id-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.getRelationship("invalid")).toThrow("Unknown Relationship");
   });
   test("relationship-get-by-id-successful", async () => {
      const client = await getLoggedClient();
      const relationships = await client.users.getRelationships();

      const relationship = await client.users.getRelationship(relationships[0].id);
      expect(relationship).toBeDefined();
   });
});
