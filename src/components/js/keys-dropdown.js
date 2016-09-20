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
  handleChangeForServiceAPIKey(event) {
    delete this.state.errors["serviceAPIKey"];
    this.state.serviceAPIKey = event.target.value;
  }

  @autobind
  handleChangeForSecretKey(event) {
    delete this.state.errors["secretKey"];
    this.state.secretKey = event.target.value;
  }

  @autobind
  onSubmit() {
    const serviceAPIKey = this.state.serviceAPIKey;
    const secretKey = this.state.secretKey;

    if (serviceAPIKey === "") {
      this.state.errors[serviceAPIKey] = true;
    }
    if (secretKey === "") {
      this.state.errors[secretKey] = true;
    }

    if (Object.keys(this.state.errors).length === 0) {
      sessionStore.setKeys(serviceAPIKey, secretKey);
    }
  }
}
