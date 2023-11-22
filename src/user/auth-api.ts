import {
   APIPostLoginJSONBody,
   APIPostLoginResult,
   APIPostRegisterJSONBody,
   APIPostRegisterResult,
} from "$shared/api-types";
import { Routes } from "$shared/routes";
import { REST } from "../rest/rest";

export class AuthAPI {
   private readonly rest: REST;

   public constructor(rest: REST) {
      this.rest = rest;
   }

   public async login(body: APIPostLoginJSONBody) {
      return this.rest.post(Routes.login(), { body }) as Promise<APIPostLoginResult>;
   }

   public async register(body: APIPostRegisterJSONBody) {
      return this.rest.post(Routes.register(), { body }) as Promise<APIPostRegisterResult>;
   }
}
