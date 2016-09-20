import {observable} from "mobx";
import client from "../client";

import Node from "../models/node";

class Nodes {
  @observable nodes;
  constructor() {
    this.nodes = observable([]);
  }

  async populate() {
    const res = await client.get("nodes.json");

    if (res.ok) {
      // Clear out nodes, we're loading a whole new list anyways
      this.nodes = observable([]);
      const populatePromises = res.body.map(async (node) => {
        const newNode = new Node(node);
        this.nodes.push(observable(newNode));
        return newNode.populate();
      });

      await Promise.all(populatePromises);
    }
  }

  ids() {
    return this.nodes.map((node) => {
      return node.id;
    });
  }
}

export default new Nodes();
