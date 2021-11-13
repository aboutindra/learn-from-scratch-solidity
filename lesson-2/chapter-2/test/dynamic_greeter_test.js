const DynamicGreeterContract = artifacts.require("DynamicGreeter");

contract("DynamicGreeter", () => {
    it("Contract Sukses di Deploy", async () => {
        const greeter = await DynamicGreeterContract.deployed();
        assert(greeter, "contract success to deploy")
    })

    describe("dynamicGreeter()", () => {
        it("Menampilkan hasil Hello World!", async () => {
            const greeter = await DynamicGreeterContract.deployed();
            const expected = "Hello World!";
            const actual = await greeter.dynamicGreeter();

            assert.equal(actual, expected)
        });
    })
})

contract("DynamicGreeter: update greeting", () => {
    describe("setDynamicGreeter(string)", () => {
        it("Menampilkan hasil sesuai input parameter", async () => {
            const greeter = await DynamicGreeterContract.deployed();
            const expected = "Halo Dunia!";

            await greeter.setDynamicGreeter(expected);
            const actual = await greeter.dynamicGreeter();

            assert.equal(actual, expected)
        });
    })
})
