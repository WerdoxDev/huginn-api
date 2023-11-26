import { ClientOptions } from "@shared/client-types";
import { ResponseLike } from "@shared/rest-types";
import * as jose from "jose";
import { DefaultRestOptions } from "./rest/constants";
import { TokenPayload } from "@shared/types";

export async function parseResponse(response: ResponseLike): Promise<unknown> {
   if (response.headers.get("Content-Type")?.startsWith("application/json")) {
      return response.json();
   }

   return response.arrayBuffer();
}

export function decodeToken(token: string): [boolean, (TokenPayload & jose.JWTPayload) | null] {
   try {
      const jwt = jose.decodeJwt<TokenPayload>(token);

      return [true, jwt];
   } catch (e) {
      return [false, null];
   }
}

export function createDefaultClientOptions(): ClientOptions {
   return {
      rest: { ...DefaultRestOptions },
      intents: "",
   };
}
