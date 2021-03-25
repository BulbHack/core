import { DebugController, DebugHook, FPS60, StepFunction } from "./types";
import { EventEmitter } from "events";

export const getDebugHook = (): [DebugController, DebugHook] => {
  const events = new EventEmitter();
  let nextStep: StepFunction;
  let running = false;
  let paused = false;
  let nextCalled = false;
  let lastFrameNum = -1;
  let waitTime = FPS60;

  const hook: DebugHook = (
    step,
    frameNum,
    _timeStart,
    _timePerFrame,
    containers,
    messages
  ) => {
    lastFrameNum = frameNum;
    nextStep = step;
    if (running) {
      nextStep(waitTime, lastFrameNum + 1, 0);
    }else{
      events.emit("paused");
    }
    return [containers, messages];
  };

  const controller = {
    start: (newWaitTime: number = FPS60) => {
      waitTime = newWaitTime;
      running = true;
      controller.next();
    },
    pause: () => new Promise<void>(()=>{
      running = false;
    }),
    next: (waitTime: number = 0) =>
      new Promise<void>((res) => {
        if (nextCalled) {
          res();
          return;
        } else {
          nextCalled = true;
        }
        const callNextStep = () => {
          paused = false;
          nextCalled = false;
          nextStep(waitTime, lastFrameNum + 1, 0);
          res();
        };
        if (paused) {
          callNextStep();
        } else {
          events.once("paused", () => {
            callNextStep();
          });
        }
      }),
    prev: () => {},
    getState: () => {},
    getMessages: () => {},
  };

  return [controller, hook];
};
