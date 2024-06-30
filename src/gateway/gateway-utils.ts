import { GatewayDispatch, GatewayHello, GatewayOperations } from "@shared/gateway-types";
import { checkOpcode } from "@shared/utils";

export function isHelloOpcode(data: unknown): data is GatewayHello {
   return checkOpcode(data, GatewayOperations.HELLO);
}

export function isDispatchOpcode(data: unknown): data is GatewayDispatch {
   return checkOpcode(data, GatewayOperations.DISPATCH);
}
