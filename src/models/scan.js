import {observable, extendObservable} from "mobx";
import {snake2Camel} from "../utils";
import {omit} from "lodash";
import client from "../client";
import {API} from "../config";
import {isPlainObject} from "lodash";

class Scan {
  @observable id:int;
  @observable nodeId:int;
  @observable createdAt:Date;

  constructor(id, scan) {
    this.nodeId = id;

    const camelScan = snake2Camel(scan);
    extendObservable(this, omit(camelScan, ["createdAt", "data"]));
    this.createdAt = new Date(camelScan.createdAt);
    this.data = camelScan.data;
  }
}

export default Scan;
