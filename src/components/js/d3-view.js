import D3View from "../monk/d3-view.monk";
import {uniqueId} from "lodash";
import {autobind} from "core-decorators";

export default class extends D3View {
  constructor() {
    super();
  }

  @autobind
  d3Setup(state, id="view") {
    if (document.getElementById(id) != null) {
      this.tree = d3.select(`#${id}`).append("svg")
      .chart("tree.radial")
      .radius((d) => d.size ? Math.log(d.size) : 3)
      .zoomable([0.1, 3])
      .collapsible(1)

      this.tree.draw(state.data);
    }
  }

  update(state) {
    super.update(state)
    if (this.tree != null) {
      this.tree.draw(state.data);
    } else {
      this.d3Setup(state || {});
    }
  }
};
