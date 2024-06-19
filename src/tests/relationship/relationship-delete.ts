import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("relationship-delete", () => {
   test("relationship-delete-invalid", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.deleteRelationship("invalid")).toThrow("Invalid Form Body"); // Invalid id
      expect(() => client.users.deleteRelationship("000000000000000000")).toThrow("Unknown Relationship"); // Unknown id
   });
   test("relationship-delete-success", async () => {
      const client = await getLoggedClient();

      const relationships = await client.users.getRelationships();

      expect(() => client.users.deleteRelationship(relationships[0].user.id)).not.toThrow();
   });
});
