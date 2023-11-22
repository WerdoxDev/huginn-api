import { describe, expect, test } from "bun:test";
import { HuginnClient } from "../client/huginn-client";
import { LoginCredentials } from "$shared/client-types";

describe("auth-login", () => {
   test("auth-login-invalid-body", async () => {
      const client = new HuginnClient();
      expect(() => client.login({} as LoginCredentials)).toThrow();
   });

   test("auth-login-with-username", async () => {
      const client = new HuginnClient();

      const user: LoginCredentials = {
         username: "test",
         password: "test",
      };

      await client.login(user);

      expect(client.user).toBeDefined();
   });

   test("auth-login-with-email", async () => {
      const client = new HuginnClient();

      const user: LoginCredentials = {
         email: "test@gmail.com",
         password: "test",
      };

      await client.login(user);

      expect(client.user).toBeDefined();
   });

   test("auth-login-successful", async () => {
      const client = new HuginnClient();

      const user: LoginCredentials = {
         username: "test",
         email: "test@gmail.com",
         password: "test",
      };

      await client.login(user);

      expect(client.user).toBeDefined();
   });
});
