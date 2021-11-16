const RestrictingOnlyOwnerGreeterByDeployerContract = artifacts.require("RestrictingOnlyOwnerGreeterByDeployer");

contract("OwnerGreeterByDeployer", (accounts) => {
    it("Contract Sukses di Deploy", async () => {
        const greeter = await RestrictingOnlyOwnerGreeterByDeployerContract.deployed();
        assert(greeter, "contract success to deploy")
    })

    describe("ownableGreeter()", () => {
        it("Menampilkan hasil Hello World!", async () => {
            const greeter = await RestrictingOnlyOwnerGreeterByDeployerContract.deployed();
            const expected = "Hello World!";
            const actual = await greeter.ownableGreeter();

            assert.equal(actual, expected)
        });
    })

    describe("owner()", () => {
        it("Menampilkan hasil address pemilik", async () => {
            const greeter = await RestrictingOnlyOwnerGreeterByDeployerContract.deployed();
            const owner = await greeter.owner();

            assert(owner, "Address pemilik saat ini")
        });

        it("Address pemilik sesuai dengan Address deployer", async () => {
            const greeter = await RestrictingOnlyOwnerGreeterByDeployerContract.deployed();
            const owner = await greeter.owner();
            const expected = accounts[0];

            assert.equal(owner, expected, "Address pemilik sesuai dengan Address deployer")
        })
    })
})

contract("Greeter: update greeting", (accounts) => {
    describe("setGreeting(string)", () => {
        describe("when message is sent by the owner", () => {
            it("sets greeting to passed in string", async () => {
                const greeter = await RestrictingOnlyOwnerGreeterByDeployerContract.deployed()
                const expected = "The owner changed the message";

                await greeter.setOwnableGreeter(expected);
                const actual = await greeter.ownableGreeter();

                assert.equal(actual, expected, "greeting was not updated");
            });
        });

        describe("when message is sent by another account", () => {
            it("does not set the greeting", async () => {
                try {
                    const greeter = await RestrictingOnlyOwnerGreeterByDeployerContract.deployed()
                    await greeter.setOwnableGreeter("Not the owner", {from: accounts[5]});
                } catch (err) {
                    const errorMessage = "Ownable: caller is not the owner"
                    assert.equal(err.reason, errorMessage, "greeting should not update");
                    return;
                }
                assert(false, "greeting should not update");
            });
        });
    });
});
