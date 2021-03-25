import { isBlockState } from "../entities/block";

export default (root: HTMLCanvasElement) => {
    const ctx = root.getContext("2d");
    if (ctx !== null) {
        return (states: any[]) => {
            ctx.clearRect(0, 0, root.width, root.height);
            states.forEach((state) => {
                if (isBlockState(state)) {
                    ctx.fillStyle = state.colorName;
                    ctx.fillRect(state.x, state.y, 10, 10);
                }
            });
        };
    } else {
        throw new Error("cannot get context");
    }
};
