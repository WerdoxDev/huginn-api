import { IGetUserResult } from "shared/lib/types";
import { HOSTNAME } from "..";
import { isResult } from "../utils";

export async function getUser(token: string): Promise<IGetUserResult> {
   const getUserResponse = await fetch(HOSTNAME + "/account/get-user", {
      method: "PATCH",
      headers: {
         Authorization: `Bearer ${token}`,
         Accept: "application/json",
         "Content-Type": "application/json",
      },
   });

   const result: unknown = await getUserResponse.json();

   if (isResult<IGetUserResult>(result)) {
      return result;
   }

   throw new Error("Delete user did not return a IGetUserResult");
}
