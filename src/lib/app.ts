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

export const startLoop = (
  firstEntity: Entity<any>,
  renderers: Array<(state: any[]) => void>,
  options?: {
    debugHook?: DebugHook;
    timePerFrame?: number;
  }
) => {
  const timePerFrame = options?.timePerFrame ?? FPS60;
  const hook: DebugHook =
    options?.debugHook ??
    ((step, frameNum, timeStart) => {
      const timeElapsed = new Date().getTime() - timeStart;
      const wait = timePerFrame > timeElapsed ? timePerFrame - timeElapsed : 0;
      const skipped =
        timePerFrame > timeElapsed ? 0 : Math.floor(timeElapsed / timePerFrame);
      if (skipped !== 0) {
        console.log("skipped frame");
      }
      window.setTimeout(step, wait, frameNum + 1, skipped);
    });

  const [initialState, initialIterate] = firstEntity;
  let containers: Container[] = [
    { alive: true, state: initialState, iterate: initialIterate },
  ];
  let newContainers: Container[] = [];
  let messages: Messages = {};
  let newMessages: Messages = {};
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
    if (newMessages[channel] === undefined) {
      newMessages[channel] = [];
    }
    newMessages[channel]?.push(newMessage);
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
    hook(step, frameNum, timeStart, containers, messages);
  };
  step(1, 0);
};
