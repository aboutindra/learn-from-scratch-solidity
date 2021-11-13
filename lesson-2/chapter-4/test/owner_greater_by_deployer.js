const OwnerGreeterByDeployerContract = artifacts.require("OwnerGreeterByDeployer");

contract("OwnerGreeterByDeployer", (accounts) => {
    it("Contract Sukses di Deploy", async () => {
        const greeter = await OwnerGreeterByDeployerContract.deployed();
        assert(greeter, "contract success to deploy")
    })

    describe("ownableGreeter()", () => {
        it("Menampilkan hasil Hello World!", async () => {
            const greeter = await OwnerGreeterByDeployerContract.deployed();
            const expected = "Hello World!";
            const actual = await greeter.ownableGreeter();

            assert.equal(actual, expected)
        });
    })

    describe("owner()", () => {
        it("Menampilkan hasil address pemilik", async () => {
            const greeter = await OwnerGreeterByDeployerContract.deployed();
            const owner = await greeter.owner();

            assert(owner, "Address pemilik saat ini")
        });

        it("Address pemilik sesuai dengan Address deployer", async () => {
            const greeter = await OwnerGreeterByDeployerContract.deployed();
            const owner = await greeter.owner();
            const expected = accounts[0];

            assert.equal(owner, expected, "Address pemilik sesuai dengan Address deployer")
        })
    })
})

contract("OwnableGreeter: update greeting", () => {
    describe("setOwnableGreeter(string)", () => {
        it("Menampilkan hasil sesuai input parameter", async () => {
            const greeter = await OwnerGreeterByDeployerContract.deployed();
            const expected = "Halo Dunia!";

            await greeter.setOwnableGreeter(expected);
            const actual = await greeter.ownableGreeter();

            assert.equal(actual, expected)
        });
    })
})
