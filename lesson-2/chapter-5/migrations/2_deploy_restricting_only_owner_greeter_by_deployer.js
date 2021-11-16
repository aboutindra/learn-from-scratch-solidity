const OwnerGreeterByDeployerContract = artifacts.require("RestrictingOnlyOwnerGreeterByDeployer");

module.exports = function(deployer) {
    deployer.deploy(OwnerGreeterByDeployerContract);
}
