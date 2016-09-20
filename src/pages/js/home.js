import Home from "../monk/home.monk";
import sessionStore from "../../stores/session";
import {autorun} from "mobx";

export default class extends Home {
  constructor() {
    super();
    // Probably store-related init stuff happens here
    this.state = {
      hasSession: false,
    };

    // Tell mobx to update when a store we're listening to changes
    this.unbind = autorun(() => {
      this.state.hasSession = sessionStore.hasSession;
      this.update(this.state);
    });

    // Render with our fresh store values
    this.update(this.state);
  }

  onRemove() {
    super.onRemove();
    this.unbind();
  }
}
