import { Snowflake } from "@shared/types";
import { REST } from "../rest/rest";
import { Routes } from "@shared/routes";
import {
   APIGetChannelByIdResult,
   APIGetUserChannelsResult,
   APIPostCreateDMJsonBody,
   APIPostCreateDMResult,
} from "@shared/api-types";

export class ChannelAPI {
   private readonly rest: REST;

   public constructor(rest: REST) {
      this.rest = rest;
   }

   public async get(channelId: Snowflake) {
      return this.rest.get(Routes.channel(channelId), { auth: true }) as Promise<APIGetChannelByIdResult>;
   }

   public async getAll() {
      return this.rest.get(Routes.userChannels(), { auth: true }) as Promise<APIGetUserChannelsResult>;
   }

   public async createDm(body: APIPostCreateDMJsonBody) {
      return this.rest.post(Routes.userChannels(), { body, auth: true }) as Promise<APIPostCreateDMResult>;
   }

   public async typing(channelId: Snowflake) {
      return this.rest.post(Routes.channelTyping(channelId), { auth: true });
   }
}
