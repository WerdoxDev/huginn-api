import { GatewayHello, GatewayOperations } from "@shared/gateway-types";
import { checkOpcode } from "@shared/utility";

export function isHelloOpcode(data: unknown): data is GatewayHello {
   return checkOpcode(data, GatewayOperations.HELLO);
}
