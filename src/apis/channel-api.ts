import {
   APIDeleteRemoveDMResult,
   APIGetChannelByIdResult,
   APIGetChannelMessagesResult,
   APIGetMessageByIdResult,
   APIGetUserChannelsResult,
   APIPostCreateDMJSONBody,
   APIPostCreateDMResult,
   APIPostCreateDefaultMessageJSONBody,
   APIPostCreateDefaultMessageResult,
} from "@shared/api-types";
import { Routes } from "@shared/routes";
import { Snowflake } from "@shared/snowflake";
import { REST } from "../rest/rest";

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

   public async getMessage(channelId: Snowflake, messageId: Snowflake) {
      return this.rest.get(Routes.channelMessage(channelId, messageId), { auth: true }) as Promise<APIGetMessageByIdResult>;
   }

   public async getMessages(channelId: Snowflake, limit?: number) {
      return this.rest.get(Routes.channelMessages(channelId), {
         auth: true,
         query: new URLSearchParams({ limit: limit?.toString() || "" }),
      }) as Promise<APIGetChannelMessagesResult>;
   }

   public async createDm(body: APIPostCreateDMJSONBody) {
      return this.rest.post(Routes.userChannels(), { body, auth: true }) as Promise<APIPostCreateDMResult>;
   }

   public async removeDm(channelId: Snowflake) {
      return this.rest.delete(Routes.channel(channelId), { auth: true }) as Promise<APIDeleteRemoveDMResult>;
   }

   public async createMessage(channelId: Snowflake, body: APIPostCreateDefaultMessageJSONBody) {
      return this.rest.post(Routes.channelMessages(channelId), { body, auth: true }) as Promise<APIPostCreateDefaultMessageResult>;
   }

   public async typing(channelId: Snowflake) {
      return this.rest.post(Routes.channelTyping(channelId), { auth: true });
   }
}
