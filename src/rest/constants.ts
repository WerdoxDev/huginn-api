import { RESTOptions, ResponseLike } from "$shared/rest-types";
// import { STATUS_CODES } from "https";

export const DefaultRestOptions = {
   api: "http://localhost:3000",
   authPrefix: "Bearer",
   async makeRequest(...args): Promise<ResponseLike> {
      return defaultMakeRequest(...args);
   },
} as const satisfies Required<RESTOptions>;

async function defaultMakeRequest(url: string, init: RequestInit): Promise<ResponseLike> {
   const response = await fetch(url, init);

   return {
      body: response.body,
      async arrayBuffer() {
         return response.arrayBuffer();
      },
      async json() {
         return response.json();
      },
      async text() {
         return response.text();
      },
      get bodyUsed() {
         return response.bodyUsed;
      },
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      ok: response.status >= 200 && response.status < 300,
   };
}
