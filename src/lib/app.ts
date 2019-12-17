
export default async (firstEntity: IEntity, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("cannot get context");
    }
    let messages: any[] = [];
    let nextMessages: any[] = [];
    let entities: IEntity[] = [firstEntity];
    const messageStore: IMessageStore = {
        getMessages: () => {
            return messages;
        },
        sendMessage: (mess) => {
            nextMessages.push(mess);
        },
    };
    let skippedFrames = 0;
    let frameNumber = 0;

    while (entities.length > 0) {
        const startTime = Date.now();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        entities = iterateEntities(entities, messageStore, frameNumber, skippedFrames);
        renderEntities(entities, ctx, canvas.width, canvas.height);
        messages = nextMessages;
        nextMessages = [];
        skippedFrames = await pause(startTime, 11);
        if (skippedFrames > 0) {
            console.log("skipped");
        }
        frameNumber = frameNumber + 1 + skippedFrames;
    }

};

export function buildEntity<T>(
    initialState: T,
    iterateFunction?: IterateFunction<T>,
    renderFunction?: RenderFunction<T>,
): IEntity<T> {
    return {
        dead: false,
        state: initialState,
        iterate: iterateFunction ?? ((state) => state),
        render: renderFunction ?? (() => { return; }),
    };
}

const pause = async (startTime: number, interval: number) => new Promise<number>((res) => {
    let wait = interval - (Date.now() - startTime);
    let skipped = 0;
    while (wait < 1) {
        wait += interval;
        skipped++;
    }
    setTimeout(() => res(skipped), wait);
});

const iterateEntities = (
    currEntities: IEntity[],
    messageStore: IMessageStore,
    frameNumber: number,
    skippedFrames: number,
): IEntity[] => {
    const newEntities: IEntity[] = [];
    const createEntity = (newEntity: IEntity) => {
        newEntities.push(newEntity);
    };
    const updatedEntites = currEntities
        .map<IEntity>((entity) => {
            let dead = false;
            const die = () => { dead = true; };
            const newState = entity.iterate(
                entity.state,
                messageStore,
                createEntity,
                die,
                frameNumber,
                skippedFrames);
            return {
                dead,
                state: newState,
                iterate: entity.iterate,
                render: entity.render,
            };
        })
        .filter((entity) => !entity.dead);
    return [...updatedEntites, ...newEntities];
};

const renderEntities = (currEntities: IEntity[], ctx: CanvasRenderingContext2D, width: number, height: number) => {
    currEntities.forEach((entity) => {
        entity.render(ctx, entity.state, width, height);
    });
};
