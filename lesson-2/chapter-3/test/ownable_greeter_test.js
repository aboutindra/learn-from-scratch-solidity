const OwnableGreeterContract = artifacts.require("OwnableGreeter");

contract("OwnableGreeter", () => {
    it("Contract Sukses di Deploy", async () => {
        const greeter = await OwnableGreeterContract.deployed();
        assert(greeter, "contract success to deploy")
    })

    describe("ownableGreeter()", () => {
        it("Menampilkan hasil Hello World!", async () => {
            const greeter = await OwnableGreeterContract.deployed();
            const expected = "Hello World!";
            const actual = await greeter.ownableGreeter();

            assert.equal(actual, expected)
        });
    })

    describe("owner()", () => {
        it("Menampilkan hasil address pemilik", async () => {
            const greeter = await OwnableGreeterContract.deployed();
            const owner = await greeter.owner();

            assert(owner, "Address pemilik saat ini")
        });
    })


})

contract("OwnableGreeter: update greeting", () => {
    describe("setOwnableGreeter(string)", () => {
        it("Menampilkan hasil sesuai input parameter", async () => {
            const greeter = await OwnableGreeterContract.deployed();
            const expected = "Halo Dunia!";

            await greeter.setOwnableGreeter(expected);
            const actual = await greeter.ownableGreeter();

            assert.equal(actual, expected)
        });
    })
})
