const OwnerGreeterByDeployerContract = artifacts.require("OwnerGreeterByDeployer");

module.exports = function(deployer) {
    deployer.deploy(OwnerGreeterByDeployerContract);
}
