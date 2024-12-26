//spdx-License-Identifier:MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contract/campaign.sol";

contract DeployCampaign is Script {
    function run() external {
        vm.startBroadcast();
        new Campaign();
        vm.stopBroadcast();
    }
}
