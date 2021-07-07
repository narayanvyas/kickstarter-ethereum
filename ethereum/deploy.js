const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const campaignFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  "sister argue awake atom raccoon judge pig kick pear gasp earn fly",
  // remember to change this to your own phrase!
  "https://rinkeby.infura.io/v3/68cda400740645f79a35d7fedd77c5fe"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  const balance = await web3.eth.getBalance(accounts[0]);


  const result = await new web3.eth.Contract(campaignFactory.abi)
    .deploy({ data: campaignFactory.evm.bytecode.object })
    .send({ gas: "10000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();
