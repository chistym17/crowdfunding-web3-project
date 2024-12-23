// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaign{

struct CamapaignDetails{
     address creator;
     uint goal;
     uint deadline;
     uint amountRaised;
     bool goalMet;
     mapping (address=>uint) contributors;


}

CamapaignDetails [] public campaigns;

function create_campaign(uint goal,uint deadline) public{

require(deadline>block.timestamp,"invalid deadline");

CamapaignDetails storage new_campaign=campaigns.push();
new_campaign.creator=msg.sender;
new_campaign.goal=goal;
new_campaign.deadline=deadline;

}

function contribute(uint campaign_id) public payable {
     CamapaignDetails storage selected_campaign=campaigns[campaign_id];
     require(block.timestamp>selected_campaign.deadline,"the campaign has ended");
     selected_campaign.contributors[msg.sender]+=msg.value;
     selected_campaign.amountRaised+=msg.value;


}

function withdraw(uint campaign_id) public {
     CamapaignDetails storage selected_campaign=campaigns[campaign_id];
     require(msg.sender==selected_campaign.creator,"only the owner can withdraw");
     require(block.timestamp<selected_campaign.deadline,"campaign is still active");
     require(selected_campaign.amountRaised>=selected_campaign.goal,"goal not met");

     selected_campaign.goalMet=true;
     payable(selected_campaign.creator).transfer(selected_campaign.amountRaised);

}

function refund(uint campaign_id) public {
     CamapaignDetails storage selected_campaign=campaigns[campaign_id];
     require(block.timestamp>selected_campaign.deadline,"campaign is still active");
     require(selected_campaign.amountRaised<selected_campaign.goal,"goal met");

     payable(selected_campaign.creator).transfer(selected_campaign.amountRaised);

     uint amount=selected_campaign.contributors[msg.sender];
     selected_campaign.contributors[msg.sender]=0;
     payable (msg.sender).transfer(amount);

}




}