import DiffsView from "../monk/diffs-view.monk";
import nodesStore from "../../stores/nodes.js";
import scansStore from "../../stores/scans.js";
import diffStore from "../../stores/diff.js";
import {autorun} from "mobx";

export default class extends DiffsView {
  constructor() {
    super();

    this.unbind = autorun(() => {
      nodesStore.nodes.map((node) => {
        this._thePenis = node.id;
      });
      if (nodesStore.nodes.peek().length > 0 && scansStore.scans.length === 0) {
        scansStore.populate();
      }
      if (scansStore.scans.length > 0 && (diffStore.diff === null)) {
        diffStore.populate();
      }
      this.update({
        isDiffing: diffStore.isDiffing,
        diff: diffStore.diff || {},
      });
    });
  }

  onRemove() {
    this.unbind();
  }
};
