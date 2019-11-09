import { buildEntity } from "./app";
import buildBlock from "./fallingBlock";
import controller from "./controller";

export default (canvas: HTMLCanvasElement): IEntity => {
    return buildEntity(
        {},
        (_state, messStore, create, _die, frame) => {
            console.log(messStore.getMessages());
            if (frame === 0) {
                create(controller(canvas));
            }
            create(buildBlock("#FF0000"));
            create(buildBlock("#00FF00"));
            create(buildBlock("#0000FF"));
            return {};
        });
};
