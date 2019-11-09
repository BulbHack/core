interface IMessageStore {
    getMessages: () => any[];
    sendMessage: (mess: any) => void;
}

interface IEntity<T = any> {
    dead: boolean;
    state: T;
    render: RenderFunction<T>;
    iterate: IterateFunction<T>;
}

type IterateFunction<T = any> = (
    state: T,
    messageStore: IMessageStore,
    createEntity: (newEntity: IEntity) => void,
    die: () => void,
    frameNumber: number,
    skippedFrames: number,
) => T;

type RenderFunction<T = any> = (
    ctx: CanvasRenderingContext2D,
    state: T,
    width: number,
    height: number,
) => void;
