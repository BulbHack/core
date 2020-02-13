import { IEntity, IterateFunction } from "../../../src/lib/app";
import { IPositionState } from "../states/states";

const falls = <T>(target: IEntity<IPositionState & T>): IEntity<IPositionState & T> => {
    const [targetInitialState, iterate] = target;
    const fallSpeed = Math.random() * 2 + 2;
    const newIterate: IterateFunction<IPositionState & T> = (args) => {
        const { die, state } = args;
        if (state.y > 1000) {
            die();
        }
        const targetState = iterate(args);
        return {
            ...targetState,
            x: targetState.x,
            y: targetState.y + fallSpeed,
        };
    };
    return [targetInitialState, newIterate];
};

export default falls;
