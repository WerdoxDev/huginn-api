import { ClientOptions, LoginCredentials, RegisterUser } from "@shared/client-types";
import { createDefaultClientOptions } from "../utils";
import { REST } from "../rest/rest";
import { APIUser } from "@shared/api-types";
import { UserAPI } from "../user/users-api";
import { AuthAPI } from "../user/auth-api";
import { CommonAPI } from "../user/common-api";

export class HuginnClient {
   public readonly options: ClientOptions;
   private rest: REST;
   public users: UserAPI;
   public auth: AuthAPI;
   public common: CommonAPI;

   private token?: string;
   private refreshToken?: string;
   public user?: APIUser;

   constructor(options?: ClientOptions) {
      const defaultOptions = createDefaultClientOptions();

      this.options = {
         ...defaultOptions,
         ...options,
      };

      this.rest = new REST(this.options.rest);

      this.users = new UserAPI(this.rest);
      this.auth = new AuthAPI(this.rest);
      this.common = new CommonAPI(this.rest);
   }

   async login(credentials: LoginCredentials) {
      const result = await this.auth.login(credentials);

      this.user = { ...result };
      this.token = result.token;
      this.refreshToken = result.refreshToken;
   }

   async register(user: RegisterUser) {
      const result = await this.auth.register(user);

      this.user = { ...result };
      this.token = result.token;
      this.refreshToken = result.refreshToken;
   }
}
