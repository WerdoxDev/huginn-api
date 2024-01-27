import { describe, expect, test, beforeAll } from "bun:test";
import { HuginnClient } from "../../client/huginn-client";
import { RegisterUser } from "@shared/api-types";

beforeAll(async () => {
   await fetch("http://localhost:3000/test/test-users", { method: "POST" });
});

describe("auth-register", () => {
   test("auth-register-invalid-body", async () => {
      const client = new HuginnClient();
      expect(() => client.register({} as RegisterUser)).toThrow("Invalid Form Body");
   });

   test("auth-register-short-username-password", async () => {
      const client = new HuginnClient();

      const user: RegisterUser = {
         username: "t",
         displayName: "test",
         email: "test@gmail.com",
         password: "t",
      };

      expect(() => client.register(user)).toThrow("Invalid Form Body");
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

      expect(() => client.register(user)).toThrow("Invalid Form Body");
   });

   test("auth-register-second-successful", async () => {
      const client = new HuginnClient();

      const user: RegisterUser = {
         username: "test2",
         displayName: "test2",
         email: "test2@gmail.com",
         password: "test2",
      };

      await client.register(user);

      expect(client.user).toBeDefined();
   });

   test("auth-register-third-successful", async () => {
      const client = new HuginnClient();

      const user: RegisterUser = {
         username: "test3",
         displayName: "test3",
         email: "test3@gmail.com",
         password: "test3",
      };

      await client.register(user);

      expect(client.user).toBeDefined();
   });
});
