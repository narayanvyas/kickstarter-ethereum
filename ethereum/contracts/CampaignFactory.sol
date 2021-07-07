// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract CampaignFactory {
    address [] public deployedCampaigns;

    function createCampaign(uint minimumAmount, string memory name, string memory description, string memory imageUrl) public {
        address newCampaign = address(new Campaign(minimumAmount, name, description, imageUrl, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool isComplete;
        uint approvalCount;
        uint donorsCount;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint public minimumContribution;
    string campaignName;
    string campaignDescription;
    string campaignImageUrl;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint numRequests;
    uint public approversCount;

    constructor(
        uint minimumAmount,
            string memory name,
            string memory description,
            string memory imageUrl,
            address campaignCreatorAddress) {
        manager = campaignCreatorAddress;
        minimumContribution = minimumAmount;
        campaignName = name;
        campaignDescription = description;
        campaignImageUrl = imageUrl;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        uint256 idx = requests.length;
        requests.push();
        Request storage newRequest = requests[idx];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = payable(recipient);
        newRequest.isComplete = false;
        newRequest.approvalCount=0;
    }

    function approveRequest(uint requestId) public {
        Request storage currentRequest = requests[requestId];
        require(approvers[msg.sender]);
        require(!currentRequest.approvals[msg.sender]);
        currentRequest.approvals[msg.sender] = true;
        currentRequest.approvalCount++;
    }

    function finalizeRequest(uint requestId) public restricted {
        Request storage currentRequest = requests[requestId];
        require(!currentRequest.isComplete);
        require(currentRequest.approvalCount >= (approversCount / 2));
        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.isComplete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return(
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}   