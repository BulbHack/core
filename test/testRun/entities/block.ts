import { IEntity, IterateFunction } from "../../../src/lib/app";
import falls from "../modifiers/falls";
import { IPositionState, IColorState, IEntityName } from "../states/states";

type IBlockState = IPositionState & IColorState & IEntityName;

const entity = (x: number, y: number, colorName: string): IEntity<IBlockState> => {
    const iterate: IterateFunction<IBlockState> = ({ state }) => state;
    return [{ x, y, colorName, entityName: "block" }, iterate];
};

export default (startX: number, startY: number, colorName: string) => falls(entity(startX, startY, colorName));

export const isBlockState = (item): item is IBlockState => item?.entityName === "block";
