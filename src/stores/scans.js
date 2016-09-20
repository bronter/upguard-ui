import {observable} from "mobx";
import Nodes from "./nodes";
import client from "../client";
import Scan from "../models/scan";

class Scans {
  @observable scans:array

  constructor() {
    this.scans = observable([]);
  }

  async populate() {
    if (Nodes.nodes.length > 0) {
      const requests = Nodes.nodes.map((node) => {
        const query = {
          "with_data": true,
        };

        return client.get(["nodes", node.id, "last_node_scan_details"], {
          query,
        });
      })
      const responses = await Promise.all(requests);
      let scans = []
      responses.map((res, index) => {
        if (res.ok) {
          const nodeId = Nodes.nodes[index].id;
          scans.push(new Scan(nodeId, res.body));
          this.scans = observable(scans);
        }
      });
    }
  }
}

export default new Scans();
