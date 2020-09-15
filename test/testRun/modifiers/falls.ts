import { createMod, Entity } from "../../../src/lib/app";
import { IPositionState } from "../states/states";

const falls = <T>(target: Entity<IPositionState & T>) => {
  const fallSpeed = Math.floor(Math.random() * 2 + 8);
  const mod = createMod<IPositionState, { isFalling: boolean }>(
    { isFalling: true },
    (param) => {
      let falling = true;
      if (param.state.y > 2000) {
        param.die();
        falling = false;
      }
      return {
        ...param.state,
        y: param.state.y + fallSpeed,
        isFalling: falling,
      };
    },
    (param) => param.state
  );
  return mod(target);
};


export default falls;
