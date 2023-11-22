import { describe, expect, test } from "bun:test";
import { HuginnClient } from "../client/huginn-client";
import { RegisterUser } from "$shared/client-types";

describe("auth-register", () => {
   test("auth-register-invalid-body", async () => {
      const client = new HuginnClient();
      expect(() => client.register({} as RegisterUser)).toThrow();
   });

   test("auth-register-short-username-password", async () => {
      const client = new HuginnClient();

      const user: RegisterUser = {
         username: "t",
         displayName: "test",
         email: "test@gmail.com",
         password: "t",
      };

      expect(() => client.register(user)).toThrow();
   });

   test("auth-register-successful", async () => {
      const client = new HuginnClient();

      const user: RegisterUser = {
         username: "test",
         displayName: "test",
         email: "test@gmail.com",
         password: "test",
      };

      await client.register(user);

      expect(client.user).toBeDefined();
   });

   test("auth-register-repeated-invalid", async () => {
      const client = new HuginnClient();

      const user: RegisterUser = {
         username: "test",
         displayName: "test",
         email: "test@gmail.com",
         password: "test",
      };

      expect(() => client.register(user)).toThrow();
   });
});
