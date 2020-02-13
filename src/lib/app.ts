export type IEntity<T> = [T, IterateFunction<T>];

export type IterateFunction<T> = (
    state: T,
    create: (newEntity: IEntity<any>) => void,
    die: () => void,
    messages: any[],
    send: (message: any) => void,
    frameNum: number,
    framesSkipped: number,
) => T;

interface IContainer {
    alive: boolean;
    state: any;
    iterate: IterateFunction<any>;
}

export const FPS60 = 16;

export default (
    firstEntity: IEntity<any>,
    renderers: Array<(state: any[]) => void>,
    timePerFrame: number = FPS60,
) => {
    const [initialState, initialIterate] = firstEntity;
    let containers: IContainer[] = [{ alive: true, state: initialState, iterate: initialIterate }];
    let newContainers: IContainer[] = [];
    let messages: any[] = [];
    let newMessages: any[] = [];
    const create = (newEntity: IEntity<any>) => {
        const [newState, newIterate] = newEntity;
        newContainers.push({ alive: true, state: newState, iterate: newIterate });
    };
    const send = (newMessage: any) => {
        newMessages.push(newMessage);
    };
    const frame = (frameNum: number, framesSkipped: number) => {
        const timeStart = new Date().getTime();
        containers.forEach((container) => {
            const die = () => {
                container.alive = false;
            };
            container.state = container.iterate(
                container.state, create, die, messages, send, frameNum, framesSkipped,
            );
        });
        containers = [...containers.filter((i) => i.alive), ...newContainers];
        newContainers = [];
        messages = newMessages;
        newMessages = [];
        renderers.forEach((renderer) => renderer(containers.map((i) => i.state)));
        const timeElapsed = new Date().getTime() - timeStart;
        setTimeout(
            frame,
            Math.floor(timeElapsed % timePerFrame),
            [frameNum + 1, Math.floor(timeElapsed / timePerFrame)],
        );
    };
    frame(1, 0);
};
