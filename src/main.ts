import app from "./lib/app";
import buildBlockGenerator from "./lib/blockGenerator";

const docstyle = document.body.style;
docstyle.margin = "0";
docstyle.overflow = "hidden";
docstyle.display = "grid";
docstyle.placeContent = "center";
docstyle.height = "100vh";
const root = document.createElement("canvas");
if (window.innerHeight > window.innerWidth) {
    root.width = window.innerWidth;
    root.height = window.innerWidth;
} else {
    root.width = window.innerHeight;
    root.height = window.innerHeight;
}
let timeHandle: NodeJS.Timeout;
window.onresize = () => {
    clearTimeout(timeHandle);
    timeHandle = setTimeout(() => {
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
app(buildBlockGenerator(root), root);
