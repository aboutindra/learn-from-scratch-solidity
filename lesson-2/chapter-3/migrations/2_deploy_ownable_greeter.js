const OwnableGreeterContract = artifacts.require("OwnableGreeter");

module.exports = function(deployer) {
    deployer.deploy(OwnableGreeterContract);
}
