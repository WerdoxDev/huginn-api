import { ResponseLike } from "@shared/rest-types";

type ClientOptions = {
   // TODO: Actually implement intents
   intents: number;
   rest?: Partial<RESTOptions>;
   gateway?: Partial<GatewayOptions>;
};

type RESTOptions = {
   api: string;
   authPrefix: "Bearer";
   makeRequest(url: string, init: RequestInit): Promise<ResponseLike>;
};

type GatewayOptions = {
   url: string;
   createSocket(url: string): WebSocket;
};
