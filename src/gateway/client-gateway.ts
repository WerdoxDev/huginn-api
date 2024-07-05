/* eslint-disable @typescript-eslint/unbound-method */
import { GatewayEvents, GatewayHeartbeat, GatewayHello, GatewayIdentify, GatewayOperations } from "@shared/gateway-types";
import EventEmitter from "eventemitter3";
import { HuginnClient } from "..";
import { GatewayOptions } from "../types";
import { DefaultGatewayOptions } from "./constants";
import { isDispatchOpcode, isHelloOpcode } from "./gateway-utils";

export class Gateway {
   public readonly options: GatewayOptions;
   private readonly client: HuginnClient;
   private emitter = new EventEmitter();

   private socket?: WebSocket;
   private heartbeatInterval?: ReturnType<typeof setTimeout>;
   private sequence: number | null;

   private emit<EventName extends keyof GatewayEvents>(eventName: EventName, eventArg: GatewayEvents[EventName]): void {
      this.emitter.emit(eventName, eventArg);
   }

   on<EventName extends keyof GatewayEvents>(eventName: EventName, handler: (eventArg: GatewayEvents[EventName]) => void): void {
      this.emitter.on(eventName, handler);
   }

   off<EventName extends keyof GatewayEvents>(eventName: EventName, handler: (eventArg: GatewayEvents[EventName]) => void): void {
      this.emitter.off(eventName, handler);
   }

   public constructor(client: HuginnClient, options: Partial<GatewayOptions> = {}) {
      this.options = { ...DefaultGatewayOptions, ...options };
      this.client = client;

      this.sequence = null;
   }

   public connect(): void {
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
      if (this.options.log) {
         console.log("Gateway Connected!");
      }
   }

   private onClose(e: CloseEvent) {
      if (this.options.log) {
         console.log(`Gateway Closed with code: ${e.code}`);
      }
      this.stopHeartbeat();
      this.emit("close", e.code);
   }

   private onMessage(e: MessageEvent) {
      if (typeof e.data !== "string") {
         console.error("Non string messages are not yet supported");
         return;
      }

      const data = JSON.parse(e.data);

      if (isHelloOpcode(data)) {
         if (this.options.identify) {
            this.handleHello(data);
         } else {
            this.emit("hello", data.d);
         }
      } else if (isDispatchOpcode(data)) {
         this.emit(data.t, data.d);
      }
   }

   public close(): void {
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
         if (this.options.log) {
            console.log("Sending Heartbeat");
         }
         this.send(data);
      }, interval);
   }

   private stopHeartbeat() {
      clearInterval(this.heartbeatInterval);
   }

   public send(data: unknown): void {
      this.socket?.send(JSON.stringify(data));
   }
}
