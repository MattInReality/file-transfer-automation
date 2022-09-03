import { Connection, ConnectionOptions } from "./Connection.js";
import fetch, { Headers, RequestInit } from "node-fetch";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";
import path from "path";

type requestMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class HTTPConnection implements Connection {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;

  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.baseUrl = connectionOptions.host;
    this.apiKey = connectionOptions.apiKey ?? undefined;
  }

  _open() {}

  _close() {}

  download = async (remotePath: string, to: Writable): Promise<void> => {
    //TODO: expand upon the request to add authentication properties and headers
    const endpoint = path.join(this.baseUrl, remotePath);
    const initOptions = this.createRequestInit("GET");
    const response = await fetch(endpoint, initOptions);
    if (!response.ok || response.body === null) {
      throw new Error(
        `Error downloading from remote: ${endpoint} - STATUS: ${response.status}`
      );
    }

    return pipeline(response.body, to);
  };

  upload = async (localPath: Readable, to: string): Promise<void> => {
    /*This is just a readStream of content now. It's not a multipart file transmission.
      Dependent on how the end point receives the file.
      future version will have more configuration options.
    */
    const endpoint = path.join(this.baseUrl, to);
    const initOptions = this.createRequestInit("POST", localPath);
    const response = await fetch(endpoint, initOptions);
    if (!response.ok) {
      throw new Error(
        `Error uploading to remote: ${endpoint} - STATUS: ${response.status}`
      );
    }
  };

  createRequestInit = (
    method: requestMethods = "GET",
    bodyContent: string | Readable = ""
  ) => {
    const options: RequestInit = {
      method: method.toUpperCase(),
    };
    // Body should only exist on a get method
    if (bodyContent && method !== "GET") {
      options.body = bodyContent;
    }
    //Future version needs content type.
    if (!this.apiKey) {
      return options;
    }

    //Future version will allow for both bearer and url string. For now... I'm sorry.
    const headers = new Headers();
    if (this.apiKey && this.apiKey.length > 0) {
      headers.append(
        "Authorization",
        `Bearer ${this.connectionOptions.apiKey}`
      );
    }
    options.headers = headers;
    return options;
  };
}
