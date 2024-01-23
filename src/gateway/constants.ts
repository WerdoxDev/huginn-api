import { GatewayOptions } from "../..";

export const DefaultGatewayOptions: Required<GatewayOptions> = {
   url: "ws://localhost:3000/gateway",
   createSocket(_url) {
      console.error("createSocket function is not implemented. Please implement it using your own way");
      return {} as WebSocket;
   },
} as const;
