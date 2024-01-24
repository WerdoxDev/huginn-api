import { GatewayHeartbeat, GatewayHello, GatewayIdentify, GatewayOperations } from "@shared/gateway-types";
import { HuginnClient } from "..";
import { DefaultGatewayOptions } from "./constants";
import { isDispatchOpcode, isHelloOpcode } from "./gateway-utils";
import { GatewayOptions } from "../..";
import EventEmitter from "eventemitter3";

export class Gateway extends EventEmitter {
   public readonly options: GatewayOptions;
   private readonly client: HuginnClient;

   private socket?: WebSocket;
   private heartbeatInterval?: Timer;
   private sequence: number | null;

   public constructor(client: HuginnClient, options: Partial<GatewayOptions> = {}) {
      super();

      this.options = { ...DefaultGatewayOptions, ...options };
      this.client = client;

      this.sequence = null;
   }

   public connect() {
      if (!this.client.isLoggedIn) {
         console.error("Trying to connect gateway before client initialization!");
         return;
      }

      this.socket = this.options.createSocket(this.options.url);
      this.sequence = null;

      this.startListening();
   }

   startListening() {
      this.socket?.addEventListener("open", (_e) => {
         console.log("Gateway Connected!");
      });

      this.socket?.addEventListener("close", (e) => {
         console.log(`Gateway Closed with code: ${e.code}`);
         this.stopHeartbeat();
      });

      this.socket?.addEventListener("message", (e) => {
         if (typeof e.data !== "string") {
            console.error("Non string messages are not yet supported");
            return;
         }

         const data = JSON.parse(e.data);

         if (isHelloOpcode(data)) {
            this.handleHello(data);
         } else if (isDispatchOpcode(data)) {
            this.emit(data.t, data.d);
         }
      });
   }

   private handleHello(data: GatewayHello) {
      this.startHeartbeat(data.d.heartbeatInterval);

      const identifyData: GatewayIdentify = {
         op: GatewayOperations.IDENTIFY,
         d: {
            token: this.client.tokenHandler.token!,
            intents: this.client.options.intents,
            properties: { os: "windows", browser: "idk", device: "idk" },
         },
      };

      this.send(identifyData);
   }

   private startHeartbeat(interval: number) {
      this.heartbeatInterval = setInterval(() => {
         const data: GatewayHeartbeat = { op: GatewayOperations.HEARTBEAT, d: this.sequence };
         this.send(data);
      }, interval);
   }

   private stopHeartbeat() {
      clearInterval(this.heartbeatInterval);
   }

   private send(data: unknown) {
      this.socket?.send(JSON.stringify(data));
   }
}
