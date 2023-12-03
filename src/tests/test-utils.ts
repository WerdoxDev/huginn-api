import { LoginCredentials } from "@shared/client-types";
import { HuginnClient } from "..";

export async function getLoggedClient() {
   const client = new HuginnClient();

   const credentials: LoginCredentials = {
      username: "test",
      email: "test@gmail.com",
      password: "test",
   };

   await client.login(credentials);

   return client;
}
