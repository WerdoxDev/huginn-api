import { DeleteUserStatus, ErrorStatus, IResult } from "$shared/types";
import { HOSTNAME } from "..";
import { isResult } from "../utils";

export async function deleteUser(token: string): Promise<IResult<DeleteUserStatus | ErrorStatus>> {
   const deleteResponse = await fetch(HOSTNAME + "/account/delete", {
      method: "DELETE",
      headers: {
         Authorization: `Bearer ${token}`,
         Accept: "application/json",
         "Content-Type": "application/json",
      },
   });

   const result: unknown = await deleteResponse.json();

   if (isResult<IResult<DeleteUserStatus>>(result)) {
      return result;
   }

   throw new Error("Delete user did not return a DeleteUserStatus");
}
