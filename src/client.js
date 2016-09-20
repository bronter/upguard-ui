import {createClient} from "fetch-plus";
import plusJson from "fetch-plus-json";
import {API} from "./config";
const client = createClient(API);

// Add JSON headers and response transformer.
client.addMiddleware((request) => {
  // request.options.headers["Accept"] = "application/json";
  // request.options.headers["Content-Type"] = "application/json; charset=utf-8";

  if (typeof request.options.body === "object") {
    request.options.body = JSON.stringify(request.options.body);
  }

  return (response) => {
    return new Promise((resolve) => {
      response.json().then((json) => {
        let headers = {};
        for (let pair of response.headers.entries()) {
          headers[pair[0]] = pair[1];
        }
        const ret = {
          headers,
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          type: response.type,
          url: response.url,
          body: json,
        };

        resolve(ret);
      });
    });
  }
});

export default client;
