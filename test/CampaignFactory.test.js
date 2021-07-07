const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider({ gasLimit: 800000000 }));

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "8000000" });

  await factory.methods.createCampaign('100').send({from: accounts[0], gas: '1000000'});
 
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  
  campaign = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress
  )
  
});
describe("Campaign Factory Contract", () => {
  it("deploys a contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async() => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  })

  it('creates a request', async() => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    console.log(request);
  })
});
