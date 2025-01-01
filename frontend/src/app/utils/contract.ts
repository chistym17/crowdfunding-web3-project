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

export const initContract = async () => {
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
  create_campaign: (
    goal: bigint,
    deadline: bigint
  ) => Promise<ethers.ContractTransaction>;
  
  contribute: (
    campaign_id: number,
    overrides: { value: bigint }
  ) => Promise<ethers.ContractTransaction>;
  
  campaigns: (
    id: number
  ) => Promise<[string, bigint, bigint, bigint, boolean]>;
  
  withdraw: (
    campaign_id: number
  ) => Promise<ethers.ContractTransaction>;
  
  refund: (
    campaign_id: number
  ) => Promise<ethers.ContractTransaction>;
}; 