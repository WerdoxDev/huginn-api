import { LoginCredentials } from "@shared/client-types";
import { HuginnClient } from "..";

export const testCredentials: LoginCredentials = {
   username: "test",
   email: "test@gmail.com",
   password: "test",
};

export const test2Credentials: LoginCredentials = {
   username: "test2",
   email: "test2@gmail.com",
   password: "test2",
};

export const test3Credentials: LoginCredentials = {
   username: "test3",
   email: "test3@gmail.com",
   password: "test3",
};

export const editCredentials: LoginCredentials = {
   username: "test-edited",
   email: "test.edited@gmail.com",
   password: "test-edited",
};

export async function getLoggedClient(credentials: LoginCredentials = testCredentials) {
   const client = new HuginnClient();

   await client.login(credentials);

   return client;
}
