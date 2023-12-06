import { describe, expect, test } from "bun:test";
import { editCredentials, getLoggedClient } from "./test-utils";
import { APIPatchCurrentUserJSONBody } from "@shared/api-types";

describe("user-patch-current", () => {
   test("user-patch-current-password-incorrect", async () => {
      const client = await getLoggedClient();

      const edit: APIPatchCurrentUserJSONBody = {
         displayName: "test2",
         email: "test2@gmail.com",
         username: "test2",
         avatar: "test2-avatar",
         newPassword: "test2",
         password: "test-incorrect",
      };

      expect(() => client.users.edit(edit)).toThrow();
   });
   test("user-patch-current-invalid-username-displayName", async () => {
      const client = await getLoggedClient();

      const edit: APIPatchCurrentUserJSONBody = {
         displayName: "t",
         email: "test2@gmail.com",
         username: "t",
         avatar: "test2-avatar",
         newPassword: "test2",
         password: "test",
      };

      expect(() => client.users.edit(edit)).toThrow();
   });
   test("user-patch-current-invalid-email", async () => {
      const client = await getLoggedClient();

      const edit: APIPatchCurrentUserJSONBody = {
         displayName: "test2",
         email: "invalid",
         username: "test2",
         avatar: "test2-avatar",
         newPassword: "test2",
         password: "test",
      };

      expect(() => client.users.edit(edit)).toThrow();
   });
   test("user-patch-current-successful", async () => {
      const client = await getLoggedClient();

      const result = await client.users.edit({
         displayName: "test2",
         email: "test2@gmail.com",
         username: "test2",
         avatar: "test2-avatar",
         newPassword: "test2",
         password: "test",
      });

      expect(result).toBeDefined();
   });
   test("user-patch-current-single-field-successful", async () => {
      const client = await getLoggedClient(editCredentials);

      const result = await client.users.edit({
         email: "test3@gmail.com",
      });

      expect(result.email).toBe("test3@gmail.com");
   });
   test("user-patch-current-revert-successful", async () => {
      const client = await getLoggedClient(editCredentials);

      const result = await client.users.edit({
         displayName: "test",
         email: "test@gmail.com",
         username: "test",
         avatar: "test-avatar",
         newPassword: "test",
         password: "test2",
      });

      expect(result).toBeDefined();
   });
});
