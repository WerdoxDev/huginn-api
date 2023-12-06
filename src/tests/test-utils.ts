import { LoginCredentials } from "@shared/client-types";
import { HuginnClient } from "..";

export const testCredentials: LoginCredentials = {
   username: "test",
   email: "test@gmail.com",
   password: "test",
};

export const editCredentials: LoginCredentials = {
   username: "test2",
   email: "test2@gmail.com",
   password: "test2",
};

export async function getLoggedClient(credentials: LoginCredentials = testCredentials) {
   const client = new HuginnClient();

   await client.login(credentials);

   return client;
}
