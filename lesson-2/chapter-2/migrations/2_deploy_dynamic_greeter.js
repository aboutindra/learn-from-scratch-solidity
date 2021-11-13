const DynamicGreeterContract = artifacts.require("DynamicGreeter");

module.exports = function(deployer) {
    deployer.deploy(DynamicGreeterContract);
}
