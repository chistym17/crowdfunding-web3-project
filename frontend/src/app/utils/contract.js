import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = JSON.parse(import.meta.env.VITE_CONTRACT_ABI);

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

export default contract;
