describe("Tests", () => {
  it("Should have tests", () => {
    console.log("before func");
    foo();
    console.log("after func");
  });
});

const foo = async () => {
  console.log("in func");
};
