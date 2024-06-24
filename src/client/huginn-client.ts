import { APIUser, LoginCredentials, RegisterUser, Tokens } from "@shared/api-types";
import { ClientOptions } from "../..";
import { AuthAPI } from "../apis/auth-api";
import { ChannelAPI } from "../apis/channel-api";
import { CommonAPI } from "../apis/common-api";
import { UserAPI } from "../apis/user-api";
import { Gateway } from "../gateway/client-gateway";
import { REST } from "../rest/rest";
import { TokenHandler } from "../rest/token-handler";
import { createDefaultClientOptions } from "../utils";
import { snowflake } from "@shared/snowflake";

export class HuginnClient {
   public readonly options: ClientOptions;
   private rest: REST;
   public tokenHandler: TokenHandler;
   public users: UserAPI;
   public auth: AuthAPI;
   public channels: ChannelAPI;
   public common: CommonAPI;
   public gateway: Gateway;

   public user?: APIUser;

   constructor(options?: Partial<ClientOptions>) {
      const defaultOptions = createDefaultClientOptions();

      this.options = {
         ...defaultOptions,
         ...options,
      };

      this.tokenHandler = new TokenHandler(this);
      this.rest = new REST(this, this.options.rest);

      this.users = new UserAPI(this.rest);
      this.auth = new AuthAPI(this.rest);
      this.channels = new ChannelAPI(this.rest);
      this.common = new CommonAPI(this.rest);
      this.gateway = new Gateway(this, this.options.gateway);
   }

   async initializeWithToken(tokens: Partial<Tokens>) {
      try {
         if (tokens.token) {
            this.tokenHandler.token = tokens.token;

            this.user = await this.users.getCurrent();
         } else if (tokens.refreshToken) {
            const newTokens = await this.auth.refreshToken({ refreshToken: tokens.refreshToken });
            this.tokenHandler.refreshToken = newTokens.refreshToken;
            this.tokenHandler.token = newTokens.token;

            this.user = await this.users.getCurrent();
         }
      } catch (e) {
         this.user = undefined;
         this.tokenHandler.token = null!;
         this.tokenHandler.refreshToken = null!;

         throw e;
      }
   }

   public async login(credentials: LoginCredentials) {
      const result = await this.auth.login(credentials);

      this.user = { ...result };
      this.tokenHandler.token = result.token;
      this.tokenHandler.refreshToken = result.refreshToken;
   }

   public async register(user: RegisterUser) {
      const result = await this.auth.register(user);

      this.user = { ...result };
      this.tokenHandler.token = result.token;
      this.tokenHandler.refreshToken = result.refreshToken;
   }

   public async logout() {
      await this.auth.logout();

      this.tokenHandler.token = null!;
      this.user = undefined;
      this.gateway.close();
   }

   public get isLoggedIn() {
      return this.user !== undefined;
   }

   public generateNonce() {
      const nonce = snowflake.generateString();
      return nonce;
   }
}
