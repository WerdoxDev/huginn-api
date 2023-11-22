import {
   CreateUserStatus,
   DeleteUserStatus,
   EditUserStatus,
   ErrorStatus,
   GetUserStatus,
   ICreateUserResult,
   IEditUser,
   IGetUserResult,
   ILoginUser,
   IRegisterUser,
   ITokenOption,
   IUser,
   IValidateUserCredentialsResult,
   UserRequestOption,
   ValidateUserCredentialsStatus,
} from "$shared/types";
import { editUser, loginUser, registerUser, getUser, deleteUser } from "../account/account-api";
import { TokenHandler } from "./token-handler";
import { isResult } from "../utils";

export class UserManager {
   private hostname: string;
   public tokenHandler: TokenHandler;

   public user?: IUser;

   private _isLoggedIn: boolean = false;

   public get isLoggedIn(): boolean {
      return this._isLoggedIn;
   }

   constructor(hostname: string) {
      this.hostname = hostname;
      this.tokenHandler = new TokenHandler();
   }

   public async login(
      options: UserRequestOption<ILoginUser, ITokenOption>
   ): Promise<ValidateUserCredentialsStatus | ErrorStatus> {
      const loginResult = await loginUser(options);

      if (isResult<Required<IValidateUserCredentialsResult>>(loginResult)) {
         if (loginResult.status === ValidateUserCredentialsStatus.SUCCESS) {
            this.tokenHandler.setTokens(loginResult.accessToken, loginResult.refreshToken);
            await this.setUserByToken();
         }
      }

      return loginResult.status;
   }

   public async register(
      options: UserRequestOption<IRegisterUser, ITokenOption>
   ): Promise<CreateUserStatus | ErrorStatus> {
      const registerResult = await registerUser(options);

      if (isResult<Required<ICreateUserResult>>(registerResult)) {
         if (registerResult.status === CreateUserStatus.SUCCESS) {
            this.tokenHandler.setTokens(registerResult.accessToken, registerResult.refreshToken);
            await this.setUserByToken();
         }
      }

      return registerResult.status;
   }

   public async edit(editInformation: IEditUser): Promise<EditUserStatus | ErrorStatus> {
      if (!this._isLoggedIn) {
         return ErrorStatus.NOT_AUTHORIZED;
      }

      const editResult = await editUser(editInformation, this.tokenHandler.accessToken);

      if (editResult.status === EditUserStatus.SUCCESS) {
         await this.setUserByToken();
      }

      return editResult.status;
   }

   public async delete(): Promise<DeleteUserStatus | ErrorStatus> {
      if (!this._isLoggedIn) {
         return ErrorStatus.NOT_AUTHORIZED;
      }

      const deleteResult = await deleteUser(this.tokenHandler.accessToken);

      return deleteResult.status;
   }

   public logout() {
      this.tokenHandler.setTokens("", "");
      this.user = undefined;
      this._isLoggedIn = false;
   }

   private async setUserByToken(): Promise<GetUserStatus | ErrorStatus> {
      if (!this.tokenHandler.accessToken) {
         return ErrorStatus.NOT_AUTHORIZED;
      }

      const getUserResult = await getUser(this.tokenHandler.accessToken);

      if (isResult<Required<IGetUserResult>>(getUserResult)) {
         if (getUserResult.status === GetUserStatus.SUCCESS) {
            this.user = getUserResult.user;
            this._isLoggedIn = true;
         }
      }

      return getUserResult.status;
   }
}
