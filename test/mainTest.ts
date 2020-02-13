// tslint:disable: no-unused-expression
import { expect } from "chai";
import app from "../src/lib/app";
import Block from "../src/block";

describe("Tests", () => {
    it("Should have tests", () => {
        app(Block, [(state) => {
            console.log(state);
        }]);
        expect(true).to.be.true;
    });
});
