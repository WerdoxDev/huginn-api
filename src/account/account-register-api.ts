import { IRegisterUser, ICreateUserResult, ITokenOption, UserRequestOption } from "$shared/types";
import { HOSTNAME } from "..";
import { isResult } from "../utils";

export async function registerUser(
   options: UserRequestOption<IRegisterUser, ITokenOption>
): Promise<ICreateUserResult> {
   const registerResponse = await fetch(HOSTNAME + "/account/register", {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
      },
   });

   const result: unknown = await registerResponse.json();

   if (isResult<ICreateUserResult>(result)) {
      return result;
   }

   throw new Error("Register user did not return a ICreateUserResult");
}
