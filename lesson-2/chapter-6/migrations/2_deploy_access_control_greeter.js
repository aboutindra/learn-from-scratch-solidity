const AccessControlGreeterContract = artifacts.require("AccessControlGreeter");

module.exports = function(deployer) {
    deployer.deploy(AccessControlGreeterContract);
}
