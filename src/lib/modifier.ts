import { Entity, IterateFunction } from "./app";

export const createMod = <R, A>(
  initialState: A,
  beforeIter: IterateFunction<R & A>,
  afterIter: IterateFunction<R & A>
) => {
  return <T>(target: Entity<R & T>): Entity<R & T & A> => {
    const [targetInitialState, targetIterator] = target;
    const comboIterator: IterateFunction<R & T & A> = (args) => {
      args.state = { ...args.state, ...beforeIter(args) };
      args.state = { ...args.state, ...targetIterator(args) };
      return { ...args.state, ...afterIter(args) };
    };
    return [{ ...targetInitialState, ...initialState }, comboIterator];
  };
};
