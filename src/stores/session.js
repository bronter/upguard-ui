import {observable} from "mobx";
import client from "../client";

class Session {
  @observable serviceAPIKey:string;
  @observable secretKey:string;
  @observable pic:string;
  @observable hasSession:bool;

  constructor() {
    this.hasSession = false;
    this.serviceAPIKey = "";
    this.secretKey = "";
    this.pic = "";
  }

  setKeys(serviceAPIKey, secretKey) {
    this.serviceAPIKey = serviceAPIKey;
    this.secretKey = secretKey;

    client.addMiddleware((request) => {
      request.options.headers["Authorization"] = `Token token="${this.serviceAPIKey}${this.secretKey}"`;

      return (response) => response;
    });

    this.hasSession = true;
  }
}

export default new Session();
