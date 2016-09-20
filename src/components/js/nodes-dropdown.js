import NodesDropdown from "../monk/nodes-dropdown.monk";
import nodesStore from "../../stores/nodes";
import diffStore from "../../stores/diff";
import {autorun} from "mobx";

export default class extends NodesDropdown {
  constructor() {
    super();

    this.state = {
      nodes: [],
      isDiffing: true,
    };

    // Tell mobx to update when a store we're listening to changes
    this.unbind = autorun(() => {
      this.state.nodes = nodesStore.nodes;
      this.state.isDiffing = diffStore.isDiffing;
      this.update(this.state);
    });

    nodesStore.populate();
  }

  onRemove() {
    super.onRemove();
    this.unbind();
  }
}
