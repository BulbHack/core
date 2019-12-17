import { buildEntity } from "./app";

interface IPhysics {
    target: number;
    action: string;
}

function isPhysics(message: any): message is IPhysics {
    return message.type === "physics";
}

export default (color: string): IEntity => {
    return buildEntity({
        name: Math.floor(Math.random() * 1000),
        x: Math.floor(Math.random() * 1000),
        y: 0,
        velx: 0,
        vely: 0,
        accx: 0,
        accy: 1,
        color,
    }, (state, messStore, _create, die) => {
        if (state.y > 1000) {
            die();
        }
        let newForces = {
            velx: state.velx,
            vely: state.vely,
            accx: state.accx,
            accy: state.accy,
        };
        messStore.sendMessage({ type: "block", name: state.name, x: state.x, y: state.y });
        messStore.getMessages()
            .filter(isPhysics)
            .filter((mess) => mess.target === state.name)
            .forEach((mess) => {
                if (mess.action === "bump" && mess.vely > 0) {
                    newForces = {

                    };
                }
            });
        return {
            ...state,
            x: state.x + state.velx,
            y: state.y + state.vely,
            velx: state.velx + state.accx,
            vely: state.vely + state.accy,
        };
    }, (ctx, state) => {
        ctx.fillStyle = state.color;
        ctx.fillRect(state.x, state.y, 30, 30);
    });
};
