import { buildEntity } from "./app";

export default (canvas: HTMLCanvasElement): IEntity => {
    const curLoc = {
        x: 0,
        y: 0,
    };
    canvas.addEventListener("mousemove", (ev) => {
        curLoc.x = ev.offsetX;
        curLoc.y = ev.offsetY;
    });
    return buildEntity(
        {
            x: 0,
            y: 0,
        },
        (state, messStore, _create, _die, _frame, _skipped) => {
            messStore.sendMessage({ type: "cursor", x: state.x, y: state.y });
            return curLoc;
        },
        (ctx, state) => {
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(state.x, state.y, 40, 40);
        });
};
