import "../styles/main.scss";

import Monkberry from "monkberry";
import directives from "monkberry-directives";
import Index from "./index.monk";

let view;

document.addEventListener("DOMContentLoaded", (event) => {
  view = Monkberry.render(Index, document.getElementById("monkberry-root"), {directives});
  view.update({});
});
