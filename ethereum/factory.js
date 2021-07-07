import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = '0x72A3ee07AA742124d04B09f6083d7e7f6b54cf96';

const abi = CampaignFactory.abi;

export default new web3.eth.Contract(abi, address);