import { ethers, Contract } from "ethers";
import { contractABI } from "./contractABI";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

if (!contractAddress) {
  throw new Error("Contract address not found in environment variables");
}

const provider = new ethers.BrowserProvider(window.ethereum);
let contract: Contract;

const initContract = async () => {
  const signer = await provider.getSigner();
  contract = new ethers.Contract(
    contractAddress, 
    contractABI.flat(),
    signer
  );
  return contract;
};

export const getContract = () => {
  if (!contract) {
    throw new Error("Contract not initialized");
  }
  return contract;
};

export type CrowdfundingContract = Contract & {
  createCampaign: (title: string, description: string, goal: bigint) => Promise<ethers.ContractTransaction>;
  contribute: (campaignId: number) => Promise<ethers.ContractTransaction>;
}; 