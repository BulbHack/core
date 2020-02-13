import { IEntity, IterateFunction } from "./lib/app";

interface IPositionState {
    x: number;
    y: number;
}

const falls = <T>(target: IEntity<IPositionState & T>): IEntity<IPositionState & T> => {
    const [targetInitialState, iterate] = target;
    const newIterate: IterateFunction<IPositionState & T> = (...args) => {
        const targetState = iterate(...args);
        return {
            ...targetState,
            x: targetState.x,
            y: targetState.y - 1,
        };
    };
    return [targetInitialState, newIterate];
};

const entity = (): IEntity<{ name: string } & IPositionState> => {
    const iterate: IterateFunction<{ name: string } & IPositionState> = (state) => {
        return state;
    };
    return [{ name: "hello", x: 0, y: 0 }, iterate];
};

export default falls(entity());
