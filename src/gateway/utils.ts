import { GatewayHello, GatewayOperations } from "@shared/gateway-types";

export function isHelloOpcode(data: unknown): data is GatewayHello {
   if (data && typeof data === "object") {
      return "op" in data && data.op === GatewayOperations.HELLO;
   }

   return false;
}
