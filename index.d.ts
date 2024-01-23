import { APIPostLoginJSONBody, APIPostRegisterJSONBody, APIDMChannel, APIGroupDMChannel } from "@shared/api-types";
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

type LoginCredentials = APIPostLoginJSONBody;
type RegisterUser = APIPostRegisterJSONBody;
type DirectChannel = APIDMChannel | APIGroupDMChannel;
