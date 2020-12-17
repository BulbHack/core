import { getDebugHook, startLoop } from "../../src/lib/app";
import blockGenerator from "./entities/blockGenerator";
import defaultRenderer from "./renderers/defaultRenderer";

const docStyle = document.body.style;
docStyle.margin = "0";
docStyle.overflow = "hidden";
docStyle.display = "grid";
docStyle.placeContent = "center";
docStyle.height = "100vh";
const root = document.createElement("canvas");
if (window.innerHeight > window.innerWidth) {
  root.width = window.innerWidth;
  root.height = window.innerWidth;
} else {
  root.width = window.innerHeight;
  root.height = window.innerHeight;
}
let timeHandle = 0;
window.onresize = () => {
  window.clearTimeout(timeHandle);
  timeHandle = window.setTimeout(() => {
    if (window.innerHeight > window.innerWidth) {
      root.width = window.innerWidth;
      root.height = window.innerWidth;
    } else {
      root.width = window.innerHeight;
      root.height = window.innerHeight;
    }
  }, 100);
};

document.body.appendChild(root);

const [controller, debugHook] = getDebugHook();
startLoop(blockGenerator, [defaultRenderer(root)], { debugHook });

window.onclick = ()=>{
  controller.next();
}

