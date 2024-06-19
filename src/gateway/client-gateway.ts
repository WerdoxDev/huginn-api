import { GatewayHeartbeat, GatewayHello, GatewayIdentify, GatewayOperations } from "@shared/gateway-types";
import { HuginnClient } from "..";
import { DefaultGatewayOptions } from "./constants";
import { isDispatchOpcode, isHelloOpcode } from "./gateway-utils";
import { GatewayOptions } from "../..";
import EventEmitter from "eventemitter3";
import { MessageEvent, CloseEvent, Event } from "ws";

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
         throw new Error("Trying to connect gateway before client initialization!");
      }

      this.socket = this.options.createSocket(this.options.url);
      this.sequence = null;

      this.startListening();
   }

   private startListening() {
      this.socket?.removeEventListener("open", this.onOpen);
      this.socket?.removeEventListener("close", this.onClose);
      this.socket?.removeEventListener("message", this.onMessage);

      this.socket?.addEventListener("open", this.onOpen.bind(this));

      this.socket?.addEventListener("close", this.onClose.bind(this));

      this.socket?.addEventListener("message", this.onMessage.bind(this));
   }

   private onOpen(_e: Event) {
      console.log("Gateway Connected!");
   }

   private onClose(this: Gateway, e: CloseEvent) {
      console.log(`Gateway Closed with code: ${e.code}`);
      this.stopHeartbeat();
   }

   private onMessage(e: MessageEvent) {
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
   }

   public close() {
      this.socket?.close();
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
         console.log("Sending Heartbeat");
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
