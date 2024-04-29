import { describe, expect, test } from "bun:test";
import { getLoggedClient } from "../test-utils";

describe("relationship-delete", () => {
   test("relationship-delete-success", async () => {
      const client = await getLoggedClient();

      const relationships = await client.users.getRelationships();

      expect(() => client.users.deleteRelationship(relationships[0].id)).not.toThrow();
   });
   test("relationship-delete-invalid-id", async () => {
      const client = await getLoggedClient();

      expect(() => client.users.deleteRelationship("invalid")).toThrow("Unknown Relationship");
   });
});
