import { EditUserStatus, ErrorStatus, IEditUser, IResult } from "$shared/types";
import { HOSTNAME } from "..";
import { isResult } from "../utils";

export async function editUser(
   editInformation: IEditUser,
   token: string
): Promise<IResult<EditUserStatus | ErrorStatus>> {
   const editResponse = await fetch(HOSTNAME + "/account/edit", {
      method: "PATCH",
      body: JSON.stringify(editInformation),
      headers: {
         Authorization: `Bearer ${token}`,
         Accept: "application/json",
         "Content-Type": "application/json",
      },
   });

   const result: unknown = await editResponse.json();

   if (isResult<IResult<EditUserStatus>>(result)) {
      return result;
   }

   throw new Error("Delete user did not return a EditUserStatus");
}
