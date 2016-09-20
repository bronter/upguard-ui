import KeysDropdown from "../monk/keys-dropdown.monk";
import sessionStore from "../../stores/session";
import directives from "monkberry-directives";
import {autobind} from "core-decorators";

export default class extends KeysDropdown {
  constructor() {
    super();

    this.state = {
      serviceAPIKey: "",
      secretKey: "",
      errors: {},
    };

    this.directives = directives;
  }

  @autobind
  onSubmit() {
    if (Object.keys(this.state.errors).length === 0) {
      sessionStore.setKeys("no", "keyslol");
    }
  }
}
