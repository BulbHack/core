import { Entity, IterateFunction } from "./app";

export const createMod = <R, A = {}>({
  initialState,
  beforeIter,
  afterIter,
}: {
  initialState: A;
  beforeIter?: IterateFunction<R & A>;
  afterIter?: IterateFunction<R & A>;
}) => {
  return <T>(target: Entity<R & T>): Entity<R & T & A> => {
    const [targetInitialState, targetIterator] = target;
    const comboIterator: IterateFunction<R & T & A> = (args) => {
      if (beforeIter !== undefined) {
        args.state = { ...args.state, ...beforeIter(args) };
      }
      args.state = { ...args.state, ...targetIterator(args) };
      if (afterIter !== undefined) {
        args.state = { ...args.state, ...afterIter(args) };
      }
      return args.state;
    };
    return [{ ...targetInitialState, ...initialState }, comboIterator];
  };
};

export const createEntity = <R>(
  initialState: R,
  iter?: IterateFunction<R>
): Entity<R> => {
  const outIter: IterateFunction<R> = iter ?? (({ state }) => state);
  return [initialState, outIter];
};
