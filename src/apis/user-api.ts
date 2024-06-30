import {
   APIGetCurrentUserResult,
   APIGetUserRelationshipByIdResult,
   APIGetUserRelationshipsResult,
   APIGetUserResult,
   APIPatchCurrentUserJSONBody,
   APIPatchCurrentUserResult,
   APIPostRelationshipJSONBody,
} from "@shared/api-types";
import { Routes } from "@shared/routes";
import { Snowflake } from "@shared/snowflake";
import { REST } from "../rest/rest";

export class UserAPI {
   private readonly rest: REST;

   public constructor(rest: REST) {
      this.rest = rest;
   }

   public async get(userId: Snowflake) {
      return this.rest.get(Routes.user(userId), { auth: true }) as Promise<APIGetUserResult>;
   }

   public async getCurrent() {
      return this.rest.get(Routes.user("@me"), { auth: true }) as Promise<APIGetCurrentUserResult>;
   }

   public async edit(body: APIPatchCurrentUserJSONBody) {
      return this.rest.patch(Routes.user("@me"), { body, auth: true }) as Promise<APIPatchCurrentUserResult>;
   }

   public async createRelationship(body: APIPostRelationshipJSONBody) {
      return this.rest.post(Routes.userRelationships(), { body, auth: true });
   }

   public async createRelationshipByUserId(userId: Snowflake) {
      return this.rest.put(Routes.userRelationship(userId), { auth: true });
   }

   public async getRelationships() {
      return this.rest.get(Routes.userRelationships(), { auth: true }) as Promise<APIGetUserRelationshipsResult>;
   }

   public async getRelationship(userId: Snowflake) {
      return this.rest.get(Routes.userRelationship(userId), { auth: true }) as Promise<APIGetUserRelationshipByIdResult>;
   }

   public async deleteRelationship(userId: Snowflake) {
      return this.rest.delete(Routes.userRelationship(userId), { auth: true });
   }
}
