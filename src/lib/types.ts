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
  step: (delay: number, frameNum: number, framesSkipped: number) => void,
  frameNum: number,
  timeStart: number,
  timePerFrame: number,
  containers: Container[],
  messages: Messages
) => [Container[], Messages];
export interface ChildEntity<T> {
  isAlive: () => boolean;
  kill: () => void;
  getState: () => Readonly<T>;
}
export interface Messages {
  [channel: string]: unknown[] | undefined;
}
export interface Container {
  alive: boolean;
  state: any;
  iterate: IterateFunction<any>;
}

export const FPS60 = 16;

export type StepFunction = (
  delay: number,
  frameNum: number,
  framesSkipped: number
) => void;

export interface DebugController {
  next: (waitTime?: number) => Promise<void>;
}
