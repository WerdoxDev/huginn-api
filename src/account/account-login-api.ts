import { ILoginUser, ITokenOption, IValidateUserCredentialsResult, UserRequestOption } from "$shared/types";
import { HOSTNAME } from "..";
import { isResult } from "../utils";

export async function loginUser(
   options: UserRequestOption<ILoginUser, ITokenOption>
): Promise<IValidateUserCredentialsResult & ITokenOption> {
   const loginResponse = await fetch(HOSTNAME + "/account/login", {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
      },
   });

   const result: unknown = await loginResponse.json();

   if (isResult<IValidateUserCredentialsResult & ITokenOption>(result)) {
      return result;
   }

   throw new Error("Login user did not return a IValidateUserCredentialResult");
}
