import { IEntity } from "../../../src/lib/app";
import block from "./block";

const entity: IEntity<{}> = [
    {}, ({ frameNum, framesSkipped, create }) => {
        if (frameNum % 10 === 0 && framesSkipped === 0) {
            create(block(Math.floor(Math.random() * 1000), 0, "green"));
            create(block(Math.floor(Math.random() * 1000), 0, "blue"));
            create(block(Math.floor(Math.random() * 1000), 0, "red"));
        }
        return {};
    },
];

export default entity;
