import {
   HandlerRequestData,
   InternalRequest,
   RESTOptions,
   RequestData,
   RequestHeaders,
   RequestMethod,
   ResolvedRequest,
   ResponseLike,
} from "@shared/rest-types";
import { RouteLike } from "@shared/types";
import { HuginnErrorData } from "@shared/errors";
import { HTTPError } from "../errors/http-error";
import { HuginnAPIError } from "../errors/huginn-error";
import { parseResponse } from "../utils";
import { DefaultRestOptions } from "./constants";
import { TokenHandler } from "./token-handler";

// TODO: Implement put, patch, delete... requests
export class REST {
   public readonly options: RESTOptions;
   private tokenHandler: TokenHandler;

   public constructor(tokenHandler: TokenHandler, options: Partial<RESTOptions> = {}) {
      this.options = { ...DefaultRestOptions, ...options };

      this.tokenHandler = tokenHandler;
   }

   /**
    * Runs a GET request from the api
    *
    * @param fullRoute - The full route to query
    * @param options - Optional request options
    */
   public async get(fullRoute: RouteLike, options: RequestData = {}) {
      return this.request({ ...options, fullRoute, method: RequestMethod.GET });
   }

   /**
    * Runs a POST request from the api
    *
    * @param fullRoute - The full route to query
    * @param options - Optional request options
    */
   public async post(fullRoute: RouteLike, options: RequestData = {}) {
      return this.request({ ...options, fullRoute, method: RequestMethod.POST });
   }

   /**
    * Runs a PATCH request from the api
    *
    * @param fullRoute - The full route to query
    * @param options - Optional request options
    */
   public async patch(fullRoute: RouteLike, options: RequestData = {}) {
      return this.request({ ...options, fullRoute, method: RequestMethod.PATCH });
   }

   /**
    * Runs a request from the api
    *
    * @param options - Request options
    */
   public async request(options: InternalRequest) {
      const { url, fetchOptions } = await this.resolveRequest(options);

      const response = await this.options.makeRequest(url, fetchOptions);

      if (response.ok) return parseResponse(response);

      return this.handleErrors(response, options.method, url, fetchOptions);
   }

   /**
    * Format the request to use in a fetch
    *
    * @param request - The request data
    */
   public async resolveRequest(request: InternalRequest): Promise<ResolvedRequest> {
      let query = "";
      let finalBody: RequestInit["body"];
      let additionalHeaders: Record<string, string> = {};

      if (request.query) {
         query = `?${request.query}`;
      }

      // Required headers
      const headers: RequestHeaders = {};

      if (request.auth) {
         if (!this.tokenHandler.token) {
            throw new Error("Expected token for a request, but wasn't present");
         }

         headers.Authorization = `${request.authPrefix ?? this.options.authPrefix} ${this.tokenHandler.token}`;
      }

      if (request.reason?.length) {
         headers["X-Log-Reason"] = encodeURIComponent(request.reason);
      }

      const url = `${this.options.api}${request.fullRoute}${query}`;

      // TODO: Implement form data
      if (request.body) {
         finalBody = JSON.stringify(request.body);
         additionalHeaders = { "Content-Type": "application/json" };
      }

      const method = request.method.toUpperCase();

      const fetchOptions: RequestInit = {
         // If for some reason we pass a body to a GET or HEAD request, remove the body
         body: ["GET", "HEAD"].includes(method) ? null : finalBody,
         headers: { ...request.headers, ...headers, ...additionalHeaders },
         method,
      };

      return { url, fetchOptions };
   }

   public async handleErrors(response: ResponseLike, method: string, url: string, requestData: HandlerRequestData) {
      const status = response.status;

      if (status >= 500 && status < 600) {
         throw new HTTPError(status, response.statusText, method, url, requestData);
      }

      if (status >= 400 && status < 500) {
         // If we receive this status code, it means the token is not valid.
         if (status === 401 && requestData.auth) {
            this.tokenHandler.token = null!;
         }

         const data = (await parseResponse(response)) as HuginnErrorData;
         // throw the API error

         throw new HuginnAPIError(data, data.code, status, method, url, requestData);
      }

      return response;
   }
}
