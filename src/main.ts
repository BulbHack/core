import app from "./lib/app";
import Block from "./block";

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
let timeHandle;
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
const ctx = root.getContext("2d");
document.body.appendChild(root);
if (ctx) {

    app(Block, [(states) => {
        ctx.clearRect(0, 0, root.width, root.height);
        states.forEach((state) => {
            ctx.fillRect(state.x, state.y, 20, 20);
        });
    }]);
}