import { HuginnClient } from "..";
import { decodeToken } from "../utils";

export class TokenHandler {
   private token?: string;
   private refreshToken?: string;
   private tokenTimeout?: Timer;

   private readonly client: HuginnClient;

   public constructor(client: HuginnClient) {
      this.client = client;
   }

   /**
    * Returns the authorization token as a readonly string
    */
   public getToken(): Readonly<string | undefined> {
      return this.token;
   }

   /**
    * Returns the refresh token as a readonly string
    */
   public getRefreshToken(): Readonly<string | undefined> {
      return this.refreshToken;
   }

   /**
    * Sets the authorization tokens used by auth requests
    *
    * @param token - The authorization token to use
    */
   public setToken(token: string) {
      this.token = token;

      const [isValid, payload] = decodeToken(token);

      if (!isValid || !payload) {
         return;
      }

      const date1 = new Date();
      const date2 = new Date((payload.exp || 0) * 1000);
      const diffTime = date2.getTime() - date1.getTime();

      this.startRefreshTimeout(diffTime - 5000);
   }

   /**
    * Sets the refresh token used to get new tokens when they expire
    *
    * @param refreshToken - The refresh token to later get new authorization token with
    */
   public setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
   }

   private startRefreshTimeout(time: number) {
      if (this.tokenTimeout != null) {
         clearTimeout(this.tokenTimeout);
      }

      this.tokenTimeout = setTimeout(() => {
         // does api call
      }, time);
   }
}
