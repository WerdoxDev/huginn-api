import { ClientOptions, LoginCredentials, RegisterUser } from "@shared/client-types";
import { createDefaultClientOptions } from "../utils";
import { REST } from "../rest/rest";
import { APIUser } from "@shared/api-types";
import { UserAPI } from "../user/users-api";
import { AuthAPI } from "../user/auth-api";
import { CommonAPI } from "../user/common-api";
import { TokenHandler } from "../rest/token-handler";

export class HuginnClient {
   public readonly options: ClientOptions;
   private rest: REST;
   public tokenHandler: TokenHandler;
   public users: UserAPI;
   public auth: AuthAPI;
   public common: CommonAPI;

   public user?: APIUser;

   constructor(options?: ClientOptions) {
      const defaultOptions = createDefaultClientOptions();

      this.options = {
         ...defaultOptions,
         ...options,
      };

      this.tokenHandler = new TokenHandler(this);
      this.rest = new REST(this.tokenHandler, this.options.rest);

      this.users = new UserAPI(this.rest);
      this.auth = new AuthAPI(this.rest);
      this.common = new CommonAPI(this.rest);
   }

   async login(credentials: LoginCredentials) {
      const result = await this.auth.login(credentials);

      this.user = { ...result };
      this.tokenHandler.setToken(result.token);
      this.tokenHandler.setRefreshToken(result.refreshToken);
   }

   async register(user: RegisterUser) {
      const result = await this.auth.register(user);

      this.user = { ...result };
      this.tokenHandler.setToken(result.token);
      this.tokenHandler.setRefreshToken(result.refreshToken);
   }
}
