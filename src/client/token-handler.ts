export class TokenHandler {
   public accessToken: string = "";
   public refreshToken: string = "";

   public setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
   }
}
