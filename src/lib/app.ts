import {
  Entity,
  DebugHook,
  FPS60,
  Container,
  Messages,
  ChildEntity,
} from "./types";

export {
  Entity,
  DebugHook,
  FPS60,
  ChildEntity,
  IterateFunction,
} from "./types";

export { createMod, createEntity } from "./factories";
export { getDebugHook } from "./debugHook";

export const startLoop = (
  firstEntity: Entity<any>,
  renderers: Array<(state: unknown[]) => void>,
  options?: {
    debugHook?: DebugHook;
    timePerFrame?: number;
  }
) => {
  const timePerFrame = options?.timePerFrame ?? FPS60;
  const hook: DebugHook = options?.debugHook ?? defaultHook;

  let newContainers: Container[] = [];
  let messages: Messages = {};
  let newMessages: Messages = {};
  const [initialState, initialIterate] = firstEntity;
  let containers: Container[] = [
    { alive: true, state: initialState, iterate: initialIterate },
  ];

  const create = <U>(newEntity: Entity<U>): ChildEntity<U> => {
    const [newState, newIterate] = newEntity;
    const newContainer = { alive: true, state: newState, iterate: newIterate };
    newContainers.push(newContainer);
    return {
      isAlive: () => newContainer.alive,
      kill: () => {
        newContainer.alive = false;
      },
      getState: () => newContainer.state,
    };
  };

  const send = (channel: string, newMessage: unknown) => {
    let chMessages = newMessages[channel];
    if (chMessages === undefined) {
      newMessages[channel] = chMessages = [];
    }
    chMessages.push(newMessage);
  };

  const receive = (channel: string): unknown[] => {
    return messages[channel] ?? [];
  };

  const step = (frameNum: number, framesSkipped: number) => {
    const timeStart = new Date().getTime();
    containers.forEach((container) => {
      const die = () => {
        container.alive = false;
      };
      container.state = container.iterate({
        state: container.state,
        create,
        die,
        receive,
        send,
        frameNum,
        framesSkipped,
      });
    });
    containers = [...containers.filter((i) => i.alive), ...newContainers];
    newContainers = [];
    messages = newMessages;
    newMessages = {};
    renderers.forEach((renderer) => renderer(containers.map((i) => i.state)));
    [containers, messages] = hook(
      callStep,
      frameNum,
      timeStart,
      timePerFrame,
      containers,
      messages
    );
  };

  const callStep = (delay: number, frameNum: number, framesSkipped = 0) => {
    window.setTimeout(step, delay, frameNum, framesSkipped);
  };

  [containers, messages] = hook(
    callStep,
    -1,
    new Date().getTime(),
    timePerFrame,
    containers,
    messages
  );
  console.log("started");
};

const defaultHook: DebugHook = (
  step,
  lastFramNum,
  timeStart,
  timePerFrame,
  containers,
  messages
) => {
  const timeElapsed = new Date().getTime() - timeStart;
  const [wait, skipped] =
    timePerFrame > timeElapsed
      ? [timePerFrame - timeElapsed, 0]
      : [0, Math.floor(timeElapsed / timePerFrame)];
  step(wait, lastFramNum + 1, skipped);
  return [containers, messages];
};
