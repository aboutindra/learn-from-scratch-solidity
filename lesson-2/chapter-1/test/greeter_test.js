const GreeterContract = artifacts.require("Greeter");

describe("greet()", () => {
    it("Menampilkan hasil Hello World!", async () => {
        const greeter = await GreeterContract.deployed();
        const expected = "Hello World!";
        const actual = await greeter.greet();

        assert.equal(actual, expected)
    })
})
