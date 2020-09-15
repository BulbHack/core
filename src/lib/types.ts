export type Entity<T> = [initialState: T, iterateFunction: IterateFunction<T>];

export type IterateFunction<T> = (params: {
  state: Readonly<T>;
  create: <U>(newEntity: Entity<U>) => ChildEntity<U>;
  die: () => void;
  receive: (channel: string) => unknown[];
  send: (channel: string, message: any) => void;
  frameNum: number;
  framesSkipped: number;
}) => T;

export type DebugHook = (
  step: (frameNum: number, framesSkipped: number) => void,
  frameNum: number,
  timeStart: number,
  containers: Container[],
  messages: Messages
) => void;
export interface ChildEntity<T> {
  isAlive: () => boolean;
  kill: () => void;
  getState: () => Readonly<T>;
}
export interface Messages {
  [channel: string]: unknown[];
}
export interface Container {
  alive: boolean;
  state: any;
  iterate: IterateFunction<any>;
}

export const FPS60 = 16;
