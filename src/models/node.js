import {observable, extendObservable} from "mobx";
import {snake2Camel} from "../utils";

class Node {
  @observable id:int;
  @observable environmentId:int;
  @observable nodeType:string;
  @observable name:string;
  @observable ipAddress:string;
  @observable shortDescription:string;
  @observable operatingSystemFamilyId:int;
  @observable operatingSystemId:int;
  @observable externalId:string;
  @observable online:bool;
  @observable url:string;

  constructor(obj) {
    extendObservable(this, snake2Camel(obj));
  }

  async populate() {
    return null;
  }
}

export default Node;
